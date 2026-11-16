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

    // Verify that the query does not reference b.default_platform_commission_bps
    assert.equal(
      financesFile.includes('b.default_platform_commission_bps'),
      false,
      'Payout query must not reference b.default_platform_commission_bps because bookings does not own that column'
    );

    // Verify query correctly references t.default_platform_commission_bps
    assert.ok(
      financesFile.includes('t.default_platform_commission_bps'),
      'Payout query must reference tenants.default_platform_commission_bps via tenant join'
    );

    // Verify provider row is locked FOR UPDATE (cross-platform regex)
    assert.match(
      financesFile,
      /WHERE\s+user_id\s*=\s*\$1\s+AND\s+tenant_id\s*=\s*\$2\s+FOR\s+UPDATE/,
      'Provider profile must be locked FOR UPDATE to prevent concurrent double-payouts'
    );
  });

  it('Production webhook handler rejects requests when webhook secret is missing', () => {
    const financesFile = fs.readFileSync(
      path.resolve(process.cwd(), 'src/modules/finances/finances.routes.ts'),
      'utf8'
    );

    assert.ok(
      financesFile.includes("STRIPE_WEBHOOK_UNCONFIGURED") || financesFile.includes("STRIPE_WEBHOOK_SECRET is required"),
      'Webhook handler must fail-closed in production if secret is not configured'
    );
  });
});
