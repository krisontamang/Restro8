import { useEffect, useState } from 'react';
import { ArrowRight, Check, Clock, Printer, Volume2, VolumeX } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import type { KitchenStation, Order } from '../../types/restaurant';
import { ActionButton, EmptyPanel, FilterTabs, MetricTile, WorkspaceHeading } from '../ui/Workspace';
import { KOTModal } from '../modals/KOTModal';
import { elapsedLabel, kitchenQueue, kitchenStations, matchesKitchenLine } from '../../utils/kitchen';

export function KDSView() {
  const { orders, tables, updateOrderStatus, toggleOrderItemCompleted, soundEnabled, toggleSound } = useRestaurant();
  const [station, setStation] = useState<KitchenStation | 'all'>('all');
  const [type, setType] = useState<'all' | 'KOT' | 'BOT'>('all');
  const [status, setStatus] = useState('all');
  const [now, setNow] = useState(() => Date.now());
  const [ticket, setTicket] = useState<Order | null>(null);
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 15000); return () => clearInterval(timer); }, []);
  const queue = kitchenQueue(orders, station, type);
  const visible = queue.filter(order => status === 'all' || order.status === status);
  const waiting = queue.filter(order => order.status !== 'ready');
  function finishStation(order: Order) {
    const lines = order.items.filter(item => matchesKitchenLine(item, station, type));
    lines.filter(item => !item.isCompleted).forEach(item => toggleOrderItemCompleted(order.id, item.id));
    const allReady = order.items.every(item => item.isCompleted || lines.some(line => line.id === item.id));
    updateOrderStatus(order.id, allReady ? 'ready' : 'preparing');
  }
  return <div className="work-page kitchen-workspace">
    <WorkspaceHeading eyebrow="Service / Kitchen" title="The prep queue" description="Oldest tickets first. Check each item, then send it to the pass." actions={<ActionButton onClick={toggleSound} aria-pressed={soundEnabled}>{soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}{soundEnabled ? 'Sound on' : 'Sound off'}</ActionButton>} />
    <section className="work-metrics kitchen-metrics" aria-label="Kitchen workload">
      <MetricTile label="To prepare" value={waiting.length} detail="Tickets in the kitchen" />
      <MetricTile label="At the pass" value={queue.filter(order => order.status === 'ready').length} detail="Ready for service" />
      <MetricTile label="Waiting over 18 min" value={waiting.filter(order => elapsedLabel(order.createdAt, now).overdue).length} detail="Check these tickets first" />
    </section>
    <div className="kitchen-toolbar">
      <FilterTabs label="Kitchen ticket status" value={status} onChange={setStatus} options={[{ value: 'all', label: 'All tickets' }, { value: 'new', label: 'Waiting' }, { value: 'preparing', label: 'Preparing' }, { value: 'ready', label: 'Ready' }]} />
      <label className="work-select">Ticket type<select value={type} onChange={event => setType(event.target.value as typeof type)}><option value="all">KOT & BOT</option><option value="KOT">KOT · Food</option><option value="BOT">BOT · Drinks</option></select></label>
    </div>
    <div className="kitchen-station-tabs"><FilterTabs label="Kitchen station" value={station} onChange={setStation} options={kitchenStations.map(option => ({ ...option, count: kitchenQueue(orders, option.value, type).length }))} /></div>
    <label className="work-select kitchen-station-select">Station<select value={station} onChange={event => setStation(event.target.value as typeof station)}>{kitchenStations.map(option => <option key={option.value} value={option.value}>{option.label} ({kitchenQueue(orders, option.value, type).length})</option>)}</select></label>
    {visible.length ? <section className="kitchen-grid" aria-label="Kitchen tickets">{visible.map(order => {
      const elapsed = elapsedLabel(order.createdAt, now);
      const lines = order.items.filter(item => matchesKitchenLine(item, station, type));
      const readyHere = lines.every(item => item.isCompleted);
      const table = tables.find(entry => entry.id === order.tableId)?.label || (order.tableNumber ? 'Table ' + order.tableNumber : order.orderType);
      return <article key={order.id} className={'prep-ticket ' + (order.status === 'ready' ? 'is-ready' : '')}>
        <header className="prep-ticket-heading"><div><p className="work-eyebrow">#{order.orderNumber} · {order.status === 'new' ? 'Waiting' : order.status}</p><h2>{table}</h2></div><button className="work-icon-button" type="button" onClick={() => setTicket(order)} aria-label={'Preview KOT ' + order.orderNumber}><Printer size={17} /></button></header>
        <div className="prep-ticket-meta"><span>{order.serverName || 'Unassigned'}</span><span className={elapsed.overdue && order.status !== 'ready' ? 'prep-overdue' : ''}><Clock size={13} aria-hidden="true" />{elapsed.text}{elapsed.overdue && order.status !== 'ready' ? ' · overdue' : ''}</span></div>
        {order.notes?.trim() && <p className="prep-note"><strong>Note</strong> {order.notes}</p>}
        <div className="prep-lines">{lines.map(item => <label key={item.id} className={'prep-line ' + (item.isCompleted ? 'is-done' : '')}>
          <input type="checkbox" checked={Boolean(item.isCompleted)} disabled={order.status === 'ready'} onChange={() => toggleOrderItemCompleted(order.id, item.id)} aria-label={'Ready: ' + item.name + ', ticket ' + order.orderNumber} />
          <span className="prep-quantity">{item.quantity}×</span><span className="prep-item-text"><strong>{item.name}</strong>{item.nepaliName && <small lang="ne">{item.nepaliName}</small>}
            {item.selectedOptions && Object.entries(item.selectedOptions).map(([name, value]) => <small key={name}>{name}: {value}</small>)}{item.notes && <small className="prep-item-note">{item.notes}</small>}<small className="prep-station">{item.station} · {item.ticketType}</small>
          </span>
        </label>)}</div>
        <footer className="prep-ticket-actions"><span>{lines.filter(item => item.isCompleted).length}/{lines.length} ready</span>
          {order.status === 'new' ? <ActionButton primary onClick={() => updateOrderStatus(order.id, 'preparing')}>Start prep<ArrowRight size={15} /></ActionButton>
            : order.status === 'ready' ? <ActionButton primary onClick={() => updateOrderStatus(order.id, 'served')}>Mark served<Check size={15} /></ActionButton>
              : <ActionButton primary disabled={readyHere && order.items.some(item => !item.isCompleted && !lines.some(line => line.id === item.id))} onClick={() => finishStation(order)}>{readyHere && !order.items.every(item => item.isCompleted) ? 'Other stations pending' : station === 'all' && type === 'all' ? 'Ready for service' : 'Station ready'}<Check size={15} /></ActionButton>}
        </footer>
      </article>;
    })}</section> : <EmptyPanel title={kitchenQueue(orders, 'all', 'all').length ? 'No tickets in this view' : 'A clear pass'} action={<ActionButton onClick={() => { setStation('all'); setType('all'); setStatus('all'); }}>Show all tickets</ActionButton>}>New orders appear here when sent to the kitchen.</EmptyPanel>}
    <KOTModal isOpen={Boolean(ticket)} order={ticket ? orders.find(order => order.id === ticket.id) : null} onClose={() => setTicket(null)} />
  </div>;
}
