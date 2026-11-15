# API DOCUMENTATION — PostGIS RPCs & Client Service Contracts

**Document No.**: `13 / 25`  
**Version**: `1.0.0`  
**Last Updated**: November 15, 2026

---

## 1. PostGIS & Financial Stored Procedures ([`02_postgis_functions.sql`](../supabase/migrations/02_postgis_functions.sql))

[`supabase/migrations/02_postgis_functions.sql`](../supabase/migrations/02_postgis_functions.sql) (`217` lines) defines **5 PL/pgSQL functions**:

### 1.1 `find_nearest_technicians` (Lines 6–58)
- **SQL Signature**:
  ```sql
  find_nearest_technicians(
      p_lat DOUBLE PRECISION,
      p_lng DOUBLE PRECISION,
      p_radius_meters INT DEFAULT 40000,
      p_trade_category VARCHAR DEFAULT NULL
  ) RETURNS TABLE (
      provider_id UUID,
      first_name VARCHAR,
      last_name VARCHAR,
      trade_category VARCHAR,
      vehicle_make_model VARCHAR,
      vehicle_plate VARCHAR,
      average_rating NUMERIC,
      reviews_count INT,
      distance_miles NUMERIC,
      estimated_eta_minutes INT,
      current_lat DOUBLE PRECISION,
      current_lng DOUBLE PRECISION
  )
  ```
- **Security Context**: `SECURITY DEFINER SET search_path = public, pg_temp`.
- **Client Caller**: [`serviceos/lib/data/datasources/supabase_remote_datasource.dart`](../serviceos/lib/data/datasources/supabase_remote_datasource.dart#L134) calls `_client!.rpc('find_nearest_technicians', params: {'p_lat': latitude, 'p_lng': longitude, 'p_radius_meters': radiusMeters})`.

### 1.2 `get_nearby_technicians` (Lines 61–87)
- **SQL Signature**: `get_nearby_technicians(user_lat DOUBLE PRECISION, user_lng DOUBLE PRECISION, radius_meters INT DEFAULT 40000)`
- **Behavior**: Mobile alias that returns `SELECT * FROM find_nearest_technicians(user_lat, user_lng, radius_meters)`.

### 1.3 `calculate_booking_financials` (Lines 90–134)
- **SQL Signature**:
  ```sql
  calculate_booking_financials(
      p_labor_cents BIGINT,
      p_parts_cents BIGINT DEFAULT 0,
      p_is_emergency BOOLEAN DEFAULT FALSE,
      p_tax_rate_basis_points INT DEFAULT 700
  ) RETURNS TABLE (
      diagnostic_fee_cents BIGINT,
      emergency_surcharge_cents BIGINT,
      subtotal_cents BIGINT,
      tax_cents BIGINT,
      platform_take_cents BIGINT,
      provider_net_cents BIGINT,
      total_authorized_cents BIGINT
  )
  ```
- **Behavior**: `IMMUTABLE` calculator adding `$20.00` (`2000` cents) diagnostic fee, optional `$49.00` (`4900` cents) emergency surcharge, `7%` sales tax, `15%` platform take rate on labor/diag/emergency, and `85%` provider net payout (`+ 100%` of parts).

### 1.4 `verify_arrival_geofence` (Lines 137–171)
- **SQL Signature**: `verify_arrival_geofence(p_booking_id UUID, p_tech_lat DOUBLE PRECISION, p_tech_lng DOUBLE PRECISION) RETURNS BOOLEAN`
- **Behavior**: Calculates `ST_Distance(v_job_location, v_tech_location)`. If `<= 250` meters, updates `bookings.status = 'ARRIVED'` and `actual_arrival_at = NOW()` and returns `TRUE`; otherwise raises a `Geofence error` exception.

### 1.5 `release_escrow_to_technician` (Lines 174–216)
- **SQL Signature**: `release_escrow_to_technician(p_booking_id UUID, p_pin_code VARCHAR) RETURNS BOOLEAN`
- **Behavior**: Verifies `bookings.safety_pin = p_pin_code`. If matched, sets `bookings.status = 'COMPLETED'`, `escrow_status = 'RELEASED_TO_PROVIDER'`, `work_completed_at = NOW()`, and increments `provider_profiles.completed_jobs_count`.

---

## 2. Web Client Supabase API ([`admin_web/src/services/supabaseClient.ts`](../admin_web/src/services/supabaseClient.ts))

| Method | Target Table / Endpoint | Behavior & Important Schema Alignment Notes |
| :--- | :--- | :--- |
| `testConnection()` | `public.categories` (`HEAD`) | Returns `{ success, message, latencyMs }`. Returns `success: false` if unconfigured. |
| `signIn(email, password)` | `auth.signInWithPassword` | Authenticates user with Supabase Auth. |
| `signUp(email, password, role, fullName)` | `auth.signUp` | Passes `role`, `first_name`, `last_name` inside `options.data` (`user_metadata`). *Note*: See [`KNOWN_ISSUES_AND_LIMITATIONS.md`](KNOWN_ISSUES_AND_LIMITATIONS.md) regarding `user_metadata` vs. `app_metadata` in `03_security_rbac_and_rls.sql`. |
| `signOut()` | `auth.signOut` | Terminates Supabase Auth session. |
| `fetchCategories()` / `saveCategory()` | `public.categories` | Fetches ordered by `priority_rank`; upserts category. *Note*: `categories.image_url` is `NOT NULL` in `01_initial_schema.sql`; see [`KNOWN_ISSUES_AND_LIMITATIONS.md`](KNOWN_ISSUES_AND_LIMITATIONS.md). |
| `fetchServices()` / `saveService()` / `deleteService()` | `public.services` | Fetches active services joined with `categories(title)`; upserts or deletes service. *Note*: `saveService()` includes `tenant_id` in its payload, whereas `public.services` links to `tenant_id` via `category_id`. |
| `fetchBookings()` / `saveBooking()` / `verifyBookingEscrow()` | `public.bookings` | Fetches bookings joined with `services` and `users`; upserts booking; updates `escrow_status = 'RELEASED_TO_PROVIDER'`. *Note*: `bookings.safety_pin` is `NOT NULL` in `01_initial_schema.sql`. |
| `saveCustomer()` / `saveTechnician()` | `public.users` | Upserts user row. *Note*: `saveTechnician()` sends `role: 'PROVIDER'`, whereas `users_role_check` in `03_security_rbac_and_rls.sql` expects `'TECHNICIAN'`. |
| `saveAuditLog()` | `public.security_audit_logs` | Inserts security audit event row (`actor_email`, `role`, `event_type`, `severity`, `ip_address`, `details`). |
| `subscribeToRealtime()` | Channel `serviceos_shared_dispatch` | Subscribes to `postgres_changes` on `public.bookings`, `public.users`, and `public.provider_profiles`. |
