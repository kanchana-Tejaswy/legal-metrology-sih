import { db } from '../models/db.js';

export const notificationService = {
  async notify(userId, title, message, type = 'INFO', relatedType = null, relatedId = null) {
    try {
      return await db.createNotification({
        user_id: userId,
        title,
        message,
        type,
        related_entity_type: relatedType,
        related_entity_id: relatedId
      });
    } catch (err) {
      console.error('Notification Error (non-blocking):', err.message);
    }
  },

  /**
   * Scans valid certificates and issues notifications if expiry is within 90, 30, or 7 days
   */
  async checkExpiringCertificates() {
    try {
      const certificates = await db.getCertificates({ status: 'VALID' });
      const now = new Date();

      for (const cert of certificates) {
        const expiryDate = new Date(cert.valid_until);
        const diffDays = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

        if (diffDays <= 0) {
          await this.notify(
            cert.owner_id,
            'Certificate Expired',
            `Certificate ${cert.id} for ${cert.instrument?.instrument_type || 'Instrument'} has expired on ${cert.valid_until}. Commercial use is prohibited until re-verification.`,
            'ALERT',
            'CERTIFICATE',
            cert.id
          );
        } else if (diffDays <= 7) {
          await this.notify(
            cert.owner_id,
            'CRITICAL: Certificate Expiring in 7 Days',
            `Certificate ${cert.id} expires in ${diffDays} day(s) on ${cert.valid_until}. Please submit re-verification application immediately.`,
            'EXPIRY',
            'CERTIFICATE',
            cert.id
          );
        } else if (diffDays <= 30 && diffDays > 25) {
          await this.notify(
            cert.owner_id,
            'Certificate Expiring Soon (30 Days Notice)',
            `Certificate ${cert.id} expires on ${cert.valid_until}. Re-verification window is now open.`,
            'WARNING',
            'CERTIFICATE',
            cert.id
          );
        }
      }
    } catch (err) {
      console.error('Expiry scan error:', err.message);
    }
  }
};
