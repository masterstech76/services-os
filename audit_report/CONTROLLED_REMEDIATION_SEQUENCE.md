# Controlled Remediation Sequence (Dependency-Ordered Plan)

> **Authorization Boundary**: Planning artifact only. No application, migration, workflow, or deployment files have been modified. Do not execute until explicitly authorized.  
> **UI Preservation Rule**: Preserve all 52 routes, existing layouts, navigation, Day/Night Vision themes, and genuine features. Never insert fake/demo operational records.

---

## Stage 1 — Live CI Diagnosis & Critical Security Verification (Blocking Gate)
**Goal**: Inspect and fix why GitHub Actions failed (`d1670d6`, `fcf3de4`) and prove live PostgreSQL security.
1. Retrieve GitHub Actions logs for `security-live-verification.yml` and `ci.yml`; resolve any failing step.
2. Execute live PostgreSQL verification (`supabase start` + `npm run verify:security-live`):
   - `01_phase1_security_rls.sql` (`22` pgTAP assertions)
   - `02_phase2_database_security.sql` (`14` pgTAP assertions)
   - `test_live_supabase_auth_jwt.cjs`
   - Runtime verification of `stripe_webhook_events` tenant isolation, `approve_booking_extra_parts()` RPC, and `verify_schema_migrations_status()` RPC.
3. Verify Edge Functions (`stripe-payment-intent`, `stripe-webhook`, `twilio-sms`, `push-notification`, `bootstrap-first-admin`) against test sandbox keys.
- **Depends On**: Docker/Supabase CLI or GitHub Actions runner.

## Stage 2 — Remove Remaining Fake Operational Data & Dead Controls
**Goal**: Eliminate non-showcase fake literals and dead UI buttons without altering layouts.
1. [Page19CustomerProfile.tsx](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/admin_web/src/pages/module4/Page19CustomerProfile.tsx#L727): Replace `Nov 11, 2026 • Card Ending 4892` with real payment metadata from `payments` or clean empty state.
2. [TechJobExecutionScreen.kt](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/technician/TechJobExecutionScreen.kt#L155): Replace `Text("Gate Code: #4892")` with booking `access_notes` or hide when empty.
3. Flutter dead handlers (`live_dispatch_radar_screen.dart:255`, `app_header.dart:113`): Wire real actions or remove inert `onPressed: () {}` buttons.
4. Mobile external Unsplash URLs (`2` in Flutter, `4` in Android Kotlin): Replace with Supabase `tenant-assets` URLs or bundled/clean avatar fallback.
5. Gate or remove `Pitch Demo Active` (`TopNavbar.tsx:124`) and `demoDataLoader.ts` from production buyer builds.
- **Depends On**: None (can run in parallel after Stage 1 sign-off).

## Stage 3 — Backend Schema & Persistence for the 8 Local-State Web Modules + 8 Operational `setTimeout` Pages
**Goal**: Make all Admin & Staff Web operational modules genuinely multi-user and PostgreSQL-backed.
1. Add new Supabase migration (`06_admin_operations_and_settings.sql`) with `ENABLE` + `FORCE ROW LEVEL SECURITY` and tenant-scoped policies for missing tables (`support_tickets`, `refund_cases`, `pricing_rules`, `platform_settings`, `website_content`, `invoices` view/table).
2. Wire `AdminContext.tsx` (`staffMembers` → `users`, `reviews` → `reviews`, plus the newly migrated tables) to `supabaseService` with real error handling.
3. Replace the `8` operational `setTimeout` simulations (`Page03`, `Page12`, `Page33`, `Page36`, `StaffActivityStream`, `StaffDailyReport`, `StaffEmergencyHandover`, `StaffLiveDispatch`) with awaited Supabase/Edge Function calls.
- **Depends On**: Stage 1 (live PostgreSQL verification pipeline green).

## Stage 4 — Flutter & Native Android Security Hardening, Builds & Tests
**Goal**: Prove both mobile apps compile, pass tests, and store tokens securely.
1. Flutter (`serviceos/`): Wire `flutter_secure_storage` into Supabase session persistence; run `flutter analyze`, `flutter test`, `flutter build apk --release` / `appbundle`.
2. Native Android (`serviceos_android/`): Enable `isMinifyEnabled = true`, add ProGuard rules, release `signingConfig` parameterization (env-driven, no committed keystore), and `EncryptedSharedPreferences`; run `./gradlew test assembleRelease`.
- **Depends On**: Stage 2 mobile fixes + Flutter/Java SDK environment.

## Stage 5 — Reproducible AWS Infrastructure-as-Code & Buyer Handover Package
**Goal**: Enable buyer-independent AWS deployment without seller accounts or Render.
1. Add `amplify.yml` and/or AWS CloudFormation/Terraform (`S3 + CloudFront + ACM + Route53 + Secrets Manager` option) for `admin_web/`.
2. Clean up `oxlint` warnings (`509`), organize/prune internal `audit_report/` scratch history, verify licensing/IP checklist, and execute `scripts/handover_cleanup.cjs` **only at final release gate**.
- **Depends On**: Stages 1–4 complete and verified.
