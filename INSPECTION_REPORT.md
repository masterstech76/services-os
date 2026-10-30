# SERVICEPRO OS — PHASE 1 READ-ONLY COMPREHENSIVE INSPECTION REPORT (REVISED)

**Project:** ServicePro OS (Contractor Operations & HVAC Field Service Platform)  
**Date:** October 30, 2026  
**Status:** **PHASE 1 AUDIT COMPLETE — FORMAL APPROVAL CHECKPOINT (AWAITING USER APPROVAL)**

---

> [!IMPORTANT]
> ## STRICT READ-ONLY COMPLIANCE & APPROVAL GATE
> 1. **Zero Project Code Files Have Been Modified, Deleted, or Overwritten.**
> 2. This report represents a deep technical audit of every affected file, route, data source, payment provider, and portal dependency.
> 3. Execution will **strictly commence only after you review this updated inspection report and provide explicit approval**.

---

## 1. CORRECTIONS & RESOLUTION OF PREVIOUS AUDIT ITEMS

### Correction 1: Neutral Empty-State on Technicians Page (`/technicians`)
* **Removal of Unverified Claims:**  
  All previously proposed claims regarding *"active fleet rotation across all metro zones"* or unverified technician readiness have been completely removed.
* **Neutral Empty-State Specification:**  
  When no verified technician profiles exist in the database, the page preserves its existing card design and structure while rendering a neutral, factual empty state:
  - **Heading:** `"Technician Profiles Coming Soon"`
  - **Message:** `"Our technician directory will display available specialists as verified profiles are added. You can still request HVAC service online."`
  - **Action CTA:** `"Book Service"` (linking to `/book`).
* **Display Criteria:** Profiles, EPA Section 608 certifications, NATE badges, and vehicle IDs will **only** render when backed by verified database records.

---

### Correction 2: Pricing Audit & Confirmation Protocol
A codebase audit reveals differing values currently configured in different files:

| Subscription Tier | `src/app/(public)/pricing/page.tsx` | `src/app/(public)/subscribe/checkout/page.tsx` | Previous User Chat Text |
| :--- | :--- | :--- | :--- |
| **Starter Fleet** | **$49 / month** ($39 annual) | **$79 / month** ($64 annual) | $49 / month |
| **Professional / Pro** | **$149 / month** ($119 annual) | **$149 / month** ($119 annual) | $129 / month |
| **Enterprise Fleet** | **$299 / month** ($249 annual) | **$299 / month** ($239 annual) | $299 / month |

* **Diagnostic Flat Rates (Consistent):**  
  - Diagnostic Dispatch: $129  
  - Emergency Priority Dispatch: $169  
  - Seasonal Maintenance Tune-Up: $99  
  - Tax Rate: 7.0%  
* **Governance Rule:**  
  Antigravity will **NOT** assume or hardcode either set of prices. All subscription rates and diagnostic prices are marked as **Pending Owner Confirmation** in CMS seed data and will only be published once explicitly confirmed by the business owner.

---

### Correction 3: Backend-Enforced Review Verification & Moderation
* **Zero Client-Side Trust:**  
  The client payload (`POST /api/reviews`) can **never** set `isVerified: true` or `status: "verified_customer"`. Any client-supplied verification flags will be stripped and ignored.
* **Server Verification Against Service Records:**  
  A review is granted `verified_customer` status **only** if the backend verifies a matching completed job record (`jobs.find(j => j.id === jobId && j.status === "completed")`) or a paid invoice token.
* **Default Pending Status:**  
  All user-submitted reviews without verified backend job linkage are assigned `status: "pending_moderation"`.
* **Public Feed Protection:**  
  The public reviews feed (`GET /api/reviews`) displays **only approved, verified reviews**. Unapproved or pending reviews are completely hidden from public view until authorized administrators approve them in the Admin Portal.
* **Verified Badge Criterion:**  
  The "Verified Customer" badge renders only when the backend database record explicitly contains `verified_at` and `verified_job_id`.

---

### Correction 4: Payment Provider Audit & Capability Matrix
An audit of existing environment variables (`.env.local`) and API routes was conducted:
* **Configured Provider:**  
  Only Stripe is currently configured via placeholder test environment variables:
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...`
  - `STRIPE_SECRET_KEY=sk_test_...`
  - `STRIPE_WEBHOOK_SECRET=whsec_...`
* **Indian Payment Gateway Status:**  
  There are **no** environment variables or merchant keys configured for Razorpay, Cashfree, or PhonePe (`RAZORPAY_KEY_ID`, `PHONEPE_MERCHANT_ID`, etc.).
* **Supported Capabilities vs. Requirements:**
  1. **Credit / Debit Cards:** Supported via Stripe Elements (`stripe.confirmCardPayment`).
  2. **UPI / Dynamic QR / Netbanking / PhonePe:**  
     - Stripe India supports UPI via Stripe Checkout, but direct custom UPI deep-linking, dynamic VPA generation, or Indian bank Netbanking redirects require either an activated Stripe India account with UPI enabled, or an Indian payment gateway integration (such as Razorpay/Cashfree).
     - **No Simulated Success:** Under no circumstances will mock or simulated "Payment Successful" screens be triggered without an actual server-side verified response from a real gateway.
     - **Provider Separation:** The checkout UI will render payment method options clearly indicating which channels are active under the configured provider and which require merchant gateway onboarding.
* **Server-Side Secret & Credential Isolation:**  
  - Zero storage of raw card numbers, CVVs, or bank credentials in application storage.
  - All secret keys remain strictly server-side.
  - Payment confirmation requires server verification (`/api/pay/verify`) validating amount, currency, reference, and final status before marking an invoice paid.
  - Webhooks enforce HMAC signature verification.

---

### Correction 5: Admin Content CMS Backend Architecture & Security
* **Storage Location:**  
  Server-side persisted JSON store (`data/cms-content.json`) with in-memory caching and filesystem ledger locking.
* **Draft vs. Published State:**  
  Each content entity maintains separate `published` and `draft` objects. Editing modifies `draft`; publishing promotes `draft` to `published` with a version increment.
* **Server-Side Authorization:**  
  Enforced in `src/app/api/admin/content/route.ts` via existing `resolveAdminSession(request)` from `src/lib/server/admin-portal.ts`. Requests without valid admin/owner session cookies receive HTTP 401 Unauthorized / 403 Forbidden.
* **Content Sanitization & Stored XSS Protection:**  
  All incoming text and HTML fields are sanitized server-side using HTML entity escaping and strict tag/attribute allowlisting before storage.
* **Audit Trail Integration:**  
  Every save, draft creation, publish, or rollback event calls `recordAdminAuditLog(...)` in `src/lib/server/admin-portal.ts`, recording admin email, role, timestamp, action, and modified fields into the Admin Audit Log.
* **Concurrency Protection & Rollback:**  
  Every revision receives a unique `revisionId` and incrementing sequence number. Overwriting a newer revision is rejected with HTTP 409 Conflict. 1-click rollback restores snapshots from the audit log.

---

### Correction 6: Comprehensive `/pages` Dependency Audit & Replacement Targets
A codebase-wide search across routes, navigation, middleware, sitemaps, and tests was executed:

| Referencing File | Line(s) | Current Code | Proposed Replacement Target |
| :--- | :--- | :--- | :--- |
| `src/app/account/layout.tsx` | 165 | `{ href: "/pages", label: "Pages Directory", icon: Globe }` | **Remove entry entirely.** Account portal already has Appointments, Invoices, Payments, Technicians, Support. |
| `src/app/account/layout.tsx` | 428 | `<Link href="/pages">Pages Directory</Link>` | **Remove link** or replace with `href="/" (Home)`. |
| `src/components/brand/BrandTagline.tsx` | 35 | `pathname === "/pages" \|\|` | **Remove `pathname === "/pages"`** from condition. |
| `src/components/layout/Navbar.tsx` | 239 | `<Link href="/pages">...Pages Directory...</Link>` | **Remove link from public navbar.** Main navigation already contains Services, Pricing, About, Careers, FAQ, Contact. |
| `src/components/shared/AuthLockBanner.tsx` | 46 | `href="/pages"` | Replace with **`href="/"` (Return to Home)**. |
| `scripts/capture-all.mjs` | 20 | `{ name: '015_pages', url: '/pages' }` | **Remove route entry** from screenshot capture script. |
| `src/middleware.ts` | — | None | No references found. |
| `next.config.mjs` | — | None | No redirects or rewrites to `/pages`. |
| `src/app/sitemap.ts` | — | None | Only includes `/` and `/book`. |
| `tests/unit/*.ts` | — | None | No tests reference `/pages`. |

* **Zero Replacement Directory:** No replacement directory or index page will be created. All individual routes remain untouched at their original paths.

---

### Correction 7: Complete File Dependency Inventory

#### 1. Files Planned for Safe Deletion (Phase 2):
* `src/app/(public)/pages/page.tsx`
* Directory `src/app/(public)/pages/`

#### 2. Files Planned for Modification:
* `src/app/(public)/page.tsx` (Portal drawer mounting & admin shortcut button)
* `src/app/(public)/about/page.tsx` (CTA background image restoration & conditional team rendering)
* `src/app/(public)/services/page.tsx` & `src/components/services/ServicesCatalogClient.tsx` (Dynamic CTA labels, worker avatar images, conditional worker list)
* `src/lib/services-detail-data.ts` (Dynamic technician labels, optional avatarUrl property)
* `src/app/(public)/pricing/page.tsx` (Service flat-rate diagnostic guide & fleet SaaS signpost)
* `src/app/(public)/subscribe/checkout/page.tsx` (Contractor fleet subscription checkout)
* `src/app/(public)/pay/[token]/page.tsx` (Multi-method payment tabs, server verification, secret isolation)
* `src/app/(public)/careers/page.tsx` (Direct "Apply for Job" vacancy links)
* `src/app/(public)/apply/page.tsx` (Clear employment intake notice & query-param job selection)
* `src/app/(public)/faq/page.tsx` (Sticky sidebar & single-category isolation filter)
* `src/app/(public)/gallery/page.tsx` (Instagram-style dual feed: Posts with Before/After slider & Video Reels)
* `src/app/(public)/reviews/page.tsx` (Fake reviews purge, empty state, review submission modal)
* `src/app/(public)/technicians/page.tsx` (Fake profiles purge, neutral "Coming Soon" empty state)
* `src/app/(admin)/admin/content/page.tsx` (14-page CMS editor with draft/publish, audit log, rollback)
* Three Portal Dashboards & Data Tables:
  - `src/app/(admin)/admin/page.tsx` (Neutral zero metrics, no synthetic feeds)
  - `src/app/(tech)/tech/earnings/page.tsx` (Neutral zero metrics, genuine dispatch records)
  - `src/app/account/page.tsx` (Genuine booking data only)
* Reference cleanup files:
  - `src/app/account/layout.tsx`
  - `src/components/brand/BrandTagline.tsx`
  - `src/components/layout/Navbar.tsx`
  - `src/components/shared/AuthLockBanner.tsx`
  - `scripts/capture-all.mjs`

#### 3. New Backend API Endpoints & Stores to Create:
* `src/app/api/pay/verify/route.ts` (Server payment verification & idempotency validation)
* `src/app/api/reviews/route.ts` (Review submission, server verification against jobs, moderation retrieval)
* `src/app/api/admin/content/route.ts` (CMS content persistence, draft/publish workflow, revision rollback)
* `src/lib/server/cms-store.ts` (Server CMS persistence layer with file locking & sanitization)

#### 4. Protected Files (Zero Code Changes Permitted):
* Landing page interactive showcase components (`Hero`, `WorkflowBuilder`, `LiveTelemetry`, `InteractiveEstimator`).
* Gallery demo assets and comparison media items.
* Core authentication libraries (`src/lib/server/auth.ts`, `src/lib/server/session.ts`).
* All UI primitives in `src/components/ui/*`.

---

### Correction 8: Business Claims Verification & Factual Governance
* **Prohibition of Fabricated Claims:**  
  The implementation will not assert unverified claims regarding mechanical licensing numbers, insurance amounts, specific response guarantees, or 24/7 availability unless backed by business configuration.
* **Configurable Placeholders:**  
  All business policies, diagnostic rates, refund terms, and warranty text will be clearly flagged as configurable defaults awaiting final owner signoff in the CMS.
* **Compliance Claims:**  
  Security statements will accurately reflect current server architecture without asserting third-party certifications (e.g. PCI-DSS Level 1) that have not undergone external audit.

---

## 2. SEVEN-PHASE EXECUTION PROTOCOL & SCOPE

* **Phase 1: Read-Only Project Inspection (COMPLETED)**
* **Approval Gate Checkpoint (CURRENT STAGE — AWAITING YOUR APPROVAL)**
* **Phase 2: Safe `/pages` Deletion & Reference Cleanup**
* **Phase 3: Landing Page Mobile Drawer Portal & Admin Shortcut**  
  *Rule:* Preserve only explicitly protected Landing Page showcases and Gallery demo content. Do not retain or introduce fake records elsewhere.
* **Phase 4: Public Page Refinements**  
  (About CTA image, Services avatars, Pricing rates, Careers apply desk, FAQ isolation, Instagram-style Gallery).
* **Phase 5: Secure Payment Gateway, Review Persistence & Portal Cleanup**  
  (Multi-method checkout, server review verification, neutral Technicians empty state, purge fake records across Admin, Tech, and Account portals with neutral zero states).
* **Phase 6: Admin Content CMS with Security & Revision History**  
  (14-page registry, server-side admin authorization, stored XSS sanitization, draft/publish, rollback).
* **Phase 7: Comprehensive Multi-Surface Verification**  
  *Scope:* Test all 14 CMS registry entries, all affected public pages, all three portals (Admin, Tech, Customer), all payment flows, review submission and retrieval, and every preserved route with full TypeScript compilation and Next.js build verification.
