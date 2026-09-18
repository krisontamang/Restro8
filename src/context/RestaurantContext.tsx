import { splitShiftTotals, splitTenderError } from '../utils/settlement';
import React, { createContext, useContext, useState, useEffect, useReducer } from 'react';
import {
  MenuItem,
  Table,
  DiningZone,
  Order,
  Reservation,
  Customer,
  StaffMember,
  OrderItem,
  TableStatus,
  UserRole,
  NotificationToast,
  PaymentMethod,
  OrderStatus,
  OrderType,
  RestaurantSettings,
  TaxMode,
  ShiftRecord,
  AuditLogEntry,
  SplitPaymentDetails,
} from '../types/restaurant';
import {
  INITIAL_MENU_ITEMS,
  INITIAL_TABLES,
  INITIAL_ORDERS,
  INITIAL_RESERVATIONS,
  INITIAL_SETTINGS,
} from '../data/initialData';
import {
  playCartDing,
  playOrderSentChime,
  playBumpChime,
  playPaymentSuccessChime,
  setAudioEnabled,
} from '../utils/audio';
import { getNepaliDate, generateInvoiceNumber } from '../utils/nepalDate';
import { safeStorage, readStored } from '../lib/storage';
import { stockIssue, stockRequirements } from '../utils/orderStock';
import { createDraftOrder, draftOrderReducer, draftTotals, isDraftOrder, normalizeDraftOrder, type DraftOrder } from '../utils/draftOrder';

export type NavigationTab =
  | 'dashboard'
  | 'orders'
  | 'floor'
  | 'pos'
  | 'kds'
  | 'inventory'
  | 'dishes'
  | 'category'
  | 'addons'
  | 'menuset'
  | 'submenu'
  | 'combo'
  | 'services-dinein'
  | 'services-delivery'
  | 'services-sms'
  | 'services-loyalty'
  | 'services-connect'
  | 'services-others'
  | 'tables-list'
  | 'spaces-list'
  | 'qr-codes'
  | 'inventory'
  | 'inventory-items'
  | 'inventory-consumption'
  | 'inventory-suppliers'
  | 'inventory-units'
  | 'inventory-groups'
  | 'inventory-history'
  | 'inventory-batch'
  | 'finance-dashboard'
  | 'finance-transactions'
  | 'finance-daybook'
  | 'finance-journal'
  | 'finance-sales'
  | 'finance-purchase'
  | 'finance-income'
  | 'finance-expenses'
  | 'finance-payments'
  | 'finance-cashbanks'
  | 'finance-taxrates'
  | 'finance-balancetransfer'
  | 'finance-chartsofaccount'
  | 'finance-reports'
  | 'finance-trialbalance'
  | 'website'
  | 'customers'
  | 'staff'
  | 'settings'
  | 'settings-restaurant'
  | 'settings-notifications'
  | 'settings-activity'
  | 'settings-billing'
  | 'settings-roles'
  | 'settings-trash'
  | 'settings-migrated'
  | 'settings-integrations'
  | 'settings-invoice'
  | 'settings-kot'
  | 'settings-orderslip'
  | 'settings-printer'
  | 'settings-support'
  | 'settings-releasenotes'
  | 'reservations'
  | 'analytics'
  | 'notifications'
  | 'design-system';

interface RestaurantContextType {
  // Settings & Identity
  settings: RestaurantSettings;
  updateSettings: (newSettings: Partial<RestaurantSettings>) => void;

  // Navigation & Role
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  ordersSubTab: 'orders' | 'table' | 'kot';
  setOrdersSubTab: (tab: 'orders' | 'table' | 'kot') => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  dateMode: 'AD' | 'BS';
  setDateMode: (mode: 'AD' | 'BS') => void;
  toggleDateMode: () => void;

  // Data
  menuItems: MenuItem[];
  tables: Table[];
  orders: Order[];
  reservations: Reservation[];
  customers: Customer[];
  staff: StaffMember[];
  toasts: NotificationToast[];

  // Staff
  addStaff: (member: Omit<StaffMember, 'id' | 'sn'>) => void;
  updateStaff: (id: string, updates: Partial<StaffMember>) => void;
  removeStaff: (id: string) => void;

  // Customers
  addCustomer: (cust: Omit<Customer, 'id' | 'sn'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  loadSampleCustomers: () => void;
  clearCustomers: () => void;

  // POS State
  selectedTableId: string | null;
  setSelectedTableId: (id: string | null) => void;
  draftOrder: DraftOrder;
  setDraftTable: (tableId: string | null) => void;
  setDraftOrderType: (type: OrderType) => void;
  addItemToDraft: (
    item: MenuItem,
    selectedOptions?: Record<string, string>,
    notes?: string
  ) => void;
  updateDraftItemQty: (index: number, delta: number) => void;
  removeDraftItem: (index: number) => void;
  setDraftTipAmount: (amount: number) => void;
  setDraftDiscountPercent: (pct: number) => void;
  setDraftNotes: (notes: string) => void;
  setDraftCustomerInfo: (name: string, pan?: string) => void;
  clearDraft: () => void;
  sendDraftToKitchen: () => Order | null;
  sendGuestOrder: (tableId: string | undefined, lines: Array<{ itemId: string; quantity: number }>) => Order | null;
  settleBill: (
    orderId: string,
    method: PaymentMethod,
    tipAmount: number,
    discountAmount: number,
    customerPan?: string,
    customerName?: string,
    splitDetails?: SplitPaymentDetails
  ) => boolean;

  // Thakali Complimentary Refill
  addThakaliRefill: (tableId: string) => void;

  // Table Management
  seatTable: (tableId: string, guestCount: number, serverName: string) => void;
  setTableStatus: (tableId: string, status: TableStatus) => void;
  cleanTable: (tableId: string) => void;
  transferTable: (fromTableId: string, toTableId: string) => boolean;

  // Shift Operations & Cash Drawer
  activeShift: ShiftRecord | null;
  openShift: (cashierName: string, openingFloat: number) => ShiftRecord;
  closeShift: (actualCash: number, notes?: string) => ShiftRecord | null;

  // Operational Audit Trail
  auditLogs: AuditLogEntry[];
  logAuditEvent: (
    action: string,
    targetType: string,
    targetId: string,
    details: string,
    severity?: 'info' | 'warning' | 'critical'
  ) => void;

  // KDS Operations
  bumpOrderStatus: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  toggleOrderItemCompleted: (orderId: string, itemId: string) => void;
  cancelOrder: (orderId: string) => void;

  // Inventory / Menu
  toggleItemStock: (itemId: string) => void;
  updateStockQuantity: (itemId: string, newQty: number) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (itemId: string) => void;

  // Reservations
  addReservation: (res: Omit<Reservation, 'id'>) => void;
  seatReservation: (reservationId: string, tableId: string) => void;
  cancelReservation: (reservationId: string) => void;

  // Utilities
  addToast: (title: string, message: string, type?: NotificationToast['type']) => void;
  removeToast: (id: string) => void;
  resetDemoData: () => void;
}

const RestaurantContext = createContext<RestaurantContextType | null>(null);

const STORAGE_KEYS = {
  SETTINGS: 'restrox_np_settings_v2',
  MENU: 'restrox_np_menu_v2',
  TABLES: 'restrox_np_tables_v2',
  ORDERS: 'restrox_np_orders_v2',
  RESERVATIONS: 'restrox_np_reservations_v2',
  CUSTOMERS: 'restrox_np_customers_v2',
  STAFF: 'restrox_np_staff_v2',
  DARK_MODE: 'restrox_np_dark_mode_v2',
  SOUND: 'restrox_np_sound_v2',
  USER_ROLE: 'restrox_np_role_v2',
};

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'staff-1',
    sn: 1,
    name: 'Restro8 Admin',
    username: '@admin',
    role: 'SuperAdmin',
    position: 'Owner',
    phone: '+977 9800000001',
    email: 'admin@restro8.example',
    dueAmount: 0,
    status: 'active',
    createdAt: '2025-07-17T00:00:00Z',
  },
];

export const SAMPLE_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    sn: 1,
    name: 'Aarav Sharma',
    phone: '+977 9841234567',
    email: 'aarav.sharma@gmail.com',
    dob: '1992-05-14',
    loyaltyDiscount: 5.0,
    openingBalanceType: 'collect_dr',
    openingAmount: 0,
    group: 'VIP',
    dueAmount: 0,
    panNumber: '601234567',
    address: 'Bharatpur-10, Chitwan',
    notes: 'Regular breakfast guest, prefers low spice Chiya.',
    createdAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'cust-2',
    sn: 2,
    name: 'Sita Shrestha',
    phone: '+977 9851098765',
    email: 'sita.shrestha@hotmail.com',
    dob: '1988-11-22',
    loyaltyDiscount: 2.5,
    openingBalanceType: 'collect_dr',
    openingAmount: 1200,
    group: 'Regular',
    dueAmount: 1200,
    panNumber: '302918231',
    address: 'Narayangarh, Chitwan',
    notes: 'Family visits on weekends for Thakali set.',
    createdAt: '2026-03-05T14:30:00Z',
  },
  {
    id: 'cust-3',
    sn: 3,
    name: 'Bikash Gurung',
    phone: '+977 9803456789',
    email: 'bikash.gurung@yahoo.com',
    dob: '1995-03-08',
    loyaltyDiscount: 0.0,
    openingBalanceType: 'pay_cr',
    openingAmount: 500,
    group: 'Corporate',
    dueAmount: 500,
    panNumber: '500123987',
    address: 'Chaubiskothi, Bharatpur',
    notes: 'Advance catering deposit balance.',
    createdAt: '2026-03-10T11:15:00Z',
  },
  {
    id: 'cust-4',
    sn: 4,
    name: 'Pooja Thapa',
    phone: '+977 9849876543',
    email: 'pooja.thapa@gmail.com',
    dob: '1997-09-18',
    loyaltyDiscount: 10.0,
    openingBalanceType: 'collect_dr',
    openingAmount: 0,
    group: 'VIP',
    dueAmount: 0,
    panNumber: '',
    address: 'Lions Chowk, Narayangarh',
    notes: 'Vegetarian, loves Himalayan Herbal Chiya.',
    createdAt: '2026-03-12T16:45:00Z',
  },
];

function normalizeTable(t: any, index: number): Table {
  const number = typeof t.number === 'number' ? t.number : (typeof t.sn === 'number' ? t.sn : index + 1);
  const label = t.label || t.name || `Table ${number}`;
  let zone: DiningZone = 'main';
  if (t.zone && ['rooftop', 'cabin', 'main', 'garden', 'bar'].includes(t.zone)) {
    zone = t.zone;
  } else if (t.type && typeof t.type === 'string') {
    const typeLower = t.type.toLowerCase();
    if (typeLower.includes('cabin')) zone = 'cabin';
    else if (typeLower.includes('rooftop')) zone = 'rooftop';
    else if (typeLower.includes('bar')) zone = 'bar';
    else if (typeLower.includes('garden')) zone = 'garden';
  }
  const seats = typeof t.seats === 'number' ? t.seats : (typeof t.capacity === 'number' ? t.capacity : 4);
  let status: TableStatus = 'available';
  if (t.status === 'occupied' || t.status === 'Occupied') status = 'occupied';
  else if (t.status === 'dirty' || t.status === 'Needs Cleaning') status = 'dirty';
  else if (t.status === 'reserved' || t.status === 'Reserved') status = 'reserved';
  else if (t.status === 'available' || t.status === 'Open' || t.status === 'vacant') status = 'available';

  return {
    ...t,
    id: String(t.id || `tbl-${number}`),
    number,
    label,
    zone,
    seats,
    status,
    totalAmount: typeof t.totalAmount === 'number' ? t.totalAmount : 0,
    guestCount: typeof t.guestCount === 'number' ? t.guestCount : undefined,
    serverName: typeof t.serverName === 'string' ? t.serverName : undefined,
    seatedTime: typeof t.seatedTime === 'string' ? t.seatedTime : undefined,
  };
}

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Settings
  const [settings, setSettings] = useState<RestaurantSettings>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // Theme state
  const [darkMode, setDarkModeState] = useState<boolean>(() => {
    const saved = safeStorage.getItem(STORAGE_KEYS.DARK_MODE);
    return saved !== null ? saved === 'true' : false;
  });

  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    const saved = safeStorage.getItem(STORAGE_KEYS.SOUND);
    return saved !== null ? saved === 'true' : true;
  });

  // Date Mode (AD vs BS - Bikram Sambat)
  const [dateMode, setDateModeState] = useState<'AD' | 'BS'>(() => {
    const saved = safeStorage.getItem('restrox_np_date_mode_v2');
    return saved === 'BS' ? 'BS' : 'AD';
  });

  const setDateMode = (mode: 'AD' | 'BS') => {
    setDateModeState(mode);
    safeStorage.setItem('restrox_np_date_mode_v2', mode);
  };

  const toggleDateMode = () => {
    setDateModeState((prev) => {
      const next = prev === 'AD' ? 'BS' : 'AD';
      safeStorage.setItem('restrox_np_date_mode_v2', next);
      return next;
    });
  };

  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [ordersSubTab, setOrdersSubTab] = useState<'orders' | 'table' | 'kot'>('orders');
  const [userRole, setUserRoleState] = useState<UserRole>(() => {
    const saved = safeStorage.getItem(STORAGE_KEYS.USER_ROLE);
    return (saved as UserRole) || 'manager';
  });

  // Data states
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => readStored(STORAGE_KEYS.MENU, INITIAL_MENU_ITEMS,
    (value): value is MenuItem[] => Array.isArray(value) && value.every(row => row && typeof row.id === 'string')));

  const [tables, setTables] = useState<Table[]>(() => {
    const raw = readStored(STORAGE_KEYS.TABLES, INITIAL_TABLES,
      (value): value is Table[] => Array.isArray(value) && value.every(row => row && typeof row.id === 'string'));
    return raw.map(normalizeTable);
  });

  const [orders, setOrders] = useState<Order[]>(() => readStored(STORAGE_KEYS.ORDERS, INITIAL_ORDERS,
    (value): value is Order[] => Array.isArray(value) && value.every(row => row && typeof row.id === 'string')));

  const [reservations, setReservations] = useState<Reservation[]>(() => readStored(STORAGE_KEYS.RESERVATIONS, INITIAL_RESERVATIONS,
    (value): value is Reservation[] => Array.isArray(value) && value.every(row => row && typeof row.id === 'string')));

  const [customers, setCustomers] = useState<Customer[]>(() => readStored(STORAGE_KEYS.CUSTOMERS, [],
    (value): value is Customer[] => Array.isArray(value) && value.every(row => row && typeof row.id === 'string')));

  const [staff, setStaff] = useState<StaffMember[]>(() => readStored(STORAGE_KEYS.STAFF, INITIAL_STAFF,
    (value): value is StaffMember[] => Array.isArray(value) && value.every(row => row && typeof row.id === 'string')));

  const [toasts, setToasts] = useState<NotificationToast[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  // POS Draft Order
  const [draftOrder, dispatchDraft] = useReducer(draftOrderReducer, undefined, () =>
    normalizeDraftOrder(readStored('restro8_draft_v1', createDraftOrder(), isDraftOrder)));
  useEffect(() => { safeStorage.setItem('restro8_draft_v1', JSON.stringify(draftOrder)); }, [draftOrder]);

  // Sync theme class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
    safeStorage.setItem(STORAGE_KEYS.DARK_MODE, String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    setAudioEnabled(soundEnabled);
    safeStorage.setItem(STORAGE_KEYS.SOUND, String(soundEnabled));
  }, [soundEnabled]);

  // Sync to local storage
  useEffect(() => {
    safeStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // Sync active verified cloud workspace if authenticated
  useEffect(() => {
    let active = true;
    import('../lib/accountApi').then(({ loadAccount }) => {
      loadAccount().then(({ workspaces }) => {
        if (active && workspaces[0]?.name) {
          const cloudName = workspaces[0].name.trim();
          setSettings(prev => (prev.name !== cloudName ? { ...prev, name: cloudName } : prev));
        }
      }).catch(() => {});
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  useEffect(() => {
    safeStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    safeStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    safeStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    safeStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    safeStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    safeStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
  }, [staff]);

  const updateSettings = (newSettings: Partial<RestaurantSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    addToast('Settings Updated', 'Tax & Restaurant profile updated.', 'info');
  };

  const setDarkMode = (val: boolean) => setDarkModeState(val);
  const toggleSound = () => setSoundEnabledState((prev) => !prev);
  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    safeStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
    addToast('Role Switched', `Active view adapted for ${role.toUpperCase()}`, 'info');
  };

  const addToast = (title: string, message: string, type: NotificationToast['type'] = 'info') => {
    const newToast: NotificationToast = {
      id: 'toast-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setToasts((prev) => [newToast, ...prev.slice(0, 4)]);
    setTimeout(() => {
      removeToast(newToast.id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Global listener for decoupled notifications from any module
  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{
        title: string;
        message: string;
        type?: NotificationToast['type'];
      }>;
      if (customEvent.detail) {
        addToast(
          customEvent.detail.title,
          customEvent.detail.message,
          customEvent.detail.type || 'info'
        );
      }
    };
    window.addEventListener('restro8:toast', handleToastEvent);
    return () => window.removeEventListener('restro8:toast', handleToastEvent);
  }, []);

  // Active Shift & Cash Drawer State
  const [activeShift, setActiveShift] = useState<ShiftRecord | null>(() => {
    try {
      const saved = safeStorage.getItem('restro8_active_shift_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      id: 'shift-101',
      shiftNumber: 1,
      cashierName: 'Aayush Shrestha (Head Cashier)',
      openedAt: new Date().toISOString(),
      openingFloat: 5000,
      cashSales: 0,
      digitalSales: 0,
      expectedCash: 5000,
      status: 'open',
    };
  });

  const openShift = (cashierName: string, openingFloat: number): ShiftRecord => {
    const nextShift: ShiftRecord = {
      id: 'shift-' + Date.now(),
      shiftNumber: (activeShift?.shiftNumber || 0) + 1,
      cashierName,
      openedAt: new Date().toISOString(),
      openingFloat,
      cashSales: 0,
      digitalSales: 0,
      expectedCash: openingFloat,
      status: 'open',
    };
    setActiveShift(nextShift);
    try {
      safeStorage.setItem('restro8_active_shift_v1', JSON.stringify(nextShift));
    } catch {
      // safe fallback
    }
    logAuditEvent(
      'Shift Opened',
      'shift',
      `#${nextShift.shiftNumber}`,
      `Opened with opening cash float NPR ${openingFloat.toLocaleString()} by ${cashierName}`,
      'info'
    );
    addToast('Shift Opened', `Shift #${nextShift.shiftNumber} opened with Rs. ${openingFloat.toLocaleString()} float.`, 'success');
    return nextShift;
  };

  const closeShift = (actualCash: number, notes?: string): ShiftRecord | null => {
    if (!activeShift) return null;
    const difference = actualCash - activeShift.expectedCash;
    const closed: ShiftRecord = {
      ...activeShift,
      closedAt: new Date().toISOString(),
      actualCash,
      difference,
      status: 'closed',
      notes,
    };
    setActiveShift(null);
    try {
      safeStorage.removeItem('restro8_active_shift_v1');
    } catch {
      // safe fallback
    }
    logAuditEvent(
      'Shift Closed',
      'shift',
      `#${closed.shiftNumber}`,
      `Closed by ${closed.cashierName}. Expected NPR ${closed.expectedCash.toLocaleString()}, Counted NPR ${actualCash.toLocaleString()}, Variance NPR ${difference.toLocaleString()}`,
      difference !== 0 ? 'warning' : 'info'
    );
    addToast('Shift Closed', `Z-Report generated. Cash variance: Rs. ${difference.toLocaleString()}`, difference !== 0 ? 'warning' : 'success');
    return closed;
  };

  // Operational Audit Trail State
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    try {
      const saved = safeStorage.getItem('restro8_audit_logs_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'aud-1',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        actorName: 'Aayush Shrestha',
        actorRole: 'Head Cashier',
        action: 'Shift Opened',
        targetType: 'shift',
        targetId: '#1',
        details: 'Drawer opened with NPR 5,000 opening float',
        severity: 'info',
      },
      {
        id: 'aud-2',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        actorName: 'Suman Shrestha',
        actorRole: 'Floor Captain',
        action: 'Order Placed',
        targetType: 'order',
        targetId: 'ORD-101',
        details: 'KOT #101 dispatched to Momo Counter & Bar',
        severity: 'info',
      },
    ];
  });

  const logAuditEvent = (
    action: string,
    targetType: string,
    targetId: string,
    details: string,
    severity: 'info' | 'warning' | 'critical' = 'info'
  ) => {
    const entry: AuditLogEntry = {
      id: 'aud-' + Date.now(),
      timestamp: new Date().toISOString(),
      actorName: userRole === 'waiter' ? 'Floor Captain' : userRole === 'cashier' ? 'Head Cashier' : 'General Manager',
      actorRole: userRole,
      action,
      targetType,
      targetId,
      details,
      severity,
    };
    setAuditLogs((prev) => {
      const updated = [entry, ...prev].slice(0, 100);
      try {
        safeStorage.setItem('restro8_audit_logs_v1', JSON.stringify(updated));
      } catch {
        // safe fallback
      }
      return updated;
    });
  };

  // Draft transitions live in a pure reducer; notifications and audio stay here.
  const setDraftTable = (tableId: string | null) => {
    const table = tables.find(t => t.id === tableId);
    if (tableId && !table) return;
    dispatchDraft({ type: 'table', table });
    setSelectedTableId(table?.id ?? null);
  };

  const setDraftOrderType = (orderType: OrderType) => {
    dispatchDraft({ type: 'orderType', orderType });
    if (orderType !== 'dine-in') setSelectedTableId(null);
  };

  const addItemToDraft = (item: MenuItem, selectedOptions?: Record<string, string>, notes?: string) => {
    if (!item.inStock || item.stockQuantity <= 0) {
      addToast('Item Unavailable', `${item.name} is currently sold out.`, 'warning');
      return;
    }
    const inDraft = stockRequirements(draftOrder.items).get(item.id) ?? 0;
    if (inDraft >= item.stockQuantity) {
      addToast('Stock limit', `Only ${item.stockQuantity} portions available.`, 'warning');
      return;
    }
    dispatchDraft({ type: 'add', item, selectedOptions, notes, id: `draft-item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` });
    playCartDing();
  };

  const updateDraftItemQty = (index: number, delta: number) => {
    if (!Number.isInteger(delta)) return;
    const line = draftOrder.items[index];
    if (line && delta > 0 && !line.isRefill) {
      const dish = menuItems.find(item => item.id === line.menuItemId);
      const requested = (stockRequirements(draftOrder.items).get(line.menuItemId) ?? 0) + delta;
      if (!dish?.inStock || requested > dish.stockQuantity) {
        addToast('Stock limit', 'There are no more portions available for this dish.', 'warning');
        return;
      }
    }
    dispatchDraft({ type: 'quantity', index, delta, menuItems });
  };

  const removeDraftItem = (index: number) => dispatchDraft({ type: 'remove', index });
  const setDraftTipAmount = (value: number) => dispatchDraft({ type: 'tip', value });
  const setDraftDiscountPercent = (value: number) => dispatchDraft({ type: 'discount', value });
  const setDraftNotes = (notes: string) => dispatchDraft({ type: 'notes', notes });
  const setDraftCustomerInfo = (name: string, pan?: string) => dispatchDraft({ type: 'customer', name, pan });
  const clearDraft = () => {
    dispatchDraft({ type: 'reset' });
    setSelectedTableId(null);
  };

  // Push Draft to KDS as active Live Order (KOT / BOT)
  const sendDraftToKitchen = (): Order | null => {
    if (draftOrder.items.length === 0) {
      addToast('Empty Order', 'Please add items before sending KOT/BOT to kitchen.', 'warning');
      return null;
    }

    const issue = stockIssue(draftOrder.items, menuItems);
    if (issue) { addToast('Check stock', issue, 'warning'); return null; }
    const quantities = stockRequirements(draftOrder.items);
    const { formattedBS, fiscalYear } = getNepaliDate();

    const { subtotal, discount, taxableAmount, tax, total } = draftTotals(draftOrder, settings);

    const newOrderNumber =
      orders.length > 0 ? Math.max(...orders.map((o) => o.orderNumber)) + 1 : 101;
    const invoiceNumber = generateInvoiceNumber(newOrderNumber, fiscalYear);

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber: newOrderNumber,
      invoiceNumber,
      tableId: draftOrder.tableId,
      tableNumber: draftOrder.tableNumber,
      orderType: draftOrder.orderType,
      items: draftOrder.items,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dateBS: formattedBS,
      fiscalYear: fiscalYear,
      serverName: userRole === 'waiter' ? 'Active Captain' : 'Staff Lead',
      customerName: draftOrder.customerName || (draftOrder.tableNumber ? `Table ${draftOrder.tableNumber}` : 'Walk-in Guest'),
      customerPan: draftOrder.customerPan,
      subtotal,
      taxableAmount,
      tax,
      discount,
      tip: draftOrder.tipAmount,
      total,
      paymentStatus: 'unpaid',
      notes: draftOrder.notes,
    };

    // Deduct stock
    setMenuItems((prev) =>
      prev.map((menuItem) => {
        const required = quantities.get(menuItem.id) ?? 0;
        if (required > 0) {
          const newQty = Math.max(0, menuItem.stockQuantity - required);
          return {
            ...menuItem,
            stockQuantity: newQty,
            inStock: newQty > 0,
          };
        }
        return menuItem;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);

    // Update table
    if (draftOrder.tableId) {
      setTables((prev) =>
        prev.map((t) =>
          t.id === draftOrder.tableId
            ? {
                ...t,
                status: 'occupied',
                currentOrderId: newOrder.id,
                totalAmount: total,
                seatedTime: t.seatedTime || new Date().toISOString(),
              }
            : t
        )
      );
    }

    playOrderSentChime();
    addToast(
      'KOT / BOT Dispatched',
      `KOT #${newOrder.orderNumber} dispatched to Kitchen & Bar.`,
      'success'
    );

    clearDraft();
    return newOrder;
  };

  // Guest QR orders use the same stock, order and KOT pipeline as POS orders.
  // This keeps the public menu from showing a success state without creating an order.
  const sendGuestOrder = (
    tableId: string | undefined,
    lines: Array<{ itemId: string; quantity: number }>
  ): Order | null => {
    const table = tableId ? tables.find((entry) => entry.id === tableId) : undefined;
    if (tableId && !table) {
      addToast('Invalid table link', 'Please ask your server for a fresh QR code.', 'warning');
      return null;
    }

    const requestedLines = lines
      .map((line) => ({
        item: menuItems.find((menuItem) => menuItem.id === line.itemId),
        quantity: Number.isInteger(line.quantity) ? Math.max(0, line.quantity) : 0,
      }))
      .filter((line): line is { item: MenuItem; quantity: number } => Boolean(line.item) && line.quantity > 0);

    if (requestedLines.length !== lines.length) {
      addToast('Order needs review', 'A dish was removed or its quantity is invalid. Refresh the menu and review your order.', 'warning');
      return null;
    }
    if (!requestedLines.length) {
      addToast('Empty order', 'Add at least one available dish before sending your request.', 'warning');
      return null;
    }

    const guestItems: OrderItem[] = requestedLines.map(({ item, quantity }) => ({
      id: `guest-item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      menuItemId: item.id,
      name: item.name,
      nepaliName: item.nepaliName,
      price: item.price,
      quantity,
      selectedOptions: {},
      notes: 'Guest QR order',
      station: item.station,
      ticketType: item.ticketType,
      isCompleted: false,
    }));

    const issue = stockIssue(guestItems, menuItems);
    if (issue) {
      addToast('Dish unavailable', issue, 'warning');
      return null;
    }

    const quantities = stockRequirements(guestItems);
    const now = new Date().toISOString();
    const activeOrder = tableId
      ? orders.find((order) => order.tableId === tableId && order.paymentStatus === 'unpaid' && order.status !== 'cancelled' && order.status !== 'completed')
      : undefined;

    if (activeOrder) {
      const items = [...activeOrder.items, ...guestItems];
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const discount = Math.min(activeOrder.discount, subtotal);
      const taxableAmount = Math.max(0, subtotal - discount);
      const tax = settings.taxMode === 'vat_registered' ? +(taxableAmount * settings.vatRate).toFixed(2) : 0;
      const total = +(taxableAmount + tax + activeOrder.tip).toFixed(2);
      const updatedOrder: Order = { ...activeOrder, items, discount, subtotal, taxableAmount, tax, total, status: activeOrder.status === 'new' ? 'new' : 'preparing', updatedAt: now, notes: `${activeOrder.notes || ''}${activeOrder.notes ? ' · ' : ''}Guest QR addition` };

      setOrders((previous) => previous.map((order) => order.id === activeOrder.id ? updatedOrder : order));
      setTables((previous) => previous.map((entry) => entry.id === tableId ? { ...entry, status: 'occupied', currentOrderId: activeOrder.id, totalAmount: total } : entry));
      setMenuItems((previous) => previous.map((menuItem) => {
        const required = quantities.get(menuItem.id) ?? 0;
        if (!required) return menuItem;
        const stockQuantity = Math.max(0, menuItem.stockQuantity - required);
        return { ...menuItem, stockQuantity, inStock: stockQuantity > 0 };
      }));
      playOrderSentChime();
      addToast('Guest order received', `Added to KOT #${activeOrder.orderNumber} for ${table?.label || 'the table'}.`, 'success');
      return updatedOrder;
    }

    const { formattedBS, fiscalYear } = getNepaliDate();
    const subtotal = guestItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = settings.taxMode === 'vat_registered' ? +(subtotal * settings.vatRate).toFixed(2) : 0;
    const total = +(subtotal + tax).toFixed(2);
    const orderNumber = orders.length > 0 ? Math.max(...orders.map((order) => order.orderNumber)) + 1 : 101;
    const newOrder: Order = {
      id: `ord-guest-${Date.now()}`,
      orderNumber,
      invoiceNumber: generateInvoiceNumber(orderNumber, fiscalYear),
      tableId: table?.id,
      tableNumber: table?.number,
      orderType: table ? 'dine-in' : 'takeaway',
      items: guestItems,
      status: 'new',
      createdAt: now,
      updatedAt: now,
      dateBS: formattedBS,
      fiscalYear,
      serverName: 'QR Guest',
      customerName: table?.label || 'QR Guest',
      subtotal,
      taxableAmount: subtotal,
      tax,
      discount: 0,
      tip: 0,
      total,
      paymentStatus: 'unpaid',
      notes: 'Placed from table QR menu',
    };

    setOrders((previous) => [newOrder, ...previous]);
    setMenuItems((previous) => previous.map((menuItem) => {
      const required = quantities.get(menuItem.id) ?? 0;
      if (!required) return menuItem;
      const stockQuantity = Math.max(0, menuItem.stockQuantity - required);
      return { ...menuItem, stockQuantity, inStock: stockQuantity > 0 };
    }));
    if (table) {
      setTables((previous) => previous.map((entry) => entry.id === table.id ? { ...entry, status: 'occupied', currentOrderId: newOrder.id, totalAmount: total, seatedTime: entry.seatedTime || now } : entry));
    }
    playOrderSentChime();
    addToast('Guest order received', `KOT #${newOrder.orderNumber} sent to the kitchen.`, 'success');
    return newOrder;
  };

  // Complimentary Thakali Refill (Daal & Bhaat / Tarkari at Rs. 0)
  const addThakaliRefill = (tableId: string) => {
    const table = tables.find((t) => t.id === tableId);
    if (!table) return;

    const activeOrder = orders.find((o) => o.id === table.currentOrderId && o.paymentStatus === 'unpaid');
    if (!activeOrder) {
      addToast('No Active Order', 'Seat and place an order first before requesting refills.', 'warning');
      return;
    }

    const refillItem: OrderItem = {
      id: 'refill-' + Date.now(),
      menuItemId: 'thak-1',
      name: 'Complimentary Daal & Bhaat Refill',
      nepaliName: 'थकाली दाल-भात थप (निःशुल्क)',
      price: 0,
      quantity: 1,
      station: 'kitchen',
      ticketType: 'KOT',
      isCompleted: false,
      isRefill: true,
    };

    setOrders((prev) =>
      prev.map((o) =>
        o.id === activeOrder.id
          ? {
              ...o,
              items: [...o.items, refillItem],
              status: o.status === 'new' ? 'new' : 'preparing',
              refillCount: (o.refillCount || 0) + 1,
              updatedAt: new Date().toISOString(),
            }
          : o
      )
    );

    playOrderSentChime();
    addToast('Thakali Refill Requested', `Free Daal & Bhaat refill KOT sent for ${table.label}!`, 'info');
  };

  // Settle Bill with Nepal IRD VAT & Fonepay
  const settleBill = (
    orderId: string,
    method: PaymentMethod,
    tipAmount: number,
    discountAmount: number,
    customerPan?: string,
    customerName?: string,
    splitDetails?: SplitPaymentDetails
  ) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return false;

    if (order.status === 'cancelled') { addToast('Cannot settle a voided order', 'Review the order before taking payment.', 'warning'); return false; }
    if (![tipAmount, discountAmount].every(value => Number.isFinite(value) && value >= 0) || discountAmount > order.subtotal) { addToast('Review payment', 'Tip and discount must be valid amounts. Discount cannot exceed the subtotal.', 'warning'); return false; }
    // Guard against duplicate settlement / double billing
    if (order.paymentStatus === 'paid' || order.status === 'completed') {
      addToast('Already Settled', `Invoice #${order.invoiceNumber || order.orderNumber} is already settled.`, 'warning');
      return false;
    }

    const taxableAmount = Math.max(0, order.subtotal - discountAmount);
    const tax = settings.taxMode === 'vat_registered' ? +(taxableAmount * settings.vatRate).toFixed(2) : 0;
    const finalTotal = +(taxableAmount + tax + tipAmount).toFixed(2);
    if (method === 'split') { const error = splitTenderError(splitDetails, finalTotal); if (error) { addToast('Review split payment', error, 'warning'); return false; } }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'completed',
              paymentStatus: 'paid',
              paymentMethod: method,
              splitDetails,
              customerPan: customerPan || o.customerPan,
              customerName: customerName || o.customerName,
              tip: tipAmount,
              discount: discountAmount,
              taxableAmount,
              tax,
              total: finalTotal,
              updatedAt: new Date().toISOString(),
            }
          : o
      )
    );

    // Update active shift sales if shift is open
    if (activeShift) {
      let cashPart = 0;
      let digitalPart = 0;
      if (method === 'cash') {
        cashPart = finalTotal;
      } else if (method === 'split' && splitDetails) {
        const net = splitShiftTotals(splitDetails);
        cashPart = net.cash; digitalPart = net.digital;
      } else {
        digitalPart = finalTotal;
      }

      setActiveShift((prev) => {
        if (!prev) return null;
        const newCashSales = prev.cashSales + cashPart;
        const newDigitalSales = prev.digitalSales + digitalPart;
        const updated: ShiftRecord = {
          ...prev,
          cashSales: newCashSales,
          digitalSales: newDigitalSales,
          expectedCash: prev.openingFloat + newCashSales,
        };
        try {
          safeStorage.setItem('restro8_active_shift_v1', JSON.stringify(updated));
        } catch {
          // safe fallback
        }
        return updated;
      });
    }

    logAuditEvent(
      'Bill Settled',
      'order',
      order.invoiceNumber || String(order.orderNumber),
      `Settled ${method.toUpperCase()} tax invoice for NPR ${finalTotal.toLocaleString()}${method === 'split' && splitDetails ? ` (Split: ${splitDetails.tenders.map((t) => `${t.method.toUpperCase()} Rs.${t.amount}`).join(' + ')})` : ''}`,
      'info'
    );

    if (order.tableId) {
      setTables((prev) =>
        prev.map((t) =>
          t.id === order.tableId
            ? {
                ...t,
                status: 'dirty',
                currentOrderId: undefined,
                totalAmount: 0,
                guestCount: undefined,
              }
            : t
        )
      );
    }

    playPaymentSuccessChime();
    try {
      window.dispatchEvent(
        new CustomEvent('restro8:order-settled', {
          detail: { orderId, total: finalTotal, method },
        })
      );
    } catch {
      // safe fallback in test environments
    }
    addToast(
      'Tax Invoice Settled',
      `Bill settled via ${method.toUpperCase()}. Table ready for sanitization.`,
      'success'
    );
    return true;
  };

  // Table Management
  const seatTable = (tableId: string, guestCount: number, serverName: string) => {
    setTables((prev) =>
      prev.map((t) =>
        t.id === tableId
          ? {
              ...t,
              status: 'occupied',
              guestCount,
              serverName,
              seatedTime: new Date().toISOString(),
            }
          : t
      )
    );
    addToast('Party Seated', `Seated ${guestCount} guests. Captain: ${serverName}`, 'info');
  };

  const setTableStatus = (tableId: string, status: TableStatus) => {
    setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, status } : t))
    );
  };

  const cleanTable = (tableId: string) => {
    setTables((prev) =>
      prev.map((t) =>
        t.id === tableId
          ? {
              ...t,
              status: 'available',
              guestCount: undefined,
              serverName: undefined,
              seatedTime: undefined,
              currentOrderId: undefined,
              totalAmount: 0,
            }
          : t
      )
    );
    addToast('Table Sanitized', 'Table is clean and ready for new guests.', 'success');
  };

  // Transfer Active Table / Party to another Table
  const transferTable = (fromTableId: string, toTableId: string): boolean => {
    const fromTable = tables.find((t) => t.id === fromTableId);
    const toTable = tables.find((t) => t.id === toTableId);
    if (!fromTable || !toTable) {
      addToast('Transfer Failed', 'Origin or destination table not found.', 'error');
      return false;
    }
    if (toTable.status === 'occupied' && toTable.id !== fromTable.id) {
      addToast('Destination Occupied', `Table ${toTable.label} is currently occupied. Choose a vacant table.`, 'warning');
      return false;
    }

    // Find any unpaid orders linked to fromTable
    const linkedOrder = orders.find((o) => o.tableId === fromTableId && o.paymentStatus === 'unpaid');

    if (linkedOrder) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === linkedOrder.id
            ? {
                ...o,
                tableId: toTable.id,
                tableNumber: toTable.number,
                notes: o.notes ? `${o.notes} (Transferred from ${fromTable.label})` : `Transferred from ${fromTable.label}`,
                updatedAt: new Date().toISOString(),
              }
            : o
        )
      );
    }

    setTables((prev) =>
      prev.map((t) => {
        if (t.id === toTableId) {
          return {
            ...t,
            status: 'occupied',
            guestCount: fromTable.guestCount,
            serverName: fromTable.serverName,
            seatedTime: fromTable.seatedTime || new Date().toISOString(),
            currentOrderId: linkedOrder ? linkedOrder.id : fromTable.currentOrderId,
            totalAmount: fromTable.totalAmount,
            notes: fromTable.notes,
          };
        }
        if (t.id === fromTableId) {
          return {
            ...t,
            status: 'available',
            guestCount: undefined,
            serverName: undefined,
            seatedTime: undefined,
            currentOrderId: undefined,
            totalAmount: 0,
            notes: undefined,
          };
        }
        return t;
      })
    );

    logAuditEvent(
      'Table Transferred',
      'table',
      fromTable.label,
      `Transferred party (${fromTable.guestCount || 0} covers) from ${fromTable.label} to ${toTable.label}`,
      'info'
    );

    addToast('Table Transferred', `Successfully moved party from ${fromTable.label} to ${toTable.label}.`, 'success');
    return true;
  };

  // KDS Operations
  const bumpOrderStatus = (orderId: string) => {
    const nextStatusMap: Record<OrderStatus, OrderStatus> = {
      new: 'preparing',
      preparing: 'ready',
      ready: 'served',
      served: 'completed',
      completed: 'completed',
      cancelled: 'cancelled',
    };

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const next = nextStatusMap[o.status] || o.status;
        return { ...o, status: next, updatedAt: new Date().toISOString() };
      })
    );

    playBumpChime();
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return { ...o, status, updatedAt: new Date().toISOString() };
      })
    );
    playBumpChime();
    addToast('Status Updated', `Order marked as ${status.toUpperCase()}.`, 'info');
  };

  const toggleOrderItemCompleted = (orderId: string, itemId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const updatedItems = o.items.map((it) =>
          it.id === itemId ? { ...it, isCompleted: !it.isCompleted } : it
        );
        return { ...o, items: updatedItems };
      })
    );
  };

  const cancelOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: 'cancelled', updatedAt: new Date().toISOString() } : o
      )
    );

    if (order.tableId) {
      setTables((prev) =>
        prev.map((t) => (t.id === order.tableId ? { ...t, currentOrderId: undefined, totalAmount: 0 } : t))
      );
    }
    addToast('Order Voided', `KOT #${order.orderNumber} cancelled.`, 'warning');
  };

  // Inventory Management
  const toggleItemStock = (itemId: string) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newStatus = !item.inStock;
          addToast(
            newStatus ? 'Item In Stock' : 'Item 86\'d (सकियो)',
            `${item.name} is now ${newStatus ? 'available on POS' : 'disabled (86\'d / Sold Out)'}`,
            newStatus ? 'success' : 'warning'
          );
          return {
            ...item,
            inStock: newStatus,
            stockQuantity: newStatus ? (item.stockQuantity === 0 ? 15 : item.stockQuantity) : 0,
          };
        }
        return item;
      })
    );
  };

  const updateStockQuantity = (itemId: string, newQty: number) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              stockQuantity: Math.max(0, newQty),
              inStock: newQty > 0,
            }
          : item
      )
    );
  };

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: 'custom-item-' + Date.now(),
    };
    setMenuItems((prev) => [newItem, ...prev]);
    addToast('Dish Created', `${newItem.name} added to the catalog.`, 'success');
  };

  const updateMenuItem = (item: MenuItem) => {
    setMenuItems((prev) => prev.map((it) => (it.id === item.id ? item : it)));
    addToast('Dish Updated', `${item.name} details saved.`, 'info');
  };

  const deleteMenuItem = (itemId: string) => {
    const it = menuItems.find((m) => m.id === itemId);
    setMenuItems((prev) => prev.filter((m) => m.id !== itemId));
    addToast('Dish Removed', `${it?.name || 'Item'} deleted from catalog.`, 'warning');
  };

  // Reservations
  const addReservation = (res: Omit<Reservation, 'id'>) => {
    const newRes: Reservation = {
      ...res,
      id: 'res-' + Date.now(),
    };
    setReservations((prev) => [newRes, ...prev]);
    addToast('Booking Confirmed', `Reserved for ${newRes.customerName} (${newRes.partySize} guests)`, 'success');
  };

  const seatReservation = (reservationId: string, tableId: string) => {
    const res = reservations.find((r) => r.id === reservationId);
    const table = tables.find((t) => t.id === tableId);
    if (!res || !table) return;

    setReservations((prev) =>
      prev.map((r) => (r.id === reservationId ? { ...r, status: 'seated', assignedTableId: tableId } : r))
    );

    setTables((prev) =>
      prev.map((t) =>
        t.id === tableId
          ? {
              ...t,
              status: 'occupied',
              guestCount: res.partySize,
              serverName: 'Host Captain',
              seatedTime: new Date().toISOString(),
            }
          : t
      )
    );

    addToast('Guest Seated', `${res.customerName} seated at ${table.label}`, 'success');
  };

  const cancelReservation = (reservationId: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === reservationId ? { ...r, status: 'cancelled' } : r))
    );
    addToast('Reservation Cancelled', 'Booking cancelled.', 'info');
  };

  // Customers
  const addCustomer = (custData: Omit<Customer, 'id' | 'sn'>) => {
    const newCust: Customer = {
      ...custData,
      id: `cust-${Date.now()}`,
      sn: customers.length + 1,
      createdAt: new Date().toISOString(),
    };
    setCustomers((prev) => [...prev, newCust]);
    addToast('Customer Created', `${newCust.name} added to customer database.`, 'success');
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    addToast('Customer Updated', 'Customer profile updated successfully.', 'success');
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      return filtered.map((c, idx) => ({ ...c, sn: idx + 1 }));
    });
    addToast('Customer Removed', 'Customer record deleted.', 'info');
  };

  const loadSampleCustomers = () => {
    setCustomers(SAMPLE_CUSTOMERS);
    addToast('Sample Data Loaded', '4 authentic Nepal customer profiles loaded.', 'info');
  };

  const clearCustomers = () => {
    setCustomers([]);
    addToast('Customer List Cleared', 'All customer profiles removed.', 'info');
  };

  // Staff Management
  const addStaff = (member: Omit<StaffMember, 'id' | 'sn'>) => {
    const newMember: StaffMember = {
      ...member,
      id: `staff-${Date.now()}`,
      sn: staff.length + 1,
      createdAt: new Date().toISOString(),
    };
    setStaff((prev) => [...prev, newMember]);
    addToast('Staff Invited', `${newMember.name} added to team.`, 'success');
  };

  const updateStaff = (id: string, updates: Partial<StaffMember>) => {
    setStaff((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    addToast('Staff Updated', 'Staff details updated successfully.', 'success');
  };

  const removeStaff = (id: string) => {
    setStaff((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'removed' } : s))
    );
    addToast('Staff Removed', 'Staff status marked as removed.', 'info');
  };

  const resetDemoData = () => {
    setMenuItems(INITIAL_MENU_ITEMS);
    setTables(INITIAL_TABLES);
    setOrders(INITIAL_ORDERS);
    setReservations(INITIAL_RESERVATIONS);
    setCustomers([]);
    setStaff(INITIAL_STAFF);
    setSettings(INITIAL_SETTINGS);
    clearDraft();
    addToast('Reset to Nepal Starter Data', 'Loaded Himalayan Restro & Cafe starter data.', 'info');
  };

  return (
    <RestaurantContext.Provider
      value={{
        settings,
        updateSettings,
        activeTab,
        setActiveTab,
        ordersSubTab,
        setOrdersSubTab,
        userRole,
        setUserRole,
        darkMode,
        setDarkMode,
        soundEnabled,
        toggleSound,
        dateMode,
        setDateMode,
        toggleDateMode,
        menuItems,
        tables,
        orders,
        reservations,
        customers,
        staff,
        toasts,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        loadSampleCustomers,
        clearCustomers,
        addStaff,
        updateStaff,
        removeStaff,
        selectedTableId,
        setSelectedTableId,
        draftOrder,
        setDraftTable,
        setDraftOrderType,
        addItemToDraft,
        updateDraftItemQty,
        removeDraftItem,
        setDraftTipAmount,
        setDraftDiscountPercent,
        setDraftNotes,
        setDraftCustomerInfo,
        clearDraft,
        sendDraftToKitchen,
        sendGuestOrder,
        settleBill,
        addThakaliRefill,
        seatTable,
        setTableStatus,
        cleanTable,
        transferTable,
        activeShift,
        openShift,
        closeShift,
        auditLogs,
        logAuditEvent,
        bumpOrderStatus,
        updateOrderStatus,
        toggleOrderItemCompleted,
        cancelOrder,
        toggleItemStock,
        updateStockQuantity,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        addReservation,
        seatReservation,
        cancelReservation,
        addToast,
        removeToast,
        resetDemoData,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
