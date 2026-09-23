// src/delivery/PersonalTab.jsx
import React, { useState, useMemo } from 'react';
import {
  User, Phone, Star, Truck, Banknote, QrCode, CreditCard,
  Calendar, CheckCircle2, ChevronDown, Package, Clock3
} from 'lucide-react';
import { db } from '../services/db';

export default function PersonalTab({ currentUser }) {
  const [selectedMonth, setSelectedMonth] = useState('2026-09');

  const money = (val) => `₹${Number(val || 0).toLocaleString('en-IN')}`;

  const availableMonths = [
    { key: '2026-09', label: 'September 2026 (Current)' },
    { key: '2026-08', label: 'August 2026' },
    { key: '2026-07', label: 'July 2026' }
  ];

  // Fetch monthly records & stats strictly isolated for this partner
  const monthlyStats = useMemo(() => {
    return db.getPartnerMonthlyStats(currentUser.id, selectedMonth);
  }, [currentUser.id, selectedMonth]);

  const monthlyHistory = useMemo(() => {
    return db.getPartnerMonthlyHistory(currentUser.id, selectedMonth);
  }, [currentUser.id, selectedMonth]);

  return (
    <div>
      {/* Partner Hero Header */}
      <div className="dp-personal-hero">
        <div className="dp-personal-profile-row">
          <div className="dp-large-avatar">
            {currentUser.avatar || 'DP'}
          </div>
          <div className="dp-profile-copy">
            <h2>{currentUser.name}</h2>
            <p>{currentUser.title || 'Delivery Partner'} · {currentUser.id}</p>
            <div className="dp-profile-meta-chips">
              <span className="dp-meta-chip">
                <Truck size={12} /> {currentUser.vehicle || 'EV Cargo Scooter'}
              </span>
              <span className="dp-meta-chip">
                <Star size={12} fill="#facc15" color="#facc15" /> {currentUser.rating || '4.9 ★'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Month Selector Bar */}
      <div className="dp-month-picker-bar">
        <label>
          <Calendar size={13} style={{ display: 'inline', marginRight: '4px' }} />
          Select Month
        </label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="dp-month-select"
        >
          {availableMonths.map((m) => (
            <option key={m.key} value={m.key}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {/* High-Level Performance Metrics */}
      <div className="dp-metrics-grid">
        <div className="dp-metric-card wide">
          <span className="label">Total Collections ({availableMonths.find((m) => m.key === selectedMonth)?.label?.split(' ')[0]})</span>
          <strong className="value">{money(monthlyStats.totalAmount)}</strong>
          <span className="note">Direct collections deposited to BuildStock accounts</span>
        </div>

        <div className="dp-metric-card">
          <div className="icon-head">
            <Truck size={18} color="#0284c7" />
          </div>
          <span className="label">Orders Delivered</span>
          <strong className="value">{monthlyStats.totalOrders}</strong>
          <span className="note">Target: {currentUser.monthlyTarget || 90} orders</span>
        </div>

        <div className="dp-metric-card">
          <div className="icon-head">
            <Clock3 size={18} color="#16a34a" />
          </div>
          <span className="label">On-Time Rate</span>
          <strong className="value">99.4%</strong>
          <span className="note">Avg drop: 32 mins</span>
        </div>
      </div>

      {/* Payment Collections Breakdown (Cash, UPI, Card) */}
      <div className="dp-breakdown-panel">
        <h4>Collection Mode Breakdown</h4>
        <div className="dp-breakdown-list">
          {/* Cash */}
          <div className="dp-breakdown-row cash">
            <div className="left">
              <Banknote size={20} color="#16a34a" />
              <div>
                <strong>Cash Collections</strong>
                <small>{monthlyStats.cash.count} orders</small>
              </div>
            </div>
            <div className="right">
              <strong>{money(monthlyStats.cash.amount)}</strong>
              <small style={{ color: '#16a34a', fontWeight: 600 }}>Physical Handover</small>
            </div>
          </div>

          {/* UPI */}
          <div className="dp-breakdown-row upi">
            <div className="left">
              <QrCode size={20} color="#0284c7" />
              <div>
                <strong>UPI Collections</strong>
                <small>{monthlyStats.upi.count} orders</small>
              </div>
            </div>
            <div className="right">
              <strong>{money(monthlyStats.upi.amount)}</strong>
              <small style={{ color: '#0284c7', fontWeight: 600 }}>Bank Direct</small>
            </div>
          </div>

          {/* Card */}
          <div className="dp-breakdown-row card">
            <div className="left">
              <CreditCard size={20} color="#8b5cf6" />
              <div>
                <strong>Card POS Collections</strong>
                <small>{monthlyStats.card.count} orders</small>
              </div>
            </div>
            <div className="right">
              <strong>{money(monthlyStats.card.amount)}</strong>
              <small style={{ color: '#8b5cf6', fontWeight: 600 }}>Swiping Machine</small>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery History List */}
      <div style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#0f172a' }}>
              Delivered Orders Log
            </h3>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              Completed deliveries for {availableMonths.find((m) => m.key === selectedMonth)?.label}
            </span>
          </div>
          <span className="dp-count-pill">
            {monthlyHistory.length} orders
          </span>
        </div>

        {monthlyHistory.length === 0 ? (
          <div className="dp-empty-state">
            <Package size={28} color="#94a3b8" />
            <h3>No Records Found</h3>
            <p>No completed deliveries recorded under your ID for this month.</p>
          </div>
        ) : (
          <div>
            {monthlyHistory.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="dp-history-item">
                <div className="dp-history-left">
                  <div className="dp-history-line-1">
                    <strong>{item.customer}</strong>
                    <span className="dp-order-id-tag" style={{ fontSize: '11px' }}>
                      {item.displayId || item.id}
                    </span>
                    <span className={`dp-history-pill ${item.paymentMethod ? item.paymentMethod.toLowerCase() : 'cash'}`}>
                      {item.paymentMethod || 'Cash'}
                    </span>
                  </div>
                  <span className="dp-history-address">
                    {item.address}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                    <span className="dp-history-time">
                      <Clock3 size={11} style={{ display: 'inline', marginRight: '3px' }} />
                      {item.deliveredAt}
                    </span>
                    {item.product && (
                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                        • {item.product}
                      </span>
                    )}
                  </div>
                </div>

                <div className="dp-history-right">
                  <strong>{money(item.amount)}</strong>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                    fontSize: '10px',
                    color: '#16a34a',
                    fontWeight: 700
                  }}>
                    <CheckCircle2 size={11} /> Done
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
