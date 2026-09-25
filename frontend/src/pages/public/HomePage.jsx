import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  FileCheck2,
  Scale,
  Calendar,
  QrCode,
  Building2,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Clock,
  Award,
  Sparkles,
  Users,
  Search,
  CheckCircle,
  HelpCircle,
  Smartphone,
  ChevronRight,
  Activity,
  Layers,
  Cpu,
  Lock,
  Zap,
  Globe,
  Radio,
  FileText
} from 'lucide-react';

export const HomePage = () => {
  const navigate = useNavigate();
  const [quickCertId, setQuickCertId] = useState('CERT-2026-000101');
  const [activeCategory, setActiveCategory] = useState(0);

  // Live Simulated Verified Activity Stream
  const liveVerifications = [
    {
      id: 'CERT-2026-000101',
      type: 'Commercial Weighing Scale (Class III)',
      entity: 'Metro Supermarket Pvt Ltd, Mumbai',
      state: 'Maharashtra',
      time: 'Just now',
      status: 'VERIFIED PASS',
      hash: '0x8f2a...c4e1'
    },
    {
      id: 'CERT-2026-000245',
      type: 'Industrial Weighbridge (50 Ton)',
      entity: 'Tata Steel Logistics Depot, Jamshedpur',
      state: 'Jharkhand',
      time: '2 mins ago',
      status: 'VERIFIED PASS',
      hash: '0x3d7b...9a02'
    },
    {
      id: 'CERT-2026-000312',
      type: 'Fuel Dispensing Unit (High Speed)',
      entity: 'Indian Oil Retail Outlet #492, Bengaluru',
      state: 'Karnataka',
      time: '5 mins ago',
      status: 'VERIFIED PASS',
      hash: '0x1e99...bf44'
    },
    {
      id: 'CERT-2026-000489',
      type: 'High Precision Gold Balance (Class II)',
      entity: 'Kalyan Jewellers Showroom, Chennai',
      state: 'Tamil Nadu',
      time: '8 mins ago',
      status: 'VERIFIED PASS',
      hash: '0x7c41...ee88'
    }
  ];

  const instrumentCategories = [
    {
      title: 'Commercial Retail Scales',
      classType: 'Accuracy Class III',
      tolerance: '± 0.5g to ± 5g',
      cycle: 'Annual (12 Months)',
      description: 'Used in grocery, supermarkets, general stores, and retail trade. Must bear mandatory verified government holographic seal.',
      standards: 'OIML R 76-1 / Legal Metrology (General) Rules 2011'
    },
    {
      title: 'Industrial Heavy Weighbridges',
      classType: 'Accuracy Class IV / Medium',
      tolerance: '± 20kg per 50,000kg',
      cycle: 'Annual (12 Months)',
      description: 'Axle and pitless weighbridges for freight transport, ports, mining, and highway weight enforcement.',
      standards: 'OIML R 134 / Schedule VI Weights & Measures'
    },
    {
      title: 'High Precision Bullion Balances',
      classType: 'Accuracy Class I & II',
      tolerance: '± 0.1mg to ± 1mg',
      cycle: 'Annual (12 Months)',
      description: 'Micro-precision balances for gold, platinum, jewellery, pharmaceutical formulations, and chemical assays.',
      standards: 'OIML R 76 Class I & II High Precision Standard'
    },
    {
      title: 'Fuel & LPG Dispensing Pumps',
      classType: 'Accuracy Class 0.5',
      tolerance: '± 0.3% per 5 Litres',
      cycle: 'Bi-Annual (6 to 12 Months)',
      description: 'Automated petrol, diesel, and compressed natural gas (CNG) flow metering dispensers at retail fuel outlets.',
      standards: 'OIML R 117 / Petroleum Statutory Guidelines'
    }
  ];

  const handleQuickVerify = (e) => {
    e.preventDefault();
    if (quickCertId.trim()) {
      navigate(`/verify/${encodeURIComponent(quickCertId.trim())}`);
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1Cr Ultra-Luxury Sovereign Hero Section */}
      <div className="relative bg-[#051329] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-500 shadow-2xl overflow-hidden mesh-grid-pattern">
        {/* Subtle Ambient Background Glowing Orbs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none animate-float-slow"></div>
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-float"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-float-slow"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          {/* Hero Left Content with Staggered Entrance */}
          <div className="lg:col-span-7 space-y-6 text-left animate-fade-up">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500/15 via-amber-400/20 to-amber-500/10 border border-amber-400/40 text-amber-300 text-xs px-3.5 py-1.5 rounded-full shadow-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="font-bold tracking-wide font-mono uppercase text-[11px]">
                National Trust Network • ISO/IEC 17025 Metrology Grid
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight leading-[1.12] text-white">
              National Digital Verification
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-100 to-emerald-300 font-extrabold mt-1">
                &amp; Certification Authority
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
              Empowering 1.4+ billion Indian citizens and commercial enterprises with cryptographic tamper-evident legal metrology certification, automated inspector scheduling, and instant public QR validation.
            </p>

            {/* Sovereign CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-3.5">
              <Link
                to="/register"
                className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 transition-all duration-200 btn-tactile group shimmer-sweep ring-2 ring-amber-400/40 min-h-[44px]"
              >
                <span>Enroll Commercial Enterprise</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>

              <Link
                to="/verify"
                className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 transition-all duration-200 border border-emerald-400/40 btn-tactile shimmer-sweep min-h-[44px]"
              >
                <QrCode size={16} />
                <span>Verify Digital Certificate</span>
              </Link>

              <Link
                to="/login"
                className="bg-white/10 hover:bg-white/20 text-slate-200 border border-white/20 text-xs sm:text-sm px-5 py-3.5 rounded-xl transition-all duration-200 btn-tactile font-semibold backdrop-blur-md min-h-[44px] flex items-center justify-center"
              >
                Officer / Lab Login
              </Link>
            </div>

            {/* National Trust Pillars */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 border-t border-white/10 max-w-xl text-[11px] sm:text-xs text-slate-300">
              <div className="flex items-center gap-2 hover:text-white transition">
                <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                <span className="font-medium">100% Cryptographic Audit</span>
              </div>
              <div className="flex items-center gap-2 hover:text-white transition">
                <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                <span className="font-medium">Tamper-Evident QR</span>
              </div>
              <div className="flex items-center gap-2 hover:text-white transition">
                <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                <span className="font-medium">GIGW &amp; W3C Compliant</span>
              </div>
            </div>
          </div>

          {/* Quick Verification Lookup Card with Laser Scan Simulator */}
          <div className="lg:col-span-5 animate-scale-in">
            <div className="bg-white text-slate-900 rounded-2xl border border-slate-200/90 shadow-2xl p-6 sm:p-7 relative overflow-hidden card-hover-effect">
              {/* Laser scan line effect */}
              <div className="laser-scan-line"></div>

              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
                <div className="flex items-center space-x-3 text-gov-navy font-bold text-base">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-100 text-emerald-800 flex items-center justify-center shadow-xs border border-emerald-200/60">
                    <ShieldCheck size={22} className="text-emerald-700" />
                  </div>
                  <div>
                    <div className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                      Live Certificate Verification
                    </div>
                    <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Connected to National Ledger</span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded font-bold">
                  LIVE 2026
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Enter any official certificate number or scan the QR code to verify validity, legal tolerances, and officer digital signature.
              </p>

              <form onSubmit={handleQuickVerify} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex justify-between">
                    <span>Certificate Identifier</span>
                    <span className="text-slate-400 font-normal lowercase">format: CERT-YYYY-XXXXXX</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={quickCertId}
                      onChange={(e) => setQuickCertId(e.target.value)}
                      placeholder="e.g. CERT-2026-000101"
                      className="w-full px-4 py-3 text-xs sm:text-sm border border-slate-300 rounded-xl font-mono tabular-nums focus:ring-2 focus:ring-gov-navy focus:border-gov-navy uppercase transition shadow-xs font-bold text-slate-900 bg-slate-50/50 hover:bg-white"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-tactile shimmer-sweep w-full bg-gradient-to-r from-gov-navy via-slate-900 to-gov-navy hover:from-gov-blue hover:to-gov-navy text-white py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Search size={16} />
                  <span>Verify Status on National Registry</span>
                </button>
              </form>

              {/* Sample quick picks */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-semibold text-[11px]">Live Demos:</span>
                <div className="flex gap-2 font-mono">
                  <button
                    type="button"
                    onClick={() => setQuickCertId('CERT-2026-000101')}
                    className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg font-bold hover:bg-emerald-100 transition btn-tactile hover:scale-105"
                  >
                    ✓ CERT-2026-000101
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickCertId('CERT-2025-000088')}
                    className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg font-bold hover:bg-amber-100 transition btn-tactile hover:scale-105"
                  >
                    ⚠ CERT-2025-000088
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sovereign National Telemetry KPI Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-elevated card-hover-effect text-left relative overflow-hidden">
            <div className="w-2 h-2 rounded-full bg-emerald-500 absolute top-4 right-4 animate-ping"></div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Certified Instruments</div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-gov-navy mt-1 tracking-tight">
              1,42,890+
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
              <span>↑ +18.4%</span>
              <span className="text-slate-500 font-normal">this fiscal year</span>
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-elevated card-hover-effect text-left relative overflow-hidden">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Tamper-Proof Integrity</div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-700 mt-1 tracking-tight">
              99.99%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Zero cryptographic forgery recorded
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-elevated card-hover-effect text-left relative overflow-hidden">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Average Turnaround (TAT)</div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-700 mt-1 tracking-tight">
              1.8 Days
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Application to physical stamping
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-elevated card-hover-effect text-left relative overflow-hidden">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Accredited GATC Labs</div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-gov-blue mt-1 tracking-tight">
              248 Active
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Across 28 States &amp; 8 UTs
            </div>
          </div>
        </div>
      </div>

      {/* Live National Metrology Ledger Stream */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-[#051329] text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/10 pb-4 mb-5">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
              <div>
                <h3 className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-2">
                  <span>Live National Verification Ledger</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-400/30">
                    REAL-TIME SYNC
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Public statutory certification transactions recorded on government ledger</p>
              </div>
            </div>
            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
              <Lock size={12} className="text-emerald-400" />
              <span>SHA-256 Digest Network</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {liveVerifications.map((item, idx) => (
              <div
                key={idx}
                className="bg-white/5 hover:bg-white/10 p-4 rounded-2xl border border-white/10 transition-all duration-200 space-y-2.5 text-left backdrop-blur-sm card-hover-effect"
              >
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs font-bold text-amber-400">{item.id}</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {item.status}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-white leading-tight">{item.type}</div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">{item.entity}</div>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>{item.state}</span>
                  <span className="text-slate-300">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Metrology Instrument Category Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs uppercase tracking-wider text-gov-navy font-bold bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            Statutory Scope &amp; Specifications
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gov-navy tracking-tight mt-2">
            Regulated Metrology Categories
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
            Accuracy classes, Maximum Permissible Error (MPE) thresholds, and statutory calibration intervals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Category Tabs */}
          <div className="lg:col-span-5 space-y-2.5">
            {instrumentCategories.map((cat, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveCategory(idx)}
                className={`btn-tactile w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between ${
                  activeCategory === idx
                    ? 'bg-gov-navy text-white border-gov-navy shadow-md ring-2 ring-amber-400/40'
                    : 'bg-white text-slate-800 border-slate-200/90 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="font-bold text-xs sm:text-sm">{cat.title}</div>
                  <div className={`text-[11px] font-mono mt-0.5 ${activeCategory === idx ? 'text-amber-300' : 'text-slate-500'}`}>
                    {cat.classType}
                  </div>
                </div>
                <ChevronRight size={18} className={activeCategory === idx ? 'text-amber-400' : 'text-slate-400'} />
              </button>
            ))}
          </div>

          {/* Category Detail Showcase Card */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-elevated text-left space-y-5 animate-scale-in">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    {instrumentCategories[activeCategory].classType}
                  </span>
                  <h3 className="text-xl font-bold text-gov-navy mt-2">
                    {instrumentCategories[activeCategory].title}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-gov-navy shadow-subtle">
                  <Scale size={24} />
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {instrumentCategories[activeCategory].description}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                  <div className="text-[10px] uppercase font-bold text-slate-500">MPE Tolerance Limit</div>
                  <div className="text-xs sm:text-sm font-bold font-mono text-gov-navy mt-0.5">
                    {instrumentCategories[activeCategory].tolerance}
                  </div>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Statutory Re-verification</div>
                  <div className="text-xs sm:text-sm font-bold font-mono text-emerald-800 mt-0.5">
                    {instrumentCategories[activeCategory].cycle}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-2">
                <Award size={14} className="text-amber-600 flex-shrink-0" />
                <span>Statutory Authority: <strong>{instrumentCategories[activeCategory].standards}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Citizen 3-Step Guide: How It Works for Everyone */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-wider text-amber-800 font-bold bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200/80">
            Citizen &amp; Business Flow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gov-navy tracking-tight mt-2">
            How Verification Works for Everyone
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
            Effortless and transparent for local shopkeepers, commercial traders, and everyday citizens.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-elevated card-hover-effect space-y-4 text-left relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200/80 flex items-center justify-center text-amber-800 font-bold text-lg group-hover:scale-105 transition-all duration-200 shadow-subtle">
              01
            </div>
            <h3 className="text-base font-bold text-gov-navy">Register &amp; Apply Online</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Business owners register once, upload premises details, and submit their weighing instruments for verification without standing in queues.
            </p>
            <div className="pt-2 text-xs font-semibold text-amber-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Fast 5-minute digital onboarding</span>
              <ChevronRight size={14} />
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-elevated card-hover-effect space-y-4 text-left relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200/80 flex items-center justify-center text-gov-blue font-bold text-lg group-hover:scale-105 transition-all duration-200 shadow-subtle">
              02
            </div>
            <h3 className="text-base font-bold text-gov-navy">Officer Inspection &amp; Stamping</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              An authorized Legal Metrology Officer (LMO) visits your shop or lab, tests accuracy tolerances with standard weights, and applies official seals.
            </p>
            <div className="pt-2 text-xs font-semibold text-gov-blue flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Standard MPE Tolerance Tests</span>
              <ChevronRight size={14} />
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-elevated card-hover-effect space-y-4 text-left relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200/80 flex items-center justify-center text-emerald-800 font-bold text-lg group-hover:scale-105 transition-all duration-200 shadow-subtle">
              03
            </div>
            <h3 className="text-base font-bold text-gov-navy">Digital Certificate &amp; QR Code</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Receive your tamper-proof certificate instantly. Display the QR code on your weighing scale so any customer or inspector can scan and verify authenticity.
            </p>
            <div className="pt-2 text-xs font-semibold text-emerald-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Live Public Authenticity</span>
              <ChevronRight size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* Complete 6-Stage Statutory Lifecycle Workflow */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50/80 p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs uppercase tracking-wider text-gov-ashoka font-bold">Standard Operating Procedure</span>
            <h2 className="text-xl sm:text-2xl font-bold text-gov-navy tracking-tight mt-1">
              6-Stage Statutory Verification Lifecycle
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              End-to-end statutory process governed by Legal Metrology (General) Rules.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              {
                step: '01',
                title: 'Stakeholder Registration',
                desc: 'Business profile submission and statutory document verification by Admin.',
                icon: Building2
              },
              {
                step: '02',
                title: 'Verification Application',
                desc: 'Instrument details submitted for initial verification or periodic re-verification.',
                icon: FileCheck2
              },
              {
                step: '03',
                title: 'Allocation & Schedule',
                desc: 'Admin allocates application to LMO or GATC and fixes physical inspection date.',
                icon: Calendar
              },
              {
                step: '04',
                title: 'Physical Verification',
                desc: 'Authorized Officer tests repeatability, eccentricity, and applies official seal.',
                icon: Scale
              },
              {
                step: '05',
                title: 'Digital Certificate',
                desc: 'Tamper-proof digital certificate generated with dynamic cryptographic signature.',
                icon: Award
              },
              {
                step: '06',
                title: 'Live QR Verification',
                desc: 'Public scan verifies real-time status: VALID, EXPIRED, or REVOKED.',
                icon: QrCode
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className={`bg-white border border-slate-200/90 p-5 rounded-2xl text-left relative flex flex-col justify-between hover:border-gov-navy card-hover-effect shadow-subtle stagger-${idx + 1}`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/80 tabular-nums">
                        STAGE {item.step}
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-gov-navy group-hover:bg-gov-navy group-hover:text-white transition">
                        <Icon size={16} />
                      </div>
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-gov-navy mb-1.5 leading-snug">{item.title}</h3>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stakeholder Portals Breakdown */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-wider text-gov-navy font-bold">Authorized Portals</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gov-navy tracking-tight mt-1">
            Dedicated Workspaces for Every Role
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
            Role-Based Access Control enforcing strict separation of duties and administrative oversight.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Instrument Owner */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-elevated card-hover-effect space-y-4 flex flex-col justify-between text-left">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-gov-blue flex items-center justify-center shadow-subtle border border-blue-200/60">
                <Building2 size={22} />
              </div>
              <h3 className="font-bold text-base text-gov-navy">Instrument Owner</h3>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-start gap-1.5">
                  <CheckCircle size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Register instruments &amp; track serial numbers</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Apply for initial &amp; periodic re-verification</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Instant PDF certificate &amp; QR downloads</span>
                </li>
              </ul>
            </div>
            <Link
              to="/login"
              className="mt-4 w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-gov-navy hover:text-white text-gov-navy font-bold text-xs text-center transition border border-slate-200 shadow-xs btn-tactile block"
            >
              Access Owner Portal →
            </Link>
          </div>

          {/* Legal Metrology Officer */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-elevated card-hover-effect space-y-4 flex flex-col justify-between text-left">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shadow-subtle border border-amber-200/60">
                <Scale size={22} />
              </div>
              <h3 className="font-bold text-base text-gov-navy">Legal Metrology Officer</h3>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-start gap-1.5">
                  <CheckCircle size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Jurisdiction inspection schedules &amp; workload</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Mobile-friendly field inspection workspace</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Submit statutory PASS / FAIL determinations</span>
                </li>
              </ul>
            </div>
            <Link
              to="/login"
              className="mt-4 w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-gov-navy hover:text-white text-gov-navy font-bold text-xs text-center transition border border-slate-200 shadow-xs btn-tactile block"
            >
              Access LMO Workspace →
            </Link>
          </div>

          {/* GATC Test Centre */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-elevated card-hover-effect space-y-4 flex flex-col justify-between text-left">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shadow-subtle border border-purple-200/60">
                <Award size={22} />
              </div>
              <h3 className="font-bold text-base text-gov-navy">GATC Test Centre</h3>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-start gap-1.5">
                  <CheckCircle size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Government Approved Test Centre channel</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Scoped to accredited instrument categories</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Digital observation certificates</span>
                </li>
              </ul>
            </div>
            <Link
              to="/login"
              className="mt-4 w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-gov-navy hover:text-white text-gov-navy font-bold text-xs text-center transition border border-slate-200 shadow-xs btn-tactile block"
            >
              Access GATC Portal →
            </Link>
          </div>

          {/* Department Admin */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-elevated card-hover-effect space-y-4 flex flex-col justify-between text-left">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-subtle border border-emerald-200/60">
                <ShieldCheck size={22} />
              </div>
              <h3 className="font-bold text-base text-gov-navy">Department Admin</h3>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-start gap-1.5">
                  <CheckCircle size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Review &amp; approve stakeholder accounts</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Allocate applications to LMO or GATC labs</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Revocation authority &amp; tamper audit logs</span>
                </li>
              </ul>
            </div>
            <Link
              to="/login"
              className="mt-4 w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-gov-navy hover:text-white text-gov-navy font-bold text-xs text-center transition border border-slate-200 shadow-xs btn-tactile block"
            >
              Access Admin Portal →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

