import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, ShieldCheck, UserCheck, AlertCircle, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await login(email, password);
      
      // Route based on approval status and role
      if (user.status === 'PENDING') {
        navigate('/pending-approval');
      } else {
        switch (user.role) {
          case 'ADMIN':
            navigate('/admin');
            break;
          case 'LMO':
            navigate('/lmo');
            break;
          case 'GATC':
            navigate('/gatc');
            break;
          case 'OWNER':
          default:
            navigate('/owner');
            break;
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (demoEmail, demoPassword = 'DemoPassword@2026') => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
  };

  return (
    <div className="max-w-lg mx-auto my-8 sm:my-12 px-4">
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-elevated overflow-hidden ring-1 ring-slate-900/5">
        {/* Header */}
        <div className="bg-gov-navy text-white p-6 text-center border-b-2 border-amber-500">
          <div className="inline-flex p-2.5 rounded-full bg-white/10 ring-1 ring-white/20 mb-2.5">
            <Lock size={22} className="text-amber-400" />
          </div>
          <h2 className="text-xl font-bold font-serif tracking-tight text-white">Department Single Sign-On (SSO)</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Authorized Legal Metrology Stakeholders & Officers Portal
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="m-5 p-3.5 bg-red-50/90 border-l-4 border-red-600 rounded-r-lg text-xs text-red-800 flex items-start space-x-2.5">
            <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Registered Email ID
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.gov.in"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-md focus:ring-1 focus:ring-gov-navy focus:border-gov-navy transition shadow-2xs"
                required
              />
              <Mail size={15} className="absolute left-3 top-2.5 sm:top-3 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-md focus:ring-1 focus:ring-gov-navy focus:border-gov-navy transition shadow-2xs"
                required
              />
              <Lock size={15} className="absolute left-3 top-2.5 sm:top-3 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gov-navy hover:bg-gov-blue text-white py-2.5 sm:py-3 rounded-md text-xs sm:text-sm font-semibold transition btn-tactile shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? <span>Authenticating...</span> : <span>Sign In Securely</span>}
          </button>
        </form>

        {/* One-Click Quick Demo Login Suite */}
        <div className="bg-slate-50/80 p-5 border-t border-slate-200/90">
          <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2.5 text-center flex items-center justify-center space-x-1.5">
            <UserCheck size={14} className="text-amber-600" />
            <span>One-Click Evaluator Demo Accounts</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <button
              type="button"
              onClick={() => setDemoCredentials('admin@legalmetrology.demo')}
              className="w-full p-2 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-lg text-left flex items-center justify-between transition btn-tactile shadow-2xs"
            >
              <span className="font-semibold text-gov-navy">1. Department Administrator</span>
              <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-mono border border-slate-200">admin</span>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('owner@business.demo')}
              className="w-full p-2 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-lg text-left flex items-center justify-between transition btn-tactile shadow-2xs"
            >
              <span className="font-semibold text-emerald-900">2. Approved Owner (ABC Supermarket)</span>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-600/20 px-2 py-0.5 rounded-full font-mono">approved</span>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('newapplicant@traders.demo')}
              className="w-full p-2 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-lg text-left flex items-center justify-between transition btn-tactile shadow-2xs"
            >
              <span className="font-semibold text-amber-900">3. Pending Owner (Sri Lakshmi Traders)</span>
              <span className="text-[10px] bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-600/20 px-2 py-0.5 rounded-full font-mono">pending</span>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('lmo@legalmetrology.demo')}
              className="w-full p-2 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-lg text-left flex items-center justify-between transition btn-tactile shadow-2xs"
            >
              <span className="font-semibold text-blue-900">4. Legal Metrology Officer (LMO)</span>
              <span className="text-[10px] bg-blue-50 text-blue-800 ring-1 ring-inset ring-blue-600/20 px-2 py-0.5 rounded-full font-mono">lmo</span>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('gatc@testcentre.demo')}
              className="w-full p-2 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-lg text-left flex items-center justify-between transition btn-tactile shadow-2xs"
            >
              <span className="font-semibold text-purple-900">5. GATC Test Centre (Metro Lab)</span>
              <span className="text-[10px] bg-purple-50 text-purple-800 ring-1 ring-inset ring-purple-600/20 px-2 py-0.5 rounded-full font-mono">gatc</span>
            </button>
          </div>

          <div className="mt-3 text-[10px] text-slate-500 text-center font-mono">
            Demo Password for all roles: <span className="font-semibold text-slate-700">DemoPassword@2026</span>
          </div>
        </div>

        {/* Footer Registration Link */}
        <div className="p-3.5 bg-slate-100/80 text-center border-t border-slate-200/80 text-xs">
          <span className="text-slate-600">New Business / Instrument Owner? </span>
          <Link to="/register" className="font-semibold text-gov-blue hover:underline">
            Register Stakeholder Account
          </Link>
        </div>
      </div>
    </div>
  );
};
