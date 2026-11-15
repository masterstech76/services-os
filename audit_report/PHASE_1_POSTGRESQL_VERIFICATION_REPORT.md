# ServicePro OS — Phase 1 PostgreSQL Database Verification Report

**Environment Tested:** Local Windows Workstation (`IsAdmin: False`, Docker/WSL2 not installed, no staging DB configured)  
**Repeatable Runner:** [`scripts/verify_phase1_live_security.cjs`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/scripts/verify_phase1_live_security.cjs)

## Test Results

| Test ID | Description | Command / Case | Expected | Actual | Status | Exit Code |
| :--- | :--- | :--- | :--- | :--- | :--- | :-: |
| `PG-01` | Live verification runner preflight | `node scripts/verify_phase1_live_security.cjs` | Non-zero exit if Docker/DB missing | `Supabase CLI: 3.1.0`; `Docker Daemon Health: 'docker' is not recognized`; exited with `BLOCKED` | **BLOCKED** *(Fail-closed runner PASS)* | `1` |
| `PG-02` | Start local Supabase PostgreSQL stack | `npx supabase start` | Local PostgreSQL 16 + PostGIS running | Not executable (`docker` & `wsl` not installed; `supabase/config.toml` absent) | **BLOCKED** | `1` |
| `PG-03` | Apply `01`, `02`, `03` migrations to live PostgreSQL | `npx supabase db reset` (local) | All 3 migrations apply cleanly; 21 tables, FKs, triggers, `pgcrypto`, `postgis` verified | Not executable without Docker/PostgreSQL | **BLOCKED** | `1` |
| `PG-04` | pgTAP database test suite (`SECURITY DEFINER`, grants, RLS) | `npx supabase test db` | pgTAP assertions pass | Not executable without Docker/PostgreSQL | **BLOCKED** | `1` |
| `PG-05` | Static SQL & RLS coverage validator | `npm run verify-env` | Syntax balanced, 21/21 RLS enabled, Phase 1 assertions pass | `Parentheses balance = 0`, `21/21` RLS, `49` policies, Phase 1 checks passed | **PASS (Static Only)** | `0` |

**Evidence Location:** [`scripts/verify_phase1_live_security.cjs`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/scripts/verify_phase1_live_security.cjs), [`scripts/validate_migrations.cjs`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/scripts/validate_migrations.cjs).
