# Authentication, First-Admin Bootstrap, and MFA Guide — ServicePro OS

## 1. First-Admin Provisioning (One-Time, Server-Controlled)
- Public `ADMIN` self-registration is disabled at the RLS layer (`public.users` `INSERT` allows `CUSTOMER` and `TECHNICIAN` only).
- First-Admin setup in Cloud mode executes through [`supabase/functions/bootstrap-first-admin/index.ts`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/supabase/functions/bootstrap-first-admin/index.ts):
  - Requires `X-Bootstrap-Token` matching `INITIAL_ADMIN_BOOTSTRAP_SECRET` (timing-safe comparison).
  - Calls `check_system_initialized()` and `bootstrap_first_admin_atomic(...)` (`pg_advisory_xact_lock(9048101)` + replay nonce check + `service_role`-only grant).
  - Rolls back the Supabase Auth user if database provisioning fails or loses a concurrent race.
  - Generates a unique 160-bit Base32 TOTP secret (AES-256 encrypted at rest in `user_mfa_credentials`) and 8 single-use SHA-256 hashed recovery codes.

## 2. Server-Side MFA Enforcement
- `public.is_admin()` and `public.is_staff()` require **both**:
  1. An active (`is_active = TRUE`) `ADMIN` or `STAFF` row in `public.users`, **and**
  2. `public.has_verified_mfa_session()` (`aal = 'aal2'` or a non-revoked, unexpired 12-hour row in `public.user_mfa_sessions` bound to `(auth.uid(), session_id)`).
- Password-only (`aal1`) sessions can call `get_my_mfa_status()`, read their own `users` row, and complete `enroll_my_mfa()` or `verify_my_mfa_code()`, but are denied all privileged Admin/Staff table operations.
- Deactivating a user (`users.is_active = FALSE` or `admin_set_user_active`) triggers `trg_revoke_sessions_on_user_deactivation` and causes `current_user_role()` and `has_verified_mfa_session()` to fail closed immediately, even if an old JWT or `app_metadata.role` remains.

## 3. MFA Credential Isolation
- Direct `SELECT`, `INSERT`, `UPDATE`, and `DELETE` on `user_mfa_credentials`, `user_mfa_sessions`, and `private.mfa_encryption_keys` are revoked from `PUBLIC`, `anon`, and `authenticated` (including `ADMIN`).
- Admins revoke a compromised user's MFA via `admin_revoke_user_mfa(target_user_id)` without ever viewing secrets or recovery hashes.
