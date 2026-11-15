// ============================================================================
// ServicePro OS — Supabase Edge Function: stripe-payment-intent
// Creates a Stripe PaymentIntent with Escrow Hold (capture_method: 'manual')
// and 15% Platform Take Rate / 85% Stripe Connect Provider Transfer.
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
    const jwt = authHeader.replace('Bearer ', '');
    const { data: userData, error: authError } = await supabaseAdmin.auth.getUser(jwt);
    if (authError || !userData?.user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized JWT session.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const bookingId = String(body.bookingId || '');
    const amountCents = Math.round(Number(body.amountCents || 0));
    const currency = String(body.currency || 'usd').toLowerCase();
    const providerConnectAccountId = body.providerConnectAccountId ? String(body.providerConnectAccountId) : null;

    if (!bookingId || amountCents < 100) {
      return new Response(
        JSON.stringify({ success: false, error: 'Valid bookingId and amountCents (>= 100) are required.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 15% Platform Take Rate
    const platformFeeCents = Math.round(amountCents * 0.15);

    const form = new URLSearchParams();
    form.set('amount', String(amountCents));
    form.set('currency', currency);
    form.set('capture_method', 'manual');
    form.set('metadata[booking_id]', bookingId);
    form.set('metadata[customer_id]', userData.user.id);

    if (providerConnectAccountId && providerConnectAccountId.startsWith('acct_')) {
      form.set('application_fee_amount', String(platformFeeCents));
      form.set('transfer_data[destination]', providerConnectAccountId);
    }

    const stripeRes = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
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

    // Record payment row and link payment_intent_id to booking
    const { data: bookingRow } = await supabaseAdmin
      .from('bookings')
      .select('tenant_id, customer_id, provider_id')
      .eq('id', bookingId)
      .maybeSingle();

    if (bookingRow?.tenant_id) {
      await supabaseAdmin.from('payments').insert({
        tenant_id: bookingRow.tenant_id,
        booking_id: bookingId,
        customer_id: bookingRow.customer_id || userData.user.id,
        provider_id: bookingRow.provider_id || null,
        amount_cents: amountCents,
        currency: currency.toUpperCase(),
        status: 'AUTHORIZED',
        gateway: 'STRIPE',
        gateway_payment_intent_id: stripeJson.id,
        fee_amount_cents: platformFeeCents,
      });

      await supabaseAdmin
        .from('bookings')
        .update({
          payment_intent_id: stripeJson.id,
          escrow_status: 'HELD_IN_ESCROW',
        })
        .eq('id', bookingId);
    }

    return new Response(
      JSON.stringify({
        success: true,
        paymentIntentId: stripeJson.id,
        clientSecret: stripeJson.client_secret,
        status: stripeJson.status,
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
