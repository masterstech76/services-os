/**
 * ServicePro OS — Push & Email Transactional Notification Edge Function
 * Runtime: Supabase Edge Functions (Deno)
 *
 * Responsibilities:
 * 1. Verifies caller JWT via supabaseAdmin.auth.getUser(jwt) & active public.users role.
 * 2. Dispatches push notifications via Firebase Cloud Messaging HTTP v1 API
 *    (OAuth2 service account assertion; legacy /fcm/send removed)
 *    or transactional email via Resend using server-side secrets.
 * 3. Returns 502 Bad Gateway on upstream delivery failures (never masks errors as 200).
 * 4. Logs notification delivery in public.security_audit_logs.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

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

function base64UrlEncode(input: Uint8Array | string): string {
  const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : input;
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function getFcmV1AccessToken(clientEmail: string, privateKeyPem: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64UrlEncode(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64UrlEncode(
    JSON.stringify({
      iss: clientEmail,
      scope: 'https://www.googleapis.com/auth/firebase.messaging',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    })
  );
  const unsigned = `${header}.${claim}`;

  const pemBody = privateKeyPem
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\\n/g, '')
    .replace(/\s+/g, '');
  const keyBytes = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    keyBytes,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, new TextEncoder().encode(unsigned));
  const assertion = `${unsigned}.${base64UrlEncode(new Uint8Array(signature))}`;

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }).toString(),
  });
  const tokenJson = await tokenRes.json();
  if (!tokenRes.ok || !tokenJson?.access_token) {
    throw new Error(tokenJson?.error_description || 'Failed to obtain FCM v1 OAuth2 access token.');
  }
  return String(tokenJson.access_token);
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const authHeader = req.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ') || !supabaseUrl || !supabaseServiceKey) {
    return new Response(
      JSON.stringify({ success: false, error: 'Unauthorized: Missing Bearer token or Supabase env.' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  const jwt = authHeader.replace('Bearer ', '').trim();
  const { data: userData, error: authError } = await supabaseAdmin.auth.getUser(jwt);
  if (authError || !userData?.user) {
    return new Response(
      JSON.stringify({ success: false, error: 'Invalid Supabase JWT session.' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const { data: callerUser } = await supabaseAdmin
    .from('users')
    .select('id, email, role, tenant_id, is_active')
    .eq('id', userData.user.id)
    .maybeSingle();

  if (!callerUser || callerUser.is_active !== true) {
    return new Response(
      JSON.stringify({ success: false, error: 'Forbidden: Active registered account required.' }),
      { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const isPrivileged = ['ADMIN', 'STAFF'].includes(String(callerUser.role));
  let payload: PushNotificationRequest;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ success: false, error: 'Invalid JSON request body' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (!payload.title || !payload.body) {
    return new Response(
      JSON.stringify({ success: false, error: 'Both title and body are required.' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  if (!isPrivileged) {
    // Non-admin/staff callers may only notify a recipient within the same tenant on a shared booking
    if (!payload.recipientUserId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Forbidden: ADMIN/STAFF role or shared booking recipient required.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const { data: sharedBooking } = await supabaseAdmin
      .from('bookings')
      .select('id')
      .eq('tenant_id', callerUser.tenant_id)
      .or(
        `and(customer_id.eq.${callerUser.id},provider_id.eq.${payload.recipientUserId}),and(provider_id.eq.${callerUser.id},customer_id.eq.${payload.recipientUserId})`
      )
      .limit(1)
      .maybeSingle();
    if (!sharedBooking) {
      return new Response(
        JSON.stringify({ success: false, error: 'Forbidden: No active shared booking with target recipient.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  const fcmProjectId = Deno.env.get('FCM_PROJECT_ID');
  const fcmClientEmail = Deno.env.get('FCM_CLIENT_EMAIL');
  const fcmPrivateKey = Deno.env.get('FCM_PRIVATE_KEY');
  const fcmStaticToken = Deno.env.get('FCM_ACCESS_TOKEN');
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  const notificationFromEmail = Deno.env.get('NOTIFICATION_FROM_EMAIL') || 'notifications@servicepro.local';

  const channel = payload.channel ?? 'PUSH';
  const results: Record<string, unknown> = {};
  let anyFailure = false;

  if ((channel === 'PUSH' || channel === 'BOTH') && payload.fcmToken) {
    if (!fcmProjectId || (!fcmStaticToken && (!fcmClientEmail || !fcmPrivateKey))) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'FCM HTTP v1 is not configured (requires FCM_PROJECT_ID + FCM_CLIENT_EMAIL + FCM_PRIVATE_KEY).',
        }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const accessToken = fcmStaticToken || (await getFcmV1AccessToken(fcmClientEmail!, fcmPrivateKey!));
    const fcmRes = await fetch(`https://fcm.googleapis.com/v1/projects/${fcmProjectId}/messages:send`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: {
          token: payload.fcmToken,
          notification: {
            title: payload.title,
            body: payload.body,
          },
          data: payload.data ?? {},
        },
      }),
    });

    const fcmJson = await fcmRes.json().catch(() => ({ status: fcmRes.status }));
    results.push = fcmJson;
    if (!fcmRes.ok) anyFailure = true;
  }

  if ((channel === 'EMAIL' || channel === 'BOTH') && payload.email) {
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({
          success: false,
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

    const emailJson = await emailRes.json().catch(() => ({ status: emailRes.status }));
    results.email = emailJson;
    if (!emailRes.ok) anyFailure = true;
  }

  await supabaseAdmin.from('security_audit_logs').insert({
    tenant_id: callerUser.tenant_id,
    actor_email: callerUser.email,
    role: callerUser.role,
    event_type: 'NOTIFICATION_DISPATCHED',
    severity: anyFailure ? 'WARNING' : 'INFO',
    details: `Notification channel=${channel} status=${anyFailure ? 'UPSTREAM_ERROR' : 'OK'}`,
  });

  if (anyFailure) {
    return new Response(
      JSON.stringify({
        success: false,
        dispatched: false,
        channel,
        results,
      }),
      { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({
      success: true,
      dispatched: true,
      channel,
      results,
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
});
