# ServicePro OS — International Home Services Management Platform

**Version**: `1.0.0`  
**Delivery Classification**: Commercial Source-Code / IP Handover Package (Requires Buyer Cloud Provisioning, Schema Alignment, Gateway Edge Functions & Mobile SDK Compilation for Live Production Deployment)  
**Governing License**: [`LICENSE`](../LICENSE)

---

## 1. Product Introduction & Delivery Classifications

**ServicePro OS** (branded in mobile modules as **ServiceOS**) is a multi-application home services dispatch, booking, escrow ledger, and field-operations codebase.

### Important Distinction: Source-Code Sale vs. Live Hosted SaaS
This repository is a **commercial source-code handover package**, not a pre-hosted live SaaS subscription. Every component across this documentation suite is classified using five strict evidence-based labels:

- **`VERIFIED`**: Executed and proven directly against the repository with recorded tool output (e.g., Web TypeScript/Vite build, `oxlint`, 52-page Playwright/Puppeteer local browser render audit, static SQL/Dart/Kotlin syntax validators).
- **`PARTIALLY VERIFIED`**: Implemented in source code or SQL and statically verified, but either only tested in local mode or requiring specific schema-to-client alignment before live cloud use.
- **`NOT VERIFIED`**: Source code or SQL migrations exist in the repository, but live runtime verification has not been executed against a live cloud/database environment.
- **`BLOCKED`**: Verification could not be executed on the audit workstation because required external toolchains (`flutter`, `dart`, `gradle`, `java`, `psql`, `docker`) are not installed locally.
- **`NOT IMPLEMENTED`**: Required server-side or external integration code is not written yet (specifically: live Stripe Connect payment capture/webhooks/payouts, live Twilio SMS/OTP carrier transmission, live SMTP email delivery, live FCM push notifications, and cloud/disk persistence inside the Kotlin `serviceos_android` app).

---

## 2. Repository Structure Overview

```text
SERVICEPRO_OS/
├── admin_web/           # React 19 + TypeScript + Vite 8 Web Application (38 Admin Pages + 14 Staff Pages; 94 TS/TSX files)
├── serviceos/           # Flutter / Dart Cross-Platform Mobile Source Code (45 Dart files, 22 Screen files)
├── serviceos_android/   # Kotlin + Jetpack Compose Native Android Source Code (37 Kotlin files, 22 Screen files; standalone in-memory UI)
├── supabase/            # PostgreSQL 16 + PostGIS Database Migrations (3 SQL files, 843 lines: 19 tables, 1 view, 5 PostGIS/escrow RPCs)
├── scripts/             # Node.js static validators for SQL migrations and Dart/Kotlin source files
└── documentation/       # Complete 26-document Commercial Buyer Handover Suite
```

---

## 3. Quick Start (Web Portal — Local Development)

### Prerequisites
- **Node.js**: `v20.0.0+` (verified on `v24.12.0`)
- **npm**: `v10.0.0+` (verified on `v11.6.2`)

### Step 1: Install Dependencies
```bash
npm install
cd admin_web && npm install && cd ..
```

### Step 2: Run Local Development Server
```bash
npm run dev
```
Open `http://localhost:5173/#/login`. Without Supabase environment variables configured, the web application runs in **local browser storage mode (`localStorage`)** with a clean `0`-record baseline and displays toast notifications explicitly stating that changes are saved to local browser storage.

### Step 3: Run Verified Local Build & Test Commands
```bash
npm run verify-env        # Static syntax check of 3 SQL migrations (843 lines) in supabase/migrations/
npm run validate-mobile   # Static structural check of 45 Dart files and 37 Kotlin files
npm run build             # TypeScript (tsc -b) + Vite 8 production bundle build
npm run lint              # oxlint static check across 98 web files (0 errors)
npm test                  # Headless browser render & console check of all 52 Web pages (38 Admin + 14 Staff)
npm run test:commercial   # Headless browser check of turnkey simulators & installer
```

---

## 4. Complete Buyer Handover Index (`documentation/`)

1. [`README.md`](README.md) — Product introduction and quick start
2. [`COMMERCIAL_HANDOVER_DOSSIER.md`](COMMERCIAL_HANDOVER_DOSSIER.md) — Main buyer handover summary & 5 pre-acquisition disclosures
3. [`PROJECT_OVERVIEW.md`](PROJECT_OVERVIEW.md) — Product scope and modules
4. [`FEATURE_INVENTORY.md`](FEATURE_INVENTORY.md) — All features and functionality
5. [`FEATURE_PRESERVATION_MATRIX.md`](FEATURE_PRESERVATION_MATRIX.md) — Complete inventory (38 Admin + 14 Staff + 22 Mobile + 19 Database Tables)
6. [`SYSTEM_ARCHITECTURE.md`](SYSTEM_ARCHITECTURE.md) — Full-stack architecture & honest local/cloud toast contract
7. [`PROJECT_STRUCTURE.md`](PROJECT_STRUCTURE.md) — Directory and file organization
8. [`TECHNOLOGY_STACK.md`](TECHNOLOGY_STACK.md) — Frameworks, languages and versions
9. [`INSTALLATION_GUIDE.md`](INSTALLATION_GUIDE.md) — Installation instructions
10. [`ENVIRONMENT_CONFIGURATION.md`](ENVIRONMENT_CONFIGURATION.md) — Environment variables and configuration
11. [`DATABASE_SCHEMA.md`](DATABASE_SCHEMA.md) — Complete reference for all 19 tables and 1 view (`843` lines)
12. [`DATABASE_MIGRATIONS.md`](DATABASE_MIGRATIONS.md) — Migration execution instructions and RLS coverage notes
13. [`API_DOCUMENTATION.md`](API_DOCUMENTATION.md) — All 5 PostGIS/escrow RPC contracts and `supabaseClient.ts` methods
14. [`AUTHENTICATION_AND_RBAC.md`](AUTHENTICATION_AND_RBAC.md) — Login, roles, permissions, and RLS verification status
15. [`SECURITY_DOCUMENTATION.md`](SECURITY_DOCUMENTATION.md) — Security controls (`10` modules) and client-side vs. server-side limitations
16. [`INTEGRATION_DOCUMENTATION.md`](INTEGRATION_DOCUMENTATION.md) — Supabase, Leaflet, Stripe, Twilio, and Android standalone status
17. [`ADMIN_PANEL_GUIDE.md`](ADMIN_PANEL_GUIDE.md) — Admin panel usage (38 pages)
18. [`STAFF_PANEL_GUIDE.md`](STAFF_PANEL_GUIDE.md) — Staff panel usage (14 pages)
19. [`MOBILE_APPLICATION_GUIDE.md`](MOBILE_APPLICATION_GUIDE.md) — Flutter (`serviceos`) vs. standalone Native Android (`serviceos_android`) guide
20. [`WORKFLOW_DOCUMENTATION.md`](WORKFLOW_DOCUMENTATION.md) — Operational workflows
21. [`TESTING_AND_QA_REPORT.md`](TESTING_AND_QA_REPORT.md) — Test results, exact scope of the 52-page check, and blocked checks
22. [`KNOWN_ISSUES_AND_LIMITATIONS.md`](KNOWN_ISSUES_AND_LIMITATIONS.md) — Unverified builds, schema-to-client alignment items, and unimplemented gateways
23. [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md) — Web, database and mobile deployment
24. [`THIRD_PARTY_LICENSES_AND_SERVICES.md`](THIRD_PARTY_LICENSES_AND_SERVICES.md) — Dependencies, licenses, Unsplash URLs, external accounts, and buyer responsibilities
25. [`FINAL_PRODUCTION_READINESS_REPORT.md`](FINAL_PRODUCTION_READINESS_REPORT.md) — Final release gate assessment
26. [`FINAL_HANDOVER_VERIFICATION_REPORT.md`](FINAL_HANDOVER_VERIFICATION_REPORT.md) — 10-cycle verification log & independent buyer simulation audit
