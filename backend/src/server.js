import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import instrumentRoutes from './routes/instrumentRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import verificationRoutes from './routes/verificationRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

import { errorHandler } from './middleware/errorHandler.js';
import { notificationService } from './services/notificationService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging in development
app.use(morgan('dev'));

// Static uploads directory for documents / photos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'UP',
    system: 'Department of Legal Metrology - Online Verification System (SIH 26036)',
    version: '2.4.1-gov',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/instruments', instrumentRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/verifications', verificationRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/notifications', notificationRoutes);

// Central error handler
app.use(errorHandler);

// Background job: Check certificate expiries at startup and every 6 hours
notificationService.checkExpiringCertificates();
setInterval(() => notificationService.checkExpiringCertificates(), 6 * 60 * 60 * 1000);

// Start HTTP Server
const server = app.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(`  GOVERNMENT OF INDIA - DEPARTMENT OF LEGAL METROLOGY`);
  console.log(`  Online Verification & Certification System API Server`);
  console.log(`  Status: RUNNING on http://localhost:${PORT}`);
  console.log(`  Public QR Verification: http://localhost:${PORT}/api/public/verify/:id`);
  console.log(`================================================================`);
});

export default app;
