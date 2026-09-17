import type { MenuItem, OrderItem } from '../types/restaurant';

/** Aggregate every customization of a dish before checking or deducting stock. */
export function stockRequirements(items: OrderItem[]): Map<string, number> {
  const quantities = new Map<string, number>();
  for (const item of items) {
    if (!item.isRefill) quantities.set(item.menuItemId, (quantities.get(item.menuItemId) ?? 0) + item.quantity);
  }
  return quantities;
}
export function stockIssue(items: OrderItem[], menu: MenuItem[]): string | null {
  if (items.some(item => !Number.isInteger(item.quantity) || item.quantity < 1 || !Number.isFinite(item.price) || item.price < 0)) return 'Check the quantities and prices in this ticket.';
  const byId = new Map(menu.map(item => [item.id, item]));
  for (const [id, quantity] of stockRequirements(items)) {
    const dish = byId.get(id);
    if (!dish || !dish.inStock || quantity > dish.stockQuantity) return `${dish?.name ?? 'A dish'} has only ${dish?.inStock ? dish.stockQuantity : 0} available. Update the ticket before sending.`;
  }
  return null;
}
