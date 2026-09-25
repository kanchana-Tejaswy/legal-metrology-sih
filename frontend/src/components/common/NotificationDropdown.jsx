import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Clock, AlertTriangle, ShieldAlert, Info } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { Link } from 'react-router-dom';

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'ALERT':
        return <ShieldAlert size={16} className="text-red-600 flex-shrink-0" />;
      case 'WARNING':
      case 'EXPIRY':
        return <AlertTriangle size={16} className="text-amber-600 flex-shrink-0" />;
      default:
        return <Info size={16} className="text-gov-ashoka flex-shrink-0" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-200 hover:text-white hover:bg-gov-blue rounded-xl transition min-w-[38px] min-h-[38px] flex items-center justify-center focus:outline-none"
        title="Department Notifications"
        aria-label="Department Notifications"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-x-3 top-14 sm:absolute sm:inset-x-auto sm:top-auto sm:right-0 sm:mt-2 sm:w-96 bg-white border border-slate-200/90 rounded-2xl shadow-elevated z-50 overflow-hidden text-slate-800 animate-scale-in">
          <div className="bg-gradient-to-r from-gov-navy to-slate-900 text-white px-4 py-3 flex justify-between items-center text-xs font-semibold border-b border-white/10">
            <span className="tracking-wide">Official Notifications ({notifications.length})</span>
            {unreadCount > 0 && (
              <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                {unreadCount} Unread
              </span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No notifications at this time.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3.5 text-xs transition-colors duration-150 ${
                    n.is_read ? 'bg-white hover:bg-slate-50/70' : 'bg-sky-50/60 hover:bg-sky-50/90 border-l-4 border-l-gov-blue'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-start space-x-2.5">
                      <div className="mt-0.5">{getIcon(n.type)}</div>
                      <div>
                        <div className="font-semibold text-slate-900">{n.title}</div>
                        <p className="text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                        <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 mt-1.5 font-mono">
                          <Clock size={10} />
                          <span>{new Date(n.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {!n.is_read && (
                      <button
                        onClick={() => markAsRead(n.id)}
                        className="btn-tactile text-slate-400 hover:text-emerald-700 p-1.5 rounded-lg hover:bg-white transition"
                        title="Mark as Read"
                      >
                        <Check size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="bg-slate-50/80 p-2.5 text-center border-t border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium">Official Legal Metrology System Alerts</span>
          </div>
        </div>
      )}
    </div>
  );
};
