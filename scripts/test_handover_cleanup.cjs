/**
 * ServicePro OS — Isolated Fixture Tests for Secure Seller Handover Cleanup
 *
 * Tests all 12 safety & transactional rollback scenarios in memory without
 * touching any real database or creating fake records in the application.
 */

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { runHandoverCleanup } = require('./handover_cleanup.cjs');

function createFixtureDb(initialState) {
  let state = JSON.parse(JSON.stringify(initialState));
  let failOnTable = null;

  function makeAdapter(txState) {
    return {
      findUsersByEmail: async (email) => txState.users.filter((u) => u.email.toLowerCase() === email),
      findUsersByTenant: async (tid) => txState.users.filter((u) => u.tenant_id === tid),
      findBookingsInvolvingUser: async (uid) =>
        txState.bookings.filter((b) => b.customer_id === uid || b.provider_id === uid),
      countPaymentsForUser: async (uid) =>
        txState.payments.filter((p) => p.customer_id === uid || p.provider_id === uid).length,
      countAuditLogsForUser: async (uid) => txState.audit_logs.filter((a) => a.actor_id === uid).length,
      countByBookingIds: async (tbl, ids) => (txState[tbl] || []).filter((r) => ids.includes(r.booking_id)).length,
      countByUserId: async (tbl, col, uid) => (txState[tbl] || []).filter((r) => r[col] === uid).length,
      deleteByBookingIds: async (tbl, ids) => {
        if (failOnTable === tbl) return { error: `Injected failure on ${tbl}` };
        const before = txState[tbl].length;
        txState[tbl] = txState[tbl].filter((r) => !ids.includes(r.booking_id));
        return { deletedCount: before - txState[tbl].length };
      },
      deleteBookingsByIds: async (ids) => {
        if (failOnTable === 'bookings') return { error: 'Injected failure on bookings' };
        const before = txState.bookings.length;
        txState.bookings = txState.bookings.filter((b) => !ids.includes(b.id));
        return { deletedCount: before - txState.bookings.length };
      },
      deleteByUserId: async (tbl, col, uid) => {
        if (failOnTable === tbl) return { error: `Injected failure on ${tbl}` };
        const before = txState[tbl].length;
        txState[tbl] = txState[tbl].filter((r) => r[col] !== uid);
        return { deletedCount: before - txState[tbl].length };
      },
      deleteUserRow: async (uid) => {
        if (failOnTable === 'users') return { error: 'Injected failure on users' };
        const before = txState.users.length;
        txState.users = txState.users.filter((u) => u.id !== uid);
        return { deletedCount: before - txState.users.length };
      },
    };
  }

  return {
    ...makeAdapter(state),
    getState: () => state,
    setFailOnTable: (tbl) => {
      failOnTable = tbl;
    },
    runInTransaction: async (fn) => {
      const snapshot = JSON.parse(JSON.stringify(state));
      try {
        await fn(makeAdapter(state));
      } catch (err) {
        state = snapshot; // Rollback on any error
        throw err;
      }
    },
  };
}

function baseFixture() {
  return {
    tenants: [{ id: 'tenant-1', name: 'Shared Org' }],
    users: [
      { id: 'seller-1', tenant_id: 'tenant-1', email: 'seller@test.local', role: 'ADMIN' },
      { id: 'buyer-1', tenant_id: 'tenant-1', email: 'buyer@test.local', role: 'ADMIN' },
      { id: 'cust-1', tenant_id: 'tenant-1', email: 'customer@test.local', role: 'CUSTOMER' },
    ],
    categories: [{ id: 'cat-1', tenant_id: 'tenant-1' }],
    services: [{ id: 'svc-1', category_id: 'cat-1' }],
    inventory_items: [{ id: 'inv-1', tenant_id: 'tenant-1' }],
    bookings: [
      { id: 'bk-seller-only', tenant_id: 'tenant-1', customer_id: 'seller-1', provider_id: 'seller-1' },
      { id: 'bk-unrelated', tenant_id: 'tenant-1', customer_id: 'cust-1', provider_id: null },
    ],
    booking_parts: [{ id: 'bp-1', booking_id: 'bk-seller-only' }],
    job_evidence: [{ id: 'je-1', booking_id: 'bk-seller-only' }],
    reviews: [{ id: 'rev-1', booking_id: 'bk-seller-only' }],
    customer_addresses: [{ id: 'addr-1', customer_id: 'seller-1' }],
    customer_profiles: [{ id: 'cp-1', user_id: 'seller-1' }],
    provider_profiles: [{ id: 'pp-1', user_id: 'seller-1' }],
    password_reset_tokens: [{ id: 'prt-1', user_id: 'seller-1' }],
    user_mfa_sessions: [{ id: 'ms-1', user_id: 'seller-1' }],
    user_mfa_credentials: [{ id: 'mc-1', user_id: 'seller-1' }],
    payments: [],
    audit_logs: [],
  };
}

async function runTests() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'servicepro-cleanup-test-'));
  const backupFile = path.join(tmpDir, 'pre_cleanup_backup.json');
  fs.writeFileSync(
    backupFile,
    JSON.stringify({
      format: 'servicepro-os-backup',
      exportedAt: new Date().toISOString(),
      tables: {
        tenants: baseFixture().tenants,
        users: baseFixture().users,
      },
    })
  );
  const corruptBackupFile = path.join(tmpDir, 'corrupt_backup.json');
  fs.writeFileSync(corruptBackupFile, '{bad-json');
  const reportPath = path.join(tmpDir, 'cleanup_report.json');

  // 1-5: Dry-run with multi-user tenant, buyer account, unrelated customer, shared catalog, seller-owned records
  const db1 = createFixtureDb(baseFixture());
  const dryReport = await runHandoverCleanup({
    argv: ['node', 'handover_cleanup.cjs', '--dry-run', '--seller-email=seller@test.local'],
    env: { SUPABASE_URL: 'http://127.0.0.1:54321', NODE_ENV: 'development' },
    db: db1,
    reportPath,
  });
  assert.strictEqual(dryReport.mode, 'DRY_RUN');
  assert.strictEqual(dryReport.proposedCounts.users, 1);
  assert.strictEqual(dryReport.protectedCounts.other_tenant_users, 2);
  assert.strictEqual(db1.getState().users.length, 3, 'Dry-run must not mutate DB');
  console.log('PASS: Dry-run previews seller-only counts & protects tenant/buyer/unrelated customer');

  // Execute cleanup with valid external backup -> deletes ONLY seller-1 & seller-exclusive records
  const execReport = await runHandoverCleanup({
    argv: [
      'node',
      'handover_cleanup.cjs',
      '--confirm-handover-cleanup',
      '--seller-email=seller@test.local',
      `--backup-file=${backupFile}`,
    ],
    env: { SUPABASE_URL: 'http://127.0.0.1:54321', NODE_ENV: 'development' },
    db: db1,
    reportPath,
  });
  assert.strictEqual(execReport.finalStatus, 'SUCCESS');
  assert.strictEqual(db1.getState().tenants.length, 1, 'Tenant record MUST NEVER be deleted');
  assert.strictEqual(db1.getState().users.length, 2, 'Buyer & unrelated customer MUST remain');
  assert.strictEqual(db1.getState().bookings.length, 1, 'Unrelated booking MUST remain');
  assert.strictEqual(db1.getState().categories.length, 1, 'Shared catalog MUST remain');
  console.log('PASS: Execution deletes only seller-owned rows and preserves tenant/buyer/customer/shared catalog');

  // 6: Shared booking / retained payment / audit_log FK protection
  const fkState = baseFixture();
  fkState.bookings.push({ id: 'bk-shared', tenant_id: 'tenant-1', customer_id: 'cust-1', provider_id: 'seller-1' });
  fkState.payments.push({ id: 'pay-1', customer_id: 'seller-1' });
  fkState.audit_logs.push({ id: 'aud-1', actor_id: 'seller-1' });
  const dbFk = createFixtureDb(fkState);
  await assert.rejects(
    () =>
      runHandoverCleanup({
        argv: [
          'node',
          'handover_cleanup.cjs',
          '--confirm-handover-cleanup',
          '--seller-email=seller@test.local',
          `--backup-file=${backupFile}`,
        ],
        env: { SUPABASE_URL: 'http://127.0.0.1:54321', NODE_ENV: 'development' },
        db: dbFk,
        reportPath,
      }),
    /BLOCKED_UNRESOLVED_FK/
  );
  console.log('PASS: Shared bookings, retained payments, and audit logs block unsafe user deletion');

  // 7: Backup failure (missing / empty / inside git repo)
  await assert.rejects(
    () =>
      runHandoverCleanup({
        argv: ['node', 'handover_cleanup.cjs', '--confirm-handover-cleanup', '--seller-email=seller@test.local'],
        env: { SUPABASE_URL: 'http://127.0.0.1:54321', NODE_ENV: 'development' },
        db: createFixtureDb(baseFixture()),
        reportPath,
      }),
    /BLOCKED_MISSING_BACKUP/
  );
  console.log('PASS: Missing backup blocks execution');

  // 8: Production URL & NODE_ENV=production rejected
  await assert.rejects(
    () =>
      runHandoverCleanup({
        argv: ['node', 'handover_cleanup.cjs', '--dry-run', '--seller-email=seller@test.local'],
        env: { SUPABASE_URL: 'https://realprod.supabase.co', NODE_ENV: 'development' },
        db: createFixtureDb(baseFixture()),
        reportPath,
      }),
    /BLOCKED_HOSTED_OR_UNKNOWN_URL/
  );
  await assert.rejects(
    () =>
      runHandoverCleanup({
        argv: ['node', 'handover_cleanup.cjs', '--dry-run', '--seller-email=seller@test.local'],
        env: { SUPABASE_URL: 'http://127.0.0.1:54321', NODE_ENV: 'production' },
        db: createFixtureDb(baseFixture()),
        reportPath,
      }),
    /BLOCKED_PRODUCTION_ENV/
  );
  console.log('PASS: Production URL and NODE_ENV=production rejected');

  // 9-10: Missing seller identity & ambiguous/non-seller ownership
  await assert.rejects(
    () =>
      runHandoverCleanup({
        argv: ['node', 'handover_cleanup.cjs', '--dry-run', '--seller-email=missing@test.local'],
        env: { SUPABASE_URL: 'http://127.0.0.1:54321', NODE_ENV: 'development' },
        db: createFixtureDb(baseFixture()),
        reportPath,
      }),
    /BLOCKED_SELLER_NOT_FOUND/
  );
  await assert.rejects(
    () =>
      runHandoverCleanup({
        argv: ['node', 'handover_cleanup.cjs', '--dry-run', '--seller-email=customer@test.local'],
        env: { SUPABASE_URL: 'http://127.0.0.1:54321', NODE_ENV: 'development' },
        db: createFixtureDb(baseFixture()),
        reportPath,
      }),
    /BLOCKED_NON_SELLER_ROLE/
  );
  console.log('PASS: Missing seller and non-seller/customer account rejected');

  // 11-12: Partial deletion failure triggers full transaction rollback
  const dbRollback = createFixtureDb(baseFixture());
  dbRollback.setFailOnTable('users');
  await assert.rejects(
    () =>
      runHandoverCleanup({
        argv: [
          'node',
          'handover_cleanup.cjs',
          '--confirm-handover-cleanup',
          '--seller-email=seller@test.local',
          `--backup-file=${backupFile}`,
        ],
        env: { SUPABASE_URL: 'http://127.0.0.1:54321', NODE_ENV: 'development' },
        db: dbRollback,
        reportPath,
      }),
    /Injected failure on users/
  );
  assert.strictEqual(dbRollback.getState().bookings.length, 2, 'Rollback MUST restore deleted child bookings');
  assert.strictEqual(dbRollback.getState().users.length, 3, 'Rollback MUST restore users');
  console.log('PASS: Partial deletion failure rolls back entire transaction cleanly');

  // 13: Corrupted / non-restorable backup rejected
  await assert.rejects(
    () =>
      runHandoverCleanup({
        argv: [
          'node',
          'handover_cleanup.cjs',
          '--confirm-handover-cleanup',
          '--seller-email=seller@test.local',
          `--backup-file=${corruptBackupFile}`,
        ],
        env: { SUPABASE_URL: 'http://127.0.0.1:54321', NODE_ENV: 'development' },
        db: createFixtureDb(baseFixture()),
        reportPath,
      }),
    /BLOCKED_INVALID_BACKUP_FORMAT/
  );
  console.log('PASS: Corrupted / non-restorable backup file rejected');

  // 14: Single PostgreSQL server-side atomic RPC transaction adapter path
  const rpcReport = await runHandoverCleanup({
    argv: [
      'node',
      'handover_cleanup.cjs',
      '--confirm-handover-cleanup',
      '--seller-email=seller@test.local',
      `--backup-file=${backupFile}`,
    ],
    env: { SUPABASE_URL: 'http://127.0.0.1:54321', NODE_ENV: 'development' },
    db: {
      executeAtomicCleanupRpc: async (email, isDryRun) => ({
        atomic_transaction: true,
        mode: isDryRun ? 'DRY_RUN' : 'EXECUTE',
        target_seller_id: 'seller-1',
        target_seller_role: 'ADMIN',
        target_tenant_id: 'tenant-1',
        proposed_counts: { users: 1 },
        actual_deleted_counts: { users: 1 },
        protected_counts: { tenants: 1, other_tenant_users: 2 },
        final_status: 'SUCCESS',
      }),
    },
    reportPath,
  });
  assert.strictEqual(rpcReport.atomicTransaction, true);
  assert.strictEqual(rpcReport.finalStatus, 'SUCCESS');
  assert.ok(rpcReport.backupStatus.sha256 && rpcReport.backupStatus.sha256.length === 64);
  console.log('PASS: Atomic PostgreSQL RPC adapter path & backup SHA-256 verification passed');

  fs.rmSync(tmpDir, { recursive: true, force: true });
  console.log('ALL 14 HANDOVER CLEANUP SAFETY & ROLLBACK TESTS PASSED!');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
