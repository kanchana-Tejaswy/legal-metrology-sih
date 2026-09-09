/**
 * paymentService.js
 * Feature: Razorpay TEST/Sandbox Payment Integration
 * Branch: feature/razorpay-payment
 *
 * Responsibilities:
 *  1. Create Razorpay orders (backend-side, amount determined by server)
 *  2. Verify payment signatures using HMAC-SHA256 (official Razorpay method)
 *  3. Persist payment records in-memory (mirrors existing dual-mode db pattern)
 *
 * Security:
 *  - KEY_SECRET never leaves backend
 *  - Frontend receives only KEY_ID + order_id (both are safe to expose)
 *  - Signature verification happens entirely on backend before cert generation
 */

import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

// ─── In-Memory Payment Store (mirrors existing db.js dual-mode pattern) ────
const paymentStore = new Map(); // Map<razorpay_order_id, paymentRecord>
const appPaymentIndex = new Map(); // Map<application_id, razorpay_order_id>

// ─── Razorpay Config ────────────────────────────────────────────────────────
function getRazorpayConfig() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret ||
      keyId.includes('REPLACE') || keySecret.includes('REPLACE')) {
    throw new Error(
      'Razorpay credentials not configured. ' +
      'Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend/.env ' +
      '(Test mode keys from https://dashboard.razorpay.com/app/keys)'
    );
  }
  return { keyId, keySecret };
}

export const paymentService = {

  /**
   * Creates a Razorpay order via the official REST API.
   * Amount is determined ONLY by the backend (from category.standard_fee).
   * Frontend never controls the amount.
   *
   * @returns {object} payment record including razorpay order details
   */
  async createOrder({ applicationId, verificationRecordId, ownerId, amountRupees, currency = 'INR', instrumentInfo }) {
    const { keyId, keySecret } = getRazorpayConfig();

    // Convert rupees → paise (Razorpay requires integer paise)
    const amountPaise = Math.round(parseFloat(amountRupees) * 100);

    if (amountPaise <= 0) {
      throw new Error('Invalid payment amount. Must be greater than ₹0.');
    }

    // Check if a PAID order already exists for this application (idempotency)
    const existingOrderId = appPaymentIndex.get(applicationId);
    if (existingOrderId) {
      const existing = paymentStore.get(existingOrderId);
      if (existing && existing.status === 'PAID') {
        throw new Error('A verified payment already exists for this application. Certificate may already be issued.');
      }
    }

    // ── Call Razorpay Orders API ──────────────────────────────────────────
    const orderPayload = {
      amount: amountPaise,
      currency,
      receipt: `LM-PAY-${applicationId.slice(-8).toUpperCase()}`,
      notes: {
        application_id: applicationId,
        system: 'SIH-26036-LegalMetrology'
      }
    };

    const credentials = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

    let razorpayOrder;
    try {
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`
        },
        body: JSON.stringify(orderPayload)
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Razorpay API Error:', responseData);
        throw new Error(
          responseData?.error?.description ||
          `Razorpay order creation failed (HTTP ${response.status})`
        );
      }

      razorpayOrder = responseData;
    } catch (err) {
      if (err.message.includes('Razorpay')) throw err;
      throw new Error(`Failed to reach Razorpay API: ${err.message}`);
    }

    // ── Persist payment record ─────────────────────────────────────────────
    const paymentRecord = {
      id: uuidv4(),
      application_id: applicationId,
      verification_record_id: verificationRecordId,
      owner_id: ownerId,
      razorpay_order_id: razorpayOrder.id,
      razorpay_payment_id: null,
      razorpay_signature: null,
      amount_paise: amountPaise,
      currency,
      status: 'CREATED',
      instrument_info: instrumentInfo,
      verified_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    paymentStore.set(razorpayOrder.id, paymentRecord);
    appPaymentIndex.set(applicationId, razorpayOrder.id);

    return {
      paymentRecord,
      razorpayOrder,
      keyId // Safe to return to frontend (public key)
    };
  },

  /**
   * Verifies Razorpay payment using official HMAC-SHA256 signature method.
   * This is the SECURITY GATE — certificate is only issued after this passes.
   *
   * Official Razorpay doc:
   *   generated_signature = HMAC_SHA256(order_id + "|" + payment_id, key_secret)
   *   Assert: generated_signature === razorpay_signature
   *
   * @returns {object} updated payment record with status PAID
   */
  async verifyPayment({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      throw new Error('Missing Razorpay payment verification parameters.');
    }

    const { keySecret } = getRazorpayConfig();

    // ── Retrieve stored payment record ─────────────────────────────────────
    const paymentRecord = paymentStore.get(razorpayOrderId);
    if (!paymentRecord) {
      throw new Error(`Payment record not found for order: ${razorpayOrderId}`);
    }

    // ── Idempotency: already verified ──────────────────────────────────────
    if (paymentRecord.status === 'PAID') {
      return paymentRecord; // Safe to re-return — no duplicate cert (controller checks)
    }

    // ── HMAC-SHA256 Signature Verification ────────────────────────────────
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body)
      .digest('hex');

    const signatureValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(razorpaySignature, 'hex')
    );

    if (!signatureValid) {
      // Mark as FAILED and persist
      paymentRecord.status = 'FAILED';
      paymentRecord.updated_at = new Date().toISOString();
      paymentStore.set(razorpayOrderId, paymentRecord);
      throw new Error('Payment signature verification FAILED. Invalid payment.');
    }

    // ── Signature valid → mark PAID ────────────────────────────────────────
    paymentRecord.razorpay_payment_id = razorpayPaymentId;
    paymentRecord.razorpay_signature = razorpaySignature;
    paymentRecord.status = 'PAID';
    paymentRecord.verified_at = new Date().toISOString();
    paymentRecord.updated_at = new Date().toISOString();
    paymentStore.set(razorpayOrderId, paymentRecord);

    return paymentRecord;
  },

  /**
   * Get payment status for an application (for polling/UI display)
   */
  getPaymentByApplicationId(applicationId) {
    const orderId = appPaymentIndex.get(applicationId);
    if (!orderId) return null;
    return paymentStore.get(orderId) || null;
  },

  /**
   * Get payment by order ID
   */
  getPaymentByOrderId(orderId) {
    return paymentStore.get(orderId) || null;
  }
};
