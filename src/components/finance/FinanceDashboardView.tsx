import { useState } from 'react';
import { ArrowRight, BookOpen, Receipt, Wallet } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { formatNPR } from '../../utils/nepalDate';
import { reportableOrders, salesSummary } from '../../utils/reporting';
import { sum, paymentBreakdown, tradingDay } from '../../utils/reportData';
import { ActionButton, EmptyPanel, MetricTile, WorkspaceHeading } from '../ui/Workspace';
import { ReportDetailView } from './ReportDetailView';

export function FinanceDashboardView() {
  const { orders, setActiveTab } = useRestaurant();
  const [report, setReport] = useState<string | null>(null);
  const [days, setDays] = useState('30');
  const end = new Date(tradingDay(new Date().toISOString()) + 'T23:59:59.999+05:45');
  const start = new Date(end.getTime() - Number(days) * 86400000 + 1);
  const scoped = reportableOrders(orders,start,end);
  const summary = salesSummary(scoped);
  const open = orders.filter(order => order.status !== 'cancelled' && order.paymentStatus !== 'paid');
  const methods = paymentBreakdown(scoped);
  if (report) return <ReportDetailView reportName={report} onBack={() => setReport(null)} />;
  return <div className="work-page money-workspace">
    <WorkspaceHeading eyebrow="Finance" title="Money, made clear" description="Sales and collections in one place. Keep bookkeeping within reach." actions={<label className="work-select">Period<select value={days} onChange={event => setDays(event.target.value)}><option value="1">Today</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="365">Last 365 days</option></select></label>} />
    <section className="work-metrics" aria-label="Money summary"><MetricTile label="Net sales" value={formatNPR(sum(scoped,order => Math.max(0,order.subtotal-order.discount)))} detail="Before VAT and tips" /><MetricTile label="Collected" value={formatNPR(summary.collected)} detail="Paid totals for orders in this period" /><MetricTile label="Outstanding" value={formatNPR(summary.outstanding)} detail="Unpaid totals for orders in this period" /></section>
    <div className="money-columns">
      <section className="money-panel"><div className="money-panel-heading"><Wallet size={19} /><h2>How guests paid</h2></div>{methods.length ? <div className="money-methods">{methods.map(method => <div key={method.method}><span>{method.method}</span><strong>{formatNPR(method.total)}</strong></div>)}</div> : <EmptyPanel title="No collections yet">Settled orders appear here.</EmptyPanel>}<ActionButton onClick={() => setReport('payments')}>Payment breakdown<ArrowRight size={16} /></ActionButton></section>
      <section className="money-panel"><div className="money-panel-heading"><Receipt size={19} /><h2>Needs attention</h2></div><div className="money-attention"><strong>{open.length}</strong><div><h3>Open bills, across all dates</h3><p>{formatNPR(sum(open,order => order.total))} still to collect.</p></div></div><p>Review open tables and takeaway orders before closing the shift.</p><ActionButton primary onClick={() => setActiveTab('orders')}>Review orders<ArrowRight size={16} /></ActionButton></section>
    </div>
    <section className="money-bookkeeping"><div><p className="work-eyebrow">Next steps</p><h2>Keep the books in order</h2><p>Order reports use saved sales. Full financial statements need a connected accounting ledger.</p></div><div className="money-links">{[
      {label:'Sales register',description:'Inspect each bill',action:() => setReport('sales')},
      {label:'Reports',description:'Sales, stock and accounting',action:() => setActiveTab('finance-reports')},
      {label:'Expenses',description:'Review operating costs',action:() => setActiveTab('finance-expenses')},
      {label:'Journal entries',description:'Review bookkeeping entries',action:() => setActiveTab('finance-journal')},
    ].map(item => <button type="button" key={item.label} onClick={item.action}><BookOpen size={18} /><span><strong>{item.label}</strong><small>{item.description}</small></span><ArrowRight size={16} /></button>)}</div></section>
    <p className="report-source">Amounts use order creation dates in Kathmandu time. Current costs are estimates; sales are not net profit.</p>
  </div>;
}
