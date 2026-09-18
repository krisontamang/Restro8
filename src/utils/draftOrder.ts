import type { MenuItem, OrderItem, OrderType, RestaurantSettings, Table } from '../types/restaurant';

export interface DraftOrder {
  tableId?: string;
  tableNumber?: number;
  customerName?: string;
  customerPan?: string;
  orderType: OrderType;
  items: OrderItem[];
  notes?: string;
  tipAmount: number;
  discountPercent: number;
}

export const createDraftOrder = (): DraftOrder => ({
  orderType: 'dine-in', items: [], tipAmount: 0, discountPercent: 0, notes: '',
});

export function isDraftOrder(value: unknown): value is DraftOrder {
  if (!value || typeof value !== 'object') return false;
  const draft = value as DraftOrder;
  return Array.isArray(draft.items) && draft.items.every(item =>
    typeof item?.menuItemId === 'string' && Number.isFinite(item.price) && item.price >= 0 &&
    Number.isInteger(item.quantity) && item.quantity > 0) &&
    ['dine-in', 'takeaway', 'delivery', 'bar'].includes(draft.orderType) &&
    Number.isFinite(draft.tipAmount) && draft.tipAmount >= 0 &&
    Number.isFinite(draft.discountPercent) && draft.discountPercent >= 0 && draft.discountPercent <= 100;
}

// Older saved counter orders may still carry a dine-in table assignment.
export function normalizeDraftOrder(draft: DraftOrder): DraftOrder {
  return draft.orderType === 'dine-in' ? draft : { ...draft, tableId: undefined, tableNumber: undefined };
}

export function draftTotals(draft: DraftOrder, settings: Pick<RestaurantSettings, 'taxMode' | 'vatRate'>) {
  const subtotal = draft.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = +(subtotal * draft.discountPercent / 100).toFixed(2);
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = settings.taxMode === 'vat_registered' ? +(taxableAmount * settings.vatRate).toFixed(2) : 0;
  const total = +(taxableAmount + tax + draft.tipAmount).toFixed(2);
  const quantity = draft.items.reduce((sum, item) => sum + item.quantity, 0);
  return { subtotal, discount, taxableAmount, tax, total, quantity };
}

type DraftAction =
  | { type: 'table'; table?: Pick<Table, 'id' | 'number'> }
  | { type: 'orderType'; orderType: OrderType }
  | { type: 'add'; item: MenuItem; id: string; selectedOptions?: Record<string, string>; notes?: string }
  | { type: 'quantity'; index: number; delta: number; menuItems: MenuItem[] }
  | { type: 'remove'; index: number }
  | { type: 'tip' | 'discount'; value: number }
  | { type: 'notes'; notes: string }
  | { type: 'customer'; name: string; pan?: string }
  | { type: 'reset' };

const sameOptions = (a: Record<string, string> = {}, b: Record<string, string> = {}) =>
  Object.keys(a).length === Object.keys(b).length && Object.keys(a).every(key => a[key] === b[key]);

export function draftOrderReducer(draft: DraftOrder, action: DraftAction): DraftOrder {
  switch (action.type) {
    case 'table':
      return { ...draft, tableId: action.table?.id, tableNumber: action.table?.number,
        orderType: action.table ? 'dine-in' : draft.orderType };
    case 'orderType':
      return normalizeDraftOrder({ ...draft, orderType: action.orderType });
    case 'add': {
      const { item, selectedOptions = {}, notes = '' } = action;
      const quantity = draft.items.filter(line => line.menuItemId === item.id && !line.isRefill)
        .reduce((sum, line) => sum + line.quantity, 0);
      if (!item.inStock || quantity + 1 > item.stockQuantity) return draft;
      const index = draft.items.findIndex(line => line.menuItemId === item.id && !line.isRefill &&
        sameOptions(line.selectedOptions, selectedOptions) && (line.notes || '') === notes);
      if (index !== -1) return { ...draft, items: draft.items.map((line, i) =>
        i === index ? { ...line, quantity: line.quantity + 1 } : line) };
      const extraPrice = item.options?.reduce((sum, option) => sum +
        (option.choices.find(choice => choice.label === selectedOptions[option.name])?.extraPrice ?? 0), 0) ?? 0;
      return { ...draft, items: [...draft.items, {
        id: action.id, menuItemId: item.id, name: item.name, nepaliName: item.nepaliName,
        price: item.price + extraPrice, quantity: 1, selectedOptions, notes,
        station: item.station, ticketType: item.ticketType, isCompleted: false,
      }] };
    }
    case 'quantity': {
      const line = draft.items[action.index];
      if (!line || !Number.isInteger(action.delta)) return draft;
      if (action.delta > 0 && !line.isRefill) {
        const dish = action.menuItems.find(item => item.id === line.menuItemId);
        const quantity = draft.items.filter(item => item.menuItemId === line.menuItemId && !item.isRefill)
          .reduce((sum, item) => sum + item.quantity, 0);
        if (!dish?.inStock || quantity + action.delta > dish.stockQuantity) return draft;
      }
      return { ...draft, items: draft.items.map((item, index) => index === action.index
        ? { ...item, quantity: item.quantity + action.delta } : item).filter(item => item.quantity > 0) };
    }
    case 'remove':
      return { ...draft, items: draft.items.filter((_, index) => index !== action.index) };
    case 'tip':
      return { ...draft, tipAmount: Number.isFinite(action.value) ? Math.max(0, action.value) : 0 };
    case 'discount':
      return { ...draft, discountPercent: Number.isFinite(action.value) ? Math.max(0, Math.min(100, action.value)) : 0 };
    case 'notes':
      return { ...draft, notes: action.notes };
    case 'customer':
      return { ...draft, customerName: action.name, customerPan: action.pan };
    case 'reset':
      return createDraftOrder();
  }
}
