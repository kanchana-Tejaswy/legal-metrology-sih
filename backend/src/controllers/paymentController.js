/**
 * paymentController.js
 * Feature: Razorpay TEST/Sandbox Payment Integration
 * Branch: feature/razorpay-payment
 *
 * Endpoints:
 *   POST /api/payments/create-order  — Called after LMO/GATC PASS
 *   POST /api/payments/verify        — Called after frontend Razorpay success
 *   GET  /api/payments/:applicationId — Payment status query
 */

import { db } from '../models/db.js';
import { paymentService } from '../services/paymentService.js';
import { certificateService } from '../services/certificateService.js';
import { qrService } from '../services/qrService.js';
import { auditService } from '../services/auditService.js';
import { notificationService } from '../services/notificationService.js';

// ── Default fee if category doesn't specify one ──────────────────────────────
const DEFAULT_FEE_RUPEES = 100; // ₹100 for SIH demo

/**
 * Determine verification fee from instrument category.
 * Backend controls the amount — frontend cannot override this.
 */
function getVerificationFee(application) {
  const fee = application?.instrument?.category?.standard_fee;
  if (fee && parseFloat(fee) > 0) return parseFloat(fee);
  return DEFAULT_FEE_RUPEES;
}

export const paymentController = {

  /**
   * POST /api/payments/create-order
   *
   * Creates a Razorpay payment order for a verified (PASS) application.
   * Called by LMO/GATC workspace after PASS is recorded.
   * Returns order details + public KEY_ID to frontend.
   *
   * Request body: { application_id, verification_record_id }
   */
  async createOrder(req, res, next) {
    try {
      const { application_id, verification_record_id } = req.body;

      if (!application_id) {
        return res.status(400).json({
          success: false,
          message: 'application_id is required to create a payment order.'
        });
      }

      // Load application with instrument + category data
      const application = await db.getApplicationById(application_id);
      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found.' });
      }

      // Verify caller is authorized for this application
      if (req.user.role !== 'ADMIN' && application.assignment?.verifier_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'You are not the assigned verifier for this application.'
        });
      }

      // Check if payment already verified (idempotency guard)
      const existingPayment = paymentService.getPaymentByApplicationId(application_id);
      if (existingPayment?.status === 'PAID') {
        return res.status(409).json({
          success: false,
          message: 'Payment already verified for this application.',
          payment_status: 'PAID'
        });
      }

      // Backend determines amount — frontend cannot override
      const amountRupees = getVerificationFee(application);

      // Create Razorpay order
      const { paymentRecord, razorpayOrder, keyId } = await paymentService.createOrder({
        applicationId: application_id,
        verificationRecordId: verification_record_id || null,
        ownerId: application.owner_id,
        amountRupees,
        currency: 'INR',
        instrumentInfo: {
          type: application.instrument?.instrument_type,
          serial: application.instrument?.serial_number,
          owner_name: application.owner?.full_name || application.owner?.business_name
        }
      });

      // Audit log
      await auditService.log(
        req,
        'PAYMENT_ORDER_CREATED',
        'PAYMENT',
        paymentRecord.id,
        null,
        {
          application_id,
          razorpay_order_id: razorpayOrder.id,
          amount_paise: razorpayOrder.amount,
          amount_rupees: amountRupees
        }
      );

      return res.status(201).json({
        success: true,
        message: 'Payment order created. Proceed with Razorpay TEST checkout.',
        order: {
          id: razorpayOrder.id,
          amount: razorpayOrder.amount,       // in paise
          amount_rupees: amountRupees,
          currency: razorpayOrder.currency,
          receipt: razorpayOrder.receipt
        },
        key_id: keyId,                        // Public — safe to send to frontend
        payment_id: paymentRecord.id,
        instrument_info: paymentRecord.instrument_info
      });

    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/payments/verify
   *
   * SECURITY GATE: Verifies Razorpay payment signature using HMAC-SHA256.
   * Only after successful verification does certificate generation proceed.
   *
   * Request body:
   *  { razorpay_order_id, razorpay_payment_id, razorpay_signature, application_id }
   */
  async verifyAndIssueCertificate(req, res, next) {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        application_id
      } = req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !application_id) {
        return res.status(400).json({
          success: false,
          message: 'razorpay_order_id, razorpay_payment_id, razorpay_signature, and application_id are all required.'
        });
      }

      // ── STEP 1: Verify payment signature (security gate) ─────────────────
      let verifiedPayment;
      try {
        verifiedPayment = await paymentService.verifyPayment({
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature
        });
      } catch (signatureErr) {
        await auditService.log(
          req,
          'PAYMENT_VERIFICATION_FAILED',
          'PAYMENT',
          razorpay_order_id,
          null,
          { error: signatureErr.message, application_id }
        );
        return res.status(400).json({
          success: false,
          message: signatureErr.message || 'Payment verification failed.'
        });
      }

      // ── STEP 2: Load application data ─────────────────────────────────────
      const application = await db.getApplicationById(application_id);
      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found.' });
      }

      // ── STEP 3: Duplicate certificate guard ───────────────────────────────
      const existingCerts = await db.getCertificates({ owner_id: application.owner_id });
      const dupCert = existingCerts?.find(c => c.verification_record_id === verifiedPayment.verification_record_id);
      if (dupCert) {
        return res.json({
          success: true,
          message: 'Certificate already issued for this verification.',
          certificate: dupCert,
          payment_status: 'PAID',
          already_issued: true
        });
      }

      // ── STEP 4: Load verification record ──────────────────────────────────
      // The verification record was created during the PASS submit
      // We stored its ID in the payment record
      const verificationRecordId = verifiedPayment.verification_record_id;

      // Build a minimal verificationRecord object for certificateService
      // (mirrors structure expected by generateCertificateData)
      const verificationRecord = {
        id: verificationRecordId,
        application_id,
        instrument_id: application.instrument_id,
        verifier_id: application.assignment?.verifier_id || req.user.id,
        result: 'PASS'
      };

      // ── STEP 5: Generate certificate (existing service — unchanged) ────────
      const certData = await certificateService.generateCertificateData({
        verificationRecord,
        instrument: application.instrument,
        owner: application.owner,
        verifier: req.user,
        category: application.instrument?.category
      });

      const certificate = await db.createCertificate(certData);

      // ── STEP 6: Generate QR (existing service — unchanged) ─────────────────
      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const qrCodeData = await qrService.generateVerificationQR(certificate.id, baseUrl);

      // ── STEP 7: Audit logs ────────────────────────────────────────────────
      await auditService.log(
        req,
        'PAYMENT_VERIFIED',
        'PAYMENT',
        verifiedPayment.id,
        { status: 'CREATED' },
        {
          razorpay_payment_id,
          razorpay_order_id,
          amount_paise: verifiedPayment.amount_paise,
          verified_at: verifiedPayment.verified_at
        }
      );

      await auditService.log(
        req,
        'CERTIFICATE_GENERATED',
        'CERTIFICATE',
        certificate.id,
        null,
        {
          instrument_id: application.instrument_id,
          valid_until: certificate.valid_until,
          payment_verified: true
        }
      );

      // ── STEP 8: Notify owner ──────────────────────────────────────────────
      await notificationService.notify(
        application.owner_id,
        'Payment Successful — Verification Certificate Issued',
        `Payment verified and Digital Certificate ${certificate.id} has been issued for ` +
        `${application.instrument?.instrument_type} (${application.instrument?.serial_number}). ` +
        `Valid until: ${certificate.valid_until}.`,
        'INFO',
        'CERTIFICATE',
        certificate.id
      );

      return res.status(201).json({
        success: true,
        message: 'Payment verified. Digital certificate and QR code generated.',
        payment_status: 'PAID',
        certificate,
        qr_code: qrCodeData
      });

    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/payments/:applicationId
   * Query payment status for a given application (Owner/Admin use)
   */
  async getPaymentStatus(req, res, next) {
    try {
      const { applicationId } = req.params;
      const payment = paymentService.getPaymentByApplicationId(applicationId);

      if (!payment) {
        return res.json({ success: true, payment: null, payment_status: 'NONE' });
      }

      return res.json({
        success: true,
        payment_status: payment.status,
        payment: {
          id: payment.id,
          application_id: payment.application_id,
          amount_paise: payment.amount_paise,
          amount_rupees: (payment.amount_paise / 100).toFixed(2),
          currency: payment.currency,
          status: payment.status,
          verified_at: payment.verified_at,
          created_at: payment.created_at
        }
      });
    } catch (err) {
      next(err);
    }
  }
};
