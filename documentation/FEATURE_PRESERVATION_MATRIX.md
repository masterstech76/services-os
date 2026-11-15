# FEATURE PRESERVATION MATRIX — Complete Page, Screen & Table Inventory

**Document No.**: `05 / 25`  
**Version**: `1.0.0`  
**Last Updated**: November 15, 2026

---

## 1. Admin Web Control Panel (`38` Pages — Render & Console Verified via `npm test`)

All 38 Admin routes below are mapped in [`admin_web/src/pages/PageRouter.tsx`](../admin_web/src/pages/PageRouter.tsx) and [`admin_web/src/data/pagesMaster.ts`](../admin_web/src/data/pagesMaster.ts) and verified by [`admin_web/verify_all_49_pages_production.cjs`](../admin_web/verify_all_49_pages_production.cjs).

| Page ID | Hash Route | Page Name (`pagesMaster.ts`) | Source File (`admin_web/src/pages/`) | Playwright Render & Console Check (`npm test`) |
| :--- | :--- | :--- | :--- | :--- |
| **Page 01** | `#/page/1` | Main Admin Dashboard | [`module1/Page01MainDashboard.tsx`](../admin_web/src/pages/module1/Page01MainDashboard.tsx) | **`VERIFIED` (`[✓ P1]`)** |
| **Page 02** | `#/page/2` | Live Operations Dashboard | [`module1/Page02LiveOperations.tsx`](../admin_web/src/pages/module1/Page02LiveOperations.tsx) | **`VERIFIED` (`[✓ P2]`)** |
| **Page 03** | `#/page/3` | Today's Activity | [`module1/Page03TodayActivity.tsx`](../admin_web/src/pages/module1/Page03TodayActivity.tsx) | **`VERIFIED` (`[✓ P3]`)** |
| **Page 04** | `#/page/4` | Pending Work Overview | [`module1/Page04PendingWork.tsx`](../admin_web/src/pages/module1/Page04PendingWork.tsx) | **`VERIFIED` (`[✓ P4]`)** |
| **Page 05** | `#/page/5` | Critical Alerts Centre | [`module1/Page05CriticalAlerts.tsx`](../admin_web/src/pages/module1/Page05CriticalAlerts.tsx) | **`VERIFIED` (`[✓ P5]`)** |
| **Page 06** | `#/page/6` | All Bookings | [`module2/Page06AllBookings.tsx`](../admin_web/src/pages/module2/Page06AllBookings.tsx) | **`VERIFIED` (`[✓ P6]`)** |
| **Page 07** | `#/page/7` | New Booking Requests | [`module2/Page07NewBookingRequests.tsx`](../admin_web/src/pages/module2/Page07NewBookingRequests.tsx) | **`VERIFIED` (`[✓ P7]`)** |
| **Page 08** | `#/page/8` | Active Bookings | [`module2/Page08ActiveBookings.tsx`](../admin_web/src/pages/module2/Page08ActiveBookings.tsx) | **`VERIFIED` (`[✓ P8]`)** |
| **Page 09** | `#/page/9` | Booking Details | [`module2/Page09BookingDetails.tsx`](../admin_web/src/pages/module2/Page09BookingDetails.tsx) | **`VERIFIED` (`[✓ P9]`)** |
| **Page 10** | `#/page/10` | Booking Rescheduling | [`module2/Page10BookingRescheduling.tsx`](../admin_web/src/pages/module2/Page10BookingRescheduling.tsx) | **`VERIFIED` (`[✓ P10]`)** |
| **Page 11** | `#/page/11` | Dispatch Board | [`module2/Page11DispatchBoard.tsx`](../admin_web/src/pages/module2/Page11DispatchBoard.tsx) | **`VERIFIED` (`[✓ P11]`)** |
| **Page 12** | `#/page/12` | Manual Dispatch & Job Handover | [`module2/Page12ManualDispatchHandover.tsx`](../admin_web/src/pages/module2/Page12ManualDispatchHandover.tsx) | **`VERIFIED` (`[✓ P12]`)** |
| **Page 13** | `#/page/13` | All Services | [`module3/Page13AllServices.tsx`](../admin_web/src/pages/module3/Page13AllServices.tsx) | **`VERIFIED` (`[✓ P13]`)** |
| **Page 14** | `#/page/14` | Service Categories | [`module3/Page14ServiceCategories.tsx`](../admin_web/src/pages/module3/Page14ServiceCategories.tsx) | **`VERIFIED` (`[✓ P14]`)** |
| **Page 15** | `#/page/15` | Add / Edit Service | [`module3/Page15AddEditService.tsx`](../admin_web/src/pages/module3/Page15AddEditService.tsx) | **`VERIFIED` (`[✓ P15]`)** |
| **Page 16** | `#/page/16` | Service Details | [`module3/Page16ServiceDetails.tsx`](../admin_web/src/pages/module3/Page16ServiceDetails.tsx) | **`VERIFIED` (`[✓ P16]`)** |
| **Page 17** | `#/page/17` | Pricing Management | [`module3/Page17PricingManagement.tsx`](../admin_web/src/pages/module3/Page17PricingManagement.tsx) | **`VERIFIED` (`[✓ P17]`)** |
| **Page 18** | `#/page/18` | All Customers | [`module4/Page18AllCustomers.tsx`](../admin_web/src/pages/module4/Page18AllCustomers.tsx) | **`VERIFIED` (`[✓ P18]`)** |
| **Page 19** | `#/page/19` | Customer Profile | [`module4/Page19CustomerProfile.tsx`](../admin_web/src/pages/module4/Page19CustomerProfile.tsx) | **`VERIFIED` (`[✓ P19]`)** |
| **Page 20** | `#/page/20` | Customer Booking History | [`module4/Page20CustomerBookingHistory.tsx`](../admin_web/src/pages/module4/Page20CustomerBookingHistory.tsx) | **`VERIFIED` (`[✓ P20]`)** |
| **Page 21** | `#/page/21` | Customer Support Tickets | [`module4/Page21CustomerSupportTickets.tsx`](../admin_web/src/pages/module4/Page21CustomerSupportTickets.tsx) | **`VERIFIED` (`[✓ P21]`)** |
| **Page 22** | `#/page/22` | All Technicians | [`module5/Page22AllTechnicians.tsx`](../admin_web/src/pages/module5/Page22AllTechnicians.tsx) | **`VERIFIED` (`[✓ P22]`)** |
| **Page 23** | `#/page/23` | Technician Profile | [`module5/Page23TechnicianProfile.tsx`](../admin_web/src/pages/module5/Page23TechnicianProfile.tsx) | **`VERIFIED` (`[✓ P23]`)** |
| **Page 24** | `#/page/24` | Technician Availability & Working Hours | [`module5/Page24TechnicianAvailability.tsx`](../admin_web/src/pages/module5/Page24TechnicianAvailability.tsx) | **`VERIFIED` (`[✓ P24]`)** |
| **Page 25** | `#/page/25` | Technician Performance | [`module5/Page25TechnicianPerformance.tsx`](../admin_web/src/pages/module5/Page25TechnicianPerformance.tsx) | **`VERIFIED` (`[✓ P25]`)** |
| **Page 26** | `#/page/26` | Financial Dashboard | [`module6/Page26FinancialDashboard.tsx`](../admin_web/src/pages/module6/Page26FinancialDashboard.tsx) | **`VERIFIED` (`[✓ P26]`)** |
| **Page 27** | `#/page/27` | Transaction History | [`module6/Page27TransactionHistory.tsx`](../admin_web/src/pages/module6/Page27TransactionHistory.tsx) | **`VERIFIED` (`[✓ P27]`)** |
| **Page 28** | `#/page/28` | Customer Invoices | [`module6/Page28CustomerInvoices.tsx`](../admin_web/src/pages/module6/Page28CustomerInvoices.tsx) | **`VERIFIED` (`[✓ P28]`)** |
| **Page 29** | `#/page/29` | Technician Payouts | [`module6/Page29TechnicianPayouts.tsx`](../admin_web/src/pages/module6/Page29TechnicianPayouts.tsx) | **`VERIFIED` (`[✓ P29]`)** |
| **Page 30** | `#/page/30` | Refund Management | [`module6/Page30RefundManagement.tsx`](../admin_web/src/pages/module6/Page30RefundManagement.tsx) | **`VERIFIED` (`[✓ P30]`)** |
| **Page 31** | `#/page/31` | Support Ticket Dashboard | [`module7/Page31SupportTicketDashboard.tsx`](../admin_web/src/pages/module7/Page31SupportTicketDashboard.tsx) | **`VERIFIED` (`[✓ P31]`)** |
| **Page 32** | `#/page/32` | Ticket Details & Conversation | [`module7/Page32TicketDetailsConversation.tsx`](../admin_web/src/pages/module7/Page32TicketDetailsConversation.tsx) | **`VERIFIED` (`[✓ P32]`)** |
| **Page 33** | `#/page/33` | Customer Reviews Management | [`module7/Page33CustomerReviewsManagement.tsx`](../admin_web/src/pages/module7/Page33CustomerReviewsManagement.tsx) | **`VERIFIED` (`[✓ P33]`)** |
| **Page 34** | `#/page/34` | Website Content Management | [`module8/Page34WebsiteContentManagement.tsx`](../admin_web/src/pages/module8/Page34WebsiteContentManagement.tsx) | **`VERIFIED` (`[✓ P34]`)** |
| **Page 35** | `#/page/35` | General Platform Settings | [`module8/Page35GeneralPlatformSettings.tsx`](../admin_web/src/pages/module8/Page35GeneralPlatformSettings.tsx) | **`VERIFIED` (`[✓ P35]`)** |
| **Page 36** | `#/page/36` | Payment & Notification Configuration | [`module8/Page36PaymentNotificationConfig.tsx`](../admin_web/src/pages/module8/Page36PaymentNotificationConfig.tsx) | **`VERIFIED` (`[✓ P36]`)** |
| **Page 37** | `#/page/37` | Universal Profile Screen | [`shared/FacebookProfilePage.tsx`](../admin_web/src/pages/shared/FacebookProfilePage.tsx) | **`VERIFIED` (`[✓ P37]`)** |
| **Page 38** | `#/page/38` (`#/installer`) | System Health & Migrations Installer | [`commercial/SystemInstallerPage.tsx`](../admin_web/src/pages/commercial/SystemInstallerPage.tsx) | **`VERIFIED` (`[✓ P38]`)** |

---

## 2. Staff Web Operations Panel (`14` Pages — Render & Console Verified via `npm test`)

All 14 Staff routes below are mapped in [`admin_web/src/pages/staff/StaffPageRouter.tsx`](../admin_web/src/pages/staff/StaffPageRouter.tsx) and [`admin_web/src/data/staffPagesMaster.ts`](../admin_web/src/data/staffPagesMaster.ts).

| Staff ID | Hash Route | Page Name (`staffPagesMaster.ts`) | Source File (`admin_web/src/pages/`) | Playwright Render & Console Check (`npm test`) |
| :--- | :--- | :--- | :--- | :--- |
| **Staff 101** | `#/staff/101` | Staff Operations Dashboard | [`staff/StaffDashboard.tsx`](../admin_web/src/pages/staff/StaffDashboard.tsx) | **`VERIFIED` (`[✓ S101]`)** |
| **Staff 102** | `#/staff/102` | Order Intake Queue | [`staff/StaffOrderIntake.tsx`](../admin_web/src/pages/staff/StaffOrderIntake.tsx) | **`VERIFIED` (`[✓ S102]`)** |
| **Staff 103** | `#/staff/103` | Today's Work Activity | [`staff/StaffActivityStream.tsx`](../admin_web/src/pages/staff/StaffActivityStream.tsx) | **`VERIFIED` (`[✓ S103]`)** |
| **Staff 104** | `#/staff/104` | Order Assignment Board | [`staff/StaffOrderAssignment.tsx`](../admin_web/src/pages/staff/StaffOrderAssignment.tsx) | **`VERIFIED` (`[✓ S104]`)** |
| **Staff 105** | `#/staff/105` | Live Dispatch Radar | [`staff/StaffLiveDispatch.tsx`](../admin_web/src/pages/staff/StaffLiveDispatch.tsx) | **`VERIFIED` (`[✓ S105]`)** |
| **Staff 106** | `#/staff/106` | Technician Shift Availability | [`staff/StaffTechAvailability.tsx`](../admin_web/src/pages/staff/StaffTechAvailability.tsx) | **`VERIFIED` (`[✓ S106]`)** |
| **Staff 107** | `#/staff/107` | Emergency Order Handover | [`staff/StaffEmergencyHandover.tsx`](../admin_web/src/pages/staff/StaffEmergencyHandover.tsx) | **`VERIFIED` (`[✓ S107]`)** |
| **Staff 108** | `#/staff/108` | Active In-Progress Orders | [`staff/StaffActiveOrders.tsx`](../admin_web/src/pages/staff/StaffActiveOrders.tsx) | **`VERIFIED` (`[✓ S108]`)** |
| **Staff 109** | `#/staff/109` | Order Schedule & Calendar | [`staff/StaffScheduleCalendar.tsx`](../admin_web/src/pages/staff/StaffScheduleCalendar.tsx) | **`VERIFIED` (`[✓ S109]`)** |
| **Staff 110** | `#/staff/110` | Order Rescheduling Desk | [`staff/StaffRescheduleDesk.tsx`](../admin_web/src/pages/staff/StaffRescheduleDesk.tsx) | **`VERIFIED` (`[✓ S110]`)** |
| **Staff 111** | `#/staff/111` | Order Verification & Signatures | [`staff/StaffJobVerification.tsx`](../admin_web/src/pages/staff/StaffJobVerification.tsx) | **`VERIFIED` (`[✓ S111]`)** |
| **Staff 112** | `#/staff/112` | Customer Communication Desk | [`staff/StaffCustomerComm.tsx`](../admin_web/src/pages/staff/StaffCustomerComm.tsx) | **`VERIFIED` (`[✓ S112]`)** |
| **Staff 113** | `#/staff/113` | Daily Order Operations Report | [`staff/StaffDailyReport.tsx`](../admin_web/src/pages/staff/StaffDailyReport.tsx) | **`VERIFIED` (`[✓ S113]`)** |
| **Staff 114** | `#/staff/114` | Staff Profile Screen | [`shared/FacebookProfilePage.tsx`](../admin_web/src/pages/shared/FacebookProfilePage.tsx) | **`VERIFIED` (`[✓ S114]`)** |

---

## 3. Mobile Application Screens (`22` Dart Screen Files & `22` Kotlin Screen Files)

| # | Persona | Flutter Dart File (`serviceos/lib/features/...`) | Native Android Kotlin File (`serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/...`) | Verification State |
| :--- | :--- | :--- | :--- | :--- |
| **01** | Shared | [`onboarding/presentation/screens/splash_screen.dart`](../serviceos/lib/features/onboarding/presentation/screens/splash_screen.dart) | [`common/SplashScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/common/SplashScreen.kt) | Static Syntax `VERIFIED` / Native Build `NOT VERIFIED` |
| **02** | Shared | [`authentication/presentation/screens/role_gateway_screen.dart`](../serviceos/lib/features/authentication/presentation/screens/role_gateway_screen.dart) | [`common/RoleGatewayScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/common/RoleGatewayScreen.kt) | Static Syntax `VERIFIED` / Native Build `NOT VERIFIED` |
| **03** | Shared | [`authentication/presentation/screens/login_screen.dart`](../serviceos/lib/features/authentication/presentation/screens/login_screen.dart) | [`common/LoginScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/common/LoginScreen.kt) | Static Syntax `VERIFIED` / Native Build `NOT VERIFIED` |
| **04** | Shared | [`common/presentation/screens/in_app_chat_screen.dart`](../serviceos/lib/features/common/presentation/screens/in_app_chat_screen.dart) | [`common/InAppChatScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/common/InAppChatScreen.kt) | Static Syntax `VERIFIED` / Native Build `NOT VERIFIED` |
| **05** | Shared | [`common/presentation/screens/common_utilities_screen.dart`](../serviceos/lib/features/common/presentation/screens/common_utilities_screen.dart) | [`common/CommonUtilitiesScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/common/CommonUtilitiesScreen.kt) | Static Syntax `VERIFIED` / Native Build `NOT VERIFIED` |
| **06** | Customer | [`dashboard/presentation/screens/customer_discover_screen.dart`](../serviceos/lib/features/dashboard/presentation/screens/customer_discover_screen.dart) | [`customer/CustomerDiscoverScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/customer/CustomerDiscoverScreen.kt) | Static Syntax `VERIFIED` / Native Build `NOT VERIFIED` |
| **07** | Customer | [`services/presentation/screens/category_feed_screen.dart`](../serviceos/lib/features/services/presentation/screens/category_feed_screen.dart) | [`customer/CategoryFeedScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/customer/CategoryFeedScreen.kt) | Static Syntax `VERIFIED` / Native Build `NOT VERIFIED` |
| **08** | Customer | [`services/presentation/screens/global_search_screen.dart`](../serviceos/lib/features/services/presentation/screens/global_search_screen.dart) | [`customer/GlobalSearchScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/customer/GlobalSearchScreen.kt) | Static Syntax `VERIFIED` / Native Build `NOT VERIFIED` |
| **09** | Customer | [`services/presentation/screens/service_detail_screen.dart`](../serviceos/lib/features/services/presentation/screens/service_detail_screen.dart) | [`customer/ServiceDetailScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/customer/ServiceDetailScreen.kt) | Static Syntax `VERIFIED` / Native Build `NOT VERIFIED` |
| **10** | Customer | [`bookings/presentation/screens/booking_wizard_screen.dart`](../serviceos/lib/features/bookings/presentation/screens/booking_wizard_screen.dart) | [`customer/BookingWizardScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/customer/BookingWizardScreen.kt) | Static Syntax `VERIFIED` / Native Build `NOT VERIFIED` |
| **11** | Customer | [`bookings/presentation/screens/my_bookings_screen.dart`](../serviceos/lib/features/bookings/presentation/screens/my_bookings_screen.dart) | [`customer/MyBookingsScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/customer/MyBookingsScreen.kt) | Static Syntax `VERIFIED` / Native Build `NOT VERIFIED` |
| **12** | Customer | [`dispatch/presentation/screens/live_dispatch_radar_screen.dart`](../serviceos/lib/features/dispatch/presentation/screens/live_dispatch_radar_screen.dart) | [`customer/LiveDispatchRadarScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/customer/LiveDispatchRadarScreen.kt) | Static Syntax `VERIFIED` / Native Build `NOT VERIFIED` |
| **13** | Customer | [`dispatch/presentation/screens/work_order_completion_screen.dart`](../serviceos/lib/features/dispatch/presentation/screens/work_order_completion_screen.dart) | [`customer/WorkOrderCompletionScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/customer/WorkOrderCompletionScreen.kt) | Static Syntax `VERIFIED` / Native Build `NOT VERIFIED` |
| **14** | Customer | [`invoices/presentation/screens/invoice_receipt_screen.dart`](../serviceos/lib/features/invoices/presentation/screens/invoice_receipt_screen.dart) | [`customer/InvoiceReceiptScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/customer/InvoiceReceiptScreen.kt) | Static Syntax `VERIFIED` / Native Build `NOT VERIFIED` |
| **15** | Customer | [`profile/presentation/screens/customer_profile_screen.dart`](../serviceos/lib/features/profile/presentation/screens/customer_profile_screen.dart) | [`customer/CustomerProfileScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/customer/CustomerProfileScreen.kt) | Static Syntax `VERIFIED` / Native Build `NOT VERIFIED` |
| **16** | Customer | [`support/presentation/screens/support_help_screen.dart`](../serviceos/lib/features/support/presentation/screens/support_help_screen.dart) | [`customer/SupportHelpScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/customer/SupportHelpScreen.kt) | Static Syntax `VERIFIED` / Native Build `NOT VERIFIED` |
| **17** | Technician | [`technicians/presentation/screens/tech_onboarding_screen.dart`](../serviceos/lib/features/technicians/presentation/screens/tech_onboarding_screen.dart) | [`technician/TechOnboardingScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/technician/TechOnboardingScreen.kt) | Static Syntax `VERIFIED` / Native Build `NOT VERIFIED` |
| **18** | Technician | [`technicians/presentation/screens/tech_dashboard_screen.dart`](../serviceos/lib/features/technicians/presentation/screens/tech_dashboard_screen.dart) | [`technician/TechDashboardScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/technician/TechDashboardScreen.kt) | Static Syntax `VERIFIED` / Native Build `NOT VERIFIED` |
| **19** | Technician | [`technicians/presentation/screens/tech_broadcast_screen.dart`](../serviceos/lib/features/technicians/presentation/screens/tech_broadcast_screen.dart) | [`technician/TechBroadcastScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/technician/TechBroadcastScreen.kt) | Static Syntax `VERIFIED` / Native Build `NOT VERIFIED` |
| **20** | Technician | [`technicians/presentation/screens/tech_job_execution_screen.dart`](../serviceos/lib/features/technicians/presentation/screens/tech_job_execution_screen.dart) | [`technician/TechJobExecutionScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/technician/TechJobExecutionScreen.kt) | Static Syntax `VERIFIED` / Native Build `NOT VERIFIED` |
| **21** | Technician | [`technicians/presentation/screens/tech_history_screen.dart`](../serviceos/lib/features/technicians/presentation/screens/tech_history_screen.dart) | [`technician/TechHistoryScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/technician/TechHistoryScreen.kt) | Static Syntax `VERIFIED` / Native Build `NOT VERIFIED` |
| **22** | Technician | [`technicians/presentation/screens/tech_wallet_screen.dart`](../serviceos/lib/features/technicians/presentation/screens/tech_wallet_screen.dart) | [`technician/TechWalletScreen.kt`](../serviceos_android/app/src/main/kotlin/com/serviceos/app/ui/technician/TechWalletScreen.kt) | Static Syntax `VERIFIED` / Native Build `NOT VERIFIED` |

---

## 4. Database Tables & Views (`19` Tables + `1` View Across `843` SQL Lines)

| # | Object Name | Type | Migration File & Line | RLS Enabled (`03_security_rbac_and_rls.sql`) | Explicit RLS Policies Defined |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **01** | `public.tenants` | Table | [`01_initial_schema.sql`](../supabase/migrations/01_initial_schema.sql#L17) | No | 0 |
| **02** | `public.users` | Table | [`01_initial_schema.sql`](../supabase/migrations/01_initial_schema.sql#L37) | Yes (Line 157) | 3 Policies |
| **03** | `public.customer_profiles` | Table | [`01_initial_schema.sql`](../supabase/migrations/01_initial_schema.sql#L59) | Yes (Line 158) | 0 (Default-Deny until policy added) |
| **04** | `public.customer_addresses` | Table | [`01_initial_schema.sql`](../supabase/migrations/01_initial_schema.sql#L70) | No | 0 |
| **05** | `public.provider_profiles` | Table | [`01_initial_schema.sql`](../supabase/migrations/01_initial_schema.sql#L91) | Yes (Line 159) | 0 (Default-Deny until policy added) |
| **06** | `public.categories` | Table | [`01_initial_schema.sql`](../supabase/migrations/01_initial_schema.sql#L124) | Yes (Line 161) | 2 Policies |
| **07** | `public.services` | Table | [`01_initial_schema.sql`](../supabase/migrations/01_initial_schema.sql#L143) | Yes (Line 160) | 2 Policies |
| **08** | `public.bookings` | Table | [`01_initial_schema.sql`](../supabase/migrations/01_initial_schema.sql#L162) | Yes (Line 162) | 7 Policies |
| **09** | `public.payments` | Table | [`01_initial_schema.sql`](../supabase/migrations/01_initial_schema.sql#L217) | Yes (Line 163) | 2 Policies |
| **10** | `public.job_evidence` | Table | [`01_initial_schema.sql`](../supabase/migrations/01_initial_schema.sql#L253) | No | 0 |
| **11** | `public.inventory_items` | Table | [`01_initial_schema.sql`](../supabase/migrations/01_initial_schema.sql#L268) | No | 0 |
| **12** | `public.booking_parts` | Table | [`01_initial_schema.sql`](../supabase/migrations/01_initial_schema.sql#L280) | No | 0 |
| **13** | `public.reviews` | Table | [`01_initial_schema.sql`](../supabase/migrations/01_initial_schema.sql#L294) | Yes (Line 164) | 0 (Default-Deny until policy added) |
| **14** | `public.audit_logs` | Table | [`01_initial_schema.sql`](../supabase/migrations/01_initial_schema.sql#L312) | Yes (Line 165) | 1 Policy |
| **15** | `public.user_mfa_credentials` | Table | [`03_security_rbac_and_rls.sql`](../supabase/migrations/03_security_rbac_and_rls.sql#L17) | No | 0 |
| **16** | `public.security_audit_logs` | Table | [`03_security_rbac_and_rls.sql`](../supabase/migrations/03_security_rbac_and_rls.sql#L36) | Yes (Line 166) | 2 Policies + Immutable Trigger |
| **17** | `public.auth_rate_limits` | Table | [`03_security_rbac_and_rls.sql`](../supabase/migrations/03_security_rbac_and_rls.sql#L69) | No | 0 |
| **18** | `public.password_reset_tokens` | Table | [`03_security_rbac_and_rls.sql`](../supabase/migrations/03_security_rbac_and_rls.sql#L82) | No | 0 |
| **19** | `public.auth_otps` | Table | [`03_security_rbac_and_rls.sql`](../supabase/migrations/03_security_rbac_and_rls.sql#L99) | No | 0 |
| **View** | `public.service_categories` | View | [`03_security_rbac_and_rls.sql`](../supabase/migrations/03_security_rbac_and_rls.sql#L169) | `security_invoker = true` | Inherits `categories` RLS |
