# SECURITY DOCUMENTATION — Controls, Architecture & Honest Limitations

**Document No.**: `15 / 25`  
**Version**: `1.0.0`  
**Last Updated**: November 15, 2026

---

## 1. Implemented Security Controls (`admin_web/src/security/`)

All 10 security modules in [`admin_web/src/security/`](../admin_web/src/security/) are exported via [`admin_web/src/security/index.ts`](../admin_web/src/security/index.ts):

| Control Area | Source File | Implementation Details | Verification State |
| :--- | :--- | :--- | :--- |
| **Password Policy & PBKDF2 Hashing** | [`admin_web/src/security/passwordPolicy.ts`](../admin_web/src/security/passwordPolicy.ts) | `validatePasswordStrength` enforces 10+ chars, upper/lower/digit/special, and a 36-word blacklist; `hashPasswordClient` uses Web Crypto `PBKDF2` (`SHA-256`, `100,000` iterations, 16-byte CSPRNG salt). | **`VERIFIED`** |
| **Brute-Force Lockout** | [`admin_web/src/security/rateLimiter.ts`](../admin_web/src/security/rateLimiter.ts) | Locks login for 15 minutes after 5 failed attempts within a 15-minute window. | **`VERIFIED`** |
| **Session Idle Lock & Expiry** | [`admin_web/src/security/sessionManager.ts`](../admin_web/src/security/sessionManager.ts) | Locks console UI after 15 minutes of inactivity ([`SessionLockModal.tsx`](../admin_web/src/components/modals/SessionLockModal.tsx)) and expires session after 12 hours. | **`VERIFIED`** |
| **Role-Based Access Matrix** | [`admin_web/src/security/rbac.ts`](../admin_web/src/security/rbac.ts) | Defines `canAccessPage` and action permissions for `ADMIN` vs `STAFF`. | **`VERIFIED`** |
| **Client Input Threat Scanner** | [`admin_web/src/security/apiSecurity.ts`](../admin_web/src/security/apiSecurity.ts) | Intercepts SQLi (`' OR 1=1`, `UNION SELECT`), XSS (`<script>`), and path traversal (`../`) patterns on search/form inputs. | **`VERIFIED`** (Tested in `npm test` Phase 4) |
| **Security Event Audit Logger** | [`admin_web/src/security/securityAuditLogger.ts`](../admin_web/src/security/securityAuditLogger.ts) | Logs security events locally and calls `supabaseService.saveAuditLog()` when configured. | **`VERIFIED` (Local)** |
| **TOTP MFA, OTP & Password Reset Helpers** | [`totpService.ts`](../admin_web/src/security/totpService.ts), [`otpService.ts`](../admin_web/src/security/otpService.ts), [`passwordResetService.ts`](../admin_web/src/security/passwordResetService.ts) | Client-side TOTP secret generation, one-time passcode hashing, and recovery token utilities. | **`VERIFIED` (Client Logic)** |
| **PostgreSQL `SECURITY DEFINER`, 19-Table RLS & Immutable Audit Trigger** | [`02_postgis_functions.sql`](../supabase/migrations/02_postgis_functions.sql), [`03_security_rbac_and_rls.sql`](../supabase/migrations/03_security_rbac_and_rls.sql) | All `SECURITY DEFINER` RPCs set `SET search_path = public, pg_temp`; `public.current_user_role()` resolves role from `public.users` (never trusting client-editable `user_metadata`); all **19/19 tables** have RLS enabled with **47 explicit ownership/tenant/role policies**; `trg_security_audit_immutable` blocks `UPDATE`/`DELETE` on `security_audit_logs`. | **Static Syntax & RLS `VERIFIED` / Live DB `NOT VERIFIED`** |
| **Android Backup Hardening** | [`serviceos_android/app/src/main/AndroidManifest.xml`](../serviceos_android/app/src/main/AndroidManifest.xml#L11) | Sets `android:allowBackup="false"`. | **Static File `VERIFIED`** |

---

## 2. Security Limitations & Required Buyer Hardening Before Public Launch

1. **Client-Side Security Controls in Unconfigured Local Mode**:
   - When `VITE_SUPABASE_URL` is not configured, `passwordPolicy.ts`, `rateLimiter.ts`, `sessionManager.ts`, and `rbac.ts` store state in browser `localStorage`. Any user with access to browser DevTools on that workstation can clear `localStorage` or edit their local session role.
   - Client-side route guards and `apiSecurity.ts` regex checks are **UI defense-in-depth**, not a substitute for server-side authorization.
2. **19-Table RLS Policy Coverage & Live Multi-Role Verification (`03_security_rbac_and_rls.sql`)**:
   - Migration `03` enables `ROW LEVEL SECURITY` on **all 19 tables** and defines **47 explicit policies** scoped by ownership (`user_id = public.current_auth_uid()`), tenant boundary (`tenant_id = public.current_tenant_id()`), and server-verified role (`public.is_admin()`, `public.is_staff()`, `public.is_technician()`, `public.is_customer()`), including blocking self-role-elevation on `public.users` UPDATE and restricting server-only tables (`auth_rate_limits`, `password_reset_tokens`, `auth_otps`) to admin/service-role callers.
   - While all 19 tables and 47 policies pass static validation (`npm run verify-env`), live PostgreSQL runtime execution across separate `ADMIN`, `STAFF`, `CUSTOMER`, and `TECHNICIAN` JWT sessions remains **`NOT VERIFIED`** on the audit host and must be verified by the Buyer in the Supabase SQL Editor prior to public launch.
3. **Default Fallback Unlock PIN (`1234`)**:
   - In [`AdminContext.tsx`](../admin_web/src/context/AdminContext.tsx), `unlockSession` falls back to `'1234'` if `servicepro_security_pin` has not been customized in **Page 35: General Platform Settings**.
4. **Zero Secrets Exposed in Repository**:
   - Automated scans across all `.ts`, `.tsx`, `.dart`, `.kt`, `.sql`, `.md`, and `.env*` files confirm `0` live API keys, private keys, or credentials exist in the repository.
