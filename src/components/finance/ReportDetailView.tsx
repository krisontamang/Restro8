import { useMemo, useRef, useState } from 'react';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { formatNPR } from '../../utils/nepalDate';
import { csvEscape, reportableOrders, salesSummary } from '../../utils/reporting';
import { buildReport, amount, sum } from '../../utils/reportData';
import { printDocument } from '../../lib/printDocument';
import { ActionButton, EmptyPanel, MetricTile, WorkspaceHeading } from '../ui/Workspace';
import { findReport } from './reportCatalog';

export function ReportDetailView({ reportName, onBack }: { reportName: string; onBack: () => void }) {
  const { orders, menuItems } = useRestaurant();
  const report = findReport(reportName);
  const [period, setPeriod] = useState('year');
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState('');
  const [printing, setPrinting] = useState(false);
  const paper = useRef<HTMLDivElement>(null);
  const [now] = useState(() => new Date());
  const {start, end} = useMemo(() => {
    const day = new Intl.DateTimeFormat('en-CA', { timeZone:'Asia/Kathmandu', year:'numeric', month:'2-digit', day:'2-digit' }).format(now);
    const end = new Date(day + 'T23:59:59.999+05:45');
    const [year, month] = day.split('-').map(Number);
    const start = period === 'year' ? new Date(String(month === 12 ? year : year - 1) + '-' + String(month === 12 ? 1 : month + 1).padStart(2, '0') + '-01T00:00:00+05:45') : new Date(new Date(day + 'T00:00:00+05:45').getTime() - (Number(period) - 1) * 86400000);
    return {start,end};
  }, [now, period]);
  const scoped = useMemo(() => reportableOrders(orders, start, end), [orders,start,end]);
  const summary = salesSummary(scoped);
  const table = useMemo(() => report && !report.prerequisite ? buildReport(report.id, scoped, menuItems, end) : null, [report,scoped,menuItems,end]);
  const rows = table?.rows.filter(row => row.join(' ').toLowerCase().includes(query.trim().toLowerCase())) || [];
  const dateLabel = (date: Date) => date.toLocaleDateString('en-GB', {timeZone:'Asia/Kathmandu', day:'numeric',month:'short',year:'numeric'});
  function exportCsv() {
    if (!table || !report) return;
    const csv = [table.columns, ...rows].map(row => row.map(csvEscape).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF' + csv], {type:'text/csv;charset=utf-8'}));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = report.id + '-' + period + '.csv'; anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000); setNotice('CSV exported with the visible rows.');
  }
  async function print() {
    if (!paper.current) return;
    setPrinting(true);
    try { await printDocument(paper.current, report?.name || 'Report', 'a4'); }
    catch { setNotice('Print preview could not open. Please try again.'); }
    finally { setPrinting(false); }
  }
  return <div className="work-page report-detail">
    <div className="report-back"><ActionButton onClick={onBack}><ArrowLeft size={16} />Reports</ActionButton>{table && <div className="work-actions"><ActionButton onClick={exportCsv}><Download size={16} />Export CSV</ActionButton><ActionButton disabled={printing} onClick={print}><Printer size={16} />{printing ? 'Opening…' : 'Print'}</ActionButton></div>}</div>
    <div ref={paper}>
      <WorkspaceHeading eyebrow="Report" title={report?.name || reportName} description={report?.description || 'This report needs a connected data source.'} />
      {report?.prerequisite || !table ? <EmptyPanel title="Connect the ledger to calculate this report">{report?.prerequisite || 'This report is not connected to a validated data source yet.'}</EmptyPanel> : <>
        <p className="report-basis">{table.basis}</p>
        <div className="report-period-row"><span>{report?.id === 'stock' ? 'Current stock snapshot' : dateLabel(start) + ' – ' + dateLabel(end)}</span><label className="work-select no-print">Period<select disabled={report?.id === 'stock'} value={period} onChange={event => setPeriod(event.target.value)}><option value="year">12 calendar months</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option></select></label></div>
        {report?.id !== 'stock' && <section className="work-metrics" aria-label="Period totals"><MetricTile label="Net sales" value={formatNPR(sum(scoped, order => Math.max(0, order.subtotal - order.discount)))} detail="Excludes VAT and tips" /><MetricTile label="Collected" value={formatNPR(summary.collected)} detail="Paid orders in this period" /><MetricTile label="Outstanding" value={formatNPR(summary.outstanding)} detail="Unpaid orders in this period" /></section>}
        <label className="work-search no-print report-row-search"><span className="sr-only">Filter report rows</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Filter these rows" /></label>
        <div className="work-table-wrap" tabIndex={0} role="region" aria-label={report?.name + ' data'}><table className="work-table"><caption>{rows.length} matching rows</caption><thead><tr>{table.columns.map(column => <th scope="col" key={column}>{column}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex} className={table.moneyColumns.includes(cellIndex) ? 'is-number' : ''}>{table.moneyColumns.includes(cellIndex) ? formatNPR(Number(cell)) : cell}</td>)}</tr>)}</tbody>
        {rows.length > 0 && <tfoot><tr>{table.columns.map((_, index) => <td key={index}>{index === 0 ? 'Visible total' : table.moneyColumns.includes(index) && !(report?.id === 'stock' && index === 4) ? formatNPR(amount(rows.reduce((total, row) => total + Number(row[index]), 0))) : '—'}</td>)}</tr></tfoot>}</table></div>
        {!rows.length && <EmptyPanel title="No records in this view">Choose another period or clear the search.</EmptyPanel>}
        <p className="report-source">Source: browser workspace · Cancelled orders excluded · {dateLabel(now)}</p>
      </>}
    </div>
    {notice && <p role="status" className="work-notice">{notice}</p>}
  </div>;
}
