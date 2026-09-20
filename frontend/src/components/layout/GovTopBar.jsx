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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap justify-between items-center gap-2">
        {/* Left: Official Government of India text */}
        <div className="flex items-center space-x-3">
          <span className="font-semibold tracking-wide text-white">भारत सरकार</span>
          <span className="text-slate-500">|</span>
          <span className="font-medium">Government of India</span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-slate-300">Ministry of Consumer Affairs, Food & Public Distribution</span>
        </div>

        {/* Right: Accessibility and Helpline Controls */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 text-amber-300 font-medium">
            <Phone size={12} />
            <span className="hidden sm:inline">National Consumer Helpline:</span>
            <span className="font-bold tracking-wider">1800-11-4000</span>
          </div>

          {/* Font Resizer */}
          <div className="flex items-center space-x-1 border-l border-slate-700 pl-3">
            <span className="text-slate-400 mr-1 hidden sm:inline">Text Size:</span>
            <button
              onClick={() => handleFontSize('sm')}
              className={`px-1.5 py-0.5 rounded border text-[11px] font-bold ${
                fontSize === 'sm' ? 'bg-amber-500 text-slate-900 border-amber-400' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title="Decrease Font Size"
            >
              A-
            </button>
            <button
              onClick={() => handleFontSize('md')}
              className={`px-1.5 py-0.5 rounded border text-[11px] font-bold ${
                fontSize === 'md' ? 'bg-amber-500 text-slate-900 border-amber-400' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title="Default Font Size"
            >
              A
            </button>
            <button
              onClick={() => handleFontSize('lg')}
              className={`px-1.5 py-0.5 rounded border text-[11px] font-bold ${
                fontSize === 'lg' ? 'bg-amber-500 text-slate-900 border-amber-400' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          {/* Language Toggle Placeholder */}
          <div className="flex items-center space-x-1 border-l border-slate-700 pl-3">
            <Globe size={12} className="text-slate-400" />
            <span className="text-white font-semibold">English</span>
          </div>
        </div>
      </div>
    </div>
  );
};
