import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  Scale,
  FileCheck2,
  Award,
  AlertTriangle,
  Clock,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';

export const OwnerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [instruments, setInstruments] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [instRes, appRes] = await Promise.all([
          api.getInstruments(),
          api.getApplications()
        ]);

        const instList = instRes.instruments || [];
        const appList = appRes.applications || [];

        setInstruments(instList);
        setApplications(appList);

        // Compute stats
        const validCerts = instList.filter(i => i.current_status === 'VALID').length;
        const expiringSoon = instList.filter(i => i.current_status === 'EXPIRING_SOON').length;
        const expired = instList.filter(i => i.current_status === 'EXPIRED').length;
        const pendingApps = appList.filter(a => ['SUBMITTED', 'ASSIGNED', 'SCHEDULED', 'UNDER_VERIFICATION'].includes(a.status)).length;

        setStats({
          totalInstruments: instList.length,
          pendingApplications: pendingApps,
          validCertificates: validCerts,
          expiringSoon,
          expiredCertificates: expired
        });
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const businessName = user?.business_name || user?.stakeholder?.business_name || user?.full_name || 'Enterprise User';

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="text-xs text-slate-500 font-semibold tracking-wide uppercase">Commercial Establishment Portal</div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-gov-navy mt-0.5">
            Welcome, {businessName}
          </h1>
          <div className="text-xs text-slate-600 flex items-center space-x-2 mt-1.5">
            <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-semibold text-[10px]">
              <ShieldCheck size={12} className="text-emerald-700" />
              <span>APPROVED STAKEHOLDER</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">Legal Metrology Act 2009 Compliance Status: Active</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/owner/instruments/register"
            className="btn-tactile bg-gov-navy hover:bg-gov-blue active:bg-gov-navy-light text-white px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition shadow-sm"
          >
            <PlusCircle size={15} />
            <span>Register Instrument</span>
          </Link>

          <Link
            to="/owner/apply"
            className="btn-tactile bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition shadow-sm"
          >
            <FileCheck2 size={15} />
            <span>Apply for Verification</span>
          </Link>
        </div>
      </div>

      {/* Expiry Warning Banners */}
      {stats?.expiringSoon > 0 && (
        <div className="bg-amber-50/90 border border-amber-200 border-l-4 border-l-amber-500 p-4 rounded-xl text-xs text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start space-x-3">
            <AlertTriangle size={18} className="text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-900">Mandatory Re-verification Required: </span>
              You have <strong>{stats.expiringSoon} instrument(s)</strong> whose statutory certificate expires within 30 days. Re-verify now to avoid penalties under Section 24.
            </div>
          </div>
          <Link
            to="/owner/apply"
            className="btn-tactile bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-1.5 rounded-md font-semibold text-xs whitespace-nowrap shadow-xs ml-auto sm:ml-0"
          >
            Apply Now →
          </Link>
        </div>
      )}

      {/* 5 Core Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Instruments */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Instruments</span>
              <Scale size={15} className="text-slate-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-gov-navy mt-2">
              {loading ? '...' : stats?.totalInstruments || 0}
            </div>
          </div>
          <Link to="/owner/instruments" className="text-xs text-gov-blue hover:text-gov-navy font-semibold flex items-center space-x-1 mt-3 group">
            <span>View All</span>
            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Pending Applications */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pending Apps</span>
              <Clock size={15} className="text-blue-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-blue-700 mt-2">
              {loading ? '...' : stats?.pendingApplications || 0}
            </div>
          </div>
          <Link to="/owner/applications" className="text-xs text-blue-700 hover:text-blue-900 font-semibold flex items-center space-x-1 mt-3 group">
            <span>Track Status</span>
            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Valid Certificates */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Valid Certs</span>
              <Award size={15} className="text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-emerald-700 mt-2">
              {loading ? '...' : stats?.validCertificates || 0}
            </div>
          </div>
          <Link to="/owner/certificates" className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold flex items-center space-x-1 mt-3 group">
            <span>View QR Codes</span>
            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Expiring Soon */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-amber-200/90 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Expiring Soon</span>
              <AlertTriangle size={15} className="text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-amber-600 mt-2">
              {loading ? '...' : stats?.expiringSoon || 0}
            </div>
          </div>
          <span className="text-[10px] text-amber-700 font-medium block mt-3">30-day window</span>
        </div>

        {/* Expired Instruments */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-red-200/90 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-red-800 uppercase tracking-wider">Expired</span>
              <AlertTriangle size={15} className="text-red-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-red-700 mt-2">
              {loading ? '...' : stats?.expiredCertificates || 0}
            </div>
          </div>
          <span className="text-[10px] text-red-600 font-semibold block mt-3">Use prohibited</span>
        </div>
      </div>

      {/* Recent Applications & Registered Instruments Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-card overflow-hidden">
          <div className="bg-slate-50/80 border-b border-slate-200 px-5 py-3.5 flex justify-between items-center">
            <h3 className="font-bold text-xs uppercase text-gov-navy tracking-wider flex items-center space-x-1.5">
              <FileCheck2 size={14} className="text-slate-500" />
              <span>Recent Verification Applications</span>
            </h3>
            <Link to="/owner/applications" className="text-xs text-gov-blue hover:text-gov-navy font-semibold flex items-center space-x-1 group">
              <span>View All</span>
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {applications.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No applications submitted yet.</div>
            ) : (
              applications.slice(0, 4).map(app => (
                <div key={app.id} className="p-4 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-3">
                  <div>
                    <div className="font-mono font-bold text-gov-navy text-xs">{app.id}</div>
                    <div className="text-slate-600 text-[11px] mt-0.5">
                      {app.instrument?.instrument_type} (SN: <span className="font-mono">{app.instrument?.serial_number}</span>)
                    </div>
                    {app.schedule && (
                      <div className="text-[10px] text-emerald-800 font-medium mt-1 flex items-center space-x-1">
                        <Calendar size={11} className="text-emerald-600" />
                        <span>Scheduled: <strong>{app.schedule.scheduled_date}</strong> at {app.schedule.scheduled_time}</span>
                      </div>
                    )}
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Registered Instruments */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-card overflow-hidden">
          <div className="bg-slate-50/80 border-b border-slate-200 px-5 py-3.5 flex justify-between items-center">
            <h3 className="font-bold text-xs uppercase text-gov-navy tracking-wider flex items-center space-x-1.5">
              <Scale size={14} className="text-slate-500" />
              <span>My Instruments Inventory</span>
            </h3>
            <Link to="/owner/instruments" className="text-xs text-gov-blue hover:text-gov-navy font-semibold flex items-center space-x-1 group">
              <span>Manage</span>
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {instruments.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No instruments registered yet.</div>
            ) : (
              instruments.slice(0, 4).map(inst => (
                <div key={inst.id} className="p-4 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{inst.instrument_type}</div>
                    <div className="text-slate-500 font-mono text-[11px] mt-0.5">
                      {inst.manufacturer} • Model: {inst.model_number} • SN: {inst.serial_number}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Cap: <span className="font-mono tabular-nums">{inst.max_capacity} {inst.unit}</span> • Loc: {inst.location}
                    </div>
                  </div>
                  <div className="text-right space-y-1 flex-shrink-0">
                    <StatusBadge status={inst.current_status} />
                    {inst.certificate && (
                      <div className="text-[10px] text-slate-500 font-mono">
                        Valid: {inst.certificate.valid_until}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
