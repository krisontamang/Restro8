import { Bell, ChevronDown, Menu, Moon, Search, Sun } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { BrandLogo } from '../brand/BrandLogo';
import type { UserRole } from '../../types/restaurant';

interface Props { onMenu: () => void; onSearch: () => void; onRestaurant: () => void }
export function WorkspaceHeader({ onMenu, onSearch, onRestaurant }: Props) {
  const { settings, darkMode, setDarkMode, setActiveTab, userRole, setUserRole } = useRestaurant();
  return <header className="workspace-header">
    <div className="workspace-header-left">
      <button className="icon-action mobile-menu-btn" onClick={onMenu} aria-label="Open navigation"><Menu size={21} /></button>
      <button className="mobile-brand" onClick={() => setActiveTab('dashboard')} aria-label="Restro8 home"><BrandLogo compact /></button>
      <button className="workspace-restaurant" onClick={onRestaurant} aria-label="Change active restaurant"><span className="restaurant-avatar">{settings.name.slice(0, 1)}</span><span><strong>{settings.name}</strong><small>Restaurant workspace</small></span><ChevronDown size={14} /></button>
    </div>
    <div className="workspace-header-right">
      <span className="local-status" title="Records are saved in this browser. Cloud sync is not configured."><i /> Local workspace</span>
      <button className="workspace-search" onClick={onSearch} aria-label="Search commands"><Search size={18} /><span>Search anything…</span><kbd>Ctrl K</kbd></button>
      <button className="icon-action" onClick={() => setDarkMode(!darkMode)} aria-label={darkMode ? 'Use light theme' : 'Use dark theme'}>{darkMode ? <Sun size={19} /> : <Moon size={19} />}</button>
      <button className="icon-action header-notifications" onClick={() => setActiveTab('notifications')} aria-label="Notifications"><Bell size={19} /></button>
      <label className="workspace-role"><span className="role-avatar">{userRole.slice(0, 1).toUpperCase()}</span><select aria-label="Workspace role" value={userRole} onChange={e => setUserRole(e.target.value as UserRole)}><option value="manager">Manager</option><option value="waiter">Waiter</option><option value="chef">Chef</option><option value="cashier">Cashier</option></select></label>
    </div>
  </header>;
}
