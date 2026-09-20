import { db } from '../models/db.js';
import { auditService } from '../services/auditService.js';
import { notificationService } from '../services/notificationService.js';

export const applicationController = {
  /**
   * List applications with role-based filtering
   */
  async list(req, res, next) {
    try {
      const { status } = req.query;
      const filters = {};
      if (status) filters.status = status;

      if (req.user.role === 'OWNER') {
        filters.owner_id = req.user.id;
      } else if (req.user.role === 'LMO' || req.user.role === 'GATC') {
        filters.verifier_id = req.user.id;
      }

      const applications = await db.getApplications(filters);
      return res.json({ success: true, applications });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get single application by ID
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const application = await db.getApplicationById(id);

      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }

      // Role check
      if (req.user.role === 'OWNER' && application.owner_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Access denied to this application' });
      }

      if ((req.user.role === 'LMO' || req.user.role === 'GATC') && application.assignment?.verifier_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'This application is not assigned to you' });
      }

      return res.json({ success: true, application });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Submit new verification / re-verification application
   */
  async create(req, res, next) {
    try {
      const {
        instrument_id,
        application_type,
        preferred_date,
        preferred_time,
        remarks,
        documents,
        preferred_office_id
      } = req.body;

      if (!instrument_id || !preferred_date) {
        return res.status(400).json({
          success: false,
          message: 'Instrument selection and preferred verification date are required.'
        });
      }

      // Verify instrument ownership
      const instrument = await db.getInstrumentById(instrument_id);
      if (!instrument || instrument.owner_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Invalid instrument selection. You can only apply for instruments registered to your account.'
        });
      }

      const application = await db.createApplication({
        owner_id: req.user.id,
        instrument_id,
        application_type: application_type || 'NEW',
        preferred_date,
        preferred_time: preferred_time || '10:00 AM',
        remarks,
        preferred_office_id,
        documents: documents || []
      });

      await auditService.log(
        req,
        'APPLICATION_DIRECT_ALLOTTED',
        'APPLICATION',
        application.id,
        null,
        {
          instrument_id,
          application_type,
          status: application.status,
          assigned_to_role: application.assignment?.verifier_type,
          assigned_to_id: application.assignment?.verifier_id
        }
      );

      // Notify the directly assigned LMO / GATC officer immediately
      if (application.assignment?.verifier_id) {
        await notificationService.notify(
          application.assignment.verifier_id,
          'Direct Verification Allotment',
          `Application ${application.id} for ${instrument.instrument_type} (${instrument.serial_number}) has been directly allotted to your inspection queue.`,
          'INFO',
          'APPLICATION',
          application.id
        );
      }

      // Notify Admins
      const admins = await db.getAllUsers('ADMIN');
      for (const admin of admins) {
        await notificationService.notify(
          admin.id,
          'New Verification Application (Auto-Allotted)',
          `Application ${application.id} for ${instrument.instrument_type} by ${req.user.full_name} was auto-routed to ${application.assignment?.verifier_type || 'Inspector'}.`,
          'INFO',
          'APPLICATION',
          application.id
        );
      }

      return res.status(201).json({
        success: true,
        message: `Verification application submitted and automatically allotted to ${application.assignment?.verifier_type === 'GATC' ? 'Government Approved Test Centre' : 'Legal Metrology Officer'}.`,
        application
      });
    } catch (err) {
      next(err);
    }
  }
};
