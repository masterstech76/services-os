# ServicePro OS — Handover Cleanup Security Correction Report

**Date:** 2026-11-15  
**Scope:** Remediation of [`scripts/handover_cleanup.cjs`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/scripts/handover_cleanup.cjs) & creation of isolated fixture test suite [`scripts/test_handover_cleanup.cjs`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/scripts/test_handover_cleanup.cjs).  
**Safety Compliance:** Cleanup was **NOT** executed against any real database, no database records were deleted, and Phase 2 has **NOT** been started.

---

## 1. Verified Schema Dependency Map (`01_initial_schema.sql` & `03_security_rbac_and_rls.sql`)

- **Protected Shared & Retention Tables (NEVER Deleted):** `tenants`, `categories`, `services`, `inventory_items`, `payments` (`customer_id NOT NULL REFERENCES users(id)`, `booking_id ON DELETE SET NULL`), `audit_logs` (`actor_id REFERENCES users(id)`), `security_audit_logs` (immutable trigger).
- **Seller-Exclusive Booking Children (`ON DELETE CASCADE` from `bookings`):** `booking_parts`, `job_evidence` (`captured_by_user_id REFERENCES users(id)`), `reviews` (`customer_id`/`provider_id REFERENCES users(id)`).
- **Seller-Exclusive User Children (`ON DELETE CASCADE` from `users`):** `customer_addresses`, `customer_profiles`, `provider_profiles`, `password_reset_tokens`, `user_mfa_sessions`, `user_mfa_credentials`.

---

## 2. Security Corrections Implemented in [`scripts/handover_cleanup.cjs`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/scripts/handover_cleanup.cjs)

1. **Removed Tenant-Wide Deletion:** `tenants`, `categories`, `services`, `inventory_items`, `payments`, `audit_logs`, `security_audit_logs`, and all other users/buyers in the same tenant are strictly protected and never deleted.
2. **Explicit Seller Ownership & Shared-Record Blocking:** `planSellerCleanup()` verifies the single matching `ADMIN`/`STAFF` account for `--seller-email`, rejects `CUSTOMER`/`TECHNICIAN` or ambiguous accounts, isolates only exclusively seller-owned bookings/children, and refuses user deletion (`BLOCKED_UNRESOLVED_FK`) if any shared bookings, `payments`, or `audit_logs` reference the seller.
3. **Dry-Run Preview (`--dry-run`):** Computes table-by-table proposed counts, protected counts, and unresolved FK dependencies with zero DB writes.
4. **Environment & External Backup Guards:** Rejects `NODE_ENV=production`, `VITE_APP_ENV=production`, and hosted/unknown URLs by default; requires `--backup-file=<path>` stored **outside** the Git repository and verified readable (> 0 bytes).
5. **Transactional Execution & Sanitized JSON Report:** Executes inside `runInTransaction()`, checks `{ error }` on every step, rolls back all changes on any error, verifies post-deletion state, and writes sanitized `audit_report/SELLER_HANDOVER_CLEANUP_REPORT.json` (zero PII/secrets).

---

## 3. Automated Test Results ([`scripts/test_handover_cleanup.cjs`](file:///c:/Users/hashm/OneDrive/Desktop/Online%20work/scripts/test_handover_cleanup.cjs))

Executed against isolated in-memory transactional fixtures (`node scripts/test_handover_cleanup.cjs`, exit code `0`):
- **PASS:** Multi-user tenant & buyer account in same tenant preserved; unrelated customer records preserved.
- **PASS:** Dry-run previews seller-only counts with zero mutations.
- **PASS:** Exclusively seller-owned records deleted in verified FK order while `tenants` & shared catalog remain intact.
- **PASS:** Shared bookings, retained `payments`, and `audit_logs` block unsafe user deletion (`BLOCKED_UNRESOLVED_FK`).
- **PASS:** Missing/invalid/in-repo backup blocked (`BLOCKED_MISSING_BACKUP`).
- **PASS:** Production URL (`*.supabase.co`) and `NODE_ENV=production` rejected (`BLOCKED_HOSTED_OR_UNKNOWN_URL`, `BLOCKED_PRODUCTION_ENV`).
- **PASS:** Missing seller identity & non-seller/customer account rejected (`BLOCKED_SELLER_NOT_FOUND`, `BLOCKED_NON_SELLER_ROLE`).
- **PASS:** Partial deletion failure triggers full transaction rollback restoring all child & user records.
- `npm run verify:data-env` & `npm run verify-env`: **PASS** (exit code `0`).

**Note:** Recommended production handover remains provisioning a fresh, empty buyer Supabase project rather than running cleanup on a shared environment. **STOPPED** — awaiting approval before Phase 2.
