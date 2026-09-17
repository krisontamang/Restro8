import type { SplitPaymentDetails } from '../types/restaurant';
export function splitTenderError(details: SplitPaymentDetails | undefined, total: number): string | null {
  if (!details?.tenders.length) return 'Add a payment amount for each selected method.';
  if (details.tenders.some(tender => !Number.isFinite(tender.amount) || tender.amount < 0)) return 'Payment amounts must be valid, positive numbers.';
  const change = details.changeReturned ?? 0;
  const cash = details.tenders.filter(tender => tender.method === 'cash').reduce((sum,tender) => sum + tender.amount,0);
  if (!Number.isFinite(change) || change < 0 || change > cash) return 'Returned change cannot exceed the cash received.';
  const received = details.tenders.reduce((sum,tender) => sum + Math.round(tender.amount * 100),0) - Math.round(change * 100);
  return received === Math.round(total * 100) ? null : 'Payment amounts, less cash change, must equal the bill total.';
}
export function splitShiftTotals(details: SplitPaymentDetails) {
  const cashReceived = details.tenders.filter(tender => tender.method === 'cash').reduce((sum,tender) => sum + Math.round(tender.amount * 100),0);
  const digital = details.tenders.filter(tender => tender.method !== 'cash').reduce((sum,tender) => sum + Math.round(tender.amount * 100),0);
  return { cash: (cashReceived - Math.round((details.changeReturned || 0) * 100)) / 100, digital: digital / 100 };
}
