# Report 11 — Master Defect and Remediation Register

> **Audit Mode**: Strict Read-Only Evidence-Based Audit  
> **Scope**: All verified defects across Database, CI/CD, Web, Flutter, Android, Security, and AWS Handover (`AUD-01` – `AUD-18`)

---

## Master Defect Table

| ID | Severity | Component / File & Line | Observed Defect | Required Remediation | Status |
|---|---|---|---|---|---|
| **AUD-01** | **CRITICAL** | `.github/workflows/` (Runs `d1670d6` `34s`, `fcf3de4` `29s`) | Two GitHub CI security workflow runs failed; live `01_phase1_security_rls.sql` (`22` assertions) & `02_phase2_database_security.sql` (`14` assertions) unverified | Retrieve CI logs, fix workflow/DB failure root cause, and achieve green live CI run | Open |
| **AUD-02** | **CRITICAL** | `supabase/tests/` (`test_live_supabase_auth_jwt.cjs`, pgTAP suites) | Live Supabase Auth/JWT & `36` pgTAP assertions blocked on audit host (`docker`/`psql` missing) | Execute full pgTAP + live Supabase Auth/JWT + Stripe/Twilio/FCM sandbox integration tests | Open |
| **AUD-03** | **CRITICAL** | `admin_web/src/context/AdminContext.tsx` | `8` operational collections (`staffMembers`, `invoices`, `tickets`, `reviews`, `refundCases`, `pricingConfig`, `platformSettings`, `websiteContent`) are React state/`localStorage`-only | Wire all `8` collections to Supabase tables/queries with RLS enforcement | Open |
| **AUD-04** | **HIGH** | `admin_web/src/pages/` (`Page03:83`, `Page12:33`, `Page33:64`, `Page36:142`, `StaffActivity:71`, `StaffDailyReport:29`, `StaffEmergencyHandover:51`, `StaffLiveDispatch:32`, `AdminContext:403`) | `setTimeout` simulated delays used instead of real awaited Supabase/Edge Function responses | Replace `setTimeout` simulations with real async database/Edge Function calls and error handling | Open |
| **AUD-05** | **HIGH** | `serviceos/pubspec.yaml:28` + `serviceos/lib/` | `flutter_secure_storage: ^9.2.2` declared in `pubspec.yaml` but imported/used in `0` Dart files | Implement `FlutterSecureStorage` for Supabase auth/session token persistence | Open |
| **AUD-06** | **HIGH** | `serviceos_android/app/build.gradle.kts:25` | `isMinifyEnabled = false` on `release`, no `signingConfig`, no `EncryptedSharedPreferences` | Enable `isMinifyEnabled = true`, add ProGuard rules, release `signingConfig`, and `EncryptedSharedPreferences` | Open |
| **AUD-07** | **HIGH** | `serviceos/` (`45` `.dart`) & `serviceos_android/` (`37` `.kt`) | Mobile apps never compiled or tested (`flutter`, `dart`, `java` unavailable on host) | Run `flutter analyze`, `flutter test`, `flutter build apk/appbundle`, and `./gradlew assembleRelease` | Open |
| **AUD-08** | **HIGH** | Repository root / AWS IaC | `0` AWS deployment/IaC files (`amplify.yml`, CloudFormation, Terraform, CDK) exist despite AWS being mandatory target | Add validated AWS Amplify / S3+CloudFront + Secrets Manager IaC templates and deployment smoke check | Open |
| **AUD-09** | **HIGH** | `admin_web/src/pages/Page19CustomerProfile.tsx:727` | Hardcoded string `Nov 11, 2026 • Card Ending 4892` rendered in customer profile | Bind to actual Stripe payment method `last4`/timestamp from DB or empty state | Open |
| **AUD-10** | **HIGH** | `serviceos_android/.../TechJobExecutionScreen.kt:155` | Hardcoded `Text("Gate Code: #4892")` in technician execution UI | Bind dynamically to booking `access_notes` or hide when unset | Open |
| **AUD-11** | **MEDIUM** | `serviceos/lib/.../live_dispatch_radar_screen.dart:255`, `app_header.dart:113` | `2` dead Flutter buttons with empty `onPressed: () {}` handlers | Wire real navigation/action callbacks or remove dead controls | Open |
| **AUD-12** | **MEDIUM** | `live_dispatch_radar_screen.dart:184`, `app_header.dart:147`, `InAppChatScreen.kt:55`, `CustomerProfileScreen.kt:63`, `LiveDispatchRadarScreen.kt:92`, `ServiceDetailScreen.kt:36` | `6` mobile UI screens embed hardcoded external Unsplash/demo image URLs | Replace with Supabase `tenant-assets` Storage URLs or local bundled/avatar fallback | Open |
| **AUD-13** | **MEDIUM** | `admin_web/src/components/TopNavbar.tsx:124`, `AdminContext.tsx:4`, `demoDataLoader.ts` (`63,79,95,111,127`) | `Pitch Demo Active` toggle & Unsplash demo loader remain in shipped Admin Web bundle | Gate behind explicit build/dev flag or remove from buyer production bundle | Open |
| **AUD-14** | **MEDIUM** | `admin_web/src/pages/SystemInstallerPage.tsx` | Installer migration check must be verified against complete migration history & schema probes, not partial table probes | Ensure every migration (`01`–`05`) and required RPC/bucket is independently verified | Open |
| **AUD-15** | **LOW** | `admin_web/` (`oxlint`) | `509` linter warnings remain across `admin_web/src/` | Clean up high-signal React hook/unused warnings prior to commercial release | Open |
| **AUD-16** | **LOW** | `serviceos/lib/.../booking_wizard_screen.dart:193` | `hintText` uses `4892` example literal | Replace with generic hint (`e.g. gate code`) to eliminate scanner false positives | Open |
| **AUD-17** | **LOW** | `audit_report/` (`29` prior files + `12` new files) | Historical internal audit logs clutter repository root before buyer handover | Archive/clean internal audit logs during final handover preparation | Open |
| **AUD-18** | **INFO** | `scripts/handover_cleanup.cjs` | Handover cleanup passes `14/14` dry-run checks, not yet executed for final buyer packaging | Execute only at final seller-cleanup release gate after all remediation passes | Pending Gate |
