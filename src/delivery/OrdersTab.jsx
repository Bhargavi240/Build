// src/delivery/OrdersTab.jsx
import React, { useState } from 'react';
import { Package, MapPin, Phone, Search, ArrowRight, Clock3, AlertCircle, Sparkles, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function OrdersTab({
  availableOrders,
  activeDelivery,
  onTakeOrder,
  onGoToActiveDelivery
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const money = (val) => `₹${Number(val || 0).toLocaleString('en-IN')}`;

  // ORDER OWNERSHIP RULE ENFORCEMENT:
  // Once an order is accepted, delivery partner sees ONLY the locked order until completed.
  // New available jobs are strictly hidden!
  if (activeDelivery) {
    const transitStageLabel = {
      pickup: 'Stage 1/3: Warehouse Pickup',
      in_transit: 'Stage 2/3: In Transit / On Route',
      arrived: 'Stage 3/3: Arrived at Customer Location',
      delivered: 'Delivered'
    }[activeDelivery.transitStage || 'pickup'] || 'In Progress';

    return (
      <div className="dp-ownership-lock-view">
        {/* Policy Notice Badge */}
        <div style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          color: '#ffffff',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '16px',
          boxShadow: '0 4px 15px rgba(2, 132, 199, 0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Lock size={18} color="#ffffff" />
            </div>
            <div>
              <strong style={{ fontSize: '15px', display: 'block' }}>Order Ownership Rule Active</strong>
              <small style={{ opacity: 0.9, fontSize: '12px' }}>Single-Order Dedicated Mode</small>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.4', opacity: 0.95 }}>
            You have locked order <strong>{activeDelivery.displayId || activeDelivery.id}</strong>. In accordance with delivery protocol, new available jobs are hidden until this delivery is completed.
          </p>
        </div>

        {/* Locked Order Details Card */}
        <div className="dp-card" style={{ border: '2px solid #0284c7', background: '#f8fafc' }}>
          <div className="dp-order-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="dp-order-id-tag" style={{ fontSize: '15px' }}>
                {activeDelivery.displayId || activeDelivery.id}
              </span>
              <span style={{
                background: '#e0f2fe',
                color: '#0284c7',
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '6px'
              }}>
                {transitStageLabel}
              </span>
            </div>
            <span className="dp-order-status-badge assigned">
              🔒 Locked to You
            </span>
          </div>

          <div className="dp-order-card-body">
            <div className="dp-customer-block">
              <div className="dp-customer-meta">
                <h4 style={{ fontSize: '17px', fontWeight: 800 }}>{activeDelivery.customer}</h4>
                <a href={`tel:${activeDelivery.phone}`} className="dp-phone-btn" onClick={(e) => e.stopPropagation()}>
                  <Phone size={13} /> {activeDelivery.phone}
                </a>
              </div>
              <div className="dp-amount-display" style={{ textAlign: 'right' }}>
                <small>Amount Due</small>
                <strong style={{ fontSize: '18px', color: '#0f172a' }}>{money(activeDelivery.amount)}</strong>
              </div>
            </div>

            <div className="dp-address-box">
              <MapPin size={18} />
              <p>{activeDelivery.address}</p>
            </div>

            <div className="dp-items-list-box">
              <h5>Assigned Items</h5>
              {activeDelivery.itemsList && activeDelivery.itemsList.length > 0 ? (
                <div className="dp-item-chip-row">
                  {activeDelivery.itemsList.map((item, idx) => (
                    <span key={idx} className="dp-item-chip">
                      {item.name} × {item.qty} {item.unit || ''}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="dp-item-chip-row">
                  <span className="dp-item-chip">{activeDelivery.product} ({activeDelivery.quantity} PCS)</span>
                </div>
              )}
            </div>
          </div>

          <div className="dp-order-card-footer" style={{ flexDirection: 'column', gap: '10px', alignItems: 'stretch' }}>
            <button
              type="button"
              className="dp-btn-primary"
              style={{ width: '100%', minHeight: '50px', fontSize: '15px' }}
              onClick={onGoToActiveDelivery}
            >
              <span>Continue Delivery (Open Transit View)</span>
              <ArrowRight size={18} />
            </button>
            <div style={{ textAlign: 'center', fontSize: '11px', color: '#64748b' }}>
              Locked at {activeDelivery.assignedAt || 'Today'} · Complete payment to unlock new deliveries
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredOrders = availableOrders.filter((o) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      (o.displayId && o.displayId.toLowerCase().includes(q)) ||
      (o.id && o.id.toLowerCase().includes(q)) ||
      (o.customer && o.customer.toLowerCase().includes(q)) ||
      (o.address && o.address.toLowerCase().includes(q)) ||
      (o.product && o.product.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      {/* Section Header */}
      <div className="dp-section-header">
        <div className="dp-section-title-row">
          <div>
            <h2 className="dp-section-title">Available Deliveries</h2>
            <p className="dp-section-sub">Take an order to lock it to your shift</p>
          </div>
          <span className="dp-count-pill highlight">
            {filteredOrders.length} Ready
          </span>
        </div>

        {/* Search Bar */}
        <div style={{
          marginTop: '12px',
          display: 'flex',
          alignItems: 'center',
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '12px',
          padding: '0 12px',
          height: '44px'
        }}>
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search order ID, customer, locality..."
            style={{
              flex: 1,
              border: 'none',
              marginLeft: '8px',
              fontSize: '14px',
              outline: 'none',
              background: 'transparent'
            }}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '13px', cursor: 'pointer' }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="dp-empty-state">
          <div className="dp-empty-icon">
            <Package size={30} />
          </div>
          <h3>No Orders Waiting</h3>
          <p>
            {searchTerm
              ? `No orders matching "${searchTerm}". Try another search term.`
              : 'All pending dispatches have been claimed or delivered. Check back shortly for new warehouse drops!'}
          </p>
        </div>
      ) : (
        <div>
          {filteredOrders.map((order) => {
            const isTargetOrder = order.id === 'ORD-1025' || order.displayId === '#ORD1025';

            return (
              <div
                key={order.id}
                className="dp-card"
                style={{
                  border: isTargetOrder ? '2px solid #0284c7' : undefined,
                  boxShadow: isTargetOrder ? '0 4px 14px rgba(2, 132, 199, 0.15)' : undefined
                }}
              >
                {/* Order Header */}
                <div className="dp-order-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="dp-order-id-tag">{order.displayId || order.id}</span>
                    {isTargetOrder && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        background: '#e0f2fe',
                        color: '#0284c7',
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        <Sparkles size={10} /> Fast Dispatch
                      </span>
                    )}
                  </div>
                  <span className="dp-order-status-badge ready">
                    Ready for Delivery
                  </span>
                </div>

                {/* Card Body */}
                <div className="dp-order-card-body">
                  <div className="dp-customer-block">
                    <div className="dp-customer-meta">
                      <h4>{order.customer}</h4>
                      <a href={`tel:${order.phone}`} className="dp-phone-btn" onClick={(e) => e.stopPropagation()}>
                        <Phone size={13} /> {order.phone}
                      </a>
                    </div>
                    <div className="dp-amount-display" style={{ textAlign: 'right' }}>
                      <small>Payable</small>
                      <strong>{money(order.amount)}</strong>
                    </div>
                  </div>

                  <div className="dp-address-box">
                    <MapPin size={16} />
                    <p>{order.address}</p>
                  </div>

                  {/* Items summary */}
                  <div className="dp-items-list-box">
                    <h5>Order Items</h5>
                    {order.itemsList && order.itemsList.length > 0 ? (
                      <div className="dp-item-chip-row">
                        {order.itemsList.map((item, idx) => (
                          <span key={idx} className="dp-item-chip">
                            {item.name} × {item.qty}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="dp-item-chip-row">
                        <span className="dp-item-chip">{order.product} ({order.quantity} PCS)</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer with Big TAKE ORDER Button */}
                <div className="dp-order-card-footer">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '11px' }}>
                    <Clock3 size={13} />
                    <span>Expected Today</span>
                  </div>
                  <button
                    type="button"
                    className="dp-btn-primary"
                    style={{ minHeight: '46px', padding: '0 18px', fontSize: '14px' }}
                    onClick={() => onTakeOrder(order)}
                  >
                    <span>TAKE ORDER</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
