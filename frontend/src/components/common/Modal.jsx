import React from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/65 backdrop-blur-[2px] flex items-center justify-center p-4 sm:p-6 animate-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`bg-white rounded-xl border border-slate-200/90 shadow-elevated w-full ${maxWidth} overflow-hidden transform animate-modal-content`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gov-navy text-white px-5 sm:px-6 py-4 flex justify-between items-center border-b-2 border-amber-500">
          <h3 className="font-serif font-bold text-sm sm:text-base tracking-wide text-white">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1.5 rounded-md hover:bg-gov-blue/80 transition btn-tactile focus:outline-none focus:ring-2 focus:ring-amber-400"
            aria-label="Close dialog"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 max-h-[82vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
