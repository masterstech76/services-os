# Report 2 — Complete File-by-File Repository Audit

**Inventory Totals (Machine-Verified)**:
- **Total Workspace Files**: `23,701`
  - **Maintained Repository Files**: `592`
  - **Generated / Dependency / VCS Files** (`node_modules/`, `.git/`, `dist/`, `build/`, `.dart_tool/`, `.gradle/`, `.idea/`, `coverage/`): `23,109`

## 1. Directory Classification Summary (`592` Maintained Files)

| Directory | File Count | Classification | Operational / Referenced | Buyer Deployment Required? |
|---|---:|---|---|---|
| `admin_web/` | `111` | Production App Source (`src/`), Config (`package.json`, `vite.config.ts`, `tsconfig*.json`), Automated Tests (`verify_*.cjs`) | Yes (`52` routes + `15` modals/drawers + `11` security modules) | **Yes** |
| `serviceos/` | `56` | Flutter Production Source (`45` `.dart`), Config (`pubspec.yaml`, `.env.example`), Bundled Assets (`assets/`) | Partial (`flutter` SDK absent locally; `local_fixture_datasource.dart` unused in live mode) | **Yes (Mobile)** |
| `serviceos_android/` | `44` | Native Android Source (`37` `.kt`), Gradle (`build.gradle.kts`, `settings.gradle.kts`), Manifest/XML (`5`) | Partial (`java`/Gradle absent locally; `InAppChatScreen` / `ServiceDetailScreen` use static Unsplash URLs) | **Yes (Mobile)** |
| `supabase/` | `14` | Database/Backend Source (`5` SQL migrations, `5` Edge Functions, `2` pgTAP tests, `config.toml`, `.env.example`) | Yes (Static validated; live PostgreSQL/Deno execution **PENDING**) | **Yes** |
| `scripts/` | `10` | Automated Tests & Release Validators (`validate_*.cjs`, `test_*.cjs`, `handover_cleanup.cjs`, `.package-lock.json`) | Yes (All local scripts executed & passing) | **Yes (CI/Verification)** |
| `.github/` | `2` | CI/CD Workflows (`ci.yml`, `security-live-verification.yml`) | `ci.yml` passed on `fcf3de4`; `security-live-verification.yml` failed `#1`/`#2` | **Yes** |
| `(root)` | `8` | Config & Docs (`.env.example`, `.env.production.example`, `.gitignore`, `GEMINI.md`, `LICENSE`, `package.json`, `package-lock.json`, `README.md`) | Yes | **Yes** |
| `docs/` | `6` | Buyer Security & DB Documentation | Referenced | **Yes** |
| `documentation/` | `26` | Commercial Handover & Architecture Guides | Referenced (some guides claim features ahead of live CI evidence) | **Yes (After Sync)** |
| `audit_report/` | `29` | Audit & Verification Reports (`28` `.md`/`.json` + `1` `.png`) | Audit Trail | **No (Exclude or Archive)** |
| `design_references/` | `207` | Visual Design References & Cropped UI Assets | Design-only reference | **No** |
| `SERVICEPRO_SCREENSHOT_DOCUMENTATION/` | `79` | Marketing / QA Screenshots | Sales/QA artifact | **No** |

---

## 2. Key Maintained Source & Backend File-by-File Matrix

| Relative Path | Purpose / Module | Referenced & Operational | Hardcoded Data / Security Risk | Test Coverage | Severity | Recommended Action |
|---|---|---|---|---|---|---|
| `admin_web/src/App.tsx` | Root router & auth gate | Yes / Operational | None | `npm test`, `npm run build` | Info | Preserve |
| `admin_web/src/context/AdminContext.tsx` | Global state & Supabase sync | Yes / Partial (`staff`, `invoices`, `tickets`, `reviews` local-only) | Imports `demoDataLoader.ts` | `npm test` | **High** | Persist secondary entities to Supabase |
| `admin_web/src/services/supabaseClient.ts` | Supabase JS client, auth, CRUD | Yes / Operational | Deterministic UUIDs, `.select('id')` | `test_phase1`, `test_phase3_4`, `build` | Info | Preserve |
| `admin_web/src/pages/auth/LoginPage.tsx` | Admin/Staff login & MFA UI | Yes / Operational | `setTimeout` delay for brute-force UX; no hardcoded secrets | `test_phase1`, `npm test` | Info | Add Playwright real-login E2E |
| `admin_web/src/pages/commercial/SystemInstallerPage.tsx` | Installer & migration probe | Yes / Partial | Calls `verify_schema_migrations_status()` RPC | `test_phase3_4`, `test:commercial` | Info | Test live RPC in CI |
| `admin_web/src/pages/module4/Page19CustomerProfile.tsx` | Customer profile view | Yes / Partial | `L727`: `"Nov 11, 2026 • Card Ending 4892"` | `npm test` | **Medium** | Replace static card text with empty/live data |
| `admin_web/src/pages/module8/Page36PaymentNotificationConfig.tsx` | Integration settings UI | Yes / Partial | `L142` `setTimeout` test button; no secret `localStorage` | `test_phase3_4`, `npm test` | **Medium** | Wire test button to real Edge Function ping |
| `admin_web/src/pages/shared/FacebookProfilePage.tsx` | Shared team/profile social view | Yes / UI-heavy | Fixed empty `src=""` bug | `npm test` (`S114`) | Low | Preserve |
| `admin_web/src/data/demoDataLoader.ts` | Opt-in Pitch Demo dataset | Yes (TopNavbar toggle) | Contains fictional showcase records + Unsplash URLs | `verify:data-env` | **Medium** | Gate behind `VITE_ENABLE_DEMO_MODE === 'true'` |
| `admin_web/src/security/*` (`11` files) | Client RBAC, OTP, rate limit, TOTP, audit helpers | Yes / Operational | Client-side helpers only (server enforces via PostgreSQL) | `oxlint`, `build` | Info | Preserve |
| `supabase/migrations/01_initial_schema.sql` | 14 core tables + enums + PostGIS | Yes / Static Validated | Zero fake data | `verify-env`, `verify:data-env` | **Blocked (Live)** | Run in live PostgreSQL CI |
| `supabase/migrations/02_postgis_functions.sql` | 5 spatial & escrow RPCs | Yes / Static Validated | `SECURITY DEFINER`, `SET search_path` | `verify-env`, `test_phase2` | **Blocked (Live)** | Run pgTAP in live CI |
| `supabase/migrations/03_security_rbac_and_rls.sql` | Auth/MFA tables, RBAC, cleanup RPC | Yes / Static Validated | AES-256 `pgp_sym_encrypt` MFA | `test_phase1`, `verify-env` | **Blocked (Live)** | Run 22 pgTAP tests live |
| `supabase/migrations/04_phase2_database_security_hardening.sql` | `FORCE RLS` (21 tables), storage, triggers | Yes / Static Validated | Zero fail-open `IS NULL` | `test_phase2`, `verify-env` | **Blocked (Live)** | Run 14 pgTAP tests live |
| `supabase/migrations/05_phase3_payments_and_webhook_idempotency.sql` | `stripe_webhook_events`, `approve_booking_extra_parts`, `verify_schema_migrations_status` | Yes / Static Validated | Tenant-scoped `stripe_webhook_events` | `test_phase3_4`, `verify-env` | **Blocked (Live)** | Run in live PostgreSQL CI |
| `supabase/functions/bootstrap-first-admin/index.ts` | Atomic first-admin bootstrap | Yes / Static | Timing-safe `X-Bootstrap-Token` | `test_phase1` | **Blocked (Live)** | Test against live Supabase |
| `supabase/functions/stripe-payment-intent/index.ts` | Server-side Stripe PaymentIntent | Yes / Static | `calculate_booking_financials` + `Idempotency-Key` | `test_phase3_4` | **Blocked (Live)** | Test with Stripe test keys |
| `supabase/functions/stripe-webhook/index.ts` | Stripe webhook verifier & idempotency | Yes / Static | Multi-`v1` HMAC + `tenant_id` scoping | `test_phase3_4` | **Blocked (Live)** | Test with Stripe CLI |
| `supabase/functions/twilio-sms/index.ts` | SMS dispatch Edge Function | Yes / Static | `ADMIN`/`STAFF` + E.164 + 10/60s rate limit | `test_phase3_4` | **Blocked (Live)** | Test with Twilio test creds |
| `supabase/functions/push-notification/index.ts` | FCM HTTP v1 + Resend push/email | Yes / Static | JWT `getUser` + RS256 OAuth2 | `test_phase3_4` | **Blocked (Live)** | Test with FCM service acct |
| `serviceos/pubspec.yaml` | Flutter manifest | Yes / Unbuilt | `flutter_secure_storage` declared but unused | `validate-mobile` | **High** | Wire `flutter_secure_storage` & run `flutter build` |
| `serviceos/lib/data/repositories/booking_repository.dart` | Flutter booking & escrow repo | Yes / Unbuilt | Uses `approve_booking_extra_parts` RPC; no `'4892'` | `test_phase3_4`, `validate-mobile` | **Blocked (SDK)** | Run `flutter test` |
| `serviceos/lib/features/dispatch/presentation/screens/live_dispatch_radar_screen.dart` | Flutter customer radar UI | Yes / Unbuilt | `L184` Unsplash URL; `L255` empty `onPressed: () {}` | `validate-mobile` | **High** | Wire Call Pro action & remove Unsplash URL |
| `serviceos/lib/shared/components/app_header.dart` | Flutter shared header | Yes / Unbuilt | `L113` empty `onPressed: () {}`; `L147` Unsplash URL | `validate-mobile` | **High** | Wire action & remove Unsplash URL |
| `serviceos_android/app/build.gradle.kts` | Android Gradle config | Yes / Unbuilt | `isMinifyEnabled = false`; no signing config | `validate-mobile` | **High** | Enable minify/proguard & release signing |
| `serviceos_android/.../BookingRepository.kt` | Android booking & escrow repo | Yes / Unbuilt | `@Synchronized`, JWT `bearerToken()`, no `safetyPin` in prefs | `test_phase3_4`, `validate-mobile` | **Blocked (SDK)** | Run Gradle build & instrumented tests |
| `serviceos_android/.../CustomerProfileScreen.kt` (+ 3 UI files) | Android Compose UI screens | Yes / Unbuilt | Hardcoded Unsplash URLs (`CustomerProfileScreen:63`, `InAppChatScreen:55`, `LiveDispatchRadarScreen:92`, `ServiceDetailScreen:36`) | `validate-mobile` | **Medium** | Replace with dynamic URLs / local vector fallbacks |
| `scripts/*` (`10` files) | Security, migration, cleanup validators | Yes / Operational | `handover_cleanup.cjs` safely guarded | All `scripts/` executed | Info | Preserve |
| `.github/workflows/security-live-verification.yml` | Live Docker/pgTAP/Auth CI | Yes / Failed `#1`,`#2` | Failure logs unretrieved | GitHub CI `#1`,`#2` failed | **Critical** | Diagnose Run `#2` failure logs |
