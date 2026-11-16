-- ==============================================================================
-- Migration: 004_bookings_and_dispatch.sql
-- Description: Bookings, Dispatch Broadcast Engine, Timeline & Proofs
-- Target: PostgreSQL 16 + PostGIS
-- ==============================================================================

-- 1. Bookings State Machine Table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    booking_reference VARCHAR(50) NOT NULL,
    customer_id UUID NOT NULL REFERENCES customer_profiles(user_id) ON DELETE RESTRICT,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
    assigned_provider_id UUID REFERENCES provider_profiles(user_id) ON DELETE SET NULL,
    address_id UUID NOT NULL REFERENCES customer_addresses(id) ON DELETE RESTRICT,
    status VARCHAR(30) NOT NULL DEFAULT 'REQUESTED' CHECK (status IN (
        'REQUESTED', 'BROADCASTING', 'ASSIGNED', 'EN_ROUTE', 'ON_SITE', 'COMPLETED', 'CANCELLED', 'DISPUTED'
    )),
    priority VARCHAR(20) DEFAULT 'STANDARD' NOT NULL CHECK (priority IN ('STANDARD', 'URGENT', 'EMERGENCY')),
    scheduled_start TIMESTAMPTZ NOT NULL,
    scheduled_end TIMESTAMPTZ,
    customer_safety_pin VARCHAR(4) NOT NULL,
    pin_verified_at TIMESTAMPTZ,
    geofence_arrival_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    cancelled_by_user_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT uq_tenant_booking_reference UNIQUE (tenant_id, booking_reference)
);

CREATE INDEX IF NOT EXISTS idx_bookings_tenant_status 
ON bookings(tenant_id, status);

CREATE INDEX IF NOT EXISTS idx_bookings_customer 
ON bookings(customer_id, status);

CREATE INDEX IF NOT EXISTS idx_bookings_provider 
ON bookings(assigned_provider_id, scheduled_start);

CREATE TRIGGER trg_bookings_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

-- 2. Dispatch Broadcasts (60s Timed Offers to Nearby Technicians)
CREATE TABLE IF NOT EXISTS dispatch_broadcasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES provider_profiles(user_id) ON DELETE CASCADE,
    offered_payout_cents BIGINT NOT NULL CHECK (offered_payout_cents >= 0),
    expires_at TIMESTAMPTZ NOT NULL,
    response VARCHAR(20) DEFAULT 'PENDING' NOT NULL CHECK (response IN ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED')),
    responded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT uq_dispatch_offer UNIQUE (booking_id, provider_id)
);

CREATE INDEX IF NOT EXISTS idx_dispatch_broadcasts_active 
ON dispatch_broadcasts(provider_id, response, expires_at);

-- 3. Booking Timeline Events (Immutable Audit Log for Every State Transition)
CREATE TABLE IF NOT EXISTS booking_timeline_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    from_status VARCHAR(30),
    to_status VARCHAR(30) NOT NULL,
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_title VARCHAR(150) NOT NULL,
    event_details TEXT,
    location_coordinates GEOGRAPHY(Point, 4326),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_booking_timeline_booking 
ON booking_timeline_events(booking_id, created_at ASC);

-- 4. Work Order Proofs (Dual Photos & Digital Signatures)
CREATE TABLE IF NOT EXISTS work_order_proofs (
    booking_id UUID PRIMARY KEY REFERENCES bookings(id) ON DELETE CASCADE,
    before_photos_urls JSONB DEFAULT '[]'::jsonb NOT NULL,
    after_photos_urls JSONB DEFAULT '[]'::jsonb NOT NULL,
    customer_signature_url TEXT,
    work_summary_notes TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
