# PROJECT OVERVIEW — Scope, Personas & Application Modules

**Document No.**: `03 / 25`  
**Version**: `1.0.0`  
**Last Updated**: November 15, 2026

---

## 1. Product Purpose

**ServicePro OS** is a home services management software platform designed for organizations that dispatch field technicians (plumbing, electrical, HVAC, appliance repair, cleaning, locksmith, and handyman services) to residential and commercial customers.

---

## 2. Application Modules & Personas

The repository contains four client application modules and one database migration layer:

| Module | Directory | Target Persona(s) | Exact Page / File Count | Runtime & Persistence Mode |
| :--- | :--- | :--- | :--- | :--- |
| **1. Admin Web Control Panel** | [`admin_web/src/pages/`](../admin_web/src/pages/) | `ADMIN` | **38 Pages** (`#/page/1`–`36` + `#/page/37` Profile + `#/page/38` Installer) across **94 `.ts`/`.tsx` files** in `admin_web/src/` | React 19 SPA; hybrid `localStorage` + `@supabase/supabase-js` |
| **2. Staff Web Operations Panel** | [`admin_web/src/pages/staff/`](../admin_web/src/pages/staff/) | `STAFF` | **14 Pages** (`#/staff/101`–`113` + `#/staff/114` Profile) | React 19 SPA; role-separated hash routes within `admin_web` |
| **3. Flutter Mobile App** | [`serviceos/lib/`](../serviceos/lib/) | `CUSTOMER` & `TECHNICIAN` | **45 Dart files** (**22 Screen files** under `lib/features/`) | Flutter 3 / Dart 3; hybrid local fixture fallback + `supabase_flutter` RPC/Realtime |
| **4. Native Android Mobile App** | [`serviceos_android/app/src/`](../serviceos_android/app/src/) | `CUSTOMER` & `TECHNICIAN` | **37 Kotlin files** (**22 Screen files** under `ui/common`, `ui/customer`, `ui/technician`) | Kotlin + Jetpack Compose; standalone UI using static in-memory `object` lists (`BookingRepository.kt`, `ServiceRepository.kt` — cloud & disk storage `NOT IMPLEMENTED`) |
| **5. Database & PostGIS Layer** | [`supabase/migrations/`](../supabase/migrations/) | All Personas (via RLS) | **3 SQL files** (`843` lines: **19 tables**, **1 view**, **5 PostGIS/escrow RPCs**, **7 security functions**) | PostgreSQL 16 + PostGIS + Row-Level Security (RLS) |

---

## 3. Reconciling Page, Screen & Table Counts Across the Repository

1. **Web Portal (`52` Total Routable Pages)**:
   - **Admin Portal (`38` Pages)**: Pages `1`–`36` defined in [`admin_web/src/data/pagesMaster.ts`](../admin_web/src/data/pagesMaster.ts) and routed in [`admin_web/src/pages/PageRouter.tsx`](../admin_web/src/pages/PageRouter.tsx), plus **Page 37** ([`FacebookProfilePage.tsx`](../admin_web/src/pages/shared/FacebookProfilePage.tsx)) and **Page 38** ([`SystemInstallerPage.tsx`](../admin_web/src/pages/commercial/SystemInstallerPage.tsx)).
   - **Staff Portal (`14` Pages)**: Pages `101`–`113` defined in [`admin_web/src/data/staffPagesMaster.ts`](../admin_web/src/data/staffPagesMaster.ts) and routed in [`admin_web/src/pages/staff/StaffPageRouter.tsx`](../admin_web/src/pages/staff/StaffPageRouter.tsx), plus **Staff Page 114** ([`FacebookProfilePage.tsx`](../admin_web/src/pages/shared/FacebookProfilePage.tsx)).
   - All **52/52** pages are verified to render without console/page errors by [`admin_web/verify_all_49_pages_production.cjs`](../admin_web/verify_all_49_pages_production.cjs) (`npm test`).
2. **Mobile Applications (`22` Screen Files Each in Flutter & Android)**:
   - **5 Shared Screens**: Splash, Role Gateway, Login, In-App Chat, Common Utilities.
   - **11 Customer Screens**: Customer Discover, Category Feed, Global Search, Service Detail, Booking Wizard, My Bookings, Live Dispatch Radar, Work Order Completion, Invoice Receipt, Customer Profile, Support Help.
   - **6 Technician Screens**: Tech Onboarding, Tech Dashboard, Tech Broadcast Alert, Tech Job Execution, Tech History, Tech Wallet.
3. **Database Layer (`19` Tables + `1` View Across `843` Lines)**:
   - `14` core tables in [`01_initial_schema.sql`](../supabase/migrations/01_initial_schema.sql) (`326` lines) + `5` security tables and `1` view (`service_categories`) in [`03_security_rbac_and_rls.sql`](../supabase/migrations/03_security_rbac_and_rls.sql) (`300` lines), plus `5` PL/pgSQL functions in [`02_postgis_functions.sql`](../supabase/migrations/02_postgis_functions.sql) (`217` lines).
