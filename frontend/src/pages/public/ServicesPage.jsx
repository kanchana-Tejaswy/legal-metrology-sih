import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Scale, Clock, ShieldCheck, FileCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ServicesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getCategories();
        if (res.success) setCategories(res.categories);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-300 pb-4">
        <div className="text-xs text-slate-500 mb-1">
          <Link to="/" className="hover:underline text-gov-blue">Home</Link> / Services & Fees
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-gov-navy">
          Verification Services & Statutory Fee Schedule
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Prescribed under the Legal Metrology (General) Rules, 2011.
        </p>
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded border border-slate-300 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded bg-blue-50 text-gov-navy flex items-center justify-center font-bold">
            1
          </div>
          <h3 className="font-bold text-sm text-gov-navy">Initial Stamping & Verification</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Mandatory verification conducted prior to first commercial deployment, testing conformity with Model Approval certificates.
          </p>
        </div>

        <div className="bg-white p-5 rounded border border-slate-300 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded bg-blue-50 text-gov-navy flex items-center justify-center font-bold">
            2
          </div>
          <h3 className="font-bold text-sm text-gov-navy">Periodic Re-Verification</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Annual or biennial re-stamping before current certificate expiry to ensure continuous metrological accuracy and seal integrity.
          </p>
        </div>

        <div className="bg-white p-5 rounded border border-slate-300 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded bg-blue-50 text-gov-navy flex items-center justify-center font-bold">
            3
          </div>
          <h3 className="font-bold text-sm text-gov-navy">Post-Repair Verification</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Compulsory re-verification following component replacement, load-cell servicing, or broken seal events.
          </p>
        </div>
      </div>

      {/* Categories & Fee Matrix */}
      <div className="bg-white rounded border border-slate-300 shadow-xs overflow-hidden">
        <div className="bg-gov-navy text-white px-5 py-3 flex justify-between items-center text-xs font-semibold">
          <span>Statutory Instrument Categories & Verification Cycles</span>
          <span>Schedule X Compliant</span>
        </div>

        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Category Code</th>
                <th>Instrument Category Name</th>
                <th>Accuracy Class</th>
                <th>Cycle (Months)</th>
                <th>Standard Fee (₹)</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-xs text-slate-500">
                    Loading statutory fee schedule...
                  </td>
                </tr>
              ) : (
                categories.map((c) => (
                  <tr key={c.id}>
                    <td className="font-mono font-bold text-gov-navy">{c.code}</td>
                    <td>
                      <div className="font-semibold text-slate-800">{c.name}</div>
                      <div className="text-[11px] text-slate-500">{c.description}</div>
                    </td>
                    <td>
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-semibold">
                        {c.accuracy_class}
                      </span>
                    </td>
                    <td className="font-semibold text-slate-700">{c.verification_cycle_months} Months</td>
                    <td className="font-bold text-emerald-800 font-mono">₹{c.standard_fee.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded border border-slate-300 text-xs flex justify-between items-center">
        <div>
          <span className="font-bold text-slate-800">Ready to register or apply for verification?</span>
          <p className="text-slate-500 text-[11px]">Stakeholders can register an account and apply online 24/7.</p>
        </div>
        <Link
          to="/register"
          className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-4 py-2 rounded text-xs transition"
        >
          Stakeholder Registration →
        </Link>
      </div>
    </div>
  );
};
