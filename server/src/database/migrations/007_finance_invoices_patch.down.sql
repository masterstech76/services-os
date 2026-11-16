-- ==============================================================================
-- Migration Rollback: 007_finance_invoices_patch.down.sql
-- Description: Operator-approved rollback procedure for migration 007.
-- CAUTION: Rolling back financial schema is forward-preferred and non-routine.
--          Rollback aborts explicitly if active financial data or idempotency
--          records exist that would be violated or destroyed.
-- ==============================================================================

-- 1. Guard against destroying payout idempotency and audit records
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM provider_payouts WHERE idempotency_key IS NOT NULL OR request_fingerprint IS NOT NULL) THEN
    RAISE EXCEPTION '[Migration Aborted] Cannot roll back migration 007: provider_payouts contains active idempotency or fingerprint records. Dropping these columns would destroy double-entry financial audit history.' USING ERRCODE = 'check_violation';
  END IF;
END $$;

-- 2. Guard against invalidating transactions with VOIDED or PENDING states
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM payment_transactions WHERE status IN ('VOIDED', 'PENDING')) THEN
    RAISE EXCEPTION '[Migration Aborted] Cannot roll back migration 007: payment_transactions contains records with status VOIDED or PENDING. Reconcile or archive these records before rolling back.' USING ERRCODE = 'check_violation';
  END IF;
END $$;

-- 3. Remove request fingerprint and idempotency_key from provider_payouts (only reached if table is empty of idempotency keys)
ALTER TABLE provider_payouts 
DROP COLUMN IF EXISTS request_fingerprint;

ALTER TABLE provider_payouts 
DROP COLUMN IF EXISTS idempotency_key;

-- 4. Remove pending_totp_secret_encrypted from user_mfa_credentials
ALTER TABLE user_mfa_credentials 
DROP COLUMN IF EXISTS pending_totp_secret_encrypted;

-- 5. Restore legacy payment_transactions status check constraint
ALTER TABLE payment_transactions 
DROP CONSTRAINT IF EXISTS payment_transactions_status_check;

ALTER TABLE payment_transactions 
ADD CONSTRAINT payment_transactions_status_check 
CHECK (status IN ('REQUIRES_CAPTURE', 'SUCCEEDED', 'FAILED', 'REFUNDED'));

-- 6. Drop updated_at column from invoices
ALTER TABLE invoices 
DROP COLUMN IF EXISTS updated_at;
