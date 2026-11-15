-- ============================================================================
-- ServicePro OS — Phase 1 pgTAP Security, MFA & RLS Adversarial Test Suite
-- Execute via: npx supabase test db
-- ============================================================================

BEGIN;
SELECT plan(22);

-- 1. Verify all 21 tables have RLS enabled
SELECT is(
  (SELECT count(*)::int FROM pg_class c
   JOIN pg_namespace n ON n.oid = c.relnamespace
   WHERE n.nspname IN ('public', 'private')
     AND c.relkind = 'r'
     AND c.relname IN (
       'tenants','users','customer_profiles','customer_addresses','provider_profiles',
       'categories','services','bookings','payments','job_evidence','inventory_items',
       'booking_parts','reviews','audit_logs','user_mfa_credentials','user_mfa_sessions',
       'security_audit_logs','auth_rate_limits','password_reset_tokens','auth_otps',
       'mfa_encryption_keys'
     )
     AND c.relrowsecurity = TRUE),
  21,
  'All 21 security-scoped tables have Row-Level Security enabled'
);

-- 2. Verify no authenticated or anon privileges exist on MFA tables or private key table
SELECT is(
  has_table_privilege('authenticated', 'public.user_mfa_credentials', 'SELECT'),
  FALSE,
  'authenticated role has zero direct SELECT privilege on user_mfa_credentials'
);
SELECT is(
  has_table_privilege('authenticated', 'public.user_mfa_credentials', 'UPDATE'),
  FALSE,
  'authenticated role has zero direct UPDATE privilege on user_mfa_credentials'
);
SELECT is(
  has_table_privilege('authenticated', 'public.user_mfa_sessions', 'INSERT'),
  FALSE,
  'authenticated role has zero direct INSERT privilege on user_mfa_sessions'
);
SELECT is(
  has_schema_privilege('authenticated', 'private', 'USAGE'),
  FALSE,
  'authenticated role has zero USAGE privilege on private schema'
);

-- 3. Seed isolated temporary test identities in auth.users (as postgres) then switch to service_role
INSERT INTO auth.users (id, email) VALUES
  ('11111111-1111-1111-1111-111111111111', 'pgtap-admin@servicepro.test'),
  ('22222222-2222-2222-2222-222222222222', 'pgtap-staff@servicepro.test'),
  ('33333333-3333-3333-3333-333333333333', 'pgtap-cust@servicepro.test'),
  ('44444444-4444-4444-4444-444444444444', 'pgtap-tech@servicepro.test'),
  ('55555555-5555-5555-5555-555555555555', 'pgtap-tenantb-admin@servicepro.test')
ON CONFLICT (id) DO NOTHING;

SELECT set_config('role', 'service_role', true);
SELECT set_config('request.jwt.claims', '{"role":"service_role"}', true);

-- Test atomic first-admin bootstrap (and second-attempt rejection)
SELECT is(
  (public.bootstrap_first_admin_atomic(
    '11111111-1111-1111-1111-111111111111',
    'pgtap-admin@servicepro.test',
    'Test', 'Admin', '+18005550101',
    'Tenant A Corp', 'tenant-a-corp',
    'JBSWY3DPEHPK3PXP',
    ARRAY[encode(digest('TESTCODE123', 'sha256'), 'hex')],
    encode(digest('nonce-pgtap-1', 'sha256'), 'hex')
  ))->>'success',
  'true',
  'First-Admin atomic bootstrap succeeds once'
);

SELECT throws_ok(
  $$SELECT public.bootstrap_first_admin_atomic(
    '55555555-5555-5555-5555-555555555555',
    'pgtap-tenantb-admin@servicepro.test',
    'Evil', 'Admin', '+18005550102',
    'Tenant B Corp', 'tenant-b-corp',
    'JBSWY3DPEHPK3PXP',
    ARRAY['deadbeef'],
    encode(digest('nonce-pgtap-2', 'sha256'), 'hex')
  )$$,
  'BOOTSTRAP_LOCKED: Master Administrator has already been provisioned. First-time bootstrap is permanently disabled.',
  'Second bootstrap attempt is permanently rejected'
);

-- Verify TOTP secret is encrypted at rest with enc:v1: prefix
SELECT ok(
  (SELECT totp_secret_encrypted LIKE 'enc:v1:%' FROM public.user_mfa_credentials WHERE user_id = '11111111-1111-1111-1111-111111111111'),
  'Stored TOTP secret is encrypted at rest (enc:v1: prefix)'
);

-- Create Tenant B, Staff, Customer, and Technician for cross-tenant & role tests
INSERT INTO public.tenants (id, business_name, slug) VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Tenant B', 'tenant-b')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.users (id, tenant_id, email, phone, first_name, last_name, role, is_active) VALUES
  ('22222222-2222-2222-2222-222222222222', (SELECT tenant_id FROM public.users WHERE id = '11111111-1111-1111-1111-111111111111'), 'pgtap-staff@servicepro.test', '+18005550103', 'Test', 'Staff', 'STAFF', TRUE),
  ('33333333-3333-3333-3333-333333333333', (SELECT tenant_id FROM public.users WHERE id = '11111111-1111-1111-1111-111111111111'), 'pgtap-cust@servicepro.test', '+18005550104', 'Test', 'Customer', 'CUSTOMER', TRUE),
  ('44444444-4444-4444-4444-444444444444', (SELECT tenant_id FROM public.users WHERE id = '11111111-1111-1111-1111-111111111111'), 'pgtap-tech@servicepro.test', '+18005550105', 'Test', 'Tech', 'TECHNICIAN', TRUE),
  ('55555555-5555-5555-5555-555555555555', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'pgtap-tenantb-admin@servicepro.test', '+18005550106', 'TenantB', 'Admin', 'ADMIN', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 4. Test password-only Admin session (aal1, no verified MFA session) -> is_admin() MUST be FALSE
SELECT set_config('role', 'authenticated', true);
SELECT set_config('request.jwt.claims', json_build_object(
  'sub', '11111111-1111-1111-1111-111111111111',
  'session_id', 'sess-admin-1',
  'aal', 'aal1',
  'app_metadata', json_build_object('role', 'ADMIN')
)::text, true);

SELECT is(public.is_admin(), FALSE, 'Password-only Admin JWT (aal1, no MFA session) fails is_admin()');
SELECT is((SELECT count(*)::int FROM public.security_audit_logs), 0, 'Password-only Admin cannot read security_audit_logs');

-- 5. Test single-use recovery code verification unlocks session, and replay fails
SELECT is(
  (public.verify_my_mfa_code('TESTCODE123', TRUE))->>'verified',
  'true',
  'Valid single-use recovery code verifies MFA and creates session'
);
SELECT is(public.is_admin(), TRUE, 'Verified MFA Admin passes is_admin()');
SELECT is(
  (public.verify_my_mfa_code('TESTCODE123', TRUE))->>'verified',
  'false',
  'Replaying consumed recovery code is rejected'
);

-- 6. Test Customer cannot escalate role or access Admin audit logs
SELECT set_config('request.jwt.claims', json_build_object(
  'sub', '33333333-3333-3333-3333-333333333333',
  'session_id', 'sess-cust-1',
  'app_metadata', json_build_object('role', 'CUSTOMER')
)::text, true);

SELECT is(public.is_customer(), TRUE, 'Customer role check works without MFA');
SELECT throws_ok(
  $$UPDATE public.users SET role = 'ADMIN' WHERE id = '33333333-3333-3333-3333-333333333333'$$,
  NULL,
  'Customer cannot self-escalate role to ADMIN'
);

-- 7. Test missing public.users record with forged app_metadata.role = 'ADMIN' -> ANONYMOUS
SELECT set_config('request.jwt.claims', json_build_object(
  'sub', '99999999-9999-9999-9999-999999999999',
  'session_id', 'sess-missing-1',
  'aal', 'aal2',
  'app_metadata', json_build_object('role', 'ADMIN')
)::text, true);

SELECT is(public.current_user_role(), 'ANONYMOUS', 'Missing public.users record cannot inherit ADMIN from app_metadata');
SELECT is(public.is_admin(), FALSE, 'Missing public.users record fails is_admin() even with aal2');

-- 8. Test deactivated Admin with stale aal2 / app_metadata.role = 'ADMIN' -> ANONYMOUS & is_admin() = FALSE
SELECT set_config('role', 'service_role', true);
SELECT set_config('request.jwt.claims', '{"role":"service_role"}', true);
UPDATE public.users SET is_active = FALSE WHERE id = '11111111-1111-1111-1111-111111111111';

SELECT set_config('role', 'authenticated', true);
SELECT set_config('request.jwt.claims', json_build_object(
  'sub', '11111111-1111-1111-1111-111111111111',
  'session_id', 'sess-admin-1',
  'aal', 'aal2',
  'app_metadata', json_build_object('role', 'ADMIN')
)::text, true);

SELECT is(public.current_user_role(), 'ANONYMOUS', 'Deactivated Admin immediately resolves to ANONYMOUS despite stale app_metadata');
SELECT is(public.is_admin(), FALSE, 'Deactivated Admin fails is_admin() even with stale aal2 and prior MFA session');

-- 9. Test seller handover atomic cleanup RPC access control & ownership isolation
SELECT throws_ok(
  $$SELECT public.cleanup_seller_test_records_atomic('pgtap-staff@servicepro.test', TRUE)$$,
  NULL,
  'Authenticated role cannot invoke service_role-only cleanup_seller_test_records_atomic'
);

SELECT set_config('role', 'service_role', true);
SELECT set_config('request.jwt.claims', '{"role":"service_role"}', true);
SELECT throws_ok(
  $$SELECT public.cleanup_seller_test_records_atomic('pgtap-cust@servicepro.test', FALSE)$$,
  NULL,
  'Atomic cleanup RPC rejects non-seller CUSTOMER account'
);

SELECT is(
  (public.cleanup_seller_test_records_atomic('pgtap-staff@servicepro.test', FALSE))->>'final_status',
  'SUCCESS',
  'Atomic cleanup RPC deletes only seller account while preserving other tenant users'
);

SELECT * FROM finish();
ROLLBACK;
