# ServicePro OS — Phase 1 Live Test Environment Diagnostic

**Date:** 2026-11-15  
**Host OS:** Windows (`IsAdmin: False` — Non-Administrator shell)

## 1. Installed & Missing Tooling

| Tool / Component | Status | Version / Path | Notes |
| :--- | :--- | :--- | :--- |
| **Node.js** | INSTALLED | `v24.20.0` (`C:\Program Files\nodejs\node.exe`) | Functional |
| **npm** | INSTALLED | `11.19.0` (`C:\Program Files\nodejs\npm.ps1`) | Functional |
| **Git** | INSTALLED | `2.47.1.windows.1` (`MinGit\cmd\git.exe`) | Functional |
| **winget** | INSTALLED | `v1.29.380` (`WindowsApps\winget.exe`) | Available, but WSL2/Docker install requires Administrator elevation |
| **Supabase CLI** | **INSTALLED (Project-Scoped)** | `3.1.0` (`package.json` `devDependencies` -> `npx supabase`) | Installed via `npm install -D supabase --save-exact` |
| **WSL (Windows Subsystem for Linux)** | **NOT INSTALLED** | `wsl --status` -> WSL not installed | Requires elevated Administrator PowerShell (`wsl.exe --install`) + Windows restart |
| **Docker / Docker Desktop** | **NOT FOUND** | `C:\Program Files\Docker\Docker\Docker Desktop.exe` = `False` | Requires Windows Administrator UAC elevation, WSL2, and Windows restart |
| **PostgreSQL Client (`psql`)** | **NOT FOUND** | Not in `PATH` | Optional if using `npx supabase test db` with Docker |
| **Deno** | **NOT FOUND** | Not in `PATH` | Required only for standalone Edge Function runtime outside Supabase CLI |

## 2. Project Supabase Configuration

- `supabase/migrations/`: Present (`01_initial_schema.sql`, `02_postgis_functions.sql`, `03_security_rbac_and_rls.sql`).
- `supabase/functions/`: Present (`bootstrap-first-admin`, `push-notification`, `stripe-payment-intent`, `stripe-webhook`, `twilio-sms`).
- `supabase/config.toml`: **MISSING** (project was created with migrations & Edge Functions only, not `supabase init`).
- `supabase/tests/`: **NOT PRESENT** (pgTAP tests cannot execute until Docker + `supabase start` are running).
- **Staging Environment (`.env`, `.env.staging`, `.env.local`):** **NOT CONFIGURED** — only `.env.example` and `.env.production.example` exist in root and `admin_web/`. No dedicated staging Supabase project credentials are present on this workstation.

## 3. Exact Blocker & Required Remediation Steps

Local Supabase (`npx supabase start`) and pgTAP (`npx supabase test db`) **cannot** run in this session because:
1. Current shell is non-Administrator (`IsAdmin: False`).
2. **WSL2** is not installed (`wsl.exe --install` requires Administrator elevation + reboot).
3. **Docker Desktop** is not installed (requires Administrator elevation + WSL2 + reboot).
4. **No staging `.env`** is configured as an alternative hosted test target.

### Recommended Actions for User / Operator
- **Option 1 (Local Docker + Supabase Stack):** Run an **elevated Administrator PowerShell**:
  1. `wsl --install` (reboot Windows if prompted).
  2. `winget install -e --id Docker.DockerDesktop` (reboot/start Docker Desktop and accept service terms).
  3. Initialize `supabase/config.toml` (without overwriting `migrations/` or `functions/`), start local stack (`npx supabase start`), and run `node scripts/verify_phase1_live_security.cjs`.
- **Option 2 (Dedicated Staging Supabase Project):** Create a dedicated staging project (zero production customer data), link/configure staging credentials in a git-ignored `.env.staging`, and run non-destructive verification against staging.
