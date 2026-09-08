import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Scale, Calendar, CheckCircle2, Clock, AlertCircle, Play } from 'lucide-react';

export const LMODashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getApplications();
        if (res.success && res.applications) {
          setApplications(res.applications);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const pendingCount = applications.filter(a => ['ASSIGNED', 'SCHEDULED', 'UNDER_VERIFICATION'].includes(a.status)).length;
  const completedCount = applications.filter(a => a.status === 'COMPLETED').length;
  const failedCount = applications.filter(a => a.status === 'FAILED').length;

  const columns = [
    {
      header: 'Application ID',
      render: (row) => (
        <span className="font-mono font-bold text-gov-navy text-xs">{row.id}</span>
      )
    },
    {
      header: 'Instrument Details',
      render: (row) => (
        <div>
          <div className="font-bold text-slate-800">{row.instrument?.instrument_type}</div>
          <div className="text-[11px] text-slate-500 font-mono">
            {row.instrument?.manufacturer} • SN: {row.instrument?.serial_number}
          </div>
          <div className="text-[10px] text-slate-400">
            Cap: {row.instrument?.max_capacity} {row.instrument?.unit}
          </div>
        </div>
      )
    },
    {
      header: 'Owner / Establishment',
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-800">{row.owner?.business_name || row.owner?.full_name}</div>
          <div className="text-[11px] text-slate-500">{row.owner?.phone}</div>
        </div>
      )
    },
    {
      header: 'Inspection Location',
      accessor: 'location',
      render: (row) => (
        <div className="text-xs text-slate-600 max-w-xs truncate">
          {row.schedule?.location || row.instrument?.location}
        </div>
      )
    },
    {
      header: 'Schedule',
      render: (row) => (
        <div>
          {row.schedule ? (
            <div className="text-xs text-emerald-900 font-medium">
              <div>{row.schedule.scheduled_date}</div>
              <div className="text-[10px] text-slate-500">{row.schedule.scheduled_time}</div>
            </div>
          ) : (
            <div className="text-xs text-slate-500 font-mono">Pref: {row.preferred_date}</div>
          )}
        </div>
      )
    },
    {
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Action',
      render: (row) => (
        <div>
          {row.status === 'COMPLETED' ? (
            <span className="text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2 py-1 rounded border border-emerald-300">
              Verified (PASS)
            </span>
          ) : row.status === 'FAILED' ? (
            <span className="text-[11px] text-red-800 font-bold bg-red-50 px-2 py-1 rounded border border-red-300">
              Rejected (FAIL)
            </span>
          ) : (
            <Link
              to={`/lmo/workspace/${row.id}`}
              className="bg-gov-navy hover:bg-gov-blue text-white px-2.5 py-1.5 rounded text-xs font-semibold flex items-center space-x-1 shadow-xs transition"
            >
              <Play size={12} />
              <span>Open Workspace</span>
            </Link>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-300 rounded shadow-xs p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
            Field Officer Portal
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-gov-navy">
            Legal Metrology Officer (LMO) Workspace
          </h1>
          <div className="text-xs text-slate-600 mt-0.5">
            Officer: <strong>{user?.full_name}</strong> • Jurisdiction:{' '}
            <span className="font-semibold text-gov-ashoka">
              {user?.lmo_profile?.jurisdiction_zone || 'Mumbai Division'}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <span className="bg-blue-100 text-blue-900 border border-blue-300 px-3 py-1 rounded font-bold text-xs">
            {pendingCount} Verifications Pending
          </span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded border border-slate-300 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Assigned Workload</div>
          <div className="text-2xl font-bold font-serif text-gov-navy mt-1">
            {applications.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Total statutory applications assigned</div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-300 shadow-xs">
          <div className="text-xs font-bold text-amber-700 uppercase">Pending Field Inspection</div>
          <div className="text-2xl font-bold font-serif text-amber-600 mt-1">
            {pendingCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Awaiting physical testing & stamping</div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-300 shadow-xs">
          <div className="text-xs font-bold text-emerald-700 uppercase">Completed Stamped</div>
          <div className="text-2xl font-bold font-serif text-emerald-700 mt-1">
            {completedCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Certificates successfully issued</div>
        </div>
      </div>

      {/* Table of Assigned Applications */}
      <DataTable
        columns={columns}
        data={applications}
        loading={loading}
        searchPlaceholder="Filter assigned applications by ID, serial, establishment..."
      />
    </div>
  );
};
