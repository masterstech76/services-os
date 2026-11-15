const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');

function assert(cond, msg) {
  if (!cond) throw new Error(`DATA ISOLATION ERROR: ${msg}`);
  console.log(`PASS: ${msg}`);
}

// 1. Ensure production migrations contain ZERO fake/demo/seller sample records
const migrationsDir = path.join(ROOT, 'supabase', 'migrations');
const migrationFiles = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql'));
for (const file of migrationFiles) {
  const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
  assert(
    !/demo-showcase-enterprise|dev-local-sandbox|pi_demo_simulated|@servicepro-demo\.local|@servicepro-dev\.local|\[DEMO\]/i.test(sql),
    `Production migration ${file} contains zero fake or sample operational records`
  );
}

// 2. Ensure no fictional seed SQL files exist in supabase/seeds
const seedsDir = path.join(ROOT, 'supabase', 'seeds');
if (fs.existsSync(seedsDir)) {
  const seedFiles = fs.readdirSync(seedsDir).filter((f) => !f.startsWith('.'));
  assert(seedFiles.length === 0, `No fictional seed files present in supabase/seeds (found ${seedFiles.length})`);
} else {
  assert(true, 'No fictional supabase/seeds directory present');
}

// 3. Ensure frontend source & dist bundle contain zero service_role or live Stripe keys
const scanDirs = [path.join(ROOT, 'admin_web', 'src')];
const distAssets = path.join(ROOT, 'admin_web', 'dist', 'assets');
if (fs.existsSync(distAssets)) scanDirs.push(distAssets);

function walkFiles(dir) {
  let out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out = out.concat(walkFiles(full));
    else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

for (const dir of scanDirs) {
  for (const file of walkFiles(dir)) {
    const content = fs.readFileSync(file, 'utf8');
    assert(!/sk_live_[0-9a-zA-Z]+|pk_live_[0-9a-zA-Z]+/.test(content), `No live Stripe credentials in ${path.basename(file)}`);
    assert(!/SUPABASE_SERVICE_ROLE_KEY/.test(content), `No SUPABASE_SERVICE_ROLE_KEY in ${path.basename(file)}`);
  }
}

// 4. Verify handover_cleanup.cjs refuses to run without explicit --confirm-handover-cleanup
let blockedNoConfirm = false;
try {
  execSync('node scripts/handover_cleanup.cjs --seller-email=test@example.com', { cwd: ROOT, stdio: 'pipe' });
} catch {
  blockedNoConfirm = true;
}
assert(blockedNoConfirm, 'handover_cleanup.cjs requires explicit --confirm-handover-cleanup flag');

console.log('ALL ZERO-FAKE-DATA & PRE-HANDOVER ISOLATION CHECKS PASSED!');
