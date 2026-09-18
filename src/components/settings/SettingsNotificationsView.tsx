import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import {
  ShoppingCart,
  Ban,
  RefreshCw,
  ArrowLeftRight,
  CircleDollarSign,
  Bell,
  Receipt,
  BookOpen,
  Armchair,
  Boxes,
  AlertTriangle,
  TrendingUp,
  Trash2,
  FileEdit,
  UserCheck,
  Contact,
  Users,
  Settings,
  Search,
  Check,
  Volume2,
  PenLine,
} from 'lucide-react';

export type PriorityType = 'Low' | 'Normal' | 'High';
export type AlertSoundType = 'Default' | 'Ting';
export type RecipientType = 'Everyone' | 'Specific staff';

export interface NotificationRule {
  id: string;
  title: string;
  subtitle: string;
  sectionId: string;
  iconType: string;
  pushEnabled: boolean;
  priority: PriorityType;
  alertSound: AlertSoundType;
  recipients: RecipientType;
  selectedRoles?: string[];
}

export interface NotificationSection {
  id: string;
  title: string;
  count: number;
}

const DEFAULT_SECTIONS: NotificationSection[] = [
  { id: 'orders', title: 'ORDERS & SERVICE', count: 8 },
  { id: 'operations', title: 'OPERATIONS', count: 2 },
  { id: 'inventory', title: 'INVENTORY', count: 2 },
  { id: 'finance', title: 'FINANCE', count: 3 },
  { id: 'people', title: 'PEOPLE', count: 3 },
  { id: 'system', title: 'SYSTEM', count: 2 },
];

const DEFAULT_RULES: NotificationRule[] = [
  // 1. ORDERS & SERVICE 8
  {
    id: 'new-orders',
    title: 'New Orders',
    subtitle: 'New orders and KOTs created plus order from POS and delivery orders placed through your delivery portal.',
    sectionId: 'orders',
    iconType: 'new-orders',
    pushEnabled: true,
    priority: 'High',
    alertSound: 'Ting',
    recipients: 'Everyone',
  },
  {
    id: 'order-edits',
    title: 'Order Edits',
    subtitle: 'Items changed on an open order and updates to its delivery details.',
    sectionId: 'orders',
    iconType: 'order-edits',
    pushEnabled: true,
    priority: 'High',
    alertSound: 'Default',
    recipients: 'Everyone',
  },
  {
    id: 'cancellations',
    title: 'Cancellations',
    subtitle: 'Orders that get cancelled.',
    sectionId: 'orders',
    iconType: 'cancellations',
    pushEnabled: true,
    priority: 'Normal',
    alertSound: 'Default',
    recipients: 'Everyone',
  },
  {
    id: 'status-changes',
    title: 'Status Changes',
    subtitle: 'Kitchen tickets moving between one status to another.',
    sectionId: 'orders',
    iconType: 'status-changes',
    pushEnabled: true,
    priority: 'High',
    alertSound: 'Default',
    recipients: 'Everyone',
  },
  {
    id: 'order-movements',
    title: 'Order Movements',
    subtitle: 'Order type changes and items or KOTs moved between tables.',
    sectionId: 'orders',
    iconType: 'order-movements',
    pushEnabled: true,
    priority: 'Normal',
    alertSound: 'Default',
    recipients: 'Everyone',
  },
  {
    id: 'checkouts',
    title: 'Checkouts',
    subtitle: 'Orders settled and paid at the counter.',
    sectionId: 'orders',
    iconType: 'checkouts',
    pushEnabled: true,
    priority: 'Normal',
    alertSound: 'Ting',
    recipients: 'Everyone',
  },
  {
    id: 'customer-requests',
    title: 'Customer Requests',
    subtitle: 'Water, waiter and bill requests raised by customer through your delivery portal.',
    sectionId: 'orders',
    iconType: 'customer-requests',
    pushEnabled: true,
    priority: 'High',
    alertSound: 'Ting',
    recipients: 'Everyone',
  },
  {
    id: 'other-order-events',
    title: 'Other Order Events',
    subtitle: 'Advance payments, surcharges, reservations, and handled customer requests.',
    sectionId: 'orders',
    iconType: 'other-order-events',
    pushEnabled: true,
    priority: 'Normal',
    alertSound: 'Default',
    recipients: 'Everyone',
  },

  // 2. OPERATIONS 2
  {
    id: 'menu',
    title: 'Menu',
    subtitle: 'Dishes, add-ons, menu sets, categories, and delivery platforms.',
    sectionId: 'operations',
    iconType: 'menu',
    pushEnabled: true,
    priority: 'Low',
    alertSound: 'Default',
    recipients: 'Everyone',
  },
  {
    id: 'tables-spaces',
    title: 'Tables & Spaces',
    subtitle: 'Tables and floor spaces created, updated, or removed.',
    sectionId: 'operations',
    iconType: 'tables-spaces',
    pushEnabled: true,
    priority: 'Low',
    alertSound: 'Default',
    recipients: 'Everyone',
  },

  // 3. INVENTORY 2
  {
    id: 'inventory',
    title: 'Inventory',
    subtitle: 'Stock items, consumption, measuring units, and stock groups.',
    sectionId: 'inventory',
    iconType: 'inventory',
    pushEnabled: true,
    priority: 'Low',
    alertSound: 'Default',
    recipients: 'Everyone',
  },
  {
    id: 'low-stock',
    title: 'Low Stock',
    subtitle: 'Items that fall below their reorder threshold.',
    sectionId: 'inventory',
    iconType: 'low-stock',
    pushEnabled: true,
    priority: 'High',
    alertSound: 'Default',
    recipients: 'Everyone',
  },

  // 4. FINANCE 3
  {
    id: 'finance',
    title: 'Finance',
    subtitle: 'Day-book closes, payments, purchases, tax rates, and account head changes.',
    sectionId: 'finance',
    iconType: 'finance',
    pushEnabled: true,
    priority: 'Low',
    alertSound: 'Default',
    recipients: 'Everyone',
  },
  {
    id: 'deleted-transactions',
    title: 'Deleted Transactions',
    subtitle: 'Transactions removed from the system.',
    sectionId: 'finance',
    iconType: 'deleted-transactions',
    pushEnabled: true,
    priority: 'High',
    alertSound: 'Default',
    recipients: 'Everyone',
  },
  {
    id: 'edited-transactions',
    title: 'Edited Transactions',
    subtitle: 'Income, expense, and purchase entries edited after posting.',
    sectionId: 'finance',
    iconType: 'edited-transactions',
    pushEnabled: true,
    priority: 'High',
    alertSound: 'Default',
    recipients: 'Everyone',
  },

  // 5. PEOPLE 3
  {
    id: 'customers',
    title: 'Customers',
    subtitle: 'New and updated customers, birthdays, and balance adjustments.',
    sectionId: 'people',
    iconType: 'customers',
    pushEnabled: true,
    priority: 'Low',
    alertSound: 'Default',
    recipients: 'Everyone',
  },
  {
    id: 'suppliers',
    title: 'Suppliers',
    subtitle: 'Suppliers created, updated, or removed.',
    sectionId: 'people',
    iconType: 'suppliers',
    pushEnabled: true,
    priority: 'Low',
    alertSound: 'Default',
    recipients: 'Everyone',
  },
  {
    id: 'staff',
    title: 'Staff',
    subtitle: 'Staff invited, updated, or removed from the restaurant.',
    sectionId: 'people',
    iconType: 'staff',
    pushEnabled: true,
    priority: 'Low',
    alertSound: 'Default',
    recipients: 'Everyone',
  },

  // 6. SYSTEM 2
  {
    id: 'settings',
    title: 'Settings',
    subtitle: 'Restaurant, roles, printers, invoice, and subscription changes.',
    sectionId: 'system',
    iconType: 'settings',
    pushEnabled: true,
    priority: 'Low',
    alertSound: 'Default',
    recipients: 'Everyone',
  },
  {
    id: 'everything-else',
    title: 'Everything Else',
    subtitle: 'Fallback for any event without its own rule, like completed exports.',
    sectionId: 'system',
    iconType: 'everything-else',
    pushEnabled: true,
    priority: 'Low',
    alertSound: 'Default',
    recipients: 'Everyone',
  },
];

const getPriorityHint = (priority: PriorityType): string => {
  switch (priority) {
    case 'Low':
      return 'Shows quietly in notifications';
    case 'Normal':
      return 'Standard notification behavior';
    case 'High':
      return 'Pops up on screen so you notice it';
  }
};

const getRecipientsHint = (recipients: RecipientType): string => {
  switch (recipients) {
    case 'Everyone':
      return 'Everyone on the floor is notified.';
    case 'Specific staff':
      return 'Only selected roles or staff members are notified.';
  }
};

export const SettingsNotificationsView: React.FC = () => {
  const { addToast } = useRestaurant();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSectionFilter, setActiveSectionFilter] = useState<string>('all');

  // Load persisted rules or defaults
  const [rules, setRules] = useState<NotificationRule[]>(() => {
    try {
      const saved = localStorage.getItem('restrox_notification_rules');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 10) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_RULES;
  });

  // Persist rules whenever they change
  useEffect(() => {
    localStorage.setItem('restrox_notification_rules', JSON.stringify(rules));
  }, [rules]);

  const updateRule = (id: string, updates: Partial<NotificationRule>) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const playAudioTone = (type: AlertSoundType) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === 'Ting') {
        // High crystal glass ting chime
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1174.66, ctx.currentTime); // D6
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.7);
      } else {
        // Dual pleasant chime
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start();
        osc2.start(ctx.currentTime + 0.1);
        osc1.stop(ctx.currentTime + 0.55);
        osc2.stop(ctx.currentTime + 0.55);
      }
    } catch {
      // AudioContext blocked or unsupported
    }
    addToast('Playing Sound', `Auditioning ${type} alert sound.`, 'info');
  };

  const handleToggleAllPush = (enable: boolean) => {
    setRules((prev) => prev.map((r) => ({ ...r, pushEnabled: enable })));
    addToast(
      enable ? 'All Notifications Enabled' : 'All Notifications Disabled',
      `Push notifications are now ${enable ? 'enabled' : 'muted'} for all events.`,
      'success'
    );
  };

  const handleResetDefaults = () => {
    setRules(DEFAULT_RULES);
    addToast('Defaults Restored', 'Notification rules reset to factory defaults.', 'info');
  };

  // Filtered list
  const filteredRules = rules.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSection =
      activeSectionFilter === 'all' || r.sectionId === activeSectionFilter;
    return matchesSearch && matchesSection;
  });

  return (
    <div
      style={{
        padding: '28px 32px',
        backgroundColor: 'var(--color-background)',
        overflowY: 'auto',
        height: '100%',
        boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          maxWidth: '880px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '1.45rem',
              fontWeight: 700,
              margin: '0 0 4px 0',
              color: 'var(--color-foreground)',
              letterSpacing: '-0.02em',
            }}
          >
            Notification
          </h1>
          <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--color-muted-foreground)', maxWidth: '640px' }}>
            Customize exactly what happens when an event triggers. Set the priority, pick the perfect sound, choose who hears it, and decide whether it triggers a push.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => handleToggleAllPush(true)}
            style={{
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: 600,
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-card)',
              color: 'var(--color-foreground)',
              cursor: 'pointer',
            }}
          >
            Enable All
          </button>
          <button
            type="button"
            onClick={handleResetDefaults}
            style={{
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: 600,
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-card)',
              color: 'var(--color-muted-foreground)',
              cursor: 'pointer',
            }}
          >
            Reset Defaults
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px',
          maxWidth: '880px',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            position: 'relative',
            flex: '1 1 240px',
            maxWidth: '320px',
          }}
        >
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9CA3AF',
            }}
          />
          <input
            type="text"
            placeholder="Search rules (e.g. Stock, Cancel, Sound)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-card)',
              color: 'var(--color-foreground)',
              fontSize: '0.84rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Section Filter Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setActiveSectionFilter('all')}
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 600,
              border: `1px solid ${activeSectionFilter === 'all' ? 'var(--r8-brand-primary, #285D49)' : 'var(--color-border)'}`,
              backgroundColor: activeSectionFilter === 'all' ? 'var(--r8-brand-primary, #285D49)' : 'var(--color-card)',
              color: activeSectionFilter === 'all' ? '#FFF' : 'var(--color-muted-foreground)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            All ({rules.length})
          </button>
          {DEFAULT_SECTIONS.map((sec) => {
            const isActive = activeSectionFilter === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSectionFilter(sec.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  border: `1px solid ${isActive ? 'var(--r8-brand-primary, #285D49)' : 'var(--color-border)'}`,
                  backgroundColor: isActive ? 'var(--r8-brand-primary, #285D49)' : 'var(--color-card)',
                  color: isActive ? '#FFF' : 'var(--color-muted-foreground)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {sec.title} ({sec.count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Rules Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '880px' }}>
        {DEFAULT_SECTIONS.map((sec) => {
          const sectionRules = filteredRules.filter((r) => r.sectionId === sec.id);
          if (sectionRules.length === 0) return null;

          return (
            <React.Fragment key={sec.id}>
              {/* Section Header Divider matching official RestroX Screenshots */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  margin: '12px 0 6px 0',
                }}
              >
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--r8-brand-primary, #285D49)',
                  }}
                />
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: 'var(--color-muted-foreground)',
                    letterSpacing: '0.5px',
                  }}
                >
                  {sec.title} {sec.count}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: '1px',
                    backgroundColor: 'var(--color-border)',
                  }}
                />
              </div>

              {/* Rules Cards inside this section */}
              {sectionRules.map((rule) => (
                <NotificationRuleCard
                  key={rule.id}
                  rule={rule}
                  onUpdate={(updates) => updateRule(rule.id, updates)}
                  onPlaySound={playAudioTone}
                />
              ))}
            </React.Fragment>
          );
        })}

        {filteredRules.length === 0 && (
          <div
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              backgroundColor: 'var(--color-card)',
              borderRadius: '14px',
              border: '1px solid var(--color-border)',
              color: 'var(--color-muted-foreground)',
            }}
          >
            <Bell size={36} style={{ margin: '0 auto 12px auto', opacity: 0.4 }} />
            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-foreground)' }}>
              No notification rules found
            </div>
            <div style={{ fontSize: '0.84rem', marginTop: '4px' }}>
              No rules matched your search query "{searchQuery}".
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Render correct icon based on iconType
const renderRuleIcon = (iconType: string) => {
  const size = 20;
  switch (iconType) {
    case 'new-orders':
      return <Receipt size={size} />;
    case 'order-edits':
      return <PenLine size={size} />;
    case 'shopping-cart':
      return <ShoppingCart size={size} />;
    case 'cancellations':
      return <Ban size={size} />;
    case 'status-changes':
      return <RefreshCw size={size} />;
    case 'order-movements':
      return <ArrowLeftRight size={size} />;
    case 'checkouts':
      return <CircleDollarSign size={size} />;
    case 'customer-requests':
      return <Bell size={size} />;
    case 'other-order-events':
      return <Receipt size={size} />;
    case 'menu':
      return <BookOpen size={size} />;
    case 'tables-spaces':
      return <Armchair size={size} />;
    case 'inventory':
      return <Boxes size={size} />;
    case 'low-stock':
      return <AlertTriangle size={size} />;
    case 'finance':
      return <TrendingUp size={size} />;
    case 'deleted-transactions':
      return <Trash2 size={size} />;
    case 'edited-transactions':
      return <FileEdit size={size} />;
    case 'customers':
      return <UserCheck size={size} />;
    case 'suppliers':
      return <Contact size={size} />;
    case 'staff':
      return <Users size={size} />;
    case 'settings':
      return <Settings size={size} />;
    case 'everything-else':
    default:
      return <Bell size={size} />;
  }
};

interface CardProps {
  rule: NotificationRule;
  onUpdate: (updates: Partial<NotificationRule>) => void;
  onPlaySound: (sound: AlertSoundType) => void;
}

const AVAILABLE_ROLES = ['Owner', 'SuperAdmin', 'Manager', 'Cashier', 'Waiter', 'Kitchen'];

const NotificationRuleCard: React.FC<CardProps> = ({ rule, onUpdate, onPlaySound }) => {
  const priorityHint = getPriorityHint(rule.priority);
  const recipientsHint = getRecipientsHint(rule.recipients);

  const toggleRole = (role: string) => {
    const current = rule.selectedRoles || ['Owner', 'SuperAdmin'];
    const exists = current.includes(role);
    const updated = exists ? current.filter((r) => r !== role) : [...current, role];
    onUpdate({ selectedRoles: updated });
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--color-card)',
        borderRadius: '14px',
        border: '1px solid var(--color-border)',
        padding: '20px 24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        transition: 'border-color 0.2s ease',
      }}
    >
      {/* Card Header: Icon, Title, Subtitle, Push Toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--color-border)',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'var(--r8-brand-light, #EAF2EC)',
              color: 'var(--r8-brand-primary, #285D49)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {renderRuleIcon(rule.iconType)}
          </div>
          <div>
            <div
              style={{
                fontSize: '0.98rem',
                fontWeight: 700,
                color: 'var(--color-foreground)',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {rule.title}
            </div>
            <div
              style={{
                fontSize: '0.8rem',
                color: 'var(--color-muted-foreground)',
                marginTop: '2px',
                lineHeight: '1.3',
              }}
            >
              {rule.subtitle}
            </div>
          </div>
        </div>

        {/* Push Toggle Switch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <span
            style={{
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--color-foreground)',
            }}
          >
            Push
          </span>
          <div
            onClick={() => onUpdate({ pushEnabled: !rule.pushEnabled })}
            style={{
              width: '40px',
              height: '22px',
              borderRadius: '11px',
              backgroundColor: rule.pushEnabled ? '#10B981' : '#D1D5DB',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
            }}
            title={rule.pushEnabled ? 'Push notification enabled' : 'Push notification disabled'}
          >
            <div
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: '#FFF',
                position: 'absolute',
                top: '2px',
                left: rule.pushEnabled ? '20px' : '2px',
                transition: 'left 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Settings Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Row 1: Priority */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.86rem',
                fontWeight: 600,
                color: 'var(--color-foreground)',
              }}
            >
              Priority
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--color-muted-foreground)', marginTop: '2px' }}>
              {priorityHint}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {(['Low', 'Normal', 'High'] as const).map((p) => {
              const isSelected = rule.priority === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => onUpdate({ priority: p })}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: `1px solid ${isSelected ? '#10B981' : 'var(--color-border)'}`,
                    backgroundColor: isSelected ? '#ECFDF5' : 'var(--color-card)',
                    color: isSelected ? '#047857' : 'var(--color-foreground)',
                    fontSize: '0.8rem',
                    fontWeight: isSelected ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      border: `2px solid ${isSelected ? '#10B981' : '#9CA3AF'}`,
                      backgroundColor: isSelected ? '#10B981' : 'transparent',
                      transition: 'all 0.15s ease',
                    }}
                  />
                  <span>{p}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Alert sound */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.86rem',
                fontWeight: 600,
                color: 'var(--color-foreground)',
              }}
            >
              Alert sound
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--color-muted-foreground)', marginTop: '2px' }}>
              Tap a sound to hear it.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {(['Default', 'Ting'] as const).map((s) => {
              const isSelected = rule.alertSound === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    onUpdate({ alertSound: s });
                    onPlaySound(s);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: `1px solid ${isSelected ? '#10B981' : 'var(--color-border)'}`,
                    backgroundColor: isSelected ? '#ECFDF5' : 'var(--color-card)',
                    color: isSelected ? '#047857' : 'var(--color-foreground)',
                    fontSize: '0.8rem',
                    fontWeight: isSelected ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      border: `2px solid ${isSelected ? '#10B981' : '#9CA3AF'}`,
                      backgroundColor: isSelected ? '#10B981' : 'transparent',
                      transition: 'all 0.15s ease',
                    }}
                  />
                  <span>{s}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 3: Recipients */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.86rem',
                fontWeight: 600,
                color: 'var(--color-foreground)',
              }}
            >
              Recipients
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--color-muted-foreground)', marginTop: '2px' }}>
              {recipientsHint}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {(['Everyone', 'Specific staff'] as const).map((r) => {
              const isSelected = rule.recipients === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => onUpdate({ recipients: r })}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: `1px solid ${isSelected ? '#10B981' : 'var(--color-border)'}`,
                    backgroundColor: isSelected ? '#ECFDF5' : 'var(--color-card)',
                    color: isSelected ? '#047857' : 'var(--color-foreground)',
                    fontSize: '0.8rem',
                    fontWeight: isSelected ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      border: `2px solid ${isSelected ? '#10B981' : '#9CA3AF'}`,
                      backgroundColor: isSelected ? '#10B981' : 'transparent',
                      transition: 'all 0.15s ease',
                    }}
                  />
                  <span>{r}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional Sub-Row: Specific staff selector when selected */}
        {rule.recipients === 'Specific staff' && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-background)',
              border: '1px dashed var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-muted-foreground)' }}>
              Select roles to receive this alert:
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {AVAILABLE_ROLES.map((role) => {
                const isSelected = (rule.selectedRoles || ['Owner', 'SuperAdmin']).includes(role);
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => toggleRole(role)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      border: `1px solid ${isSelected ? '#10B981' : 'var(--color-border)'}`,
                      backgroundColor: isSelected ? '#ECFDF5' : 'var(--color-card)',
                      color: isSelected ? '#047857' : 'var(--color-muted-foreground)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {isSelected && <Check size={12} />}
                    <span>{role}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
