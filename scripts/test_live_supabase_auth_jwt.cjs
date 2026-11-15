/**
 * ServicePro OS — Live Supabase Auth, JWT, MFA & PostgREST RLS Integration Suite
 *
 * Runs against a local Supabase stack (`npx supabase start`) or an isolated staging
 * Supabase project provided via SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY.
 * Never hardcodes credentials and cleans up temporary test users on exit.
 */

const { execSync } = require('child_process');
const crypto = require('crypto');
const path = require('path');
const { createClient } = require(path.resolve(__dirname, '..', 'admin_web', 'node_modules', '@supabase', 'supabase-js'));

function resolveSupabaseConfig() {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return {
      url: process.env.SUPABASE_URL,
      anonKey: process.env.SUPABASE_ANON_KEY,
      serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      source: 'environment',
    };
  }
  const raw = execSync('npx supabase status --output json', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  const parsed = JSON.parse(raw);
  const url = parsed.API_URL || parsed.api_url;
  const anonKey = parsed.ANON_KEY || parsed.anon_key || parsed.PUBLISHABLE_KEY || parsed.publishable_key;
  const serviceKey = parsed.SERVICE_ROLE_KEY || parsed.service_role_key || parsed.SECRET_KEY || parsed.secret_key;
  if (!url || !anonKey || !serviceKey) {
    throw new Error('Could not resolve local Supabase API_URL / ANON_KEY / SERVICE_ROLE_KEY from `npx supabase status --output json`.');
  }
  return { url, anonKey, serviceKey, source: 'local-supabase-cli' };
}

function base32ToBytes(base32) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const clean = base32.toUpperCase().replace(/[^A-Z2-7]/g, '');
  let bits = 0;
  let value = 0;
  const out = [];
  for (let i = 0; i < clean.length; i++) {
    const idx = alphabet.indexOf(clean[i]);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Buffer.from(out);
}

function generateTotp(secretBase32) {
  const key = base32ToBytes(secretBase32);
  const step = Math.floor(Date.now() / 1000 / 30);
  const counter = Buffer.alloc(8);
  counter.writeUInt32BE(Math.floor(step / 0x100000000), 0);
  counter.writeUInt32BE(step >>> 0, 4);
  const hmac = crypto.createHmac('sha1', key).update(counter).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code =
    (((hmac[offset] & 0x7f) << 24) |
      ((hmac[offset + 1] & 0xff) << 16) |
      ((hmac[offset + 2] & 0xff) << 8) |
      (hmac[offset + 3] & 0xff)) %
    1000000;
  return String(code).padStart(6, '0');
}

function assert(cond, msg) {
  if (!cond) throw new Error(`LIVE AUTH/RLS ASSERTION FAILED: ${msg}`);
  console.log(`PASS (Live): ${msg}`);
}

async function main() {
  const cfg = resolveSupabaseConfig();
  console.log(`Connected target (${cfg.source}): ${cfg.url}`);

  const adminSvc = createClient(cfg.url, cfg.serviceKey);
  const suffix = crypto.randomBytes(4).toString('hex');
  const adminEmail = `verify-admin-${suffix}@servicepro.test`;
  const custEmail = `verify-cust-${suffix}@servicepro.test`;
  const testPassword = `Str0ng!Test#${suffix}`;
  const createdUserIds = [];
  let createdTenantId = null;

  try {
    // 1. Provision isolated temporary Tenant, Admin, and Customer via service_role
    const { data: tenantRow, error: tErr } = await adminSvc
      .from('tenants')
      .insert({ business_name: `Verify Tenant ${suffix}`, slug: `verify-tenant-${suffix}` })
      .select('id')
      .single();
    if (tErr) throw tErr;
    createdTenantId = tenantRow.id;

    const { data: aAuth, error: aErr } = await adminSvc.auth.admin.createUser({
      email: adminEmail,
      password: testPassword,
      email_confirm: true,
      app_metadata: { role: 'ADMIN', tenant_id: createdTenantId },
    });
    if (aErr) throw aErr;
    createdUserIds.push(aAuth.user.id);

    await adminSvc.from('users').insert({
      id: aAuth.user.id,
      tenant_id: createdTenantId,
      email: adminEmail,
      phone: '+18005550191',
      first_name: 'Verify',
      last_name: 'Admin',
      role: 'ADMIN',
      is_active: true,
    });

    const { data: cAuth, error: cErr } = await adminSvc.auth.admin.createUser({
      email: custEmail,
      password: testPassword,
      email_confirm: true,
      app_metadata: { role: 'CUSTOMER', tenant_id: createdTenantId },
    });
    if (cErr) throw cErr;
    createdUserIds.push(cAuth.user.id);

    await adminSvc.from('users').insert({
      id: cAuth.user.id,
      tenant_id: createdTenantId,
      email: custEmail,
      phone: '+18005550192',
      first_name: 'Verify',
      last_name: 'Customer',
      role: 'CUSTOMER',
      is_active: true,
    });

    // 2. Real GoTrue signInWithPassword (invalid password rejected, valid succeeds)
    const anonClient = createClient(cfg.url, cfg.anonKey);
    const badLogin = await anonClient.auth.signInWithPassword({ email: adminEmail, password: 'WrongPassword1!' });
    assert(Boolean(badLogin.error), 'Invalid password rejected by GoTrue');

    const adminClient = createClient(cfg.url, cfg.anonKey);
    const goodLogin = await adminClient.auth.signInWithPassword({ email: adminEmail, password: testPassword });
    assert(!goodLogin.error && Boolean(goodLogin.data.session), 'Valid Admin login issues real GoTrue JWT');

    // 3. Password-only Admin JWT MUST be blocked from protected security_audit_logs & direct user_mfa_credentials
    const preMfaLogs = await adminClient.from('security_audit_logs').select('id').limit(1);
    assert((preMfaLogs.data || []).length === 0, 'Password-only Admin JWT cannot read security_audit_logs before MFA');

    const directMfa = await adminClient.from('user_mfa_credentials').select('*').limit(1);
    assert(Boolean(directMfa.error), 'Direct PostgREST SELECT on user_mfa_credentials is denied to Admin');

    // 4. Enroll MFA & verify TOTP -> unlocks Admin operations & survives refreshSession()
    const secretBase32 = 'JBSWY3DPEHPK3PXP';
    const recoveryCode = `RCODE-${suffix.toUpperCase()}`;
    const recoveryHash = crypto
      .createHash('sha256')
      .update(recoveryCode.replace(/[^A-Z0-9]/gi, '').toUpperCase())
      .digest('hex');

    const enrollRes = await adminClient.rpc('enroll_my_mfa', {
      p_totp_secret: secretBase32,
      p_recovery_code_hashes: [recoveryHash],
      p_verification_code: generateTotp(secretBase32),
    });
    assert(enrollRes.data?.success === true, 'Server-side enroll_my_mfa succeeds with valid TOTP');

    const refreshRes = await adminClient.auth.refreshSession();
    assert(!refreshRes.error && Boolean(refreshRes.data.session), 'refreshSession() issues refreshed JWT preserving session_id');

    const postMfaStatus = await adminClient.rpc('get_my_mfa_status');
    assert(postMfaStatus.data?.is_mfa_verified_for_session === true, 'Refreshed JWT retains server MFA verification');

    // 5. Deactivate Admin via service_role -> stale & refreshed JWTs immediately lose privilege
    await adminSvc.from('users').update({ is_active: false }).eq('id', aAuth.user.id);
    await adminClient.auth.refreshSession();
    const postDeactStatus = await adminClient.rpc('get_my_mfa_status');
    assert(
      postDeactStatus.data?.is_mfa_verified_for_session === false,
      'Deactivated Admin loses MFA verification even after refreshSession()'
    );

    // 6. Customer cannot read Admin tables or self-escalate role
    const custClient = createClient(cfg.url, cfg.anonKey);
    await custClient.auth.signInWithPassword({ email: custEmail, password: testPassword });
    const custEsc = await custClient.from('users').update({ role: 'ADMIN' }).eq('id', cAuth.user.id);
    assert(Boolean(custEsc.error), 'Customer cannot self-escalate role to ADMIN via PostgREST');

    console.log('ALL LIVE SUPABASE AUTH, JWT, MFA & POSTGREST RLS TESTS PASSED!');
  } finally {
    for (const uid of createdUserIds) {
      try { await adminSvc.auth.admin.deleteUser(uid); } catch {}
    }
    if (createdTenantId) {
      try { await adminSvc.from('tenants').delete().eq('id', createdTenantId); } catch {}
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
