// src/delivery/AccessDenied.jsx
import React from 'react';
import { ShieldAlert, ArrowLeft, ArrowRight, UserCheck } from 'lucide-react';

export default function AccessDenied({ currentUser, onGoToDelivery, onGoHome, onSwitchUser }) {
  const isCustomer = currentUser?.role === 'customer';
  const roleName = isCustomer ? 'Customer' : 'Delivery Partner';
  const returnAction = onGoHome || onGoToDelivery;
  const returnLabel = isCustomer ? 'Return to Customer Store' : 'Return to Delivery App';

  return (
    <div className="dp-access-denied-shell">
      <div className="dp-access-denied-card">
        <div className="dp-denied-icon">
          <ShieldAlert size={36} />
        </div>

        <h2>Access Denied</h2>
        <p>
          You are currently signed in as <b>{currentUser?.name || roleName}</b> ({currentUser?.id}).
          The Admin Panel and Management Dashboard are strictly restricted to administrative personnel.
        </p>

        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '12px',
          marginBottom: '20px',
          textAlign: 'left',
          fontSize: '12px',
          color: '#475569'
        }}>
          <b>Security & Isolation Notice:</b> {isCustomer
            ? 'Customers only have access to storefront product browsing, cart checkout, and real-time order tracking.'
            : 'Delivery partners only have access to dispatch assignments, active navigation, and personal monthly delivery records.'}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            type="button"
            className="dp-btn-primary"
            style={{ width: '100%', minHeight: '50px' }}
            onClick={returnAction}
          >
            <ArrowLeft size={18} />
            <span>{returnLabel}</span>
          </button>

          <button
            type="button"
            className="dp-btn-secondary"
            style={{ width: '100%', minHeight: '44px' }}
            onClick={onSwitchUser}
          >
            <UserCheck size={16} />
            <span>Switch User Persona</span>
          </button>
        </div>
      </div>
    </div>
  );
}
