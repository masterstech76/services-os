// ============================================================================
// ServicePro OS — Supabase Edge Function: stripe-webhook
// Cryptographically verifies all v1 Stripe-Signature headers (HMAC-SHA256),
// enforces event.id idempotency via stripe_webhook_events, and synchronizes
// payments.status & bookings.escrow_status without premature escrow release.
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
  let timestamp = '';
  const v1Signatures: string[] = [];

  for (const item of sigHeader.split(',')) {
    const eqIdx = item.indexOf('=');
    if (eqIdx === -1) continue;
    const k = item.slice(0, eqIdx).trim();
    const v = item.slice(eqIdx + 1).trim();
    if (k === 't' && !timestamp) timestamp = v;
    if (k === 'v1' && v) v1Signatures.push(v);
  }

  if (!timestamp || v1Signatures.length === 0) return false;

  const nowSec = Math.floor(Date.now() / 1000);
  if (Math.abs(nowSec - Number(timestamp)) > 300) {
    return false;
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
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return v1Signatures.some((sig) => timingSafeEqualHex(computedHex, sig));
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
  const eventId = String(event?.id || '').trim();
  if (!eventId) {
    return new Response(JSON.stringify({ error: 'Missing Stripe event.id' }), { status: 400 });
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  const object = event?.data?.object || {};
  const paymentIntentId = object.payment_intent || (String(object.object || '') === 'payment_intent' ? object.id : null);
  let bookingId: string | null = object.metadata?.booking_id || null;

  // Fallback lookup via payments table when metadata.booking_id is absent (e.g. charge.refunded / dispute)
  if (!bookingId && paymentIntentId) {
    const { data: paymentRow } = await supabaseAdmin
      .from('payments')
      .select('booking_id')
      .eq('gateway_payment_intent_id', paymentIntentId)
      .maybeSingle();
    bookingId = paymentRow?.booking_id || null;
  }

  let tenantId: string | null = object.metadata?.tenant_id || null;
  if (bookingId) {
    const { data: bookingRow } = await supabaseAdmin
      .from('bookings')
      .select('tenant_id')
      .eq('id', bookingId)
      .maybeSingle();
    if (bookingRow?.tenant_id) {
      tenantId = bookingRow.tenant_id;
    }
  }

  // Atomic event.id idempotency check
  const { error: dedupErr } = await supabaseAdmin.from('stripe_webhook_events').insert({
    event_id: eventId,
    event_type: String(event.type || 'unknown'),
    payment_intent_id: paymentIntentId || null,
    booking_id: bookingId,
    tenant_id: tenantId,
  });

  if (dedupErr) {
    if (dedupErr.code === '23505') {
      return new Response(JSON.stringify({ received: true, duplicate: true, eventId }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ error: dedupErr.message }), { status: 500 });
  }

  const nowIso = new Date().toISOString();

  if (event.type === 'payment_intent.amount_capturable_updated') {
    if (paymentIntentId) {
      await supabaseAdmin
        .from('payments')
        .update({ status: 'HELD_IN_ESCROW', updated_at: nowIso })
        .eq('gateway_payment_intent_id', paymentIntentId);
    }
    if (bookingId) {
      await supabaseAdmin
        .from('bookings')
        .update({ escrow_status: 'HELD_IN_ESCROW', updated_at: nowIso })
        .eq('id', bookingId);
    }
  } else if (event.type === 'payment_intent.succeeded') {
    if (paymentIntentId) {
      await supabaseAdmin
        .from('payments')
        .update({ status: 'CAPTURED', updated_at: nowIso })
        .eq('gateway_payment_intent_id', paymentIntentId);
    }
    // Never prematurely release escrow before customer PIN / COMPLETED verification
    if (bookingId) {
      const { data: bk } = await supabaseAdmin
        .from('bookings')
        .select('status')
        .eq('id', bookingId)
        .maybeSingle();
      if (bk?.status === 'COMPLETED') {
        await supabaseAdmin
          .from('bookings')
          .update({ escrow_status: 'RELEASED_TO_PROVIDER', updated_at: nowIso })
          .eq('id', bookingId);
      } else {
        await supabaseAdmin
          .from('bookings')
          .update({ escrow_status: 'HELD_IN_ESCROW', updated_at: nowIso })
          .eq('id', bookingId);
      }
    }
  } else if (event.type === 'payment_intent.payment_failed' || event.type === 'payment_intent.canceled') {
    if (paymentIntentId) {
      await supabaseAdmin
        .from('payments')
        .update({ status: 'FAILED', updated_at: nowIso })
        .eq('gateway_payment_intent_id', paymentIntentId);
    }
  } else if (event.type === 'charge.refunded') {
    if (paymentIntentId) {
      await supabaseAdmin
        .from('payments')
        .update({ status: 'REFUNDED', updated_at: nowIso })
        .eq('gateway_payment_intent_id', paymentIntentId);
    }
    if (bookingId) {
      await supabaseAdmin
        .from('bookings')
        .update({ escrow_status: 'REFUNDED_TO_CUSTOMER', status: 'CANCELLED', updated_at: nowIso })
        .eq('id', bookingId);
    }
  } else if (event.type === 'charge.dispute.created') {
    if (paymentIntentId) {
      await supabaseAdmin
        .from('payments')
        .update({ status: 'DISPUTED', updated_at: nowIso })
        .eq('gateway_payment_intent_id', paymentIntentId);
    }
    if (bookingId) {
      await supabaseAdmin
        .from('bookings')
        .update({ escrow_status: 'FROZEN_FOR_DISPUTE', status: 'DISPUTED', updated_at: nowIso })
        .eq('id', bookingId);
    }
  }

  return new Response(JSON.stringify({ received: true, type: event.type, eventId }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
