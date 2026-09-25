import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, ShieldCheck, UserCheck, AlertCircle, ArrowRight, CheckCircle2, KeyRound } from 'lucide-react';

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
    <div className="max-w-lg mx-auto my-4 sm:my-12 px-3 sm:px-4 text-left animate-fade-up">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-elevated overflow-hidden ring-1 ring-slate-900/5 card-hover-effect">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-[#051329] via-[#0A2540] to-[#0F2744] text-white p-5 sm:p-7 text-center border-b-4 border-amber-500 overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 space-y-1.5 sm:space-y-2">
            <div className="inline-flex p-2.5 sm:p-3 rounded-2xl bg-white/10 ring-1 ring-white/20 mb-1 backdrop-blur-md shadow-sm">
              <Lock size={22} className="text-amber-400" />
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[10px] font-mono text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>TLS 256-BIT ENCRYPTED TUNNEL</span>
            </div>

            <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight text-white">
              Sovereign Single Sign-On (SSO)
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-300 max-w-sm mx-auto font-normal">
              Department of Legal Metrology • National Verification Grid
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="m-4 sm:m-6 p-3.5 sm:p-4 bg-rose-50 border-l-4 border-rose-600 rounded-r-2xl text-xs text-rose-900 flex items-start space-x-3 animate-scale-in">
            <AlertCircle size={18} className="text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed font-medium">{error}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-4 sm:space-y-4.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex justify-between">
              <span>Registered Email ID / SSO Username</span>
              <span className="text-slate-400 text-[10px] sm:text-[11px] font-normal">e.g. name@demo.in</span>
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.gov.in"
                className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-slate-50/50 hover:bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy focus:bg-white transition-all duration-200 shadow-2xs font-medium text-slate-900 min-h-[46px]"
                required
              />
              <Mail size={17} className="absolute left-3.5 top-3.5 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex justify-between">
              <span>Security Password</span>
              <span className="text-slate-400 text-[10px] sm:text-[11px] font-normal">Min 6 characters</span>
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-slate-50/50 hover:bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy focus:bg-white transition-all duration-200 shadow-2xs font-medium text-slate-900 min-h-[46px]"
                required
              />
              <KeyRound size={17} className="absolute left-3.5 top-3.5 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-tactile shimmer-sweep w-full bg-gradient-to-r from-gov-navy via-slate-900 to-gov-navy hover:from-gov-blue hover:to-gov-navy text-white py-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 min-h-[48px]"
          >
            {loading ? <span>Authenticating Credentials...</span> : <span>Sign In to Secure Workspace</span>}
            <ArrowRight size={15} />
          </button>
        </form>

        {/* One-Click Quick Demo Login Suite */}
        <div className="bg-slate-50/80 p-4 sm:p-6 border-t border-slate-100">
          <div className="text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 text-center flex items-center justify-center space-x-2">
            <UserCheck size={16} className="text-amber-600" />
            <span>One-Click Evaluator Command Palette</span>
          </div>

          <div className="space-y-2 text-xs">
            <button
              type="button"
              onClick={() => setDemoCredentials('admin@legalmetrology.demo')}
              className="w-full p-2.5 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl text-left flex items-center justify-between transition-all duration-150 btn-tactile shadow-subtle group hover:border-gov-navy/40 min-h-[44px] gap-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-slate-800 flex-shrink-0" />
                <span className="font-bold text-gov-navy group-hover:text-gov-blue text-xs truncate">1. Administrator</span>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full font-mono font-bold border border-slate-200 flex-shrink-0">ADMIN</span>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('owner@business.demo')}
              className="w-full p-2.5 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl text-left flex items-center justify-between transition-all duration-150 btn-tactile shadow-subtle group hover:border-emerald-500/40 min-h-[44px] gap-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-emerald-600 flex-shrink-0" />
                <span className="font-bold text-emerald-950 group-hover:text-emerald-700 text-xs truncate">2. Approved Owner</span>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-600/30 px-2 py-0.5 rounded-full font-mono font-bold flex-shrink-0">APPROVED</span>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('newapplicant@traders.demo')}
              className="w-full p-2.5 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl text-left flex items-center justify-between transition-all duration-150 btn-tactile shadow-subtle group hover:border-amber-500/40 min-h-[44px] gap-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                <span className="font-bold text-amber-950 group-hover:text-amber-700 text-xs truncate">3. Pending Owner</span>
              </div>
              <span className="text-[10px] bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-600/30 px-2 py-0.5 rounded-full font-mono font-bold flex-shrink-0">PENDING</span>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('lmo@legalmetrology.demo')}
              className="w-full p-2.5 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl text-left flex items-center justify-between transition-all duration-150 btn-tactile shadow-subtle group hover:border-blue-500/40"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span className="font-bold text-blue-950 group-hover:text-blue-700">4. Legal Metrology Officer (LMO)</span>
              </div>
              <span className="text-[10px] bg-blue-50 text-blue-800 ring-1 ring-inset ring-blue-600/30 px-2.5 py-0.5 rounded-full font-mono font-bold">LMO</span>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('gatc@testcentre.demo')}
              className="w-full p-2.5 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl text-left flex items-center justify-between transition-all duration-150 btn-tactile shadow-subtle group hover:border-purple-500/40"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-600" />
                <span className="font-bold text-purple-950 group-hover:text-purple-700">5. GATC Test Centre (Metro Lab)</span>
              </div>
              <span className="text-[10px] bg-purple-50 text-purple-800 ring-1 ring-inset ring-purple-600/30 px-2.5 py-0.5 rounded-full font-mono font-bold">GATC</span>
            </button>
          </div>

          <div className="mt-3.5 text-[11px] text-slate-500 text-center font-mono">
            Default Evaluator Password: <span className="font-bold text-slate-800">DemoPassword@2026</span>
          </div>
        </div>

        {/* Footer Registration Link */}
        <div className="p-4 bg-slate-50 text-center border-t border-slate-100 text-xs text-slate-600">
          New Business / Commercial Enterprise?{' '}
          <Link to="/register" className="font-bold text-gov-navy hover:text-gov-blue transition hover:underline">
            Register Stakeholder Account →
          </Link>
        </div>
      </div>
    </div>
  );
};

