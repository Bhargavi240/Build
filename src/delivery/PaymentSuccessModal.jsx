// src/delivery/PaymentSuccessModal.jsx
import React from 'react';
import { Check, ArrowRight, Package, Calendar, CreditCard, Banknote, QrCode } from 'lucide-react';

export default function PaymentSuccessModal({ order, details, onClose }) {
  if (!order) return null;

  const money = (val) => `₹${Number(val || 0).toLocaleString('en-IN')}`;

  const method = details?.method || order.paymentMethod || 'Cash';
  const deliveredAt = order.deliveredAt || details?.time || 'Just now';

  return (
    <div className="dp-modal-overlay">
      <div className="dp-bottom-sheet" style={{ maxHeight: '95vh' }}>
        <div className="dp-sheet-drag-handle" />

        <div className="dp-sheet-content dp-success-modal-content">
          <div className="dp-success-icon-wrap">
            <Check size={44} strokeWidth={3} />
          </div>

          <h2>Delivery Completed!</h2>
          <p>Payment successfully collected and order confirmed as delivered.</p>

          {/* Delivery & Payment Receipt Slip */}
          <div className="dp-receipt-slip">
            <div className="dp-receipt-row">
              <span style={{ color: '#64748b' }}>Order Number</span>
              <strong style={{ fontFamily: 'monospace', color: '#0284c7' }}>
                {order.displayId || order.id}
              </strong>
            </div>

            <div className="dp-receipt-row">
              <span style={{ color: '#64748b' }}>Customer</span>
              <strong>{order.customer}</strong>
            </div>

            <div className="dp-receipt-row">
              <span style={{ color: '#64748b' }}>Payment Mode</span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontWeight: 700,
                color: method === 'Cash' ? '#16a34a' : method === 'UPI' ? '#0284c7' : '#8b5cf6'
              }}>
                {method === 'Cash' && <Banknote size={14} />}
                {method === 'UPI' && <QrCode size={14} />}
                {method === 'Card' && <CreditCard size={14} />}
                {method}
              </span>
            </div>

            {method === 'Cash' && details?.change > 0 && (
              <div className="dp-receipt-row">
                <span style={{ color: '#64748b' }}>Change Returned</span>
                <span style={{ fontWeight: 600, color: '#16a34a' }}>{money(details.change)}</span>
              </div>
            )}

            {method === 'Card' && details?.refNo && (
              <div className="dp-receipt-row">
                <span style={{ color: '#64748b' }}>POS Reference</span>
                <span style={{ fontFamily: 'monospace', fontSize: '11px' }}>{details.refNo}</span>
              </div>
            )}

            <div className="dp-receipt-row">
              <span style={{ color: '#64748b' }}>Timestamp</span>
              <span style={{ color: '#475569' }}>{deliveredAt}</span>
            </div>

            <div className="dp-receipt-row total">
              <span>Amount Collected</span>
              <span style={{ color: '#16a34a' }}>{money(order.amount)}</span>
            </div>
          </div>

          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '10px',
            padding: '10px 14px',
            fontSize: '12px',
            color: '#15803d',
            marginBottom: '10px',
            textAlign: 'left'
          }}>
            ✓ Added to your <b>Personal Monthly Record</b>. Warehouse & Admin systems have been updated in real-time.
          </div>
        </div>

        <div className="dp-sheet-actions">
          <button
            type="button"
            className="dp-btn-primary"
            style={{ width: '100%', minHeight: '52px', fontSize: '16px' }}
            onClick={onClose}
          >
            <span>BACK TO ORDERS</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
