# TESTING AND QA REPORT — Verified Evidence vs. Blocked Checks

**Document No.**: `21 / 25`  
**Version**: `1.0.0`  
**Last Updated**: November 15, 2026

---

## 1. Executed & `VERIFIED` Tests (With Exact Tool Evidence)

All commands below were executed on the local audit machine (`Windows`, `Node.js v24.12.0`, `npm 11.6.2`) on November 15, 2026:

| Command | Script / Tool | Scope Tested | Verdict | Recorded Output Evidence |
| :--- | :--- | :--- | :--- | :--- |
| `npm run build` | `tsc -b && vite build` | `admin_web/src` (94 `.tsx`/`.ts` files) | **`VERIFIED` (`PASS`)** | `✓ 2589 modules transformed.` Built in `739ms` with `0` TypeScript or bundler errors. |
| `npm run lint` | `oxlint` | `admin_web` (98 files, 116 rules) | **`VERIFIED` (`PASS`)** | `Found 514 warnings and 0 errors. Finished in 116ms on 98 files.` |
| `npm run verify-env` | [`scripts/validate_migrations.cjs`](../scripts/validate_migrations.cjs) | `01_initial_schema.sql` (`326`L), `02_postgis_functions.sql` (`217`L), `03_security_rbac_and_rls.sql` (`300`L) | **`VERIFIED` (Static Syntax `PASS`)** | `Parentheses balance = 0, inString = false, inDollarQuote = false` across all 3 SQL files (`843` lines). |
| `npm run validate-mobile` | [`scripts/validate_dart_codebase.cjs`](../scripts/validate_dart_codebase.cjs) | `serviceos/lib` (45 `.dart` files) & `serviceos_android` (37 `.kt` files) | **`VERIFIED` (Static Syntax `PASS`)** | `SUCCESS: All 45 Dart source files and 37 Kotlin source files passed structural and syntax checks!` |
| `npm test` | [`admin_web/verify_all_49_pages_production.cjs`](../admin_web/verify_all_49_pages_production.cjs) (Headless MS Edge via Puppeteer) | All **38 Admin Pages** (`#/page/1`–`38`) + all **14 Staff Pages** (`#/staff/101`–`114`) + SQLi search bar interception | **`VERIFIED` (`52/52 PASS`)** | `AUDIT COMPLETE: 52/52 PAGES PASSED WITH 0 ERRORS (Admin Portal: 38/38 Passed, Staff Portal: 14/14 Passed, Total Console / Page Errors: 0)` |
| `npm run test:commercial` | [`admin_web/verify_commercial_turnkey_suite.cjs`](../admin_web/verify_commercial_turnkey_suite.cjs) | Pitch Mode, Customer/Tech Mobile Simulators, Tri-Party Dispatch Simulator, White-Label Customizer, System Installer (`#/installer`) | **`VERIFIED` (`PASS`)** | All 6 turnkey simulator and installer checks passed with `0` runtime errors. |

---

## 2. Exact Scope of the 52-Page Browser Audit (`npm test`)

To ensure buyers do not over-interpret what `npm test` ([`admin_web/verify_all_49_pages_production.cjs`](../admin_web/verify_all_49_pages_production.cjs)) covers:
- **What It Verifies**:
  1. Launches a real headless Chromium/Edge browser (`1440x900`) and attaches `console.error` and `pageerror` listeners.
  2. Seeds an authenticated `ADMIN` session in `localStorage` and navigates sequentially to `#/page/1` through `#/page/38`.
  3. Seeds an authenticated `STAFF` session in `localStorage` and navigates sequentially to `#/staff/101` through `#/staff/114`.
  4. On every single page (`52/52`), evaluates `document.body.innerText` and DOM headings (`h1, h2`) to verify the React component tree mounted, rendered non-empty content, produced `0` instances of `NaN`, `undefined`, `[object Object]`, or React Error Boundary messages, and threw `0` console/runtime exceptions.
  5. Types an SQL injection payload (`' OR 1=1 -- UNION SELECT * FROM users`) into the `#/staff/101` search bar and verifies that `apiSecurity.ts` blocks and logs the threat.
- **What It Does Not Verify (`PARTIALLY VERIFIED` / `NOT VERIFIED`)**:
  - It runs against **unconfigured local browser mode (`localStorage`)**, not against a live Supabase cloud database.
  - It performs route-render and runtime-error verification across all 52 pages, plus interactive modal/simulator clicks in `npm run test:commercial`, rather than submitting every CRUD form across all 52 pages against a live PostgreSQL backend.

---

## 3. `NOT VERIFIED` & `BLOCKED` Checks (Missing Host Tooling or Cloud Instance)

| Check | Required Tool / Environment | Why It Was Blocked | Current Classification |
| :--- | :--- | :--- | :--- |
| **Flutter Static Analysis, Unit Tests & Binary Build** | `flutter analyze`, `flutter test`, `flutter build apk` / `ipa` | `flutter` and `dart` CLI binaries are not installed on the local Windows audit machine. | **`BLOCKED` / `NOT VERIFIED`** |
| **Native Android Gradle Compilation & Lint** | `./gradlew assembleDebug`, `./gradlew assembleRelease`, `./gradlew lint` | `java` (JDK 17) and Android SDK / `gradle` are not installed on the local Windows audit machine. | **`BLOCKED` / `NOT VERIFIED`** |
| **Live PostgreSQL 16 + PostGIS Execution** | `psql` / Docker PostgreSQL 16 + PostGIS 3.4 or live Supabase project | `psql` and `docker` are not installed on the audit host, and no live Supabase URL/key is pre-configured. | **`BLOCKED` / `NOT VERIFIED`** |
| **Multi-Account Server-Side RLS Verification** | Live Supabase instance with separate `ADMIN`, `STAFF`, `CUSTOMER`, and `TECHNICIAN` JWTs | Requires live Supabase database execution (`03_security_rbac_and_rls.sql`). | **`BLOCKED` / `NOT VERIFIED`** |
