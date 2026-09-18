// ==========================================================================
// RESTRO8 — RBAC, PERMISSIONS & ROLE SPECIFICATION
// ==========================================================================

export type OperationalRole = 'owner' | 'manager' | 'waiter' | 'chef' | 'cashier';

export interface RoleMetadata {
  id: OperationalRole;
  label: string;
  badge: string;
  color: string;
  bgColor: string;
  defaultPath: string;
  description: string;
}

export const ROLES_METADATA: Record<OperationalRole, RoleMetadata> = {
  owner: {
    id: 'owner',
    label: 'Owner',
    badge: 'Owner · All Access',
    color: '#0F8F6F',
    bgColor: 'rgba(15, 143, 111, 0.12)',
    defaultPath: '/owner',
    description: 'Full business oversight, financials, profit reports, staff permissions, and system settings.',
  },
  manager: {
    id: 'manager',
    label: 'Manager',
    badge: 'Manager · Floor & Ops',
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.12)',
    defaultPath: '/manager',
    description: 'Daily restaurant operations, staff supervision, discount/cancellation approvals, and sales.',
  },
  cashier: {
    id: 'cashier',
    label: 'Cashier',
    badge: 'Cashier · Billing',
    color: '#3B82F6',
    bgColor: 'rgba(59, 130, 246, 0.12)',
    defaultPath: '/cashier',
    description: 'POS invoicing, payment collection, receipts, and cash drawer shift reconciliation.',
  },
  chef: {
    id: 'chef',
    label: 'Chef',
    badge: 'Chef · Kitchen KDS',
    color: '#EC4899',
    bgColor: 'rgba(236, 72, 153, 0.12)',
    defaultPath: '/kitchen',
    description: 'Kitchen Display System (KDS), ticket preparation lifecycle, and menu availability.',
  },
  waiter: {
    id: 'waiter',
    label: 'Waiter',
    badge: 'Waiter · Floor Service',
    color: '#8B5CF6',
    bgColor: 'rgba(139, 92, 246, 0.12)',
    defaultPath: '/waiter',
    description: 'Floor service, table status, rapid order taking with special notes, and kitchen dispatch.',
  },
};

export type PermissionKey =
  // Orders
  | 'order.create'
  | 'order.view'
  | 'order.edit'
  | 'order.cancel'
  | 'order.cancel.approve'
  // Kitchen
  | 'kitchen.view'
  | 'kitchen.accept'
  | 'kitchen.prepare'
  | 'kitchen.complete'
  | 'kitchen.item_toggle'
  // Payments
  | 'payment.view'
  | 'payment.collect'
  | 'payment.refund.request'
  | 'payment.refund.approve'
  | 'payment.discount'
  // Sales & Reports
  | 'sales.daily.view'
  | 'sales.report.view'
  | 'profit.view'
  // Menu
  | 'menu.view'
  | 'menu.edit'
  | 'menu.price.edit'
  // Inventory
  | 'inventory.view'
  | 'inventory.edit'
  | 'purchasing.manage'
  // Staff
  | 'staff.view'
  | 'staff.create'
  | 'staff.edit'
  | 'staff.delete'
  | 'staff.role.assign'
  // Settings
  | 'settings.view'
  | 'settings.edit'
  | 'settings.ownership'
  | 'settings.billing'
  // Audit & Shifts
  | 'audit.view'
  | 'shift.clock'
  | 'shift.reconcile';

export const ROLE_PERMISSIONS: Record<OperationalRole, PermissionKey[]> = {
  owner: [
    'order.create', 'order.view', 'order.edit', 'order.cancel', 'order.cancel.approve',
    'kitchen.view', 'kitchen.accept', 'kitchen.prepare', 'kitchen.complete', 'kitchen.item_toggle',
    'payment.view', 'payment.collect', 'payment.refund.request', 'payment.refund.approve', 'payment.discount',
    'sales.daily.view', 'sales.report.view', 'profit.view',
    'menu.view', 'menu.edit', 'menu.price.edit',
    'inventory.view', 'inventory.edit', 'purchasing.manage',
    'staff.view', 'staff.create', 'staff.edit', 'staff.delete', 'staff.role.assign',
    'settings.view', 'settings.edit', 'settings.ownership', 'settings.billing',
    'audit.view', 'shift.clock', 'shift.reconcile'
  ],
  manager: [
    'order.create', 'order.view', 'order.edit', 'order.cancel', 'order.cancel.approve',
    'kitchen.view', 'kitchen.accept', 'kitchen.prepare', 'kitchen.complete', 'kitchen.item_toggle',
    'payment.view', 'payment.collect', 'payment.refund.request', 'payment.refund.approve', 'payment.discount',
    'sales.daily.view', 'sales.report.view',
    'menu.view', 'menu.edit',
    'inventory.view', 'inventory.edit', 'purchasing.manage',
    'staff.view',
    'settings.view', 'settings.edit',
    'audit.view', 'shift.clock', 'shift.reconcile'
  ],
  cashier: [
    'order.view',
    'payment.view', 'payment.collect', 'payment.refund.request', 'payment.discount',
    'sales.daily.view',
    'menu.view',
    'shift.clock', 'shift.reconcile'
  ],
  chef: [
    'kitchen.view', 'kitchen.accept', 'kitchen.prepare', 'kitchen.complete', 'kitchen.item_toggle',
    'order.view',
    'menu.view',
    'shift.clock'
  ],
  waiter: [
    'order.create', 'order.view', 'order.edit', 'order.cancel',
    'menu.view',
    'shift.clock'
  ],
};

/**
 * Normalizes any role input (legacy aliases or casing) to one of the 5 canonical OperationalRoles.
 */
export function normalizeOperationalRole(role?: string | null): OperationalRole {
  if (!role) return 'waiter';
  const clean = role.toLowerCase().trim();
  if (clean === 'owner' || clean === 'superadmin' || clean === 'admin') return 'owner';
  if (clean === 'manager') return 'manager';
  if (clean === 'cashier' || clean === 'billing') return 'cashier';
  if (clean === 'chef' || clean === 'kitchen') return 'chef';
  if (clean === 'waiter' || clean === 'server') return 'waiter';
  return 'waiter';
}

/**
 * Validates whether a given operational role possesses a specific permission key.
 */
export function hasPermission(
  role: OperationalRole | string,
  permission: PermissionKey,
  customOverrides?: Record<string, boolean>
): boolean {
  const opRole = normalizeOperationalRole(role);
  if (customOverrides && typeof customOverrides[permission] === 'boolean') {
    return customOverrides[permission];
  }
  const permissions = ROLE_PERMISSIONS[opRole];
  return permissions ? permissions.includes(permission) : false;
}

/**
 * Route-level access rules mapping URL route prefixes to required permissions.
 */
export const ROUTE_RULES: Record<string, { role: OperationalRole[]; permission: PermissionKey }> = {
  '/owner': { role: ['owner'], permission: 'profit.view' },
  '/manager': { role: ['owner', 'manager'], permission: 'order.cancel.approve' },
  '/waiter': { role: ['owner', 'manager', 'waiter'], permission: 'order.create' },
  '/kitchen': { role: ['owner', 'manager', 'chef'], permission: 'kitchen.view' },
  '/cashier': { role: ['owner', 'manager', 'cashier'], permission: 'payment.collect' },
};

/**
 * Evaluates whether an authenticated role has permission to access a protected URL path.
 */
export function canAccessRoute(role: OperationalRole | string, path: string): boolean {
  const opRole = normalizeOperationalRole(role);
  const normalized = path.toLowerCase().replace(/\/$/, '') || '/';

  for (const [routePrefix, rule] of Object.entries(ROUTE_RULES)) {
    if (normalized === routePrefix || normalized.startsWith(routePrefix + '/')) {
      return rule.role.includes(opRole) && hasPermission(opRole, rule.permission);
    }
  }

  // Other routes (pos, orders, tables, settings) fall back to permission requirements
  if (normalized === '/pos' || normalized.startsWith('/pos/')) {
    return hasPermission(opRole, 'order.create');
  }
  if (normalized === '/kds' || normalized.startsWith('/kds/')) {
    return hasPermission(opRole, 'kitchen.view');
  }
  if (normalized === '/finance' || normalized.startsWith('/finance')) {
    return hasPermission(opRole, 'sales.report.view');
  }
  if (normalized === '/staff' || normalized.startsWith('/staff/')) {
    return hasPermission(opRole, 'staff.view');
  }
  if (normalized === '/settings' || normalized.startsWith('/settings/')) {
    return hasPermission(opRole, 'settings.view');
  }

  return true;
}

/**
 * Validates whether a supervisor role can manage/view another role.
 */
export function canSuperviseRole(managerRole: OperationalRole | string, targetRole: OperationalRole | string): boolean {
  const mgr = normalizeOperationalRole(managerRole);
  const tgt = normalizeOperationalRole(targetRole);

  if (mgr === 'owner') return true;
  if (mgr === 'manager') {
    return tgt === 'waiter' || tgt === 'chef' || tgt === 'cashier';
  }
  return false;
}
