import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { FileText, ShieldCheck, Clock, ArrowRight, Code2, Eye, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const AdminAuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await api.getAuditLogs();
        if (res.success) {
          setLogs(res.logs);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  const columns = [
    {
      header: 'Timestamp',
      render: (row) => (
        <div className="font-mono text-[11px] text-slate-600 tabular-nums">
          <div className="font-medium text-slate-800">{new Date(row.created_at).toLocaleDateString()}</div>
          <div className="text-[10px] text-slate-400">{new Date(row.created_at).toLocaleTimeString()}</div>
        </div>
      )
    },
    {
      header: 'User Identity',
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-800 text-xs block">{row.user_email}</span>
          <div className="text-[10px] text-slate-500 font-mono tabular-nums">IP: {row.ip_address}</div>
        </div>
      )
    },
    {
      header: 'Action Taken',
      render: (row) => {
        let badgeClass = 'bg-slate-100 text-slate-800 ring-slate-400/20';
        if (row.action.includes('APPROVED') || row.action.includes('PASS') || row.action.includes('GENERATED')) {
          badgeClass = 'bg-emerald-50 text-emerald-800 ring-emerald-600/25';
        } else if (row.action.includes('REVOKED') || row.action.includes('REJECTED') || row.action.includes('FAILED')) {
          badgeClass = 'bg-red-50 text-red-800 ring-red-600/25';
        } else if (row.action.includes('ASSIGNED') || row.action.includes('SCHEDULED')) {
          badgeClass = 'bg-purple-50 text-purple-800 ring-purple-600/25';
        }

        return (
          <span className={`inline-block font-mono font-bold text-[10px] px-2.5 py-0.5 rounded-full ring-1 ring-inset ${badgeClass}`}>
            {row.action}
          </span>
        );
      }
    },
    {
      header: 'Entity / Target',
      render: (row) => (
        <div>
          <span className="font-bold text-[11px] text-gov-navy">{row.entity_type}</span>
          <div className="text-[10px] text-slate-500 font-mono truncate max-w-[140px] tabular-nums">
            ID: {row.entity_id}
          </div>
        </div>
      )
    },
    {
      header: 'State Transition & Payload',
      render: (row) => {
        const hasPayload = row.previous_state || row.new_state;
        return (
          <div className="space-y-1.5 font-mono text-[11px]">
            {row.previous_state && (
              <div className="text-slate-500 truncate max-w-xs text-[10px]">
                Prev: {JSON.stringify(row.previous_state)}
              </div>
            )}
            {row.new_state && (
              <div className="text-emerald-800 font-semibold truncate max-w-xs text-[10px]">
                New: {JSON.stringify(row.new_state)}
              </div>
            )}
            {hasPayload && (
              <button
                type="button"
                onClick={() => setSelectedLog(row)}
                className="btn-tactile inline-flex items-center space-x-1 text-[10px] text-gov-blue hover:text-gov-navy font-sans font-semibold bg-slate-100 hover:bg-slate-200/80 px-2 py-0.5 rounded transition"
              >
                <Eye size={11} />
                <span>Inspect Diffs</span>
              </button>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold font-serif text-gov-navy">
          Statutory Security & Department Audit Logs
        </h1>
        <p className="text-xs text-slate-600 mt-0.5">
          Immutable tamper-evident audit record of all authentication events, administrative allocations, verifications, and certificate modifications under Legal Metrology regulations.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={logs}
        loading={loading}
        searchPlaceholder="Filter audit trail by action, email, entity ID, or IP..."
      />

      {/* State Payload Inspector Modal */}
      {selectedLog && (
        <Modal
          isOpen={Boolean(selectedLog)}
          onClose={() => setSelectedLog(null)}
          title={`Audit Payload Inspector — ${selectedLog.action}`}
        >
          <div className="space-y-4 text-xs">
            {/* Metadata Summary */}
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 grid grid-cols-2 gap-2 text-slate-700">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Actor Email</span>
                <span className="font-semibold text-slate-900">{selectedLog.user_email}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">IP Address</span>
                <span className="font-mono tabular-nums text-slate-900">{selectedLog.ip_address}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Entity Reference</span>
                <span className="font-mono text-slate-900">{selectedLog.entity_type} #{selectedLog.entity_id}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Timestamp</span>
                <span className="font-mono tabular-nums text-slate-900">{new Date(selectedLog.created_at).toLocaleString()}</span>
              </div>
            </div>

            {/* Previous State */}
            <div>
              <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1 flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                <span>Previous State Snapshot</span>
              </div>
              {selectedLog.previous_state ? (
                <pre className="bg-slate-950 text-slate-200 p-3 rounded-lg font-mono text-[11px] overflow-auto max-h-48 border border-slate-800 leading-relaxed">
                  {JSON.stringify(selectedLog.previous_state, null, 2)}
                </pre>
              ) : (
                <div className="text-slate-400 italic bg-slate-50 p-3 rounded-lg border border-slate-200 text-center text-[11px]">
                  No previous state recorded (Initial creation / action event)
                </div>
              )}
            </div>

            {/* New State */}
            <div>
              <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1 flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Committed State Snapshot (Post-Action)</span>
              </div>
              {selectedLog.new_state ? (
                <pre className="bg-slate-950 text-emerald-300 p-3 rounded-lg font-mono text-[11px] overflow-auto max-h-48 border border-slate-800 leading-relaxed">
                  {JSON.stringify(selectedLog.new_state, null, 2)}
                </pre>
              ) : (
                <div className="text-slate-400 italic bg-slate-50 p-3 rounded-lg border border-slate-200 text-center text-[11px]">
                  No new state payload recorded
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="btn-tactile bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-1.5 rounded-lg text-xs font-semibold transition"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
