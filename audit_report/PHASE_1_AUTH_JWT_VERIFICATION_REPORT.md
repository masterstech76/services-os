# ServicePro OS — Phase 1 Auth & JWT Verification Report

**Environment Tested:** Local Workstation (No live Supabase GoTrue Auth service available)

## Live Supabase Auth / JWT Test Matrix

| Test ID | Description | Expected Result | Actual Result | Status | Exit Code |
| :--- | :--- | :--- | :--- | :--- | :-: |
| `AUTH-01` | Real Supabase Auth `signInWithPassword` (valid & invalid password) | Real JWT issued on valid password; rejected on invalid | Not executed (no running GoTrue/Supabase Auth) | **BLOCKED** | `1` |
| `AUTH-02` | Access token & `refreshSession()` claims verification (`session_id`, `aal`, `sub`) | `session_id` preserved across refresh; password-only session blocked from Admin/Staff RLS | Not executed | **BLOCKED** | `1` |
| `AUTH-03` | Live MFA enrollment (`enroll_my_mfa`) & challenge (`verify_my_mfa_code`) | Invalid TOTP rejected; valid TOTP creates `user_mfa_sessions` row unlocking Admin/Staff ops | Not executed | **BLOCKED** | `1` |
| `AUTH-04` | Recovery code verification & single-use replay rejection via RPC | Valid recovery code succeeds once; replay rejected | Not executed | **BLOCKED** | `1` |
| `AUTH-05` | MFA session 12h expiry, `revoke_my_mfa_session()` on sign-out, & `admin_set_user_active` deactivation | Expired/revoked/deactivated JWTs immediately lose privileged access and cannot refresh into privilege | Not executed | **BLOCKED** | `1` |
| `AUTH-06` | Local browser Auth & MFA suite (`test_phase1_auth_mfa.cjs`, non-cloud local mode) | Local TOTP enrollment, `'123456'`/`'000000'` rejection, bootstrap lock, single-use recovery replay rejection | Passed in headless Edge against `127.0.0.1:3000` (does **not** prove live GoTrue/PostgreSQL) | **PASS (Local Browser Only)** | `0` |
