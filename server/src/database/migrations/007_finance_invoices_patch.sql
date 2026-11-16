-- ==============================================================================
-- Migration: 007_finance_invoices_patch.sql
-- Description: Forward patch for invoices updated_at, payment status VOIDED, and pending MFA staging
-- Target: PostgreSQL 16 + PostGIS
-- ==============================================================================

-- 1. Add updated_at column to invoices if not present
ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Extend payment_transactions status check constraint to support VOIDED
ALTER TABLE payment_transactions 
DROP CONSTRAINT IF EXISTS payment_transactions_status_check;

ALTER TABLE payment_transactions 
ADD CONSTRAINT payment_transactions_status_check 
CHECK (status IN ('REQUIRES_CAPTURE', 'SUCCEEDED', 'FAILED', 'REFUNDED', 'VOIDED'));

-- 3. Staging column for zero-downtime MFA replacement factor
ALTER TABLE user_mfa_credentials 
ADD COLUMN IF NOT EXISTS pending_totp_secret_encrypted TEXT;
