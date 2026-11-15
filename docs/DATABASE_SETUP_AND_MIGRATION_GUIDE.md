# Database Setup and Migration Guide — ServicePro OS

## 1. Migration Order
All database schema, PostGIS functions, and RBAC/RLS policies live in `supabase/migrations/` and execute in strict lexicographical order:
1. [`01_initial_schema.sql`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/supabase/migrations/01_initial_schema.sql) — Core tables, extensions (`pgcrypto`, `postgis`), indexes, and constraints.
2. [`02_postgis_functions.sql`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/supabase/migrations/02_postgis_functions.sql) — Geospatial technician matching, geofence verification, and escrow calculation/release RPCs.
3. [`03_security_rbac_and_rls.sql`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/supabase/migrations/03_security_rbac_and_rls.sql) — 21-table RLS coverage, fail-closed `current_user_role()` / `current_tenant_id()`, `private.mfa_encryption_keys`, `user_mfa_credentials`, `user_mfa_sessions`, `has_verified_mfa_session()`, atomic first-Admin bootstrap, and server-side MFA RPCs.

## 2. Local PostgreSQL Setup (Docker + Supabase CLI)
1. Ensure Docker Desktop is running.
2. Start local Supabase using [`supabase/config.toml`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/supabase/config.toml):
   ```bash
   npx supabase start
   ```
3. Reset and apply all migrations cleanly:
   ```bash
   npx supabase db reset
   ```
4. Validate migration syntax & 21-table RLS coverage statically:
   ```bash
   npm run verify-env
   ```

## 3. Production / Buyer Staging Setup
1. Provision a new Supabase PostgreSQL 16 project.
2. Ensure `private` schema is **excluded** from PostgREST exposed schemas (keep `public` only).
3. Optionally configure a dedicated symmetric encryption key for TOTP secrets:
   ```sql
   ALTER DATABASE postgres SET app.settings.mfa_encryption_key = '<64-hex-char-random-key>';
   ```
   *(If unset, `get_mfa_encryption_key()` generates a 256-bit key in `private.mfa_encryption_keys`.)*
4. Apply `01_initial_schema.sql`, `02_postgis_functions.sql`, and `03_security_rbac_and_rls.sql` in order.
5. Deploy [`supabase/functions/bootstrap-first-admin/index.ts`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/supabase/functions/bootstrap-first-admin/index.ts) and set `INITIAL_ADMIN_BOOTSTRAP_SECRET` in Supabase Edge Function Secrets (never in `VITE_*` client env vars).
