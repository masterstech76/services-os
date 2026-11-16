-- ==============================================================================
-- Migration: 005_finance_and_ledger.sql
-- Description: Invoices, Stripe Pre-Auth/Capture, Webhooks, Double-Entry Ledger & Payouts
-- Target: PostgreSQL 16 + PostGIS
-- ==============================================================================

-- 1. Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE RESTRICT,
    invoice_number VARCHAR(50) NOT NULL,
    labor_subtotal_cents BIGINT DEFAULT 0 NOT NULL CHECK (labor_subtotal_cents >= 0),
    parts_subtotal_cents BIGINT DEFAULT 0 NOT NULL CHECK (parts_subtotal_cents >= 0),
    diagnostic_fee_cents BIGINT DEFAULT 0 NOT NULL CHECK (diagnostic_fee_cents >= 0),
    tax_rate_bps INTEGER DEFAULT 0 NOT NULL CHECK (tax_rate_bps >= 0),
    tax_total_cents BIGINT DEFAULT 0 NOT NULL CHECK (tax_total_cents >= 0),
    discount_cents BIGINT DEFAULT 0 NOT NULL CHECK (discount_cents >= 0),
    total_amount_cents BIGINT DEFAULT 0 NOT NULL CHECK (total_amount_cents >= 0),
    status VARCHAR(20) DEFAULT 'DRAFT' NOT NULL CHECK (status IN ('DRAFT', 'AUTHORIZED', 'PAID', 'REFUNDED', 'VOID')),
    issued_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    paid_at TIMESTAMPTZ,
    CONSTRAINT uq_tenant_invoice_number UNIQUE (tenant_id, invoice_number)
);

CREATE INDEX IF NOT EXISTS idx_invoices_tenant_status 
ON invoices(tenant_id, status);

-- 2. Invoice Itemized Rows
CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description VARCHAR(255) NOT NULL,
    item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('LABOR', 'PART', 'DIAGNOSTIC', 'TAX', 'DISCOUNT')),
    quantity NUMERIC(6, 2) DEFAULT 1.00 NOT NULL CHECK (quantity > 0),
    unit_price_cents BIGINT NOT NULL CHECK (unit_price_cents >= 0),
    total_cents BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice 
ON invoice_items(invoice_id);

-- 3. Payment Transactions (Stripe Pre-Auth, Captures & Refunds)
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE RESTRICT,
    stripe_payment_intent_id VARCHAR(150) NOT NULL,
    stripe_charge_id VARCHAR(150),
    idempotency_key VARCHAR(100) UNIQUE NOT NULL,
    authorized_amount_cents BIGINT NOT NULL CHECK (authorized_amount_cents >= 0),
    captured_amount_cents BIGINT DEFAULT 0 NOT NULL CHECK (captured_amount_cents >= 0),
    refunded_amount_cents BIGINT DEFAULT 0 NOT NULL CHECK (refunded_amount_cents >= 0),
    transaction_type VARCHAR(30) NOT NULL CHECK (transaction_type IN ('PRE_AUTH', 'CAPTURE', 'REFUND', 'PARTIAL_REFUND')),
    status VARCHAR(30) NOT NULL CHECK (status IN ('REQUIRES_CAPTURE', 'SUCCEEDED', 'FAILED', 'REFUNDED')),
    raw_response JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_tenant 
ON payment_transactions(tenant_id, status);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_stripe 
ON payment_transactions(stripe_payment_intent_id);

-- 4. Inbound Webhook Events (Idempotency Protection)
CREATE TABLE IF NOT EXISTS webhook_events (
    id VARCHAR(150) PRIMARY KEY,
    provider VARCHAR(50) DEFAULT 'stripe' NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    processed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    payload JSONB NOT NULL
);

-- 5. Double-Entry Ledger Chart of Accounts
CREATE TABLE IF NOT EXISTS ledger_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    account_number VARCHAR(50) NOT NULL,
    account_name VARCHAR(150) NOT NULL,
    account_type VARCHAR(30) NOT NULL CHECK (account_type IN (
        'ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'
    )),
    currency_code VARCHAR(3) DEFAULT 'USD' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT uq_tenant_account_no UNIQUE (tenant_id, account_number)
);

CREATE INDEX IF NOT EXISTS idx_ledger_accounts_lookup 
ON ledger_accounts(tenant_id, account_type);

-- 6. Double-Entry Ledger Journal Entries
CREATE TABLE IF NOT EXISTS ledger_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    transaction_id UUID REFERENCES payment_transactions(id) ON DELETE RESTRICT,
    debit_account_id UUID NOT NULL REFERENCES ledger_accounts(id),
    credit_account_id UUID NOT NULL REFERENCES ledger_accounts(id),
    amount_cents BIGINT NOT NULL CHECK (amount_cents > 0),
    description TEXT NOT NULL,
    posted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT chk_debit_credit_different CHECK (debit_account_id <> credit_account_id)
);

CREATE INDEX IF NOT EXISTS idx_ledger_entries_tenant_posted 
ON ledger_entries(tenant_id, posted_at DESC);

CREATE INDEX IF NOT EXISTS idx_ledger_entries_transaction 
ON ledger_entries(transaction_id);

-- 7. Provider Payouts (Stripe Connect Express)
CREATE TABLE IF NOT EXISTS provider_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    provider_id UUID NOT NULL REFERENCES provider_profiles(user_id) ON DELETE RESTRICT,
    stripe_transfer_id VARCHAR(150) UNIQUE,
    amount_cents BIGINT NOT NULL CHECK (amount_cents > 0),
    currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' NOT NULL CHECK (status IN ('PENDING', 'PROCESSING', 'PAID', 'FAILED')),
    failure_reason TEXT,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_provider_payouts_lookup 
ON provider_payouts(tenant_id, provider_id, status);
