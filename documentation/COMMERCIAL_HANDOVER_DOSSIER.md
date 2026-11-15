# COMMERCIAL HANDOVER DOSSIER — Buyer Executive Summary

**Document No.**: `02 / 25`  
**Version**: `1.0.0`  
**Last Updated**: November 15, 2026

---

## 1. Executive Summary & Nature of Delivery

This dossier accompanies the commercial handover of the **ServicePro OS v1.0.0** software repository.

### Source-Code / IP Transfer vs. Deployed SaaS Product
The Buyer is acquiring **source code, database schema migrations, design assets, and automated test scripts**—not a turnkey live cloud infrastructure with pre-configured merchant accounts. To transition from source-code handover to live public production, the Buyer must provision their own cloud accounts (Supabase, web hosting CDN, Apple/Google developer accounts, Stripe, Twilio), complete mobile/database toolchain verification, and implement live payment/SMS Edge Functions.

---

## 2. Five Essential Pre-Acquisition Disclosures

1. **The Native Android App (`serviceos_android/`) Is an Independent UI Prototype**:
   - Unlike the Flutter app (`serviceos/`), which integrates `supabase_flutter`, the Kotlin Jetpack Compose app (`serviceos_android/`) uses static in-memory Kotlin `object` declarations (`BookingRepository.kt` with `sampleBookings = emptyList()` and `ServiceRepository.kt` with static category/service lists). It does **not** use `SharedPreferences` or connect to Supabase, and is **not** a cloud-connected equivalent of the Flutter app.
2. **Exact 19-Table + 1-View Database Inventory Across `843` SQL Lines**:
   - [`01_initial_schema.sql`](../supabase/migrations/01_initial_schema.sql) (`326` lines) creates **14 tables** (`tenants`, `users`, `customer_profiles`, `customer_addresses`, `provider_profiles`, `categories`, `services`, `bookings`, `payments`, `job_evidence`, `inventory_items`, `booking_parts`, `reviews`, `audit_logs`).
   - [`02_postgis_functions.sql`](../supabase/migrations/02_postgis_functions.sql) (`217` lines) creates **5 PL/pgSQL functions** (`find_nearest_technicians`, `get_nearby_technicians`, `calculate_booking_financials`, `verify_arrival_geofence`, `release_escrow_to_technician`).
   - [`03_security_rbac_and_rls.sql`](../supabase/migrations/03_security_rbac_and_rls.sql) (`300` lines) creates **5 security tables** (`user_mfa_credentials`, `security_audit_logs`, `auth_rate_limits`, `password_reset_tokens`, `auth_otps`) and **1 view** (`service_categories`).
3. **Exact Scope of the 52-Page Browser Audit (`npm test`)**:
   - [`admin_web/verify_all_49_pages_production.cjs`](../admin_web/verify_all_49_pages_production.cjs) renders all **38 Admin Pages** (`#/page/1`–`38`) and all **14 Staff Pages** (`#/staff/101`–`114`) in headless Chromium/Edge and verifies DOM headings, non-empty rendering, `0` `NaN`/`undefined`/`[object Object]` errors, `0` console/page exceptions, and SQLi search interception. It runs in local storage mode and does not replace live cloud E2E testing.
4. **Local Fallback Storage vs. Durable Cloud Persistence**:
   - When `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are not configured, `admin_web` operates in **local browser storage mode (`localStorage`)**. Mutations in [`AdminContext.tsx`](../admin_web/src/context/AdminContext.tsx) explicitly toast `"saved to local browser storage"`. Local browser data is stored only on that single browser/device and is not synchronized across users until Supabase Cloud is connected and schema-to-client payloads are aligned (see [`KNOWN_ISSUES_AND_LIMITATIONS.md`](KNOWN_ISSUES_AND_LIMITATIONS.md)).
5. **Honest Commercial Readiness Certificate**:
   - Source-code handover is prepared with full documentation of outstanding integration (`NOT IMPLEMENTED`), schema-to-client alignment (`PARTIALLY VERIFIED`), and build/database toolchain (`BLOCKED` / `NOT VERIFIED`) items—not a blanket claim that the entire product is independently certified for live production.

---

## 3. Classification Summary Matrix

| Subsystem / Capability | Classification | Evidence / Exact Explanation |
| :--- | :--- | :--- |
| **Admin Web Control Panel (38 Pages)** | **`VERIFIED`** | Compiles via `tsc -b && vite build` (`0` errors); all 38 pages (`#/page/1`–`38`) verified in headless Edge via `npm test` (`52/52` total web pages passed). |
| **Staff Web Operations Panel (14 Pages)** | **`VERIFIED`** | Compiles via `tsc -b && vite build` (`0` errors); all 14 pages (`#/staff/101`–`114`) verified in headless Edge via `npm test`. |
| **Clean Zero-Fake-Data Baseline** | **`VERIFIED`** | Regex scan across all `.tsx`, `.ts`, `.dart`, `.kt`, and `.sql` files confirms `0` instances of fictitious names (`Carlos Martinez`, `Sarah Jenkins`, `Marcus Vance`), `0` `555-` phone numbers, and `0` sample addresses (`1420 Ocean Drive`). |
| **Honest Local vs. Cloud Persistence Toasts** | **`VERIFIED`** | In [`AdminContext.tsx`](../admin_web/src/context/AdminContext.tsx), when Supabase is unconfigured, toasts explicitly state `"saved to local browser storage"`. When configured, cloud success is only toasted if the async Supabase promise resolves `true`. |
| **Supabase Client & Schema Alignment** | **`PARTIALLY VERIFIED`** | Client CRUD/Auth/Realtime code is written in [`supabaseClient.ts`](../admin_web/src/services/supabaseClient.ts) and [`supabase_remote_datasource.dart`](../serviceos/lib/data/datasources/supabase_remote_datasource.dart), but live cloud execution is **`NOT VERIFIED`**, and specific upsert column/role payloads require alignment with `01`–`03` migrations (documented in [`KNOWN_ISSUES_AND_LIMITATIONS.md`](KNOWN_ISSUES_AND_LIMITATIONS.md)). |
| **Flutter Mobile Source Code (`serviceos/`)** | **`BLOCKED` / `NOT VERIFIED` (Binary Build)** | All 45 `.dart` files (22 screen files) pass static validation (`npm run validate-mobile`), but `flutter analyze`, `flutter test`, and `flutter build` were **blocked** because the Flutter/Dart SDK is not installed on the audit host. |
| **Native Android Source Code (`serviceos_android/`)** | **`BLOCKED` / `NOT VERIFIED` (Binary Build)** | All 37 `.kt` files (22 screen files) pass static validation (`npm run validate-mobile`), but `./gradlew assembleRelease` was **blocked** because JDK 17 / Android SDK are not installed on the audit host. Cloud & local storage persistence in `serviceos_android` are **`NOT IMPLEMENTED`**. |
| **PostgreSQL 16 + PostGIS Migrations (`supabase/migrations/`)** | **`BLOCKED` / `NOT VERIFIED` (Live DB Execution)** | All 3 SQL files (`843` lines, 19 tables, 1 view, 5 PostGIS/escrow RPCs) pass static syntax validation (`npm run verify-env`), but live `psql` execution and multi-role RLS testing were **blocked** on the audit host. |
| **Stripe Connect, Twilio SMS, SMTP & FCM** | **`NOT IMPLEMENTED`** | Database columns and UI modals exist, but live server-side Stripe, Twilio, SMTP, and FCM integrations are **not implemented**. |
