import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import {
  Award,
  QrCode,
  Printer,
  ExternalLink,
  ShieldCheck,
  Scale,
  Calendar,
  Lock,
  Download
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyCertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCert, setActiveCert] = useState(null);

  useEffect(() => {
    async function loadCerts() {
      try {
        const res = await api.getCertificates();
        if (res.success) {
          setCertificates(res.certificates);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCerts();
  }, []);

  const openCertificate = async (id) => {
    try {
      const res = await api.getCertificateById(id);
      if (res.success) {
        setActiveCert(res.certificate);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-300 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-gov-navy">
            Digital Verification Certificates & QR Credentials
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Legally valid verification certificates issued under the Legal Metrology Act, 2009.
          </p>
        </div>
      </div>

      {/* Certificates Grid */}
      {loading ? (
        <div className="p-8 text-center text-xs text-slate-500">Loading digital certificates...</div>
      ) : certificates.length === 0 ? (
        <div className="bg-white p-8 rounded border border-slate-300 text-center text-xs text-slate-500">
          No verification certificates issued yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded border border-slate-300 shadow-xs hover:border-gov-navy transition p-5 space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Certificate ID</span>
                    <span className="font-mono font-bold text-base text-gov-navy">{cert.id}</span>
                  </div>
                  <StatusBadge status={cert.status} />
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 text-xs space-y-1.5">
                  <div>
                    <span className="text-slate-500 text-[11px] block">Verified Instrument</span>
                    <span className="font-semibold text-slate-800">
                      {cert.instrument?.instrument_type || 'Measuring Instrument'}
                    </span>
                    <span className="text-slate-500 font-mono text-[11px] block">
                      Serial No: {cert.instrument?.serial_number}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                    <div>
                      <span className="text-slate-400 block">Verification Date:</span>
                      <span className="font-semibold text-slate-700">{cert.verification_date}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Valid Until:</span>
                      <span className="font-bold text-gov-navy">{cert.valid_until}</span>
                    </div>
                  </div>

                  <div className="text-[11px] pt-1">
                    <span className="text-slate-400 block">Verifying Authority:</span>
                    <span className="text-slate-700">{cert.verifying_authority}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => openCertificate(cert.id)}
                  className="bg-gov-navy hover:bg-gov-blue text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center space-x-1.5 transition"
                >
                  <Award size={14} />
                  <span>View Official Certificate</span>
                </button>

                <Link
                  to={`/verify/${cert.id}`}
                  className="p-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 rounded text-xs flex items-center space-x-1"
                  title="Test Live Public QR Verification"
                >
                  <QrCode size={14} />
                  <span>Live QR Check</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Official Certificate Modal (High Fidelity Gov Layout) */}
      <Modal
        isOpen={Boolean(activeCert)}
        onClose={() => setActiveCert(null)}
        title={`Official Legal Metrology Certificate: ${activeCert?.id}`}
        maxWidth="max-w-3xl"
      >
        {activeCert && (
          <div className="space-y-4">
            {/* Printable Area */}
            <div
              id="printable-certificate"
              className="bg-white p-6 sm:p-8 rounded border-4 border-double border-gov-navy text-xs relative space-y-6"
            >
              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <Scale size={280} />
              </div>

              {/* Certificate Header */}
              <div className="text-center space-y-1 border-b-2 border-slate-300 pb-4">
                <img src="/emblem.svg" alt="Seal" className="w-16 h-16 mx-auto mb-2" />
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-600">
                  Government of India • Department of Legal Metrology
                </div>
                <h2 className="text-xl font-bold font-serif text-gov-navy uppercase tracking-wider">
                  Certificate of Verification
                </h2>
                <div className="text-[10px] text-slate-500 font-serif italic">
                  Issued under the Legal Metrology Act, 2009 & Legal Metrology (General) Rules, 2011
                </div>
              </div>

              {/* Certificate Number & Stamped Badge */}
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded border border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Certificate ID</span>
                  <span className="font-mono text-base font-bold text-gov-navy">{activeCert.id}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Statutory Status</span>
                  <StatusBadge status={activeCert.status} />
                </div>
              </div>

              {/* Legal Affirmation */}
              <p className="text-slate-700 leading-relaxed text-center italic text-xs max-w-xl mx-auto">
                "This is to certify that the weighing / measuring instrument described herein has been officially verified, tested for Maximum Permissible Error (MPE), and stamped with the statutory verification mark in accordance with Legal Metrology standards."
              </p>

              {/* Instrument & Owner Specifications Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/70 p-4 rounded border border-slate-200">
                <div className="space-y-1.5">
                  <div className="font-bold text-gov-navy uppercase text-[10px] border-b pb-0.5">
                    Instrument Description
                  </div>
                  <div>Type: <strong>{activeCert.instrument?.instrument_type}</strong></div>
                  <div>Manufacturer: {activeCert.instrument?.manufacturer}</div>
                  <div>Model: <span className="font-mono">{activeCert.instrument?.model_number}</span></div>
                  <div>Serial Number: <strong className="font-mono text-gov-navy">{activeCert.instrument?.serial_number}</strong></div>
                  <div>
                    Capacity: {activeCert.instrument?.min_capacity} - {activeCert.instrument?.max_capacity} {activeCert.instrument?.unit}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="font-bold text-gov-navy uppercase text-[10px] border-b pb-0.5">
                    Ownership & Physical Location
                  </div>
                  <div>Registered Owner: <strong>{activeCert.owner?.business_name || activeCert.owner?.full_name}</strong></div>
                  <div>Installation Address: {activeCert.instrument?.location}</div>
                  <div>Verification Date: <strong>{activeCert.verification_date}</strong></div>
                  <div>Valid Until: <strong className="text-gov-navy">{activeCert.valid_until}</strong></div>
                </div>
              </div>

              {/* Bottom Authority Stamp & Live QR Code */}
              <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t-2 border-slate-300 gap-4">
                {/* Live QR Code Box */}
                <div className="flex items-center space-x-3 bg-white p-2 rounded border border-slate-300">
                  {activeCert.qr_code && (
                    <img src={activeCert.qr_code} alt="Verification QR" className="w-20 h-20" />
                  )}
                  <div className="text-[10px] text-slate-600 space-y-0.5 text-left">
                    <div className="font-bold text-gov-navy">Live Verifiable QR</div>
                    <div>Scan with any mobile device</div>
                    <div>Points to live statutory database</div>
                    <div className="font-mono text-[9px] text-slate-400">/verify/{activeCert.id}</div>
                  </div>
                </div>

                {/* Digital Signature Official Stamp */}
                <div className="text-right space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Authorized Signatory</div>
                  <div className="font-bold text-sm text-gov-navy">{activeCert.verifier_name}</div>
                  <div className="text-[10px] text-slate-600 max-w-xs">{activeCert.verifying_authority}</div>
                  <div className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded font-bold text-[9px] border border-emerald-300 mt-1">
                    DIGITALLY SIGNED & VERIFIED
                  </div>
                </div>
              </div>

              {/* Cryptographic Footnote */}
              <div className="text-[9px] font-mono text-slate-400 text-center break-all pt-2">
                Security Hash: {activeCert.digital_signature_hash}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-between items-center pt-2">
              <Link
                to={`/verify/${activeCert.id}`}
                target="_blank"
                className="text-xs text-gov-blue hover:underline flex items-center space-x-1"
              >
                <span>Open Public Verification Page</span>
                <ExternalLink size={12} />
              </Link>

              <button
                onClick={handlePrint}
                className="bg-gov-navy hover:bg-gov-blue text-white px-4 py-2 rounded text-xs font-semibold flex items-center space-x-1.5 transition"
              >
                <Printer size={15} />
                <span>Print / Save as PDF</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
