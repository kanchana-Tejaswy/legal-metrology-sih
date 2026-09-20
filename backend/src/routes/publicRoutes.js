import { Router } from 'express';
import { publicController } from '../controllers/publicController.js';

const router = Router();

// Publicly accessible certificate verification endpoint (NO authentication required!)
router.get('/verify/:certificateId', publicController.verifyCertificate);

// Master data endpoints — no authentication required (needed by pre-login registration form)
router.get('/states', publicController.getStates);
router.get('/districts', publicController.getDistricts);
router.get('/offices', publicController.getNearbyOffices);

export default router;
