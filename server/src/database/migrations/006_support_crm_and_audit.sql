-- ==============================================================================
-- Migration: 006_support_crm_and_audit.sql
-- Description: Support Desk, Reviews, CMS, Notification Logs, Audit Trails & Installer Locks
-- Target: PostgreSQL 16 + PostGIS
-- ==============================================================================

-- 1. Support Tickets
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    ticket_number VARCHAR(50) NOT NULL,
    customer_id UUID NOT NULL REFERENCES customer_profiles(user_id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    assigned_staff_id UUID REFERENCES staff_profiles(user_id) ON DELETE SET NULL,
    subject VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'General Support' NOT NULL,
    priority VARCHAR(20) DEFAULT 'NORMAL' NOT NULL CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT')),
    status VARCHAR(20) DEFAULT 'OPEN' NOT NULL CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT uq_tenant_ticket_number UNIQUE (tenant_id, ticket_number)
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_tenant_status 
ON support_tickets(tenant_id, status, priority);

CREATE TRIGGER trg_support_tickets_updated_at
BEFORE UPDATE ON support_tickets
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

-- 2. Ticket Messages (Thread Conversations)
CREATE TABLE IF NOT EXISTS ticket_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    message_body TEXT NOT NULL,
    attachments_urls JSONB DEFAULT '[]'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket 
ON ticket_messages(ticket_id, created_at ASC);

-- 3. Customer Reviews & Ratings
CREATE TABLE IF NOT EXISTS customer_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE RESTRICT,
    customer_id UUID NOT NULL REFERENCES customer_profiles(user_id) ON DELETE RESTRICT,
    provider_id UUID NOT NULL REFERENCES provider_profiles(user_id) ON DELETE RESTRICT,
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    is_public BOOLEAN DEFAULT TRUE NOT NULL,
    moderation_flagged BOOLEAN DEFAULT FALSE NOT NULL,
    provider_response TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_customer_reviews_provider 
ON customer_reviews(provider_id, is_public, rating);

-- 4. Notification Logs (AWS SES Email & Twilio SMS Delivery Tracking)
CREATE TABLE IF NOT EXISTS notification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    recipient_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    channel VARCHAR(20) NOT NULL CHECK (channel IN ('EMAIL', 'SMS', 'PUSH')),
    template_type VARCHAR(100) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' NOT NULL CHECK (status IN ('PENDING', 'SENT', 'DELIVERED', 'FAILED')),
    provider_response_id VARCHAR(150),
    error_message TEXT,
    retry_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notification_logs_lookup 
ON notification_logs(tenant_id, channel, status);

-- 5. Immutable Security Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    actor_role VARCHAR(20),
    action VARCHAR(100) NOT NULL, -- e.g. 'PAYOUT_INITIATED', 'BOOKING_REASSIGNED', 'SETTINGS_UPDATED'
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(150),
    ip_address INET,
    diff_payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_action 
ON audit_logs(tenant_id, action, created_at DESC);

-- 6. Tenant CMS & Dynamic White-Label Branding Settings
CREATE TABLE IF NOT EXISTS tenant_cms_configs (
    tenant_id UUID PRIMARY KEY REFERENCES tenants(id) ON DELETE CASCADE,
    hero_heading VARCHAR(255) DEFAULT 'Your Service, Our Priority' NOT NULL,
    hero_subheading TEXT DEFAULT 'Book top-rated verified home service professionals on demand with upfront pricing and escrow guarantee.' NOT NULL,
    search_placeholder VARCHAR(255) DEFAULT 'Search 340+ certified home services...' NOT NULL,
    promo_coupon_code VARCHAR(50),
    promo_discount_percent INTEGER CHECK (promo_discount_percent BETWEEN 0 AND 100),
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER trg_tenant_cms_configs_updated_at
BEFORE UPDATE ON tenant_cms_configs
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

-- 7. Integration Credentials References (Metadata only — Secrets stored in server environment)
CREATE TABLE IF NOT EXISTS integration_configs (
    tenant_id UUID PRIMARY KEY REFERENCES tenants(id) ON DELETE CASCADE,
    stripe_account_id VARCHAR(100),
    stripe_live_mode BOOLEAN DEFAULT FALSE NOT NULL,
    twilio_enabled BOOLEAN DEFAULT FALSE NOT NULL,
    aws_ses_enabled BOOLEAN DEFAULT FALSE NOT NULL,
    fcm_push_enabled BOOLEAN DEFAULT FALSE NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. Turnkey Setup & Installer Provisioning Logs (Permanent Tamper Lock)
CREATE TABLE IF NOT EXISTS installer_provision_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    provisioned_admin_email VARCHAR(255) NOT NULL,
    client_ip INET,
    environment_signature VARCHAR(255),
    completed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
