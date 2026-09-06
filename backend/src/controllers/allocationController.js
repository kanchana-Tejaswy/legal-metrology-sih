import { db } from '../models/db.js';
import { auditService } from '../services/auditService.js';
import { notificationService } from '../services/notificationService.js';

export const allocationController = {
  /**
   * Assign an application to LMO or GATC
   */
  async assign(req, res, next) {
    try {
      const { id } = req.params;
      const { verifier_type, verifier_id, notes } = req.body;

      if (!verifier_type || !verifier_id) {
        return res.status(400).json({
          success: false,
          message: 'Verifier type (LMO or GATC) and Verifier ID are required.'
        });
      }

      if (!['LMO', 'GATC'].includes(verifier_type)) {
        return res.status(400).json({
          success: false,
          message: 'Verifier type must be either LMO or GATC.'
        });
      }

      const application = await db.getApplicationById(id);
      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }

      // If assigning to GATC, check authorized category scope
      if (verifier_type === 'GATC') {
        const gatcProfiles = await db.getGatcProfiles();
        const gatc = gatcProfiles.find(g => g.user_id === verifier_id);
        if (gatc && application.instrument?.category) {
          const categoryCode = application.instrument.category.code;
          if (!gatc.authorized_scope.includes(categoryCode)) {
            return res.status(400).json({
              success: false,
              message: `This GATC (${gatc.centre_name}) is not authorized for instrument category "${categoryCode}". Scope permits: [${gatc.authorized_scope.join(', ')}].`
            });
          }
        }
      }

      const assignment = await db.assignApplication(
        id,
        verifier_type,
        verifier_id,
        req.user.id,
        notes
      );

      // Audit Log
      await auditService.log(
        req,
        'APPLICATION_ASSIGNED',
        'APPLICATION',
        id,
        { status: application.status },
        { status: 'ASSIGNED', verifier_type, verifier_id }
      );

      // Notify Verifier
      await notificationService.notify(
        verifier_id,
        'New Verification Work Allocation',
        `Application ${id} for ${application.instrument?.instrument_type} has been assigned to you.`,
        'INFO',
        'APPLICATION',
        id
      );

      // Notify Owner
      await notificationService.notify(
        application.owner_id,
        'Application Assigned for Verification',
        `Your application ${id} has been assigned to ${verifier_type === 'LMO' ? 'Legal Metrology Officer' : 'Government Approved Test Centre'}.`,
        'STATUS_CHANGE',
        'APPLICATION',
        id
      );

      const updatedApp = await db.getApplicationById(id);
      return res.json({
        success: true,
        message: `Application successfully assigned to ${verifier_type}.`,
        application: updatedApp,
        assignment
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Schedule or reschedule verification date and time
   */
  async schedule(req, res, next) {
    try {
      const { id } = req.params;
      const { scheduled_date, scheduled_time, location, notes } = req.body;

      if (!scheduled_date || !scheduled_time || !location) {
        return res.status(400).json({
          success: false,
          message: 'Scheduled date, time slot, and inspection location are required.'
        });
      }

      const application = await db.getApplicationById(id);
      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }

      if (!application.assignment) {
        return res.status(400).json({
          success: false,
          message: 'Please assign the application to an LMO or GATC before scheduling.'
        });
      }

      const schedule = await db.scheduleVerification(
        id,
        scheduled_date,
        scheduled_time,
        location,
        application.assignment.verifier_id,
        notes
      );

      // Audit Log
      await auditService.log(
        req,
        'VERIFICATION_SCHEDULED',
        'APPLICATION',
        id,
        { status: application.status },
        { status: 'SCHEDULED', scheduled_date, scheduled_time, location }
      );

      // Notify Owner
      await notificationService.notify(
        application.owner_id,
        'Physical Verification Scheduled',
        `Physical verification for ${application.id} is scheduled on ${scheduled_date} at ${scheduled_time} at ${location}.`,
        'STATUS_CHANGE',
        'APPLICATION',
        id
      );

      // Notify Verifier
      await notificationService.notify(
        application.assignment.verifier_id,
        'Verification Schedule Confirmed',
        `Inspection for ${application.id} scheduled for ${scheduled_date} at ${scheduled_time}.`,
        'INFO',
        'APPLICATION',
        id
      );

      const updatedApp = await db.getApplicationById(id);
      return res.json({
        success: true,
        message: 'Verification inspection schedule saved successfully.',
        application: updatedApp,
        schedule
      });
    } catch (err) {
      next(err);
    }
  }
};
