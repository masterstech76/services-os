-- ==============================================================================
-- Migration: 002_profiles_and_entities.sql
-- Description: Entity Profile Extensions, Spatial Telemetry & Addresses
-- Target: PostgreSQL 16 + PostGIS
-- ==============================================================================

-- 1. Admin Profiles
CREATE TABLE IF NOT EXISTS admin_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    emergency_contact_phone VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER trg_admin_profiles_updated_at
BEFORE UPDATE ON admin_profiles
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

-- 2. Staff Profiles (Dispatchers & Operations)
CREATE TABLE IF NOT EXISTS staff_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    department VARCHAR(100) DEFAULT 'Dispatch Operations' NOT NULL,
    shift_hours VARCHAR(100) DEFAULT '08:00 - 17:00 UTC' NOT NULL,
    assigned_territory VARCHAR(100) DEFAULT 'Metro Region' NOT NULL,
    active_queue_capacity INTEGER DEFAULT 10 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER trg_staff_profiles_updated_at
BEFORE UPDATE ON staff_profiles
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

-- 3. Customer Profiles
CREATE TABLE IF NOT EXISTS customer_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    default_address_text TEXT,
    stripe_customer_id VARCHAR(100),
    courtesy_credit_cents BIGINT DEFAULT 0 NOT NULL CHECK (courtesy_credit_cents >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER trg_customer_profiles_updated_at
BEFORE UPDATE ON customer_profiles
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

-- 4. Provider Profiles (Field Service Technicians)
CREATE TABLE IF NOT EXISTS provider_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    trade_category VARCHAR(100) NOT NULL,
    license_number VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    verified_at TIMESTAMPTZ,
    stripe_connect_account_id VARCHAR(100),
    stripe_payouts_enabled BOOLEAN DEFAULT FALSE NOT NULL,
    vehicle_make_model VARCHAR(150),
    vehicle_license_plate VARCHAR(50),
    hourly_rate_cents BIGINT DEFAULT 0 NOT NULL CHECK (hourly_rate_cents >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_provider_profiles_verified 
ON provider_profiles(tenant_id, is_verified, trade_category);

CREATE TRIGGER trg_provider_profiles_updated_at
BEFORE UPDATE ON provider_profiles
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

-- 5. Provider Real-Time Spatial Locations
CREATE TABLE IF NOT EXISTS provider_locations (
    provider_id UUID PRIMARY KEY REFERENCES provider_profiles(user_id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    location GEOGRAPHY(Point, 4326) NOT NULL,
    duty_status VARCHAR(20) DEFAULT 'OFFLINE' NOT NULL CHECK (duty_status IN ('ONLINE', 'OFFLINE', 'ON_JOB', 'EN_ROUTE')),
    heading_degrees NUMERIC(5, 2),
    last_ping_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- PostGIS Spatial Index for 15-Mile Radar Search
CREATE INDEX IF NOT EXISTS idx_provider_locations_gist 
ON provider_locations USING GIST (location) 
WHERE duty_status IN ('ONLINE', 'EN_ROUTE');

CREATE INDEX IF NOT EXISTS idx_provider_locations_status 
ON provider_locations(tenant_id, duty_status);

-- 6. Provider Working Shifts
CREATE TABLE IF NOT EXISTS provider_shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES provider_profiles(user_id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_provider_shifts_lookup 
ON provider_shifts(provider_id, day_of_week, is_active);

-- 7. Customer Addresses with PostGIS Spatial Coordinates
CREATE TABLE IF NOT EXISTS customer_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customer_profiles(user_id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city VARCHAR(100) NOT NULL,
    state_province VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    location GEOGRAPHY(Point, 4326) NOT NULL,
    access_instructions TEXT,
    is_default BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_customer_addresses_gist 
ON customer_addresses USING GIST (location);

CREATE INDEX IF NOT EXISTS idx_customer_addresses_customer 
ON customer_addresses(customer_id, is_default);

CREATE TRIGGER trg_customer_addresses_updated_at
BEFORE UPDATE ON customer_addresses
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();
