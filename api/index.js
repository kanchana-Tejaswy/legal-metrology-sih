// api/index.js — Vercel Serverless Function wrapper for Express backend
// This file adapts the Express app to run as a Vercel serverless function.

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Resolve .env from repo root (works locally and on Vercel)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import all route handlers from the backend src
import authRoutes from '../backend/src/routes/authRoutes.js';
import instrumentRoutes from '../backend/src/routes/instrumentRoutes.js';
import applicationRoutes from '../backend/src/routes/applicationRoutes.js';
import verificationRoutes from '../backend/src/routes/verificationRoutes.js';
import certificateRoutes from '../backend/src/routes/certificateRoutes.js';
import adminRoutes from '../backend/src/routes/adminRoutes.js';
import publicRoutes from '../backend/src/routes/publicRoutes.js';
import notificationRoutes from '../backend/src/routes/notificationRoutes.js';
import paymentRoutes from '../backend/src/routes/paymentRoutes.js';
import { errorHandler } from '../backend/src/middleware/errorHandler.js';

const app = express();

// CORS — allow all origins in serverless (Vercel handles edge security)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
  const supabaseConfigured = Boolean(
    process.env.SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    !process.env.SUPABASE_URL.includes('your-project-ref')
  );
  res.json({
    status: 'UP',
    system: 'Department of Legal Metrology - Online Verification System (SIH 26036)',
    version: '2.4.1-gov',
    environment: 'Vercel Serverless',
    database: supabaseConfigured ? 'Supabase Cloud PostgreSQL' : 'In-Memory (Demo Mode)',
    supabase_url: supabaseConfigured ? process.env.SUPABASE_URL : null,
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
app.use('/api/payments', paymentRoutes);

// Central error handler
app.use(errorHandler);

// Export for Vercel serverless
export default app;
