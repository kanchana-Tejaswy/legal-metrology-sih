import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Scale, Sparkles, CheckCircle, Award } from 'lucide-react';

export const GovHeader = () => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs relative z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-4 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
        {/* Left: Department Emblem & Official Sovereign Hierarchy */}
        <Link to="/" className="flex items-center space-x-3 sm:space-x-4 group text-left w-full md:w-auto">
          <div className="relative flex-shrink-0">
            <div className="w-11 h-11 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/90 p-1 sm:p-1.5 flex items-center justify-center shadow-subtle group-hover:border-amber-500/50 group-hover:shadow-md transition-all duration-300">
              <img
                src="/emblem.svg"
                alt="Department of Legal Metrology Seal"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] sm:text-[10px] shadow-sm border-2 border-white ring-1 ring-emerald-500/30">
              <CheckCircle size={10} className="sm:hidden" />
              <CheckCircle size={11} className="hidden sm:inline" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-[9px] sm:text-[11px] uppercase tracking-wider sm:tracking-widest text-slate-500 font-bold flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-slate-700">Government of India</span>
              <span className="w-1 h-1 rounded-full bg-amber-500 inline-block"></span>
              <span className="text-amber-800 font-devanagari font-bold">भारत सरकार</span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[9px] font-mono text-amber-800 font-semibold">
                NATIONAL SOVEREIGN PORTAL
              </span>
            </div>
            <div className="text-base sm:text-xl md:text-2xl font-extrabold text-gov-navy leading-tight tracking-tight flex items-center gap-2 truncate">
              <span>Department of Legal Metrology</span>
            </div>
            <div className="text-[11px] sm:text-sm font-semibold text-gov-ashoka flex items-center gap-1.5 sm:gap-2 mt-0.5">
              <span>Online Verification &amp; Certification</span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="text-[11px] text-slate-500 font-normal hidden sm:inline">Legal Metrology Act, 2009</span>
            </div>
          </div>
        </Link>

        {/* Right: National Portal Indicators & Verification Quick CTA */}
        <div className="flex items-center space-x-2.5 sm:space-x-4 w-full md:w-auto justify-end">
          <Link
            to="/verify"
            className="flex items-center space-x-2 sm:space-x-2.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 hover:from-emerald-100 hover:to-teal-100 text-emerald-950 ring-1 ring-inset ring-emerald-600/30 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-semibold shadow-subtle hover:shadow-md transition-all duration-200 btn-tactile group shimmer-sweep w-full sm:w-auto justify-center"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform flex-shrink-0">
              <ShieldCheck size={16} className="sm:hidden" />
              <ShieldCheck size={18} className="hidden sm:inline" />
            </div>
            <div className="text-left leading-tight">
              <div className="font-bold text-emerald-950 text-xs sm:text-sm flex items-center gap-1.5">
                <span>Verify Certificate</span>
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-ping inline-block"></span>
              </div>
              <div className="text-[9px] sm:text-[10px] text-emerald-700 font-medium">Instant QR &amp; Ledger Lookup</div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-2.5 border-l border-slate-200 pl-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center justify-center text-gov-navy shadow-subtle">
              <Scale size={20} className="text-gov-navy" />
            </div>
            <div className="text-left leading-tight">
              <div className="text-xs font-bold text-slate-900 font-mono tracking-tight flex items-center gap-1">
                <span>SIH-26036</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium">National Metrology Grid</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

