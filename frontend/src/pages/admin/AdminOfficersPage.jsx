import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import {
  UserCheck,
  Building2,
  Scale,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Lock,
  X
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';

export const AdminOfficersPage = () => {
  const [lmos, setLmos] = useState([]);
  const [gatcs, setGatcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL'); // 'ALL' | 'LMO' | 'GATC'

  // Modal State for Adding Officer (Strictly LMO or GATC)
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [formData, setFormData] = useState({
    role: 'LMO', // Strictly 'LMO' or 'GATC'
    full_name: '',
    email: '',
    phone: '',
    password: 'OfficerPassword@2026',
    // LMO Fields
    officer_code: '',
    designation: 'Legal Metrology Inspector',
    jurisdiction_zone: '',
    office_address: '',
    // GATC Fields
    centre_name: '',
    authorization_no: '',
    authorized_scope: ['EWS', 'PWS', 'PCS'],
    lab_address: '',
    contact_person: '',
    valid_until: '2028-12-31'
  });

  const fetchOfficers = async () => {
    setLoading(true);
    try {
      const res = await api.getOfficers();
      if (res.success) {
        setLmos(res.lmos || []);
        setGatcs(res.gatcs || []);
      }
    } catch (err) {
      setError(err.data?.message || err.message || 'Failed to load officers directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfficers();
  }, []);

  const handleScopeToggle = (scopeCode) => {
    setFormData(prev => {
      const current = prev.authorized_scope || [];
      const updated = current.includes(scopeCode)
        ? current.filter(c => c !== scopeCode)
        : [...current, scopeCode];
      return { ...prev, authorized_scope: updated };
    });
  };

  const handleCreateOfficer = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      // Client-side guard check
      if (!['LMO', 'GATC'].includes(formData.role)) {
        setFormError('Security Violation: Only LMO and GATC officers can be provisioned by the Administrator.');
        setSubmitting(false);
        return;
      }

      if (formData.role === 'GATC' && (!formData.authorized_scope || formData.authorized_scope.length === 0)) {
        setFormError('Please select at least one authorized instrument category scope for this GATC centre.');
        setSubmitting(false);
        return;
      }

      const res = await api.createOfficer(formData);
      if (res.success) {
        setSuccessMessage(`${formData.role === 'LMO' ? 'Legal Metrology Officer' : 'GATC Testing Centre'} provisioned successfully.`);
        setModalOpen(false);
        // Reset Form
        setFormData({
          role: 'LMO',
          full_name: '',
          email: '',
          phone: '',
          password: 'OfficerPassword@2026',
          officer_code: '',
          designation: 'Legal Metrology Inspector',
          jurisdiction_zone: '',
          office_address: '',
          centre_name: '',
          authorization_no: '',
          authorized_scope: ['EWS', 'PWS', 'PCS'],
          lab_address: '',
          contact_person: '',
          valid_until: '2028-12-31'
        });
        await fetchOfficers();
      }
    } catch (err) {
      setFormError(err.data?.message || err.message || 'Failed to provision officer.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter lists
  const filteredLmos = lmos.filter(l => {
    if (roleFilter === 'GATC') return false;
    const term = searchTerm.toLowerCase();
    return (
      (l.user?.full_name || '').toLowerCase().includes(term) ||
      (l.officer_code || '').toLowerCase().includes(term) ||
      (l.jurisdiction_zone || '').toLowerCase().includes(term) ||
      (l.user?.email || '').toLowerCase().includes(term)
    );
  });

  const filteredGatcs = gatcs.filter(g => {
    if (roleFilter === 'LMO') return false;
    const term = searchTerm.toLowerCase();
    return (
      (g.centre_name || '').toLowerCase().includes(term) ||
      (g.authorization_no || '').toLowerCase().includes(term) ||
      (g.contact_person || '').toLowerCase().includes(term) ||
      (g.user?.email || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header & Back Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link
            to="/admin"
            className="inline-flex items-center space-x-1 text-xs text-gov-blue hover:underline font-medium mb-1"
          >
            <ArrowLeft size={14} />
            <span>Back to Central Administrative Desk</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-gov-navy flex items-center space-x-2">
            <UserCheck size={24} className="text-gov-ashoka" />
            <span>Officer Provisioning & GATC Management</span>
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Restricted Central Directory: Provision and manage authorized Legal Metrology Officers (LMO) and Government Approved Test Centres (GATC).
          </p>
        </div>

        <button
          onClick={() => {
            setFormError(null);
            setModalOpen(true);
          }}
          className="bg-gov-navy hover:bg-gov-blue text-white px-4 py-2 rounded text-xs font-bold flex items-center space-x-2 shadow-xs transition"
        >
          <PlusCircle size={15} />
          <span>Provision New Officer (LMO / GATC)</span>
        </button>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-900 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-2">
            <CheckCircle2 size={16} className="text-emerald-700" />
            <span className="font-semibold">{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-slate-500 hover:text-slate-800 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded text-xs text-amber-900 flex items-start space-x-2">
        <ShieldCheck size={16} className="text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Statutory Role Enforcement: </span>
          The Department Administrator is authorized exclusively to provision official <strong>Legal Metrology Officers (LMO)</strong> and accredited <strong>Government Approved Test Centres (GATC)</strong>. Business owners and commercial applicants register independently through the public portal.
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded border border-slate-300 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by name, code, zone, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy focus:border-gov-navy"
          />
          <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 flex items-center space-x-1">
            <Filter size={13} />
            <span>Category:</span>
          </span>
          <div className="flex rounded border border-slate-300 overflow-hidden text-xs">
            <button
              onClick={() => setRoleFilter('ALL')}
              className={`px-3 py-1 font-semibold ${roleFilter === 'ALL' ? 'bg-gov-navy text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
            >
              All ({lmos.length + gatcs.length})
            </button>
            <button
              onClick={() => setRoleFilter('LMO')}
              className={`px-3 py-1 font-semibold border-l border-slate-300 ${roleFilter === 'LMO' ? 'bg-gov-navy text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
            >
              LMO Inspectors ({lmos.length})
            </button>
            <button
              onClick={() => setRoleFilter('GATC')}
              className={`px-3 py-1 font-semibold border-l border-slate-300 ${roleFilter === 'GATC' ? 'bg-gov-navy text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
            >
              GATC Labs ({gatcs.length})
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-500 bg-white rounded border border-slate-300">
          Loading officers directory...
        </div>
      ) : (
        <div className="space-y-6">
          {/* Section 1: Legal Metrology Officers (LMO) */}
          {(roleFilter === 'ALL' || roleFilter === 'LMO') && (
            <div className="bg-white rounded border border-slate-300 shadow-xs overflow-hidden">
              <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-300 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-gov-navy uppercase tracking-wider">
                  <UserCheck size={16} className="text-blue-700" />
                  <span>Legal Metrology Officers (LMO Inspectors) ({filteredLmos.length})</span>
                </div>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                  Government Cadre
                </span>
              </div>

              {filteredLmos.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  No Legal Metrology Officers found matching search criteria.
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {filteredLmos.map((lmo) => (
                    <div key={lmo.id} className="p-4 hover:bg-slate-50 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-gov-navy">
                            {lmo.user?.full_name || 'Inspector Name'}
                          </span>
                          <span className="font-mono text-[10px] bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded font-bold">
                            {lmo.officer_code}
                          </span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                            ACTIVE
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 font-medium">
                          {lmo.designation} • <span className="text-blue-700">{lmo.jurisdiction_zone}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-3 pt-0.5">
                          <span className="flex items-center space-x-1">
                            <Mail size={12} />
                            <span>{lmo.user?.email}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Phone size={12} />
                            <span>{lmo.user?.phone || '+91 Official Desk'}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MapPin size={12} />
                            <span>{lmo.office_address}</span>
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center space-x-2">
                        <span className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-300 font-medium">
                          Scope: All Instruments (Class I-IV, WB, FPM)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Section 2: Government Approved Test Centres (GATC) */}
          {(roleFilter === 'ALL' || roleFilter === 'GATC') && (
            <div className="bg-white rounded border border-slate-300 shadow-xs overflow-hidden">
              <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-300 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-gov-navy uppercase tracking-wider">
                  <Building2 size={16} className="text-purple-700" />
                  <span>Government Approved Test Centres (GATC Laboratories) ({filteredGatcs.length})</span>
                </div>
                <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">
                  Accredited Testing Agency
                </span>
              </div>

              {filteredGatcs.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  No GATC Testing Centres found matching search criteria.
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {filteredGatcs.map((gatc) => (
                    <div key={gatc.id} className="p-4 hover:bg-slate-50 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-gov-navy">
                            {gatc.centre_name}
                          </span>
                          <span className="font-mono text-[10px] bg-purple-100 text-purple-900 px-1.5 py-0.5 rounded font-bold">
                            {gatc.authorization_no}
                          </span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                            VALIDATED
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 font-medium">
                          Director / Contact: {gatc.contact_person}
                        </div>
                        <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-3 pt-0.5">
                          <span className="flex items-center space-x-1">
                            <Mail size={12} />
                            <span>{gatc.user?.email}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MapPin size={12} />
                            <span>{gatc.lab_address}</span>
                          </span>
                          <span className="flex items-center space-x-1 text-slate-600">
                            <Calendar size={12} />
                            <span>Valid Until: {gatc.valid_until}</span>
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-500 mr-1 uppercase">Scopes:</span>
                        {(gatc.authorized_scope || []).map(scope => (
                          <span key={scope} className="text-[10px] bg-indigo-50 border border-indigo-200 text-indigo-800 font-mono font-bold px-1.5 py-0.5 rounded">
                            {scope}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* MODAL: Provision Officer (Strictly LMO or GATC) */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg border border-slate-300 shadow-2xl max-w-xl w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <div className="text-[10px] font-bold uppercase text-slate-500">Statutory Provisioning</div>
                <h2 className="text-lg font-bold font-serif text-gov-navy flex items-center space-x-2">
                  <UserCheck size={20} className="text-gov-ashoka" />
                  <span>Provision New Official Account</span>
                </h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded"
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-300 rounded text-xs text-red-900 flex items-center space-x-2">
                <AlertTriangle size={16} className="text-red-700 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateOfficer} className="space-y-4 text-xs">
              {/* Role Selection strictly restricted to LMO and GATC */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Select Official Role to Provision <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <label
                    className={`flex items-center space-x-2 p-3 rounded border cursor-pointer transition ${
                      formData.role === 'LMO'
                        ? 'bg-blue-50 border-gov-navy text-gov-navy font-bold shadow-xs'
                        : 'border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="LMO"
                      checked={formData.role === 'LMO'}
                      onChange={() => setFormData({ ...formData, role: 'LMO' })}
                      className="text-gov-navy focus:ring-gov-navy"
                    />
                    <div>
                      <div className="text-xs font-bold">LMO Inspector</div>
                      <div className="text-[10px] text-slate-500 font-normal">Legal Metrology Officer</div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center space-x-2 p-3 rounded border cursor-pointer transition ${
                      formData.role === 'GATC'
                        ? 'bg-purple-50 border-purple-700 text-purple-900 font-bold shadow-xs'
                        : 'border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="GATC"
                      checked={formData.role === 'GATC'}
                      onChange={() => setFormData({ ...formData, role: 'GATC' })}
                      className="text-purple-700 focus:ring-purple-700"
                    />
                    <div>
                      <div className="text-xs font-bold">GATC Centre</div>
                      <div className="text-[10px] text-slate-500 font-normal">Approved Testing Lab</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Common Account Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {formData.role === 'LMO' ? 'Officer Full Name' : 'Centre Representative Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={formData.role === 'LMO' ? 'e.g. Inspector Suresh Varma' : 'e.g. Dr. K. Ramesh'}
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. officer@legalmetrology.gov.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98123 45678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Initial Portal Password *</label>
                  <input
                    type="text"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy font-mono"
                  />
                </div>
              </div>

              {/* LMO Specific Fields */}
              {formData.role === 'LMO' && (
                <div className="bg-slate-50 p-3 rounded border border-slate-300 space-y-3">
                  <div className="font-bold text-gov-navy text-xs border-b border-slate-200 pb-1">
                    LMO Inspector Credentials & Jurisdiction
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Officer Code *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. LMO-MH-ZONE04"
                        value={formData.officer_code}
                        onChange={(e) => setFormData({ ...formData, officer_code: e.target.value })}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded uppercase font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Designation</label>
                      <input
                        type="text"
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Jurisdiction Zone *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Pune Division - Zone 2"
                        value={formData.jurisdiction_zone}
                        onChange={(e) => setFormData({ ...formData, jurisdiction_zone: e.target.value })}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Office Address *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Legal Metrology Bhavan, Camp, Pune"
                        value={formData.office_address}
                        onChange={(e) => setFormData({ ...formData, office_address: e.target.value })}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* GATC Specific Fields */}
              {formData.role === 'GATC' && (
                <div className="bg-purple-50 p-3 rounded border border-purple-200 space-y-3">
                  <div className="font-bold text-purple-900 text-xs border-b border-purple-200 pb-1">
                    GATC Testing Centre Accreditation Details
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Testing Centre Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Deccan Precision Metrology Lab"
                        value={formData.centre_name}
                        onChange={(e) => setFormData({ ...formData, centre_name: e.target.value })}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Authorization No. *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. GATC-GOI-W-2026-088"
                        value={formData.authorization_no}
                        onChange={(e) => setFormData({ ...formData, authorization_no: e.target.value })}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded uppercase font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Laboratory Address *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. MIDC Industrial Area, Unit 4"
                        value={formData.lab_address}
                        onChange={(e) => setFormData({ ...formData, lab_address: e.target.value })}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Accreditation Valid Until *</label>
                      <input
                        type="date"
                        required
                        value={formData.valid_until}
                        onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Authorized Category Scopes:
                    </label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {[
                        { code: 'EWS', label: 'Electronic Scale (EWS)' },
                        { code: 'PWS', label: 'Platform Scale (PWS)' },
                        { code: 'PCS', label: 'Price Computing (PCS)' }
                      ].map(sc => (
                        <label
                          key={sc.code}
                          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded border text-xs cursor-pointer ${
                            formData.authorized_scope.includes(sc.code)
                              ? 'bg-purple-700 text-white border-purple-800 font-bold'
                              : 'bg-white text-slate-700 border-slate-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.authorized_scope.includes(sc.code)}
                            onChange={() => handleScopeToggle(sc.code)}
                            className="hidden"
                          />
                          <span>{sc.label}</span>
                        </label>
                      ))}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      Note: Weighbridges (WB) and Fuel Dispensers (FPM) are restricted to official LMO field inspectors.
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-gov-navy hover:bg-gov-blue text-white rounded text-xs font-bold transition flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <UserCheck size={14} />
                  <span>{submitting ? 'Authorizing...' : `Authorize & Provision ${formData.role}`}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
