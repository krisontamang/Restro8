import { useEffect, useRef, useState } from 'react';
import { Bell, ChevronDown, ChevronsLeft, ChevronsRight, Moon, Search, Sun, Volume2, VolumeX, X } from 'lucide-react';
import { useRestaurant, type NavigationTab } from '../../context/RestaurantContext';
import { BrandLogo } from '../brand/BrandLogo';
import { serviceNavigation, workspaceGroups, type NavigationEntry } from './workspaceNavigation';
import { canAccessTab } from '../../lib/authorization';

interface SidebarProps { collapsed: boolean; onToggleCollapse: () => void; mobileOpen?: boolean; onMobileClose?: () => void }
export function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onMobileClose }: SidebarProps) {
  const { activeTab, setActiveTab, settings, orders, darkMode, setDarkMode, soundEnabled, toggleSound, userRole } = useRestaurant();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLElement>(null);
  const closeRef = useRef(onMobileClose);
  useEffect(() => { closeRef.current = onMobileClose; }, [onMobileClose]);
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const frame = requestAnimationFrame(() => ref.current?.querySelector<HTMLElement>('.workspace-nav-close')?.focus());
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); closeRef.current?.(); }
      if (event.key === 'Tab') {
        const nodes = [...ref.current!.querySelectorAll<HTMLElement>('button, input')].filter(node => node.getClientRects().length && !node.hasAttribute('disabled'));
        if (event.shiftKey && document.activeElement === nodes[0]) { event.preventDefault(); nodes.at(-1)?.focus(); }
        else if (!event.shiftKey && document.activeElement === nodes.at(-1)) { event.preventDefault(); nodes[0]?.focus(); }
      }
    };
    const sidebar = ref.current;
    sidebar?.addEventListener('keydown', key);
    return () => { cancelAnimationFrame(frame); document.body.style.overflow = oldOverflow; sidebar?.removeEventListener('keydown', key); previous?.focus(); };
  }, [mobileOpen]);
  function navigate(tab: NavigationTab) { setActiveTab(tab); onMobileClose?.(); }
  const activeOrders = orders.filter(order => ['new', 'preparing', 'ready'].includes(order.status)).length;
  const needle = query.trim().toLowerCase();
  function entry(item: NavigationEntry) {
    const Icon = item.icon;
    return <button type="button" key={item.tab} className="workspace-nav-link" aria-current={activeTab === item.tab ? 'page' : undefined} title={item.label} onClick={() => navigate(item.tab)}>
      {Icon && <Icon size={18} aria-hidden="true" />}<span>{item.label}</span>{item.tab === 'orders' && activeOrders > 0 && <small>{activeOrders}</small>}
    </button>;
  }
  return <aside ref={ref} className={['app-sidebar', 'workspace-nav', collapsed && !mobileOpen ? 'is-compact' : '', mobileOpen ? 'mobile-open' : ''].join(' ')} aria-label="Workspace navigation">
    <div className="workspace-nav-brand"><button type="button" onClick={() => navigate('dashboard')} aria-label="Restro8 overview"><BrandLogo /></button>
      <button type="button" className="workspace-nav-collapse" onClick={onToggleCollapse} aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}>{collapsed ? <ChevronsRight size={17} /> : <ChevronsLeft size={17} />}</button>
      <button type="button" className="workspace-nav-close" onClick={onMobileClose} aria-label="Close navigation"><X size={20} /></button>
    </div>
    <div className="workspace-nav-restaurant"><strong>{settings.name}</strong><span>Restaurant workspace</span></div>
    <label className="workspace-nav-search"><Search size={16} aria-hidden="true" /><span className="sr-only">Find a workspace page</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Find a page" /></label>
    <nav className="workspace-nav-scroll" aria-label="Restaurant pages">
      <p className="workspace-nav-label">Service</p>
      {serviceNavigation
        .filter(item => canAccessTab(userRole, item.tab))
        .filter(item => item.label.toLowerCase().includes(needle))
        .map(entry)}
      <p className="workspace-nav-label">Manage</p>
      {workspaceGroups.map(group => {
        const authorizedItems = group.items.filter(item => canAccessTab(userRole, item.tab));
        if (!authorizedItems.length) return null;
        const matched = authorizedItems.filter(item => !needle || (group.label + ' ' + item.label).toLowerCase().includes(needle));
        if (!matched.length) return null;
        const active = authorizedItems.some(item => item.tab === activeTab) || group.id === 'finance' && activeTab === 'finance-trialbalance';
        const open = Boolean(needle) || expanded === group.id || expanded === null && active;
        const Icon = group.icon;
        return <section key={group.id} className="workspace-nav-group">
          <button type="button" className="workspace-nav-group-toggle" aria-expanded={open} aria-controls={'nav-' + group.id} title={group.label} onClick={() => { if (collapsed) onToggleCollapse(); setExpanded(open ? '' : group.id); }}>
            <Icon size={18} aria-hidden="true" /><span>{group.label}</span><ChevronDown size={14} className={open ? 'is-open' : ''} aria-hidden="true" />
          </button>
          {open && <div id={'nav-' + group.id} className="workspace-nav-children">{matched.map(entry)}</div>}
        </section>;
      })}
      {needle && ![...serviceNavigation, ...workspaceGroups.flatMap(group => group.items)].some(item => item.label.toLowerCase().includes(needle)) && <p className="workspace-nav-empty">Try “Kitchen”, “Sales” or “Stock”.</p>}
    </nav>
    <footer className="workspace-nav-footer"><span>{userRole} workspace</span><div>
      <button type="button" onClick={() => setDarkMode(!darkMode)} aria-label={darkMode ? 'Use light theme' : 'Use dark theme'}>{darkMode ? <Sun size={17} /> : <Moon size={17} />}</button>
      <button type="button" onClick={toggleSound} aria-label={soundEnabled ? 'Mute kitchen sounds' : 'Enable kitchen sounds'} aria-pressed={soundEnabled}>{soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}</button>
      <button type="button" onClick={() => navigate('notifications')} aria-label="Notifications"><Bell size={17} /></button>
    </div></footer>
  </aside>;
}
