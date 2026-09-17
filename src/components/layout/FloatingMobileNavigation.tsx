import React from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  ShoppingBag,
  LayoutGrid,
  Menu,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

interface FloatingMobileNavigationProps {
  onOpenMobileSidebar: () => void;
}

export const FloatingMobileNavigation: React.FC<FloatingMobileNavigationProps> = ({
  onOpenMobileSidebar,
}) => {
  const { activeTab, setActiveTab, orders } = useRestaurant();

  const activeOrdersCount = orders.filter(
    (o) => o.status === 'new' || o.status === 'preparing' || o.status === 'ready'
  ).length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: LayoutDashboard,
      active: activeTab === 'dashboard',
      onClick: () => setActiveTab('dashboard'),
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: ClipboardList,
      badge: activeOrdersCount > 0 ? activeOrdersCount : undefined,
      active: activeTab === 'orders',
      onClick: () => setActiveTab('orders'),
    },
    {
      id: 'pos',
      label: 'POS',
      icon: ShoppingBag,
      isPrimary: true,
      active: activeTab === 'pos',
      onClick: () => setActiveTab('pos'),
    },
    {
      id: 'tables',
      label: 'Tables',
      icon: LayoutGrid,
      active: activeTab === 'floor' || activeTab === 'tables-list' || activeTab === 'spaces-list',
      onClick: () => setActiveTab('floor'),
    },
    {
      id: 'more',
      label: 'Menu',
      icon: Menu,
      active: false,
      onClick: onOpenMobileSidebar,
    },
  ];

  return (
    <nav
      className="mobile-bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'var(--color-card)',
        borderTop: '1px solid var(--color-border)',
        display: 'none', // Overridden by CSS on <= 768px
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '6px 8px calc(env(safe-area-inset-bottom, 8px) + 4px)',
        zIndex: 85,
        boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.15)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        if (item.isPrimary) {
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF',
                border: '3px solid var(--color-card)',
                marginTop: '-18px',
                boxShadow: '0 4px 12px var(--r8-emerald-glow, rgba(15, 143, 111, 0.4))',
                cursor: 'pointer',
                transition: 'transform 0.15s ease',
              }}
              title="Quick POS Terminal"
            >
              <Icon size={20} />
              <span style={{ fontSize: '0.62rem', fontWeight: 800 }}>POS</span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={item.onClick}
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px 12px',
              borderRadius: '8px',
              color: item.active ? 'var(--color-primary)' : 'var(--color-muted-foreground)',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              minWidth: '54px',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ position: 'relative' }}>
              <Icon size={19} />
              {item.badge !== undefined && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-8px',
                    backgroundColor: 'var(--color-primary)',
                    color: '#FFFFFF',
                    fontSize: '0.6rem',
                    fontWeight: 800,
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid var(--color-card)',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </div>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: item.active ? 700 : 500,
                marginTop: '3px',
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
