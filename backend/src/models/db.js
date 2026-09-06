import bcrypt from 'bcryptjs';
import { isSupabaseConfigured, supabase } from '../config/supabase.js';

// Pre-hashed password for DemoPassword@2026
const DEMO_PASSWORD_HASH = bcrypt.hashSync('DemoPassword@2026', 10);

// In-Memory Resilient DB Store preloaded with seed records
const memoryDb = {
  users: [
    {
      id: 'a0000000-0000-0000-0000-000000000001',
      email: 'admin@legalmetrology.demo',
      password_hash: DEMO_PASSWORD_HASH,
      role: 'ADMIN',
      status: 'APPROVED',
      full_name: 'Dr. Rajeshwar Verma, IAS',
      phone: '+91 98100 12345',
      created_at: new Date('2026-01-01T09:00:00Z').toISOString()
    },
    {
      id: 'b0000000-0000-0000-0000-000000000001',
      email: 'owner@business.demo',
      password_hash: DEMO_PASSWORD_HASH,
      role: 'OWNER',
      status: 'APPROVED',
      full_name: 'Anand Kumar',
      phone: '+91 98201 54321',
      created_at: new Date('2026-01-10T10:00:00Z').toISOString()
    },
    {
      id: 'b0000000-0000-0000-0000-000000000002',
      email: 'newapplicant@traders.demo',
      password_hash: DEMO_PASSWORD_HASH,
      role: 'OWNER',
      status: 'PENDING',
      full_name: 'Suresh Patel',
      phone: '+91 98450 67890',
      created_at: new Date('2026-02-01T14:30:00Z').toISOString()
    },
    {
      id: 'c0000000-0000-0000-0000-000000000001',
      email: 'lmo@legalmetrology.demo',
      password_hash: DEMO_PASSWORD_HASH,
      role: 'LMO',
      status: 'APPROVED',
      full_name: 'R. Sharma, Inspector LM',
      phone: '+91 94120 11223',
      created_at: new Date('2026-01-05T08:00:00Z').toISOString()
    },
    {
      id: 'd0000000-0000-0000-0000-000000000001',
      email: 'gatc@testcentre.demo',
      password_hash: DEMO_PASSWORD_HASH,
      role: 'GATC',
      status: 'APPROVED',
      full_name: 'Metro Metrology & Testing Lab',
      phone: '+91 98111 88990',
      created_at: new Date('2026-01-08T11:00:00Z').toISOString()
    }
  ],

  stakeholders: [
    {
      id: 's0000000-0000-0000-0000-000000000001',
      user_id: 'b0000000-0000-0000-0000-000000000001',
      business_name: 'ABC Supermarket & Retailers Ltd.',
      business_address: 'Plot No. 42, Commercial Zone, Sector 18',
      state: 'Maharashtra',
      district: 'Mumbai Suburb',
      pincode: '400053',
      trade_license_no: 'TRD-MUM-2024-8841',
      gstin: '27AABCU9603R1ZM',
      supporting_documents: [
        { name: 'Trade_License_Certificate.pdf', url: '/uploads/sample_license.pdf' },
        { name: 'GST_Registration_Certificate.pdf', url: '/uploads/sample_gst.pdf' }
      ],
      review_notes: 'Verified trade registration and valid premises lease agreement.',
      reviewed_by: 'a0000000-0000-0000-0000-000000000001',
      reviewed_at: new Date('2026-01-11T12:00:00Z').toISOString()
    },
    {
      id: 's0000000-0000-0000-0000-000000000002',
      user_id: 'b0000000-0000-0000-0000-000000000002',
      business_name: 'Sri Lakshmi Traders',
      business_address: 'Shop No. 12, APMC Grain Market',
      state: 'Telangana',
      district: 'Hyderabad',
      pincode: '500012',
      trade_license_no: 'TRD-HYD-2026-1092',
      gstin: '36AAACL2901P1ZN',
      supporting_documents: [
        { name: 'Shop_Establishment_Certificate.pdf', url: '/uploads/sample_shop.pdf' }
      ],
      review_notes: null,
      reviewed_by: null,
      reviewed_at: null
    }
  ],

  lmo_profiles: [
    {
      id: 'lp000000-0000-0000-0000-000000000001',
      user_id: 'c0000000-0000-0000-0000-000000000001',
      officer_code: 'LMO-MH-DIV03',
      designation: 'Senior Inspector of Legal Metrology',
      jurisdiction_zone: 'Mumbai Division - Zone 3',
      office_address: 'Legal Metrology Bhavan, Bandra Kurla Complex, Mumbai'
    }
  ],

  gatc_profiles: [
    {
      id: 'gp000000-0000-0000-0000-000000000001',
      user_id: 'd0000000-0000-0000-0000-000000000001',
      centre_name: 'Metro Metrology & Testing Services',
      authorization_no: 'GATC-GOI-W-2023-049',
      authorized_scope: ['EWS', 'PWS', 'PCS'],
      lab_address: 'MIDC Industrial Area, Unit 7B, Andheri East, Mumbai',
      contact_person: 'Praveen Nair (Technical Director)',
      valid_until: '2028-03-31'
    }
  ],

  categories: [
    {
      id: '11111111-1111-1111-1111-111111111001',
      code: 'EWS',
      name: 'Electronic Weighing Scale (Countertop)',
      description: 'Non-automatic weighing instruments for commercial retail transactions up to 30 kg',
      verification_cycle_months: 12,
      accuracy_class: 'Class III',
      standard_fee: 450.00
    },
    {
      id: '11111111-1111-1111-1111-111111111002',
      code: 'PWS',
      name: 'Platform Weighing Scale',
      description: 'Heavy duty platform scales for warehouses and wholesale trade up to 500 kg',
      verification_cycle_months: 12,
      accuracy_class: 'Class III',
      standard_fee: 850.00
    },
    {
      id: '11111111-1111-1111-1111-111111111003',
      code: 'PCS',
      name: 'Price Computing Scale',
      description: 'Electronic retail scales with automatic price computation and thermal print receipt',
      verification_cycle_months: 12,
      accuracy_class: 'Class III',
      standard_fee: 600.00
    },
    {
      id: '11111111-1111-1111-1111-111111111004',
      code: 'WB',
      name: 'Electronic Weighbridge (Pitless / Pit)',
      description: 'Heavy capacity vehicle weighing bridge up to 100 tonnes',
      verification_cycle_months: 24,
      accuracy_class: 'Class IV',
      standard_fee: 4500.00
    },
    {
      id: '11111111-1111-1111-1111-111111111005',
      code: 'FPM',
      name: 'Fuel Dispensing Unit (Petrol/Diesel)',
      description: 'Measuring pumps for petroleum dispensing with calibrated meter unit',
      verification_cycle_months: 12,
      accuracy_class: 'Class 0.5',
      standard_fee: 1200.00
    }
  ],

  instruments: [
    {
      id: 'e0000000-0000-0000-0000-000000000001',
      owner_id: 'b0000000-0000-0000-0000-000000000001',
      category_id: '11111111-1111-1111-1111-111111111001',
      instrument_type: 'Electronic Weighing Scale (Countertop)',
      manufacturer: 'Avery Weigh-Tronix',
      model_number: 'AWT-30D',
      serial_number: 'SN-2024-EWS-8901',
      max_capacity: 30.0000,
      min_capacity: 0.1000,
      unit: 'kg',
      verification_scale_interval: 0.0050,
      location: 'Checkout Counter 1, ABC Supermarket, Bandra West, Mumbai',
      description: 'Digital counter balance with dual LED customer display',
      photograph_url: null,
      current_status: 'VALID',
      created_at: new Date('2026-01-15T10:00:00Z').toISOString()
    },
    {
      id: 'e0000000-0000-0000-0000-000000000002',
      owner_id: 'b0000000-0000-0000-0000-000000000001',
      category_id: '11111111-1111-1111-1111-111111111002',
      instrument_type: 'Platform Weighing Scale',
      manufacturer: 'Essae Teraoka',
      model_number: 'DS-215',
      serial_number: 'SN-2024-PWS-4412',
      max_capacity: 300.0000,
      min_capacity: 2.0000,
      unit: 'kg',
      verification_scale_interval: 0.0500,
      location: 'Goods Receiving Dock 2, ABC Supermarket, Mumbai',
      description: 'Heavy duty low profile warehouse platform scale',
      photograph_url: null,
      current_status: 'EXPIRING_SOON',
      created_at: new Date('2026-01-20T11:00:00Z').toISOString()
    },
    {
      id: 'e0000000-0000-0000-0000-000000000003',
      owner_id: 'b0000000-0000-0000-0000-000000000001',
      category_id: '11111111-1111-1111-1111-111111111003',
      instrument_type: 'Price Computing Scale',
      manufacturer: 'CAS India Corp',
      model_number: 'PR-PLUS',
      serial_number: 'SN-2023-PCS-1029',
      max_capacity: 15.0000,
      min_capacity: 0.0400,
      unit: 'kg',
      verification_scale_interval: 0.0020,
      location: 'Produce Section, ABC Supermarket, Mumbai',
      description: 'Weighing scale with thermal barcode sticker printer',
      photograph_url: null,
      current_status: 'EXPIRED',
      created_at: new Date('2025-01-10T09:00:00Z').toISOString()
    },
    {
      id: 'e0000000-0000-0000-0000-000000000004',
      owner_id: 'b0000000-0000-0000-0000-000000000001',
      category_id: '11111111-1111-1111-1111-111111111001',
      instrument_type: 'Electronic Weighing Scale (Countertop)',
      manufacturer: 'Mettler Toledo',
      model_number: 'bPlus-T2',
      serial_number: 'SN-2026-EWS-7741',
      max_capacity: 15.0000,
      min_capacity: 0.0400,
      unit: 'kg',
      verification_scale_interval: 0.0020,
      location: 'Deli & Bakery Section, ABC Supermarket, Mumbai',
      description: 'New high accuracy touch price computing counter scale',
      photograph_url: null,
      current_status: 'PENDING',
      created_at: new Date('2026-02-01T15:00:00Z').toISOString()
    }
  ],

  applications: [
    {
      id: 'LM-APP-2026-000101',
      owner_id: 'b0000000-0000-0000-0000-000000000001',
      instrument_id: 'e0000000-0000-0000-0000-000000000001',
      application_type: 'NEW',
      preferred_date: '2026-02-10',
      preferred_time: '10:30 AM',
      remarks: 'Initial stamping and verification after installation at new counter',
      status: 'COMPLETED',
      documents: [{ name: 'Invoice.pdf', url: '/uploads/invoice.pdf' }],
      created_at: new Date('2026-02-01T10:00:00Z').toISOString(),
      updated_at: new Date('2026-02-10T12:00:00Z').toISOString()
    },
    {
      id: 'LM-APP-2026-000102',
      owner_id: 'b0000000-0000-0000-0000-000000000001',
      instrument_id: 'e0000000-0000-0000-0000-000000000002',
      application_type: 'RE_VERIFICATION',
      preferred_date: '2026-09-15',
      preferred_time: '02:00 PM',
      remarks: 'Annual re-verification application before certificate expiration',
      status: 'SCHEDULED',
      documents: [{ name: 'Previous_Cert.pdf', url: '/uploads/prev_cert.pdf' }],
      created_at: new Date('2026-09-01T11:00:00Z').toISOString(),
      updated_at: new Date('2026-09-02T16:00:00Z').toISOString()
    },
    {
      id: 'LM-APP-2026-000103',
      owner_id: 'b0000000-0000-0000-0000-000000000001',
      instrument_id: 'e0000000-0000-0000-0000-000000000004',
      application_type: 'NEW',
      preferred_date: '2026-09-18',
      preferred_time: '11:00 AM',
      remarks: 'New counter installation testing at GATC accredited lab',
      status: 'ASSIGNED',
      documents: [{ name: 'Factory_Calibration.pdf', url: '/uploads/factory.pdf' }],
      created_at: new Date('2026-09-03T09:30:00Z').toISOString(),
      updated_at: new Date('2026-09-04T14:20:00Z').toISOString()
    }
  ],

  assignments: [
    {
      id: 'f0000000-0000-0000-0000-000000000001',
      application_id: 'LM-APP-2026-000101',
      verifier_type: 'LMO',
      verifier_id: 'c0000000-0000-0000-0000-000000000001',
      assigned_by: 'a0000000-0000-0000-0000-000000000001',
      assigned_date: '2026-02-05T10:00:00Z',
      notes: 'Assigned to Ward Inspector for on-site physical verification',
      is_active: true
    },
    {
      id: 'f0000000-0000-0000-0000-000000000002',
      application_id: 'LM-APP-2026-000102',
      verifier_type: 'LMO',
      verifier_id: 'c0000000-0000-0000-0000-000000000001',
      assigned_by: 'a0000000-0000-0000-0000-000000000001',
      assigned_date: '2026-09-02T11:00:00Z',
      notes: 'Assigned to Inspector R. Sharma for scheduled annual re-stamping',
      is_active: true
    },
    {
      id: 'f0000000-0000-0000-0000-000000000003',
      application_id: 'LM-APP-2026-000103',
      verifier_type: 'GATC',
      verifier_id: 'd0000000-0000-0000-0000-000000000001',
      assigned_by: 'a0000000-0000-0000-0000-000000000001',
      assigned_date: '2026-09-04T12:00:00Z',
      notes: 'Allocated to GATC Metro Lab under accredited scope EWS',
      is_active: true
    }
  ],

  schedules: [
    {
      id: 'f1000000-0000-0000-0000-000000000001',
      application_id: 'LM-APP-2026-000101',
      scheduled_date: '2026-02-10',
      scheduled_time: '10:30 AM',
      location: 'Plot No. 42, Commercial Zone, Sector 18, Mumbai',
      verifier_id: 'c0000000-0000-0000-0000-000000000001',
      status: 'COMPLETED'
    },
    {
      id: 'f1000000-0000-0000-0000-000000000002',
      application_id: 'LM-APP-2026-000102',
      scheduled_date: '2026-09-15',
      scheduled_time: '02:00 PM',
      location: 'Dock 2, Plot No. 42, Sector 18, Mumbai',
      verifier_id: 'c0000000-0000-0000-0000-000000000001',
      status: 'SCHEDULED'
    },
    {
      id: 'f1000000-0000-0000-0000-000000000003',
      application_id: 'LM-APP-2026-000103',
      scheduled_date: '2026-09-18',
      scheduled_time: '11:00 AM',
      location: 'MIDC Industrial Area, Unit 7B, Andheri East, Mumbai',
      verifier_id: 'd0000000-0000-0000-0000-000000000001',
      status: 'SCHEDULED'
    }
  ],

  verification_records: [
    {
      id: 'f2000000-0000-0000-0000-000000000001',
      application_id: 'LM-APP-2026-000101',
      instrument_id: 'e0000000-0000-0000-0000-000000000001',
      verifier_id: 'c0000000-0000-0000-0000-000000000001',
      verifier_role: 'LMO',
      inspection_date: '2026-02-10T11:15:00Z',
      visual_checklist: {
        stamping_intact: true,
        spirit_level_centered: true,
        plate_condition_clean: true,
        zero_tracking_functional: true
      },
      metrological_tests: {
        repeatability_error_g: 0.001,
        eccentricity_error_g: 0.001,
        max_load_test_kg: 30,
        error_at_max_load_g: 0.002,
        max_permissible_error_g: 0.005
      },
      observations: 'Physical and metrological verification carried out using Standard Working Weights F2 Class. Zero return verified. Repeatability test over 10 consecutive cycles satisfactory.',
      test_results: 'Max load deviation +2g at 30kg, well within Maximum Permissible Error (MPE +/- 5g). Eccentricity test across 4 quadrants passed.',
      evidence_photos: [
        { name: 'Lead_Seal_MH2026.jpg', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60' }
      ],
      remarks: 'Lead verification seal applied at rear calibration port (Seal Tag No: MH/MUM/2026/0912). Instrument verified fit for commercial use.',
      result: 'PASS',
      created_at: '2026-02-10T11:30:00Z'
    }
  ],

  certificates: [
    {
      id: 'CERT-2026-000101',
      verification_record_id: 'f2000000-0000-0000-0000-000000000001',
      instrument_id: 'e0000000-0000-0000-0000-000000000001',
      owner_id: 'b0000000-0000-0000-0000-000000000001',
      verifier_id: 'c0000000-0000-0000-0000-000000000001',
      verifying_authority: 'Legal Metrology Department, Government of Maharashtra',
      verifier_name: 'R. Sharma (Senior Inspector)',
      verification_date: '2026-02-10',
      valid_until: '2027-02-09',
      status: 'VALID',
      qr_verification_url: '/verify/CERT-2026-000101',
      digital_signature_hash: 'SHA256:d8a57e3f940b5c192d4e84b2c8901f41e5a87b1c3d2e9f0a7b4c6d8e0f1a3b5c',
      pdf_url: null,
      revocation_reason: null,
      revoked_at: null,
      revoked_by: null,
      created_at: '2026-02-10T11:35:00Z',
      updated_at: '2026-02-10T11:35:00Z'
    },
    {
      id: 'CERT-2025-000088',
      verification_record_id: 'f2000000-0000-0000-0000-000000000001',
      instrument_id: 'e0000000-0000-0000-0000-000000000003',
      owner_id: 'b0000000-0000-0000-0000-000000000001',
      verifier_id: 'c0000000-0000-0000-0000-000000000001',
      verifying_authority: 'Legal Metrology Department, Government of Maharashtra',
      verifier_name: 'R. Sharma (Senior Inspector)',
      verification_date: '2025-01-10',
      valid_until: '2026-01-09', // Expired in the past
      status: 'EXPIRED',
      qr_verification_url: '/verify/CERT-2025-000088',
      digital_signature_hash: 'SHA256:bb71904a180371a53b01850123efdca8203c98305886616b7617b4c092003881',
      pdf_url: null,
      revocation_reason: null,
      revoked_at: null,
      revoked_by: null,
      created_at: '2025-01-10T11:00:00Z',
      updated_at: '2026-01-10T00:00:00Z'
    }
  ],

  notifications: [
    {
      id: 'n0000000-0000-0000-0000-000000000001',
      user_id: 'b0000000-0000-0000-0000-000000000001',
      title: 'Verification Certificate Issued',
      message: 'Official Legal Metrology Certificate CERT-2026-000101 has been issued for Electronic Weighing Scale (SN-2024-EWS-8901).',
      type: 'INFO',
      related_entity_type: 'CERTIFICATE',
      related_entity_id: 'CERT-2026-000101',
      is_read: false,
      created_at: '2026-02-10T12:00:00Z'
    },
    {
      id: 'n0000000-0000-0000-0000-000000000002',
      user_id: 'b0000000-0000-0000-0000-000000000001',
      title: 'Certificate Expiring Soon (30 Days Notice)',
      message: 'Certificate for Platform Scale (SN-2024-PWS-4412) is approaching expiration. Please submit re-verification application.',
      type: 'EXPIRY',
      related_entity_type: 'INSTRUMENT',
      related_entity_id: 'e0000000-0000-0000-0000-000000000002',
      is_read: false,
      created_at: '2026-09-01T09:00:00Z'
    },
    {
      id: 'n0000000-0000-0000-0000-000000000003',
      user_id: 'b0000000-0000-0000-0000-000000000001',
      title: 'Verification Scheduled',
      message: 'Re-verification for application LM-APP-2026-000102 has been scheduled for 2026-09-15 at 02:00 PM with Inspector R. Sharma.',
      type: 'STATUS_CHANGE',
      related_entity_type: 'APPLICATION',
      related_entity_id: 'LM-APP-2026-000102',
      is_read: true,
      created_at: '2026-09-02T16:05:00Z'
    }
  ],

  audit_logs: [
    {
      id: 'al000000-0000-0000-0000-000000000001',
      user_id: 'a0000000-0000-0000-0000-000000000001',
      user_email: 'admin@legalmetrology.demo',
      action: 'STAKEHOLDER_APPROVED',
      entity_type: 'STAKEHOLDER',
      entity_id: 'b0000000-0000-0000-0000-000000000001',
      previous_state: { status: 'PENDING' },
      new_state: { status: 'APPROVED' },
      ip_address: '10.0.4.12',
      created_at: '2026-01-11T12:00:00Z'
    },
    {
      id: 'al000000-0000-0000-0000-000000000002',
      user_id: 'a0000000-0000-0000-0000-000000000001',
      user_email: 'admin@legalmetrology.demo',
      action: 'APPLICATION_ASSIGNED',
      entity_type: 'APPLICATION',
      entity_id: 'LM-APP-2026-000101',
      previous_state: { status: 'SUBMITTED' },
      new_state: { status: 'ASSIGNED', verifier_type: 'LMO', verifier: 'Inspector R. Sharma' },
      ip_address: '10.0.4.12',
      created_at: '2026-02-05T10:00:00Z'
    },
    {
      id: 'al000000-0000-0000-0000-000000000003',
      user_id: 'c0000000-0000-0000-0000-000000000001',
      user_email: 'lmo@legalmetrology.demo',
      action: 'VERIFICATION_SUBMITTED',
      entity_type: 'VERIFICATION_RECORD',
      entity_id: 'f2000000-0000-0000-0000-000000000001',
      previous_state: null,
      new_state: { result: 'PASS', instrument_id: 'e0000000-0000-0000-0000-000000000001' },
      ip_address: '10.0.12.8',
      created_at: '2026-02-10T11:30:00Z'
    },
    {
      id: 'al000000-0000-0000-0000-000000000004',
      user_id: 'c0000000-0000-0000-0000-000000000001',
      user_email: 'lmo@legalmetrology.demo',
      action: 'CERTIFICATE_GENERATED',
      entity_type: 'CERTIFICATE',
      entity_id: 'CERT-2026-000101',
      previous_state: null,
      new_state: { status: 'VALID', valid_until: '2027-02-09' },
      ip_address: '10.0.12.8',
      created_at: '2026-02-10T11:35:00Z'
    }
  ]
};

// HELPER: Auto-calculate certificate validity on read
function enrichCertificateValidity(cert) {
  if (!cert) return null;
  const copy = { ...cert };
  // If not revoked, check against current date
  if (copy.status !== 'REVOKED') {
    const today = new Date();
    const expiry = new Date(copy.valid_until);
    if (today > expiry) {
      copy.status = 'EXPIRED';
    }
  }
  return copy;
}

// DATABASE ADAPTER EXPORTS
export const db = {
  // Users
  async findUserByEmail(email) {
    const normalized = email.trim().toLowerCase();
    const user = memoryDb.users.find(u => u.email.toLowerCase() === normalized);
    return user ? { ...user } : null;
  },

  async findUserById(id) {
    const user = memoryDb.users.find(u => u.id === id);
    return user ? { ...user } : null;
  },

  async createUser(userData) {
    const newUser = {
      id: userData.id || `u-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      email: userData.email.trim().toLowerCase(),
      password_hash: userData.password_hash,
      role: userData.role || 'OWNER',
      status: userData.status || 'PENDING',
      full_name: userData.full_name,
      phone: userData.phone,
      created_at: new Date().toISOString()
    };
    memoryDb.users.push(newUser);
    return { ...newUser };
  },

  async updateUserStatus(userId, status, reviewedBy = null, reviewNotes = null) {
    const user = memoryDb.users.find(u => u.id === userId);
    if (user) {
      user.status = status;
      const stakeholder = memoryDb.stakeholders.find(s => s.user_id === userId);
      if (stakeholder) {
        stakeholder.reviewed_by = reviewedBy;
        stakeholder.review_notes = reviewNotes;
        stakeholder.reviewed_at = new Date().toISOString();
      }
      return { ...user };
    }
    return null;
  },

  async getAllUsers(roleFilter = null) {
    let list = memoryDb.users;
    if (roleFilter) {
      list = list.filter(u => u.role === roleFilter);
    }
    return list.map(u => {
      const stakeholder = memoryDb.stakeholders.find(s => s.user_id === u.id);
      const lmoProfile = memoryDb.lmo_profiles.find(l => l.user_id === u.id);
      const gatcProfile = memoryDb.gatc_profiles.find(g => g.user_id === u.id);
      return {
        ...u,
        stakeholder,
        lmo_profile: lmoProfile,
        gatc_profile: gatcProfile
      };
    });
  },

  // Stakeholders
  async getStakeholderByUserId(userId) {
    const s = memoryDb.stakeholders.find(item => item.user_id === userId);
    return s ? { ...s } : null;
  },

  async createStakeholder(stakeholderData) {
    const newStakeholder = {
      id: `s-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      user_id: stakeholderData.user_id,
      business_name: stakeholderData.business_name,
      business_address: stakeholderData.business_address,
      state: stakeholderData.state || 'Maharashtra',
      district: stakeholderData.district || 'Mumbai',
      pincode: stakeholderData.pincode || '400001',
      trade_license_no: stakeholderData.trade_license_no || null,
      gstin: stakeholderData.gstin || null,
      supporting_documents: stakeholderData.supporting_documents || [],
      review_notes: null,
      reviewed_by: null,
      reviewed_at: null,
      created_at: new Date().toISOString()
    };
    memoryDb.stakeholders.push(newStakeholder);
    return { ...newStakeholder };
  },

  // Categories
  async getCategories() {
    return [...memoryDb.categories];
  },

  async getCategoryById(id) {
    const cat = memoryDb.categories.find(c => c.id === id || c.code === id);
    return cat ? { ...cat } : null;
  },

  // Instruments
  async getInstruments(filters = {}) {
    let items = memoryDb.instruments;
    if (filters.owner_id) {
      items = items.filter(i => i.owner_id === filters.owner_id);
    }
    if (filters.status) {
      items = items.filter(i => i.current_status === filters.status);
    }

    // Enrich with Category and Latest Certificate details
    return items.map(inst => {
      const category = memoryDb.categories.find(c => c.id === inst.category_id);
      const cert = memoryDb.certificates
        .filter(c => c.instrument_id === inst.id)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
      return {
        ...inst,
        category,
        certificate: enrichCertificateValidity(cert)
      };
    });
  },

  async getInstrumentById(id) {
    const inst = memoryDb.instruments.find(i => i.id === id);
    if (!inst) return null;
    const category = memoryDb.categories.find(c => c.id === inst.category_id);
    const cert = memoryDb.certificates
      .filter(c => c.instrument_id === inst.id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
    const owner = memoryDb.users.find(u => u.id === inst.owner_id);
    const stakeholder = memoryDb.stakeholders.find(s => s.user_id === inst.owner_id);
    return {
      ...inst,
      category,
      certificate: enrichCertificateValidity(cert),
      owner: owner ? { ...owner, business_name: stakeholder?.business_name } : null
    };
  },

  async checkSerialUnique(categoryId, serialNumber) {
    const exists = memoryDb.instruments.some(
      i => i.category_id === categoryId && i.serial_number.toLowerCase() === serialNumber.trim().toLowerCase()
    );
    return !exists;
  },

  async createInstrument(instData) {
    const newInst = {
      id: `inst-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      owner_id: instData.owner_id,
      category_id: instData.category_id,
      instrument_type: instData.instrument_type,
      manufacturer: instData.manufacturer,
      model_number: instData.model_number,
      serial_number: instData.serial_number.trim(),
      max_capacity: parseFloat(instData.max_capacity),
      min_capacity: parseFloat(instData.min_capacity),
      unit: instData.unit || 'kg',
      verification_scale_interval: instData.verification_scale_interval ? parseFloat(instData.verification_scale_interval) : null,
      location: instData.location,
      description: instData.description || '',
      photograph_url: instData.photograph_url || null,
      current_status: 'PENDING',
      created_at: new Date().toISOString()
    };
    memoryDb.instruments.push(newInst);
    return this.getInstrumentById(newInst.id);
  },

  async updateInstrumentStatus(id, status) {
    const inst = memoryDb.instruments.find(i => i.id === id);
    if (inst) {
      inst.current_status = status;
      return { ...inst };
    }
    return null;
  },

  // Applications
  async getApplications(filters = {}) {
    let items = memoryDb.applications;
    if (filters.owner_id) {
      items = items.filter(a => a.owner_id === filters.owner_id);
    }
    if (filters.status) {
      items = items.filter(a => a.status === filters.status);
    }
    if (filters.verifier_id) {
      const assignedAppIds = memoryDb.assignments
        .filter(as => as.verifier_id === filters.verifier_id && as.is_active)
        .map(as => as.application_id);
      items = items.filter(a => assignedAppIds.includes(a.id));
    }

    return items.map(app => {
      const instrument = memoryDb.instruments.find(i => i.id === app.instrument_id);
      const category = instrument ? memoryDb.categories.find(c => c.id === instrument.category_id) : null;
      const owner = memoryDb.users.find(u => u.id === app.owner_id);
      const stakeholder = memoryDb.stakeholders.find(s => s.user_id === app.owner_id);
      const assignment = memoryDb.assignments.find(as => as.application_id === app.id && as.is_active);
      const schedule = memoryDb.schedules.find(sc => sc.application_id === app.id);
      let verifierDetails = null;
      if (assignment) {
        const vUser = memoryDb.users.find(u => u.id === assignment.verifier_id);
        verifierDetails = {
          type: assignment.verifier_type,
          id: assignment.verifier_id,
          name: vUser?.full_name || 'Assigned Verifier',
          email: vUser?.email
        };
      }

      return {
        ...app,
        instrument: instrument ? { ...instrument, category } : null,
        owner: owner ? { ...owner, business_name: stakeholder?.business_name } : null,
        assignment,
        verifier: verifierDetails,
        schedule
      };
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async getApplicationById(id) {
    const app = memoryDb.applications.find(a => a.id === id);
    if (!app) return null;
    const instrument = memoryDb.instruments.find(i => i.id === app.instrument_id);
    const category = instrument ? memoryDb.categories.find(c => c.id === instrument.category_id) : null;
    const owner = memoryDb.users.find(u => u.id === app.owner_id);
    const stakeholder = memoryDb.stakeholders.find(s => s.user_id === app.owner_id);
    const assignment = memoryDb.assignments.find(as => as.application_id === app.id && as.is_active);
    const schedule = memoryDb.schedules.find(sc => sc.application_id === app.id);
    const verificationRecord = memoryDb.verification_records.find(vr => vr.application_id === app.id);
    const certificate = memoryDb.certificates.find(c => c.instrument_id === app.instrument_id);

    let verifier = null;
    if (assignment) {
      const vUser = memoryDb.users.find(u => u.id === assignment.verifier_id);
      verifier = {
        type: assignment.verifier_type,
        id: assignment.verifier_id,
        name: vUser?.full_name,
        email: vUser?.email
      };
    }

    return {
      ...app,
      instrument: instrument ? { ...instrument, category } : null,
      owner: owner ? { ...owner, business_name: stakeholder?.business_name, stakeholder } : null,
      assignment,
      verifier,
      schedule,
      verification_record: verificationRecord,
      certificate: enrichCertificateValidity(certificate)
    };
  },

  async createApplication(appData) {
    const year = new Date().getFullYear();
    const count = memoryDb.applications.length + 101;
    const appId = `LM-APP-${year}-${String(count).padStart(6, '0')}`;

    const newApp = {
      id: appId,
      owner_id: appData.owner_id,
      instrument_id: appData.instrument_id,
      application_type: appData.application_type || 'NEW',
      preferred_date: appData.preferred_date,
      preferred_time: appData.preferred_time || '10:00 AM',
      remarks: appData.remarks || '',
      status: 'SUBMITTED',
      documents: appData.documents || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    memoryDb.applications.push(newApp);

    // Update instrument status to PENDING / UNDER_VERIFICATION
    await this.updateInstrumentStatus(appData.instrument_id, 'PENDING');

    return this.getApplicationById(newApp.id);
  },

  async updateApplicationStatus(appId, status) {
    const app = memoryDb.applications.find(a => a.id === appId);
    if (app) {
      app.status = status;
      app.updated_at = new Date().toISOString();
      return { ...app };
    }
    return null;
  },

  // Allocation & Scheduling
  async assignApplication(appId, verifierType, verifierId, assignedBy, notes = '') {
    // Deactivate previous active assignment
    memoryDb.assignments.forEach(as => {
      if (as.application_id === appId) as.is_active = false;
    });

    const newAssignment = {
      id: `as-${Date.now()}`,
      application_id: appId,
      verifier_type: verifierType, // 'LMO' or 'GATC'
      verifier_id: verifierId,
      assigned_by: assignedBy,
      assigned_date: new Date().toISOString(),
      notes,
      is_active: true
    };
    memoryDb.assignments.push(newAssignment);

    // Update Application status
    await this.updateApplicationStatus(appId, 'ASSIGNED');

    return newAssignment;
  },

  async scheduleVerification(appId, date, time, location, verifierId, notes = '') {
    let schedule = memoryDb.schedules.find(s => s.application_id === appId);
    if (schedule) {
      schedule.scheduled_date = date;
      schedule.scheduled_time = time;
      schedule.location = location;
      schedule.verifier_id = verifierId;
      schedule.status = 'SCHEDULED';
      schedule.reschedule_reason = notes;
      schedule.updated_at = new Date().toISOString();
    } else {
      schedule = {
        id: `sc-${Date.now()}`,
        application_id: appId,
        scheduled_date: date,
        scheduled_time: time,
        location,
        verifier_id: verifierId,
        status: 'SCHEDULED',
        created_at: new Date().toISOString()
      };
      memoryDb.schedules.push(schedule);
    }

    await this.updateApplicationStatus(appId, 'SCHEDULED');
    return schedule;
  },

  // Verification
  async createVerificationRecord(recordData) {
    const newRecord = {
      id: `vr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      application_id: recordData.application_id,
      instrument_id: recordData.instrument_id,
      verifier_id: recordData.verifier_id,
      verifier_role: recordData.verifier_role, // 'LMO' or 'GATC'
      inspection_date: new Date().toISOString(),
      visual_checklist: recordData.visual_checklist || {},
      metrological_tests: recordData.metrological_tests || {},
      observations: recordData.observations || '',
      test_results: recordData.test_results || '',
      evidence_photos: recordData.evidence_photos || [],
      remarks: recordData.remarks || '',
      result: recordData.result, // 'PASS' or 'FAIL'
      created_at: new Date().toISOString()
    };
    memoryDb.verification_records.push(newRecord);

    // Update Application and Instrument status based on PASS / FAIL
    if (recordData.result === 'PASS') {
      await this.updateApplicationStatus(recordData.application_id, 'COMPLETED');
      await this.updateInstrumentStatus(recordData.instrument_id, 'VALID');
    } else {
      await this.updateApplicationStatus(recordData.application_id, 'FAILED');
      await this.updateInstrumentStatus(recordData.instrument_id, 'FAILED');
    }

    return newRecord;
  },

  // Certificates
  async createCertificate(certData) {
    const year = new Date().getFullYear();
    const count = memoryDb.certificates.length + 101;
    const certId = `CERT-${year}-${String(count).padStart(6, '0')}`;

    const newCert = {
      id: certId,
      verification_record_id: certData.verification_record_id,
      instrument_id: certData.instrument_id,
      owner_id: certData.owner_id,
      verifier_id: certData.verifier_id,
      verifying_authority: certData.verifying_authority || 'Department of Legal Metrology, Government of India',
      verifier_name: certData.verifier_name,
      verification_date: certData.verification_date || new Date().toISOString().split('T')[0],
      valid_until: certData.valid_until,
      status: 'VALID',
      qr_verification_url: `/verify/${certId}`,
      digital_signature_hash: certData.digital_signature_hash || `SHA256:${Math.random().toString(36).substring(2)}${Date.now()}`,
      pdf_url: null,
      revocation_reason: null,
      revoked_at: null,
      revoked_by: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    memoryDb.certificates.push(newCert);
    return this.getCertificateById(newCert.id);
  },

  async getCertificates(filters = {}) {
    let items = memoryDb.certificates;
    if (filters.owner_id) {
      items = items.filter(c => c.owner_id === filters.owner_id);
    }
    if (filters.status) {
      items = items.filter(c => c.status === filters.status);
    }

    return items.map(c => {
      const enriched = enrichCertificateValidity(c);
      const instrument = memoryDb.instruments.find(i => i.id === c.instrument_id);
      const owner = memoryDb.users.find(u => u.id === c.owner_id);
      const stakeholder = memoryDb.stakeholders.find(s => s.user_id === c.owner_id);
      return {
        ...enriched,
        instrument,
        owner: owner ? { ...owner, business_name: stakeholder?.business_name } : null
      };
    }).sort((a, b) => new Date(b.verification_date) - new Date(a.verification_date));
  },

  async getCertificateById(id) {
    const cert = memoryDb.certificates.find(c => c.id === id);
    if (!cert) return null;
    const enriched = enrichCertificateValidity(cert);
    const instrument = memoryDb.instruments.find(i => i.id === cert.instrument_id);
    const category = instrument ? memoryDb.categories.find(cat => cat.id === instrument.category_id) : null;
    const owner = memoryDb.users.find(u => u.id === cert.owner_id);
    const stakeholder = memoryDb.stakeholders.find(s => s.user_id === cert.owner_id);
    const verifier = memoryDb.users.find(u => u.id === cert.verifier_id);
    const verificationRecord = memoryDb.verification_records.find(vr => vr.id === cert.verification_record_id);

    return {
      ...enriched,
      instrument: instrument ? { ...instrument, category } : null,
      owner: owner ? { ...owner, business_name: stakeholder?.business_name, stakeholder } : null,
      verifier: verifier ? { id: verifier.id, name: verifier.full_name, email: verifier.email, role: verifier.role } : null,
      verification_record: verificationRecord
    };
  },

  async revokeCertificate(id, reason, revokedBy) {
    const cert = memoryDb.certificates.find(c => c.id === id);
    if (!cert) return null;
    cert.status = 'REVOKED';
    cert.revocation_reason = reason;
    cert.revoked_at = new Date().toISOString();
    cert.revoked_by = revokedBy;
    cert.updated_at = new Date().toISOString();

    // Mark corresponding instrument as FAILED or EXPIRED
    await this.updateInstrumentStatus(cert.instrument_id, 'FAILED');

    return this.getCertificateById(id);
  },

  // Notifications
  async getNotifications(userId) {
    return memoryDb.notifications
      .filter(n => n.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async createNotification(notifData) {
    const newNotif = {
      id: `n-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      user_id: notifData.user_id,
      title: notifData.title,
      message: notifData.message,
      type: notifData.type || 'INFO',
      related_entity_type: notifData.related_entity_type || null,
      related_entity_id: notifData.related_entity_id || null,
      is_read: false,
      created_at: new Date().toISOString()
    };
    memoryDb.notifications.push(newNotif);
    return newNotif;
  },

  async markNotificationRead(id) {
    const notif = memoryDb.notifications.find(n => n.id === id);
    if (notif) {
      notif.is_read = true;
      return notif;
    }
    return null;
  },

  // Audit Logs
  async createAuditLog(logData) {
    const newLog = {
      id: `al-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      user_id: logData.user_id || null,
      user_email: logData.user_email || 'system',
      action: logData.action,
      entity_type: logData.entity_type,
      entity_id: String(logData.entity_id),
      previous_state: logData.previous_state || null,
      new_state: logData.new_state || null,
      ip_address: logData.ip_address || '127.0.0.1',
      created_at: new Date().toISOString()
    };
    memoryDb.audit_logs.push(newLog);
    return newLog;
  },

  async getAuditLogs(filters = {}) {
    let logs = memoryDb.audit_logs;
    if (filters.action) {
      logs = logs.filter(l => l.action.includes(filters.action));
    }
    if (filters.entity_type) {
      logs = logs.filter(l => l.entity_type === filters.entity_type);
    }
    return logs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  // Profiles
  async getLmoProfiles() {
    return memoryDb.lmo_profiles.map(lp => {
      const user = memoryDb.users.find(u => u.id === lp.user_id);
      return { ...lp, user: user ? { id: user.id, full_name: user.full_name, email: user.email } : null };
    });
  },

  async getGatcProfiles() {
    return memoryDb.gatc_profiles.map(gp => {
      const user = memoryDb.users.find(u => u.id === gp.user_id);
      return { ...gp, user: user ? { id: user.id, full_name: user.full_name, email: user.email } : null };
    });
  },

  // Aggregated Stats for Dashboards
  async getAdminStats() {
    const totalApps = memoryDb.applications.length;
    const newApps = memoryDb.applications.filter(a => a.status === 'SUBMITTED').length;
    const pendingAlloc = memoryDb.applications.filter(a => a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW').length;
    const scheduled = memoryDb.applications.filter(a => a.status === 'SCHEDULED').length;
    const underVerification = memoryDb.applications.filter(a => a.status === 'ASSIGNED' || a.status === 'UNDER_VERIFICATION').length;
    const completed = memoryDb.applications.filter(a => a.status === 'COMPLETED').length;
    const failed = memoryDb.applications.filter(a => a.status === 'FAILED').length;
    
    // Certificates stats
    const certs = memoryDb.certificates.map(enrichCertificateValidity);
    const validCerts = certs.filter(c => c.status === 'VALID').length;
    const expiredCerts = certs.filter(c => c.status === 'EXPIRED').length;
    const revokedCerts = certs.filter(c => c.status === 'REVOKED').length;

    // Stakeholders pending
    const pendingStakeholders = memoryDb.users.filter(u => u.role === 'OWNER' && u.status === 'PENDING').length;

    return {
      totalApplications: totalApps,
      newApplications: newApps,
      pendingAllocation: pendingAlloc,
      scheduled,
      underVerification,
      completed,
      failed,
      validCertificates: validCerts,
      expiredCertificates: expiredCerts,
      revokedCertificates: revokedCerts,
      pendingStakeholders,
      totalInstruments: memoryDb.instruments.length
    };
  },

  async getOwnerStats(ownerId) {
    const instruments = memoryDb.instruments.filter(i => i.owner_id === ownerId);
    const applications = memoryDb.applications.filter(a => a.owner_id === ownerId);
    const certs = memoryDb.certificates.filter(c => c.owner_id === ownerId).map(enrichCertificateValidity);

    const validCerts = certs.filter(c => c.status === 'VALID').length;
    const expiredCerts = certs.filter(c => c.status === 'EXPIRED').length;
    
    // Expiring soon: valid and valid_until is within 30 days
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    const expiringSoon = certs.filter(c => {
      if (c.status !== 'VALID') return false;
      const expiry = new Date(c.valid_until);
      return expiry >= now && expiry <= thirtyDaysFromNow;
    }).length;

    const pendingApps = applications.filter(a => ['SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'SCHEDULED', 'UNDER_VERIFICATION'].includes(a.status)).length;

    return {
      totalInstruments: instruments.length,
      pendingApplications: pendingApps,
      validCertificates: validCerts,
      expiringSoon,
      expiredCertificates: expiredCerts
    };
  }
};
