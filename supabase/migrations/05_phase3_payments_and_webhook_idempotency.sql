-- ============================================================================
-- ServicePro OS — Phase 3 Payments, Webhook Idempotency & Booking Column Guard
-- ============================================================================

-- 1. Stripe Webhook Event Idempotency Table (Prevents replay / duplicate event.id)
CREATE TABLE IF NOT EXISTS public.stripe_webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    payment_intent_id TEXT,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.stripe_webhook_events ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;

ALTER TABLE public.stripe_webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_webhook_events FORCE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.stripe_webhook_events FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE public.stripe_webhook_events TO service_role;
GRANT SELECT ON TABLE public.stripe_webhook_events TO authenticated;

DROP POLICY IF EXISTS "Service role manages stripe webhook events" ON public.stripe_webhook_events;
CREATE POLICY "Service role manages stripe webhook events" ON public.stripe_webhook_events
    FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Admins read stripe webhook events" ON public.stripe_webhook_events;
CREATE POLICY "Admins read stripe webhook events" ON public.stripe_webhook_events
    FOR SELECT TO authenticated
    USING (
        public.is_admin()
        AND tenant_id IS NOT NULL
        AND tenant_id = public.current_tenant_id()
    );

-- 2. Align protect_booking_sensitive_fields() with exact 01_initial_schema.sql columns
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
       OR NEW.labor_cost_cents IS DISTINCT FROM OLD.labor_cost_cents
       OR NEW.diagnostic_fee_cents IS DISTINCT FROM OLD.diagnostic_fee_cents
       OR NEW.parts_total_cents IS DISTINCT FROM OLD.parts_total_cents
       OR NEW.tax_amount_cents IS DISTINCT FROM OLD.tax_amount_cents
       OR NEW.total_authorized_cents IS DISTINCT FROM OLD.total_authorized_cents
       OR NEW.platform_fee_cents IS DISTINCT FROM OLD.platform_fee_cents
       OR NEW.net_payout_cents IS DISTINCT FROM OLD.net_payout_cents THEN
        RAISE EXCEPTION 'FORBIDDEN: Financial, escrow, tenant, and safety_pin columns cannot be modified directly.';
    END IF;

    RETURN NEW;
END;
$$;

-- 3. Server-Side Extra-Parts Approval RPC (replaces direct client UPDATE on parts_total_cents)
CREATE OR REPLACE FUNCTION public.approve_booking_extra_parts(
    p_booking_id UUID,
    p_parts_total_cents INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_booking RECORD;
    v_fin RECORD;
    v_base_cents INTEGER;
BEGIN
    IF NOT public.is_active_user() THEN
        RAISE EXCEPTION 'FORBIDDEN: Active authenticated user required.';
    END IF;

    IF p_parts_total_cents IS NULL OR p_parts_total_cents < 0 OR p_parts_total_cents > 10000000 THEN
        RAISE EXCEPTION 'INVALID_AMOUNT: Parts total must be between 0 and 10000000 cents.';
    END IF;

    SELECT * INTO v_booking
    FROM public.bookings
    WHERE id = p_booking_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'NOT_FOUND: Booking does not exist.';
    END IF;

    IF v_booking.tenant_id IS DISTINCT FROM public.current_tenant_id() THEN
        RAISE EXCEPTION 'FORBIDDEN: Cross-tenant booking access denied.';
    END IF;

    IF v_booking.customer_id IS DISTINCT FROM public.current_auth_uid()
       AND NOT public.is_admin()
       AND NOT public.is_staff() THEN
        RAISE EXCEPTION 'FORBIDDEN: Only the booking customer or tenant admin/staff can approve extra parts.';
    END IF;

    IF v_booking.status IN ('COMPLETED', 'CANCELLED')
       OR v_booking.escrow_status = 'RELEASED_TO_PROVIDER' THEN
        RAISE EXCEPTION 'INVALID_STATE: Cannot modify extra parts on a completed, cancelled, or released booking.';
    END IF;

    v_base_cents := COALESCE(v_booking.labor_cost_cents, 0)
                  + COALESCE(v_booking.diagnostic_fee_cents, 0)
                  + COALESCE(v_booking.emergency_surcharge_cents, 0);

    SELECT * INTO v_fin
    FROM public.calculate_booking_financials(v_base_cents, p_parts_total_cents, 0.08, 0.15);

    PERFORM set_config('servicepro.trusted_rpc', 'true', true);

    UPDATE public.bookings
    SET parts_total_cents = p_parts_total_cents,
        tax_amount_cents = v_fin.tax_cents,
        platform_fee_cents = v_fin.platform_fee_cents,
        net_payout_cents = v_fin.net_payout_cents,
        total_authorized_cents = v_fin.total_authorized_cents,
        updated_at = NOW()
    WHERE id = p_booking_id;

    RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.approve_booking_extra_parts(UUID, INTEGER) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.approve_booking_extra_parts(UUID, INTEGER) TO authenticated, service_role;

-- 4. Independent Per-Migration Schema & Function Probe RPC
CREATE OR REPLACE FUNCTION public.verify_schema_migrations_status()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    IF NOT public.is_active_user() THEN
        RAISE EXCEPTION 'FORBIDDEN: Active authenticated user required.';
    END IF;

    RETURN jsonb_build_object(
        'm1', (to_regclass('public.tenants') IS NOT NULL AND to_regclass('public.bookings') IS NOT NULL),
        'm2', (EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'calculate_booking_financials')
               AND EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'release_escrow_to_technician')),
        'm3', (EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'has_verified_mfa_session')
               AND to_regclass('public.user_mfa_credentials') IS NOT NULL),
        'm4', (EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_protect_booking_sensitive_fields')
               AND EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_active_user')),
        'm5', (to_regclass('public.stripe_webhook_events') IS NOT NULL
               AND EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'approve_booking_extra_parts'))
    );
END;
$$;

REVOKE ALL ON FUNCTION public.verify_schema_migrations_status() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.verify_schema_migrations_status() TO authenticated, service_role;
