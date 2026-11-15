// ============================================================================
// ServicePro OS — Supabase Edge Function: stripe-webhook
// Cryptographically verifies Stripe-Signature (HMAC-SHA256) and synchronizes
// bookings.escrow_status and payments.status in PostgreSQL.
// ============================================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function verifyStripeSignature(rawBody: string, sigHeader: string, secret: string): Promise<boolean> {
  const parts = sigHeader.split(',').reduce<Record<string, string>>((acc, item) => {
    const [k, v] = item.split('=');
    if (k && v) acc[k.trim()] = v.trim();
    return acc;
  }, {});

  const timestamp = parts['t'];
  const signature = parts['v1'];
  if (!timestamp || !signature) return false;

  const nowSec = Math.floor(Date.now() / 1000);
  if (Math.abs(nowSec - Number(timestamp)) > 300) {
    return false; // Reject replay older than 5 minutes
  }

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signedPayload = `${timestamp}.${rawBody}`;
  const macBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(signedPayload));
  const computedHex = Array.from(new Uint8Array(macBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return timingSafeEqualHex(computedHex, signature);
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const signatureHeader = req.headers.get('Stripe-Signature') || '';

  if (!webhookSecret || !supabaseUrl || !supabaseServiceKey) {
    return new Response(JSON.stringify({ error: 'Webhook secret or Supabase env not configured' }), { status: 503 });
  }

  const rawBody = await req.text();
  const isValid = await verifyStripeSignature(rawBody, signatureHeader, webhookSecret);
  if (!isValid) {
    return new Response(JSON.stringify({ error: 'Invalid Stripe-Signature' }), { status: 400 });
  }

  const event = JSON.parse(rawBody);
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  const object = event?.data?.object || {};
  const paymentIntentId = object.payment_intent || object.id;
  const bookingId = object.metadata?.booking_id;

  if (event.type === 'payment_intent.amount_capturable_updated') {
    if (paymentIntentId) {
      await supabaseAdmin
        .from('payments')
        .update({ status: 'HELD_IN_ESCROW', updated_at: new Date().toISOString() })
        .eq('gateway_payment_intent_id', paymentIntentId);
    }
    if (bookingId) {
      await supabaseAdmin
        .from('bookings')
        .update({ escrow_status: 'HELD_IN_ESCROW', updated_at: new Date().toISOString() })
        .eq('id', bookingId);
    }
  } else if (event.type === 'payment_intent.succeeded') {
    if (paymentIntentId) {
      await supabaseAdmin
        .from('payments')
        .update({ status: 'CAPTURED', updated_at: new Date().toISOString() })
        .eq('gateway_payment_intent_id', paymentIntentId);
    }
    if (bookingId) {
      await supabaseAdmin
        .from('bookings')
        .update({ escrow_status: 'RELEASED_TO_PROVIDER', updated_at: new Date().toISOString() })
        .eq('id', bookingId);
    }
  } else if (event.type === 'charge.refunded') {
    if (paymentIntentId) {
      await supabaseAdmin
        .from('payments')
        .update({ status: 'REFUNDED', updated_at: new Date().toISOString() })
        .eq('gateway_payment_intent_id', paymentIntentId);
    }
    if (bookingId) {
      await supabaseAdmin
        .from('bookings')
        .update({ escrow_status: 'REFUNDED_TO_CUSTOMER', status: 'CANCELLED', updated_at: new Date().toISOString() })
        .eq('id', bookingId);
    }
  } else if (event.type === 'charge.dispute.created') {
    if (paymentIntentId) {
      await supabaseAdmin
        .from('payments')
        .update({ status: 'DISPUTED', updated_at: new Date().toISOString() })
        .eq('gateway_payment_intent_id', paymentIntentId);
    }
    if (bookingId) {
      await supabaseAdmin
        .from('bookings')
        .update({ escrow_status: 'FROZEN_FOR_DISPUTE', status: 'DISPUTED', updated_at: new Date().toISOString() })
        .eq('id', bookingId);
    }
  }

  return new Response(JSON.stringify({ received: true, type: event.type }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
