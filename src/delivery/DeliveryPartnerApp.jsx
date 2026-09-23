// src/delivery/DeliveryPartnerApp.jsx
import React, { useState, useEffect } from 'react';
import {
  Package, Truck, UserCheck, LogOut, ArrowRight, User,
  CheckCircle2, Clock3, Lock, ShieldCheck, Zap
} from 'lucide-react';
import { db, subscribeDB } from '../services/db';
import OrdersTab from './OrdersTab';
import MyDeliveryTab from './MyDeliveryTab';
import PersonalTab from './PersonalTab';
import TakeOrderModal from './TakeOrderModal';
import LockedOrderModal from './LockedOrderModal';
import PaymentView from './PaymentView';
import PaymentSuccessModal from './PaymentSuccessModal';
import './delivery.css';

export default function DeliveryPartnerApp({
  currentUser,
  handleLogout,
  onSwitchUser,
  notify
}) {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'my-delivery' | 'personal'
  const [ordersVersion, setOrdersVersion] = useState(0);

  // Modals state
  const [takeOrderModalOrder, setTakeOrderModalOrder] = useState(null);
  const [lockedOrderModalOrder, setLockedOrderModalOrder] = useState(null);
  const [paymentModalOrder, setPaymentModalOrder] = useState(null);
  const [successModalData, setSuccessModalData] = useState(null); // { order, details }

  // Subscribe to persistent DB events
  useEffect(() => {
    const unsubscribe = subscribeDB(() => {
      setOrdersVersion((v) => v + 1);
    });
    return unsubscribe;
  }, []);

  // Compute live orders
  const availableOrders = db.getAvailableOrders();
  const activeDelivery = db.getMyActiveDelivery(currentUser.id);

  // Workflow handlers:
  // Step 1: Partner clicks [TAKE ORDER] in Orders tab
  const handleOpenTakeOrder = (order) => {
    setTakeOrderModalOrder(order);
  };

  // Step 2: Partner confirms locking the order
  const handleConfirmTakeOrder = (order) => {
    const locked = db.lockOrder(order.id, currentUser);
    setTakeOrderModalOrder(null);

    // If order was already claimed by another partner
    if (locked && locked.error) {
      if (notify) {
        notify(`${locked.error} ${locked.reason || 'Another delivery partner has already taken this order.'}`);
      }
      return;
    }

    if (notify) notify(`Order ${order.displayId || order.id} locked & assigned to you!`);
    // Automatically switch to My Delivery tab and show the Locked Order Popup
    setActiveTab('my-delivery');
    setLockedOrderModalOrder(locked);
  };

  // Step 2.5: Advance transit stage (pickup -> in_transit -> arrived)
  const handleUpdateTransitStage = (stage) => {
    if (!activeDelivery) return;
    db.updateTransitStage(activeDelivery.id, stage);
    const msgs = {
      in_transit: 'Cargo loaded! Transit started towards customer destination.',
      arrived: 'Arrived at customer location. Ready for handover & payment.'
    };
    if (notify && msgs[stage]) notify(msgs[stage]);
  };

  // Step 3: Partner clicks [DELIVERED] -> sets status to Awaiting Payment -> open payment page
  const handleOpenPayment = (order) => {
    db.setOrderAwaitingPayment(order.id);
    setLockedOrderModalOrder(null);
    setPaymentModalOrder(order);
  };

  // Step 4: Partner confirms payment and completes order
  const handleCompletePayment = (order, paymentMethod, paymentDetails) => {
    const delivered = db.deliverOrder(order.id, currentUser, paymentMethod, paymentDetails);
    setPaymentModalOrder(null);
    setSuccessModalData({ order: delivered, details: paymentDetails });
    if (notify) {
      notify(`Order ${order.displayId || order.id} delivered! Payment received via ${paymentMethod}.`);
    }
  };

  // Step 5: Partner clicks [BACK TO ORDERS] on celebration screen
  const handleCloseSuccessModal = () => {
    setSuccessModalData(null);
    setActiveTab('orders');
  };

  return (
    <div className="dp-viewport-container">
      <div className="dp-app-shell">
        {/* TOP APP BAR */}
        <header className="dp-top-bar">
          <div className="dp-top-bar-main">
            <div className="dp-brand-wrap">
              <div className="dp-brand-logo">
                <Truck size={22} />
              </div>
              <div className="dp-brand-title">
                <h1>BuildStock</h1>
                <span>Delivery Partner</span>
              </div>
            </div>

            <div className="dp-top-actions">
              <button
                type="button"
                className="dp-action-chip"
                onClick={onSwitchUser}
                title="Switch User Role"
              >
                <UserCheck size={14} color="#0284c7" />
                <span>Switch</span>
              </button>

              <button
                type="button"
                className="dp-action-chip logout"
                onClick={handleLogout}
                title="Sign Out"
              >
                <LogOut size={14} />
                <span>Exit</span>
              </button>
            </div>
          </div>

          {/* Partner Status Sub-Bar */}
          <div className="dp-partner-subbar">
            <div className="dp-partner-info">
              <div className="dp-partner-avatar">
                {currentUser.avatar || 'DP'}
              </div>
              <div className="dp-partner-text">
                <div className="dp-partner-name-row">
                  <strong>{currentUser.name}</strong>
                  <span className="dp-partner-id-badge">{currentUser.id}</span>
                </div>
                <span className="dp-partner-subtext">
                  {currentUser.vehicle || 'EV Cargo Scooter'}
                </span>
              </div>
            </div>

            <div className="dp-duty-status">
              <span className="dp-pulse-dot" />
              <span>Active on Duty</span>
            </div>
          </div>
        </header>

        {/* MAIN SCROLLABLE TAB CONTENT */}
        <main className="dp-content">
          {activeTab === 'orders' && (
            <OrdersTab
              availableOrders={availableOrders}
              activeDelivery={activeDelivery}
              onTakeOrder={handleOpenTakeOrder}
              onGoToActiveDelivery={() => {
                setActiveTab('my-delivery');
                if (activeDelivery) setLockedOrderModalOrder(activeDelivery);
              }}
            />
          )}

          {activeTab === 'my-delivery' && (
            <MyDeliveryTab
              activeDelivery={activeDelivery}
              currentUser={currentUser}
              onDelivered={handleOpenPayment}
              onGoToOrders={() => setActiveTab('orders')}
              onUpdateTransitStage={handleUpdateTransitStage}
            />
          )}

          {activeTab === 'personal' && (
            <PersonalTab
              currentUser={currentUser}
              ordersVersion={ordersVersion}
            />
          )}
        </main>

        {/* FIXED 3-TAB MOBILE BOTTOM NAVIGATION */}
        <nav className="dp-bottom-nav" aria-label="Delivery Partner Navigation">
          <button
            type="button"
            className={`dp-nav-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <div className="icon-wrap">
              <Package size={22} />
              {availableOrders.length > 0 && (
                <span className="dp-nav-badge">{availableOrders.length}</span>
              )}
            </div>
            <span>Orders</span>
          </button>

          <button
            type="button"
            className={`dp-nav-tab ${activeTab === 'my-delivery' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('my-delivery');
              if (activeDelivery) setLockedOrderModalOrder(activeDelivery);
            }}
          >
            <div className="icon-wrap">
              <Truck size={22} />
              {activeDelivery && (
                <span className="dp-nav-badge pulsing">1</span>
              )}
            </div>
            <span>My Delivery</span>
          </button>

          <button
            type="button"
            className={`dp-nav-tab ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            <div className="icon-wrap">
              <User size={22} />
            </div>
            <span>Personal</span>
          </button>
        </nav>

        {/* WORKFLOW MODALS */}
        {/* Step 1: Take Order Confirmation Modal */}
        {takeOrderModalOrder && (
          <TakeOrderModal
            order={takeOrderModalOrder}
            currentUser={currentUser}
            onClose={() => setTakeOrderModalOrder(null)}
            onConfirm={handleConfirmTakeOrder}
          />
        )}

        {/* Step 2: Locked Order Popup */}
        {lockedOrderModalOrder && (
          <LockedOrderModal
            order={lockedOrderModalOrder}
            currentUser={currentUser}
            onClose={() => setLockedOrderModalOrder(null)}
            onDelivered={handleOpenPayment}
          />
        )}

        {/* Step 3: Payment Screen Modal */}
        {paymentModalOrder && (
          <PaymentView
            order={paymentModalOrder}
            currentUser={currentUser}
            onClose={() => setPaymentModalOrder(null)}
            onBack={() => {
              const prev = paymentModalOrder;
              setPaymentModalOrder(null);
              setLockedOrderModalOrder(prev);
            }}
            onCompletePayment={handleCompletePayment}
          />
        )}

        {/* Step 4: Payment Completed / Celebration Modal */}
        {successModalData && (
          <PaymentSuccessModal
            order={successModalData.order}
            details={successModalData.details}
            onClose={handleCloseSuccessModal}
          />
        )}
      </div>
    </div>
  );
}
