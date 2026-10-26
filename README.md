# ServicePro OS — Field Service & Dispatch Operating System

> **Turnkey Next.js 14 & Supabase Field Service Platform for HVAC, Plumbing, and Electrical Contractors.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e.svg)](https://supabase.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635bff.svg)](https://stripe.com/)
[![Tests](https://img.shields.io/badge/Tests-153%2F153%20Pass-brightgreen.svg)](docs/TEST_REPORT.md)
[![License](https://img.shields.io/badge/License-Commercial%20Ready-green.svg)](docs/SALE_HANDOVER.md)

---

## 🌟 Overview

**ServicePro OS** is an enterprise-grade, full-stack field service management and dispatch system built for trade contractors (HVAC, plumbing, electrical, and appliance repair) operating 2–20+ field technicians. It replaces fragmented monthly subscriptions (Jobber, Housecall Pro, ServiceTitan) with a single, unencumbered software asset owned entirely by the business.

### 🚀 Key Features & Portals (94 Pages, 58 APIs)

- **Public Marketing Website (26 Pages):**
  - High-converting, SEO-optimized landing pages for residential and commercial services.
  - Interactive service area ZIP code coverage checker.
  - Transparent pricing breakdowns, verified customer reviews, and FAQ accordion.
- **7-Step Customer Booking Wizard:**
  - Dynamic diagnostic issue intake and upfront price estimation.
  - Real-time calendar availability engine with **15-minute concurrency slot holds**.
  - Secure Stripe deposit checkout (`PaymentIntent`) and automated confirmation SMS.
- **Customer Self-Service Portal (`/account`):**
  - Live technician tracking with interactive route navigation map.
  - Complete work order history, itemized invoice PDF downloads, and 1-click rebooking.
  - Payment method wallet and digital receipt archive.
- **Technician Field PWA (`/tech`):**
  - Mobile-first Progressive Web App optimized for iOS Safari and Android Chrome.
  - Turn-by-turn routing via Google Maps / Apple Maps.
  - On-site job checklists, before-and-after photo capture module, digital touchscreen signature collection, and parts/labor ledger.
- **Owner & Dispatch Command Center (`/admin`):**
  - Real-time drag-and-drop Kanban dispatch board, Day Calendar view, and interactive fleet map.
  - **Smart Assign Algorithm (0–100 pts)** matching jobs to technicians by proximity, skills, and current shift workload.
  - Customer CRM, technician roster management, itemized invoice generator, and payroll export.
- **Enterprise Security & Governance:**
  - **5-Factor Admin MFA Plan** (Password, TOTP, Email OTP, WebAuthn Hardware Key, Recovery Key — Any 4 of 5 required).
  - **Consensus Council Quorum** safeguarding destructive infrastructure operations.
  - **Cloud Keys & Infrastructure Locker** (`/admin/infrastructure`) with encrypted secret masking (`••••••••`).
  - Strict CSRF origin validation, HSTS, secure HttpOnly SameSite=Strict cookies, and Supabase Row Level Security (RLS) on all tables.
  - Standalone in-memory fallback database engine for instant zero-dependency local operation.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router, Server Components & Route Handlers) |
| **Language** | TypeScript (Strict mode, 100% typed, 0 `any` shortcuts) |
| **Styling** | Tailwind CSS + Radix UI + Lucide Icons |
| **Database & Auth** | Supabase PostgreSQL with Row Level Security (RLS) + In-Process Persistent Fallback |
| **Payments** | Stripe Checkout, Payment Intents, In-Field Card Processing, and Webhook Idempotency |
| **SMS Notifications** | Twilio 2-Way Dispatch Driver with local console fallback |
| **Mapping & Routing** | Mapbox GL JS + Google Maps Directions integration |
| **Testing** | Vitest (142 automated unit & domain tests) + Playwright test infrastructure |

---

## ⚡ Quick Start (Local Development)

### 1. Prerequisites
- Node.js 18.18+ or 20+
- pnpm 9+ (`corepack enable && corepack prepare pnpm@latest --activate`)

### 2. Installation
```bash
# Clone or extract the repository
cd servicepro-os

# Install dependencies
pnpm install

# Set up local environment
cp .env.example .env.local

# Verify environment configuration
pnpm verify-env
```

### 3. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to view the public site or [http://localhost:3000/demo](http://localhost:3000/demo) to explore the interactive role walkthrough.

---

## 🧪 Testing & Verification

ServicePro OS includes a rigorous automated test suite covering authentication safety, role-based access control, pricing precision, concurrency holds, multi-factor quorum, and admin operations:

```bash
# Run invariant plan checks (22/22 pass)
node scripts/verify-plan-invariants.mjs

# Run TypeScript strict typecheck (0 errors)
pnpm typecheck

# Run full Vitest suite (153/153 tests passing across 12 suites)
pnpm test

# Run production build (201 route rows compiled successfully)
pnpm build
```

---

## 📚 Complete Documentation Suite

All system documentation is maintained in the [`docs/`](docs/) directory:

- [**Full-Stack Audit Report**](docs/AUDIT_REPORT.md): Complete architectural audit, findings register (`SEC-xxx`, `BUG-xxx`, `CONFIG-xxx`), and evidence-based verification report.
- [**Engineering Remediation Log**](docs/REMEDIATION_LOG.md): Chronological changelog of all 19 bug fixes, security hardening, and code remediation actions.
- [**Quality Assurance Test Report**](docs/TEST_REPORT.md): Comprehensive test run breakdown for 144 unit tests, typechecks, build, and invariants.
- [**Security Configuration Guide**](docs/SECURITY_CONFIGURATION.md): Production security headers, 5-attempt rate limiter, 15-minute lockout, CSRF, and SIEM alerting setup.
- [**Commercial Sale & Handover Package**](docs/SALE_HANDOVER.md): Master asset manifest, environment variables guide, third-party accounts setup, and day-1 owner runbook.
- [**System Architecture**](docs/ARCHITECTURE.md): Structural overview, data tier modularity, and security boundary diagrams.
- [**API Reference Guide**](docs/API.md): Comprehensive specifications for all 58 backend API route handlers.
- [**Database Schema & RLS**](docs/DATABASE.md): Entity relationship definitions, sequential migrations, and Row Level Security policies.
- [**Production Deployment Guide**](docs/DEPLOYMENT.md): Step-by-step cloud deployment instructions for Vercel, Render, Railway, and Docker.
- [**Audit Progress & Checklist**](docs/AUDIT_PROGRESS.md): Phase A through Q verification checklist and completion tracker.
- [**Client Quickstart Guide**](docs/CLIENT_QUICKSTART.md): Daily operational guide for field managers and technicians.

---

## 📄 License & Commercial Rights

Proprietary Software Licence. Subject to purchase and agreement terms, the Buyer receives a limited, non-exclusive, non-transferable licence to use, install, and modify the Software strictly for internal business operations. Resale, redistribution, and sublicensing are strictly prohibited. See [LICENSE](LICENSE) and [docs/SALE_HANDOVER.md](docs/SALE_HANDOVER.md) for full terms.
