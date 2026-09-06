-- =====================================================================
-- SIH 26036: Online Verification System for Weighing and Measuring Instruments
-- Department of Legal Metrology, Government of India
-- Database Schema (PostgreSQL / Supabase)
-- =====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS & DOMAINS
CREATE TYPE user_role AS ENUM ('ADMIN', 'OWNER', 'LMO', 'GATC');
CREATE TYPE user_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');
CREATE TYPE instrument_status AS ENUM ('VALID', 'EXPIRING_SOON', 'EXPIRED', 'PENDING', 'UNDER_VERIFICATION', 'FAILED');
CREATE TYPE application_type AS ENUM ('NEW', 'RE_VERIFICATION');
CREATE TYPE application_status AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'SCHEDULED', 'UNDER_VERIFICATION', 'COMPLETED', 'FAILED', 'REJECTED');
CREATE TYPE verifier_type AS ENUM ('LMO', 'GATC');
CREATE TYPE verification_result AS ENUM ('PASS', 'FAIL');
CREATE TYPE certificate_status AS ENUM ('VALID', 'EXPIRED', 'REVOKED');
CREATE TYPE notification_type AS ENUM ('INFO', 'WARNING', 'EXPIRY', 'STATUS_CHANGE', 'ALERT');

-- 2. USERS TABLE
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

-- 3. STAKEHOLDERS (Business / Instrument Owner Profile)
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

-- 4. INSTRUMENT CATEGORIES
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

-- 5. GATC PROFILES (Government Approved Test Centres)
CREATE TABLE IF NOT EXISTS gatc_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    centre_name VARCHAR(255) NOT NULL,
    authorization_no VARCHAR(100) UNIQUE NOT NULL,
    authorized_scope TEXT[] NOT NULL DEFAULT '{}', -- Array of Category codes/IDs
    lab_address TEXT NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    valid_until DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. LMO PROFILES (Legal Metrology Officers)
CREATE TABLE IF NOT EXISTS lmo_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    officer_code VARCHAR(100) UNIQUE NOT NULL,
    designation VARCHAR(100) NOT NULL DEFAULT 'Inspector of Legal Metrology',
    jurisdiction_zone VARCHAR(100) NOT NULL,
    office_address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. INSTRUMENTS TABLE
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

-- 8. APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(50) PRIMARY KEY, -- e.g. LM-APP-2026-000101
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

-- 9. ASSIGNMENTS TABLE
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

-- 10. SCHEDULES TABLE
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

-- 11. VERIFICATION RECORDS (Detailed Field/Lab Inspection)
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

-- 12. CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS certificates (
    id VARCHAR(50) PRIMARY KEY, -- e.g. CERT-2026-000101
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

-- 13. NOTIFICATIONS TABLE
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

-- 14. AUDIT LOGS TABLE
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

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_instruments_owner ON instruments(owner_id);
CREATE INDEX IF NOT EXISTS idx_instruments_serial ON instruments(serial_number);
CREATE INDEX IF NOT EXISTS idx_applications_owner ON applications(owner_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_certificates_instrument ON certificates(instrument_id);
CREATE INDEX IF NOT EXISTS idx_certificates_valid_until ON certificates(valid_until);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE stakeholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE instruments ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Public can verify certificates
CREATE POLICY public_verify_certificates ON certificates
    FOR SELECT USING (true);
