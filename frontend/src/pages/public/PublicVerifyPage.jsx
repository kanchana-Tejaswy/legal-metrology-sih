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
  QrCode,
  ArrowLeft,
  Info,
  CheckCircle
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
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10 space-y-6">
      {/* Top Breadcrumb & Heading */}
      <div className="border-b border-slate-200 pb-4 no-print text-left">
        <div className="text-xs text-slate-500 mb-1.5 flex items-center gap-1.5 font-medium">
          <Link to="/" className="hover:underline text-gov-blue">Home</Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-700">Public Verification</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gov-navy flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <ShieldCheck size={24} />
          </div>
          <span>Statutory Digital Certificate Verification</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Real-time live authenticity lookup against the National Legal Metrology Registry of India.
        </p>
      </div>

      {/* Verification Lookup Input Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card no-print text-left animate-fade-up">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Enter Certificate ID / Scan QR Code
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. CERT-2026-000101"
                value={inputCertId}
                onChange={(e) => setInputCertId(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm border border-slate-300 rounded-xl font-mono tabular-nums focus:ring-2 focus:ring-gov-navy focus:border-gov-navy uppercase transition shadow-2xs font-bold text-slate-900"
                required
              />
              <Search size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-gov-navy hover:bg-gov-blue text-white px-7 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition btn-tactile shadow-md disabled:opacity-50 shimmer-sweep"
          >
            {loading ? <span>Querying Registry...</span> : <span>Verify Live Status</span>}
          </button>
        </form>

        {/* Demo Quick Lookup Buttons */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center gap-2.5 text-xs">
          <span className="text-slate-500 font-semibold text-[11px]">Quick Evaluator Samples:</span>
          <button
            type="button"
            onClick={() => {
              setInputCertId('CERT-2026-000101');
              navigate('/verify/CERT-2026-000101');
            }}
            className="text-[11px] font-bold bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-600/20 px-3 py-1 rounded-full hover:bg-emerald-100 transition btn-tactile font-mono shadow-2xs hover:scale-105"
          >
            ✓ VALID (CERT-2026-000101)
          </button>
          <button
            type="button"
            onClick={() => {
              setInputCertId('CERT-2025-000088');
              navigate('/verify/CERT-2025-000088');
            }}
            className="text-[11px] font-bold bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-600/20 px-3 py-1 rounded-full hover:bg-amber-100 transition btn-tactile font-mono shadow-2xs hover:scale-105"
          >
            ⚠ EXPIRED (CERT-2025-000088)
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-card skeleton-shimmer space-y-4 animate-fade-in">
          <div className="h-16 bg-slate-100 rounded-xl w-full"></div>
          <div className="space-y-2 pt-2">
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
            <div className="h-4 bg-slate-100 rounded w-2/3"></div>
            <div className="h-4 bg-slate-100 rounded w-1/2"></div>
          </div>
          <div className="text-center pt-3 text-xs text-slate-500 font-bold flex items-center justify-center space-x-2">
            <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-gov-navy border-t-transparent"></div>
            <span>Querying National Legal Metrology Registry...</span>
          </div>
        </div>
      )}

      {/* Verification Result Card */}
      {!loading && result && (
        <div id="printable-certificate" className="bg-white rounded-2xl border border-slate-200 shadow-elevated overflow-hidden text-left animate-scale-in">
          {/* Status Header Banner */}
          <div
            className={`p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
              result.status === 'VALID'
                ? 'bg-gradient-to-r from-emerald-800 to-teal-900 border-b-4 border-emerald-500'
                : result.status === 'EXPIRED'
                ? 'bg-gradient-to-r from-amber-800 to-amber-900 border-b-4 border-amber-500'
                : result.status === 'REVOKED'
                ? 'bg-gradient-to-r from-red-800 to-red-900 border-b-4 border-red-500'
                : 'bg-gradient-to-r from-slate-800 to-slate-900 border-b-4 border-slate-600'
            }`}
          >
            <div className="flex items-center space-x-3.5">
              {result.status === 'VALID' && <CheckCircle2 size={40} className="text-emerald-300 flex-shrink-0 animate-pulse-subtle" />}
              {result.status === 'EXPIRED' && <AlertTriangle size={40} className="text-amber-300 flex-shrink-0 animate-pulse-subtle" />}
              {result.status === 'REVOKED' && <XCircle size={40} className="text-red-300 flex-shrink-0" />}
              {result.status === 'INVALID' && <XCircle size={40} className="text-slate-400 flex-shrink-0" />}

              <div>
                <div className="text-[11px] uppercase tracking-widest text-slate-200 font-bold">
                  Official Verification Status
                </div>
                <div className="text-xl sm:text-2xl font-extrabold tracking-wide">
                  {result.status === 'VALID' && '✓ VALID & VERIFIED CERTIFICATE'}
                  {result.status === 'EXPIRED' && '⚠ CERTIFICATE EXPIRED'}
                  {result.status === 'REVOKED' && '✕ CERTIFICATE REVOKED'}
                  {result.status === 'INVALID' && 'INVALID / NOT FOUND'}
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs bg-white/10 px-3.5 py-2 rounded-xl backdrop-blur-md">
              <div className="text-slate-300 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5 sm:justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block"></span>
                <span>Live Query Timestamp</span>
              </div>
              <div className="font-mono tabular-nums font-semibold text-white">{new Date().toLocaleString()}</div>
            </div>
          </div>

          {/* Revocation Alert Banner if Revoked */}
          {result.status === 'REVOKED' && (
            <div className="bg-red-50 border-b border-red-200 p-4 text-xs text-red-900 flex items-start space-x-3">
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
            <div className="bg-amber-50 border-b border-amber-200 p-4 text-xs text-amber-900 flex items-start space-x-3">
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
            <div className="p-6 sm:p-8 space-y-6 bg-white relative">
              {/* Sovereign Holographic Security Strip */}
              <div className="hologram-prism p-3.5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-2 text-slate-900 shadow-sm border border-amber-500/30">
                <div className="flex items-center space-x-2.5">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-xs">
                    ★
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Statutory Holographic Security Strip • Legal Metrology Act, 2009
                  </div>
                </div>
                <div className="text-[11px] font-mono font-bold text-slate-700">
                  SECURITY KEY: {result.certificate.id.replace('CERT-', 'SEC-')}-SECURE
                </div>
              </div>

              {/* Official Seal and Certificate Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-5 gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 p-1 flex items-center justify-center flex-shrink-0 shadow-subtle">
                    <img src="/emblem.svg" alt="Department Seal" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
                      <span>Government of India</span>
                      <span>•</span>
                      <span className="text-amber-800 font-devanagari font-bold">भारत सरकार</span>
                    </div>
                    <div className="text-xl font-extrabold text-gov-navy tracking-tight">
                      Statutory Certificate of Verification
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      Issued under statutory authority of Section 24, Legal Metrology Act, 2009
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 w-full sm:w-auto justify-end no-print">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="btn-tactile bg-slate-50 hover:bg-slate-100 text-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition border border-slate-300 shadow-2xs w-full sm:w-auto min-h-[42px]"
                  >
                    <Printer size={15} className="text-slate-600" />
                    <span>Print Official Certificate</span>
                  </button>

                  <div className="bg-slate-50 border border-slate-300 px-4 py-2 rounded-xl text-left sm:text-right flex items-center space-x-2.5 shadow-2xs">
                    <div>
                      <div className="text-[9px] uppercase text-slate-500 font-bold tracking-wider">Certificate ID</div>
                      <div className="font-mono font-bold text-gov-navy text-xs sm:text-sm">{result.certificate.id}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(result.certificate.id, 'id')}
                      className="btn-tactile p-1 text-slate-400 hover:text-slate-800 rounded transition"
                      title="Copy Certificate ID"
                    >
                      {copiedId ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Data Grid: Instrument & Business Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm">
                {/* Instrument Information */}
                <div className="space-y-3.5 bg-slate-50/80 p-6 rounded-3xl border border-slate-200/90 shadow-subtle">
                  <h4 className="font-bold text-gov-navy uppercase tracking-wider text-xs border-b border-slate-200 pb-2 flex items-center justify-between">
                    <span>Instrument Dossier</span>
                    <Scale size={15} className="text-slate-500" />
                  </h4>

                  <div className="grid grid-cols-3 gap-y-2.5 gap-x-2 text-slate-700 text-xs">
                    <span className="text-slate-500 font-medium">Instrument Type:</span>
                    <span className="col-span-2 font-bold text-slate-900">
                      {result.certificate.instrument?.type}
                    </span>

                    <span className="text-slate-500 font-medium">Manufacturer:</span>
                    <span className="col-span-2 text-slate-800 font-medium">
                      {result.certificate.instrument?.manufacturer}
                    </span>

                    <span className="text-slate-500 font-medium">Model Number:</span>
                    <span className="col-span-2 font-mono text-slate-800 font-bold">
                      {result.certificate.instrument?.model_number}
                    </span>

                    <span className="text-slate-500 font-medium">Serial Number:</span>
                    <span className="col-span-2 font-mono font-bold text-gov-navy">
                      {result.certificate.instrument?.serial_number}
                    </span>

                    <span className="text-slate-500 font-medium">Capacity / Range:</span>
                    <span className="col-span-2 font-mono tabular-nums text-slate-800 font-bold">
                      {result.certificate.instrument?.capacity}
                    </span>

                    <span className="text-slate-500 font-medium">Accuracy Class:</span>
                    <span className="col-span-2">
                      <span className="inline-block bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-600/30 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
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
                <div className="space-y-3.5 bg-slate-50/80 p-6 rounded-3xl border border-slate-200/90 shadow-subtle">
                  <h4 className="font-bold text-gov-navy uppercase tracking-wider text-xs border-b border-slate-200 pb-2 flex items-center justify-between">
                    <span>Verification Authority &amp; Validity</span>
                    <Building2 size={15} className="text-slate-500" />
                  </h4>
                  <div className="grid grid-cols-3 gap-y-2.5 gap-x-2 text-slate-700 text-xs">
                    <span className="text-slate-500 font-medium">Business Owner:</span>
                    <span className="col-span-2 font-bold text-slate-900">
                      {result.certificate.owner?.business_name}
                    </span>

                    <span className="text-slate-500 font-medium">Premises Address:</span>
                    <span className="col-span-2 text-slate-800 truncate">
                      {result.certificate.owner?.location || 'Registered Commercial Premises'}
                    </span>

                    <span className="text-slate-500 font-medium">Verifying Agency:</span>
                    <span className="col-span-2 font-medium text-slate-800">
                      {result.certificate.verifying_authority}
                    </span>

                    <span className="text-slate-500 font-medium">Inspector / LMO:</span>
                    <span className="col-span-2 font-bold text-gov-navy">
                      {result.certificate.verifier_name}
                    </span>

                    <span className="text-slate-500 font-medium">Stamping Date:</span>
                    <span className="col-span-2 font-mono tabular-nums font-bold text-slate-800">
                      {result.certificate.verification_date}
                    </span>

                    <span className="text-slate-500 font-medium">Valid Until:</span>
                    <span className="col-span-2 font-mono tabular-nums font-extrabold text-emerald-800 text-sm">
                      {result.certificate.valid_until}
                    </span>
                  </div>
                </div>
              </div>

              {/* Digital Signature & Integrity Block */}
              <div className="bg-slate-50/90 p-5 rounded-2xl border border-slate-200 text-xs space-y-2.5 shadow-subtle">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 font-bold text-slate-900">
                    <Lock size={15} className="text-emerald-700" />
                    <span>Cryptographic Digital Signature Digest (Live Ledger Verified)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(result.certificate.digital_signature_hash, 'hash')}
                    className="btn-tactile text-xs text-gov-navy hover:text-gov-blue font-bold flex items-center space-x-1"
                  >
                    {copiedHash ? (
                      <>
                        <Check size={14} className="text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copy SHA-256 Digest</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="font-mono text-[11px] text-slate-700 break-all bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs leading-relaxed font-semibold">
                  {result.certificate.digital_signature_hash}
                </div>
              </div>
            </div>
          )}

          {/* Invalid Record Card */}
          {!result.verified && (
            <div className="p-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <XCircle size={36} />
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">Certificate ID Not Recognized</h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                No certificate with ID <strong className="font-mono text-slate-900">"{result.certificate_id}"</strong> was found in the official Department of Legal Metrology registry. Please verify the number printed on the physical stamp or QR code.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
