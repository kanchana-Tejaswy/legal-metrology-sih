import { db } from '../models/db.js';
import { auditService } from '../services/auditService.js';
import { notificationService } from '../services/notificationService.js';

export const adminController = {
  /**
   * Get High-Level Department Dashboard Statistics
   */
  async getDashboardStats(req, res, next) {
    try {
      const stats = await db.getAdminStats();
      return res.json({ success: true, stats });
    } catch (err) {
      next(err);
    }
  },

  /**
   * List all stakeholders (Business Owners)
   */
  async listStakeholders(req, res, next) {
    try {
      const { status } = req.query;
      let owners = await db.getAllUsers('OWNER');

      if (status) {
        owners = owners.filter(o => o.status === status);
      }

      return res.json({ success: true, stakeholders: owners });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Review Stakeholder Account (Approve / Reject)
   */
  async updateStakeholderStatus(req, res, next) {
    try {
      const { id } = req.params; // User ID
      const { status, notes } = req.body; // 'APPROVED' or 'REJECTED'

      if (!['APPROVED', 'REJECTED'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Status must be set to either APPROVED or REJECTED.'
        });
      }

      const user = await db.findUserById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Stakeholder account not found' });
      }

      const prevStatus = user.status;
      const updatedUser = await db.updateUserStatus(id, status, req.user.id, notes);

      // Audit Log
      await auditService.log(
        req,
        status === 'APPROVED' ? 'STAKEHOLDER_APPROVED' : 'STAKEHOLDER_REJECTED',
        'STAKEHOLDER',
        id,
        { status: prevStatus },
        { status, notes, reviewer: req.user.full_name }
      );

      // Notify User
      await notificationService.notify(
        id,
        status === 'APPROVED' ? 'Account Approved' : 'Account Registration Update',
        status === 'APPROVED'
          ? 'Your business account has been approved by the Department Administrator. You can now register instruments and apply for verification.'
          : `Your registration was not approved. Review notes: "${notes || 'Documentation requirements not met.'}"`,
        status === 'APPROVED' ? 'INFO' : 'ALERT',
        'USER',
        id
      );

      return res.json({
        success: true,
        message: `Stakeholder account successfully marked as ${status}.`,
        user: updatedUser
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * List LMO and GATC officers and testing centres
   */
  async listOfficers(req, res, next) {
    try {
      const lmos = await db.getLmoProfiles();
      const gatcs = await db.getGatcProfiles();
      return res.json({ success: true, lmos, gatcs });
    } catch (err) {
      next(err);
    }
  },

  /**
   * View Audit Logs
   */
  async getAuditLogs(req, res, next) {
    try {
      const { action, entity_type } = req.query;
      const logs = await db.getAuditLogs({ action, entity_type });
      return res.json({ success: true, logs });
    } catch (err) {
      next(err);
    }
  }
};
