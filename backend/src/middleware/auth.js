import jwt from 'jsonwebtoken';
import { db } from '../models/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secure-legal-metrology-jwt-secret-key-2026-gov';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access Denied: Authentication token required.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await db.findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session: User account no longer exists.'
      });
    }

    if (user.status === 'SUSPENDED') {
      return res.status(403).json({
        success: false,
        message: 'Account Suspended: Please contact Department Administration.'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired authentication token.'
    });
  }
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: This resource requires one of the following roles: [${roles.join(', ')}]. Your role is ${req.user.role}.`
      });
    }

    next();
  };
};

export const requireApproved = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  // Admin, LMO, and GATC must be APPROVED as well, but this is critical for OWNERs
  if (req.user.status !== 'APPROVED') {
    return res.status(403).json({
      success: false,
      status: req.user.status,
      message: req.user.status === 'PENDING'
        ? 'Your account is pending verification and approval by Department Administrator. You cannot access instrument or application management until verified.'
        : `Your account is ${req.user.status}. Access restricted.`
    });
  }

  next();
};
