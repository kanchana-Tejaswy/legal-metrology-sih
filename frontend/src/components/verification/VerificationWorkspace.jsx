import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Scale,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  AlertCircle,
  Upload,
  Camera,
  FileCheck,
  Building2,
  ArrowLeft,
  ShieldAlert,
  Award,
  Lock,
  QrCode
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { PaymentModal } from '../common/PaymentModal';

export const VerificationWorkspace = ({ verifierRole = 'LMO' }) => {
  const { id } = useParams(); // Application ID
  const navigate = useNavigate();
  const { user } = useAuth();

  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successResult, setSuccessResult] = useState(null);

  // Payment state (feature/razorpay-payment)
  const [paymentModal, setPaymentModal] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(null); // { verification_record_id, application_id }

  // Form State
  const [checklist, setChecklist] = useState({
    stamping_intact: true,
    spirit_level_centered: true,
    plate_condition_clean: true,
    zero_tracking_functional: true
  });

  const [tests, setTests] = useState({
    repeatability_error_g: '0.002',
    eccentricity_error_g: '0.002',
    max_load_tested_kg: '',
    error_at_max_load_g: '0.003',
    max_permissible_error_g: '0.005'
  });

  const [observations, setObservations] = useState(
    'Conducted physical inspection using certified Working Standards F2 class weights. Zero balance stable. Repeatability test over 5 continuous cycles within permissible tolerance.'
  );
  const [testResults, setTestResults] = useState(
    'Maximum deviation under full load is within MPE (+/- 0.005 kg). Eccentricity corner load variance verified across 4 quadrants.'
  );
  const [remarks, setRemarks] = useState(
    'Lead verification seal applied at rear calibration orifice (Seal Tag No: MH/MUM/2026/LMO). Fit for commercial trade.'
  );
  const [evidencePhotos, setEvidencePhotos] = useState([]);

  useEffect(() => {
    async function loadWorkspace() {
      try {
        const res = await api.getVerificationWorkspace(id);
        if (res.success && res.workspace) {
          setWorkspace(res.workspace);
          if (res.workspace.instrument?.max_capacity) {
            setTests(prev => ({
              ...prev,
              max_load_tested_kg: String(res.workspace.instrument.max_capacity)
            }));
          }
        }
      } catch (err) {
        setError(err.data?.message || err.message || 'Failed to load verification workspace.');
      } finally {
        setLoading(false);
      }
    }
    loadWorkspace();
  }, [id]);

  const handleEvidenceAdd = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEvidencePhotos([
        ...evidencePhotos,
        {
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60'
        }
      ]);
    }
  };

  const handleResultSubmit = async (finalResult) => {
    if (!observations.trim() || !testResults.trim()) {
      setError('Please provide inspection observations and test results before submitting.');
      return;
    }

    if (finalResult === 'FAIL' && !remarks.trim()) {
      setError('Remarks detailing the exact non-compliance reasons are mandatory for a FAIL determination.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        visual_checklist: checklist,
        metrological_tests: tests,
        observations,
        test_results: testResults,
        evidence_photos: evidencePhotos.length > 0 ? evidencePhotos : [
          { name: 'Official_Seal_Evidence.jpg', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60' }
        ],
        remarks,
        result: finalResult // 'PASS' or 'FAIL'
      };

      const res = await api.submitVerification(id, payload);
      if (res.success) {
        if (finalResult === 'PASS' && res.payment_required) {
          // ── PAYMENT GATE (feature/razorpay-payment) ────────────────────
          // Verification passed. Store pending state and open payment modal.
          // Certificate will NOT be shown until backend confirms payment.
          setPendingVerification({
            verification_record_id: res.verification_record?.id,
            application_id: res.application_id || id,
            verification_record: res.verification_record
          });
          setPaymentModal(true);
        } else {
          // FAIL or legacy — show existing success screen unchanged
          setSuccessResult(res);
        }
      }
    } catch (err) {
      setError(err.data?.message || err.message || 'Failed to submit verification result.');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Called by PaymentModal after backend verifies payment and returns certificate.
   * Constructs a successResult compatible with the existing success screen (unchanged).
   */
  const handlePaymentSuccess = ({ certificate, qr_code }) => {
    setPaymentModal(false);
    setSuccessResult({
      success: true,
      verification_record: pendingVerification?.verification_record || { result: 'PASS' },
      certificate,
      qr_code
    });
    setPendingVerification(null);
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-slate-500">
        Loading Field Verification Workspace...
      </div>
    );
  }

  if (successResult) {
    const isPass = successResult.verification_record?.result === 'PASS';
    return (
      <div className="max-w-2xl mx-auto my-8 px-4">
        <div className="bg-white rounded border border-slate-300 shadow-xl p-6 sm:p-8 text-center space-y-5">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
              isPass ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {isPass ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
          </div>

          <h2 className="text-xl font-bold font-serif text-gov-navy">
            Verification Result Submitted: {isPass ? 'PASS' : 'FAIL'}
          </h2>

          <div
            className={`p-4 rounded border text-xs text-left space-y-2 ${
              isPass ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-red-50 border-red-300 text-red-900'
            }`}
          >
            {isPass ? (
              <>
                <div className="font-bold flex items-center space-x-1.5 text-emerald-800">
                  <Award size={16} />
                  <span>Statutory Digital Verification Certificate Generated</span>
                </div>
                <div>Certificate ID: <strong className="font-mono text-sm">{successResult.certificate?.id}</strong></div>
                <div>Valid Until: <strong>{successResult.certificate?.valid_until}</strong></div>
                <div className="pt-1 flex items-center space-x-2">
                  <Link
                    to={`/verify/${successResult.certificate?.id}`}
                    target="_blank"
                    className="bg-emerald-800 text-white px-3 py-1.5 rounded font-semibold text-xs flex items-center space-x-1"
                  >
                    <QrCode size={13} />
                    <span>Open Live Public QR Page</span>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="font-bold flex items-center space-x-1.5 text-red-800">
                  <ShieldAlert size={16} />
                  <span>Rejection Recorded — Instrument Deemed Non-Compliant</span>
                </div>
                <p>
                  The instrument failed statutory verification tolerances. Application has been marked <strong>FAILED</strong>. The business owner has been notified with rectification instructions. No verification certificate was issued.
                </p>
              </>
            )}
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <Link
              to={verifierRole === 'LMO' ? '/lmo' : '/gatc'}
              className="bg-gov-navy hover:bg-gov-blue text-white px-5 py-2 rounded text-xs font-semibold transition"
            >
              Return to Workload Dashboard →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const app = workspace?.application;
  const inst = workspace?.instrument;
  const owner = workspace?.owner;

  // Real-time MPE tolerance calculations
  const repError = parseFloat(tests.repeatability_error_g) || 0;
  const eccError = parseFloat(tests.eccentricity_error_g) || 0;
  const maxLoadError = parseFloat(tests.error_at_max_load_g) || 0;
  const mpeLimit = parseFloat(tests.max_permissible_error_g) || 0;
  const observedMaxError = Math.max(repError, eccError, maxLoadError);
  const isWithinTolerance = observedMaxError <= mpeLimit;
  const toleranceDelta = Math.abs(observedMaxError - mpeLimit).toFixed(3);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Payment Modal — feature/razorpay-payment */}
      {pendingVerification && (
        <PaymentModal
          isOpen={paymentModal}
          onClose={() => setPaymentModal(false)}
          applicationId={pendingVerification.application_id}
          verificationRecordId={pendingVerification.verification_record_id}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Top Breadcrumb */}
      <Link
        to={verifierRole === 'LMO' ? '/lmo' : '/gatc'}
        className="inline-flex items-center space-x-1.5 text-xs text-gov-blue hover:text-gov-navy font-semibold transition group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        <span>Return to {verifierRole} Dashboard</span>
      </Link>

      {/* Main Workspace Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-card overflow-hidden">
        {/* Government Header */}
        <div className="bg-gov-navy text-white p-5 border-b-2 border-amber-500 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
              {verifierRole === 'LMO' ? 'Office of Legal Metrology Officer' : 'GATC Accredited Test Centre'}
            </div>
            <h1 className="text-xl font-bold font-serif tracking-tight">
              Statutory Verification Workspace
            </h1>
            <div className="text-xs text-slate-300 mt-0.5">
              Application ID: <span className="font-mono font-bold text-amber-200">{app?.id}</span>
            </div>
          </div>

          <div className="text-left sm:text-right bg-gov-navy-light/60 sm:bg-transparent px-3 py-1.5 sm:p-0 rounded-lg sm:rounded-none">
            <span className="text-[10px] uppercase text-slate-300 block tracking-wider">Assigned Verifier</span>
            <span className="font-bold text-xs text-white">{user?.full_name}</span>
          </div>
        </div>

        {/* Physical Verification Reality Notice */}
        <div className="bg-blue-50/80 border-b border-blue-100 p-3.5 text-xs text-slate-700 flex items-start space-x-2.5">
          <Scale size={16} className="text-gov-navy flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-gov-navy">Verifier Duty Notice: </strong>
            You are recording the results of an <strong>actual physical inspection and metrological test</strong> conducted with standard weights. Ensure all tests strictly conform with Maximum Permissible Error (MPE) thresholds.
          </div>
        </div>

        {error && (
          <div className="m-5 p-3.5 bg-red-50 border border-red-200 border-l-4 border-l-red-600 rounded text-xs text-red-800 flex items-start space-x-2.5">
            <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div className="font-medium">{error}</div>
          </div>
        )}

        {/* Workspace Body */}
        <div className="p-6 space-y-6">
          {/* Section 1: Instrument & Business Details */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/90 text-xs space-y-3">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="font-bold text-gov-navy uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                <Building2 size={13} className="text-slate-500" />
                <span>Instrument & Owner Dossier</span>
              </span>
              <StatusBadge status={app?.status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 text-slate-700">
                <div>Type: <strong className="text-slate-900">{inst?.instrument_type}</strong></div>
                <div>Manufacturer: <span className="text-slate-800">{inst?.manufacturer}</span></div>
                <div>Model: <span className="font-mono text-slate-800">{inst?.model_number}</span></div>
                <div>Serial Number: <strong className="font-mono text-gov-navy text-sm">{inst?.serial_number}</strong></div>
                <div>Capacity: <span className="font-mono tabular-nums font-semibold text-slate-800">{inst?.min_capacity} - {inst?.max_capacity} {inst?.unit}</span></div>
              </div>

              <div className="space-y-1.5 text-slate-700">
                <div>Owner/Enterprise: <strong className="text-slate-900">{owner?.business_name || owner?.full_name}</strong></div>
                <div>Address: <span className="text-slate-800">{owner?.stakeholder?.business_address || inst?.location}</span></div>
                <div>Contact Phone: <span className="font-mono text-slate-800">{owner?.phone}</span></div>
                <div>Scheduled: <strong className="text-slate-900">{app?.schedule?.scheduled_date || app?.preferred_date}</strong> ({app?.schedule?.scheduled_time || '10:30 AM'})</div>
              </div>
            </div>
          </div>

          {/* Section 2: Visual & Stamping Checklist */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center justify-between">
              <span>1. Visual & Physical Integrity Checklist</span>
              <span className="text-[11px] font-normal text-slate-500 lowercase">All items required for verification pass</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="flex items-center space-x-2.5 p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={checklist.stamping_intact}
                  onChange={(e) => setChecklist({ ...checklist, stamping_intact: e.target.checked })}
                  className="rounded text-gov-navy focus:ring-gov-navy h-4 w-4"
                />
                <span className="text-slate-700 font-medium">Previous seal/stamping port intact and tamper-free</span>
              </label>

              <label className="flex items-center space-x-2.5 p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={checklist.spirit_level_centered}
                  onChange={(e) => setChecklist({ ...checklist, spirit_level_centered: e.target.checked })}
                  className="rounded text-gov-navy focus:ring-gov-navy h-4 w-4"
                />
                <span className="text-slate-700 font-medium">Level indicator (spirit level) centered correctly</span>
              </label>

              <label className="flex items-center space-x-2.5 p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={checklist.plate_condition_clean}
                  onChange={(e) => setChecklist({ ...checklist, plate_condition_clean: e.target.checked })}
                  className="rounded text-gov-navy focus:ring-gov-navy h-4 w-4"
                />
                <span className="text-slate-700 font-medium">Load pan & knife edge bearings clean, free of corrosion</span>
              </label>

              <label className="flex items-center space-x-2.5 p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={checklist.zero_tracking_functional}
                  onChange={(e) => setChecklist({ ...checklist, zero_tracking_functional: e.target.checked })}
                  className="rounded text-gov-navy focus:ring-gov-navy h-4 w-4"
                />
                <span className="text-slate-700 font-medium">Automatic zero setting and tare tracking functional</span>
              </label>
            </div>
          </div>

          {/* Section 3: Metrological Test Results */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-1.5 gap-1">
              <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider">
                2. Metrological Precision Measurements & Error Verification
              </h3>
              {/* Dynamic Real-time Tolerance Indicator */}
              <div className="flex items-center space-x-1.5">
                {isWithinTolerance ? (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 size={12} />
                    <span>Tolerance Compliant (Max: {observedMaxError}g ≤ MPE: {mpeLimit}g)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-300">
                    <AlertTriangle size={12} />
                    <span>Exceeds Tolerance (+{toleranceDelta}g over MPE)</span>
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Repeatability Error (g) *
                </label>
                <input
                  type="text"
                  value={tests.repeatability_error_g}
                  onChange={(e) => setTests({ ...tests, repeatability_error_g: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono tabular-nums text-slate-900 focus:ring-1 focus:ring-gov-navy focus:border-gov-navy"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Eccentricity Error (g) *
                </label>
                <input
                  type="text"
                  value={tests.eccentricity_error_g}
                  onChange={(e) => setTests({ ...tests, eccentricity_error_g: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono tabular-nums text-slate-900 focus:ring-1 focus:ring-gov-navy focus:border-gov-navy"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Max Load Tested (kg)
                </label>
                <input
                  type="text"
                  value={tests.max_load_tested_kg}
                  onChange={(e) => setTests({ ...tests, max_load_tested_kg: e.target.value })}
                  placeholder={inst?.max_capacity ? String(inst.max_capacity) : '30'}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono tabular-nums text-slate-900 focus:ring-1 focus:ring-gov-navy focus:border-gov-navy"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Error at Max Load (g)
                </label>
                <input
                  type="text"
                  value={tests.error_at_max_load_g}
                  onChange={(e) => setTests({ ...tests, error_at_max_load_g: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono tabular-nums text-slate-900 focus:ring-1 focus:ring-gov-navy focus:border-gov-navy"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Max Permissible Error (g) *
                </label>
                <input
                  type="text"
                  value={tests.max_permissible_error_g}
                  onChange={(e) => setTests({ ...tests, max_permissible_error_g: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono tabular-nums font-semibold text-gov-navy bg-slate-50 focus:ring-1 focus:ring-gov-navy focus:border-gov-navy"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 4: Observations & Test Remarks */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider border-b border-slate-200 pb-1.5">
              3. Inspection Observations & Legal Remarks
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Detailed Inspection Observations *
              </label>
              <textarea
                rows={2}
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-gov-navy focus:border-gov-navy"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Metrological Test Results Summary *
              </label>
              <textarea
                rows={2}
                value={testResults}
                onChange={(e) => setTestResults(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-gov-navy focus:border-gov-navy"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Officer Remarks & Stamping Seal Identifier
              </label>
              <textarea
                rows={2}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-gov-navy focus:border-gov-navy"
              />
            </div>
          </div>

          {/* Section 5: Field Photo / Evidence Capture */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider border-b border-slate-200 pb-1.5">
              4. Evidence Photograph (Stamped Seal / Nameplate)
            </h3>

            <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-gov-navy hover:bg-slate-50/50 transition">
              <Camera size={22} className="text-slate-400 mx-auto mb-1" />
              <label className="cursor-pointer text-xs font-semibold text-gov-blue hover:underline">
                <span>Capture / Upload Evidence Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleEvidenceAdd}
                  className="hidden"
                />
              </label>
              <div className="text-[10px] text-slate-400 mt-0.5">Mobile camera capture supported in field mode</div>
            </div>

            {evidencePhotos.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {evidencePhotos.map((p, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md font-medium text-slate-700 flex items-center space-x-1"
                  >
                    <CheckCircle2 size={12} className="text-emerald-600" />
                    <span>{p.name}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Section 6: Statutory Determination (PASS / FAIL) */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div className="text-xs font-bold uppercase text-slate-700 text-center tracking-wider">
              Statutory Verification Determination
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleResultSubmit('PASS')}
                className="btn-tactile w-full bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider shadow-sm flex items-center justify-center space-x-2 transition disabled:opacity-50"
              >
                <CheckCircle2 size={18} />
                <span>PASS — Issue Digital Certificate</span>
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={() => handleResultSubmit('FAIL')}
                className="btn-tactile w-full bg-red-700 hover:bg-red-800 active:bg-red-900 text-white py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider shadow-sm flex items-center justify-center space-x-2 transition disabled:opacity-50"
              >
                <XCircle size={18} />
                <span>FAIL — Reject Instrument</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Sticky Determination Bar for Verifiers */}
      <div className="sticky bottom-2 sm:bottom-4 mb-safe z-20 p-3 sm:p-3.5 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-300/80 shadow-sticky-bar flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3 text-xs w-full sm:w-auto">
          <div className="p-2 bg-slate-100 rounded-xl text-gov-navy flex-shrink-0">
            <Scale size={18} />
          </div>
          <div>
            <div className="font-bold text-gov-navy flex items-center space-x-2">
              <span>SN: <span className="font-mono text-slate-800">{inst?.serial_number || 'N/A'}</span></span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-normal truncate max-w-[140px] sm:max-w-none">{inst?.instrument_type}</span>
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
              <span>Tolerance:</span>
              {isWithinTolerance ? (
                <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                  <CheckCircle2 size={12} />
                  <span>Compliant ({observedMaxError}g ≤ {mpeLimit}g)</span>
                </span>
              ) : (
                <span className="text-amber-700 font-semibold flex items-center space-x-1">
                  <AlertTriangle size={12} />
                  <span>Exceeds (+{toleranceDelta}g)</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleResultSubmit('PASS')}
            className="btn-tactile bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm flex items-center justify-center space-x-1.5 transition disabled:opacity-50 min-h-[42px]"
          >
            <CheckCircle2 size={15} />
            <span>{submitting ? 'Submitting...' : 'PASS'}</span>
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={() => handleResultSubmit('FAIL')}
            className="btn-tactile bg-red-700 hover:bg-red-800 active:bg-red-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm flex items-center justify-center space-x-1.5 transition disabled:opacity-50 min-h-[42px]"
          >
            <XCircle size={15} />
            <span>{submitting ? 'Submitting...' : 'FAIL'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
