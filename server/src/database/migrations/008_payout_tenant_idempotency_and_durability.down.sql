-- ==============================================================================
-- Migration Rollback: 008_payout_tenant_idempotency_and_durability.down.sql
-- Description: Revert tenant-scoped idempotency key constraint to single-column key
-- Target: PostgreSQL 16 + PostGIS
-- ==============================================================================

-- 1. Check for cross-tenant duplicate idempotency keys before restoring global unique constraint
DO $$
BEGIN
  IF EXISTS (
    SELECT idempotency_key FROM provider_payouts 
    WHERE idempotency_key IS NOT NULL 
    GROUP BY idempotency_key HAVING COUNT(*) > 1
  ) THEN
    RAISE EXCEPTION '[Migration Aborted] Cannot roll back migration 008: cross-tenant duplicate idempotency_keys exist. Merging to global uniqueness would violate unique constraint.' USING ERRCODE = 'check_violation';
  END IF;
END $$;

-- 2. Drop compound tenant-scoped unique constraint
ALTER TABLE provider_payouts 
DROP CONSTRAINT IF EXISTS provider_payouts_tenant_idempotency_uniq;

-- 3. Restore global unique constraint on idempotency_key
ALTER TABLE provider_payouts 
ADD CONSTRAINT provider_payouts_idempotency_key_key 
UNIQUE (idempotency_key);
