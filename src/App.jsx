import { useState } from 'react';
import {
  AlertTriangle, ArrowLeft, ArrowRight, ArrowUpRight, Banknote, Bell, Boxes, Check,
  CheckCircle2, ChevronDown, ChevronRight, Clock3, Copy, CreditCard,
  FileText, Filter, History, LayoutDashboard, LogOut, MapPin, Menu, Package,
  Phone, Plus, QrCode, Search, Settings, Shield, ShieldCheck, ShoppingCart,
  SlidersHorizontal, Smartphone, Star, Truck, User, UserCheck, Users, X, Zap
} from 'lucide-react';
import './styles.css';

const initialUsers = [
  {
    id: 'USR-001',
    name: 'Admin User',
    email: 'admin@buildstock.in',
    role: 'admin',
    avatar: 'AU',
    title: 'Operations & General Manager',
    phone: '+91 98765 43210'
  },
  {
    id: 'DP-402',
    name: 'Alex Kumar',
    email: 'alex@buildstock.in',
    role: 'delivery',
    avatar: 'AK',
    title: 'Senior Delivery Partner',
    phone: '+91 98400 55123',
    vehicle: 'AP 16 BX 4092 (Mini Truck)',
    rating: '4.9 ★',
    monthlyTarget: 35,
    status: 'Active on Shift'
  },
  {
    id: 'DP-405',
    name: 'Ramesh Singh',
    email: 'ramesh@buildstock.in',
    role: 'delivery',
    avatar: 'RS',
    title: 'Delivery Partner',
    phone: '+91 98765 11223',
    vehicle: 'AP 16 TZ 8810 (Cargo Van)',
    rating: '4.8 ★',
    monthlyTarget: 30,
    status: 'Active on Shift'
  }
];

const initialCustomers = [
  { id: 1, name: 'Rajesh Kumar', phone: '9876543210', email: 'rajesh@gmail.com', address: 'Vijayawada, Andhra Pradesh', company: 'ABC Constructions' },
  { id: 2, name: 'Suresh Reddy', phone: '9988776655', email: 'suresh@gmail.com', address: 'Guntur, Andhra Pradesh', company: 'BuildTech Pvt Ltd' },
  { id: 3, name: 'Priya Sharma', phone: '9866123456', email: 'priya@orbitinfra.com', address: 'Hyderabad, Telangana', company: 'Orbit Infra' },
  { id: 4, name: 'Arjun Mehta', phone: '9812345678', email: 'arjun@mehta.in', address: 'Visakhapatnam, Andhra Pradesh', company: 'Mehta Builders' }
];

const initialProducts = [
  { id: 1, name: 'Gypsum Board', code: 'GB-001', category: 'Gypsum Board', stock: 450, minimum: 100, unit: 'PCS', price: 520 },
  { id: 2, name: 'Ceiling Board', code: 'CB-002', category: 'Ceiling', stock: 65, minimum: 100, unit: 'PCS', price: 780 },
  { id: 3, name: 'Gypsum Sheet', code: 'GS-003', category: 'Gypsum Sheet', stock: 20, minimum: 100, unit: 'PCS', price: 410 },
  { id: 4, name: 'Metal Furring Channel', code: 'MF-004', category: 'Accessories', stock: 230, minimum: 80, unit: 'PCS', price: 145 }
];

const initialOrders = [
  {
    id: 'ORD-1001',
    customer: 'ABC Industries',
    product: 'Gypsum Board',
    quantity: 500,
    date: '04 Sep 2026',
    delivery: '10 Sep 2026',
    amount: 250000,
    status: 'Processing',
    address: 'Plot 42, Auto Nagar, Vijayawada, AP',
    phone: '+91 98765 43210'
  },
  {
    id: 'ORD-1002',
    customer: 'XYZ Constructions',
    product: 'Ceiling Board',
    quantity: 300,
    date: '04 Sep 2026',
    delivery: '08 Sep 2026',
    amount: 234000,
    status: 'Ready for Dispatch',
    address: 'Bunder Road, Near Benz Circle, Vijayawada, AP',
    phone: '+91 99887 76655'
  },
  {
    id: 'ORD-1003',
    customer: 'BuildTech Pvt Ltd',
    product: 'Gypsum Sheet',
    quantity: 190,
    date: '03 Sep 2026',
    delivery: '09 Sep 2026',
    amount: 78000,
    status: 'Delivered',
    address: 'MG Inner Ring Road, Guntur, AP',
    phone: '+91 98661 23456',
    paymentMethod: 'UPI',
    partnerId: 'DP-402',
    partnerName: 'Alex Kumar'
  },
  {
    id: 'ORD-1004',
    customer: 'Orbit Infra',
    product: 'Metal Furring Channel',
    quantity: 120,
    date: '02 Sep 2026',
    delivery: '07 Sep 2026',
    amount: 17400,
    status: 'Confirmed',
    address: 'Madhapur Tech Zone, Hyderabad, TS',
    phone: '+91 98123 45678'
  },
  {
    id: 'ORD-1005',
    customer: 'Mehta Builders',
    product: 'Gypsum Board',
    quantity: 150,
    date: '05 Sep 2026',
    delivery: '11 Sep 2026',
    amount: 78000,
    status: 'Ready for Dispatch',
    address: 'Dwaraka Nagar, Visakhapatnam, AP',
    phone: '+91 98450 12345'
  }
];

const initialDispatches = [
  { id: 'DSP-001', order: 'ORD-1002', customer: 'XYZ Constructions', products: 'Ceiling Board - 300 PCS', date: '04 Sep 2026', delivery: '08 Sep 2026', status: 'Dispatched' },
  { id: 'DSP-002', order: 'ORD-1003', customer: 'BuildTech Pvt Ltd', products: 'Gypsum Sheet - 190 PCS', date: '03 Sep 2026', delivery: '09 Sep 2026', status: 'Delivered' },
  { id: 'DSP-003', order: 'ORD-1001', customer: 'ABC Industries', products: 'Gypsum Board - 500 PCS', date: '05 Sep 2026', delivery: '10 Sep 2026', status: 'Ready for Dispatch' }
];

const initialActivities = [
  { id: 'act-1', icon: 'users', title: 'New customer added', detail: 'ABC Industries registered', time: '09:42 AM' },
  { id: 'act-2', icon: 'truck', title: 'Ready for dispatch', detail: 'ORD-1002 · 300 PCS', time: '08:20 AM' },
  { id: 'act-3', icon: 'alert', title: 'Stock needs attention', detail: '1 product below minimum', time: 'Yesterday' }
];

const initialPersonalHistory = [
  {
    id: 'ORD-1003',
    partnerId: 'DP-402',
    partnerName: 'Alex Kumar',
    customer: 'BuildTech Pvt Ltd',
    product: 'Gypsum Sheet',
    quantity: 190,
    amount: 78000,
    deliveredAt: '03 Sep 2026, 03:45 PM',
    paymentMethod: 'UPI',
    address: 'MG Inner Ring Road, Guntur, AP'
  },
  {
    id: 'ORD-0994',
    partnerId: 'DP-402',
    partnerName: 'Alex Kumar',
    customer: 'Apex Plastering Solutions',
    product: 'Ceiling Board',
    quantity: 250,
    amount: 195000,
    deliveredAt: '02 Sep 2026, 11:20 AM',
    paymentMethod: 'Cash',
    address: 'Governorpet, Vijayawada, AP'
  },
  {
    id: 'ORD-0988',
    partnerId: 'DP-405',
    partnerName: 'Ramesh Singh',
    customer: 'Sri Krishna Interiors',
    product: 'Metal Furring Channel',
    quantity: 400,
    amount: 58000,
    deliveredAt: '01 Sep 2026, 05:10 PM',
    paymentMethod: 'Card',
    address: 'Kalyan Nagar, Vijayawada, AP'
  },
  {
    id: 'ORD-0972',
    partnerId: 'DP-405',
    partnerName: 'Ramesh Singh',
    customer: 'Delta Infrastructures',
    product: 'Gypsum Board',
    quantity: 120,
    amount: 62400,
    deliveredAt: '01 Sep 2026, 01:15 PM',
    paymentMethod: 'Cash',
    address: 'Enikepadu, Vijayawada, AP'
  }
];

const money = (value) => `₹${Number(value).toLocaleString('en-IN')}`;
const statusClass = (status) => status.toLowerCase().replaceAll(' ', '-');

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('buildstock_user');
      return saved ? JSON.parse(saved) : initialUsers[0];
    } catch {
      return initialUsers[0];
    }
  });

  const [page, setPage] = useState(() => (currentUser?.role === 'delivery' ? 'DeliveryHome' : 'Dashboard'));
  const [customers, setCustomers] = useState(initialCustomers);
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [dispatches, setDispatches] = useState(initialDispatches);
  const [activities, setActivities] = useState(initialActivities);
  const [personalHistory, setPersonalHistory] = useState(initialPersonalHistory);
  const [drilldownPartner, setDrilldownPartner] = useState(null);

  const [query, setQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [notice, setNotice] = useState('');

  // Delivery module state
  const [deliveryModal, setDeliveryModal] = useState(null); // { step: 'detail' | 'payment', order: {...} }

  const notify = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2800);
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('buildstock_user', JSON.stringify(user));
    } catch {}
    if (user.role === 'delivery') {
      setPage('DeliveryHome');
    } else {
      setPage('Dashboard');
    }
    notify(`Signed in as ${user.name} (${user.role === 'admin' ? 'Admin / Manager' : 'Delivery Partner'})`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('buildstock_user');
    } catch {}
    setPage('Login');
    notify('Signed out successfully');
  };

  // ROUTE GUARD: Delivery partner is restricted strictly to DeliveryHome!
  const navigate = (nextPage) => {
    if (currentUser?.role === 'delivery') {
      if (nextPage !== 'DeliveryHome') {
        notify('Access restricted: Delivery partners can only access Delivery Home.');
        setPage('DeliveryHome');
        return;
      }
    }
    setPage(nextPage);
    setSidebarOpen(false);
    setQuery('');
    setMobileSearchOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const lowStock = products.filter((product) => product.stock <= product.minimum);
  const readyOrders = orders.filter((o) => o.status === 'Ready for Dispatch' || o.status === 'Ready for dispatch');

  const searchResults = query.length > 1 ? [
    ...customers.filter((item) => `${item.name} ${item.company}`.toLowerCase().includes(query.toLowerCase())).map((item) => ({ type: 'Customer', label: item.name, sub: item.company, target: 'Customers' })),
    ...orders.filter((item) => `${item.id} ${item.customer} ${item.product}`.toLowerCase().includes(query.toLowerCase())).map((item) => ({ type: 'Order', label: item.id, sub: item.customer, target: 'Orders' })),
    ...products.filter((item) => `${item.name} ${item.code}`.toLowerCase().includes(query.toLowerCase())).map((item) => ({ type: 'Product', label: item.name, sub: item.code, target: 'Inventory' }))
  ].slice(0, 6) : [];

  const saveCustomer = (form) => {
    setCustomers((items) => [...items, { ...form, id: Date.now() }]);
    setModal(null);
    notify('Customer added successfully');
  };

  const saveProduct = (form) => {
    setProducts((items) => [...items, { ...form, id: Date.now(), stock: Number(form.stock), minimum: Number(form.minimum), price: Number(form.price) }]);
    setModal(null);
    notify('Product added successfully');
  };

  const advanceOrder = (order) => {
    const statuses = ['Pending', 'Confirmed', 'Processing', 'Ready for Dispatch', 'Dispatched', 'Delivered'];
    const next = statuses[Math.min(statuses.indexOf(order.status) + 1, statuses.length - 1)];
    setOrders((items) => items.map((item) => item.id === order.id ? { ...item, status: next } : item));
    notify(`${order.id} moved to ${next}`);
  };

  // Delivery completion handler (Delivered button -> Payment choice -> Complete)
  const completeDelivery = (order, paymentMethod) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nowDate = 'Today';
    const partnerId = currentUser?.role === 'delivery' ? currentUser.id : 'DP-402';
    const partnerName = currentUser?.role === 'delivery' ? currentUser.name : 'Alex Kumar';

    // 1. Update order status to Delivered
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: 'Delivered', paymentMethod, partnerId, partnerName } : o))
    );

    // 2. Update dispatch record if exists
    setDispatches((prev) =>
      prev.map((d) => (d.order === order.id ? { ...d, status: 'Delivered', partnerId, partnerName } : d))
    );

    // 3. Log to Quick Activity
    const newActivity = {
      id: `act-${Date.now()}`,
      icon: 'check',
      title: `${order.id} Delivered`,
      detail: `${order.customer} · ${money(order.amount)} via ${paymentMethod} (${partnerName})`,
      time: `${nowTime}`
    };
    setActivities((prev) => [newActivity, ...prev]);

    // 4. Add to delivery person's personal record
    const newPersonalEntry = {
      id: order.id,
      partnerId,
      partnerName,
      customer: order.customer,
      product: order.product,
      quantity: order.quantity,
      amount: order.amount,
      deliveredAt: `${nowDate}, ${nowTime}`,
      paymentMethod,
      address: order.address || 'Customer site, Vijayawada'
    };
    setPersonalHistory((prev) => [newPersonalEntry, ...prev]);

    // 5. Close modals & notify
    setDeliveryModal(null);
    notify(`Order ${order.id} delivered! ${money(order.amount)} received via ${paymentMethod}`);
  };

  // If user is logged out, render Login Screen
  if (!currentUser || page === 'Login') {
    return <LoginScreen onLogin={handleLogin} users={initialUsers} />;
  }

  // If role is DELIVERY PARTNER: render ONLY the restricted Delivery Partner Home Mini-App!
  if (currentUser.role === 'delivery') {
    return (
      <DeliveryPartnerApp
        currentUser={currentUser}
        orders={orders}
        personalHistory={personalHistory}
        activities={activities}
        deliveryModal={deliveryModal}
        setDeliveryModal={setDeliveryModal}
        completeDelivery={completeDelivery}
        handleLogout={handleLogout}
        onSwitchUser={() => setModal('switchUser')}
        notify={notify}
        notice={notice}
        modal={modal}
        setModal={setModal}
        initialUsers={initialUsers}
        handleLogin={handleLogin}
      />
    );
  }

  // If role is ADMIN / MANAGER: full Dashboard with Delivery Monitoring!
  return (
    <div className="app-shell">
      <Sidebar
        page={page}
        navigate={navigate}
        open={sidebarOpen}
        close={() => setSidebarOpen(false)}
        lowStockCount={lowStock.length}
        readyCount={readyOrders.length}
        currentUser={currentUser}
        onSwitchUser={() => setModal('switchUser')}
        onLogout={handleLogout}
      />

      <main className="main-shell">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open navigation">
            <Menu size={20} />
          </button>
          <div className="crumb">
            <span>Workspace</span>
            <ChevronRight size={14} />
            <strong>{page}</strong>
          </div>
          <div className="top-actions">
            {/* Quick Role Switcher Button */}
            <button
              type="button"
              className="role-switch-badge"
              onClick={() => setModal('switchUser')}
              title="Switch between Admin and Delivery Partner"
            >
              <Shield size={13} />
              <span>Admin Mode</span>
              <span className="role-switch-hint">Switch</span>
            </button>

            <button className="mobile-badge-btn" onClick={() => setModal('mobile')} title="Mobile Connection">
              <Smartphone size={15} />
              <span>Mobile Access</span>
            </button>
            <div className={`global-search ${mobileSearchOpen ? 'mobile-active' : ''}`}>
              <Search size={17} onClick={() => setMobileSearchOpen(!mobileSearchOpen)} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search anything..."
                autoFocus={mobileSearchOpen}
              />
              {mobileSearchOpen && (
                <button className="icon-button" onClick={() => { setMobileSearchOpen(false); setQuery(''); }}>
                  <X size={16} />
                </button>
              )}
              {searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.map((result) => (
                    <button
                      key={`${result.type}-${result.label}`}
                      onClick={() => { setQuery(''); setMobileSearchOpen(false); navigate(result.target); }}
                    >
                      <span className="result-icon">{result.type[0]}</span>
                      <span><b>{result.label}</b><small>{result.type} · {result.sub}</small></span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="icon-button notification-button" onClick={() => setModal('notifications')} aria-label="Notifications">
              <Bell size={18} />
              <i />
            </button>
            <button className="profile-trigger" onClick={() => setModal('switchUser')} title="Click to view profile or switch role">
              <span className="avatar">{currentUser.avatar}</span>
              <span className="profile-copy"><b>{currentUser.name}</b><small>{currentUser.title}</small></span>
              <ChevronDown size={15} />
            </button>
          </div>
        </header>

        <div className="content-area">
          <PageHeader page={page} setModal={setModal} />
          <PageContent
            page={page}
            products={products}
            lowStock={lowStock}
            orders={orders}
            customers={customers}
            dispatches={dispatches}
            activities={activities}
            personalHistory={personalHistory}
            deliveryPartners={initialUsers.filter((u) => u.role === 'delivery')}
            setModal={setModal}
            advanceOrder={advanceOrder}
            setProducts={setProducts}
            setDispatches={setDispatches}
            notify={notify}
            navigate={navigate}
            setDeliveryModal={setDeliveryModal}
            onDrilldown={(partner) => setDrilldownPartner(partner)}
          />
          {notice && <div className="toast"><Check size={17} />{notice}</div>}
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar (Admin) */}
      <MobileBottomNav
        page={page}
        navigate={navigate}
        lowStock={lowStock.length}
        readyCount={readyOrders.length}
        openMenu={() => setSidebarOpen(true)}
      />

      {/* Modals */}
      {modal === 'customer' && <CustomerModal close={() => setModal(null)} save={saveCustomer} />}
      {modal === 'product' && <ProductModal close={() => setModal(null)} save={saveProduct} />}
      {modal === 'notifications' && <NotificationPanel close={() => setModal(null)} />}
      {modal === 'mobile' && <MobileAccessModal close={() => setModal(null)} notify={notify} />}
      {modal === 'switchUser' && (
        <SwitchUserModal
          current={currentUser}
          users={initialUsers}
          onSelect={handleLogin}
          onLogout={handleLogout}
          close={() => setModal(null)}
        />
      )}
      {modal?.type === 'order' && <OrderModal order={modal.order} close={() => setModal(null)} advanceOrder={advanceOrder} />}
      {modal?.type === 'dispatch' && <DispatchModal dispatch={modal.dispatch} close={() => setModal(null)} />}

      {/* Admin Drill-down History Modal */}
      {drilldownPartner && (
        <PartnerDrilldownModal
          partner={drilldownPartner}
          personalHistory={personalHistory}
          close={() => setDrilldownPartner(null)}
          notify={notify}
        />
      )}

      {/* Delivery Module 2-Step Modals (if triggered) */}
      {deliveryModal?.step === 'detail' && (
        <DeliveryDetailModal
          order={deliveryModal.order}
          close={() => setDeliveryModal(null)}
          onDelivered={() => setDeliveryModal({ step: 'payment', order: deliveryModal.order })}
        />
      )}
      {deliveryModal?.step === 'payment' && (
        <DeliveryPaymentModal
          order={deliveryModal.order}
          close={() => setDeliveryModal(null)}
          onBack={() => setDeliveryModal({ step: 'detail', order: deliveryModal.order })}
          onConfirmPayment={(method) => completeDelivery(deliveryModal.order, method)}
        />
      )}
    </div>
  );
}

function Sidebar({ page, navigate, open, close, lowStockCount, readyCount, currentUser, onSwitchUser, onLogout }) {
  const links = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Customers', icon: Users },
    { label: 'Orders', icon: FileText },
    { label: 'Inventory', icon: Boxes, badge: lowStockCount > 0 ? lowStockCount : null },
    { label: 'Dispatch', icon: Package },
    { label: 'Delivery Monitoring', icon: Truck, badge: readyCount > 0 ? readyCount : null, badgeClass: 'badge-teal' },
    { label: 'Settings', icon: Settings }
  ];

  return (
    <>
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><Zap size={19} fill="currentColor" /></div>
          <div><b>BuildStock</b><span>Inventory & Sales</span></div>
          <button className="close-sidebar" onClick={close} aria-label="Close navigation"><X size={18} /></button>
        </div>
        <div className="workspace-label">ADMIN CONSOLE</div>
        <nav className="sidebar-nav">
          {links.map(({ label, icon: Icon, badge, badgeClass }) => (
            <button
              className={`sidebar-btn ${page === label ? 'active' : ''}`}
              key={label}
              onClick={() => navigate(label)}
            >
              <Icon size={18} />
              <span>{label}</span>
              {badge && <span className={`nav-badge ${badgeClass || ''}`}>{badge}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-profile-box">
            <div className="sidebar-profile" onClick={() => navigate('Settings')} style={{ cursor: 'pointer' }}>
              <span className="avatar">{currentUser?.avatar || 'AU'}</span>
              <div><b>{currentUser?.name || 'Admin User'}</b><small>{currentUser?.title || 'Manager'}</small></div>
            </div>
            <div className="sidebar-footer-actions">
              <button type="button" className="footer-action-btn" onClick={onSwitchUser} title="Switch User Role">
                <UserCheck size={13} />
                <span>Switch Role</span>
              </button>
              <button type="button" className="footer-action-btn logout" onClick={onLogout} title="Sign Out">
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
      {open && <div className="sidebar-scrim" onClick={close} />}
    </>
  );
}

function PageHeader({ page, setModal }) {
  const titles = {
    Dashboard: ['Dashboard', 'Overview of your sales, products, customers and orders.'],
    'Delivery Monitoring': ['Delivery Monitoring & Reconciliation', 'Live partner status, drop fulfillment tracking, and cash reconciliation.'],
    Delivery: ['Delivery Module', 'Orders ready for dispatch, order fulfillment, and monthly personal records.'],
    Customers: ['Customers', 'Manage your customers and their contact information.'],
    Orders: ['Orders', 'Track and manage active customer orders.'],
    Inventory: ['Inventory', 'Monitor current product stock levels.'],
    Dispatch: ['Dispatch', 'Track dispatched and delivered customer orders.'],
    Settings: ['Settings & Profile', 'Manage company details, preferences, and delivery options.'],
    Profile: ['Settings & Profile', 'Manage your personal and company information.']
  };
  const [title, subtitle] = titles[page] || ['BuildStock', ''];

  return (
    <div className="page-header">
      <div>
        <p className="eyebrow">BuildStock Platform</p>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {page === 'Dashboard' && <div className="date-filter"><Clock3 size={16} /><span>This Month</span><ChevronDown size={15} /></div>}
      {page === 'Customers' && <button className="primary-button" onClick={() => setModal('customer')}><Plus size={17} /> Add Customer</button>}
      {page === 'Inventory' && <button className="primary-button" onClick={() => setModal('product')}><Plus size={17} /> Add Product</button>}
    </div>
  );
}

function PageContent({ page, onDrilldown, ...props }) {
  if (page === 'Dashboard') return <Dashboard {...props} />;
  if (page === 'Delivery Monitoring') return <DeliveryMonitoring {...props} onDrilldown={onDrilldown} />;
  if (page === 'Delivery') return <Delivery {...props} />;
  if (page === 'Customers') return <Customers {...props} />;
  if (page === 'Orders') return <Orders {...props} />;
  if (page === 'Inventory') return <Inventory {...props} />;
  if (page === 'Dispatch') return <Dispatch {...props} />;
  return <Profile {...props} />;
}

/* ===================================================================
   DASHBOARD COMPONENT (Mobile-Optimized)
   =================================================================== */
function Dashboard({ products, lowStock, orders, setModal, navigate, activities }) {
  const sales = [25, 32, 28, 41, 35, 48, 39];

  return (
    <>
      <section className="stats-grid">
        <StatCard icon={ShoppingCart} label="Total Sales" value="1,248" note="transactions this month" change="12.5%" tone="blue" />
        <StatCard icon={CreditCard} label="Total Sales Value" value="₹18,45,750" note="sales amount this month" change="8.2%" tone="green" />
        <StatCard icon={Package} label="Total Products" value={products.length * 89} note="products currently listed" change="4.8%" tone="amber" />
        <StatCard icon={AlertTriangle} label="Products Short" value={lowStock.length} note="below minimum stock" change="Needs attention" tone="red" />
      </section>

      <section className="dashboard-grid">
        <div className="panel chart-panel">
          <PanelHeading title="Sales overview" meta="Last 7 days" />
          <div className="chart-scroll-wrapper">
            <div className="chart-area">
              <div className="y-labels"><span>₹50k</span><span>₹35k</span><span>₹20k</span><span>₹0</span></div>
              <div className="chart">
                <div className="grid-lines"><i /><i /><i /><i /></div>
                <svg viewBox="0 0 700 240" preserveAspectRatio="none" aria-label="Sales chart">
                  <defs>
                    <linearGradient id="salesFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0" stopColor="#2bb3a3" stopOpacity=".24" />
                      <stop offset="1" stopColor="#2bb3a3" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,150 L116,104 L233,128 L350,54 L466,94 L583,20 L700,70 L700,240 L0,240 Z" fill="url(#salesFill)" />
                  <polyline points="0,150 116,104 233,128 350,54 466,94 583,20 700,70" fill="none" stroke="#1a9b91" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                  {sales.map((value, index) => (
                    <circle key={value} cx={index * 116.6} cy={240 - value * 4.5} r="5" fill="#fff" stroke="#1a9b91" strokeWidth="3" />
                  ))}
                </svg>
                <div className="x-labels">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => <span key={day}>{day}</span>)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="panel activity-panel">
          <PanelHeading title="Quick activity" meta="Live feed" />
          <div className="activity-list">
            {activities.slice(0, 4).map((act) => {
              const iconMap = {
                users: Users,
                truck: Truck,
                alert: AlertTriangle,
                check: CheckCircle2
              };
              const IconComp = iconMap[act.icon] || Zap;
              return (
                <Activity
                  key={act.id}
                  icon={IconComp}
                  title={act.title}
                  detail={act.detail}
                  time={act.time}
                  highlight={act.icon === 'check'}
                />
              );
            })}
          </div>
          <button className="text-button" onClick={() => navigate('Orders')}>
            View all activity <ArrowUpRight size={15} />
          </button>
        </div>
      </section>

      <section className="lower-grid">
        <div className="panel table-panel">
          <PanelHeading title="Recent orders" action="View all" onAction={() => navigate('Orders')} />
          <div className="table-scroll">
            <table>
              <thead><tr><th>Order</th><th>Customer</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {orders.slice(0, 4).map((order) => (
                  <tr key={order.id} onClick={() => setModal({ type: 'order', order })}>
                    <td><b>{order.id}</b><small>{order.date}</small></td>
                    <td>{order.customer}</td>
                    <td><b>{money(order.amount)}</b></td>
                    <td><StatusBadge status={order.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="panel stock-panel">
          <PanelHeading title="Low stock products" action="View inventory" onAction={() => navigate('Inventory')} />
          {lowStock.slice(0, 3).map((product) => (
            <div className="stock-row" key={product.id}>
              <div className="stock-title"><span>{product.name}</span><b>{product.stock}/{product.minimum} PCS</b></div>
              <div className="progress"><i className={product.stock <= product.minimum * 0.25 ? 'critical' : ''} style={{ width: `${Math.min(product.stock / product.minimum * 100, 100)}%` }} /></div>
              <small>{product.stock <= product.minimum * 0.25 ? 'Critical' : 'Low stock'} · {product.unit}</small>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function StatCard({ icon: Icon, label, value, note, change, tone }) {
  return (
    <div className={`stat-card ${tone}`}>
      <div className="stat-top">
        <span className="stat-icon"><Icon size={19} /></span>
        <span className="stat-change">{change === 'Needs attention' ? <AlertTriangle size={13} /> : <ArrowUpRight size={13} />} {change}</span>
      </div>
      <p>{label}</p>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  );
}

function PanelHeading({ title, meta, action, onAction }) {
  return (
    <div className="panel-heading">
      <div><h2>{title}</h2>{meta && <span>{meta}</span>}</div>
      {action && <button className="text-button" onClick={onAction}>{action}<ArrowUpRight size={15} /></button>}
    </div>
  );
}

function Activity({ icon: Icon, title, detail, time, highlight }) {
  return (
    <div className={`activity-row ${highlight ? 'activity-highlight' : ''}`}>
      <span className={`activity-icon ${highlight ? 'highlight-teal' : ''}`}><Icon size={16} /></span>
      <div><b>{title}</b><small>{detail}</small></div>
      <time>{time}</time>
    </div>
  );
}

function StatusBadge({ status }) {
  return <span className={`status-badge ${statusClass(status)}`}><i />{status}</span>;
}

/* ===================================================================
   DELIVERY MODULE COMPONENT (Orders Tab & Personal Tab)
   =================================================================== */
function Delivery({ orders, personalHistory, deliveryAgent, setDeliveryModal }) {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'personal'
  const [orderFilter, setOrderFilter] = useState('ready'); // 'ready' | 'all'

  const readyOrders = orders.filter(
    (o) => o.status === 'Ready for Dispatch' || o.status === 'Ready for dispatch'
  );
  const displayedOrders = orderFilter === 'ready' ? readyOrders : orders;

  const totalDeliveredMonth = personalHistory.length;
  const totalAmountCollected = personalHistory.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <div className="delivery-module">
      {/* Sub-Tabs: Orders vs Personal */}
      <div className="delivery-tabs-bar">
        <div className="delivery-tab-buttons">
          <button
            className={`delivery-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <Truck size={17} />
            <span>Orders for Delivery</span>
            <span className="tab-pill">{readyOrders.length}</span>
          </button>
          <button
            className={`delivery-tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            <UserCheck size={17} />
            <span>Personal Record</span>
            <span className="tab-pill personal-pill">{totalDeliveredMonth}</span>
          </button>
        </div>
      </div>

      {activeTab === 'orders' && (
        <section className="delivery-orders-section">
          {/* Action & Filter Toolbar */}
          <div className="delivery-toolbar">
            <div className="toolbar-info">
              <h3>Orders Ready for Delivery</h3>
              <p>Select an order below to inspect details and fulfill delivery</p>
            </div>
            <div className="delivery-filter-pills">
              <button
                className={orderFilter === 'ready' ? 'pill-active' : ''}
                onClick={() => setOrderFilter('ready')}
              >
                Ready Only ({readyOrders.length})
              </button>
              <button
                className={orderFilter === 'all' ? 'pill-active' : ''}
                onClick={() => setOrderFilter('all')}
              >
                All Orders ({orders.length})
              </button>
            </div>
          </div>

          {displayedOrders.length === 0 ? (
            <div className="empty-state panel">
              <Package size={36} color="#1a9b91" />
              <b>No orders ready for delivery right now</b>
              <p>All active dispatches are either completed or in processing.</p>
            </div>
          ) : (
            <div className="delivery-cards-grid">
              {displayedOrders.map((order) => {
                const isReady = order.status === 'Ready for Dispatch' || order.status === 'Ready for dispatch';
                const isDelivered = order.status === 'Delivered';

                return (
                  <div
                    key={order.id}
                    className={`delivery-order-card panel ${isReady ? 'card-ready' : ''}`}
                    onClick={() => setDeliveryModal({ step: 'detail', order })}
                  >
                    <div className="order-card-header">
                      <div>
                        <span className="order-code">{order.id}</span>
                        <span className="order-date">{order.date}</span>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>

                    <div className="order-customer-box">
                      <div className="customer-avatar-small">
                        {order.customer.split(' ').map((x) => x[0]).join('').slice(0, 2)}
                      </div>
                      <div className="customer-text">
                        <b>{order.customer}</b>
                        <span><Phone size={12} /> {order.phone || '+91 98765 00000'}</span>
                      </div>
                    </div>

                    <div className="order-product-badge">
                      <Package size={15} />
                      <span className="product-title">{order.product}</span>
                      <strong className="qty-tag">{order.quantity} PCS</strong>
                    </div>

                    <div className="order-address-snippet">
                      <MapPin size={13} />
                      <span>{order.address || 'Auto Nagar, Vijayawada, Andhra Pradesh'}</span>
                    </div>

                    <div className="order-card-footer">
                      <div className="order-amount-box">
                        <small>Order Value</small>
                        <strong>{money(order.amount)}</strong>
                      </div>
                      {isDelivered ? (
                        <span className="delivered-tag">
                          <CheckCircle2 size={15} /> Delivered ({order.paymentMethod || 'Paid'})
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="take-order-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeliveryModal({ step: 'detail', order });
                          }}
                        >
                          <span>Take this order for delivery</span>
                          <ArrowRight size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {activeTab === 'personal' && (
        <section className="delivery-personal-section">
          {/* Delivery Person Identity Hero */}
          <div className="agent-hero-card panel">
            <div className="agent-identity">
              <div className="agent-avatar">
                {deliveryAgent.name.split(' ').map((x) => x[0]).join('')}
              </div>
              <div>
                <div className="agent-title-row">
                  <h2>{deliveryAgent.name}</h2>
                  <span className="agent-badge-id">{deliveryAgent.id}</span>
                  <span className="online-pill"><i /> Active on Shift</span>
                </div>
                <p className="agent-role">{deliveryAgent.role} · {deliveryAgent.vehicle}</p>
              </div>
            </div>
            <div className="agent-quick-contact">
              <span><Phone size={13} /> {deliveryAgent.phone}</span>
              <span className="star-rating"><Star size={13} fill="#e9a23b" color="#e9a23b" /> {deliveryAgent.rating}</span>
            </div>
          </div>

          {/* Monthly Stats Cards */}
          <div className="personal-stats-grid">
            <div className="personal-stat-card tone-teal">
              <div className="p-stat-icon"><Truck size={20} /></div>
              <div className="p-stat-info">
                <small>Delivered This Month</small>
                <strong>{totalDeliveredMonth} Orders</strong>
                <span>Target: {deliveryAgent.monthlyTarget} ({(totalDeliveredMonth / deliveryAgent.monthlyTarget * 100).toFixed(0)}%)</span>
              </div>
            </div>

            <div className="personal-stat-card tone-green">
              <div className="p-stat-icon"><Banknote size={20} /></div>
              <div className="p-stat-info">
                <small>Total Value Collected</small>
                <strong>{money(totalAmountCollected)}</strong>
                <span>Direct customer collections</span>
              </div>
            </div>

            <div className="personal-stat-card tone-blue">
              <div className="p-stat-icon"><Clock3 size={20} /></div>
              <div className="p-stat-info">
                <small>Avg Delivery Time</small>
                <strong>38 Mins</strong>
                <span>On-time dispatch rate: 98.4%</span>
              </div>
            </div>
          </div>

          {/* Delivered Orders History */}
          <div className="panel personal-history-panel">
            <div className="history-header">
              <div>
                <h3>Monthly Delivery History</h3>
                <span className="muted">Detailed log of all completed drops and collected payments</span>
              </div>
              <span className="count-tag">{personalHistory.length} completed</span>
            </div>

            <div className="history-list">
              {personalHistory.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="history-item">
                  <div className="history-icon">
                    <CheckCircle2 size={18} />
                  </div>
                  <div className="history-main">
                    <div className="history-line-1">
                      <b>{item.customer}</b>
                      <span className="history-order-id">{item.id}</span>
                      <span className={`payment-pill ${item.paymentMethod ? item.paymentMethod.toLowerCase() : 'cash'}`}>
                        {item.paymentMethod || 'Cash'}
                      </span>
                    </div>
                    <div className="history-line-2">
                      <span>{item.product} · {item.quantity ? `${item.quantity} PCS` : ''}</span>
                      <span className="dot-sep">•</span>
                      <span>{item.address}</span>
                    </div>
                  </div>
                  <div className="history-amount">
                    <strong>{money(item.amount)}</strong>
                    <small>{item.deliveredAt}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

/* ===================================================================
   STANDALONE DELIVERY PARTNER MINI-APP (Restricted Mobile-First Experience)
   =================================================================== */
function DeliveryPartnerApp({
  currentUser,
  orders,
  personalHistory,
  activities,
  deliveryModal,
  setDeliveryModal,
  completeDelivery,
  handleLogout,
  onSwitchUser,
  notify,
  notice,
  modal,
  setModal,
  initialUsers,
  handleLogin
}) {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'personal'
  const [orderFilter, setOrderFilter] = useState('ready'); // 'ready' | 'all'

  const readyOrders = orders.filter(
    (o) => o.status === 'Ready for Dispatch' || o.status === 'Ready for dispatch'
  );
  const displayedOrders = orderFilter === 'ready' ? readyOrders : orders;

  // STRICT DATA ISOLATION: Delivery partner only sees their own delivered records!
  const myHistory = personalHistory.filter((item) => item.partnerId === currentUser.id);
  const totalDeliveredMonth = myHistory.length;
  const totalAmountCollected = myHistory.reduce((sum, item) => sum + Number(item.amount), 0);
  const monthlyTarget = currentUser.monthlyTarget || 35;
  const targetPct = Math.min(100, Math.round((totalDeliveredMonth / monthlyTarget) * 100));

  return (
    <div className="partner-app-shell">
      {/* Top Standalone Header */}
      <header className="partner-header">
        <div className="partner-header-top">
          <div className="partner-id-wrap">
            <div className="partner-avatar">{currentUser.avatar}</div>
            <div>
              <div className="partner-name-row">
                <h3>{currentUser.name}</h3>
                <span className="partner-id-chip">{currentUser.id}</span>
              </div>
              <p className="partner-vehicle-text">{currentUser.vehicle}</p>
            </div>
          </div>
          <div className="partner-header-actions">
            <button type="button" className="partner-switch-pill" onClick={onSwitchUser} title="Switch User Role">
              <UserCheck size={14} />
              <span>Switch</span>
            </button>
            <button type="button" className="partner-logout-pill" onClick={handleLogout} title="Sign Out">
              <LogOut size={14} />
              <span>Exit</span>
            </button>
          </div>
        </div>

        <div className="partner-status-bar">
          <span className="partner-live-pill"><i /> Active on Shift</span>
          <span className="partner-date-text"><Clock3 size={12} /> Today, 22 Sep 2026</span>
          <span className="partner-role-indicator">Delivery Partner</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="partner-content">
        {/* Sub-Tabs Switcher */}
        <div className="partner-tabs-card">
          <button
            type="button"
            className={`partner-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <Truck size={17} />
            <span>Orders for Delivery</span>
            <span className="tab-pill">{readyOrders.length}</span>
          </button>
          <button
            type="button"
            className={`partner-tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            <UserCheck size={17} />
            <span>My Personal Record</span>
            <span className="tab-pill personal-pill">{totalDeliveredMonth}</span>
          </button>
        </div>

        {/* Tab 1: Orders for Delivery */}
        {activeTab === 'orders' && (
          <section className="delivery-orders-section">
            <div className="delivery-toolbar">
              <div className="toolbar-info">
                <h3>Dispatch Ready Orders</h3>
                <p>Tap an order below to inspect delivery details and complete drop</p>
              </div>
              <div className="delivery-filter-pills">
                <button
                  type="button"
                  className={orderFilter === 'ready' ? 'pill-active' : ''}
                  onClick={() => setOrderFilter('ready')}
                >
                  Ready Only ({readyOrders.length})
                </button>
                <button
                  type="button"
                  className={orderFilter === 'all' ? 'pill-active' : ''}
                  onClick={() => setOrderFilter('all')}
                >
                  All Orders ({orders.length})
                </button>
              </div>
            </div>

            {displayedOrders.length === 0 ? (
              <div className="empty-state panel">
                <Package size={36} color="#1a9b91" />
                <b>No orders waiting for delivery</b>
                <p>All eligible orders have been dispatched or completed.</p>
              </div>
            ) : (
              <div className="delivery-cards-grid">
                {displayedOrders.map((order) => {
                  const isReady = order.status === 'Ready for Dispatch' || order.status === 'Ready for dispatch';
                  const isDelivered = order.status === 'Delivered';

                  return (
                    <div
                      key={order.id}
                      className={`delivery-order-card panel ${isReady ? 'card-ready' : ''}`}
                      onClick={() => setDeliveryModal({ step: 'detail', order })}
                    >
                      <div className="order-card-header">
                        <div>
                          <span className="order-code">{order.id}</span>
                          <span className="order-date">{order.date}</span>
                        </div>
                        <StatusBadge status={order.status} />
                      </div>

                      <div className="order-customer-box">
                        <div className="customer-avatar-small">
                          {order.customer.split(' ').map((x) => x[0]).join('').slice(0, 2)}
                        </div>
                        <div className="customer-text">
                          <b>{order.customer}</b>
                          <span><Phone size={12} /> {order.phone || '+91 98765 00000'}</span>
                        </div>
                      </div>

                      <div className="order-product-badge">
                        <Package size={15} />
                        <span className="product-title">{order.product}</span>
                        <strong className="qty-tag">{order.quantity} PCS</strong>
                      </div>

                      <div className="order-address-snippet">
                        <MapPin size={13} />
                        <span>{order.address || 'Auto Nagar, Vijayawada, Andhra Pradesh'}</span>
                      </div>

                      <div className="order-card-footer">
                        <div className="order-amount-box">
                          <small>Order Value</small>
                          <strong>{money(order.amount)}</strong>
                        </div>
                        {isDelivered ? (
                          <span className="delivered-tag">
                            <CheckCircle2 size={15} /> Delivered ({order.paymentMethod || 'Paid'})
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="take-order-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeliveryModal({ step: 'detail', order });
                            }}
                          >
                            <span>Take this order for delivery</span>
                            <ArrowRight size={15} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* Tab 2: My Personal Record */}
        {activeTab === 'personal' && (
          <section className="delivery-personal-section">
            <div className="agent-hero-card panel">
              <div className="agent-identity">
                <div className="agent-avatar">{currentUser.avatar}</div>
                <div>
                  <div className="agent-title-row">
                    <h2>{currentUser.name}</h2>
                    <span className="agent-badge-id">{currentUser.id}</span>
                    <span className="online-pill"><i /> Active Shift</span>
                  </div>
                  <p className="agent-role">{currentUser.title} · {currentUser.vehicle}</p>
                </div>
              </div>
              <div className="agent-quick-contact">
                <span><Phone size={13} /> {currentUser.phone}</span>
                <span className="star-rating"><Star size={13} fill="#e9a23b" color="#e9a23b" /> {currentUser.rating}</span>
              </div>
            </div>

            {/* Monthly Stats Cards */}
            <div className="personal-stats-grid">
              <div className="personal-stat-card tone-teal">
                <div className="p-stat-icon"><Truck size={20} /></div>
                <div className="p-stat-info">
                  <small>Delivered This Month</small>
                  <strong>{totalDeliveredMonth} Orders</strong>
                  <span>Target: {monthlyTarget} ({targetPct}%)</span>
                </div>
              </div>

              <div className="personal-stat-card tone-green">
                <div className="p-stat-icon"><Banknote size={20} /></div>
                <div className="p-stat-info">
                  <small>My Collections</small>
                  <strong>{money(totalAmountCollected)}</strong>
                  <span>Direct customer receipts</span>
                </div>
              </div>

              <div className="personal-stat-card tone-blue">
                <div className="p-stat-icon"><Clock3 size={20} /></div>
                <div className="p-stat-info">
                  <small>Avg Drop Time</small>
                  <strong>36 Mins</strong>
                  <span>On-time dispatch rate: 99.1%</span>
                </div>
              </div>
            </div>

            {/* Delivered Orders History */}
            <div className="panel personal-history-panel">
              <div className="history-header">
                <div>
                  <h3>My Monthly Delivery History</h3>
                  <span className="muted">Log of all drops completed by {currentUser.name}</span>
                </div>
                <span className="count-tag">{myHistory.length} completed</span>
              </div>

              {myHistory.length === 0 ? (
                <div className="empty-state-mini">
                  <Package size={24} color="#1a9b91" />
                  <p>No delivered orders recorded under your ID yet this month.</p>
                </div>
              ) : (
                <div className="history-list">
                  {myHistory.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="history-item">
                      <div className="history-icon">
                        <CheckCircle2 size={18} />
                      </div>
                      <div className="history-main">
                        <div className="history-line-1">
                          <b>{item.customer}</b>
                          <span className="history-order-id">{item.id}</span>
                          <span className={`payment-pill ${item.paymentMethod ? item.paymentMethod.toLowerCase() : 'cash'}`}>
                            {item.paymentMethod || 'Cash'}
                          </span>
                        </div>
                        <div className="history-line-2">
                          <span>{item.product} · {item.quantity ? `${item.quantity} PCS` : ''}</span>
                          <span className="dot-sep">•</span>
                          <span>{item.address}</span>
                        </div>
                      </div>
                      <div className="history-amount">
                        <strong>{money(item.amount)}</strong>
                        <small>{item.deliveredAt}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Floating toast */}
      {notice && <div className="toast"><Check size={17} />{notice}</div>}

      {/* Modals for Delivery Partner */}
      {modal === 'switchUser' && (
        <SwitchUserModal
          current={currentUser}
          users={initialUsers}
          onSelect={handleLogin}
          onLogout={handleLogout}
          close={() => setModal(null)}
        />
      )}

      {deliveryModal?.step === 'detail' && (
        <DeliveryDetailModal
          order={deliveryModal.order}
          close={() => setDeliveryModal(null)}
          onDelivered={() => setDeliveryModal({ step: 'payment', order: deliveryModal.order })}
        />
      )}
      {deliveryModal?.step === 'payment' && (
        <DeliveryPaymentModal
          order={deliveryModal.order}
          close={() => setDeliveryModal(null)}
          onBack={() => setDeliveryModal({ step: 'detail', order: deliveryModal.order })}
          onConfirmPayment={(method) => completeDelivery(deliveryModal.order, method)}
        />
      )}
    </div>
  );
}

/* ===================================================================
   ADMIN: DELIVERY MONITORING & RECONCILIATION COMPONENT
   =================================================================== */
function DeliveryMonitoring({ orders, personalHistory, deliveryPartners, notify, onDrilldown }) {
  const [partnerFilter, setPartnerFilter] = useState('all');
  const [query, setQuery] = useState('');

  // Compute live reconciliation across fleet
  const totalDelivered = personalHistory.length;
  const totalCollections = personalHistory.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalCashInHand = personalHistory
    .filter((item) => item.paymentMethod === 'Cash')
    .reduce((sum, item) => sum + Number(item.amount), 0);
  const totalUpi = personalHistory
    .filter((item) => item.paymentMethod === 'UPI')
    .reduce((sum, item) => sum + Number(item.amount), 0);
  const totalCard = personalHistory
    .filter((item) => item.paymentMethod === 'Card')
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const readyOrdersCount = orders.filter(
    (o) => o.status === 'Ready for Dispatch' || o.status === 'Ready for dispatch'
  ).length;

  // Filter partners
  const displayedPartners = deliveryPartners.filter((p) => {
    if (partnerFilter !== 'all' && p.id !== partnerFilter) return false;
    if (query && !`${p.name} ${p.id} ${p.vehicle}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="delivery-monitoring-view">
      {/* Top Reconciliation Summary Banner */}
      <div className="reconciliation-section">
        <div className="section-title-row">
          <div>
            <h3>Payment Collections & Cash Reconciliation</h3>
            <span className="muted">Live breakdown of customer collections across delivery personnel</span>
          </div>
          <button
            type="button"
            className="primary-button reconcile-action-btn"
            onClick={() => notify(`Cash collections reconciled! ${money(totalCashInHand)} verified for deposit.`)}
          >
            <CheckCircle2 size={16} />
            <span>Reconcile Cash Handover</span>
          </button>
        </div>

        <div className="reconciliation-grid">
          {/* Cash Card */}
          <div className="reconcile-card tone-cash">
            <div className="reconcile-top">
              <span className="reconcile-icon cash"><Banknote size={22} /></span>
              <span className="reconcile-badge pending">Physical Handover Pending</span>
            </div>
            <small>Total Cash in Hand</small>
            <strong>{money(totalCashInHand)}</strong>
            <p>Direct currency collected by partners · Requires manager physical verification</p>
          </div>

          {/* UPI Card */}
          <div className="reconcile-card tone-upi">
            <div className="reconcile-top">
              <span className="reconcile-icon upi"><QrCode size={22} /></span>
              <span className="reconcile-badge settled">Direct Bank Settlement</span>
            </div>
            <small>Total UPI / QR Collections</small>
            <strong>{money(totalUpi)}</strong>
            <p>Settled to ICICI Merchant A/C · Instant bank confirmation</p>
          </div>

          {/* Card POS Card */}
          <div className="reconcile-card tone-card">
            <div className="reconcile-top">
              <span className="reconcile-icon card"><CreditCard size={22} /></span>
              <span className="reconcile-badge batch">POS Batch Clearance</span>
            </div>
            <small>Total Card POS Swipes</small>
            <strong>{money(totalCard)}</strong>
            <p>Terminal #BS-90 batch clearance · T+1 settlement</p>
          </div>

          {/* Total Collections Card */}
          <div className="reconcile-card tone-total">
            <div className="reconcile-top">
              <span className="reconcile-icon total"><Check size={22} /></span>
              <span className="reconcile-badge total">All Modes</span>
            </div>
            <small>Total Collections Today</small>
            <strong>{money(totalCollections)}</strong>
            <p>Across {totalDelivered} completed customer drops</p>
          </div>
        </div>
      </div>

      {/* Fleet Operational Metrics */}
      <div className="monitoring-stats-grid">
        <div className="stat-card blue">
          <div className="stat-top">
            <span className="stat-icon"><Truck size={19} /></span>
            <span className="stat-change">100% Active</span>
          </div>
          <p>Fleet on Duty</p>
          <strong>{deliveryPartners.length} Partners</strong>
          <small>Active shifts logged in</small>
        </div>

        <div className="stat-card green">
          <div className="stat-top">
            <span className="stat-icon"><CheckCircle2 size={19} /></span>
            <span className="stat-change">Today</span>
          </div>
          <p>Completed Deliveries</p>
          <strong>{totalDelivered} Orders</strong>
          <small>Drop fulfillment rate: 100%</small>
        </div>

        <div className="stat-card amber">
          <div className="stat-top">
            <span className="stat-icon"><Clock3 size={19} /></span>
            <span className="stat-change">Ready</span>
          </div>
          <p>Pending Dispatch</p>
          <strong>{readyOrdersCount} Orders</strong>
          <small>Available in Orders tab for pickup</small>
        </div>

        <div className="stat-card teal">
          <div className="stat-top">
            <span className="stat-icon"><Star size={19} /></span>
            <span className="stat-change">Fleet Avg</span>
          </div>
          <p>Customer Rating</p>
          <strong>4.85 ★</strong>
          <small>98.4% on-time delivery</small>
        </div>
      </div>

      {/* Fleet Table Card */}
      <div className="panel fleet-table-panel">
        <div className="fleet-table-header">
          <div>
            <h3>Active Delivery Fleet Status</h3>
            <span className="muted">Live status, orders completed today, and cash held by each partner</span>
          </div>
          <div className="fleet-filter-actions">
            <div className="fleet-search-wrap">
              <Search size={15} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search partner or vehicle..."
              />
            </div>
            <div className="partner-dropdown-wrap">
              <Filter size={15} />
              <select value={partnerFilter} onChange={(e) => setPartnerFilter(e.target.value)}>
                <option value="all">All Delivery Partners ({deliveryPartners.length})</option>
                {deliveryPartners.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="table-scroll">
          <table className="fleet-table">
            <thead>
              <tr>
                <th>Delivery Partner</th>
                <th>ID & Vehicle</th>
                <th>Status</th>
                <th>Today's Deliveries</th>
                <th>Cash in Hand</th>
                <th>Total Value</th>
                <th>Rating</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedPartners.map((partner) => {
                const partnerRecords = personalHistory.filter((item) => item.partnerId === partner.id);
                const partnerCash = partnerRecords
                  .filter((item) => item.paymentMethod === 'Cash')
                  .reduce((sum, item) => sum + Number(item.amount), 0);
                const partnerTotal = partnerRecords.reduce((sum, item) => sum + Number(item.amount), 0);

                return (
                  <tr key={partner.id} onClick={() => onDrilldown(partner)}>
                    <td>
                      <div className="partner-cell">
                        <div className="partner-cell-avatar">{partner.avatar}</div>
                        <div>
                          <b>{partner.name}</b>
                          <small><Phone size={11} /> {partner.phone}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="code-chip">{partner.id}</span>
                      <small className="vehicle-sub">{partner.vehicle}</small>
                    </td>
                    <td>
                      <span className="partner-status-pill on-shift">
                        <i /> Active on Shift
                      </span>
                    </td>
                    <td>
                      <b>{partnerRecords.length} Drops</b>
                      <small>Target: {partner.monthlyTarget || 30}</small>
                    </td>
                    <td>
                      <strong className="cash-highlight">{money(partnerCash)}</strong>
                      <small className="cash-note">{partnerCash > 0 ? 'Pending Handover' : 'Zero Cash'}</small>
                    </td>
                    <td>
                      <strong>{money(partnerTotal)}</strong>
                      <small>{partnerRecords.length} orders total</small>
                    </td>
                    <td>
                      <span className="rating-pill"><Star size={12} fill="#e9a23b" color="#e9a23b" /> {partner.rating}</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="drilldown-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDrilldown(partner);
                        }}
                      >
                        <span>View History</span>
                        <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Production Architecture Security Note */}
      <div className="security-notice-card">
        <div className="sec-icon"><Shield size={22} /></div>
        <div className="sec-text">
          <b>Production Architecture Note: Client-Side vs Backend Role Enforcement</b>
          <p>
            Role-based gating is currently implemented with strict client-side session state and route protection.
            For field production where delivery agents access the system on their personal devices, pair this with
            backend JWT token authentication (e.g. Bearer token in headers) so unauthorized API calls are rejected with <code>401 Unauthorized</code> or <code>403 Forbidden</code>.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ===================================================================
   ADMIN: DRILL-DOWN PARTNER HISTORY MODAL
   =================================================================== */
function PartnerDrilldownModal({ partner, personalHistory, close, notify }) {
  const partnerRecords = personalHistory.filter((item) => item.partnerId === partner.id);
  const totalAmount = partnerRecords.reduce((sum, item) => sum + Number(item.amount), 0);
  const cashAmount = partnerRecords
    .filter((item) => item.paymentMethod === 'Cash')
    .reduce((sum, item) => sum + Number(item.amount), 0);
  const upiAmount = partnerRecords
    .filter((item) => item.paymentMethod === 'UPI')
    .reduce((sum, item) => sum + Number(item.amount), 0);
  const cardAmount = partnerRecords
    .filter((item) => item.paymentMethod === 'Card')
    .reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <ModalShell title={`Delivery Partner Record — ${partner.name}`} close={close} width="680px">
      <div className="modal-body drilldown-modal-body">
        {/* Partner Hero Header */}
        <div className="drilldown-hero">
          <div className="drilldown-avatar">{partner.avatar}</div>
          <div className="drilldown-hero-info">
            <div className="drilldown-name-row">
              <h3>{partner.name}</h3>
              <span className="code-chip">{partner.id}</span>
              <span className="partner-status-pill on-shift"><i /> Active</span>
            </div>
            <p className="drilldown-meta">{partner.title} · {partner.vehicle}</p>
            <div className="drilldown-contact-row">
              <span><Phone size={12} /> {partner.phone}</span>
              <span className="dot-sep">•</span>
              <span><Star size={12} fill="#e9a23b" color="#e9a23b" /> {partner.rating} Rating</span>
            </div>
          </div>
        </div>

        {/* Breakdown by Payment Mode */}
        <div className="drilldown-modes-grid">
          <div className="drilldown-mode-box tone-cash">
            <small>Cash Collected</small>
            <strong>{money(cashAmount)}</strong>
            <span>Physical cash to deposit</span>
          </div>
          <div className="drilldown-mode-box tone-upi">
            <small>UPI Collected</small>
            <strong>{money(upiAmount)}</strong>
            <span>Direct bank transfer</span>
          </div>
          <div className="drilldown-mode-box tone-card">
            <small>Card POS Swipes</small>
            <strong>{money(cardAmount)}</strong>
            <span>Bluetooth POS terminal</span>
          </div>
        </div>

        {/* Delivery Orders List */}
        <div className="drilldown-history-section">
          <div className="drilldown-history-heading">
            <h5>Completed Deliveries History ({partnerRecords.length})</h5>
            <small className="muted">Chronological order fulfillment log for this partner</small>
          </div>

          {partnerRecords.length === 0 ? (
            <div className="empty-state-mini">
              <Package size={24} color="#1a9b91" />
              <p>No deliveries logged yet for this partner today.</p>
            </div>
          ) : (
            <div className="drilldown-list">
              {partnerRecords.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="drilldown-item">
                  <div className="drilldown-item-icon">
                    <CheckCircle2 size={16} />
                  </div>
                  <div className="drilldown-item-content">
                    <div className="drilldown-item-line1">
                      <b>{item.customer}</b>
                      <span className="history-order-id">{item.id}</span>
                      <span className={`payment-pill ${item.paymentMethod ? item.paymentMethod.toLowerCase() : 'cash'}`}>
                        {item.paymentMethod || 'Cash'}
                      </span>
                    </div>
                    <div className="drilldown-item-line2">
                      <span>{item.product} · {item.quantity} PCS</span>
                      <span className="dot-sep">•</span>
                      <span>{item.address}</span>
                    </div>
                  </div>
                  <div className="drilldown-item-amount">
                    <strong>{money(item.amount)}</strong>
                    <small>{item.deliveredAt}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="modal-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={() => notify(`Reconciliation slip for ${partner.name} generated!`)}
        >
          <FileText size={15} /> Print Reconciliation Slip
        </button>
        <button type="button" className="primary-button" onClick={close}>
          Done
        </button>
      </div>
    </ModalShell>
  );
}

/* ===================================================================
   SWITCH USER / ROLE SELECTION MODAL
   =================================================================== */
function SwitchUserModal({ current, users, onSelect, onLogout, close }) {
  return (
    <ModalShell title="Switch User Role / Persona" close={close} width="520px">
      <div className="modal-body switch-user-body">
        <p className="switch-user-intro">
          Select a role below to test access control and permissions:
        </p>

        <div className="presets-list">
          {users.map((u) => {
            const isCurrent = current?.id === u.id;
            return (
              <button
                key={u.id}
                type="button"
                className={`preset-btn ${u.role === 'admin' ? 'preset-admin' : 'preset-delivery'} ${isCurrent ? 'current-active' : ''}`}
                onClick={() => {
                  onSelect(u);
                  close();
                }}
              >
                <div className="preset-avatar">{u.avatar}</div>
                <div className="preset-info">
                  <div className="preset-name-row">
                    <strong>{u.name}</strong>
                    <span className={`preset-role-pill ${u.role}`}>
                      {u.role === 'admin' ? '👑 Admin' : '🚚 Delivery Partner'}
                    </span>
                    {isCurrent && <span className="current-badge">Current</span>}
                  </div>
                  <small>{u.title} · {u.vehicle || u.email}</small>
                </div>
                <ArrowRight size={16} className="preset-arrow" />
              </button>
            );
          })}
        </div>
      </div>
      <div className="modal-actions">
        <button type="button" className="secondary-button" onClick={() => { onLogout(); close(); }}>
          <LogOut size={15} /> Sign Out Completely
        </button>
        <button type="button" className="primary-button" onClick={close}>
          Close
        </button>
      </div>
    </ModalShell>
  );
}

/* ===================================================================
   LOGIN SCREEN (With 1-Tap Demo Switcher)
   =================================================================== */
function LoginScreen({ onLogin, users }) {
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [email, setEmail] = useState(users[0].email);
  const [password, setPassword] = useState('password123');

  const handleSelectPreset = (user) => {
    setSelectedUser(user);
    setEmail(user.email);
    onLogin(user);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const matched = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      onLogin(matched);
    } else {
      onLogin(selectedUser);
    }
  };

  return (
    <div className="login-screen-wrapper">
      <div className="login-card panel">
        {/* Brand Header */}
        <div className="login-brand">
          <div className="login-brand-mark"><Zap size={24} fill="currentColor" /></div>
          <h2>BuildStock</h2>
          <p>Inventory, Sales & Delivery Management System</p>
        </div>

        {/* 1-Tap Quick Demo Personas */}
        <div className="login-presets">
          <div className="login-presets-label">
            <span>SELECT ROLE TO ENTER DEMO (1-TAP)</span>
          </div>

          <div className="presets-list">
            {users.map((u) => (
              <button
                key={u.id}
                type="button"
                className={`preset-btn ${u.role === 'admin' ? 'preset-admin' : 'preset-delivery'}`}
                onClick={() => handleSelectPreset(u)}
              >
                <div className="preset-avatar">{u.avatar}</div>
                <div className="preset-info">
                  <div className="preset-name-row">
                    <strong>{u.name}</strong>
                    <span className={`preset-role-pill ${u.role}`}>
                      {u.role === 'admin' ? '👑 Admin' : '🚚 Delivery Partner'}
                    </span>
                  </div>
                  <small>{u.title} · {u.vehicle || u.email}</small>
                </div>
                <ArrowRight size={16} className="preset-arrow" />
              </button>
            ))}
          </div>
        </div>

        <div className="login-divider">
          <span>OR SIGN IN WITH CREDENTIALS</span>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@buildstock.in"
              required
            />
          </div>

          <div className="login-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="primary-button login-btn">
            <span>Sign In to BuildStock</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

/* ===================================================================
   STEP 1: DELIVERY DETAIL MODAL (Inspect order + "Delivered" CTA)
   =================================================================== */
function DeliveryDetailModal({ order, close, onDelivered }) {
  return (
    <ModalShell title={`Delivery Details — ${order.id}`} close={close} width="560px">
      <div className="modal-body delivery-detail-body">
        <div className="delivery-step-banner">
          <span className="step-pill">Step 1 of 2</span>
          <span>Inspect items & customer location before delivery</span>
        </div>

        {/* Customer info card with direct call CTA */}
        <div className="customer-info-banner">
          <div className="c-info-avatar">
            {order.customer.split(' ').map((x) => x[0]).join('').slice(0, 2)}
          </div>
          <div className="c-info-details">
            <h4>{order.customer}</h4>
            <div className="c-info-phone">
              <Phone size={13} />
              <span>{order.phone || '+91 98765 43210'}</span>
              <a href={`tel:${order.phone || '9876543210'}`} className="call-now-badge">Call</a>
            </div>
          </div>
        </div>

        {/* Delivery Address Box with Map Pin */}
        <div className="delivery-address-card">
          <div className="addr-icon"><MapPin size={18} /></div>
          <div>
            <small>Delivery Address</small>
            <p>{order.address || 'Plot 42, Industrial Estate, Auto Nagar, Vijayawada, AP - 520007'}</p>
          </div>
        </div>

        {/* Order Items Breakdown */}
        <div className="order-items-breakdown">
          <h5>Order Items</h5>
          <div className="item-row">
            <div className="item-title">
              <Package size={16} />
              <div>
                <b>{order.product}</b>
                <small>SKU verified · Packed in warehouse</small>
              </div>
            </div>
            <div className="item-qty">
              <strong>{order.quantity} PCS</strong>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="order-bill-summary">
          <div className="bill-row">
            <span>Order Date</span>
            <b>{order.date}</b>
          </div>
          <div className="bill-row">
            <span>Expected Delivery</span>
            <b>{order.delivery}</b>
          </div>
          <div className="bill-row total-bill-row">
            <span>Total Payable by Customer</span>
            <strong>{money(order.amount)}</strong>
          </div>
        </div>
      </div>

      <div className="modal-actions delivery-modal-actions">
        <button type="button" className="secondary-button" onClick={close}>
          Cancel
        </button>
        <button
          type="button"
          className="primary-button delivery-delivered-btn"
          onClick={onDelivered}
        >
          <CheckCircle2 size={18} />
          <span>Delivered</span>
        </button>
      </div>
    </ModalShell>
  );
}

/* ===================================================================
   STEP 2: PAYMENT MODAL (Cash, UPI, Card Selection & Confirmation)
   =================================================================== */
function DeliveryPaymentModal({ order, close, onBack, onConfirmPayment }) {
  const [method, setMethod] = useState('UPI'); // 'Cash' | 'UPI' | 'Card'
  const [cashTendered, setCashTendered] = useState(order.amount);
  const [copiedUpi, setCopiedUpi] = useState(false);

  const copyUpi = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('buildstock.merchant@icici');
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  const changeDue = Math.max(0, Number(cashTendered) - Number(order.amount));

  return (
    <ModalShell title={`Payment Collection — ${order.id}`} close={close} width="560px">
      <div className="modal-body delivery-payment-body">
        <div className="delivery-step-banner step-2">
          <span className="step-pill step-2-pill">Step 2 of 2</span>
          <span>Select customer payment method to complete order</span>
        </div>

        {/* Payable Banner */}
        <div className="amount-payable-card">
          <small>Amount to Collect</small>
          <h2>{money(order.amount)}</h2>
          <span>Customer: {order.customer}</span>
        </div>

        {/* Payment Method Selector (3 Options: Cash, UPI, Card) */}
        <div className="payment-method-grid">
          <button
            type="button"
            className={`method-select-btn ${method === 'UPI' ? 'selected' : ''}`}
            onClick={() => setMethod('UPI')}
          >
            <div className="method-icon"><QrCode size={20} /></div>
            <b>UPI / QR</b>
            <small>GPay, PhonePe, Paytm</small>
          </button>

          <button
            type="button"
            className={`method-select-btn ${method === 'Cash' ? 'selected' : ''}`}
            onClick={() => setMethod('Cash')}
          >
            <div className="method-icon"><Banknote size={20} /></div>
            <b>Cash</b>
            <small>Physical Currency</small>
          </button>

          <button
            type="button"
            className={`method-select-btn ${method === 'Card' ? 'selected' : ''}`}
            onClick={() => setMethod('Card')}
          >
            <div className="method-icon"><CreditCard size={20} /></div>
            <b>Card POS</b>
            <small>Debit / Credit Swipe</small>
          </button>
        </div>

        {/* Context details depending on chosen method */}
        {method === 'UPI' && (
          <div className="method-detail-card upi-card">
            <div className="qr-box">
              <div className="qr-matrix-mockup">
                <QrCode size={110} color="#102a43" />
                <span className="qr-scan-label">Scan & Pay {money(order.amount)}</span>
              </div>
            </div>
            <div className="upi-info-box">
              <label>Merchant UPI ID</label>
              <div className="upi-id-row">
                <code>buildstock.merchant@icici</code>
                <button type="button" className="tiny-action" onClick={copyUpi}>
                  {copiedUpi ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <small className="help-text">
                Ask customer to scan using Google Pay, PhonePe, Paytm, or BHIM.
              </small>
            </div>
          </div>
        )}

        {method === 'Cash' && (
          <div className="method-detail-card cash-card">
            <div className="form-group-cash">
              <label>Amount Received from Customer</label>
              <div className="cash-input-wrap">
                <span>₹</span>
                <input
                  type="number"
                  value={cashTendered}
                  onChange={(e) => setCashTendered(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
            </div>
            <div className="cash-calc-row">
              <div>
                <small>Bill Amount</small>
                <b>{money(order.amount)}</b>
              </div>
              <div className="change-due">
                <small>Change to Return</small>
                <strong className={changeDue > 0 ? 'highlight-change' : ''}>{money(changeDue)}</strong>
              </div>
            </div>
            <div className="cash-verify-note">
              <CheckCircle2 size={14} /> Verify 500 / 200 notes before handing over receipt
            </div>
          </div>
        )}

        {method === 'Card' && (
          <div className="method-detail-card card-card">
            <div className="pos-machine-box">
              <CreditCard size={32} color="#1a9b91" />
              <div>
                <b>Mobile Bluetooth POS Terminal</b>
                <p>Insert or Tap customer card on BuildStock Terminal #BS-90</p>
              </div>
            </div>
            <div className="pos-status-row">
              <span className="pos-badge"><Check size={12} /> Terminal Connected</span>
              <span className="pos-charge">Charge: {money(order.amount)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="modal-actions delivery-modal-actions">
        <button type="button" className="secondary-button" onClick={onBack}>
          ← Back
        </button>
        <button
          type="button"
          className="primary-button payment-confirm-btn"
          onClick={() => onConfirmPayment(method)}
        >
          <Check size={18} />
          <span>Confirm Payment ({method}) & Complete</span>
        </button>
      </div>
    </ModalShell>
  );
}

/* ===================================================================
   OTHER VIEWS (Customers, Orders, Inventory, Dispatch, Profile)
   =================================================================== */
function Customers({ customers, notify }) {
  const [search, setSearch] = useState('');
  const filtered = customers.filter((item) =>
    `${item.name} ${item.company} ${item.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="panel full-panel">
      <div className="toolbar">
        <div className="local-search">
          <Search size={17} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..." />
        </div>
        <span className="result-count">{filtered.length} customers</span>
      </div>
      <div className="table-scroll">
        <table className="rich-table">
          <thead><tr><th>Customer</th><th>Contact</th><th>Address</th><th>Company</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map((customer) => (
              <tr key={customer.id}>
                <td><div className="person-cell"><span className="mini-avatar">{customer.name.split(' ').map((x) => x[0]).join('')}</span><b>{customer.name}</b></div></td>
                <td><b>{customer.phone}</b><small>{customer.email}</small></td>
                <td>{customer.address}</td>
                <td><b>{customer.company}</b></td>
                <td><button className="more-button" onClick={() => notify(`Viewing ${customer.name}`)}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Orders({ orders, setModal, advanceOrder }) {
  const [filter, setFilter] = useState('All');
  const visible = filter === 'All' ? orders : orders.filter((order) => order.status === filter);

  return (
    <section className="panel full-panel">
      <div className="toolbar">
        <div className="filter-tabs">
          {['All', 'Processing', 'Ready for Dispatch', 'Delivered'].map((tab) => (
            <button className={filter === tab ? 'selected' : ''} onClick={() => setFilter(tab)} key={tab}>{tab}</button>
          ))}
        </div>
        <button className="primary-button" onClick={() => setModal({ type: 'order', order: orders[0] })}><Plus size={17} /> New Order</button>
      </div>
      <div className="table-scroll">
        <table className="rich-table">
          <thead><tr><th>Order</th><th>Customer / Product</th><th>Quantity</th><th>Delivery</th><th>Amount</th><th>Status</th><th /></tr></thead>
          <tbody>
            {visible.map((order) => (
              <tr key={order.id} onClick={() => setModal({ type: 'order', order })}>
                <td><b>{order.id}</b><small>{order.date}</small></td>
                <td><b>{order.customer}</b><small>{order.product}</small></td>
                <td>{order.quantity} PCS</td>
                <td>{order.delivery}</td>
                <td><b>{money(order.amount)}</b></td>
                <td><StatusBadge status={order.status} /></td>
                <td>
                  <button className="tiny-action" onClick={(e) => { e.stopPropagation(); advanceOrder(order); }}>
                    Advance <ArrowUpRight size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Inventory({ products, setModal }) {
  const [search, setSearch] = useState('');
  const visible = products.filter((item) => `${item.name} ${item.code}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <section className="panel full-panel">
      <div className="toolbar">
        <div className="local-search">
          <Search size={17} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search product or code..." />
        </div>
        <button className="filter-button"><ChevronDown size={15} /> All categories</button>
        <button className="primary-button" onClick={() => setModal('product')}><Plus size={17} /> Add Product</button>
      </div>
      <div className="table-scroll">
        <table className="rich-table">
          <thead><tr><th>Product</th><th>Category</th><th>Stock level</th><th>Unit</th><th>Status</th><th>Price</th></tr></thead>
          <tbody>
            {visible.map((product) => {
              const status = product.stock <= product.minimum * 0.25 ? 'Critical' : product.stock <= product.minimum ? 'Low Stock' : 'In Stock';
              return (
                <tr key={product.id}>
                  <td><b>{product.name}</b><small>{product.code}</small></td>
                  <td>{product.category}</td>
                  <td>
                    <div className="inventory-level">
                      <span>{product.stock} / {product.minimum}</span>
                      <div className="progress"><i className={status === 'Critical' ? 'critical' : ''} style={{ width: `${Math.min(product.stock / product.minimum * 100, 100)}%` }} /></div>
                    </div>
                  </td>
                  <td>{product.unit}</td>
                  <td><StatusBadge status={status} /></td>
                  <td><b>{money(product.price)}</b></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Dispatch({ dispatches, setModal }) {
  return (
    <>
      <div className="dispatch-stats">
        <MiniStat icon={Boxes} label="Total dispatches" value={dispatches.length + 24} />
        <MiniStat icon={Clock3} label="Ready to ship" value={dispatches.filter((x) => x.status === 'Ready for Dispatch').length} />
        <MiniStat icon={Truck} label="Dispatched" value={dispatches.filter((x) => x.status === 'Dispatched').length} />
        <MiniStat icon={Check} label="Delivered" value={dispatches.filter((x) => x.status === 'Delivered').length + 18} />
      </div>
      <section className="panel full-panel">
        <div className="toolbar">
          <div><h2 className="toolbar-title">Dispatch tracking</h2><span className="muted">Live view of active deliveries</span></div>
          <button className="filter-button"><ChevronDown size={15} /> All statuses</button>
        </div>
        <div className="table-scroll">
          <table className="rich-table">
            <thead><tr><th>Dispatch</th><th>Customer</th><th>Products</th><th>Dispatch date</th><th>Expected</th><th>Status</th></tr></thead>
            <tbody>
              {dispatches.map((dispatch) => (
                <tr key={dispatch.id} onClick={() => setModal({ type: 'dispatch', dispatch })}>
                  <td><b>{dispatch.id}</b><small>{dispatch.order}</small></td>
                  <td>{dispatch.customer}</td>
                  <td>{dispatch.products}</td>
                  <td>{dispatch.date}</td>
                  <td>{dispatch.delivery}</td>
                  <td><StatusBadge status={dispatch.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="mini-stat">
      <span><Icon size={18} /></span>
      <div><small>{label}</small><strong>{value}</strong></div>
    </div>
  );
}

function Profile() {
  return (
    <section className="profile-layout">
      <div className="profile-card panel">
        <div className="profile-hero">
          <span className="large-avatar">AU</span>
          <div><h2>Admin User</h2><p>Manager · BuildStock</p></div>
          <button className="secondary-button">Edit Profile</button>
        </div>
        <div className="profile-section">
          <h3>Personal information</h3>
          <div className="details-grid">
            <Detail label="Full name" value="Admin User" />
            <Detail label="Role" value="Manager" />
            <Detail label="Email address" value="admin@buildstock.in" />
            <Detail label="Phone number" value="+91 98765 43210" />
          </div>
        </div>
        <div className="profile-section">
          <h3>Company information</h3>
          <div className="details-grid">
            <Detail label="Company" value="BuildStock Logistics & Construction Supplies" />
            <Detail label="Address" value="Vijayawada, Andhra Pradesh" />
          </div>
        </div>
      </div>
      <div className="panel profile-side">
        <span className="stat-icon blue"><Zap size={18} /></span>
        <h3>Workspace settings</h3>
        <p>Your team workspace is running smoothly. Manage preferences and notification rules from settings.</p>
        <button className="secondary-button">Open settings <ArrowUpRight size={15} /></button>
      </div>
    </section>
  );
}

function Detail({ label, value }) { return <div className="detail"><span>{label}</span><b>{value}</b></div>; }

function ModalShell({ title, close, children, width = '460px' }) {
  return (
    <div className="modal-backdrop open">
      <div className="modal" style={{ maxWidth: width }}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="icon-button" onClick={close} aria-label="Close modal"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function CustomerModal({ close, save }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', company: '' });
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  return (
    <ModalShell title="Add customer" close={close}>
      <form onSubmit={(e) => { e.preventDefault(); save(form); }}>
        <div className="modal-body">
          <div className="form-grid">
            <Field label="Customer name" name="name" value={form.name} change={change} required />
            <Field label="Contact number" name="phone" value={form.phone} change={change} required />
            <Field label="Email address" name="email" value={form.email} change={change} />
            <Field label="Company name" name="company" value={form.company} change={change} />
            <Field label="Address" name="address" value={form.address} change={change} wide />
          </div>
        </div>
        <ModalActions close={close} label="Save customer" />
      </form>
    </ModalShell>
  );
}

function ProductModal({ close, save }) {
  const [form, setForm] = useState({ name: '', code: '', category: 'Gypsum Board', stock: '', minimum: '', unit: 'PCS', price: '' });
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  return (
    <ModalShell title="Add product" close={close}>
      <form onSubmit={(e) => { e.preventDefault(); save(form); }}>
        <div className="modal-body">
          <div className="form-grid">
            <Field label="Product name" name="name" value={form.name} change={change} required />
            <Field label="Product code" name="code" value={form.code} change={change} required />
            <Field label="Category" name="category" value={form.category} change={change} />
            <Field label="Unit" name="unit" value={form.unit} change={change} />
            <Field label="Available stock" name="stock" type="number" value={form.stock} change={change} required />
            <Field label="Minimum stock" name="minimum" type="number" value={form.minimum} change={change} required />
            <Field label="Price" name="price" type="number" value={form.price} change={change} required />
          </div>
        </div>
        <ModalActions close={close} label="Save product" />
      </form>
    </ModalShell>
  );
}

function Field({ label, name, value, change, type = 'text', required, wide }) {
  return <label className={wide ? 'wide' : ''}>{label}<input name={name} type={type} value={value} onChange={change} required={required} /></label>;
}

function ModalActions({ close, label }) {
  return (
    <div className="modal-actions">
      <button type="button" className="secondary-button" onClick={close}>Cancel</button>
      <button type="submit" className="primary-button"><Check size={16} />{label}</button>
    </div>
  );
}

function NotificationPanel({ close }) {
  return (
    <ModalShell title="Notifications" close={close}>
      <div className="modal-body">
        <div className="notification-list">
          <Activity icon={AlertTriangle} title="Stock needs attention" detail="1 product is below minimum stock." time="Now" />
          <Activity icon={Truck} title="Order ready for dispatch" detail="ORD-1002 is ready to move." time="2h" />
          <Activity icon={CheckCircle2} title="Delivery completed" detail="ORD-1003 has been delivered." time="Yesterday" />
        </div>
      </div>
    </ModalShell>
  );
}

function OrderModal({ order, close, advanceOrder }) {
  const stages = ['Order Placed', 'Confirmed', 'Processing', 'Ready for Dispatch', 'Dispatched', 'Delivered'];
  const current = stages.indexOf(order.status);
  return (
    <ModalShell title={`Order ${order.id}`} close={close} width="540px">
      <div className="modal-body">
        <div className="order-summary">
          <div><span>Customer</span><b>{order.customer}</b></div>
          <div><span>Total amount</span><b>{money(order.amount)}</b></div>
          <div><span>Expected delivery</span><b>{order.delivery}</b></div>
        </div>
        <div className="modal-product">
          <Package size={18} />
          <div><b>{order.product}</b><span>{order.quantity} PCS</span></div>
        </div>
        <h3 className="timeline-title">Order progress</h3>
        <div className="timeline">
          {stages.map((stage, index) => (
            <div className={index <= current ? 'done' : ''} key={stage}>
              <span>{index <= current ? <Check size={13} /> : index + 1}</span>
              <b>{stage}</b>
            </div>
          ))}
        </div>
      </div>
      <div className="modal-actions">
        <button className="primary-button" style={{ width: '100%', height: '44px' }} onClick={() => { advanceOrder(order); close(); }}>
          Advance Next Step →
        </button>
      </div>
    </ModalShell>
  );
}

function DispatchModal({ dispatch, close }) {
  const stages = ['Order Confirmed', 'Packed', 'Dispatched', 'Out for Delivery', 'Delivered'];
  const current = stages.indexOf(dispatch.status === 'Ready for Dispatch' ? 'Packed' : dispatch.status);
  return (
    <ModalShell title={`Dispatch ${dispatch.id}`} close={close}>
      <div className="modal-body">
        <div className="order-summary">
          <div><span>Order</span><b>{dispatch.order}</b></div>
          <div><span>Customer</span><b>{dispatch.customer}</b></div>
        </div>
        <div className="modal-product">
          <Truck size={18} />
          <div><b>{dispatch.products}</b><span>Expected {dispatch.delivery}</span></div>
        </div>
        <h3 className="timeline-title">Tracking timeline</h3>
        <div className="timeline">
          {stages.map((stage, index) => (
            <div className={index <= current ? 'done' : ''} key={stage}>
              <span>{index <= current ? <Check size={13} /> : index + 1}</span>
              <b>{stage}</b>
            </div>
          ))}
        </div>
      </div>
    </ModalShell>
  );
}

/* ===================================================================
   MOBILE BOTTOM NAVIGATION (5 primary touch targets >= 44x44px)
   =================================================================== */
function MobileBottomNav({ page, navigate, lowStock, readyCount, openMenu }) {
  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Orders', icon: FileText },
    { label: 'Delivery Monitoring', icon: Truck, badge: readyCount > 0 ? readyCount : null, badgeClass: 'badge-teal', shortLabel: 'Monitoring' },
    { label: 'Inventory', icon: Boxes, badge: lowStock > 0 ? lowStock : null },
    { label: 'Menu', icon: Menu, isMenu: true },
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation bar">
      {navItems.map((item) => {
        const { label, icon: Icon, badge, badgeClass, isMenu, shortLabel } = item;
        return (
          <button
            key={label}
            className={`mobile-nav-item ${page === label ? 'active' : ''}`}
            onClick={() => (isMenu ? openMenu() : navigate(label))}
            aria-label={label}
          >
            <div className="mobile-nav-icon-wrap">
              <Icon size={20} />
              {badge && <span className={`mobile-nav-badge ${badgeClass || ''}`}>{badge}</span>}
            </div>
            <span>{shortLabel || label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function MobileAccessModal({ close, notify }) {
  const [copied, setCopied] = useState(false);
  const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const currentPort = typeof window !== 'undefined' ? (window.location.port || '5174') : '5174';

  const copyUrl = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      notify('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <ModalShell title="Mobile Phone Access" close={close} width="520px">
      <div className="modal-body">
        <div className="mobile-guide-card">
          <h4><Smartphone size={18} color="#1a9b91" /> Same Wi-Fi Connection</h4>
          <p>To open BuildStock directly on your phone, connect both your computer and phone to the <b>same Wi-Fi</b> network.</p>
          <div className="url-box">
            <span>http://&lt;YOUR-PC-IP&gt;:{currentPort}</span>
            <button className="tiny-action" onClick={() => copyUrl(`http://${currentHost}:${currentPort}`)}>
              {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p style={{ marginTop: '10px', fontSize: '11px', color: '#8899a6' }}>
            Check your terminal window — it automatically prints your exact Network IP address.
          </p>
        </div>

        <div className="mobile-guide-card" style={{ borderLeft: '3px solid #2b9a78' }}>
          <h4><Zap size={18} color="#2b9a78" /> Cloudflare Pages (Live Online)</h4>
          <p>Your Cloudflare Pages deployment is live! To update it with the latest dashboard:</p>
          <div style={{ fontSize: '12px', color: '#4c6271', lineHeight: '1.6' }}>
            <div>1. Run <code>push_to_github.bat</code> to commit and push all files</div>
            <div>2. Cloudflare Pages automatically rebuilds and your live link updates instantly!</div>
          </div>
        </div>

        <div className="modal-actions" style={{ borderTop: 'none', paddingBottom: 0 }}>
          <button type="button" className="primary-button" onClick={close} style={{ width: '100%', height: '44px' }}>
            Got it!
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
