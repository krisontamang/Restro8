import type { UserRole } from '../types/restaurant';
import type { NavigationTab } from '../context/RestaurantContext';

export type SecureAction =
  | 'settle_order'
  | 'discount_bill'
  | 'void_item'
  | 'edit_menu'
  | 'manage_staff'
  | 'access_financials'
  | 'system_settings'
  | 'delete_restaurant';

// Normalizes role aliases (e.g. 'kitchen' -> 'chef', 'billing' -> 'cashier')
export function normalizeRole(role?: string): UserRole {
  const clean = (role || 'manager').toLowerCase().trim();
  if (clean === 'superadmin') return 'SuperAdmin';
  if (clean === 'admin') return 'admin';
  if (clean === 'cashier' || clean === 'billing') return 'cashier';
  if (clean === 'chef' || clean === 'kitchen') return 'chef';
  if (clean === 'waiter' || clean === 'server') return 'waiter';
  return 'manager';
}

const TAB_PERMISSIONS: Record<string, UserRole[]> = {
  // Operational service tabs
  dashboard: ['SuperAdmin', 'admin', 'manager', 'cashier'],
  orders: ['SuperAdmin', 'admin', 'manager', 'cashier', 'waiter', 'chef'],
  pos: ['SuperAdmin', 'admin', 'manager', 'cashier', 'waiter'],
  kds: ['SuperAdmin', 'admin', 'manager', 'chef'],
  floor: ['SuperAdmin', 'admin', 'manager', 'cashier', 'waiter'],
  'tables-list': ['SuperAdmin', 'admin', 'manager', 'cashier', 'waiter'],
  'spaces-list': ['SuperAdmin', 'admin', 'manager'],
  'qr-codes': ['SuperAdmin', 'admin', 'manager'],
  reservations: ['SuperAdmin', 'admin', 'manager', 'cashier', 'waiter'],

  // Menu management
  dishes: ['SuperAdmin', 'admin', 'manager', 'chef'],
  category: ['SuperAdmin', 'admin', 'manager', 'chef'],
  addons: ['SuperAdmin', 'admin', 'manager', 'chef'],
  menuset: ['SuperAdmin', 'admin', 'manager', 'chef'],
  submenu: ['SuperAdmin', 'admin', 'manager', 'chef'],
  combo: ['SuperAdmin', 'admin', 'manager', 'chef'],

  // Services
  'services-dinein': ['SuperAdmin', 'admin', 'manager'],
  'services-delivery': ['SuperAdmin', 'admin', 'manager', 'cashier'],
  'services-sms': ['SuperAdmin', 'admin', 'manager'],
  'services-loyalty': ['SuperAdmin', 'admin', 'manager', 'cashier'],
  'services-connect': ['SuperAdmin', 'admin', 'manager'],
  'services-others': ['SuperAdmin', 'admin', 'manager'],

  // Inventory
  inventory: ['SuperAdmin', 'admin', 'manager', 'chef'],
  'inventory-items': ['SuperAdmin', 'admin', 'manager', 'chef'],
  'inventory-consumption': ['SuperAdmin', 'admin', 'manager', 'chef'],
  'inventory-suppliers': ['SuperAdmin', 'admin', 'manager'],
  'inventory-units': ['SuperAdmin', 'admin', 'manager'],
  'inventory-groups': ['SuperAdmin', 'admin', 'manager', 'chef'],
  'inventory-history': ['SuperAdmin', 'admin', 'manager', 'chef'],
  'inventory-batch': ['SuperAdmin', 'admin', 'manager', 'chef'],

  // Financial Books & Ledgers (Strict)
  'finance-dashboard': ['SuperAdmin', 'admin', 'manager'],
  'finance-transactions': ['SuperAdmin', 'admin', 'manager'],
  'finance-daybook': ['SuperAdmin', 'admin', 'manager', 'cashier'],
  'finance-journal': ['SuperAdmin', 'admin', 'manager'],
  'finance-sales': ['SuperAdmin', 'admin', 'manager'],
  'finance-purchase': ['SuperAdmin', 'admin', 'manager'],
  'finance-income': ['SuperAdmin', 'admin', 'manager'],
  'finance-expenses': ['SuperAdmin', 'admin', 'manager'],
  'finance-payments': ['SuperAdmin', 'admin', 'manager'],
  'finance-cashbanks': ['SuperAdmin', 'admin', 'manager'],
  'finance-taxrates': ['SuperAdmin', 'admin', 'manager'],
  'finance-balancetransfer': ['SuperAdmin', 'admin', 'manager'],
  'finance-chartsofaccount': ['SuperAdmin', 'admin'],
  'finance-reports': ['SuperAdmin', 'admin', 'manager'],
  'finance-trialbalance': ['SuperAdmin', 'admin'],

  // Stakeholders
  customers: ['SuperAdmin', 'admin', 'manager', 'cashier'],
  staff: ['SuperAdmin', 'admin'], // High sensitivity: Salary & staff management restricted to Admins

  // Settings & System configuration
  settings: ['SuperAdmin', 'admin', 'manager'],
  'settings-restaurant': ['SuperAdmin', 'admin', 'manager'],
  'settings-notifications': ['SuperAdmin', 'admin', 'manager', 'cashier', 'waiter', 'chef'],
  'settings-activity': ['SuperAdmin', 'admin', 'manager'],
  'settings-billing': ['SuperAdmin', 'admin'],
  'settings-roles': ['SuperAdmin', 'admin'],
  'settings-trash': ['SuperAdmin', 'admin'],
  'settings-migrated': ['SuperAdmin', 'admin'],
  'settings-integrations': ['SuperAdmin', 'admin'],
  'settings-invoice': ['SuperAdmin', 'admin', 'manager'],
  'settings-kot': ['SuperAdmin', 'admin', 'manager', 'chef'],
  'settings-orderslip': ['SuperAdmin', 'admin', 'manager'],
  'settings-printers': ['SuperAdmin', 'admin', 'manager'],
  website: ['SuperAdmin', 'admin', 'manager'],
  analytics: ['SuperAdmin', 'admin', 'manager'],
  'design-system': ['SuperAdmin', 'admin', 'manager'],
};

const ACTION_PERMISSIONS: Record<SecureAction, UserRole[]> = {
  settle_order: ['SuperAdmin', 'admin', 'manager', 'cashier'],
  discount_bill: ['SuperAdmin', 'admin', 'manager', 'cashier'],
  void_item: ['SuperAdmin', 'admin', 'manager'],
  edit_menu: ['SuperAdmin', 'admin', 'manager', 'chef'],
  manage_staff: ['SuperAdmin', 'admin'],
  access_financials: ['SuperAdmin', 'admin', 'manager'],
  system_settings: ['SuperAdmin', 'admin'],
  delete_restaurant: ['SuperAdmin'],
};

/**
 * Checks whether a given user role has authorization to access a workspace navigation tab.
 */
export function canAccessTab(rawRole: UserRole | string, tab: NavigationTab | string): boolean {
  const role = normalizeRole(rawRole);
  const allowed = TAB_PERMISSIONS[tab];
  if (!allowed) {
    // If not explicitly restricted, default to manager and higher
    return role === 'SuperAdmin' || role === 'admin' || role === 'manager';
  }
  return allowed.includes(role);
}

/**
 * Checks whether a given user role is authorized to perform a secure operational mutation.
 */
export function canPerformAction(rawRole: UserRole | string, action: SecureAction): boolean {
  const role = normalizeRole(rawRole);
  const allowed = ACTION_PERMISSIONS[action];
  return allowed ? allowed.includes(role) : false;
}
