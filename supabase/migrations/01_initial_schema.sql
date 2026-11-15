-- =====================================================================
-- ServiceOS — Cloud Supabase Database Schema (PostgreSQL 16 + PostGIS)
-- Turnkey Commercial Grade: $20,000 – $50,000 Software Acquisition
-- =====================================================================

-- Enable Essential Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean Slate (Optional)
-- DROP SCHEMA public CASCADE; CREATE SCHEMA public;

-- =====================================================================
-- 1. Tenants (Multi-Tenant Franchise Organizations)
-- =====================================================================
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(64) UNIQUE NOT NULL,
    business_name VARCHAR(128) NOT NULL,
    brand_logo_url TEXT,
    support_phone VARCHAR(32) DEFAULT '',
    support_email VARCHAR(128) DEFAULT '',
    default_currency VARCHAR(8) DEFAULT 'USD',
    platform_take_rate_basis_points INT DEFAULT 1500, -- 15.00%
    day_vision_primary VARCHAR(16) DEFAULT '#6366F1',
    day_vision_accent VARCHAR(16) DEFAULT '#7C3AED',
    night_vision_bg VARCHAR(16) DEFAULT '#060B14',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- 2. Users (Strictly 2 Mobile Personas: Customer & Tech + Web Admin)
-- =====================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    phone VARCHAR(32) UNIQUE NOT NULL,
    email VARCHAR(128) UNIQUE,
    first_name VARCHAR(64) NOT NULL,
    last_name VARCHAR(64) NOT NULL,
    role VARCHAR(32) NOT NULL CHECK (role IN ('CUSTOMER', 'TECHNICIAN', 'ADMIN')),
    avatar_url TEXT,
    is_phone_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    fcm_push_token TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_tenant_role ON users(tenant_id, role);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

-- =====================================================================
-- 3. Customer Profiles (Saved Addresses & Payment Preferences)
-- =====================================================================
CREATE TABLE IF NOT EXISTS customer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tier VARCHAR(32) DEFAULT 'PLATINUM VIP',
    total_bookings INT DEFAULT 0,
    lifetime_spend_cents BIGINT DEFAULT 0,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    stripe_customer_id VARCHAR(64),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customer_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(64) DEFAULT 'Home',
    street_line1 TEXT NOT NULL,
    street_line2 TEXT,
    city VARCHAR(64) NOT NULL,
    state VARCHAR(32) NOT NULL,
    postal_code VARCHAR(16) NOT NULL,
    country VARCHAR(8) DEFAULT 'US',
    location GEOGRAPHY(Point, 4326) NOT NULL,
    access_notes TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cust_addr_location ON customer_addresses USING GIST(location);

-- =====================================================================
-- 4. Technician Profiles (Credentials, Vehicles & Radar Telemetry)
-- =====================================================================
CREATE TABLE IF NOT EXISTS provider_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    trade_license_number VARCHAR(64) NOT NULL,
    trade_category VARCHAR(64) NOT NULL,
    insurance_policy_number VARCHAR(64),
    insurance_carrier VARCHAR(128) DEFAULT 'Travelers Commercial ($1,000,000)',
    insurance_expires_at DATE,
    background_check_status VARCHAR(32) DEFAULT 'CLEARED' CHECK (background_check_status IN ('PENDING', 'CLEARED', 'REJECTED')),
    vehicle_make_model VARCHAR(64) DEFAULT 'Ford Transit 250',
    vehicle_plate VARCHAR(32) DEFAULT '84B-FLX',
    is_verified BOOLEAN DEFAULT FALSE,
    is_online BOOLEAN DEFAULT FALSE,
    hourly_rate_cents BIGINT DEFAULT 9500, -- $95.00/hr
    emergency_surge_rate_cents BIGINT DEFAULT 14500, -- $145.00/hr
    service_radius_meters INT DEFAULT 40000, -- 40 km / ~25 miles
    current_location GEOGRAPHY(Point, 4326),
    last_ping_at TIMESTAMPTZ,
    average_rating NUMERIC(3, 2) DEFAULT 4.95,
    reviews_count INT DEFAULT 0,
    completed_jobs_count INT DEFAULT 0,
    stripe_connect_account_id VARCHAR(64),
    is_payout_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_provider_location ON provider_profiles USING GIST(current_location);
CREATE INDEX IF NOT EXISTS idx_provider_online_trade ON provider_profiles(is_online, trade_category);

-- =====================================================================
-- 5. Categories (17 Master Categories)
-- =====================================================================
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    slug VARCHAR(64) NOT NULL,
    title VARCHAR(128) NOT NULL,
    short_title VARCHAR(64),
    priority_rank INT NOT NULL DEFAULT 1,
    icon_name VARCHAR(64) NOT NULL,
    image_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_categories_rank ON categories(priority_rank);

-- =====================================================================
-- 6. Services (340 Granular Services)
-- =====================================================================
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    base_price_cents BIGINT NOT NULL,
    estimated_duration_minutes INT NOT NULL DEFAULT 60,
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_category ON services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_name ON services(name);

-- =====================================================================
-- 7. Bookings (Master Lifecycle Entity)
-- =====================================================================
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    booking_reference VARCHAR(16) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES users(id),
    provider_id UUID REFERENCES users(id),
    service_id UUID NOT NULL REFERENCES services(id),
    status VARCHAR(32) NOT NULL DEFAULT 'REQUESTED' CHECK (status IN (
        'REQUESTED',
        'BROADCASTING',
        'ASSIGNED',
        'EN_ROUTE',
        'ARRIVED',
        'IN_PROGRESS',
        'COMPLETED',
        'CANCELLED',
        'DISPUTED'
    )),
    is_emergency BOOLEAN DEFAULT FALSE,
    emergency_surcharge_cents BIGINT DEFAULT 0,
    service_location GEOGRAPHY(Point, 4326) NOT NULL,
    address_text TEXT NOT NULL,
    access_notes TEXT,
    problem_description TEXT,
    scheduled_start TIMESTAMPTZ NOT NULL,
    actual_arrival_at TIMESTAMPTZ,
    work_started_at TIMESTAMPTZ,
    work_completed_at TIMESTAMPTZ,
    labor_cost_cents BIGINT NOT NULL,
    diagnostic_fee_cents BIGINT DEFAULT 2000, -- $20.00
    parts_total_cents BIGINT DEFAULT 0,
    tax_amount_cents BIGINT DEFAULT 0,
    platform_fee_cents BIGINT NOT NULL, -- 15% Take Rate
    net_payout_cents BIGINT NOT NULL, -- 85% Provider Net
    total_authorized_cents BIGINT NOT NULL,
    escrow_status VARCHAR(32) DEFAULT 'HELD_IN_ESCROW' CHECK (escrow_status IN (
        'HELD_IN_ESCROW',
        'RELEASED_TO_PROVIDER',
        'REFUNDED_TO_CUSTOMER',
        'FROZEN_FOR_DISPUTE'
    )),
    safety_pin VARCHAR(6) NOT NULL,
    payment_intent_id VARCHAR(64),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_tenant_status ON bookings(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_location ON bookings USING GIST(service_location);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_provider ON bookings(provider_id);

-- =====================================================================
-- 8. Payments & Financial Transactions (Stripe / Escrow / Payouts)
-- =====================================================================
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    customer_id UUID NOT NULL REFERENCES users(id),
    provider_id UUID REFERENCES users(id),
    amount_cents BIGINT NOT NULL,
    currency VARCHAR(8) NOT NULL DEFAULT 'USD',
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING' CHECK (status IN (
        'PENDING',
        'AUTHORIZED',
        'HELD_IN_ESCROW',
        'CAPTURED',
        'RELEASED_TO_PROVIDER',
        'REFUNDED',
        'FAILED',
        'DISPUTED'
    )),
    gateway VARCHAR(32) NOT NULL DEFAULT 'STRIPE',
    gateway_payment_intent_id VARCHAR(128),
    gateway_charge_id VARCHAR(128),
    receipt_url TEXT,
    refund_amount_cents BIGINT DEFAULT 0,
    fee_amount_cents BIGINT DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_customer ON payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- =====================================================================
-- 9. Job Evidence (Mandatory Before / After Photos & Signature)
-- =====================================================================
CREATE TABLE IF NOT EXISTS job_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    evidence_type VARCHAR(16) NOT NULL CHECK (evidence_type IN ('BEFORE', 'AFTER', 'PARTS', 'SIGNATURE')),
    media_url TEXT NOT NULL,
    captured_by_user_id UUID NOT NULL REFERENCES users(id),
    metadata JSONB DEFAULT '{}'::jsonb,
    captured_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_evidence_booking ON job_evidence(booking_id, evidence_type);

-- =====================================================================
-- 9. Parts & Materials Inventory
-- =====================================================================
CREATE TABLE IF NOT EXISTS inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    sku VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    category VARCHAR(64) NOT NULL,
    unit_cost_cents BIGINT NOT NULL,
    retail_price_cents BIGINT NOT NULL,
    stock_quantity INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS booking_parts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    inventory_item_id UUID REFERENCES inventory_items(id),
    part_name VARCHAR(128) NOT NULL,
    quantity INT DEFAULT 1,
    unit_price_cents BIGINT NOT NULL,
    is_approved_by_customer BOOLEAN DEFAULT TRUE,
    approved_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- 10. Reviews & Ratings
-- =====================================================================
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES users(id),
    provider_id UUID NOT NULL REFERENCES users(id),
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    tip_amount_cents BIGINT DEFAULT 0,
    is_verified_purchase BOOLEAN DEFAULT TRUE,
    is_moderated BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_provider ON reviews(provider_id);

-- =====================================================================
-- 11. Security Audit Trail (Immutable Cryptographic Log)
-- =====================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES users(id),
    actor_email VARCHAR(128),
    ip_address INET,
    action VARCHAR(64) NOT NULL,
    entity_type VARCHAR(64) NOT NULL,
    entity_id VARCHAR(64),
    payload JSONB,
    sha256_hash VARCHAR(64),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant ON audit_logs(tenant_id, created_at DESC);
