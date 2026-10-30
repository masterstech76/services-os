# SERVICEPRO OS / HEAVENLEASE - COMPLETE DEMO DATA INVENTORY

**Document Purpose:** Detailed page-by-page audit of every demo data item across all 130 pages that must be removed, along with the exact conditional visibility behavior (`data.length > 0`) for each page while preserving 100% of the UI design, CTAs, forms, and features.

---

> [!IMPORTANT]
> ### SPECIAL USER DIRECTIVE & CORE EDIT RULES:
> 1. **Keep Landing Page Demo Data As It Is:**  
>    Do **NOT** remove demo data from the landing page (`/`). Preserve all interactive showcases, workflow builders, telemetry metrics, and feature cards exactly as designed.
> 2. **Remove Only Fake Reviews:**  
>    Purge fake fabricated review cards and dummy author testimonials across all pages (e.g. `/reviews`, customer review cards). Keep the review card component code and CTA section intact, and enable dynamic creation when a new review is submitted.
> 3. **Landing Page Admin "Edit Page Details" Feature:**  
>    Add an accessible **"Edit Page Details"** button on the landing page allowing an admin to jump straight into editing that page's details easily.
> 4. **Expand & Correct Admin "Edit Page Details" CMS (`/admin/content`):**  
>    Add **all website pages** to the editable list so administrators can easily edit all non-user website & business details from the admin panel:
>    - **Payment Prices & Diagnostic Rates** (`/pricing`, `/pay`): Diagnostic Fee ($129), Emergency Fee ($169), Tune-Up Fee ($99), Deposit Hold ($20), Tax Rate (7%), Currency.
>    - **Privacy Policy** (`/privacy`): Full legal text, data retention, cookie disclosure.
>    - **Terms of Service** (`/terms`): Service agreements, cancellation policies, warranty disclaimers.
>    - **Refund Policy** (`/refund-policy`): Full refund policy, 100% deposit return rules, 30-day guarantee terms.
>    - **Security & Compliance** (`/security`): 256-bit SSL encryption, PCI-DSS compliance, security contacts.
>    - **Accessibility Statement** (`/accessibility`): WCAG standards, accessibility aids, feedback email.
>    - **About Us** (`/about`): Company history, mission, business address, headquarters hours.
>    - **Careers & Vacancies** (`/careers`): Hiring status, benefits, vacancies, starting wages.
>    - **Contact Information** (`/contact`): Phone number, dispatch email, facility address, operating hours.
>    - **Frequently Asked Questions** (`/faq`): Category labels, questions, and answers.
>    - **Service Areas & Cities** (`/service-areas`): Covered zones, arrival windows.
>    - **HVAC Services** (`/services`): Service titles, prices, descriptions, speed tier assignments.
>    *(Note: We already added that feature button, but the editing page was not correctly built. We must correctly build out the complete multi-page CMS editor with deep-linking support `?edit=...` or `?page=...`).*

---

## SECTION 1: PUBLIC & MARKETING PAGES

### 1. Landing Page
* **Route:** `/`
* **File Path:** [`src/app/(public)/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(public)/page.tsx)
* **Directive:** **KEEP DEMO DATA AS IS.**
* **Action:**
  - Preserve all interactive showcases, workflow builders, telemetry widgets, and metrics.
  - Mount mobile drawer & backdrop via `createPortal(..., document.body)` with solid `#0C1523` background and zero transparency.
  - Add an accessible **"Edit Page Details"** button on the landing page linking directly to `/admin/content?edit=cnt-home`.

---

### 2. About Page
* **Route:** `/about`
* **File Path:** [`src/app/(public)/about/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(public)/about/page.tsx)
* **Demo Data Items to Remove:**
  - Hardcoded team profiles in `teamMembers` array (`"Carlos Rodriguez"`, `"Marcus Vance"`, `"Tony Alvarez"`, `"Danny Miller"`).
* **Conditional Visibility & Cleanup Rule:**
  - Replace hardcoded names with generic certified roles or hide team cards when `teamMembers.length === 0`:
    ```tsx
    {teamMembers.length > 0 && <TeamSection members={teamMembers} />}
    ```
* **Preserved UI & Features:**
  - Restored high-res background image [`/images/final-cta-house.jpg`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/public/images/final-cta-house.jpg) on the final CTA card.
  - Platform architecture pillars, company values, and dispatch statistics layout.

---

### 3. Services Catalog Page
* **Route:** `/services`
* **File Paths:**
  - [`src/app/(public)/services/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(public)/services/page.tsx)
  - [`src/components/services/ServicesCatalogClient.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/components/services/ServicesCatalogClient.tsx)
  - [`src/lib/services-detail-data.ts`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/lib/services-detail-data.ts)
* **Demo Data Items to Remove:**
  - Hardcoded CTA button labels: `"Dispatch Carlos Now →"`, `"Schedule Marcus (Coming Soon) →"`.
  - Hardcoded review links: `/reviews/carlos-mendez`, `/reviews/marcus-vance`.
  - Static fallback worker IDs: `carlos-mendez`, `marcus-vance`, `elena-rivera` in `MASTER_TECHNICIANS`.
* **Conditional Visibility & Cleanup Rule:**
  - CTA button text replaced with dynamic: `"Dispatch Available Specialist Now →"`.
  - Review links pointed to `/reviews`.
  - Assigned workers cards: wrap in `{workers && workers.length > 0 ? (...) : null}`.
  - Added worker profile photo upload support (`avatarUrl?: string` with `<Image>` rendering).
* **Preserved UI & Features:**
  - Full catalog of services, speed tier color legend (Blue/Green/Orange), filters, and the 3-in-1 bottom CTA section.

---

### 4. Public Technicians Roster Page
* **Route:** `/technicians`
* **File Path:** [`src/app/(public)/technicians/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(public)/technicians/page.tsx)
* **Demo Data Items to Remove:**
  - The static `PUBLIC_TECHS` array containing 3 mock technician profiles:
    - `"Lead Field Specialist"` (ID `carlos-mendez`, bio, 342 reviews, Field Service Unit Alpha).
    - `"Senior HVAC Specialist"` (ID `marcus-vance`, bio, 218 reviews, Field Service Unit Beta).
    - `"Commercial Systems Specialist"` (ID `elena-rivera`, bio, 289 reviews, Field Service Unit Gamma).
* **Conditional Visibility & Cleanup Rule:**
  - Set `PUBLIC_TECHS = []`.
  - Conditional rendering:
    ```tsx
    {PUBLIC_TECHS.length > 0 ? (
      <TechGrid techs={PUBLIC_TECHS} />
    ) : (
      <FleetStandbyCard message="Our certified fleet is staged across all metro zones. Book an appointment to be assigned the nearest available specialist." actionHref="/book" />
    )}
    ```
* **Preserved UI & Features:**
  - 100% of the technician card JSX, star rating badges, vehicle equipment tags, and scheduling buttons.

---

### 5. Customer Reviews Page
* **Route:** `/reviews`
* **File Paths:**
  - [`src/app/(public)/reviews/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(public)/reviews/page.tsx)
  - [`src/app/(public)/reviews/[id]/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(public)/reviews/[id]/page.tsx)
* **Demo Data Items to Remove:**
  - The entire `REVIEWS_DATA` array (all 8 fake Google review entries, fake customer testimonials referencing Carlos, Marcus, Elena, fake work orders `#WO-1004`, `#WO-1002`, and fake owner replies).
* **Conditional Visibility & Cleanup Rule:**
  - Set initial `REVIEWS_DATA = []`.
  - Conditional rendering:
    - When `reviews.length === 0`: Show clean empty state with *"Leave a Review"* button.
    - When real review is submitted: Dynamically prepends new review object into state and renders the full review card automatically.
* **Preserved UI & Features:**
  - Review card component code, star filter bars, search bar, and bottom CTA card.

---

### 6. Gallery Page
* **Route:** `/gallery`
* **File Path:** [`src/app/(public)/gallery/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(public)/gallery/page.tsx)
* **Demo Data Items Present (Documented per user request to preserve for now):**
  - Project 1: *"5-Ton Carrier Infinity 20 SEER2"* (`WO-1004`, Coral Gables).
  - Project 2: *"Seasonal 21-Point Condenser Coil Restoration"* (`WO-1002`, Downtown Miami).
  - Project 3: *"Smart Thermostat C-Wire Low Voltage Architecture"* (`WO-1001`, Coconut Grove).
  - Demo Video Reels: Diagnostic Walkthrough 1 & Coil Foaming Walkthrough 2.
* **Architecture Enhancement:**
  - Converted into an **Instagram-style post & video experience** with 📸 **Posts Tab** and 🎬 **Video Reels Tab**.
  - All demo items documented here so they can be purged when requested.

---

### 7. Careers Page
* **Route:** `/careers`
* **File Path:** [`src/app/(public)/careers/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(public)/careers/page.tsx)
* **Demo Data Items to Remove:**
  - Pre-filled mock application state defaults in modal.
* **Enhancements & Conditional Visibility:**
  - Active vacancies displayed with clear count badges (*"2 Openings"*, *"Immediate Start"*).
  - Every vacancy card equipped with direct **"Apply for Job"** button routing to `/apply?job={id}`.
* **Preserved UI & Features:**
  - Fleet perks grid, pay scales, equipment allowances, and health benefit cards.

---

### 8. Apply Page
* **Route:** `/apply`
* **File Path:** [`src/app/(public)/apply/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(public)/apply/page.tsx)
* **Demo Data Items to Remove:**
  - Mock state defaults: `hasEpa = true`, `experience = "5–10 Years"`. All form inputs start empty `""`.
* **Enhancements & Clarification:**
  - Header explicitly titled: **"Trade Technician Job Application Desk"**.
  - Top alert banner redirecting service customers to `/book`.
  - Pre-populates selected vacancy from URL (`?job=...`).

---

### 9. FAQ Page
* **Route:** `/faq`
* **File Path:** [`src/app/(public)/faq/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(public)/faq/page.tsx)
* **Demo Data Items to Remove:**
  - Pre-opened FAQ IDs in state: `openIds: { "faq-price-1": true, "faq-emerg-1": true }` -> reset to empty `{}`.
* **Enhancements & Conditional Visibility:**
  - Sticky category sidebar (`sticky top-24 self-start`).
  - Right panel displays **ONLY the questions belonging to the clicked category**, keeping all other categories and details hidden.

---

### 10. Pricing & Subscription Checkout Pages
* **Routes:** `/pricing`, `/subscribe`, `/subscribe/checkout`
* **File Paths:**
  - [`src/app/(public)/pricing/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(public)/pricing/page.tsx)
  - [`src/app/(public)/subscribe/checkout/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(public)/subscribe/checkout/page.tsx)
* **Demo Data Items to Remove:**
  - Form state defaults: `businessName = ""`, `fullName = ""`, `email = ""`, `phone = ""`.
* **Clarification:**
  - `/pricing`: Transparent service flat rates ($129 diagnostic, $169 emergency, $99 tuneup) + contractor platform plans.
  - `/subscribe`: Platform fleet checkout with tier selection (Starter Fleet, Pro Fleet, Enterprise).
  - Both pages keep the **tiny 1-line compliance footer on desktop** and **hidden on mobile**.

---

### 11. Payment Pages
* **Routes:** `/pay`, `/pay/[token]`
* **File Paths:**
  - [`src/app/(public)/pay/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(public)/pay/page.tsx)
  - [`src/app/(public)/pay/[token]/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(public)/pay/[token]/page.tsx)
* **Demo Data Items to Remove:**
  - `FALLBACK_INVOICE_JOB`: Hardcoded customer `"1421 Brickell Ave, Apt 18B"`, dummy line items, card last4 `"4242"`.
* **Conditional Visibility & Multi-Gateway:**
  - When real job/invoice token exists: Renders live invoice details.
  - Multi-method selector:
    - 💳 Cards
    - ⚡ UPI / VPA
    - 📲 Dynamic QR Code (Scan & Pay) with timer
    - 📱 PhonePe & Wallets
    - 🏦 Netbanking (All top banks)
    - 💵 On-site Cash / Check
  - Tiny compliance footer visible on desktop, hidden on mobile.

---

### 12. Online Booking Wizard
* **Route:** `/book`
* **File Paths:**
  - [`src/app/book/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/book/page.tsx)
  - [`src/components/booking/BookingWizard.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/components/booking/BookingWizard.tsx)
  - [`src/components/booking/steps/StepDetails.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/components/booking/steps/StepDetails.tsx)
* **Demo Data Items to Remove:**
  - Pre-filled customer name, phone, address, and notes fields.
  - Pre-selected demo technician cards: selection defaults to `"First Available Specialist"`.
* **Preserved UI & Features:**
  - 7-step wizard (Service -> Speed Tier -> Schedule -> Details -> Summary -> Deposit -> Confirmation) fully functional.
  - Footers hidden on mobile screens.

---

### 13. Pages Route (Marked for Deletion)
* **Route:** `/pages`
* **Directory:** [`src/app/(public)/pages/`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(public)/pages)
* **Action:**
  - **Permanently delete this entire folder** as requested by user.

---

## SECTION 2: CUSTOMER ACCOUNT PORTAL (`/account/*`)

### 14. Customer Dashboard & Appointments
* **File Paths:**
  - [`src/app/account/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/account/page.tsx)
  - [`src/app/account/appointments/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/account/appointments/page.tsx)
  - [`src/app/account/appointments/[id]/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/account/appointments/[id]/page.tsx)
  - [`src/app/account/appointments/[id]/track/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/account/appointments/[id]/track/page.tsx)
* **Demo Data Items to Remove:**
  - Hardcoded demo appointments array (fictitious capacitor repair, scheduled date May 27 2025, fake technician assignment).
  - Hardcoded tracking coordinates & simulated van moving intervals.
* **Conditional Visibility Rule:**
  ```tsx
  {appointments.length > 0 ? (
    <AppointmentsList appointments={appointments} />
  ) : (
    <EmptyState
      title="No Scheduled Appointments"
      description="You currently have no active or past service appointments."
      actionLabel="Book a Service Appointment"
      actionHref="/book"
    />
  )}
  ```
* **Preserved UI:**
  - All account navigation tabs, header, user profile dropdown, and GPS tracking view when an active appointment exists.

---

### 15. Invoices & Payments Portal
* **File Paths:**
  - [`src/app/account/invoices/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/account/invoices/page.tsx)
  - [`src/app/account/payments/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/account/payments/page.tsx)
* **Demo Data Items to Remove:**
  - Mock invoice records `INV-1004`, subtotal `$234.00`, fake line items, card ending in `4242`.
* **Conditional Visibility Rule:**
  - If `invoices.length === 0`: Hide table and display clean empty state *"No Invoices on Record"*.
  - When real invoice is generated: Automatically populates the invoice list with PDF download & Pay buttons.

---

### 16. Saved Addresses & Profile
* **File Paths:**
  - [`src/app/account/addresses/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/account/addresses/page.tsx)
  - [`src/app/account/profile/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/account/profile/page.tsx)
* **Demo Data Items to Remove:**
  - Default address: `"1421 Brickell Ave, Apt 18B"`.
  - Default profile name: `"Account Holder"`, default email, default phone.
* **Conditional Visibility Rule:**
  - Form fields start empty for new profiles.
  - Saved addresses list: `{addresses.length > 0 ? (...) : <NoAddressesEmptyState />}` with *"Add New Address"* button.

---

### 17. Account Reviews, Favorites & Notifications
* **File Paths:**
  - [`src/app/account/reviews/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/account/reviews/page.tsx)
  - [`src/app/account/favorites/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/account/favorites/page.tsx)
  - [`src/app/account/notifications/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/account/notifications/page.tsx)
* **Demo Data Items to Remove:**
  - Dummy notifications array (*"Assigned Technician has arrived at your address"*).
  - Dummy favorites list.
* **Conditional Visibility Rule:**
  - Notifications list hidden when empty (`notifications.length === 0`), showing *"No unread notifications"*.
  - Favorites and Reviews lists hidden when empty with prompt to add.

---

## SECTION 3: TECHNICIAN FIELD PORTAL (`/tech/*`)

### 18. Technician Jobs & Active Dispatch
* **File Paths:**
  - [`src/app/(tech)/tech/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(tech)/tech/page.tsx)
  - [`src/app/(tech)/tech/jobs/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(tech)/tech/jobs/page.tsx)
  - [`src/app/(tech)/tech/jobs/[id]/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(tech)/tech/jobs/[id]/page.tsx)
* **Demo Data Items to Remove:**
  - Hardcoded assigned job `#1004` (emergency AC repair, customer address, scheduled times).
* **Conditional Visibility Rule:**
  ```tsx
  {assignedJobs.length > 0 ? (
    <JobsQueue jobs={assignedJobs} />
  ) : (
    <EmptyQueueState message="No active dispatches assigned to your unit. Standby for central dispatch." />
  )}
  ```
* **Preserved UI:**
  - Tech navigation, SOS safety button, GPS toggle, job status filters, and checklist modals.

---

### 19. Technician Checklist, Parts & Estimate Builders
* **File Paths:**
  - [`src/app/(tech)/tech/jobs/[id]/checklist/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(tech)/tech/jobs/[id]/checklist/page.tsx)
  - [`src/app/(tech)/tech/jobs/[id]/parts/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(tech)/tech/jobs/[id]/parts/page.tsx)
  - [`src/app/(tech)/tech/jobs/[id]/estimate/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(tech)/tech/jobs/[id]/estimate/page.tsx)
* **Demo Data Items to Remove:**
  - Pre-checked safety diagnostic checkboxes.
  - Hardcoded pre-selected van parts: OEM dual run capacitor `$145.00`.
* **Conditional Visibility & Functional State:**
  - Checklist loads with unchecked inputs ready for on-site diagnostic entry.
  - Parts catalog search is live; selected parts list hidden until technician adds a part (`selectedParts.length > 0`).

---

### 20. Technician Schedule, Leave & Earnings
* **File Paths:**
  - [`src/app/(tech)/tech/schedule/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(tech)/tech/schedule/page.tsx)
  - [`src/app/(tech)/tech/leave/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(tech)/tech/leave/page.tsx)
  - [`src/app/(tech)/tech/earnings/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(tech)/tech/earnings/page.tsx)
* **Demo Data Items to Remove:**
  - Dummy weekly earnings metrics (`$1,420.00`, 8 completed jobs).
  - Pre-filled leave requests array.
* **Conditional Visibility Rule:**
  - Earnings metrics initialize to `$0.00` / 0 jobs until real completed jobs exist.
  - Leave history hidden when empty (`leaveRequests.length === 0`).
  - Request leave form always accessible.

---

## SECTION 4: ADMIN EXECUTIVE PORTAL (`/admin/*`)

### 21. Admin Dashboard & Metrics
* **File Path:** [`src/app/(admin)/admin/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(admin)/admin/page.tsx)
* **Demo Data Items to Remove:**
  - Dummy revenue chart data points, fabricated active job counts, and recent demo activity feed items.
* **Conditional Visibility Rule:**
  - Metric cards display `$0.00` revenue, `0` active jobs, `0` technicians until real data is present.
  - Activity feed: `{activity.length > 0 ? (...) : <NoActivityMessage />}`.
* **Preserved UI:**
  - 100% of the metric cards, KPI layouts, navigation sidebar, quick action buttons, and command palette.

---

### 22. Dispatch Board & Calendar
* **File Paths:**
  - [`src/app/(admin)/admin/dispatch/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(admin)/admin/dispatch/page.tsx)
  - [`src/app/(admin)/admin/dispatch/board/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(admin)/admin/dispatch/board/page.tsx)
  - [`src/app/(admin)/admin/dispatch/calendar/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(admin)/admin/dispatch/calendar/page.tsx)
* **Demo Data Items to Remove:**
  - Dummy Gantt timeline blocks with fictitious jobs and customer names.
  - Fake technician schedule blocks.
* **Conditional Visibility Rule:**
  - Gantt board and calendar render with real scheduled jobs only (`jobs.filter(...)`).
  - When empty: Displays clean open timeline ready for new job bookings.

---

### 23. Admin Jobs, Invoices & Payments Ledger
* **File Paths:**
  - [`src/app/(admin)/admin/jobs/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(admin)/admin/jobs/page.tsx)
  - [`src/app/(admin)/admin/jobs/create/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(admin)/admin/jobs/create/page.tsx)
  - [`src/app/(admin)/admin/invoices/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(admin)/admin/invoices/page.tsx)
  - [`src/app/(admin)/admin/payments/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(admin)/admin/payments/page.tsx)
  - [`src/app/(admin)/admin/payouts/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(admin)/admin/payouts/page.tsx)
* **Demo Data Items to Remove:**
  - Pre-populated jobs table records (`#1004`, `#1003`, `#1002`).
  - Pre-populated invoice records (`INV-1004`).
  - Pre-populated payment transactions.
* **Conditional Visibility Rule:**
  - Tables wrap in conditional visibility:
    ```tsx
    {records.length > 0 ? (
      <DataTable records={records} />
    ) : (
      <EmptyTableState title="No Records Found" actionHref="/admin/jobs/create" actionLabel="Create First Record" />
    )}
    ```
  - "Create Job", "Create Invoice", and filters remain permanently available.

---

### 24. Admin Customers & Technicians Management
* **File Paths:**
  - [`src/app/(admin)/admin/customers/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(admin)/admin/customers/page.tsx)
  - [`src/app/(admin)/admin/customers/[id]/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(admin)/admin/customers/[id]/page.tsx)
  - [`src/app/(admin)/admin/technicians/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(admin)/admin/technicians/page.tsx)
  - [`src/app/(admin)/admin/technicians/[id]/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(admin)/admin/technicians/[id]/page.tsx)
* **Demo Data Items to Remove:**
  - Dummy customers list (`cust-1004`, fake customer emails, fake phone numbers).
  - Dummy technicians list (`tech-carlos`, `tech-marcus`, `tech-elena`).
* **Conditional Visibility Rule:**
  - Customer directory and Technician directory hide table rows when empty, showing *"No registered customers/technicians"* with *"Add Technician"* / *"Add Customer"* buttons.

---

### 25. Admin Inventory, Parts & Reports
* **File Paths:**
  - [`src/app/(admin)/admin/inventory/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(admin)/admin/inventory/page.tsx)
  - [`src/app/(admin)/admin/inventory/parts/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(admin)/admin/inventory/parts/page.tsx)
  - [`src/app/(admin)/admin/inventory/transactions/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(admin)/admin/inventory/transactions/page.tsx)
  - [`src/app/(admin)/admin/reports/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(admin)/admin/reports/page.tsx)
  - [`src/app/(admin)/admin/reports/revenue/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(admin)/admin/reports/revenue/page.tsx)
  - [`src/app/(admin)/admin/reports/technicians/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(admin)/admin/reports/technicians/page.tsx)
* **Demo Data Items to Remove:**
  - Fictitious part transaction logs.
  - Fabricated revenue report line charts.
* **Conditional Visibility Rule:**
  - Standard HVAC catalog parts retained for selection.
  - Stock logs and transaction histories show empty state when `transactions.length === 0`.
  - Reports render clean zero-baseline charts until genuine ledger transactions occur.

---

## SECTION 5: SERVER LIBRARIES & LOCAL FALLBACKS

### 26. Server Datasets & Fallback DBs
* **File Paths:**
  - [`src/lib/server/local-db-fallback.ts`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/lib/server/local-db-fallback.ts)
  - [`src/lib/server/demo-dataset.ts`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/lib/server/demo-dataset.ts)
  - [`src/lib/server/customer-portal.ts`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/lib/server/customer-portal.ts)
  - [`src/lib/server/admin-portal.ts`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/lib/server/admin-portal.ts)
* **Demo Data Items to Remove:**
  - In-memory mock database seeding: replace hardcoded pre-populated arrays with clean empty arrays:
    - `mockJobs = []`
    - `mockInvoices = []`
    - `mockCustomers = []`
    - `mockPayments = []`
    - `mockNotifications = []`
* **Result:**
  - All portal APIs return clean empty responses `[]` until real data is submitted via the UI forms, triggering the conditional visibility automatically.

---

## Summary Checklist Across All 130 Pages

1. **Landing Page:** 100% demo data kept as is + admin "Edit Page Details" shortcut button added.
2. **Website Design:** 100% Intact.
3. **CTA Cards & Sections:** 100% Intact and always visible.
4. **Forms & Wizards:** 100% Intact and always ready for data entry.
5. **Data-Dependent Sections:** Conditionally hidden when empty (`items.length === 0`).
6. **Real-Data Reveal:** Automatically visible as soon as real items are added.
7. **Reviews:** Only fake reviews purged, dynamic review creation active.
8. **Admin Content CMS:** Fully built out for all website details (Prices, Policies, Terms, Refunds, Security, Accessibility, Services, FAQ, Careers).
