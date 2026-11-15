# MOBILE APPLICATION GUIDE — Flutter (`serviceos`) & Native Android (`serviceos_android`)

**Document No.**: `19 / 25`  
**Version**: `1.0.0`  
**Last Updated**: November 15, 2026

---

## 1. Critical Buyer Comparison: Flutter (`serviceos`) vs. Native Android (`serviceos_android`)

This repository contains two separate mobile codebases implementing the 22 Customer, Technician, and Shared screens. **A buyer must understand that `serviceos_android` is an independent standalone UI implementation, not a cloud-connected equivalent of the Flutter `serviceos` app**:

| Attribute | 1. Flutter Cross-Platform App (`serviceos/`) | 2. Native Android App (`serviceos_android/`) |
| :--- | :--- | :--- |
| **Target Platforms** | Android & iOS | Android Only (`minSdk 26`, `targetSdk 34`) |
| **Language & UI Framework** | Dart 3 / Flutter 3 (`45` `.dart` files) | Kotlin / Jetpack Compose Material 3 (`37` `.kt` files) |
| **Screen File Count** | **22 Screen files** under `serviceos/lib/features/` | **22 Screen files** under `serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/` |
| **Cloud Backend Integration** | **Implemented in Source Code**: Uses `supabase_flutter` ([`supabase_service.dart`](../serviceos/lib/core/network/supabase_service.dart), [`supabase_remote_datasource.dart`](../serviceos/lib/data/datasources/supabase_remote_datasource.dart), [`booking_repository.dart`](../serviceos/lib/data/repositories/booking_repository.dart)) to query `categories`, `services`, `bookings`, upload to `job-evidence` storage, call PostGIS RPC `find_nearest_technicians`, and subscribe to Realtime streams when `--dart-define=SUPABASE_URL` is provided. | **`NOT IMPLEMENTED`**: Uses static in-memory Kotlin `object` declarations ([`BookingRepository.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/data/repository/BookingRepository.kt) with `sampleBookings = emptyList()` and [`ServiceRepository.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/data/repository/ServiceRepository.kt) with static category/service lists). Does **not** persist data across restarts or connect to Supabase. |
| **Static Code Verification** | **`VERIFIED`** via `npm run validate-mobile` ([`scripts/validate_dart_codebase.cjs`](../scripts/validate_dart_codebase.cjs)) | **`VERIFIED`** via `npm run validate-mobile` ([`scripts/validate_dart_codebase.cjs`](../scripts/validate_dart_codebase.cjs)) |
| **Native Binary Compilation** | **`NOT VERIFIED` (`BLOCKED` on Audit Host)** — `flutter` and `dart` CLI are not installed on the audit machine. | **`NOT VERIFIED` (`BLOCKED` on Audit Host)** — `gradle` and `java` (JDK 17) are not installed on the audit machine. |

---

## 2. Mobile Personas & Dual-Vision Design Language

Both mobile codebases strictly enforce the project's two mobile personas (**Customer** and **Technician** — selected on [`role_gateway_screen.dart`](../serviceos/lib/features/authentication/presentation/screens/role_gateway_screen.dart) / [`RoleGatewayScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/common/RoleGatewayScreen.kt)) and implement the **Dual-Vision Theme Engine**:
- **Day Vision (Light Mode)**: `#F8FAFC` slate canvas, `#FFFFFF` elevated cards, `#6366F1` Royal Purple & `#7C3AED` Vivid Violet accents.
- **Night Vision (OLED Dark Mode)**: `#060B14` obsidian background, `#0C1523` surface cards.

---

## 3. Customer Mobile Workflow (11 Customer Screens + 5 Shared Screens)

1. **Shared Onboarding, Auth & Utilities (5 Screens)**:
   - [`splash_screen.dart`](../serviceos/lib/features/onboarding/presentation/screens/splash_screen.dart) / [`SplashScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/common/SplashScreen.kt)
   - [`role_gateway_screen.dart`](../serviceos/lib/features/authentication/presentation/screens/role_gateway_screen.dart) / [`RoleGatewayScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/common/RoleGatewayScreen.kt)
   - [`login_screen.dart`](../serviceos/lib/features/authentication/presentation/screens/login_screen.dart) / [`LoginScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/common/LoginScreen.kt)
   - [`in_app_chat_screen.dart`](../serviceos/lib/features/common/presentation/screens/in_app_chat_screen.dart) / [`InAppChatScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/common/InAppChatScreen.kt)
   - [`common_utilities_screen.dart`](../serviceos/lib/features/common/presentation/screens/common_utilities_screen.dart) / [`CommonUtilitiesScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/common/CommonUtilitiesScreen.kt)
2. **Discovery & Search (4 Screens)**:
   - [`customer_discover_screen.dart`](../serviceos/lib/features/dashboard/presentation/screens/customer_discover_screen.dart) / [`CustomerDiscoverScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/customer/CustomerDiscoverScreen.kt)
   - [`category_feed_screen.dart`](../serviceos/lib/features/services/presentation/screens/category_feed_screen.dart) / [`CategoryFeedScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/customer/CategoryFeedScreen.kt)
   - [`global_search_screen.dart`](../serviceos/lib/features/services/presentation/screens/global_search_screen.dart) / [`GlobalSearchScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/customer/GlobalSearchScreen.kt)
   - [`service_detail_screen.dart`](../serviceos/lib/features/services/presentation/screens/service_detail_screen.dart) / [`ServiceDetailScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/customer/ServiceDetailScreen.kt)
3. **Booking, Live Tracking, Completion, Receipt, Profile & Support (7 Screens)**:
   - [`booking_wizard_screen.dart`](../serviceos/lib/features/bookings/presentation/screens/booking_wizard_screen.dart) / [`BookingWizardScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/customer/BookingWizardScreen.kt)
   - [`my_bookings_screen.dart`](../serviceos/lib/features/bookings/presentation/screens/my_bookings_screen.dart) / [`MyBookingsScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/customer/MyBookingsScreen.kt)
   - [`live_dispatch_radar_screen.dart`](../serviceos/lib/features/dispatch/presentation/screens/live_dispatch_radar_screen.dart) / [`LiveDispatchRadarScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/customer/LiveDispatchRadarScreen.kt)
   - [`work_order_completion_screen.dart`](../serviceos/lib/features/dispatch/presentation/screens/work_order_completion_screen.dart) / [`WorkOrderCompletionScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/customer/WorkOrderCompletionScreen.kt)
   - [`invoice_receipt_screen.dart`](../serviceos/lib/features/invoices/presentation/screens/invoice_receipt_screen.dart) / [`InvoiceReceiptScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/customer/InvoiceReceiptScreen.kt)
   - [`customer_profile_screen.dart`](../serviceos/lib/features/profile/presentation/screens/customer_profile_screen.dart) / [`CustomerProfileScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/customer/CustomerProfileScreen.kt)
   - [`support_help_screen.dart`](../serviceos/lib/features/support/presentation/screens/support_help_screen.dart) / [`SupportHelpScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/customer/SupportHelpScreen.kt)

---

## 4. Technician Mobile Workflow (6 Technician Screens)

1. [`tech_onboarding_screen.dart`](../serviceos/lib/features/technicians/presentation/screens/tech_onboarding_screen.dart) / [`TechOnboardingScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/technician/TechOnboardingScreen.kt) — 4-step provider onboarding (skills, license/insurance inputs, ID verification, payout setup).
2. [`tech_dashboard_screen.dart`](../serviceos/lib/features/technicians/presentation/screens/tech_dashboard_screen.dart) / [`TechDashboardScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/technician/TechDashboardScreen.kt) — Online duty toggle, `$0.00` clean initial earnings display, and active job queue.
3. [`tech_broadcast_screen.dart`](../serviceos/lib/features/technicians/presentation/screens/tech_broadcast_screen.dart) / [`TechBroadcastScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/technician/TechBroadcastScreen.kt) — 60-second proximity job broadcast alert showing net 85% payout.
4. [`tech_job_execution_screen.dart`](../serviceos/lib/features/technicians/presentation/screens/tech_job_execution_screen.dart) / [`TechJobExecutionScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/technician/TechJobExecutionScreen.kt) — 250m geofence + 4-digit PIN check-in UI, photo proof, extra parts, and customer signature.
5. [`tech_history_screen.dart`](../serviceos/lib/features/technicians/presentation/screens/tech_history_screen.dart) / [`TechHistoryScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/technician/TechHistoryScreen.kt) — Completed job history list.
6. [`tech_wallet_screen.dart`](../serviceos/lib/features/technicians/presentation/screens/tech_wallet_screen.dart) / [`TechWalletScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/technician/TechWalletScreen.kt) — Parameterized earnings ledger (`availableBalance = 0.00`, `ledgerEntries = const []`).
