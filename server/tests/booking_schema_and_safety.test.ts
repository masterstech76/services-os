import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Booking Security, Safety PIN & Schema Integrity Suite', () => {
  it('GET /bookings list route SQL excludes customer_safety_pin', () => {
    const routeFile = fs.readFileSync(
      path.resolve(process.cwd(), 'src/modules/bookings/bookings.routes.ts'),
      'utf8'
    );

    // Find the GET / route query definition
    const getListSection = routeFile.slice(routeFile.indexOf("fastify.get('/',"), routeFile.indexOf("fastify.get('/:id',"));
    assert.ok(getListSection.length > 0);

    // customer_safety_pin must NOT be in the SELECT projection of the list route
    assert.equal(
      getListSection.includes('b.customer_safety_pin'),
      false,
      'Safety PIN must NEVER be included in paginated bookings list queries'
    );
  });

  it('Forward patch migration 007 adds invoices updated_at and supports VOIDED status', () => {
    const migrationSql = fs.readFileSync(
      path.resolve(process.cwd(), 'src/database/migrations/007_finance_invoices_patch.sql'),
      'utf8'
    );

    // Check invoices table has updated_at patch
    assert.match(
      migrationSql,
      /ADD\s+COLUMN\s+IF\s+NOT\s+EXISTS\s+updated_at\s+TIMESTAMPTZ\s+DEFAULT\s+NOW\(\)/,
      'Forward patch migration 007 must add updated_at column to invoices'
    );

    // Check payment_transactions table status constraint allows VOIDED
    assert.match(
      migrationSql,
      /'VOIDED'/,
      'Forward patch migration 007 must allow VOIDED in payment_transactions'
    );
  });

  it('POST /:id/confirm-payment verifies PaymentIntent hold with Stripe before marking AUTHORIZED (PAY-01)', () => {
    const routeFile = fs.readFileSync(
      path.resolve(process.cwd(), 'src/modules/bookings/bookings.routes.ts'),
      'utf8'
    );

    assert.ok(
      routeFile.includes("fastify.post('/:id/confirm-payment'"),
      'Must define explicit confirmation endpoint for client-side completed Stripe holds'
    );

    assert.match(
      routeFile,
      /stripe\.paymentIntents\.retrieve/,
      'Must verify PaymentIntent status with Stripe before marking invoice AUTHORIZED'
    );

    assert.match(
      routeFile,
      /UPDATE\s+invoices\s+SET\s+status\s*=\s*'AUTHORIZED'/,
      'Must only set status AUTHORIZED upon successful verification'
    );
  });

  it('POST /:id/confirm-payment enforces booking ownership and operator authorization (PAY-01)', () => {
    const routeFile = fs.readFileSync(
      path.resolve(process.cwd(), 'src/modules/bookings/bookings.routes.ts'),
      'utf8'
    );

    assert.match(
      routeFile,
      /isOwner\s*=\s*row\.customer_id\s*===\s*callerId/,
      'Must check that caller is the owner of the booking'
    );

    assert.match(
      routeFile,
      /isPrivilegedOperator\s*=[\s\S]*?TENANT_ADMIN[\s\S]*?SYSTEM_ADMIN[\s\S]*?OPERATOR/,
      'Must allow designated administrative operator roles to confirm payment'
    );

    assert.match(
      routeFile,
      /reply\.status\(403\)\.send\([\s\S]*?'FORBIDDEN'/,
      'Must return 403 Forbidden when unauthorized user attempts payment confirmation'
    );

    assert.match(
      routeFile,
      /targetTxStatus\s*=\s*'SUCCEEDED'[\s\S]*?targetInvoiceStatus\s*=\s*'PAID'/,
      'Must reconcile Stripe status succeeded as SUCCEEDED and PAID rather than capture-required'
    );
  });
});
