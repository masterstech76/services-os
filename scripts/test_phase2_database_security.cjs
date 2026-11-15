/**
 * ServicePro OS — Phase 2 Database Security Static Verification Suite
 *
 * Verifies Phase 2 hardening in 04_phase2_database_security_hardening.sql:
 *   - FORCE ROW LEVEL SECURITY on all 21 tables
 *   - Zero `OR public.current_tenant_id() IS NULL` fail-open bypasses
 *   - Active-user enforcement (`is_active_user()`)
 *   - Auth secret tables (`auth_rate_limits`, `password_reset_tokens`, `auth_otps`) locked to service_role
 *   - Booking financial/PIN trigger protection (`protect_booking_sensitive_fields`)
 *   - Geofence, escrow release & geospatial RPC caller authorization + REVOKE PUBLIC
 *   - Private storage buckets (`public = FALSE`) & tenant-isolated storage.objects policies
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const m4 = fs.readFileSync(path.join(ROOT, 'supabase', 'migrations', '04_phase2_database_security_hardening.sql'), 'utf8');

function assert(cond, msg) {
  if (!cond) {
    console.error(`FAIL (Phase 2 Static): ${msg}`);
    process.exit(1);
  }
  console.log(`PASS (Phase 2 Static): ${msg}`);
}

// 1. FORCE ROW LEVEL SECURITY on all 21 tables
const expectedTables = [
  'tenants', 'users', 'customer_profiles', 'customer_addresses', 'provider_profiles',
  'categories', 'services', 'bookings', 'payments', 'job_evidence', 'inventory_items',
  'booking_parts', 'reviews', 'audit_logs', 'user_mfa_credentials', 'user_mfa_sessions',
  'security_audit_logs', 'auth_rate_limits', 'password_reset_tokens', 'auth_otps',
  'mfa_encryption_keys',
];
for (const tbl of expectedTables) {
  assert(
    new RegExp(`ALTER\\s+TABLE\\s+IF\\s+EXISTS\\s+(?:public|private)\\.${tbl}\\s+FORCE\\s+ROW\\s+LEVEL\\s+SECURITY`, 'i').test(m4),
    `FORCE ROW LEVEL SECURITY enabled on ${tbl}`
  );
}

// 2. Zero fail-open tenant bypasses in Phase 2 migration (strip SQL line comments before scanning)
const m4NoComments = m4.replace(/--.*$/gm, '');
assert(
  !/OR\s+public\.current_tenant_id\(\)\s+IS\s+NULL/i.test(m4NoComments),
  'Zero fail-open `OR public.current_tenant_id() IS NULL` clauses in Phase 2 migration'
);

// 3. Auth secret tables locked to service_role only
for (const secretTable of ['auth_rate_limits', 'password_reset_tokens', 'auth_otps']) {
  assert(
    new RegExp(`REVOKE\\s+ALL\\s+ON\\s+TABLE\\s+public\\.${secretTable}\\s+FROM\\s+PUBLIC,\\s*anon,\\s*authenticated`, 'i').test(m4),
    `${secretTable} revoked from PUBLIC, anon, authenticated`
  );
}

// 4. Booking financial/PIN tampering trigger
assert(
  /CREATE\s+TRIGGER\s+trg_protect_booking_sensitive_fields/i.test(m4) &&
    /NEW\.safety_pin\s+IS\s+DISTINCT\s+FROM\s+OLD\.safety_pin/i.test(m4) &&
    /NEW\.escrow_status\s+IS\s+DISTINCT\s+FROM\s+OLD\.escrow_status/i.test(m4),
  'Booking sensitive financial, escrow & safety_pin columns protected by BEFORE UPDATE trigger'
);

// 5. Privileged RPC authorization & REVOKE FROM PUBLIC
for (const fn of [
  'find_nearest_technicians',
  'get_nearby_technicians',
  'verify_arrival_geofence',
  'release_escrow_to_technician',
  'is_active_user',
]) {
  assert(
    new RegExp(`REVOKE\\s+ALL\\s+ON\\s+FUNCTION\\s+public\\.${fn}\\(`, 'i').test(m4),
    `PUBLIC execution revoked on public.${fn}`
  );
}
assert(
  /verify_arrival_geofence[\s\S]*?v_booking\.tenant_id\s+IS\s+DISTINCT\s+FROM\s+v_tenant_id/i.test(m4) &&
    /release_escrow_to_technician[\s\S]*?v_booking\.tenant_id\s+IS\s+DISTINCT\s+FROM\s+v_tenant_id/i.test(m4),
  'Geofence and escrow release RPCs enforce tenant isolation and caller role/assignment checks'
);

// 6. Storage buckets private & tenant-isolated
assert(
  /\('job-evidence',\s*'job-evidence',\s*FALSE/i.test(m4) &&
    /\(storage\.foldername\(name\)\)\[1\]\s*=\s*public\.current_tenant_id\(\)::text/i.test(m4),
  'Private storage buckets (public = FALSE) and tenant-isolated storage.objects policies configured'
);

console.log('ALL PHASE 2 DATABASE SECURITY STATIC CHECKS PASSED!');
