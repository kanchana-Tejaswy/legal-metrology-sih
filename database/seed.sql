-- =====================================================================
-- Seed Data for Department of Legal Metrology Online Verification System
-- Demo Credentials:
-- Password for all demo accounts: DemoPassword@2026
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

-- 2. USERS
-- Demo bcrypt hash for DemoPassword@2026
INSERT INTO users (id, email, password_hash, role, status, full_name, phone)
VALUES
    -- Admin
    ('a0000000-0000-0000-0000-000000000001', 'admin@legalmetrology.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', 'APPROVED', 'Dr. Rajeshwar Verma, IAS', '+91 98100 12345'),
    -- Approved Business Owner
    ('b0000000-0000-0000-0000-000000000001', 'owner@business.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'OWNER', 'APPROVED', 'Anand Kumar', '+91 98201 54321'),
    -- Pending Business Owner
    ('b0000000-0000-0000-0000-000000000002', 'newapplicant@traders.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'OWNER', 'PENDING', 'Suresh Patel', '+91 98450 67890'),
    -- LMO Officer
    ('c0000000-0000-0000-0000-000000000001', 'lmo@legalmetrology.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'LMO', 'APPROVED', 'R. Sharma, Inspector LM', '+91 94120 11223'),
    -- GATC Test Centre
    ('d0000000-0000-0000-0000-000000000001', 'gatc@testcentre.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'GATC', 'APPROVED', 'Metro Metrology & Testing Lab', '+91 98111 88990')
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
    ('d0000000-0000-0000-0000-000000000001', 'Metro Metrology & Testing Services', 'GATC-GOI-W-2023-049', '{"EWS", "PWS", "PCS"}', 'MIDC Industrial Area, Unit 7B, Andheri East, Mumbai', 'Praveen Nair (Technical Director)', '2028-03-31')
ON CONFLICT (user_id) DO NOTHING;

-- 6. INSTRUMENTS
INSERT INTO instruments (id, owner_id, category_id, instrument_type, manufacturer, model_number, serial_number, max_capacity, min_capacity, unit, verification_scale_interval, location, description, current_status)
VALUES
    -- Valid verified instrument
    ('e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111001', 'Electronic Weighing Scale (Countertop)', 'Avery Weigh-Tronix', 'AWT-30D', 'SN-2024-EWS-8901', 30.0000, 0.1000, 'kg', 0.0050, 'Checkout Counter 1, ABC Supermarket, Bandra West', 'Digital counter balance with dual LED customer display', 'VALID'),
    -- Expiring soon instrument (approaching 30 days)
    ('e0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111002', 'Platform Weighing Scale', 'Essae Teraoka', 'DS-215', 'SN-2024-PWS-4412', 300.0000, 2.0000, 'kg', 0.0500, 'Goods Receiving Dock 2, ABC Supermarket', 'Heavy duty low profile warehouse platform scale', 'EXPIRING_SOON'),
    -- Expired instrument
    ('e0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111003', 'Price Computing Scale', 'CAS India Corp', 'PR-PLUS', 'SN-2023-PCS-1029', 15.0000, 0.0400, 'kg', 0.0020, 'Produce Section, ABC Supermarket', 'Weighing scale with thermal barcode sticker printer', 'EXPIRED'),
    -- Freshly registered instrument waiting verification
    ('e0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111001', 'Electronic Weighing Scale (Countertop)', 'Mettler Toledo', 'bPlus-T2', 'SN-2026-EWS-7741', 15.0000, 0.0400, 'kg', 0.0020, 'Deli & Bakery Section, ABC Supermarket', 'New high accuracy touch price computing counter scale', 'PENDING')
ON CONFLICT (id) DO NOTHING;

-- 7. APPLICATIONS
INSERT INTO applications (id, owner_id, instrument_id, application_type, preferred_date, preferred_time, remarks, status)
VALUES
    ('LM-APP-2026-000101', 'b0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'NEW', '2026-02-10', '10:30 AM', 'Initial stamping and verification after installation at new counter', 'COMPLETED'),
    ('LM-APP-2026-000102', 'b0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 'RE_VERIFICATION', '2026-09-15', '02:00 PM', 'Annual re-verification application before certificate expiration', 'SCHEDULED'),
    ('LM-APP-2026-000103', 'b0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'NEW', '2026-09-18', '11:00 AM', 'New counter installation testing at GATC accredited lab', 'ASSIGNED')
ON CONFLICT (id) DO NOTHING;

-- 8. ASSIGNMENTS
INSERT INTO assignments (id, application_id, verifier_type, verifier_id, assigned_by, assigned_date, notes)
VALUES
    ('f0000000-0000-0000-0000-000000000001', 'LM-APP-2026-000101', 'LMO', 'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', '2026-02-05', 'Assigned to Ward Inspector for on-site physical verification'),
    ('f0000000-0000-0000-0000-000000000002', 'LM-APP-2026-000102', 'LMO', 'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', '2026-09-02', 'Assigned to Inspector R. Sharma for scheduled annual re-stamping'),
    ('f0000000-0000-0000-0000-000000000003', 'LM-APP-2026-000103', 'GATC', 'd0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', '2026-09-04', 'Allocated to GATC Metro Lab under accredited scope EWS')
ON CONFLICT (id) DO NOTHING;

-- 9. SCHEDULES
INSERT INTO schedules (id, application_id, scheduled_date, scheduled_time, location, verifier_id, status)
VALUES
    ('f1000000-0000-0000-0000-000000000001', 'LM-APP-2026-000101', '2026-02-10', '10:30 AM', 'Plot No. 42, Commercial Zone, Sector 18, Mumbai', 'c0000000-0000-0000-0000-000000000001', 'COMPLETED'),
    ('f1000000-0000-0000-0000-000000000002', 'LM-APP-2026-000102', '2026-09-15', '02:00 PM', 'Dock 2, Plot No. 42, Sector 18, Mumbai', 'c0000000-0000-0000-0000-000000000001', 'SCHEDULED'),
    ('f1000000-0000-0000-0000-000000000003', 'LM-APP-2026-000103', '2026-09-18', '11:00 AM', 'MIDC Industrial Area, Unit 7B, Andheri East, Mumbai', 'd0000000-0000-0000-0000-000000000001', 'SCHEDULED')
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
    ('CERT-2026-000101', 'f2000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Legal Metrology Department, Government of Maharashtra', 'R. Sharma (Senior Inspector)', '2026-02-10', '2027-02-09', 'VALID', '/verify/CERT-2026-000101', 'SHA256:d8a57e3f940b5c192d4e84b2c8901f41e5a87b1c3d2e9f0a7b4c6d8e0f1a3b5c')
ON CONFLICT (id) DO NOTHING;

-- 12. NOTIFICATIONS
INSERT INTO notifications (user_id, title, message, type, related_entity_type, related_entity_id, is_read)
VALUES
    ('b0000000-0000-0000-0000-000000000001', 'Verification Certificate Issued', 'Digital Certificate CERT-2026-000101 has been issued for your Countertop Weighing Scale.', 'INFO', 'CERTIFICATE', 'CERT-2026-000101', false),
    ('b0000000-0000-0000-0000-000000000001', 'Certificate Expiring Soon (30 Days Notice)', 'Certificate for Platform Scale (SN-2024-PWS-4412) expires on 2026-10-05. Please apply for re-verification.', 'EXPIRY', 'INSTRUMENT', 'e0000000-0000-0000-0000-000000000002', false),
    ('b0000000-0000-0000-0000-000000000001', 'Verification Scheduled', 'Application LM-APP-2026-000102 has been scheduled for 2026-09-15 at 02:00 PM with Inspector R. Sharma.', 'STATUS_CHANGE', 'APPLICATION', 'LM-APP-2026-000102', true)
ON CONFLICT (id) DO NOTHING;

-- 13. AUDIT LOGS
INSERT INTO audit_logs (user_id, user_email, action, entity_type, entity_id, previous_state, new_state, ip_address)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'admin@legalmetrology.demo', 'STAKEHOLDER_APPROVED', 'STAKEHOLDER', 'b0000000-0000-0000-0000-000000000001', '{"status": "PENDING"}', '{"status": "APPROVED"}', '10.0.4.12'),
    ('a0000000-0000-0000-0000-000000000001', 'admin@legalmetrology.demo', 'APPLICATION_ASSIGNED', 'APPLICATION', 'LM-APP-2026-000101', '{"status": "SUBMITTED"}', '{"status": "ASSIGNED", "verifier": "LMO"}', '10.0.4.12'),
    ('c0000000-0000-0000-0000-000000000001', 'lmo@legalmetrology.demo', 'VERIFICATION_SUBMITTED', 'VERIFICATION_RECORD', 'f2000000-0000-0000-0000-000000000001', NULL, '{"result": "PASS"}', '10.0.12.8'),
    ('c0000000-0000-0000-0000-000000000001', 'lmo@legalmetrology.demo', 'CERTIFICATE_GENERATED', 'CERTIFICATE', 'CERT-2026-000101', NULL, '{"status": "VALID", "valid_until": "2027-02-09"}', '10.0.12.8');
