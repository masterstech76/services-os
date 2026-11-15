/**
 * ServicePro OS — Secure Seller Handover Cleanup Script
 *
 * STRICT SAFETY GUARANTEES:
 *   1. NEVER deletes `tenants`, `categories`, `services`, `inventory_items`,
 *      `audit_logs`, `security_audit_logs`, `payments`, or other users/buyers.
 *   2. Identifies ONLY records exclusively owned by the verified `--seller-email`.
 *   3. Refuses to delete shared records (e.g. bookings involving another user)
 *      or users still referenced by retained `payments` / `audit_logs`.
 *   4. Requires `--dry-run` OR (`--confirm-handover-cleanup` + verified external
 *      `--backup-file=<path>` outside the repository).
 *   5. Rejects production URLs / production environments by default.
 *   6. Writes a sanitized JSON report to `audit_report/SELLER_HANDOVER_CLEANUP_REPORT.json`.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const DEFAULT_REPORT_PATH = path.join(ROOT, 'audit_report', 'SELLER_HANDOVER_CLEANUP_REPORT.json');

const PROTECTED_SHARED_AND_RETENTION_TABLES = [
  'tenants',
  'categories',
  'services',
  'inventory_items',
  'payments',
  'audit_logs',
  'security_audit_logs',
];

function parseArg(argv, prefix) {
  const found = argv.find((a) => a.startsWith(prefix));
  return found ? found.slice(prefix.length).trim() : '';
}

function isLocalUrl(url) {
  if (!url) return false;
  return /^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?(\/|$)/i.test(url.trim());
}

function validateTargetEnvironment({ url, nodeEnv, viteEnv, allowRemoteNonProd, targetEnvName }) {
  if (nodeEnv === 'production' || viteEnv === 'production') {
    throw new Error('BLOCKED_PRODUCTION_ENV: Cleanup is forbidden when NODE_ENV or VITE_APP_ENV is production.');
  }
  if (!url) {
    throw new Error('BLOCKED_UNKNOWN_DB: Database URL is missing.');
  }
  if (!isLocalUrl(url)) {
    const looksHostedSupabase = /\.supabase\.(co|in)/i.test(url);
    if (looksHostedSupabase || !allowRemoteNonProd) {
      if (allowRemoteNonProd !== 'true' || !targetEnvName || /^(prod|production)$/i.test(targetEnvName)) {
        throw new Error(
          'BLOCKED_HOSTED_OR_UNKNOWN_URL: Refusing cleanup against non-local or production-like URL without explicit non-production staging authorization.'
        );
      }
    }
  }
  return isLocalUrl(url) ? 'local-supabase' : `staging:${targetEnvName}`;
}

function verifyBackupFile(backupPath, repoRoot = ROOT) {
  if (!backupPath) {
    throw new Error('BLOCKED_MISSING_BACKUP: --backup-file=<path> is required before any non-dry-run deletion.');
  }
  const resolvedBackup = path.resolve(backupPath);
  const resolvedRoot = path.resolve(repoRoot);
  if (resolvedBackup.toLowerCase().startsWith(resolvedRoot.toLowerCase() + path.sep)) {
    throw new Error('BLOCKED_UNSAFE_BACKUP_PATH: Backup file must be stored OUTSIDE the Git repository.');
  }
  if (!fs.existsSync(resolvedBackup)) {
    throw new Error(`BLOCKED_BACKUP_NOT_FOUND: Backup file does not exist at ${resolvedBackup}.`);
  }
  const stat = fs.statSync(resolvedBackup);
  if (!stat.isFile() || stat.size === 0) {
    throw new Error('BLOCKED_EMPTY_BACKUP: Backup file is empty or unreadable.');
  }

  const rawBuffer = fs.readFileSync(resolvedBackup);
  const fileSha256 = crypto.createHash('sha256').update(rawBuffer).digest('hex');
  const ext = path.extname(resolvedBackup).toLowerCase();

  if (ext === '.json') {
    let parsed;
    try {
      parsed = JSON.parse(rawBuffer.toString('utf8'));
    } catch {
      throw new Error('BLOCKED_INVALID_BACKUP_FORMAT: JSON backup file is malformed and cannot be restored.');
    }
    if (!parsed || typeof parsed !== 'object' || !parsed.tables || !Array.isArray(parsed.tables.tenants) || !Array.isArray(parsed.tables.users)) {
      throw new Error('BLOCKED_INVALID_BACKUP_FORMAT: JSON backup must contain restorable tables.tenants and tables.users arrays.');
    }
    if (parsed.sha256 && parsed.sha256 !== fileSha256) {
      throw new Error('BLOCKED_CORRUPT_BACKUP_CHECKSUM: Backup SHA-256 checksum mismatch.');
    }
    return { verified: true, format: 'json', sizeBytes: stat.size, sha256: fileSha256, restorableTables: Object.keys(parsed.tables).length };
  }

  if (ext === '.sql' || ext === '.dump') {
    const head = rawBuffer.slice(0, Math.min(rawBuffer.length, 65536)).toString('utf8');
    const hasDumpMarker =
      head.startsWith('PGDMP') ||
      /\b(CREATE\s+TABLE|INSERT\s+INTO|COPY\s+public\.)/i.test(head);
    if (!hasDumpMarker) {
      throw new Error('BLOCKED_INVALID_BACKUP_FORMAT: SQL/dump backup does not contain valid PostgreSQL schema or data markers.');
    }
    return { verified: true, format: ext.slice(1), sizeBytes: stat.size, sha256: fileSha256 };
  }

  throw new Error(`BLOCKED_INVALID_BACKUP_FORMAT: Unsupported backup extension '${ext || 'none'}'. Use .json, .sql, or .dump.`);
}

/**
 * Inspects seller ownership and builds a strict, dependency-ordered deletion plan.
 * `db` is an adapter implementing `queryTable(table, filter)` and `runInTransaction(fn)`.
 */
async function planSellerCleanup(db, sellerEmail) {
  if (!sellerEmail || !sellerEmail.includes('@')) {
    throw new Error('BLOCKED_MISSING_SELLER_IDENTITY: A valid --seller-email=<email> is required.');
  }
  const normalizedEmail = sellerEmail.trim().toLowerCase();
  const matchingUsers = await db.findUsersByEmail(normalizedEmail);

  if (!matchingUsers || matchingUsers.length === 0) {
    throw new Error(`BLOCKED_SELLER_NOT_FOUND: No user found for ${normalizedEmail}.`);
  }
  if (matchingUsers.length > 1) {
    throw new Error(`BLOCKED_AMBIGUOUS_SELLER: Multiple user records matched ${normalizedEmail}.`);
  }

  const seller = matchingUsers[0];
  if (seller.role !== 'ADMIN' && seller.role !== 'STAFF') {
    throw new Error(
      `BLOCKED_NON_SELLER_ROLE: Account role '${seller.role}' is not an Admin/Staff seller account; refusing to delete customer/buyer/technician account.`
    );
  }

  const tenantUsers = await db.findUsersByTenant(seller.tenant_id);
  const otherTenantUsers = tenantUsers.filter((u) => u.id !== seller.id);

  // Inspect bookings & child records referencing seller
  const allBookings = await db.findBookingsInvolvingUser(seller.id);
  const sellerExclusiveBookingIds = [];
  const sharedBookingIds = [];

  for (const b of allBookings) {
    const custIsSeller = b.customer_id === seller.id;
    const provIsSellerOrNull = b.provider_id === null || b.provider_id === seller.id;
    const provIsSeller = b.provider_id === seller.id;
    const custIsSellerOnly = b.customer_id === seller.id;
    if ((custIsSeller && provIsSellerOrNull) || (provIsSeller && custIsSellerOnly)) {
      sellerExclusiveBookingIds.push(b.id);
    } else {
      sharedBookingIds.push(b.id);
    }
  }

  // Retained tables referencing seller (financial + immutable audit)
  const sellerPayments = await db.countPaymentsForUser(seller.id);
  const sellerAuditLogs = await db.countAuditLogsForUser(seller.id);
  const unresolvedFkDependencies = [];

  if (sharedBookingIds.length > 0) {
    unresolvedFkDependencies.push(`bookings: ${sharedBookingIds.length} shared booking(s) involve another user/buyer and are protected.`);
  }
  if (sellerPayments > 0) {
    unresolvedFkDependencies.push(`payments: ${sellerPayments} retained financial record(s) reference seller user_id.`);
  }
  if (sellerAuditLogs > 0) {
    unresolvedFkDependencies.push(`audit_logs: ${sellerAuditLogs} retained audit record(s) reference seller actor_id.`);
  }

  // Exact FK-safe deletion plan (only exclusively seller-owned temporary rows)
  const counts = {
    booking_parts: await db.countByBookingIds('booking_parts', sellerExclusiveBookingIds),
    job_evidence: await db.countByBookingIds('job_evidence', sellerExclusiveBookingIds),
    reviews: await db.countByBookingIds('reviews', sellerExclusiveBookingIds),
    bookings: sellerExclusiveBookingIds.length,
    customer_addresses: await db.countByUserId('customer_addresses', 'customer_id', seller.id),
    customer_profiles: await db.countByUserId('customer_profiles', 'user_id', seller.id),
    provider_profiles: await db.countByUserId('provider_profiles', 'user_id', seller.id),
    password_reset_tokens: await db.countByUserId('password_reset_tokens', 'user_id', seller.id),
    user_mfa_sessions: await db.countByUserId('user_mfa_sessions', 'user_id', seller.id),
    user_mfa_credentials: await db.countByUserId('user_mfa_credentials', 'user_id', seller.id),
    users: unresolvedFkDependencies.length === 0 ? 1 : 0,
  };

  const protectedCounts = {
    tenants: 1,
    other_tenant_users: otherTenantUsers.length,
    shared_bookings: sharedBookingIds.length,
    payments: sellerPayments,
    audit_logs: sellerAuditLogs,
    shared_catalog_and_audit_tables: PROTECTED_SHARED_AND_RETENTION_TABLES,
  };

  return {
    seller: { id: seller.id, role: seller.role, tenant_id: seller.tenant_id },
    sellerExclusiveBookingIds,
    counts,
    protectedCounts,
    unresolvedFkDependencies,
    canDeleteUserRow: unresolvedFkDependencies.length === 0,
  };
}

async function runHandoverCleanup(options) {
  const {
    argv = process.argv,
    env = process.env,
    db,
    reportPath = DEFAULT_REPORT_PATH,
    repoRoot = ROOT,
  } = options;

  const isDryRun = argv.includes('--dry-run');
  const isConfirmed = argv.includes('--confirm-handover-cleanup');
  const sellerEmail = parseArg(argv, '--seller-email=');
  const backupPath = parseArg(argv, '--backup-file=');

  if (!isDryRun && !isConfirmed) {
    throw new Error('BLOCKED_CONFIRMATION_REQUIRED: Pass --dry-run to preview or --confirm-handover-cleanup to execute.');
  }

  const sanitizedEnv = validateTargetEnvironment({
    url: env.SUPABASE_URL,
    nodeEnv: env.NODE_ENV,
    viteEnv: env.VITE_APP_ENV,
    allowRemoteNonProd: env.ALLOW_NON_PROD_REMOTE_CLEANUP,
    targetEnvName: env.TARGET_ENVIRONMENT_NAME,
  });

  let backupStatus = { verified: false, mode: isDryRun ? 'dry-run-skipped' : 'required' };
  if (!isDryRun) {
    backupStatus = verifyBackupFile(backupPath, repoRoot);
  }

  // Path A: Single PostgreSQL server-side atomic RPC transaction (production/staging CLI path)
  if (db && typeof db.executeAtomicCleanupRpc === 'function') {
    if (!sellerEmail || !sellerEmail.includes('@')) {
      throw new Error('BLOCKED_MISSING_SELLER_IDENTITY: A valid --seller-email=<email> is required.');
    }
    const rpcResult = await db.executeAtomicCleanupRpc(sellerEmail.trim().toLowerCase(), isDryRun);
    const report = {
      timestamp: new Date().toISOString(),
      environment: sanitizedEnv,
      atomicTransaction: Boolean(rpcResult.atomic_transaction),
      targetSellerId: rpcResult.target_seller_id,
      targetSellerRole: rpcResult.target_seller_role,
      targetTenantId: rpcResult.target_tenant_id,
      mode: isDryRun ? 'DRY_RUN' : 'EXECUTE',
      proposedCounts: rpcResult.proposed_counts || {},
      actualDeletedCounts: rpcResult.actual_deleted_counts || {},
      protectedCounts: rpcResult.protected_counts || {},
      unresolvedFkDependencies: [],
      backupStatus,
      failedOperations: [],
      finalStatus: rpcResult.final_status || (isDryRun ? 'DRY_RUN_COMPLETE' : 'SUCCESS'),
    };
    if (reportPath) fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    return report;
  }

  const plan = await planSellerCleanup(db, sellerEmail);
  const report = {
    timestamp: new Date().toISOString(),
    environment: sanitizedEnv,
    targetSellerId: plan.seller.id,
    targetSellerRole: plan.seller.role,
    targetTenantId: plan.seller.tenant_id,
    mode: isDryRun ? 'DRY_RUN' : 'EXECUTE',
    proposedCounts: plan.counts,
    actualDeletedCounts: {},
    protectedCounts: plan.protectedCounts,
    unresolvedFkDependencies: plan.unresolvedFkDependencies,
    backupStatus,
    failedOperations: [],
    finalStatus: isDryRun ? 'DRY_RUN_COMPLETE' : 'PENDING',
  };

  if (isDryRun) {
    if (reportPath) fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    return report;
  }

  if (plan.unresolvedFkDependencies.length > 0) {
    report.finalStatus = 'BLOCKED_UNRESOLVED_FK_OR_RETENTION';
    report.failedOperations.push('Aborted: unresolved FK or retained financial/audit dependencies protect seller user row.');
    if (reportPath) fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    throw new Error(`BLOCKED_UNRESOLVED_FK: ${plan.unresolvedFkDependencies.join(' | ')}`);
  }

  // Execute strictly inside a transaction; any error triggers rollback
  try {
    await db.runInTransaction(async (tx) => {
      const steps = [
        ['booking_parts', () => tx.deleteByBookingIds('booking_parts', plan.sellerExclusiveBookingIds)],
        ['job_evidence', () => tx.deleteByBookingIds('job_evidence', plan.sellerExclusiveBookingIds)],
        ['reviews', () => tx.deleteByBookingIds('reviews', plan.sellerExclusiveBookingIds)],
        ['bookings', () => tx.deleteBookingsByIds(plan.sellerExclusiveBookingIds)],
        ['customer_addresses', () => tx.deleteByUserId('customer_addresses', 'customer_id', plan.seller.id)],
        ['customer_profiles', () => tx.deleteByUserId('customer_profiles', 'user_id', plan.seller.id)],
        ['provider_profiles', () => tx.deleteByUserId('provider_profiles', 'user_id', plan.seller.id)],
        ['password_reset_tokens', () => tx.deleteByUserId('password_reset_tokens', 'user_id', plan.seller.id)],
        ['user_mfa_sessions', () => tx.deleteByUserId('user_mfa_sessions', 'user_id', plan.seller.id)],
        ['user_mfa_credentials', () => tx.deleteByUserId('user_mfa_credentials', 'user_id', plan.seller.id)],
        ['users', () => tx.deleteUserRow(plan.seller.id)],
      ];

      for (const [table, fn] of steps) {
        const res = await fn();
        if (res?.error) {
          throw new Error(`Delete failed on ${table}: ${res.error}`);
        }
        report.actualDeletedCounts[table] = res?.deletedCount ?? 0;
      }
    });

    // Post-deletion verification
    const remainingSeller = await db.findUsersByEmail(sellerEmail.trim().toLowerCase());
    if (remainingSeller.length > 0) {
      throw new Error('POST_DELETION_VERIFICATION_FAILED: Seller user record still present.');
    }
    report.finalStatus = 'SUCCESS';
  } catch (err) {
    report.finalStatus = 'ROLLED_BACK_ON_ERROR';
    report.failedOperations.push(err.message || String(err));
    if (reportPath) fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    throw err;
  }

  if (reportPath) fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  return report;
}

function createSupabaseAtomicRpcAdapter({ url, serviceRoleKey }) {
  if (!url || !serviceRoleKey) {
    throw new Error('BLOCKED_MISSING_CREDENTIALS: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for live RPC execution.');
  }
  const baseUrl = url.replace(/\/+$/, '');
  return {
    executeAtomicCleanupRpc: async (sellerEmail, isDryRun) => {
      const response = await fetch(`${baseUrl}/rest/v1/rpc/cleanup_seller_test_records_atomic`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        body: JSON.stringify({
          p_seller_email: sellerEmail,
          p_dry_run: Boolean(isDryRun),
        }),
      });
      const text = await response.text();
      let payload;
      try {
        payload = text ? JSON.parse(text) : null;
      } catch {
        payload = { message: text };
      }
      if (!response.ok) {
        const msg = payload?.message || payload?.error || text || `HTTP ${response.status}`;
        throw new Error(`ATOMIC_RPC_FAILED: ${msg}`);
      }
      return payload;
    },
  };
}

if (require.main === module) {
  (async () => {
    const adapter = createSupabaseAtomicRpcAdapter({
      url: process.env.SUPABASE_URL,
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    });
    const report = await runHandoverCleanup({
      argv: process.argv,
      env: process.env,
      db: adapter,
    });
    console.log(JSON.stringify(report, null, 2));
  })().catch((err) => {
    console.error(err.message || err);
    process.exit(1);
  });
}

module.exports = {
  PROTECTED_SHARED_AND_RETENTION_TABLES,
  validateTargetEnvironment,
  verifyBackupFile,
  planSellerCleanup,
  runHandoverCleanup,
  createSupabaseAtomicRpcAdapter,
};
