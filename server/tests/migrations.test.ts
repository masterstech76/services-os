import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MIGRATIONS_DIR = path.resolve(__dirname, '../src/database/migrations');

test('Database Migrations Validation Suite', async (t) => {
  await t.test('All migration files have matching down-migration rollback scripts', () => {
    const files = fs.readdirSync(MIGRATIONS_DIR).sort();
    const upFiles = files.filter(f => f.endsWith('.sql') && !f.endsWith('.down.sql'));
    const downFiles = files.filter(f => f.endsWith('.down.sql'));

    assert.ok(upFiles.length >= 8, `Expected at least 8 up-migration domain files, found ${upFiles.length}`);
    assert.equal(upFiles.length, downFiles.length, 'Every up-migration domain file must have an exact matching down-migration rollback script');

    for (const up of upFiles) {
      const expectedDown = up.replace('.sql', '.down.sql');
      assert.ok(
        downFiles.includes(expectedDown),
        `Missing rollback script for migration: ${up}`
      );
    }
  });

  await t.test('All up-migrations are non-empty and syntactically structured', () => {
    const files = fs.readdirSync(MIGRATIONS_DIR)
      .filter(f => f.endsWith('.sql') && !f.endsWith('.down.sql'));

    for (const file of files) {
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf-8');
      assert.ok(sql.trim().length > 100, `Migration ${file} is suspiciously short`);
      assert.ok(sql.includes('CREATE TABLE') || sql.includes('ALTER TABLE'), `Migration ${file} must declare or alter tables`);
      
      // Ensure no hardcoded personal or demo data exists in migrations
      assert.ok(!sql.includes('john@example.com'), `${file} contains demo email`);
      assert.ok(!sql.includes('555-0199'), `${file} contains demo phone`);
    }
  });

  await t.test('PostGIS spatial extension and columns are defined', () => {
    const sql001 = fs.readFileSync(path.join(MIGRATIONS_DIR, '001_tenants_and_auth.sql'), 'utf-8');
    assert.ok(sql001.includes('CREATE EXTENSION IF NOT EXISTS "postgis"'), 'PostGIS extension must be declared in 001');

    const sql002 = fs.readFileSync(path.join(MIGRATIONS_DIR, '002_profiles_and_entities.sql'), 'utf-8');
    assert.ok(sql002.includes('GEOGRAPHY(Point, 4326)'), 'Provider locations and addresses must use PostGIS Point');
    assert.ok(sql002.includes('USING GIST (location)'), 'Spatial GIST index must be defined on location');
  });

  await t.test('Double-entry ledger constraints are strictly enforced', () => {
    const sql005 = fs.readFileSync(path.join(MIGRATIONS_DIR, '005_finance_and_ledger.sql'), 'utf-8');
    assert.ok(sql005.includes('CREATE TABLE IF NOT EXISTS ledger_entries'), 'Ledger entries table must exist');
    assert.ok(sql005.includes('chk_debit_credit_different'), 'Debit and credit accounts must be strictly different');
    assert.ok(sql005.includes('amount_cents BIGINT NOT NULL CHECK (amount_cents > 0)'), 'Ledger amounts must be positive');
  });

  await t.test('Down migration 007 safely aborts with RAISE EXCEPTION if active financial data exists (DB-01, DB-02)', () => {
    const down007 = fs.readFileSync(path.join(MIGRATIONS_DIR, '007_finance_invoices_patch.down.sql'), 'utf-8');
    
    assert.match(
      down007,
      /RAISE\s+EXCEPTION[\s\S]*?Cannot roll back migration 007[\s\S]*?idempotency/,
      'Rollback script must explicitly abort if idempotency records exist'
    );

    assert.match(
      down007,
      /RAISE\s+EXCEPTION[\s\S]*?Cannot roll back migration 007[\s\S]*?VOIDED or PENDING/,
      'Rollback script must explicitly abort if transactions in VOIDED or PENDING state exist'
    );
  });
});
