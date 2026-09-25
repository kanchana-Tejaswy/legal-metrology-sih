import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NotificationDropdown } from '../common/NotificationDropdown';
import {
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  Building2,
  FileCheck2,
  Lock,
  ChevronDown,
  Sparkles,
  Info,
  Layers,
  Scale
} from 'lucide-react';

export const GovNavbar = () => {
  const { user, role, isApproved, isPending, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (isPending) return '/pending-approval';
    switch (role) {
      case 'ADMIN':
        return '/admin';
      case 'LMO':
        return '/lmo';
      case 'GATC':
        return '/gatc';
      case 'OWNER':
      default:
        return '/owner';
    }
  };

  const getRoleLabel = () => {
    switch (role) {
      case 'ADMIN':
        return 'Department Administrator';
      case 'LMO':
        return 'Legal Metrology Officer';
      case 'GATC':
        return 'GATC Test Centre';
      case 'OWNER':
        return 'Instrument Owner';
      default:
        return 'Citizen / Stakeholder';
    }
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="glass-dark text-white sticky top-0 z-40 border-b border-white/10 shadow-lg backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-15">
          {/* Mobile Left Brand & Desktop Navigation Links */}
          <div className="flex items-center space-x-2">
            {/* Mobile Brand Link (shown only on small screens) */}
            <Link
              to="/"
              className="md:hidden flex items-center space-x-2 text-white font-bold text-xs sm:text-sm py-1.5 focus:outline-none"
            >
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                <Scale size={14} />
              </div>
              <span className="font-serif tracking-tight truncate max-w-[170px] sm:max-w-none">Metrology Portal</span>
            </Link>

            {/* Desktop Navigation Links (hidden on mobile, visible on md+) */}
            <div className="hidden md:flex items-center space-x-1 sm:space-x-2">
              <Link
                to="/"
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition btn-tactile ${
                  isActive('/') && location.pathname === '/'
                    ? 'bg-white/15 text-amber-300 ring-1 ring-white/20 shadow-xs'
                    : 'text-slate-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                Home
              </Link>

              <Link
                to="/about"
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition btn-tactile ${
                  isActive('/about')
                    ? 'bg-white/15 text-amber-300 ring-1 ring-white/20 shadow-xs'
                    : 'text-slate-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                About Department
              </Link>

              <Link
                to="/services"
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition btn-tactile ${
                  isActive('/services')
                    ? 'bg-white/15 text-amber-300 ring-1 ring-white/20 shadow-xs'
                    : 'text-slate-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                Services & Fee Matrix
              </Link>

              <Link
                to="/verify"
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center space-x-1.5 transition btn-tactile ${
                  isActive('/verify')
                    ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/40 shadow-xs'
                    : 'text-emerald-300 hover:bg-white/10 hover:text-emerald-200'
                }`}
              >
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>Verify Certificate</span>
              </Link>

              {/* Quick Access to Active Role Dashboard */}
              {user && (
                <Link
                  to={getDashboardPath()}
                  className={`hidden md:flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition btn-tactile ${
                    location.pathname.startsWith('/owner') ||
                    location.pathname.startsWith('/admin') ||
                    location.pathname.startsWith('/lmo') ||
                    location.pathname.startsWith('/gatc')
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-xs'
                      : 'bg-gov-ashoka hover:bg-gov-ashoka/80 text-white'
                  }`}
                >
                  <LayoutDashboard size={15} />
                  <span>My Dashboard</span>
                </Link>
              )}
            </div>
          </div>

          {/* Right Action Controls: Notification, Profile, Login/Logout */}
          <div className="flex items-center space-x-1.5 sm:space-x-3">
            {user ? (
              <>
                <NotificationDropdown />

                {/* User Profile Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-1.5 sm:space-x-2.5 bg-white/10 hover:bg-white/15 px-2 sm:px-3 py-1.5 rounded-xl text-xs border border-white/15 transition btn-tactile min-h-[38px]"
                    aria-expanded={userDropdownOpen}
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold text-xs shadow-xs flex-shrink-0">
                      {user.full_name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="hidden lg:block text-left leading-tight">
                      <div className="font-semibold text-white truncate max-w-[130px]">{user.full_name}</div>
                      <div className="text-[10px] text-amber-300 font-medium font-mono">{role}</div>
                    </div>
                    <ChevronDown size={14} className={`text-slate-300 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-68 bg-white rounded-2xl border border-slate-200/90 shadow-elevated py-2 text-slate-800 z-50 divide-y divide-slate-100 animate-modal-content"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-3 bg-slate-50/80">
                        <div className="font-bold text-sm text-gov-navy">{user.full_name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                        <div className="mt-2 flex items-center gap-1.5">
                          <span className="text-[10px] bg-gov-navy text-white px-2.5 py-0.5 rounded-md font-semibold">
                            {getRoleLabel()}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              user.status === 'APPROVED'
                                ? 'bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-600/20'
                                : user.status === 'PENDING'
                                ? 'bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-600/20'
                                : 'bg-red-50 text-red-800 ring-1 ring-inset ring-red-600/20'
                            }`}
                          >
                            {user.status}
                          </span>
                        </div>
                      </div>

                      <div className="py-1 text-xs">
                        <Link
                          to={getDashboardPath()}
                          className="flex items-center space-x-2.5 px-4 py-2.5 hover:bg-slate-50 text-slate-700 font-semibold transition"
                        >
                          <LayoutDashboard size={16} className="text-gov-ashoka" />
                          <span>Official Dashboard</span>
                        </Link>
                      </div>

                      <div className="py-1 text-xs">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2.5 px-4 py-2.5 hover:bg-red-50 text-red-700 text-left font-semibold transition"
                        >
                          <LogOut size={16} className="text-red-600" />
                          <span>Sign Out Securely</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-1.5 sm:space-x-2.5">
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 shadow-xs transition btn-tactile min-h-[38px]"
                >
                  <Lock size={13} />
                  <span>Login</span>
                </Link>

                <Link
                  to="/register"
                  className="hidden sm:inline-flex bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition btn-tactile min-h-[38px] items-center"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-200 hover:text-white hover:bg-white/15 transition min-w-[42px] min-h-[42px] flex items-center justify-center focus:outline-none"
              aria-label="Toggle Mobile Navigation"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-white/15 space-y-1 text-xs sm:text-sm animate-modal-content max-h-[80vh] overflow-y-auto touch-scroll pb-6">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl font-semibold min-h-[44px] transition ${
                location.pathname === '/' ? 'bg-white/20 text-amber-300' : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              <span>Home</span>
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl font-semibold min-h-[44px] transition ${
                location.pathname === '/about' ? 'bg-white/20 text-amber-300' : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              <span>About the Department</span>
            </Link>
            <Link
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl font-semibold min-h-[44px] transition ${
                location.pathname === '/services' ? 'bg-white/20 text-amber-300' : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              <span>Services & Fee Matrix</span>
            </Link>
            <Link
              to="/verify"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl font-bold min-h-[44px] transition ${
                location.pathname.startsWith('/verify')
                  ? 'bg-emerald-500/25 text-emerald-300 ring-1 ring-emerald-400/40'
                  : 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/20'
              }`}
            >
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>Verify Certificate (QR / ID)</span>
            </Link>

            {user ? (
              <div className="pt-2.5 mt-2 border-t border-white/10 space-y-1">
                <div className="px-3.5 py-1 text-[10px] uppercase font-bold text-amber-300/80 tracking-wider">
                  {role} Operations
                </div>

                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold min-h-[44px]"
                >
                  <LayoutDashboard size={16} />
                  <span>Main Dashboard</span>
                </Link>

                {role === 'OWNER' && (
                  <>
                    <Link
                      to="/owner/instruments"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3.5 py-2.5 rounded-xl text-slate-200 hover:bg-white/10 min-h-[44px] flex items-center font-medium"
                    >
                      My Instruments
                    </Link>
                    <Link
                      to="/owner/instruments/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3.5 py-2.5 rounded-xl text-slate-200 hover:bg-white/10 min-h-[44px] flex items-center font-medium"
                    >
                      + Register New Instrument
                    </Link>
                    <Link
                      to="/owner/apply"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3.5 py-2.5 rounded-xl text-slate-200 hover:bg-white/10 min-h-[44px] flex items-center font-medium"
                    >
                      Apply for Verification
                    </Link>
                    <Link
                      to="/owner/applications"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3.5 py-2.5 rounded-xl text-slate-200 hover:bg-white/10 min-h-[44px] flex items-center font-medium"
                    >
                      My Applications
                    </Link>
                    <Link
                      to="/owner/certificates"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3.5 py-2.5 rounded-xl text-slate-200 hover:bg-white/10 min-h-[44px] flex items-center font-medium"
                    >
                      My Certificates
                    </Link>
                    <Link
                      to="/owner/history"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3.5 py-2.5 rounded-xl text-slate-200 hover:bg-white/10 min-h-[44px] flex items-center font-medium"
                    >
                      Verification History
                    </Link>
                  </>
                )}

                {role === 'ADMIN' && (
                  <>
                    <Link
                      to="/admin/stakeholders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3.5 py-2.5 rounded-xl text-slate-200 hover:bg-white/10 min-h-[44px] flex items-center font-medium"
                    >
                      Stakeholder Approvals
                    </Link>
                    <Link
                      to="/admin/applications"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3.5 py-2.5 rounded-xl text-slate-200 hover:bg-white/10 min-h-[44px] flex items-center font-medium"
                    >
                      Application Allocation
                    </Link>
                    <Link
                      to="/admin/certificates"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3.5 py-2.5 rounded-xl text-slate-200 hover:bg-white/10 min-h-[44px] flex items-center font-medium"
                    >
                      Certificates Ledger
                    </Link>
                    <Link
                      to="/admin/audit-logs"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3.5 py-2.5 rounded-xl text-slate-200 hover:bg-white/10 min-h-[44px] flex items-center font-medium"
                    >
                      Audit Trail
                    </Link>
                  </>
                )}

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-rose-300 hover:bg-rose-500/10 font-semibold min-h-[44px] flex items-center space-x-2 mt-2"
                >
                  <LogOut size={15} />
                  <span>Sign Out Securely</span>
                </button>
              </div>
            ) : (
              <div className="pt-3 mt-2 border-t border-white/10 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 py-3 rounded-xl font-bold min-h-[44px] flex items-center justify-center"
                >
                  Portal Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center bg-white/10 text-white py-3 rounded-xl border border-white/20 font-semibold min-h-[44px] flex items-center justify-center"
                >
                  Register Commercial Establishment
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
