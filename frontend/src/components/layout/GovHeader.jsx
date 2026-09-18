import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Scale } from 'lucide-react';

export const GovHeader = () => {
  return (
    <header className="bg-white border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left: Department Emblem & Official Hierarchy */}
        <Link to="/" className="flex items-center space-x-3.5 group text-left">
          <div className="relative flex-shrink-0">
            <img
              src="/emblem.svg"
              alt="Department of Legal Metrology Seal"
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain group-hover:scale-[1.02] transition-transform duration-200"
            />
          </div>

          <div>
            <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-500 font-bold">
              Government of India
            </div>
            <div className="text-base sm:text-lg md:text-xl font-bold text-gov-navy leading-tight font-serif tracking-tight">
              Department of Legal Metrology
            </div>
            <div className="text-xs sm:text-sm font-semibold text-gov-ashoka">
              Online Verification & Certification System
            </div>
            <div className="text-[10px] text-slate-500 tracking-tight">
              (Statutory Verification Under Legal Metrology Act, 2009)
            </div>
          </div>
        </Link>

        {/* Right: National Portal Indicators & Verification Quick Badge */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Link
            to="/verify"
            className="flex items-center space-x-2.5 bg-emerald-50/90 hover:bg-emerald-100 text-emerald-950 ring-1 ring-inset ring-emerald-600/30 px-3.5 py-2 rounded-lg text-xs font-semibold shadow-2xs transition btn-tactile"
          >
            <ShieldCheck size={19} className="text-emerald-700 flex-shrink-0" />
            <div className="text-left leading-snug">
              <div className="font-bold text-emerald-900">Verify Certificate</div>
              <div className="text-[10px] text-emerald-700 font-medium">Live QR & ID Lookup</div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-2.5 border-l border-slate-200 pl-4">
            <div className="w-10 h-10 rounded-full bg-slate-100/80 border border-slate-200 flex items-center justify-center text-gov-navy shadow-2xs">
              <Scale size={20} />
            </div>
            <div className="text-left leading-tight">
              <div className="text-xs font-bold text-slate-800 font-mono">SIH 26036</div>
              <div className="text-[10px] text-slate-500">Legal Metrology Portal</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
