-- ==============================================================================
-- Migration Rollback: 008_payout_tenant_idempotency_and_durability.down.sql
-- Description: Revert tenant-scoped idempotency key constraint to single-column key
-- Target: PostgreSQL 16 + PostGIS
-- ==============================================================================

-- 1. Drop compound tenant-scoped unique constraint
ALTER TABLE provider_payouts 
DROP CONSTRAINT IF EXISTS provider_payouts_tenant_idempotency_uniq;

-- 2. Restore global unique constraint on idempotency_key
ALTER TABLE provider_payouts 
ADD CONSTRAINT provider_payouts_idempotency_key_key 
UNIQUE (idempotency_key);
