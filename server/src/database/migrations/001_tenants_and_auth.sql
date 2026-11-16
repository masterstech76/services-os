-- ==============================================================================
-- Migration: 001_tenants_and_auth.sql
-- Description: Core Multi-Tenancy, Users, Identity, Sessions, MFA & RBAC
-- Target: PostgreSQL 16 + PostGIS
-- ==============================================================================

-- 1. Enable Required Database Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. Generic Function for Auto-Updating updated_at Columns
CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Tenants Table (Multi-Tenancy & Global Settings)
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    custom_domain VARCHAR(255) UNIQUE,
    brand_logo_url TEXT,
    primary_color VARCHAR(7) DEFAULT '#6366F1' NOT NULL,
    currency_code VARCHAR(3) DEFAULT 'USD' NOT NULL,
    currency_symbol VARCHAR(5) DEFAULT '$' NOT NULL,
    timezone VARCHAR(50) DEFAULT 'UTC' NOT NULL,
    default_platform_commission_bps INTEGER DEFAULT 1500 NOT NULL CHECK (default_platform_commission_bps BETWEEN 0 AND 10000), -- 15.00%
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    installer_completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);
CREATE INDEX IF NOT EXISTS idx_tenants_custom_domain ON tenants(custom_domain) WHERE custom_domain IS NOT NULL;

CREATE TRIGGER trg_tenants_updated_at
BEFORE UPDATE ON tenants
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();

-- 4. Users Table (Core Identity across Admin, Staff, Tech, Customer)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'STAFF', 'TECHNICIAN', 'CUSTOMER')),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    failed_login_attempts INTEGER DEFAULT 0 NOT NULL,
    locked_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT uq_tenant_user_email UNIQUE (tenant_id, email)
);

CREATE INDEX IF NOT EXISTS idx_users_tenant_role ON users(tenant_id, role);
CREATE INDEX IF NOT EXISTS idx_users_tenant_email ON users(tenant_id, email);

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();

-- 5. User Sessions (Refresh Tokens & Device Metadata)
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    refresh_token_hash VARCHAR(255) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_lookup 
ON user_sessions(user_id, expires_at) 
WHERE revoked_at IS NULL;

-- 6. User MFA Credentials (RFC 6238 TOTP)
CREATE TABLE IF NOT EXISTS user_mfa_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    totp_secret_encrypted TEXT NOT NULL,
    is_enabled BOOLEAN DEFAULT FALSE NOT NULL,
    backup_codes_hashed JSONB DEFAULT '[]'::jsonb NOT NULL,
    confirmed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. Permissions Registry
CREATE TABLE IF NOT EXISTS permissions (
    id VARCHAR(100) PRIMARY KEY,
    domain VARCHAR(50) NOT NULL,
    description TEXT NOT NULL
);

-- 8. Role Permissions Mapping
CREATE TABLE IF NOT EXISTS role_permissions (
    role VARCHAR(20) NOT NULL,
    permission_id VARCHAR(100) NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role, permission_id)
);

-- Seed Standard Granular RBAC Permissions
INSERT INTO permissions (id, domain, description) VALUES
    ('booking:create:on_demand', 'bookings', 'Create on-demand booking request'),
    ('booking:view:all', 'bookings', 'View all tenant bookings'),
    ('booking:view:assigned', 'bookings', 'View bookings assigned to technician'),
    ('booking:view:own', 'bookings', 'View customer personal bookings'),
    ('booking:reschedule', 'bookings', 'Reschedule booking appointment slot'),
    ('booking:cancel', 'bookings', 'Cancel a booking with policy evaluation'),
    ('dispatch:radar:view', 'dispatch', 'View live PostGIS spatial radar and active fleet'),
    ('dispatch:offer:accept', 'dispatch', 'Accept 60-second broadcast offer'),
    ('dispatch:reassign:manual', 'dispatch', 'Manually override or reassign dispatch order'),
    ('work_order:verify_pin', 'work_order', 'Verify customer 4-digit arrival safety PIN'),
    ('work_order:submit_proof', 'work_order', 'Upload dual before/after repair photos'),
    ('work_order:complete', 'work_order', 'Sign-off work order and release escrow'),
    ('finance:dashboard:view', 'finance', 'View financial KPI overview and ledger balances'),
    ('finance:payout:execute', 'finance', 'Trigger Stripe Express batch technician payouts'),
    ('finance:refund:adjudicate', 'finance', 'Arbitrate dispute and issue customer refund'),
    ('crm:customers:manage', 'crm', 'Manage customer profiles and courtesy credits'),
    ('crm:technicians:manage', 'crm', 'Manage technician roster, licenses and compliance'),
    ('crm:staff:manage', 'crm', 'Manage staff dispatchers and assigned shifts'),
    ('system:installer:configure', 'system', 'Execute initial turnkey setup wizard'),
    ('system:settings:update', 'system', 'Update tenant branding, CMS and integrations')
ON CONFLICT (id) DO NOTHING;

-- Seed Default Role-Permission Assignments
INSERT INTO role_permissions (role, permission_id) VALUES
    -- Admin: Full Access
    ('ADMIN', 'booking:view:all'),
    ('ADMIN', 'booking:reschedule'),
    ('ADMIN', 'booking:cancel'),
    ('ADMIN', 'dispatch:radar:view'),
    ('ADMIN', 'dispatch:reassign:manual'),
    ('ADMIN', 'finance:dashboard:view'),
    ('ADMIN', 'finance:payout:execute'),
    ('ADMIN', 'finance:refund:adjudicate'),
    ('ADMIN', 'crm:customers:manage'),
    ('ADMIN', 'crm:technicians:manage'),
    ('ADMIN', 'crm:staff:manage'),
    ('ADMIN', 'system:installer:configure'),
    ('ADMIN', 'system:settings:update'),
    -- Staff: Dispatch Operations
    ('STAFF', 'booking:create:on_demand'),
    ('STAFF', 'booking:view:all'),
    ('STAFF', 'booking:reschedule'),
    ('STAFF', 'booking:cancel'),
    ('STAFF', 'dispatch:radar:view'),
    ('STAFF', 'dispatch:reassign:manual'),
    ('STAFF', 'crm:customers:manage'),
    ('STAFF', 'crm:technicians:manage'),
    -- Technician: Field Work Orders
    ('TECHNICIAN', 'booking:view:assigned'),
    ('TECHNICIAN', 'dispatch:offer:accept'),
    ('TECHNICIAN', 'work_order:verify_pin'),
    ('TECHNICIAN', 'work_order:submit_proof'),
    ('TECHNICIAN', 'work_order:complete'),
    -- Customer: Self-Service
    ('CUSTOMER', 'booking:create:on_demand'),
    ('CUSTOMER', 'booking:view:own'),
    ('CUSTOMER', 'booking:cancel'),
    ('CUSTOMER', 'work_order:complete')
ON CONFLICT DO NOTHING;
