-- ============================================================================
-- ServicePro OS — Phase 2 Database Security, Tenant Isolation & RPC Hardening
-- Baseline: Phase 1 (01_initial_schema.sql, 02_postgis_functions.sql, 03_security_rbac_and_rls.sql)
-- Preserves all Phase 1 MFA/RBAC/deactivation controls and closes Phase 2 gaps:
--   1. FORCE ROW LEVEL SECURITY across all 21 security-scoped tables.
--   2. Eliminates `OR public.current_tenant_id() IS NULL` fail-open bypasses.
--   3. Enforces tenant isolation on all child tables & active-user checks.
--   4. Locks auth_rate_limits, password_reset_tokens, auth_otps to service_role.
--   5. Protects booking financial/escrow/PIN columns against direct client tampering.
--   6. Hardens verify_arrival_geofence, release_escrow_to_technician, and geospatial RPCs.
--   7. Provisions private storage buckets & tenant-isolated storage.objects policies.
-- ============================================================================

-- 1. FORCE ROW LEVEL SECURITY ON ALL 21 SECURITY-SCOPED TABLES
ALTER TABLE IF EXISTS public.tenants FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.users FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.customer_profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.customer_addresses FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.provider_profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.categories FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.services FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.bookings FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.payments FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.job_evidence FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.inventory_items FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.booking_parts FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reviews FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.audit_logs FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_mfa_credentials FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_mfa_sessions FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.security_audit_logs FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.auth_rate_limits FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.password_reset_tokens FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.auth_otps FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS private.mfa_encryption_keys FORCE ROW LEVEL SECURITY;

-- Helper: true only when caller maps to an active row in public.users
CREATE OR REPLACE FUNCTION public.is_active_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
    SELECT public.current_user_role() <> 'ANONYMOUS'
       AND public.current_tenant_id() IS NOT NULL;
$$;

REVOKE ALL ON FUNCTION public.is_active_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_active_user() TO authenticated, service_role;

-- 2. FAIL-CLOSED TENANT ISOLATION & ACTIVE-USER RLS POLICIES

-- --- TENANTS ---
DROP POLICY IF EXISTS "Admins manage own tenant" ON public.tenants;
CREATE POLICY "Admins manage own tenant" ON public.tenants
    FOR ALL
    TO authenticated
    USING (public.is_admin() AND id = public.current_tenant_id())
    WITH CHECK (public.is_admin() AND id = public.current_tenant_id());

-- --- USERS ---
DROP POLICY IF EXISTS "Admins full management on users" ON public.users;
CREATE POLICY "Admins full management on users" ON public.users
    FOR ALL
    TO authenticated
    USING (public.is_admin() AND tenant_id = public.current_tenant_id())
    WITH CHECK (public.is_admin() AND tenant_id = public.current_tenant_id());

DROP POLICY IF EXISTS "Staff can view all users" ON public.users;
CREATE POLICY "Staff can view all users" ON public.users
    FOR SELECT
    TO authenticated
    USING (public.is_staff() AND tenant_id = public.current_tenant_id());

DROP POLICY IF EXISTS "Staff can register customers" ON public.users;
CREATE POLICY "Staff can register customers" ON public.users
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_staff() AND role = 'CUSTOMER' AND tenant_id = public.current_tenant_id());

DROP POLICY IF EXISTS "Users can view and edit own profile" ON public.users;
CREATE POLICY "Users can view and edit own profile" ON public.users
    FOR SELECT
    TO authenticated
    USING (id = public.current_auth_uid() AND public.is_active_user());

DROP POLICY IF EXISTS "Users can update own profile without role escalation" ON public.users;
CREATE POLICY "Users can update own profile without role escalation" ON public.users
    FOR UPDATE
    TO authenticated
    USING (id = public.current_auth_uid() AND public.is_active_user())
    WITH CHECK (
        id = public.current_auth_uid()
        AND public.is_active_user()
        AND role = public.current_user_role()
        AND tenant_id = public.current_tenant_id()
    );

DROP POLICY IF EXISTS "Self registration for customer and technician only" ON public.users;
CREATE POLICY "Self registration for customer and technician only" ON public.users
    FOR INSERT
    TO authenticated
    WITH CHECK (
        id = public.current_auth_uid()
        AND role IN ('CUSTOMER', 'TECHNICIAN')
        AND is_active = TRUE
        AND EXISTS (
            SELECT 1 FROM public.tenants t
            WHERE t.id = users.tenant_id AND t.is_active = TRUE
        )
    );

-- --- CUSTOMER_PROFILES ---
DROP POLICY IF EXISTS "Admins and staff view customer profiles" ON public.customer_profiles;
CREATE POLICY "Admins and staff view customer profiles" ON public.customer_profiles
    FOR SELECT
    TO authenticated
    USING (
        (
            (public.is_admin() OR public.is_staff())
            AND EXISTS (
                SELECT 1 FROM public.users u
                WHERE u.id = customer_profiles.user_id
                  AND u.tenant_id = public.current_tenant_id()
            )
        )
        OR (user_id = public.current_auth_uid() AND public.is_active_user())
    );

DROP POLICY IF EXISTS "Admins and owner manage customer profiles" ON public.customer_profiles;
CREATE POLICY "Admins and owner manage customer profiles" ON public.customer_profiles
    FOR ALL
    TO authenticated
    USING (
        (
            public.is_admin()
            AND EXISTS (
                SELECT 1 FROM public.users u
                WHERE u.id = customer_profiles.user_id
                  AND u.tenant_id = public.current_tenant_id()
            )
        )
        OR (user_id = public.current_auth_uid() AND public.is_customer())
    )
    WITH CHECK (
        (
            public.is_admin()
            AND EXISTS (
                SELECT 1 FROM public.users u
                WHERE u.id = customer_profiles.user_id
                  AND u.tenant_id = public.current_tenant_id()
            )
        )
        OR (user_id = public.current_auth_uid() AND public.is_customer())
    );

-- --- CUSTOMER_ADDRESSES ---
DROP POLICY IF EXISTS "Customer addresses access policy" ON public.customer_addresses;
CREATE POLICY "Customer addresses access policy" ON public.customer_addresses
    FOR SELECT
    TO authenticated
    USING (
        (
            (public.is_admin() OR public.is_staff())
            AND EXISTS (
                SELECT 1 FROM public.users u
                WHERE u.id = customer_addresses.customer_id
                  AND u.tenant_id = public.current_tenant_id()
            )
        )
        OR (customer_id = public.current_auth_uid() AND public.is_customer())
        OR (
            public.is_technician()
            AND EXISTS (
                SELECT 1 FROM public.bookings b
                WHERE b.customer_id = customer_addresses.customer_id
                  AND b.provider_id = public.current_auth_uid()
                  AND b.tenant_id = public.current_tenant_id()
            )
        )
    );

DROP POLICY IF EXISTS "Customers and admins manage addresses" ON public.customer_addresses;
CREATE POLICY "Customers and admins manage addresses" ON public.customer_addresses
    FOR ALL
    TO authenticated
    USING (
        (
            public.is_admin()
            AND EXISTS (
                SELECT 1 FROM public.users u
                WHERE u.id = customer_addresses.customer_id
                  AND u.tenant_id = public.current_tenant_id()
            )
        )
        OR (customer_id = public.current_auth_uid() AND public.is_customer())
    )
    WITH CHECK (
        (
            public.is_admin()
            AND EXISTS (
                SELECT 1 FROM public.users u
                WHERE u.id = customer_addresses.customer_id
                  AND u.tenant_id = public.current_tenant_id()
            )
        )
        OR (customer_id = public.current_auth_uid() AND public.is_customer())
    );

-- --- PROVIDER_PROFILES ---
DROP POLICY IF EXISTS "Verified provider profiles readable" ON public.provider_profiles;
CREATE POLICY "Verified provider profiles readable" ON public.provider_profiles
    FOR SELECT
    TO authenticated
    USING (
        public.is_active_user()
        AND EXISTS (
            SELECT 1 FROM public.users u
            WHERE u.id = provider_profiles.user_id
              AND u.tenant_id = public.current_tenant_id()
              AND (
                  public.is_admin()
                  OR public.is_staff()
                  OR (provider_profiles.is_verified = TRUE AND u.is_active = TRUE)
                  OR provider_profiles.user_id = public.current_auth_uid()
              )
        )
    );

DROP POLICY IF EXISTS "Technicians and admins update provider profiles" ON public.provider_profiles;
CREATE POLICY "Technicians and admins update provider profiles" ON public.provider_profiles
    FOR ALL
    TO authenticated
    USING (
        (
            public.is_admin()
            AND EXISTS (
                SELECT 1 FROM public.users u
                WHERE u.id = provider_profiles.user_id
                  AND u.tenant_id = public.current_tenant_id()
            )
        )
        OR (user_id = public.current_auth_uid() AND public.is_technician())
    )
    WITH CHECK (
        (
            public.is_admin()
            AND EXISTS (
                SELECT 1 FROM public.users u
                WHERE u.id = provider_profiles.user_id
                  AND u.tenant_id = public.current_tenant_id()
            )
        )
        OR (user_id = public.current_auth_uid() AND public.is_technician())
    );

-- --- CATEGORIES & SERVICES ---
DROP POLICY IF EXISTS "Admin manage categories" ON public.categories;
CREATE POLICY "Admin manage categories" ON public.categories
    FOR ALL
    TO authenticated
    USING (public.is_admin() AND tenant_id = public.current_tenant_id())
    WITH CHECK (public.is_admin() AND tenant_id = public.current_tenant_id());

DROP POLICY IF EXISTS "Admin manage services" ON public.services;
CREATE POLICY "Admin manage services" ON public.services
    FOR ALL
    TO authenticated
    USING (
        public.is_admin()
        AND EXISTS (
            SELECT 1 FROM public.categories c
            WHERE c.id = services.category_id
              AND c.tenant_id = public.current_tenant_id()
        )
    )
    WITH CHECK (
        public.is_admin()
        AND EXISTS (
            SELECT 1 FROM public.categories c
            WHERE c.id = services.category_id
              AND c.tenant_id = public.current_tenant_id()
        )
    );

-- --- BOOKINGS ---
DROP POLICY IF EXISTS "Admins full access on bookings" ON public.bookings;
CREATE POLICY "Admins full access on bookings" ON public.bookings
    FOR ALL
    TO authenticated
    USING (public.is_admin() AND tenant_id = public.current_tenant_id())
    WITH CHECK (public.is_admin() AND tenant_id = public.current_tenant_id());

DROP POLICY IF EXISTS "Staff dispatch access on bookings" ON public.bookings;
CREATE POLICY "Staff dispatch access on bookings" ON public.bookings
    FOR SELECT
    TO authenticated
    USING (public.is_staff() AND tenant_id = public.current_tenant_id());

DROP POLICY IF EXISTS "Staff can create bookings" ON public.bookings;
CREATE POLICY "Staff can create bookings" ON public.bookings
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_staff() AND tenant_id = public.current_tenant_id());

DROP POLICY IF EXISTS "Staff can update booking status & dispatch" ON public.bookings;
CREATE POLICY "Staff can update booking status & dispatch" ON public.bookings
    FOR UPDATE
    TO authenticated
    USING (public.is_staff() AND tenant_id = public.current_tenant_id())
    WITH CHECK (public.is_staff() AND tenant_id = public.current_tenant_id());

DROP POLICY IF EXISTS "Customers can view own bookings" ON public.bookings;
CREATE POLICY "Customers can view own bookings" ON public.bookings
    FOR SELECT
    TO authenticated
    USING (
        customer_id = public.current_auth_uid()
        AND public.is_customer()
        AND tenant_id = public.current_tenant_id()
    );

DROP POLICY IF EXISTS "Customers can create new bookings" ON public.bookings;
CREATE POLICY "Customers can create new bookings" ON public.bookings
    FOR INSERT
    TO authenticated
    WITH CHECK (
        customer_id = public.current_auth_uid()
        AND public.is_customer()
        AND tenant_id = public.current_tenant_id()
    );

DROP POLICY IF EXISTS "Technicians view assigned or dispatchable bookings" ON public.bookings;
CREATE POLICY "Technicians view assigned or dispatchable bookings" ON public.bookings
    FOR SELECT
    TO authenticated
    USING (
        public.is_technician()
        AND tenant_id = public.current_tenant_id()
        AND (
            provider_id = public.current_auth_uid()
            OR (status IN ('REQUESTED', 'BROADCASTING') AND provider_id IS NULL)
        )
    );

DROP POLICY IF EXISTS "Technicians update assigned bookings" ON public.bookings;
CREATE POLICY "Technicians update assigned bookings" ON public.bookings
    FOR UPDATE
    TO authenticated
    USING (
        provider_id = public.current_auth_uid()
        AND public.is_technician()
        AND tenant_id = public.current_tenant_id()
    )
    WITH CHECK (
        provider_id = public.current_auth_uid()
        AND public.is_technician()
        AND tenant_id = public.current_tenant_id()
    );

-- Protect sensitive financial, escrow & safety_pin fields from direct client tampering
CREATE OR REPLACE FUNCTION public.protect_booking_sensitive_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    IF auth.role() = 'service_role'
       OR current_setting('servicepro.trusted_rpc', true) = 'true'
       OR public.is_admin() THEN
        RETURN NEW;
    END IF;

    IF NEW.tenant_id IS DISTINCT FROM OLD.tenant_id
       OR NEW.customer_id IS DISTINCT FROM OLD.customer_id
       OR NEW.safety_pin IS DISTINCT FROM OLD.safety_pin
       OR NEW.escrow_status IS DISTINCT FROM OLD.escrow_status
       OR NEW.agreed_price_cents IS DISTINCT FROM OLD.agreed_price_cents
       OR NEW.platform_fee_cents IS DISTINCT FROM OLD.platform_fee_cents
       OR NEW.net_payout_cents IS DISTINCT FROM OLD.net_payout_cents THEN
        RAISE EXCEPTION 'FORBIDDEN: Financial, escrow, tenant, and safety_pin columns cannot be modified directly.';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_booking_sensitive_fields ON public.bookings;
CREATE TRIGGER trg_protect_booking_sensitive_fields
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.protect_booking_sensitive_fields();

-- --- PAYMENTS ---
DROP POLICY IF EXISTS "Admins manage payments" ON public.payments;
CREATE POLICY "Admins manage payments" ON public.payments
    FOR ALL
    TO authenticated
    USING (public.is_admin() AND tenant_id = public.current_tenant_id())
    WITH CHECK (public.is_admin() AND tenant_id = public.current_tenant_id());

DROP POLICY IF EXISTS "Staff view tenant payments" ON public.payments;
CREATE POLICY "Staff view tenant payments" ON public.payments
    FOR SELECT
    TO authenticated
    USING (public.is_staff() AND tenant_id = public.current_tenant_id());

DROP POLICY IF EXISTS "Customers view own payments" ON public.payments;
CREATE POLICY "Customers view own payments" ON public.payments
    FOR SELECT
    TO authenticated
    USING (
        customer_id = public.current_auth_uid()
        AND public.is_customer()
        AND tenant_id = public.current_tenant_id()
    );

DROP POLICY IF EXISTS "Technicians view own payouts" ON public.payments;
CREATE POLICY "Technicians view own payouts" ON public.payments
    FOR SELECT
    TO authenticated
    USING (
        provider_id = public.current_auth_uid()
        AND public.is_technician()
        AND tenant_id = public.current_tenant_id()
    );

-- --- JOB_EVIDENCE ---
DROP POLICY IF EXISTS "Job evidence read access" ON public.job_evidence;
CREATE POLICY "Job evidence read access" ON public.job_evidence
    FOR SELECT
    TO authenticated
    USING (
        public.is_active_user()
        AND EXISTS (
            SELECT 1 FROM public.bookings b
            WHERE b.id = job_evidence.booking_id
              AND b.tenant_id = public.current_tenant_id()
              AND (
                  public.is_admin()
                  OR public.is_staff()
                  OR b.customer_id = public.current_auth_uid()
                  OR b.provider_id = public.current_auth_uid()
              )
        )
    );

DROP POLICY IF EXISTS "Job evidence insert access" ON public.job_evidence;
CREATE POLICY "Job evidence insert access" ON public.job_evidence
    FOR INSERT
    TO authenticated
    WITH CHECK (
        public.is_active_user()
        AND EXISTS (
            SELECT 1 FROM public.bookings b
            WHERE b.id = job_evidence.booking_id
              AND b.tenant_id = public.current_tenant_id()
              AND (
                  public.is_admin()
                  OR public.is_staff()
                  OR (
                      captured_by_user_id = public.current_auth_uid()
                      AND (b.customer_id = public.current_auth_uid() OR b.provider_id = public.current_auth_uid())
                  )
              )
        )
    );

-- --- INVENTORY_ITEMS ---
DROP POLICY IF EXISTS "Staff and technicians read inventory" ON public.inventory_items;
CREATE POLICY "Staff and technicians read inventory" ON public.inventory_items
    FOR SELECT
    TO authenticated
    USING (
        (public.is_admin() OR public.is_staff() OR public.is_technician())
        AND tenant_id = public.current_tenant_id()
    );

DROP POLICY IF EXISTS "Admins manage inventory" ON public.inventory_items;
CREATE POLICY "Admins manage inventory" ON public.inventory_items
    FOR ALL
    TO authenticated
    USING (public.is_admin() AND tenant_id = public.current_tenant_id())
    WITH CHECK (public.is_admin() AND tenant_id = public.current_tenant_id());

-- --- BOOKING_PARTS ---
DROP POLICY IF EXISTS "Booking parts read access" ON public.booking_parts;
CREATE POLICY "Booking parts read access" ON public.booking_parts
    FOR SELECT
    TO authenticated
    USING (
        public.is_active_user()
        AND EXISTS (
            SELECT 1 FROM public.bookings b
            WHERE b.id = booking_parts.booking_id
              AND b.tenant_id = public.current_tenant_id()
              AND (
                  public.is_admin()
                  OR public.is_staff()
                  OR b.customer_id = public.current_auth_uid()
                  OR b.provider_id = public.current_auth_uid()
              )
        )
    );

DROP POLICY IF EXISTS "Booking parts manage access" ON public.booking_parts;
CREATE POLICY "Booking parts manage access" ON public.booking_parts
    FOR ALL
    TO authenticated
    USING (
        public.is_active_user()
        AND EXISTS (
            SELECT 1 FROM public.bookings b
            WHERE b.id = booking_parts.booking_id
              AND b.tenant_id = public.current_tenant_id()
              AND (
                  public.is_admin()
                  OR public.is_staff()
                  OR (public.is_technician() AND b.provider_id = public.current_auth_uid())
              )
        )
    )
    WITH CHECK (
        public.is_active_user()
        AND EXISTS (
            SELECT 1 FROM public.bookings b
            WHERE b.id = booking_parts.booking_id
              AND b.tenant_id = public.current_tenant_id()
              AND (
                  public.is_admin()
                  OR public.is_staff()
                  OR (public.is_technician() AND b.provider_id = public.current_auth_uid())
              )
        )
    );

-- --- REVIEWS ---
DROP POLICY IF EXISTS "Moderated reviews readable" ON public.reviews;
CREATE POLICY "Moderated reviews readable" ON public.reviews
    FOR SELECT
    TO public
    USING (
        is_moderated = TRUE
        OR (
            public.is_active_user()
            AND EXISTS (
                SELECT 1 FROM public.bookings b
                WHERE b.id = reviews.booking_id
                  AND b.tenant_id = public.current_tenant_id()
                  AND (
                      public.is_admin()
                      OR public.is_staff()
                      OR reviews.customer_id = public.current_auth_uid()
                      OR reviews.provider_id = public.current_auth_uid()
                  )
            )
        )
    );

DROP POLICY IF EXISTS "Customers create own booking review" ON public.reviews;
CREATE POLICY "Customers create own booking review" ON public.reviews
    FOR INSERT
    TO authenticated
    WITH CHECK (
        customer_id = public.current_auth_uid()
        AND public.is_customer()
        AND EXISTS (
            SELECT 1 FROM public.bookings b
            WHERE b.id = reviews.booking_id
              AND b.customer_id = public.current_auth_uid()
              AND b.tenant_id = public.current_tenant_id()
        )
    );

DROP POLICY IF EXISTS "Admins moderate reviews" ON public.reviews;
CREATE POLICY "Admins moderate reviews" ON public.reviews
    FOR ALL
    TO authenticated
    USING (
        (public.is_admin() OR public.is_staff())
        AND EXISTS (
            SELECT 1 FROM public.bookings b
            WHERE b.id = reviews.booking_id
              AND b.tenant_id = public.current_tenant_id()
        )
    )
    WITH CHECK (
        (public.is_admin() OR public.is_staff())
        AND EXISTS (
            SELECT 1 FROM public.bookings b
            WHERE b.id = reviews.booking_id
              AND b.tenant_id = public.current_tenant_id()
        )
    );

-- --- AUDIT_LOGS ---
DROP POLICY IF EXISTS "Admins read audit logs" ON public.audit_logs;
CREATE POLICY "Admins read audit logs" ON public.audit_logs
    FOR SELECT
    TO authenticated
    USING (public.is_admin() AND tenant_id = public.current_tenant_id());

DROP POLICY IF EXISTS "Authenticated users append audit logs" ON public.audit_logs;
CREATE POLICY "Authenticated users append audit logs" ON public.audit_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (
        public.is_active_user()
        AND tenant_id = public.current_tenant_id()
        AND (actor_id = public.current_auth_uid() OR public.is_admin() OR public.is_staff())
    );

-- --- SECURITY_AUDIT_LOGS (Tenant-Scoped Read + Caller-Bound Insert) ---
ALTER TABLE public.security_audit_logs
    ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL;

DROP POLICY IF EXISTS "Admins read security audit logs" ON public.security_audit_logs;
CREATE POLICY "Admins read security audit logs" ON public.security_audit_logs
    FOR SELECT
    TO authenticated
    USING (
        public.is_admin()
        AND (
            tenant_id = public.current_tenant_id()
            OR (
                tenant_id IS NULL
                AND EXISTS (
                    SELECT 1 FROM public.users u
                    WHERE LOWER(u.email) = LOWER(security_audit_logs.actor_email)
                      AND u.tenant_id = public.current_tenant_id()
                )
            )
        )
    );

DROP POLICY IF EXISTS "System can append security audit logs" ON public.security_audit_logs;
CREATE POLICY "System can append security audit logs" ON public.security_audit_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (
        public.is_active_user()
        AND length(trim(actor_email)) > 0
        AND length(trim(details)) > 0
        AND severity IN ('INFO', 'WARNING', 'CRITICAL')
        AND (tenant_id IS NULL OR tenant_id = public.current_tenant_id())
        AND LOWER(actor_email) = (
            SELECT LOWER(u.email) FROM public.users u
            WHERE u.id = public.current_auth_uid() AND u.is_active = TRUE
        )
    );

-- 3. LOCK AUTH SECRET & RATE-LIMIT TABLES TO SERVICE_ROLE ONLY
REVOKE ALL ON TABLE public.auth_rate_limits FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE public.auth_rate_limits TO service_role;
DROP POLICY IF EXISTS "Admins view rate limits" ON public.auth_rate_limits;
DROP POLICY IF EXISTS "Service role only rate limits" ON public.auth_rate_limits;
CREATE POLICY "Service role only rate limits" ON public.auth_rate_limits
    FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

REVOKE ALL ON TABLE public.password_reset_tokens FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE public.password_reset_tokens TO service_role;
DROP POLICY IF EXISTS "Admins manage password reset tokens" ON public.password_reset_tokens;
DROP POLICY IF EXISTS "Service role only password reset tokens" ON public.password_reset_tokens;
CREATE POLICY "Service role only password reset tokens" ON public.password_reset_tokens
    FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

REVOKE ALL ON TABLE public.auth_otps FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE public.auth_otps TO service_role;
DROP POLICY IF EXISTS "Admins manage auth otps" ON public.auth_otps;
DROP POLICY IF EXISTS "Service role only auth otps" ON public.auth_otps;
CREATE POLICY "Service role only auth otps" ON public.auth_otps
    FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

-- 4. HARDEN SECURITY DEFINER RPCs (Geofence, Escrow Release, Spatial Dispatch, Financials)

CREATE OR REPLACE FUNCTION public.find_nearest_technicians(
    p_lat DOUBLE PRECISION,
    p_lng DOUBLE PRECISION,
    p_radius_meters INT DEFAULT 40000,
    p_trade_category VARCHAR DEFAULT NULL
)
RETURNS TABLE (
    provider_id UUID,
    first_name VARCHAR,
    last_name VARCHAR,
    trade_category VARCHAR,
    vehicle_make_model VARCHAR,
    vehicle_plate VARCHAR,
    average_rating NUMERIC,
    reviews_count INT,
    distance_miles NUMERIC,
    estimated_eta_minutes INT,
    current_lat DOUBLE PRECISION,
    current_lng DOUBLE PRECISION
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    customer_point GEOGRAPHY;
    v_tenant_id UUID := public.current_tenant_id();
    v_clamped_radius INT := LEAST(GREATEST(COALESCE(p_radius_meters, 40000), 1000), 100000);
BEGIN
    IF NOT public.is_active_user() AND auth.role() IS DISTINCT FROM 'service_role' THEN
        RAISE EXCEPTION 'FORBIDDEN: Active authenticated session required.';
    END IF;

    IF p_lat IS NULL OR p_lng IS NULL OR p_lat < -90 OR p_lat > 90 OR p_lng < -180 OR p_lng > 180 THEN
        RAISE EXCEPTION 'INVALID_COORDINATES: Latitude/longitude out of bounds.';
    END IF;

    customer_point := ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography;

    RETURN QUERY
    SELECT
        u.id AS provider_id,
        u.first_name,
        u.last_name,
        p.trade_category,
        p.vehicle_make_model,
        p.vehicle_plate,
        p.average_rating,
        p.reviews_count,
        ROUND((ST_Distance(p.current_location, customer_point) / 1609.344)::numeric, 1) AS distance_miles,
        GREATEST(5, ROUND((ST_Distance(p.current_location, customer_point) / 1609.344 * 3.5)::numeric))::int AS estimated_eta_minutes,
        ST_Y(p.current_location::geometry) AS current_lat,
        ST_X(p.current_location::geometry) AS current_lng
    FROM public.provider_profiles p
    JOIN public.users u ON u.id = p.user_id
    WHERE p.is_online = TRUE
      AND p.is_verified = TRUE
      AND u.is_active = TRUE
      AND (auth.role() = 'service_role' OR u.tenant_id = v_tenant_id)
      AND (p_trade_category IS NULL OR p.trade_category ILIKE '%' || p_trade_category || '%')
      AND ST_DWithin(p.current_location, customer_point, LEAST(v_clamped_radius, p.service_radius_meters))
    ORDER BY ST_Distance(p.current_location, customer_point) ASC
    LIMIT 10;
END;
$$;

REVOKE ALL ON FUNCTION public.find_nearest_technicians(DOUBLE PRECISION, DOUBLE PRECISION, INT, VARCHAR) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.find_nearest_technicians(DOUBLE PRECISION, DOUBLE PRECISION, INT, VARCHAR) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.get_nearby_technicians(
    user_lat DOUBLE PRECISION,
    user_lng DOUBLE PRECISION,
    radius_meters INT DEFAULT 40000
)
RETURNS TABLE (
    provider_id UUID,
    first_name VARCHAR,
    last_name VARCHAR,
    trade_category VARCHAR,
    vehicle_make_model VARCHAR,
    vehicle_plate VARCHAR,
    average_rating NUMERIC,
    reviews_count INT,
    distance_miles NUMERIC,
    estimated_eta_minutes INT,
    current_lat DOUBLE PRECISION,
    current_lng DOUBLE PRECISION
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    RETURN QUERY SELECT * FROM public.find_nearest_technicians(user_lat, user_lng, radius_meters);
END;
$$;

REVOKE ALL ON FUNCTION public.get_nearby_technicians(DOUBLE PRECISION, DOUBLE PRECISION, INT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_nearby_technicians(DOUBLE PRECISION, DOUBLE PRECISION, INT) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.calculate_booking_financials(
    p_labor_cents BIGINT,
    p_parts_cents BIGINT DEFAULT 0,
    p_is_emergency BOOLEAN DEFAULT FALSE,
    p_tax_rate_basis_points INT DEFAULT 700
)
RETURNS TABLE (
    diagnostic_fee_cents BIGINT,
    emergency_surcharge_cents BIGINT,
    subtotal_cents BIGINT,
    tax_cents BIGINT,
    platform_take_cents BIGINT,
    provider_net_cents BIGINT,
    total_authorized_cents BIGINT
)
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public, pg_temp
AS $$
DECLARE
    v_diag BIGINT := 2000;
    v_emerg BIGINT := 0;
    v_subtotal BIGINT;
    v_tax BIGINT;
    v_platform BIGINT;
    v_provider_net BIGINT;
    v_total BIGINT;
BEGIN
    IF p_labor_cents IS NULL OR p_labor_cents < 0 OR COALESCE(p_parts_cents, 0) < 0 THEN
        RAISE EXCEPTION 'INVALID_AMOUNT: Labor and parts amounts must be non-negative.';
    END IF;
    IF COALESCE(p_tax_rate_basis_points, 0) < 0 OR COALESCE(p_tax_rate_basis_points, 0) > 3000 THEN
        RAISE EXCEPTION 'INVALID_TAX_RATE: Tax rate basis points out of range (0..3000).';
    END IF;

    IF COALESCE(p_is_emergency, FALSE) THEN
        v_emerg := 4900;
    END IF;

    v_subtotal := p_labor_cents + COALESCE(p_parts_cents, 0) + v_diag + v_emerg;
    v_tax := ROUND((v_subtotal * p_tax_rate_basis_points) / 10000.0);
    v_platform := ROUND(((p_labor_cents + v_diag + v_emerg) * 1500) / 10000.0);
    v_provider_net := (p_labor_cents + v_diag + v_emerg - v_platform) + COALESCE(p_parts_cents, 0);
    v_total := v_subtotal + v_tax;

    RETURN QUERY SELECT v_diag, v_emerg, v_subtotal, v_tax, v_platform, v_provider_net, v_total;
END;
$$;

CREATE OR REPLACE FUNCTION public.verify_arrival_geofence(
    p_booking_id UUID,
    p_tech_lat DOUBLE PRECISION,
    p_tech_lng DOUBLE PRECISION
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_uid UUID := public.current_auth_uid();
    v_tenant_id UUID := public.current_tenant_id();
    v_booking RECORD;
    v_tech_location GEOGRAPHY;
    v_distance_meters DOUBLE PRECISION;
BEGIN
    IF auth.role() IS DISTINCT FROM 'service_role' AND NOT public.is_active_user() THEN
        RAISE EXCEPTION 'FORBIDDEN: Active authenticated user required.';
    END IF;

    IF p_tech_lat IS NULL OR p_tech_lng IS NULL OR p_tech_lat < -90 OR p_tech_lat > 90 OR p_tech_lng < -180 OR p_tech_lng > 180 THEN
        RAISE EXCEPTION 'INVALID_COORDINATES: Latitude/longitude out of bounds.';
    END IF;

    SELECT id, tenant_id, provider_id, status, service_location
    INTO v_booking
    FROM public.bookings
    WHERE id = p_booking_id
    FOR UPDATE;

    IF NOT FOUND OR v_booking.service_location IS NULL THEN
        RAISE EXCEPTION 'Booking not found';
    END IF;

    IF auth.role() IS DISTINCT FROM 'service_role' THEN
        IF v_booking.tenant_id IS DISTINCT FROM v_tenant_id THEN
            RAISE EXCEPTION 'FORBIDDEN: Cross-tenant booking access denied.';
        END IF;
        IF NOT (
            public.is_admin()
            OR public.is_staff()
            OR (public.is_technician() AND v_booking.provider_id = v_uid)
        ) THEN
            RAISE EXCEPTION 'FORBIDDEN: Only the assigned technician, staff, or admin may verify arrival.';
        END IF;
    END IF;

    IF v_booking.status NOT IN ('ASSIGNED', 'EN_ROUTE') THEN
        RAISE EXCEPTION 'INVALID_STATUS: Arrival geofence requires ASSIGNED or EN_ROUTE booking status.';
    END IF;

    v_tech_location := ST_SetSRID(ST_MakePoint(p_tech_lng, p_tech_lat), 4326)::geography;
    v_distance_meters := ST_Distance(v_booking.service_location, v_tech_location);

    IF v_distance_meters <= 250 THEN
        PERFORM set_config('servicepro.trusted_rpc', 'true', true);
        UPDATE public.bookings
        SET status = 'ARRIVED',
            actual_arrival_at = NOW(),
            updated_at = NOW()
        WHERE id = p_booking_id;
        RETURN TRUE;
    ELSE
        RAISE EXCEPTION 'Geofence error: Technician is % meters away. Must be within 250 meters.', ROUND(v_distance_meters::numeric);
    END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.verify_arrival_geofence(UUID, DOUBLE PRECISION, DOUBLE PRECISION) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_arrival_geofence(UUID, DOUBLE PRECISION, DOUBLE PRECISION) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.release_escrow_to_technician(
    p_booking_id UUID,
    p_pin_code VARCHAR
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_uid UUID := public.current_auth_uid();
    v_tenant_id UUID := public.current_tenant_id();
    v_booking RECORD;
BEGIN
    IF auth.role() IS DISTINCT FROM 'service_role' AND NOT public.is_active_user() THEN
        RAISE EXCEPTION 'FORBIDDEN: Active authenticated user required.';
    END IF;

    IF COALESCE(TRIM(p_pin_code), '') = '' THEN
        RAISE EXCEPTION 'INVALID_PIN: 4-digit safety PIN is required.';
    END IF;

    SELECT id, tenant_id, provider_id, status, escrow_status, safety_pin, net_payout_cents
    INTO v_booking
    FROM public.bookings
    WHERE id = p_booking_id
    FOR UPDATE;

    IF NOT FOUND OR v_booking.safety_pin IS NULL THEN
        RAISE EXCEPTION 'Booking not found';
    END IF;

    IF auth.role() IS DISTINCT FROM 'service_role' THEN
        IF v_booking.tenant_id IS DISTINCT FROM v_tenant_id THEN
            RAISE EXCEPTION 'FORBIDDEN: Cross-tenant escrow release denied.';
        END IF;
        IF NOT (
            public.is_admin()
            OR (public.is_technician() AND v_booking.provider_id = v_uid)
        ) THEN
            RAISE EXCEPTION 'FORBIDDEN: Only the assigned technician or MFA-verified admin may release escrow.';
        END IF;
    END IF;

    IF v_booking.escrow_status = 'RELEASED_TO_PROVIDER' THEN
        RAISE EXCEPTION 'ESCROW_ALREADY_RELEASED: Escrow has already been released for this booking.';
    END IF;

    IF v_booking.status NOT IN ('ARRIVED', 'IN_PROGRESS', 'AWAITING_APPROVAL') THEN
        RAISE EXCEPTION 'INVALID_STATUS: Escrow release requires ARRIVED, IN_PROGRESS, or AWAITING_APPROVAL status.';
    END IF;

    IF v_booking.safety_pin <> TRIM(p_pin_code) THEN
        RAISE EXCEPTION 'Security PIN verification failed. Incorrect 4-digit PIN provided.';
    END IF;

    PERFORM set_config('servicepro.trusted_rpc', 'true', true);

    UPDATE public.bookings
    SET status = 'COMPLETED',
        escrow_status = 'RELEASED_TO_PROVIDER',
        work_completed_at = NOW(),
        updated_at = NOW()
    WHERE id = p_booking_id;

    UPDATE public.provider_profiles
    SET completed_jobs_count = completed_jobs_count + 1,
        updated_at = NOW()
    WHERE user_id = v_booking.provider_id;

    RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.release_escrow_to_technician(UUID, VARCHAR) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.release_escrow_to_technician(UUID, VARCHAR) TO authenticated, service_role;

-- 5. STORAGE BUCKET & TENANT-ISOLATED OBJECT RLS POLICIES
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'storage' AND table_name = 'buckets'
    ) THEN
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES
            ('job-evidence', 'job-evidence', FALSE, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4']),
            ('tenant-assets', 'tenant-assets', FALSE, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
        ON CONFLICT (id) DO UPDATE
        SET public = EXCLUDED.public,
            file_size_limit = EXCLUDED.file_size_limit,
            allowed_mime_types = EXCLUDED.allowed_mime_types;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'storage' AND table_name = 'objects'
    ) THEN
        DROP POLICY IF EXISTS "Tenant isolated job-evidence read" ON storage.objects;
        CREATE POLICY "Tenant isolated job-evidence read" ON storage.objects
            FOR SELECT
            TO authenticated
            USING (
                bucket_id = 'job-evidence'
                AND public.is_active_user()
                AND (storage.foldername(name))[1] = public.current_tenant_id()::text
            );

        DROP POLICY IF EXISTS "Tenant isolated job-evidence insert" ON storage.objects;
        CREATE POLICY "Tenant isolated job-evidence insert" ON storage.objects
            FOR INSERT
            TO authenticated
            WITH CHECK (
                bucket_id = 'job-evidence'
                AND public.is_active_user()
                AND (storage.foldername(name))[1] = public.current_tenant_id()::text
                AND (public.is_admin() OR public.is_staff() OR public.is_technician() OR public.is_customer())
            );

        DROP POLICY IF EXISTS "Tenant isolated tenant-assets read" ON storage.objects;
        CREATE POLICY "Tenant isolated tenant-assets read" ON storage.objects
            FOR SELECT
            TO authenticated
            USING (
                bucket_id = 'tenant-assets'
                AND public.is_active_user()
                AND (storage.foldername(name))[1] = public.current_tenant_id()::text
            );

        DROP POLICY IF EXISTS "Tenant isolated tenant-assets write" ON storage.objects;
        CREATE POLICY "Tenant isolated tenant-assets write" ON storage.objects
            FOR ALL
            TO authenticated
            USING (
                bucket_id = 'tenant-assets'
                AND public.is_admin()
                AND (storage.foldername(name))[1] = public.current_tenant_id()::text
            )
            WITH CHECK (
                bucket_id = 'tenant-assets'
                AND public.is_admin()
                AND (storage.foldername(name))[1] = public.current_tenant_id()::text
            );
    END IF;
END
$$;
