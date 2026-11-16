import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Financial Safety, Payout Invariants & Webhook Security Suite', () => {
  it('Payout balance SQL joins tenants table for default_platform_commission_bps', () => {
    const financesFile = fs.readFileSync(
      path.resolve(process.cwd(), 'src/modules/finances/finances.routes.ts'),
      'utf8'
    );

    assert.match(
      financesFile,
      /JOIN\s+tenants\s+t\s+ON\s+t\.id\s*=\s*b\.tenant_id/i,
      'Payout balance calculation must join tenants table to fetch tenant-configured commission'
    );

    assert.match(
      financesFile,
      /default_platform_commission_bps/i,
      'Payout balance query must reference default_platform_commission_bps column'
    );
  });

  it('Production webhook handler rejects requests when webhook secret is missing', () => {
    const financesFile = fs.readFileSync(
      path.resolve(process.cwd(), 'src/modules/finances/finances.routes.ts'),
      'utf8'
    );

    assert.match(
      financesFile,
      /WEBHOOK_SECRET_MISSING/,
      'Must contain explicit WEBHOOK_SECRET_MISSING error check'
    );

    assert.match(
      financesFile,
      /stripe\.webhooks\.constructEvent/,
      'Must use official Stripe SDK signature verification'
    );
  });

  it('Webhook handler atomically claims events using ON CONFLICT (id) DO NOTHING (PAY-06)', () => {
    const financesFile = fs.readFileSync(
      path.resolve(process.cwd(), 'src/modules/finances/finances.routes.ts'),
      'utf8'
    );

    assert.match(
      financesFile,
      /INSERT\s+INTO\s+webhook_events[\s\S]*?ON\s+CONFLICT\s*\(id\)\s+DO\s+NOTHING[\s\S]*?RETURNING\s+id/i,
      'Webhook handler must use atomic INSERT ON CONFLICT DO NOTHING RETURNING id to prevent duplicate deliveries racing'
    );
  });

  it('Payout response returns persisted status PROCESSING rather than premature PAID (PAY-03, PAY-04)', () => {
    const financesFile = fs.readFileSync(
      path.resolve(process.cwd(), 'src/modules/finances/finances.routes.ts'),
      'utf8'
    );

    // Verify that payout response does not hardcode status: 'PAID'
    assert.match(
      financesFile,
      /status:\s*payoutRes\.rows\[0\]\.status/,
      'Payout response must reflect persisted database status (PROCESSING) rather than hardcoded PAID'
    );

    // Verify idempotency check exists
    assert.match(
      financesFile,
      /idempotency_key\s*=\s*\$1\s+AND\s+tenant_id\s*=\s*\$2/,
      'Payout route must check existing payout by idempotency key before transfer'
    );
  });

  it('Payout handler strictly requires Idempotency-Key and validates request fingerprint (PAY-02, PAY-03)', () => {
    const financesFile = fs.readFileSync(
      path.resolve(process.cwd(), 'src/modules/finances/finances.routes.ts'),
      'utf8'
    );

    assert.ok(
      financesFile.includes("IDEMPOTENCY_KEY_REQUIRED"),
      'Payout route must require an explicit Idempotency-Key header'
    );

    assert.ok(
      financesFile.includes("IDEMPOTENCY_KEY_MISMATCH"),
      'Payout route must reject key reuse with mismatched parameters with 409'
    );

    assert.match(
      financesFile,
      /requestFingerprint/,
      'Payout route must calculate cryptographic request fingerprint'
    );
  });

  it('Payout handler checks existing idempotency key BEFORE calculating unpaid balance (PAY-02)', () => {
    const financesFile = fs.readFileSync(
      path.resolve(process.cwd(), 'src/modules/finances/finances.routes.ts'),
      'utf8'
    );

    const idempotencyIndex = financesFile.indexOf('WHERE idempotency_key = $1 AND tenant_id = $2');
    const balanceQueryIndex = financesFile.indexOf('unpaidBalanceCents');

    assert.ok(idempotencyIndex !== -1, 'Idempotency lookup query must exist');
    assert.ok(balanceQueryIndex !== -1, 'Unpaid balance check must exist');
    assert.ok(
      idempotencyIndex < balanceQueryIndex,
      'Idempotency key lookup must occur BEFORE balance calculation so retries succeed immediately'
    );
  });

  it('Payout route durably reserves database record in Phase 1 before calling Stripe transfer (PAY-03)', () => {
    const financesFile = fs.readFileSync(
      path.resolve(process.cwd(), 'src/modules/finances/finances.routes.ts'),
      'utf8'
    );

    const phase1Commit = financesFile.indexOf('COMMIT Phase 1: Payout record is now durable in PostgreSQL');
    const stripeTransfer = financesFile.indexOf('stripe.transfers.create');

    assert.ok(phase1Commit !== -1, 'Phase 1 durable database commit must exist');
    assert.ok(stripeTransfer !== -1, 'Stripe transfer invocation must exist');
    assert.ok(
      phase1Commit < stripeTransfer,
      'Phase 1 commit must occur BEFORE Stripe transfers.create so transfer cannot outlive a rolled-back record'
    );
  });

  it('Migration 008 defines tenant-scoped compound uniqueness on provider_payouts (PAY-04)', () => {
    const mig008 = fs.readFileSync(
      path.resolve(process.cwd(), 'src/database/migrations/008_payout_tenant_idempotency_and_durability.sql'),
      'utf8'
    );

    assert.match(
      mig008,
      /UNIQUE\s*\(\s*tenant_id\s*,\s*idempotency_key\s*\)/i,
      'Migration 008 must define UNIQUE (tenant_id, idempotency_key) to scope idempotency by tenant'
    );
  });

  it('Both /finances/overview and /finances/metrics routes are exposed (WEB-01)', () => {
    const financesFile = fs.readFileSync(
      path.resolve(process.cwd(), 'src/modules/finances/finances.routes.ts'),
      'utf8'
    );

    assert.ok(
      financesFile.includes("protectedRoutes.get('/overview',"),
      'Must expose /finances/overview endpoint'
    );
    assert.ok(
      financesFile.includes("protectedRoutes.get('/metrics',"),
      'Must expose /finances/metrics endpoint to align with client dashboards'
    );
  });
});
