# Report 7 — Web, Flutter, and Native Android Client Audit

> **Audit Mode**: Strict Read-Only Evidence-Based Audit  
> **Scope**: `admin_web/` (`111` files, `54` pages / `52` audited routes), `serviceos/` (`56` files, `45` `.dart`), `serviceos_android/` (`44` files, `37` `.kt`)  
> **Verdict**: **WEB PARTIALLY WIRED (BUILD/TEST PASSES) / FLUTTER & ANDROID UNCOMPILED ON THIS HOST (`flutter`, `dart`, `java` UNAVAILABLE)**

---

## 1. Platform Readiness Summary

| Client App | Maintained Files | Code Files | Build / Compile Evidence | Runtime / UI Test Evidence | Overall Status |
|---|---:|---:|---|---|---|
| **Admin Web (`admin_web/`)** | `111` | `54` `.tsx` pages (`52` routes) | `npm run build` (`vite 8.3.6`, `0` errors), `npm run lint` (`0` errors, `509` warnings) | `npm test` (`52/52` Playwright, `0` console errors); `npm run test:commercial` (exit `0`) | **Builds & UI Tests Pass; `8` Context Modules Local-Only; `8` Pages Use `setTimeout`** |
| **Flutter Mobile (`serviceos/`)** | `56` | `45` `.dart` files | **NOT BUILT** (`flutter` / `dart` SDK not installed on host); `validate-mobile` structural scan passed | **NOT TESTED** (`flutter test` not run) | **BLOCKED (Uncompiled) + `2` Empty Handlers + `2` Unsplash URLs + Unused `flutter_secure_storage`** |
| **Native Android (`serviceos_android/`)** | `44` | `37` `.kt` files | **NOT BUILT** (`java` / Gradle JDK not installed on host); `validate-mobile` structural scan passed | **NOT TESTED** (No instrumentation/unit tests run) | **BLOCKED (Uncompiled) + `isMinifyEnabled = false` + `4` Unsplash URLs + Hardcoded `Gate Code: #4892`** |

---

## 2. Admin & Staff Web Portal (`admin_web/`)

### 2.1 Architecture & Dependencies (`admin_web/package.json`)
- Stack: `react ^19.3.1`, `@supabase/supabase-js ^2.119.0`, `vite ^8.3.6`, `oxlint ^1.90.0`, `playwright ^1.65.1`.
- Zero production vulnerabilities (`npm --prefix admin_web audit --omit=dev --json`: `0` total).
- Routing: `52` audited Playwright routes (`38` Admin + `14` Staff) across `54` `.tsx` files in `admin_web/src/pages/`.

### 2.2 Backend Wiring vs. Local-Only State
- Only `LoginPage.tsx` and `SystemInstallerPage.tsx` import `supabaseService` directly; all other pages consume `AdminContext` (`useAdmin()`).
- **Wired to Supabase in `AdminContext.tsx`**: `categories`, `services`, `bookings`, `customers`, `technicians`, `auth`, and `subscribeToRealtime`.
- **Unwired (`localStorage` / React state only)**: `staffMembers`, `invoices`, `tickets`, `reviews`, `refundCases`, `pricingConfig`, `platformSettings`, and `websiteContent`.
- **Simulated Timers (`setTimeout`)**: Present in `Page03TodayActivity.tsx:83`, `Page12ManualDispatchHandover.tsx:33`, `Page33CustomerReviewsManagement.tsx:64`, `Page36PaymentNotificationConfig.tsx:142`, `StaffActivityStream.tsx:71`, `StaffDailyReport.tsx:29`, `StaffEmergencyHandover.tsx:51`, `StaffLiveDispatch.tsx:32`, `AdminContext.tsx:403`, `LoginPage.tsx:166,707`, `SessionLockModal.tsx:48`, `DispatchSimulatorModal.tsx:50`, `MobileSimulatorModal.tsx:63`, `exportUtils.ts:56`.
- **Hardcoded Data Defect**: `Page19CustomerProfile.tsx:727` renders `Nov 11, 2026 • Card Ending 4892`.
- **Lint Debt**: `509` `oxlint` warnings remain across the TypeScript/React codebase (even though error count is `0`).

---

## 3. Flutter Mobile App (`serviceos/`)

### 3.1 Architecture & Dependencies (`serviceos/pubspec.yaml`)
- Stack: `supabase_flutter`, `flutter_riverpod`, `go_router`, `dio`, `shared_preferences`, `flutter_secure_storage: ^9.2.2`, `geolocator`, `latlong2`.
- **Compilation Gap**: `flutter` and `dart` are unavailable on the audit host. Only static structural validation (`npm run validate-mobile` across `45` `.dart` files) ran. **No APK, AAB, IPA, or `flutter analyze` / `flutter test` output exists.**

### 3.2 Specific Defects Found in Flutter Source
1. **Dead UI Controls (`2` hits)**:
   - `live_dispatch_radar_screen.dart:255`: `onPressed: () {}`
   - `app_header.dart:113`: `onPressed: () {}`
2. **Hardcoded External / Unsplash URLs (`2` hits)**:
   - `live_dispatch_radar_screen.dart:184`
   - `app_header.dart:147`
3. **Unused Security Package**:
   - `pubspec.yaml:28` declares `flutter_secure_storage: ^9.2.2`, but **0** Dart files import or instantiate it.
4. **Placeholder Hint**:
   - `booking_wizard_screen.dart:193` uses `4892` inside `hintText` (UI hint only, low risk, worth sanitizing to generic text).

---

## 4. Native Android App (`serviceos_android/`)

### 4.1 Build Configuration (`serviceos_android/app/build.gradle.kts`)
- `compileSdk = 34`, `minSdk = 26`, `targetSdk = 34`.
- **Compilation Gap**: `java` / Android SDK is unavailable on the audit host; `./gradlew assembleRelease` and unit/UI tests have **not** been executed.
- **Release Hardening Defects (`build.gradle.kts:25`)**:
  - `isMinifyEnabled = false` on `release` build type.
  - No `signingConfig` block configured for release builds.
  - No `EncryptedSharedPreferences` (`security-crypto`) configured.

### 4.2 Specific Defects Found in Kotlin Source
1. **Hardcoded Operational Gate Code**:
   - `TechJobExecutionScreen.kt:155`: `Text("Gate Code: #4892")` — hardcoded literal instead of reading booking access instructions.
2. **Hardcoded External / Unsplash URLs (`4` hits)**:
   - `InAppChatScreen.kt:55`
   - `CustomerProfileScreen.kt:63`
   - `LiveDispatchRadarScreen.kt:92`
   - `ServiceDetailScreen.kt:36`

---

## 5. Multi-Client Parity Conclusion

- **Admin Web** is the most mature client (`52/52` Playwright UI tests pass with `0` console errors), yet still relies on `localStorage` for `8` secondary modules and `setTimeout` on `8` operational pages.
- **Flutter** and **Native Android** cannot be certified as compilable or runnable on this machine until `flutter build` / `flutter analyze` / `flutter test` and `./gradlew assembleRelease` are executed in a valid SDK environment and the dead handlers, hardcoded URLs, `Gate Code: #4892`, and security gaps are fixed.
