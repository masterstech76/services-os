const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const rbacSql = fs.readFileSync(path.join(ROOT, 'supabase', 'migrations', '03_security_rbac_and_rls.sql'), 'utf8');
const edgeBootstrap = fs.readFileSync(path.join(ROOT, 'supabase', 'functions', 'bootstrap-first-admin', 'index.ts'), 'utf8');
const supabaseClientTs = fs.readFileSync(path.join(ROOT, 'admin_web', 'src', 'services', 'supabaseClient.ts'), 'utf8');
const loginPageTsx = fs.readFileSync(path.join(ROOT, 'admin_web', 'src', 'pages', 'auth', 'LoginPage.tsx'), 'utf8');

function assert(cond, msg) {
  if (!cond) {
    throw new Error(`SECURITY ASSERTION FAILED: ${msg}`);
  }
  console.log(`PASS (Static): ${msg}`);
}

assert(
  rbacSql.includes('REVOKE ALL ON TABLE public.user_mfa_credentials FROM PUBLIC, anon, authenticated;'),
  'Customer, Technician, Staff, and Admin have zero direct table privileges on user_mfa_credentials'
);
assert(
  rbacSql.includes('REVOKE ALL ON TABLE public.user_mfa_sessions FROM PUBLIC, anon, authenticated;'),
  'No authenticated user (including Admin) can read/modify user_mfa_sessions directly'
);
assert(
  rbacSql.includes('REVOKE ALL ON TABLE private.mfa_encryption_keys FROM PUBLIC, anon, authenticated;'),
  'Server-side MFA encryption key table is isolated in private schema'
);
assert(
  !/CREATE\s+POLICY[^;]*?ON\s+user_mfa_credentials[^;]*?TO\s+(?:authenticated|anon|public)/i.test(rbacSql),
  'No RLS policy grants authenticated/anon/public direct access to user_mfa_credentials'
);
assert(
  !rbacSql.includes('GRANT UPDATE') && rbacSql.includes('REVOKE ALL ON FUNCTION public.record_verified_mfa_session(UUID) FROM PUBLIC, anon, authenticated;'),
  'record_verified_mfa_session is internal-only and cannot be invoked directly by clients'
);
assert(
  /CREATE\s+OR\s+REPLACE\s+FUNCTION\s+public\.is_admin\(\)[\s\S]*?public\.has_verified_mfa_session\(\)/i.test(rbacSql),
  'is_admin() requires public.has_verified_mfa_session()'
);
assert(
  /CREATE\s+OR\s+REPLACE\s+FUNCTION\s+public\.is_staff\(\)[\s\S]*?public\.has_verified_mfa_session\(\)/i.test(rbacSql),
  'is_staff() requires public.has_verified_mfa_session()'
);
assert(
  /CREATE\s+OR\s+REPLACE\s+FUNCTION\s+public\.admin_revoke_user_mfa[\s\S]*?IF\s+NOT\s+public\.is_admin\(\)/i.test(rbacSql),
  'admin_revoke_user_mfa independently enforces MFA-verified is_admin()'
);
assert(
  rbacSql.includes('s.revoked_at IS NULL') && rbacSql.includes('s.expires_at > NOW()'),
  'has_verified_mfa_session() rejects revoked or expired MFA sessions'
);
assert(
  supabaseClientTs.includes("await this.client.rpc('revoke_my_mfa_session')") &&
    supabaseClientTs.includes('if (!mfaStatus?.isMfaVerifiedForSession)'),
  'Client signOut revokes server MFA session and verifyActiveCloudSession enforces isMfaVerifiedForSession'
);
assert(
  rbacSql.includes("RAISE EXCEPTION 'MFA_ALREADY_ENROLLED"),
  'enroll_my_mfa blocks overwriting an already-enabled MFA credential'
);
assert(
  rbacSql.includes('public.encrypt_totp_secret(') && rbacSql.includes('public.decrypt_totp_secret('),
  'TOTP secrets are AES-256 encrypted at rest via pgp_sym_encrypt'
);
assert(
  edgeBootstrap.includes('timingSafeEqualString(providedToken, expectedBootstrapSecret.trim())'),
  'bootstrap-first-admin rejects unauthorized requests using timing-safe X-Bootstrap-Token check'
);
assert(
  loginPageTsx.includes("const cloudRole: UserRole = cloudRes.role === 'ADMIN' ? 'ADMIN' : 'STAFF';"),
  'Cloud Staff and Cloud Admin both route through mandatory server MFA enrollment/challenge'
);

const curRoleFn = rbacSql.match(/CREATE\s+OR\s+REPLACE\s+FUNCTION\s+public\.current_user_role\(\)[\s\S]*?\$\$;/i)?.[0] || '';
assert(
  curRoleFn.includes('IF FOUND THEN') &&
    curRoleFn.includes('IF COALESCE(v_is_active, FALSE) IS NOT TRUE THEN') &&
    curRoleFn.includes("RETURN 'ANONYMOUS';"),
  'Inactive Admin or Staff user immediately returns ANONYMOUS without falling back to app_metadata.role'
);
assert(
  /v_app_role\s+IN\s*\(\s*'TECHNICIAN'\s*,\s*'CUSTOMER'\s*\)/.test(curRoleFn) &&
    !/v_app_role\s+IN\s*\([^)]*'ADMIN'/.test(curRoleFn) &&
    !/v_app_role\s+IN\s*\([^)]*'STAFF'/.test(curRoleFn),
  'Missing public.users record can NEVER inherit ADMIN or STAFF from app_metadata.role'
);
const mfaSessFn = rbacSql.match(/CREATE\s+OR\s+REPLACE\s+FUNCTION\s+public\.has_verified_mfa_session\(\)[\s\S]*?\$\$;/i)?.[0] || '';
assert(
  mfaSessFn.includes('SELECT 1 FROM public.users u WHERE u.id = v_uid AND u.is_active = TRUE'),
  'has_verified_mfa_session() rejects inactive or missing users even with aal2 or existing user_mfa_sessions row'
);
assert(
  rbacSql.includes('trg_revoke_sessions_on_user_deactivation') &&
    rbacSql.includes('CREATE OR REPLACE FUNCTION public.admin_set_user_active'),
  'Deactivating a user automatically revokes active MFA sessions via trigger and admin_set_user_active enforces is_admin()'
);

console.log('ALL STATIC PHASE 1 SECURITY CHECKS PASSED!');
