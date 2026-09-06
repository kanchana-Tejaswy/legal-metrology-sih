import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import {
  Building2,
  FileCheck,
  CheckCircle,
  AlertCircle,
  Upload,
  ShieldAlert,
  ArrowRight
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
    state: 'Maharashtra',
    district: 'Mumbai',
    pincode: '',
    trade_license_no: '',
    gstin: ''
  });

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      <div className="max-w-xl mx-auto my-12 px-4">
        <div className="bg-white rounded border border-slate-300 shadow-xl p-6 sm:p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-700">
            <CheckCircle size={36} />
          </div>

          <h2 className="text-xl font-bold font-serif text-gov-navy">
            Registration Submitted Successfully
          </h2>

          <div className="bg-amber-50 border border-amber-300 rounded p-4 text-xs text-amber-900 text-left space-y-2">
            <div className="font-bold flex items-center space-x-1.5 text-amber-800">
              <ShieldAlert size={16} />
              <span>Statutory Review Status: PENDING VERIFICATION</span>
            </div>
            <p className="leading-relaxed">
              Your business stakeholder account for <strong>"{formData.business_name}"</strong> has been registered.
              In accordance with Legal Metrology statutory regulations, your account is currently <strong>PENDING</strong> review and approval by the Department Administrator.
            </p>
            <p className="leading-relaxed text-[11px] text-amber-800">
              You will not be able to register instruments or submit verification applications until an authorized officer validates your trade license and premises details.
            </p>
          </div>

          <div className="text-xs text-slate-600">
            A confirmation has been logged in the department registry. You may log in to track your approval status.
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <Link
              to="/login"
              className="bg-gov-navy hover:bg-gov-blue text-white px-5 py-2 rounded text-xs font-semibold flex items-center space-x-1.5 transition"
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
    <div className="max-w-3xl mx-auto my-8 px-4">
      <div className="bg-white rounded border border-slate-300 shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gov-navy text-white p-5 border-b-2 border-amber-500">
          <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
            Official Stakeholder Enrollment Form
          </div>
          <h2 className="text-xl font-bold font-serif">
            Instrument Owner / Business Owner Registration
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Mandatory statutory registration for commercial users, traders, retailers, and industrial users of weighing & measuring instruments.
          </p>
        </div>

        {/* Notice */}
        <div className="bg-blue-50 border-b border-blue-200 px-5 py-3 text-xs text-slate-700 flex items-start space-x-2">
          <Building2 size={16} className="text-gov-navy flex-shrink-0 mt-0.5" />
          <div>
            <strong>Administrative Notice: </strong> All new registrations require review and clearance by the Department Administrator before instruments can be submitted for verification.
          </div>
        </div>

        {error && (
          <div className="m-5 p-3 bg-red-50 border-l-4 border-red-600 text-xs text-red-800 flex items-start space-x-2">
            <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Section 1: Applicant Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider border-b pb-1">
              1. Authorized Applicant Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name of Authorized Person *
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="e.g. Anand Kumar"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Phone / Mobile Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98200 12345"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address (Username for Login) *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="owner@mybusiness.com"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Business & Premises Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider border-b pb-1">
              2. Commercial Establishment / Enterprise Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Registered Business Name / Trade Name *
                </label>
                <input
                  type="text"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleChange}
                  placeholder="e.g. Metro Retail Supermarket Ltd."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Business Installation Address *
                </label>
                <textarea
                  name="business_address"
                  rows={2}
                  value={formData.business_address}
                  onChange={handleChange}
                  placeholder="Shop/Unit No., Commercial Complex, Street, Landmark"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">District / Ward *</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="e.g. 400053"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Trade License No.</label>
                <input
                  type="text"
                  name="trade_license_no"
                  value={formData.trade_license_no}
                  onChange={handleChange}
                  placeholder="e.g. TRD-MUM-2024-9912"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">GSTIN (Optional)</label>
                <input
                  type="text"
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleChange}
                  placeholder="e.g. 27AABCU9603R1ZM"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy uppercase"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Document Upload */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider border-b pb-1">
              3. Supporting Documents (Premises Lease, Trade License, Shop Act)
            </h3>
            <div className="border-2 border-dashed border-slate-300 rounded p-4 text-center hover:border-gov-navy transition">
              <Upload size={24} className="text-slate-400 mx-auto mb-1" />
              <label className="cursor-pointer text-xs font-semibold text-gov-blue hover:underline">
                <span>Upload PDF Document / Certificate</span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleDocAdd}
                  className="hidden"
                />
              </label>
              <div className="text-[10px] text-slate-500 mt-1">Accepted: PDF, JPG, PNG up to 5MB</div>
            </div>

            {documents.length > 0 && (
              <div className="space-y-1">
                {documents.map((d, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded border border-slate-200"
                  >
                    <span className="font-medium text-slate-700">{d.name} ({d.size})</span>
                    <span className="text-emerald-700 font-semibold">Ready</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 4: Security Password */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider border-b pb-1">
              4. Account Security Password
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Create Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password *</label>
                <input
                  type="password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy"
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gov-navy hover:bg-gov-blue text-white py-3 rounded text-xs sm:text-sm font-bold uppercase tracking-wider shadow transition disabled:opacity-50"
            >
              {loading ? 'Submitting Registration...' : 'Submit Stakeholder Registration for Approval'}
            </button>
          </div>
        </form>

        <div className="p-3 bg-slate-100 text-center border-t border-slate-200 text-xs">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-gov-blue hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
