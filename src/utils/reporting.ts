import type { MenuItem, Order } from '../types/restaurant';

export interface SalesSummary {
  orderCount: number;
  grossBilled: number;
  collected: number;
  outstanding: number;
  discount: number;
  tax: number;
  averageBill: number;
}

export interface MonthlySalesPoint {
  key: string;
  label: string;
  orders: number;
  billed: number;
  collected: number;
}

export interface ItemSalesRow {
  id: string;
  name: string;
  category: string;
  quantity: number;
  billed: number;
  cost: number;
  grossProfit: number;
}

export function orderDate(order: Order) {
  // Kitchen and payment updates must not move sales to a different trading day.
  const timestamp = Date.parse(order.createdAt);
  return Number.isFinite(timestamp) ? new Date(timestamp) : null;
}

export function reportableOrders(orders: Order[], start: Date, end: Date) {
  return orders.filter((order) => {
    const date = orderDate(order);
    return Boolean(date && order.status !== 'cancelled' && date >= start && date <= end);
  });
}

function money(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, number) : 0;
}

export function salesSummary(orders: Order[]): SalesSummary {
  const grossBilled = orders.reduce((sum, order) => sum + money(order.total), 0);
  const collected = orders.reduce((sum, order) => sum + (order.paymentStatus === 'paid' ? money(order.total) : 0), 0);
  const discount = orders.reduce((sum, order) => sum + money(order.discount), 0);
  const tax = orders.reduce((sum, order) => sum + money(order.tax), 0);
  return {
    orderCount: orders.length,
    grossBilled: Math.round(grossBilled * 100) / 100,
    collected: Math.round(collected * 100) / 100,
    outstanding: Math.round(Math.max(0, grossBilled - collected) * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    averageBill: orders.length ? Math.round(grossBilled / orders.length * 100) / 100 : 0,
  };
}

export function monthlySales(orders: Order[], end: Date, months = 12): MonthlySalesPoint[] {
  const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kathmandu', year: 'numeric', month: '2-digit' });
  const monthKey = (date: Date) => {
    const parts = formatter.formatToParts(date);
    return parts.find(part => part.type === 'year')!.value + '-' + parts.find(part => part.type === 'month')!.value;
  };
  const [year, month] = monthKey(end).split('-').map(Number);
  const points = Array.from({ length: Math.max(0, Math.floor(months)) }, (_, index) => {
    const date = new Date(Date.UTC(year, month - months + index, 1));
    return { key: date.toISOString().slice(0, 7), label: date.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }), orders: 0, billed: 0, collected: 0 };
  });
  const byMonth = new Map(points.map(point => [point.key, point]));
  // One pass over orders; reuse the timezone formatter instead of rebuilding it per row per month.
  for (const order of orders) {
    const date = orderDate(order);
    if (!date || date > end || order.status === 'cancelled') continue;
    const point = byMonth.get(monthKey(date));
    if (!point) continue;
    point.orders++;
    point.billed += money(order.total);
    if (order.paymentStatus === 'paid') point.collected += money(order.total);
  }
  return points.map(point => ({ ...point, billed: Math.round(point.billed * 100) / 100, collected: Math.round(point.collected * 100) / 100 }));
}

export function itemSales(orders: Order[], menu: MenuItem[]): ItemSalesRow[] {
  const byId = new Map(menu.map((item) => [item.id, item]));
  const rows = new Map<string, ItemSalesRow>();
  for (const order of orders) {
    for (const line of order.items) {
      if (line.isRefill) continue;
      const item = byId.get(line.menuItemId);
      const quantity = Number.isFinite(Number(line.quantity)) ? Math.max(0, Number(line.quantity)) : 0;
      const billed = money(line.price) * quantity;
      const cost = money(item?.cost) * quantity;
      const current = rows.get(line.menuItemId) || {
        id: line.menuItemId,
        name: item?.name || line.name || 'Deleted menu item',
        category: item?.category || 'unknown',
        quantity: 0,
        billed: 0,
        cost: 0,
        grossProfit: 0,
      };
      current.quantity += quantity;
      current.billed += billed;
      current.cost += cost;
      current.grossProfit += billed - cost;
      rows.set(line.menuItemId, current);
    }
  }
  return [...rows.values()].sort((a, b) => b.billed - a.billed);
}

export function csvEscape(value: unknown) {
  // Quoting alone does not prevent spreadsheet formula execution.
  const raw = String(value ?? '');
  const text = typeof value === 'string' && /^[\s]*[=+@-]/.test(raw) ? "'" + raw : raw;
  return `"${text.replaceAll('"', '""')}"`;
}
