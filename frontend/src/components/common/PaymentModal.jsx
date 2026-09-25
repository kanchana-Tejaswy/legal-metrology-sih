/**
 * PaymentModal.jsx
 * Feature: Multi-Provider Payment Integration (Demo Provider + Razorpay Provider)
 * Branch: feature/razorpay-payment
 *
 * Uses existing Modal component and design system.
 * Handles both Demo Gateway and Razorpay Checkout.
 * Frontend only handles UI — all security verification happens on the backend.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from './Modal';
import { api } from '../../services/api';
import { IndianRupee, CreditCard, ShieldCheck, AlertCircle, Loader2, CheckCircle2, XCircle } from 'lucide-react';

/**
 * Dynamically load Razorpay checkout.js from CDN
 */
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-checkout-js')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-checkout-js';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * PaymentModal
 *
 * Props:
 *   isOpen            {boolean}
 *   onClose           {function}  — called on cancel (no payment)
 *   applicationId     {string}    — application to pay for
 *   verificationRecordId {string} — from PASS submit response
 *   onPaymentSuccess  {function}  — called with { certificate, qr_code } after backend verification
 */
export const PaymentModal = ({
  isOpen,
  onClose,
  applicationId,
  verificationRecordId,
  onPaymentSuccess
}) => {
  const [step, setStep] = useState('idle'); // idle | loading | ready | processing | success | error
  const [orderInfo, setOrderInfo] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [certificate, setCertificate] = useState(null);

  // Fetch/create payment order when modal opens
  const initiateOrder = useCallback(async () => {
    setStep('loading');
    setErrorMsg('');
    try {
      const res = await api.createPaymentOrder({
        application_id: applicationId,
        verification_record_id: verificationRecordId
      });

      if (!res.success) {
        throw new Error(res.message || 'Failed to create payment order.');
      }

      setOrderInfo(res);
      setStep('ready');
    } catch (err) {
      setErrorMsg(err.data?.message || err.message || 'Could not initiate payment. Please try again.');
      setStep('error');
    }
  }, [applicationId, verificationRecordId]);

  useEffect(() => {
    if (isOpen && step === 'idle') {
      initiateOrder();
    }
    if (!isOpen) {
      // Reset on close
      setStep('idle');
      setOrderInfo(null);
      setErrorMsg('');
      setCertificate(null);
    }
  }, [isOpen, step, initiateOrder]);

  // Handle Demo Payment Flow
  const handleDemoPay = async () => {
    setStep('processing');
    setErrorMsg('');

    try {
      const demoPaymentId = `pay_demo_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
      
      const verifyRes = await api.verifyPayment({
        order_id: orderInfo.order.id,
        payment_id: demoPaymentId,
        signature: orderInfo.order.verification_token,
        application_id: applicationId,
        verification_id: verificationRecordId
      });

      if (!verifyRes.success) {
        throw new Error(verifyRes.message || 'Backend payment verification failed.');
      }

      setCertificate(verifyRes.certificate);
      setStep('success');

      if (onPaymentSuccess) {
        onPaymentSuccess({
          certificate: verifyRes.certificate,
          qr_code: verifyRes.qr_code
        });
      }
    } catch (verifyErr) {
      setErrorMsg(
        verifyErr.data?.message ||
        verifyErr.message ||
        'Payment verification failed. Contact Legal Metrology department.'
      );
      setStep('error');
    }
  };

  // Handle Demo Failure Simulation
  const handleDemoSimulateFailure = () => {
    setErrorMsg('Payment failed: Transaction cancelled by bank or user. No certificate issued.');
  };

  // Launch Razorpay checkout popup (for Razorpay mode)
  const handleRazorpayPay = async () => {
    setStep('processing');
    setErrorMsg('');

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setErrorMsg('Could not load Razorpay checkout. Check your internet connection.');
      setStep('error');
      return;
    }

    const keyId = orderInfo.key_id || import.meta.env.VITE_RAZORPAY_KEY_ID;

    const options = {
      key: keyId,
      amount: orderInfo.order.amount,
      currency: orderInfo.order.currency,
      name: 'Dept. of Legal Metrology',
      description: `Verification Fee — ${orderInfo.instrument_info?.type || 'Instrument'} (${orderInfo.instrument_info?.serial || ''})`,
      order_id: orderInfo.order.id,
      prefill: {
        name: orderInfo.instrument_info?.owner_name || '',
      },
      theme: {
        color: '#1e3a5f'
      },
      modal: {
        ondismiss: () => {
          setStep('ready');
          setErrorMsg('Payment cancelled. You may retry to get your certificate.');
        }
      },
      handler: async (response) => {
        try {
          setStep('processing');
          const verifyRes = await api.verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            application_id: applicationId
          });

          if (!verifyRes.success) {
            throw new Error(verifyRes.message || 'Backend payment verification failed.');
          }

          setCertificate(verifyRes.certificate);
          setStep('success');

          if (onPaymentSuccess) {
            onPaymentSuccess({
              certificate: verifyRes.certificate,
              qr_code: verifyRes.qr_code
            });
          }
        } catch (verifyErr) {
          setErrorMsg(
            verifyErr.data?.message ||
            verifyErr.message ||
            'Payment verification failed. Contact Legal Metrology department.'
          );
          setStep('error');
        }
      }
    };

    // eslint-disable-next-line no-undef
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (response) => {
      setErrorMsg(`Payment failed: ${response.error?.description || 'Unknown error'}. Please retry.`);
      setStep('ready');
    });
    rzp.open();
  };

  const isDemo = orderInfo?.provider === 'demo' || orderInfo?.order?.id?.startsWith('order_demo_');

  const amountRupees = orderInfo?.order?.amount_rupees ||
    (orderInfo?.order?.amount ? (orderInfo.order.amount / 100).toFixed(2) : '100.00');

  return (
    <Modal
      isOpen={isOpen}
      onClose={step === 'success' ? onClose : onClose}
      title="Verification Fee Payment — Statutory Gate"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* Mode Notice */}
        <div className="bg-amber-50/80 border border-amber-300/80 rounded-lg p-3 text-xs text-amber-900 flex items-start space-x-2.5">
          <ShieldCheck size={16} className="flex-shrink-0 mt-0.5 text-amber-700" />
          <span className="leading-relaxed">
            {isDemo ? (
              <>
                <strong className="font-semibold">SIH DEMO MODE</strong> — Statutory verification fee gate active. Simulated payment with server-side HMAC signature verification.
              </>
            ) : (
              <>
                <strong className="font-semibold">RAZORPAY TEST MODE</strong> — Use Razorpay test card: <code className="bg-amber-100/90 px-1 py-0.5 rounded font-mono text-[11px]">4111 1111 1111 1111</code>, any CVV.
              </>
            )}
          </span>
        </div>

        {/* Loading order */}
        {step === 'loading' && (
          <div className="flex flex-col items-center py-8 space-y-3">
            <Loader2 size={32} className="text-gov-navy animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Preparing official statutory payment order...</p>
          </div>
        )}

        {/* Ready to pay */}
        {(step === 'ready' || step === 'processing') && orderInfo && (
          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-200/90 rounded-lg p-4 space-y-2.5 shadow-2xs">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Instrument</span>
                <span className="font-medium text-slate-800">
                  {orderInfo.instrument_info?.type || 'Weighing/Measuring Instrument'}
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Serial No.</span>
                <span className="font-mono font-medium text-slate-800 tabular-nums">
                  {orderInfo.instrument_info?.serial || '—'}
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Order ID</span>
                <span className="font-mono text-[11px] text-slate-700 tabular-nums">{orderInfo.order.id}</span>
              </div>
              <div className="border-t border-slate-200 pt-2.5 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700">Verification Fee (Rule 14)</span>
                <span className="text-lg font-bold text-gov-navy flex items-center tabular-nums font-serif">
                  <IndianRupee size={16} className="mr-0.5" />
                  {amountRupees}
                </span>
              </div>
            </div>

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2 text-xs text-red-800">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={isDemo ? handleDemoPay : handleRazorpayPay}
              disabled={step === 'processing'}
              className="w-full bg-gov-navy hover:bg-gov-blue text-white py-2.5 sm:py-3 rounded-md font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 btn-tactile shadow-sm disabled:opacity-60"
              id="pay-confirm-btn"
            >
              {step === 'processing' ? (
                <><Loader2 size={16} className="animate-spin" /><span>Verifying Transaction...</span></>
              ) : (
                <><CreditCard size={16} /><span>Pay ₹{amountRupees} — {isDemo ? 'Confirm Demo Payment' : 'TEST Checkout'}</span></>
              )}
            </button>

            {/* Demo Failure Simulator (Only in Demo Mode) */}
            {isDemo && step !== 'processing' && (
              <button
                type="button"
                onClick={handleDemoSimulateFailure}
                className="w-full border border-red-200 text-red-700 hover:bg-red-50/80 py-2.5 rounded-lg text-xs font-medium transition btn-tactile flex items-center justify-center space-x-1.5 min-h-[40px]"
              >
                <XCircle size={13} />
                <span>Simulate Payment Failure (Test Negative Case)</span>
              </button>
            )}

            {/* Cancel / Dismiss */}
            <button
              type="button"
              onClick={onClose}
              disabled={step === 'processing'}
              className="w-full border border-slate-200 text-slate-600 hover:bg-slate-50 py-2.5 rounded-lg text-xs font-medium transition btn-tactile disabled:opacity-60 min-h-[40px]"
            >
              Cancel — Do Not Issue Certificate
            </button>
          </div>
        )}

        {/* Error state */}
        {step === 'error' && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-300 rounded p-4 flex items-start space-x-2 text-xs text-red-800">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{errorMsg || 'An error occurred during payment.'}</span>
            </div>
            <button
              type="button"
              onClick={initiateOrder}
              className="w-full bg-gov-navy hover:bg-gov-blue text-white py-2.5 rounded font-semibold text-xs transition"
            >
              Retry Payment
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full border border-slate-300 text-slate-600 hover:bg-slate-50 py-2 rounded text-xs font-medium transition"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Success state */}
        {step === 'success' && certificate && (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-300 rounded p-4 space-y-2 text-xs text-emerald-900">
              <div className="flex items-center space-x-2 font-bold text-emerald-800">
                <CheckCircle2 size={16} />
                <span>Payment Verified — Certificate Issued</span>
              </div>
              <div>Certificate ID: <strong className="font-mono text-sm">{certificate.id}</strong></div>
              <div>Valid Until: <strong>{certificate.valid_until}</strong></div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded font-semibold text-xs transition"
            >
              View Certificate & QR Code →
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};
