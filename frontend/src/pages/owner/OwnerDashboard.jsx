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
      <div className="bg-white border border-slate-300 rounded shadow-xs p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="text-xs text-slate-500 font-medium">Business Owner Portal</div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-gov-navy">
            Welcome, {businessName}
          </h1>
          <div className="text-xs text-slate-600 flex items-center space-x-2 mt-1">
            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold text-[10px]">
              APPROVED STAKEHOLDER
            </span>
            <span>•</span>
            <span>Establishment Registration Active</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/owner/instruments/register"
            className="bg-gov-navy hover:bg-gov-blue text-white px-3.5 py-2 rounded text-xs font-semibold flex items-center space-x-1.5 transition shadow-xs"
          >
            <PlusCircle size={15} />
            <span>Register Instrument</span>
          </Link>

          <Link
            to="/owner/apply"
            className="bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-2 rounded text-xs font-semibold flex items-center space-x-1.5 transition shadow-xs"
          >
            <FileCheck2 size={15} />
            <span>Apply for Verification</span>
          </Link>
        </div>
      </div>

      {/* Expiry Warning Banners */}
      {stats?.expiringSoon > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded text-xs text-amber-900 flex items-start justify-between">
          <div className="flex items-start space-x-2">
            <AlertTriangle size={18} className="text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Re-verification Notice: </span>
              You have <strong>{stats.expiringSoon} instrument(s)</strong> whose verification certificate is expiring within 30 days. Please apply for re-verification to prevent statutory non-compliance.
            </div>
          </div>
          <Link to="/owner/apply" className="font-bold underline text-amber-900 ml-4 flex-shrink-0">
            Apply Now →
          </Link>
        </div>
      )}

      {/* 5 Core Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded border border-slate-300 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Total Instruments</div>
          <div className="text-2xl font-bold font-serif text-gov-navy mt-1">
            {loading ? '...' : stats?.totalInstruments || 0}
          </div>
          <Link to="/owner/instruments" className="text-[11px] text-gov-blue font-semibold hover:underline mt-2 block">
            View All →
          </Link>
        </div>

        <div className="bg-white p-4 rounded border border-slate-300 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Pending Applications</div>
          <div className="text-2xl font-bold font-serif text-blue-700 mt-1">
            {loading ? '...' : stats?.pendingApplications || 0}
          </div>
          <Link to="/owner/applications" className="text-[11px] text-blue-700 font-semibold hover:underline mt-2 block">
            Track Status →
          </Link>
        </div>

        <div className="bg-white p-4 rounded border border-slate-300 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Valid Certificates</div>
          <div className="text-2xl font-bold font-serif text-emerald-700 mt-1">
            {loading ? '...' : stats?.validCertificates || 0}
          </div>
          <Link to="/owner/certificates" className="text-[11px] text-emerald-700 font-semibold hover:underline mt-2 block">
            View QR Codes →
          </Link>
        </div>

        <div className="bg-white p-4 rounded border border-slate-300 shadow-xs">
          <div className="text-[11px] font-bold text-amber-700 uppercase">Expiring Soon</div>
          <div className="text-2xl font-bold font-serif text-amber-600 mt-1">
            {loading ? '...' : stats?.expiringSoon || 0}
          </div>
          <span className="text-[10px] text-slate-500 block mt-2">30-day re-stamp window</span>
        </div>

        <div className="bg-white p-4 rounded border border-slate-300 shadow-xs">
          <div className="text-[11px] font-bold text-red-700 uppercase">Expired Instruments</div>
          <div className="text-2xl font-bold font-serif text-red-700 mt-1">
            {loading ? '...' : stats?.expiredCertificates || 0}
          </div>
          <span className="text-[10px] text-red-600 font-medium block mt-2">Commercial use prohibited</span>
        </div>
      </div>

      {/* Recent Applications & Registered Instruments Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white rounded border border-slate-300 shadow-xs overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex justify-between items-center">
            <h3 className="font-bold text-xs uppercase text-gov-navy tracking-wider">
              Recent Verification Applications
            </h3>
            <Link to="/owner/applications" className="text-xs text-gov-blue hover:underline font-semibold">
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {applications.length === 0 ? (
              <div className="p-6 text-center text-slate-500">No applications submitted yet.</div>
            ) : (
              applications.slice(0, 4).map(app => (
                <div key={app.id} className="p-3.5 hover:bg-slate-50 flex items-center justify-between">
                  <div>
                    <div className="font-mono font-bold text-gov-navy">{app.id}</div>
                    <div className="text-slate-600 text-[11px] mt-0.5">
                      {app.instrument?.instrument_type} (SN: {app.instrument?.serial_number})
                    </div>
                    {app.schedule && (
                      <div className="text-[10px] text-emerald-800 font-medium mt-0.5 flex items-center space-x-1">
                        <Calendar size={11} />
                        <span>Scheduled: {app.schedule.scheduled_date} at {app.schedule.scheduled_time}</span>
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
        <div className="bg-white rounded border border-slate-300 shadow-xs overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex justify-between items-center">
            <h3 className="font-bold text-xs uppercase text-gov-navy tracking-wider">
              My Instruments Inventory
            </h3>
            <Link to="/owner/instruments" className="text-xs text-gov-blue hover:underline font-semibold">
              Manage Instruments
            </Link>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {instruments.length === 0 ? (
              <div className="p-6 text-center text-slate-500">No instruments registered yet.</div>
            ) : (
              instruments.slice(0, 4).map(inst => (
                <div key={inst.id} className="p-3.5 hover:bg-slate-50 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800">{inst.instrument_type}</div>
                    <div className="text-slate-500 font-mono text-[11px]">
                      {inst.manufacturer} • Model: {inst.model_number} • SN: {inst.serial_number}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Cap: {inst.max_capacity} {inst.unit} • Loc: {inst.location}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <StatusBadge status={inst.current_status} />
                    {inst.certificate && (
                      <div className="text-[10px] text-slate-500">
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
