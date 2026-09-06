import { db } from '../models/db.js';

export const auditService = {
  async log(req, action, entityType, entityId, previousState = null, newState = null) {
    try {
      const user = req?.user || null;
      const ip = req?.headers['x-forwarded-for'] || req?.socket?.remoteAddress || '127.0.0.1';

      await db.createAuditLog({
        user_id: user?.id || null,
        user_email: user?.email || 'system_service',
        action,
        entity_type: entityType,
        entity_id: String(entityId),
        previous_state: previousState,
        new_state: newState,
        ip_address: ip
      });
    } catch (err) {
      console.error('Audit Logging Error (non-blocking):', err.message);
    }
  }
};
