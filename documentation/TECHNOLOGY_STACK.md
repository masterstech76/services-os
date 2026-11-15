# TECHNOLOGY STACK — Frameworks, Languages & Versions

**Document No.**: `08 / 25`  
**Version**: `1.0.0`  
**Last Updated**: November 15, 2026

---

## 1. Web Portal ([`admin_web/package.json`](../admin_web/package.json))

| Package / Tool | Declared Version | Role in `admin_web` | Verification Status |
| :--- | :--- | :--- | :--- |
| `react` / `react-dom` | `^19.3.1` | Core UI rendering and context state | **`VERIFIED`** |
| `typescript` | `~7.0.2` | Static typechecking (`tsc -b`) across 94 `.tsx`/`.ts` files | **`VERIFIED`** |
| `vite` / `@vitejs/plugin-react` | `^8.3.6` / `^6.1.2` | Dev server and production bundle compiler | **`VERIFIED`** |
| `tailwindcss` / `@tailwindcss/postcss` | `^4.3.5` | Utility CSS framework | **`VERIFIED`** |
| `@supabase/supabase-js` | `^2.119.0` | Supabase Auth, PostgREST, and Realtime client | **`PARTIALLY VERIFIED` (Build `VERIFIED` / Live Cloud `NOT VERIFIED`)** |
| `leaflet` / `@types/leaflet` | `^1.9.4` / `^1.9.22` | Interactive dispatch maps (`RealDispatchMap.tsx`, `Page02LiveOperations.tsx`, `StaffLiveDispatch.tsx`) | **`VERIFIED`** |
| `recharts` | `^3.10.1` | Executive revenue & KPI charts (`Page01MainDashboard.tsx`, `Page26FinancialDashboard.tsx`) | **`VERIFIED`** |
| `lucide-react` | `^1.72.0` | Vector icon set | **`VERIFIED`** |
| `clsx` / `tailwind-merge` | `^2.1.1` / `^3.7.0` | Conditional class merging | **`VERIFIED`** |
| `oxlint` | `^1.90.0` | Static linter (`npm run lint`) | **`VERIFIED`** |
| `playwright` / `puppeteer-core` | `^1.65.1` / `^25.17.0` | Headless browser verification (`npm test`) | **`VERIFIED`** |

---

## 2. Flutter Mobile Application ([`serviceos/pubspec.yaml`](../serviceos/pubspec.yaml))

| Package | Declared Version | Role in `serviceos` | Verification Status |
| :--- | :--- | :--- | :--- |
| Dart SDK / Flutter SDK | `>=3.0.0 <4.0.0` / `>=3.19.0` | Cross-platform iOS & Android framework (45 `.dart` files) | **Static Syntax `VERIFIED` / Native Compiler `BLOCKED` (`NOT VERIFIED`)** |
| `supabase_flutter` | `^2.8.0` | Supabase Auth, PostGIS RPC calls, Realtime streams | **Source Wired / Live Cloud `NOT VERIFIED`** |
| `flutter_riverpod` | `^2.5.1` | State management providers (`lib/data/providers/`) | **Static Syntax `VERIFIED` / Native Compiler `BLOCKED`** |
| `go_router` | `^14.2.0` | Declarative navigation | **Static Syntax `VERIFIED` / Native Compiler `BLOCKED`** |
| `dio` | `^5.4.3+1` | HTTP networking client | **Static Syntax `VERIFIED` / Native Compiler `BLOCKED`** |
| `shared_preferences` / `flutter_secure_storage` | `^2.2.3` / `^9.2.2` | Local persistence & secure key storage | **Static Syntax `VERIFIED` / Native Compiler `BLOCKED`** |
| `geolocator` / `latlong2` | `^12.0.0` / `^0.9.1` | GPS coordinates & distance calculations | **Static Syntax `VERIFIED` / Native Compiler `BLOCKED`** |
| `google_fonts`, `flutter_svg`, `cached_network_image`, `lucide_icons`, `intl`, `uuid` | `^6.2.1`, `^2.0.10+1`, `^3.3.1`, `^0.257.0`, `^0.19.0`, `^4.4.0` | UI rendering, icons, formatting, and UUIDs | **Static Syntax `VERIFIED` / Native Compiler `BLOCKED`** |

---

## 3. Native Android Application ([`serviceos_android/app/build.gradle.kts`](../serviceos_android/app/build.gradle.kts))

| Dependency | Declared Version | Role in `serviceos_android` | Verification Status |
| :--- | :--- | :--- | :--- |
| Kotlin / JVM Target / Android SDK | Kotlin `1.9.x`, JVM `17`, `compileSdk = 34`, `minSdk = 26`, Compose Compiler `1.5.11` | Native Android compilation (37 `.kt` files) | **Static Syntax `VERIFIED` / Gradle Build `BLOCKED` (`NOT VERIFIED`)** |
| `androidx.compose:compose-bom` | `2024.04.00` | Jetpack Compose Material 3 UI toolkit | **Static Syntax `VERIFIED` / Gradle Build `BLOCKED`** |
| `androidx.navigation:navigation-compose` | `2.7.7` | Compose navigation graph (`ServiceOSNavigation.kt`) | **Static Syntax `VERIFIED` / Gradle Build `BLOCKED`** |
| `kotlinx-coroutines-android` & `kotlinx-serialization-json` | `1.8.0` & `1.6.3` | Coroutines and JSON serialization | **Static Syntax `VERIFIED` / Gradle Build `BLOCKED`** |
| `io.coil-kt:coil-compose` | `2.6.0` | Asynchronous image loading | **Static Syntax `VERIFIED` / Gradle Build `BLOCKED`** |

---

## 4. Database Layer ([`supabase/migrations/`](../supabase/migrations/))

- **PostgreSQL `16+`** with **`postgis` (`3.4+`)**, **`uuid-ossp`**, and **`pgcrypto`** extensions (`843` lines across 3 migration files: 19 tables, 1 view, 5 PostGIS/escrow functions, 7 security functions).
- **Verification Status**: Static SQL syntax **`VERIFIED`** via [`scripts/validate_migrations.cjs`](../scripts/validate_migrations.cjs); live PostgreSQL execution **`BLOCKED` / `NOT VERIFIED`** on local audit host (no `psql`/`docker` installed).
