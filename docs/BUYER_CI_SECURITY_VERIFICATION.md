# Buyer CI Security Verification Guide — ServicePro OS

This guide explains how a technical buyer can run the automated live PostgreSQL, pgTAP, Row-Level Security (RLS), Supabase Auth/JWT, MFA, and 52-page web regression verification in GitHub Actions without any local Docker or Windows Administrator setup.

## 1. Workflow Location
- [`security-live-verification.yml`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/.github/workflows/security-live-verification.yml)

## 2. What the CI Workflow Verifies
1. **Clean Linux + Docker Runner (`ubuntu-24.04`):** Verifies Docker daemon availability.
2. **Pinned Dependencies:** Installs root (`supabase@3.1.0`) and `admin_web` dependencies via `npm ci`.
3. **Local Supabase Stack:** Runs `npx supabase start` using [`supabase/config.toml`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/supabase/config.toml) and applies `01_initial_schema.sql`, `02_postgis_functions.sql`, and `03_security_rbac_and_rls.sql`.
4. **Static + Live Database + Live Auth Suite (`npm run verify:security-live`):**
   - `npm run verify-env` (21-table RLS coverage & Phase 1 fail-closed assertions)
   - `scripts/test_phase1_security_checks.cjs` (Phase 1 static adversarial checks)
   - `npx supabase test db` ([`supabase/tests/01_phase1_security_rls.sql`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/supabase/tests/01_phase1_security_rls.sql) pgTAP suite)
   - `scripts/test_live_supabase_auth_jwt.cjs` (real GoTrue login, `refreshSession()`, password-only denial, `enroll_my_mfa`, deactivation JWT invalidation, Customer self-escalation denial)
5. **Build, Lint, & 52-Page Regression:** `npm run build`, `npm run lint`, `npm test`, and `npm run test:commercial`.
6. **Sanitized Evidence & Cleanup:** Uploads `audit_report/LIVE_VERIFICATION_EVIDENCE.json` as a build artifact and executes `npx supabase stop --no-backup` in `if: always()`.

## 3. How a Buyer Runs It
1. Push the repository to your own GitHub repository (no secrets or seller credentials are required).
2. Open the **Actions** tab in GitHub.
3. Select **ServicePro OS — Live Security & Database Verification** and click **Run workflow** (or push to `main`/`master` / open a Pull Request).
4. Download the `phase1-live-security-evidence` artifact (`LIVE_VERIFICATION_EVIDENCE.json`) from the completed run to inspect the pass/fail status and exit codes of every step.
