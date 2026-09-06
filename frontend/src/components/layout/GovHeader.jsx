import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Scale } from 'lucide-react';

export const GovHeader = () => {
  return (
    <header className="bg-white border-b border-slate-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left: Department Emblem Placeholder & Official Hierarchy */}
        <Link to="/" className="flex items-center space-x-3.5 group text-left">
          {/* Circular Emblem Seal Placeholder */}
          <div className="relative flex-shrink-0">
            <img
              src="/emblem.svg"
              alt="Department of Legal Metrology Seal"
              className="w-16 h-16 object-contain"
            />
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-600 font-bold">
              Government of India
            </div>
            <div className="text-base sm:text-lg md:text-xl font-bold text-gov-navy leading-tight font-serif">
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
        <div className="flex items-center space-x-4">
          <Link
            to="/verify"
            className="flex items-center space-x-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 px-3.5 py-2 rounded text-xs font-semibold shadow-xs transition"
          >
            <ShieldCheck size={18} className="text-emerald-700" />
            <div className="text-left">
              <div className="font-bold">Verify Certificate</div>
              <div className="text-[10px] text-emerald-700 font-normal">Live QR & ID Lookup</div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-2 border-l border-slate-300 pl-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-gov-navy">
              <Scale size={22} />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-slate-800">SIH 26036</div>
              <div className="text-[10px] text-slate-500">Legal Metrology Portal</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
