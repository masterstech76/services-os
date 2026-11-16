-- ==============================================================================
-- Migration Rollback: 007_finance_invoices_patch.down.sql
-- Description: Operator-approved rollback procedure for migration 007.
-- CAUTION: Rolling back financial schema requires active review of audit history.
-- ==============================================================================

-- 1. Remove request fingerprint and idempotency_key from provider_payouts
ALTER TABLE provider_payouts 
DROP COLUMN IF EXISTS request_fingerprint;

ALTER TABLE provider_payouts 
DROP COLUMN IF EXISTS idempotency_key;

-- 2. Remove pending_totp_secret_encrypted from user_mfa_credentials
ALTER TABLE user_mfa_credentials 
DROP COLUMN IF EXISTS pending_totp_secret_encrypted;

-- 3. Verify that no active transactions are in PENDING or VOIDED states prior to constraint restoration.
-- Operator notice: do NOT silently destroy historical audit trail. In standard rollbacks,
-- existing rows are inspected and reconciled rather than overwritten.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM payment_transactions WHERE status IN ('VOIDED', 'PENDING')) THEN
    RAISE NOTICE '[Migration Notice] Rows exist with status VOIDED or PENDING. Reverting constraint without mutating records requires manual operator reconciliation.';
  END IF;
END $$;

-- 4. Restore legacy payment_transactions status check constraint (dropping constraint safely)
ALTER TABLE payment_transactions 
DROP CONSTRAINT IF EXISTS payment_transactions_status_check;

ALTER TABLE payment_transactions 
ADD CONSTRAINT payment_transactions_status_check 
CHECK (status IN ('REQUIRES_CAPTURE', 'SUCCEEDED', 'FAILED', 'REFUNDED'));

-- 5. Drop updated_at column from invoices
ALTER TABLE invoices 
DROP COLUMN IF EXISTS updated_at;
