# ADMIN PANEL GUIDE — 38-Page Executive Control Console

**Document No.**: `17 / 25`  
**Version**: `1.0.0`  
**Last Updated**: November 15, 2026  
**Source Router**: [`admin_web/src/pages/PageRouter.tsx`](../admin_web/src/pages/PageRouter.tsx)  
**Page Metadata**: [`admin_web/src/data/pagesMaster.ts`](../admin_web/src/data/pagesMaster.ts)

---

## 1. Accessing the Admin Panel

Sign in at `#/login` with the `ADMIN` role. All 38 Admin pages (`#/page/1` through `#/page/38`) are verified to render without runtime or console errors in local mode via `npm test` ([`admin_web/verify_all_49_pages_production.cjs`](../admin_web/verify_all_49_pages_production.cjs)).

---

## 2. Module Breakdown (`#/page/1` – `#/page/38`)

### Module 1: Dashboard & Operations (`#/page/1` – `#/page/5`)
- **Page 01 ([`Page01MainDashboard.tsx`](../admin_web/src/pages/module1/Page01MainDashboard.tsx))**: Executive overview of revenue, active jobs, services, and technicians with Recharts visualizations.
- **Page 02 ([`Page02LiveOperations.tsx`](../admin_web/src/pages/module1/Page02LiveOperations.tsx))**: Live GPS dispatch map using [`RealDispatchMap.tsx`](../admin_web/src/components/common/RealDispatchMap.tsx) with technician tracking and status updates.
- **Page 03 ([`Page03TodayActivity.tsx`](../admin_web/src/pages/module1/Page03TodayActivity.tsx))**: Chronological stream of operational events, technician check-ins, and payment updates.
- **Page 04 ([`Page04PendingWork.tsx`](../admin_web/src/pages/module1/Page04PendingWork.tsx))**: Queue of unassigned jobs, pending approvals, and SLA timers.
- **Page 05 ([`Page05CriticalAlerts.tsx`](../admin_web/src/pages/module1/Page05CriticalAlerts.tsx))**: System, security, and operational alert management (`resolveIncident`, `acknowledgeAllIncidents`).

### Module 2: Bookings & Dispatch (`#/page/6` – `#/page/12`)
- **Page 06 ([`Page06AllBookings.tsx`](../admin_web/src/pages/module2/Page06AllBookings.tsx))**: Filterable master table of customer service jobs (`updateBookingStatus`, `deleteBooking`).
- **Page 07 ([`Page07NewBookingRequests.tsx`](../admin_web/src/pages/module2/Page07NewBookingRequests.tsx))**: Newly submitted booking requests awaiting dispatch or approval (`createBooking`).
- **Page 08 ([`Page08ActiveBookings.tsx`](../admin_web/src/pages/module2/Page08ActiveBookings.tsx))**: Monitoring of in-progress technician work and safety PIN status.
- **Page 09 ([`Page09BookingDetails.tsx`](../admin_web/src/pages/module2/Page09BookingDetails.tsx))**: Detailed job dossier (`selectedBookingId`) with customer, technician, map, and invoice breakdown.
- **Page 10 ([`Page10BookingRescheduling.tsx`](../admin_web/src/pages/module2/Page10BookingRescheduling.tsx))**: Slot rescheduling desk (`rescheduleBooking`).
- **Page 11 ([`Page11DispatchBoard.tsx`](../admin_web/src/pages/module2/Page11DispatchBoard.tsx))**: Dispatch board combining map and technician shift schedule.
- **Page 12 ([`Page12ManualDispatchHandover.tsx`](../admin_web/src/pages/module2/Page12ManualDispatchHandover.tsx))**: Manual technician assignment and emergency job handover (`emergencyHandover`).

### Module 3: Services & Pricing (`#/page/13` – `#/page/17`)
- **Page 13 ([`Page13AllServices.tsx`](../admin_web/src/pages/module3/Page13AllServices.tsx))**: Master catalogue of services (`addService`, `updateService`, `deleteService`).
- **Page 14 ([`Page14ServiceCategories.tsx`](../admin_web/src/pages/module3/Page14ServiceCategories.tsx))**: Service category management (`addCategory`, `updateCategory`).
- **Page 15 ([`Page15AddEditService.tsx`](../admin_web/src/pages/module3/Page15AddEditService.tsx))**: Multi-step service creator and configurator.
- **Page 16 ([`Page16ServiceDetails.tsx`](../admin_web/src/pages/module3/Page16ServiceDetails.tsx))**: Service specification preview and metrics.
- **Page 17 ([`Page17PricingManagement.tsx`](../admin_web/src/pages/module3/Page17PricingManagement.tsx))**: Commission rate, surge multiplier, minimum callout fee, and night surcharge settings (`updatePricingConfig`).

### Module 4: Customer Management (`#/page/18` – `#/page/21`)
- **Page 18 ([`Page18AllCustomers.tsx`](../admin_web/src/pages/module4/Page18AllCustomers.tsx))**: Customer CRM directory (`addCustomer`, `updateCustomer`).
- **Page 19 ([`Page19CustomerProfile.tsx`](../admin_web/src/pages/module4/Page19CustomerProfile.tsx))**: Customer profile dossier, lifetime spend, and CRM notes (`customer.notes`).
- **Page 20 ([`Page20CustomerBookingHistory.tsx`](../admin_web/src/pages/module4/Page20CustomerBookingHistory.tsx))**: Customer booking history timeline.
- **Page 21 ([`Page21CustomerSupportTickets.tsx`](../admin_web/src/pages/module4/Page21CustomerSupportTickets.tsx))**: Customer support tickets view.

### Module 5: Technician Management (`#/page/22` – `#/page/25`)
- **Page 22 ([`Page22AllTechnicians.tsx`](../admin_web/src/pages/module5/Page22AllTechnicians.tsx))**: Technician roster (`addTechnician`, `updateTechnician`) and SMS composer trigger ([`DirectSMSComposerModal.tsx`](../admin_web/src/components/modals/DirectSMSComposerModal.tsx)).
- **Page 23 ([`Page23TechnicianProfile.tsx`](../admin_web/src/pages/module5/Page23TechnicianProfile.tsx))**: Technician profile dossier (`selectedTechnicianId`).
- **Page 24 ([`Page24TechnicianAvailability.tsx`](../admin_web/src/pages/module5/Page24TechnicianAvailability.tsx))**: Technician shift schedule and availability.
- **Page 25 ([`Page25TechnicianPerformance.tsx`](../admin_web/src/pages/module5/Page25TechnicianPerformance.tsx))**: Technician performance leaderboard.

### Module 6: Finance & Payments (`#/page/26` – `#/page/30`)
- **Page 26 ([`Page26FinancialDashboard.tsx`](../admin_web/src/pages/module6/Page26FinancialDashboard.tsx))**: Executive revenue overview, gross volume, 15% platform commission, and net payouts.
- **Page 27 ([`Page27TransactionHistory.tsx`](../admin_web/src/pages/module6/Page27TransactionHistory.tsx))**: Payment transaction ledger.
- **Page 28 ([`Page28CustomerInvoices.tsx`](../admin_web/src/pages/module6/Page28CustomerInvoices.tsx))**: Customer invoice repository (`addInvoice`).
- **Page 29 ([`Page29TechnicianPayouts.tsx`](../admin_web/src/pages/module6/Page29TechnicianPayouts.tsx))**: Technician earnings and payout batch view (`releaseBatchPayouts`).
- **Page 30 ([`Page30RefundManagement.tsx`](../admin_web/src/pages/module6/Page30RefundManagement.tsx))**: Refund arbitration and approval desk (`approveRefund`, `rejectRefund`).

### Module 7: Support & Reviews (`#/page/31` – `#/page/33`)
- **Page 31 ([`Page31SupportTicketDashboard.tsx`](../admin_web/src/pages/module7/Page31SupportTicketDashboard.tsx))**: Support ticket queue and SLA timers (`resolveTicket`).
- **Page 32 ([`Page32TicketDetailsConversation.tsx`](../admin_web/src/pages/module7/Page32TicketDetailsConversation.tsx))**: Two-way support ticket conversation studio (`replyToTicket`).
- **Page 33 ([`Page33CustomerReviewsManagement.tsx`](../admin_web/src/pages/module7/Page33CustomerReviewsManagement.tsx))**: Customer reviews moderation (`approveReview`, `deleteReview`).

### Module 8: Website & Platform Settings (`#/page/34` – `#/page/36`) & Shared/Commercial (`#/page/37` – `#/page/38`)
- **Page 34 ([`Page34WebsiteContentManagement.tsx`](../admin_web/src/pages/module8/Page34WebsiteContentManagement.tsx))**: CMS configuration for hero banners and promotional text (`updateCmsConfig`).
- **Page 35 ([`Page35GeneralPlatformSettings.tsx`](../admin_web/src/pages/module8/Page35GeneralPlatformSettings.tsx))**: Company branding (`updateAgencyBranding`), timezone, currency, and security PIN settings.
- **Page 36 ([`Page36PaymentNotificationConfig.tsx`](../admin_web/src/pages/module8/Page36PaymentNotificationConfig.tsx))**: Gateway configuration UI and Supabase cloud connection settings (`saveSupabaseConfig`).
- **Page 37 ([`FacebookProfilePage.tsx`](../admin_web/src/pages/shared/FacebookProfilePage.tsx))**: Universal profile inspection and editing screen (`#/page/37`).
- **Page 38 ([`SystemInstallerPage.tsx`](../admin_web/src/pages/commercial/SystemInstallerPage.tsx))**: Turnkey system health and database migration reference wizard (`#/page/38` or `#/installer`).
