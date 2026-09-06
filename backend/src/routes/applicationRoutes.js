import { Router } from 'express';
import { applicationController } from '../controllers/applicationController.js';
import { allocationController } from '../controllers/allocationController.js';
import { authenticateToken, requireApproved, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

// List applications (role-filtered)
router.get('/', applicationController.list);
router.get('/:id', applicationController.getById);

// Only APPROVED OWNERS can create applications
router.post('/', requireRole('OWNER'), requireApproved, applicationController.create);

// Admin-only Allocation & Scheduling
router.post('/:id/assign', requireRole('ADMIN'), allocationController.assign);
router.post('/:id/schedule', requireRole('ADMIN'), allocationController.schedule);

export default router;
