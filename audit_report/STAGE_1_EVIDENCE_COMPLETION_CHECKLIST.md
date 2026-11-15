# Stage 1 — Evidence Completion Checklist & Isolated Live-Verification Guide

> **Authorization Scope**: Stage 1 Evidence Completion Only (Read-Only on Application, Migrations, Workflows, Configs)  
> **Strict Boundaries**: No application edits, no migration changes, no fake operational data, no production DB changes, no seller/handover cleanup, no Git commit/push/deploy, no secrets printed or exposed.

---

## 1. GitHub Actions Evidence Checklist (`d1670d6` and `fcf3de4`)

### 1.1 Locally Observed Metadata (From [GITHUB_ACTIONS_FAILURE_DIAGNOSIS.md](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/audit_report/GITHUB_ACTIONS_FAILURE_DIAGNOSIS.md) & [security-live-verification.yml](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/.github/workflows/security-live-verification.yml))
| Commit SHA | Branch | Workflow Name | Run # | Job Name | Conclusion | Duration | Numeric Run ID & Failed Step Name |
|---|---|---|---|---|---|---|---|
| `d1670d6` | `main` | `ServicePro OS — Live Security & Database Verification` | `#1` | `Live PostgreSQL, pgTAP, RLS, Auth/JWT & Web Regression` (`live-security-verification`) | **FAILED** | `34s` | **Unavailable locally** (private repo `HTTP 404` unauthenticated; `gh` CLI absent) |
| `fcf3de4` | `main` | `ServicePro OS — Live Security & Database Verification` | `#2` | `Live PostgreSQL, pgTAP, RLS, Auth/JWT & Web Regression` (`live-security-verification`) | **FAILED** | `29s` | **Unavailable locally** (private repo `HTTP 404` unauthenticated; `gh` CLI absent) |
| `d1670d6` | `main` | `ServicePro OS CI` | `#62` | `verify` | **PASSED** | `34s` | N/A |
| `fcf3de4` | `main` | `ServicePro OS CI` | `#63` | `verify` | **PASSED** | `23s` | N/A |

*Note: Failure causes are not inferred from the `HTTP 404` API response, missing `gh` CLI, or workflow duration.*

### 1.2 Minimum Permissions for Read-Only GitHub Actions Log Retrieval
To retrieve workflow run IDs, job details, and step logs without write access:
- **Fine-Grained Personal Access Token (Read-Only)**:
  - Repository access: Only `masterstech76/servicepro-os`
  - **Actions**: `Read-only` (`actions:read`)
  - **Contents**: `Read-only` (`contents:read`)
  - **Metadata**: `Read-only` (mandatory default)
  - *Do NOT grant* `actions:write`, `contents:write`, `secrets`, or `administration`.
- **GitHub CLI (`gh`) Read-Only Commands** (once authenticated):
  - `gh run list --workflow security-live-verification.yml --limit 10`
  - `gh run view <RUN_ID> --log-failed`
- **Browser Export Checklist** (if retrieving via GitHub Web UI):
  - [ ] Record numeric Run ID from URL (`.../actions/runs/<RUN_ID>`) for `d1670d6` (`#1`) and `fcf3de4` (`#2`)
  - [ ] Record exact failed step name(s) and exit code(s) under job `Live PostgreSQL, pgTAP, RLS, Auth/JWT & Web Regression`
  - [ ] Check whether artifact `phase1-live-security-evidence` (`LIVE_VERIFICATION_EVIDENCE.json`) was uploaded
  - [ ] Redact any sensitive environment values/tokens before sharing

---

## 2. Verification Layer Taxonomy (Strict Separation)

| Layer | Definition | Scope & Guarantees | Current Status on `fcf3de4` |
|---|---|---|---|
| **1. Static Checks** | AST, regex, SQL syntax, linter, TypeScript build, dependency audit | Proves code/SQL structure & zero known npm prod vulns; **cannot** prove live Postgres RLS, JWT, or Edge runtime | **PASS (Local)** |
| **2. Local Integration Tests** | Ephemeral local Docker Supabase (`PostgreSQL 16 + GoTrue + PostgREST + pgTAP`) + Playwright against local Vite | Proves migrations, `36` pgTAP assertions, GoTrue JWT/MFA, and RLS enforcement in isolated containers | **Web `52/52` PASS; DB/Auth BLOCKED (`docker`/`psql` absent)** |
| **3. Staging Runtime Tests** | Dedicated non-production Supabase staging project + Stripe/Twilio/FCM test sandboxes | Proves real cloud Supabase Auth, Storage buckets, and external Edge Function webhooks/SMS/push | **NOT EXECUTED** |
| **4. Production Verification** | Buyer-owned production Supabase + AWS deployment | Smoke verification on real buyer infrastructure after handover | **OUT OF SCOPE / NOT READY** |

---

## 3. Isolated Live-Verification Options

### Option 1 — Docker-Enabled Local Supabase Environment (Zero External Cloud Dependency)

- **Prerequisites**:
  - Docker Desktop / Docker Engine running (`docker info` exits `0`)
  - Node.js `20.18.1+` & npm
  - Supabase CLI `3.1.0` (pinned in root `package.json`)
  - [supabase/config.toml](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/supabase/config.toml) (`project_id = "servicepro-os-local"`, PostgreSQL `16`)
- **Required Environment Variables (Names Only)**:
  - None required for DB/pgTAP/Auth (`test_live_supabase_auth_jwt.cjs` auto-reads `npx supabase status --output json`).
  - Optional for local Edge Function serving (`supabase functions serve`): `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`, `FCM_SERVER_KEY` (test/sandbox values only).
- **Exact Commands**:
  1. `docker info --format '{{.ServerVersion}}'`
  2. `npx supabase start`
  3. `npx supabase test db` *(runs Phase 1 `01_phase1_security_rls.sql` + Phase 2 `02_phase2_database_security.sql`)*
  4. `node scripts/test_live_supabase_auth_jwt.cjs`
  5. `npm run verify:security-live`
  6. *(Optional Edge Functions)* `npx supabase functions serve --no-verify-jwt` + sandbox HTTP tests against `stripe-payment-intent`, `stripe-webhook`, `twilio-sms`, `push-notification`, `bootstrap-first-admin`
- **Expected Results**:
  - `npx supabase start`: Exit `0`, migrations `01`–`05` applied cleanly.
  - Phase 1 pgTAP (`01_phase1_security_rls.sql`): **`22/22` assertions pass**.
  - Phase 2 pgTAP (`02_phase2_database_security.sql`): **`14/14` assertions pass**.
  - `test_live_supabase_auth_jwt.cjs`: Exit `0`, all `PASS (Live): ...` assertions pass (ephemeral tenant/admin/customer + TOTP MFA + RLS isolation).
  - `npm run verify:security-live`: Exit `0`, `LIVE_VERIFICATION_EVIDENCE.json` reports `overallStatus: "PASS"`.
- **Cleanup Boundary**:
  - `test_live_supabase_auth_jwt.cjs` deletes ephemeral test users/tenant on exit.
  - Run `npx supabase stop --no-backup` after verification so zero local volumes or test records persist.

### Option 2 — Dedicated Non-Production Supabase Staging Project (When Docker Is Unavailable)

- **Prerequisites**:
  - A fresh, disposable **non-production** Supabase staging project (never production, never seller-owned).
  - `psql` client (for pgTAP execution against staging DB URI) or Supabase SQL Editor / CLI `db push` to staging only.
  - Test-mode third-party credentials (Stripe Test Mode, Twilio Test/Sandbox, FCM test project).
- **Required Environment Variables (Names Only)**:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `SUPABASE_DB_URL` *(staging Postgres connection string for `psql` / `supabase db push`)*
  - Edge Function secrets in staging project only: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`, `FCM_SERVER_KEY`
- **Exact Commands**:
  1. `npx supabase link --project-ref <STAGING_PROJECT_REF>`
  2. `npx supabase db push` *(applies migrations `01`–`05` to staging)*
  3. `psql "$SUPABASE_DB_URL" -f supabase/tests/01_phase1_security_rls.sql`
  4. `psql "$SUPABASE_DB_URL" -f supabase/tests/02_phase2_database_security.sql`
  5. `node scripts/test_live_supabase_auth_jwt.cjs` *(auto-detects `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)*
  6. Deploy & invoke all `5` Edge Functions on staging (`stripe-payment-intent`, `stripe-webhook`, `twilio-sms`, `push-notification`, `bootstrap-first-admin`) with test payloads and Stripe test webhook signatures.
- **Expected Results**:
  - Migrations `01`–`05` apply with `0` SQL errors (`22` tables, `55` net active RLS policies).
  - Phase 1 pgTAP: `22/22` pass; Phase 2 pgTAP: `14/14` pass.
  - Live Auth/JWT & MFA suite: Exit `0`.
  - Edge Functions: Validated auth checks (`401`/`403` on unauthorized callers), `stripe-webhook` signature & `23505` duplicate idempotency handling, and `stripe_webhook_events` tenant isolation (`booking_id IS NULL`).
- **Cleanup Boundary**:
  - `test_live_supabase_auth_jwt.cjs` removes its ephemeral test tenant/users on exit.
  - Unlink staging project (`npx supabase unlink`) and reset/delete the disposable staging project after verification; never reuse staging data in production.

---

**Stopped at Stage 1 Evidence Completion Gate.** Awaiting your GitHub Actions failure logs (or authorization for Option 1 / Option 2 live verification) before making any changes.
