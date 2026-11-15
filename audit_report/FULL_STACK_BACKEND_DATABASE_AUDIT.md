# Report 4 — Full-Stack, Backend & Database Audit

**Database Objects Verified Statically**: `22` tables (`22/22` RLS + `FORCE RLS` on `21` Phase 1/2 tables + `stripe_webhook_events`), `47` functions, `3` triggers (`CREATE TRIGGER`), `94` active RLS policies, `5` Edge Functions, `2` private Storage buckets (`job-evidence`, `tenant-assets`).

---

## 1. End-to-End Architecture Trace

| Workflow | Frontend -> State -> Service -> Backend -> DB -> RLS/Trigger | Status |
|---|---|---|
| **Admin/Staff Login & MFA** | `LoginPage.tsx` -> `AdminContext.login()` -> `supabaseClient.ts` (`signIn` + `verify_my_mfa_code`) -> GoTrue + `public.users` + `user_mfa_sessions` -> `is_admin()`/`is_staff()` | **COMPLETE IN CODE / LIVE CI PENDING** |
| **First-Admin Bootstrap** | `LoginPage.tsx` -> `bootstrap-first-admin/index.ts` (`X-Bootstrap-Token`, `pg_advisory_xact_lock`) -> `tenants` + `users` + `user_mfa_credentials` | **COMPLETE IN CODE / LIVE CI PENDING** |
| **Booking Create & Sync** | Web `CreateJobModal` / Flutter `booking_repository.dart` -> `bookings` -> RLS tenant + role policies -> Realtime | **COMPLETE IN CODE / LIVE CI PENDING** |
| **Extra-Parts Approval** | Flutter `approveExtraParts()` -> `rpc('approve_booking_extra_parts')` -> `calculate_booking_financials` + `servicepro.trusted_rpc` -> `bookings` | **COMPLETE IN CODE / LIVE CI PENDING** |
| **Stripe PaymentIntent** | Client -> `stripe-payment-intent/index.ts` -> `bookings` ownership check -> `calculate_booking_financials` -> `provider_profiles.stripe_connect_id` -> Stripe API (`Idempotency-Key`) | **COMPLETE IN CODE / LIVE TEST PENDING** |
| **Stripe Webhook Sync** | Stripe -> `stripe-webhook/index.ts` (multi-`v1` HMAC) -> `stripe_webhook_events` (`tenant_id`, `23505` dedup) -> `payments` + `bookings` (`HELD_IN_ESCROW`) | **COMPLETE IN CODE / LIVE TEST PENDING** |
| **Escrow Release & PIN** | Web `verifyBookingEscrow` / Flutter `completeWorkOrderWithSignature` / Android `releaseEscrowRemote` -> `rpc('release_escrow_to_technician')` -> `ESCROW_ALREADY_RELEASED` guard -> `bookings` | **COMPLETE IN CODE / LIVE CI PENDING** |
| **SMS & Push Notifications** | `twilio-sms/index.ts` (`ADMIN`/`STAFF`, E.164, 10/60s rate limit) & `push-notification/index.ts` (JWT `getUser`, FCM HTTP v1 RS256 OAuth2) -> `security_audit_logs` | **COMPLETE IN CODE / LIVE TEST PENDING** |
| **Invoices / Tickets / Reviews / Payouts / Refunds / CMS** | `AdminContext.tsx` / `Page29` / `Page30` | **FRONTEND-ONLY (`localStorage` / React state)** — DB tables `reviews` & `payments` exist in `01_initial_schema.sql` without full Admin Web CRUD wiring |

---

## 2. Database Tables Without Full Admin Web Consumers
- `reviews` (`01_initial_schema.sql`): `Page33CustomerReviewsManagement.tsx` reads `AdminContext` local state rather than querying `public.reviews`.
- `booking_parts` & `inventory_items` (`01_initial_schema.sql`): `inventory_items` has no active Supabase CRUD integration in `AdminContext.tsx`.
- `audit_logs` vs `security_audit_logs`: `AdminContext.tsx` stores UI audit logs locally rather than fetching `security_audit_logs` from Supabase.

## 3. Critical Verification Gap
- Neither `docker` nor `psql` is installed on the local Windows host, and GitHub Actions workflow `.github/workflows/security-live-verification.yml` failed on `d1670d6` (`#1`) and `fcf3de4` (`#2`). Therefore, **all 5 SQL migrations (`01`–`05`), `36` pgTAP assertions (`22` Phase 1 + `14` Phase 2), and `5` Edge Functions remain unverified at runtime**.
