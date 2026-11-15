# Buyer Security Verification Guide — ServicePro OS

This guide enables a technical buyer to independently verify ServicePro OS database security, Row-Level Security (RLS), MFA enforcement, and Supabase Auth integration using reproducible repository commands.

## 1. What Is Already Implemented
- **Pinned Supabase CLI:** `supabase@3.1.0` in root [`package.json`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/package.json) (`npx supabase`).
- **Local Supabase Configuration:** [`supabase/config.toml`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/supabase/config.toml) (PostgreSQL 16, Auth, API, Storage).
- **Database Migrations:** `01_initial_schema.sql`, `02_postgis_functions.sql`, and `03_security_rbac_and_rls.sql`.
- **pgTAP Database & RLS Suite:** [`supabase/tests/01_phase1_security_rls.sql`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/supabase/tests/01_phase1_security_rls.sql).
- **Live GoTrue + PostgREST Integration Suite:** [`scripts/test_live_supabase_auth_jwt.cjs`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/scripts/test_live_supabase_auth_jwt.cjs).
- **Single Orchestrated Verification Command:** `npm run verify:security-live` ([`scripts/verify_phase1_live_security.cjs`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/scripts/verify_phase1_live_security.cjs)), which outputs sanitized evidence to `audit_report/LIVE_VERIFICATION_EVIDENCE.json`.

## 2. Prerequisites on Buyer Workstation
- **Node.js** (`>= 20`) and **npm**
- **Docker Desktop** (with WSL2 enabled on Windows) — required to run local PostgreSQL + Supabase Auth via `npx supabase start`.
- **Hosted Staging Verification (Optional):** A buyer-owned non-production Supabase project (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) if testing against Cloud Supabase instead of local Docker.

## 3. Reproducible Verification Commands
1. Install workspace dependencies:
   ```bash
   npm install
   npm --prefix admin_web install
   ```
2. Start the local Supabase stack (requires Docker Desktop running):
   ```bash
   npx supabase start
   ```
3. Run the complete security verification suite (static SQL/RLS checks + pgTAP + live GoTrue Auth/JWT/MFA/RLS tests):
   ```bash
   npm run verify:security-live
   ```
4. Run the web build, linter, and 52-page UI/RBAC regression suite:
   ```bash
   npm run build
   npm run lint
   npm run dev
   npm test
   npm run test:commercial
   ```

## 4. Seller vs. Buyer Ownership Boundaries
- No seller Supabase URLs, `service_role` keys, database passwords, or `INITIAL_ADMIN_BOOTSTRAP_SECRET` values are embedded in this repository.
- See [`.env.example`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/.env.example) and [`.env.production.example`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/.env.production.example) to configure your own Supabase project.
