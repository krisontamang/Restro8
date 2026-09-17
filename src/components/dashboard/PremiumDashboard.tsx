import { lazy, Suspense, useMemo, useState } from 'react';
import { ArrowDownToLine, ArrowRight, ArrowUpRight, Banknote, CalendarDays, ChefHat, ChevronLeft, Clock3, LayoutGrid, Plus, ReceiptText, ShoppingBag, UtensilsCrossed } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { formatNPR } from '../../utils/nepalDate';
import { Button } from '../ui/Button';
import { ShiftCloseModal } from '../modals/ShiftCloseModal';
import { OrderStatusBadge } from '../ui/restaurant/OrderStatusBadge';
import { FoodImage } from '../menu/FoodImage';
import type { NavigationTab } from '../../context/RestaurantContext';

const DetailedOverview = lazy(() => import('./DashboardOverviewView').then(m => ({ default: m.DashboardOverviewView })));
const dateKey = (date: string | number | Date) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kathmandu', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(date));

export function PremiumDashboard() {
  const { orders, tables, menuItems, settings, setActiveTab, setSelectedTableId } = useRestaurant();
  const [period, setPeriod] = useState<'today' | 'week'>('today');
  const [details, setDetails] = useState(false);
  const [shiftOpen, setShiftOpen] = useState(false);
  const now = new Date();
  const today = dateKey(now);
  const firstDay = dateKey(Date.now() - 6 * 86400000);
  const summary = useMemo(() => {
    const relevant = orders.filter(o => o.status !== 'cancelled' && (period === 'today' ? dateKey(o.createdAt) === today : dateKey(o.createdAt) >= firstDay && dateKey(o.createdAt) <= today));
    const paid = relevant.filter(o => o.paymentStatus === 'paid');
    const revenue = paid.reduce((total, order) => total + order.total, 0);
    const hourly = Array.from({ length: 12 }, (_, i) => ({ hour: i * 2, total: 0 }));
    for (const order of paid) {
      const hour = Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kathmandu', hour: '2-digit', hourCycle: 'h23' }).format(new Date(order.createdAt)));
      hourly[Math.floor(hour / 2)].total += order.total;
    }
    const dishes = new Map<string, number>();
    for (const order of relevant) for (const item of order.items) dishes.set(item.menuItemId, (dishes.get(item.menuItemId) ?? 0) + item.quantity);
    return { relevant, paid, revenue, hourly, dishes, average: paid.length ? revenue / paid.length : 0 };
  }, [orders, period, today, firstDay]);
  const activeOrders = orders.filter(o => !['completed', 'cancelled'].includes(o.status));
  const occupied = tables.filter(t => t.status === 'occupied' || t.status === 'payment_pending');
  const available = tables.filter(t => t.status === 'available');
  const ready = activeOrders.filter(o => o.status === 'ready').length;
  const popular = [...menuItems].sort((a, b) => (summary.dishes.get(b.id) ?? 0) - (summary.dishes.get(a.id) ?? 0)).slice(0, 3);
  const maxHour = Math.max(...summary.hourly.map(h => h.total), 1);
  const go = (tab: NavigationTab) => setActiveTab(tab);

  const exportSummary = () => {
    const csv = ['Order,Created,Type,Status,Payment,Total NPR', ...summary.relevant.map(o => [o.orderNumber, o.createdAt, o.orderType, o.status, o.paymentStatus, o.total].join(','))].join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a'); link.href = url; link.download = `restro8-sales-${today}.csv`; link.click(); URL.revokeObjectURL(url);
  };

  if (details) return <><div className="overview-back"><Button variant="ghost" onClick={() => setDetails(false)} leftIcon={<ChevronLeft size={16} />}>Back to overview</Button></div><Suspense fallback={<p className="overview-back">Loading reports…</p>}><DetailedOverview /></Suspense></>;

  return <div className="premium-dashboard">
    <header className="overview-heading">
      <div><p className="eyebrow">YOUR RESTAURANT, AT A GLANCE</p><h1>A little clarity.<br className="mobile-only" /> A better service.</h1><p className="overview-subtitle">Here’s what’s happening at {settings.name} today.</p></div>
      <div className="overview-heading-actions"><button className="quiet-button" onClick={exportSummary}><ArrowDownToLine size={16} /> Export report</button><button className="primary-button" onClick={() => go('pos')}><Plus size={18} /> New order</button></div>
    </header>

    <div className="overview-date-row"><span><CalendarDays size={15} /> {now.toLocaleDateString('en-GB', { timeZone: 'Asia/Kathmandu', weekday: 'short', day: 'numeric', month: 'long' })}</span><div className="period-switch" aria-label="Report period"><button aria-pressed={period === 'today'} onClick={() => setPeriod('today')}>Today</button><button aria-pressed={period === 'week'} onClick={() => setPeriod('week')}>7 days</button></div></div>

    <section className="overview-stats" aria-label="Restaurant metrics">
      <article className="revenue-stat"><div className="stat-top"><span>Collected revenue</span><Banknote size={20} /></div><strong>{formatNPR(summary.revenue)}</strong><div className="revenue-caption"><span className="light-dot" />{summary.paid.length} paid orders · {period === 'today' ? 'today' : 'last 7 days'}</div><svg className="revenue-watermark" viewBox="0 0 120 70" aria-hidden="true"><path d="M0 55C20 55 15 12 40 12s30 50 48 40 12-40 32-40" /></svg></article>
      <article className="overview-stat"><div className="stat-top"><span>Active orders</span><ReceiptText size={18} /></div><strong>{activeOrders.length.toString().padStart(2, '0')}</strong><span className="stat-note">{ready > 0 ? `${ready} ready to serve` : 'Kitchen & floor in progress'}</span></article>
      <article className="overview-stat"><div className="stat-top"><span>Tables occupied</span><UtensilsCrossed size={18} /></div><strong>{occupied.length.toString().padStart(2, '0')}<small> / {tables.length}</small></strong><span className="stat-note">{available.length} tables available</span></article>
      <article className="overview-stat desktop-only"><div className="stat-top"><span>Average paid bill</span><ShoppingBag size={18} /></div><strong>{formatNPR(summary.average)}</strong><span className="stat-note">Per settled order</span></article>
    </section>

    <section className="service-shortcuts mobile-only" aria-label="Quick actions">
      {([{ label: 'New order', icon: Plus, tab: 'pos' }, { label: 'Kitchen', icon: ChefHat, tab: 'kds' }, { label: 'Tables', icon: LayoutGrid, tab: 'floor' }, { label: 'Reservations', icon: CalendarDays, tab: 'reservations' }] as const).map(({ label, icon: Icon, tab }) => <button key={tab} onClick={() => go(tab)}><span><Icon size={21} /></span>{label}</button>)}
    </section>

    <div className="overview-main-grid">
      <section className="overview-panel revenue-panel">
        <div className="panel-heading"><div><p className="eyebrow">THE BIG PICTURE</p><h2>Revenue overview</h2></div><span className="chart-legend"><i /> Collected sales</span></div>
        <div className="chart-summary"><strong>{formatNPR(summary.revenue)}</strong><span>{period === 'today' ? 'Today’s' : '7-day'} collected revenue</span></div>
        <div className="sales-chart" role="img" aria-label={`Collected revenue ${formatNPR(summary.revenue)}, grouped in two-hour intervals, Kathmandu time.`}>
          <div className="chart-gridlines"><span>{formatNPR(maxHour === 1 ? 0 : maxHour)}</span><span>{formatNPR(maxHour === 1 ? 0 : maxHour / 2)}</span><span>Rs. 0</span></div>
          <div className="chart-bars">{summary.hourly.map(({ hour, total }) => <div key={hour} className="chart-bar-column"><div className={`chart-bar ${total ? 'has-sales' : ''}`} style={{ height: `${Math.max(2, total / maxHour * 100)}%` }} title={`${String(hour).padStart(2, '0')}:00–${String(hour + 2).padStart(2, '0')}:00 · ${formatNPR(total)}`} /><span>{hour % 4 === 0 ? `${String(hour).padStart(2, '0')}:00` : ''}</span></div>)}</div>
          {summary.paid.length === 0 && <p className="chart-empty">Settled orders will appear here.</p>}
        </div>
        <div className="revenue-footer"><span>Based on paid orders · NPR</span><button className="text-button" onClick={() => go('finance-dashboard')}>View finances <ArrowUpRight size={16} /></button></div>
      </section>

      <section className="overview-panel floor-preview">
        <div className="panel-heading"><div><p className="eyebrow">ROOM FOR MORE</p><h2>Your floor, live</h2></div><button className="icon-action" aria-label="Open floor plan" onClick={() => go('floor')}><ArrowUpRight size={19} /></button></div>
        <div className="floor-legend"><span><i className="available-dot" /> Available {available.length}</span><span><i className="occupied-dot" /> Occupied {occupied.length}</span></div>
        <div className="mini-floor">{tables.slice(0, 12).map(table => <button key={table.id} className={`mini-table ${table.status}`} aria-label={`Table ${table.number}, ${table.status.replace('_', ' ')}, ${table.seats} seats`} onClick={() => { setSelectedTableId(table.id); go('floor'); }}><span>T{String(table.number).padStart(2, '0')}</span><small>{table.seats} seats</small></button>)}</div>
        <button className="text-button floor-link" onClick={() => go('floor')}>Manage floor plan <ArrowRight size={15} /></button>
      </section>

      <section className="overview-panel recent-orders-panel">
        <div className="panel-heading"><div><p className="eyebrow">KEEP SERVICE MOVING</p><h2>Orders in progress <span className="count-chip">{activeOrders.length}</span></h2></div><button className="text-button" onClick={() => go('orders')}>View all <ArrowRight size={15} /></button></div>
        <div className="overview-order-list">{activeOrders.slice(0, 4).map(order => <button className="overview-order" key={order.id} onClick={() => go('orders')}><span className="order-glyph">{order.orderType === 'dine-in' ? <UtensilsCrossed size={20} /> : <ShoppingBag size={20} />}</span><span className="order-title"><strong>#{order.orderNumber} <span>{order.tableNumber ? `· Table ${order.tableNumber}` : order.orderType}</span></strong><small>{order.items.reduce((n, item) => n + item.quantity, 0)} items · {order.serverName}</small></span><span className="order-amount"><strong>{formatNPR(order.total)}</strong><OrderStatusBadge status={order.status} /></span></button>)}{activeOrders.length === 0 && <div className="overview-empty"><ChefHat size={28} /><p>All caught up. Ready for the next order.</p><button className="text-button" onClick={() => go('pos')}>Create an order <Plus size={16} /></button></div>}</div>
      </section>

      <section className="overview-panel popular-panel"><div className="panel-heading"><div><p className="eyebrow">MADE WITH CARE</p><h2>{summary.dishes.size ? 'Guest favorites' : 'From your menu'}</h2></div><button className="icon-action" onClick={() => go('dishes')} aria-label="Open menu catalog"><ArrowUpRight size={19} /></button></div><div className="favorite-dishes">{popular.map((item, i) => <button key={item.id} className="favorite-dish" onClick={() => go('pos')}><span className="dish-rank">0{i + 1}</span><FoodImage item={item} /><span><strong>{item.name.replace(/\s*\([^)]*\)/g, '')}</strong><small>{summary.dishes.get(item.id) ? `${summary.dishes.get(item.id)} ordered` : 'On the menu'} · {formatNPR(item.price)}</small></span><ArrowUpRight size={15} /></button>)}</div></section>
    </div>
    <footer className="overview-footer"><span><Clock3 size={14} /> Take a breath. You’re in control.</span><div><button className="text-button" onClick={() => setShiftOpen(true)}>Close shift</button><button className="text-button" onClick={() => setDetails(true)}>Detailed reports <ArrowRight size={14} /></button></div></footer>
    {shiftOpen && <ShiftCloseModal onClose={() => setShiftOpen(false)} />}
  </div>;
}
