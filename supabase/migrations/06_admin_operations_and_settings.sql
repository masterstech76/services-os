-- ============================================================================
-- ServicePro OS — Phase 6 Admin Operations, Support, Refunds & Settings Tables
-- ============================================================================

-- 1. Support Tickets
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    assigned_staff_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    subject TEXT NOT NULL,
    description TEXT,
    priority TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
    messages JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Refund & Dispute Cases
CREATE TABLE IF NOT EXISTS public.refund_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    amount_cents BIGINT NOT NULL CHECK (amount_cents >= 0),
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'PROCESSED')),
    resolved_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Dynamic Pricing Rules
CREATE TABLE IF NOT EXISTS public.pricing_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    rule_name TEXT NOT NULL,
    rule_type TEXT NOT NULL DEFAULT 'SURGE' CHECK (rule_type IN ('SURGE', 'DISCOUNT', 'DIAGNOSTIC', 'COMMISSION', 'TAX')),
    multiplier NUMERIC(6,4) DEFAULT 1.0000,
    flat_cents BIGINT DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    config JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Platform & Payment/Notification Settings (1 row per tenant)
CREATE TABLE IF NOT EXISTS public.platform_settings (
    tenant_id UUID PRIMARY KEY REFERENCES public.tenants(id) ON DELETE CASCADE,
    business_name TEXT,
    support_email TEXT,
    support_phone TEXT,
    currency TEXT NOT NULL DEFAULT 'USD',
    timezone TEXT NOT NULL DEFAULT 'UTC',
    tax_rate_percent NUMERIC(5,2) NOT NULL DEFAULT 8.00,
    platform_fee_percent NUMERIC(5,2) NOT NULL DEFAULT 15.00,
    notifications_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    payment_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Website & CMS Content (1 row per tenant)
CREATE TABLE IF NOT EXISTS public.website_content (
    tenant_id UUID PRIMARY KEY REFERENCES public.tenants(id) ON DELETE CASCADE,
    hero_title TEXT,
    hero_subtitle TEXT,
    about_text TEXT,
    faq_items JSONB NOT NULL DEFAULT '[]'::jsonb,
    seo_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable & Force Row-Level Security on all 5 new tables
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets FORCE ROW LEVEL SECURITY;

ALTER TABLE public.refund_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refund_cases FORCE ROW LEVEL SECURITY;

ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_rules FORCE ROW LEVEL SECURITY;

ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings FORCE ROW LEVEL SECURITY;

ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_content FORCE ROW LEVEL SECURITY;

-- Tenant-scoped policies
DROP POLICY IF EXISTS "Tenant staff and admins manage support tickets" ON public.support_tickets;
CREATE POLICY "Tenant staff and admins manage support tickets" ON public.support_tickets
    FOR ALL TO authenticated
    USING (public.is_active_user() AND tenant_id = public.current_tenant_id() AND (public.is_admin() OR public.is_staff() OR customer_id = public.current_auth_uid()))
    WITH CHECK (public.is_active_user() AND tenant_id = public.current_tenant_id() AND (public.is_admin() OR public.is_staff() OR customer_id = public.current_auth_uid()));

DROP POLICY IF EXISTS "Admins and staff manage refund cases" ON public.refund_cases;
CREATE POLICY "Admins and staff manage refund cases" ON public.refund_cases
    FOR ALL TO authenticated
    USING (public.is_active_user() AND tenant_id = public.current_tenant_id() AND (public.is_admin() OR public.is_staff()))
    WITH CHECK (public.is_active_user() AND tenant_id = public.current_tenant_id() AND (public.is_admin() OR public.is_staff()));

DROP POLICY IF EXISTS "Admins manage pricing rules" ON public.pricing_rules;
CREATE POLICY "Admins manage pricing rules" ON public.pricing_rules
    FOR ALL TO authenticated
    USING (public.is_active_user() AND tenant_id = public.current_tenant_id() AND public.is_admin())
    WITH CHECK (public.is_active_user() AND tenant_id = public.current_tenant_id() AND public.is_admin());

DROP POLICY IF EXISTS "Admins manage platform settings" ON public.platform_settings;
CREATE POLICY "Admins manage platform settings" ON public.platform_settings
    FOR ALL TO authenticated
    USING (public.is_active_user() AND tenant_id = public.current_tenant_id() AND public.is_admin())
    WITH CHECK (public.is_active_user() AND tenant_id = public.current_tenant_id() AND public.is_admin());

DROP POLICY IF EXISTS "Admins manage website content" ON public.website_content;
CREATE POLICY "Admins manage website content" ON public.website_content
    FOR ALL TO authenticated
    USING (public.is_active_user() AND tenant_id = public.current_tenant_id() AND public.is_admin())
    WITH CHECK (public.is_active_user() AND tenant_id = public.current_tenant_id() AND public.is_admin());
