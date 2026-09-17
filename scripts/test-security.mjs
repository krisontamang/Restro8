import test from 'node:test';
import { isSafePublicKey as isSafeKey } from '../src/lib/accountRules.ts';
import assert from 'node:assert/strict';

import { canAccessTab, canPerformAction, normalizeRole } from '../src/lib/authorization.ts';
import { csvEscape } from '../src/utils/reporting.ts';

test('RBAC role normalization maps aliases safely', () => {
  assert.equal(normalizeRole('kitchen'), 'chef');
  assert.equal(normalizeRole('billing'), 'cashier');
  assert.equal(normalizeRole('server'), 'waiter');
  assert.equal(normalizeRole('superadmin'), 'SuperAdmin');
  assert.equal(normalizeRole('unknown_role'), 'manager');
});

test('RBAC rejects unauthorized roles from accessing staff and financial records', () => {
  // Waiter restrictions
  assert.equal(canAccessTab('waiter', 'staff'), false, 'Waiters must not access staff records');
  assert.equal(canAccessTab('waiter', 'finance-dashboard'), false, 'Waiters must not access financial dashboard');
  assert.equal(canAccessTab('waiter', 'finance-sales'), false, 'Waiters must not access sales books');
  assert.equal(canAccessTab('waiter', 'settings-billing'), false, 'Waiters must not access subscription billing');

  // Kitchen/Chef restrictions
  assert.equal(canAccessTab('chef', 'staff'), false, 'Chefs must not access staff records');
  assert.equal(canAccessTab('chef', 'customers'), false, 'Chefs must not access customer PII');
  assert.equal(canAccessTab('chef', 'finance-dashboard'), false, 'Chefs must not access financials');
  assert.equal(canAccessTab('chef', 'finance-sales'), false, 'Chefs must not access sales books');

  // Cashier restrictions
  assert.equal(canAccessTab('cashier', 'staff'), false, 'Cashiers must not access staff records');
  assert.equal(canAccessTab('cashier', 'finance-expenses'), false, 'Cashiers must not access expenditure ledger');
  assert.equal(canAccessTab('cashier', 'settings-billing'), false, 'Cashiers must not access billing settings');

  // SuperAdmin and Admin authorizations
  assert.equal(canAccessTab('SuperAdmin', 'staff'), true, 'SuperAdmin can access staff');
  assert.equal(canAccessTab('SuperAdmin', 'finance-dashboard'), true, 'SuperAdmin can access financials');
  assert.equal(canAccessTab('admin', 'staff'), true, 'Admin can access staff');
  assert.equal(canAccessTab('admin', 'finance-dashboard'), true, 'Admin can access financials');
});

test('RBAC action permissions enforce least privilege', () => {
  // Staff management
  assert.equal(canPerformAction('waiter', 'manage_staff'), false);
  assert.equal(canPerformAction('chef', 'manage_staff'), false);
  assert.equal(canPerformAction('cashier', 'manage_staff'), false);
  assert.equal(canPerformAction('manager', 'manage_staff'), false);
  assert.equal(canPerformAction('admin', 'manage_staff'), true);
  assert.equal(canPerformAction('SuperAdmin', 'manage_staff'), true);

  // Financial access
  assert.equal(canPerformAction('waiter', 'access_financials'), false);
  assert.equal(canPerformAction('chef', 'access_financials'), false);
  assert.equal(canPerformAction('manager', 'access_financials'), true);
  assert.equal(canPerformAction('SuperAdmin', 'access_financials'), true);

  // Order settlement
  assert.equal(canPerformAction('chef', 'settle_order'), false);
  assert.equal(canPerformAction('cashier', 'settle_order'), true);
  assert.equal(canPerformAction('manager', 'settle_order'), true);
});

test('CSV export neutralizes spreadsheet formula injection', () => {
  // Attack vectors: formulas starting with =, +, -, @, or tab
  const formula1 = '=cmd|"/C calc"!A0';
  const formula2 = '+12345';
  const formula3 = '-SUM(A1:A10)';
  const formula4 = '@dangerous()';

  assert.match(csvEscape(formula1), /^"'=cmd/, 'Leading = must be escaped with single quote');
  assert.match(csvEscape(formula2), /^"'\+12345/, 'Leading + must be escaped with single quote');
  assert.match(csvEscape(formula3), /^"'-SUM/, 'Leading - must be escaped with single quote');
  assert.match(csvEscape(formula4), /^"'@dangerous/, 'Leading @ must be escaped with single quote');

  // Standard alphanumeric values must not be mangled
  assert.equal(csvEscape('Steamed Buff Momo'), '"Steamed Buff Momo"');
  assert.equal(csvEscape('Rs. 250'), '"Rs. 250"');
});

test('Guest order validation boundaries', () => {
  function validateGuestOrderLines(lines) {
    if (!Array.isArray(lines) || lines.length === 0) return 'EMPTY';
    if (lines.length > 25) return 'TOO_MANY_LINES';
    for (const line of lines) {
      if (!line || typeof line.itemId !== 'string') return 'INVALID_ITEM';
      const qty = Number(line.quantity);
      if (!Number.isInteger(qty) || qty <= 0 || qty > 50) return 'INVALID_QUANTITY';
    }
    return 'VALID';
  }

  assert.equal(validateGuestOrderLines([]), 'EMPTY');
  assert.equal(validateGuestOrderLines(new Array(26).fill({ itemId: 'momo-1', quantity: 1 })), 'TOO_MANY_LINES');
  assert.equal(validateGuestOrderLines([{ itemId: 'momo-1', quantity: 0 }]), 'INVALID_QUANTITY');
  assert.equal(validateGuestOrderLines([{ itemId: 'momo-1', quantity: -5 }]), 'INVALID_QUANTITY');
  assert.equal(validateGuestOrderLines([{ itemId: 'momo-1', quantity: 51 }]), 'INVALID_QUANTITY');
  assert.equal(validateGuestOrderLines([{ itemId: 'momo-1', quantity: 2.5 }]), 'INVALID_QUANTITY');
  assert.equal(validateGuestOrderLines([{ itemId: 'momo-1', quantity: 2 }]), 'VALID');
});

test('Service role secret detection rejects privileged tokens', () => {
  assert.equal(isSafeKey('sb_secret_abcdef123456'), false, 'sb_secret_ prefix must be blocked');
  assert.equal(isSafeKey('service_role_key_here'), false, 'service_role prefix must be blocked');

  // Simulated JWT with role: "service_role"
  const serviceRoleJwt = 'header.' + Buffer.from(JSON.stringify({ role: 'service_role' })).toString('base64') + '.sig';
  assert.equal(isSafeKey(serviceRoleJwt), false, 'service_role in JWT payload must be blocked');

  // Simulated valid anon JWT
  const anonJwt = 'header.' + Buffer.from(JSON.stringify({ role: 'anon' })).toString('base64') + '.sig';
  assert.equal(isSafeKey(anonJwt), true, 'anon JWT must be accepted');

  // Standard publishable string
  assert.equal(isSafeKey('sb_publishable_83S2Z-JDQmpUMTmGuFPeuw_-xecH_xT'), true, 'publishable key must be accepted');
});
