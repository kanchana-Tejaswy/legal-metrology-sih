import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/common/StatusBadge';
import { History, Calendar, CheckCircle2, XCircle, Award, Scale, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const VerificationHistoryPage = () => {
  const [instruments, setInstruments] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [instRes, appRes] = await Promise.all([
          api.getInstruments(),
          api.getApplications()
        ]);
        setInstruments(instRes.instruments || []);
        setApplications(appRes.applications || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-300 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold font-serif text-gov-navy">
          Instrument Lifecycle & Verification Audit Trail
        </h1>
        <p className="text-xs text-slate-600 mt-0.5">
          Complete statutory historical record of inspections, verifications, stamping records, and certificate renewals.
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-500">Loading lifecycle histories...</div>
      ) : instruments.length === 0 ? (
        <div className="bg-white p-8 rounded border border-slate-300 text-center text-xs text-slate-500">
          No instruments found in inventory.
        </div>
      ) : (
        <div className="space-y-6">
          {instruments.map((inst) => {
            const instApps = applications.filter((a) => a.instrument_id === inst.id);

            return (
              <div
                key={inst.id}
                className="bg-white rounded border border-slate-300 shadow-xs overflow-hidden"
              >
                {/* Instrument Summary Bar */}
                <div className="bg-slate-50 border-b border-slate-200 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <span className="font-bold text-sm text-gov-navy">{inst.instrument_type}</span>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                      {inst.manufacturer} • Model: {inst.model_number} • Serial: {inst.serial_number}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-500">Current Status:</span>
                    <StatusBadge status={inst.current_status} />
                  </div>
                </div>

                {/* Timeline Entries */}
                <div className="p-5 space-y-4">
                  <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {/* Event 1: Initial Registration */}
                    <div className="relative text-xs">
                      <div className="absolute -left-6 top-0.5 w-3 h-3 rounded-full bg-gov-navy border-2 border-white"></div>
                      <div className="font-bold text-slate-800">Instrument Enrolled in Registry</div>
                      <div className="text-[11px] text-slate-500">
                        Date: {new Date(inst.created_at).toLocaleDateString()} • Initial Capacity: {inst.max_capacity} {inst.unit}
                      </div>
                    </div>

                    {/* Applications & Verifications */}
                    {instApps.map((app) => (
                      <div key={app.id} className="relative text-xs space-y-1">
                        <div
                          className={`absolute -left-6 top-0.5 w-3 h-3 rounded-full border-2 border-white ${
                            app.status === 'COMPLETED'
                              ? 'bg-emerald-600'
                              : app.status === 'FAILED'
                              ? 'bg-red-600'
                              : 'bg-amber-500'
                          }`}
                        ></div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-slate-800">
                            {app.application_type === 'NEW' ? 'Initial Verification Application' : 'Periodic Re-Verification'}
                          </span>
                          <span className="font-mono text-[11px] text-gov-navy font-semibold">({app.id})</span>
                          <StatusBadge status={app.status} />
                        </div>

                        <div className="text-[11px] text-slate-500">
                          Applied: {new Date(app.created_at).toLocaleDateString()}
                          {app.verifier && ` • Assigned Verifier: ${app.verifier.name} [${app.verifier.type}]`}
                          {app.schedule && ` • Inspected: ${app.schedule.scheduled_date}`}
                        </div>

                        {app.status === 'COMPLETED' && inst.certificate && (
                          <div className="mt-1 bg-emerald-50 border border-emerald-200 p-2.5 rounded text-[11px] text-emerald-900 flex items-center justify-between">
                            <div className="flex items-center space-x-1.5">
                              <Award size={14} className="text-emerald-700" />
                              <span>
                                Verification PASSED: Certificate <strong>{inst.certificate.id}</strong> generated (Valid until: {inst.certificate.valid_until})
                              </span>
                            </div>
                            <Link
                              to={`/verify/${inst.certificate.id}`}
                              className="font-bold text-emerald-800 hover:underline"
                            >
                              Verify QR →
                            </Link>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
