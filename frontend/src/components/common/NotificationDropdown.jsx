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
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
        className="relative p-2 text-slate-200 hover:text-white hover:bg-gov-blue rounded transition"
        title="Department Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-300 rounded shadow-xl z-50 overflow-hidden text-slate-800">
          <div className="bg-gov-navy text-white px-4 py-2.5 flex justify-between items-center text-xs font-semibold">
            <span>Notifications ({notifications.length})</span>
            {unreadCount > 0 && (
              <span className="bg-amber-500 text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded">
                {unreadCount} Unread
              </span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">
                No notifications at this time.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 text-xs transition ${
                    n.is_read ? 'bg-white' : 'bg-blue-50/70 border-l-4 border-l-gov-blue'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start space-x-2">
                      {getIcon(n.type)}
                      <div>
                        <div className="font-semibold text-slate-900">{n.title}</div>
                        <p className="text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                        <div className="flex items-center space-x-1 text-[10px] text-slate-400 mt-1">
                          <Clock size={10} />
                          <span>{new Date(n.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {!n.is_read && (
                      <button
                        onClick={() => markAsRead(n.id)}
                        className="text-slate-400 hover:text-emerald-700 p-1"
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

          <div className="bg-slate-50 p-2 text-center border-t border-slate-200">
            <span className="text-[11px] text-slate-500">Official Legal Metrology System Alerts</span>
          </div>
        </div>
      )}
    </div>
  );
};
