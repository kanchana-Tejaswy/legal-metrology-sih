import React from 'react';
import { Scale, ShieldCheck, Award, FileText, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-300 pb-4">
        <div className="text-xs text-slate-500 mb-1">
          <Link to="/" className="hover:underline text-gov-blue">Home</Link> / About
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-gov-navy">
          Statutory Framework & Department Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Legal Metrology Act, 2009 — Guaranteeing Measurement Integrity in Trade and Commerce.
        </p>
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <h2 className="text-lg font-bold font-serif text-gov-navy">
            1. Purpose and Mandate of Legal Metrology
          </h2>
          <p>
            The Department of Legal Metrology operates under the Ministry of Consumer Affairs, Food and Public Distribution, Government of India. The primary statutory mandate is to regulate standards of weights and measures, ensure accuracy in all commercial transactions, and prevent fraudulent practices.
          </p>
          <p>
            Under <strong>Section 24 of the Legal Metrology Act, 2009</strong>, every person possessing, using, or keeping any weight or measure for use in any transaction or for protection must get such weight or measure verified and stamped periodically by an authorized Legal Metrology Officer (LMO) or at a Government Approved Test Centre (GATC).
          </p>

          <h2 className="text-lg font-bold font-serif text-gov-navy pt-3">
            2. Distinct Verification Channels: LMO and GATC
          </h2>
          <div className="bg-white p-4 rounded border border-slate-300 shadow-xs space-y-2">
            <div className="font-bold text-gov-navy text-xs uppercase tracking-wide flex items-center space-x-1.5">
              <Scale size={16} className="text-gov-ashoka" />
              <span>Legal Metrology Officer (LMO)</span>
            </div>
            <p className="text-xs text-slate-600">
              Government Gazetted officers empowered with statutory powers of inspection, stamping, sealing, seizure, and compounding of offences. They conduct both on-site field verifications and divisional checks.
            </p>
          </div>

          <div className="bg-white p-4 rounded border border-slate-300 shadow-xs space-y-2">
            <div className="font-bold text-gov-navy text-xs uppercase tracking-wide flex items-center space-x-1.5">
              <Award size={16} className="text-gov-ashoka" />
              <span>Government Approved Test Centre (GATC)</span>
            </div>
            <p className="text-xs text-slate-600">
              Accredited private or public laboratories authorized under Section 14 of the Legal Metrology Act to carry out verification and calibration within a formally defined scope (e.g. Countertop Scales, Precision Balances). GATCs provide additional testing capacity to eliminate backlogs.
            </p>
          </div>
        </div>

        {/* Right Sidebar: Key Statutory Highlights */}
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-300 p-4 rounded">
            <h3 className="text-xs font-bold uppercase text-gov-navy tracking-wider mb-2 border-b pb-1">
              Key Legal Provisions
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start space-x-1.5">
                <CheckCircle2 size={14} className="text-emerald-700 flex-shrink-0 mt-0.5" />
                <span><strong>Section 24:</strong> Mandatory verification & stamping.</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <CheckCircle2 size={14} className="text-emerald-700 flex-shrink-0 mt-0.5" />
                <span><strong>Section 30:</strong> Penalties for quoting or publishing non-standard units.</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <CheckCircle2 size={14} className="text-emerald-700 flex-shrink-0 mt-0.5" />
                <span><strong>Section 33:</strong> Penalty for use of unverified weights or measures.</span>
              </li>
            </ul>
          </div>

          <div className="bg-gov-navy text-white p-4 rounded text-xs space-y-2">
            <h3 className="font-bold text-amber-300 text-sm font-serif">Smart India Hackathon 2024</h3>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Problem Statement <strong>SIH 26036</strong> addresses the digital transformation of this statutory ecosystem, delivering verifiable QR credentials, eliminating paper fraud, and enabling real-time administrative oversight.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
