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
  Camera,
  QrCode
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { QRCameraScannerModal } from '../../components/verification/QRCameraScannerModal';

export const PublicVerifyPage = () => {
  const { certificateId } = useParams();
  const navigate = useNavigate();

  const [inputCertId, setInputCertId] = useState(certificateId || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [scannerOpen, setScannerOpen] = useState(false);

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

  const handleScanSuccess = (scannedCertId) => {
    if (scannedCertId) {
      setInputCertId(scannedCertId);
      navigate(`/verify/${encodeURIComponent(scannedCertId)}`);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputCertId.trim()) {
      navigate(`/verify/${encodeURIComponent(inputCertId.trim())}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Breadcrumb & Heading */}
      <div className="border-b border-slate-300 pb-3">
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
      <div className="bg-white p-4 sm:p-5 rounded border border-slate-300 shadow-xs">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Enter Certificate ID or Scan QR Code
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. CERT-2026-000101"
                value={inputCertId}
                onChange={(e) => setInputCertId(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded font-mono focus:ring-1 focus:ring-gov-navy focus:border-gov-navy uppercase"
                required
              />
              <Search size={16} className="absolute left-3 top-2.5 sm:top-3 text-slate-400" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setScannerOpen(true)}
            className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 sm:py-2.5 rounded text-xs sm:text-sm font-semibold flex items-center justify-center space-x-1.5 transition shadow-xs"
          >
            <Camera size={16} />
            <span>Scan with Camera</span>
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-gov-navy hover:bg-gov-blue text-white px-6 py-2 sm:py-2.5 rounded text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2 transition disabled:opacity-50"
          >
            {loading ? <span>Querying Registry...</span> : <span>Verify by Code</span>}
          </button>
        </form>

        {/* Camera Scanner Modal Component */}
        <QRCameraScannerModal
          isOpen={scannerOpen}
          onClose={() => setScannerOpen(false)}
          onScanSuccess={handleScanSuccess}
        />

        {/* Demo Quick Lookup Buttons */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Quick Demo Samples:</span>
          <button
            onClick={() => {
              setInputCertId('CERT-2026-000101');
              navigate('/verify/CERT-2026-000101');
            }}
            className="text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded hover:bg-emerald-100"
          >
            VALID Certificate (CERT-2026-000101)
          </button>
          <button
            onClick={() => {
              setInputCertId('CERT-2025-000088');
              navigate('/verify/CERT-2025-000088');
            }}
            className="text-[11px] bg-orange-50 text-orange-800 border border-orange-300 px-2 py-0.5 rounded hover:bg-orange-100"
          >
            EXPIRED Certificate (CERT-2025-000088)
          </button>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="bg-white p-8 rounded border border-slate-300 text-center space-y-2">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gov-navy border-t-transparent"></div>
          <div className="text-xs font-semibold text-slate-700">Accessing Live Legal Metrology Database...</div>
        </div>
      )}

      {/* Verification Result Card */}
      {!loading && result && (
        <div className="bg-white rounded border border-slate-300 shadow-md overflow-hidden">
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
            <div className="p-6 space-y-6">
              {/* Official Seal and Certificate Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 gap-4">
                <div className="flex items-center space-x-3">
                  <img src="/emblem.svg" alt="Department Seal" className="w-14 h-14" />
                  <div>
                    <div className="text-xs uppercase font-bold text-slate-500">Department of Legal Metrology</div>
                    <div className="text-base font-bold text-gov-navy font-serif">Certificate of Verification</div>
                    <div className="text-xs text-slate-600">Issued under Section 24 of Legal Metrology Act, 2009</div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-300 p-2.5 rounded text-left sm:text-right">
                  <div className="text-[10px] uppercase text-slate-500 font-bold">Certificate Number</div>
                  <div className="font-mono font-bold text-gov-navy text-sm">{result.certificate.id}</div>
                </div>
              </div>

              {/* Data Grid: Instrument & Business Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Instrument Information */}
                <div className="space-y-3 bg-slate-50 p-4 rounded border border-slate-200">
                  <h4 className="font-bold text-gov-navy uppercase tracking-wider text-[11px] border-b pb-1">
                    Instrument Details
                  </h4>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-slate-500">Instrument Type:</span>
                    <span className="col-span-2 font-semibold text-slate-800">
                      {result.certificate.instrument?.type}
                    </span>

                    <span className="text-slate-500">Manufacturer:</span>
                    <span className="col-span-2 font-medium text-slate-800">
                      {result.certificate.instrument?.manufacturer}
                    </span>

                    <span className="text-slate-500">Model Number:</span>
                    <span className="col-span-2 font-mono text-slate-800">
                      {result.certificate.instrument?.model_number}
                    </span>

                    <span className="text-slate-500">Serial Number:</span>
                    <span className="col-span-2 font-mono font-bold text-gov-navy">
                      {result.certificate.instrument?.serial_number}
                    </span>

                    <span className="text-slate-500">Capacity:</span>
                    <span className="col-span-2 font-medium text-slate-800">
                      {result.certificate.instrument?.capacity}
                    </span>

                    <span className="text-slate-500">Accuracy Class:</span>
                    <span className="col-span-2 font-semibold text-emerald-800">
                      {result.certificate.instrument?.accuracy_class}
                    </span>

                    <span className="text-slate-500">Location:</span>
                    <span className="col-span-2 text-slate-800">
                      {result.certificate.instrument?.location}
                    </span>
                  </div>
                </div>

                {/* Ownership & Authority Information */}
                <div className="space-y-3 bg-slate-50 p-4 rounded border border-slate-200">
                  <h4 className="font-bold text-gov-navy uppercase tracking-wider text-[11px] border-b pb-1">
                    Verification Authority & Validity
                  </h4>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-slate-500">Business Name:</span>
                    <span className="col-span-2 font-semibold text-slate-800">
                      {result.certificate.owner?.business_name}
                    </span>

                    <span className="text-slate-500">Business Address:</span>
                    <span className="col-span-2 text-slate-800">
                      {result.certificate.owner?.location || 'Registered Commercial Premises'}
                    </span>

                    <span className="text-slate-500">Verifying Agency:</span>
                    <span className="col-span-2 font-medium text-slate-800">
                      {result.certificate.verifying_authority}
                    </span>

                    <span className="text-slate-500">Inspector / Verifier:</span>
                    <span className="col-span-2 font-semibold text-gov-navy">
                      {result.certificate.verifier_name}
                    </span>

                    <span className="text-slate-500">Verification Date:</span>
                    <span className="col-span-2 font-bold text-slate-800">
                      {result.certificate.verification_date}
                    </span>

                    <span className="text-slate-500">Valid Until:</span>
                    <span className="col-span-2 font-bold text-amber-900">
                      {result.certificate.valid_until}
                    </span>
                  </div>
                </div>
              </div>

              {/* Digital Signature & Integrity Block */}
              <div className="bg-slate-100 p-3.5 rounded border border-slate-200 text-[11px] space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-slate-700">
                  <Lock size={13} className="text-emerald-700" />
                  <span>Cryptographic Digital Signature Digest (Live DB Lookup Verified)</span>
                </div>
                <div className="font-mono text-[10px] text-slate-600 break-all bg-white p-2 rounded border border-slate-200">
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
