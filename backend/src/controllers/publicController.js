import { db } from '../models/db.js';

export const publicController = {
  /**
   * Public live QR Verification Endpoint
   * No authentication required!
   */
  async verifyCertificate(req, res, next) {
    try {
      const { certificateId } = req.params;

      if (!certificateId) {
        return res.status(400).json({
          verified: false,
          status: 'INVALID',
          message: 'Certificate ID is required for verification.'
        });
      }

      const cert = await db.getCertificateById(certificateId.trim());

      if (!cert) {
        return res.status(404).json({
          verified: false,
          status: 'INVALID',
          certificate_id: certificateId,
          message: 'No record found. This certificate ID is not registered with the Department of Legal Metrology.'
        });
      }

      // Check current validity state dynamically
      let liveStatus = cert.status;
      const today = new Date();
      const expiry = new Date(cert.valid_until);

      if (cert.status !== 'REVOKED') {
        if (today > expiry) {
          liveStatus = 'EXPIRED';
        } else {
          liveStatus = 'VALID';
        }
      }

      // Prepare sanitized public verification response (Official Consumer/Public View)
      return res.json({
        verified: true,
        status: liveStatus, // 'VALID' | 'EXPIRED' | 'REVOKED'
        certificate: {
          id: cert.id,
          status: liveStatus,
          verification_date: cert.verification_date,
          valid_until: cert.valid_until,
          verifying_authority: cert.verifying_authority,
          verifier_name: cert.verifier_name,
          digital_signature_hash: cert.digital_signature_hash,
          revocation_reason: cert.revocation_reason,
          revoked_at: cert.revoked_at,
          instrument: {
            type: cert.instrument?.instrument_type,
            manufacturer: cert.instrument?.manufacturer,
            model_number: cert.instrument?.model_number,
            serial_number: cert.instrument?.serial_number,
            capacity: `${cert.instrument?.min_capacity} - ${cert.instrument?.max_capacity} ${cert.instrument?.unit}`,
            location: cert.instrument?.location,
            accuracy_class: cert.instrument?.category?.accuracy_class || 'Class III'
          },
          owner: {
            business_name: cert.owner?.business_name || cert.owner?.full_name,
            location: cert.owner?.stakeholder?.business_address
          }
        },
        verified_at: new Date().toISOString()
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/public/states
   * Returns all Indian states and union territories — no auth required.
   */
  async getStates(req, res, next) {
    try {
      const states = await db.getStates();
      return res.json({ success: true, states });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/public/districts?state=<stateName>
   * Returns districts belonging to the given state — no auth required.
   * If the state is not found, returns an empty array (not a 404).
   */
  async getDistricts(req, res, next) {
    try {
      const { state } = req.query;
      if (!state) {
        return res.status(400).json({
          success: false,
          message: 'Query parameter "state" is required.'
        });
      }
      const districts = await db.getDistricts(state);
      return res.json({ success: true, state, districts });
    } catch (err) {
      next(err);
    }
  }
};
