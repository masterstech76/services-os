-- ==============================================================================
-- Migration Rollback: 007_finance_invoices_patch.down.sql
-- Description: Revert invoices updated_at, pending MFA staging, and VOIDED status
-- ==============================================================================

ALTER TABLE user_mfa_credentials 
DROP COLUMN IF EXISTS pending_totp_secret_encrypted;

ALTER TABLE invoices 
DROP COLUMN IF EXISTS updated_at;

ALTER TABLE payment_transactions 
DROP CONSTRAINT IF EXISTS payment_transactions_status_check;

ALTER TABLE payment_transactions 
ADD CONSTRAINT payment_transactions_status_check 
CHECK (status IN ('REQUIRES_CAPTURE', 'SUCCEEDED', 'FAILED', 'REFUNDED'));
