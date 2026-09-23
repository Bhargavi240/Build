// src/delivery/TakeOrderModal.jsx
import React from 'react';
import { X, Package, MapPin, Phone, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';

export default function TakeOrderModal({ order, currentUser, onClose, onConfirm }) {
  if (!order) return null;

  const money = (val) => `₹${Number(val || 0).toLocaleString('en-IN')}`;

  return (
    <div className="dp-modal-overlay" onClick={onClose}>
      <div className="dp-bottom-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="dp-sheet-drag-handle" />

        <div className="dp-sheet-header">
          <div>
            <span className="dp-order-id-tag">{order.displayId || order.id}</span>
            <h3 className="dp-sheet-title">Take Order for Delivery</h3>
          </div>
          <button type="button" className="dp-sheet-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="dp-sheet-content">
          {/* Dispatch Verification Notice */}
          <div style={{
            background: '#e0f2fe',
            border: '1px solid #bae6fd',
            borderRadius: '12px',
            padding: '12px 14px',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <ShieldCheck size={22} color="#0284c7" />
            <div>
              <strong style={{ fontSize: '13px', color: '#0369a1', display: 'block' }}>
                Lock Order to Your Shift
              </strong>
              <span style={{ fontSize: '11px', color: '#0284c7' }}>
                Taking this order will lock it exclusively to you. Other partners will not see it in the queue.
              </span>
            </div>
          </div>

          {/* Customer & Location Details */}
          <div className="dp-customer-block" style={{ marginBottom: '14px' }}>
            <div className="dp-customer-meta">
              <small style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                Customer
              </small>
              <h4>{order.customer}</h4>
              <a href={`tel:${order.phone}`} className="dp-phone-btn" style={{ marginTop: '4px' }}>
                <Phone size={13} /> {order.phone}
              </a>
            </div>
            <div className="dp-amount-display" style={{ textAlign: 'right' }}>
              <small>Payable Amount</small>
              <strong style={{ color: '#0284c7', fontSize: '22px' }}>{money(order.amount)}</strong>
            </div>
          </div>

          {/* Address */}
          <div className="dp-address-box">
            <MapPin size={18} />
            <div>
              <small style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                Delivery Address
              </small>
              <p>{order.address}</p>
            </div>
          </div>

          {/* Items Checklist */}
          <div className="dp-items-list-box">
            <h5>Items to Collect from Warehouse ({order.quantity || 1} Total Units)</h5>
            {order.itemsList && order.itemsList.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {order.itemsList.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '13px'
                    }}
                  >
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{item.name}</span>
                    <strong style={{ color: '#0284c7' }}>{item.qty} {item.unit || 'PCS'}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <div className="dp-item-chip-row">
                <span className="dp-item-chip">{order.product} ({order.quantity} PCS)</span>
              </div>
            )}
          </div>

          {/* Assignee Confirmation Card */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '12px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={18} color="#0f766e" />
              <div>
                <small style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                  Assigned Partner
                </small>
                <strong style={{ fontSize: '13px', display: 'block', color: '#0f172a' }}>
                  {currentUser.name} ({currentUser.id})
                </strong>
              </div>
            </div>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              background: '#ccfbf1',
              color: '#0f766e',
              padding: '3px 8px',
              borderRadius: '6px'
            }}>
              On Duty
            </span>
          </div>
        </div>

        <div className="dp-sheet-actions">
          <button type="button" className="dp-btn-secondary" style={{ flex: 1 }} onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="dp-btn-primary"
            style={{ flex: 2, minHeight: '52px' }}
            onClick={() => onConfirm(order)}
          >
            <span>Confirm & Take Order</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
