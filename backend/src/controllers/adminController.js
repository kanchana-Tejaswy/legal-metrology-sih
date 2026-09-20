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
  },

  /**
   * Admin-Only: Provision LMO or GATC Officer (Strict Role Enforcement)
   */
  async createOfficer(req, res, next) {
    try {
      const { role } = req.body;

      // Strict enforcement: Only LMO and GATC can be provisioned by admin
      if (!['LMO', 'GATC'].includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Admin authorization is strictly restricted to provisioning LMO (Legal Metrology Officers) and GATC (Testing Centres) only.'
        });
      }

      const result = await db.createOfficer(req.body, req.user.id);

      // Audit Log
      await auditService.log(
        req,
        role === 'LMO' ? 'LMO_OFFICER_PROVISIONED' : 'GATC_CENTRE_PROVISIONED',
        'USER',
        result.user.id,
        null,
        { role, email: result.user.email, full_name: result.user.full_name }
      );

      return res.status(201).json({
        success: true,
        message: `${role === 'LMO' ? 'Legal Metrology Officer' : 'GATC Testing Centre'} successfully provisioned and authorized.`,
        data: result
      });
    } catch (err) {
      if (err.status) {
        return res.status(err.status).json({ success: false, message: err.message });
      }
      next(err);
    }
  },

  /**
   * Automated Operations: Smart Auto-Allocation
   */
  async autoAllocateApplications(req, res, next) {
    try {
      const result = await db.autoAllocatePendingApplications();

      await auditService.log(
        req,
        'AUTOMATED_BATCH_ALLOCATION_RUN',
        'SYSTEM',
        'BATCH',
        null,
        { allocated_count: result.count }
      );

      return res.json({
        success: true,
        message: `Automated dispatcher allocated ${result.count} application(s) directly to accredited officers.`,
        result
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Automated Operations: Expiry Scan & Notifications Dispatch
   */
  async triggerExpiryScan(req, res, next) {
    try {
      const result = await db.scanExpiries();

      await auditService.log(
        req,
        'EXPIRY_SCAN_TRIGGERED',
        'SYSTEM',
        'CRON',
        null,
        { expiring_count: result.expiring_count, notifications_sent: result.notifications_sent }
      );

      return res.json({
        success: true,
        message: `Scan complete: ${result.expiring_count} expiring certificate(s) identified. ${result.notifications_sent} compliance notice(s) dispatched.`,
        result
      });
    } catch (err) {
      next(err);
    }
  }
};
