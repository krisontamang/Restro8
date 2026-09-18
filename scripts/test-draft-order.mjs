import test from 'node:test';
import assert from 'node:assert/strict';
import { createDraftOrder, draftOrderReducer as reduce, draftTotals, isDraftOrder, normalizeDraftOrder } from '../src/utils/draftOrder.ts';

const dish = { id: 'momo', name: 'Momo', price: 100, stockQuantity: 3, inStock: true, station: 'momo', ticketType: 'KOT',
  options: [{ name: 'Style', choices: [{ label: 'Fried', extraPrice: 25 }] }] };
const add = (extra = {}) => ({ type: 'add', item: dish, id: 'line', ...extra });
const seated = () => reduce(reduce(createDraftOrder(), add()), { type: 'table', table: { id: 'table-2', number: 2 } });

test('counter order types clear the previous table without losing the ticket', () => {
  for (const orderType of ['takeaway', 'delivery', 'bar']) {
    const draft = reduce(seated(), { type: 'orderType', orderType });
    assert.equal(draft.tableId, undefined);
    assert.equal(draft.tableNumber, undefined);
    assert.equal(draft.items.length, 1);
    assert.equal(reduce(draft, { type: 'orderType', orderType: 'dine-in' }).tableId, undefined);
  }
});
test('seating from the floor starts dine-in and walk-in preserves the order type', () => {
  let draft = reduce(createDraftOrder(), { type: 'orderType', orderType: 'delivery' });
  draft = reduce(draft, { type: 'table', table: { id: 't', number: 7 } });
  assert.equal(draft.orderType, 'dine-in');
  assert.equal(draft.tableNumber, 7);
  assert.equal(reduce(draft, { type: 'table' }).tableId, undefined);
});
test('equivalent options merge regardless of key order and notes remain separate', () => {
  let draft = reduce(createDraftOrder(), add({ selectedOptions: { Style: 'Fried', Spice: 'Mild' } }));
  draft = reduce(draft, add({ selectedOptions: { Spice: 'Mild', Style: 'Fried' } }));
  assert.equal(draft.items.length, 1);
  assert.equal(draft.items[0].quantity, 2);
  assert.equal(draft.items[0].price, 125);
  draft = reduce(draft, add({ id: 'different', notes: 'No onion' }));
  assert.equal(draft.items.length, 2);
});
test('queued additions and quantity increases respect stock across variants', () => {
  let draft = reduce(createDraftOrder(), add());
  draft = reduce(draft, add({ id: 'variant', selectedOptions: { Style: 'Fried' } }));
  draft = reduce(draft, { type: 'quantity', index: 0, delta: 1, menuItems: [dish] });
  assert.equal(draftTotals(draft, { taxMode: 'pan_only' }).quantity, 3);
  assert.equal(reduce(draft, add()), draft);
  assert.equal(reduce(draft, { type: 'quantity', index: 1, delta: 1, menuItems: [dish] }), draft);
});
test('removal, decrement and reset are immutable and reset every draft field', () => {
  const draft = { ...seated(), discountPercent: 10, tipAmount: 20, customerName: 'Guest', notes: 'Pack well' };
  const next = reduce(draft, { type: 'quantity', index: 0, delta: -1, menuItems: [dish] });
  assert.equal(next.items.length, 0);
  assert.equal(draft.items.length, 1);
  assert.equal(reduce(draft, { type: 'remove', index: -1 }).items.length, 1);
  assert.deepEqual(reduce(draft, { type: 'reset' }), createDraftOrder());
});
test('saved drafts retain customization and repair old counter table assignments', () => {
  const draft = { ...seated(), orderType: 'takeaway', customerName: 'Guest' };
  const saved = JSON.parse(JSON.stringify(draft));
  assert.equal(isDraftOrder(saved), true);
  assert.equal(normalizeDraftOrder(saved).tableId, undefined);
  assert.deepEqual(normalizeDraftOrder(saved).items, saved.items);
  for (const corrupt of [{ ...draft, discountPercent: -1 }, { ...draft, tipAmount: -1 }, { ...draft, items: [{ ...draft.items[0], price: -1 }] }]) assert.equal(isDraftOrder(corrupt), false);
});
test('ticket totals use configured VAT, discount and tip consistently', () => {
  const draft = { ...seated(), discountPercent: 10, tipAmount: 20 };
  assert.deepEqual(draftTotals(draft, { taxMode: 'vat_registered', vatRate: 0.13 }), { subtotal: 100, discount: 10, taxableAmount: 90, tax: 11.7, total: 121.7, quantity: 1 });
  assert.equal(draftTotals(draft, { taxMode: 'vat_registered', vatRate: 0.1 }).total, 119);
  assert.equal(draftTotals(draft, { taxMode: 'pan_only', vatRate: 0.13 }).total, 110);
});
