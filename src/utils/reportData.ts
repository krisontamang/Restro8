import type { MenuItem, Order } from '../types/restaurant';
import type { ReportId } from '../components/finance/reportCatalog';
import { itemSales, monthlySales } from './reporting.ts';
export const amount = (value: number | undefined) => Number.isFinite(value) ? Math.round((value || 0) * 100) / 100 : 0;
export const sum = (rows: Order[], value: (order: Order) => number) => amount(rows.reduce((total, row) => total + amount(value(row)), 0));
export const tradingDay = (iso: string) => {
  const date = new Date(iso);
  if (!Number.isFinite(date.getTime())) return 'Unknown date';
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kathmandu', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
};
export const categoryLabel = (value: string) => value.replaceAll('_', ' ').replace(/\b\w/g, char => char.toUpperCase());
export interface ReportTable { columns: string[]; moneyColumns: number[]; rows: (string | number)[][]; basis: string }
export function paymentBreakdown(orders: Order[]) {
  const totals = new Map<string, number>();
  const add = (method: string, value: number) => totals.set(method, amount((totals.get(method) || 0) + value));
  for (const order of orders.filter(row => row.status !== 'cancelled' && row.paymentStatus === 'paid')) {
    if (order.paymentMethod === 'split' && order.splitDetails?.tenders.length) {
      let change = Math.max(0, amount(order.splitDetails.changeReturned));
      let allocated = 0;
      for (const tender of order.splitDetails.tenders) {
        const deduction = tender.method === 'cash' ? Math.min(change, tender.amount) : 0;
        change -= deduction;
        const value = amount(tender.amount - deduction);
        allocated += value;
        add(tender.method, value);
      }
      const difference = amount(order.total - allocated);
      if (difference) add('Unallocated / variance', difference);
    } else add(order.paymentMethod || 'Unspecified', amount(order.total));
  }
  return [...totals].map(([method, total]) => ({ method, total })).sort((a, b) => b.total - a.total);
}
export function buildReport(id: ReportId, orders: Order[], menu: MenuItem[], end: Date): ReportTable {
  const valid = orders.filter(order => order.status !== 'cancelled');
  const defaultBasis = 'Order creation date · Kathmandu time. Net sales exclude VAT and tips. Collections are settlement totals for these orders, not a cash-flow statement.';
  const invoice = (order: Order) => order.invoiceNumber || '#' + order.orderNumber;
  if (id === 'payments') return { columns: ['Method', 'Collected'], moneyColumns: [1], rows: paymentBreakdown(valid).map(row => [row.method, row.total]), basis: 'Paid orders in the selected order-date range. Split tenders are separated and cash change deducted. Unallocated amounts need review.' };
  if (id === 'open-bills') return { columns: ['Order date', 'Reference', 'Customer', 'Payable'], moneyColumns: [3], rows: valid.filter(order => order.paymentStatus !== 'paid').map(order => [tradingDay(order.createdAt), invoice(order), order.customerName || 'Guest', order.total]), basis: 'Unpaid, non-cancelled orders placed in this period. These open bills are not the complete accounts-receivable ledger.' };
  if (id === 'discounts') return { columns: ['Reference', 'Order discount', 'Complimentary quantity', 'Net sales'], moneyColumns: [1,3], rows: valid.filter(order => order.discount > 0 || order.items.some(item => item.price === 0)).map(order => [invoice(order), order.discount, order.items.filter(item => item.price === 0).reduce((n, item) => n + item.quantity, 0), Math.max(0, amount(order.subtotal - order.discount))]), basis: 'Order-level discounts and quantities of zero-priced items, including refills. A zero-priced item has no recorded discount value unless a list price was saved.' };
  if (id === 'stock') return { columns: ['Dish', 'Category', 'Availability', 'Portions', 'Unit cost', 'Est. value'], moneyColumns: [4,5], rows: menu.map(item => [item.name, categoryLabel(item.category), !item.inStock || item.stockQuantity <= 0 ? 'Unavailable' : item.stockQuantity <= 5 ? 'Low stock' : 'Available', item.stockQuantity, item.cost, amount(item.stockQuantity * item.cost)]), basis: 'Current menu portion stock at the time of viewing, independent of the date filter. Estimated value uses current menu costs. This is not ingredient inventory or historical stock.' };
  if (id === 'items' || id === 'categories') {
    const items = itemSales(valid, menu);
    const grouped = new Map<string, { quantity: number; billed: number; cost: number }>();
    items.forEach(item => {
      const key = categoryLabel(item.category);
      const row = grouped.get(key) || { quantity: 0, billed: 0, cost: 0 };
      row.quantity += item.quantity; row.billed += item.billed; row.cost += item.cost; grouped.set(key, row);
    });
    return { columns: [id === 'items' ? 'Dish' : 'Category', 'Quantity', 'Gross item sales', 'Est. cost', 'Est. contribution'], moneyColumns: [2,3,4], rows: id === 'items' ? items.map(item => [item.name, item.quantity, item.billed, item.cost, item.grossProfit]) : [...grouped].map(([name, row]) => [name, row.quantity, amount(row.billed), amount(row.cost), amount(row.billed - row.cost)]), basis: 'Gross item prices before order discounts, VAT and tips. Estimated contribution uses current menu costs, excludes free refills and operating expenses, and is not net profit.' };
  }
  if (id === 'monthly') return { columns: ['Month', 'Orders', 'Total payable', 'Collected', 'Outstanding'], moneyColumns: [2,3,4], rows: monthlySales(valid, end).map(month => [month.key, month.orders, amount(month.billed), amount(month.collected), amount(month.billed - month.collected)]), basis: defaultBasis };
  if (id === 'daily' || id === 'vat') {
    const days = new Map<string, Order[]>();
    valid.forEach(order => { const day = tradingDay(order.createdAt); days.set(day, [...(days.get(day) || []), order]); });
    const rows = [...days].sort(([a],[b]) => a.localeCompare(b));
    if (id === 'vat') return { columns: ['Date', 'Orders', 'Taxable amount recorded', 'Output VAT recorded'], moneyColumns: [2,3], rows: rows.map(([day, entries]) => [day, entries.length, sum(entries.filter(order => order.tax > 0), order => order.taxableAmount), sum(entries, order => order.tax)]), basis: 'Output VAT from stored order tax amounts. Excludes input tax, purchase returns and filing adjustments. This is not VAT payable or an IRD filing.' };
    return { columns: ['Date', 'Orders', 'Net sales', 'Tax', 'Tips', 'Total payable', 'Collected'], moneyColumns: [2,3,4,5,6], rows: rows.map(([day, entries]) => [day, entries.length, sum(entries, order => Math.max(0, order.subtotal - order.discount)), sum(entries, order => order.tax), sum(entries, order => order.tip), sum(entries, order => order.total), sum(entries.filter(order => order.paymentStatus === 'paid'), order => order.total)]), basis: defaultBasis };
  }
  return { columns: ['Date', 'Reference', 'Customer', 'Net sales', 'VAT', 'Tips', 'Total payable', 'Payment'], moneyColumns: [3,4,5,6], rows: valid.map(order => [tradingDay(order.createdAt), invoice(order), order.customerName || 'Guest', amount(Math.max(0, order.subtotal - order.discount)), order.tax, order.tip, order.total, order.paymentStatus]), basis: defaultBasis };
}
