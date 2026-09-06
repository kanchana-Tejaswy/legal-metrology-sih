import { db } from '../models/db.js';

export const notificationController = {
  async list(req, res, next) {
    try {
      const notifications = await db.getNotifications(req.user.id);
      return res.json({ success: true, notifications });
    } catch (err) {
      next(err);
    }
  },

  async markRead(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await db.markNotificationRead(id);
      return res.json({ success: true, notification: updated });
    } catch (err) {
      next(err);
    }
  }
};
