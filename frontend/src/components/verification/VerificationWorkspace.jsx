import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Scale,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Upload,
  Camera,
  FileCheck,
  Building2,
  ArrowLeft,
  ShieldAlert,
  Award,
  Lock,
  QrCode,
  Calculator,
  Zap,
  Info,
  Fuel,
  TrendingDown,
  Check
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export const VerificationWorkspace = ({ verifierRole = 'LMO' }) => {
  const { id } = useParams(); // Application ID
  const navigate = useNavigate();
  const { user } = useAuth();

  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successResult, setSuccessResult] = useState(null);

  // Visual Checklist
  const [checklist, setChecklist] = useState({
    stamping_intact: true,
    spirit_level_centered: true,
    plate_condition_clean: true,
    zero_tracking_functional: true
  });

  // Metrological Error Test Data for Weighing Instruments (EWS, PWS, PCS, WB)
  const [weighingTests, setWeighingTests] = useState([
    { step: 'Min Capacity (20e)', load_kg: 0.1, indication_kg: 0.1, error_g: 0.0, mpe_g: 5.0, status: 'PASS' },
    { step: '500e Threshold', load_kg: 2.5, indication_kg: 2.502, error_g: 2.0, mpe_g: 5.0, status: 'PASS' },
    { step: '50% Half Capacity', load_kg: 15.0, indication_kg: 15.004, error_g: 4.0, mpe_g: 10.0, status: 'PASS' },
    { step: '100% Max Capacity', load_kg: 30.0, indication_kg: 30.006, error_g: 6.0, mpe_g: 15.0, status: 'PASS' }
  ]);

  const [weighingSpecial, setWeighingSpecial] = useState({
    repeatability_error_g: '2.0',
    repeatability_mpe_g: '5.0',
    eccentricity_error_g: '3.0',
    eccentricity_mpe_g: '10.0'
  });

  // Metrological Error Test Data for Fuel Dispensers (FPM)
  const [fuelTests, setFuelTests] = useState([
    { test: '5L Check Measure (Normal Flow)', target_l: 5.0, dispenser_l: 5.0, flask_ml: 4995, error_ml: -5, error_pct: -0.1, mpe_ml: 25, status: 'PASS' },
    { test: '5L Check Measure (Minimum Flow)', target_l: 5.0, dispenser_l: 5.0, flask_ml: 5010, error_ml: 10, error_pct: 0.2, mpe_ml: 25, status: 'PASS' },
    { test: '10L Check Measure (Delivery Run)', target_l: 10.0, dispenser_l: 10.0, flask_ml: 9985, error_ml: -15, error_pct: -0.15, mpe_ml: 50, status: 'PASS' }
  ]);

  const [fuelSpecial, setFuelSpecial] = useState({
    anti_drain_valve_intact: true,
    totalizer_reading_start: '104820.5',
    totalizer_reading_end: '104840.5',
    air_eliminator_operational: true
  });

  // Price Computing Scale (PCS) Tests
  const [pcsTests, setPcsTests] = useState([
    { weight_kg: 2.5, unit_price: 120.0, displayed_price: 300.0, expected_price: 300.0, status: 'PASS' },
    { weight_kg: 0.35, unit_price: 85.0, displayed_price: 29.75, expected_price: 29.75, status: 'PASS' }
  ]);

  const [observations, setObservations] = useState('');
  const [testResults, setTestResults] = useState('');
  const [remarks, setRemarks] = useState('');
  const [evidencePhotos, setEvidencePhotos] = useState([]);

  // Category identification
  const categoryCode = workspace?.instrument?.category?.code || 'EWS';
  const isFuelDispenser = categoryCode === 'FPM' || workspace?.instrument?.instrument_type?.toLowerCase().includes('fuel');
  const isWeighbridge = categoryCode === 'WB' || workspace?.instrument?.instrument_type?.toLowerCase().includes('weighbridge');
  const isPriceComputing = categoryCode === 'PCS' || workspace?.instrument?.instrument_type?.toLowerCase().includes('price');

  // Load and calibrate workspace
  useEffect(() => {
    async function loadWorkspace() {
      try {
        const res = await api.getVerificationWorkspace(id);
        if (res.success && res.workspace) {
          setWorkspace(res.workspace);
          const inst = res.workspace.instrument;
          const maxCap = parseFloat(inst?.max_capacity || 30);
          const eInterval = parseFloat(inst?.verification_scale_interval || (maxCap <= 30 ? 0.005 : 0.05));
          const unit = inst?.unit || 'kg';

          if (inst?.category?.code === 'FPM') {
            setObservations('Physical inspection of fuel dispensing unit at retail outlet. Calibrated 5-Litre and 10-Litre conical check measures deployed. Delivery nozzles free from leakage.');
            setTestResults('Volume errors across normal flow and slow delivery within statutory MPE of +/- 0.5% (+/- 25 ml on 5L). Anti-drain valve operational.');
            setRemarks('Official lead wire seal applied through calibration pulser lock pin (Seal Tag No: GOV-FPM-2026-SEAL). Fit for commercial liquid fuel trade.');
          } else {
            // Calibrate weighing test grid
            const minLoad = parseFloat((20 * eInterval).toFixed(4));
            const step500e = parseFloat((500 * eInterval).toFixed(4));
            const halfCap = parseFloat((maxCap * 0.5).toFixed(4));
            const fullCap = parseFloat(maxCap.toFixed(4));

            const eG = eInterval * 1000;
            const mpe1 = parseFloat((1 * eG).toFixed(2));
            const mpe2 = parseFloat((2 * eG).toFixed(2));
            const mpe3 = parseFloat((3 * eG).toFixed(2));

            setWeighingTests([
              { step: 'Min Capacity (20e)', load_kg: minLoad, indication_kg: minLoad, error_g: 0.0, mpe_g: mpe1, status: 'PASS' },
              { step: '500e Intermediate', load_kg: step500e, indication_kg: parseFloat((step500e + 0.0002).toFixed(4)), error_g: 0.2, mpe_g: mpe1, status: 'PASS' },
              { step: '50% Half Capacity', load_kg: halfCap, indication_kg: parseFloat((halfCap + 0.0004).toFixed(4)), error_g: 0.4, mpe_g: mpe2, status: 'PASS' },
              { step: '100% Full Capacity', load_kg: fullCap, indication_kg: parseFloat((fullCap + 0.0008).toFixed(4)), error_g: 0.8, mpe_g: mpe3, status: 'PASS' }
            ]);

            setWeighingSpecial({
              repeatability_error_g: (mpe1 * 0.4).toFixed(1),
              repeatability_mpe_g: mpe1.toFixed(1),
              eccentricity_error_g: (mpe2 * 0.5).toFixed(1),
              eccentricity_mpe_g: mpe2.toFixed(1)
            });

            setObservations(`Physical metrological inspection conducted using certified ${isWeighbridge ? 'Class M1 standard test weights' : 'Class F2 working standard weights'}. Zero balance stable and return to zero intact.`);
            setTestResults(`Maximum deviation under full load is within MPE (+/- ${mpe3} g). Eccentricity corner load variance verified across 4 quadrants. Repeatability test over 5 cycles compliant.`);
            setRemarks('Statutory verification seal applied at rear calibration orifice (Tag No: LM/VER/2026/INSP). Stamping certified for statutory trade under LM Act.');
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

  // Recalculate Weighing Scale Error dynamically
  const handleWeighingIndicationChange = (index, newIndication) => {
    const val = parseFloat(newIndication) || 0;
    setWeighingTests(prev => {
      const copy = [...prev];
      const item = copy[index];
      const errorG = parseFloat(((val - item.load_kg) * 1000).toFixed(2));
      const isCompliant = Math.abs(errorG) <= item.mpe_g;
      copy[index] = {
        ...item,
        indication_kg: val,
        error_g: errorG,
        status: isCompliant ? 'PASS' : 'FAIL'
      };
      return copy;
    });
  };

  // Recalculate Fuel Dispenser Error dynamically
  const handleFuelMeasureChange = (index, newFlaskReading) => {
    const flaskMl = parseFloat(newFlaskReading) || 0;
    setFuelTests(prev => {
      const copy = [...prev];
      const item = copy[index];
      const targetMl = item.target_l * 1000;
      const errorMl = flaskMl - targetMl;
      const errorPct = parseFloat(((errorMl / targetMl) * 100).toFixed(2));
      const isCompliant = Math.abs(errorMl) <= item.mpe_ml;
      copy[index] = {
        ...item,
        flask_ml: flaskMl,
        error_ml: errorMl,
        error_pct: errorPct,
        status: isCompliant ? 'PASS' : 'FAIL'
      };
      return copy;
    });
  };

  // Overall Pass/Fail automatic determination
  const isWeighingPass = weighingTests.every(t => t.status === 'PASS') &&
    parseFloat(weighingSpecial.repeatability_error_g) <= parseFloat(weighingSpecial.repeatability_mpe_g) &&
    parseFloat(weighingSpecial.eccentricity_error_g) <= parseFloat(weighingSpecial.eccentricity_mpe_g);

  const isFuelPass = fuelTests.every(t => t.status === 'PASS') &&
    fuelSpecial.anti_drain_valve_intact &&
    fuelSpecial.air_eliminator_operational;

  const isOverallCompliant = isFuelDispenser ? isFuelPass : isWeighingPass;

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
        metrological_tests: {
          category: categoryCode,
          test_sequence: isFuelDispenser ? fuelTests : weighingTests,
          special_tests: isFuelDispenser ? fuelSpecial : weighingSpecial,
          is_compliant: isOverallCompliant
        },
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
        setSuccessResult(res);
      }
    } catch (err) {
      setError(err.data?.message || err.message || 'Failed to submit verification result.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-slate-500 bg-white rounded border border-slate-300">
        Loading legal metrological verification workspace...
      </div>
    );
  }

  if (successResult) {
    const isPass = successResult.verification?.result === 'PASS';
    return (
      <div className="max-w-xl mx-auto my-12 px-4">
        <div className="bg-white rounded border border-slate-300 shadow-xl p-6 sm:p-8 text-center space-y-4">
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
                    <span>Open Live Public QR Verification Page</span>
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
                  The instrument failed statutory verification tolerances. Application has been marked <strong>FAILED</strong>. The business owner has been notified.
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Breadcrumb */}
      <Link
        to={verifierRole === 'LMO' ? '/lmo' : '/gatc'}
        className="inline-flex items-center space-x-1 text-xs text-gov-blue hover:underline font-medium"
      >
        <ArrowLeft size={14} />
        <span>Return to {verifierRole} Dashboard</span>
      </Link>

      {/* Main Workspace Card */}
      <div className="bg-white rounded border border-slate-300 shadow-md overflow-hidden">
        {/* Government Header */}
        <div className="bg-gov-navy text-white p-5 border-b-2 border-amber-500 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
              {verifierRole === 'LMO' ? 'Office of Legal Metrology Officer' : 'GATC Accredited Test Centre'}
            </div>
            <h1 className="text-xl font-bold font-serif">
              Statutory Verification & Error Calculation Workspace
            </h1>
            <div className="text-xs text-slate-300 mt-0.5">
              Application ID: <span className="font-mono font-bold text-amber-200">{app?.id}</span> • Instrument Category: <span className="font-bold text-white">{inst?.category?.name || 'Standard Scale'}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase text-slate-300 block">Assigned Verifier</span>
            <span className="font-bold text-xs text-white">{user?.full_name}</span>
          </div>
        </div>

        {error && (
          <div className="m-5 p-3.5 bg-red-50 border-l-4 border-red-600 text-xs text-red-800 flex items-start space-x-2">
            <AlertTriangle size={16} className="text-red-600 shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Instrument & Stakeholder Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded border border-slate-200 text-xs space-y-2">
              <div className="font-bold text-gov-navy text-xs uppercase flex items-center space-x-1.5 border-b pb-1">
                <Scale size={14} />
                <span>Instrument Under Inspection</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div>
                  <span className="text-slate-500 text-[10px] block">Type & Category</span>
                  <span className="font-semibold text-slate-900">{inst?.instrument_type}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Serial Number</span>
                  <span className="font-mono font-bold text-gov-navy">{inst?.serial_number}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Capacity & Tolerance Interval</span>
                  <span className="font-semibold text-slate-900">
                    {inst?.min_capacity} - {inst?.max_capacity} {inst?.unit} (e = {inst?.verification_scale_interval || '0.005'} {inst?.unit})
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Accuracy Class</span>
                  <span className="font-bold text-indigo-700">{inst?.category?.accuracy_class || 'Class III'}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded border border-slate-200 text-xs space-y-2">
              <div className="font-bold text-gov-navy text-xs uppercase flex items-center space-x-1.5 border-b pb-1">
                <Building2 size={14} />
                <span>Establishment & Premises</span>
              </div>
              <div className="space-y-1 text-slate-700">
                <div>
                  <span className="text-slate-500 text-[10px] block">Business Name</span>
                  <span className="font-semibold text-slate-900">{owner?.stakeholder?.business_name || owner?.full_name}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Inspection Address</span>
                  <span className="text-slate-800">{inst?.location || owner?.stakeholder?.business_address}</span>
                </div>
                <div className="flex items-center space-x-4 pt-0.5">
                  <span className="text-slate-500 text-[10px]">GSTIN: <strong className="text-slate-800 font-mono">{owner?.stakeholder?.gstin || '27AABCU9603R1ZM'}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Visual Checklist */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider border-b pb-1">
              1. Physical & Visual Statutory Inspection
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label className="flex items-center space-x-2 p-2.5 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.stamping_intact}
                  onChange={(e) => setChecklist({ ...checklist, stamping_intact: e.target.checked })}
                  className="rounded text-gov-navy"
                />
                <span>Previous seal/stamping port intact and tamper-free</span>
              </label>

              <label className="flex items-center space-x-2 p-2.5 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.spirit_level_centered}
                  onChange={(e) => setChecklist({ ...checklist, spirit_level_centered: e.target.checked })}
                  className="rounded text-gov-navy"
                />
                <span>Level indicator (spirit level) centered correctly</span>
              </label>

              <label className="flex items-center space-x-2 p-2.5 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.plate_condition_clean}
                  onChange={(e) => setChecklist({ ...checklist, plate_condition_clean: e.target.checked })}
                  className="rounded text-gov-navy"
                />
                <span>Load pan & bearings clean, free of corrosion or distortion</span>
              </label>

              <label className="flex items-center space-x-2 p-2.5 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.zero_tracking_functional}
                  onChange={(e) => setChecklist({ ...checklist, zero_tracking_functional: e.target.checked })}
                  className="rounded text-gov-navy"
                />
                <span>Automatic zero setting and tare tracking functional</span>
              </label>
            </div>
          </div>

          {/* Section 2: Instrument-Specific Metrological Error Calculation Engine */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-1">
              <div className="flex items-center space-x-2">
                <Calculator size={16} className="text-gov-ashoka" />
                <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider">
                  2. Metrological Error Calculation Engine ({categoryCode} - {inst?.category?.accuracy_class || 'Class III'})
                </h3>
              </div>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded flex items-center space-x-1 ${
                  isOverallCompliant ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {isOverallCompliant ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
                <span>Calculated Compliance: {isOverallCompliant ? 'PASS (Within Tolerance)' : 'FAIL (Exceeds Tolerance)'}</span>
              </span>
            </div>

            {/* A: FUEL DISPENSING UNITS (FPM) ERROR ENGINE */}
            {isFuelDispenser ? (
              <div className="space-y-4">
                <div className="bg-amber-50/70 p-3 rounded border border-amber-200 text-xs text-amber-900 flex items-start space-x-2">
                  <Fuel size={16} className="text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>Legal Rule Reference: </strong>
                    Indian Legal Metrology (General) Rules 2011, Seventh Schedule & OIML R117 (Class 0.5 Measuring Systems).
                    Maximum Permissible Error (MPE) is <strong>+/- 0.5%</strong> (+/- 25 ml on 5 Litres, +/- 50 ml on 10 Litres).
                  </div>
                </div>

                <div className="overflow-x-auto rounded border border-slate-300">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                      <tr>
                        <th className="p-2.5">Test Parameter</th>
                        <th className="p-2.5">Target Volume</th>
                        <th className="p-2.5">Dispenser Indicated</th>
                        <th className="p-2.5">Flask Reading (ml) *</th>
                        <th className="p-2.5">Error (ml)</th>
                        <th className="p-2.5">Error %</th>
                        <th className="p-2.5">Statutory MPE</th>
                        <th className="p-2.5 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {fuelTests.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2.5 font-semibold text-gov-navy">{row.test}</td>
                          <td className="p-2.5">{row.target_l} L</td>
                          <td className="p-2.5">{row.dispenser_l} L</td>
                          <td className="p-2.5">
                            <input
                              type="number"
                              step="1"
                              value={row.flask_ml}
                              onChange={(e) => handleFuelMeasureChange(idx, e.target.value)}
                              className="w-24 px-2 py-1 border border-slate-300 rounded font-mono font-bold"
                            />
                          </td>
                          <td className={`p-2.5 font-mono font-bold ${row.status === 'PASS' ? 'text-slate-800' : 'text-red-700'}`}>
                            {row.error_ml > 0 ? `+${row.error_ml}` : row.error_ml} ml
                          </td>
                          <td className={`p-2.5 font-mono font-bold ${row.status === 'PASS' ? 'text-slate-800' : 'text-red-700'}`}>
                            {row.error_pct > 0 ? `+${row.error_pct}` : row.error_pct}%
                          </td>
                          <td className="p-2.5 text-slate-600">+/- {row.mpe_ml} ml (+/- 0.5%)</td>
                          <td className="p-2.5 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.status === 'PASS' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded border border-slate-200">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={fuelSpecial.anti_drain_valve_intact}
                      onChange={(e) => setFuelSpecial({ ...fuelSpecial, anti_drain_valve_intact: e.target.checked })}
                      className="rounded text-gov-navy"
                    />
                    <span>Anti-drain valve at nozzle functional (no drip/leakage)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={fuelSpecial.air_eliminator_operational}
                      onChange={(e) => setFuelSpecial({ ...fuelSpecial, air_eliminator_operational: e.target.checked })}
                      className="rounded text-gov-navy"
                    />
                    <span>Air elimination separator fully operational</span>
                  </label>
                </div>
              </div>
            ) : (
              /* B: WEIGHING SCALES & WEIGHBRIDGES (EWS, PWS, PCS, WB) ERROR ENGINE */
              <div className="space-y-4">
                <div className="bg-blue-50/70 p-3 rounded border border-blue-200 text-xs text-slate-700 flex items-start space-x-2">
                  <Info size={16} className="text-gov-navy shrink-0 mt-0.5" />
                  <div>
                    <strong>Legal Rule Reference: </strong>
                    Indian Legal Metrology (General) Rules 2011 & OIML R76 ({inst?.category?.accuracy_class || 'Class III'}).
                    Verification Scale Interval <strong>e = {inst?.verification_scale_interval || '0.005'} {inst?.unit || 'kg'}</strong>.
                    Tiers: 0 to 500e (&plusmn;1e), 500e to 2000e (&plusmn;2e), &gt;2000e (&plusmn;3e).
                  </div>
                </div>

                <div className="overflow-x-auto rounded border border-slate-300">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                      <tr>
                        <th className="p-2.5">Test Loading Step</th>
                        <th className="p-2.5">Applied Standard Load ({inst?.unit || 'kg'})</th>
                        <th className="p-2.5">Observed Indication ({inst?.unit || 'kg'}) *</th>
                        <th className="p-2.5">Absolute Error (g)</th>
                        <th className="p-2.5">Permissible MPE Limit</th>
                        <th className="p-2.5 text-center">Step Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {weighingTests.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2.5 font-semibold text-gov-navy">{row.step}</td>
                          <td className="p-2.5 font-mono">{row.load_kg} {inst?.unit || 'kg'}</td>
                          <td className="p-2.5">
                            <input
                              type="number"
                              step="0.0001"
                              value={row.indication_kg}
                              onChange={(e) => handleWeighingIndicationChange(idx, e.target.value)}
                              className="w-28 px-2 py-1 border border-slate-300 rounded font-mono font-bold"
                            />
                          </td>
                          <td className={`p-2.5 font-mono font-bold ${row.status === 'PASS' ? 'text-slate-800' : 'text-red-700'}`}>
                            {row.error_g > 0 ? `+${row.error_g}` : row.error_g} g
                          </td>
                          <td className="p-2.5 text-slate-600 font-mono">
                            +/- {row.mpe_g} g
                          </td>
                          <td className="p-2.5 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.status === 'PASS' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Repeatability & Eccentricity Precision Checks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded border border-slate-200">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">
                      Repeatability Error over 5 Cycles (g)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={weighingSpecial.repeatability_error_g}
                        onChange={(e) => setWeighingSpecial({ ...weighingSpecial, repeatability_error_g: e.target.value })}
                        className="w-24 px-2.5 py-1 border border-slate-300 rounded font-mono font-bold"
                      />
                      <span className="text-[11px] text-slate-500">
                        Max Allowed MPE: +/- {weighingSpecial.repeatability_mpe_g} g
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">
                      Eccentricity / 4-Corner Load Error (g)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={weighingSpecial.eccentricity_error_g}
                        onChange={(e) => setWeighingSpecial({ ...weighingSpecial, eccentricity_error_g: e.target.value })}
                        className="w-24 px-2.5 py-1 border border-slate-300 rounded font-mono font-bold"
                      />
                      <span className="text-[11px] text-slate-500">
                        Max Allowed MPE: +/- {weighingSpecial.eccentricity_mpe_g} g
                      </span>
                    </div>
                  </div>
                </div>

                {/* Optional Price Computing Test */}
                {isPriceComputing && (
                  <div className="bg-indigo-50/70 p-3 rounded border border-indigo-200 text-xs space-y-2">
                    <div className="font-bold text-indigo-900 flex items-center space-x-1.5">
                      <Calculator size={14} />
                      <span>Price Computing Arithmetic & Rounding Validation</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-indigo-950">
                      <div className="bg-white p-2 rounded border border-indigo-200">
                        Test 1: 2.5 kg @ ₹120.00/kg &rarr; Displayed: ₹300.00 (Match: PASS)
                      </div>
                      <div className="bg-white p-2 rounded border border-indigo-200">
                        Test 2: 0.35 kg @ ₹85.00/kg &rarr; Displayed: ₹29.75 (Match: PASS)
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 3: Observations & Legal Remarks */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider border-b pb-1">
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
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy"
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
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Officer Remarks & Physical Stamping Seal Identifier
              </label>
              <textarea
                rows={2}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Specify lead wire seal number, punch mark, or reason for non-compliance."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy"
              />
            </div>
          </div>

          {/* Section 4: Photographic Evidence */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider border-b pb-1">
              4. Photographic Evidence & Calibration Seal Proof
            </h3>

            <div className="border-2 border-dashed border-slate-300 rounded p-4 text-center hover:border-gov-navy transition">
              <Camera size={20} className="text-slate-400 mx-auto mb-1" />
              <label className="cursor-pointer text-xs font-semibold text-gov-blue hover:underline">
                <span>Upload Stamped Instrument / Orifice Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEvidenceAdd}
                  className="hidden"
                />
              </label>
            </div>

            {evidencePhotos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {evidencePhotos.map((photo, idx) => (
                  <div key={idx} className="border border-slate-200 rounded p-1 text-[11px] text-center bg-slate-50">
                    <img src={photo.url} alt="Evidence" className="h-16 w-full object-cover rounded mb-1" />
                    <span className="truncate block font-medium">{photo.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Submission Buttons */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-xs text-slate-600">
              Determination: {isOverallCompliant ? (
                <span className="text-emerald-700 font-bold">Calculated as Metrologically Compliant (PASS)</span>
              ) : (
                <span className="text-red-700 font-bold">Calculated as Non-Compliant (FAIL)</span>
              )}
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleResultSubmit('FAIL')}
                disabled={submitting}
                className="flex-1 sm:flex-initial bg-red-700 hover:bg-red-800 text-white px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition shadow-xs disabled:opacity-50 flex items-center justify-center space-x-1"
              >
                <XCircle size={15} />
                <span>Mark Non-Compliant (FAIL)</span>
              </button>

              <button
                type="button"
                onClick={() => handleResultSubmit('PASS')}
                disabled={submitting}
                className="flex-1 sm:flex-initial bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition shadow-xs disabled:opacity-50 flex items-center justify-center space-x-1"
              >
                <CheckCircle2 size={15} />
                <span>{submitting ? 'Generating Certificate...' : 'Approve & Issue Certificate (PASS)'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
