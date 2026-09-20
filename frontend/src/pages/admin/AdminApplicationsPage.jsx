import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../services/api';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import {
  FileCheck2,
  Calendar,
  Scale,
  Award,
  Clock,
  UserCheck,
  AlertCircle,
  Eye,
  RefreshCw,
  Radio
} from 'lucide-react';

export const AdminApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [officers, setOfficers] = useState({ lmos: [], gatcs: [] });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Modals
  const [allocatingApp, setAllocatingApp] = useState(null);
  const [verifierType, setVerifierType] = useState('LMO');
  const [verifierId, setVerifierId] = useState('');
  const [allocationNotes, setAllocationNotes] = useState('');

  const [schedulingApp, setSchedulingApp] = useState(null);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('10:30 AM');
  const [scheduleLocation, setScheduleLocation] = useState('');

  const [inspectingApp, setInspectingApp] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setIsRefreshing(true);

      const [appsRes, officersRes] = await Promise.all([
        api.getApplications(),
        api.getOfficers()
      ]);
      if (appsRes.success) setApplications(appsRes.applications);
      if (officersRes.success) setOfficers({ lmos: officersRes.lmos, gatcs: officersRes.gatcs });
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Sync default verifierId when verifierType changes in the allocation modal
  React.useEffect(() => {
    if (verifierType === 'LMO') {
      setVerifierId(officers.lmos[0]?.user_id || '');
    } else {
      setVerifierId(officers.gatcs[0]?.user_id || '');
    }
  }, [verifierType, officers]);

  useEffect(() => {
    loadData();
    // Real-time auto polling every 15 seconds
    const interval = setInterval(() => {
      if (!document.hidden) loadData(true);
    }, 15000);
    return () => clearInterval(interval);
  }, [loadData]);

  const openAllocationModal = (app) => {
    setAllocatingApp(app);
    setVerifierType('LMO'); // useEffect will sync verifierId automatically
    setAllocationNotes('Allocated for statutory on-site physical verification.');
    setError(null);
  };

  const handleConfirmAllocation = async () => {
    if (!allocatingApp || !verifierId) return;
    setProcessing(true);
    setError(null);

    try {
      const res = await api.assignApplication(allocatingApp.id, {
        verifier_type: verifierType,
        verifier_id: verifierId,
        notes: allocationNotes
      });

      if (res.success) {
        setAllocatingApp(null);
        loadData();
      }
    } catch (err) {
      setError(err.data?.message || err.message || 'Allocation failed.');
    } finally {
      setProcessing(false);
    }
  };

  const openScheduleModal = (app) => {
    setSchedulingApp(app);
    setScheduledDate(app.preferred_date || new Date().toISOString().split('T')[0]);
    setScheduledTime(app.preferred_time || '10:30 AM');
    setScheduleLocation(app.instrument?.location || 'Registered Commercial Premises');
    setError(null);
  };

  const handleConfirmSchedule = async () => {
    if (!schedulingApp || !scheduledDate) return;
    setProcessing(true);
    setError(null);

    try {
      const res = await api.scheduleVerification(schedulingApp.id, {
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
        location: scheduleLocation,
        notes: 'Statutory physical inspection schedule confirmed by Department Administration.'
      });

      if (res.success) {
        setSchedulingApp(null);
        loadData();
      }
    } catch (err) {
      setError(err.data?.message || err.message || 'Scheduling failed.');
    } finally {
      setProcessing(false);
    }
  };

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
      header: 'Applicant & Business',
      render: (row) => (
        <div>
          <div className="font-bold text-slate-800 text-xs">{row.owner?.business_name || row.owner?.full_name}</div>
          <div className="text-[11px] text-slate-500">{row.owner?.phone}</div>
        </div>
      )
    },
    {
      header: 'Instrument Details',
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-800">{row.instrument?.instrument_type}</div>
          <div className="text-[10px] text-slate-500 font-mono">
            SN: {row.instrument?.serial_number} • Cap: {row.instrument?.max_capacity} {row.instrument?.unit}
          </div>
        </div>
      )
    },
    {
      header: 'Category',
      render: (row) => (
        <span className="font-mono font-bold text-xs bg-slate-100 text-gov-navy px-1.5 py-0.5 rounded border border-slate-200">
          {row.instrument?.category?.code || 'EWS'}
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
              <span className="text-[10px] block text-slate-500">[{row.verifier.type}]</span>
            </div>
          ) : (
            <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[10px] font-bold">
              Unassigned
            </span>
          )}
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
            <div className="text-xs text-slate-400 italic">Not scheduled</div>
          )}
        </div>
      )
    },
    {
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Administrative Actions',
      render: (row) => (
        <div className="flex items-center space-x-1.5">
          {/* Allocate Button */}
          {['SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED'].includes(row.status) && (
            <button
              onClick={() => openAllocationModal(row)}
              className="bg-gov-navy hover:bg-gov-blue text-white px-2 py-1 rounded text-xs font-semibold flex items-center space-x-1"
              title="Allocate to LMO or GATC"
            >
              <UserCheck size={12} />
              <span>{row.assignment ? 'Reassign' : 'Allocate'}</span>
            </button>
          )}

          {/* Schedule Button */}
          {row.assignment && ['ASSIGNED', 'SCHEDULED'].includes(row.status) && (
            <button
              onClick={() => openScheduleModal(row)}
              className="bg-purple-800 hover:bg-purple-900 text-white px-2 py-1 rounded text-xs font-semibold flex items-center space-x-1"
              title="Schedule Field Inspection"
            >
              <Calendar size={12} />
              <span>Schedule</span>
            </button>
          )}

          <button
            onClick={() => setInspectingApp(row)}
            className="p-1 text-slate-600 hover:text-gov-navy hover:bg-slate-100 rounded"
            title="Inspect Dossier"
          >
            <Eye size={15} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-300 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-gov-navy">
            Statutory Verification Applications & Workload Allocation
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Central allocation and scheduling desk for on-site Legal Metrology Officers (LMO) and Government Approved Test Centres (GATC).
          </p>
        </div>

        <button
          onClick={() => loadData(true)}
          disabled={isRefreshing}
          className="p-1.5 text-xs text-slate-600 hover:text-gov-navy border border-slate-300 rounded hover:bg-slate-50 flex items-center space-x-1 transition disabled:opacity-50"
          title="Refresh applications list"
        >
          <RefreshCw size={13} className={isRefreshing ? 'animate-spin text-gov-navy' : ''} />
          <span>Refresh</span>
        </button>
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
        loading={loading}
        searchPlaceholder="Filter by application ID, business, serial, status..."
      />

      {/* Allocation Modal */}
      <Modal
        isOpen={Boolean(allocatingApp)}
        onClose={() => setAllocatingApp(null)}
        title={`Allocate Application: ${allocatingApp?.id}`}
      >
        {allocatingApp && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <div className="font-bold text-gov-navy">{allocatingApp.instrument?.instrument_type}</div>
              <div className="text-slate-600">Serial No: {allocatingApp.instrument?.serial_number}</div>
              <div className="text-slate-600">Category: <strong>{allocatingApp.instrument?.category?.code}</strong> ({allocatingApp.instrument?.category?.name})</div>
              <div className="text-slate-600">Applicant: {allocatingApp.owner?.business_name || allocatingApp.owner?.full_name}</div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-300 text-red-800 rounded">
                {error}
              </div>
            )}

            {/* Verifier Channel Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Select Verifier Authorization Channel *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`p-3 rounded border cursor-pointer flex items-center space-x-2 transition ${
                    verifierType === 'LMO' ? 'bg-blue-50 border-gov-navy' : 'border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="vType"
                    value="LMO"
                    checked={verifierType === 'LMO'}
                    onChange={() => setVerifierType('LMO')}
                  />
                  <div>
                    <div className="font-bold text-gov-navy">Legal Metrology Officer (LMO)</div>
                    <div className="text-[10px] text-slate-500">Government Gazetted Field Inspector</div>
                  </div>
                </label>

                <label
                  className={`p-3 rounded border cursor-pointer flex items-center space-x-2 transition ${
                    verifierType === 'GATC' ? 'bg-purple-50 border-purple-800' : 'border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="vType"
                    value="GATC"
                    checked={verifierType === 'GATC'}
                    onChange={() => setVerifierType('GATC')}
                  />
                  <div>
                    <div className="font-bold text-purple-900">GATC Test Centre</div>
                    <div className="text-[10px] text-slate-500">Accredited Testing Laboratory</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Verifier Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Select Authorized Verifier *
              </label>
              <select
                value={verifierId}
                onChange={(e) => setVerifierId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy bg-white"
                required
              >
                {verifierType === 'LMO' ? (
                  officers.lmos.map((l) => (
                    <option key={l.user_id} value={l.user_id}>
                      {l.user?.full_name || 'Inspector'} ({l.officer_code}) — Jurisdiction: {l.jurisdiction_zone}
                    </option>
                  ))
                ) : (
                  officers.gatcs.map((g) => (
                    <option key={g.user_id} value={g.user_id}>
                      {g.centre_name} (Auth: {g.authorization_no}) — Scope: [{g.authorized_scope.join(', ')}]
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Allocation Instructions / Notes
              </label>
              <textarea
                rows={2}
                value={allocationNotes}
                onChange={(e) => setAllocationNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setAllocatingApp(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={processing}
                onClick={handleConfirmAllocation}
                className="px-4 py-2 bg-gov-navy hover:bg-gov-blue text-white rounded text-xs font-bold shadow-xs disabled:opacity-50"
              >
                {processing ? 'Allocating...' : 'Confirm Allocation'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Scheduling Modal */}
      <Modal
        isOpen={Boolean(schedulingApp)}
        onClose={() => setSchedulingApp(null)}
        title={`Schedule Inspection: ${schedulingApp?.id}`}
      >
        {schedulingApp && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
              <div>Instrument: <strong>{schedulingApp.instrument?.instrument_type}</strong></div>
              <div>Assigned Verifier: <strong className="text-gov-navy">{schedulingApp.verifier?.name}</strong> [{schedulingApp.verifier?.type}]</div>
              <div>Applicant Preferred Date: {schedulingApp.preferred_date} ({schedulingApp.preferred_time})</div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-300 text-red-800 rounded">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Inspection Date *</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Time Slot *</label>
                <select
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white"
                >
                  <option value="10:30 AM">10:30 AM (Morning Slot)</option>
                  <option value="02:00 PM">02:00 PM (Afternoon Slot)</option>
                  <option value="04:00 PM">04:00 PM (Late Slot)</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Inspection Location / Venue *</label>
                <input
                  type="text"
                  value={scheduleLocation}
                  onChange={(e) => setScheduleLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setSchedulingApp(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={processing}
                onClick={handleConfirmSchedule}
                className="px-4 py-2 bg-purple-800 hover:bg-purple-900 text-white rounded text-xs font-bold shadow-xs disabled:opacity-50"
              >
                {processing ? 'Scheduling...' : 'Save & Confirm Schedule'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Detail Dossier Modal */}
      <Modal
        isOpen={Boolean(inspectingApp)}
        onClose={() => setInspectingApp(null)}
        title={`Statutory Application Dossier: ${inspectingApp?.id}`}
      >
        {inspectingApp && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded border">
              <div>Status: <StatusBadge status={inspectingApp.status} /></div>
              <div>Type: <strong>{inspectingApp.application_type}</strong></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded border space-y-1">
                <div className="font-bold text-gov-navy border-b pb-0.5">Instrument</div>
                <div>{inspectingApp.instrument?.instrument_type}</div>
                <div>Serial: <span className="font-mono font-bold">{inspectingApp.instrument?.serial_number}</span></div>
                <div>Capacity: {inspectingApp.instrument?.max_capacity} {inspectingApp.instrument?.unit}</div>
              </div>

              <div className="bg-slate-50 p-3 rounded border space-y-1">
                <div className="font-bold text-gov-navy border-b pb-0.5">Applicant</div>
                <div>{inspectingApp.owner?.business_name || inspectingApp.owner?.full_name}</div>
                <div>Phone: {inspectingApp.owner?.phone}</div>
                <div>Location: {inspectingApp.instrument?.location}</div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
