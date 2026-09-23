// src/services/db.js
// Persistent database service for BuildStock using localStorage with in-memory caching and reactive subscribers.

const STORAGE_KEYS = {
  USERS: 'buildstock_users_v2',
  CURRENT_USER: 'buildstock_current_user_v2',
  ORDERS: 'buildstock_orders_v2',
  PRODUCTS: 'buildstock_products_v2',
  HISTORY: 'buildstock_history_v2',
  DISPATCHES: 'buildstock_dispatches_v2',
  ACTIVITIES: 'buildstock_activities_v2',
};

export const INITIAL_USERS = [
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
    id: 'DP-408',
    name: 'Bhargavi',
    email: 'bhargavi@buildstock.in',
    role: 'delivery',
    avatar: 'BG',
    title: 'Senior Delivery Partner',
    phone: '+91 98480 99881',
    vehicle: 'AP 16 CK 3341 (EV Cargo Scooter)',
    rating: '4.9 ★',
    monthlyTarget: 90,
    status: 'Active on Shift'
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
  },
  {
    id: 'CUST-001',
    name: 'Rajesh Kumar',
    email: 'rajesh@buildstock.in',
    role: 'customer',
    avatar: 'RK',
    title: 'Civil Contractor & Builder',
    phone: '+91 98480 22338',
    address: '12-4-89 MG Road, Benz Circle, Vijayawada, AP - 520010'
  },
  {
    id: 'CUST-002',
    name: 'Priya Sharma',
    email: 'priya@buildstock.in',
    role: 'customer',
    avatar: 'PS',
    title: 'Architect & Interior Designer',
    phone: '+91 98450 12345',
    address: 'Plot 18, Dwaraka Nagar, Visakhapatnam, AP'
  }
];

export const INITIAL_PRODUCTS = [
  { id: 1, name: 'Gypsum Board Standard (12.5mm)', code: 'GB-001', category: 'Gypsum Board', stock: 450, minimum: 100, unit: 'PCS', price: 520, description: 'High-density plasterboard with tapered edges for interior walls and ceilings.' },
  { id: 2, name: 'Ceiling Board Acoustical', code: 'CB-002', category: 'Ceiling', stock: 65, minimum: 100, unit: 'PCS', price: 780, description: 'Sound-absorbing ceiling tiles engineered for commercial and modular grid systems.' },
  { id: 3, name: 'Gypsum Water-Resistant Sheet', code: 'GS-003', category: 'Gypsum Board', stock: 90, minimum: 50, unit: 'PCS', price: 410, description: 'Moisture and mold-resistant plasterboard ideal for kitchens and bathrooms.' },
  { id: 4, name: 'Metal Furring Channel (12ft)', code: 'MF-004', category: 'Accessories', stock: 230, minimum: 80, unit: 'PCS', price: 145, description: 'Galvanized cold-rolled steel furring channel for suspended ceiling framing.' },
  { id: 5, name: 'UltraTech Super Cement 50kg', code: 'CM-005', category: 'Cement & Concrete', stock: 180, minimum: 50, unit: 'Bags', price: 420, description: 'Premium grade 53 OPC cement offering high early compressive strength.' },
  { id: 6, name: 'Tata Tiscon TMT Rebar 12mm (12m)', code: 'ST-006', category: 'Steel & Rebar', stock: 120, minimum: 40, unit: 'PCS', price: 680, description: 'Fe-550D grade earthquake-resistant ductile thermo-mechanically treated rebars.' },
  { id: 7, name: 'River Sand Washed 50kg Bag', code: 'SD-007', category: 'Aggregates', stock: 250, minimum: 60, unit: 'Bags', price: 110, description: 'Triple-washed coarse river sand certified for plastering and concrete mixing.' },
  { id: 8, name: 'Drywall Joint Compound 28kg', code: 'JC-008', category: 'Finishes', stock: 45, minimum: 20, unit: 'Buckets', price: 1450, description: 'Ready-mixed all-purpose jointing compound for seamless gypsum drywall finishes.' },
  { id: 9, name: 'Drywall Screws 25mm Box (1000 pcs)', code: 'DS-009', category: 'Fasteners', stock: 85, minimum: 25, unit: 'Boxes', price: 380, description: 'Black phosphate bugle head self-drilling screws for steel and wood studs.' },
  { id: 10, name: 'Self-Adhesive Fiber Mesh Tape 50m', code: 'FM-010', category: 'Accessories', stock: 110, minimum: 30, unit: 'Rolls', price: 160, description: 'Reinforced cross-weave fiberglass drywall joint sealing tape.' },
  { id: 11, name: 'Country Fresh Milk 1L', code: 'MK-101', category: 'Daily Essentials', stock: 20, minimum: 5, unit: 'Pack', price: 65, description: 'Pasteurized homogenized fresh cow milk, 1-litre chilled pouch.' },
  { id: 12, name: 'Whole Wheat Brown Bread 400g', code: 'BR-102', category: 'Daily Essentials', stock: 15, minimum: 5, unit: 'Pack', price: 50, description: 'Freshly baked 100% whole wheat high-fiber sandwich bread loaf.' },
  { id: 13, name: 'Farm Fresh Organic Eggs (6 pcs)', code: 'EG-103', category: 'Daily Essentials', stock: 25, minimum: 5, unit: 'Box', price: 60, description: 'Nutrient-rich, vegetarian-fed farm fresh brown table eggs carton.' },
  { id: 14, name: 'Mineral Spring Drinking Water 5L', code: 'WT-104', category: 'Daily Essentials', stock: 30, minimum: 8, unit: 'Can', price: 80, description: 'Purified mineral-enriched packaged drinking water jar with tamper-proof seal.' }
];

export const INITIAL_ORDERS = [
  {
    id: 'ORD-1025',
    displayId: '#ORD1025',
    customer: 'Ravi Kumar',
    phone: '+91 98480 22338',
    address: '12-4-89 MG Road, Benz Circle, Vijayawada, AP - 520010',
    product: 'Cement Bags (5), TMT Steel Bars (10), Sand 50kg (2)',
    itemsList: [
      { name: 'Cement Bags', qty: 5, unit: 'Bags' },
      { name: 'TMT Steel Bars', qty: 10, unit: 'PCS' },
      { name: 'Sand 50kg', qty: 2, unit: 'Bags' }
    ],
    quantity: 17,
    date: '22 Sep 2026',
    delivery: '22 Sep 2026',
    amount: 1250,
    status: 'Ready for Dispatch',
    assignedTo: null,
    assignedToId: null,
    assignedAt: null
  },
  {
    id: 'ORD-1002',
    displayId: '#ORD1002',
    customer: 'XYZ Constructions',
    phone: '+91 99887 76655',
    address: 'Bunder Road, Near Benz Circle, Vijayawada, AP',
    product: 'Ceiling Board',
    itemsList: [{ name: 'Ceiling Board', qty: 300, unit: 'PCS' }],
    quantity: 300,
    date: '22 Sep 2026',
    delivery: '22 Sep 2026',
    amount: 234000,
    status: 'Ready for Dispatch',
    assignedTo: null,
    assignedToId: null,
    assignedAt: null
  },
  {
    id: 'ORD-1005',
    displayId: '#ORD1005',
    customer: 'Mehta Builders',
    phone: '+91 98450 12345',
    address: 'Plot 18, Dwaraka Nagar, Visakhapatnam, AP',
    product: 'Gypsum Board',
    itemsList: [{ name: 'Gypsum Board', qty: 150, unit: 'PCS' }],
    quantity: 150,
    date: '22 Sep 2026',
    delivery: '23 Sep 2026',
    amount: 78000,
    status: 'Ready for Dispatch',
    assignedTo: null,
    assignedToId: null,
    assignedAt: null
  },
  {
    id: 'ORD-1006',
    displayId: '#ORD1006',
    customer: 'Srinivasa Interiors',
    phone: '+91 97012 34567',
    address: 'Door 4-2-11, Governorpet Main Road, Vijayawada, AP',
    product: 'Metal Furring Channel & Screws',
    itemsList: [
      { name: 'Metal Furring Channel', qty: 25, unit: 'PCS' },
      { name: 'Drywall Screws 25mm', qty: 2, unit: 'Boxes' }
    ],
    quantity: 27,
    date: '22 Sep 2026',
    delivery: '22 Sep 2026',
    amount: 4800,
    status: 'Ready for Dispatch',
    assignedTo: null,
    assignedToId: null,
    assignedAt: null
  },
  {
    id: 'ORD-1007',
    displayId: '#ORD1007',
    customer: 'Kavitha Enterprises',
    phone: '+91 94401 23456',
    address: 'Near NTR Circle, Patamata, Vijayawada, AP',
    product: 'Joint Compound & Fiber Mesh',
    itemsList: [
      { name: 'Joint Compound 28kg', qty: 2, unit: 'Buckets' },
      { name: 'Fiber Mesh Tape', qty: 4, unit: 'Rolls' }
    ],
    quantity: 6,
    date: '22 Sep 2026',
    delivery: '22 Sep 2026',
    amount: 1850,
    status: 'Ready for Dispatch',
    assignedTo: null,
    assignedToId: null,
    assignedAt: null
  },
  {
    id: 'ORD-1001',
    displayId: '#ORD1001',
    customer: 'ABC Industries',
    phone: '+91 98765 43210',
    address: 'Plot 42, Auto Nagar, Vijayawada, AP',
    product: 'Gypsum Board',
    itemsList: [{ name: 'Gypsum Board', qty: 500, unit: 'PCS' }],
    quantity: 500,
    date: '21 Sep 2026',
    delivery: '24 Sep 2026',
    amount: 250000,
    status: 'Processing',
    assignedTo: null,
    assignedToId: null,
    assignedAt: null
  },
  {
    id: 'ORD-1004',
    displayId: '#ORD1004',
    customer: 'Orbit Infra',
    phone: '+91 98123 45678',
    address: 'Madhapur Tech Zone, Hyderabad, TS',
    product: 'Metal Furring Channel',
    itemsList: [{ name: 'Metal Furring Channel', qty: 120, unit: 'PCS' }],
    quantity: 120,
    date: '20 Sep 2026',
    delivery: '25 Sep 2026',
    amount: 17400,
    status: 'Confirmed',
    assignedTo: null,
    assignedToId: null,
    assignedAt: null
  }
];

// Helper to generate seed history matching Bhargavi's September 2026 stats:
// 86 orders, ₹74,500 total:
// 32 Cash (₹24,000)
// 41 UPI (₹42,500)
// 13 Card (₹8,000)
function generateBhargaviSeptemberRecords() {
  const records = [];
  const customers = [
    'Ravi Kumar', 'Suresh Reddy', 'Priya Sharma', 'Arjun Mehta', 'Kiran Construction',
    'Sri Sai Builders', 'Lakshmi Home Decors', 'Amaravathi Plasterers', 'Durga Hardwares',
    'Bhavani Civil Works', 'Satya Infra Projects', 'Vijaya Enterprises', 'Ganesh Contractors',
    'Radha Krishna Paints', 'Balaji Drywalls', 'Surya Ceilings', 'Venkateswara Woods'
  ];
  const addresses = [
    'Benz Circle, Vijayawada', 'MG Road, Vijayawada', 'Governorpet, Vijayawada',
    'Auto Nagar, Vijayawada', 'Patamata, Vijayawada', 'Enikepadu, Vijayawada',
    'One Town, Vijayawada', 'Kanuru, Vijayawada', 'Bhavanipuram, Vijayawada',
    'Tadigadapa, Vijayawada', 'Poranki, Vijayawada', 'Gollapudi, Vijayawada'
  ];
  const products = [
    { p: 'Cement Bags (5)', q: 5, u: 'Bags' },
    { p: 'Drywall Screws (1000 pcs)', q: 1, u: 'Box' },
    { p: 'Gypsum Board (2)', q: 2, u: 'PCS' },
    { p: 'Joint Compound 5kg', q: 1, u: 'Tub' },
    { p: 'Fiber Mesh Tape (2 rolls)', q: 2, u: 'Rolls' },
    { p: 'Furring Channel (6 pcs)', q: 6, u: 'PCS' },
    { p: 'Sand 50kg (2 bags)', q: 2, u: 'Bags' }
  ];

  // 32 Cash orders summing to exactly 24,000 (avg 750)
  // 31 orders of 750 = 23,250 + 1 of 750 = 24,000
  for (let i = 1; i <= 32; i++) {
    const day = Math.min(22, Math.max(1, Math.floor((i * 22) / 32)));
    const amt = i === 32 ? 24000 - 31 * 750 : 750;
    records.push({
      id: `ORD-C${1000 + i}`,
      partnerId: 'DP-408',
      partnerName: 'Bhargavi',
      customer: customers[i % customers.length],
      phone: `+91 98480 ${10000 + i}`,
      address: addresses[i % addresses.length],
      product: products[i % products.length].p,
      quantity: products[i % products.length].q,
      amount: amt,
      paymentMethod: 'Cash',
      deliveredAt: `${day.toString().padStart(2, '0')} Sep 2026, 0${10 + (i % 8)}:${(i * 7) % 60 < 10 ? '0' : ''}${(i * 7) % 60} AM`,
      monthKey: '2026-09'
    });
  }

  // 41 UPI orders summing to exactly 42,500
  // 40 orders: 35 * 1000 (35000) + 5 * 1200 (6000) = 41000 + 1 of 1500 = 42500
  let upiSum = 0;
  for (let i = 1; i <= 41; i++) {
    const day = Math.min(22, Math.max(1, Math.floor((i * 22) / 41)));
    let amt = 1000;
    if (i <= 5) amt = 1200;
    if (i === 41) amt = 42500 - upiSum;
    else upiSum += amt;

    records.push({
      id: `ORD-U${1000 + i}`,
      partnerId: 'DP-408',
      partnerName: 'Bhargavi',
      customer: customers[(i + 5) % customers.length],
      phone: `+91 99480 ${20000 + i}`,
      address: addresses[(i + 3) % addresses.length],
      product: products[(i + 2) % products.length].p,
      quantity: products[(i + 2) % products.length].q,
      amount: amt,
      paymentMethod: 'UPI',
      deliveredAt: `${day.toString().padStart(2, '0')} Sep 2026, 0${11 + (i % 7)}:${(i * 11) % 60 < 10 ? '0' : ''}${(i * 11) % 60} PM`,
      monthKey: '2026-09'
    });
  }

  // 13 Card orders summing to exactly 8,000
  // 12 * 600 = 7200 + 1 * 800 = 8000
  for (let i = 1; i <= 13; i++) {
    const day = Math.min(22, Math.max(1, Math.floor((i * 22) / 13)));
    const amt = i === 13 ? 800 : 600;
    records.push({
      id: `ORD-P${1000 + i}`,
      partnerId: 'DP-408',
      partnerName: 'Bhargavi',
      customer: customers[(i + 8) % customers.length],
      phone: `+91 97010 ${30000 + i}`,
      address: addresses[(i + 6) % addresses.length],
      product: products[(i + 4) % products.length].p,
      quantity: products[(i + 4) % products.length].q,
      amount: amt,
      paymentMethod: 'Card',
      deliveredAt: `${day.toString().padStart(2, '0')} Sep 2026, 0${12 + (i % 6)}:${(i * 13) % 60 < 10 ? '0' : ''}${(i * 13) % 60} PM`,
      monthKey: '2026-09'
    });
  }

  // Also add some August 2026 records for Bhargavi (e.g. 74 orders, ₹62,000)
  for (let i = 1; i <= 15; i++) {
    records.push({
      id: `ORD-AUG-${1000 + i}`,
      partnerId: 'DP-408',
      partnerName: 'Bhargavi',
      customer: customers[i % customers.length],
      phone: `+91 98480 55${100 + i}`,
      address: addresses[i % addresses.length],
      product: products[i % products.length].p,
      quantity: 2,
      amount: 1500,
      paymentMethod: i % 2 === 0 ? 'UPI' : 'Cash',
      deliveredAt: `${(i * 2).toString().padStart(2, '0')} Aug 2026, 02:30 PM`,
      monthKey: '2026-08'
    });
  }

  return records;
}

const INITIAL_HISTORY = [
  ...generateBhargaviSeptemberRecords(),
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
    address: 'MG Inner Ring Road, Guntur, AP',
    monthKey: '2026-09'
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
    address: 'Governorpet, Vijayawada, AP',
    monthKey: '2026-09'
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
    address: 'Kalyan Nagar, Vijayawada, AP',
    monthKey: '2026-09'
  }
];

// Reactive subscribers
const subscribers = new Set();
export function subscribeDB(fn) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}
function notifySubscribers(type, data) {
  subscribers.forEach((fn) => {
    try {
      fn(type, data);
    } catch (e) {
      console.error('Subscriber error:', e);
    }
  });
}

// Memory cache initialized from localStorage or defaults
let cachedUsers = null;
let cachedOrders = null;
let cachedProducts = null;
let cachedHistory = null;
let cachedCurrentUser = null;

function loadFromStorage(key, fallback) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    }
  } catch (err) {
    console.warn(`Could not read ${key} from storage:`, err);
  }
  return fallback;
}

function saveToStorage(key, value) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (err) {
    console.warn(`Could not write ${key} to storage:`, err);
  }
}

// Service API
export const db = {
  getUsers() {
    if (!cachedUsers) {
      cachedUsers = loadFromStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
      // Ensure Bhargavi is in users list even if previously cached
      if (!cachedUsers.some((u) => u.id === 'DP-408')) {
        cachedUsers.push(INITIAL_USERS[1]);
      }
      // Ensure customer users exist
      INITIAL_USERS.forEach((iu) => {
        if (!cachedUsers.some((u) => u.id === iu.id)) {
          cachedUsers.push(iu);
        }
      });
      saveToStorage(STORAGE_KEYS.USERS, cachedUsers);
    }
    return cachedUsers;
  },

  getCurrentUser() {
    if (!cachedCurrentUser) {
      cachedCurrentUser = loadFromStorage(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
    }
    return cachedCurrentUser;
  },

  setCurrentUser(user) {
    cachedCurrentUser = user;
    if (user) {
      saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
    } else {
      try {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      } catch {}
    }
    notifySubscribers('user_change', user);
  },

  getProducts() {
    if (!cachedProducts) {
      cachedProducts = loadFromStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
      if (!Array.isArray(cachedProducts) || cachedProducts.length === 0) {
        cachedProducts = INITIAL_PRODUCTS;
        saveToStorage(STORAGE_KEYS.PRODUCTS, cachedProducts);
      }
    }
    return cachedProducts;
  },

  setProducts(products) {
    cachedProducts = products;
    saveToStorage(STORAGE_KEYS.PRODUCTS, products);
    notifySubscribers('products_change', products);
  },

  updateStock(productId, delta) {
    const current = this.getProducts();
    const next = current.map((p) => {
      if (p.id === productId || p.code === productId) {
        const newStock = Math.max(0, (p.stock || 0) + delta);
        return { ...p, stock: newStock };
      }
      return p;
    });
    this.setProducts(next);
    return next;
  },

  getOrders() {
    if (!cachedOrders) {
      cachedOrders = loadFromStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
      // Ensure ORD-1025 exists in orders
      if (!cachedOrders.some((o) => o.id === 'ORD-1025')) {
        cachedOrders.unshift(INITIAL_ORDERS[0]);
        saveToStorage(STORAGE_KEYS.ORDERS, cachedOrders);
      }
    }
    return cachedOrders;
  },

  setOrders(orders) {
    cachedOrders = orders;
    saveToStorage(STORAGE_KEYS.ORDERS, orders);
    notifySubscribers('orders_change', orders);
  },

  getAvailableOrders() {
    const all = this.getOrders();
    return all.filter((o) => {
      const isReady = o.status === 'Ready for Dispatch' || o.status === 'Ready for dispatch' || o.status === 'Ready for Delivery' || o.status === 'READY FOR DELIVERY';
      const isNotAssigned = !o.assignedToId && o.status !== 'Assigned' && o.status !== 'Out for Delivery' && o.status !== 'Awaiting Payment' && o.status !== 'Delivered' && o.status !== 'Completed';
      return isReady && isNotAssigned;
    });
  },

  getMyActiveDelivery(partnerId) {
    const all = this.getOrders();
    return all.find((o) => o.assignedToId === partnerId && (o.status === 'Assigned' || o.status === 'Out for Delivery' || o.status === 'Awaiting Payment')) || null;
  },

  getCustomerOrders(customerId, customerName) {
    const all = this.getOrders();
    return all.filter((o) => {
      if (customerId && o.customerId === customerId) return true;
      if (customerName && o.customer && o.customer.toLowerCase().includes(customerName.toLowerCase())) return true;
      return false;
    });
  },

  // Customer places an order -> stock checked and decremented -> added to orders for delivery
  createCustomerOrder({ customer, customerId, phone, address, itemsList, paymentMethod = 'Pay on Delivery (Cash/UPI)', notes = '' }) {
    const products = this.getProducts();

    // Check available stock for every item before creating the order
    for (const item of itemsList) {
      const product = products.find((p) => p.id === item.id || p.code === item.code || p.name === item.name);
      if (!product) {
        return { error: `Product "${item.name}" not found in inventory.` };
      }
      if (product.stock < item.qty) {
        return {
          error: `Only ${product.stock} units available for ${product.name}. Do not allow quantity ${item.qty}.`,
          availableStock: product.stock,
          product
        };
      }
    }

    const orders = this.getOrders();
    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, '0')} Sep 2026`;
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const nextNum = 1026 + orders.length;
    const newId = `ORD-${nextNum}`;
    const displayId = `#ORD${nextNum}`;

    const totalAmount = itemsList.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.qty || 1)), 0);
    const totalQty = itemsList.reduce((sum, item) => sum + Number(item.qty || 1), 0);
    const productSummary = itemsList.map((item) => `${item.name} (${item.qty})`).join(', ');

    // Decrement stock in persistent inventory
    const currentProducts = this.getProducts();
    const updatedProducts = currentProducts.map((p) => {
      const matched = itemsList.find((i) => i.id === p.id || i.code === p.code || i.name === p.name);
      if (matched) {
        return { ...p, stock: Math.max(0, (p.stock || 0) - matched.qty) };
      }
      return p;
    });
    this.setProducts(updatedProducts);

    const newOrder = {
      id: newId,
      displayId,
      customer: customer || 'Customer',
      customerId: customerId || 'CUST-001',
      phone: phone || '+91 98480 22338',
      address: address || 'Benz Circle, Vijayawada, AP',
      product: productSummary,
      itemsList: itemsList.map((i) => ({
        name: i.name,
        qty: i.qty,
        unit: i.unit || 'PCS',
        price: i.price
      })),
      quantity: totalQty,
      amount: totalAmount,
      date: dateStr,
      delivery: 'Today (Express Dispatch)',
      status: 'Ready for Dispatch',
      paymentStatus: 'Pending',
      transitStage: 'ready',
      paymentMethod,
      notes,
      assignedTo: null,
      assignedToId: null,
      assignedAt: null,
      createdAt: `${dateStr}, ${timeStr}`,
      stageHistory: [
        { stage: 'created', label: 'Order Placed by Customer', time: `${timeStr}, Today` },
        { stage: 'confirmed', label: 'Order Confirmed & Preparing', time: `${timeStr}, Today` },
        { stage: 'ready', label: 'Order Packed & Ready for Dispatch', time: `${timeStr}, Today` }
      ]
    };

    const nextOrders = [newOrder, ...orders];
    this.setOrders(nextOrders);
    notifySubscribers('order_created', newOrder);
    return newOrder;
  },

  // Lock order to partner (Atomic lock check: prevents double claim)
  lockOrder(orderId, partner) {
    const orders = this.getOrders();
    const existing = orders.find((o) => o.id === orderId);
    if (!existing) {
      return { error: 'Order not found.' };
    }
    // Concurrency check: if another partner has already locked this order
    if (existing.assignedToId && existing.assignedToId !== partner.id) {
      return {
        error: 'Order is no longer available.',
        reason: 'Another delivery partner has already taken this order.',
        assignedTo: existing.assignedTo
      };
    }
    if (existing.status === 'Completed' || existing.status === 'Delivered') {
      return {
        error: 'Order is no longer available.',
        reason: 'This order has already been completed.'
      };
    }

    const nowIso = new Date().toISOString();
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let updatedOrder = null;
    const nextOrders = orders.map((order) => {
      if (order.id === orderId) {
        const history = order.stageHistory || [
          { stage: 'ready', label: 'Order Packed at Warehouse', time: 'Earlier Today' }
        ];
        updatedOrder = {
          ...order,
          status: 'Assigned',
          transitStage: 'pickup', // Initial step: partner preparing/pickup
          assignedTo: partner.name,
          assignedToId: partner.id,
          assignedPartnerPhone: partner.phone,
          assignedPartnerVehicle: partner.vehicle,
          assignedAt: `${nowTimeStr}, Today`,
          assignedAtIso: nowIso,
          stageHistory: [
            ...history,
            { stage: 'assigned', label: `Assigned to ${partner.name}`, time: `${nowTimeStr}, Today` }
          ]
        };
        return updatedOrder;
      }
      return order;
    });

    this.setOrders(nextOrders);
    notifySubscribers('order_locked', updatedOrder);
    return updatedOrder;
  },

  // Progression: 'pickup' -> 'in_transit' -> 'arrived'
  updateTransitStage(orderId, nextStage) {
    const orders = this.getOrders();
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const stageLabels = {
      pickup: 'Warehouse Pickup Verified',
      in_transit: 'Out for Delivery / In Transit',
      arrived: 'Arrived at Customer Location'
    };

    let updatedOrder = null;
    const nextOrders = orders.map((order) => {
      if (order.id === orderId) {
        const history = order.stageHistory || [];
        updatedOrder = {
          ...order,
          transitStage: nextStage,
          status: nextStage === 'in_transit' ? 'Out for Delivery' : order.status,
          stageHistory: [
            ...history,
            { stage: nextStage, label: stageLabels[nextStage] || nextStage, time: `${nowTimeStr}, Today` }
          ]
        };
        return updatedOrder;
      }
      return order;
    });

    this.setOrders(nextOrders);
    notifySubscribers('transit_stage_change', updatedOrder);
    return updatedOrder;
  },

  // Step 12: DELIVERED Action sets status to Awaiting Payment before payment page
  setOrderAwaitingPayment(orderId) {
    const orders = this.getOrders();
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let updatedOrder = null;
    const nextOrders = orders.map((order) => {
      if (order.id === orderId) {
        const history = order.stageHistory || [];
        updatedOrder = {
          ...order,
          status: 'Awaiting Payment',
          transitStage: 'arrived',
          stageHistory: [
            ...history,
            { stage: 'arrived', label: 'Arrived at Customer · Awaiting Payment', time: `${nowTimeStr}, Today` }
          ]
        };
        return updatedOrder;
      }
      return order;
    });

    this.setOrders(nextOrders);
    notifySubscribers('order_awaiting_payment', updatedOrder);
    return updatedOrder;
  },

  // Deliver order: complete payment
  deliverOrder(orderId, partner, paymentMethod, paymentDetails = {}) {
    const orders = this.getOrders();
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nowDateStr = '22 Sep 2026';

    let deliveredOrder = null;
    const nextOrders = orders.map((order) => {
      if (order.id === orderId) {
        const history = order.stageHistory || [];
        deliveredOrder = {
          ...order,
          status: 'Completed',
          paymentStatus: 'PAID',
          transitStage: 'delivered',
          paymentMethod,
          paymentDetails,
          deliveredAt: `${nowDateStr}, ${nowTimeStr}`,
          stageHistory: [
            ...history,
            { stage: 'delivered', label: `Payment Completed (${paymentMethod}) · Order Completed`, time: `${nowTimeStr}, Today` }
          ]
        };
        return deliveredOrder;
      }
      return order;
    });

    this.setOrders(nextOrders);

    // Add entry to personal history
    if (deliveredOrder) {
      const history = this.getPersonalHistory();
      const newEntry = {
        id: deliveredOrder.id,
        displayId: deliveredOrder.displayId || deliveredOrder.id,
        partnerId: partner.id,
        partnerName: partner.name,
        customer: deliveredOrder.customer,
        phone: deliveredOrder.phone,
        address: deliveredOrder.address,
        product: deliveredOrder.product,
        quantity: deliveredOrder.quantity,
        amount: deliveredOrder.amount,
        paymentMethod,
        paymentDetails,
        deliveredAt: `${nowDateStr}, ${nowTimeStr}`,
        monthKey: '2026-09'
      };
      const nextHistory = [newEntry, ...history];
      this.setPersonalHistory(nextHistory);
    }

    notifySubscribers('order_delivered', deliveredOrder);
    return deliveredOrder;
  },

  getPersonalHistory() {
    if (!cachedHistory) {
      cachedHistory = loadFromStorage(STORAGE_KEYS.HISTORY, INITIAL_HISTORY);
    }
    return cachedHistory;
  },

  setPersonalHistory(history) {
    cachedHistory = history;
    saveToStorage(STORAGE_KEYS.HISTORY, history);
    notifySubscribers('history_change', history);
  },

  getPartnerMonthlyHistory(partnerId, monthKey = '2026-09') {
    const history = this.getPersonalHistory();
    return history.filter((item) => item.partnerId === partnerId && item.monthKey === monthKey);
  },

  getPartnerMonthlyStats(partnerId, monthKey = '2026-09') {
    const items = this.getPartnerMonthlyHistory(partnerId, monthKey);
    const totalOrders = items.length;
    const totalAmount = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const cashItems = items.filter((i) => i.paymentMethod === 'Cash');
    const upiItems = items.filter((i) => i.paymentMethod === 'UPI');
    const cardItems = items.filter((i) => i.paymentMethod === 'Card');

    return {
      totalOrders,
      totalAmount,
      cash: {
        count: cashItems.length,
        amount: cashItems.reduce((sum, item) => sum + Number(item.amount || 0), 0)
      },
      upi: {
        count: upiItems.length,
        amount: upiItems.reduce((sum, item) => sum + Number(item.amount || 0), 0)
      },
      card: {
        count: cardItems.length,
        amount: cardItems.reduce((sum, item) => sum + Number(item.amount || 0), 0)
      }
    };
  },

  // Reset demo data helper
  resetData() {
    cachedOrders = INITIAL_ORDERS;
    cachedHistory = INITIAL_HISTORY;
    cachedProducts = INITIAL_PRODUCTS;
    cachedUsers = INITIAL_USERS;
    saveToStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    saveToStorage(STORAGE_KEYS.HISTORY, INITIAL_HISTORY);
    saveToStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    saveToStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
    notifySubscribers('data_reset', null);
  }
};
