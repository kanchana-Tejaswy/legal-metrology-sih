import { db } from '../models/db.js';
import { qrService } from '../services/qrService.js';
import { auditService } from '../services/auditService.js';
import { notificationService } from '../services/notificationService.js';

export const certificateController = {
  /**
   * List certificates with role-based filtering
   */
  async list(req, res, next) {
    try {
      const { status } = req.query;
      const filters = {};
      if (status) filters.status = status;

      if (req.user.role === 'OWNER') {
        filters.owner_id = req.user.id;
      }

      const certificates = await db.getCertificates(filters);
      return res.json({ success: true, certificates });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get single certificate with live QR code
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const certificate = await db.getCertificateById(id);

      if (!certificate) {
        return res.status(404).json({ success: false, message: 'Certificate not found' });
      }

      // If owner, ensure it is their own
      if (req.user.role === 'OWNER' && certificate.owner_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Access denied to this certificate' });
      }

      // Generate live QR code data URL
      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const qrCode = await qrService.generateVerificationQR(certificate.id, baseUrl);

      return res.json({
        success: true,
        certificate: {
          ...certificate,
          qr_code: qrCode
        }
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Administrative Revocation of Certificate
   */
  async revoke(req, res, next) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      if (!reason || reason.trim().length < 5) {
        return res.status(400).json({
          success: false,
          message: 'A formal administrative justification/reason is required to revoke a certificate.'
        });
      }

      const certificate = await db.getCertificateById(id);
      if (!certificate) {
        return res.status(404).json({ success: false, message: 'Certificate not found' });
      }

      if (certificate.status === 'REVOKED') {
        return res.status(400).json({
          success: false,
          message: 'Certificate is already revoked.'
        });
      }

      const revokedCert = await db.revokeCertificate(id, reason, req.user.id);

      // Audit Log
      await auditService.log(
        req,
        'CERTIFICATE_REVOKED',
        'CERTIFICATE',
        id,
        { status: certificate.status },
        { status: 'REVOKED', reason, revoked_by: req.user.full_name }
      );

      // Notify Owner
      await notificationService.notify(
        certificate.owner_id,
        'URGENT: Certificate Revoked by Legal Metrology Department',
        `Certificate ${id} for ${certificate.instrument?.instrument_type} has been REVOKED. Reason: ${reason}. Commercial use of this instrument is immediately prohibited.`,
        'ALERT',
        'CERTIFICATE',
        id
      );

      return res.json({
        success: true,
        message: `Certificate ${id} has been formally revoked. Public QR verification will now reflect REVOKED status.`,
        certificate: revokedCert
      });
    } catch (err) {
      next(err);
    }
  }
};
