# ServicePro OS — Complete API Reference & Route Handlers

## Core API Architecture & Conventions
- **Base URL**: `http://localhost:3000` (Local) / Canonical production domain
- **Content-Type**: `application/json` (or `multipart/form-data` for file uploads)
- **Standard Error Response**:
  ```json
  {
    "error": {
      "code": "STRING_ERROR_CODE",
      "message": "Human-readable explanation of error",
      "details": {}
    }
  }
  ```
- **Security & CSRF Enforcement**: All mutation requests (`POST`, `PUT`, `PATCH`, `DELETE`) require verified origin/referer headers matching `NEXT_PUBLIC_APP_URL` and active session tokens.

---

## 1. Public & Booking Endpoints

### `GET /api/services`
Retrieves the complete catalog of active services with pricing, diagnostic fee, estimated duration, and category tags.
- **Auth**: None (Public)
- **Response**: `{ services: Array<ServiceItem> }`

### `GET /api/service-area?zip=90210`
Validates whether a specific ZIP code falls within the active dispatch territory.
- **Auth**: None (Public)
- **Response**: `{ supported: boolean, zone?: string, travelSurchargeCents?: number }`

### `GET /api/slots?date=YYYY-MM-DD&serviceId=svc-1&zip=90210`
Calculates available arrival windows based on technician capacity, business operating hours, scheduled time-off, and existing appointments.
- **Auth**: None (Public)
- **Response**: `{ date: string, slots: Array<SlotWindow> }`

### `POST /api/slots/hold`
Places an atomic 15-minute temporary reservation lock on an arrival slot to prevent double-booking collisions during checkout.
- **Auth**: CSRF Origin verification + Rate limiting (20 req/min)
- **Payload**: `{ serviceId: string, date: string, slotWindow: string, zip: string }`
- **Response**: `{ holdId: string, expiresAt: string }`

### `POST /api/jobs/checkout`
Creates a Stripe `PaymentIntent` for the booking deposit and links it to the active slot hold.
- **Auth**: CSRF Origin verification
- **Payload**: `{ holdId: string, customerName: string, customerEmail: string, customerPhone: string, address: string, depositCents: number }`
- **Response**: `{ clientSecret: string, paymentIntentId: string }`

### `GET /api/invoices/public/[token]`
Retrieves invoice breakdown and payment status for direct customer payment links.
- **Auth**: Public (Secure token-gated)
- **Response**: `{ invoice: EnrichedInvoice, business: BusinessPublicInfo }`

---

## 2. Customer Portal Endpoints (`/api/account/*`)

### `GET /api/account/dashboard`
Aggregates active appointments, recent invoices, saved payment methods, and notification counts for the authenticated customer.
- **Auth**: `customer`
- **Response**: `{ appointments: Array<Job>, invoices: Array<Invoice>, stats: CustomerStats }`

### `GET /api/account/appointments` & `GET /api/account/appointments/[id]`
Fetches customer appointment history and real-time status with technician ETA and live GPS tracking metadata.
- **Auth**: `customer` (Scoped to session `customer_id`)

### `GET /api/account/invoices`
Returns all invoices issued to the authenticated customer with payment status and PDF download URLs.
- **Auth**: `customer`

### `POST /api/account/profile` & `GET /api/account/addresses`
Manages customer profile information, default service address, and communication preferences.
- **Auth**: `customer`

---

## 3. Technician Field Operations Endpoints (`/api/technicians/*`)

### `GET /api/technicians/jobs` & `GET /api/technicians/jobs/[id]`
Returns work orders assigned to the authenticated field technician with customer contact info, issue descriptions, and location coordinates.
- **Auth**: `technician`

### `POST /api/technicians/jobs/[id]/checklist`
Updates completion state for required diagnostic steps, safety inspections, and task items.
- **Auth**: `technician`
- **Payload**: `{ itemId: string, completed: boolean, notes?: string }`

### `POST /api/technicians/jobs/[id]/parts`
Logs on-site parts and materials used from vehicle inventory.
- **Auth**: `technician`
- **Payload**: `{ partId: string, quantity: number, unitCostCents: number }`

### `POST /api/technicians/jobs/[id]/estimate`
Generates a field work estimate for customer sign-off prior to high-value repairs.
- **Auth**: `technician`
- **Payload**: `{ lineItems: Array<LineItem>, totalCents: number, signatureDataUrl: string }`

### `GET /api/technicians/earnings` & `GET /api/technicians/schedule`
Fetches pay period commissions, billable hours, customer tips, and upcoming weekly shifts.
- **Auth**: `technician`

---

## 4. Dispatch & Work Order Lifecycle Endpoints

### `GET /api/dispatch/board`
Returns real-time Kanban column states (`unassigned`, `assigned`, `on_the_way`, `in_progress`, `completed`), technician location pins, and daily calendar matrices.
- **Auth**: `owner`, `admin`

### `POST /api/dispatch/assign`
Assigns or reallocates a work order to a technician with conflict validation and automated SMS notification.
- **Auth**: `owner`, `admin`
- **Payload**: `{ jobId: string, technicianId: string | null, force?: boolean }`

### `POST /api/dispatch/suggest`
Executes the Smart Assign scoring engine (0–100 pts) evaluating proximity, technician skills, and workload.
- **Auth**: `owner`, `admin`
- **Payload**: `{ jobId: string }`
- **Response**: `{ recommendations: Array<{ technicianId: string, score: number, reasons: string[] }> }`

### `POST /api/jobs/[id]/status`
Transitions a work order status (`assigned` → `on_the_way` → `in_progress` → `completed` / `cancelled`).
- **Auth**: `owner`, `admin`, `technician`
- **Payload**: `{ status: string, notes?: string, location?: { lat: number, lng: number } }`

### `POST /api/jobs/[id]/cancel`
Cancels a work order and conditionally triggers an automated Stripe deposit refund.
- **Auth**: `owner`, `admin`
- **Payload**: `{ reason?: string, refundDeposit?: "auto" | "yes" | "no" }`

### `POST /api/jobs/[id]/complete`
Finalizes on-site job completion, records billable minutes, notes, digital customer signature, and issues the final balance invoice.
- **Auth**: `owner`, `admin`, `technician`
- **Payload**: `{ billableMinutes: number, tipCents?: number, techNotes?: string, lineItems: Array<LineItem>, signatureUrl?: string }`

---

## 5. Administrative Management Endpoints (`/api/admin/*`)

### `GET /api/admin/reports` & `GET /api/reports/revenue`
Aggregates business revenue, profit margins, parts overhead, labor costs, and technician commissions with CSV export capability.
- **Auth**: `owner`, `admin`
- **Query Params**: `from`, `to`, `groupBy` (`tech` | `service` | `day`)

### `GET /api/admin/catalog` & `POST /api/admin/catalog`
Full CRUD management for services, base pricing, hourly rates, and required technician skill tags.
- **Auth**: `owner`, `admin`

### `GET /api/admin/inventory` & `POST /api/admin/inventory/parts`
Manages warehouse and van stock levels, part SKU catalogs, reorder thresholds, and inventory cost tracking.
- **Auth**: `owner`, `admin`

### `GET /api/admin/audit-logs`
Provides an immutable chronological audit trail of all status transitions, credential logins, dispatches, and refunds.
- **Auth**: `owner`, `admin`

---

## 6. Security, MFA & Infrastructure Locker Endpoints

### `GET /api/admin/infrastructure`
Loads masked environment variable status (`••••••••`), database connection status, and cloud service health.
- **Auth**: `owner` strictly
- **Response**: `{ ok: boolean, credentials: Record<string, string>, secretStatus: Record<string, boolean> }`

### `POST /api/admin/infrastructure`
Updates credentials atomically via `.env.local.tmp` with automatic `.env.backup` generation and mask preservation.
- **Auth**: `owner` strictly + Quorum Consensus Verification
- **Payload**: `{ action: "save" | "test" | "restore_backup", credentials?: Record<string, string> }`

### `POST /api/auth/admin-mfa/verify`
Validates a factor challenge for the 5-Factor Admin MFA Plan.
- **Auth**: Authenticated session
- **Payload**: `{ factor: "totp" | "email_otp" | "webauthn" | "recovery_key", code: string }`
- **Response**: `{ ok: boolean, verifiedFactors: string[], quorumMet: boolean }`

---

## 7. Payments, Webhooks & System Endpoints

### `POST /api/payments/record`
Records an in-person or offline payment (Cash, Check, Physical POS Terminal) against an open invoice.
- **Auth**: `owner`, `admin`, `technician`
- **Payload**: `{ jobId: string, method: "cash" | "check" | "card_present", amountCents: number, reference?: string }`

### `POST /api/stripe/refund`
Executes an immediate Stripe refund against the deposit or invoice payment intent.
- **Auth**: `owner` strictly
- **Payload**: `{ jobId: string, amountCents?: number, reason?: string }`

### `POST /api/stripe/webhook`
Processes asynchronous Stripe events (`payment_intent.succeeded`, `charge.refunded`) with webhook signature validation and database idempotency ledger (`stripe_events`).
- **Auth**: Verified Stripe Webhook Signature

### `GET /api/cron/housekeeping`
Daily maintenance task that purges expired 15-minute slot holds, cleans orphaned temporary tokens, and compacts audit records.
- **Auth**: `Bearer <CRON_SECRET>`

### `GET /api/health`
Zero-dependency operational health check endpoint verifying database connectivity and runtime memory.
- **Auth**: None (Public)
- **Response**: `{ status: "ok", timestamp: string, version: "1.0.0" }`
