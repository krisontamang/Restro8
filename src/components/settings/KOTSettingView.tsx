import { useRef, useState } from 'react';
import { ArrowRight, Printer, Save } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { ActionButton, WorkspaceHeading } from '../ui/Workspace';
import { KitchenTicket } from '../kds/KitchenTicket';
import { kitchenTicketData, type KitchenTicketData } from '../../utils/kitchenTicket';
import { readKitchenPreferences, saveKitchenPreferences, type KitchenPreferences } from '../../lib/kitchenPreferences';
import { printDocument } from '../../lib/printDocument';

export function KOTSettingView() {
  const { orders, tables, settings, setActiveTab } = useRestaurant();
  const [preferences, setPreferences] = useState(readKitchenPreferences);
  const [notice, setNotice] = useState('');
  const [printing, setPrinting] = useState(false);
  const paper = useRef<HTMLDivElement>(null);
  const latest = orders.filter(order => order.status !== 'cancelled').sort((a,b) => Date.parse(b.createdAt)-Date.parse(a.createdAt))[0];
  const example: KitchenTicketData = { kotNumber: 'SAMPLE', tableLabel: 'Sample table', serverName: 'Sample server', orderType: 'Dine in', timeStr: 'Sample preview', notes: 'Example only — not a live order.', items: [{id:'sample', name:'Steamed momo', nepaliName:'स्टिम मोमो', quantity:2, station:'momo', ticketType:'KOT'}] };
  const fields: { key: keyof KitchenPreferences; label: string; detail: string }[] = [
    { key:'nepaliNames', label:'Nepali dish names', detail:'Show the second name when it is available.' },
    { key:'stations', label:'Preparation station', detail:'Help the team route each dish or drink.' },
    { key:'server', label:'Server name', detail:'Show who is responsible for the table.' },
    { key:'compact', label:'Compact spacing', detail:'Use less paper without hiding order details.' },
  ];
  async function print() {
    if (!paper.current) return; setPrinting(true); setNotice('');
    try { await printDocument(paper.current,'Kitchen ticket preview'); }
    catch { setNotice('Could not open print preview. Try again.'); }
    finally { setPrinting(false); }
  }
  return <div className="work-page">
    <WorkspaceHeading eyebrow="Settings / Kitchen" title="A ticket the team can read" description="Quantity first. Instructions always visible. Black ink only, with no banners or promotional footer." actions={<ActionButton onClick={() => setActiveTab('kds')}>Kitchen<ArrowRight size={16}/></ActionButton>} />
    <div className="kot-settings-layout"><section className="kot-settings-controls" aria-label="Ticket preferences">
      <h2>Keep what helps</h2>
      {fields.map(field => <label className="kot-preference" key={field.key}><span><strong>{field.label}</strong><small>{field.detail}</small></span><input type="checkbox" checked={preferences[field.key]} onChange={event => { setPreferences(current => ({...current,[field.key]:event.target.checked})); setNotice('Unsaved changes'); }} /></label>)}
      <p className="work-description">Ticket number, table, time, quantities and notes are never hidden. Choose 80 mm receipt paper and disable browser headers and footers in the print dialog. Printer hardware settings stay under your control.</p>
      <div className="work-actions"><ActionButton primary onClick={() => setNotice(saveKitchenPreferences(preferences) ? 'Ticket preferences saved in this browser.' : 'Could not save. Keep this page open and check browser storage.')}><Save size={16}/>Save preferences</ActionButton><ActionButton disabled={printing} onClick={print}><Printer size={16}/>{printing ? 'Opening…' : 'Test print'}</ActionButton></div>
      {notice && <p role="status" className="work-notice">{notice}</p>}
      <p className="work-description">Saving applies these options to KOT preview and printing. Ticket numbers cannot be reset here; existing order references are preserved.</p>
    </section><section aria-label="Ticket preview"><p className="work-eyebrow">{latest ? 'Preview · latest order' : 'Sample preview · not a live order'}</p><div className="kot-settings-preview" ref={paper}><KitchenTicket data={latest ? kitchenTicketData(latest,tables) : example} restaurant={settings.name} preferences={preferences}/></div></section></div>
  </div>;
}
