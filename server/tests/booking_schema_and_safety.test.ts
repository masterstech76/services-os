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

  it('Invoices migration 005 defines updated_at and supports VOID status', () => {
    const migrationSql = fs.readFileSync(
      path.resolve(process.cwd(), 'src/database/migrations/005_finance_and_ledger.sql'),
      'utf8'
    );

    // Check invoices table has updated_at
    assert.match(
      migrationSql,
      /updated_at\s+TIMESTAMPTZ\s+DEFAULT\s+NOW\(\)\s+NOT\s+NULL/,
      'invoices table must define updated_at column'
    );

    // Check payment_transactions table status constraint allows VOIDED or FAILED
    assert.match(
      migrationSql,
      /'VOIDED'/,
      'payment_transactions status CHECK constraint must allow VOIDED'
    );
  });
});
