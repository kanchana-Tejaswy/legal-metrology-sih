import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken, requireRole('ADMIN'));

router.get('/stats', adminController.getDashboardStats);
router.get('/stakeholders', adminController.listStakeholders);
router.put('/stakeholders/:id/status', adminController.updateStakeholderStatus);
router.get('/officers', adminController.listOfficers);
router.post('/officers', adminController.createOfficer); // Strictly LMO and GATC only
router.post('/auto-allocate', adminController.autoAllocateApplications);
router.post('/scan-expiries', adminController.triggerExpiryScan);
router.get('/audit-logs', adminController.getAuditLogs);

export default router;
