import { Router } from 'express';
import { certificateController } from '../controllers/certificateController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

// List certificates (filtered by user)
router.get('/', certificateController.list);

// Get single certificate with live QR
router.get('/:id', certificateController.getById);

// Admin-only certificate revocation
router.post('/:id/revoke', requireRole('ADMIN'), certificateController.revoke);

export default router;
