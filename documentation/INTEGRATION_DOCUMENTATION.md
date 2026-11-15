# INTEGRATION DOCUMENTATION — Supabase, Maps, Stripe & Twilio Status

**Document No.**: `16 / 25`  
**Version**: `1.0.0`  
**Last Updated**: November 15, 2026

---

## 1. Evidence-Based Integration Matrix

Every integration in **ServicePro OS** is classified below using strict evidence-based statuses:

| Integration | Codebase Location | Verification Classification | Exact Technical Reality |
| :--- | :--- | :--- | :--- |
| **1. Leaflet & OpenStreetMap / Carto Tiles** | [`RealDispatchMap.tsx`](../admin_web/src/components/common/RealDispatchMap.tsx), [`Page02LiveOperations.tsx`](../admin_web/src/pages/module1/Page02LiveOperations.tsx), [`StaffLiveDispatch.tsx`](../admin_web/src/pages/staff/StaffLiveDispatch.tsx) | **`VERIFIED` (`IMPLEMENTED AND VERIFIED`)** | Renders interactive maps, technician pins, and job markers in the browser with zero API key required. Verified via headless Edge (`npm test`). |
| **2. Supabase Auth, Database & Realtime (`admin_web` & `serviceos`)** | [`admin_web/src/services/supabaseClient.ts`](../admin_web/src/services/supabaseClient.ts), [`serviceos/lib/core/network/supabase_service.dart`](../serviceos/lib/core/network/supabase_service.dart), [`supabase_remote_datasource.dart`](../serviceos/lib/data/datasources/supabase_remote_datasource.dart) | **`PARTIALLY VERIFIED` (`IMPLEMENTED — LIVE PROVIDER NOT VERIFIED`)** | Client methods for Auth (`signIn`, `signUp`, `signOut`), table queries/upserts (`categories`, `services`, `bookings`, `users`, `customer_profiles`, `provider_profiles`, `job_evidence`, `security_audit_logs`), PostGIS RPCs (`find_nearest_technicians`, `verify_arrival_geofence`, `release_escrow_to_technician`), and Realtime channels (`serviceos_shared_dispatch`, `tech_dispatch_*`, `booking_live_*`) are implemented and schema-aligned in TypeScript and Dart. Live cloud execution remains **`NOT VERIFIED`** on the audit host. |
| **3. Native Android Persistence & Cloud Sync (`serviceos_android`)** | [`BookingRepository.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/data/repository/BookingRepository.kt), [`MainActivity.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/MainActivity.kt) | **`PARTIALLY VERIFIED` (`IMPLEMENTED — NATIVE BUILD & LIVE CLOUD NOT VERIFIED`)** | `BookingRepository.kt` implements durable on-device `SharedPreferences` JSON persistence (`serviceos_android_prefs`), reactive `StateFlow<List<Booking>>`, and `HttpURLConnection` REST/RPC sync (`syncFromSupabase`, `releaseEscrowRemote`) with Supabase. Static Kotlin syntax is **`VERIFIED`** (`npm run validate-mobile`), while Gradle compilation and live cloud execution remain **`BLOCKED` / `NOT VERIFIED`**. |
| **4. Stripe & Stripe Connect Edge Functions (`stripe-payment-intent`, `stripe-webhook`)** | [`supabase/functions/stripe-payment-intent/index.ts`](../supabase/functions/stripe-payment-intent/index.ts), [`supabase/functions/stripe-webhook/index.ts`](../supabase/functions/stripe-webhook/index.ts), [`supabaseClient.ts`](../admin_web/src/services/supabaseClient.ts) | **`PARTIALLY VERIFIED` (`IMPLEMENTED — LIVE PROVIDER NOT VERIFIED`)** | Server-side Deno Edge Functions implement Stripe `PaymentIntent` creation (`capture_method: 'manual'`, 15% Connect fee) and HMAC-SHA256 `Stripe-Signature` webhook verification (updating `public.payments` and `public.bookings`), plus `supabaseService.createPaymentIntent()` on the client. Live Stripe API execution is **`NOT VERIFIED`** (requires Buyer's `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`). |
| **5. Twilio SMS Edge Function (`twilio-sms`)** | [`supabase/functions/twilio-sms/index.ts`](../supabase/functions/twilio-sms/index.ts), [`DirectSMSComposerModal.tsx`](../admin_web/src/components/modals/DirectSMSComposerModal.tsx), [`supabaseClient.ts`](../admin_web/src/services/supabaseClient.ts) | **`PARTIALLY VERIFIED` (`IMPLEMENTED — LIVE PROVIDER NOT VERIFIED`)** | Server-side Deno Edge Function authenticates the caller's Supabase JWT, dispatches SMS via the Twilio Messages REST API, and records delivery in `public.security_audit_logs`. [`DirectSMSComposerModal.tsx`](../admin_web/src/components/modals/DirectSMSComposerModal.tsx) invokes `supabaseService.sendSms()` and displays an explicit warning if the cloud gateway is unconfigured. Live carrier delivery is **`NOT VERIFIED`**. |
| **6. Transactional Email & Push Notification Edge Function (`push-notification`)** | [`supabase/functions/push-notification/index.ts`](../supabase/functions/push-notification/index.ts), [`Page36PaymentNotificationConfig.tsx`](../admin_web/src/pages/module8/Page36PaymentNotificationConfig.tsx) | **`PARTIALLY VERIFIED` (`IMPLEMENTED — LIVE PROVIDER NOT VERIFIED`)** | Server-side Deno Edge Function dispatches FCM push notifications (`FCM_SERVER_KEY`) and Resend transactional emails (`RESEND_API_KEY`). Live provider delivery is **`NOT VERIFIED`**. |

---

## 2. How the Buyer Deploys the Supabase Edge Functions (`supabase/functions/`)

All secret keys (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `FCM_SERVER_KEY`, `RESEND_API_KEY`) remain strictly server-side inside **Supabase Vault / Edge Function Secrets**:
1. **`supabase functions deploy stripe-payment-intent`**: Creates Stripe `PaymentIntent` records using `STRIPE_SECRET_KEY`.
2. **`supabase functions deploy stripe-webhook --no-verify-jwt`**: Verifies `Stripe-Signature` using `STRIPE_WEBHOOK_SECRET` and updates `public.bookings.escrow_status` and `public.payments.status`.
3. **`supabase functions deploy twilio-sms`**: Called by [`DirectSMSComposerModal.tsx`](../admin_web/src/components/modals/DirectSMSComposerModal.tsx) to send outbound SMS messages via the Twilio REST API.
4. **`supabase functions deploy push-notification`**: Dispatches FCM push notifications and transactional emails.
