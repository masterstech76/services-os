# ServicePro OS — Enterprise International Home Services Management Platform

> **Commercial Valuation Target**: **\$20,000 – \$60,000 USD**  
> **Classification**: Turnkey Intellectual Property / Production-Ready Software Acquisition  
> **Status**: Full-Stack Reconstructed, Verified, Zero Personal Data, 100% Ready for Buyer Handover  

---

## 1. Executive Platform Summary

**ServicePro OS** is an enterprise-grade multi-tenant software system engineered for on-demand home service marketplaces (plumbing, electrical, HVAC, cleaning, roofing, appliance repair). It delivers an end-to-end operational engine across web, mobile, and cloud infrastructure:

1. **Enterprise REST API Backend (`server/`)**: Fastify 5 + TypeScript + PostgreSQL 16 + PostGIS + Redis. Features 8 domain modules, double-entry general ledger, 60s timed dispatch broadcast engine, and RFC 6238 TOTP MFA.
2. **Admin & Staff Web Control Portal (`admin_web/`)**: React 19 + TypeScript + Tailwind CSS with **52 dedicated operational views** (38 Admin pages + 14 Staff pages), Dual-Vision design engine (Day/Night mode), and live dispatch telemetry.
3. **Cross-Platform Mobile App (`serviceos/`)**: Flutter (iOS & Android) with clean Riverpod state management, Day Vision & Night Vision UI, client-side geofencing, and photo proof captures.
4. **Native Android App (`serviceos_android/`)**: 100% Kotlin + Jetpack Compose with Material 3 styling and native Android architecture.
5. **Turnkey Docker Packaging (`docker-compose.yml`)**: Production orchestration provisioning PostgreSQL 16 with PostGIS spatial extensions, Redis caching, Fastify backend, and React/Nginx frontend in a single command.

---

## 2. Directory Structure Map

```
├── docker-compose.yml               # Production multi-container orchestration
├── .env.example                     # Turnkey configuration template (Zero personal data)
├── COMMERCIAL_HANDOVER.md           # Executive acquisition & valuation dossier
├── PROJECT_ARCHITECTURE.md          # Complete technical architecture specification
├── INSTALLATION_GUIDE.md            # Buyer deployment runbook (Docker & Cloud VPS)
├── API_DOCUMENTATION.md             # Complete OpenAPI 3.1 REST API specification
│
├── server/                          # Fastify 5 + TypeScript Backend
│   ├── src/                         # Modules: Auth, Installer, Services, Bookings, Dispatch, CRM, Finances, Support
│   ├── tests/                       # Automated unit & integration tests (16 passing tests)
│   └── Dockerfile                   # Multi-stage minimal Node 22 Alpine container
│
├── admin_web/                       # React 19 + TypeScript Admin & Staff Portal (52 Screens)
│   ├── src/                         # Components, Pages, State, API Client
│   ├── Dockerfile                   # Multi-stage minimal Nginx Alpine container
│   └── nginx.conf                   # SPA routing & Security Headers
│
├── serviceos/                       # Flutter Cross-Platform Mobile App (Android & iOS)
│   ├── lib/                         # Features: Customer Booking Flow, Tech Broadcast Radar, Work Order
│   └── pubspec.yaml                 # Flutter 3.19+ dependencies
│
└── serviceos_android/               # Native Android Jetpack Compose Mobile App (Material 3)
    └── app/src/main/kotlin/com/serviceos/app/
```

---

## 3. Instant Turnkey Launch (< 5 Minutes)

```bash
# 1. Clone repository
git clone <repository_url>
cd <repository_folder>

# 2. Configure environment
cp .env.example .env

# 3. Launch Docker containers
docker compose up -d --build

# 4. Open Turnkey Setup Wizard in browser:
# Navigate to http://localhost/installer to configure tenant and first admin
```

---

## 4. Quality & Build Verification

Each component of the platform compiles cleanly without errors:

```bash
# Fastify Backend Build & Test Suite
npm --prefix server run build     # Compiles TypeScript with 0 errors
npm --prefix server test          # Runs 16 automated tests (100% pass)

# Admin Web Portal Production Build
npm --prefix admin_web run build  # Builds Vite client in < 1 second
```

---

## 5. Commercial Asset Valuation

- **Target Sale Range**: **\$20,000 – \$60,000**
- **Commercial Valuation Dossier**: See [`COMMERCIAL_HANDOVER.md`](COMMERCIAL_HANDOVER.md)
- **Architecture Specification**: See [`PROJECT_ARCHITECTURE.md`](PROJECT_ARCHITECTURE.md)
- **Deployment Runbook**: See [`INSTALLATION_GUIDE.md`](INSTALLATION_GUIDE.md)
- **REST API Contract**: See [`API_DOCUMENTATION.md`](API_DOCUMENTATION.md)
