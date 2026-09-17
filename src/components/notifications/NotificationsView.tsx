import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { getNepaliDate } from '../../utils/nepalDate';
import {
  Bell,
  Filter,
  Bike,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Store,
} from 'lucide-react';
import { Order } from '../../types/restaurant';
import { KOTModal } from '../modals/KOTModal';

export const NotificationsView: React.FC = () => {
  const { orders, setActiveTab } = useRestaurant();
  const [filterTab, setFilterTab] = useState<'order' | 'activity'>('order');
  const [viewingKOT, setViewingKOT] = useState<{
    isOpen: boolean;
    order?: Order | null;
    customData?: any;
  }>({ isOpen: false });

  const { formattedAD } = getNepaliDate();

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Title (Screenshot 3) */}
      <h1
        style={{
          fontSize: '1.45rem',
          fontWeight: 900,
          marginBottom: '20px',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        Notification
      </h1>

      {/* Sub-tabs & Filter Button (Screenshot 3) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--color-card)', padding: '4px', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
          <button
            onClick={() => setFilterTab('order')}
            style={{
              padding: '6px 20px',
              borderRadius: '8px',
              fontSize: '0.84rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: filterTab === 'order' ? 'var(--r8-brand-primary)' : 'transparent',
              color: filterTab === 'order' ? '#FFFFFF' : 'var(--color-foreground)',
              transition: 'all 0.15s ease',
            }}
          >
            Order
          </button>
          <button
            onClick={() => setFilterTab('activity')}
            style={{
              padding: '6px 20px',
              borderRadius: '8px',
              fontSize: '0.84rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: filterTab === 'activity' ? 'var(--r8-brand-primary)' : 'transparent',
              color: filterTab === 'activity' ? '#FFFFFF' : 'var(--color-foreground)',
              transition: 'all 0.15s ease',
            }}
          >
            Activity
          </button>
        </div>

        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '8px',
            backgroundColor: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            fontSize: '0.84rem',
            fontWeight: 600,
            cursor: 'pointer',
            color: 'var(--color-foreground)',
          }}
        >
          <Filter size={15} /> Filter
        </button>
      </div>

      {/* Section: Today (Screenshot 3) */}
      <h3
        style={{
          fontSize: '1rem',
          fontWeight: 800,
          color: 'var(--color-foreground)',
          marginBottom: '14px',
        }}
      >
        Today
      </h3>

      {/* Notification Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Card matching Screenshot 3 */}
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            padding: '18px 22px',
            boxShadow: 'var(--shadow-sm)',
            transition: 'transform 0.15s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.96rem', fontWeight: 800 }}>Order created</span>
            <span style={{ fontSize: '1rem' }}>🛵</span>
          </div>

          <p
            style={{
              fontSize: '0.86rem',
              color: 'var(--color-muted-foreground)',
              margin: '0 0 6px 0',
            }}
          >
            Kirtiman Tamang created Table order for <strong>Cabin 1</strong>.
          </p>

          <div
            style={{
              fontSize: '0.76rem',
              color: 'var(--color-muted-foreground)',
              marginBottom: '10px',
            }}
          >
            at 14 Sep 2026, 02:26 PM
          </div>

          <button
            onClick={() => {
              const cabinOrder = orders.find(
                (o) => o.tableId === 't-cabin-1' || o.id === 'ord-100'
              );
              setViewingKOT({
                isOpen: true,
                order: cabinOrder || null,
                customData: {
                  kotNumber: cabinOrder?.orderNumber || '100',
                  tableLabel: 'Cabin 1',
                  serverName: 'Kirtiman Tamang',
                  orderType: 'Table Order (Dine In)',
                  timeStr: '14 Sep 2026, 02:26 PM',
                  notes: 'Special instruction: Serve hot with fresh timur achar.',
                  items: cabinOrder?.items || [
                    {
                      id: 'oi-c1',
                      name: 'Burger - Chicken',
                      nepaliName: 'चिकेन बर्गर',
                      quantity: 1,
                      station: 'kitchen',
                      ticketType: 'KOT',
                    },
                    {
                      id: 'oi-c2',
                      name: 'Iced Latte',
                      nepaliName: 'आइस लात्ते',
                      quantity: 1,
                      station: 'coffee',
                      ticketType: 'BOT',
                    },
                  ],
                },
              });
            }}
            style={{
              fontSize: '0.82rem',
              color: '#3B82F6',
              fontWeight: 700,
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            View KOT &rarr;
          </button>
        </div>

        {/* Dynamic notifications from active orders */}
        {orders.map((ord) => (
          <div
            key={ord.id}
            style={{
              backgroundColor: 'var(--color-card)',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              padding: '18px 22px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.96rem', fontWeight: 800 }}>
                {ord.status === 'completed' ? 'Bill Settled' : 'Order in Preparation'}
              </span>
              <span style={{ fontSize: '1rem' }}>
                {ord.status === 'completed' ? '💳' : '🍳'}
              </span>
            </div>

            <p
              style={{
                fontSize: '0.86rem',
                color: 'var(--color-muted-foreground)',
                margin: '0 0 6px 0',
              }}
            >
              {ord.serverName} updated ticket for{' '}
              <strong>{ord.customerName || `Table #${ord.tableNumber || 1}`}</strong> &bull;{' '}
              {ord.items.map((i) => i.name).join(', ')}.
            </p>

            <div
              style={{
                fontSize: '0.76rem',
                color: 'var(--color-muted-foreground)',
                marginBottom: '10px',
              }}
            >
              {ord.dateBS}
            </div>

            <button
              onClick={() => {
                setViewingKOT({
                  isOpen: true,
                  order: ord,
                  customData: {
                    kotNumber: ord.orderNumber,
                    tableLabel: ord.customerName || `Table #${ord.tableNumber || 1}`,
                    serverName: ord.serverName || 'Kirtiman Tamang',
                    orderType:
                      ord.orderType === 'dine-in'
                        ? 'Table Order (Dine In)'
                        : ord.orderType,
                    timeStr: ord.dateBS || 'Today',
                    items: ord.items,
                  },
                });
              }}
              style={{
                fontSize: '0.82rem',
                color: '#3B82F6',
                fontWeight: 700,
                background: 'transparent',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              View KOT &rarr;
            </button>
          </div>
        ))}
      </div>

      {/* Interactive Kitchen Order Ticket (KOT) Direct Modal */}
      <KOTModal
        isOpen={viewingKOT.isOpen}
        onClose={() => setViewingKOT({ isOpen: false })}
        order={viewingKOT.order}
        customData={viewingKOT.customData}
      />
    </div>
  );
};
