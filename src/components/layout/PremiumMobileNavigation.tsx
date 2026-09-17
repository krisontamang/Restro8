import { LayoutDashboard, ClipboardList, Plus, LayoutGrid, Menu } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

export function PremiumMobileNavigation({ onOpenMobileSidebar }: { onOpenMobileSidebar: () => void }) {
  const { activeTab, setActiveTab, orders } = useRestaurant();
  const activeCount = orders.filter(o => ['new', 'preparing', 'ready'].includes(o.status)).length;
  const items = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard, onClick: () => setActiveTab('dashboard'), active: activeTab === 'dashboard' },
    { id: 'orders', label: 'Orders', icon: ClipboardList, onClick: () => setActiveTab('orders'), active: activeTab === 'orders', count: activeCount },
    { id: 'pos', label: 'New order', icon: Plus, onClick: () => setActiveTab('pos'), active: activeTab === 'pos' },
    { id: 'floor', label: 'Tables', icon: LayoutGrid, onClick: () => setActiveTab('floor'), active: ['floor', 'tables-list', 'spaces-list'].includes(activeTab) },
    { id: 'more', label: 'More', icon: Menu, onClick: onOpenMobileSidebar, active: false },
  ];
  return <nav className="premium-mobile-nav" aria-label="Main navigation">{items.map(({ id, label, icon: Icon, onClick, active, count }) => <button key={id} onClick={onClick} aria-current={active ? 'page' : undefined} className={`${active ? 'active' : ''} ${id === 'pos' ? 'nav-create' : ''}`}><span className="nav-icon"><Icon size={21} aria-hidden="true" />{count ? <small>{count > 99 ? '99+' : count}</small> : null}</span><span>{label}</span></button>)}</nav>;
}
