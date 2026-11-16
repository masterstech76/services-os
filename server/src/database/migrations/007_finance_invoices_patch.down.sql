-- ==============================================================================
-- Migration Rollback: 007_finance_invoices_patch.down.sql
-- Description: Revert invoices updated_at, pending MFA staging, and status extensions safely
-- ==============================================================================

-- 1. Remove idempotency_key from provider_payouts
ALTER TABLE provider_payouts 
DROP COLUMN IF EXISTS idempotency_key;

-- 2. Remove pending_totp_secret_encrypted from user_mfa_credentials
ALTER TABLE user_mfa_credentials 
DROP COLUMN IF EXISTS pending_totp_secret_encrypted;

-- 3. Safely normalize any VOIDED or PENDING payment_transactions before restoring legacy constraint
UPDATE payment_transactions 
SET status = 'FAILED' 
WHERE status IN ('VOIDED', 'PENDING');

-- 4. Restore legacy payment_transactions status check constraint
ALTER TABLE payment_transactions 
DROP CONSTRAINT IF EXISTS payment_transactions_status_check;

ALTER TABLE payment_transactions 
ADD CONSTRAINT payment_transactions_status_check 
CHECK (status IN ('REQUIRES_CAPTURE', 'SUCCEEDED', 'FAILED', 'REFUNDED'));

-- 5. Drop updated_at column from invoices
ALTER TABLE invoices 
DROP COLUMN IF EXISTS updated_at;
