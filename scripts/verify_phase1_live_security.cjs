const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EVIDENCE_PATH = path.join(ROOT, 'audit_report', 'LIVE_VERIFICATION_EVIDENCE.json');
const EXPECTED_STAGING_HOST = 'rzmruyfeszkondbyxhnf.supabase.co';

const evidence = {
  generatedAt: new Date().toISOString(),
  target: `https://${EXPECTED_STAGING_HOST}`,
  environment: {
    node: process.version,
    platform: process.platform,
  },
  steps: [],
  overallStatus: 'BLOCKED',
};

function redactSecrets(text) {
  return String(text || '')
    .replace(/postgres(?:ql)?:\/\/[^\s'"]+/gi, 'postgresql://[REDACTED]')
    .replace(/sb_secret_[A-Za-z0-9_-]+/g, 'sb_secret_[REDACTED]')
    .replace(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, '[JWT_REDACTED]');
}

function runStep(id, label, cmd, displayCmd = cmd) {
  console.log(`\n[STEP ${id}] ${label}: ${displayCmd}`);
  try {
    const out = execSync(cmd, {
      cwd: ROOT,
      encoding: 'utf8',
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    const sanitized = redactSecrets(out.trim()).slice(-1200);
    console.log(sanitized);
    evidence.steps.push({ id, label, status: 'PASS', exitCode: 0, outputTail: sanitized });
    return true;
  } catch (err) {
    const stderr = ((err.stderr || '') + '\n' + (err.stdout || '') + '\n' + (err.message || '')).trim();
    const sanitized = redactSecrets(stderr).slice(-1200);
    console.error(`[FAIL/BLOCKED ${id}] ${label}:\n${sanitized}`);
    evidence.steps.push({
      id,
      label,
      status: 'BLOCKED_OR_FAILED',
      exitCode: err.status || 1,
      outputTail: sanitized,
    });
    return false;
  }
}

function writeEvidence() {
  fs.writeFileSync(EVIDENCE_PATH, JSON.stringify(evidence, null, 2));
  console.log(`\nSanitized evidence written to: ${EVIDENCE_PATH}`);
}

function validateStagingEnvironment() {
  const url = (process.env.SUPABASE_URL || '').trim();
  const anonKey = (process.env.SUPABASE_ANON_KEY || '').trim();
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  const dbUrl = (process.env.STAGING_DB_URL || '').trim();

  const missing = [];
  if (!url) missing.push('SUPABASE_URL');
  if (!anonKey) missing.push('SUPABASE_ANON_KEY');
  if (!serviceKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');
  if (!dbUrl) missing.push('STAGING_DB_URL');

  if (missing.length > 0) {
    throw new Error(
      `Missing required staging environment variables: ${missing.join(', ')}. Local Supabase fallback is disabled.`
    );
  }

  let parsedApi;
  try {
    parsedApi = new URL(url);
  } catch {
    throw new Error('SUPABASE_URL must be a valid HTTPS URL.');
  }
  if (parsedApi.protocol !== 'https:' || parsedApi.hostname !== EXPECTED_STAGING_HOST) {
    throw new Error(
      `SUPABASE_URL must target https://${EXPECTED_STAGING_HOST}. Got ${parsedApi.protocol}//${parsedApi.hostname}`
    );
  }

  let parsedDb;
  try {
    parsedDb = new URL(dbUrl);
  } catch {
    throw new Error('STAGING_DB_URL must be a valid PostgreSQL connection URI.');
  }
  if (
    parsedDb.hostname === 'localhost' ||
    parsedDb.hostname === '127.0.0.1' ||
    parsedDb.hostname === '::1'
  ) {
    throw new Error('STAGING_DB_URL cannot target localhost or 127.0.0.1.');
  }
}

console.log('=== SERVICEPRO OS — STAGING-ONLY SECURITY & LIVE DATABASE VERIFICATION ===');

const staticSqlOk = runStep('01', 'SQL Migration & 22-Table RLS Coverage Validator', 'npm run verify-env');
const staticPhase1Ok = runStep('02', 'Phase 1 Static Security Assertions', 'node scripts/test_phase1_security_checks.cjs');

let stagingEnvOk = false;
try {
  validateStagingEnvironment();
  console.log(`\n[STEP 03] Staging Target Guard: PASS (https://${EXPECTED_STAGING_HOST}, zero local DB fallback)`);
  evidence.steps.push({
    id: '03',
    label: 'Staging Target Guard',
    status: 'PASS',
    exitCode: 0,
    outputTail: `Verified staging target https://${EXPECTED_STAGING_HOST}`,
  });
  stagingEnvOk = true;
} catch (err) {
  const msg = redactSecrets(err.message);
  console.error(`\n[FAIL/BLOCKED 03] Staging Target Guard:\n${msg}`);
  evidence.steps.push({
    id: '03',
    label: 'Staging Target Guard',
    status: 'BLOCKED_OR_FAILED',
    exitCode: 1,
    outputTail: msg,
  });
}

if (!staticSqlOk || !staticPhase1Ok || !stagingEnvOk) {
  evidence.overallStatus = 'BLOCKED';
  writeEvidence();
  console.error('\nFINAL STATUS: BLOCKED (Exit Code 1) — Staging configuration or static security prerequisites failed.');
  process.exit(1);
}

const pgTapOk = runStep(
  '04',
  'Remote Staging pgTAP Database & RLS Adversarial Suite',
  'npx supabase test db --remote="$STAGING_DB_URL" --yes',
  'npx supabase test db --remote=<STAGING_DB_URL> --yes'
);
const liveAuthOk = runStep(
  '05',
  'Live Staging Supabase Auth, JWT, MFA & PostgREST RLS Suite',
  'node scripts/test_live_supabase_auth_jwt.cjs'
);

if (!pgTapOk || !liveAuthOk) {
  evidence.overallStatus = 'FAIL';
  writeEvidence();
  process.exit(1);
}

evidence.overallStatus = 'PASS';
writeEvidence();
console.log('\nFINAL STATUS: ALL STAGING LIVE SECURITY VERIFICATION CHECKS PASSED (Exit Code 0).');
