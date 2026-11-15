# THIRD-PARTY LICENSES AND SERVICES — Dependencies, Accounts & Buyer Duties

**Document No.**: `24 / 25`  
**Version**: `1.0.0`  
**Last Updated**: November 15, 2026

---

## 1. Open-Source Dependency Licenses Inventory

All third-party libraries declared in [`admin_web/package.json`](../admin_web/package.json), [`serviceos/pubspec.yaml`](../serviceos/pubspec.yaml), and [`serviceos_android/app/build.gradle.kts`](../serviceos_android/app/build.gradle.kts) use permissive open-source licenses (**MIT**, **Apache-2.0**, **BSD-2-Clause**, **BSD-3-Clause**, **ISC**) with **zero viral copyleft (`GPL`/`AGPL`) runtime dependencies**:

| Subsystem | Packages | Licenses |
| :--- | :--- | :--- |
| **Web Portal (`admin_web`)** | `react`, `react-dom`, `@supabase/supabase-js`, `recharts`, `clsx`, `tailwind-merge`, `tailwindcss`, `vite`, `oxlint` (**MIT**); `leaflet` (**BSD-2-Clause**); `lucide-react` (**ISC**); `typescript`, `playwright`, `puppeteer-core` (**Apache-2.0**) | Permissive (**MIT / BSD / ISC / Apache-2.0**) |
| **Flutter Mobile (`serviceos`)** | `supabase_flutter`, `flutter_riverpod`, `dio`, `flutter_svg`, `cached_network_image`, `lucide_icons`, `geolocator`, `uuid` (**MIT**); `flutter`, `go_router`, `shared_preferences`, `flutter_secure_storage`, `intl` (**BSD-3-Clause**); `google_fonts`, `latlong2` (**Apache-2.0**) | Permissive (**MIT / BSD / Apache-2.0**) |
| **Native Android (`serviceos_android`)** | `androidx.core`, `androidx.lifecycle`, `androidx.activity`, `androidx.compose.*`, `androidx.navigation`, `kotlinx-coroutines-android`, `kotlinx-serialization-json`, `io.coil-kt:coil-compose` | Permissive (**Apache-2.0**) |

---

## 2. Design Assets & External Image URL Disclosure

- **Bundled First-Party Assets**: `design_references/`, `serviceos/assets/`, and `admin_web/public/` are original project assets governed by [`LICENSE`](../LICENSE).
- **External Unsplash Image URLs (`images.unsplash.com`)**:
  - In `admin_web`: Production baseline ([`mockData.ts`](../admin_web/src/data/mockData.ts)) uses `0` external URLs. The optional 1-Click Showcase Pitch Mode ([`demoDataLoader.ts`](../admin_web/src/data/demoDataLoader.ts) lines 63, 79, 95, 111, 127) references 5 public Unsplash URLs.
  - In `serviceos` (Flutter): 3 avatar/thumbnail fallback URLs exist in [`live_dispatch_radar_screen.dart`](../serviceos/lib/features/dispatch/presentation/screens/live_dispatch_radar_screen.dart#L182), [`customer_profile_screen.dart`](../serviceos/lib/features/profile/presentation/screens/customer_profile_screen.dart#L141), and [`app_header.dart`](../serviceos/lib/shared/components/app_header.dart#L147).
  - In `serviceos_android` (Kotlin): 12 public Unsplash image URLs are referenced in [`ServiceRepository.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/data/repository/ServiceRepository.kt) (lines 36–106) and 4 screens (`InAppChatScreen.kt`, `CustomerProfileScreen.kt`, `LiveDispatchRadarScreen.kt`, `ServiceDetailScreen.kt`).
  - All Unsplash URLs are governed by the [Unsplash License](https://unsplash.com/license); buyers deploying in offline or strict CSP environments should replace those URLs with self-hosted Supabase Storage URLs or local bundled assets.

---

## 3. External Accounts & Buyer Responsibilities

Because no live cloud accounts or private API keys are bundled in a source-code sale, the Buyer is responsible for provisioning:

1. **Supabase Account** ([supabase.com](https://supabase.com)) — Required for PostgreSQL 16 + PostGIS database, GoTrue Auth, Storage (`job-evidence` bucket), and Realtime sync.
2. **Static Web Hosting Account** (Vercel, Netlify, Cloudflare Pages, or AWS) — Required to host `admin_web/dist` over HTTPS.
3. **Google Play Console ($25) & Apple Developer Program ($99/yr)** — Required to sign and publish mobile binaries to the app stores.
4. **Stripe Connect & Twilio Accounts + Server-Side Edge Functions** — Required if the Buyer wishes to implement live credit card capture/payouts and live SMS carrier delivery (currently **`NOT IMPLEMENTED`** in server-side code).
