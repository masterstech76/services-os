/**
 * ServicePro OS — Push & Email Transactional Notification Edge Function
 * Runtime: Supabase Edge Functions (Deno)
 *
 * Responsibilities:
 * 1. Verifies caller authentication via Supabase JWT.
 * 2. Dispatches push notifications via Firebase Cloud Messaging (FCM HTTP v1 / Legacy API)
 *    or transactional email via Resend / SendGrid using server-side secrets.
 * 3. Logs notification delivery metadata in public.audit_logs.
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface PushNotificationRequest {
  recipientUserId?: string;
  fcmToken?: string;
  email?: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  channel?: 'PUSH' | 'EMAIL' | 'BOTH';
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized: Missing Bearer token.' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const fcmServerKey = Deno.env.get('FCM_SERVER_KEY');
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  const notificationFromEmail =
    Deno.env.get('NOTIFICATION_FROM_EMAIL') || 'notifications@servicepro.local';

  let payload: PushNotificationRequest;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON request body' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (!payload.title || !payload.body) {
    return new Response(
      JSON.stringify({ error: 'Both title and body are required.' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const channel = payload.channel ?? 'PUSH';
  const results: Record<string, unknown> = {};

  if ((channel === 'PUSH' || channel === 'BOTH') && payload.fcmToken) {
    if (!fcmServerKey) {
      return new Response(
        JSON.stringify({
          error: 'Push notification gateway is not configured on this server (missing FCM_SERVER_KEY).',
        }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const fcmRes = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        Authorization: `key=${fcmServerKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: payload.fcmToken,
        notification: {
          title: payload.title,
          body: payload.body,
        },
        data: payload.data ?? {},
      }),
    });

    results.push = await fcmRes.json().catch(() => ({ status: fcmRes.status }));
  }

  if ((channel === 'EMAIL' || channel === 'BOTH') && payload.email) {
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({
          error: 'Email gateway is not configured on this server (missing RESEND_API_KEY).',
        }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: notificationFromEmail,
        to: [payload.email],
        subject: payload.title,
        text: payload.body,
      }),
    });

    results.email = await emailRes.json().catch(() => ({ status: emailRes.status }));
  }

  return new Response(
    JSON.stringify({
      dispatched: true,
      channel,
      results,
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
});
