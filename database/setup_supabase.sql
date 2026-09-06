-- =====================================================================
-- SIH 26036: Online Verification System for Weighing and Measuring Instruments
-- Department of Legal Metrology, Government of India
-- COMPLETE SETUP SCRIPT (Schema + Seed Data)
-- Run this ONCE in Supabase SQL Editor → New Query → Paste → Run
-- Demo Password for all accounts: DemoPassword@2026
-- =====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================
-- STEP 1: ENUMS (Safe creation with DO blocks)
-- =====================================================================
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('ADMIN', 'OWNER', 'LMO', 'GATC');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE user_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE instrument_status AS ENUM ('VALID', 'EXPIRING_SOON', 'EXPIRED', 'PENDING', 'UNDER_VERIFICATION', 'FAILED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE application_type AS ENUM ('NEW', 'RE_VERIFICATION');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE application_status AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'SCHEDULED', 'UNDER_VERIFICATION', 'COMPLETED', 'FAILED', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE verifier_type AS ENUM ('LMO', 'GATC');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE verification_result AS ENUM ('PASS', 'FAIL');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE certificate_status AS ENUM ('VALID', 'EXPIRED', 'REVOKED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE notification_type AS ENUM ('INFO', 'WARNING', 'EXPIRY', 'STATUS_CHANGE', 'ALERT');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =====================================================================
-- STEP 2: TABLES
-- =====================================================================

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'OWNER',
    status user_status NOT NULL DEFAULT 'PENDING',
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- STAKEHOLDERS (Business / Instrument Owner Profile)
CREATE TABLE IF NOT EXISTS stakeholders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    business_name VARCHAR(255) NOT NULL,
    business_address TEXT NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    trade_license_no VARCHAR(100),
    gstin VARCHAR(50),
    supporting_documents JSONB DEFAULT '[]'::jsonb,
    review_notes TEXT,
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INSTRUMENT CATEGORIES
CREATE TABLE IF NOT EXISTS instrument_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    verification_cycle_months INT NOT NULL DEFAULT 12,
    accuracy_class VARCHAR(20) NOT NULL DEFAULT 'Class III',
    standard_fee NUMERIC(10, 2) NOT NULL DEFAULT 500.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- GATC PROFILES (Government Approved Test Centres)
CREATE TABLE IF NOT EXISTS gatc_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    centre_name VARCHAR(255) NOT NULL,
    authorization_no VARCHAR(100) UNIQUE NOT NULL,
    authorized_scope TEXT[] NOT NULL DEFAULT '{}',
    lab_address TEXT NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    valid_until DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- LMO PROFILES (Legal Metrology Officers)
CREATE TABLE IF NOT EXISTS lmo_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    officer_code VARCHAR(100) UNIQUE NOT NULL,
    designation VARCHAR(100) NOT NULL DEFAULT 'Inspector of Legal Metrology',
    jurisdiction_zone VARCHAR(100) NOT NULL,
    office_address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INSTRUMENTS TABLE
CREATE TABLE IF NOT EXISTS instruments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES instrument_categories(id),
    instrument_type VARCHAR(255) NOT NULL,
    manufacturer VARCHAR(255) NOT NULL,
    model_number VARCHAR(100) NOT NULL,
    serial_number VARCHAR(100) NOT NULL,
    max_capacity NUMERIC(12, 4) NOT NULL,
    min_capacity NUMERIC(12, 4) NOT NULL,
    unit VARCHAR(20) NOT NULL DEFAULT 'kg',
    verification_scale_interval NUMERIC(10, 4),
    location TEXT NOT NULL,
    description TEXT,
    photograph_url TEXT,
    current_status instrument_status NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_serial_per_category UNIQUE (category_id, serial_number)
);

-- APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(50) PRIMARY KEY,
    owner_id UUID NOT NULL REFERENCES users(id),
    instrument_id UUID NOT NULL REFERENCES instruments(id),
    application_type application_type NOT NULL DEFAULT 'NEW',
    preferred_date DATE NOT NULL,
    preferred_time VARCHAR(50) NOT NULL,
    remarks TEXT,
    status application_status NOT NULL DEFAULT 'SUBMITTED',
    documents JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ASSIGNMENTS TABLE
CREATE TABLE IF NOT EXISTS assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id VARCHAR(50) NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    verifier_type verifier_type NOT NULL,
    verifier_id UUID NOT NULL REFERENCES users(id),
    assigned_by UUID NOT NULL REFERENCES users(id),
    assigned_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- SCHEDULES TABLE
CREATE TABLE IF NOT EXISTS schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id VARCHAR(50) NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL,
    scheduled_time VARCHAR(50) NOT NULL,
    location TEXT NOT NULL,
    verifier_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED',
    reschedule_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- VERIFICATION RECORDS
CREATE TABLE IF NOT EXISTS verification_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id VARCHAR(50) NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    instrument_id UUID NOT NULL REFERENCES instruments(id),
    verifier_id UUID NOT NULL REFERENCES users(id),
    verifier_role verifier_type NOT NULL,
    inspection_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    visual_checklist JSONB NOT NULL DEFAULT '{}'::jsonb,
    metrological_tests JSONB NOT NULL DEFAULT '{}'::jsonb,
    observations TEXT NOT NULL,
    test_results TEXT NOT NULL,
    evidence_photos JSONB DEFAULT '[]'::jsonb,
    remarks TEXT,
    result verification_result NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS certificates (
    id VARCHAR(50) PRIMARY KEY,
    verification_record_id UUID NOT NULL REFERENCES verification_records(id),
    instrument_id UUID NOT NULL REFERENCES instruments(id),
    owner_id UUID NOT NULL REFERENCES users(id),
    verifier_id UUID NOT NULL REFERENCES users(id),
    verifying_authority VARCHAR(255) NOT NULL,
    verifier_name VARCHAR(255) NOT NULL,
    verification_date DATE NOT NULL,
    valid_until DATE NOT NULL,
    status certificate_status NOT NULL DEFAULT 'VALID',
    qr_verification_url TEXT NOT NULL,
    digital_signature_hash VARCHAR(255) NOT NULL,
    pdf_url TEXT,
    revocation_reason TEXT,
    revoked_at TIMESTAMP WITH TIME ZONE,
    revoked_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL DEFAULT 'INFO',
    related_entity_type VARCHAR(50),
    related_entity_id VARCHAR(100),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    user_email VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    previous_state JSONB,
    new_state JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- STEP 3: INDEXES
-- =====================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_instruments_owner ON instruments(owner_id);
CREATE INDEX IF NOT EXISTS idx_instruments_serial ON instruments(serial_number);
CREATE INDEX IF NOT EXISTS idx_applications_owner ON applications(owner_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_certificates_instrument ON certificates(instrument_id);
CREATE INDEX IF NOT EXISTS idx_certificates_valid_until ON certificates(valid_until);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);

-- =====================================================================
-- STEP 4: ROW LEVEL SECURITY (RLS)
-- NOTE: We use service_role key in backend so RLS won't block API calls.
--       We only lock down client-direct access.
-- =====================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE stakeholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE instruments ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow service_role to bypass all RLS (it does by default in Supabase)
-- Allow public certificate verification (safe idempotent creation)
DO $$ BEGIN
  CREATE POLICY public_verify_certificates ON certificates
      FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =====================================================================
-- STEP 5: SEED DATA
-- Demo Password for ALL accounts: DemoPassword@2026
-- Bcrypt hash (cost 10): $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
-- =====================================================================

-- 1. INSTRUMENT CATEGORIES
INSERT INTO instrument_categories (id, code, name, description, verification_cycle_months, accuracy_class, standard_fee)
VALUES 
    ('11111111-1111-1111-1111-111111111001', 'EWS', 'Electronic Weighing Scale (Countertop)', 'Non-automatic weighing instruments for commercial retail transactions up to 30 kg', 12, 'Class III', 450.00),
    ('11111111-1111-1111-1111-111111111002', 'PWS', 'Platform Weighing Scale', 'Heavy duty platform scales for warehouses and wholesale trade up to 500 kg', 12, 'Class III', 850.00),
    ('11111111-1111-1111-1111-111111111003', 'PCS', 'Price Computing Scale', 'Electronic retail scales with automatic price computation and thermal print receipt', 12, 'Class III', 600.00),
    ('11111111-1111-1111-1111-111111111004', 'WB', 'Electronic Weighbridge (Pitless / Pit)', 'Heavy capacity vehicle weighing bridge up to 100 tonnes', 24, 'Class IV', 4500.00),
    ('11111111-1111-1111-1111-111111111005', 'FPM', 'Fuel Dispensing Unit (Petrol/Diesel)', 'Measuring pumps for petroleum dispensing with calibrated meter unit', 12, 'Class 0.5', 1200.00)
ON CONFLICT (code) DO NOTHING;

-- 2. USERS (password = DemoPassword@2026)
INSERT INTO users (id, email, password_hash, role, status, full_name, phone)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'admin@legalmetrology.demo',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', 'APPROVED', 'Dr. Rajeshwar Verma, IAS',        '+91 98100 12345'),
    ('b0000000-0000-0000-0000-000000000001', 'owner@business.demo',          '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'OWNER', 'APPROVED', 'Anand Kumar',                     '+91 98201 54321'),
    ('b0000000-0000-0000-0000-000000000002', 'newapplicant@traders.demo',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'OWNER', 'PENDING',  'Suresh Patel',                    '+91 98450 67890'),
    ('c0000000-0000-0000-0000-000000000001', 'lmo@legalmetrology.demo',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'LMO',   'APPROVED', 'R. Sharma, Inspector LM',         '+91 94120 11223'),
    ('d0000000-0000-0000-0000-000000000001', 'gatc@testcentre.demo',         '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'GATC',  'APPROVED', 'Metro Metrology & Testing Lab',   '+91 98111 88990')
ON CONFLICT (email) DO NOTHING;

-- 3. STAKEHOLDER PROFILES
INSERT INTO stakeholders (user_id, business_name, business_address, state, district, pincode, trade_license_no, gstin, review_notes, reviewed_by, reviewed_at)
VALUES
    ('b0000000-0000-0000-0000-000000000001', 'ABC Supermarket & Retailers Ltd.', 'Plot No. 42, Commercial Zone, Sector 18', 'Maharashtra', 'Mumbai Suburb', '400053', 'TRD-MUM-2024-8841', '27AABCU9603R1ZM', 'Verified trade registration and valid premises lease agreement.', 'a0000000-0000-0000-0000-000000000001', CURRENT_TIMESTAMP),
    ('b0000000-0000-0000-0000-000000000002', 'Sri Lakshmi Traders', 'Shop No. 12, APMC Grain Market', 'Telangana', 'Hyderabad', '500012', 'TRD-HYD-2026-1092', '36AAACL2901P1ZN', NULL, NULL, NULL)
ON CONFLICT (user_id) DO NOTHING;

-- 4. LMO PROFILE
INSERT INTO lmo_profiles (user_id, officer_code, designation, jurisdiction_zone, office_address)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'LMO-MH-DIV03', 'Senior Inspector of Legal Metrology', 'Mumbai Division - Zone 3', 'Legal Metrology Bhavan, Bandra Kurla Complex, Mumbai')
ON CONFLICT (user_id) DO NOTHING;

-- 5. GATC PROFILE
INSERT INTO gatc_profiles (user_id, centre_name, authorization_no, authorized_scope, lab_address, contact_person, valid_until)
VALUES
    ('d0000000-0000-0000-0000-000000000001', 'Metro Metrology & Testing Services', 'GATC-GOI-W-2023-049', ARRAY['EWS', 'PWS', 'PCS'], 'MIDC Industrial Area, Unit 7B, Andheri East, Mumbai', 'Praveen Nair (Technical Director)', '2028-03-31')
ON CONFLICT (user_id) DO NOTHING;

-- 6. INSTRUMENTS
INSERT INTO instruments (id, owner_id, category_id, instrument_type, manufacturer, model_number, serial_number, max_capacity, min_capacity, unit, verification_scale_interval, location, description, current_status)
VALUES
    ('e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111001', 'Electronic Weighing Scale (Countertop)', 'Avery Weigh-Tronix', 'AWT-30D',   'SN-2024-EWS-8901', 30.0000,  0.1000, 'kg', 0.0050, 'Checkout Counter 1, ABC Supermarket, Bandra West',  'Digital counter balance with dual LED customer display',     'VALID'),
    ('e0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111002', 'Platform Weighing Scale',               'Essae Teraoka',    'DS-215',    'SN-2024-PWS-4412', 300.0000, 2.0000, 'kg', 0.0500, 'Goods Receiving Dock 2, ABC Supermarket',            'Heavy duty low profile warehouse platform scale',             'EXPIRING_SOON'),
    ('e0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111003', 'Price Computing Scale',                 'CAS India Corp',   'PR-PLUS',   'SN-2023-PCS-1029', 15.0000,  0.0400, 'kg', 0.0020, 'Produce Section, ABC Supermarket',                  'Weighing scale with thermal barcode sticker printer',         'EXPIRED'),
    ('e0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111001', 'Electronic Weighing Scale (Countertop)', 'Mettler Toledo',   'bPlus-T2',  'SN-2026-EWS-7741', 15.0000,  0.0400, 'kg', 0.0020, 'Deli & Bakery Section, ABC Supermarket',             'New high accuracy touch price computing counter scale',        'PENDING')
ON CONFLICT (id) DO NOTHING;

-- 7. APPLICATIONS
INSERT INTO applications (id, owner_id, instrument_id, application_type, preferred_date, preferred_time, remarks, status)
VALUES
    ('LM-APP-2026-000101', 'b0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'NEW',            '2026-02-10', '10:30 AM', 'Initial stamping and verification after installation at new counter',   'COMPLETED'),
    ('LM-APP-2026-000102', 'b0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 'RE_VERIFICATION','2026-09-15', '02:00 PM', 'Annual re-verification application before certificate expiration',      'SCHEDULED'),
    ('LM-APP-2026-000103', 'b0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'NEW',            '2026-09-18', '11:00 AM', 'New counter installation testing at GATC accredited lab',              'ASSIGNED')
ON CONFLICT (id) DO NOTHING;

-- 8. ASSIGNMENTS
INSERT INTO assignments (id, application_id, verifier_type, verifier_id, assigned_by, assigned_date, notes)
VALUES
    ('f0000000-0000-0000-0000-000000000001', 'LM-APP-2026-000101', 'LMO',  'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', '2026-02-05', 'Assigned to Ward Inspector for on-site physical verification'),
    ('f0000000-0000-0000-0000-000000000002', 'LM-APP-2026-000102', 'LMO',  'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', '2026-09-02', 'Assigned to Inspector R. Sharma for scheduled annual re-stamping'),
    ('f0000000-0000-0000-0000-000000000003', 'LM-APP-2026-000103', 'GATC', 'd0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', '2026-09-04', 'Allocated to GATC Metro Lab under accredited scope EWS')
ON CONFLICT (id) DO NOTHING;

-- 9. SCHEDULES
INSERT INTO schedules (id, application_id, scheduled_date, scheduled_time, location, verifier_id, status)
VALUES
    ('f1000000-0000-0000-0000-000000000001', 'LM-APP-2026-000101', '2026-02-10', '10:30 AM', 'Plot No. 42, Commercial Zone, Sector 18, Mumbai',  'c0000000-0000-0000-0000-000000000001', 'COMPLETED'),
    ('f1000000-0000-0000-0000-000000000002', 'LM-APP-2026-000102', '2026-09-15', '02:00 PM', 'Dock 2, Plot No. 42, Sector 18, Mumbai',            'c0000000-0000-0000-0000-000000000001', 'SCHEDULED'),
    ('f1000000-0000-0000-0000-000000000003', 'LM-APP-2026-000103', '2026-09-18', '11:00 AM', 'MIDC Industrial Area, Unit 7B, Andheri East, Mumbai','d0000000-0000-0000-0000-000000000001', 'SCHEDULED')
ON CONFLICT (id) DO NOTHING;

-- 10. VERIFICATION RECORDS
INSERT INTO verification_records (id, application_id, instrument_id, verifier_id, verifier_role, inspection_date, visual_checklist, metrological_tests, observations, test_results, remarks, result)
VALUES
    ('f2000000-0000-0000-0000-000000000001', 'LM-APP-2026-000101', 'e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'LMO', '2026-02-10 11:15:00+05:30',
    '{"stamping_intact": true, "spirit_level_centered": true, "plate_condition_clean": true, "zero_tracking_functional": true}',
    '{"repeatability_error_mg": 0, "eccentricity_error_mg": 1, "max_load_test_kg": 30, "error_at_max_load_g": 0.002, "max_permissible_error_g": 0.005}',
    'Physical and metrological verification carried out using Standard Working Weights F2 Class. Zero return verified. Repeatability test over 10 consecutive cycles satisfactory.',
    'Max load deviation +2g at 30kg, well within Maximum Permissible Error (MPE +/- 5g). Eccentricity test across 4 quadrants passed.',
    'Lead verification seal applied at rear calibration port (Seal Tag No: MH/MUM/2026/0912). Instrument verified fit for commercial use.',
    'PASS')
ON CONFLICT (id) DO NOTHING;

-- 11. CERTIFICATES
INSERT INTO certificates (id, verification_record_id, instrument_id, owner_id, verifier_id, verifying_authority, verifier_name, verification_date, valid_until, status, qr_verification_url, digital_signature_hash)
VALUES
    ('CERT-2026-000101', 'f2000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001',
    'Legal Metrology Department, Government of Maharashtra', 'R. Sharma (Senior Inspector)', '2026-02-10', '2027-02-09', 'VALID',
    '/api/public/verify/CERT-2026-000101', 'SHA256:d8a57e3f940b5c192d4e84b2c8901f41e5a87b1c3d2e9f0a7b4c6d8e0f1a3b5c')
ON CONFLICT (id) DO NOTHING;

-- 12. NOTIFICATIONS
INSERT INTO notifications (user_id, title, message, type, related_entity_type, related_entity_id, is_read)
VALUES
    ('b0000000-0000-0000-0000-000000000001', 'Verification Certificate Issued',           'Digital Certificate CERT-2026-000101 has been issued for your Countertop Weighing Scale.',                                'INFO',         'CERTIFICATE',  'CERT-2026-000101',     false),
    ('b0000000-0000-0000-0000-000000000001', 'Certificate Expiring Soon (30 Days Notice)', 'Certificate for Platform Scale (SN-2024-PWS-4412) expires on 2026-10-05. Please apply for re-verification.',             'EXPIRY',       'INSTRUMENT',   'e0000000-0000-0000-0000-000000000002', false),
    ('b0000000-0000-0000-0000-000000000001', 'Verification Scheduled',                    'Application LM-APP-2026-000102 has been scheduled for 2026-09-15 at 02:00 PM with Inspector R. Sharma.',                   'STATUS_CHANGE','APPLICATION',  'LM-APP-2026-000102',   true)
ON CONFLICT (id) DO NOTHING;

-- 13. AUDIT LOGS
INSERT INTO audit_logs (user_id, user_email, action, entity_type, entity_id, previous_state, new_state, ip_address)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'admin@legalmetrology.demo', 'STAKEHOLDER_APPROVED',   'STAKEHOLDER',        'b0000000-0000-0000-0000-000000000001', '{"status": "PENDING"}', '{"status": "APPROVED"}',                      '10.0.4.12'),
    ('a0000000-0000-0000-0000-000000000001', 'admin@legalmetrology.demo', 'APPLICATION_ASSIGNED',   'APPLICATION',        'LM-APP-2026-000101',                  '{"status": "SUBMITTED"}', '{"status": "ASSIGNED", "verifier": "LMO"}', '10.0.4.12'),
    ('c0000000-0000-0000-0000-000000000001', 'lmo@legalmetrology.demo',   'VERIFICATION_SUBMITTED', 'VERIFICATION_RECORD','f2000000-0000-0000-0000-000000000001', NULL, '{"result": "PASS"}',                                          '10.0.12.8'),
    ('c0000000-0000-0000-0000-000000000001', 'lmo@legalmetrology.demo',   'CERTIFICATE_GENERATED',  'CERTIFICATE',        'CERT-2026-000101',                    NULL, '{"status": "VALID", "valid_until": "2027-02-09"}',           '10.0.12.8');

-- =====================================================================
-- SETUP COMPLETE!
-- You can now start the backend server - it will connect to Supabase
-- automatically using the credentials in backend/.env
-- =====================================================================
SELECT 'Setup complete! Tables created and seed data loaded.' AS status;
