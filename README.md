# ServicePro OS — International Home Services Management Platform

**Version**: `1.0.0`  
**Delivery Classification**: Commercial Source-Code / IP Handover Package  
**Full Handover Documentation**: See [`documentation/README.md`](documentation/README.md) and [`documentation/FINAL_HANDOVER_VERIFICATION_REPORT.md`](documentation/FINAL_HANDOVER_VERIFICATION_REPORT.md)

---

## 1. Overview

**ServicePro OS** is a multi-application home services dispatch, booking, escrow ledger, and field-operations software codebase consisting of:
- **`admin_web/`**: React 19 + TypeScript + Vite 8 Web Application (**38 Admin Pages** `#/page/1`–`38` + **14 Staff Pages** `#/staff/101`–`114` = **52 Web Pages** across **94 `.ts`/`.tsx` files**).
- **`serviceos/`**: Flutter / Dart Cross-Platform Mobile Application (**45 Dart files**, including **22 screen files** across Customer, Technician, and Shared modules; wired to `supabase_flutter`).
- **`serviceos_android/`**: Kotlin + Jetpack Compose Native Android Application (**37 Kotlin files**, including **22 screen files**; standalone in-memory UI implementation).
- **`supabase/migrations/`**: 3 PostgreSQL 16 + PostGIS SQL migrations (`843` lines total) defining **19 tables**, **1 view** (`service_categories`), GiST spatial indexes, **5 PostGIS/escrow stored procedures**, **7 security functions**, and Row-Level Security (RLS) policies.
- **`documentation/`**: Complete 26-document Commercial Buyer Handover & Verification Suite.

---

## 2. Quick Start (Web Portal)

```bash
npm install
cd admin_web && npm install && cd ..
npm run dev
```
- **Build & Verify**:
  ```bash
  npm run verify-env        # Static check of 3 SQL migrations (843 lines)
  npm run validate-mobile   # Static check of 45 Dart & 37 Kotlin files
  npm run build             # TypeScript + Vite production build (admin_web/dist)
  npm run lint              # oxlint check across 98 files (0 errors)
  npm test                  # Headless browser render & console check of all 52 Web pages
  npm run test:commercial   # Headless browser check of turnkey simulators & installer
  ```

---

## 3. Master Documentation Suite (`documentation/`)

All buyer handover documents are located in the [`documentation/`](documentation/) folder:
1. [`documentation/README.md`](documentation/README.md)
2. [`documentation/COMMERCIAL_HANDOVER_DOSSIER.md`](documentation/COMMERCIAL_HANDOVER_DOSSIER.md)
3. [`documentation/PROJECT_OVERVIEW.md`](documentation/PROJECT_OVERVIEW.md)
4. [`documentation/FEATURE_INVENTORY.md`](documentation/FEATURE_INVENTORY.md)
5. [`documentation/FEATURE_PRESERVATION_MATRIX.md`](documentation/FEATURE_PRESERVATION_MATRIX.md)
6. [`documentation/SYSTEM_ARCHITECTURE.md`](documentation/SYSTEM_ARCHITECTURE.md)
7. [`documentation/PROJECT_STRUCTURE.md`](documentation/PROJECT_STRUCTURE.md)
8. [`documentation/TECHNOLOGY_STACK.md`](documentation/TECHNOLOGY_STACK.md)
9. [`documentation/INSTALLATION_GUIDE.md`](documentation/INSTALLATION_GUIDE.md)
10. [`documentation/ENVIRONMENT_CONFIGURATION.md`](documentation/ENVIRONMENT_CONFIGURATION.md)
11. [`documentation/DATABASE_SCHEMA.md`](documentation/DATABASE_SCHEMA.md)
12. [`documentation/DATABASE_MIGRATIONS.md`](documentation/DATABASE_MIGRATIONS.md)
13. [`documentation/API_DOCUMENTATION.md`](documentation/API_DOCUMENTATION.md)
14. [`documentation/AUTHENTICATION_AND_RBAC.md`](documentation/AUTHENTICATION_AND_RBAC.md)
15. [`documentation/SECURITY_DOCUMENTATION.md`](documentation/SECURITY_DOCUMENTATION.md)
16. [`documentation/INTEGRATION_DOCUMENTATION.md`](documentation/INTEGRATION_DOCUMENTATION.md)
17. [`documentation/ADMIN_PANEL_GUIDE.md`](documentation/ADMIN_PANEL_GUIDE.md)
18. [`documentation/STAFF_PANEL_GUIDE.md`](documentation/STAFF_PANEL_GUIDE.md)
19. [`documentation/MOBILE_APPLICATION_GUIDE.md`](documentation/MOBILE_APPLICATION_GUIDE.md)
20. [`documentation/WORKFLOW_DOCUMENTATION.md`](documentation/WORKFLOW_DOCUMENTATION.md)
21. [`documentation/TESTING_AND_QA_REPORT.md`](documentation/TESTING_AND_QA_REPORT.md)
22. [`documentation/KNOWN_ISSUES_AND_LIMITATIONS.md`](documentation/KNOWN_ISSUES_AND_LIMITATIONS.md)
23. [`documentation/DEPLOYMENT_GUIDE.md`](documentation/DEPLOYMENT_GUIDE.md)
24. [`documentation/THIRD_PARTY_LICENSES_AND_SERVICES.md`](documentation/THIRD_PARTY_LICENSES_AND_SERVICES.md)
25. [`documentation/FINAL_PRODUCTION_READINESS_REPORT.md`](documentation/FINAL_PRODUCTION_READINESS_REPORT.md)
26. [`documentation/FINAL_HANDOVER_VERIFICATION_REPORT.md`](documentation/FINAL_HANDOVER_VERIFICATION_REPORT.md)
