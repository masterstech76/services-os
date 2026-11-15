# Stage 1 — Remediation Proposal (Awaiting Explicit Authorization)

> **Authorization Boundary**: Diagnosis complete. Zero application, migration, workflow, or config files have been modified. All items below require explicit approval before execution.

---

## 1. Immediate Stage 1 Actions Requiring Authorization

| Action ID | Proposed Action | Affected Target | Why Required |
|---|---|---|---|
| **S1-A** | **Retrieve & Inspect Exact GitHub Actions Logs** for `d1670d6` and `fcf3de4` (via authenticated `gh run view --log-failed` or user-shared workflow log export) | `.github/workflows/ci.yml`, `.github/workflows/security-live-verification.yml` | Private repo returned `HTTP 404` unauthenticated and `gh` is not installed locally; exact failing step must be confirmed before editing any workflow or SQL |
| **S1-B** | **Run Live Local Verification Stack** (`npx supabase start` + `npm run verify:security-live`) in a Docker-enabled environment (or GitHub Actions) | `supabase/migrations/01`–`05`, `supabase/tests/01`–`02`, `scripts/test_live_supabase_auth_jwt.cjs` | Proves `22` tables, `55` net active RLS policies, `36` pgTAP assertions, GoTrue JWT/MFA, and `05_phase3` RPCs at live PostgreSQL runtime |
| **S1-C** | **Fix Any Confirmed CI / Live-Test Defect** uncovered by `S1-A` & `S1-B` (without weakening security or altering migrations just to turn CI green) | Dependent on `S1-A` / `S1-B` findings | Must achieve genuine green `ci.yml` and `security-live-verification.yml` runs |
| **S1-D** | **Sandbox Edge Function Runtime Verification** for `stripe-payment-intent`, `stripe-webhook`, `twilio-sms`, `push-notification`, `bootstrap-first-admin` | `supabase/functions/*` | Static review alone cannot prove Stripe signature verification, webhook idempotency, or Twilio/FCM delivery |

---

## 2. How to Obtain the Missing Remote CI Logs Without Exposing Secrets

Since `gh` CLI is absent and the repository is private:
1. Either install & authenticate GitHub CLI locally (`gh auth login` -> `gh run list --limit 10` -> `gh run view <run-id> --log-failed`), **or**
2. Paste/export the failed GitHub Actions step logs from the GitHub Web UI for commits `d1670d6` and `fcf3de4` (taking care not to include any secret values).

**Stopped at Stage 1 Diagnosis Gate.** Awaiting your instructions (e.g., sharing the failed workflow logs, authorizing Docker/staging live test execution, or authorizing Stage 2).
