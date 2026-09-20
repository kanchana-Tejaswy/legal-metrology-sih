import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  FileCheck2,
  Scale,
  Calendar,
  QrCode,
  Building2,
  CheckCircle,
  ArrowRight,
  AlertCircle,
  Clock,
  Award
} from 'lucide-react';

export const HomePage = () => {
  return (
    <div className="space-y-8">
      {/* Official Hero Section */}
      <div className="bg-gradient-to-r from-gov-navy via-[#0A2540] to-gov-blue text-white py-12 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-500 shadow-md">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center space-x-2 bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs px-3 py-1 rounded">
              <Scale size={14} />
              <span className="font-semibold tracking-wide">Statutory Verification System • Legal Metrology Act, 2009</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif leading-tight">
              Online Verification & Certification System
              <span className="block text-slate-200 text-lg sm:text-xl font-sans font-normal mt-1">
                for Commercial Weighing and Measuring Instruments
              </span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
              A national digital governance platform providing transparent registration, allocation,
              scheduling, field inspection records, tamper-proof digital certificates, and live QR-based authenticity
              verification for fair trade protection across India.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded shadow flex items-center space-x-2 transition"
              >
                <span>Apply for Verification</span>
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/verify"
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded shadow flex items-center space-x-2 transition border border-emerald-600"
              >
                <QrCode size={16} />
                <span>Verify Digital Certificate</span>
              </Link>

              <Link
                to="/login"
                className="bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-600 text-xs sm:text-sm px-4 py-2.5 rounded transition"
              >
                Officer / Lab Login
              </Link>
            </div>
          </div>

          {/* Quick Verification Lookup Card */}
          <div className="lg:col-span-4">
            <div className="bg-white text-slate-800 rounded border border-slate-200 shadow-xl p-5">
              <div className="flex items-center space-x-2 text-gov-navy font-bold text-sm border-b pb-3 mb-3">
                <ShieldCheck size={20} className="text-emerald-700" />
                <span>Instant Certificate Verification</span>
              </div>
              <p className="text-xs text-slate-600 mb-4 leading-normal">
                Verify the live validity, stamping record, and authenticity of any weighing instrument using its official certificate number.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const id = e.target.certId.value.trim();
                  if (id) window.location.href = `/verify/${encodeURIComponent(id)}`;
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Certificate Number
                  </label>
                  <input
                    name="certId"
                    type="text"
                    defaultValue="CERT-2026-000101"
                    placeholder="e.g. CERT-2026-000101"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded font-mono focus:ring-1 focus:ring-gov-navy focus:border-gov-navy"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gov-navy hover:bg-gov-blue text-white py-2 px-3 rounded text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
                >
                  <ShieldCheck size={14} />
                  <span>Verify Status Live</span>
                </button>
              </form>
              <div className="mt-3 text-[10px] text-slate-500 text-center">
                Public service: No login credentials required.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statutory Disclaimer Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-50 border-l-4 border-gov-navy p-4 rounded shadow-xs text-xs text-slate-800 flex items-start space-x-3">
          <AlertCircle size={20} className="text-gov-navy flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-gov-navy">Statutory Principle: </span>
            This online portal digitizes application processing, allocation, scheduling, and official records.
            <strong> The physical inspection, standard weight calibration, and tolerance testing are executed on-site or in an accredited laboratory by authorized Legal Metrology Officers (LMO) or Government Approved Test Centres (GATC)</strong>.
            The software records observations, determines pass/fail compliance, issues tamper-evident certificates, and manages lifecycle validity.
          </div>
        </div>
      </div>

      {/* Complete Lifecycle Workflow */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="text-xs uppercase tracking-wider text-amber-700 font-bold">Standard Operating Procedure</div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-gov-navy">
            6-Stage Verification & Certification Lifecycle
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Standardized end-to-end statutory process prescribed under Legal Metrology Rules.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {[
            {
              step: '01',
              title: 'Stakeholder Registration',
              desc: 'Business profile submission and statutory document verification by Admin.',
              icon: Building2
            },
            {
              step: '02',
              title: 'Verification Application',
              desc: 'Instrument details submitted for initial verification or periodic re-verification.',
              icon: FileCheck2
            },
            {
              step: '03',
              title: 'Allocation & Schedule',
              desc: 'Admin allocates application to LMO or GATC and fixes physical inspection date.',
              icon: Calendar
            },
            {
              step: '04',
              title: 'Physical Verification',
              desc: 'Authorized Officer tests repeatability, eccentricity, and applies official seal.',
              icon: Scale
            },
            {
              step: '05',
              title: 'Digital Certificate',
              desc: 'Tamper-proof digital certificate generated with dynamic cryptographic signature.',
              icon: Award
            },
            {
              step: '06',
              title: 'Live QR Verification',
              desc: 'Public scan verifies real-time status: VALID, EXPIRED, or REVOKED.',
              icon: QrCode
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-300 p-4 rounded text-left relative flex flex-col justify-between hover:border-gov-navy transition shadow-xs"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      STAGE {item.step}
                    </span>
                    <Icon size={18} className="text-gov-navy" />
                  </div>
                  <h3 className="font-bold text-xs text-gov-navy mb-1">{item.title}</h3>
                  <p className="text-[11px] text-slate-600 leading-snug">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Portal Features / Stakeholder Breakdown */}
      <div className="bg-slate-100 py-10 border-y border-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-gov-navy">
              Stakeholder Portals & Authorization Channels
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Role-Based Access Control enforcing strict separation of duties and administrative oversight.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Instrument Owner */}
            <div className="bg-white p-5 rounded border border-slate-300 shadow-xs space-y-3">
              <div className="flex items-center space-x-2 text-gov-navy font-bold text-sm">
                <Building2 size={18} className="text-gov-ashoka" />
                <span>Instrument Owner</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li>Register instruments with serial tracking</li>
                <li>Apply for new & re-verification</li>
                <li>Download & print PDF certificates</li>
                <li>Receive automated 90/30/7-day expiry alerts</li>
              </ul>
              <Link to="/login" className="text-xs font-semibold text-gov-blue hover:underline block pt-2">
                Access Owner Portal →
              </Link>
            </div>

            {/* Legal Metrology Officer */}
            <div className="bg-white p-5 rounded border border-slate-300 shadow-xs space-y-3">
              <div className="flex items-center space-x-2 text-gov-navy font-bold text-sm">
                <Scale size={18} className="text-gov-ashoka" />
                <span>Legal Metrology Officer</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li>View jurisdiction workload & schedules</li>
                <li>Mobile-friendly field verification workspace</li>
                <li>Record checklist, MPE test results & photos</li>
                <li>Submit PASS / FAIL determinations</li>
              </ul>
              <Link to="/login" className="text-xs font-semibold text-gov-blue hover:underline block pt-2">
                Access LMO Workspace →
              </Link>
            </div>

            {/* GATC */}
            <div className="bg-white p-5 rounded border border-slate-300 shadow-xs space-y-3">
              <div className="flex items-center space-x-2 text-gov-navy font-bold text-sm">
                <Award size={18} className="text-gov-ashoka" />
                <span>GATC Test Centre</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li>Independent authorized testing channel</li>
                <li>Scoped to accredited instrument categories</li>
                <li>Conduct lab-grade precision metrology</li>
                <li>Record digital test observations</li>
              </ul>
              <Link to="/login" className="text-xs font-semibold text-gov-blue hover:underline block pt-2">
                Access GATC Portal →
              </Link>
            </div>

            {/* Department Administrator */}
            <div className="bg-white p-5 rounded border border-slate-300 shadow-xs space-y-3">
              <div className="flex items-center space-x-2 text-gov-navy font-bold text-sm">
                <ShieldCheck size={18} className="text-gov-ashoka" />
                <span>Department Administrator</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li>Review & approve stakeholder accounts</li>
                <li>Allocate applications to LMO or GATC</li>
                <li>Schedule inspection appointments</li>
                <li>Revoke non-compliant certificates & audit logs</li>
              </ul>
              <Link to="/login" className="text-xs font-semibold text-gov-blue hover:underline block pt-2">
                Access Admin Portal →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
