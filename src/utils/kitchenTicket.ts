import type { Order, Table } from '../types/restaurant';

export interface KitchenTicketData {
  kotNumber: number | string;
  tableLabel: string;
  serverName: string;
  orderType: string;
  timeStr: string;
  notes?: string;
  items: { id: string; name: string; nepaliName?: string; quantity: number; station?: string; ticketType?: 'KOT' | 'BOT'; notes?: string; selectedOptions?: Record<string, string> }[];
}
export function kitchenTicketData(order: Order, tables: Table[]): KitchenTicketData {
  const timestamp = Date.parse(order.createdAt);
  return {
    kotNumber: order.orderNumber,
    tableLabel: tables.find(table => table.id === order.tableId)?.label || (order.tableNumber ? 'Table ' + order.tableNumber : order.orderType === 'delivery' ? 'Delivery' : 'Takeaway'),
    serverName: order.serverName || 'Unassigned',
    orderType: order.orderType === 'dine-in' ? 'Dine in' : order.orderType,
    timeStr: Number.isFinite(timestamp) ? new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kathmandu', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true }).format(timestamp) : 'Time unavailable',
    notes: order.notes,
    items: order.items,
  };
}
