import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import {
  FileCheck2,
  Users,
  Award,
  AlertTriangle,
  Scale,
  Calendar,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  Building2,
  FileText
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await api.getDashboardStats();
        if (res.success && res.stats) {
          setStats(res.stats);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-300 rounded shadow-xs p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
            Central Administrative Desk
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-gov-navy">
            Department Administration & Supervisory Dashboard
          </h1>
          <div className="text-xs text-slate-600 mt-0.5">
            Real-time administrative control over stakeholder approvals, allocation, scheduling, and compliance.
          </div>
        </div>

        {stats?.pendingStakeholders > 0 && (
          <Link
            to="/admin/stakeholders?status=PENDING"
            className="bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-1.5 rounded text-xs font-bold flex items-center space-x-1.5 shadow-xs transition"
          >
            <Users size={14} />
            <span>{stats.pendingStakeholders} Stakeholder(s) Awaiting Approval</span>
          </Link>
        )}
      </div>

      {/* Primary Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded border border-slate-300 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Total Applications</div>
          <div className="text-2xl font-bold font-serif text-gov-navy mt-1">
            {loading ? '...' : stats?.totalApplications}
          </div>
          <Link to="/admin/applications" className="text-[11px] text-gov-blue font-semibold hover:underline mt-2 block">
            Manage All →
          </Link>
        </div>

        <div className="bg-white p-4 rounded border border-slate-300 shadow-xs">
          <div className="text-[11px] font-bold text-blue-700 uppercase">Pending Allocation</div>
          <div className="text-2xl font-bold font-serif text-blue-700 mt-1">
            {loading ? '...' : stats?.pendingAllocation}
          </div>
          <Link to="/admin/applications" className="text-[11px] text-blue-700 font-semibold hover:underline mt-2 block">
            Allocate to LMO/GATC →
          </Link>
        </div>

        <div className="bg-white p-4 rounded border border-slate-300 shadow-xs">
          <div className="text-[11px] font-bold text-purple-700 uppercase">Scheduled Inspections</div>
          <div className="text-2xl font-bold font-serif text-purple-700 mt-1">
            {loading ? '...' : stats?.scheduled}
          </div>
          <span className="text-[10px] text-slate-400 block mt-2">Field appointments set</span>
        </div>

        <div className="bg-white p-4 rounded border border-slate-300 shadow-xs">
          <div className="text-[11px] font-bold text-emerald-700 uppercase">Valid Certificates</div>
          <div className="text-2xl font-bold font-serif text-emerald-700 mt-1">
            {loading ? '...' : stats?.validCertificates}
          </div>
          <Link to="/admin/certificates" className="text-[11px] text-emerald-700 font-semibold hover:underline mt-2 block">
            Certificates Directory →
          </Link>
        </div>

        <div className="bg-white p-4 rounded border border-slate-300 shadow-xs">
          <div className="text-[11px] font-bold text-red-700 uppercase">Revoked / Expired</div>
          <div className="text-2xl font-bold font-serif text-red-700 mt-1">
            {loading ? '...' : (stats?.expiredCertificates || 0) + (stats?.revokedCertificates || 0)}
          </div>
          <span className="text-[10px] text-red-600 block mt-2">
            Revoked: {stats?.revokedCertificates} • Expired: {stats?.expiredCertificates}
          </span>
        </div>
      </div>

      {/* Administrative Operations Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Module 1: Stakeholder Approval */}
        <div className="bg-white p-5 rounded border border-slate-300 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gov-navy font-bold text-sm">
              <Users size={18} className="text-gov-ashoka" />
              <span>Stakeholder Verification & Approvals</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Verify trade licenses, GSTIN registrations, and business premises for new instrument owners before approving their portal access.
            </p>
          </div>
          <Link
            to="/admin/stakeholders"
            className="bg-gov-navy hover:bg-gov-blue text-white px-3.5 py-2 rounded text-xs font-semibold text-center block transition"
          >
            Review Stakeholders ({stats?.pendingStakeholders || 0} Pending)
          </Link>
        </div>

        {/* Module 2: Allocation & Scheduling */}
        <div className="bg-white p-5 rounded border border-slate-300 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gov-navy font-bold text-sm">
              <Scale size={18} className="text-gov-ashoka" />
              <span>Allocation & Verification Scheduling</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Allocate incoming verification applications between Legal Metrology Officers (LMO) and Government Approved Test Centres (GATC) based on accredited scopes.
            </p>
          </div>
          <Link
            to="/admin/applications"
            className="bg-gov-navy hover:bg-gov-blue text-white px-3.5 py-2 rounded text-xs font-semibold text-center block transition"
          >
            Open Allocation Console
          </Link>
        </div>

        {/* Module 3: Certificate Oversight & Revocation */}
        <div className="bg-white p-5 rounded border border-slate-300 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gov-navy font-bold text-sm">
              <Award size={18} className="text-gov-ashoka" />
              <span>Certificate Registry & Revocation</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Monitor active certificates, track validity dates, and execute statutory revocations for tampered or non-compliant instruments.
            </p>
          </div>
          <Link
            to="/admin/certificates"
            className="bg-gov-navy hover:bg-gov-blue text-white px-3.5 py-2 rounded text-xs font-semibold text-center block transition"
          >
            Manage Certificates & Revocations
          </Link>
        </div>
      </div>

      {/* Audit Log Quick Access */}
      <div className="bg-slate-100 p-4 rounded border border-slate-300 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center space-x-3">
          <FileText size={20} className="text-slate-700" />
          <div className="text-xs">
            <div className="font-bold text-slate-800">Tamper-Proof Department Audit Trail</div>
            <div className="text-slate-500">
              Every registration, assignment, field submission, and revocation is recorded with user identity and timestamp.
            </div>
          </div>
        </div>
        <Link
          to="/admin/audit-logs"
          className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 px-4 py-1.5 rounded text-xs font-semibold transition"
        >
          View Department Audit Logs →
        </Link>
      </div>
    </div>
  );
};
