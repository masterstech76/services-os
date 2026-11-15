-- ============================================================================
-- ServicePro OS — Phase 2 pgTAP Database, Tenant Isolation & RPC Adversarial Suite
-- Execute via: npx supabase test db
-- ============================================================================

BEGIN;
SELECT plan(14);

-- 1. Verify FORCE ROW LEVEL SECURITY is enabled on all 21 tables
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
     AND c.relforcerowsecurity = TRUE),
  21,
  'All 21 security-scoped tables have FORCE ROW LEVEL SECURITY enabled'
);

-- Seed isolated synthetic fixtures inside rolled-back transaction
INSERT INTO public.tenants (id, business_name, slug, is_active) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Phase2 Tenant A', 'phase2-tenant-a', TRUE),
  ('20000000-0000-0000-0000-000000000002', 'Phase2 Tenant B', 'phase2-tenant-b', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.users (id, tenant_id, email, phone, first_name, last_name, role, is_active) VALUES
  ('10000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000001', 'p2-cust-a@test.local', '+18005550201', 'Cust', 'A', 'CUSTOMER', TRUE),
  ('10000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000001', 'p2-tech-a@test.local', '+18005550202', 'Tech', 'A', 'TECHNICIAN', TRUE),
  ('10000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000001', 'p2-inactive@test.local', '+18005550203', 'Inactive', 'User', 'CUSTOMER', FALSE),
  ('20000000-0000-0000-0000-000000000021', '20000000-0000-0000-0000-000000000002', 'p2-admin-b@test.local', '+18005550204', 'Admin', 'B', 'ADMIN', TRUE),
  ('20000000-0000-0000-0000-000000000022', '20000000-0000-0000-0000-000000000002', 'p2-tech-b@test.local', '+18005550205', 'Tech', 'B', 'TECHNICIAN', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.provider_profiles (id, user_id, trade_license_number, trade_category, is_verified, is_online) VALUES
  ('10000000-0000-0000-0000-000000000112', '10000000-0000-0000-0000-000000000012', 'P2-LIC-001', 'HVAC', TRUE, TRUE),
  ('20000000-0000-0000-0000-000000000122', '20000000-0000-0000-0000-000000000022', 'P2-LIC-002', 'HVAC', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.categories (id, tenant_id, slug, title, icon_name, image_url, is_active) VALUES
  ('10000000-0000-0000-0000-000000000201', '10000000-0000-0000-0000-000000000001', 'p2-hvac-a', 'HVAC', 'ac_unit', 'assets/hvac.png', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.services (id, category_id, name, description, base_price_cents, is_active) VALUES
  ('10000000-0000-0000-0000-000000000301', '10000000-0000-0000-0000-000000000201', 'AC Tune-up', 'Synthetic Phase 2 test service', 9900, TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.bookings (
  id, tenant_id, booking_reference, customer_id, provider_id, service_id, status,
  address_text, service_location, scheduled_start,
  labor_cost_cents, total_authorized_cents, platform_fee_cents, net_payout_cents, safety_pin, escrow_status
) VALUES (
  '10000000-0000-0000-0000-000000000401',
  '10000000-0000-0000-0000-000000000001',
  'BK-P2-TEST-401',
  '10000000-0000-0000-0000-000000000011',
  '10000000-0000-0000-0000-000000000012',
  '10000000-0000-0000-0000-000000000301',
  'EN_ROUTE',
  '100 Test St',
  ST_SetSRID(ST_MakePoint(-80.1918, 25.7617), 4326)::geography,
  NOW() + INTERVAL '1 hour',
  15000, 15000, 2250, 12750, '4829', 'HELD_IN_ESCROW'
) ON CONFLICT (id) DO UPDATE SET
  status = 'EN_ROUTE',
  provider_id = EXCLUDED.provider_id,
  escrow_status = 'HELD_IN_ESCROW';

INSERT INTO public.payments (
  id, tenant_id, booking_id, customer_id, provider_id, amount_cents, status
) VALUES (
  '10000000-0000-0000-0000-000000000501',
  '10000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000401',
  '10000000-0000-0000-0000-000000000011',
  '10000000-0000-0000-0000-000000000012',
  15000, 'AUTHORIZED'
) ON CONFLICT (id) DO NOTHING;

-- 2. Anonymous role cannot read bookings, payments, or invoke geofence RPC
SELECT set_config('role', 'anon', true);
SELECT set_config('request.jwt.claims', '{}', true);
SELECT is((SELECT count(*)::int FROM public.bookings), 0, 'Anonymous cannot read any bookings');
SELECT is((SELECT count(*)::int FROM public.payments), 0, 'Anonymous cannot read any payments');
SELECT throws_ok(
  $$SELECT public.verify_arrival_geofence('10000000-0000-0000-0000-000000000401', 25.7617, -80.1918)$$,
  NULL,
  'Anonymous cannot invoke verify_arrival_geofence'
);

-- 3. Missing tenant context (sub has no public.users row) fails closed
SELECT set_config('role', 'authenticated', true);
SELECT set_config('request.jwt.claims', json_build_object(
  'sub', '99999999-9999-9999-9999-999999999998',
  'session_id', 'sess-p2-missing'
)::text, true);
SELECT is(public.is_active_user(), FALSE, 'Missing user fails is_active_user()');
SELECT is((SELECT count(*)::int FROM public.bookings), 0, 'Missing tenant context cannot read bookings');

-- 4. Inactive customer cannot read own bookings or payments
SELECT set_config('request.jwt.claims', json_build_object(
  'sub', '10000000-0000-0000-0000-000000000013',
  'session_id', 'sess-p2-inactive'
)::text, true);
SELECT is(public.is_active_user(), FALSE, 'Inactive user fails is_active_user()');
SELECT is((SELECT count(*)::int FROM public.users WHERE id = '10000000-0000-0000-0000-000000000013'), 0, 'Inactive user cannot read own users row');

-- 5. Cross-tenant Admin B (with verified MFA session) cannot read Tenant A bookings or payments
SELECT set_config('role', 'service_role', true);
INSERT INTO public.user_mfa_sessions (user_id, auth_session_id, verified_at, expires_at)
VALUES ('20000000-0000-0000-0000-000000000021', 'sess-p2-admin-b', NOW(), NOW() + INTERVAL '1 hour')
ON CONFLICT (user_id, auth_session_id) DO NOTHING;

SELECT set_config('role', 'authenticated', true);
SELECT set_config('request.jwt.claims', json_build_object(
  'sub', '20000000-0000-0000-0000-000000000021',
  'session_id', 'sess-p2-admin-b',
  'aal', 'aal2'
)::text, true);
SELECT is((SELECT count(*)::int FROM public.bookings WHERE tenant_id = '10000000-0000-0000-0000-000000000001'), 0, 'Tenant B Admin cannot read Tenant A bookings');
SELECT is((SELECT count(*)::int FROM public.payments WHERE tenant_id = '10000000-0000-0000-0000-000000000001'), 0, 'Tenant B Admin cannot read Tenant A payments');
SELECT throws_ok(
  $$SELECT count(*) FROM public.password_reset_tokens$$,
  NULL,
  'Admin cannot read password_reset_tokens directly (service_role only)'
);

-- 6. Cross-tenant Tech B cannot call geofence or escrow release on Tenant A booking
SELECT set_config('request.jwt.claims', json_build_object(
  'sub', '20000000-0000-0000-0000-000000000022',
  'session_id', 'sess-p2-tech-b'
)::text, true);
SELECT throws_ok(
  $$SELECT public.verify_arrival_geofence('10000000-0000-0000-0000-000000000401', 25.7617, -80.1918)$$,
  NULL,
  'Cross-tenant technician cannot invoke verify_arrival_geofence'
);

-- 7. Assigned Tech A cannot tamper directly with safety_pin or escrow_status
SELECT set_config('request.jwt.claims', json_build_object(
  'sub', '10000000-0000-0000-0000-000000000012',
  'session_id', 'sess-p2-tech-a'
)::text, true);
SELECT throws_ok(
  $$UPDATE public.bookings SET escrow_status = 'RELEASED_TO_PROVIDER' WHERE id = '10000000-0000-0000-0000-000000000401'$$,
  NULL,
  'Assigned technician cannot tamper directly with escrow_status'
);

-- 8. Assigned Tech A succeeds via authorized verify_arrival_geofence & release_escrow_to_technician
DO $$
DECLARE v_st TEXT;
BEGIN
  SELECT status INTO v_st FROM public.bookings WHERE id = '10000000-0000-0000-0000-000000000401';
  IF v_st IS DISTINCT FROM 'EN_ROUTE' THEN
    RAISE EXCEPTION 'DEBUG: expected EN_ROUTE before verify_arrival_geofence, got %', COALESCE(v_st, '<NULL>');
  END IF;
END $$;
SELECT is(
  public.verify_arrival_geofence('10000000-0000-0000-0000-000000000401', 25.7617, -80.1918),
  TRUE,
  'Assigned technician within 250m succeeds verify_arrival_geofence'
);
SELECT is(
  public.release_escrow_to_technician('10000000-0000-0000-0000-000000000401', '4829'),
  TRUE,
  'Assigned technician with valid PIN succeeds release_escrow_to_technician'
);

SELECT * FROM finish();
ROLLBACK;
