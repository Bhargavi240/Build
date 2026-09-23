// src/delivery/LockedOrderModal.jsx
import React from 'react';
import { Lock, X, Phone, MapPin, CheckCircle2, ArrowRight, ShieldCheck, Navigation } from 'lucide-react';

export default function LockedOrderModal({ order, currentUser, onClose, onDelivered }) {
  if (!order) return null;

  const money = (val) => `₹${Number(val || 0).toLocaleString('en-IN')}`;

  return (
    <div className="dp-modal-overlay" onClick={onClose}>
      <div className="dp-bottom-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="dp-sheet-drag-handle" />

        <div className="dp-sheet-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              background: '#0284c7',
              color: '#ffffff',
              borderRadius: '6px',
              padding: '3px 8px',
              fontSize: '11px',
              fontWeight: 800
            }}>
              LOCKED
            </span>
            <span className="dp-order-id-tag">{order.displayId || order.id}</span>
          </div>
          <button type="button" className="dp-sheet-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="dp-sheet-content">
          {/* Prominent Locked Order Banner */}
          <div className="dp-locked-banner">
            <Lock size={24} />
            <div>
              <strong>ORDER ASSIGNED & LOCKED TO YOU</strong>
              <span>
                Assigned to {order.assignedTo || currentUser.name} ({currentUser.id}) · {order.assignedAt || 'Just now'}
              </span>
            </div>
          </div>

          {/* Customer & Call Banner */}
          <div className="dp-customer-block">
            <div className="dp-customer-meta">
              <small style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                Customer Name
              </small>
              <h4>{order.customer}</h4>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                Contact for delivery instructions & gate entry
              </p>
            </div>
            <a
              href={`tel:${order.phone}`}
              className="dp-phone-btn"
              style={{ padding: '8px 14px', borderRadius: '10px' }}
            >
              <Phone size={15} /> <span>Call Customer</span>
            </a>
          </div>

          {/* Delivery Address with Navigation CTA */}
          <div className="dp-address-box">
            <MapPin size={22} />
            <div style={{ flex: 1 }}>
              <small style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                Delivery Destination
              </small>
              <p style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>
                {order.address}
              </p>
              <div style={{ marginTop: '8px' }}>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(order.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#0284c7',
                    textDecoration: 'none',
                    background: '#e0f2fe',
                    padding: '4px 10px',
                    borderRadius: '6px'
                  }}
                >
                  <Navigation size={13} /> Open in Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* Items Checklist */}
          <div className="dp-items-list-box">
            <h5>Items in this Order ({order.quantity || 1} units)</h5>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={16} color="#16a34a" />
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>{item.name}</span>
                    </div>
                    <strong style={{ color: '#0f172a' }}>{item.qty} {item.unit || 'PCS'}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <div className="dp-item-chip-row">
                <span className="dp-item-chip">{order.product} ({order.quantity} PCS)</span>
              </div>
            )}
          </div>

          {/* Total Payable Card */}
          <div style={{
            background: '#f8fafc',
            border: '2px dashed #0284c7',
            borderRadius: '12px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px'
          }}>
            <div>
              <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                Total Collection Due
              </span>
              <small style={{ fontSize: '11px', color: '#0369a1' }}>Collect from customer upon drop</small>
            </div>
            <strong style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>
              {money(order.amount)}
            </strong>
          </div>
        </div>

        {/* Action Button: DELIVERED */}
        <div className="dp-sheet-actions" style={{ flexDirection: 'column', gap: '8px' }}>
          <button
            type="button"
            className="dp-btn-success"
            onClick={() => onDelivered(order)}
            style={{ width: '100%', minHeight: '54px', fontSize: '17px' }}
          >
            <CheckCircle2 size={22} />
            <span>DELIVERED (Collect Payment)</span>
          </button>
          <button
            type="button"
            className="dp-btn-secondary"
            onClick={onClose}
            style={{ width: '100%', minHeight: '44px', border: 'none', color: '#64748b' }}
          >
            Close & Keep Active in My Delivery Tab
          </button>
        </div>
      </div>
    </div>
  );
}
