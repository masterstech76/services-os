# Report 5 — Fake, Demo, Dead, Placeholder, and Simulated Feature Audit

> **Audit Mode**: Strict Read-Only Evidence-Based Audit  
> **Scope**: `admin_web/src/`, `serviceos/lib/`, `serviceos_android/app/src/`, `supabase/`, `scripts/` (`198` source files scanned)  
> **Verdict**: **NON-COMPLIANT FOR CLEAN COMMERCIAL HANDOVER** — While `TODO_FIXME` hits = `0` and `npm run verify:data-env` exits `0`, `15` `setTimeout` simulations, `11` external Unsplash/demo image URLs, `2` empty `onPressed: () {}` handlers, `1` hardcoded card-ending string (`Card Ending 4892`), `1` hardcoded Android gate-code string (`Gate Code: #4892`), and local-only `AdminContext` modules remain.

---

## 1. Summary Scan Results (`198` Source Files)

| Scan Category | Total Hits | Production UI Impact | Verification Status |
|---|---:|---|---|
| `TODO` / `FIXME` / `UnimplementedError` (`TODO_FIXME`) | `0` | None | Verified via scan |
| `setTimeout` simulated async/action delays (`SET_TIMEOUT_SIM`) | `15` | `8` operational pages + `3` modals + `2` login/context + `1` export utility | Verified via scan |
| External Unsplash / demo image URLs (`UNSPLASH_OR_DEMO_IMG`) | `11` | `5` in `demoDataLoader.ts`, `2` in Flutter, `4` in Android Kotlin | Verified via scan |
| Empty button handlers (`EMPTY_HANDLER`) | `2` | `2` dead UI buttons in Flutter (`live_dispatch_radar_screen.dart`, `app_header.dart`) | Verified via scan |
| Hardcoded PIN / Card / Example literals (`HARDCODED_PIN_OR_EXAMPLE`) | `4` direct UI/data hits (+ test/simulator fixtures) | `1` Customer Profile card string, `1` Android Tech screen gate code, `2` input placeholders/hints | Verified via scan |
| Demo / Pitch mode toggles (`DEMO_LOADER_OR_PITCH`) | `2` | `TopNavbar.tsx` (`Pitch Demo Active`), `AdminContext.tsx` (`getShowcaseDemoData`) | Verified via scan |

---

## 2. Simulated Async Actions (`setTimeout` — 15 Hits)

Several admin/staff pages and modals use `setTimeout(...)` to simulate network requests, dispatch handovers, report generation, or payment gateway saves instead of awaiting real PostgreSQL/Edge Function mutations.

| File & Line | Component / Area | Nature of Simulation | Commercial Impact |
|---|---|---|---|
| `admin_web/src/components/DispatchSimulatorModal.tsx:50` | Commercial Showcase Modal | Simulated tri-party dispatch sequence | Expected for interactive showcase modal, but must stay isolated from production |
| `admin_web/src/components/MobileSimulatorModal.tsx:63` | Commercial Showcase Modal | Simulated mobile customer/tech preview | Expected for showcase modal |
| `admin_web/src/components/SessionLockModal.tsx:48` | Session Lock Modal | Delayed UI state feedback | Minor UX delay |
| `admin_web/src/context/AdminContext.tsx:403` | Global Admin Context | Timed state transition | Needs replacement with real Supabase mutation confirmation |
| `admin_web/src/pages/LoginPage.tsx:166, 707` | Auth Entry | Timed transition / UI feedback | Minor (`LoginPage` also calls `supabaseService` auth) |
| `admin_web/src/pages/Page03TodayActivity.tsx:83` | Today Activity Stream | Simulated refresh/action delay | Operational page appears live without real backend round-trip |
| `admin_web/src/pages/Page12ManualDispatchHandover.tsx:33` | Manual Dispatch Handover | Simulated dispatch handover delay | High-risk operational workflow uses timed UI feedback |
| `admin_web/src/pages/Page33CustomerReviewsManagement.tsx:64` | Reviews Management | Simulated moderation/reply delay | Reviews are React state/`localStorage`-only, not persisted to Supabase |
| `admin_web/src/pages/Page36PaymentNotificationConfig.tsx:142` | Payment & Notification Config | Simulated config save delay | Payment/notification settings not persisted to `platform_settings` table |
| `admin_web/src/pages/StaffActivityStream.tsx:71` | Staff Activity Stream | Simulated refresh delay | Staff portal simulation |
| `admin_web/src/pages/StaffDailyReport.tsx:29` | Staff Daily Report | Simulated report generation delay | Report export/generation relies on client-side state |
| `admin_web/src/pages/StaffEmergencyHandover.tsx:51` | Staff Emergency Handover | Simulated emergency handover delay | Operational safety workflow uses timed UI delay |
| `admin_web/src/pages/StaffLiveDispatch.tsx:32` | Staff Live Dispatch | Simulated dispatch action delay | Operational dispatch relies on client-side timer |
| `admin_web/src/utils/exportUtils.ts:56` | Export Utility | Timed download cleanup/feedback | Utility behavior |

---

## 3. Hardcoded External Image URLs (`UNSPLASH_OR_DEMO_IMG` — 11 Hits)

External `images.unsplash.com` URLs or hardcoded demo image references create broken-asset risk offline and signal template/demo heritage rather than buyer-hosted Supabase `tenant-assets` storage:

1. **Web Demo Loader (`admin_web/src/utils/demoDataLoader.ts`)**: Lines `63`, `79`, `95`, `111`, `127` (isolated to showcase/pitch demo loader, only loaded when Pitch Demo is activated).
2. **Flutter Mobile (`serviceos/lib/`)**:
   - `live_dispatch_radar_screen.dart:184` — hardcoded external image URL on radar/technician card instead of reading `technician.avatarUrl` from Supabase.
   - `app_header.dart:147` — hardcoded external avatar/brand image URL instead of tenant/user profile asset.
3. **Native Android (`serviceos_android/app/src/`)**:
   - `InAppChatScreen.kt:55` — hardcoded external avatar URL.
   - `CustomerProfileScreen.kt:63` — hardcoded external profile avatar URL.
   - `LiveDispatchRadarScreen.kt:92` — hardcoded external technician photo URL.
   - `ServiceDetailScreen.kt:36` — hardcoded external service banner URL.

---

## 4. Dead UI Controls (`EMPTY_HANDLER` — 2 Hits)

| File & Line | Control | Defect |
|---|---|---|
| `serviceos/lib/.../live_dispatch_radar_screen.dart:255` | `onPressed: () {}` | Button renders interactively in Flutter UI but performs zero action on tap |
| `serviceos/lib/.../app_header.dart:113` | `onPressed: () {}` | Header action button renders interactively in Flutter UI but performs zero action on tap |

---

## 5. Hardcoded Operational / PIN / Card Literals (`4` Hits)

| File & Line | Literal / Context | Classification | Required Action |
|---|---|---|---|
| `admin_web/src/pages/Page19CustomerProfile.tsx:727` | `Nov 11, 2026 • Card Ending 4892` | **DEFECT (Hardcoded Fake Payment Metadata)** | Replace with real Stripe `payment_method_last4` / `created_at` from `payments` table or an empty-state message when no card is on file |
| `serviceos_android/.../TechJobExecutionScreen.kt:155` | `Text("Gate Code: #4892")` | **DEFECT (Hardcoded Operational Access Code)** | Bind dynamically to job/booking `access_notes` or hide when empty |
| `serviceos/lib/.../booking_wizard_screen.dart:193` | `hintText` (`4892` example in input hint) | **Acceptable UI Hint** | Optional: replace with generic placeholder text (`e.g. gate code`) to eliminate scanner false positives |
| `admin_web/src/components/CreateCustomerDrawer.tsx:115` | `placeholder` attribute | **Acceptable UI Hint** | Non-operational form placeholder |

---

## 6. Local-Only / Unpersisted Modules in `AdminContext.tsx`

Although `categories`, `services`, `bookings`, `customers`, `technicians`, `auth`, and `subscribeToRealtime` call `supabaseService.*`, the following collections in `AdminContext.tsx` remain **React state / `localStorage`-only** and do not persist across browsers or buyers' devices:
- `staffMembers`
- `invoices`
- `tickets`
- `reviews`
- `refundCases`
- `pricingConfig`
- `platformSettings`
- `websiteContent`

Additionally, `TopNavbar.tsx:124` exposes `isDemoMode ? 'Pitch Demo Active' : 'Clean Production'` backed by `getShowcaseDemoData` (`AdminContext.tsx:4`). While clean production mode defaults to empty/real data, a buyer purchasing a **$20,000+** SaaS product expects either a clear super-admin feature flag or complete removal of pitch-demo toggles from the production operator navbar.

---

## 7. Audit Conclusion

1. Production code contains **0** `TODO`/`FIXME` stubs, and static `verify:data-env` passes.
2. However, **operational workflows are not yet 100% real**: `8` Web pages still run `setTimeout` simulations, `8` `AdminContext` modules only persist to `localStorage`/React state, `2` Flutter buttons have empty `onPressed: () {}` handlers, `6` mobile UI screens embed hardcoded external/Unsplash URLs, and `2` screens (`Page19CustomerProfile.tsx:727`, `TechJobExecutionScreen.kt:155`) display hardcoded `4892` card/gate strings.
3. None of these files were modified during this read-only audit. All must be remediated before commercial release.
