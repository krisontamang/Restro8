import React from 'react';
import { useRestaurant, NavigationTab } from '../context/RestaurantContext';
import { UserRole } from '../types/restaurant';
import { getNepaliDate } from '../utils/nepalDate';
import {
  LayoutGrid,
  ShoppingBag,
  Flame,
  UtensilsCrossed,
  CalendarCheck,
  BarChart3,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  RotateCcw,
  ShieldCheck,
  UserCheck,
  ChefHat,
  CreditCard,
  Building2,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    userRole,
    setUserRole,
    darkMode,
    setDarkMode,
    soundEnabled,
    toggleSound,
    tables,
    orders,
    menuItems,
    reservations,
    resetDemoData,
    settings,
  } = useRestaurant();

  const { formattedBS } = getNepaliDate();

  // Compute live badges
  const occupiedTablesCount = tables.filter((t) => t.status === 'occupied').length;
  const activeKdsTicketsCount = orders.filter(
    (o) => o.status === 'new' || o.status === 'preparing' || o.status === 'ready'
  ).length;
  const lowStockCount = menuItems.filter((i) => i.stockQuantity <= 5 || !i.inStock).length;
  const todayReservationsCount = reservations.filter((r) => r.status === 'confirmed').length;

  const navItems: { id: NavigationTab; label: string; icon: React.FC<{ size?: number; className?: string }>; badge?: number }[] = [
    { id: 'floor', label: 'Floor Plan', icon: LayoutGrid, badge: occupiedTablesCount },
    { id: 'pos', label: 'POS Terminal', icon: ShoppingBag },
    { id: 'kds', label: 'KOT / BOT Line', icon: Flame, badge: activeKdsTicketsCount },
    { id: 'inventory', label: 'Menu & Stock', icon: UtensilsCrossed, badge: lowStockCount > 0 ? lowStockCount : undefined },
    { id: 'reservations', label: 'Reservations', icon: CalendarCheck, badge: todayReservationsCount },
    { id: 'analytics', label: 'Daybook & Tax', icon: BarChart3 },
  ];

  const roleIcons: Record<UserRole, React.ReactNode> = {
    manager: <ShieldCheck size={16} />,
    waiter: <UserCheck size={16} />,
    chef: <ChefHat size={16} />,
    cashier: <CreditCard size={16} />,
  };

  return (
    <header
      style={{
        height: 'var(--header-height)',
        backgroundColor: 'var(--color-card)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 200ms ease',
      }}
    >
      {/* Brand & Nepal Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
            color: '#FFFFFF',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.35)',
            flexShrink: 0,
          }}
        >
          <UtensilsCrossed size={22} strokeWidth={2.4} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.35rem',
                fontWeight: 900,
                letterSpacing: '0.04em',
                color: 'var(--color-primary)',
              }}
            >
              RESTRO<span style={{ color: 'var(--color-accent)' }}>X</span>
            </span>
            <span
              style={{
                fontSize: '0.64rem',
                fontWeight: 900,
                letterSpacing: '0.06em',
                backgroundColor: 'rgba(220, 38, 38, 0.12)',
                color: 'var(--color-primary)',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              🇳🇵 NEPAL
            </span>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                color: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                padding: '2px 6px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              <Building2 size={11} /> PAN: {settings.panNumber}
            </span>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--color-muted-foreground)', marginTop: '-2px' }}>
            {settings.name} &bull; {formattedBS}
          </p>
        </div>
      </div>

      {/* Navigation Pills */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '0.86rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--color-on-primary)' : 'var(--color-foreground)',
                backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                border: '1px solid transparent',
                minHeight: '42px',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 180ms ease',
              }}
            >
              <Icon size={17} />
              <span>{item.label}</span>
              {typeof item.badge === 'number' && item.badge > 0 && (
                <span
                  style={{
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.35)' : 'var(--color-primary)',
                    color: '#FFFFFF',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    borderRadius: '10px',
                    padding: '1px 6px',
                    marginLeft: '2px',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Right Controls: Role, Audio, Theme, Reset */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Role Selector */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '8px',
            backgroundColor: 'var(--color-muted)',
            border: '1px solid var(--color-border)',
          }}
        >
          <span style={{ color: 'var(--color-primary)' }}>{roleIcons[userRole]}</span>
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as UserRole)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-foreground)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
              textTransform: 'capitalize',
            }}
          >
            <option value="manager">Manager / Owner</option>
            <option value="waiter">Captain / Waiter</option>
            <option value="chef">Kitchen Cook</option>
            <option value="cashier">Counter Cashier</option>
          </select>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={toggleSound}
          title={soundEnabled ? 'Kitchen & POS Audio: Active' : 'Kitchen & POS Audio: Muted'}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: soundEnabled ? 'rgba(16, 185, 129, 0.12)' : 'var(--color-muted)',
            color: soundEnabled ? '#10B981' : 'var(--color-muted-foreground)',
            border: '1px solid var(--color-border)',
            cursor: 'pointer',
          }}
        >
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? 'Switch to Warm Dining Light' : 'Switch to Obsidian Dark POS'}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--color-muted)',
            color: 'var(--color-foreground)',
            border: '1px solid var(--color-border)',
            cursor: 'pointer',
          }}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Reset Demo Data */}
        <button
          onClick={resetDemoData}
          title="Reset Nepal Starter Demo Data"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--color-muted)',
            color: 'var(--color-muted-foreground)',
            border: '1px solid var(--color-border)',
            cursor: 'pointer',
          }}
        >
          <RotateCcw size={17} />
        </button>
      </div>
    </header>
  );
};
