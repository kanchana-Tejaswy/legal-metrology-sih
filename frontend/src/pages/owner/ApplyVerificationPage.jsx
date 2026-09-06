import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FileCheck2, Calendar, Upload, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ApplyVerificationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedInstId = searchParams.get('instrumentId');

  const { user } = useAuth();
  const [instruments, setInstruments] = useState([]);
  const [selectedInst, setSelectedInst] = useState(null);

  const [formData, setFormData] = useState({
    instrument_id: preselectedInstId || '',
    application_type: 'NEW',
    preferred_date: '',
    preferred_time: '10:30 AM',
    remarks: ''
  });

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submittedApp, setSubmittedApp] = useState(null);

  useEffect(() => {
    async function loadInstruments() {
      try {
        const res = await api.getInstruments();
        if (res.success && res.instruments) {
          setInstruments(res.instruments);
          const initialId = preselectedInstId || (res.instruments.length > 0 ? res.instruments[0].id : '');
          if (initialId) {
            setFormData(prev => ({ ...prev, instrument_id: initialId }));
            const match = res.instruments.find(i => i.id === initialId);
            setSelectedInst(match || null);
            // If instrument already has previous certificate or expired, suggest RE_VERIFICATION
            if (match && (match.current_status === 'EXPIRED' || match.current_status === 'EXPIRING_SOON' || match.certificate)) {
              setFormData(prev => ({ ...prev, application_type: 'RE_VERIFICATION' }));
            }
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadInstruments();
  }, [preselectedInstId]);

  const handleInstrumentChange = (e) => {
    const instId = e.target.value;
    setFormData({ ...formData, instrument_id: instId });
    const match = instruments.find(i => i.id === instId);
    setSelectedInst(match || null);
    if (match && (match.current_status === 'EXPIRED' || match.current_status === 'EXPIRING_SOON' || match.certificate)) {
      setFormData(prev => ({ ...prev, application_type: 'RE_VERIFICATION' }));
    }
  };

  const handleDocAdd = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocuments([
        ...documents,
        { name: file.name, size: `${(file.size / 1024).toFixed(1)} KB`, url: '/uploads/sample_app_doc.pdf' }
      ]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        ...formData,
        documents: documents.length > 0 ? documents : [{ name: 'Purchase_Invoice.pdf', url: '/uploads/invoice.pdf' }]
      };

      const res = await api.createApplication(payload);
      if (res.success) {
        setSubmittedApp(res.application);
      }
    } catch (err) {
      setError(err.data?.message || err.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  if (submittedApp) {
    return (
      <div className="max-w-xl mx-auto my-12 px-4">
        <div className="bg-white rounded border border-slate-300 shadow-xl p-6 sm:p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-700">
            <CheckCircle2 size={36} />
          </div>

          <h2 className="text-xl font-bold font-serif text-gov-navy">
            Application Submitted Successfully
          </h2>

          <div className="bg-slate-50 border border-slate-300 rounded p-4 text-xs space-y-2">
            <div className="text-slate-500 uppercase font-bold text-[10px]">Generated Statutory Application ID</div>
            <div className="font-mono text-xl font-bold text-gov-navy">{submittedApp.id}</div>
            <div className="text-slate-600">
              Your application has been assigned status: <strong>SUBMITTED</strong>.
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              The Department Administrator will review and allocate this application to an authorized Legal Metrology Officer (LMO) or Government Approved Test Centre (GATC).
            </p>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <Link
              to="/owner/applications"
              className="bg-gov-navy hover:bg-gov-blue text-white px-5 py-2 rounded text-xs font-semibold transition"
            >
              Track My Applications →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        to="/owner/instruments"
        className="inline-flex items-center space-x-1 text-xs text-gov-blue hover:underline font-medium"
      >
        <ArrowLeft size={14} />
        <span>Back to Instruments</span>
      </Link>

      <div className="bg-white rounded border border-slate-300 shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gov-navy text-white p-5 border-b-2 border-amber-500">
          <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
            Department of Legal Metrology • Form LM-A
          </div>
          <h2 className="text-xl font-bold font-serif">
            Apply for Verification / Re-Verification
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Statutory physical verification for legal compliance under Section 24 of the Legal Metrology Act, 2009.
          </p>
        </div>

        {error && (
          <div className="m-5 p-3 bg-red-50 border-l-4 border-red-600 text-xs text-red-800 flex items-start space-x-2">
            <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Section 1: Verification Type */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider border-b pb-1">
              1. Verification Category
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3 rounded border text-xs cursor-pointer flex items-start space-x-3 transition ${
                  formData.application_type === 'NEW'
                    ? 'border-gov-navy bg-blue-50/70'
                    : 'border-slate-300 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="application_type"
                  value="NEW"
                  checked={formData.application_type === 'NEW'}
                  onChange={(e) => setFormData({ ...formData, application_type: e.target.value })}
                  className="mt-0.5 text-gov-navy"
                />
                <div>
                  <div className="font-bold text-gov-navy">Initial Verification (New Stamping)</div>
                  <div className="text-[11px] text-slate-500">
                    For newly installed instruments prior to first commercial deployment.
                  </div>
                </div>
              </label>

              <label
                className={`p-3 rounded border text-xs cursor-pointer flex items-start space-x-3 transition ${
                  formData.application_type === 'RE_VERIFICATION'
                    ? 'border-gov-navy bg-blue-50/70'
                    : 'border-slate-300 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="application_type"
                  value="RE_VERIFICATION"
                  checked={formData.application_type === 'RE_VERIFICATION'}
                  onChange={(e) => setFormData({ ...formData, application_type: e.target.value })}
                  className="mt-0.5 text-gov-navy"
                />
                <div>
                  <div className="font-bold text-gov-navy">Periodic Re-Verification</div>
                  <div className="text-[11px] text-slate-500">
                    For instruments with expiring or expired certificates requiring re-stamping.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Section 2: Instrument Selection */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider border-b pb-1">
              2. Select Registered Instrument
            </h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Choose Instrument from Your Inventory *
              </label>
              {instruments.length === 0 ? (
                <div className="text-xs text-amber-800 bg-amber-50 p-3 rounded border border-amber-300">
                  No instruments registered yet.{' '}
                  <Link to="/owner/instruments/register" className="font-bold underline">
                    Register an instrument first →
                  </Link>
                </div>
              ) : (
                <select
                  value={formData.instrument_id}
                  onChange={handleInstrumentChange}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy bg-white"
                  required
                >
                  {instruments.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.instrument_type} | SN: {inst.serial_number} | Model: {inst.model_number} (Status: {inst.current_status})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Selected Instrument Detail Card */}
            {selectedInst && (
              <div className="bg-slate-50 p-3.5 rounded border border-slate-200 text-xs grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <span className="text-slate-500 text-[10px] block">Manufacturer</span>
                  <span className="font-semibold text-slate-800">{selectedInst.manufacturer}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Serial Number</span>
                  <span className="font-mono font-bold text-gov-navy">{selectedInst.serial_number}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Capacity</span>
                  <span className="font-semibold text-slate-800">
                    {selectedInst.max_capacity} {selectedInst.unit}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Location</span>
                  <span className="text-slate-700 truncate block">{selectedInst.location}</span>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Preferred Inspection Schedule & Remarks */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider border-b pb-1">
              3. Inspection Scheduling Preference & Remarks
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Preferred Inspection Date *
                </label>
                <input
                  type="date"
                  name="preferred_date"
                  value={formData.preferred_date}
                  onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Preferred Time Slot *
                </label>
                <select
                  name="preferred_time"
                  value={formData.preferred_time}
                  onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy bg-white"
                >
                  <option value="10:00 AM">Morning Session (10:00 AM - 01:00 PM)</option>
                  <option value="02:00 PM">Afternoon Session (02:00 PM - 05:00 PM)</option>
                  <option value="11:30 AM">Midday (11:30 AM - 02:00 PM)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Applicant Remarks / Access Instructions
                </label>
                <textarea
                  rows={2}
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="Provide any specific location details, gate pass requirements, or contact person on-site"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Document Attachments */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider border-b pb-1">
              4. Supporting Documents (Invoice, Model Approval, Previous Certificate)
            </h3>
            <div className="border-2 border-dashed border-slate-300 rounded p-4 text-center hover:border-gov-navy transition">
              <Upload size={20} className="text-slate-400 mx-auto mb-1" />
              <label className="cursor-pointer text-xs font-semibold text-gov-blue hover:underline">
                <span>Attach Relevant Document</span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleDocAdd}
                  className="hidden"
                />
              </label>
            </div>

            {documents.length > 0 && (
              <div className="space-y-1">
                {documents.map((d, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded border border-slate-200"
                  >
                    <span className="font-medium text-slate-700">{d.name} ({d.size})</span>
                    <span className="text-emerald-700 font-semibold">Attached</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={loading || instruments.length === 0}
              className="w-full bg-gov-navy hover:bg-gov-blue text-white py-3 rounded text-xs sm:text-sm font-bold uppercase tracking-wider shadow transition disabled:opacity-50"
            >
              {loading ? 'Submitting Application...' : 'Submit Verification Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
