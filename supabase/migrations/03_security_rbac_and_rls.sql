-- =====================================================================
-- ServiceOS — Production Security Architecture & RLS Migration
-- Standards: OWASP ASVS v4.0.3, NIST SP 800-63B, NIST SP 800-92
-- Migration 03: Authentication, MFA, RBAC & Row-Level Security (RLS)
-- =====================================================================

-- 1. Ensure Role Enum / Constraint Supports All 4 Personas:
-- Mobile: CUSTOMER, TECHNICIAN
-- Web: ADMIN, STAFF
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check 
    CHECK (role IN ('CUSTOMER', 'TECHNICIAN', 'ADMIN', 'STAFF'));

-- =====================================================================
-- 2. MFA Credentials & Hardware Keys (RFC 6238 TOTP + Emergency Codes)
-- =====================================================================
CREATE TABLE IF NOT EXISTS user_mfa_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    totp_secret_encrypted TEXT NOT NULL, -- Server-held Base32 TOTP secret (never readable via client SELECT)
    recovery_code_hashes TEXT[] NOT NULL, -- SHA-256 hashed single-use recovery codes
    is_mfa_enabled BOOLEAN DEFAULT FALSE,
    failed_mfa_attempts INT DEFAULT 0,
    locked_until TIMESTAMPTZ,
    last_verified_at TIMESTAMPTZ,
    last_verified_step BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

ALTER TABLE user_mfa_credentials ADD COLUMN IF NOT EXISTS last_verified_step BIGINT DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_user_mfa_user_id ON user_mfa_credentials(user_id);

-- Server-bound verified MFA sessions (tied to GoTrue JWT session_id claim; survives token refresh, blocks password-only JWTs)
CREATE TABLE IF NOT EXISTS user_mfa_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    auth_session_id TEXT NOT NULL,
    verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '12 hours'),
    revoked_at TIMESTAMPTZ,
    UNIQUE(user_id, auth_session_id)
);

CREATE INDEX IF NOT EXISTS idx_user_mfa_sessions_lookup
    ON user_mfa_sessions(user_id, auth_session_id)
    WHERE revoked_at IS NULL;

-- Private schema for server-managed TOTP encryption-at-rest key (never exposed via PostgREST)
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;

CREATE TABLE IF NOT EXISTS private.mfa_encryption_keys (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    key_material TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
REVOKE ALL ON TABLE private.mfa_encryption_keys FROM PUBLIC, anon, authenticated;
ALTER TABLE private.mfa_encryption_keys ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role only MFA keys" ON private.mfa_encryption_keys;
CREATE POLICY "Service role only MFA keys" ON private.mfa_encryption_keys
    FOR ALL
    TO service_role
    USING (TRUE)
    WITH CHECK (TRUE);

-- =====================================================================
-- 3. Dedicated Security Event Audit Trail (NIST SP 800-92)
-- =====================================================================
CREATE TABLE IF NOT EXISTS security_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_email VARCHAR(128) NOT NULL,
    role VARCHAR(32) NOT NULL,
    event_type VARCHAR(64) NOT NULL,
    severity VARCHAR(16) NOT NULL CHECK (severity IN ('INFO', 'WARNING', 'CRITICAL')),
    ip_address VARCHAR(45) NOT NULL DEFAULT '0.0.0.0',
    user_agent TEXT,
    details TEXT NOT NULL,
    metadata JSONB,
    sha256_signature VARCHAR(64),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_security_audit_actor ON security_audit_logs(actor_email, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_audit_event ON security_audit_logs(event_type, severity);

-- Immutable Trigger: Prevent alteration or deletion of audit records
CREATE OR REPLACE FUNCTION prevent_audit_log_tampering()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Security audit log records are immutable and cannot be updated or deleted.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_security_audit_immutable ON security_audit_logs;
CREATE TRIGGER trg_security_audit_immutable
BEFORE UPDATE OR DELETE ON security_audit_logs
FOR EACH ROW EXECUTE FUNCTION prevent_audit_log_tampering();

-- =====================================================================
-- 4. Rate Limiting Storage Table (Distributed Brute-Force Defense)
-- =====================================================================
CREATE TABLE IF NOT EXISTS auth_rate_limits (
    key VARCHAR(128) PRIMARY KEY, -- e.g. "ip:192.168.1.1" or "acct:admin@serviceos.com"
    attempt_count INT DEFAULT 1,
    first_attempt_at TIMESTAMPTZ DEFAULT NOW(),
    last_attempt_at TIMESTAMPTZ DEFAULT NOW(),
    locked_until TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_auth_rate_limits_locked ON auth_rate_limits(locked_until);

-- =====================================================================
-- 5. Password Reset & Account Recovery (Single-Use Cryptographic Tokens)
-- =====================================================================
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(64) NOT NULL, -- SHA-256 hash of single-use token
    expires_at TIMESTAMPTZ NOT NULL, -- 15-minute validity window
    is_used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMPTZ,
    ip_address VARCHAR(45) NOT NULL DEFAULT '0.0.0.0',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pwd_reset_token ON password_reset_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_pwd_reset_user ON password_reset_tokens(user_id, is_used);

-- =====================================================================
-- 6. Email & SMS Verification OTPs (Cryptographic One-Time Passcodes)
-- =====================================================================
CREATE TABLE IF NOT EXISTS auth_otps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destination VARCHAR(128) NOT NULL, -- Phone number or email
    otp_hash VARCHAR(64) NOT NULL, -- PBKDF2/SHA-256 hashed OTP
    otp_type VARCHAR(24) NOT NULL CHECK (otp_type IN ('LOGIN', 'PHONE_VERIFY', 'MFA', 'PASSWORD_RESET')),
    attempt_count INT DEFAULT 0,
    max_attempts INT DEFAULT 3,
    expires_at TIMESTAMPTZ NOT NULL, -- 5-minute validity window
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    ip_address VARCHAR(45) NOT NULL DEFAULT '0.0.0.0',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_auth_otps_dest ON auth_otps(destination, otp_type, is_verified);

-- =====================================================================
-- 7. Authoritative Role & Tenant Resolution Functions for RLS
-- Resolves role from public.users (or server-signed app_metadata) so
-- client-editable user_metadata cannot self-elevate to ADMIN/STAFF.
-- =====================================================================
CREATE SCHEMA IF NOT EXISTS auth;

-- Fallback auth.uid() for standalone PostgreSQL 16 (no-op if Supabase GoTrue already provides it)
CREATE OR REPLACE FUNCTION public.current_auth_uid()
RETURNS UUID
LANGUAGE sql
STABLE
AS $$
    SELECT NULLIF(
        coalesce(
            current_setting('request.jwt.claim.sub', true),
            current_setting('request.jwt.claims', true)::jsonb->>'sub'
        ),
        ''
    )::UUID;
$$;

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS VARCHAR
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_uid UUID;
    v_db_role VARCHAR;
    v_is_active BOOLEAN;
    v_app_role VARCHAR;
BEGIN
    v_uid := public.current_auth_uid();
    IF v_uid IS NULL THEN
        RETURN 'ANONYMOUS';
    END IF;

    SELECT u.role, u.is_active INTO v_db_role, v_is_active
    FROM public.users u
    WHERE u.id = v_uid
    LIMIT 1;

    -- Fail closed for existing accounts: inactive/suspended users NEVER fall back to app_metadata
    IF FOUND THEN
        IF COALESCE(v_is_active, FALSE) IS NOT TRUE THEN
            RETURN 'ANONYMOUS';
        END IF;
        IF v_db_role IN ('ADMIN', 'STAFF', 'TECHNICIAN', 'CUSTOMER') THEN
            RETURN v_db_role;
        END IF;
        RETURN 'ANONYMOUS';
    END IF;

    -- Missing public.users record: NEVER inherit ADMIN or STAFF from JWT app_metadata.
    -- Only allow non-privileged CUSTOMER / TECHNICIAN claim prior to profile row creation.
    v_app_role := current_setting('request.jwt.claims', true)::jsonb->'app_metadata'->>'role';
    IF v_app_role IS NOT NULL AND v_app_role IN ('TECHNICIAN', 'CUSTOMER') THEN
        RETURN v_app_role;
    END IF;

    RETURN 'ANONYMOUS';
END;
$$;

CREATE OR REPLACE FUNCTION public.current_tenant_id()
RETURNS UUID
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_uid UUID;
    v_tenant_id UUID;
    v_is_active BOOLEAN;
BEGIN
    v_uid := public.current_auth_uid();
    IF v_uid IS NULL THEN
        RETURN NULL;
    END IF;

    SELECT u.tenant_id, u.is_active INTO v_tenant_id, v_is_active
    FROM public.users u
    WHERE u.id = v_uid
    LIMIT 1;

    IF FOUND THEN
        IF COALESCE(v_is_active, FALSE) IS NOT TRUE THEN
            RETURN NULL;
        END IF;
        RETURN v_tenant_id;
    END IF;

    RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.current_auth_session_id()
RETURNS TEXT
LANGUAGE sql
STABLE
AS $$
    SELECT NULLIF(current_setting('request.jwt.claims', true)::jsonb->>'session_id', '');
$$;

CREATE OR REPLACE FUNCTION public.has_verified_mfa_session()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_uid UUID := public.current_auth_uid();
    v_session_id TEXT := public.current_auth_session_id();
    v_aal TEXT;
BEGIN
    IF v_uid IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Require an active server-side user record; inactive/missing users can never hold a valid MFA session
    IF NOT EXISTS (
        SELECT 1 FROM public.users u WHERE u.id = v_uid AND u.is_active = TRUE
    ) THEN
        RETURN FALSE;
    END IF;

    -- Trust native Supabase Auth aal2 claim if present
    v_aal := NULLIF(current_setting('request.jwt.claims', true)::jsonb->>'aal', '');
    IF v_aal = 'aal2' THEN
        RETURN TRUE;
    END IF;

    -- Otherwise require a server-recorded verified MFA session bound to the signed JWT session_id
    IF v_session_id IS NULL THEN
        RETURN FALSE;
    END IF;

    RETURN EXISTS (
        SELECT 1
        FROM public.user_mfa_sessions s
        WHERE s.user_id = v_uid
          AND s.auth_session_id = v_session_id
          AND s.revoked_at IS NULL
          AND s.expires_at > NOW()
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE AS $$
    SELECT public.current_user_role() = 'ADMIN' AND public.has_verified_mfa_session();
$$;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN LANGUAGE sql STABLE AS $$
    SELECT public.current_user_role() = 'STAFF' AND public.has_verified_mfa_session();
$$;

CREATE OR REPLACE FUNCTION public.is_technician()
RETURNS BOOLEAN LANGUAGE sql STABLE AS $$
    SELECT public.current_user_role() = 'TECHNICIAN';
$$;

CREATE OR REPLACE FUNCTION public.is_customer()
RETURNS BOOLEAN LANGUAGE sql STABLE AS $$
    SELECT public.current_user_role() = 'CUSTOMER';
$$;

-- (Helper functions live in public.* schema; auth schema is owned by supabase_auth_admin)

-- =====================================================================
-- 8. Enable Row-Level Security (RLS) On ALL 19 Tables
-- =====================================================================
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_mfa_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_mfa_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_otps ENABLE ROW LEVEL SECURITY;

-- Compatibility View: Ensure queries targeting service_categories work seamlessly with RLS invoker security
CREATE OR REPLACE VIEW service_categories WITH (security_invoker = true) AS SELECT * FROM categories;

-- =====================================================================
-- 9. Strict Principle-of-Least-Privilege & Tenant-Isolated Policies
-- =====================================================================

-- --- 1. TENANTS POLICIES ---
DROP POLICY IF EXISTS "Public can read active tenants" ON tenants;
CREATE POLICY "Public can read active tenants" ON tenants
    FOR SELECT
    TO public
    USING (is_active = TRUE OR id = public.current_tenant_id());

DROP POLICY IF EXISTS "Admins manage own tenant" ON tenants;
CREATE POLICY "Admins manage own tenant" ON tenants
    FOR ALL
    TO authenticated
    USING (public.is_admin() AND (id = public.current_tenant_id() OR public.current_tenant_id() IS NULL))
    WITH CHECK (public.is_admin() AND (id = public.current_tenant_id() OR public.current_tenant_id() IS NULL));

-- --- 2. USERS POLICIES ---
DROP POLICY IF EXISTS "Admins full management on users" ON users;
CREATE POLICY "Admins full management on users" ON users
    FOR ALL
    TO authenticated
    USING (public.is_admin() AND (tenant_id = public.current_tenant_id() OR public.current_tenant_id() IS NULL))
    WITH CHECK (public.is_admin() AND (tenant_id = public.current_tenant_id() OR public.current_tenant_id() IS NULL));

DROP POLICY IF EXISTS "Staff can view all users" ON users;
CREATE POLICY "Staff can view all users" ON users
    FOR SELECT
    TO authenticated
    USING (public.is_staff() AND (tenant_id = public.current_tenant_id() OR public.current_tenant_id() IS NULL));

DROP POLICY IF EXISTS "Staff can register customers" ON users;
CREATE POLICY "Staff can register customers" ON users
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_staff() AND role = 'CUSTOMER' AND (tenant_id = public.current_tenant_id() OR public.current_tenant_id() IS NULL));

DROP POLICY IF EXISTS "Users can view and edit own profile" ON users;
CREATE POLICY "Users can view and edit own profile" ON users
    FOR SELECT
    TO authenticated
    USING (id = public.current_auth_uid());

DROP POLICY IF EXISTS "Users can update own profile without role escalation" ON users;
CREATE POLICY "Users can update own profile without role escalation" ON users
    FOR UPDATE
    TO authenticated
    USING (id = public.current_auth_uid())
    WITH CHECK (id = public.current_auth_uid() AND role = public.current_user_role());

DROP POLICY IF EXISTS "Self registration for customer or first-boot admin" ON users;
DROP POLICY IF EXISTS "Self registration for customer and technician only" ON users;
CREATE POLICY "Self registration for customer and technician only" ON users
    FOR INSERT
    TO authenticated
    WITH CHECK (
        id = public.current_auth_uid()
        AND role IN ('CUSTOMER', 'TECHNICIAN')
        AND is_active = TRUE
    );

-- --- 3. CUSTOMER_PROFILES POLICIES ---
DROP POLICY IF EXISTS "Admins and staff view customer profiles" ON customer_profiles;
CREATE POLICY "Admins and staff view customer profiles" ON customer_profiles
    FOR SELECT
    TO authenticated
    USING (public.is_admin() OR public.is_staff() OR user_id = public.current_auth_uid());

DROP POLICY IF EXISTS "Admins and owner manage customer profiles" ON customer_profiles;
CREATE POLICY "Admins and owner manage customer profiles" ON customer_profiles
    FOR ALL
    TO authenticated
    USING (public.is_admin() OR user_id = public.current_auth_uid())
    WITH CHECK (public.is_admin() OR user_id = public.current_auth_uid());

-- --- 4. CUSTOMER_ADDRESSES POLICIES ---
DROP POLICY IF EXISTS "Customer addresses access policy" ON customer_addresses;
CREATE POLICY "Customer addresses access policy" ON customer_addresses
    FOR SELECT
    TO authenticated
    USING (
        public.is_admin()
        OR public.is_staff()
        OR customer_id = public.current_auth_uid()
        OR (
            public.is_technician()
            AND EXISTS (
                SELECT 1 FROM public.bookings b
                WHERE b.customer_id = customer_addresses.customer_id
                  AND b.provider_id = public.current_auth_uid()
            )
        )
    );

DROP POLICY IF EXISTS "Customers and admins manage addresses" ON customer_addresses;
CREATE POLICY "Customers and admins manage addresses" ON customer_addresses
    FOR ALL
    TO authenticated
    USING (public.is_admin() OR customer_id = public.current_auth_uid())
    WITH CHECK (public.is_admin() OR customer_id = public.current_auth_uid());

-- --- 5. PROVIDER_PROFILES POLICIES ---
DROP POLICY IF EXISTS "Verified provider profiles readable" ON provider_profiles;
CREATE POLICY "Verified provider profiles readable" ON provider_profiles
    FOR SELECT
    TO authenticated
    USING (public.is_admin() OR public.is_staff() OR is_verified = TRUE OR user_id = public.current_auth_uid());

DROP POLICY IF EXISTS "Technicians and admins update provider profiles" ON provider_profiles;
CREATE POLICY "Technicians and admins update provider profiles" ON provider_profiles
    FOR ALL
    TO authenticated
    USING (public.is_admin() OR public.is_staff() OR user_id = public.current_auth_uid())
    WITH CHECK (public.is_admin() OR public.is_staff() OR user_id = public.current_auth_uid());

-- --- 6. CATEGORIES POLICIES ---
DROP POLICY IF EXISTS "Public can browse categories" ON categories;
CREATE POLICY "Public can browse categories" ON categories
    FOR SELECT
    TO public
    USING (is_active = TRUE OR public.is_admin() OR public.is_staff());

DROP POLICY IF EXISTS "Admin manage categories" ON categories;
CREATE POLICY "Admin manage categories" ON categories
    FOR ALL
    TO authenticated
    USING (public.is_admin() AND (tenant_id = public.current_tenant_id() OR public.current_tenant_id() IS NULL))
    WITH CHECK (public.is_admin() AND (tenant_id = public.current_tenant_id() OR public.current_tenant_id() IS NULL));

-- --- 7. SERVICES POLICIES ---
DROP POLICY IF EXISTS "Public can browse services" ON services;
CREATE POLICY "Public can browse services" ON services
    FOR SELECT
    TO public
    USING (is_active = TRUE OR public.is_admin() OR public.is_staff());

DROP POLICY IF EXISTS "Admin manage services" ON services;
CREATE POLICY "Admin manage services" ON services
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- --- 8. BOOKINGS POLICIES (Tenant-Isolated & Object-Level Authorized) ---
DROP POLICY IF EXISTS "Admins full access on bookings" ON bookings;
CREATE POLICY "Admins full access on bookings" ON bookings
    FOR ALL
    TO authenticated
    USING (public.is_admin() AND (tenant_id = public.current_tenant_id() OR public.current_tenant_id() IS NULL))
    WITH CHECK (public.is_admin() AND (tenant_id = public.current_tenant_id() OR public.current_tenant_id() IS NULL));

DROP POLICY IF EXISTS "Staff dispatch access on bookings" ON bookings;
CREATE POLICY "Staff dispatch access on bookings" ON bookings
    FOR SELECT
    TO authenticated
    USING (public.is_staff() AND (tenant_id = public.current_tenant_id() OR public.current_tenant_id() IS NULL));

DROP POLICY IF EXISTS "Staff can create bookings" ON bookings;
CREATE POLICY "Staff can create bookings" ON bookings
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_staff() AND (tenant_id = public.current_tenant_id() OR public.current_tenant_id() IS NULL));

DROP POLICY IF EXISTS "Staff can update booking status & dispatch" ON bookings;
CREATE POLICY "Staff can update booking status & dispatch" ON bookings
    FOR UPDATE
    TO authenticated
    USING (public.is_staff() AND (tenant_id = public.current_tenant_id() OR public.current_tenant_id() IS NULL))
    WITH CHECK (public.is_staff() AND (tenant_id = public.current_tenant_id() OR public.current_tenant_id() IS NULL));

DROP POLICY IF EXISTS "Customers can view own bookings" ON bookings;
CREATE POLICY "Customers can view own bookings" ON bookings
    FOR SELECT
    TO authenticated
    USING (customer_id = public.current_auth_uid());

DROP POLICY IF EXISTS "Customers can create new bookings" ON bookings;
CREATE POLICY "Customers can create new bookings" ON bookings
    FOR INSERT
    TO authenticated
    WITH CHECK (customer_id = public.current_auth_uid());

DROP POLICY IF EXISTS "Technicians view assigned or dispatchable bookings" ON bookings;
CREATE POLICY "Technicians view assigned or dispatchable bookings" ON bookings
    FOR SELECT
    TO authenticated
    USING (
        provider_id = public.current_auth_uid()
        OR (
            public.is_technician()
            AND status IN ('REQUESTED', 'BROADCASTING')
            AND provider_id IS NULL
            AND (tenant_id = public.current_tenant_id() OR public.current_tenant_id() IS NULL)
        )
    );

DROP POLICY IF EXISTS "Technicians update assigned bookings" ON bookings;
CREATE POLICY "Technicians update assigned bookings" ON bookings
    FOR UPDATE
    TO authenticated
    USING (provider_id = public.current_auth_uid())
    WITH CHECK (provider_id = public.current_auth_uid());

-- --- 9. PAYMENTS POLICIES ---
DROP POLICY IF EXISTS "Admins manage payments" ON payments;
CREATE POLICY "Admins manage payments" ON payments
    FOR ALL
    TO authenticated
    USING (public.is_admin() AND (tenant_id = public.current_tenant_id() OR public.current_tenant_id() IS NULL))
    WITH CHECK (public.is_admin() AND (tenant_id = public.current_tenant_id() OR public.current_tenant_id() IS NULL));

DROP POLICY IF EXISTS "Staff view tenant payments" ON payments;
CREATE POLICY "Staff view tenant payments" ON payments
    FOR SELECT
    TO authenticated
    USING (public.is_staff() AND (tenant_id = public.current_tenant_id() OR public.current_tenant_id() IS NULL));

DROP POLICY IF EXISTS "Customers view own payments" ON payments;
CREATE POLICY "Customers view own payments" ON payments
    FOR SELECT
    TO authenticated
    USING (customer_id = public.current_auth_uid());

DROP POLICY IF EXISTS "Technicians view own payouts" ON payments;
CREATE POLICY "Technicians view own payouts" ON payments
    FOR SELECT
    TO authenticated
    USING (provider_id = public.current_auth_uid());

-- --- 10. JOB_EVIDENCE POLICIES ---
DROP POLICY IF EXISTS "Job evidence read access" ON job_evidence;
CREATE POLICY "Job evidence read access" ON job_evidence
    FOR SELECT
    TO authenticated
    USING (
        public.is_admin()
        OR public.is_staff()
        OR captured_by_user_id = public.current_auth_uid()
        OR EXISTS (
            SELECT 1 FROM public.bookings b
            WHERE b.id = job_evidence.booking_id
              AND (b.customer_id = public.current_auth_uid() OR b.provider_id = public.current_auth_uid())
        )
    );

DROP POLICY IF EXISTS "Job evidence insert access" ON job_evidence;
CREATE POLICY "Job evidence insert access" ON job_evidence
    FOR INSERT
    TO authenticated
    WITH CHECK (
        public.is_admin()
        OR public.is_staff()
        OR (
            captured_by_user_id = public.current_auth_uid()
            AND EXISTS (
                SELECT 1 FROM public.bookings b
                WHERE b.id = job_evidence.booking_id
                  AND (b.customer_id = public.current_auth_uid() OR b.provider_id = public.current_auth_uid())
            )
        )
    );

-- --- 11. INVENTORY_ITEMS POLICIES ---
DROP POLICY IF EXISTS "Staff and technicians read inventory" ON inventory_items;
CREATE POLICY "Staff and technicians read inventory" ON inventory_items
    FOR SELECT
    TO authenticated
    USING (
        (public.is_admin() OR public.is_staff() OR public.is_technician())
        AND (tenant_id = public.current_tenant_id() OR public.current_tenant_id() IS NULL)
    );

DROP POLICY IF EXISTS "Admins manage inventory" ON inventory_items;
CREATE POLICY "Admins manage inventory" ON inventory_items
    FOR ALL
    TO authenticated
    USING (public.is_admin() AND (tenant_id = public.current_tenant_id() OR public.current_tenant_id() IS NULL))
    WITH CHECK (public.is_admin() AND (tenant_id = public.current_tenant_id() OR public.current_tenant_id() IS NULL));

-- --- 12. BOOKING_PARTS POLICIES ---
DROP POLICY IF EXISTS "Booking parts read access" ON booking_parts;
CREATE POLICY "Booking parts read access" ON booking_parts
    FOR SELECT
    TO authenticated
    USING (
        public.is_admin()
        OR public.is_staff()
        OR EXISTS (
            SELECT 1 FROM public.bookings b
            WHERE b.id = booking_parts.booking_id
              AND (b.customer_id = public.current_auth_uid() OR b.provider_id = public.current_auth_uid())
        )
    );

DROP POLICY IF EXISTS "Booking parts manage access" ON booking_parts;
CREATE POLICY "Booking parts manage access" ON booking_parts
    FOR ALL
    TO authenticated
    USING (
        public.is_admin()
        OR public.is_staff()
        OR EXISTS (
            SELECT 1 FROM public.bookings b
            WHERE b.id = booking_parts.booking_id
              AND (b.customer_id = public.current_auth_uid() OR b.provider_id = public.current_auth_uid())
        )
    )
    WITH CHECK (
        public.is_admin()
        OR public.is_staff()
        OR EXISTS (
            SELECT 1 FROM public.bookings b
            WHERE b.id = booking_parts.booking_id
              AND (b.customer_id = public.current_auth_uid() OR b.provider_id = public.current_auth_uid())
        )
    );

-- --- 13. REVIEWS POLICIES ---
DROP POLICY IF EXISTS "Moderated reviews readable" ON reviews;
CREATE POLICY "Moderated reviews readable" ON reviews
    FOR SELECT
    TO public
    USING (is_moderated = TRUE OR public.is_admin() OR public.is_staff() OR customer_id = public.current_auth_uid() OR provider_id = public.current_auth_uid());

DROP POLICY IF EXISTS "Customers create own booking review" ON reviews;
CREATE POLICY "Customers create own booking review" ON reviews
    FOR INSERT
    TO authenticated
    WITH CHECK (
        customer_id = public.current_auth_uid()
        AND EXISTS (
            SELECT 1 FROM public.bookings b
            WHERE b.id = reviews.booking_id AND b.customer_id = public.current_auth_uid()
        )
    );

DROP POLICY IF EXISTS "Admins moderate reviews" ON reviews;
CREATE POLICY "Admins moderate reviews" ON reviews
    FOR ALL
    TO authenticated
    USING (public.is_admin() OR public.is_staff())
    WITH CHECK (public.is_admin() OR public.is_staff());

-- --- 14. AUDIT_LOGS POLICIES ---
DROP POLICY IF EXISTS "Admins read audit logs" ON audit_logs;
CREATE POLICY "Admins read audit logs" ON audit_logs
    FOR SELECT
    TO authenticated
    USING (public.is_admin() AND (tenant_id = public.current_tenant_id() OR public.current_tenant_id() IS NULL));

DROP POLICY IF EXISTS "Authenticated users append audit logs" ON audit_logs;
CREATE POLICY "Authenticated users append audit logs" ON audit_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (actor_id = public.current_auth_uid() OR public.is_admin() OR public.is_staff());

-- --- 15. USER_MFA_CREDENTIALS & USER_MFA_SESSIONS POLICIES ---
-- Direct table access is STRICTLY restricted to service_role only (no anon or authenticated, not even ADMIN).
-- All per-user MFA enrollment, TOTP verification, single-use recovery code consumption,
-- and Admin MFA revocation execute exclusively via narrowly scoped SECURITY DEFINER RPCs.
REVOKE ALL ON TABLE public.user_mfa_credentials FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE public.user_mfa_credentials TO service_role;

REVOKE ALL ON TABLE public.user_mfa_sessions FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE public.user_mfa_sessions TO service_role;

DROP POLICY IF EXISTS "Users manage own MFA credentials" ON user_mfa_credentials;
DROP POLICY IF EXISTS "Admins inspect MFA credentials" ON user_mfa_credentials;
DROP POLICY IF EXISTS "Service role only MFA credentials" ON user_mfa_credentials;
CREATE POLICY "Service role only MFA credentials" ON user_mfa_credentials
    FOR ALL
    TO service_role
    USING (TRUE)
    WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Service role only MFA sessions" ON user_mfa_sessions;
CREATE POLICY "Service role only MFA sessions" ON user_mfa_sessions
    FOR ALL
    TO service_role
    USING (TRUE)
    WITH CHECK (TRUE);

-- --- 16. SECURITY_AUDIT_LOGS POLICIES ---
DROP POLICY IF EXISTS "Admins read security audit logs" ON security_audit_logs;
CREATE POLICY "Admins read security audit logs" ON security_audit_logs
    FOR SELECT
    TO authenticated
    USING (public.is_admin());

DROP POLICY IF EXISTS "System can append security audit logs" ON security_audit_logs;
CREATE POLICY "System can append security audit logs" ON security_audit_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (
        length(trim(actor_email)) > 0
        AND length(trim(details)) > 0
        AND severity IN ('INFO', 'WARNING', 'CRITICAL')
    );

-- --- 17. AUTH_RATE_LIMITS POLICIES ---
DROP POLICY IF EXISTS "Admins view rate limits" ON auth_rate_limits;
CREATE POLICY "Admins view rate limits" ON auth_rate_limits
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- --- 18. PASSWORD_RESET_TOKENS POLICIES ---
DROP POLICY IF EXISTS "Admins manage password reset tokens" ON password_reset_tokens;
CREATE POLICY "Admins manage password reset tokens" ON password_reset_tokens
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- --- 19. AUTH_OTPS POLICIES ---
DROP POLICY IF EXISTS "Admins manage auth otps" ON auth_otps;
CREATE POLICY "Admins manage auth otps" ON auth_otps
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- =====================================================================
-- 10. One-Time Server-Controlled First-Admin Bootstrap & Server-Side MFA Engine
-- =====================================================================

-- 10a. Check whether the platform has already provisioned its initial Administrator.
-- Safe for anon/authenticated callers because it returns only a boolean without exposing user rows.
CREATE OR REPLACE FUNCTION public.check_system_initialized()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users WHERE role = 'ADMIN'
    ) OR EXISTS (
        SELECT 1 FROM public.security_audit_logs WHERE event_type = 'MASTER_ADMIN_INITIALIZED'
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.check_system_initialized() TO anon, authenticated, service_role;

-- 10b. Atomic, Concurrency-Locked, One-Time First-Admin Provisioning Function.
-- Restricted strictly to service_role (invoked only by server-side bootstrap-first-admin Edge Function).
CREATE OR REPLACE FUNCTION public.bootstrap_first_admin_atomic(
    p_admin_user_id UUID,
    p_email VARCHAR,
    p_first_name VARCHAR,
    p_last_name VARCHAR,
    p_phone VARCHAR,
    p_company_name VARCHAR,
    p_slug VARCHAR,
    p_totp_secret TEXT,
    p_recovery_code_hashes TEXT[],
    p_bootstrap_nonce_hash VARCHAR
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE
    v_tenant_id UUID;
BEGIN
    -- Acquire transaction-level advisory lock to serialize concurrent bootstrap requests
    PERFORM pg_advisory_xact_lock(9048101);

    -- Enforce strict one-time execution
    IF public.check_system_initialized() THEN
        RAISE EXCEPTION 'BOOTSTRAP_LOCKED: Master Administrator has already been provisioned. First-time bootstrap is permanently disabled.';
    END IF;

    -- Prevent replay of any previously used provisioning nonce
    IF p_bootstrap_nonce_hash IS NULL OR length(trim(p_bootstrap_nonce_hash)) < 32 THEN
        RAISE EXCEPTION 'BOOTSTRAP_INVALID_NONCE: A valid cryptographic nonce hash is required.';
    END IF;

    IF EXISTS (
        SELECT 1 FROM public.security_audit_logs WHERE sha256_signature = p_bootstrap_nonce_hash
    ) THEN
        RAISE EXCEPTION 'BOOTSTRAP_REPLAY: Provisioning nonce has already been consumed.';
    END IF;

    -- 1. Create or bind primary organization tenant
    INSERT INTO public.tenants (
        slug,
        business_name,
        support_email,
        support_phone,
        is_active
    ) VALUES (
        COALESCE(NULLIF(trim(p_slug), ''), 'primary-enterprise'),
        COALESCE(NULLIF(trim(p_company_name), ''), 'ServicePro OS Enterprise'),
        lower(trim(p_email)),
        COALESCE(NULLIF(trim(p_phone), ''), '+18005550100'),
        TRUE
    )
    RETURNING id INTO v_tenant_id;

    -- 2. Insert authoritative ADMIN record in public.users
    INSERT INTO public.users (
        id,
        tenant_id,
        phone,
        email,
        first_name,
        last_name,
        role,
        is_phone_verified,
        is_active
    ) VALUES (
        p_admin_user_id,
        v_tenant_id,
        COALESCE(NULLIF(trim(p_phone), ''), '+18005550100'),
        lower(trim(p_email)),
        COALESCE(NULLIF(trim(p_first_name), ''), 'Master'),
        COALESCE(NULLIF(trim(p_last_name), ''), 'Administrator'),
        'ADMIN',
        TRUE,
        TRUE
    );

    -- 3. Enroll per-user RFC 6238 TOTP secret (AES-256 encrypted at rest) and hashed single-use recovery codes
    INSERT INTO public.user_mfa_credentials (
        user_id,
        totp_secret_encrypted,
        recovery_code_hashes,
        is_mfa_enabled,
        failed_mfa_attempts,
        locked_until,
        last_verified_at,
        last_verified_step
    ) VALUES (
        p_admin_user_id,
        public.encrypt_totp_secret(p_totp_secret),
        COALESCE(p_recovery_code_hashes, ARRAY[]::TEXT[]),
        TRUE,
        0,
        NULL,
        NOW(),
        0
    );

    -- 4. Record immutable bootstrap seal in security_audit_logs (protected by trg_security_audit_immutable)
    INSERT INTO public.security_audit_logs (
        actor_email,
        role,
        event_type,
        severity,
        ip_address,
        details,
        metadata,
        sha256_signature
    ) VALUES (
        lower(trim(p_email)),
        'ADMIN',
        'MASTER_ADMIN_INITIALIZED',
        'CRITICAL',
        '127.0.0.1',
        'One-time server-controlled Master Administrator provisioning completed and permanently locked.',
        jsonb_build_object(
            'tenant_id', v_tenant_id,
            'admin_user_id', p_admin_user_id,
            'mfa_enabled', TRUE,
            'recovery_codes_count', COALESCE(array_length(p_recovery_code_hashes, 1), 0)
        ),
        p_bootstrap_nonce_hash
    );

    RETURN jsonb_build_object(
        'success', TRUE,
        'tenant_id', v_tenant_id,
        'admin_user_id', p_admin_user_id
    );
END;
$$;

REVOKE ALL ON FUNCTION public.bootstrap_first_admin_atomic(UUID, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, TEXT, TEXT[], VARCHAR) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.bootstrap_first_admin_atomic(UUID, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, TEXT, TEXT[], VARCHAR) TO service_role;

-- 10c. RFC 4648 Base32 Decoder for Server-Side TOTP Verification
CREATE OR REPLACE FUNCTION public.base32_decode(p_input TEXT)
RETURNS BYTEA
LANGUAGE plpgsql
IMMUTABLE
STRICT
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_clean TEXT := upper(regexp_replace(p_input, '[^A-Za-z2-7]', '', 'g'));
    v_alphabet TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    v_bits INT := 0;
    v_value INT := 0;
    v_idx INT;
    v_char TEXT;
    v_hex TEXT := '';
    i INT;
BEGIN
    FOR i IN 1..length(v_clean) LOOP
        v_char := substr(v_clean, i, 1);
        v_idx := strpos(v_alphabet, v_char) - 1;
        IF v_idx >= 0 THEN
            v_value := (v_value << 5) | v_idx;
            v_bits := v_bits + 5;
            IF v_bits >= 8 THEN
                v_hex := v_hex || lpad(to_hex((v_value >> (v_bits - 8)) & 255), 2, '0');
                v_bits := v_bits - 8;
                v_value := v_value & ((1 << v_bits) - 1);
            END IF;
        END IF;
    END LOOP;
    RETURN decode(v_hex, 'hex');
END;
$$;

-- 10d. RFC 6238 HMAC-SHA1 TOTP Code Generator (6 Digits, 30s Step)
CREATE OR REPLACE FUNCTION public.compute_totp_code(
    p_secret_base32 TEXT,
    p_time_step BIGINT
)
RETURNS VARCHAR(6)
LANGUAGE plpgsql
IMMUTABLE
STRICT
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE
    v_key BYTEA;
    v_msg BYTEA;
    v_hmac BYTEA;
    v_offset INT;
    v_part BIGINT;
BEGIN
    v_key := public.base32_decode(p_secret_base32);
    v_msg := decode(lpad(to_hex(p_time_step), 16, '0'), 'hex');
    v_hmac := hmac(v_msg, v_key, 'sha1');
    v_offset := get_byte(v_hmac, 19) & 15;
    v_part := ((get_byte(v_hmac, v_offset) & 127)::BIGINT << 24)
            | ((get_byte(v_hmac, v_offset + 1) & 255)::BIGINT << 16)
            | ((get_byte(v_hmac, v_offset + 2) & 255)::BIGINT << 8)
            | ((get_byte(v_hmac, v_offset + 3) & 255)::BIGINT);
    RETURN lpad((v_part % 1000000)::TEXT, 6, '0');
END;
$$;

REVOKE ALL ON FUNCTION public.base32_decode(TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.compute_totp_code(TEXT, BIGINT) FROM PUBLIC, anon, authenticated;

-- 10d-bis. Server-Managed Encryption-at-Rest & Session Binding Helpers (Never directly callable by clients)
CREATE OR REPLACE FUNCTION public.get_mfa_encryption_key()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private, extensions, pg_temp
AS $$
DECLARE
    v_key TEXT;
BEGIN
    v_key := NULLIF(current_setting('app.settings.mfa_encryption_key', true), '');
    IF v_key IS NOT NULL THEN
        RETURN v_key;
    END IF;

    SELECT key_material INTO v_key FROM private.mfa_encryption_keys WHERE id = 1;
    IF v_key IS NULL THEN
        v_key := encode(gen_random_bytes(32), 'hex');
        INSERT INTO private.mfa_encryption_keys (id, key_material)
        VALUES (1, v_key)
        ON CONFLICT (id) DO NOTHING;
        SELECT key_material INTO v_key FROM private.mfa_encryption_keys WHERE id = 1;
    END IF;

    RETURN v_key;
END;
$$;

CREATE OR REPLACE FUNCTION public.encrypt_totp_secret(p_plain_base32 TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private, extensions, pg_temp
AS $$
DECLARE
    v_clean TEXT := upper(regexp_replace(COALESCE(p_plain_base32, ''), '[^A-Za-z2-7]', '', 'g'));
BEGIN
    RETURN 'enc:v1:' || encode(
        pgp_sym_encrypt(v_clean, public.get_mfa_encryption_key(), 'cipher-algo=aes256'),
        'base64'
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.decrypt_totp_secret(p_stored TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private, extensions, pg_temp
AS $$
BEGIN
    IF p_stored LIKE 'enc:v1:%' THEN
        RETURN pgp_sym_decrypt(
            decode(substr(p_stored, 8), 'base64'),
            public.get_mfa_encryption_key()
        );
    END IF;
    RETURN upper(regexp_replace(COALESCE(p_stored, ''), '[^A-Za-z2-7]', '', 'g'));
END;
$$;

CREATE OR REPLACE FUNCTION public.record_verified_mfa_session(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_session_id TEXT := public.current_auth_session_id();
BEGIN
    IF p_user_id IS NULL OR v_session_id IS NULL THEN
        RETURN;
    END IF;

    INSERT INTO public.user_mfa_sessions (user_id, auth_session_id, verified_at, expires_at, revoked_at)
    VALUES (p_user_id, v_session_id, NOW(), NOW() + INTERVAL '12 hours', NULL)
    ON CONFLICT (user_id, auth_session_id) DO UPDATE SET
        verified_at = NOW(),
        expires_at = NOW() + INTERVAL '12 hours',
        revoked_at = NULL;
END;
$$;

REVOKE ALL ON FUNCTION public.get_mfa_encryption_key() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.encrypt_totp_secret(TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.decrypt_totp_secret(TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.record_verified_mfa_session(UUID) FROM PUBLIC, anon, authenticated;

-- 10e. Inspect Caller's Own MFA Status (Never exposes secret or recovery code hashes)
CREATE OR REPLACE FUNCTION public.get_my_mfa_status()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_uid UUID := public.current_auth_uid();
    v_mfa RECORD;
BEGIN
    IF v_uid IS NULL THEN
        RETURN jsonb_build_object('authenticated', FALSE, 'is_enrolled', FALSE, 'is_mfa_enabled', FALSE);
    END IF;

    SELECT
        is_mfa_enabled,
        failed_mfa_attempts,
        locked_until,
        COALESCE(array_length(recovery_code_hashes, 1), 0) AS remaining_recovery_codes
    INTO v_mfa
    FROM public.user_mfa_credentials
    WHERE user_id = v_uid;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'authenticated', TRUE,
            'is_enrolled', FALSE,
            'is_mfa_enabled', FALSE,
            'is_mfa_verified_for_session', FALSE,
            'is_locked', FALSE,
            'locked_until', NULL,
            'failed_attempts', 0,
            'remaining_recovery_codes', 0
        );
    END IF;

    RETURN jsonb_build_object(
        'authenticated', TRUE,
        'is_enrolled', TRUE,
        'is_mfa_enabled', COALESCE(v_mfa.is_mfa_enabled, FALSE),
        'is_mfa_verified_for_session', public.has_verified_mfa_session(),
        'is_locked', (v_mfa.locked_until IS NOT NULL AND v_mfa.locked_until > NOW()),
        'locked_until', v_mfa.locked_until,
        'failed_attempts', COALESCE(v_mfa.failed_mfa_attempts, 0),
        'remaining_recovery_codes', v_mfa.remaining_recovery_codes
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_my_mfa_status() TO authenticated;

-- 10f. Per-User MFA Enrollment (Requires valid live 6-digit TOTP confirmation before activation)
CREATE OR REPLACE FUNCTION public.enroll_my_mfa(
    p_totp_secret TEXT,
    p_recovery_code_hashes TEXT[],
    p_verification_code TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE
    v_uid UUID := public.current_auth_uid();
    v_email VARCHAR;
    v_role VARCHAR;
    v_existing BOOLEAN;
    v_current_step BIGINT := floor(extract(epoch from now()) / 30)::BIGINT;
    v_matched_step BIGINT := NULL;
    v_clean_code TEXT := regexp_replace( COALESCE(p_verification_code, ''), '\s+', '', 'g');
    v_offset INT;
BEGIN
    IF v_uid IS NULL THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Authentication required to enroll MFA.';
    END IF;

    SELECT email, role INTO v_email, v_role FROM public.users WHERE id = v_uid AND is_active = TRUE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Active user profile required to enroll MFA.';
    END IF;

    SELECT is_mfa_enabled INTO v_existing FROM public.user_mfa_credentials WHERE user_id = v_uid;
    IF COALESCE(v_existing, FALSE) = TRUE THEN
        RAISE EXCEPTION 'MFA_ALREADY_ENROLLED: Multi-factor authentication is already active for this account.';
    END IF;

    IF v_clean_code !~ '^\d{6}$' THEN
        RETURN jsonb_build_object('success', FALSE, 'error', 'Verification code must be a 6-digit numeric TOTP token.');
    END IF;

    FOR v_offset IN -1..1 LOOP
        IF public.compute_totp_code(p_totp_secret, v_current_step + v_offset) = v_clean_code THEN
            v_matched_step := v_current_step + v_offset;
            EXIT;
        END IF;
    END LOOP;

    IF v_matched_step IS NULL THEN
        RETURN jsonb_build_object('success', FALSE, 'error', 'Authenticator verification code did not match the generated secret.');
    END IF;

    INSERT INTO public.user_mfa_credentials (
        user_id,
        totp_secret_encrypted,
        recovery_code_hashes,
        is_mfa_enabled,
        failed_mfa_attempts,
        locked_until,
        last_verified_at,
        last_verified_step,
        updated_at
    ) VALUES (
        v_uid,
        public.encrypt_totp_secret(p_totp_secret),
        COALESCE(p_recovery_code_hashes, ARRAY[]::TEXT[]),
        TRUE,
        0,
        NULL,
        NOW(),
        v_matched_step,
        NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        totp_secret_encrypted = EXCLUDED.totp_secret_encrypted,
        recovery_code_hashes = EXCLUDED.recovery_code_hashes,
        is_mfa_enabled = TRUE,
        failed_mfa_attempts = 0,
        locked_until = NULL,
        last_verified_at = NOW(),
        last_verified_step = v_matched_step,
        updated_at = NOW();

    INSERT INTO public.security_audit_logs (
        actor_email,
        role,
        event_type,
        severity,
        details
    ) VALUES (
        COALESCE(v_email, 'unknown'),
        COALESCE(v_role, 'ADMIN'),
        'MFA_VERIFIED',
        'INFO',
        'Per-user RFC 6238 TOTP MFA enrolled and verified on server.'
    );

    PERFORM public.record_verified_mfa_session(v_uid);

    RETURN jsonb_build_object('success', TRUE, 'is_mfa_enabled', TRUE);
END;
$$;

GRANT EXECUTE ON FUNCTION public.enroll_my_mfa(TEXT, TEXT[], TEXT) TO authenticated;

-- 10g. Server-Side Per-User TOTP & Single-Use Recovery Code Verification with Lockout Enforcement
CREATE OR REPLACE FUNCTION public.verify_my_mfa_code(
    p_code TEXT,
    p_is_recovery_code BOOLEAN DEFAULT FALSE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE
    v_uid UUID := public.current_auth_uid();
    v_email VARCHAR;
    v_role VARCHAR;
    v_mfa public.user_mfa_credentials%ROWTYPE;
    v_current_step BIGINT := floor(extract(epoch from now()) / 30)::BIGINT;
    v_matched_step BIGINT := NULL;
    v_offset INT;
    v_clean_code TEXT;
    v_code_hash TEXT;
    v_new_hashes TEXT[];
    v_new_attempts INT;
    v_lockout_sec INT;
BEGIN
    IF v_uid IS NULL THEN
        RETURN jsonb_build_object('verified', FALSE, 'error', 'Unauthenticated request.');
    END IF;

    SELECT email, role INTO v_email, v_role FROM public.users WHERE id = v_uid AND is_active = TRUE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('verified', FALSE, 'error', 'User account is inactive or missing.');
    END IF;

    SELECT * INTO v_mfa
    FROM public.user_mfa_credentials
    WHERE user_id = v_uid
    FOR UPDATE;

    IF NOT FOUND OR NOT COALESCE(v_mfa.is_mfa_enabled, FALSE) THEN
        RETURN jsonb_build_object('verified', FALSE, 'error', 'MFA is not enrolled for this account.');
    END IF;

    -- Check server-enforced MFA lockout
    IF v_mfa.locked_until IS NOT NULL AND v_mfa.locked_until > NOW() THEN
        v_lockout_sec := GREATEST(1, CEIL(EXTRACT(EPOCH FROM (v_mfa.locked_until - NOW())))::INT);
        RETURN jsonb_build_object(
            'verified', FALSE,
            'is_locked', TRUE,
            'lockout_seconds', v_lockout_sec,
            'attempts_remaining', 0,
            'error', format('Maximum MFA attempts exceeded. Account locked for %s seconds.', v_lockout_sec)
        );
    END IF;

    IF p_is_recovery_code THEN
        -- Normalize recovery code (strip dashes/spaces, uppercase) and compute SHA-256 hex digest
        v_clean_code := upper(regexp_replace(COALESCE(p_code, ''), '[^A-Za-z0-9]', '', 'g'));
        IF length(v_clean_code) = 64 AND v_clean_code ~ '^[0-9A-F]{64}$' THEN
            v_code_hash := lower(v_clean_code);
        ELSE
            v_code_hash := encode(digest(v_clean_code, 'sha256'), 'hex');
        END IF;

        IF v_code_hash = ANY(v_mfa.recovery_code_hashes) THEN
            -- Single-use enforcement: atomically remove consumed recovery code hash
            v_new_hashes := array_remove(v_mfa.recovery_code_hashes, v_code_hash);
            UPDATE public.user_mfa_credentials
            SET recovery_code_hashes = v_new_hashes,
                failed_mfa_attempts = 0,
                locked_until = NULL,
                last_verified_at = NOW(),
                updated_at = NOW()
            WHERE user_id = v_uid;

            INSERT INTO public.security_audit_logs (
                actor_email, role, event_type, severity, details
            ) VALUES (
                COALESCE(v_email, 'unknown'),
                COALESCE(v_role, 'ADMIN'),
                'MFA_VERIFIED',
                'WARNING',
                format('Single-use emergency recovery code consumed. Remaining codes: %s', COALESCE(array_length(v_new_hashes, 1), 0))
            );

            PERFORM public.record_verified_mfa_session(v_uid);

            RETURN jsonb_build_object(
                'verified', TRUE,
                'used_recovery_code', TRUE,
                'remaining_recovery_codes', COALESCE(array_length(v_new_hashes, 1), 0)
            );
        END IF;
    ELSE
        v_clean_code := regexp_replace(COALESCE(p_code, ''), '\s+', '', 'g');
        IF v_clean_code ~ '^\d{6}$' THEN
            FOR v_offset IN -1..1 LOOP
                IF public.compute_totp_code(public.decrypt_totp_secret(v_mfa.totp_secret_encrypted), v_current_step + v_offset) = v_clean_code THEN
                    v_matched_step := v_current_step + v_offset;
                    EXIT;
                END IF;
            END LOOP;

            -- Enforce anti-replay: reject if this time step (or a newer one) was already used
            IF v_matched_step IS NOT NULL AND v_matched_step > COALESCE(v_mfa.last_verified_step, 0) THEN
                UPDATE public.user_mfa_credentials
                SET failed_mfa_attempts = 0,
                    locked_until = NULL,
                    last_verified_at = NOW(),
                    last_verified_step = v_matched_step,
                    updated_at = NOW()
                WHERE user_id = v_uid;

                PERFORM public.record_verified_mfa_session(v_uid);

                INSERT INTO public.security_audit_logs (
                    actor_email, role, event_type, severity, details
                ) VALUES (
                    COALESCE(v_email, 'unknown'),
                    COALESCE(v_role, 'ADMIN'),
                    'MFA_VERIFIED',
                    'INFO',
                    'Server-side RFC 6238 TOTP code verified.'
                );

                RETURN jsonb_build_object('verified', TRUE, 'used_recovery_code', FALSE);
            END IF;
        END IF;
    END IF;

    -- Verification failed: increment attempts and lock for 15 minutes on 3rd failure
    v_new_attempts := COALESCE(v_mfa.failed_mfa_attempts, 0) + 1;
    IF v_new_attempts >= 3 THEN
        UPDATE public.user_mfa_credentials
        SET failed_mfa_attempts = v_new_attempts,
            locked_until = NOW() + INTERVAL '15 minutes',
            updated_at = NOW()
        WHERE user_id = v_uid;

        INSERT INTO public.security_audit_logs (
            actor_email, role, event_type, severity, details
        ) VALUES (
            COALESCE(v_email, 'unknown'),
            COALESCE(v_role, 'ADMIN'),
            'ACCOUNT_LOCKED',
            'CRITICAL',
            'Maximum MFA verification attempts (3) exceeded; account locked for 15 minutes.'
        );

        RETURN jsonb_build_object(
            'verified', FALSE,
            'is_locked', TRUE,
            'lockout_seconds', 900,
            'attempts_remaining', 0,
            'error', 'Maximum 2FA verification attempts exceeded. Account locked for 15 minutes.'
        );
    ELSE
        UPDATE public.user_mfa_credentials
        SET failed_mfa_attempts = v_new_attempts,
            updated_at = NOW()
        WHERE user_id = v_uid;

        INSERT INTO public.security_audit_logs (
            actor_email, role, event_type, severity, details
        ) VALUES (
            COALESCE(v_email, 'unknown'),
            COALESCE(v_role, 'ADMIN'),
            'MFA_FAILED',
            'WARNING',
            format('Invalid MFA verification attempt (%s of 3).', v_new_attempts)
        );

        RETURN jsonb_build_object(
            'verified', FALSE,
            'is_locked', FALSE,
            'lockout_seconds', 0,
            'attempts_remaining', GREATEST(0, 3 - v_new_attempts),
            'error', format('Invalid verification code. %s attempt(s) remaining.', GREATEST(0, 3 - v_new_attempts))
        );
    END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.verify_my_mfa_code(TEXT, BOOLEAN) TO authenticated;

-- 10h. Revoke Current Session's Server-Side MFA Verification (Called on Sign-Out)
CREATE OR REPLACE FUNCTION public.revoke_my_mfa_session()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_uid UUID := public.current_auth_uid();
    v_session_id TEXT := public.current_auth_session_id();
BEGIN
    IF v_uid IS NULL OR v_session_id IS NULL THEN
        RETURN FALSE;
    END IF;

    UPDATE public.user_mfa_sessions
    SET revoked_at = NOW()
    WHERE user_id = v_uid
      AND auth_session_id = v_session_id
      AND revoked_at IS NULL;

    RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.revoke_my_mfa_session() TO authenticated;

-- 10i. Admin-Only MFA Reset / Revocation (Requires MFA-verified ADMIN; never exposes secrets or hashes)
CREATE OR REPLACE FUNCTION public.admin_revoke_user_mfa(p_target_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_actor_email VARCHAR;
    v_target_email VARCHAR;
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'FORBIDDEN: MFA-verified Administrator privileges required to revoke user MFA.';
    END IF;

    SELECT email INTO v_actor_email FROM public.users WHERE id = public.current_auth_uid();
    SELECT email INTO v_target_email FROM public.users WHERE id = p_target_user_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', FALSE, 'error', 'Target user not found.');
    END IF;

    DELETE FROM public.user_mfa_credentials WHERE user_id = p_target_user_id;
    UPDATE public.user_mfa_sessions SET revoked_at = NOW() WHERE user_id = p_target_user_id AND revoked_at IS NULL;

    INSERT INTO public.security_audit_logs (
        actor_email, role, event_type, severity, details
    ) VALUES (
        COALESCE(v_actor_email, 'admin'),
        'ADMIN',
        'MFA_REVOKED',
        'WARNING',
        format('Administrator revoked MFA credentials and active MFA sessions for user %s.', v_target_email)
    );

    RETURN jsonb_build_object('success', TRUE, 'target_user_id', p_target_user_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_revoke_user_mfa(UUID) TO authenticated;

-- 10j. Automatic MFA Session Revocation Trigger on Account Deactivation or Role Change
CREATE OR REPLACE FUNCTION public.revoke_sessions_on_user_deactivation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    IF (OLD.is_active IS DISTINCT FROM NEW.is_active AND COALESCE(NEW.is_active, FALSE) = FALSE)
       OR (OLD.role IS DISTINCT FROM NEW.role) THEN
        UPDATE public.user_mfa_sessions
        SET revoked_at = NOW()
        WHERE user_id = NEW.id
          AND revoked_at IS NULL;

        INSERT INTO public.security_audit_logs (
            actor_email, role, event_type, severity, details
        ) VALUES (
            COALESCE(NEW.email, 'unknown'),
            COALESCE(NEW.role, 'ANONYMOUS'),
            CASE WHEN COALESCE(NEW.is_active, FALSE) = FALSE THEN 'ACCOUNT_DEACTIVATED' ELSE 'ROLE_CHANGED' END,
            'WARNING',
            'Active MFA sessions automatically revoked due to account deactivation or role change.'
        );
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_revoke_sessions_on_user_deactivation ON public.users;
CREATE TRIGGER trg_revoke_sessions_on_user_deactivation
    AFTER UPDATE OF is_active, role ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.revoke_sessions_on_user_deactivation();

-- 10k. Authorized Admin User Activation / Deactivation RPC (Requires MFA-verified ADMIN; prevents self-lockout)
CREATE OR REPLACE FUNCTION public.admin_set_user_active(
    p_target_user_id UUID,
    p_is_active BOOLEAN
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_uid UUID := public.current_auth_uid();
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'FORBIDDEN: MFA-verified Administrator privileges required.';
    END IF;

    IF p_target_user_id = v_uid AND COALESCE(p_is_active, FALSE) = FALSE THEN
        RAISE EXCEPTION 'INVALID_OPERATION: Administrators cannot deactivate their own active account.';
    END IF;

    UPDATE public.users
    SET is_active = COALESCE(p_is_active, FALSE),
        updated_at = NOW()
    WHERE id = p_target_user_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', FALSE, 'error', 'Target user not found.');
    END IF;

    RETURN jsonb_build_object(
        'success', TRUE,
        'target_user_id', p_target_user_id,
        'is_active', COALESCE(p_is_active, FALSE)
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_set_user_active(UUID, BOOLEAN) TO authenticated;

-- ============================================================================
-- 11. SERVICE_ROLE-ONLY ATOMIC SELLER HANDOVER CLEANUP RPC
-- Executes strictly inside a single PostgreSQL transaction (automatic full
-- ROLLBACK on any error or unresolved FK/retention dependency).
-- ============================================================================
CREATE OR REPLACE FUNCTION public.cleanup_seller_test_records_atomic(
    p_seller_email TEXT,
    p_dry_run BOOLEAN DEFAULT TRUE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_email TEXT := LOWER(TRIM(COALESCE(p_seller_email, '')));
    v_seller RECORD;
    v_seller_count INT;
    v_exclusive_booking_ids UUID[];
    v_shared_booking_count INT := 0;
    v_payments_count INT := 0;
    v_audit_logs_count INT := 0;
    v_other_tenant_users INT := 0;
    v_proposed JSONB;
    v_deleted JSONB := '{}'::jsonb;
    v_cnt INT;
BEGIN
    IF auth.role() <> 'service_role' THEN
        RAISE EXCEPTION 'FORBIDDEN: cleanup_seller_test_records_atomic requires service_role.';
    END IF;

    IF v_email = '' OR POSITION('@' IN v_email) = 0 THEN
        RAISE EXCEPTION 'BLOCKED_MISSING_SELLER_IDENTITY: Valid seller email is required.';
    END IF;

    SELECT COUNT(*) INTO v_seller_count
    FROM public.users
    WHERE LOWER(email) = v_email;

    IF v_seller_count = 0 THEN
        RAISE EXCEPTION 'BLOCKED_SELLER_NOT_FOUND: No user found for %.', v_email;
    ELSIF v_seller_count > 1 THEN
        RAISE EXCEPTION 'BLOCKED_AMBIGUOUS_SELLER: Multiple user records matched %.', v_email;
    END IF;

    SELECT id, role, tenant_id INTO v_seller
    FROM public.users
    WHERE LOWER(email) = v_email;

    IF v_seller.role NOT IN ('ADMIN', 'STAFF') THEN
        RAISE EXCEPTION 'BLOCKED_NON_SELLER_ROLE: Account role % is not an Admin/Staff seller account.', v_seller.role;
    END IF;

    SELECT COUNT(*) INTO v_other_tenant_users
    FROM public.users
    WHERE tenant_id = v_seller.tenant_id
      AND id <> v_seller.id;

    SELECT COALESCE(ARRAY_AGG(id), ARRAY[]::UUID[])
    INTO v_exclusive_booking_ids
    FROM public.bookings
    WHERE customer_id = v_seller.id
      AND (provider_id IS NULL OR provider_id = v_seller.id);

    SELECT COUNT(*) INTO v_shared_booking_count
    FROM public.bookings
    WHERE (customer_id = v_seller.id OR provider_id = v_seller.id)
      AND NOT (id = ANY(v_exclusive_booking_ids));

    SELECT COUNT(*) INTO v_payments_count
    FROM public.payments
    WHERE customer_id = v_seller.id OR provider_id = v_seller.id;

    SELECT COUNT(*) INTO v_audit_logs_count
    FROM public.audit_logs
    WHERE actor_id = v_seller.id;

    v_proposed := jsonb_build_object(
        'booking_parts', (SELECT COUNT(*) FROM public.booking_parts WHERE booking_id = ANY(v_exclusive_booking_ids)),
        'job_evidence', (SELECT COUNT(*) FROM public.job_evidence WHERE booking_id = ANY(v_exclusive_booking_ids)),
        'reviews', (SELECT COUNT(*) FROM public.reviews WHERE booking_id = ANY(v_exclusive_booking_ids)),
        'bookings', COALESCE(ARRAY_LENGTH(v_exclusive_booking_ids, 1), 0),
        'customer_addresses', (SELECT COUNT(*) FROM public.customer_addresses WHERE customer_id = v_seller.id),
        'customer_profiles', (SELECT COUNT(*) FROM public.customer_profiles WHERE user_id = v_seller.id),
        'provider_profiles', (SELECT COUNT(*) FROM public.provider_profiles WHERE user_id = v_seller.id),
        'password_reset_tokens', (SELECT COUNT(*) FROM public.password_reset_tokens WHERE user_id = v_seller.id),
        'user_mfa_sessions', (SELECT COUNT(*) FROM public.user_mfa_sessions WHERE user_id = v_seller.id),
        'user_mfa_credentials', (SELECT COUNT(*) FROM public.user_mfa_credentials WHERE user_id = v_seller.id),
        'users', CASE WHEN v_shared_booking_count = 0 AND v_payments_count = 0 AND v_audit_logs_count = 0 THEN 1 ELSE 0 END
    );

    IF COALESCE(p_dry_run, TRUE) THEN
        RETURN jsonb_build_object(
            'atomic_transaction', TRUE,
            'mode', 'DRY_RUN',
            'target_seller_id', v_seller.id,
            'target_seller_role', v_seller.role,
            'target_tenant_id', v_seller.tenant_id,
            'proposed_counts', v_proposed,
            'actual_deleted_counts', '{}'::jsonb,
            'protected_counts', jsonb_build_object(
                'tenants', 1,
                'other_tenant_users', v_other_tenant_users,
                'shared_bookings', v_shared_booking_count,
                'payments', v_payments_count,
                'audit_logs', v_audit_logs_count
            ),
            'final_status', 'DRY_RUN_COMPLETE'
        );
    END IF;

    IF v_shared_booking_count > 0 OR v_payments_count > 0 OR v_audit_logs_count > 0 THEN
        RAISE EXCEPTION 'BLOCKED_UNRESOLVED_FK_OR_RETENTION: shared_bookings=%, payments=%, audit_logs=%',
            v_shared_booking_count, v_payments_count, v_audit_logs_count;
    END IF;

    DELETE FROM public.booking_parts WHERE booking_id = ANY(v_exclusive_booking_ids);
    GET DIAGNOSTICS v_cnt = ROW_COUNT;
    v_deleted := v_deleted || jsonb_build_object('booking_parts', v_cnt);

    DELETE FROM public.job_evidence WHERE booking_id = ANY(v_exclusive_booking_ids);
    GET DIAGNOSTICS v_cnt = ROW_COUNT;
    v_deleted := v_deleted || jsonb_build_object('job_evidence', v_cnt);

    DELETE FROM public.reviews WHERE booking_id = ANY(v_exclusive_booking_ids);
    GET DIAGNOSTICS v_cnt = ROW_COUNT;
    v_deleted := v_deleted || jsonb_build_object('reviews', v_cnt);

    DELETE FROM public.bookings WHERE id = ANY(v_exclusive_booking_ids);
    GET DIAGNOSTICS v_cnt = ROW_COUNT;
    v_deleted := v_deleted || jsonb_build_object('bookings', v_cnt);

    DELETE FROM public.customer_addresses WHERE customer_id = v_seller.id;
    GET DIAGNOSTICS v_cnt = ROW_COUNT;
    v_deleted := v_deleted || jsonb_build_object('customer_addresses', v_cnt);

    DELETE FROM public.customer_profiles WHERE user_id = v_seller.id;
    GET DIAGNOSTICS v_cnt = ROW_COUNT;
    v_deleted := v_deleted || jsonb_build_object('customer_profiles', v_cnt);

    DELETE FROM public.provider_profiles WHERE user_id = v_seller.id;
    GET DIAGNOSTICS v_cnt = ROW_COUNT;
    v_deleted := v_deleted || jsonb_build_object('provider_profiles', v_cnt);

    DELETE FROM public.password_reset_tokens WHERE user_id = v_seller.id;
    GET DIAGNOSTICS v_cnt = ROW_COUNT;
    v_deleted := v_deleted || jsonb_build_object('password_reset_tokens', v_cnt);

    DELETE FROM public.user_mfa_sessions WHERE user_id = v_seller.id;
    GET DIAGNOSTICS v_cnt = ROW_COUNT;
    v_deleted := v_deleted || jsonb_build_object('user_mfa_sessions', v_cnt);

    DELETE FROM public.user_mfa_credentials WHERE user_id = v_seller.id;
    GET DIAGNOSTICS v_cnt = ROW_COUNT;
    v_deleted := v_deleted || jsonb_build_object('user_mfa_credentials', v_cnt);

    DELETE FROM public.users WHERE id = v_seller.id;
    GET DIAGNOSTICS v_cnt = ROW_COUNT;
    v_deleted := v_deleted || jsonb_build_object('users', v_cnt);

    IF EXISTS (SELECT 1 FROM public.users WHERE id = v_seller.id) THEN
        RAISE EXCEPTION 'POST_DELETION_VERIFICATION_FAILED: Seller user row still exists.';
    END IF;

    RETURN jsonb_build_object(
        'atomic_transaction', TRUE,
        'mode', 'EXECUTE',
        'target_seller_id', v_seller.id,
        'target_seller_role', v_seller.role,
        'target_tenant_id', v_seller.tenant_id,
        'proposed_counts', v_proposed,
        'actual_deleted_counts', v_deleted,
        'protected_counts', jsonb_build_object(
            'tenants', 1,
            'other_tenant_users', v_other_tenant_users,
            'shared_bookings', v_shared_booking_count,
            'payments', v_payments_count,
            'audit_logs', v_audit_logs_count
        ),
        'final_status', 'SUCCESS'
    );
END;
$$;

REVOKE ALL ON FUNCTION public.cleanup_seller_test_records_atomic(TEXT, BOOLEAN) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.cleanup_seller_test_records_atomic(TEXT, BOOLEAN) TO service_role;
