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
});
