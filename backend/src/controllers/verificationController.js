import { db } from '../models/db.js';
import { certificateService } from '../services/certificateService.js';
import { qrService } from '../services/qrService.js';
import { auditService } from '../services/auditService.js';
import { notificationService } from '../services/notificationService.js';

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

      // 1. Create verification record
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
      let certificate = null;
      let qrCodeData = null;

      if (result === 'PASS') {
        // PASS Workflow:
        // Generate Certificate
        const certData = await certificateService.generateCertificateData({
          verificationRecord,
          instrument: application.instrument,
          owner: application.owner,
          verifier: req.user,
          category: application.instrument?.category
        });

        certificate = await db.createCertificate(certData);

        // Generate QR code pointing to live public verification page
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        qrCodeData = await qrService.generateVerificationQR(certificate.id, baseUrl);

        // Audit Log for Certificate
        await auditService.log(
          req,
          'CERTIFICATE_GENERATED',
          'CERTIFICATE',
          certificate.id,
          null,
          {
            instrument_id: application.instrument_id,
            valid_until: certificate.valid_until,
            status: certificate.status
          }
        );

        // Notify Business Owner
        await notificationService.notify(
          application.owner_id,
          'Verification PASSED - Certificate Issued',
          `Your instrument ${application.instrument?.instrument_type} (${application.instrument?.serial_number}) passed verification. Digital Certificate ${certificate.id} has been generated.`,
          'INFO',
          'CERTIFICATE',
          certificate.id
        );
      } else {
        // FAIL Workflow:
        // No certificate is generated for failed verification!
        // Notify Business Owner
        await notificationService.notify(
          application.owner_id,
          'Verification FAILED - Action Required',
          `Your instrument ${application.instrument?.instrument_type} failed physical/metrological verification. Inspector remarks: "${remarks || observations}". Re-verification required after rectifying defects.`,
          'ALERT',
          'APPLICATION',
          application.id
        );
      }

      const updatedApp = await db.getApplicationById(id);

      return res.status(201).json({
        success: true,
        message: result === 'PASS' 
          ? 'Physical verification completed: PASS. Digital certificate and live QR code generated.'
          : 'Physical verification recorded: FAIL. Owner notified of non-compliance.',
        verification_record: verificationRecord,
        certificate,
        qr_code: qrCodeData,
        application: updatedApp
      });
    } catch (err) {
      next(err);
    }
  }
};
