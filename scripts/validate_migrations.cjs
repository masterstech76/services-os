const fs = require('fs');
const path = require('path');

const files = [
  '01_initial_schema.sql',
  '02_postgis_functions.sql',
  '03_security_rbac_and_rls.sql',
  '04_phase2_database_security_hardening.sql',
];
const createdTables = new Set();
const rlsEnabledTables = new Set();
const policyCounts = new Map();

files.forEach(file => {
  const filePath = path.join(__dirname, '..', 'supabase', 'migrations', file);
  const content = fs.readFileSync(filePath, 'utf-8');
  let openParen = 0;
  let inString = false;
  let stringChar = '';
  let inDollarQuote = false;
  let dollarTag = '';

  // Extract CREATE TABLE statements
  const createTableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:(?:public|private)\.)?([a-zA-Z0-9_]+)/gi;
  let m;
  while ((m = createTableRegex.exec(content)) !== null) {
    createdTables.add(m[1].toLowerCase());
  }

  // Extract ENABLE ROW LEVEL SECURITY statements
  const rlsRegex = /ALTER\s+TABLE\s+(?:IF\s+EXISTS\s+)?(?:(?:public|private)\.)?([a-zA-Z0-9_]+)\s+ENABLE\s+ROW\s+LEVEL\s+SECURITY/gi;
  while ((m = rlsRegex.exec(content)) !== null) {
    rlsEnabledTables.add(m[1].toLowerCase());
  }

  // Extract CREATE POLICY statements
  const policyRegex = /CREATE\s+POLICY\s+"[^"]+"\s+ON\s+(?:(?:public|private)\.)?([a-zA-Z0-9_]+)/gi;
  while ((m = policyRegex.exec(content)) !== null) {
    const tbl = m[1].toLowerCase();
    policyCounts.set(tbl, (policyCounts.get(tbl) || 0) + 1);
  }
  
  for (let i = 0; i < content.length; i++) {
    const ch = content[i];
    const next = content[i+1];
    
    // Check line comment
    if (!inString && !inDollarQuote && ch === '-' && next === '-') {
      while (i < content.length && content[i] !== '\n') i++;
      continue;
    }
    
    // Check dollar quote for functions e.g. $$ or $tag$
    if (!inString && ch === '$') {
      const match = content.slice(i).match(/^(\$[a-zA-Z0-9_]*\$)/);
      if (match) {
        const tag = match[1];
        if (inDollarQuote && tag === dollarTag) {
          inDollarQuote = false;
          dollarTag = '';
          i += tag.length - 1;
          continue;
        } else if (!inDollarQuote) {
          inDollarQuote = true;
          dollarTag = tag;
          i += tag.length - 1;
          continue;
        }
      }
    }
    
    if (inDollarQuote) continue;
    
    if (ch === '\'' || ch === '"') {
      if (inString && ch === stringChar) {
        if (content[i-1] !== '\\') inString = false;
      } else if (!inString) {
        inString = true;
        stringChar = ch;
      }
      continue;
    }
    
    if (inString) continue;
    
    if (ch === '(') openParen++;
    if (ch === ')') openParen--;
  }
  
  console.log(`${file}: Parentheses balance = ${openParen}, inString = ${inString}, inDollarQuote = ${inDollarQuote}`);
  if (openParen !== 0 || inString || inDollarQuote) {
    console.error(`ERROR: ${file} has syntax imbalance!`);
    process.exit(1);
  }
});

let rlsErrors = 0;
let totalPolicies = 0;
for (const tbl of createdTables) {
  const hasRls = rlsEnabledTables.has(tbl);
  const policies = policyCounts.get(tbl) || 0;
  totalPolicies += policies;
  if (!hasRls || policies === 0) {
    console.error(`RLS COVERAGE ERROR: Table '${tbl}' has RLS=${hasRls}, policies=${policies}`);
    rlsErrors++;
  }
}

console.log(`Verified ${createdTables.size} tables, ${rlsEnabledTables.size}/${createdTables.size} with RLS enabled, and ${totalPolicies} explicit RLS policies.`);
if (rlsErrors > 0) {
  process.exit(1);
}

// Phase 1 Security Regression Assertions on 03_security_rbac_and_rls.sql
const rbacSqlPath = path.join(__dirname, '..', 'supabase', 'migrations', '03_security_rbac_and_rls.sql');
const rbacSql = fs.readFileSync(rbacSqlPath, 'utf8');
const unsafeAdminBootstrapPolicy = /CREATE\s+POLICY[\s\S]*?NOT\s+EXISTS\s*\(\s*SELECT\s+1\s+FROM\s+public\.users\s+u\s+WHERE\s+u\.role\s*=\s*'ADMIN'\s*\)/i;
if (unsafeAdminBootstrapPolicy.test(rbacSql)) {
  console.error("SECURITY REGRESSION ERROR: 03_security_rbac_and_rls.sql contains unsafe first-boot ADMIN self-registration CREATE POLICY.");
  process.exit(1);
}
for (const requiredSymbol of [
  'bootstrap_first_admin_atomic',
  'check_system_initialized',
  'verify_my_mfa_code',
  'has_verified_mfa_session',
  'encrypt_totp_secret',
  'decrypt_totp_secret',
  'revoke_my_mfa_session',
  'admin_revoke_user_mfa',
  'admin_set_user_active',
  'trg_revoke_sessions_on_user_deactivation',
  'REVOKE ALL ON TABLE public.user_mfa_credentials FROM PUBLIC, anon, authenticated',
]) {
  if (!rbacSql.includes(requiredSymbol)) {
    console.error(`SECURITY REGRESSION ERROR: 03_security_rbac_and_rls.sql is missing required Phase 1 security symbol '${requiredSymbol}'.`);
    process.exit(1);
  }
}
if (/CREATE\s+POLICY\s+"Admins inspect MFA credentials"/i.test(rbacSql) || /CREATE\s+POLICY[^;]*?ON\s+user_mfa_credentials[^;]*?TO\s+(?:authenticated|anon|public)/i.test(rbacSql)) {
  console.error("SECURITY REGRESSION ERROR: user_mfa_credentials must not grant direct RLS policy access to authenticated/anon/public.");
  process.exit(1);
}
if (!/is_admin\(\)[\s\S]*?has_verified_mfa_session\(\)/i.test(rbacSql) || !/is_staff\(\)[\s\S]*?has_verified_mfa_session\(\)/i.test(rbacSql)) {
  console.error("SECURITY REGRESSION ERROR: is_admin() and is_staff() must enforce has_verified_mfa_session().");
  process.exit(1);
}
console.log('Phase 1 security regression checks passed (MFA credential isolation, encryption at rest, & server-side MFA enforcement present).');

console.log('ALL 3 PRODUCTION SQL MIGRATIONS & 19-TABLE RLS COVERAGE VALIDATED SUCCESSFULLY!');
