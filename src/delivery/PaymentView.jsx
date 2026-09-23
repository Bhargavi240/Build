// src/delivery/PaymentView.jsx
import React, { useState } from 'react';
import { X, Banknote, QrCode, CreditCard, Check, Copy, AlertTriangle, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function PaymentView({ order, currentUser, onClose, onBack, onCompletePayment }) {
  if (!order) return null;

  const [method, setMethod] = useState('Cash'); // 'Cash' | 'UPI' | 'Card'
  const [cashTendered, setCashTendered] = useState(order.amount || '');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [cardRefNo, setCardRefNo] = useState('');

  const money = (val) => `₹${Number(val || 0).toLocaleString('en-IN')}`;

  const payable = Number(order.amount || 0);
  const tendered = Number(cashTendered || 0);
  const changeDue = Math.max(0, tendered - payable);
  const isCashInsufficient = method === 'Cash' && tendered < payable;

  const handleCopyUpi = () => {
    const upiId = 'buildstock@icici';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  const handleConfirm = () => {
    if (isCashInsufficient) return;

    const details = {
      method,
      amount: payable,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tendered: method === 'Cash' ? tendered : payable,
      change: method === 'Cash' ? changeDue : 0,
      refNo: method === 'Card' ? cardRefNo || `POS-${Math.floor(100000 + Math.random() * 900000)}` : null,
      upiId: method === 'UPI' ? 'buildstock@icici' : null
    };

    onCompletePayment(order, method, details);
  };

  return (
    <div className="dp-modal-overlay" onClick={onClose}>
      <div className="dp-bottom-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="dp-sheet-drag-handle" />

        <div className="dp-sheet-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              className="dp-action-chip"
              onClick={onBack}
              style={{ minHeight: '32px', padding: '4px 8px' }}
            >
              <ArrowLeft size={14} /> Back
            </button>
            <h3 className="dp-sheet-title">Collect Payment</h3>
          </div>
          <button type="button" className="dp-sheet-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="dp-sheet-content">
          {/* Payable Amount Banner */}
          <div className="dp-payment-payable-card">
            <small>Total Amount to Collect</small>
            <h2>{money(payable)}</h2>
            <p>Order: <b>{order.displayId || order.id}</b> · Customer: <b>{order.customer}</b></p>
          </div>

          {/* Payment Method Selector */}
          <div style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.4px' }}>
              Select Payment Method
            </span>
          </div>

          <div className="dp-payment-mode-tabs">
            <button
              type="button"
              className={`dp-mode-btn ${method === 'Cash' ? 'active' : ''}`}
              onClick={() => setMethod('Cash')}
            >
              <Banknote size={22} color={method === 'Cash' ? '#16a34a' : '#475569'} />
              <strong>Cash</strong>
            </button>

            <button
              type="button"
              className={`dp-mode-btn ${method === 'UPI' ? 'active' : ''}`}
              onClick={() => setMethod('UPI')}
            >
              <QrCode size={22} color={method === 'UPI' ? '#16a34a' : '#475569'} />
              <strong>UPI / QR</strong>
            </button>

            <button
              type="button"
              className={`dp-mode-btn ${method === 'Card' ? 'active' : ''}`}
              onClick={() => setMethod('Card')}
            >
              <CreditCard size={22} color={method === 'Card' ? '#16a34a' : '#475569'} />
              <strong>Card POS</strong>
            </button>
          </div>

          {/* CASH MODE */}
          {method === 'Cash' && (
            <div className="dp-cash-input-box">
              <label>Amount Received from Customer (₹)</label>
              <div className="dp-currency-input-wrap">
                <span>₹</span>
                <input
                  type="number"
                  value={cashTendered}
                  onChange={(e) => setCashTendered(e.target.value)}
                  placeholder="Enter cash received"
                  autoFocus
                />
              </div>

              {/* Quick Cash Presets */}
              <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                {[payable, Math.ceil(payable / 500) * 500, Math.ceil(payable / 1000) * 1000].filter((v, i, a) => a.indexOf(v) === i && v >= payable).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    style={{
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#0f172a',
                      cursor: 'pointer'
                    }}
                    onClick={() => setCashTendered(preset)}
                  >
                    Exact {money(preset)}
                  </button>
                ))}
              </div>

              {/* Change Calculation Box */}
              <div className={`dp-change-calc-box ${changeDue > 0 ? 'has-change' : ''}`}>
                <div>
                  <span className="label">Change to Return</span>
                  <small style={{ display: 'block', fontSize: '11px', color: '#475569' }}>
                    {tendered >= payable
                      ? `Received ${money(tendered)} - Bill ${money(payable)}`
                      : 'Amount entered is less than total bill'}
                  </small>
                </div>
                <strong className="change-value">
                  {isCashInsufficient ? 'Insufficient Cash' : money(changeDue)}
                </strong>
              </div>

              {isCashInsufficient && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#dc2626',
                  fontSize: '12px',
                  fontWeight: 600,
                  marginTop: '8px'
                }}>
                  <AlertTriangle size={15} />
                  <span>Received amount cannot be less than order total ({money(payable)}).</span>
                </div>
              )}
            </div>
          )}

          {/* UPI MODE */}
          {method === 'UPI' && (
            <div className="dp-upi-qr-box">
              <p style={{ margin: '0 0 6px 0', fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                Scan QR using PhonePe, GPay, Paytm, or BHIM
              </p>
              <div className="dp-qr-card-visual">
                {/* SVG Visual QR Code with ICICI / UPI Logo Mockup */}
                <div style={{
                  width: '160px',
                  height: '160px',
                  background: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <QrCode size={140} color="#0f172a" />
                  <div style={{
                    position: 'absolute',
                    background: '#ffffff',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                    fontSize: '9px',
                    fontWeight: 900,
                    color: '#0284c7'
                  }}>
                    UPI
                  </div>
                </div>
                <div style={{ marginTop: '6px', fontWeight: 800, fontSize: '14px', color: '#0284c7' }}>
                  {money(payable)}
                </div>
              </div>

              <div className="dp-upi-copy-row">
                <span style={{ fontSize: '11px', color: '#64748b' }}>Merchant ID:</span>
                <code>buildstock@icici</code>
                <button type="button" className="dp-tiny-copy-btn" onClick={handleCopyUpi}>
                  {copiedUpi ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <small style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>
                Once customer confirms payment on their phone, tap Confirm Payment below.
              </small>
            </div>
          )}

          {/* CARD MODE */}
          {method === 'Card' && (
            <div className="dp-pos-box">
              <div className="dp-pos-status-badge">
                <CheckCircle2 size={14} /> Swiping Machine Terminal #BS-09 Connected
              </div>
              <p style={{ fontSize: '13px', color: '#0f172a', fontWeight: 600, margin: '0 0 10px 0' }}>
                Collect via Swiping Machine
              </p>

              <div style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '12px',
                textAlign: 'left'
              }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  POS Reference / Approval Code (Optional)
                </label>
                <input
                  type="text"
                  value={cardRefNo}
                  onChange={(e) => setCardRefNo(e.target.value)}
                  placeholder="e.g. POS-984210"
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 10px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="dp-sheet-actions">
          <button
            type="button"
            className="dp-btn-success"
            disabled={isCashInsufficient}
            style={{
              opacity: isCashInsufficient ? 0.5 : 1,
              cursor: isCashInsufficient ? 'not-allowed' : 'pointer',
              minHeight: '54px',
              fontSize: '16px'
            }}
            onClick={handleConfirm}
          >
            <Check size={20} />
            <span>CONFIRM PAYMENT & COMPLETE</span>
          </button>
        </div>
      </div>
    </div>
  );
}
