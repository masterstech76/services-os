# ServicePro OS — Phase 1 RLS Adversarial Test Report

**Environment Tested:** Local Workstation (No live PostgreSQL/PostgREST instance available)

## Live RLS Adversarial Test Matrix

Every live PostgREST/PostgreSQL RLS test below is **BLOCKED** because Docker Desktop / WSL2 is not installed on this Windows workstation and no staging Supabase environment is configured. Static assertions are **not** substituted for live RLS results.

| Test ID | Identity / Condition | Operations | Expected Result | Actual Result | Status | Exit Code |
| :--- | :--- | :--- | :--- | :--- | :--- | :-: |
| `RLS-01` | Anonymous user (`anon`) | `SELECT/INSERT/UPDATE/DELETE` on protected tables | Denied by RLS | Not executed (no live PostgreSQL/PostgREST) | **BLOCKED** | `1` |
| `RLS-02` | Authenticated `CUSTOMER` without MFA | `SELECT/INSERT/UPDATE` own bookings/profile; `SELECT` `user_mfa_credentials` | Own customer access allowed; MFA table & Admin/Tech data denied | Not executed | **BLOCKED** | `1` |
| `RLS-03` | Authenticated `TECHNICIAN` without MFA | `SELECT/UPDATE` assigned bookings; `SELECT` `user_mfa_credentials` | Assigned tech access allowed; MFA table & Admin data denied | Not executed | **BLOCKED** | `1` |
| `RLS-04` | Authenticated `STAFF` (password-only vs verified MFA) | Protected Staff operations; `SELECT` `user_mfa_credentials` | Denied before MFA; allowed after MFA; MFA table always denied | Not executed | **BLOCKED** | `1` |
| `RLS-05` | Authenticated `ADMIN` (password-only vs verified MFA) | Protected Admin tables & `admin_revoke_user_mfa`; `SELECT/UPDATE` `user_mfa_credentials` | Protected ops denied before MFA, allowed after MFA; direct MFA table always denied | Not executed | **BLOCKED** | `1` |
| `RLS-06` | Inactive `ADMIN` / Inactive `STAFF` / Missing `users` row | Any privileged `SELECT/INSERT/UPDATE/DELETE` or RPC | Denied (`current_user_role() = 'ANONYMOUS'`) | Not executed | **BLOCKED** | `1` |
| `RLS-07` | Cross-tenant `Tenant A` -> `Tenant B`, `NULL` tenant, self role/tenant escalation, reactivation | `SELECT/UPDATE` | Denied by RLS `WITH CHECK` & fail-closed helpers | Not executed | **BLOCKED** | `1` |
| `RLS-08` | Forged `app_metadata` role/tenant, expired JWT, revoked MFA session, stale JWT post-deactivation | `SELECT/INSERT/UPDATE/DELETE` & RPCs | Denied by PostgreSQL | Not executed | **BLOCKED** | `1` |
