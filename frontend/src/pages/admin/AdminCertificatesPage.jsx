import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Award, ShieldAlert, QrCode, AlertTriangle, Printer, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminCertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [revokingCert, setRevokingCert] = useState(null);
  const [revocationReason, setRevocationReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      const res = await api.getCertificates();
      if (res.success) {
        setCertificates(res.certificates);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  const openRevokeModal = (cert) => {
    setRevokingCert(cert);
    setRevocationReason('Physical seal tampered / calibration discrepancy detected during field surveillance.');
    setError(null);
  };

  const handleConfirmRevocation = async () => {
    if (!revokingCert || !revocationReason.trim()) return;
    setProcessing(true);
    setError(null);

    try {
      const res = await api.revokeCertificate(revokingCert.id, {
        reason: revocationReason
      });

      if (res.success) {
        setRevokingCert(null);
        loadCertificates();
      }
    } catch (err) {
      setError(err.data?.message || err.message || 'Failed to revoke certificate.');
    } finally {
      setProcessing(false);
    }
  };

  const columns = [
    {
      header: 'Certificate Number',
      render: (row) => (
        <div>
          <span className="font-mono font-bold text-gov-navy text-xs">{row.id}</span>
          <div className="text-[10px] text-slate-400">
            Issued: {row.verification_date}
          </div>
        </div>
      )
    },
    {
      header: 'Instrument & Serial',
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-800">{row.instrument?.instrument_type}</div>
          <div className="text-[11px] text-slate-500 font-mono">
            Serial: <strong>{row.instrument?.serial_number}</strong>
          </div>
        </div>
      )
    },
    {
      header: 'Establishment / Owner',
      render: (row) => (
        <div>
          <div className="font-medium text-slate-800">{row.owner?.business_name || row.owner?.full_name}</div>
          <div className="text-[10px] text-slate-400 truncate max-w-xs">{row.owner?.stakeholder?.business_address}</div>
        </div>
      )
    },
    {
      header: 'Valid Until',
      render: (row) => (
        <span className="font-bold text-xs font-mono text-slate-700">
          {row.valid_until}
        </span>
      )
    },
    {
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <Link
            to={`/verify/${row.id}`}
            target="_blank"
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs flex items-center space-x-1"
            title="Inspect Public Live QR Verification"
          >
            <QrCode size={13} />
            <span>Verify</span>
          </Link>

          {row.status === 'VALID' && (
            <button
              onClick={() => openRevokeModal(row)}
              className="bg-red-700 hover:bg-red-800 text-white px-2 py-1 rounded text-xs font-semibold flex items-center space-x-1 shadow-xs transition"
              title="Administrative Revocation"
            >
              <ShieldAlert size={12} />
              <span>Revoke</span>
            </button>
          )}

          {row.status === 'REVOKED' && (
            <span className="text-[10px] text-red-700 font-bold italic">Revoked</span>
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
          Master Digital Certificate Registry & Revocation
        </h1>
        <p className="text-xs text-slate-600 mt-0.5">
          Comprehensive statutory register of all issued digital certificates. Authorized administrators can revoke certificates for non-compliant or tampered instruments.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={certificates}
        searchPlaceholder="Filter certificates by certificate number, serial, business, status..."
      />

      {/* Revocation Modal */}
      <Modal
        isOpen={Boolean(revokingCert)}
        onClose={() => setRevokingCert(null)}
        title={`Revoke Certificate: ${revokingCert?.id}`}
      >
        {revokingCert && (
          <div className="space-y-4 text-xs">
            <div className="bg-red-50 p-3.5 rounded border border-red-200 text-red-900 space-y-1">
              <div className="font-bold text-sm">Caution: Statutory Revocation Action</div>
              <p>
                Revoking this certificate will invalidate legal authorization for instrument{' '}
                <strong>"{revokingCert.instrument?.instrument_type}" (SN: {revokingCert.instrument?.serial_number})</strong>.
                The live public QR verification page will immediately update to <strong>REVOKED</strong>.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-900 rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Formal Administrative Justification / Reason *
              </label>
              <textarea
                rows={3}
                value={revocationReason}
                onChange={(e) => setRevocationReason(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-red-600 font-sans"
                placeholder="State the statutory grounds, inspector report reference, or defect notes..."
                required
              />
              <p className="text-[10px] text-slate-500 mt-1">
                This explanation will be recorded in the audit logs and displayed on the public verification page.
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setRevokingCert(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={processing || !revocationReason.trim()}
                onClick={handleConfirmRevocation}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded text-xs font-bold shadow-xs disabled:opacity-50"
              >
                {processing ? 'Revoking...' : 'Execute Statutory Revocation'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
