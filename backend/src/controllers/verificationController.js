import { db } from '../models/db.js';
import { auditService } from '../services/auditService.js';
import { notificationService } from '../services/notificationService.js';
// NOTE: certificateService and qrService are now called from paymentController
//       after payment is verified. They are NOT imported here anymore.

export const verificationController = {
  /**
   * Get application data for verification workspace
   */
  async getWorkspace(req, res, next) {
    try {
      const { id } = req.params;
      const application = await db.getApplicationById(id);

      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }

      // Ensure verifier is authorized for this application
      if (req.user.role !== 'ADMIN' && application.assignment?.verifier_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: You are not the assigned verifier for this application.'
        });
      }

      // Fetch verification history for this instrument
      const previousApps = (await db.getApplications())
        .filter(a => a.instrument_id === application.instrument_id && a.id !== application.id)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      return res.json({
        success: true,
        workspace: {
          application,
          instrument: application.instrument,
          owner: application.owner,
          schedule: application.schedule,
          assignment: application.assignment,
          previous_history: previousApps
        }
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Submit physical verification results (PASS or FAIL)
   *
   * IMPORTANT (feature/razorpay-payment):
   *   - PASS: Creates verification record and returns payment_required: true.
   *           Certificate is NOT generated here anymore.
   *           Certificate is generated in paymentController.verifyAndIssueCertificate
   *           AFTER successful Razorpay payment verification.
   *   - FAIL: Completely unchanged.
   */
  async submitVerification(req, res, next) {
    try {
      const { id } = req.params; // Application ID
      const {
        visual_checklist,
        metrological_tests,
        observations,
        test_results,
        evidence_photos,
        remarks,
        result // 'PASS' or 'FAIL'
      } = req.body;

      if (!result || !['PASS', 'FAIL'].includes(result)) {
        return res.status(400).json({
          success: false,
          message: 'Final result must be explicitly specified as either PASS or FAIL.'
        });
      }

      if (!observations || !test_results) {
        return res.status(400).json({
          success: false,
          message: 'Inspection observations and metrological test results are required.'
        });
      }

      const application = await db.getApplicationById(id);
      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }

      // Verifier authorization check
      if (req.user.role !== 'ADMIN' && application.assignment?.verifier_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to submit verification for this application.'
        });
      }

      // 1. Create verification record (always — for both PASS and FAIL)
      const verificationRecord = await db.createVerificationRecord({
        application_id: id,
        instrument_id: application.instrument_id,
        verifier_id: req.user.id,
        verifier_role: req.user.role,
        visual_checklist: visual_checklist || {},
        metrological_tests: metrological_tests || {},
        observations,
        test_results,
        evidence_photos: evidence_photos || [],
        remarks: remarks || '',
        result
      });

      // Audit Log
      await auditService.log(
        req,
        'VERIFICATION_SUBMITTED',
        'VERIFICATION_RECORD',
        verificationRecord.id,
        { application_status: application.status },
        { result, application_id: id, instrument_id: application.instrument_id }
      );

      // 2. Handle PASS vs FAIL
      if (result === 'PASS') {
        // ── PAYMENT GATE (feature/razorpay-payment) ────────────────────────
        // Certificate is NOT generated here anymore.
        // Frontend must complete Razorpay payment and call POST /api/payments/verify
        // which will verify the signature and call certificateService.
        // ──────────────────────────────────────────────────────────────────

        // Notify owner that verification passed and payment is required
        await notificationService.notify(
          application.owner_id,
          'Verification PASSED — Payment Required',
          `Your instrument ${application.instrument?.instrument_type} (${application.instrument?.serial_number}) ` +
          `passed physical verification. Please complete the verification fee payment to receive your Digital Certificate.`,
          'INFO',
          'APPLICATION',
          application.id
        );

        const updatedApp = await db.getApplicationById(id);

        return res.status(201).json({
          success: true,
          message: 'Physical verification completed: PASS. Payment required to issue certificate.',
          verification_record: verificationRecord,
          payment_required: true,              // ← Frontend uses this to trigger payment
          application_id: id,
          application: updatedApp,
          certificate: null,                   // No certificate yet — pending payment
          qr_code: null
        });

      } else {
        // ── FAIL Workflow: completely unchanged ────────────────────────────
        // No certificate is generated for failed verification!
        await notificationService.notify(
          application.owner_id,
          'Verification FAILED - Action Required',
          `Your instrument ${application.instrument?.instrument_type} failed physical/metrological verification. Inspector remarks: "${remarks || observations}". Re-verification required after rectifying defects.`,
          'ALERT',
          'APPLICATION',
          application.id
        );

        const updatedApp = await db.getApplicationById(id);

        return res.status(201).json({
          success: true,
          message: 'Physical verification recorded: FAIL. Owner notified of non-compliance.',
          verification_record: verificationRecord,
          payment_required: false,
          certificate: null,
          qr_code: null,
          application: updatedApp
        });
      }

    } catch (err) {
      next(err);
    }
  }
};

