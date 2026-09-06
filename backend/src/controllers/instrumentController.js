import { db } from '../models/db.js';
import { auditService } from '../services/auditService.js';

export const instrumentController = {
  /**
   * List instruments
   */
  async list(req, res, next) {
    try {
      const { status } = req.query;
      const filters = {};
      if (status) filters.status = status;

      // Owners can ONLY see their own instruments
      if (req.user.role === 'OWNER') {
        filters.owner_id = req.user.id;
      }

      const instruments = await db.getInstruments(filters);
      return res.json({ success: true, instruments });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get single instrument by ID
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const instrument = await db.getInstrumentById(id);

      if (!instrument) {
        return res.status(404).json({ success: false, message: 'Instrument not found' });
      }

      // Security check: If owner, ensure it belongs to them
      if (req.user.role === 'OWNER' && instrument.owner_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Access denied to this instrument record' });
      }

      return res.json({ success: true, instrument });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Register a new instrument
   */
  async create(req, res, next) {
    try {
      const {
        category_id,
        instrument_type,
        manufacturer,
        model_number,
        serial_number,
        max_capacity,
        min_capacity,
        unit,
        verification_scale_interval,
        location,
        description,
        photograph_url
      } = req.body;

      if (!category_id || !instrument_type || !manufacturer || !model_number || !serial_number || !max_capacity || !location) {
        return res.status(400).json({
          success: false,
          message: 'All mandatory fields including Serial Number, Manufacturer, Model, and Capacity must be provided.'
        });
      }

      // Prevent duplicate instrument registration
      const isUnique = await db.checkSerialUnique(category_id, serial_number);
      if (!isUnique) {
        return res.status(409).json({
          success: false,
          message: `An instrument with Serial Number "${serial_number}" is already registered under this category. Duplicate registration is prohibited.`
        });
      }

      const instrument = await db.createInstrument({
        owner_id: req.user.id,
        category_id,
        instrument_type,
        manufacturer,
        model_number,
        serial_number,
        max_capacity,
        min_capacity: min_capacity || 0,
        unit: unit || 'kg',
        verification_scale_interval,
        location,
        description,
        photograph_url
      });

      await auditService.log(
        req,
        'INSTRUMENT_REGISTERED',
        'INSTRUMENT',
        instrument.id,
        null,
        { serial_number, category_id, model_number }
      );

      return res.status(201).json({
        success: true,
        message: 'Instrument successfully registered in Legal Metrology portal.',
        instrument
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get instrument categories
   */
  async getCategories(req, res, next) {
    try {
      const categories = await db.getCategories();
      return res.json({ success: true, categories });
    } catch (err) {
      next(err);
    }
  }
};
