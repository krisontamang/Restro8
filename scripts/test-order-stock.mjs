import test from 'node:test';
import assert from 'node:assert/strict';
import { stockIssue, stockRequirements } from '../src/utils/orderStock.ts';
import { safeStorage, readStored, getStorageError } from '../src/lib/storage.ts';

const line = (quantity, extra = {}) => ({ menuItemId: 'momo', quantity, price: 280, ...extra });
const menu = [{ id: 'momo', name: 'Momo', inStock: true, stockQuantity: 5 }];

test('all customizations of a dish consume stock together', () => {
  const items = [line(2, { selectedOptions: { spice: 'mild' } }), line(3, { selectedOptions: { spice: 'hot' } })];
  assert.equal(stockRequirements(items).get('momo'), 5);
  assert.equal(stockIssue(items, menu), null);
  assert.match(stockIssue([...items, line(1)], menu), /only 5 available/);
});
test('refills do not deduct another dish portion', () => {
  assert.equal(stockRequirements([line(2), line(1, { isRefill: true, price: 0 })]).get('momo'), 2);
});
test('sold out and deleted dishes cannot be submitted', () => {
  assert.match(stockIssue([line(1)], [{ ...menu[0], inStock: false }]), /only 0/);
  assert.match(stockIssue([line(1)], []), /only 0/);
});
test('invalid prices and quantities cannot be submitted', () => {
  for (const item of [line(-1), line(1.5), line(NaN), line(1, { price: -1 }), line(1, { price: Infinity })]) assert.match(stockIssue([item], menu), /quantities and prices/);
});
test('storage preserves corrupt drafts for recovery and ignores identical writes', () => {
  const records = new Map([['draft', '{broken']]); let writes = 0;
  globalThis.localStorage = { getItem: key => records.get(key) ?? null, setItem: (key, value) => { writes++; records.set(key, value); }, removeItem: key => records.delete(key) };
  assert.deepEqual(readStored('draft', [], Array.isArray), []);
  assert.equal(records.get('draft.recovery'), '{broken');
  safeStorage.setItem('ok', 'value'); safeStorage.setItem('ok', 'value');
  assert.equal(writes, 2);
});
test('blocked storage raises a persistent warning instead of crashing', () => {
  globalThis.localStorage = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('quota'); } };
  assert.equal(safeStorage.getItem('draft'), null);
  assert.equal(safeStorage.setItem('draft', '{}'), false);
  assert.match(getStorageError(), /cannot be saved/);
});
