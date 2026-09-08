import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { DataTable } from '../../components/common/DataTable';
import { FileText, ShieldCheck, Clock, ArrowRight } from 'lucide-react';

export const AdminAuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

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
        <div className="font-mono text-[11px] text-slate-600">
          <div>{new Date(row.created_at).toLocaleDateString()}</div>
          <div className="text-[10px] text-slate-400">{new Date(row.created_at).toLocaleTimeString()}</div>
        </div>
      )
    },
    {
      header: 'User Identity',
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-800 text-xs">{row.user_email}</span>
          <div className="text-[10px] text-slate-400 font-mono">IP: {row.ip_address}</div>
        </div>
      )
    },
    {
      header: 'Action Taken',
      render: (row) => {
        let badgeColor = 'bg-slate-100 text-slate-800 border-slate-300';
        if (row.action.includes('APPROVED') || row.action.includes('PASS') || row.action.includes('GENERATED')) {
          badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
        } else if (row.action.includes('REVOKED') || row.action.includes('REJECTED') || row.action.includes('FAILED')) {
          badgeColor = 'bg-red-100 text-red-800 border-red-300';
        } else if (row.action.includes('ASSIGNED') || row.action.includes('SCHEDULED')) {
          badgeColor = 'bg-purple-100 text-purple-800 border-purple-300';
        }

        return (
          <span className={`inline-block font-mono font-bold text-[11px] px-2 py-0.5 rounded border ${badgeColor}`}>
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
          <div className="text-[10px] text-slate-500 font-mono truncate max-w-[140px]">
            ID: {row.entity_id}
          </div>
        </div>
      )
    },
    {
      header: 'State Transition & Payload',
      render: (row) => (
        <div className="max-w-md text-[11px] space-y-1 font-mono">
          {row.previous_state && (
            <div className="text-slate-500 truncate">
              Prev: {JSON.stringify(row.previous_state)}
            </div>
          )}
          {row.new_state && (
            <div className="text-emerald-800 font-semibold truncate">
              New: {JSON.stringify(row.new_state)}
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-300 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold font-serif text-gov-navy">
          Statutory Security & Department Audit Logs
        </h1>
        <p className="text-xs text-slate-600 mt-0.5">
          Immutable audit record of all authentication events, administrative allocations, verifications, and certificate modifications.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={logs}
        loading={loading}
        searchPlaceholder="Filter audit trail by action, email, entity ID, or IP..."
      />
    </div>
  );
};
