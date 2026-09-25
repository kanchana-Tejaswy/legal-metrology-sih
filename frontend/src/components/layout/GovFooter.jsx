import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Scale, ExternalLink, HelpCircle, FileText, Phone, Mail, MapPin, Award, CheckCircle2 } from 'lucide-react';

export const GovFooter = () => {
  return (
    <footer className="bg-[#051329] text-slate-300 text-xs border-t-2 border-slate-800 mt-auto pb-safe">
      {/* Tricolor accent bar */}
      <div className="gov-tricolor-strip w-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: About the Portal */}
          <div className="space-y-3.5">
            <div className="flex items-center space-x-2.5 text-white font-bold text-sm">
              <div className="w-8 h-8 rounded-lg bg-gov-navy border border-white/15 flex items-center justify-center text-amber-400 shadow-xs">
                <Scale size={18} />
              </div>
              <span className="tracking-tight text-base font-bold">Department of Legal Metrology</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              National statutory portal established under the <strong>Legal Metrology Act, 2009</strong>.
              Facilitates transparent verification, calibration, digital stamping, and tamper-evident QR certification for commercial accuracy across India.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-amber-300 text-[11px] font-semibold">
              <Award size={13} className="text-amber-400" />
              <span>SIH 26036 • National Metrology Grid</span>
            </div>
          </div>

          {/* Col 2: Important Government Portals */}
          <div>
            <h4 className="text-white font-bold mb-3.5 uppercase tracking-wider text-xs border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>National Portals</span>
              <ExternalLink size={12} className="text-slate-500" />
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href="https://consumeraffairs.nic.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 transition flex items-center justify-between text-slate-300"
                >
                  <span>Ministry of Consumer Affairs</span>
                  <ExternalLink size={11} className="text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://india.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 transition flex items-center justify-between text-slate-300"
                >
                  <span>National Portal of India</span>
                  <ExternalLink size={11} className="text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://bis.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 transition flex items-center justify-between text-slate-300"
                >
                  <span>Bureau of Indian Standards (BIS)</span>
                  <ExternalLink size={11} className="text-slate-500" />
                </a>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-400 transition block text-slate-300">
                  Legal Metrology Act, 2009 Standards
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-amber-400 transition block text-slate-300">
                  Statutory Fee Schedule Matrix
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Citizen & Stakeholder Services */}
          <div>
            <h4 className="text-white font-bold mb-3.5 uppercase tracking-wider text-xs border-b border-slate-800 pb-2">
              Citizen Services
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/verify" className="hover:text-emerald-300 text-emerald-400 font-semibold flex items-center space-x-1.5 transition">
                  <ShieldCheck size={14} />
                  <span>Public QR & Certificate Verification</span>
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-amber-400 transition block text-slate-300">
                  Business / Trader Registration
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-amber-400 transition block text-slate-300">
                  Officer & Lab Verification Portal
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-amber-400 transition block text-slate-300">
                  GATC Accreditation Standards
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-400 transition block text-slate-300">
                  Statutory Tolerance Norms (MPE)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Grievance Redressal */}
          <div className="space-y-3">
            <h4 className="text-white font-bold mb-3.5 uppercase tracking-wider text-xs border-b border-slate-800 pb-2">
              National Helpdesk
            </h4>
            <div className="flex items-start space-x-2.5 text-slate-300 text-xs">
              <MapPin size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <span>Krishi Bhawan, Dr. Rajendra Prasad Road, New Delhi - 110001</span>
            </div>
            <div className="flex items-center space-x-2.5 text-slate-300 text-xs">
              <Phone size={15} className="text-amber-400 flex-shrink-0" />
              <a href="tel:1800114000" className="hover:text-amber-300 transition font-mono tabular-nums font-bold">
                1800-11-4000 (Toll Free)
              </a>
            </div>
            <div className="flex items-center space-x-2.5 text-slate-300 text-xs">
              <Mail size={15} className="text-amber-400 flex-shrink-0" />
              <span className="font-mono text-slate-300">support-legalmetrology@gov.in</span>
            </div>
            <div className="pt-2">
              <div className="text-[11px] text-slate-400 leading-tight">
                Working Hours: <strong>09:30 - 17:30 IST</strong> (Monday to Saturday)
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal, Accessibility & Version Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center text-[11px] text-slate-500 gap-4">
          <div className="text-center md:text-left">
            Website Content Managed by <strong>Department of Legal Metrology, Ministry of Consumer Affairs, Government of India</strong>.
          </div>

          <div className="flex flex-wrap justify-center items-center gap-3 text-slate-400">
            <span className="hover:text-slate-200 cursor-pointer transition">Privacy Policy</span>
            <span className="text-slate-700">•</span>
            <span className="hover:text-slate-200 cursor-pointer transition">Terms of Service</span>
            <span className="text-slate-700">•</span>
            <span className="hover:text-slate-200 cursor-pointer transition">Hyperlink Policy</span>
            <span className="text-slate-700">•</span>
            <span className="hover:text-slate-200 cursor-pointer transition">Accessibility Statement</span>
          </div>

          <div className="text-slate-400 font-mono text-[10px] bg-slate-800/60 px-3 py-1 rounded-full border border-slate-700/60">
            v2.4.2-gov • GIGW 3.0 Aligned
          </div>
        </div>
      </div>
    </footer>
  );
};
