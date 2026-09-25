import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { SearchableSelect } from '../../components/common/SearchableSelect';
import {
  Building2,
  FileCheck,
  CheckCircle,
  AlertCircle,
  Upload,
  ShieldAlert,
  ArrowRight,
  MapPin
} from 'lucide-react';

export const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    business_name: '',
    phone: '',
    email: '',
    password: '',
    confirm_password: '',
    business_address: '',
    state: '',
    district: '',
    pincode: '',
    trade_license_no: '',
    gstin: ''
  });

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Master data
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [statesLoading, setStatesLoading] = useState(true);
  const [districtsLoading, setDistrictsLoading] = useState(false);

  // Load states on mount
  useEffect(() => {
    async function loadStates() {
      try {
        const res = await api.getStates();
        if (res.success && res.states) {
          setStates(res.states);
        }
      } catch (err) {
        console.error('Failed to load states:', err);
      } finally {
        setStatesLoading(false);
      }
    }
    loadStates();
  }, []);

  // Load districts whenever state changes
  useEffect(() => {
    if (!formData.state) {
      setDistricts([]);
      return;
    }
    async function loadDistricts() {
      setDistrictsLoading(true);
      try {
        const res = await api.getDistricts(formData.state);
        if (res.success && res.districts) {
          setDistricts(res.districts);
        } else {
          setDistricts([]);
        }
      } catch (err) {
        console.error('Failed to load districts:', err);
        setDistricts([]);
      } finally {
        setDistrictsLoading(false);
      }
    }
    loadDistricts();
  }, [formData.state]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStateChange = (selectedState) => {
    // Clear district whenever state changes
    setFormData(prev => ({ ...prev, state: selectedState, district: '' }));
  };

  const handleDistrictChange = (selectedDistrict) => {
    setFormData(prev => ({ ...prev, district: selectedDistrict }));
  };

  const handleDocAdd = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocuments([
        ...documents,
        { name: file.name, size: `${(file.size / 1024).toFixed(1)} KB`, url: '/uploads/sample_doc.pdf' }
      ]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (!formData.state) {
      setError('Please select a State.');
      return;
    }

    if (!formData.district) {
      setError('Please select a District.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        supporting_documents: documents.length > 0 ? documents : [
          { name: 'Business_Trade_License.pdf', url: '/uploads/trade_license.pdf' }
        ]
      };

      const res = await api.register(payload);
      if (res.success) {
        setSubmittedSuccess(true);
      }
    } catch (err) {
      setError(err.data?.message || err.message || 'Registration submission failed.');
    } finally {
      setLoading(false);
    }
  };

  if (submittedSuccess) {
    return (
      <div className="max-w-xl mx-auto my-12 px-4 animate-scale-in">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-elevated p-6 sm:p-8 text-center space-y-5 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-600 ring-8 ring-amber-50/60 transition-transform duration-300 hover:scale-105">
            <CheckCircle size={36} />
          </div>

          <div>
            <h2 className="text-xl font-bold font-serif text-gov-navy tracking-tight">
              Registration Submitted Successfully
            </h2>
            <p className="text-xs text-slate-500 mt-1">Official Legal Metrology Stakeholder Enrollment</p>
          </div>

          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-900 text-left space-y-2.5 shadow-subtle">
            <div className="font-bold flex items-center space-x-2 text-amber-900">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Statutory Review Status: PENDING VERIFICATION</span>
            </div>
            <p className="leading-relaxed text-slate-700">
              Your business stakeholder account for <strong className="text-slate-900">&ldquo;{formData.business_name}&rdquo;</strong> has been registered.
              In accordance with Legal Metrology statutory regulations, your account is currently <strong>PENDING</strong> review and approval by the Department Administrator.
            </p>
            <p className="leading-relaxed text-[11px] text-amber-800 bg-amber-100/50 p-2 rounded-lg border border-amber-200/60">
              You will not be able to register instruments or submit verification applications until an authorized officer validates your trade license and premises details.
            </p>
          </div>

          <div className="text-xs text-slate-500">
            A confirmation has been logged in the department registry. You may log in to track your approval status.
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <Link
              to="/login"
              className="btn-tactile shimmer-sweep bg-gradient-to-r from-gov-navy to-slate-900 hover:from-gov-blue hover:to-gov-navy text-white px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <span>Go to Sign In</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-4 sm:my-8 px-3 sm:px-4 animate-fade-up">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-elevated overflow-hidden transition-all duration-300">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-gov-navy via-slate-900 to-gov-navy text-white p-5 sm:p-7 border-b-2 border-amber-500 overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-[10px] sm:text-[11px] font-semibold text-amber-300 tracking-wide mb-2 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Official Stakeholder Enrollment Form
            </div>
            <h2 className="text-lg sm:text-2xl font-bold font-serif text-white tracking-tight">
              Instrument Owner / Commercial Enterprise Registration
            </h2>
            <p className="text-xs sm:text-sm text-slate-300/90 mt-1 max-w-xl leading-relaxed">
              Mandatory statutory registration for commercial users, traders, retailers, and industrial users of weighing &amp; measuring instruments.
            </p>
          </div>
        </div>

        {/* Notice */}
        <div className="bg-sky-50/70 border-b border-sky-100 px-4 sm:px-6 py-3 sm:py-3.5 text-xs text-slate-700 flex items-start space-x-2.5">
          <Building2 size={16} className="text-gov-navy flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-900 font-semibold">Administrative Notice: </strong>
            All new registrations require review and clearance by the Department Administrator before instruments can be submitted for verification.
          </div>
        </div>

        {error && (
          <div className="m-4 sm:m-6 p-3.5 sm:p-4 bg-rose-50 border-l-4 border-rose-600 rounded-r-xl text-xs text-rose-800 flex items-start space-x-2.5 animate-scale-in">
            <AlertCircle size={16} className="text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="font-medium">{error}</div>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-8 space-y-6 sm:space-y-7">
          {/* Section 1: Applicant Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="w-5 h-5 rounded-full bg-gov-navy/10 text-gov-navy text-[11px] font-bold flex items-center justify-center">1</span>
              <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider">
                Authorized Applicant Information
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name of Authorized Person *
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="e.g. Anand Kumar"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50/50 hover:bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy focus:bg-white transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Contact Phone / Mobile Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98200 12345"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50/50 hover:bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy focus:bg-white transition-all duration-200"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address (Username for Login) *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="owner@mybusiness.com"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50/50 hover:bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy focus:bg-white transition-all duration-200"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Business & Premises Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="w-5 h-5 rounded-full bg-gov-navy/10 text-gov-navy text-[11px] font-bold flex items-center justify-center">2</span>
              <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider">
                Commercial Establishment / Enterprise Details
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Registered Business Name / Trade Name *
                </label>
                <input
                  type="text"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleChange}
                  placeholder="e.g. Metro Retail Supermarket Ltd."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50/50 hover:bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy focus:bg-white transition-all duration-200"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Business Installation Address *
                </label>
                <textarea
                  name="business_address"
                  rows={2}
                  value={formData.business_address}
                  onChange={handleChange}
                  placeholder="Shop/Unit No., Commercial Complex, Street, Landmark"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50/50 hover:bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy focus:bg-white transition-all duration-200 resize-none"
                  required
                />
              </div>

              {/* State — Searchable Dropdown */}
              <div>
                <label htmlFor="reg-state" className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                  <MapPin size={12} className="text-gov-navy" />
                  State *
                </label>
                <SearchableSelect
                  id="reg-state"
                  options={states}
                  value={formData.state}
                  onChange={handleStateChange}
                  placeholder="Select State"
                  loading={statesLoading}
                  required
                />
              </div>

              {/* District — Cascading Searchable Dropdown */}
              <div>
                <label htmlFor="reg-district" className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                  <MapPin size={12} className="text-gov-navy" />
                  District / Ward *
                  {!formData.state && (
                    <span className="text-[10px] text-slate-400 font-normal ml-1">(select State first)</span>
                  )}
                </label>
                <SearchableSelect
                  id="reg-district"
                  options={districts}
                  value={formData.district}
                  onChange={handleDistrictChange}
                  placeholder={formData.state ? 'Select District' : 'Select State first'}
                  disabled={!formData.state}
                  loading={districtsLoading}
                  required
                />
                {formData.state && !formData.district && !districtsLoading && (
                  <p className="text-[10px] text-amber-600 mt-1">
                    Please select a district within <strong>{formData.state}</strong>.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="e.g. 400053"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50/50 hover:bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy focus:bg-white transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Trade License No.</label>
                <input
                  type="text"
                  name="trade_license_no"
                  value={formData.trade_license_no}
                  onChange={handleChange}
                  placeholder="e.g. TRD-MUM-2024-9912"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50/50 hover:bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy focus:bg-white transition-all duration-200"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">GSTIN (Optional)</label>
                <input
                  type="text"
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleChange}
                  placeholder="e.g. 27AABCU9603R1ZM"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50/50 hover:bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy focus:bg-white transition-all duration-200 uppercase"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Document Upload */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="w-5 h-5 rounded-full bg-gov-navy/10 text-gov-navy text-[11px] font-bold flex items-center justify-center">3</span>
              <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider">
                Supporting Documents (Premises Lease, Trade License, Shop Act)
              </h3>
            </div>
            
            <div className="group border-2 border-dashed border-slate-200 hover:border-gov-navy/40 rounded-2xl p-5 text-center bg-slate-50/40 hover:bg-slate-50/80 transition-all duration-200 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center mx-auto mb-2 text-slate-400 group-hover:text-gov-navy group-hover:scale-110 transition-all duration-200 shadow-subtle">
                <Upload size={18} />
              </div>
              <label className="cursor-pointer text-xs font-semibold text-gov-blue hover:text-gov-navy transition">
                <span>Upload PDF Document / Certificate</span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleDocAdd}
                  className="hidden"
                />
              </label>
              <div className="text-[10px] text-slate-400 mt-1">Accepted: PDF, JPG, PNG up to 5MB</div>
            </div>

            {documents.length > 0 && (
              <div className="space-y-1.5 animate-fade-in">
                {documents.map((d, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/80 shadow-subtle"
                  >
                    <div className="flex items-center gap-2">
                      <FileCheck size={14} className="text-emerald-600" />
                      <span className="font-medium text-slate-700">{d.name} ({d.size})</span>
                    </div>
                    <span className="text-[11px] text-emerald-700 font-semibold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">Ready</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 4: Security Password */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="w-5 h-5 rounded-full bg-gov-navy/10 text-gov-navy text-[11px] font-bold flex items-center justify-center">4</span>
              <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider">
                Account Security Password
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Create Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50/50 hover:bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy focus:bg-white transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Confirm Password *</label>
                <input
                  type="password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50/50 hover:bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy focus:bg-white transition-all duration-200"
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-tactile shimmer-sweep w-full bg-gradient-to-r from-gov-navy via-slate-900 to-gov-navy hover:from-gov-blue hover:to-gov-navy text-white py-3.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Submitting Registration...' : 'Submit Stakeholder Registration for Approval'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </form>

        <div className="p-4 bg-slate-50/80 text-center border-t border-slate-100 text-xs text-slate-600">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-gov-navy hover:text-gov-blue transition hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};


