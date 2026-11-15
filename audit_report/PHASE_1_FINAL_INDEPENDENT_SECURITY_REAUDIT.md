# ServicePro OS — Final Phase 1 Independent Security Re-Audit (Read-Only)

**Audit Type:** Fresh, strictly read-only independent security re-audit of corrected Phase 1 (`FND-01`, `FND-02` Bootstrap, `FND-16`)  
**Scope Preserved:** All 5 prior reports (`POST_REMEDIATION_INDEPENDENT_VERIFICATION.md`, `CONTROLLED_REMEDIATION_PLAN.md`, `PHASE_1_EXECUTION_REPORT.md`, `PHASE_1_INDEPENDENT_SECURITY_REVIEW.md`, `PHASE_1_SECURITY_CORRECTION_REPORT.md`), source files, SQL migrations, and configs remain **unmodified**. Phase 2 has **not** been started.

---

## 1. Executive Verdict

**Verdict:** **CONDITIONAL STATIC PASS / HOLD PRODUCTION & PHASE 2 PENDING LIVE BACKEND TESTS (OR MINOR FIX)**  
- Both previously confirmed Phase 1 `FAIL` findings (direct `ADMIN` table access to `user_mfa_credentials` and missing server-side MFA enforcement in `is_admin()`/`is_staff()`) have been **remediated in source and SQL**.
- However, this re-audit identified:
  1. **1 newly discovered Phase 1 authorization edge-case (`current_user_role()` deactivated-user `app_metadata` fallback)**,
  2. **2 encryption-key management limitations** (no automated key-rotation/versioning support; `current_setting('app.settings.mfa_encryption_key')` GUC trust if direct SQL is ever exposed),
  3. **Existing Phase 4/5 privileged-operation gaps** outside Phase 1 (`02_postgis_functions.sql` `SECURITY DEFINER` RPCs and `push-notification` / `twilio-sms` / `stripe-payment-intent` Edge Functions), and
  4. **0 live PostgreSQL/Supabase/Edge Function runtime tests executed (`BLOCKED`)**.

---

## 2. Review of Both Previously Confirmed Failures

| Prior Finding | Prior Status | Re-Audit Status | Evidence |
| :--- | :--- | :--- | :--- |
| **Finding 1:** `user_mfa_credentials` `FOR ALL TO authenticated USING (public.is_admin())` allowed any `ADMIN` to read/modify others' TOTP secrets & recovery hashes | **FAIL** | **PASS (Static)** / **BLOCKED (Live DB)** | Policy removed; `REVOKE ALL ON TABLE public.user_mfa_credentials FROM PUBLIC, anon, authenticated;` applied ([`03_security_rbac_and_rls.sql`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/supabase/migrations/03_security_rbac_and_rls.sql#L710-L725)); `service_role`-only RLS policy added; `totp_secret_encrypted` encrypted via `pgp_sym_encrypt`. |
| **Finding 2:** `is_admin()` and `is_staff()` checked role only, allowing password-only (`aal1`) JWTs to access protected tables/RPCs | **FAIL** | **PASS (Static)** / **BLOCKED (Live DB)** | Both [`is_admin()`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/supabase/migrations/03_security_rbac_and_rls.sql#L276-L284) and `is_staff()` now require `public.has_verified_mfa_session()`. `LoginPage.tsx` routes both Cloud `ADMIN` and Cloud `STAFF` through MFA. |

---

## 3. MFA Credential Isolation Results

| Check | Status | Evidence & References |
| :--- | :--- | :--- |
| `user_mfa_credentials` & `user_mfa_sessions` direct access blocked for `PUBLIC`, `anon`, `authenticated` (incl. `ADMIN`) | **PASS (Static)** / **BLOCKED (Live DB)** | [`03_security_rbac_and_rls.sql`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/supabase/migrations/03_security_rbac_and_rls.sql#L710-L735): `REVOKE ALL` + `FOR ALL TO service_role` policies on `user_mfa_credentials`, `user_mfa_sessions`, and `private.mfa_encryption_keys`. |
| `private` schema & `private.mfa_encryption_keys` isolated | **PASS (Static)** | [`03_security_rbac_and_rls.sql`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/supabase/migrations/03_security_rbac_and_rls.sql#L52-L67): `REVOKE ALL` from `PUBLIC, anon, authenticated` + RLS enabled (`service_role` only). |
| `SECURITY DEFINER` caller checks, `SET search_path`, & `EXECUTE` grants | **PASS (Static)** | `get_my_mfa_status()`, `enroll_my_mfa()`, `verify_my_mfa_code()`, `revoke_my_mfa_session()`, `admin_revoke_user_mfa()` all set explicit `SET search_path` (`public, ... pg_temp`), bind `v_uid := public.current_auth_uid()`, and internal helpers (`base32_decode`, `compute_totp_code`, `get_mfa_encryption_key`, `encrypt_totp_secret`, `decrypt_totp_secret`, `record_verified_mfa_session`) have `REVOKE ALL ... FROM PUBLIC, anon, authenticated`. |
| `enroll_my_mfa` overwrite protection | **PASS (Static)** | [`03_security_rbac_and_rls.sql`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/supabase/migrations/03_security_rbac_and_rls.sql#L1180-L1183) raises `MFA_ALREADY_ENROLLED` if `is_mfa_enabled` is already `TRUE`. |

---

## 4. Custom MFA Session Security Results

| Scenario | Status | Analysis & Evidence |
| :--- | :--- | :--- |
| Session creation without valid TOTP / with invalid recovery code | **PASS (Static & Local Browser)** / **BLOCKED (Live DB)** | `record_verified_mfa_session()` is revoked from `PUBLIC, anon, authenticated` and only called inside `enroll_my_mfa` (after TOTP match) and `verify_my_mfa_code` (after TOTP or SHA-256 recovery code match). |
| Session-ID substitution, cross-user, & cross-tenant reuse | **PASS (Static)** / **BLOCKED (Live DB)** | [`has_verified_mfa_session()`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/supabase/migrations/03_security_rbac_and_rls.sql#L244-L274) binds `s.user_id = public.current_auth_uid()` AND `s.auth_session_id = public.current_auth_session_id()` (read from signed JWT `request.jwt.claims`, never client input). |
| 12-hour database-enforced expiry & expired/revoked reuse | **PASS (Static)** / **BLOCKED (Live DB)** | `has_verified_mfa_session()` requires `s.revoked_at IS NULL AND s.expires_at > NOW()` in PostgreSQL. |
| Sign-out & Admin MFA revocation | **PASS (Static)** / **BLOCKED (Live DB)** | `supabaseClient.ts` `signOut()` calls `revoke_my_mfa_session()`; `admin_revoke_user_mfa()` sets `revoked_at = NOW()` on all active sessions for the target user. |
| JWT `refreshSession()` behavior | **PASS (Static)** / **BLOCKED (Live DB)** | GoTrue preserves `session_id` across `refreshSession()`, so verified sessions persist until 12h expiry or revocation, while new logins receive a new `session_id`. Live `refreshSession()` test is `BLOCKED`. |
| TOTP & recovery-code replay | **PASS (Static & Local Browser)** / **BLOCKED (Live DB)** | `v_matched_step > last_verified_step` prevents same-step TOTP replay; `array_remove` atomically removes used recovery-code hashes. Concurrent DB replay test is `BLOCKED`. |

---

## 5. Encryption-Key Security Results

| Check | Status | Evidence & Findings |
| :--- | :--- | :--- |
| Keys never in source control, client functions, or error logs | **PASS (Static)** | Key is generated via `gen_random_bytes(32)` inside `private.mfa_encryption_keys` or read from `app.settings.mfa_encryption_key`; never returned by any RPC or bundled in `admin_web/dist`. |
| Untrusted caller influencing `app.settings.mfa_encryption_key` | **PASS (PostgREST) / FAIL (Direct SQL)** | Safe over PostgREST (clients cannot execute `SET`). However, if untrusted roles ever had direct SQL access, [`get_mfa_encryption_key()`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/supabase/migrations/03_security_rbac_and_rls.sql#L1009-L1030) reads `current_setting('app.settings.mfa_encryption_key', true)` before `private.mfa_encryption_keys`. |
| Key rotation & key loss recovery | **FAIL (Design Gap)** | Secrets use a single `enc:v1:` prefix without a key-version ID or re-encryption helper. Rotating `app.settings.mfa_encryption_key` or losing `private.mfa_encryption_keys` renders existing `enc:v1:` secrets undecryptable (requiring `admin_revoke_user_mfa` + user re-enrollment). |
| Fails securely if encryption unavailable | **PASS (Static)** | `encrypt_totp_secret()` calls `pgp_sym_encrypt` and throws an error rather than silently storing plaintext if `pgcrypto` fails. |

---

## 6. Full Privileged-Operation Coverage

| Surface | Status | Findings |
| :--- | :--- | :--- |
| **Phase 1 RLS Policies (`03_security_rbac_and_rls.sql`)** | **PASS (Static)** / **BLOCKED (Live DB)** | All Admin/Staff table policies use `public.is_admin()` / `public.is_staff()`, which now enforce `has_verified_mfa_session()`. `CUSTOMER` and `TECHNICIAN` policies remain intact. |
| **Phase 1 Edge Function (`bootstrap-first-admin`)** | **PASS (Static)** / **BLOCKED (Live)** | Timing-safe `X-Bootstrap-Token`, pre-check, advisory lock, Auth rollback on failure. |
| **Storage Policies (`storage.objects`)** | **NOT APPLICABLE** | No `storage.objects` policies exist in `supabase/migrations/*.sql`. |
| **Phase 4/5 RPCs (`02_postgis_functions.sql` `L137-217`)** | **FAIL (Deferred to Phase 4/5)** | `verify_arrival_geofence` and `release_escrow_to_technician` are `SECURITY DEFINER` with default `PUBLIC` execute and no caller identity/role/MFA checks (tracked in `FND-09`/`FND-10`). |
| **Phase 4/5 Edge Functions (`push-notification`, `twilio-sms`, `stripe-payment-intent`)** | **FAIL (Deferred to Phase 4/5)** | `push-notification/index.ts` (`L40-46`) only checks `Bearer ` prefix without `auth.getUser(jwt)`; `twilio-sms/index.ts` (`L46-52`) & `stripe-payment-intent/index.ts` (`L44-50`) verify JWT existence only, not `ADMIN`/`STAFF`/MFA or server-side pricing. |

---

## 7. Key File & Line References

- [`supabase/migrations/03_security_rbac_and_rls.sql`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/supabase/migrations/03_security_rbac_and_rls.sql): `L52-L67` (`private.mfa_encryption_keys`), `L173-L203` (`current_user_role`), `L244-L284` (`has_verified_mfa_session`, `is_admin`, `is_staff`), `L710-L735` (MFA table revokes & policies), `L1009-L1091` (encryption & session helpers), `L1098-L1498` (MFA RPCs).
- [`supabase/functions/bootstrap-first-admin/index.ts`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/supabase/functions/bootstrap-first-admin/index.ts): `L17-L29`, `L116-L245`.
- [`admin_web/src/services/supabaseClient.ts`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/admin_web/src/services/supabaseClient.ts): `L232-L299`, `L413-L426`.
- [`admin_web/src/pages/auth/LoginPage.tsx`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/admin_web/src/pages/auth/LoginPage.tsx): `L221-L254`, `L419-L425`, `L501-L512`.

---

## 8. Test Evidence

- **Static Inspection (`npm run verify-env` + `test_phase1_security_corrections.cjs`):** **PASS** (21/21 tables RLS enabled, 49 explicit policies, all static assertions passed).
- **Build & Lint (`npm run build`, `npm run lint`):** **PASS** (`0` TS errors, `0` lint errors).
- **Local Browser Tests (`test_phase1_auth_mfa.cjs`, `npm test`, `npm run test:commercial`):** **PASS** (`52/52` pages passed, `0` console/page errors, local TOTP & single-use recovery code replay rejection passed).
- **Mocked Tests:** **NOT APPLICABLE** (none used).
- **Live PostgreSQL/RLS, Supabase Auth/MFA, & Edge Function Tests:** **BLOCKED** (`psql`, `supabase`, `deno`, `docker` unavailable).

---

## 9. Newly Discovered Vulnerabilities

1. **Deactivated User `app_metadata` Fallback in `current_user_role()` (`03_security_rbac_and_rls.sql` `L185-L202` — Medium/High):**
   - If an `ADMIN` or `STAFF` user is deactivated (`users.is_active = FALSE`), `SELECT u.role FROM public.users WHERE id = v_uid AND is_active = TRUE` returns `NULL`, causing `current_user_role()` to fall back to `app_metadata->>'role'` until the JWT expires. If `v_uid` exists in `public.users` with `is_active = FALSE`, `current_user_role()` should immediately return `'ANONYMOUS'` without falling back to `app_metadata`.
2. **No Key-Versioning / Rotation Support in `encrypt_totp_secret()` / `decrypt_totp_secret()` (Low/Medium):**
   - Rotating `app.settings.mfa_encryption_key` without a key-ID/rotation routine invalidates existing `enc:v1:` TOTP secrets until `admin_revoke_user_mfa` is run.
3. **Out-of-Phase `SECURITY DEFINER` & Edge Function Authorization Gaps (`02_postgis_functions.sql` `L137-217`, `push-notification`, `twilio-sms`, `stripe-payment-intent`):**
   - Already scoped for Phase 4/5 remediation (`FND-09`, `FND-10`, `FND-19`).

---

## 10. Outstanding Backend Verification Requirements

Before production deployment (and ideally on a staging Supabase project):
1. Live 2-request concurrent race test on `bootstrap-first-admin`.
2. Live PostgREST `SELECT`/`UPDATE` denial tests on `user_mfa_credentials`, `user_mfa_sessions`, and `private.mfa_encryption_keys` as `CUSTOMER`, `STAFF`, and `ADMIN`.
3. Live password-only (`aal1`) JWT rejection tests against protected Admin/Staff tables & `admin_revoke_user_mfa()`, followed by `verify_my_mfa_code()` -> `refreshSession()` -> `revoke_my_mfa_session()` verification.
4. Live PostgreSQL `verify_my_mfa_code()` TOTP same-step and recovery-code replay tests.

---

## 11. Exact Conditions for Phase 2 Approval

- **Option A (Proceed to Phase 2 immediately with tracked Phase 1 hardening):** Fix the `current_user_role()` deactivated-user fallback (`L185-L202`) either right now or as the first item in Phase 2 (since Phase 2 specifically remediates RLS/tenant/role functions in `03_security_rbac_and_rls.sql`), and defer live Supabase/PostgreSQL testing to staging provisioning.
- **Option B (Strict Gate before Phase 2):** Patch the `current_user_role()` deactivated-user fallback and run the 4 live Supabase/PostgreSQL verification checks above against a staging Supabase project before unlocking Phase 2.
