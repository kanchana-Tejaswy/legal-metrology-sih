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
  ChevronDown
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

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gov-navy text-white shadow-md border-b-2 border-amber-600 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Main Navigation Links */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded text-xs sm:text-sm font-medium transition ${
                isActive('/') ? 'bg-gov-blue text-amber-300 font-semibold' : 'hover:bg-gov-blue hover:text-white'
              }`}
            >
              Home
            </Link>

            <Link
              to="/about"
              className={`px-3 py-1.5 rounded text-xs sm:text-sm font-medium transition ${
                isActive('/about') ? 'bg-gov-blue text-amber-300 font-semibold' : 'hover:bg-gov-blue hover:text-white'
              }`}
            >
              About
            </Link>

            <Link
              to="/services"
              className={`px-3 py-1.5 rounded text-xs sm:text-sm font-medium transition ${
                isActive('/services') ? 'bg-gov-blue text-amber-300 font-semibold' : 'hover:bg-gov-blue hover:text-white'
              }`}
            >
              Services
            </Link>

            <Link
              to="/verify"
              className={`px-3 py-1.5 rounded text-xs sm:text-sm font-medium flex items-center space-x-1 transition ${
                isActive('/verify') ? 'bg-gov-blue text-amber-300 font-semibold' : 'hover:bg-gov-blue hover:text-white'
              }`}
            >
              <ShieldCheck size={15} className="text-emerald-400" />
              <span>Certificate Verification</span>
            </Link>

            {/* Quick Access to Active Role Dashboard */}
            {user && (
              <Link
                to={getDashboardPath()}
                className={`hidden md:flex items-center space-x-1 px-3 py-1.5 rounded text-xs sm:text-sm font-semibold transition ${
                  location.pathname.startsWith('/owner') ||
                  location.pathname.startsWith('/admin') ||
                  location.pathname.startsWith('/lmo') ||
                  location.pathname.startsWith('/gatc')
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-gov-ashoka/80 hover:bg-gov-ashoka text-white'
                }`}
              >
                <LayoutDashboard size={14} />
                <span>My Dashboard</span>
              </Link>
            )}
          </div>

          {/* Right Action Controls: Notification, Profile, Login/Logout */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {user ? (
              <>
                <NotificationDropdown />

                {/* User Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 bg-gov-blue hover:bg-slate-800 px-2.5 py-1.5 rounded text-xs border border-slate-700 transition"
                  >
                    <div className="w-6 h-6 rounded bg-slate-700 flex items-center justify-center text-amber-300 font-bold">
                      {user.full_name?.[0] || 'U'}
                    </div>
                    <div className="hidden lg:block text-left leading-tight">
                      <div className="font-semibold text-white truncate max-w-[130px]">{user.full_name}</div>
                      <div className="text-[10px] text-amber-300 font-medium">{role}</div>
                    </div>
                    <ChevronDown size={14} className="text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-64 bg-white rounded border border-slate-300 shadow-xl py-1 text-slate-800 z-50 divide-y divide-slate-100"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2.5 bg-slate-50">
                        <div className="font-bold text-xs text-gov-navy">{user.full_name}</div>
                        <div className="text-[11px] text-slate-500">{user.email}</div>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className="text-[10px] bg-gov-navy text-white px-2 py-0.5 rounded font-semibold">
                            {getRoleLabel()}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              user.status === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : user.status === 'PENDING'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {user.status}
                          </span>
                        </div>
                      </div>

                      <div className="py-1 text-xs">
                        <Link
                          to={getDashboardPath()}
                          className="flex items-center space-x-2 px-4 py-2 hover:bg-slate-100 text-slate-700"
                        >
                          <LayoutDashboard size={14} />
                          <span>Official Dashboard</span>
                        </Link>
                      </div>

                      <div className="py-1 text-xs">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-red-50 text-red-700 text-left font-medium"
                        >
                          <LogOut size={14} />
                          <span>Secure Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center space-x-1 shadow-xs transition"
                >
                  <Lock size={13} />
                  <span>Portal Login</span>
                </Link>

                <Link
                  to="/register"
                  className="hidden sm:inline-flex bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 px-3 py-1.5 rounded text-xs font-medium transition"
                >
                  Stakeholder Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded text-slate-300 hover:text-white hover:bg-gov-blue"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-700 space-y-1.5 text-xs">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded hover:bg-gov-blue text-slate-200 font-medium"
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded hover:bg-gov-blue text-slate-200 font-medium"
            >
              About the Department
            </Link>
            <Link
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded hover:bg-gov-blue text-slate-200 font-medium"
            >
              Verification Services & Fee Schedule
            </Link>
            <Link
              to="/verify"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded hover:bg-gov-blue text-amber-300 font-medium"
            >
              Certificate QR & ID Verification
            </Link>
            {user ? (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded bg-amber-600 text-white font-semibold"
                >
                  Go to {role} Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-3 py-2 text-red-300 hover:bg-gov-blue"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center bg-amber-600 text-white py-2 rounded font-semibold"
                >
                  Portal Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center bg-slate-800 text-white py-2 rounded border border-slate-600"
                >
                  Register as Business Owner
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
