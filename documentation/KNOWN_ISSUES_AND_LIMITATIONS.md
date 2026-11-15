# KNOWN ISSUES AND LIMITATIONS — Complete Technical Disclosure

**Document No.**: `22 / 25`  
**Version**: `1.0.0`  
**Last Updated**: November 15, 2026

---

## 1. Bugs Resolved Prior to Handover (`VERIFIED` Fixed)

1. **`admin_web/src/types/index.ts` (`TS2339`)**: Added missing `notes?: string` property to `Customer` interface so [`Page19CustomerProfile.tsx`](../admin_web/src/pages/module4/Page19CustomerProfile.tsx) compiles cleanly under `tsc -b`.
2. **`admin_web/src/context/AdminContext.tsx` (Honest Persistence Toasts)**: Updated entity mutation methods (`addService`, `updateService`, `deleteService`, `verifyBooking`, `addCustomer`, `updateCustomer`, `addTechnician`, `updateTechnician`, `addCategory`, `updateCategory`, `updateBookingStatus`, `createBooking`) so unconfigured local saves explicitly toast `"saved to local browser storage"`, and configured cloud saves only toast `"synced to cloud database"` if the async Supabase call resolves `true` (toasting a warning if cloud sync fails).
3. **`admin_web/verify_all_49_pages_production.cjs` (Page Count Reconciliation)**: Updated E2E browser audit loop to test all **38 Admin Pages** (`#/page/1`–`38`) and all **14 Staff Pages** (`#/staff/101`–`114`) = **52/52 pages**, and removed `555-` phone numbers from the test script.
4. **`serviceos/lib/features/support/presentation/screens/support_help_screen.dart`**: Fixed invalid `isScrollable: true` parameter on `showModalBottomSheet` to `isScrollControlled: true` and wired ticket submission controllers.
5. **`serviceos/lib/features/common/presentation/screens/in_app_chat_screen.dart`**: Fixed `NetworkImage` crash when given local asset path `'assets/images/banner_woman.png'`.
6. **`serviceos/lib/features/technicians/presentation/screens/tech_onboarding_screen.dart`**: Fixed `TextEditingController` instantiation inside `build()` by switching to `TextFormField(initialValue: ...)`.
7. **`serviceos_android/.../BookingRepository.kt`**: Emptied hardcoded sample bookings (`sampleBookings = emptyList()`).
8. **`serviceos_android/.../BookingWizardScreen.kt` & `TechOnboardingScreen.kt`**: Wired interactive `remember { mutableStateOf("") }` state to `OutlinedTextField` inputs that previously had no-op `onValueChange = {}` handlers.
9. **`supabase/migrations/03_security_rbac_and_rls.sql` (19/19 Table RLS & 47 Policies)**: Enabled `ROW LEVEL SECURITY` across all **19 tables** (`19/19`), defined **47 ownership-, tenant-, and role-scoped policies**, and updated `public.current_user_role()` to resolve roles from `public.users` (`is_active = TRUE`) rather than trusting client-editable `user_metadata`.
10. **`admin_web/src/services/supabaseClient.ts` & `serviceos/lib/data/` (Schema & RPC Alignment)**: Aligned `saveTechnician` (`role: 'TECHNICIAN'` + `provider_profiles` upsert), `saveBooking` (`safety_pin` + cents breakdown), `saveCategory` (`image_url` + `short_title` + `priority_rank`), `saveService` (removed non-existent `tenant_id` column and resolved `category_id`), and Flutter `booking_repository.dart` (`total_authorized_cents`, `release_escrow_to_technician`, `verify_arrival_geofence`, and `captured_by_user_id` on `job_evidence`).
11. **`serviceos_android/.../BookingRepository.kt` & `MainActivity.kt` (Durable Persistence & REST Sync)**: Upgraded `BookingRepository.kt` from an in-memory `emptyList()` to durable `SharedPreferences` JSON storage (`serviceos_android_prefs`) with `StateFlow<List<Booking>>` and `HttpURLConnection` Supabase REST/RPC sync (`syncFromSupabase`, `releaseEscrowRemote`).
12. **`supabase/functions/` (Server-Side Payment, Webhook, SMS & Push Edge Functions)**: Implemented [`stripe-payment-intent`](../supabase/functions/stripe-payment-intent/index.ts), [`stripe-webhook`](../supabase/functions/stripe-webhook/index.ts), [`twilio-sms`](../supabase/functions/twilio-sms/index.ts), and [`push-notification`](../supabase/functions/push-notification/index.ts), and wired [`DirectSMSComposerModal.tsx`](../admin_web/src/components/modals/DirectSMSComposerModal.tsx) to invoke `supabaseService.sendSms()`.

---

## 2. Unverified & Blocked Items (`BLOCKED` / `NOT VERIFIED` Due to Host Environment)

| ID | Area | Description | Required Buyer Action |
| :--- | :--- | :--- | :--- |
| **UNV-01** | **Flutter Native Compilation (`serviceos/`)** | Static syntax across all 45 `.dart` files passed `validate_dart_codebase.cjs`, but `flutter analyze` and `flutter build apk/ipa` were blocked because the Flutter SDK is not installed on the audit host. | Run `flutter pub get && flutter analyze && flutter build apk` on a machine with Flutter `>=3.19.0`. |
| **UNV-02** | **Native Android Gradle Build (`serviceos_android/`)** | Static syntax across all 37 `.kt` files passed `validate_dart_codebase.cjs`, but `./gradlew assembleDebug` was blocked because JDK 17 and the Android SDK are not installed on the audit host. | Open `serviceos_android/` in Android Studio (JDK 17, SDK 34) and run `./gradlew assembleDebug`. |
| **UNV-03** | **Live PostgreSQL + PostGIS Migration & Multi-Role RLS Testing** | All 3 SQL files (`1,214` lines, `19/19` RLS tables, `47` policies) passed `validate_migrations.cjs`, but live execution and multi-role RLS testing (`ADMIN`, `STAFF`, `CUSTOMER`, `TECHNICIAN`) were blocked because `psql`/`docker` and a live Supabase project were unavailable. | Execute `01`–`03` in Supabase SQL Editor and run the RLS test query in [`AUTHENTICATION_AND_RBAC.md`](AUTHENTICATION_AND_RBAC.md). |
| **UNV-04** | **Live Edge Function Provider Execution (`supabase/functions/`)** | Deno Edge Functions (`stripe-payment-intent`, `stripe-webhook`, `twilio-sms`, `push-notification`) are implemented in `supabase/functions/`, but live execution against Stripe, Twilio, FCM, and Resend APIs is **`NOT VERIFIED`** without live provider API keys. | Deploy via `supabase functions deploy` and configure `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `FCM_SERVER_KEY`, and `RESEND_API_KEY` in Supabase Secrets. |
| **UNV-05** | **Non-Blocking Linter Warnings & Main Chunk Size** | `npm run lint` reports `0` errors and `509` unused-import warnings; `npm run build` outputs an `871.80 kB` (`151.83 kB` gzipped) main page chunk. | Optional code cleanup: remove unused Lucide icon imports and add `React.lazy()` route splitting if desired. |
