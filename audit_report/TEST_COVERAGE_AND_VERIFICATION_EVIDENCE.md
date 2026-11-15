# Report 9 — Test Coverage and Verification Evidence Matrix

> **Audit Mode**: Strict Read-Only Evidence-Based Audit  
> **Rule**: Only checks actually executed and directly observed are marked `PASS`. Checks blocked by missing toolchains (`docker`, `psql`, `flutter`, `dart`, `java`, `aws`, `gh`) or failed remote CI runs are explicitly marked `BLOCKED` or `FAIL`.

---

## 1. Observed Local Verification Results (Current Repository State)

| Check / Script | Command | Observed Result | Scope & Limitations | Status |
|---|---|---|---|---|
| **Environment Config Check** | `npm run verify-env` | Exit `0` | Verifies env variable structure locally | **PASS** |
| **Phase 1 Security Static Checks** | `node scripts/test_phase1_security_checks.cjs` | `18/18` passed | Static SQL/code pattern checks only (no live DB) | **PASS (Static)** |
| **Phase 2 Database Security Static Checks** | `node scripts/test_phase2_database_security.cjs` | `31/31` passed | Static SQL/RLS/trigger pattern checks only | **PASS (Static)** |
| **Phase 3–4 Security Static Checks** | `node scripts/test_phase3_4_security.cjs` | `38/38` passed | Static Edge Function / mobile / web pattern checks only | **PASS (Static)** |
| **Handover Cleanup Safety Suite** | `node scripts/test_handover_cleanup.cjs` | `14/14` passed | Dry-run safety validation; cleanup itself NOT executed | **PASS (Dry-Run)** |
| **Data/Env Hygiene Validator** | `npm run verify:data-env` | Exit `0` | Static scan for leaked credentials/demo leakage | **PASS (Static)** |
| **Mobile Structural Validator** | `npm run validate-mobile` | Passed (`45` Dart + `37` Kotlin files) | AST/regex structural check only — NOT a compiler | **PASS (Structural)** |
| **Admin Web Production Build** | `npm run build` | `0` errors (`vite 8.3.6`) | Compiles TypeScript/React bundle (`admin_web/dist`) | **PASS** |
| **Admin Web Linter** | `npm run lint` | `0` errors, `509` warnings (`oxlint 1.90.0`) | Zero hard errors; `509` warnings remain | **PASS (With Warnings)** |
| **Admin Web Playwright E2E/RBAC** | `npm test` | `52/52` routes passed, `0` console errors | UI rendering & route checks across `52` pages (not live Supabase E2E payments/SMS) | **PASS (UI/Routes)** |
| **Commercial Turnkey Suite** | `npm run test:commercial` | Exit `0` | Commercial UI/workflow checks | **PASS** |
| **Production Dependency Audit** | `npm --prefix admin_web audit --omit=dev --json` | `0` vulnerabilities (`info:0, low:0, moderate:0, high:0, critical:0`) | Checks `admin_web` production npm dependencies | **PASS** |

---

## 2. Unexecuted, Blocked, or Failed Verification Items

| Verification Item | Target | Reason Not Verified / Failure Status | Status |
|---|---|---|---|
| **Phase 1 pgTAP Database Suite** | `01_phase1_security_rls.sql` (`22` assertions) | `docker` and `psql` unavailable on audit host | **BLOCKED (Not Run)** |
| **Phase 2 pgTAP Database Suite** | `02_phase2_database_security.sql` (`14` assertions) | `docker` and `psql` unavailable on audit host | **BLOCKED (Not Run)** |
| **Live Supabase Auth / JWT Suite** | `test_live_supabase_auth_jwt.cjs` | No live Supabase credentials / runtime executed on host | **BLOCKED (Not Run)** |
| **GitHub CI Workflow Run #1** | Commit `d1670d6` (`34s`) | Failed on GitHub Actions; `gh` CLI unavailable to inspect logs | **FAIL (Unresolved)** |
| **GitHub CI Workflow Run #2** | Commit `fcf3de4` (`29s`) | Failed on GitHub Actions; `gh` CLI unavailable to inspect logs | **FAIL (Unresolved)** |
| **Stripe Payment & Webhook Runtime** | `stripe-payment-intent`, `stripe-webhook` | No live Stripe test keys / webhook replay executed | **BLOCKED (Not Run)** |
| **Twilio SMS & FCM Push Runtime** | `twilio-sms`, `push-notification` | No live Twilio/FCM credentials executed | **BLOCKED (Not Run)** |
| **Flutter Compile & Tests** | `serviceos/` (`flutter analyze`, `flutter test`, `flutter build`) | `flutter` & `dart` SDK not installed on audit host | **BLOCKED (Not Run)** |
| **Native Android Compile & Tests** | `serviceos_android/` (`./gradlew assembleRelease`, unit tests) | `java` / Android SDK not installed on audit host | **BLOCKED (Not Run)** |
| **AWS Deployment & Smoke Tests** | AWS Amplify / S3+CloudFront / Secrets Manager | `aws` CLI unavailable; zero AWS IaC templates in repo | **BLOCKED (Not Run)** |

---

## 3. Audit Evidence Summary

- **Local Web & Static Verification**: Strong (`12` local commands executed cleanly, `0` build errors, `0` npm prod vulnerabilities, `52/52` Playwright route tests passing).
- **Runtime, Live DB, and Mobile Binary Verification**: **Incomplete / Blocked**. Claiming "100% tested" without passing the `36` pgTAP live assertions, resolving the two failed GitHub CI runs, and compiling Flutter/Android binaries would be false.
