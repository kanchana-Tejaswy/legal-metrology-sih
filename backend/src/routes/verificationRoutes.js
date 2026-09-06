import { Router } from 'express';
import { verificationController } from '../controllers/verificationController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

// Accessible by LMO, GATC, and ADMIN
router.get('/:id/workspace', requireRole('LMO', 'GATC', 'ADMIN'), verificationController.getWorkspace);
router.post('/:id/submit', requireRole('LMO', 'GATC', 'ADMIN'), verificationController.submitVerification);

export default router;
