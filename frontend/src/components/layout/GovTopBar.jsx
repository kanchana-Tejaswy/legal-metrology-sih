import React, { useState } from 'react';
import { Phone, Globe, Eye } from 'lucide-react';

export const GovTopBar = () => {
  const [fontSize, setFontSize] = useState('md');

  const handleFontSize = (size) => {
    setFontSize(size);
    document.documentElement.classList.remove('font-scale-sm', 'font-scale-md', 'font-scale-lg');
    document.documentElement.classList.add(`font-scale-${size}`);
  };

  return (
    <div className="w-full bg-slate-900 text-slate-200 text-xs border-b border-slate-800">
      {/* Indian Tricolor Stripe */}
      <div className="gov-tricolor-strip w-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-col sm:flex-row justify-between items-center gap-1.5 sm:gap-2">
        {/* Left: Official Government of India text */}
        <div className="flex items-center space-x-2 sm:space-x-3 text-[11px] sm:text-xs">
          <span className="font-semibold tracking-wide text-white">भारत सरकार</span>
          <span className="text-slate-500">|</span>
          <span className="font-medium text-slate-200">Government of India</span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden lg:inline text-slate-400 text-[11px]">Ministry of Consumer Affairs, Food & Public Distribution</span>
        </div>

        {/* Right: Accessibility and Helpline Controls */}
        <div className="flex items-center space-x-3 sm:space-x-4 text-[11px] sm:text-xs">
          <a
            href="tel:1800114000"
            className="flex items-center space-x-1.5 text-amber-300 hover:text-amber-200 transition font-medium"
          >
            <Phone size={12} className="flex-shrink-0" />
            <span className="hidden sm:inline text-slate-300">NCH Helpline:</span>
            <span className="font-bold tracking-wider font-mono tabular-nums">1800-11-4000</span>
          </a>

          {/* Font Resizer */}
          <div className="flex items-center space-x-1 border-l border-slate-700 pl-2.5 sm:pl-3">
            <span className="text-slate-400 mr-1 hidden sm:inline text-[10px]">Text:</span>
            <button
              type="button"
              onClick={() => handleFontSize('sm')}
              aria-label="Decrease font size"
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold btn-tactile ${
                fontSize === 'sm' ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title="Decrease Font Size"
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => handleFontSize('md')}
              aria-label="Default font size"
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold btn-tactile ${
                fontSize === 'md' ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title="Default Font Size"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => handleFontSize('lg')}
              aria-label="Increase font size"
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold btn-tactile ${
                fontSize === 'lg' ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center space-x-1 border-l border-slate-700 pl-2.5 sm:pl-3">
            <Globe size={11} className="text-slate-400" />
            <span className="text-white font-medium text-[11px]">English</span>
          </div>
        </div>
      </div>
    </div>
  );
};
