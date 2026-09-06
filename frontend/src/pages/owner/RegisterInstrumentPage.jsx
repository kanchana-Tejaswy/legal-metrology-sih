import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Scale, Upload, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';

export const RegisterInstrumentPage = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category_id: '',
    instrument_type: '',
    manufacturer: '',
    model_number: '',
    serial_number: '',
    max_capacity: '',
    min_capacity: '0.1',
    unit: 'kg',
    verification_scale_interval: '',
    location: '',
    description: '',
    previous_certificate_id: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await api.getCategories();
        if (res.success && res.categories) {
          setCategories(res.categories);
          if (res.categories.length > 0) {
            setFormData(prev => ({
              ...prev,
              category_id: res.categories[0].id,
              instrument_type: res.categories[0].name
            }));
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category_id') {
      const selected = categories.find(c => c.id === value);
      setFormData({
        ...formData,
        category_id: value,
        instrument_type: selected ? selected.name : formData.instrument_type
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        ...formData,
        photograph_url: photo ? '/uploads/sample_instrument.jpg' : null
      };

      const res = await api.createInstrument(payload);
      if (res.success) {
        navigate('/owner/instruments');
      }
    } catch (err) {
      setError(err.data?.message || err.message || 'Failed to register instrument.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Link */}
      <Link
        to="/owner/instruments"
        className="inline-flex items-center space-x-1 text-xs text-gov-blue hover:underline font-medium"
      >
        <ArrowLeft size={14} />
        <span>Back to My Instruments</span>
      </Link>

      <div className="bg-white rounded border border-slate-300 shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gov-navy text-white p-5 border-b-2 border-amber-500">
          <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
            Statutory Registration Form
          </div>
          <h2 className="text-xl font-bold font-serif">
            Register Weighing or Measuring Instrument
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Under Section 24 of Legal Metrology Act, 2009. Duplicate serial registration is strictly prohibited.
          </p>
        </div>

        {error && (
          <div className="m-5 p-3 bg-red-50 border-l-4 border-red-600 text-xs text-red-800 flex items-start space-x-2">
            <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Section 1: Classification */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider border-b pb-1">
              1. Instrument Classification & Category
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Instrument Category *
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy bg-white"
                  required
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      [{c.code}] {c.name} — {c.accuracy_class} (Verification Cycle: {c.verification_cycle_months} mo)
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Instrument Type / Commercial Nomenclature *
                </label>
                <input
                  type="text"
                  name="instrument_type"
                  value={formData.instrument_type}
                  onChange={handleChange}
                  placeholder="e.g. Non-Automatic Countertop Electronic Scale"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Manufacturer & Identifiers */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider border-b pb-1">
              2. Manufacturer & Physical Identifiers (Crucial for Stamping)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Manufacturer Name *
                </label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  placeholder="e.g. Avery Weigh-Tronix"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Model Number / Designation *
                </label>
                <input
                  type="text"
                  name="model_number"
                  value={formData.model_number}
                  onChange={handleChange}
                  placeholder="e.g. AWT-30D"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Serial Number (Stamped on Body) *
                </label>
                <input
                  type="text"
                  name="serial_number"
                  value={formData.serial_number}
                  onChange={handleChange}
                  placeholder="e.g. SN-2026-EWS-9901"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy font-mono uppercase"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Metrological Specifications */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider border-b pb-1">
              3. Metrological Capacity & Interval
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Maximum Capacity (Max) *
                </label>
                <input
                  type="number"
                  step="any"
                  name="max_capacity"
                  value={formData.max_capacity}
                  onChange={handleChange}
                  placeholder="30"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Minimum Capacity (Min) *
                </label>
                <input
                  type="number"
                  step="any"
                  name="min_capacity"
                  value={formData.min_capacity}
                  onChange={handleChange}
                  placeholder="0.1"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Standard Unit *
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy bg-white"
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="g">Gram (g)</option>
                  <option value="mg">Milligram (mg)</option>
                  <option value="t">Tonne (t)</option>
                  <option value="L">Litre (L)</option>
                  <option value="mL">Millilitre (mL)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Verification Interval (e)
                </label>
                <input
                  type="number"
                  step="any"
                  name="verification_scale_interval"
                  value={formData.verification_scale_interval}
                  onChange={handleChange}
                  placeholder="0.005"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Physical Location & Photograph */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider border-b pb-1">
              4. Installation Location & Photograph
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Exact Installation Location at Premises *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Counter 3, Billing Section, Bandra West"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Previous Certificate ID (If Re-registering)
                </label>
                <input
                  type="text"
                  name="previous_certificate_id"
                  value={formData.previous_certificate_id}
                  onChange={handleChange}
                  placeholder="e.g. CERT-2025-000088"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Brief Technical Description / Notes
                </label>
                <textarea
                  name="description"
                  rows={2}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Physical condition, lead seal port location, dual customer display, etc."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Instrument Nameplate Photograph
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded p-4 text-center hover:border-gov-navy transition">
                  <Upload size={20} className="text-slate-400 mx-auto mb-1" />
                  <label className="cursor-pointer text-xs font-semibold text-gov-blue hover:underline">
                    <span>Choose Photograph of Instrument & Nameplate</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setPhoto(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                  {photo && (
                    <div className="text-xs text-emerald-700 font-semibold mt-1">
                      Selected: {photo.name}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gov-navy hover:bg-gov-blue text-white py-3 rounded text-xs sm:text-sm font-bold uppercase tracking-wider shadow transition disabled:opacity-50"
            >
              {loading ? 'Submitting Registration...' : 'Complete Instrument Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
