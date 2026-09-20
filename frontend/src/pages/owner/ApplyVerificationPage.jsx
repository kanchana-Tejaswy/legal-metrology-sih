import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  FileCheck2,
  Calendar,
  Upload,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Building2,
  Scale,
  Navigation,
  Clock,
  Phone,
  Mail,
  Zap,
  ShieldCheck,
  Check
} from 'lucide-react';

export const ApplyVerificationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedInstId = searchParams.get('instrumentId');

  const { user } = useAuth();
  const [instruments, setInstruments] = useState([]);
  const [selectedInst, setSelectedInst] = useState(null);

  const [nearbyOffices, setNearbyOffices] = useState([]);
  const [allOffices, setAllOffices] = useState([]);
  const [cadreFilter, setCadreFilter] = useState('ALL'); // 'ALL' | 'LMO' | 'GATC'
  const [loadingOffices, setLoadingOffices] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState(null);

  const [formData, setFormData] = useState({
    instrument_id: preselectedInstId || '',
    application_type: 'NEW',
    preferred_date: '',
    preferred_time: '10:30 AM',
    preferred_office_id: '',
    preferred_cadre: 'LMO',
    remarks: ''
  });

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submittedApp, setSubmittedApp] = useState(null);

  /**
   * Load nearby verification centres (both LMO Inspectorates and GATC Testing Centres).
   *
   * - Instruments like Weighbridges (WB) and Fuel Dispensers (FPM) MUST go to an
   *   official Legal Metrology Officer (LMO) — GATC is prohibited by statutory law.
   * - Standard commercial scales (EWS, PWS, PCS) can be verified by EITHER an official
   *   Govt LMO Divisional Office OR an Accredited GATC Testing Laboratory.
   */
  const loadNearbyOffices = async (categoryCode = '', isGatcEligible = true) => {
    setLoadingOffices(true);
    try {
      const state = user?.stakeholder?.state || 'Maharashtra';
      const district = user?.stakeholder?.district || 'Mumbai Suburb';
      const pincode = user?.stakeholder?.pincode || '400053';

      const res = await api.getNearbyOffices(`state=${encodeURIComponent(state)}&district=${encodeURIComponent(district)}&pincode=${pincode}&category_code=${categoryCode}`);
      if (res.success && res.offices) {
        // If instrument strictly requires LMO (Weighbridge / Fuel Dispenser), exclude GATC
        let available = res.offices;
        if (!isGatcEligible) {
          available = res.offices.filter(o => o.type === 'LMO_OFFICE');
          setCadreFilter('LMO');
        } else {
          setCadreFilter('ALL');
        }

        setAllOffices(available);
        setNearbyOffices(available);

        // Auto-select the closest matching office
        if (available.length > 0) {
          const topOffice = available[0];
          setSelectedOffice(topOffice);
          setFormData(prev => ({
            ...prev,
            preferred_office_id: topOffice.id,
            preferred_cadre: topOffice.type === 'GATC_LAB' ? 'GATC' : 'LMO',
            preferred_date: prev.preferred_date || topOffice.earliest_slot
          }));
        } else {
          setSelectedOffice(null);
        }
      }
    } catch (err) {
      console.error('Failed to load nearby offices:', err);
    } finally {
      setLoadingOffices(false);
    }
  };

  // Filter nearby offices when cadre tab changes
  const handleCadreFilterChange = (filter) => {
    setCadreFilter(filter);
    let filtered = allOffices;
    if (filter === 'LMO') {
      filtered = allOffices.filter(o => o.type === 'LMO_OFFICE');
    } else if (filter === 'GATC') {
      filtered = allOffices.filter(o => o.type === 'GATC_LAB');
    }
    setNearbyOffices(filtered);

    // If currently selected office is not in the filtered list, re-select top one
    if (filtered.length > 0 && !filtered.some(o => o.id === selectedOffice?.id)) {
      handleSelectOffice(filtered[0]);
    }
  };

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
            if (match && (match.current_status === 'EXPIRED' || match.current_status === 'EXPIRING_SOON' || match.certificate)) {
              setFormData(prev => ({ ...prev, application_type: 'RE_VERIFICATION' }));
            }
            const isGatcEligible = match?.category?.gatc_eligible !== false;
            loadNearbyOffices(match?.category?.code || '', isGatcEligible);
          } else {
            loadNearbyOffices('', true);
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
    setFormData(prev => ({ ...prev, instrument_id: instId, preferred_office_id: '' }));
    const match = instruments.find(i => i.id === instId);
    setSelectedInst(match || null);
    setSelectedOffice(null);
    if (match && (match.current_status === 'EXPIRED' || match.current_status === 'EXPIRING_SOON' || match.certificate)) {
      setFormData(prev => ({ ...prev, application_type: 'RE_VERIFICATION' }));
    }
    const isGatcEligible = match?.category?.gatc_eligible !== false;
    loadNearbyOffices(match?.category?.code || '', isGatcEligible);
  };

  const handleSelectOffice = (office) => {
    setSelectedOffice(office);
    setFormData(prev => ({
      ...prev,
      preferred_office_id: office.id,
      preferred_cadre: office.type === 'GATC_LAB' ? 'GATC' : 'LMO',
      preferred_date: office.earliest_slot || prev.preferred_date
    }));
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
        preferred_cadre: selectedOffice?.type === 'GATC_LAB' ? 'GATC' : 'LMO',
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
    const isGatc = submittedApp.assignment?.verifier_type === 'GATC';
    return (
      <div className="max-w-xl mx-auto my-12 px-4">
        <div className="bg-white rounded border border-slate-300 shadow-xl p-6 sm:p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-700">
            <CheckCircle2 size={36} />
          </div>

          <h2 className="text-xl font-bold font-serif text-gov-navy">
            Application Submitted & Directly Allotted
          </h2>

          <div className="bg-slate-50 border border-slate-300 rounded p-4 text-xs space-y-3 text-left">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="text-slate-500 uppercase font-bold text-[10px]">Application ID</span>
              <span className="font-mono text-base font-bold text-gov-navy">{submittedApp.id}</span>
            </div>

            <div className="flex items-start space-x-2 bg-emerald-50 border border-emerald-300 p-2.5 rounded text-emerald-900">
              <Zap size={16} className="text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Zero Manual Wait Time: </span>
                Your application has been <strong>automatically routed directly</strong> to {isGatc ? 'an accredited GATC testing centre' : 'an authorized Legal Metrology Officer (LMO)'} based on the instrument category and selected office.
              </div>
            </div>

            <div className="space-y-1.5 pt-1 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                  {submittedApp.status} (AUTOMATICALLY ALLOTTED)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned Cadre:</span>
                <span className="font-semibold text-gov-navy">
                  {submittedApp.assignment?.verifier_type === 'LMO' ? 'Legal Metrology Inspector' : 'GATC Accredited Lab'}
                </span>
              </div>
              {submittedApp.schedule?.scheduled_date && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Scheduled Date:</span>
                  <span className="font-semibold text-slate-800">
                    {submittedApp.schedule.scheduled_date} ({submittedApp.schedule.scheduled_time || '10:30 AM'})
                  </span>
                </div>
              )}
            </div>
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
            Statutory physical verification under Section 24 of the Legal Metrology Act, 2009 with automated direct routing.
          </p>
        </div>

        {error && (
          <div className="m-5 p-3 bg-red-50 border-l-4 border-red-600 text-xs text-red-800 flex items-start space-x-2">
            <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
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
                  <span className="text-slate-500 text-[10px] block">Capacity & Scale</span>
                  <span className="font-semibold text-slate-800">
                    {selectedInst.max_capacity} {selectedInst.unit} (e = {selectedInst.verification_scale_interval || '0.001'} {selectedInst.unit})
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Premises Location</span>
                  <span className="text-slate-700 truncate block">{selectedInst.location}</span>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Suggested Nearby Offices & Test Centres */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-1">
              <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider flex items-center space-x-1.5">
                <Navigation size={14} className="text-gov-ashoka" />
                <span>3. Nearby Authorised Offices for This Instrument</span>
              </h3>
              <span className="text-[11px] text-slate-500">
                Proximity-based routing
              </span>
            </div>

            {/* Routing Authority Explanation Banner — dynamically explains WHY these offices appear */}
            {selectedInst && (() => {
              const isGatcEligible = selectedInst?.category?.gatc_eligible !== false;
              const catName = selectedInst?.category?.name || selectedInst?.instrument_type || 'Instrument';
              const catCode = selectedInst?.category?.code || '';

              if (!isGatcEligible) {
                // WB / FPM — government LMO inspector only
                return (
                  <div className="flex items-start space-x-2.5 bg-blue-50 border border-blue-300 rounded p-3 text-xs text-blue-900">
                    <ShieldCheck size={18} className="text-blue-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Statutory Legal Metrology Officer (LMO) Mandatory: </span>
                      Your <strong>{catName}</strong> {catCode && `(${catCode})`} is a heavy / specialized measuring instrument. Under Rule 14 of the Legal Metrology (General) Rules 2011, this category must be inspected and stamped exclusively by an official <strong>Legal Metrology Officer (LMO)</strong>. GATC test centres cannot verify this instrument.
                    </div>
                  </div>
                );
              } else {
                // EWS / PWS / PCS — Can be verified by either LMO or GATC
                return (
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2.5 bg-emerald-50 border border-emerald-300 rounded p-3 text-xs text-emerald-900">
                      <Scale size={18} className="text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Dual Verification Cadre Available: </span>
                        Your <strong>{catName}</strong> {catCode && `(${catCode})`} can be verified either by an official <strong>Government Legal Metrology Divisional Office (LMO)</strong> or an accredited <strong>Government Approved Test Centre (GATC)</strong>. You have the legal choice to select your preferred centre below.
                      </div>
                    </div>

                    {/* Cadre Filter Tabs */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-xs font-semibold text-slate-600">Filter Centres:</span>
                      <button
                        type="button"
                        onClick={() => handleCadreFilterChange('ALL')}
                        className={`px-3 py-1 rounded text-xs font-bold transition ${
                          cadreFilter === 'ALL'
                            ? 'bg-gov-navy text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                        }`}
                      >
                        All Centres ({allOffices.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCadreFilterChange('LMO')}
                        className={`px-3 py-1 rounded text-xs font-bold transition flex items-center space-x-1 ${
                          cadreFilter === 'LMO'
                            ? 'bg-blue-800 text-white shadow-xs'
                            : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
                        }`}
                      >
                        <span>🏛️ Official LMO Offices ({allOffices.filter(o => o.type === 'LMO_OFFICE').length})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCadreFilterChange('GATC')}
                        className={`px-3 py-1 rounded text-xs font-bold transition flex items-center space-x-1 ${
                          cadreFilter === 'GATC'
                            ? 'bg-purple-800 text-white shadow-xs'
                            : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
                        }`}
                      >
                        <span>🔬 Accredited GATC Labs ({allOffices.filter(o => o.type === 'GATC_LAB').length})</span>
                      </button>
                    </div>
                  </div>
                );
              }
            })()}

            {/* Location note */}
            <div className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded px-3 py-2">
              📍 Showing centres closest to your registered premises in{' '}
              <strong>{user?.stakeholder?.district || 'Mumbai Suburb'}, {user?.stakeholder?.state || 'Maharashtra'}</strong>.
              Sorted by proximity.
            </div>

            {loadingOffices ? (
              <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded border animate-pulse">
                Searching nearby authorised offices...
              </div>
            ) : nearbyOffices.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-600 bg-slate-50 rounded border">
                No nearby offices found for the selected filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {nearbyOffices.map((office) => {
                  const isSelected = selectedOffice?.id === office.id || formData.preferred_office_id === office.id;
                  const isGatc = office.type === 'GATC_LAB';

                  return (
                    <div
                      key={office.id}
                      onClick={() => handleSelectOffice(office)}
                      className={`p-3.5 rounded border text-xs cursor-pointer transition flex flex-col justify-between space-y-2.5 ${
                        isSelected
                          ? 'border-gov-navy bg-blue-50/80 ring-2 ring-gov-navy/20 shadow-xs'
                          : 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              isGatc ? 'bg-purple-100 text-purple-800 border border-purple-300' : 'bg-blue-100 text-blue-800 border border-blue-300'
                            }`}
                          >
                            {isGatc ? '🔬 Accredited GATC Lab' : '🏛️ Govt LMO Office'}
                          </span>
                          <span className="font-semibold text-emerald-700 text-[11px] flex items-center space-x-1">
                            <Navigation size={11} />
                            <span>{office.distance_km} km away</span>
                          </span>
                        </div>

                        <div className="font-bold text-sm text-gov-navy leading-tight">
                          {office.name}
                        </div>

                        <div className="text-[11px] text-slate-600 font-medium">
                          {isGatc ? 'Lab Director / Contact: ' : 'Inspector of LM: '}
                          <span className="text-slate-800">{office.officer_name}</span>
                        </div>

                        <div className="text-[11px] text-slate-500 flex items-start space-x-1">
                          <MapPin size={12} className="shrink-0 mt-0.5 text-slate-400" />
                          <span className="line-clamp-2">{office.address}</span>
                        </div>

                        <div className="text-[11px] text-slate-600 flex items-center space-x-1">
                          <Phone size={11} className="text-slate-400" />
                          <span>{office.phone}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                        <div>
                          <span className="text-slate-500 block text-[10px]">Earliest Available Slot:</span>
                          <span className="font-semibold text-gov-navy">{office.earliest_slot}</span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectOffice(office);
                          }}
                          className={`px-3 py-1 rounded text-xs font-bold transition flex items-center space-x-1 ${
                            isSelected
                              ? 'bg-gov-navy text-white'
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check size={12} />
                              <span>Selected</span>
                            </>
                          ) : (
                            <span>Select Centre</span>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 4: Preferred Inspection Schedule & Remarks */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider border-b pb-1">
              4. Inspection Date & Time Preference
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
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy font-semibold"
                  required
                />
                {selectedOffice && (
                  <span className="text-[10px] text-emerald-700 mt-1 block">
                    ✓ Slot date aligned with {selectedOffice.name}
                  </span>
                )}
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
                  <option value="11:30 AM">Midday Session (11:30 AM - 02:00 PM)</option>
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
                  placeholder="Provide specific location directions, premises contact person, or gate security instructions."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Document Attachments */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider border-b pb-1">
              5. Supporting Documents (Invoice, Model Approval, Previous Certificate)
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
              className="w-full bg-gov-navy hover:bg-gov-blue text-white py-3 rounded text-xs sm:text-sm font-bold uppercase tracking-wider shadow transition disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Zap size={16} className="text-amber-400" />
              <span>
                {loading
                  ? 'Processing Direct Allotment...'
                  : 'Submit Application (Automated Direct Allotment)'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
