import type { KitchenStation, Order, OrderItem } from '../types/restaurant';
export const kitchenStations: { value: KitchenStation | 'all'; label: string }[] = [
  { value: 'all', label: 'All stations' }, { value: 'kitchen', label: 'Kitchen' }, { value: 'momo', label: 'Momo' },
  { value: 'tandoor', label: 'Tandoor' }, { value: 'coffee', label: 'Coffee' }, { value: 'bar', label: 'Bar' },
];
export function matchesKitchenLine(item: OrderItem, station: KitchenStation | 'all', type: 'all' | 'KOT' | 'BOT') {
  return (station === 'all' || item.station === station) && (type === 'all' || item.ticketType === type);
}
export function kitchenQueue(orders: Order[], station: KitchenStation | 'all', type: 'all' | 'KOT' | 'BOT') {
  return orders.filter(order => ['new', 'preparing', 'ready'].includes(order.status) && order.items.some(item => matchesKitchenLine(item, station, type)))
    .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
}
export function elapsedLabel(createdAt: string, now: number) {
  const timestamp = Date.parse(createdAt);
  if (!Number.isFinite(timestamp)) return { text: 'Time unavailable', overdue: false };
  const minutes = Math.max(0, Math.floor((now - timestamp) / 60000));
  return { text: minutes < 60 ? minutes + ' min' : Math.floor(minutes / 60) + 'h ' + minutes % 60 + 'm', overdue: minutes >= 18 };
}
