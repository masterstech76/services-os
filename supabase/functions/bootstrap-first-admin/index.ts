// ============================================================================
// ServicePro OS — Supabase Edge Function: bootstrap-first-admin
// One-Time, Server-Controlled First Administrator Provisioning Engine
// Standards: OWASP ASVS v4.0.3, NIST SP 800-63B
// ============================================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-bootstrap-token',
};

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const RECOVERY_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function timingSafeEqualString(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const aBytes = enc.encode(a);
  const bBytes = enc.encode(b);
  if (aBytes.length !== bBytes.length || aBytes.length === 0) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < aBytes.length; i++) {
    diff |= aBytes[i] ^ bBytes[i];
  }
  return diff === 0;
}

function generateBase32Secret(length = 20): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  let out = '';
  for (let i = 0; i < length; i++) {
    out += BASE32_ALPHABET[bytes[i] % 32];
  }
  return out;
}

function generateRecoveryCodes(count = 8): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const bytes = crypto.getRandomValues(new Uint8Array(10));
    let code = '';
    for (let j = 0; j < 10; j++) {
      if (j === 5) code += '-';
      code += RECOVERY_ALPHABET[bytes[j] % RECOVERY_ALPHABET.length];
    }
    codes.push(code);
  }
  return codes;
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function isStrongPassword(password: string): { valid: boolean; reason?: string } {
  if (!password || password.length < 10) {
    return { valid: false, reason: 'Password must be at least 10 characters long.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, reason: 'Password must contain at least one uppercase letter.' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, reason: 'Password must contain at least one lowercase letter.' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, reason: 'Password must contain at least one digit.' };
  }
  if (!/[!@#$%^&*()_+\-=[\]{}|;:,.<>?~`]/.test(password)) {
    return { valid: false, reason: 'Password must contain at least one special character.' };
  }
  return { valid: true };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed. Use POST.' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const expectedBootstrapSecret = Deno.env.get('INITIAL_ADMIN_BOOTSTRAP_SECRET');

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Supabase server environment is not configured.' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!expectedBootstrapSecret || expectedBootstrapSecret.trim().length < 16) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'INITIAL_ADMIN_BOOTSTRAP_SECRET (min 16 chars) is not configured in Supabase Edge Function secrets.',
        }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const providedToken = String(
      req.headers.get('x-bootstrap-token') || body?.provisioningToken || ''
    ).trim();

    if (!providedToken || !timingSafeEqualString(providedToken, expectedBootstrapSecret.trim())) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid or missing server provisioning token (X-Bootstrap-Token).',
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '');
    const fullName = String(body?.fullName || '').trim();
    const companyName = String(body?.companyName || 'ServicePro OS Enterprise').trim();
    const phone = String(body?.phone || '+18005550100').trim();

    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ success: false, error: 'A valid administrator work email is required.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const pwdCheck = isStrongPassword(password);
    if (!pwdCheck.valid) {
      return new Response(
        JSON.stringify({ success: false, error: pwdCheck.reason }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Pre-check if system is already initialized before creating Auth user
    const { data: alreadyInit, error: initCheckErr } = await supabaseAdmin.rpc('check_system_initialized');
    if (initCheckErr) {
      return new Response(
        JSON.stringify({ success: false, error: `Bootstrap state check failed: ${initCheckErr.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (alreadyInit === true) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'System is already initialized. First-Admin bootstrap is permanently locked.',
        }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const nameParts = (fullName || 'Master Administrator').split(/\s+/);
    const firstName = nameParts[0] || 'Master';
    const lastName = nameParts.slice(1).join(' ') || 'Administrator';
    const slug =
      companyName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'primary-enterprise';

    // 2. Generate per-user RFC 6238 TOTP secret and 8 single-use recovery codes
    const secretBase32 = generateBase32Secret(20);
    const recoveryCodes = generateRecoveryCodes(8);
    const recoveryCodeHashes: string[] = [];
    for (const code of recoveryCodes) {
      const normalized = code.replace(/[^A-Z0-9]/gi, '').toUpperCase();
      recoveryCodeHashes.push(await sha256Hex(normalized));
    }

    const bootstrapNonceHash = await sha256Hex(`bootstrap:${expectedBootstrapSecret.trim()}:${email}`);

    // 3. Create Supabase Auth user via service_role admin API
    const { data: createdAuth, error: createAuthError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
      },
      app_metadata: {
        role: 'ADMIN',
      },
    });

    if (createAuthError || !createdAuth?.user?.id) {
      return new Response(
        JSON.stringify({
          success: false,
          error: createAuthError?.message || 'Failed to create Supabase Auth administrator account.',
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const adminUserId = createdAuth.user.id;

    // 4. Execute atomic, advisory-locked PostgreSQL provisioning transaction
    const { data: bootstrapResult, error: rpcError } = await supabaseAdmin.rpc(
      'bootstrap_first_admin_atomic',
      {
        p_admin_user_id: adminUserId,
        p_email: email,
        p_first_name: firstName,
        p_last_name: lastName,
        p_phone: phone,
        p_company_name: companyName,
        p_slug: slug,
        p_totp_secret: secretBase32,
        p_recovery_code_hashes: recoveryCodeHashes,
        p_bootstrap_nonce_hash: bootstrapNonceHash,
      }
    );

    if (rpcError || !bootstrapResult?.tenant_id) {
      // Roll back Auth user if atomic DB transaction failed or lost race
      await supabaseAdmin.auth.admin.deleteUser(adminUserId);
      return new Response(
        JSON.stringify({
          success: false,
          error: rpcError?.message || 'Atomic first-admin database provisioning failed.',
        }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 5. Bind tenant_id into server-controlled app_metadata on the Auth user
    await supabaseAdmin.auth.admin.updateUserById(adminUserId, {
      app_metadata: {
        role: 'ADMIN',
        tenant_id: bootstrapResult.tenant_id,
      },
    });

    const encodedIssuer = encodeURIComponent(companyName || 'ServicePro OS');
    const encodedAccount = encodeURIComponent(email);
    const otpauthUrl = `otpauth://totp/${encodedIssuer}:${encodedAccount}?secret=${secretBase32}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;

    return new Response(
      JSON.stringify({
        success: true,
        adminUserId,
        tenantId: bootstrapResult.tenant_id,
        email,
        mfaEnrollment: {
          secretBase32,
          otpauthUrl,
          recoveryCodes,
        },
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unexpected server provisioning error';
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
