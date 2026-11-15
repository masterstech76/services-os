// ============================================================================
// ServicePro OS — Supabase Edge Function: twilio-sms
// Authenticates caller JWT, validates phone number, dispatches SMS via Twilio
// REST API, and records an audit trail in public.security_audit_logs.
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
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const fromNumber = Deno.env.get('TWILIO_FROM_NUMBER');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!accountSid || !authToken || !fromNumber || accountSid.includes('your_twilio_account_sid')) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Twilio secrets (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER) are not configured.',
        }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized request.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const jwt = authHeader.replace('Bearer ', '');
    const { data: userData, error: authError } = await supabaseAdmin.auth.getUser(jwt);
    if (authError || !userData?.user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid Supabase session token.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const to = String(body.to || '').trim();
    const message = String(body.message || '').trim();

    if (!to || !message || message.length > 1600) {
      return new Response(
        JSON.stringify({ success: false, error: 'Recipient phone number and message (1..1600 chars) are required.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const form = new URLSearchParams();
    form.set('To', to);
    form.set('From', fromNumber);
    form.set('Body', message);

    const basicAuth = btoa(`${accountSid}:${authToken}`);
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

    const twilioRes = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form.toString(),
    });

    const twilioJson = await twilioRes.json();
    if (!twilioRes.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          error: twilioJson?.message || 'Twilio carrier rejected SMS transmission.',
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    await supabaseAdmin.from('security_audit_logs').insert({
      actor_email: userData.user.email || 'dispatcher',
      role: 'ADMIN',
      event_type: 'TWILIO_SMS_SENT',
      severity: 'INFO',
      ip_address: '127.0.0.1',
      details: `Dispatched SMS (${twilioJson.sid}) to ${to}`,
    });

    return new Response(
      JSON.stringify({
        success: true,
        sid: twilioJson.sid,
        status: twilioJson.status,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unexpected SMS gateway error';
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
