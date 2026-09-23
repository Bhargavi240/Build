// src/customer/CustomerApp.jsx
import React, { useState, useEffect } from 'react';
import {
  Package, ShoppingCart, Search, CheckCircle2, Clock3, Truck,
  MapPin, Phone, User, ArrowRight, X, Plus, Minus, AlertCircle,
  Building2, ChevronRight, Sparkles, LogOut, UserCheck, ShieldCheck
} from 'lucide-react';
import { db, subscribeDB } from '../services/db';
import './customer.css';

export default function CustomerApp({
  currentUser,
  handleLogout,
  onSwitchUser,
  notify
}) {
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'orders'
  const [products, setProducts] = useState(() => db.getProducts());
  const [orders, setOrders] = useState(() => db.getOrders());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState(
    currentUser?.address || '12-4-89 MG Road, Benz Circle, Vijayawada, AP - 520010'
  );
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98480 22338');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Subscribe to DB changes (products stock changes, order status changes, etc.)
  useEffect(() => {
    const unsub = subscribeDB(() => {
      setProducts(db.getProducts());
      setOrders(db.getOrders());
    });
    return unsub;
  }, []);

  const money = (val) => `₹${Number(val || 0).toLocaleString('en-IN')}`;

  // Unique categories
  const categories = ['All', ...new Set(products.map((p) => p.category).filter(Boolean))];

  // Filtered products
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.code && p.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Cart operations
  const addToCart = (product) => {
    if (product.stock <= 0) {
      if (notify) notify(`${product.name} is currently out of stock`);
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock) {
          if (notify) notify(`Only ${product.stock} units available for ${product.name}. Do not allow quantity ${existing.qty + 1}.`);
          return prev;
        }
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    if (notify) notify(`Added ${product.name} to cart`);
  };

  const updateCartQty = (productId, delta) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === productId) {
            const product = products.find((p) => p.id === productId);
            const newQty = item.qty + delta;
            if (newQty <= 0) return null;
            if (product && newQty > product.stock) {
              if (notify) notify(`Only ${product.stock} units available. Do not allow quantity ${newQty}.`);
              return item;
            }
            return { ...item, qty: newQty };
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = cartSubtotal > 1000 || cartSubtotal === 0 ? 0 : 40;
  const estimatedGst = Math.round(cartSubtotal * 0.18);
  const grandTotal = cartSubtotal + deliveryFee + estimatedGst;

  // Handle Checkout / Place Order
  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    setIsPlacingOrder(true);

    const result = db.createCustomerOrder({
      customer: currentUser?.name || 'Rajesh Kumar',
      customerId: currentUser?.id || 'CUST-001',
      phone,
      address: deliveryAddress,
      itemsList: cart.map((item) => ({
        id: item.id,
        code: item.code,
        name: item.name,
        qty: item.qty,
        unit: item.unit || 'PCS',
        price: item.price
      })),
      paymentMethod
    });

    if (result && result.error) {
      setIsPlacingOrder(false);
      if (notify) notify(result.error);
      return;
    }

    setCart([]);
    setCartOpen(false);
    setIsPlacingOrder(false);
    setActiveTab('orders');

    if (notify) {
      notify(`🎉 Order ${result.displayId || result.id} placed! Tracking is live.`);
    }
  };

  // Orders placed by or relevant to this customer
  const customerOrders = orders.filter((o) => {
    if (!currentUser) return true;
    if (o.customerId === currentUser.id) return true;
    if (o.customer && o.customer.toLowerCase().includes(currentUser.name.toLowerCase())) return true;
    return false;
  });

  return (
    <div className="cust-viewport">
      {/* TOP HEADER */}
      <header className="cust-header">
        <div className="cust-header-inner">
          {/* Brand */}
          <div className="cust-brand" onClick={() => setActiveTab('browse')}>
            <div className="cust-brand-logo">
              <Building2 size={22} />
            </div>
            <div className="cust-brand-text">
              <h1>BuildStock</h1>
              <span>Customer Portal</span>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="cust-nav-tabs">
            <button
              type="button"
              className={`cust-nav-tab ${activeTab === 'browse' ? 'active' : ''}`}
              onClick={() => setActiveTab('browse')}
            >
              <Package size={16} />
              <span>Browse Products</span>
            </button>
            <button
              type="button"
              className={`cust-nav-tab ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <Truck size={16} />
              <span>My Orders</span>
              {customerOrders.length > 0 && (
                <span className="cust-tab-badge">{customerOrders.length}</span>
              )}
            </button>
          </div>

          {/* Actions: Cart, Switch Persona, Logout */}
          <div className="cust-header-actions">
            <button
              type="button"
              className="cust-cart-btn"
              onClick={() => setCartOpen(true)}
              aria-label="View Cart"
            >
              <ShoppingCart size={18} />
              <span>Cart</span>
              {totalCartCount > 0 && (
                <span className="cust-cart-badge">{totalCartCount}</span>
              )}
            </button>

            <button
              type="button"
              className="cust-btn-outline"
              onClick={onSwitchUser}
              title="Switch Persona / Role"
            >
              <UserCheck size={14} color="#0284c7" />
              <span>Switch Role</span>
            </button>

            <button
              type="button"
              className="cust-btn-outline exit"
              onClick={handleLogout}
              title="Sign Out"
            >
              <LogOut size={14} />
              <span>Exit</span>
            </button>
          </div>
        </div>
      </header>

      {/* CUSTOMER PROFILE SUBBAR */}
      <div className="cust-subbar">
        <div className="cust-subbar-inner">
          <div className="cust-user-profile">
            <div className="cust-avatar">
              {currentUser?.avatar || 'CU'}
            </div>
            <div className="cust-user-meta">
              <strong>{currentUser?.name || 'Customer'}</strong>
              <span>
                <MapPin size={12} /> {deliveryAddress}
              </span>
            </div>
          </div>

          <div className="cust-express-pill">
            <Sparkles size={14} />
            <span>Fast Warehouse Dispatch · Real-Time Delivery Tracking</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="cust-main-container">
        {activeTab === 'browse' ? (
          <div>
            {/* Search & Category Filter Controls */}
            <div className="cust-controls-bar">
              <div className="cust-search-wrap">
                <Search size={18} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Search milk, bread, gypsum boards, cement bags, steel bars..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="cust-categories-scroll">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`cust-cat-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <Package size={40} color="#94a3b8" style={{ marginBottom: '12px' }} />
                <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 800 }}>No materials found</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
                  No materials match "{searchQuery}". Try selecting another category or resetting the search.
                </p>
              </div>
            ) : (
              <div className="cust-products-grid">
                {filteredProducts.map((product) => {
                  const inCartItem = cart.find((i) => i.id === product.id);
                  const isOutOfStock = product.stock <= 0;
                  const isLowStock = product.stock > 0 && product.stock <= (product.minimum || 50);

                  return (
                    <div key={product.id} className="cust-product-card">
                      <div
                        className="cust-product-card-top cust-card-clickable"
                        onClick={() => setSelectedProduct(product)}
                        title="Click to view product details and specifications"
                      >
                        <div className="cust-product-meta-row">
                          <span className="cust-category-tag">{product.category}</span>
                          <span className="cust-code-tag">{product.code}</span>
                        </div>

                        <h3 className="cust-product-name">{product.name}</h3>
                        <p className="cust-product-desc">
                          {product.description || 'Premium building material certified for residential and commercial construction.'}
                        </p>

                        <div className="cust-view-specs-link">
                          <span>View specs & availability</span>
                          <ChevronRight size={12} />
                        </div>

                        <div className="cust-product-stock-bar">
                          <span className={`cust-stock-status ${isOutOfStock ? 'out-of-stock' : isLowStock ? 'low-stock' : 'in-stock'}`}>
                            <span className="cust-stock-indicator" />
                            {isOutOfStock ? 'Out of Stock' : isLowStock ? `Low Stock (${product.stock} ${product.unit})` : `In Stock (${product.stock} ${product.unit})`}
                          </span>
                          <span style={{ color: '#64748b', fontSize: '11px' }}>Per {product.unit || 'unit'}</span>
                        </div>
                      </div>

                      <div className="cust-product-card-footer">
                        <div className="cust-price-display">
                          <small>Price</small>
                          <strong>{money(product.price)}</strong>
                        </div>

                        {inCartItem ? (
                          <div className="cust-qty-controls">
                            <button
                              type="button"
                              className="cust-qty-btn"
                              onClick={() => updateCartQty(product.id, -1)}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="cust-qty-num">{inCartItem.qty}</span>
                            <button
                              type="button"
                              className="cust-qty-btn"
                              onClick={() => updateCartQty(product.id, 1)}
                              disabled={inCartItem.qty >= product.stock}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="cust-add-btn"
                            disabled={isOutOfStock}
                            onClick={() => addToCart(product)}
                          >
                            <Plus size={15} />
                            <span>Add</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* MY ORDERS TAB WITH LIVE TRACKING */
          <div className="cust-orders-view">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>My Construction Orders</h2>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                  Real-time status updates synced with warehouse and delivery fleet
                </p>
              </div>
              <button
                type="button"
                className="cust-btn-outline"
                onClick={() => setActiveTab('browse')}
              >
                <Plus size={14} />
                <span>Place New Order</span>
              </button>
            </div>

            {customerOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <Truck size={40} color="#94a3b8" style={{ marginBottom: '12px' }} />
                <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 800 }}>No Orders Placed Yet</h3>
                <p style={{ margin: '0 0 16px 0', color: '#64748b', fontSize: '14px' }}>
                  Browse our building material inventory and place an order for fast warehouse dispatch!
                </p>
                <button
                  type="button"
                  className="cust-cart-btn"
                  onClick={() => setActiveTab('browse')}
                  style={{ margin: '0 auto' }}
                >
                  <Package size={16} />
                  <span>Start Shopping</span>
                </button>
              </div>
            ) : (
              customerOrders.map((order) => {
                const isAssigned = !!order.assignedToId || order.status === 'Assigned' || order.status === 'Out for Delivery' || order.status === 'Awaiting Payment' || order.status === 'Completed' || order.status === 'Delivered';
                const isOutForDelivery = order.transitStage === 'in_transit' || order.transitStage === 'arrived' || order.status === 'Out for Delivery';
                const isDelivered = order.status === 'Delivered' || order.status === 'Completed' || order.paymentStatus === 'PAID';

                // 6-stage lifecycle:
                // 0: Placed, 1: Confirmed, 2: Ready for Dispatch, 3: Partner Assigned, 4: Out for Delivery, 5: Delivered
                let step = 2;
                if (isDelivered) step = 5;
                else if (isOutForDelivery) step = 4;
                else if (isAssigned) step = 3;
                else step = 2;

                const trackingSteps = [
                  { label: 'Order Placed', time: order.createdAt || 'Placed' },
                  { label: 'Confirmed', time: 'Preparing' },
                  { label: 'Ready for Dispatch', time: 'Packed' },
                  {
                    label: order.assignedTo ? `Assigned (${order.assignedTo})` : 'Partner Assignment',
                    time: order.assignedAt || 'Pending'
                  },
                  { label: 'Out for Delivery', time: isOutForDelivery ? 'On Route' : 'Pending' },
                  { label: 'Delivered', time: isDelivered ? (order.deliveredAt || 'Completed') : 'Estimated Today' }
                ];

                return (
                  <div key={order.id} className="cust-order-card">
                    <div className="cust-order-card-header">
                      <div className="cust-order-id-group">
                        <span className="cust-order-id-tag">{order.displayId || order.id}</span>
                        <span className="cust-order-date">{order.date || '22 Sep 2026'}</span>
                      </div>

                      <span className={`cust-order-status-badge ${isDelivered ? 'delivered' : isAssigned ? 'assigned' : 'ready'}`}>
                        {isDelivered ? (
                          <>
                            <CheckCircle2 size={14} /> Completed ({order.paymentMethod || 'Paid'})
                          </>
                        ) : isAssigned ? (
                          <>
                            <Truck size={14} /> {isOutForDelivery ? 'Out for Delivery' : `Assigned to ${order.assignedTo}`}
                          </>
                        ) : (
                          <>
                            <Clock3 size={14} /> Ready for Dispatch
                          </>
                        )}
                      </span>
                    </div>

                    <div className="cust-order-card-body">
                      {/* Live Tracking Stepper */}
                      <div className="cust-tracking-stepper">
                        <div className="cust-track-line">
                          <div
                            className="cust-track-line-progress"
                            style={{ width: `${(step / 5) * 100}%` }}
                          />
                        </div>

                        {trackingSteps.map((st, idx) => {
                          const isDone = step > idx;
                          const isCur = step === idx;
                          return (
                            <div
                              key={idx}
                              className={`cust-track-step ${isDone ? 'done' : isCur ? 'current' : ''}`}
                            >
                              <div className="cust-track-icon">
                                {isDone ? (
                                  <CheckCircle2 size={16} />
                                ) : (
                                  <span>{idx + 1}</span>
                                )}
                              </div>
                              <span className="cust-track-label">{st.label}</span>
                              <span className="cust-track-time">{st.time}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Delivery Partner Assigned Notice */}
                      {isAssigned && (
                        <div className="cust-partner-badge-card">
                          <div className="cust-partner-info-left">
                            <div className="cust-partner-avatar-small">
                              {order.assignedTo ? order.assignedTo.split(' ').map((n) => n[0]).join('') : 'DP'}
                            </div>
                            <div className="cust-partner-details">
                              <strong>Delivery partner has been assigned: {order.assignedTo}</strong>
                              <span>
                                {order.assignedPartnerVehicle || 'EV Cargo Scooter'} · Dedicated to completing your drop
                              </span>
                            </div>
                          </div>
                          {order.assignedPartnerPhone && (
                            <a
                              href={`tel:${order.assignedPartnerPhone}`}
                              className="cust-call-partner-btn"
                            >
                              <Phone size={13} />
                              <span>Call Partner</span>
                            </a>
                          )}
                        </div>
                      )}

                      {/* Items */}
                      <div className="cust-order-items-grid">
                        {order.itemsList && order.itemsList.length > 0 ? (
                          order.itemsList.map((item, idx) => (
                            <div key={idx} className="cust-order-item-chip">
                              <span>{item.name}</span>
                              <strong>{item.qty} {item.unit || 'PCS'}</strong>
                            </div>
                          ))
                        ) : (
                          <div className="cust-order-item-chip">
                            <span>{order.product}</span>
                            <strong>{order.quantity} PCS</strong>
                          </div>
                        )}
                      </div>

                      {/* Bottom Details */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '12px',
                        borderTop: '1px solid #f1f5f9',
                        flexWrap: 'wrap',
                        gap: '10px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b' }}>
                          <MapPin size={14} color="#0284c7" />
                          <span>{order.address}</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <small style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Total Paid / Payable</small>
                          <strong style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{money(order.amount)}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>

      {/* SLIDE-OVER CART DRAWER */}
      {cartOpen && (
        <div className="cust-cart-backdrop" onClick={() => setCartOpen(false)}>
          <div className="cust-cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="cust-cart-header">
              <h3>
                <ShoppingCart size={20} color="#0284c7" />
                <span>Construction Material Cart ({totalCartCount})</span>
              </h3>
              <button
                type="button"
                className="cust-close-btn"
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            <div className="cust-cart-body">
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <ShoppingCart size={40} color="#cbd5e1" style={{ marginBottom: '12px' }} />
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '16px' }}>Your cart is empty</h4>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
                    Select gypsum boards, cement bags, or hardware accessories to add to your order.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <span className="cust-cart-section-title">Selected Items</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
                      {cart.map((item) => (
                        <div key={item.id} className="cust-cart-item">
                          <div className="cust-cart-item-meta">
                            <h5>{item.name}</h5>
                            <span>{money(item.price)} / {item.unit || 'PCS'}</span>
                          </div>

                          <div className="cust-qty-controls">
                            <button
                              type="button"
                              className="cust-qty-btn"
                              onClick={() => updateCartQty(item.id, -1)}
                            >
                              <Minus size={13} />
                            </button>
                            <span className="cust-qty-num">{item.qty}</span>
                            <button
                              type="button"
                              className="cust-qty-btn"
                              onClick={() => updateCartQty(item.id, 1)}
                            >
                              <Plus size={13} />
                            </button>
                          </div>

                          <strong style={{ fontSize: '14px', minWidth: '70px', textAlign: 'right' }}>
                            {money(item.price * item.qty)}
                          </strong>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Location */}
                  <div>
                    <span className="cust-cart-section-title">Delivery Destination</span>
                    <div className="cust-address-card">
                      <MapPin size={18} color="#0284c7" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <p>{deliveryAddress}</p>
                        <input
                          type="text"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="Edit site address..."
                          style={{
                            marginTop: '8px',
                            width: '100%',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            padding: '6px 10px',
                            fontSize: '12px'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Phone */}
                  <div>
                    <span className="cust-cart-section-title">Site Contact Phone</span>
                    <div className="cust-address-card">
                      <Phone size={18} color="#0284c7" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter phone number for delivery updates"
                        style={{
                          width: '100%',
                          border: 'none',
                          background: 'transparent',
                          fontSize: '13px',
                          outline: 'none',
                          fontWeight: 600
                        }}
                      />
                    </div>
                  </div>

                  {/* Payment Selection */}
                  <div>
                    <span className="cust-cart-section-title">Payment Option</span>
                    <div className="cust-payment-select">
                      {[
                        { id: 'Cash on Delivery', label: '💵 Cash on Drop' },
                        { id: 'UPI on Delivery', label: '📱 UPI QR on Drop' },
                        { id: 'Card on Delivery', label: '💳 Card on Drop' }
                      ].map((opt) => (
                        <div
                          key={opt.id}
                          className={`cust-pay-option ${paymentMethod === opt.id ? 'selected' : ''}`}
                          onClick={() => setPaymentMethod(opt.id)}
                        >
                          <span>{opt.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Cart Footer / Checkout Button */}
            {cart.length > 0 && (
              <div className="cust-cart-footer">
                <div className="cust-summary-row">
                  <span>Materials Subtotal</span>
                  <strong>{money(cartSubtotal)}</strong>
                </div>
                <div className="cust-summary-row">
                  <span>Express Delivery</span>
                  <span>{deliveryFee === 0 ? 'FREE (Over ₹1,000)' : money(deliveryFee)}</span>
                </div>
                <div className="cust-summary-row">
                  <span>GST (18% building materials)</span>
                  <span>{money(estimatedGst)}</span>
                </div>
                <div className="cust-summary-row total">
                  <span>Total Amount Due</span>
                  <strong>{money(grandTotal)}</strong>
                </div>

                <button
                  type="button"
                  className="cust-checkout-btn"
                  disabled={isPlacingOrder}
                  onClick={handlePlaceOrder}
                >
                  <CheckCircle2 size={20} />
                  <span>{isPlacingOrder ? 'Confirming Order...' : `Confirm & Place Order (${money(grandTotal)})`}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
            {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={products.find((p) => p.id === selectedProduct.id) || selectedProduct}
          cartItem={cart.find((i) => i.id === selectedProduct.id)}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
          onUpdateQty={updateCartQty}
          notify={notify}
          money={money}
        />
      )}
    </div>
  );
}

function ProductDetailsModal({ product, cartItem, onClose, onAddToCart, onUpdateQty, notify, money }) {
  if (!product) return null;
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= (product.minimum || 50);

  return (
    <div className="cust-modal-backdrop" onClick={onClose}>
      <div className="cust-details-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="cust-details-header">
          <div className="cust-details-header-info">
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
              <span className="cust-category-tag">{product.category}</span>
              <span className="cust-code-tag">{product.code}</span>
            </div>
            <h2 className="cust-details-title">{product.name}</h2>
          </div>
          <button
            type="button"
            className="cust-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div className="cust-details-body">
          {/* Price & Unit Card */}
          <div className="cust-details-price-card">
            <div>
              <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                Unit Price
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <span className="cust-details-price-main">{money(product.price)}</span>
                <span className="cust-details-price-sub">/ {product.unit || 'unit'}</span>
              </div>
            </div>

            <div className={`cust-details-stock-alert ${isOutOfStock ? 'out-of-stock' : isLowStock ? 'low-stock' : 'in-stock'}`}>
              <span className="cust-stock-indicator" />
              <span>
                {isOutOfStock
                  ? 'Out of Stock'
                  : isLowStock
                  ? `Low Stock (${product.stock} left)`
                  : `In Stock (${product.stock} available)`}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="cust-details-desc-box">
            <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Product Overview</h4>
            <p style={{ margin: 0 }}>
              {product.description ||
                'Premium certified material engineered for residential, commercial, and structural projects with strict quality and safety compliance.'}
            </p>
          </div>

          {/* Specifications Grid */}
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Specifications & Dispatch</h4>
            <div className="cust-details-specs-grid">
              <div className="cust-details-spec-item">
                <span>Item SKU / Code</span>
                <strong>{product.code || 'N/A'}</strong>
              </div>
              <div className="cust-details-spec-item">
                <span>Category</span>
                <strong>{product.category || 'General'}</strong>
              </div>
              <div className="cust-details-spec-item">
                <span>Unit of Measure</span>
                <strong>{product.unit || 'PCS'}</strong>
              </div>
              <div className="cust-details-spec-item">
                <span>Dispatch SLA</span>
                <strong>10 - 20 Mins Express</strong>
              </div>
              <div className="cust-details-spec-item">
                <span>Warehouse Hub</span>
                <strong>Central Hub, Vijayawada</strong>
              </div>
              <div className="cust-details-spec-item">
                <span>Assurance</span>
                <strong>100% Quality Inspected</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Qty & Cart Controls */}
        <div className="cust-details-footer">
          {cartItem ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>In Cart:</span>
                <div className="cust-qty-controls" style={{ height: '40px' }}>
                  <button
                    type="button"
                    className="cust-qty-btn"
                    onClick={() => onUpdateQty(product.id, -1)}
                    style={{ width: '40px', height: '40px' }}
                  >
                    <Minus size={15} />
                  </button>
                  <span className="cust-qty-num" style={{ minWidth: '40px', fontSize: '15px' }}>{cartItem.qty}</span>
                  <button
                    type="button"
                    className="cust-qty-btn"
                    onClick={() => onUpdateQty(product.id, 1)}
                    disabled={cartItem.qty >= product.stock}
                    style={{ width: '40px', height: '40px' }}
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Subtotal</span>
                <strong style={{ fontSize: '17px', color: '#0f172a' }}>{money(cartItem.qty * product.price)}</strong>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Unit Price</span>
                <strong style={{ fontSize: '20px', color: '#0f172a' }}>{money(product.price)}</strong>
              </div>

              <button
                type="button"
                className="cust-checkout-btn"
                disabled={isOutOfStock}
                onClick={() => {
                  onAddToCart(product);
                }}
                style={{ padding: '12px 24px', flex: 1 }}
              >
                <Plus size={18} />
                <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
