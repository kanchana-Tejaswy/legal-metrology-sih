import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ShieldCheck,
  ShieldAlert,
  FileCheck,
  RotateCcw
} from 'lucide-react';

export const StatusBadge = ({ status, className = '' }) => {
  if (!status) return null;

  const normalized = String(status).toUpperCase();

  switch (normalized) {
    case 'VALID':
    case 'APPROVED':
    case 'COMPLETED':
    case 'PASS':
      return (
        <span
          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 ${className}`}
        >
          <CheckCircle2 size={12} className="text-emerald-700" />
          <span>{normalized}</span>
        </span>
      );

    case 'EXPIRING_SOON':
    case 'EXPIRING SOON':
    case 'UNDER_REVIEW':
    case 'UNDER REVIEW':
    case 'SCHEDULED':
      return (
        <span
          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300 ${className}`}
        >
          <AlertTriangle size={12} className="text-amber-700" />
          <span>{normalized.replace('_', ' ')}</span>
        </span>
      );

    case 'PENDING':
    case 'SUBMITTED':
    case 'ASSIGNED':
    case 'UNDER_VERIFICATION':
    case 'UNDER VERIFICATION':
      return (
        <span
          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-900 border border-blue-300 ${className}`}
        >
          <Clock size={12} className="text-blue-700" />
          <span>{normalized.replace('_', ' ')}</span>
        </span>
      );

    case 'EXPIRED':
      return (
        <span
          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-orange-100 text-orange-900 border border-orange-300 ${className}`}
        >
          <Clock size={12} className="text-orange-700" />
          <span>EXPIRED</span>
        </span>
      );

    case 'REVOKED':
    case 'REJECTED':
    case 'FAILED':
    case 'FAIL':
    case 'SUSPENDED':
    case 'INVALID':
      return (
        <span
          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-900 border border-red-300 ${className}`}
        >
          <XCircle size={12} className="text-red-700" />
          <span>{normalized}</span>
        </span>
      );

    default:
      return (
        <span
          className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 border border-slate-300 ${className}`}
        >
          <span>{status}</span>
        </span>
      );
  }
};
