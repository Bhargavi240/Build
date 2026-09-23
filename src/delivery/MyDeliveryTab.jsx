// src/delivery/MyDeliveryTab.jsx
import React from 'react';
import {
  Package, MapPin, Phone, CheckCircle2, Lock, Navigation,
  Clock3, AlertCircle, ArrowRight, Truck, Store, MapPinned, ChevronRight
} from 'lucide-react';

export default function MyDeliveryTab({
  activeDelivery,
  currentUser,
  onDelivered,
  onGoToOrders,
  onUpdateTransitStage
}) {
  const money = (val) => `₹${Number(val || 0).toLocaleString('en-IN')}`;

  if (!activeDelivery) {
    return (
      <div>
        <div className="dp-section-header">
          <h2 className="dp-section-title">My Active Delivery</h2>
          <p className="dp-section-sub">Your assigned drops in progress</p>
        </div>

        <div className="dp-empty-state" style={{ marginTop: '20px', padding: '50px 20px' }}>
          <div className="dp-empty-icon" style={{ background: '#f1f5f9', color: '#64748b' }}>
            <Package size={36} />
          </div>
          <h3>No Active Delivery</h3>
          <p>
            You do not currently have any orders locked or assigned to your shift.
          </p>
          <button
            type="button"
            className="dp-btn-primary"
            onClick={onGoToOrders}
            style={{ minHeight: '48px', padding: '0 24px' }}
          >
            <span>Browse Available Orders</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  const currentStage = activeDelivery.transitStage || 'pickup';

  const stages = [
    { key: 'pickup', label: 'Warehouse Pickup', icon: Store, desc: 'Load & verify cargo' },
    { key: 'in_transit', label: 'In Transit', icon: Truck, desc: 'En route to customer' },
    { key: 'arrived', label: 'Arrival & Handover', icon: MapPinned, desc: 'Collect & complete' }
  ];

  const getStageIndex = (st) => {
    if (st === 'pickup') return 0;
    if (st === 'in_transit') return 1;
    if (st === 'arrived' || st === 'delivered') return 2;
    return 0;
  };

  const currentIndex = getStageIndex(currentStage);

  return (
    <div>
      <div className="dp-section-header">
        <div className="dp-section-title-row">
          <div>
            <h2 className="dp-section-title">Current Delivery</h2>
            <p className="dp-section-sub">Drop in progress · Complete & collect payment</p>
          </div>
          <span className="dp-duty-status">
            <span className="dp-pulse-dot" /> {stages[currentIndex].label}
          </span>
        </div>
      </div>

      {/* Transit Stage Progress Bar */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '16px',
        marginBottom: '16px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b' }}>
            Transit Lifecycle Progression
          </span>
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            background: '#e0f2fe',
            color: '#0284c7',
            padding: '2px 8px',
            borderRadius: '999px'
          }}>
            Step {currentIndex + 1} of 3
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {stages.map((stage, idx) => {
            const isCompleted = currentIndex > idx;
            const isCurrent = currentIndex === idx;
            const Icon = stage.icon;

            return (
              <React.Fragment key={stage.key}>
                <div style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '4px'
                }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: isCompleted ? '#16a34a' : isCurrent ? '#0284c7' : '#f1f5f9',
                    color: isCompleted || isCurrent ? '#ffffff' : '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isCurrent ? '0 0 0 3px rgba(2, 132, 199, 0.2)' : 'none',
                    transition: 'all 0.3s ease'
                  }}>
                    {isCompleted ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                  </div>
                  <strong style={{
                    fontSize: '11px',
                    color: isCurrent ? '#0284c7' : isCompleted ? '#16a34a' : '#64748b',
                    fontWeight: isCurrent ? 800 : 600
                  }}>
                    {stage.label}
                  </strong>
                </div>
                {idx < stages.length - 1 && (
                  <div style={{
                    height: '2px',
                    flex: '0 0 20px',
                    background: currentIndex > idx ? '#16a34a' : '#e2e8f0',
                    marginTop: '-16px'
                  }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Hero Active Card */}
      <div className="dp-active-delivery-hero">
        <div className="dp-active-badge-bar">
          <div className="left">
            <Lock size={15} />
            <span>Order Ownership Rule Active</span>
          </div>
          <span className="time">{activeDelivery.assignedAt || 'Assigned on shift'}</span>
        </div>

        <div className="dp-active-hero-body">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span className="dp-order-id-tag" style={{ fontSize: '16px' }}>
              {activeDelivery.displayId || activeDelivery.id}
            </span>
            <span className="dp-order-status-badge assigned">
              🔒 Locked ({stages[currentIndex].label})
            </span>
          </div>

          {/* Customer */}
          <div style={{ marginBottom: '12px' }}>
            <small style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
              Customer Details
            </small>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '2px 0 0 0' }}>
              {activeDelivery.customer}
            </h3>
          </div>

          {/* Quick Call & Map Nav Actions */}
          <div className="dp-quick-actions-row">
            <a href={`tel:${activeDelivery.phone}`} className="dp-quick-action-btn call">
              <Phone size={16} />
              <span>Call ({activeDelivery.phone})</span>
            </a>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(activeDelivery.address)}`}
              target="_blank"
              rel="noreferrer"
              className="dp-quick-action-btn map"
            >
              <Navigation size={16} />
              <span>Open in Maps</span>
            </a>
          </div>

          {/* Address */}
          <div className="dp-address-box">
            <MapPin size={20} />
            <div>
              <small style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                Destination Address
              </small>
              <p style={{ fontSize: '14px', fontWeight: 600 }}>{activeDelivery.address}</p>
            </div>
          </div>

          {/* Items Checklist */}
          <div className="dp-items-list-box">
            <h5>Items to Handover ({activeDelivery.quantity || 1} units)</h5>
            {activeDelivery.itemsList && activeDelivery.itemsList.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {activeDelivery.itemsList.map((item, idx) => (
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
                <span className="dp-item-chip">{activeDelivery.product} ({activeDelivery.quantity} PCS)</span>
              </div>
            )}
          </div>

          {/* Amount Due Card */}
          <div style={{
            background: '#f8fafc',
            border: '2px dashed #0284c7',
            borderRadius: '12px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <div>
              <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                Payment to Collect
              </span>
              <small style={{ fontSize: '11px', color: '#0284c7' }}>Cash, UPI QR, or Card POS</small>
            </div>
            <strong style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>
              {money(activeDelivery.amount)}
            </strong>
          </div>

          {/* Interactive Stage Actions based on progression */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {currentStage === 'pickup' && (
              <button
                type="button"
                className="dp-btn-primary"
                style={{ width: '100%', minHeight: '52px', fontSize: '15px' }}
                onClick={() => onUpdateTransitStage && onUpdateTransitStage('in_transit')}
              >
                <Truck size={20} />
                <span>Confirm Pickup & Start Transit</span>
                <ChevronRight size={18} />
              </button>
            )}

            {currentStage === 'in_transit' && (
              <button
                type="button"
                className="dp-btn-primary"
                style={{ width: '100%', minHeight: '52px', fontSize: '15px', background: '#0284c7' }}
                onClick={() => onUpdateTransitStage && onUpdateTransitStage('arrived')}
              >
                <MapPinned size={20} />
                <span>Confirm Arrival at Customer Location</span>
                <ChevronRight size={18} />
              </button>
            )}

            {/* Big Action: DELIVERED (Always available or prioritized once arrived) */}
            <button
              type="button"
              className="dp-btn-success"
              style={{
                width: '100%',
                minHeight: '56px',
                fontSize: '17px',
                boxShadow: currentStage === 'arrived' ? '0 4px 15px rgba(22, 163, 74, 0.4)' : undefined
              }}
              onClick={() => onDelivered(activeDelivery)}
            >
              <CheckCircle2 size={22} />
              <span>DELIVERED (Collect Payment)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
