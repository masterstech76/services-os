# Report 3 — Complete Page, Feature & Workflow Audit

**Total Web Routes Audited**: `54` `.tsx` files under `admin_web/src/pages/` (`38` Admin + `14` Staff + `LoginPage` + `SystemInstallerPage` + `FacebookProfilePage` + routers)  
**Playwright Runtime Verification**: `52/52` pages (`38` Admin + `14` Staff) rendered with `0` console/page errors and `0` `undefined`/`NaN`/`[object Object]` leaks (`npm test`).

---

## 1. Web Admin Portal (`Pages 01–38`) & Shared/Auth Pages

| Page / Route | Component | Backend / Data Source | Controls & Interactive State | Functional Classification |
|---|---|---|---|---|
| Login / Bootstrap | `auth/LoginPage.tsx` | `supabaseService` (`signIn`, `checkSystemInitialized`, MFA RPCs) | Real auth + MFA challenge when configured; `setTimeout` brute-force UX delay | **PARTIALLY FUNCTIONAL** (Live Supabase Auth untested) |
| `#/installer` | `commercial/SystemInstallerPage.tsx` | `supabaseService` (`verify_schema_migrations_status` RPC) | Per-migration status probe (`m1`–`m5`), commercial dossier download | **PARTIALLY FUNCTIONAL** (Live RPC untested) |
| `#/1` Dashboard | `module1/Page01MainDashboard.tsx` | `AdminContext` (`bookings`, `technicians`, `customers`) | KPI cards, charts, quick navigation | **PARTIALLY FUNCTIONAL** (Core data synced; financial/ticket widgets local) |
| `#/2` Live Ops | `module1/Page02LiveOperations.tsx` | `AdminContext` + Leaflet map | Map markers & status filters | **PARTIALLY FUNCTIONAL** |
| `#/3` Today Activity | `module1/Page03TodayActivity.tsx` | `AdminContext` | `L83`: `setTimeout` simulated refresh | **SIMULATED** (Refresh timer) |
| `#/4` Pending Work | `module1/Page04PendingWork.tsx` | `AdminContext` (`bookings`) | Filter & status action | **PARTIALLY FUNCTIONAL** |
| `#/5` Critical Alerts | `module1/Page05CriticalAlerts.tsx` | `AdminContext` | Alert list & toast acknowledgment | **PARTIALLY FUNCTIONAL** |
| `#/6`–`#/10` Bookings | `module2/Page06`–`Page10` | `AdminContext` -> `supabaseService.saveBooking` | Create, filter, reschedule, details, status update | **PARTIALLY FUNCTIONAL** (Live RLS roundtrip untested) |
| `#/11` Dispatch Board | `module2/Page11DispatchBoard.tsx` | `AdminContext` (`bookings`, `technicians`) | Drag/assign technician -> `saveBooking` | **PARTIALLY FUNCTIONAL** |
| `#/12` Manual Handover | `module2/Page12ManualDispatchHandover.tsx` | `AdminContext` | `L33`: `setTimeout` simulated handover | **SIMULATED** |
| `#/13`–`#/16` Services | `module3/Page13`–`Page16` | `AdminContext` -> `saveService`, `saveCategory`, `deleteService` | Create/edit/delete services & categories | **PARTIALLY FUNCTIONAL** |
| `#/17` Pricing Matrix | `module3/Page17PricingManagement.tsx` | `AdminContext` (`localStorage` only) | Commission & fee sliders | **UI ONLY / LOCAL STORAGE** (Not persisted to Supabase `tenants`) |
| `#/18`–`#/20` Customers | `module4/Page18`–`Page20` | `AdminContext` -> `saveCustomer`; `Page19:727` hardcoded `"Card Ending 4892"` | Customer list, profile, booking history | **PARTIALLY FUNCTIONAL** (`Page19:727` static card text) |
| `#/21` Customer Tickets | `module4/Page21CustomerSupportTickets.tsx` | `AdminContext` (`localStorage` only) | Ticket table & view | **UI ONLY / LOCAL STORAGE** |
| `#/22`–`#/24` Technicians | `module5/Page22`–`Page24` | `AdminContext` -> `saveTechnician` (`users` + `provider_profiles`) | Roster, profile, availability toggle | **PARTIALLY FUNCTIONAL** |
| `#/25` Tech Performance | `module5/Page25TechnicianPerformance.tsx` | `AdminContext` (`technicians`) | Dynamic podium & chart; bonus button updates local state + toast | **PARTIALLY FUNCTIONAL** (No Stripe Connect payout API call) |
| `#/26`–`#/28` Finance | `module6/Page26`–`Page28` | `AdminContext` (`bookings` + local `invoices`) | Financial charts, CSV export, invoices (`localStorage`) | **PARTIALLY FUNCTIONAL** (`invoices` local-only) |
| `#/29` Tech Payouts | `module6/Page29TechnicianPayouts.tsx` | `AdminContext` (`technicians`, `bookings`) | Dynamic calculation + local `disbursedIds` state + toast | **SIMULATED** (Claims Stripe Connect ACH via toast without backend call) |
| `#/30` Refunds | `module6/Page30RefundManagement.tsx` | Local `useState<RefundCase[]>([])` | Empty by default; approve/decline updates local state + toast | **SIMULATED** (No Stripe Refund API call) |
| `#/31`–`#/32` Support | `module7/Page31`–`Page32` | `AdminContext` (`localStorage` only) | Ticket dashboard & reply thread | **UI ONLY / LOCAL STORAGE** |
| `#/33` Reviews | `module7/Page33CustomerReviewsManagement.tsx` | `AdminContext` (`localStorage` only) | `L64`: `setTimeout` reply simulation | **SIMULATED / LOCAL STORAGE** |
| `#/34`–`#/35` CMS & Settings | `module8/Page34`–`Page35` | `AdminContext` (`localStorage` only) | Website CMS & platform settings | **UI ONLY / LOCAL STORAGE** |
| `#/36` Integrations | `module8/Page36PaymentNotificationConfig.tsx` | Public config in `localStorage`; secrets memory-only | `L142`: `setTimeout` connection test | **SIMULATED** (Test connection does not call Edge Functions) |
| `#/37`–`#/38` Audit & Security | `module8/Page37`–`Page38` | `AdminContext` (`auditLogs`) | Security logs & RBAC matrix | **PARTIALLY FUNCTIONAL** |
| Shared Social Profile | `shared/FacebookProfilePage.tsx` | `AdminContext` | Timeline, team, photos, orders tabs | **PARTIALLY FUNCTIONAL** |

## 2. Staff Portal (`Pages 101–114`)

- `StaffDashboard` (`101`), `StaffActiveOrders` (`102`), `StaffOrderIntake` (`103`), `StaffOrderAssignment` (`104`), `StaffTechAvailability` (`105`), `StaffScheduleCalendar` (`106`), `StaffRescheduleDesk` (`107`), `StaffCustomerComm` (`108`), `StaffJobVerification` (`109`), `StaffPageRouter`, `FacebookProfilePage` (`114`): **PARTIALLY FUNCTIONAL** via `AdminContext`.
- `StaffLiveDispatch` (`110`, `L32`), `StaffActivityStream` (`111`, `L71`), `StaffEmergencyHandover` (`112`, `L51`), `StaffDailyReport` (`113`, `L29`): contain `setTimeout(...)` simulated async actions.
