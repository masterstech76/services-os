# Report 6 — Security, Privacy, RBAC, RLS, and Compliance Audit

> **Audit Mode**: Strict Read-Only Evidence-Based Audit  
> **Scope**: `supabase/migrations/`, `supabase/functions/`, `admin_web/`, `serviceos/`, `serviceos_android/`, `.github/workflows/`  
> **Verdict**: **STATIC CHECKS PASS / RUNTIME & MOBILE STORAGE UNVERIFIED OR DEFECTIVE (`BLOCKED`)**

---

## 1. Security Verification Matrix

| Security Layer | Static Evidence Observed | Runtime / Live Verification | Status |
|---|---|---|---|
| **PostgreSQL RLS Coverage** | `22/22` tables have `ENABLE ROW LEVEL SECURITY`; `FORCE ROW LEVEL SECURITY` on `21` Phase 1/2 tables + `stripe_webhook_events`; `94` active policies (`98` `CREATE POLICY`) | `01_phase1_security_rls.sql` (`22` pgTAP assertions) & `02_phase2_database_security.sql` (`14` pgTAP assertions) **NOT RUN** (`docker`/`psql` unavailable) | **BLOCKED (Live Unverified)** |
| **Static Security Scripts** | `test_phase1_security_checks.cjs` (`18/18`), `test_phase2_database_security.cjs` (`31/31`), `test_phase3_4_security.cjs` (`38/38`) | Local static AST/SQL regex checks pass | **PASS (Static Only)** |
| **Auth / JWT / MFA** | `verify-env` exit `0`; `supabaseService` auth wired in `LoginPage.tsx` & `AdminContext.tsx` | `test_live_supabase_auth_jwt.cjs` **NOT RUN** against live Supabase Auth | **BLOCKED (Live Unverified)** |
| **Edge Functions (5)** | `bootstrap-first-admin`, `push-notification`, `stripe-payment-intent`, `stripe-webhook`, `twilio-sms` | Live Stripe webhook signature, Twilio SMS, FCM runtime **NOT RUN** | **BLOCKED (Live Unverified)** |
| **Storage Buckets** | `2` private Storage buckets (`job-evidence`, `tenant-assets`) | Signed URL / cross-tenant bucket access **NOT TESTED LIVE** | **BLOCKED (Live Unverified)** |
| **Web Production Dependencies** | `npm --prefix admin_web audit --omit=dev --json` → `0` info/low/moderate/high/critical (`0` total) | Verified via npm audit | **PASS** |
| **Secret Hygiene** | `.env.production.example` uses placeholders only; `verify:data-env` exits `0` | No committed live secrets observed in `.env.production.example` | **PASS (Static)** |
| **Flutter Token Storage** | `serviceos/pubspec.yaml:28` declares `flutter_secure_storage: ^9.2.2`, but **0** Dart files import or call it | Tokens rely on default `shared_preferences` / unencrypted persistence | **DEFECT (High)** |
| **Android Release & Storage** | `serviceos_android/app/build.gradle.kts:25` sets `isMinifyEnabled = false` on `release`, no `signingConfig`, no `EncryptedSharedPreferences` | Release APK/AAB unobfuscated; local preferences unencrypted | **DEFECT (High)** |
| **GitHub CI Security Workflows** | Workflow #1 (`d1670d6`, `34s`) & Workflow #2 (`fcf3de4`, `29s`) failed; `gh` CLI unavailable to fetch logs | Live CI failure root cause unresolved | **FAIL / BLOCKED** |

---

## 2. Detailed Security Findings

### 2.1 Database & Multi-Tenant Isolation (`supabase/migrations/`)
- **Strengths**:
  - `22` tables (`CREATE TABLE IF NOT EXISTS`) all enable Row Level Security (`22/22`).
  - `47` PostgreSQL functions (`CREATE OR REPLACE FUNCTION`) and `3` triggers enforce server-side invariants and state transitions.
  - `21` Phase 1/2 tables plus `stripe_webhook_events` enforce `FORCE ROW LEVEL SECURITY` so even table owners (outside `SECURITY DEFINER` controlled paths) cannot bypass policies inadvertently.
  - `2` private Storage buckets (`job-evidence`, `tenant-assets`) replace public bucket exposure.
- **Gaps**:
  - None of the `36` pgTAP assertions (`22` in Phase 1 + `14` in Phase 2) have been executed on this host because `docker` and `psql` are absent.
  - Prior GitHub CI runs (`d1670d6` and `fcf3de4`) failed in `34s` and `29s` respectively; without `gh` access or workflow logs, live PostgreSQL RLS enforcement remains unverified.

### 2.2 Mobile Client Security Gaps (`serviceos/` & `serviceos_android/`)
1. **Unused Secure Storage in Flutter (`serviceos/pubspec.yaml:28`)**:
   - `flutter_secure_storage: ^9.2.2` is listed in `pubspec.yaml` (`L28`), creating a false impression of encrypted credential storage, yet **0** `.dart` files import `package:flutter_secure_storage/flutter_secure_storage.dart`.
   - Remediation: Wire `FlutterSecureStorage` into `supabase_flutter` custom `LocalStorage` or auth/session persistence so JWT/refresh tokens reside in Android Keystore / iOS Keychain.
2. **Android Release Hardening Missing (`serviceos_android/app/build.gradle.kts:25`)**:
   - `release` build type has `isMinifyEnabled = false`, exposing Kotlin symbol names and business logic to trivial reverse engineering, and defines no `signingConfig`.
   - No `androidx.security:security-crypto` (`EncryptedSharedPreferences`) is configured for sensitive local state.

### 2.3 Web Client Security & Hygiene (`admin_web/`)
- `npm --prefix admin_web audit --omit=dev --json` reports `0` known production vulnerabilities across all severity levels.
- `npm run lint` reports `0` errors (`509` warnings) and `npm test` (`52/52` Playwright tests) passes with `0` console errors.
- Local-only `localStorage` persistence for `staffMembers`, `invoices`, `tickets`, `reviews`, `refundCases`, `pricingConfig`, `platformSettings`, and `websiteContent` in `AdminContext.tsx` means sensitive operational data for those modules sits unencrypted in browser `localStorage` without server-side RBAC enforcement.

### 2.4 Privacy & Buyer Data Isolation
- `.env.production.example` (`L1-29`) cleanly separates Vite frontend keys (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_STRIPE_PUBLISHABLE_KEY`), Flutter `--dart-define` keys, and Supabase Edge Function server secrets (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`, `FCM_SERVER_KEY`).
- `scripts/handover_cleanup.cjs` passes its dry-run safety suite (`test_handover_cleanup.cjs`: `14/14`), though cleanup itself was strictly not executed during this read-only audit.

---

## 3. Compliance & Remediation Gate

Before claiming commercial security readiness:
1. Diagnose and pass GitHub CI live PostgreSQL/pgTAP workflows (`22` + `14` assertions) and `test_live_supabase_auth_jwt.cjs`.
2. Verify live `stripe-payment-intent`, `stripe-webhook`, `twilio-sms`, and `push-notification` Edge Functions against sandbox accounts.
3. Wire `flutter_secure_storage` in `serviceos/lib/` and enable `isMinifyEnabled = true` + `EncryptedSharedPreferences` + release `signingConfig` in `serviceos_android/`.
4. Move the `8` `localStorage`-only `AdminContext` modules onto RLS-protected Supabase tables.
