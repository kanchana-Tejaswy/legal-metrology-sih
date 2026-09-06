import { Router } from 'express';
import { publicController } from '../controllers/publicController.js';

const router = Router();

// Publicly accessible certificate verification endpoint (NO authentication required!)
router.get('/verify/:certificateId', publicController.verifyCertificate);

export default router;
