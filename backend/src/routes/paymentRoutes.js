/**
 * paymentRoutes.js
 * Feature: Razorpay TEST/Sandbox Payment Integration
 * Branch: feature/razorpay-payment
 * Mounted at: /api/payments
 */

import { Router } from 'express';
import { paymentController } from '../controllers/paymentController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

// Create a Razorpay order after LMO/GATC records PASS
// Only LMO, GATC, and ADMIN can create payment orders
router.post(
  '/create-order',
  requireRole('LMO', 'GATC', 'ADMIN'),
  paymentController.createOrder
);

// Verify Razorpay payment signature + issue certificate
// Security gate — signature verified on backend before cert generation
router.post(
  '/verify',
  requireRole('LMO', 'GATC', 'ADMIN'),
  paymentController.verifyAndIssueCertificate
);

// Query payment status for an application
// LMO, GATC, ADMIN, and OWNER can query status
router.get(
  '/:applicationId',
  paymentController.getPaymentStatus
);

export default router;
