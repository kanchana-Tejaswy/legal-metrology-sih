import React from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/65 backdrop-blur-[2px] flex items-center justify-center p-3 sm:p-6 animate-modal-backdrop pt-safe pb-safe"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`bg-white rounded-2xl border border-slate-200/90 shadow-elevated w-full ${maxWidth} overflow-hidden transform animate-modal-content max-w-[calc(100vw-1.5rem)]`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gov-navy text-white px-4 sm:px-6 py-3.5 sm:py-4 flex justify-between items-center border-b-2 border-amber-500">
          <h3 className="font-serif font-bold text-xs sm:text-base tracking-wide text-white truncate pr-2">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white p-2 rounded-lg hover:bg-gov-blue/80 transition btn-tactile focus:outline-none focus:ring-2 focus:ring-amber-400 min-w-[36px] min-h-[36px] flex items-center justify-center flex-shrink-0"
            aria-label="Close dialog"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto touch-scroll">{children}</div>
      </div>
    </div>
  );
};
