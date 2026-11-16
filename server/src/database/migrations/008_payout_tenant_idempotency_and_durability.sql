-- ==============================================================================
-- Migration: 008_payout_tenant_idempotency_and_durability.sql
-- Description: Replace global provider_payouts idempotency constraint with tenant-scoped constraint (PAY-04)
-- Target: PostgreSQL 16 + PostGIS
-- ==============================================================================

-- 1. Drop global unique constraint on idempotency_key if present
ALTER TABLE provider_payouts 
DROP CONSTRAINT IF EXISTS provider_payouts_idempotency_key_key;

DROP INDEX IF EXISTS provider_payouts_idempotency_key_key;

-- 2. Add compound tenant-scoped unique constraint
ALTER TABLE provider_payouts 
ADD CONSTRAINT provider_payouts_tenant_idempotency_uniq 
UNIQUE (tenant_id, idempotency_key);
