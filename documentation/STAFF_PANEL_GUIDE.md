# STAFF PANEL GUIDE — 14-Page Operations & Dispatch Desk

**Document No.**: `18 / 25`  
**Version**: `1.0.0`  
**Last Updated**: November 15, 2026  
**Source Router**: [`admin_web/src/pages/staff/StaffPageRouter.tsx`](../admin_web/src/pages/staff/StaffPageRouter.tsx)  
**Page Metadata**: [`admin_web/src/data/staffPagesMaster.ts`](../admin_web/src/data/staffPagesMaster.ts)

---

## 1. Accessing the Staff Panel & Route Separation

Sign in at `#/login` with the `STAFF` role. The user is routed to `#/staff/101`.
- **Verified Playwright Coverage**: All 14 Staff pages (`#/staff/101` through `#/staff/114`) are verified to render with `0` console/page errors by `npm test` ([`admin_web/verify_all_49_pages_production.cjs`](../admin_web/verify_all_49_pages_production.cjs)).
- **UI Route Guard**: If a `STAFF` session navigates to `#/page/*`, [`AdminContext.tsx`](../admin_web/src/context/AdminContext.tsx#L1206-L1211) and [`PageRouter.tsx`](../admin_web/src/pages/PageRouter.tsx#L66-L87) block navigation with `"Administrative Clearance Required"` and redirect to `#/staff/101`. (For multi-user production security, pair with server-side Supabase Cloud RLS as documented in [`AUTHENTICATION_AND_RBAC.md`](AUTHENTICATION_AND_RBAC.md)).

---

## 2. Complete 14-Page Staff Inventory (`#/staff/101` – `#/staff/114`)

1. **Staff Page 101 — Staff Operations Dashboard ([`StaffDashboard.tsx`](../admin_web/src/pages/staff/StaffDashboard.tsx))**: Daily operations overview of incoming orders, unassigned queue, active field dispatches, and SLA health.
2. **Staff Page 102 — Order Intake Queue ([`StaffOrderIntake.tsx`](../admin_web/src/pages/staff/StaffOrderIntake.tsx))**: Triage newly submitted customer service requests and create bookings (`createBooking`).
3. **Staff Page 103 — Today's Work Activity ([`StaffActivityStream.tsx`](../admin_web/src/pages/staff/StaffActivityStream.tsx))**: Real-time event stream of order status updates, technician check-ins, and SLA warnings.
4. **Staff Page 104 — Order Assignment Board ([`StaffOrderAssignment.tsx`](../admin_web/src/pages/staff/StaffOrderAssignment.tsx))**: Match unassigned customer orders with available technicians (`openAssignModal`).
5. **Staff Page 105 — Live Dispatch Radar ([`StaffLiveDispatch.tsx`](../admin_web/src/pages/staff/StaffLiveDispatch.tsx))**: Live Leaflet map ([`RealDispatchMap.tsx`](../admin_web/src/components/common/RealDispatchMap.tsx)) tracking field technicians and active job sites.
6. **Staff Page 106 — Technician Shift Availability ([`StaffTechAvailability.tsx`](../admin_web/src/pages/staff/StaffTechAvailability.tsx))**: Active technician roster showing online, busy, or available status and SMS composer trigger (`openSMSModal`).
7. **Staff Page 107 — Emergency Order Handover ([`StaffEmergencyHandover.tsx`](../admin_web/src/pages/staff/StaffEmergencyHandover.tsx))**: Transfer jobs to backup technicians during field emergencies (`emergencyHandover`).
8. **Staff Page 108 — Active In-Progress Orders ([`StaffActiveOrders.tsx`](../admin_web/src/pages/staff/StaffActiveOrders.tsx))**: Supervise orders currently being executed on customer premises with safety PIN status.
9. **Staff Page 109 — Order Schedule & Calendar ([`StaffScheduleCalendar.tsx`](../admin_web/src/pages/staff/StaffScheduleCalendar.tsx))**: Multi-technician schedule grid to balance daily job loads.
10. **Staff Page 110 — Order Rescheduling Desk ([`StaffRescheduleDesk.tsx`](../admin_web/src/pages/staff/StaffRescheduleDesk.tsx))**: Manage customer rescheduling requests and slot updates (`rescheduleBooking`).
11. **Staff Page 111 — Order Verification & Signatures ([`StaffJobVerification.tsx`](../admin_web/src/pages/staff/StaffJobVerification.tsx))**: Audit completed orders, inspect photo proof and customer signatures, and approve completion (`verifyBooking`).
12. **Staff Page 112 — Customer Communication Desk ([`StaffCustomerComm.tsx`](../admin_web/src/pages/staff/StaffCustomerComm.tsx))**: Customer lookup, communication log, and direct SMS modal trigger.
13. **Staff Page 113 — Daily Order Operations Report ([`StaffDailyReport.tsx`](../admin_web/src/pages/staff/StaffDailyReport.tsx))**: End-of-day summary of orders handled and technician dispatch statistics.
14. **Staff Page 114 — Staff Profile Screen ([`FacebookProfilePage.tsx`](../admin_web/src/pages/shared/FacebookProfilePage.tsx))**: Personal profile view for the signed-in staff member (`#/staff/114`).
