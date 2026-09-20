import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { FileCheck2, Calendar, PlusCircle, UserCheck, Eye, RefreshCw, Radio } from 'lucide-react';

export const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);

  const loadData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setIsRefreshing(true);
    try {
      const res = await api.getApplications();
      if (res.success && res.applications) {
        setApplications(res.applications);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    // Real-time polling every 15 seconds
    const interval = setInterval(() => {
      if (!document.hidden) loadData(true);
    }, 15000);
    return () => clearInterval(interval);
  }, [loadData]);

  const columns = [
    {
      header: 'Application ID',
      render: (row) => (
        <div>
          <span className="font-mono font-bold text-gov-navy text-xs">{row.id}</span>
          <div className="text-[10px] text-slate-400">
            {new Date(row.created_at).toLocaleDateString()}
          </div>
        </div>
      )
    },
    {
      header: 'Instrument Details',
      render: (row) => (
        <div>
          <div className="font-bold text-slate-800">{row.instrument?.instrument_type}</div>
          <div className="text-[11px] text-slate-500 font-mono">
            SN: {row.instrument?.serial_number} • Model: {row.instrument?.model_number}
          </div>
        </div>
      )
    },
    {
      header: 'Application Type',
      render: (row) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 border text-slate-700">
          {row.application_type === 'NEW' ? 'Initial Verification' : 'Periodic Re-Verification'}
        </span>
      )
    },
    {
      header: 'Assigned Verifier',
      render: (row) => (
        <div>
          {row.verifier ? (
            <div>
              <span className="font-bold text-xs text-gov-navy">{row.verifier.name}</span>
              <span className="text-[10px] block text-slate-500 font-mono">[{row.verifier.type}]</span>
            </div>
          ) : (
            <span className="text-slate-400 text-xs italic">Awaiting allocation</span>
          )}
        </div>
      )
    },
    {
      header: 'Scheduled Inspection',
      render: (row) => (
        <div>
          {row.schedule ? (
            <div className="text-xs text-emerald-900 font-medium">
              <div>{row.schedule.scheduled_date}</div>
              <div className="text-[10px] text-slate-500">{row.schedule.scheduled_time}</div>
            </div>
          ) : (
            <div className="text-xs text-slate-500">Pref: {row.preferred_date}</div>
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
        <button
          onClick={() => setSelectedApp(row)}
          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs flex items-center space-x-1"
          title="View Application Details"
        >
          <Eye size={14} />
          <span>Details</span>
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-300 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-gov-navy">
            Verification Applications Tracker
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Real-time status tracking for initial stamping and annual re-verification applications.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => loadData(true)}
            disabled={isRefreshing}
            className="p-1.5 text-xs text-slate-600 hover:text-gov-navy border border-slate-300 rounded hover:bg-slate-50 flex items-center space-x-1 transition disabled:opacity-50"
            title="Refresh applications list"
          >
            <RefreshCw size={13} className={isRefreshing ? 'animate-spin text-gov-navy' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            to="/owner/apply"
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition"
          >
            <PlusCircle size={15} />
            <span>New Application</span>
          </Link>
        </div>
      </div>

      {/* Live Sync Status Bar */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 px-3 py-1.5 rounded border border-slate-200">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-slate-700">Live Auto-Sync Active</span>
          <span className="text-slate-400">•</span>
          <span>Updates every 15s</span>
        </div>
        <div>
          {lastUpdated && (
            <span>Last synced: {lastUpdated.toLocaleTimeString()}</span>
          )}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={applications}
        searchPlaceholder="Search by application ID, serial, status..."
      />

      {/* Detail Modal */}
      <Modal
        isOpen={Boolean(selectedApp)}
        onClose={() => setSelectedApp(null)}
        title={`Application Dossier: ${selectedApp?.id}`}
      >
        {selectedApp && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded border border-slate-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Current Status</span>
                <StatusBadge status={selectedApp.status} className="mt-1" />
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Application Type</span>
                <span className="font-bold text-slate-800">{selectedApp.application_type}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 bg-slate-50 p-3 rounded border border-slate-200">
                <span className="font-bold text-gov-navy uppercase tracking-wider text-[10px] block border-b pb-1">
                  Instrument Details
                </span>
                <div>Type: <strong>{selectedApp.instrument?.instrument_type}</strong></div>
                <div>Manufacturer: {selectedApp.instrument?.manufacturer}</div>
                <div>Model: {selectedApp.instrument?.model_number}</div>
                <div>Serial No: <strong className="font-mono text-gov-navy">{selectedApp.instrument?.serial_number}</strong></div>
                <div>Capacity: {selectedApp.instrument?.max_capacity} {selectedApp.instrument?.unit}</div>
              </div>

              <div className="space-y-1 bg-slate-50 p-3 rounded border border-slate-200">
                <span className="font-bold text-gov-navy uppercase tracking-wider text-[10px] block border-b pb-1">
                  Verification & Allocation
                </span>
                <div>
                  Assigned Verifier:{' '}
                  <strong>{selectedApp.verifier?.name || 'Pending Allocation by Admin'}</strong>
                </div>
                <div>Verifier Type: {selectedApp.verifier?.type || 'N/A'}</div>
                <div>
                  Scheduled Date:{' '}
                  <strong>
                    {selectedApp.schedule
                      ? `${selectedApp.schedule.scheduled_date} (${selectedApp.schedule.scheduled_time})`
                      : 'Not scheduled yet'}
                  </strong>
                </div>
                <div>Inspection Location: {selectedApp.schedule?.location || selectedApp.instrument?.location}</div>
              </div>
            </div>

            {selectedApp.remarks && (
              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <span className="font-bold text-slate-600 block text-[10px] uppercase">Applicant Remarks</span>
                <p className="mt-1 text-slate-700">{selectedApp.remarks}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
