-- ==============================================================================
-- Migration: 003_services_and_catalog.sql
-- Description: Service Categories, Catalog Products & Pricing Tiers
-- Target: PostgreSQL 16 + PostGIS
-- ==============================================================================

-- 1. Service Categories
CREATE TABLE IF NOT EXISTS service_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    icon_name VARCHAR(50) DEFAULT 'wrench' NOT NULL,
    banner_url TEXT,
    display_order INTEGER DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT uq_tenant_category_slug UNIQUE (tenant_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_service_categories_lookup 
ON service_categories(tenant_id, is_active, display_order);

CREATE TRIGGER trg_service_categories_updated_at
BEFORE UPDATE ON service_categories
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

-- 2. Services Catalog
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES service_categories(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    base_price_cents BIGINT NOT NULL CHECK (base_price_cents >= 0),
    estimated_duration_minutes INTEGER DEFAULT 60 NOT NULL CHECK (estimated_duration_minutes > 0),
    is_popular BOOLEAN DEFAULT FALSE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT uq_tenant_service_slug UNIQUE (tenant_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_services_tenant_category 
ON services(tenant_id, category_id, is_active);

CREATE INDEX IF NOT EXISTS idx_services_popular 
ON services(tenant_id, is_popular) WHERE is_active = TRUE;

CREATE TRIGGER trg_services_updated_at
BEFORE UPDATE ON services
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

-- 3. Service Pricing Tiers (e.g. Basic Inspection, Standard Repair, Pro Overhaul)
CREATE TABLE IF NOT EXISTS service_pricing_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    tier_name VARCHAR(100) NOT NULL,
    multiplier NUMERIC(4, 2) DEFAULT 1.00 NOT NULL CHECK (multiplier > 0),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_service_pricing_tiers_service 
ON service_pricing_tiers(service_id);
