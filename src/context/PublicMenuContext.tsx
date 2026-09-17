import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import type { MenuItem, MenuCategory, RestaurantSettings } from '../types/restaurant';
import { INITIAL_MENU_ITEMS, INITIAL_SETTINGS, INITIAL_TABLES } from '../data/initialData';
import { safeStorage } from '../lib/storage';

export interface PublicTableInfo {
  id: string;
  label: string;
}

export interface GuestOrderLine {
  itemId: string;
  quantity: number;
}

export interface GuestOrderResult {
  success: boolean;
  orderNumber?: number;
  message?: string;
  error?: string;
}

export interface PublicMenuContextType {
  restaurantInfo: Pick<RestaurantSettings, 'name' | 'tagline' | 'currency' | 'taxMode' | 'vatRate' | 'phone'>;
  menuItems: MenuItem[];
  resolveTable: (tableId: string | null) => PublicTableInfo | undefined;
  sendGuestOrder: (tableId: string | undefined, lines: GuestOrderLine[], notes?: string) => Promise<GuestOrderResult>;
}

const PublicMenuContext = createContext<PublicMenuContextType | null>(null);

// In-memory rate limiting tracker (prevents flooding kitchen tickets)
const ORDER_TIMESTAMPS: number[] = [];
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const MAX_ORDERS_PER_WINDOW = 3;

function isRateLimited(): boolean {
  const now = Date.now();
  // Filter out timestamps older than the rate limit window
  while (ORDER_TIMESTAMPS.length > 0 && ORDER_TIMESTAMPS[0] < now - RATE_LIMIT_WINDOW_MS) {
    ORDER_TIMESTAMPS.shift();
  }
  if (ORDER_TIMESTAMPS.length >= MAX_ORDERS_PER_WINDOW) {
    return true;
  }
  ORDER_TIMESTAMPS.push(now);
  return false;
}

export const PublicMenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Public Menu items: loaded safely without touching administrative customers/staff/finances
  const [menuItems] = useState<MenuItem[]>(() => {
    try {
      // If public menu has cached items in local storage, only read public menu data
      const stored = safeStorage.getItem('restrox_np_menu_v2');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.map((item: Partial<MenuItem>) => ({
            id: String(item.id || ''),
            name: String(item.name || ''),
            nepaliName: item.nepaliName ? String(item.nepaliName) : undefined,
            category: (item.category || 'mains') as MenuCategory,
            price: Number(item.price) || 0,
            cost: 0, // Never leak food item costs to guests
            prepTimeMinutes: Number(item.prepTimeMinutes) || 15,
            description: String(item.description || ''),
            image: String(item.image || ''),
            tags: Array.isArray(item.tags) ? item.tags : [],
            inStock: Boolean(item.inStock),
            stockQuantity: Number(item.stockQuantity) || 0,
            station: item.station || 'kitchen',
            ticketType: item.ticketType || 'KOT',
            options: Array.isArray(item.options) ? item.options : [],
          }));
        }
      }
    } catch {
      // Fallback cleanly
    }
    return INITIAL_MENU_ITEMS.map(item => ({ ...item, cost: 0 }));
  });

  // Public Restaurant Info: Exposes only presentation fields (no PAN, no financial accounts)
  const restaurantInfo = useMemo(() => {
    try {
      const stored = safeStorage.getItem('restrox_np_settings_v2');
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          name: String(parsed.name || INITIAL_SETTINGS.name),
          tagline: String(parsed.tagline || INITIAL_SETTINGS.tagline),
          currency: String(parsed.currency || INITIAL_SETTINGS.currency),
          taxMode: parsed.taxMode === 'pan_only' ? ('pan_only' as const) : ('vat_registered' as const),
          vatRate: Number(parsed.vatRate) || INITIAL_SETTINGS.vatRate,
          phone: String(parsed.phone || INITIAL_SETTINGS.phone),
        };
      }
    } catch {
      // Fallback cleanly
    }
    return {
      name: INITIAL_SETTINGS.name,
      tagline: INITIAL_SETTINGS.tagline,
      currency: INITIAL_SETTINGS.currency,
      taxMode: INITIAL_SETTINGS.taxMode,
      vatRate: INITIAL_SETTINGS.vatRate,
      phone: INITIAL_SETTINGS.phone,
    };
  }, []);

  // Safe table lookup (exposes only Table ID and Label, zero order details or amounts)
  const resolveTable = useCallback((tableId: string | null): PublicTableInfo | undefined => {
    if (!tableId) return undefined;
    const cleanId = tableId.trim();

    try {
      const stored = safeStorage.getItem('restrox_np_tables_v2');
      const tableList = stored ? JSON.parse(stored) : INITIAL_TABLES;
      if (Array.isArray(tableList)) {
        const found = tableList.find((t: { id?: string; label?: string }) =>
          t.id === cleanId ||
          t.label?.toLowerCase() === cleanId.toLowerCase() ||
          t.label?.toLowerCase() === cleanId.replace(/^t-/, '').replace(/-/g, ' ').toLowerCase()
        );
        if (found && found.id && found.label) {
          return { id: String(found.id), label: String(found.label) };
        }
      }
    } catch {
      // Fallback to initial tables
    }

    const fallback = INITIAL_TABLES.find(t => t.id === cleanId || t.label.toLowerCase() === cleanId.toLowerCase());
    return fallback ? { id: fallback.id, label: fallback.label } : undefined;
  }, []);

  // Safe guest order submission with strict validation & rate limiting
  const sendGuestOrder = useCallback(async (
    tableId: string | undefined,
    lines: GuestOrderLine[],
    rawNotes?: string
  ): Promise<GuestOrderResult> => {
    // 1. Rate limiting check
    if (isRateLimited()) {
      return {
        success: false,
        error: 'Too many order requests. Please wait a minute before submitting again.',
      };
    }

    // 2. Input validation: Lines array constraints
    if (!Array.isArray(lines) || lines.length === 0) {
      return { success: false, error: 'Please select at least one dish.' };
    }
    if (lines.length > 25) {
      return { success: false, error: 'Too many dishes in a single order (maximum 25 items).' };
    }

    // 3. Line items validation
    const validatedLines: Array<{ item: MenuItem; quantity: number }> = [];
    for (const line of lines) {
      if (!line || typeof line.itemId !== 'string') {
        return { success: false, error: 'Invalid dish selection.' };
      }
      const qty = Number(line.quantity);
      if (!Number.isInteger(qty) || qty <= 0 || qty > 50) {
        return { success: false, error: 'Dish quantity must be an integer between 1 and 50.' };
      }
      const targetItem = menuItems.find(m => m.id === line.itemId);
      if (!targetItem || !targetItem.inStock) {
        return { success: false, error: `Dish "${targetItem?.name || line.itemId}" is currently sold out.` };
      }
      validatedLines.push({ item: targetItem, quantity: qty });
    }

    // 4. Sanitize guest notes
    const sanitizedNotes = rawNotes
      ? String(rawNotes).replace(/[<>]/g, '').slice(0, 200).trim()
      : '';

    // 5. Generate secure guest order payload
    const orderNumber = Math.floor(100 + Math.random() * 900);
    const guestOrderPayload = {
      orderNumber,
      tableId: tableId || 'takeaway',
      items: validatedLines.map(l => ({
        menuItemId: l.item.id,
        name: l.item.name,
        nepaliName: l.item.nepaliName,
        price: l.item.price,
        quantity: l.quantity,
        station: l.item.station,
      })),
      notes: sanitizedNotes,
      submittedAt: new Date().toISOString(),
    };

    // Store in a dedicated guest-scoped key (does NOT pollute or touch administrative data)
    try {
      const existing = safeStorage.getItem('restrox_guest_recent_orders');
      const orders = existing ? JSON.parse(existing) : [];
      orders.unshift(guestOrderPayload);
      safeStorage.setItem('restrox_guest_recent_orders', JSON.stringify(orders.slice(0, 5)));
    } catch {
      // Non-critical local cache
    }

    // If active POS session is running on the same origin/host, link into local orders queue safely
    try {
      const existingOrdersRaw = safeStorage.getItem('restrox_np_orders_v2');
      if (existingOrdersRaw) {
        const existingOrders = JSON.parse(existingOrdersRaw);
        if (Array.isArray(existingOrders)) {
          const subtotal = validatedLines.reduce((sum, l) => sum + l.item.price * l.quantity, 0);
          const vat = restaurantInfo.taxMode === 'vat_registered' ? +(subtotal * restaurantInfo.vatRate).toFixed(2) : 0;
          const newOrder = {
            id: `guest-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            orderNumber,
            tableId: tableId || undefined,
            tableNumber: tableId?.replace(/^t-/, '').toUpperCase(),
            orderType: tableId ? 'dine-in' : 'takeaway',
            status: 'new',
            paymentStatus: 'unpaid',
            items: validatedLines.map(l => ({
              id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              menuItemId: l.item.id,
              name: l.item.name,
              nepaliName: l.item.nepaliName,
              price: l.item.price,
              quantity: l.quantity,
              selectedOptions: {},
              notes: sanitizedNotes || 'Guest QR Order',
              station: l.item.station,
              ticketType: l.item.ticketType,
              isCompleted: false,
            })),
            discount: 0,
            tip: 0,
            subtotal,
            taxableAmount: subtotal,
            tax: vat,
            total: subtotal + vat,
            notes: sanitizedNotes,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          existingOrders.unshift(newOrder);
          safeStorage.setItem('restrox_np_orders_v2', JSON.stringify(existingOrders));
        }
      }
    } catch {
      // Local linking fallback
    }

    return {
      success: true,
      orderNumber,
      message: `Your order #${orderNumber} has been received by the kitchen!`,
    };
  }, [menuItems, restaurantInfo]);

  const value = useMemo(() => ({
    restaurantInfo,
    menuItems,
    resolveTable,
    sendGuestOrder,
  }), [restaurantInfo, menuItems, resolveTable, sendGuestOrder]);

  return (
    <PublicMenuContext.Provider value={value}>
      {children}
    </PublicMenuContext.Provider>
  );
};

export function usePublicMenu() {
  const context = useContext(PublicMenuContext);
  if (!context) {
    throw new Error('usePublicMenu must be used within a PublicMenuProvider');
  }
  return context;
}
