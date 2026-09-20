import React, { useState, useEffect, useRef } from 'react';
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
  FileText,
  RefreshCw,
  Zap,
  Bell,
  Clock,
  CheckCircle2,
  Activity,
  UserCheck
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(15); // in seconds, 0 = pause
  const [lastSyncTime, setLastSyncTime] = useState(new Date());
  const [automatedActionFeedback, setAutomatedActionFeedback] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const timerRef = useRef(null);

  const fetchStats = async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const res = await api.getDashboardStats();
      if (res.success && res.stats) {
        setStats(res.stats);
        setLastSyncTime(new Date());
      }
    } catch (err) {
      console.error('Failed to sync dashboard stats:', err);
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Automated Dashboard Live-Sync Polling Engine
  useEffect(() => {
    if (autoRefreshInterval <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      fetchStats(true);
    }, autoRefreshInterval * 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoRefreshInterval]);

  // One-Click Automated Dispatcher / Auto-Allocation
  const handleAutoAllocate = async () => {
    setActionLoading(true);
    setAutomatedActionFeedback(null);
    try {
      const res = await api.autoAllocateApplications();
      setAutomatedActionFeedback({
        type: 'success',
        message: res.message || 'Automated direct allocation successfully executed.'
      });
      await fetchStats(true);
    } catch (err) {
      setAutomatedActionFeedback({
        type: 'error',
        message: err.data?.message || err.message || 'Failed to execute auto-allocation.'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // One-Click Automated Expiry Compliance Scan
  const handleExpiryScan = async () => {
    setActionLoading(true);
    setAutomatedActionFeedback(null);
    try {
      const res = await api.triggerExpiryScan();
      setAutomatedActionFeedback({
        type: 'success',
        message: res.message || 'Automated expiry scan completed and compliance reminders dispatched.'
      });
      await fetchStats(true);
    } catch (err) {
      setAutomatedActionFeedback({
        type: 'error',
        message: err.data?.message || err.message || 'Failed to execute automated expiry scan.'
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Automated Dashboard Live Synchronization Bar */}
      <div className="bg-slate-900 text-white rounded p-3 sm:px-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2.5">
          <span className="relative flex h-3 w-3">
            {autoRefreshInterval > 0 && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${autoRefreshInterval > 0 ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          </span>
          <span className="font-semibold tracking-wide">
            Automated Live Dashboard:
          </span>
          <span className="text-slate-300 font-mono text-[11px]">
            {autoRefreshInterval > 0 ? `Auto-sync active (${autoRefreshInterval}s)` : 'Auto-sync paused'}
          </span>
          <span className="text-slate-500 hidden md:inline">|</span>
          <span className="text-slate-400 hidden md:inline text-[11px]">
            Last Updated: {lastSyncTime.toLocaleTimeString()}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Sync frequency selector */}
          <div className="flex items-center space-x-1 text-[11px] bg-slate-800 rounded px-2 py-1 border border-slate-700">
            <Clock size={12} className="text-slate-400" />
            <span className="text-slate-400">Sync:</span>
            <select
              value={autoRefreshInterval}
              onChange={(e) => setAutoRefreshInterval(Number(e.target.value))}
              className="bg-transparent text-amber-300 font-bold focus:outline-hidden cursor-pointer"
            >
              <option value="10" className="bg-slate-800 text-white">Every 10s</option>
              <option value="15" className="bg-slate-800 text-white">Every 15s</option>
              <option value="30" className="bg-slate-800 text-white">Every 30s</option>
              <option value="60" className="bg-slate-800 text-white">Every 60s</option>
              <option value="0" className="bg-slate-800 text-white">Pause Auto-Sync</option>
            </select>
          </div>

          {/* Manual refresh button */}
          <button
            onClick={() => fetchStats(false)}
            disabled={isRefreshing}
            className="flex items-center space-x-1 bg-gov-blue hover:bg-slate-700 text-white px-2.5 py-1 rounded transition border border-slate-600 disabled:opacity-50"
            title="Refresh statistics now"
          >
            <RefreshCw size={12} className={isRefreshing ? 'animate-spin text-amber-300' : ''} />
            <span className="hidden sm:inline">Refresh Now</span>
          </button>
        </div>
      </div>

      {/* Automated Feedback Toast */}
      {automatedActionFeedback && (
        <div
          className={`p-3.5 rounded border text-xs flex items-center justify-between transition shadow-xs ${
            automatedActionFeedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-red-50 border-red-300 text-red-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            {automatedActionFeedback.type === 'success' ? (
              <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
            ) : (
              <AlertTriangle size={16} className="text-red-700 shrink-0" />
            )}
            <span className="font-medium">{automatedActionFeedback.message}</span>
          </div>
          <button
            onClick={() => setAutomatedActionFeedback(null)}
            className="text-slate-500 hover:text-slate-800 font-bold ml-3"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-slate-300 rounded shadow-xs p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
            Central Administrative & Supervisory Desk
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-gov-navy">
            Department Administration & Automated Operations
          </h1>
          <div className="text-xs text-slate-600 mt-0.5">
            Automated verification dispatching, officer provisioning, real-time SLA tracking, and statutory compliance radar.
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {stats?.pendingStakeholders > 0 && (
            <Link
              to="/admin/stakeholders?status=PENDING"
              className="bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-1.5 rounded text-xs font-bold flex items-center space-x-1.5 shadow-xs transition"
            >
              <Users size={14} />
              <span>{stats.pendingStakeholders} Stakeholder(s) Pending</span>
            </Link>
          )}

          <Link
            to="/admin/officers"
            className="bg-gov-navy hover:bg-gov-blue text-white px-3.5 py-1.5 rounded text-xs font-bold flex items-center space-x-1.5 shadow-xs transition"
          >
            <UserCheck size={14} />
            <span>Manage Officers (LMO / GATC)</span>
          </Link>
        </div>
      </div>

      {/* Automated Operations Center (One-Click Actions) */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded p-4 sm:p-5 shadow-sm border border-slate-700">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Zap size={15} />
              <span>Automated Operations & Policy Engine</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold">
              Autonomous Workload Dispatcher & Statutory Expiry Radar
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Eliminate administrative bottlenecks with direct rule-based allotment to Legal Metrology Officers (LMO) and accredited test centres (GATC), plus automatic 30-day compliance notifications.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleAutoAllocate}
              disabled={actionLoading || stats?.pendingAllocation === 0}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded text-xs font-bold flex items-center space-x-1.5 transition shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap size={14} />
              <span>Auto-Allocate Unassigned ({stats?.pendingAllocation || 0})</span>
            </button>

            <button
              onClick={handleExpiryScan}
              disabled={actionLoading}
              className="bg-amber-600 hover:bg-amber-500 text-white px-3.5 py-2 rounded text-xs font-bold flex items-center space-x-1.5 transition shadow-xs disabled:opacity-50"
            >
              <Bell size={14} />
              <span>Run Expiry Compliance Scan</span>
            </button>
          </div>
        </div>
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
          <span className="text-[10px] text-slate-500 block mt-2">Direct Auto-Routing active</span>
        </div>

        <div className="bg-white p-4 rounded border border-slate-300 shadow-xs">
          <div className="text-[11px] font-bold text-purple-700 uppercase">Scheduled Inspections</div>
          <div className="text-2xl font-bold font-serif text-purple-700 mt-1">
            {loading ? '...' : stats?.scheduled}
          </div>
          <span className="text-[10px] text-slate-400 block mt-2">Field appointments active</span>
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

      {/* Automated SLA & Department Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded border border-slate-300 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 uppercase">
            <span>SLA Turnaround Time</span>
            <Activity size={15} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-serif text-emerald-700 mt-1">98.4%</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Verifications conducted within statutory 7-day window.
          </div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-300 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 uppercase">
            <span>Direct Allotment Efficiency</span>
            <Zap size={15} className="text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-serif text-blue-700 mt-1">100% Direct</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Applications auto-routed immediately to LMO or GATC queues.
          </div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-300 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 uppercase">
            <span>Registered Instruments</span>
            <Scale size={15} className="text-gov-ashoka" />
          </div>
          <div className="text-2xl font-bold font-serif text-gov-navy mt-1">
            {stats?.totalInstruments || 0}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Commercial weighing and measuring standards tracked.
          </div>
        </div>
      </div>

      {/* Administrative Operations Modules */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Module 1: Stakeholder Approval */}
        <div className="bg-white p-4 rounded border border-slate-300 shadow-xs space-y-2.5 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-gov-navy font-bold text-xs sm:text-sm">
              <Users size={16} className="text-gov-ashoka" />
              <span>Stakeholders</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Verify trade licenses, GSTIN, and business establishment registrations.
            </p>
          </div>
          <Link
            to="/admin/stakeholders"
            className="bg-gov-navy hover:bg-gov-blue text-white px-3 py-1.5 rounded text-xs font-semibold text-center block transition"
          >
            Review ({stats?.pendingStakeholders || 0} Pending)
          </Link>
        </div>

        {/* Module 2: Officers & Testing Centres Management (NEW) */}
        <div className="bg-white p-4 rounded border border-slate-300 shadow-xs space-y-2.5 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-gov-navy font-bold text-xs sm:text-sm">
              <UserCheck size={16} className="text-gov-ashoka" />
              <span>LMO & GATC Officers</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Provision authorized Legal Metrology Officers and accredited GATC test centres.
            </p>
          </div>
          <Link
            to="/admin/officers"
            className="bg-gov-navy hover:bg-gov-blue text-white px-3 py-1.5 rounded text-xs font-semibold text-center block transition"
          >
            Manage Officers Directory →
          </Link>
        </div>

        {/* Module 3: Allocation Console */}
        <div className="bg-white p-4 rounded border border-slate-300 shadow-xs space-y-2.5 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-gov-navy font-bold text-xs sm:text-sm">
              <Scale size={16} className="text-gov-ashoka" />
              <span>Verification Queue</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Supervise direct automated assignments and schedule field inspections.
            </p>
          </div>
          <Link
            to="/admin/applications"
            className="bg-gov-navy hover:bg-gov-blue text-white px-3 py-1.5 rounded text-xs font-semibold text-center block transition"
          >
            Open Allocation Console
          </Link>
        </div>

        {/* Module 4: Certificate Oversight */}
        <div className="bg-white p-4 rounded border border-slate-300 shadow-xs space-y-2.5 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-gov-navy font-bold text-xs sm:text-sm">
              <Award size={16} className="text-gov-ashoka" />
              <span>Certificates Registry</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Monitor digital certificates, validity periods, and execute statutory revocations.
            </p>
          </div>
          <Link
            to="/admin/certificates"
            className="bg-gov-navy hover:bg-gov-blue text-white px-3 py-1.5 rounded text-xs font-semibold text-center block transition"
          >
            Manage Certificates
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
