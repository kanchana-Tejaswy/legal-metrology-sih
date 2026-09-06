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
    <div className="max-w-md mx-auto my-8 px-4">
      <div className="bg-white rounded border border-slate-300 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gov-navy text-white p-5 text-center border-b-2 border-amber-500">
          <div className="inline-block p-2 rounded-full bg-slate-800/80 mb-2">
            <Lock size={22} className="text-amber-400" />
          </div>
          <h2 className="text-lg font-bold font-serif">Department Single Sign-On (SSO)</h2>
          <p className="text-xs text-slate-300">
            Authorized Legal Metrology Stakeholders & Officers Portal
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="m-4 p-3 bg-red-50 border-l-4 border-red-600 text-xs text-red-800 flex items-start space-x-2">
            <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Registered Email ID
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.gov.in"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy focus:border-gov-navy"
                required
              />
              <Mail size={15} className="absolute left-3 top-2.5 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy focus:border-gov-navy"
                required
              />
              <Lock size={15} className="absolute left-3 top-2.5 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gov-navy hover:bg-gov-blue text-white py-2.5 rounded text-xs font-bold uppercase tracking-wider transition shadow flex items-center justify-center space-x-1.5 disabled:opacity-50"
          >
            {loading ? <span>Authenticating...</span> : <span>Sign In Securely</span>}
          </button>
        </form>

        {/* One-Click Quick Demo Login Suite */}
        <div className="bg-slate-50 p-4 border-t border-slate-200">
          <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2 text-center">
            One-Click Demo Roles (For Evaluators)
          </div>

          <div className="grid grid-cols-1 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setDemoCredentials('admin@legalmetrology.demo')}
              className="p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-left flex items-center justify-between transition"
            >
              <span className="font-semibold text-gov-navy">1. Department Administrator</span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">admin</span>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('owner@business.demo')}
              className="p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-left flex items-center justify-between transition"
            >
              <span className="font-semibold text-emerald-800">2. Approved Owner (ABC Supermarket)</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">approved</span>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('newapplicant@traders.demo')}
              className="p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-left flex items-center justify-between transition"
            >
              <span className="font-semibold text-amber-800">3. Pending Owner (Sri Lakshmi Traders)</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono">pending</span>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('lmo@legalmetrology.demo')}
              className="p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-left flex items-center justify-between transition"
            >
              <span className="font-semibold text-blue-800">4. Legal Metrology Officer (LMO)</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-mono">lmo</span>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('gatc@testcentre.demo')}
              className="p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-left flex items-center justify-between transition"
            >
              <span className="font-semibold text-purple-800">5. GATC Test Centre (Metro Lab)</span>
              <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-mono">gatc</span>
            </button>
          </div>

          <div className="mt-3 text-[10px] text-slate-500 text-center font-mono">
            Demo Password for all accounts: DemoPassword@2026
          </div>
        </div>

        {/* Footer Registration Link */}
        <div className="p-3 bg-slate-100 text-center border-t border-slate-200 text-xs">
          <span className="text-slate-600">New Business / Instrument Owner? </span>
          <Link to="/register" className="font-bold text-gov-blue hover:underline">
            Register Stakeholder Account
          </Link>
        </div>
      </div>
    </div>
  );
};
