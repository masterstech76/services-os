// ============================================================================
// ServicePro OS — Supabase Edge Function: stripe-payment-intent
// Server-authoritative PaymentIntent creation with Escrow Hold
// (capture_method: 'manual'), database-verified totals, Connect lookup,
// caller ownership check, and Stripe Idempotency-Key.
// ============================================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!stripeSecretKey || stripeSecretKey.includes('your_stripe_secret_key')) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'STRIPE_SECRET_KEY is not configured in Supabase Edge Function secrets.',
        }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing Authorization header or Supabase environment.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const jwt = authHeader.replace('Bearer ', '').trim();
    const { data: userData, error: authError } = await supabaseAdmin.auth.getUser(jwt);
    if (authError || !userData?.user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized JWT session.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: callerUser } = await supabaseAdmin
      .from('users')
      .select('id, role, tenant_id, is_active')
      .eq('id', userData.user.id)
      .maybeSingle();

    if (!callerUser || callerUser.is_active !== true) {
      return new Response(
        JSON.stringify({ success: false, error: 'Account is inactive or not registered.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const bookingId = String(body.bookingId || '').trim();
    const currency = String(body.currency || 'usd').toLowerCase();

    if (!bookingId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Valid bookingId is required.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 1. Fetch authoritative booking record BEFORE contacting Stripe (ignore client amountCents / connectId)
    const { data: bookingRow, error: bookingErr } = await supabaseAdmin
      .from('bookings')
      .select(
        'id, tenant_id, customer_id, provider_id, is_emergency, labor_cost_cents, diagnostic_fee_cents, parts_total_cents, tax_amount_cents, total_authorized_cents, platform_fee_cents'
      )
      .eq('id', bookingId)
      .maybeSingle();

    if (bookingErr || !bookingRow) {
      return new Response(
        JSON.stringify({ success: false, error: 'Booking not found.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const isOwner = bookingRow.customer_id === callerUser.id;
    const isTenantAdmin = callerUser.role === 'ADMIN' && callerUser.tenant_id === bookingRow.tenant_id;
    if (!isOwner && !isTenantAdmin) {
      return new Response(
        JSON.stringify({ success: false, error: 'Forbidden: caller does not own this booking.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Compute authoritative financials via PostgreSQL calculate_booking_financials RPC
    const { data: finRows, error: finErr } = await supabaseAdmin.rpc('calculate_booking_financials', {
      p_labor_cents: Number(bookingRow.labor_cost_cents || 0),
      p_parts_cents: Number(bookingRow.parts_total_cents || 0),
      p_is_emergency: Boolean(bookingRow.is_emergency),
      p_tax_rate_basis_points: 700,
    });

    const fin = Array.isArray(finRows) ? finRows[0] : finRows;
    const serverAmountCents = Number(fin?.total_authorized_cents ?? bookingRow.total_authorized_cents ?? 0);
    const serverPlatformFeeCents = Number(fin?.platform_take_cents ?? bookingRow.platform_fee_cents ?? 0);

    if (finErr || serverAmountCents < 100) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid server-calculated booking total (< 100 cents).' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Look up verified Stripe Connect destination exclusively from provider_profiles
    let providerConnectAccountId: string | null = null;
    if (bookingRow.provider_id) {
      const { data: providerProfile } = await supabaseAdmin
        .from('provider_profiles')
        .select('stripe_connect_id')
        .eq('user_id', bookingRow.provider_id)
        .maybeSingle();
      if (providerProfile?.stripe_connect_id && String(providerProfile.stripe_connect_id).startsWith('acct_')) {
        providerConnectAccountId = String(providerProfile.stripe_connect_id);
      }
    }

    const form = new URLSearchParams();
    form.set('amount', String(serverAmountCents));
    form.set('currency', currency);
    form.set('capture_method', 'manual');
    form.set('metadata[booking_id]', bookingId);
    form.set('metadata[customer_id]', bookingRow.customer_id);
    form.set('metadata[tenant_id]', bookingRow.tenant_id);

    if (providerConnectAccountId) {
      form.set('application_fee_amount', String(serverPlatformFeeCents));
      form.set('transfer_data[destination]', providerConnectAccountId);
    }

    const stripeRes = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Idempotency-Key': `pi_booking_${bookingId}_${serverAmountCents}`,
      },
      body: form.toString(),
    });

    const stripeJson = await stripeRes.json();
    if (!stripeRes.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          error: stripeJson?.error?.message || 'Stripe PaymentIntent creation failed.',
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    await supabaseAdmin.from('payments').insert({
      tenant_id: bookingRow.tenant_id,
      booking_id: bookingId,
      customer_id: bookingRow.customer_id,
      provider_id: bookingRow.provider_id || null,
      amount_cents: serverAmountCents,
      currency: currency.toUpperCase(),
      status: 'AUTHORIZED',
      gateway: 'STRIPE',
      gateway_payment_intent_id: stripeJson.id,
      fee_amount_cents: serverPlatformFeeCents,
    });

    await supabaseAdmin
      .from('bookings')
      .update({
        payment_intent_id: stripeJson.id,
        escrow_status: 'HELD_IN_ESCROW',
      })
      .eq('id', bookingId);

    return new Response(
      JSON.stringify({
        success: true,
        paymentIntentId: stripeJson.id,
        clientSecret: stripeJson.client_secret,
        status: stripeJson.status,
        authorizedAmountCents: serverAmountCents,
        platformFeeCents: serverPlatformFeeCents,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unexpected server error';
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
