# ServicePro OS — REST API & Integration Specification

> **Base URL**: `https://api.yourdomain.com/api/v1`  
> **Interactive Swagger UI**: `https://api.yourdomain.com/docs`  
> **Protocol**: HTTPS / REST / JSON  
> **Envelope Standard**: Unified `ApiResponse<T>` with RFC 3339 timestamps and unique request tracing IDs  

---

## 1. Standard Response Envelope

Every endpoint returns a standardized response envelope:

```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "meta": {
    "timestamp": "2026-11-16T12:00:00.000Z",
    "requestId": "req_1710590400000",
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalRecords": 142,
      "totalPages": 8
    }
  }
}
```

In the event of an error, HTTP status codes align with standard semantics (400, 401, 403, 404, 409, 429, 500):

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid booking request parameters",
    "details": [
      { "field": "latitude", "issue": "Expected number between -90 and 90" }
    ]
  },
  "meta": {
    "timestamp": "2026-11-16T12:00:00.000Z",
    "requestId": "req_1710590400000"
  }
}
```

---

## 2. Authentication & Tenant Headers

For authenticated requests, supply the bearer token and tenant identifier:

```http
Authorization: Bearer <jwt_access_token>
x-tenant-id: 00000000-0000-0000-0000-000000000001
Content-Type: application/json
```

---

## 3. Core API Endpoint Catalog

### Authentication & Sessions (`/api/v1/auth`)

| Method | Path | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/login` | Authenticate user with email and password | Public |
| `POST` | `/refresh` | Rotate expired access token using refresh token | Public |
| `POST` | `/mfa/verify` | Validate TOTP 6-digit MFA challenge | Public |
| `POST` | `/logout` | Revoke active refresh session | Authenticated |
| `GET` | `/me` | Get authenticated user identity and profile claims | Authenticated |

### Turnkey Installer (`/api/v1/installer`)

| Method | Path | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/test-db` | Test PostgreSQL + PostGIS database connection | Public |
| `POST` | `/provision` | Run database migrations, seed tenant & master admin | Bootstrap Token |

### Services & Catalog (`/api/v1/services`)

| Method | Path | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/categories` | List active service categories with counts | Public |
| `POST` | `/categories` | Create new service category | Admin |
| `GET` | `/` | List services with optional category filter | Public |
| `POST` | `/` | Create new service with pricing tiers | Admin |

### Bookings & Dispatch (`/api/v1/bookings` & `/api/v1/dispatch`)

| Method | Path | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/bookings` | Create on-demand booking request with pre-auth hold | Customer |
| `GET` | `/bookings` | List tenant bookings with pagination and status filters | Authenticated |
| `GET` | `/bookings/:id` | Get 360-degree booking dossier with timeline | Authenticated |
| `POST` | `/bookings/:id/cancel` | Cancel booking with reason | Customer / Admin |
| `POST` | `/bookings/:id/verify-arrival` | Verify technician arrival with 4-digit PIN | Provider |
| `POST` | `/bookings/:id/complete` | Submit before/after photos, signature, & settle invoice | Provider |
| `GET` | `/dispatch/radar` | PostGIS spatial radar search for online technicians | Authenticated |
| `GET` | `/dispatch/broadcasts/pending` | Fetch pending timed broadcast offers for technician | Provider |
| `POST` | `/dispatch/broadcasts/accept` | Accept and lock incoming broadcast job | Provider |
| `POST` | `/dispatch/broadcasts/decline` | Decline broadcast job offer | Provider |
| `POST` | `/dispatch/handover` | Manual emergency technician reassignment | Admin / Staff |

### CRM & Fleet Management (`/api/v1/crm`)

| Method | Path | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/customers` | List customer directory with lifetime value metrics | Admin / Staff |
| `GET` | `/customers/:id` | Get customer dossier, addresses, and booking history | Admin / Staff |
| `GET` | `/technicians` | List technician fleet roster with duty and verification | Admin / Staff |
| `GET` | `/technicians/:id` | Get technician dossier, vehicle, and shifts | Admin / Staff |
| `PATCH` | `/technicians/:id/verify`| Toggle technician compliance verification | Admin |
| `POST` | `/technicians/location-ping`| Ingest mobile GPS coordinates with PostGIS update | Provider |
| `PUT` | `/technicians/duty-status`| Toggle duty status (`ONLINE`, `OFFLINE`, `ON_JOB`) | Provider |

### Finances & General Ledger (`/api/v1/finances`)

| Method | Path | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/overview` | Executive financial overview, gross volume, and escrow | Admin |
| `GET` | `/invoices` | List invoices with pagination and status filter | Admin / Staff |
| `GET` | `/invoices/:id` | Get itemized invoice with line items and transactions | Authenticated |
| `GET` | `/ledger` | Audit view of double-entry ledger journal entries | Admin |
| `POST` | `/payouts` | Initiate provider payout transfer with ledger posting | Admin |
| `POST` | `/webhooks/stripe` | Inbound Stripe webhook listener with idempotency check | Public |

### Support Desk & CMS (`/api/v1/support`)

| Method | Path | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/tickets` | List support tickets with status and priority filters | Authenticated |
| `POST` | `/tickets` | Open new support ticket with initial message | Authenticated |
| `GET` | `/tickets/:id` | Get support ticket thread and messages | Authenticated |
| `POST` | `/tickets/:id/messages` | Post reply message to ticket thread | Authenticated |
| `PATCH` | `/tickets/:id/status` | Update ticket status or assigned staff agent | Admin / Staff |
| `GET` | `/reviews` | List customer reviews with provider filters | Authenticated |
| `POST` | `/reviews` | Submit rating and review for completed booking | Customer |
| `PATCH` | `/reviews/:id/moderate` | Admin review moderation toggle | Admin |
| `GET` | `/settings/cms` | Get tenant white-label branding and marketing promo | Public |
| `PUT` | `/settings/cms` | Update tenant CMS marketing banners and coupons | Admin |
