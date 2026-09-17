import test from 'node:test';
import assert from 'node:assert/strict';
import { itemSales, monthlySales, reportableOrders, salesSummary } from '../src/utils/reporting.ts';

const menu = [
  { id: 'momo-1', name: 'Steamed Buff Momo', category: 'momo', cost: 85 },
  { id: 'thak-1', name: 'Mustang Thakali Khana', category: 'thakali_newari', cost: 240 },
];

function seededRandom(seed = 8) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

function randomOrders(count = 240) {
  const random = seededRandom();
  const end = new Date();
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(end);
    // Keep generated fixtures inside the inclusive one-year window despite millisecond drift.
    date.setDate(date.getDate() - Math.floor(random() * 364));
    const momoQty = 1 + Math.floor(random() * 3);
    const thakaliQty = Math.floor(random() * 2);
    const items = [{ menuItemId: 'momo-1', name: 'Steamed Buff Momo', price: 280, quantity: momoQty }];
    if (thakaliQty) items.push({ menuItemId: 'thak-1', name: 'Mustang Thakali Khana', price: 680, quantity: thakaliQty });
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return {
      id: `random-${index}`,
      orderNumber: 1000 + index,
      items,
      total: subtotal,
      subtotal,
      discount: 0,
      tax: Math.round(subtotal * 0.13),
      paymentStatus: random() > 0.18 ? 'paid' : 'unpaid',
      status: 'completed',
      updatedAt: date.toISOString(),
      createdAt: date.toISOString(),
      serverName: 'Test Captain',
    };
  });
}

test('one year report summarizes deterministic random orders', () => {
  const orders = randomOrders();
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - 365);
  const scoped = reportableOrders(orders, start, end);
  const summary = salesSummary(scoped);
  const months = monthlySales(scoped, end);

  assert.equal(scoped.length, 240);
  assert.ok(summary.grossBilled > 0);
  assert.ok(summary.collected > 0);
  assert.ok(summary.outstanding > 0);
  assert.equal(months.length, 12);
  // The 12-point trend uses calendar buckets; a partial first month can sit outside the plotted buckets.
  assert.ok(months.reduce((sum, month) => sum + month.orders, 0) <= scoped.length);
});

test('menu sales report aggregates quantities, revenue, and gross profit', () => {
  const orders = randomOrders(40);
  const rows = itemSales(orders, menu);
  assert.equal(rows[0].id, 'momo-1');
  assert.ok(rows[0].quantity > 0);
  assert.equal(rows.reduce((sum, row) => sum + row.billed, 0), orders.reduce((sum, order) => sum + order.total, 0));
  assert.ok(rows.every((row) => row.grossProfit >= 0));
});

test('cancelled and out-of-period orders never enter sales reports', () => {
  const end = new Date('2026-09-17T12:00:00Z');
  const start = new Date('2025-09-17T12:00:00Z');
  const base = randomOrders(1)[0];
  const inPeriod = { ...base, updatedAt: '2026-01-10T12:00:00Z', createdAt: '2026-01-10T12:00:00Z' };
  const cancelled = { ...inPeriod, id: 'cancelled', status: 'cancelled' };
  const old = { ...inPeriod, id: 'old', updatedAt: '2025-01-10T12:00:00Z', createdAt: '2025-01-10T12:00:00Z' };
  assert.deepEqual(reportableOrders([inPeriod, cancelled, old], start, end).map((order) => order.id), [inPeriod.id]);
});
