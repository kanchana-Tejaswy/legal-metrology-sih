import React, { useState } from 'react';
import { Phone, Globe, Type } from 'lucide-react';

export const GovTopBar = () => {
  const [fontSize, setFontSize] = useState('md');

  const handleFontSize = (size) => {
    setFontSize(size);
    document.documentElement.classList.remove('font-scale-sm', 'font-scale-md', 'font-scale-lg');
    document.documentElement.classList.add(`font-scale-${size}`);
  };

  return (
    <div className="w-full bg-[#051329] text-slate-200 text-xs border-b border-slate-800/80 relative z-50 pt-safe">
      {/* Indian Tricolor Stripe with subtle glow */}
      <div className="gov-tricolor-strip w-full"></div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1.5 sm:py-2 flex flex-col sm:flex-row justify-between items-center gap-1.5 sm:gap-2">
        {/* Left: Official Government of India text with Devanagari typography */}
        <div className="flex items-center space-x-2 sm:space-x-3 text-[11px] sm:text-xs tracking-tight text-center sm:text-left">
          <span className="font-bold text-amber-400 font-devanagari tracking-wide text-xs">भारत सरकार</span>
          <span className="text-slate-600">|</span>
          <span className="font-medium text-slate-100">Government of India</span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden lg:inline text-slate-400 text-[11px]">
            Ministry of Consumer Affairs, Food & Public Distribution
          </span>
        </div>

        {/* Right: Accessibility Font Scalers and Toll-Free Helpline */}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-4 text-[11px] sm:text-xs">
          <a
            href="tel:1800114000"
            className="flex items-center space-x-1 text-amber-300 hover:text-amber-200 transition font-medium group py-0.5"
            title="National Consumer Helpline (Toll Free)"
          >
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition flex-shrink-0">
              <Phone size={10} className="text-amber-400" />
            </div>
            <span className="hidden sm:inline text-slate-400 font-normal">Toll-Free:</span>
            <span className="font-bold tracking-wider font-mono tabular-nums text-amber-300 text-[10px] sm:text-xs">1800-11-4000</span>
          </a>

          {/* Accessible Text Resizer */}
          <div className="flex items-center space-x-1 border-l border-slate-800 pl-2 sm:pl-3">
            <span className="text-slate-400 mr-0.5 hidden md:inline text-[10px] uppercase font-semibold tracking-wider">
              Text:
            </span>
            <div className="inline-flex rounded-lg bg-slate-800/80 p-0.5 border border-slate-700/60" role="group" aria-label="Text Size Controller">
              <button
                type="button"
                onClick={() => handleFontSize('sm')}
                aria-label="Decrease font size"
                className={`px-2 py-1 sm:py-0.5 rounded text-[10px] font-bold btn-tactile transition min-w-[24px] ${
                  fontSize === 'sm'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/70'
                }`}
                title="Decrease Font Size (14.5px)"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => handleFontSize('md')}
                aria-label="Default font size"
                className={`px-2 py-1 sm:py-0.5 rounded text-[10px] font-bold btn-tactile transition min-w-[24px] ${
                  fontSize === 'md'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/70'
                }`}
                title="Standard Font Size (16px)"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => handleFontSize('lg')}
                aria-label="Increase font size"
                className={`px-2 py-1 sm:py-0.5 rounded text-[10px] font-bold btn-tactile transition min-w-[24px] ${
                  fontSize === 'lg'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/70'
                }`}
                title="Large Font Size (18px for High Legibility)"
              >
                A+
              </button>
            </div>
          </div>

          {/* Language Indicator */}
          <div className="flex items-center space-x-1 border-l border-slate-800 pl-2 sm:pl-3">
            <Globe size={12} className="text-slate-400" />
            <span className="text-slate-200 font-semibold text-[10px] sm:text-[11px]">English</span>
          </div>
        </div>
      </div>
    </div>
  );
};
