-- =====================================================================
-- SIH 26036: Razorpay Payment Integration
-- Feature Branch: feature/razorpay-payment
-- Additive table only — zero changes to existing schema
-- Run this AFTER schema.sql in your Supabase SQL Editor
-- =====================================================================

-- Payment status enum
DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM (
    'CREATED',    -- Razorpay order created, awaiting payment
    'PAID',       -- Payment successful + backend signature verified
    'FAILED',     -- Payment failed or cancelled
    'REFUNDED'    -- Refunded (future use)
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 15. VERIFICATION PAYMENTS TABLE (NEW — additive only)
CREATE TABLE IF NOT EXISTS verification_payments (
    id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id        VARCHAR(50) NOT NULL REFERENCES applications(id),
    verification_record_id UUID REFERENCES verification_records(id),
    owner_id              UUID NOT NULL REFERENCES users(id),
    payment_provider      VARCHAR(50) NOT NULL DEFAULT 'DEMO',  -- 'DEMO' | 'RAZORPAY'
    order_id              VARCHAR(100) UNIQUE NOT NULL,
    payment_id            VARCHAR(100),
    signature             TEXT,
    razorpay_order_id     VARCHAR(100),
    razorpay_payment_id   VARCHAR(100),
    razorpay_signature    TEXT,
    amount_paise          INTEGER NOT NULL,      -- Amount in paise (₹ × 100)
    currency              VARCHAR(10) DEFAULT 'INR',
    status                payment_status NOT NULL DEFAULT 'CREATED',
    verified_at           TIMESTAMP WITH TIME ZONE,
    created_at            TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at            TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Backward compatibility view for 'payments'
CREATE OR REPLACE VIEW payments AS SELECT * FROM verification_payments;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payments_application ON verification_payments(application_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id    ON verification_payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_owner       ON verification_payments(owner_id);
CREATE INDEX IF NOT EXISTS idx_payments_status      ON verification_payments(status);

