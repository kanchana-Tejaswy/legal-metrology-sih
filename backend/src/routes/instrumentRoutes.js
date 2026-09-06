import { Router } from 'express';
import { instrumentController } from '../controllers/instrumentController.js';
import { authenticateToken, requireApproved, requireRole } from '../middleware/auth.js';

const router = Router();

// Publicly readable categories
router.get('/categories', instrumentController.getCategories);

// Protected routes
router.use(authenticateToken);
router.get('/', instrumentController.list);
router.get('/:id', instrumentController.getById);

// Only APPROVED OWNERS can register instruments
router.post('/', requireRole('OWNER'), requireApproved, instrumentController.create);

export default router;
