const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EVIDENCE_PATH = path.join(ROOT, 'audit_report', 'LIVE_VERIFICATION_EVIDENCE.json');

const evidence = {
  generatedAt: new Date().toISOString(),
  environment: {
    node: process.version,
    platform: process.platform,
  },
  steps: [],
  overallStatus: 'BLOCKED',
};

function runStep(id, label, cmd) {
  console.log(`\n[STEP ${id}] ${label}: ${cmd}`);
  try {
    const out = execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    const sanitized = out.trim().slice(-1200);
    console.log(sanitized);
    evidence.steps.push({ id, label, status: 'PASS', exitCode: 0, outputTail: sanitized });
    return true;
  } catch (err) {
    const stderr = ((err.stderr || '') + '\n' + (err.stdout || '') + '\n' + (err.message || '')).trim();
    const sanitized = stderr.slice(-1200);
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

console.log('=== SERVICEPRO OS — BUYER SECURITY & LIVE DATABASE VERIFICATION ===');

const staticSqlOk = runStep('01', 'SQL Migration & 21-Table RLS Coverage Validator', 'npm run verify-env');
const staticPhase1Ok = runStep('02', 'Phase 1 Static Security Assertions', 'node scripts/test_phase1_security_checks.cjs');
const supabaseCliOk = runStep('03', 'Supabase CLI Availability', 'npx supabase --version');
const dockerOk = runStep('04', 'Docker Daemon Health', 'docker info');

if (!staticSqlOk || !staticPhase1Ok || !supabaseCliOk || !dockerOk) {
  evidence.overallStatus = 'BLOCKED';
  writeEvidence();
  console.error('\nFINAL STATUS: BLOCKED (Exit Code 1) — Docker Desktop / local PostgreSQL daemon is unavailable.');
  process.exit(1);
}

const configTomlExists = fs.existsSync(path.join(ROOT, 'supabase', 'config.toml'));
if (!configTomlExists) {
  evidence.steps.push({ id: '05', label: 'supabase/config.toml Check', status: 'BLOCKED', exitCode: 1 });
  evidence.overallStatus = 'BLOCKED';
  writeEvidence();
  process.exit(1);
}

const supabaseStatusOk = runStep('05', 'Local Supabase Stack Status', 'npx supabase status');
if (!supabaseStatusOk) {
  evidence.overallStatus = 'BLOCKED';
  writeEvidence();
  console.error('\nFINAL STATUS: BLOCKED (Exit Code 1) — Run `npx supabase start` before running live verification.');
  process.exit(1);
}

const pgTapOk = runStep('06', 'pgTAP Database & RLS Adversarial Suite', 'npx supabase test db');
const liveAuthOk = runStep('07', 'Live Supabase Auth, JWT, MFA & PostgREST RLS Suite', 'node scripts/test_live_supabase_auth_jwt.cjs');

if (!pgTapOk || !liveAuthOk) {
  evidence.overallStatus = 'FAIL';
  writeEvidence();
  process.exit(1);
}

evidence.overallStatus = 'PASS';
writeEvidence();
console.log('\nFINAL STATUS: ALL LIVE SECURITY VERIFICATION CHECKS PASSED (Exit Code 0).');
