import { useState } from 'react';
import { ArrowRight, FileText, Search } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { ActionButton, EmptyPanel, FilterTabs, WorkspaceHeading } from '../ui/Workspace';
import { reportCatalog, findReport } from './reportCatalog';
import { ReportDetailView } from './ReportDetailView';

export function FinanceReportsView({ initialReport }: { initialReport?: string }) {
  const { activeTab, setActiveTab } = useRestaurant();
  const [selected, setSelected] = useState<string | null>(activeTab === 'finance-trialbalance' ? 'trial-balance' : initialReport || null);
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('All reports');
  if (selected) return <ReportDetailView reportName={selected} onBack={() => { setSelected(null); if (activeTab === 'finance-trialbalance') setActiveTab('finance-reports'); }} />;
  const reports = reportCatalog.filter(report => (group === 'All reports' || report.group === group) && (report.name + ' ' + report.description).toLowerCase().includes(query.trim().toLowerCase()));
  return <div className="work-page report-library">
    <WorkspaceHeading eyebrow="Finance / Reports" title="Know your numbers" description="Start with the question. Open a report, choose a period, and export what you need." actions={<ActionButton onClick={() => setActiveTab('finance-dashboard')}>Money overview<ArrowRight size={16} /></ActionButton>} />
    <section className="report-shortcuts" aria-label="Frequently used reports">{[
      { id: 'daily', eyebrow: 'How did service go?', name: 'Review daily sales' },
      { id: 'open-bills', eyebrow: 'What needs collecting?', name: 'Check open bills' },
      { id: 'items', eyebrow: 'What is selling?', name: 'Compare dishes' }
    ].map((item, index) => <button key={item.id} type="button" onClick={() => setSelected(item.id)}><span className="report-shortcut-number">0{index + 1}</span><span><small>{item.eyebrow}</small><strong>{item.name}</strong></span><ArrowRight size={18} /></button>)}</section>
    <div className="report-library-tools"><FilterTabs label="Report categories" value={group} onChange={setGroup} options={['All reports','Sales & collections','Menu & stock','Accounting'].map(value => ({value,label:value}))} /><label className="work-search"><Search size={17} aria-hidden="true" /><span className="sr-only">Search reports</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Find a report" /></label></div>
    <p className="report-result-count" role="status">{reports.length} reports</p>
    <div className="report-library-list">{reports.map(report => <button type="button" className="report-library-row" key={report.id} onClick={() => setSelected(findReport(report.id)!.id)}>
      <FileText size={21} aria-hidden="true" /><span className="report-library-copy"><strong>{report.name}</strong><small>{report.description}</small></span><span className="report-library-group">{report.group}</span><span className={'work-tag ' + (report.prerequisite ? 'is-muted' : '')}>{report.prerequisite ? 'Needs ledger' : 'Available'}</span><ArrowRight size={17} aria-hidden="true" />
    </button>)}</div>
    {!reports.length && <EmptyPanel title="No matching reports" action={<ActionButton onClick={() => { setQuery(''); setGroup('All reports'); }}>Clear filters</ActionButton>}>Try sales, stock, VAT or a statement name.</EmptyPanel>}
  </div>;
}
