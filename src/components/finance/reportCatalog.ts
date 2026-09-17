export type ReportId = 'sales' | 'daily' | 'monthly' | 'payments' | 'open-bills' | 'discounts' | 'items' | 'categories' | 'stock' | 'vat' | 'trial-balance' | 'profit-loss' | 'balance-sheet' | 'purchases' | 'stock-movements';
export interface ReportDefinition { id: ReportId; name: string; group: 'Sales & collections' | 'Menu & stock' | 'Accounting'; description: string; prerequisite?: string }
export const reportCatalog: ReportDefinition[] = [
  { id: 'sales', name: 'Sales register', group: 'Sales & collections', description: 'Net sales, tax and payable totals for each order.' },
  { id: 'daily', name: 'Daily sales', group: 'Sales & collections', description: 'Compare trading days and their outstanding balances.' },
  { id: 'monthly', name: 'Monthly sales', group: 'Sales & collections', description: 'A full-year view with a total for every calendar month.' },
  { id: 'payments', name: 'Payment methods', group: 'Sales & collections', description: 'Cash, cards and wallets, including split payments.' },
  { id: 'open-bills', name: 'Outstanding bills', group: 'Sales & collections', description: 'Unpaid orders that still need to be settled.' },
  { id: 'discounts', name: 'Discounts & complimentary items', group: 'Sales & collections', description: 'See reductions and zero-priced items separately.' },
  { id: 'items', name: 'Dish performance', group: 'Menu & stock', description: 'Quantities, gross item sales and current cost estimates.' },
  { id: 'categories', name: 'Category performance', group: 'Menu & stock', description: 'Compare sales and quantities across menu categories.' },
  { id: 'stock', name: 'Stock on hand', group: 'Menu & stock', description: 'Current menu portions and estimated stock value.' },
  { id: 'vat', name: 'Sales VAT summary', group: 'Accounting', description: 'Taxable amounts and output VAT recorded on orders.' },
  { id: 'trial-balance', name: 'Trial Balance', group: 'Accounting', description: 'Debit and credit balances by account.', prerequisite: 'A posted double-entry ledger and opening balances are required. The current workspace does not yet connect bookkeeping entries to a ledger, so a Trial Balance cannot be calculated from orders alone.' },
  { id: 'profit-loss', name: 'Profit & Loss', group: 'Accounting', description: 'Income, cost of sales and operating expenses.', prerequisite: 'Posted income, historical cost of sales and expenses are required. Current menu costs are estimates; they cannot establish net profit. Use Dish performance to review those estimates.' },
  { id: 'balance-sheet', name: 'Balance Sheet', group: 'Accounting', description: 'Assets, liabilities and equity at a point in time.', prerequisite: 'Reconciled account balances and opening equity are required. Sales totals alone cannot establish assets, liabilities or equity.' },
  { id: 'purchases', name: 'Purchase register', group: 'Accounting', description: 'Supplier bills, returns and input tax.', prerequisite: 'Supplier bills and returns must be connected to the persistent reporting ledger. That connection is not yet implemented; sales orders are not purchase records.' },
  { id: 'stock-movements', name: 'Stock movement', group: 'Menu & stock', description: 'Receipts, consumption, adjustments and closing stock.', prerequisite: 'A dated movement ledger with opening quantities is required. The available menu stock is a current snapshot and cannot establish historical movements or ageing.' },
];
const aliases: Record<string, ReportId> = { 'Sales Master Report': 'sales', 'Sales Register': 'sales', 'Sales Ledger': 'sales', 'Daily Sales Summary Report': 'daily', 'Payment Mode Summary': 'payments', 'Trial Balance': 'trial-balance', 'Profit Or Loss Statement': 'profit-loss', 'Balance Sheet': 'balance-sheet', 'Dish Quantity Sales Report': 'items', 'Stock Position Report': 'stock', 'VAT Summary Report': 'vat' };
export function findReport(name: string) { return reportCatalog.find(report => report.id === name || report.name === name || report.id === aliases[name]); }
