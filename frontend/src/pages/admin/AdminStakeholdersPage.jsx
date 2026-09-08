import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Users, CheckCircle2, XCircle, FileText, AlertCircle, Building2, Phone, Mail } from 'lucide-react';

export const AdminStakeholdersPage = () => {
  const [stakeholders, setStakeholders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStakeholder, setSelectedStakeholder] = useState(null);
  const [actionType, setActionType] = useState(null); // 'APPROVED' or 'REJECTED'
  const [reviewNotes, setReviewNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const fetchStakeholders = async () => {
    try {
      setLoading(true);
      const res = await api.getStakeholders();
      if (res.success) {
        setStakeholders(res.stakeholders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStakeholders();
  }, []);

  const handleOpenAction = (stakeholder, type) => {
    setSelectedStakeholder(stakeholder);
    setActionType(type);
    setReviewNotes(
      type === 'APPROVED'
        ? 'Verified trade registration and valid premises address. Account approved for instrument registration.'
        : 'Trade license document verification failed. Please submit a valid municipal trade permit.'
    );
    setError(null);
  };

  const handleConfirmAction = async () => {
    if (!selectedStakeholder || !actionType) return;
    setProcessing(true);
    setError(null);

    try {
      const res = await api.updateStakeholderStatus(selectedStakeholder.id, {
        status: actionType,
        notes: reviewNotes
      });

      if (res.success) {
        setSelectedStakeholder(null);
        setActionType(null);
        fetchStakeholders();
      }
    } catch (err) {
      setError(err.data?.message || err.message || 'Failed to update stakeholder status.');
    } finally {
      setProcessing(false);
    }
  };

  const columns = [
    {
      header: 'Business & Owner Details',
      render: (row) => (
        <div>
          <div className="font-bold text-gov-navy text-xs">
            {row.stakeholder?.business_name || 'Business Enterprise'}
          </div>
          <div className="text-[11px] text-slate-700 font-medium">Applicant: {row.full_name}</div>
          <div className="text-[10px] text-slate-500 font-mono">{row.email}</div>
        </div>
      )
    },
    {
      header: 'Premises Address',
      render: (row) => (
        <div className="text-xs text-slate-600 max-w-xs truncate">
          {row.stakeholder?.business_address || 'Registered Office'}
          <div className="text-[10px] text-slate-400">
            {row.stakeholder?.district}, {row.stakeholder?.state} - {row.stakeholder?.pincode}
          </div>
        </div>
      )
    },
    {
      header: 'Statutory Credentials',
      render: (row) => (
        <div className="text-[11px] space-y-0.5">
          <div>
            <span className="text-slate-400">Trade Lic: </span>
            <span className="font-mono font-semibold text-slate-700">
              {row.stakeholder?.trade_license_no || 'N/A'}
            </span>
          </div>
          {row.stakeholder?.gstin && (
            <div>
              <span className="text-slate-400">GSTIN: </span>
              <span className="font-mono font-semibold text-slate-700">{row.stakeholder.gstin}</span>
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Registration Date',
      render: (row) => (
        <span className="text-xs text-slate-600">
          {new Date(row.created_at).toLocaleDateString()}
        </span>
      )
    },
    {
      header: 'Account Status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Administrative Actions',
      render: (row) => (
        <div className="flex items-center space-x-2">
          {row.status === 'PENDING' ? (
            <>
              <button
                onClick={() => handleOpenAction(row, 'APPROVED')}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1 rounded text-xs font-semibold flex items-center space-x-1 shadow-xs transition"
              >
                <CheckCircle2 size={12} />
                <span>Approve</span>
              </button>
              <button
                onClick={() => handleOpenAction(row, 'REJECTED')}
                className="bg-red-700 hover:bg-red-800 text-white px-2.5 py-1 rounded text-xs font-semibold flex items-center space-x-1 shadow-xs transition"
              >
                <XCircle size={12} />
                <span>Reject</span>
              </button>
            </>
          ) : (
            <span className="text-[11px] text-slate-500 font-medium italic">Reviewed</span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-300 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold font-serif text-gov-navy">
          Stakeholder Verification & Approvals Desk
        </h1>
        <p className="text-xs text-slate-600 mt-0.5">
          Review business credentials, trade licenses, and identity documents before granting instrument owners access to the statutory portal.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={stakeholders}
        loading={loading}
        searchPlaceholder="Filter stakeholders by name, business, trade license, status..."
      />

      {/* Approval / Rejection Modal */}
      <Modal
        isOpen={Boolean(selectedStakeholder && actionType)}
        onClose={() => {
          setSelectedStakeholder(null);
          setActionType(null);
        }}
        title={`Stakeholder Review: ${actionType === 'APPROVED' ? 'Approve Account' : 'Reject Registration'}`}
      >
        {selectedStakeholder && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-1.5">
              <div className="font-bold text-sm text-gov-navy">
                {selectedStakeholder.stakeholder?.business_name || 'Business Enterprise'}
              </div>
              <div className="text-slate-600">Applicant: {selectedStakeholder.full_name}</div>
              <div className="text-slate-600 font-mono">Email: {selectedStakeholder.email}</div>
              <div className="text-slate-600">
                Trade License: <strong>{selectedStakeholder.stakeholder?.trade_license_no || 'None'}</strong>
              </div>
              <div className="text-slate-600">
                Premises: {selectedStakeholder.stakeholder?.business_address}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-300 text-red-800 rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Administrative Review Notes & Compliance Decision *
              </label>
              <textarea
                rows={3}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-navy"
                required
              />
              <p className="text-[10px] text-slate-500 mt-1">
                These notes will be logged in the permanent audit trail and communicated to the stakeholder.
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setSelectedStakeholder(null);
                  setActionType(null);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={processing}
                onClick={handleConfirmAction}
                className={`px-4 py-2 rounded text-xs font-bold text-white shadow-xs transition ${
                  actionType === 'APPROVED'
                    ? 'bg-emerald-700 hover:bg-emerald-800'
                    : 'bg-red-700 hover:bg-red-800'
                }`}
              >
                {processing ? 'Processing...' : `Confirm ${actionType}`}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
