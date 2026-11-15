# Stage 1 — Live Security Verification Plan (Isolated & Buyer-Independent)

> **Authorization Scope**: Stage 1 Diagnosis Only  
> **Objective**: Establish the exact, reproducible procedure to verify live PostgreSQL 16, pgTAP (`36` assertions), Supabase Auth/JWT/MFA, RLS, and Edge Functions using only isolated test infrastructure — zero production or seller credentials.

---

## 1. Prerequisites

### Option A — Local Isolated Stack (Recommended for Developer / CI)
1. **Docker Engine / Docker Desktop** running (`docker info` exits `0`).
2. **Node.js `20.18.1+`** and **Supabase CLI `3.1.0`** (already pinned in root `package.json`).
3. **Configuration**: [supabase/config.toml](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/supabase/config.toml) (`project_id = "servicepro-os-local"`, PostgreSQL `major_version = 16`, `api.port = 54321`, `db.port = 54322`, `auth.enable_signup = true`, `edge_runtime.enabled = true`).

### Option B — Isolated Buyer/Staging Supabase Project (When Docker Unavailable)
1. Dedicated disposable Supabase staging project (never production, never seller-owned).
2. Ephemeral environment variables injected in shell only (never committed):
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

---

## 2. Exact Verification Command Sequence

| Step | Command | What It Verifies | Expected Passing Result |
|---|---|---|---|
| **1** | `docker info --format '{{.ServerVersion}}'` | Container runtime ready | Exit `0`, server version printed |
| **2** | `npx supabase start` | Applies all `5` migrations (`01`–`05`) cleanly onto fresh PostgreSQL 16 + PostGIS + GoTrue + PostgREST | Exit `0`, local API (`127.0.0.1:54321`) healthy |
| **3** | `npx supabase test db` | Executes [01_phase1_security_rls.sql](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/supabase/tests/01_phase1_security_rls.sql) (`22` pgTAP assertions) & [02_phase2_database_security.sql](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/supabase/tests/02_phase2_database_security.sql) (`14` pgTAP assertions) | Exit `0`, `36/36` pgTAP assertions pass |
| **4** | `node scripts/test_live_supabase_auth_jwt.cjs` | Provisions ephemeral tenant/admin/customer, tests live GoTrue JWT, TOTP MFA, cross-tenant RLS isolation, and cleans up test users on exit | Exit `0`, all `PASS (Live): ...` assertions pass |
| **5** | `npm run verify:security-live` | Runs full orchestrator (`verify-env`, Phase 1 static, `supabase status`, `supabase test db`, `test_live_supabase_auth_jwt.cjs`) & writes `LIVE_VERIFICATION_EVIDENCE.json` | Exit `0`, `overallStatus: "PASS"` |
| **6** | Edge Function Sandbox Smoke Tests | Invoke `stripe-payment-intent`, `stripe-webhook`, `twilio-sms`, `push-notification`, `bootstrap-first-admin` against Stripe test mode / sandbox mocks | Validated HTTP `200`/`401`/`403` enforcement, replay idempotency (`23505` -> `duplicate: true`), and `stripe_webhook_events` tenant isolation |
| **7** | `npx supabase stop --no-backup` | Tears down disposable local database cleanly | Exit `0`, zero leftover test state |

---

## 3. Additional Live Assertions Recommended After Stage 1 Baseline Passes
Verify in live PostgreSQL (`psql` or pgTAP extension) that:
1. `stripe_webhook_events` returns `0` rows to an Admin of Tenant B when Tenant A's webhook event has `booking_id IS NULL` (`tenant_id` scoped).
2. `approve_booking_extra_parts(booking_id, cents)` succeeds for the owning customer/admin/staff and rejects non-owners, cross-tenant callers, and `COMPLETED`/`CANCELLED` bookings.
3. `verify_schema_migrations_status()` returns `m1: true, m2: true, m3: true, m4: true, m5: true` only when all 5 migrations are present.
