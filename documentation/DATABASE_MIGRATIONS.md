# DATABASE MIGRATIONS — Execution Instructions & Verification Status

**Document No.**: `12 / 25`  
**Version**: `1.0.0`  
**Last Updated**: November 15, 2026

---

## 1. Migration Files & Status (`1,214` Total SQL Lines)

| Order | File Path | Total Lines | Objects Created | Static Syntax & RLS Check (`npm run verify-env`) | Live PostgreSQL Execution |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **1** | [`supabase/migrations/01_initial_schema.sql`](../supabase/migrations/01_initial_schema.sql) | `326` | 3 Extensions (`uuid-ossp`, `postgis`, `pgcrypto`) + **14 Tables** + 16 Indexes | **`VERIFIED` (`PASS`)** | **`NOT VERIFIED`** (`psql`/`docker` not installed on audit host) |
| **2** | [`supabase/migrations/02_postgis_functions.sql`](../supabase/migrations/02_postgis_functions.sql) | `217` | **5 PL/pgSQL Functions** (`find_nearest_technicians`, `get_nearby_technicians`, `calculate_booking_financials`, `verify_arrival_geofence`, `release_escrow_to_technician`) | **`VERIFIED` (`PASS`)** | **`NOT VERIFIED`** (`psql`/`docker` not installed on audit host) |
| **3** | [`supabase/migrations/03_security_rbac_and_rls.sql`](../supabase/migrations/03_security_rbac_and_rls.sql) | `671` | **5 Security Tables** + **1 View** (`service_categories`) + 14 RBAC Functions (`public.current_user_role()`, `public.current_tenant_id()`, etc.) + 1 Trigger + **19/19 `ENABLE ROW LEVEL SECURITY` statements** + **47 Explicit RLS Policies** | **`VERIFIED` (`PASS` — `19/19` RLS Tables, `47` Policies)** | **`NOT VERIFIED`** (`psql`/`docker` not installed on audit host) |

---

## 2. How `npm run verify-env` Works (And Its Limitations)

Running `npm run verify-env` executes [`scripts/validate_migrations.cjs`](../scripts/validate_migrations.cjs), which:
- Strips line (`--`) and block (`/* */`) comments.
- Tracks single-quoted strings (`'...'`), escaped quotes (`''`), dollar-quoted PL/pgSQL blocks (`$$...$$`), and parenthesis depth (`(` vs. `)`).
- Asserts that at EOF `parenDepth === 0`, `inString === false`, and `inDollarQuote === false`.
- Verifies that all **19 tables** have `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` and at least one explicit `CREATE POLICY` statement (`47` policies across `19/19` tables).

> **Important Limitation**: `validate_migrations.cjs` is a static Node.js delimiter and RLS-policy validator, **not** a live PostgreSQL engine. Full runtime verification requires executing these 3 files inside the **Supabase SQL Editor** or against a live PostgreSQL 16 + PostGIS database.

---

## 3. Step-by-Step Execution in Supabase Cloud & Important Deployment Notes

1. Create a new project at [https://supabase.com/dashboard](https://supabase.com/dashboard).
2. Open **SQL Editor** → **New Query**.
3. Paste and run [`01_initial_schema.sql`](../supabase/migrations/01_initial_schema.sql) (creates 14 tables).
4. Paste and run [`02_postgis_functions.sql`](../supabase/migrations/02_postgis_functions.sql) (creates 5 spatial/escrow functions).
5. Paste and run [`03_security_rbac_and_rls.sql`](../supabase/migrations/03_security_rbac_and_rls.sql) (creates 5 security tables, 1 view, `public.*` & `auth.*` RBAC helpers, and enables RLS with 47 policies across all 19 tables).
6. Seed your organization's initial tenant row:
   ```sql
   INSERT INTO public.tenants (slug, business_name, default_currency, platform_take_rate_basis_points, is_active)
   VALUES ('primary-org', 'Your Company Name', 'USD', 1500, TRUE)
   ON CONFLICT (slug) DO NOTHING;
   ```
7. Verify all 19 tables and their RLS status in Supabase SQL Editor:
   ```sql
   SELECT tablename, rowsecurity
   FROM pg_tables
   WHERE schemaname = 'public'
   ORDER BY tablename;
   ```
   - **RLS Status**: Migration `03` enables `rowsecurity = true` and defines **47 ownership-, tenant-, and role-scoped policies** across **all 19 tables** (`tenants`, `users`, `customer_profiles`, `customer_addresses`, `provider_profiles`, `categories`, `services`, `bookings`, `payments`, `job_evidence`, `inventory_items`, `booking_parts`, `reviews`, `audit_logs`, `user_mfa_credentials`, `security_audit_logs`, `auth_rate_limits`, `password_reset_tokens`, `auth_otps`). Live multi-role runtime testing (`ADMIN`, `STAFF`, `CUSTOMER`, `TECHNICIAN`) should be executed by the Buyer in the Supabase SQL Editor (see [`SECURITY_DOCUMENTATION.md`](SECURITY_DOCUMENTATION.md)).
