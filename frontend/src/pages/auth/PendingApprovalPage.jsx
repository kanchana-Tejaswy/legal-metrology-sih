import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, Clock, Phone, Building2, LogOut, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PendingApprovalPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="max-w-2xl mx-auto my-12 px-4">
      <div className="bg-white rounded border border-slate-300 shadow-xl overflow-hidden">
        <div className="bg-amber-800 text-white p-6 text-center border-b-4 border-amber-600">
          <div className="inline-block p-3 rounded-full bg-amber-900/60 mb-2">
            <Clock size={32} className="text-amber-300 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold font-serif">Stakeholder Account Pending Verification</h2>
          <div className="text-xs text-amber-200 mt-1">
            Department of Legal Metrology • Registration Review Desk
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded text-xs text-amber-900 space-y-2">
            <div className="font-bold text-sm text-amber-900">
              Welcome, {user?.full_name || 'Stakeholder'}
            </div>
            <p className="leading-relaxed">
              Your registration for <strong>"{user?.business_name || 'Business Enterprise'}"</strong> has been logged in the Department of Legal Metrology registry.
            </p>
            <p className="leading-relaxed">
              In compliance with statutory requirements, all stakeholder accounts must be formally reviewed and approved by the <strong>Department Administrator</strong> prior to granting access to instrument registration, verification scheduling, or certificate issuance.
            </p>
          </div>

          {/* Account Details Box */}
          <div className="bg-slate-50 p-4 rounded border border-slate-200 text-xs space-y-2">
            <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] border-b pb-1">
              Application Summary
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-slate-500">Registered Email:</span>
              <span className="col-span-2 font-mono font-semibold text-slate-800">{user?.email}</span>

              <span className="text-slate-500">Account Status:</span>
              <span className="col-span-2">
                <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded font-bold text-[11px]">
                  PENDING REVIEW
                </span>
              </span>

              <span className="text-slate-500">Assigned Verification Cell:</span>
              <span className="col-span-2 text-slate-800">State Legal Metrology Administration</span>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-2 text-xs text-slate-600">
            <div className="font-bold text-slate-700">Need Immediate Verification Clearance?</div>
            <p>
              Please contact your Divisional Legal Metrology Controller or call the National Consumer Grievance Desk at <strong>1800-11-4000</strong> quoting your registered email.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-semibold flex items-center justify-center space-x-1.5 transition border border-slate-300"
            >
              <RefreshCw size={14} />
              <span>Check Approval Status</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full sm:w-auto px-4 py-2 bg-gov-navy hover:bg-gov-blue text-white rounded text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
