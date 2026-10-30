# SERVICEPRO OS — MASTER IMPLEMENTATION SPECIFICATION & PHASE 1 READ-ONLY REPOSITORY AUDIT

**Project:** ServicePro OS (Contractor Operations & HVAC Field Service Platform)  
**Document Status:** **FINAL CONSOLIDATED MASTER SPECIFICATION & INSPECTION AUDIT**  
**Stage:** Phase 1 — Final Documentation & Read-Only Audit  
**Authorization Level:** **STRICTLY READ-ONLY**  
**Implementation Approval:** **NOT GRANTED (AWAITING SEPARATE OWNER APPROVAL)**  
**Date:** October 31, 2026  

---

> [!IMPORTANT]
> ## MANDATORY PRE-IMPLEMENTATION APPROVAL GATE
> In strict accordance with user directives and engineering governance:
> 1. **Zero Project Code Files Have Been Modified, Deleted, or Overwritten.**
> 2. This single comprehensive document merges the entire Master Implementation Specification with the deep Read-Only Repository Inspection Audit into an exhaustive, file-by-file blueprint.
> 3. Execution of Phase 2 or any subsequent implementation phase **strictly requires explicit, separate approval from the project owner**.

---

## 1. REPOSITORY STATUS & READ-ONLY EVIDENCE

### 1.1 Git Working Tree Status
A repository-level verification was performed via `git status`:
* **Active Branch:** `main` (clean working tree for tracked files).
* **Commit Tracking:** Ahead of `origin/main` by 7 local commits (local commits only; no remote pushes performed).
* **Untracked Documentation Files:**
  - `COMPREHENSIVE_EDIT_PLAN.md`
  - `DEMO_DATA_INVENTORY.md`
  - `INSPECTION_REPORT.md`
  - `SERVICEPRO_OS_MASTER_SPECIFICATION_AND_INSPECTION.md`
  - `public/gallery.html`
  - `public/screenshots/`
  - `scripts/demo-data-audit.json`
  - `scripts/gallery-server.mjs`
* **Source Code Invariant:** No application source code in `src/`, `config/`, `public/`, or `package.json` was mutated during Phase 1.

---

## 2. GLOBAL DATA CLEANUP & CONDITIONAL VISIBILITY STANDARD

### 2.1 Always Preserved (100% Unchanged)
* **Design & Layout:** All typography, responsive Tailwind classes, dark glassmorphism backgrounds (`#0C1523`, `#0F172A`), container widths, and animations.
* **Navigation & Footers:** Desktop headers, sticky navbars, bottom desktop footers, and mobile footer visibility rules (`hidden md:block`).
* **Conversion Architecture:** All CTA cards, marketing banners, action buttons, pricing matrices, and feature breakdown cards.
* **Data-Entry Mechanisms:** All booking wizards, inquiry forms, job application desks, estimate requests, and filter controls (never hide mechanisms for collecting genuine user data).
* **Brand Assets:** Logos, icons, SVG vectors, and licensed photography in `public/images/`.

### 2.2 Prohibited Fabricated Data (To Be Purged in Later Phases)
* **Synthetic Customer Records:** Dummy account profiles (`cust-1004`, mock names like David, Elena, Maria, Robert).
* **Synthetic Work Orders:** Mock job records (`#1004`, `#1003`, `#1002`, fake line items).
* **Synthetic Financial Records:** Mock invoices (`INV-1004`), fake line item calculations, and mock transaction logs.
* **Synthetic Telemetry & Notifications:** Hardcoded alert feeds (*"Technician arrived at your address"*).
* **Synthetic Technician Profiles:** Hardcoded profiles (`tech-carlos`, `tech-marcus`, `tech-elena`) with fake review totals and fabricated availability.
* **Synthetic Testimonials:** Hardcoded 5-star Google review testimonials with fabricated reviewer attributions and mock owner replies.

### 2.3 Explicit Protected Exceptions (DO NOT REMOVE)
1. **Landing Page Showcase (`/`):**  
   Preserve all existing interactive demonstration widgets:
   - Interactive Workflow Builder (Steps 1–4).
   - Live Dispatch Telemetry Simulator.
   - Interactive Diagnostic Estimator & Instant Quote Calculator.
   - Role-Based Field App Preview.
   *Rule:* Preserve only these explicitly protected Landing Page showcase demonstrations and Gallery demo content. Do not restore, retain, or introduce fabricated customer, job, invoice, payment, technician, notification, or review records in other sections.
2. **Gallery Feed (`/gallery`):**  
   Preserve existing Before & After comparison project posts and demo diagnostic video reels until explicit future owner removal instruction.

### 2.4 Consistent Empty-State & Conditional Visibility Rules
1. **Hide Empty Data Grids & Tables:** When `items.length === 0`, do not render empty table skeletons or blank grids.
2. **Designed Empty-State Cards:** Where an empty state design exists, display the clean designed empty-state card informing the user and providing an action CTA.
3. **Always Keep CTA Sections Visible:** Surrounding CTA sections, banners, and help cards must never be hidden when data is empty.
4. **Zero Synthetic Dummy Records:** Never fall back to fake records when database records are empty.
5. **Never Hide Data-Entry Forms:** Forms, creation buttons, and booking wizards must always remain available so users can add real records.
6. **State Discrimination:** Cleanly distinguish between `loading` (spinner/skeleton), `error` (retry alert), and `empty` (`data.length === 0`).
7. **Permanent Component Integrity:** Never delete component code or JSX structures merely because their data source is currently empty.

---

### 2.5 USER DIRECTIVES ON FRONT UI & PAGE DETAILS SPECIFICATIONS

These specific front UI and page details requirements from the user are fully committed and prioritized:

1. **Landing Page Mobile Sidebar & Admin Shortcut (`/`):**
   - Fix the mobile sidebar drawer carefully and perfectly on mobile screens: mount via `createPortal(..., document.body)` with solid `#0C1523` opaque background, zero transparency bleed, proper touch interaction, and smooth slide-in.
   - Keep all landing page demo data, telemetry, and workflow builder showcases intact.
   - Add an accessible **"Edit Page Details"** shortcut button linking directly to `/admin/content?edit=cnt-home`.

2. **About Page CTA Background Image Restoration (`/about`):**
   - Restore the missing background image [`public/images/final-cta-house.jpg`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/public/images/final-cta-house.jpg) to the final CTA card with a dark gradient overlay for high contrast and readability.
   - Retain booking CTA button (`/book`) and emergency dispatch hotline (`tel:`).

3. **Services Page CTA & Worker Profile Avatars (`/services`):**
   - Remove all hardcoded worker demo names from CTA cards (`"Dispatch Carlos Now"`, `"Schedule Marcus"`).
   - Keep the CTA card layout and functionality completely intact, replacing text with dynamic dispatch labels (`"Dispatch Available Specialist"`).
   - Add worker's own profile photo/avatar feature (`avatarUrl?: string`) inside the worker cards, with monogram initials fallback.
   - Wrap assigned workers card in conditional rendering so services without assigned workers show cleanly without synthetic records.

4. **Pricing vs. Subscription Clarification (`/pricing` & `/subscribe`):**
   - Resolve naming and feature confusion between pages:
     - **`/pricing`:** Dedicated to customer HVAC service transparent flat-rate diagnostic pricing ($129 Diagnostic, $169 Emergency, $99 Tune-Up) with deposit credit guarantee, plus a clear section signposting fleet contractors to `/subscribe`.
     - **`/subscribe`:** Dedicated to contractor SaaS fleet subscription plans (Starter, Pro, Enterprise) with 14-day free trial checkout and instant console provisioning.

5. **Payment Gateway Multi-Option Expansion (`/pay/[token]`):**
   - Expand beyond card-only by adding dedicated interactive tabs for:
     - Credit / Debit Card (Visa, MasterCard, Amex via Stripe Elements).
     - UPI / VPA (Input for VPA handles with format validation).
     - Dynamic QR Code (High-contrast auto-generated QR for mobile Scan & Pay).
     - PhonePe / Wallets (Direct intent and digital wallet checkout).
     - Netbanking (Bank selector for top retail and commercial institutions).
   - Backed by server-side payment verification (`/api/pay/verify`) and idempotency duplicate protection.

6. **Careers Page Vacancies & Direct Apply Buttons (`/careers`):**
   - Add a direct **"Apply for Job"** button on every single opening/vacancy card that deep-links directly to `/apply?job={id}`.

7. **Apply Page Purpose & Role Clarity (`/apply`):**
   - Add a prominent top banner clarifying:  
     *“This intake portal is exclusively for Field Technicians & Trade Employment Applications. If you are a customer looking to schedule HVAC service or repairs, please [Book Online Here →](/book)”*
   - Support reading `?job=` query parameter from the URL to automatically pre-select the appropriate position in the application dropdown.

8. **FAQ Page Sticky Sidebar & Isolated Category Display (`/faq`):**
   - Fix the sidebar with `sticky top-24 self-start` positioning so it remains fixed while scrolling.
   - When a user clicks any category, display **ONLY** that category's questions; keep all other categories and unrelated details completely hidden.

9. **Gallery Page Instagram-Style Feed (`/gallery`):**
   - Transform into an Instagram-style feed with dual separate navigation tabs:
     - **Posts Tab (Before & After Feed):** Technician profile header (avatar, name, trade verification badge, location), interactive Before/After comparison slider, Like button with interactive heart counter, comments, caption with equipment specs, and "Book Service" button.
     - **Video Reels Tab:** Vertical 9:16 video showcase with play/pause, duration badge, displaying diagnostic and coil-cleaning video demonstrations.
   - Preserve existing demo posts and reels as explicitly directed, cataloged in `DEMO_DATA_INVENTORY.md` for clean future removal.

10. **Reviews Page Fake Data Removal & Dynamic Card Creation (`/reviews`):**
    - Remove all fake dummy reviews (`REVIEWS_DATA = []`).
    - Keep review card layout and CTA section 100% intact.
    - When `reviews.length === 0`, show designed empty-state card: *"No reviews yet. Be the first verified customer to share your experience!"* with "Write a Review" button.
    - Implement interactive review submission modal connecting to `/api/reviews`. When a review is added, it is persisted and renders newly created review cards dynamically.

11. **Technicians Page Neutral Empty-State (`/technicians`):**
    - Remove all fake technician profiles (`PUBLIC_TECHS = []`).
    - Keep CTA section and card grid code 100% intact.
    - Show neutral empty state: *"Technician Profiles Coming Soon"* with *"Book Service"* CTA.
    - When real technicians are added to the database, cards reveal automatically.

12. **Permanent Safe Deletion of Unnecessary `/pages` Route:**
    - Safely delete `src/app/(public)/pages/page.tsx` and folder `src/app/(public)/pages/`.
    - Clean referencing files (`account/layout.tsx`, `Navbar.tsx`, `BrandTagline.tsx`, `AuthLockBanner.tsx`, `capture-all.mjs`).
    - Preserve all individual pages at original URLs; do not create a replacement directory.

13. **Admin Content CMS Multi-Page Editor (`/admin/content`):**
    - Multi-page CMS editor covering all 14 website pages (Home, Pricing, Subscribe, Privacy, Terms, Refund, Security, Accessibility, About, Careers, Contact, FAQ, Service Areas, Services).
    - Save Draft vs. Publish Live workflow with modal confirmation.
    - Revision history audit trail with 1-click rollback.
    - Deep-linking support (`/admin/content?edit=cnt-home`) and Live Preview links.

---

## 3. DEDICATED FEATURE SPECIFICATIONS & TECHNICAL DECISIONS

### 3.1 Technicians Directory Specification (`/technicians`)
* **Target File:** `src/app/(public)/technicians/page.tsx`
* **Audit Findings:** Lines 8–42 define 3 hardcoded mock technician profiles (`PUBLIC_TECHS`) with fabricated ratings, badges, and review counts.
* **Neutral Empty-State Specification:**
  - Remove all unverified claims regarding active fleet staging or guaranteed immediate dispatch across all metro zones.
  - Set `PUBLIC_TECHS = []`.
  - When `PUBLIC_TECHS.length === 0`, render the neutral designed empty state:
    - **Heading:** `"Technician Profiles Coming Soon"`
    - **Description:** `"Our technician directory will display available specialists as verified profiles are added. You can still request HVAC service online."`
    - **CTA Button:** `"Book Service"` (linking to `/book`).
* **Display Criteria:** Real technician cards will render within the preserved grid only when sourced from verified database records. Credentials (EPA Section 608, NATE Master) will display only when independently verified.

---

### 3.2 Pricing and Business Configuration Specification

All prices and commercial values currently shown in ServicePro OS are illustrative sample/demo values and must not be interpreted as final approved business pricing.

The platform must support Admin-managed configuration of:
- Subscription plans and billing intervals
- Diagnostic and service charges
- Emergency service rates
- Tune-up rates
- Reservation deposits and deposit-credit rules
- Taxes, discounts, and promotional offers
- Free-trial duration and subscription terms
- Other configurable business information

**Implementation & Governance Rules:**
1. **Sample Prices Retained for UI Previews:** Illustrative sample values in [`src/app/(public)/pricing/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(public)/pricing/page.tsx) and [`src/app/(public)/subscribe/checkout/page.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/src/app/(public)/subscribe/checkout/page.tsx) are retained solely for layout demonstration and UI testing.
2. **No Hardcoded Final Pricing:** Do not treat sample values in frontend code as permanent approved production prices. Treat them as placeholders until Admin configures actual values.
3. **Admin Control:** The final subscription plans, diagnostic rates, deposits, taxes, and trial periods will be managed via the Admin CMS (`/admin/content`) when implemented in Phase 6.
4. **Not a Blocker for Phase 2:** Pricing confirmation is **NOT** a blocker for proceeding with unrelated approved implementation work, such as the safe deletion of the obsolete `/pages` route in Phase 2.
5. **No Invented Commercial Claims:** This requirement does not authorize inventing prices, publishing unapproved commercial claims, or changing payment behavior during the read-only inspection or Phase 2 deletion work.

---

### 3.3 Customer Reviews: Dual-State Architecture & Moderation
* **Target Files:**
  - Public Feed: `src/app/(public)/reviews/page.tsx`
  - Admin Moderation Desk: `src/app/(admin)/admin/reviews/page.tsx`
  - New Endpoints: `src/app/api/reviews/route.ts` & `src/app/api/admin/reviews/route.ts`
* **Audit Findings:**  
  `src/app/(admin)/admin/reviews/page.tsx` already exists in the repository, but currently relies on hardcoded mock items (`DEFAULT_REVIEWS`) in local React state and lacks backend API connectivity.
* **Dual Independent State Models:**
  ```typescript
  type ReviewVerificationStatus = "pending" | "verified" | "unverified";
  type ReviewModerationStatus = "pending" | "approved" | "rejected" | "hidden";

  interface ReviewEntity {
    id: string;
    customerName: string;
    customerEmail?: string;
    customerPhone?: string;
    rating: number; // 1-5
    reviewText: string;
    serviceTag: string;
    jobId?: string;
    invoiceId?: string;
    verificationStatus: ReviewVerificationStatus;
    moderationStatus: ReviewModerationStatus;
    verifiedAt?: string;
    moderatedAt?: string;
    moderatedBy?: string;
    createdAt: string;
  }
  ```
* **Verification Governance:**
  1. **Zero Client Trust:** Any client-supplied flags (e.g. `isVerified: true`) submitted via `POST /api/reviews` are discarded.
  2. **Backend Match Required:** `verificationStatus` is set to `"verified"` **only** if the backend resolves a genuine completed job (`jobs.find(j => j.id === payload.jobId && j.status === "completed")`) or a paid invoice token.
  3. **Public Feed Rule:** The public feed (`GET /api/reviews`) displays **only** reviews where `moderationStatus === "approved"`.
  4. **Verified Badge Display:** The "Verified Customer" badge displays **only** when `verificationStatus === "verified"`.
  5. **Empty State:** When zero approved reviews exist, show designed empty card: *"No reviews yet. Be the first verified customer to share your experience!"* with `"Write a Review"` CTA.

---

### 3.4 Payment Provider Audit & Capability Matrix
* **Target Files:**
  - Payment Flow: `src/app/(public)/pay/[token]/page.tsx`
  - New Verification Endpoint: `src/app/api/pay/verify/route.ts`
  - Existing Stripe Handlers: `src/app/api/stripe/pay-link-intent/route.ts`, `src/app/api/stripe/webhook/route.ts`
* **Repository Configuration Audit (`.env.local`):**
  - Configured Provider: Stripe test placeholder keys only (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`).
  - Indian Payment Gateways: No environment variables or credentials exist for Razorpay, Cashfree, or PhonePe.
* **Payment Method Readiness Classification:**

| Payment Channel | Classification | Current State in Repository | Implementation Path |
| :--- | :--- | :--- | :--- |
| **Credit / Debit Cards** | **Category A** (Integrated & Configured) | Stripe Elements integration exists with test credentials. | Verify idempotency keys and backend amount validation. |
| **UPI (Stripe Hosted)** | **Category B** (Requires Merchant Activation) | Stripe India supports UPI via Stripe Checkout if enabled on merchant account. | Supported via Stripe Checkout session with server verification. |
| **Custom UPI / Dynamic QR** | **Category C** (Requires Gateway Integration) | No native Indian UPI intent libraries or merchant APIs configured. | Requires merchant onboarding on Razorpay/Cashfree with secret keys in `.env.local`. |
| **PhonePe / Wallets** | **Category C** (Requires Gateway Integration) | No PhonePe merchant SDK or PG endpoints configured. | Requires PhonePe PG integration with merchant ID and salt keys. |
| **Netbanking** | **Category B / C** | Stripe supports select Indian banks via redirect if Stripe India is activated; otherwise requires Razorpay. | Requires provider verification before activation. |

* **Strict Payment Governance Rules:**
  - **No Simulated Success:** Under no circumstances will a simulated "Payment Succeeded" modal be displayed without server-verified confirmation from a real payment provider.
  - **Zero Credential Storage:** Never store raw card numbers, CVVs, or bank passwords in application storage.
  - **Server-Side Verification:** Invoices are marked `paid` only after `/api/pay/verify` validates the provider's transaction amount, currency, and confirmed status.
  - **Idempotency Protection:** Enforce idempotency keys (`pay_tok + attempt_id`) to prevent double billing.
  - **Factual Compliance Claims:** Do not claim PCI-DSS Level 1 compliance or 256-bit SSL encryption unless externally verified. Maintain a clean 1-line compliance footer on desktop, hidden on mobile.

---

### 3.5 CMS Backend Architecture & Persistence Evaluation
* **Target File:** `src/app/(admin)/admin/content/page.tsx`
* **Proposed Storage:** `data/cms-content.json`
* **Architectural Evaluation:**

| Criterion | `data/cms-content.json` Evaluation | Repository Alternative | Recommendation |
| :--- | :--- | :--- | :--- |
| **Filesystem Availability** | Ephemeral in serverless hosting (Vercel/Lambda read-only runtime). Writes fail or reset on cold start. | Supabase PostgreSQL / LocalDb fallback (`src/lib/server/local-db-fallback.ts`). | **NOT PRODUCTION READY FOR SERVERLESS.** Must use database storage for serverless deployments. |
| **Multiple Instances** | File writes on Instance A do not propagate to Instance B, causing state drift. | Supabase PostgreSQL / Centralized DB. | Requires central DB if multi-instance. |
| **Concurrent Writes** | Risk of JSON file corruption during overlapping admin edits. | PostgreSQL row-level locks / Advisory locks. | Enforce file locking or DB transactions. |
| **Data Durability** | Local file lost on container redeployment or branch rebuild. | Supabase / Managed DB. | Backed by durable storage. |
| **Audit & Rollback** | Requires custom JSON array tracking revisions. | Existing `recordAdminAuditLog` in `admin-portal.ts`. | Connect directly to existing audit log. |
| **Server Authorization** | File storage has no native auth. | `resolveAdminSession(request)` in `admin-portal.ts`. | Enforce `resolveAdminSession` server-side on API. |

* **CMS Technical Verdict:**  
  **STATUS: UNRESOLVED — REQUIRES OWNER DECISION.**  
  While `data/cms-content.json` can operate in local Node.js environments with file-locking, it is incompatible with serverless cloud hosting (e.g. Vercel). The repository contains Supabase client libraries (`@supabase/supabase-js`, `@supabase/ssr`), which represent the production-grade persistence path. Until the deployment target is confirmed, CMS implementation must remain deferred to Phase 6.

* **14-Page CMS Registry:**
  1. Home Landing Page (`/`)
  2. HVAC Diagnostic Rates (`/pricing`, `/pay`)
  3. Contractor SaaS Plans (`/subscribe`)
  4. Privacy Policy (`/privacy`)
  5. Terms of Service (`/terms`)
  6. Refund Policy (`/refund-policy`)
  7. Security & Compliance (`/security`)
  8. Accessibility Statement (`/accessibility`)
  9. About Us (`/about`)
  10. Careers & Vacancies (`/careers`)
  11. Contact Center (`/contact`)
  12. FAQ Knowledge Base (`/faq`)
  13. Service Areas (`/service-areas`)
  14. HVAC Services (`/services`)

---

### 3.6 Safe Deletion Audit of the `/pages` Directory
* **Target File for Deletion:** `src/app/(public)/pages/page.tsx` (37,347 bytes)
* **Target Directory for Deletion:** `src/app/(public)/pages/`
* **Complete Codebase Reference Audit & Replacement Targets:**

| Referencing File | Line(s) | Current Reference | Exact Replacement Action in Phase 2 |
| :--- | :--- | :--- | :--- |
| `src/app/account/layout.tsx` | 165 | `{ href: "/pages", label: "Pages Directory", icon: Globe }` | **Delete this navigation item.** The account portal already contains Appointments, Invoices, Payments, Technicians, Profile, Support. |
| `src/app/account/layout.tsx` | 428 | `<Link href="/pages">Pages Directory</Link>` | **Remove link** or replace with `href="/" (Home)`. |
| `src/components/brand/BrandTagline.tsx` | 35 | `pathname === "/pages" \|\|` | **Remove `pathname === "/pages"`** check from the condition. |
| `src/components/layout/Navbar.tsx` | 239 | `<Link href="/pages">...Pages Directory...</Link>` | **Remove link from public navbar.** Main navigation already contains Services, Pricing, About, Careers, FAQ, Contact. |
| `src/components/shared/AuthLockBanner.tsx` | 46 | `href="/pages"` | Replace with **`href="/"` (Return to Home)**. |
| `scripts/capture-all.mjs` | 20 | `{ name: '015_pages', url: '/pages' }` | **Remove route entry** from screenshot capture array. |
| `src/middleware.ts` | — | None | No references found in middleware. |
| `next.config.mjs` | — | None | No redirects or rewrites to `/pages`. |
| `src/app/sitemap.ts` | — | None | Only includes `/` and `/book`. |
| `tests/unit/*.ts` | — | None | No unit tests reference `/pages`. |

* **Preservation Guarantee:** Every individual website page (`/about`, `/services`, `/pricing`, `/careers`, `/apply`, `/faq`, `/gallery`, `/reviews`, `/technicians`, etc.) remains **100% active, untouched, and functioning at its original URL**. Zero replacement directory index pages will be created.

---

## 4. COMPLETE PORTAL-BY-PORTAL INVENTORY

### 4.1 Public Marketing Pages
1. **Landing Page (`src/app/(public)/page.tsx`):**  
   *Classification:* Planned Modification (Phase 3).  
   *Action:* Wrap mobile slide-out drawer inside `createPortal(..., document.body)` with solid `#0C1523` background. Add accessible "Edit Page Details" button linking to `/admin/content?edit=cnt-home`.  
   *Protection:* Preserve all interactive showcases, telemetry widgets, and workflow calculators.
2. **About Us (`src/app/(public)/about/page.tsx`):**  
   *Classification:* Planned Modification (Phase 4).  
   *Action:* Restore high-resolution background image `public/images/final-cta-house.jpg` on the final CTA card with dark gradient overlay. Conditionally render team members only when genuine data exists.
3. **Services Catalog (`src/app/(public)/services/page.tsx` & `src/components/services/ServicesCatalogClient.tsx`):**  
   *Classification:* Planned Modification (Phase 4).  
   *Action:* Replace hardcoded worker names on CTA buttons with dynamic dispatch text (`"Dispatch Available Specialist"`). Add worker avatar image rendering (`avatarUrl?: string`) falling back to monogram initials.
4. **Pricing Page (`src/app/(public)/pricing/page.tsx`):**  
   *Classification:* Planned Modification (Phase 4).  
   *Action:* Display transparent flat-rate diagnostic rates ($129 Standard Diagnostic, $169 Emergency, $99 Tune-Up) with deposit credit guarantee. Signpost fleet contractors to `/subscribe`.
5. **Subscription Checkout (`src/app/(public)/subscribe/checkout/page.tsx`):**  
   *Classification:* Planned Modification (Phase 4).  
   *Action:* Retain contractor SaaS fleet subscription checkout with 14-day free trial. Pricing marked Pending Owner Confirmation.
6. **Careers (`src/app/(public)/careers/page.tsx`):**  
   *Classification:* Planned Modification (Phase 4).  
   *Action:* Add direct "Apply for Job" buttons on all vacancy cards linking to `/apply?job={id}`.
7. **Fast Trade Application (`src/app/(public)/apply/page.tsx`):**  
   *Classification:* Planned Modification (Phase 4).  
   *Action:* Add prominent banner clarifying this desk is strictly for field technician trade employment applications, linking customer service bookings to `/book`. Pre-select position based on `?job=` query parameter.
8. **FAQ Knowledge Base (`src/app/(public)/faq/page.tsx`):**  
   *Classification:* Planned Modification (Phase 4).  
   *Action:* Implement `sticky top-24 self-start` sidebar. Clicking any category displays only that category's questions, keeping other categories hidden.
9. **Visual Gallery (`src/app/(public)/gallery/page.tsx`):**  
   *Classification:* Planned Modification (Phase 4).  
   *Action:* Convert to Instagram-style layout with Posts tab (Before/After comparison slider, likes, comments) and Video Reels tab (diagnostic video demonstrations).  
   *Protection:* Preserve existing demo posts and reels as explicitly directed.
10. **Customer Reviews (`src/app/(public)/reviews/page.tsx`):**  
    *Classification:* Planned Modification (Phase 5).  
    *Action:* Purge hardcoded fake reviews (`REVIEWS_DATA = []`). Display designed empty-state card when empty. Implement interactive review modal connected to `/api/reviews`.
11. **Technicians Roster (`src/app/(public)/technicians/page.tsx`):**  
    *Classification:* Planned Modification (Phase 5).  
    *Action:* Purge mock technician profiles (`PUBLIC_TECHS = []`). Display neutral "Technician Profiles Coming Soon" empty-state card with "Book Service" CTA.
12. **Customer Invoice Payment (`src/app/(public)/pay/[token]/page.tsx`):**  
    *Classification:* Planned Modification (Phase 5).  
    *Action:* Implement multi-channel payment method selector with server-side transaction verification and idempotency protection.

---

### 4.2 Admin Portal (`src/app/(admin)/admin/...`)
* **Dashboard (`src/app/(admin)/admin/page.tsx`):**  
  *Action:* Remove synthetic revenue numbers ($8,420, $142,500) and mock dispatch feeds. Compute KPIs dynamically from database stores; display neutral zero states (`$0.00`, `0`, `0%`) when empty.
* **Dispatch & Dispatch Board (`src/app/(admin)/admin/dispatch/page.tsx` & `board/page.tsx`):**  
  *Action:* Preserve dispatch grid, Gantt map, and technician columns. Source jobs strictly from genuine dispatch records. Hide empty job cards when zero dispatches exist.
* **Jobs Management (`src/app/(admin)/admin/jobs/page.tsx`):**  
  *Action:* Purge hardcoded demo jobs. Render genuine jobs from backend.
* **Invoices Management (`src/app/(admin)/admin/invoices/page.tsx`):**  
  *Action:* Purge mock invoice records (`INV-1004`). Display genuine invoices only.
* **Payments Management (`src/app/(admin)/admin/payments/page.tsx`):**  
  *Action:* Purge mock payments. Display genuine payment transaction logs only.
* **Technicians Management (`src/app/(admin)/admin/technicians/page.tsx`):**  
  *Action:* Purge fake technician profiles. Roster displays genuine field specialists only.
* **Customers Management (`src/app/(admin)/admin/customers/page.tsx`):**  
  *Action:* Purge fake customer profiles. Display genuine customer records only.
* **Review Moderation (`src/app/(admin)/admin/reviews/page.tsx`):**  
  *Action:* Connect existing moderation UI to `/api/admin/reviews` to approve, reject, or hide reviews with audit logging.
* **Content CMS (`src/app/(admin)/admin/content/page.tsx`):**  
  *Action:* Expand to 14-page registry with draft/publish workflow, server-side admin role check, stored XSS sanitization, and rollback.

---

### 4.3 Technician Portal (`src/app/(tech)/tech/...`)
* **Tech Jobs & Schedule (`src/app/(tech)/tech/jobs/page.tsx` & `schedule/page.tsx`):**  
  *Action:* Clear hardcoded technician name defaults (`"Carlos Mendez"`). Display assigned work only when genuine assignments exist.
* **Tech Profile & Edit (`src/app/(tech)/tech/profile/page.tsx`):**  
  *Action:* Clear default mock names, phone numbers, and emergency contacts.
* **Tech Earnings (`src/app/(tech)/tech/earnings/page.tsx`):**  
  *Action:* Compute technician commissions and tips dynamically from completed work orders. Show neutral zero state (`$0.00`) when zero jobs have been completed.

---

### 4.4 Customer Portal (`src/app/account/...`)
* **Customer Dashboard (`src/app/account/page.tsx`):**  
  *Action:* Clear mock customer name (`"Maria Rivera"`) and fake appointment widgets. Display genuine active bookings only.
* **Appointments (`src/app/account/appointments/page.tsx`):**  
  *Action:* Purge mock appointment items. Show designed empty state when zero bookings exist.
* **Invoices & Payments (`src/app/account/invoices/page.tsx` & `payments/page.tsx`):**  
  *Action:* Display genuine invoices and receipts only.
* **Technicians (`src/app/account/technicians/page.tsx`):**  
  *Action:* Display past serviced technicians only when genuine completed service history exists.

---

## 5. SEVEN-PHASE IMPLEMENTATION SEQUENCE

1. **Phase 1: Final Inspection & Documentation (CURRENT STAGE - COMPLETED)**  
   Resolve all contradictions, inspect all relevant files, verify Git status, and finalize master documents. Zero source code changes.
2. **Approval Gate Checkpoint (AWAITING OWNER APPROVAL)**  
   Present final documents and approval checklist. Do not proceed without explicit owner authorization.
3. **Phase 2: Remove Obsolete `/pages` Route & Reference Cleanup**  
   Permanently delete `src/app/(public)/pages/page.tsx` and folder `src/app/(public)/pages/`. Clean references in `account/layout.tsx`, `Navbar.tsx`, `BrandTagline.tsx`, `AuthLockBanner.tsx`, and `capture-all.mjs`. Verify build and routes.
4. **Phase 3: Landing Page & Admin Access**  
   Implement `createPortal(..., document.body)` for the mobile slide-out drawer with solid `#0C1523` background. Add accessible "Edit Page Details" button linking to `/admin/content?edit=cnt-home`. Preserve all showcase demonstrations.
5. **Phase 4: Public Website Cleanup**  
   - About: Restore CTA background image (`public/images/final-cta-house.jpg`) with dark overlay. Conditionally render team.
   - Services: Replace Carlos/Marcus labels with dynamic dispatches. Add worker avatar image support.
   - Pricing & Subscribe: Clarify transparent flat rates vs. SaaS fleet subscriptions. Mark prices Pending Owner Confirmation.
   - Careers & Apply: Add "Apply for Job" buttons to vacancies; add clear trade application desk notice on `/apply`.
   - FAQ: Sticky sidebar (`sticky top-24 self-start`) with isolated single-category display.
   - Gallery: Instagram-style dual feed (Posts with Before/After slider & Video Reels tab), preserving existing demo content.
6. **Phase 5: Operational Functionality, Reviews, Payments & Portal Cleanup**  
   - Technicians: Purge mock profiles; render neutral "Technician Profiles Coming Soon" empty state with "Book Service" CTA.
   - Reviews: Purge fake reviews; implement backend verification (`verificationStatus`) and moderation (`moderationStatus`) via `/api/reviews` and connect admin moderation interface.
   - Payments: Implement multi-method checkout tabs with server verification (`/api/pay/verify`), idempotency, and secret isolation.
   - Portals: Remove fabricated records across Admin, Tech, and Customer portals with neutral zero states for empty metrics.
7. **Phase 6: Admin Content CMS**  
   Implement CMS editor with 14-page registry, server-side admin authorization (`resolveAdminSession`), stored XSS sanitization, draft/publish workflow, audit logging, and rollback, using approved persistent storage.
8. **Phase 7: Comprehensive Final Verification & QA**  
   Test all 14 CMS registry entries, all affected public pages, all three portals (Admin, Tech, Customer), all payment flows, review submission and retrieval, and every preserved route with full TypeScript compilation, Next.js build verification, and zero regression errors.

---

## 6. FINAL APPROVAL CHECKLIST

| Requirement | Audit Result | Evidence / File Reference |
| :--- | :--- | :--- |
| **Master Specification internally consistent** | **PASS** | Contradictions between phases, specs, and inspection reports fully reconciled in this document. |
| **Technician claims corrected** | **PASS** | Unverified claims removed. Neutral "Technician Profiles Coming Soon" empty state specified. |
| **CMS storage architecture validated** | **UNRESOLVED** | `data/cms-content.json` identified as non-viable for serverless environments. Requires owner decision on Supabase vs local storage before Phase 6. |
| **Review verification separated from moderation** | **PASS** | Dual-state models defined (`pending/verified/unverified` vs `pending/approved/rejected/hidden`). Server validation against completed jobs enforced. |
| **Full portal inventory inspected** | **PASS** | All files in Public, Admin, Tech, and Account portals audited with exact paths, purposes, and actions. |
| **Payment readiness documented** | **PASS** | Classified into Categories A, B, and C. Stripe test keys identified; absence of Indian PG credentials documented. Simulated success prohibited. |
| **Pricing & commercial values classified** | **PASS** | Classified as illustrative sample/demo values. Admin configuration scheduled for Phase 6 CMS. Not a blocker for Phase 2. |
| **`/pages` references identified** | **PASS** | All 6 references across routes, navigation, scripts audited with exact replacement actions. Zero replacement directory. |
| **Protected features identified** | **PASS** | Landing page showcases/telemetry and Gallery demo posts/reels explicitly protected. |
| **Git status verified** | **PASS** | Working tree clean on tracked files; zero application source files modified during Phase 1. |
| **Phase 2 deletion scope safe** | **PASS** | Deleting `/pages` preserves all individual routes (`/about`, `/services`, etc.) at original URLs. |

---

## 7. STOP CONDITION & NEXT STEP

**PHASE 1 COMPLETE — AWAITING EXPLICIT OWNER APPROVAL FOR PHASE 2.**

In strict adherence to instructions:
- **Work is currently STOPPED.**
- **No application code files have been modified or deleted.**
- **Phase 2 will NOT commence until you provide explicit approval.**
