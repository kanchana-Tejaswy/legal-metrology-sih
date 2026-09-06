import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Scale, PlusCircle, QrCode, FileCheck2, ArrowRight } from 'lucide-react';

export const MyInstrumentsPage = () => {
  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInstruments() {
      try {
        const res = await api.getInstruments();
        if (res.success) {
          setInstruments(res.instruments);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchInstruments();
  }, []);

  const columns = [
    {
      header: 'Instrument Details',
      render: (row) => (
        <div>
          <div className="font-bold text-gov-navy">{row.instrument_type}</div>
          <div className="text-[11px] text-slate-500">
            {row.manufacturer} • Model: <span className="font-mono">{row.model_number}</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">ID: {row.id.substring(0, 12)}...</div>
        </div>
      )
    },
    {
      header: 'Serial Number',
      render: (row) => (
        <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          {row.serial_number}
        </span>
      )
    },
    {
      header: 'Capacity',
      render: (row) => (
        <div className="font-medium text-slate-700">
          {row.min_capacity} - {row.max_capacity} {row.unit}
        </div>
      )
    },
    {
      header: 'Installation Location',
      accessor: 'location',
      cellClassName: 'text-slate-600 max-w-xs truncate'
    },
    {
      header: 'Verification Status',
      render: (row) => <StatusBadge status={row.current_status} />
    },
    {
      header: 'Certificate Validity',
      render: (row) => (
        <div>
          {row.certificate ? (
            <div className="space-y-0.5">
              <div className="font-mono text-[11px] font-bold text-gov-navy">{row.certificate.id}</div>
              <div className="text-[10px] text-slate-500">Valid to: {row.certificate.valid_until}</div>
            </div>
          ) : (
            <span className="text-slate-400 text-xs italic">No active certificate</span>
          )}
        </div>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center space-x-2">
          {row.certificate ? (
            <Link
              to={`/verify/${row.certificate.id}`}
              className="p-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 rounded text-xs flex items-center space-x-1"
              title="View Public QR & Certificate"
            >
              <QrCode size={13} />
              <span>QR</span>
            </Link>
          ) : null}

          {row.current_status !== 'UNDER_VERIFICATION' && (
            <Link
              to={`/owner/apply?instrumentId=${row.id}`}
              className="p-1.5 bg-gov-navy hover:bg-gov-blue text-white rounded text-xs flex items-center space-x-1"
              title="Apply for Verification / Re-verification"
            >
              <FileCheck2 size={13} />
              <span>Apply</span>
            </Link>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-300 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-gov-navy">
            Registered Weighing & Measuring Instruments
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Complete inventory of commercial measuring instruments registered under your establishment.
          </p>
        </div>

        <Link
          to="/owner/instruments/register"
          className="bg-gov-navy hover:bg-gov-blue text-white px-4 py-2 rounded text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition"
        >
          <PlusCircle size={15} />
          <span>Register New Instrument</span>
        </Link>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={instruments}
        searchPlaceholder="Search by serial number, type, model, location..."
      />
    </div>
  );
};
