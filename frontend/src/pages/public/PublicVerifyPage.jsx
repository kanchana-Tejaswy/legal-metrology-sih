import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  XCircle,
  Search,
  Scale,
  Calendar,
  Building2,
  CheckCircle2,
  Printer,
  FileCheck,
  Lock,
  Clock,
  Copy,
  Check,
  QrCode
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';

export const PublicVerifyPage = () => {
  const { certificateId } = useParams();
  const navigate = useNavigate();

  const [inputCertId, setInputCertId] = useState(certificateId || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  const handleCopy = (text, type) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (type === 'id') {
        setCopiedId(true);
        setTimeout(() => setCopiedId(false), 2000);
      } else {
        setCopiedHash(true);
        setTimeout(() => setCopiedHash(false), 2000);
      }
    }
  };

  const fetchVerification = async (certId) => {
    if (!certId) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await api.verifyCertificatePublic(certId);
      setResult(res);
    } catch (err) {
      setError(err.data?.message || 'Certificate record not found in the official registry.');
      setResult({
        verified: false,
        status: 'INVALID',
        certificate_id: certId
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (certificateId) {
      setInputCertId(certificateId);
      fetchVerification(certificateId);
    }
  }, [certificateId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputCertId.trim()) {
      navigate(`/verify/${encodeURIComponent(inputCertId.trim())}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Breadcrumb & Heading */}
      <div className="border-b border-slate-300 pb-3 no-print">
        <div className="text-xs text-slate-500 mb-1">
          <Link to="/" className="hover:underline text-gov-blue">Home</Link> / Public Verification
        </div>
        <h1 className="text-2xl font-bold font-serif text-gov-navy flex items-center space-x-2">
          <ShieldCheck size={26} className="text-emerald-700" />
          <span>Statutory Digital Certificate Verification</span>
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Real-time verification against the live National Registry of the Department of Legal Metrology.
        </p>
      </div>

      {/* Verification Lookup Input Box */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-card no-print">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Enter Certificate ID / Scan QR Code
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. CERT-2026-000101"
                value={inputCertId}
                onChange={(e) => setInputCertId(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-md font-mono tabular-nums focus:ring-1 focus:ring-gov-navy focus:border-gov-navy uppercase transition shadow-2xs"
                required
              />
              <Search size={16} className="absolute left-3 top-3 text-slate-400" />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-gov-navy hover:bg-gov-blue text-white px-6 py-2.5 rounded-md text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2 transition btn-tactile shadow-2xs disabled:opacity-50"
          >
            {loading ? <span>Querying Registry...</span> : <span>Verify Live Status</span>}
          </button>
        </form>

        {/* Demo Quick Lookup Buttons */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium text-[11px]">Quick Demo Samples:</span>
          <button
            type="button"
            onClick={() => {
              setInputCertId('CERT-2026-000101');
              navigate('/verify/CERT-2026-000101');
            }}
            className="text-[11px] font-medium bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-600/20 px-2.5 py-0.5 rounded-full hover:bg-emerald-100 transition btn-tactile font-mono"
          >
            VALID (CERT-2026-000101)
          </button>
          <button
            type="button"
            onClick={() => {
              setInputCertId('CERT-2025-000088');
              navigate('/verify/CERT-2025-000088');
            }}
            className="text-[11px] font-medium bg-orange-50 text-orange-800 ring-1 ring-inset ring-orange-600/20 px-2.5 py-0.5 rounded-full hover:bg-orange-100 transition btn-tactile font-mono"
          >
            EXPIRED (CERT-2025-000088)
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200/90 shadow-card skeleton-shimmer space-y-4">
          <div className="h-16 bg-slate-100 rounded-lg w-full"></div>
          <div className="space-y-2 pt-2">
            <div className="h-4 bg-slate-200/70 rounded w-1/3"></div>
            <div className="h-4 bg-slate-100 rounded w-2/3"></div>
            <div className="h-4 bg-slate-100 rounded w-1/2"></div>
          </div>
          <div className="text-center pt-2 text-xs text-slate-500 font-medium flex items-center justify-center space-x-2">
            <div className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-gov-navy border-t-transparent"></div>
            <span>Accessing National Legal Metrology Registry...</span>
          </div>
        </div>
      )}

      {/* Verification Result Card */}
      {!loading && result && (
        <div id="printable-certificate" className="bg-white rounded-xl border border-slate-200/90 shadow-elevated overflow-hidden">
          {/* Status Header Banner */}
          <div
            className={`p-5 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
              result.status === 'VALID'
                ? 'bg-emerald-800 border-b-4 border-emerald-600'
                : result.status === 'EXPIRED'
                ? 'bg-amber-800 border-b-4 border-amber-600'
                : result.status === 'REVOKED'
                ? 'bg-red-800 border-b-4 border-red-600'
                : 'bg-slate-800 border-b-4 border-slate-600'
            }`}
          >
            <div className="flex items-center space-x-3">
              {result.status === 'VALID' && <CheckCircle2 size={36} className="text-emerald-300" />}
              {result.status === 'EXPIRED' && <AlertTriangle size={36} className="text-amber-300" />}
              {result.status === 'REVOKED' && <XCircle size={36} className="text-red-300" />}
              {result.status === 'INVALID' && <XCircle size={36} className="text-slate-400" />}

              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-200">
                  Verification Status
                </div>
                <div className="text-xl sm:text-2xl font-bold tracking-wide">
                  {result.status === 'VALID' && '✓ VALID & VERIFIED CERTIFICATE'}
                  {result.status === 'EXPIRED' && '⚠ CERTIFICATE EXPIRED'}
                  {result.status === 'REVOKED' && '✕ CERTIFICATE REVOKED'}
                  {result.status === 'INVALID' && 'INVALID / NOT FOUND'}
                </div>
              </div>
            </div>

            <div className="text-right text-xs">
              <div className="text-slate-200">Live Timestamp:</div>
              <div className="font-mono">{new Date().toLocaleString()}</div>
            </div>
          </div>

          {/* Revocation Alert Banner if Revoked */}
          {result.status === 'REVOKED' && (
            <div className="bg-red-50 border-b border-red-200 p-4 text-xs text-red-900 flex items-start space-x-2">
              <AlertTriangle size={18} className="text-red-700 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Administrative Revocation Notice: </span>
                This certificate was officially REVOKED on{' '}
                <strong>{new Date(result.certificate?.revoked_at).toLocaleDateString()}</strong>.
                Reason: <em>"{result.certificate?.revocation_reason}"</em>. Continued commercial use is an offence under Section 24 of the Legal Metrology Act, 2009.
              </div>
            </div>
          )}

          {/* Expired Notice if Expired */}
          {result.status === 'EXPIRED' && (
            <div className="bg-amber-50 border-b border-amber-200 p-4 text-xs text-amber-900 flex items-start space-x-2">
              <AlertTriangle size={18} className="text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Notice: </span>
                The validity period for this certificate ended on <strong>{result.certificate?.valid_until}</strong>.
                The owner must apply for re-verification before using this instrument in commercial transactions.
              </div>
            </div>
          )}

          {/* Detailed Certificate Record */}
          {result.verified && result.certificate && (
            <div className="p-6 sm:p-8 space-y-6 bg-white">
              {/* Official Seal and Certificate Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-5 gap-4">
                <div className="flex items-center space-x-3.5">
                  <img src="/emblem.svg" alt="Department Seal" className="w-14 h-14 object-contain flex-shrink-0" />
                  <div>
                    <div className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">Government of India • Department of Legal Metrology</div>
                    <div className="text-lg sm:text-xl font-bold text-gov-navy font-serif tracking-tight">Statutory Certificate of Verification</div>
                    <div className="text-xs text-slate-600 mt-0.5">Issued under statutory authority of Section 24, Legal Metrology Act, 2009</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="btn-tactile bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition border border-slate-300 shadow-2xs"
                  >
                    <Printer size={14} className="text-slate-500" />
                    <span>Print Certificate</span>
                  </button>

                  <div className="bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-lg text-left sm:text-right flex items-center space-x-2">
                    <div>
                      <div className="text-[9px] uppercase text-slate-500 font-bold tracking-wider">Certificate ID</div>
                      <div className="font-mono font-bold text-gov-navy text-xs sm:text-sm">{result.certificate.id}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(result.certificate.id, 'id')}
                      className="btn-tactile p-1 text-slate-400 hover:text-slate-700 rounded transition"
                      title="Copy Certificate ID"
                    >
                      {copiedId ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Data Grid: Instrument & Business Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                {/* Instrument Information */}
                <div className="space-y-3 bg-slate-50/70 p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-2xs">
                  <h4 className="font-bold text-gov-navy uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1.5 flex items-center justify-between">
                    <span>Instrument Dossier</span>
                    <Scale size={13} className="text-slate-400" />
                  </h4>
                  <div className="grid grid-cols-3 gap-y-2 gap-x-1 text-slate-700">
                    <span className="text-slate-500 font-medium">Instrument Type:</span>
                    <span className="col-span-2 font-semibold text-slate-900">
                      {result.certificate.instrument?.type}
                    </span>

                    <span className="text-slate-500 font-medium">Manufacturer:</span>
                    <span className="col-span-2 text-slate-800">
                      {result.certificate.instrument?.manufacturer}
                    </span>

                    <span className="text-slate-500 font-medium">Model Number:</span>
                    <span className="col-span-2 font-mono text-slate-800">
                      {result.certificate.instrument?.model_number}
                    </span>

                    <span className="text-slate-500 font-medium">Serial Number:</span>
                    <span className="col-span-2 font-mono font-bold text-gov-navy">
                      {result.certificate.instrument?.serial_number}
                    </span>

                    <span className="text-slate-500 font-medium">Capacity:</span>
                    <span className="col-span-2 font-mono tabular-nums text-slate-800">
                      {result.certificate.instrument?.capacity}
                    </span>

                    <span className="text-slate-500 font-medium">Accuracy Class:</span>
                    <span className="col-span-2">
                      <span className="inline-block bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-600/25 px-2 py-0.5 rounded-full font-bold text-[10px]">
                        Class {result.certificate.instrument?.accuracy_class || 'III'}
                      </span>
                    </span>

                    <span className="text-slate-500 font-medium">Premises Location:</span>
                    <span className="col-span-2 text-slate-800">
                      {result.certificate.instrument?.location}
                    </span>
                  </div>
                </div>

                {/* Ownership & Authority Information */}
                <div className="space-y-3 bg-slate-50/70 p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-2xs">
                  <h4 className="font-bold text-gov-navy uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1.5 flex items-center justify-between">
                    <span>Verification Authority & Validity</span>
                    <Building2 size={13} className="text-slate-400" />
                  </h4>
                  <div className="grid grid-cols-3 gap-y-2 gap-x-1 text-slate-700">
                    <span className="text-slate-500 font-medium">Business Owner:</span>
                    <span className="col-span-2 font-semibold text-slate-900">
                      {result.certificate.owner?.business_name}
                    </span>

                    <span className="text-slate-500 font-medium">Registered Address:</span>
                    <span className="col-span-2 text-slate-800 truncate">
                      {result.certificate.owner?.location || 'Registered Commercial Premises'}
                    </span>

                    <span className="text-slate-500 font-medium">Verifying Agency:</span>
                    <span className="col-span-2 font-medium text-slate-800">
                      {result.certificate.verifying_authority}
                    </span>

                    <span className="text-slate-500 font-medium">Inspector / LMO:</span>
                    <span className="col-span-2 font-semibold text-gov-navy">
                      {result.certificate.verifier_name}
                    </span>

                    <span className="text-slate-500 font-medium">Stamping Date:</span>
                    <span className="col-span-2 font-mono tabular-nums font-bold text-slate-800">
                      {result.certificate.verification_date}
                    </span>

                    <span className="text-slate-500 font-medium">Valid Until:</span>
                    <span className="col-span-2 font-mono tabular-nums font-bold text-emerald-800">
                      {result.certificate.valid_until}
                    </span>
                  </div>
                </div>
              </div>

              {/* Digital Signature & Integrity Block */}
              <div className="bg-slate-50/90 p-4 rounded-xl border border-slate-200/90 text-[11px] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 font-bold text-slate-700">
                    <Lock size={13} className="text-emerald-700" />
                    <span>Cryptographic Digital Signature Digest (Live Ledger Verified)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(result.certificate.digital_signature_hash, 'hash')}
                    className="btn-tactile text-[11px] text-gov-blue hover:text-gov-navy font-semibold flex items-center space-x-1"
                  >
                    {copiedHash ? (
                      <>
                        <Check size={12} className="text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy Digest</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="font-mono text-[10px] text-slate-600 break-all bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs leading-relaxed">
                  {result.certificate.digital_signature_hash}
                </div>
              </div>
            </div>
          )}

          {/* Invalid Record Card */}
          {!result.verified && (
            <div className="p-8 text-center space-y-3">
              <XCircle size={44} className="text-red-600 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">Certificate ID Not Recognized</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                No certificate with ID <strong>"{result.certificate_id}"</strong> was found in the official Department of Legal Metrology registry. Please check the number stamped on the certificate.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
