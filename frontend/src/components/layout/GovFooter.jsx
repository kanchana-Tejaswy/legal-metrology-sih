import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Scale, ExternalLink, HelpCircle, FileText, Phone, Mail, MapPin } from 'lucide-react';

export const GovFooter = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 text-xs border-t-4 border-gov-navy mt-auto">
      {/* Tricolor accent bar */}
      <div className="gov-tricolor-strip w-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: About the Portal */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-white font-serif font-bold text-sm">
              <Scale size={18} className="text-amber-400" />
              <span>Department of Legal Metrology</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Statutory verification portal established under the Legal Metrology Act, 2009.
              Facilitates end-to-end digital lifecycle management of weighing and measuring instruments across India.
            </p>
            <div className="text-[11px] text-amber-400 font-medium">
              SIH 26036 - Online Verification System Prototype
            </div>
          </div>

          {/* Col 2: Important Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px] border-b border-slate-700 pb-1">
              Important Links
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <a
                  href="https://consumeraffairs.nic.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 flex items-center space-x-1"
                >
                  <span>Ministry of Consumer Affairs</span>
                  <ExternalLink size={10} />
                </a>
              </li>
              <li>
                <a
                  href="https://india.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 flex items-center space-x-1"
                >
                  <span>National Portal of India</span>
                  <ExternalLink size={10} />
                </a>
              </li>
              <li>
                <a
                  href="https://bis.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 flex items-center space-x-1"
                >
                  <span>Bureau of Indian Standards (BIS)</span>
                  <ExternalLink size={10} />
                </a>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-400">
                  Legal Metrology Act, 2009 Overview
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-amber-400">
                  Standard Verification Fee Matrix
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px] border-b border-slate-700 pb-1">
              Portal Services
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link to="/verify" className="hover:text-amber-400 flex items-center space-x-1">
                  <ShieldCheck size={12} className="text-emerald-400" />
                  <span>Public QR & Certificate Verification</span>
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-amber-400">
                  Stakeholder Business Registration
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-amber-400">
                  Officer & Verifier Portal
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-amber-400">
                  GATC Accreditation Standards
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Nodal Office */}
          <div className="space-y-2 text-[11px]">
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px] border-b border-slate-700 pb-1">
              Contact & Grievance
            </h4>
            <div className="flex items-start space-x-2 text-slate-300">
              <MapPin size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <span>Krishi Bhawan, Dr. Rajendra Prasad Road, New Delhi - 110001</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <Phone size={14} className="text-amber-400 flex-shrink-0" />
              <span>Toll Free: 1800-11-4000 (Mon-Sat 09:30 - 17:30)</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <Mail size={14} className="text-amber-400 flex-shrink-0" />
              <span>support-legalmetrology@gov.in</span>
            </div>
          </div>
        </div>

        {/* Bottom Legal, Accessibility & Version Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-500 gap-3">
          <div>
            Website Content Managed by <strong>Department of Legal Metrology, Ministry of Consumer Affairs, Government of India</strong>.
          </div>

          <div className="flex items-center space-x-4">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span>|</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms & Conditions</span>
            <span>|</span>
            <span className="hover:text-slate-300 cursor-pointer">Hyperlink Policy</span>
            <span>|</span>
            <span className="hover:text-slate-300 cursor-pointer">Accessibility Statement</span>
          </div>

          <div className="text-slate-400 font-mono">
            Portal Version 2.4.1-gov | NIC Portal Guidelines Aligned
          </div>
        </div>
      </div>
    </footer>
  );
};
