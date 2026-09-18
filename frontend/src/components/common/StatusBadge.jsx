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
          className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-tight bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-600/25 ${className}`}
        >
          <CheckCircle2 size={12} className="text-emerald-600 flex-shrink-0" />
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
          className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-tight bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-600/25 ${className}`}
        >
          <AlertTriangle size={12} className="text-amber-600 flex-shrink-0" />
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
          className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-tight bg-sky-50 text-sky-800 ring-1 ring-inset ring-sky-600/25 ${className}`}
        >
          <Clock size={12} className="text-sky-600 flex-shrink-0" />
          <span>{normalized.replace('_', ' ')}</span>
        </span>
      );

    case 'EXPIRED':
      return (
        <span
          className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-tight bg-orange-50 text-orange-800 ring-1 ring-inset ring-orange-600/25 ${className}`}
        >
          <Clock size={12} className="text-orange-600 flex-shrink-0" />
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
          className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-tight bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/25 ${className}`}
        >
          <XCircle size={12} className="text-rose-600 flex-shrink-0" />
          <span>{normalized}</span>
        </span>
      );

    default:
      return (
        <span
          className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-tight bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-400/20 ${className}`}
        >
          <span>{status}</span>
        </span>
      );
  }
};
