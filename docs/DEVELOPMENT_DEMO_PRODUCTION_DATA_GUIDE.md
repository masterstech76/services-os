# Genuine Seller Testing & Clean Buyer Production Handover Guide

ServicePro OS contains **zero fake demo data, zero sample customers, zero fictional employees, and zero dummy transactions**.

---

## 1. Seller Pre-Sale Testing (Genuine Temporary Data Only)

1. Use an **isolated non-production Supabase project** (or local `npx supabase start` with Docker) and **Stripe Test Mode** (`sk_test_*` / `pk_test_*` only — never live Stripe keys).
2. Initialize your own genuine temporary Master Administrator account via `bootstrap-first-admin` and enroll TOTP MFA.
3. Add only genuine temporary Staff, Technician, or test Customer accounts you are authorized to use for live workflow verification.
4. **Never** commit personal test credentials, `.env` files, or seller records to the repository.

---

## 2. Pre-Handover Cleanup & Clean Buyer Production Setup

1. Before delivering or reusing a test Supabase instance, run the scoped cleanup script to remove your temporary seller account, tenant, and test records:
   ```bash
   npm run handover:cleanup -- --confirm-handover-cleanup --seller-email=your-test-admin@domain.com
   ```
2. Verify zero fake/sample records exist in migrations and zero `service_role` or live Stripe keys exist in frontend source/bundles:
   ```bash
   npm run verify:data-env
   ```
3. For **Buyer Production**, the buyer provisions their own Supabase project, runs `01_initial_schema.sql`, `02_postgis_functions.sql`, and `03_security_rbac_and_rls.sql` (starting 100% empty), and initializes their own first Master Administrator with `INITIAL_ADMIN_BOOTSTRAP_SECRET`.
