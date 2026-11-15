# Security Testing Guide — ServicePro OS

## 1. Test Layers & Separation of Evidence

| Layer | Command | Environment Required | What It Verifies |
| :--- | :--- | :--- | :--- |
| **Static SQL & RLS Coverage** | `npm run verify-env` | Node.js | SQL syntax balance, 21/21 tables RLS enabled, 49 policies, Phase 1 fail-closed & MFA assertions. |
| **Static Phase 1 Security Checks** | `node scripts/test_phase1_security_checks.cjs` | Node.js | Credential revokes, `is_admin()`/`is_staff()` MFA gates, `current_user_role()` deactivation fail-closed checks. |
| **pgTAP Database & RLS Suite** | `npx supabase test db` | Docker + `npx supabase start` | Live PostgreSQL execution of [`supabase/tests/01_phase1_security_rls.sql`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/supabase/tests/01_phase1_security_rls.sql). |
| **Live GoTrue + PostgREST Suite** | `node scripts/test_live_supabase_auth_jwt.cjs` | Local Supabase or Buyer Staging | Real GoTrue `signInWithPassword`, `refreshSession()`, password-only denial, `enroll_my_mfa`, deactivation JWT invalidation. |
| **Unified Live Security Runner** | `npm run verify:security-live` | Node.js + Docker + Supabase | Runs all of the above and writes sanitized evidence to `audit_report/LIVE_VERIFICATION_EVIDENCE.json`; exits non-zero if any dependency is missing or fails. |
| **Local Browser UI & Regression** | `npm test`, `npm run test:commercial` | Node.js + Edge/Chrome + Vite | 52/52 Admin & Staff pages, 0 console errors, RBAC redirect, SQLi search interception. |

## 2. Running Against a Buyer Staging Project
To run `scripts/test_live_supabase_auth_jwt.cjs` against a dedicated non-production staging Supabase project instead of local Docker, export:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Temporary test accounts and tenant records created by the script are automatically deleted in its `finally` cleanup block. Never run this script against production customer data.
