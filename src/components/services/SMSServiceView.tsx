import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import {
  Send,
  Search,
  Filter,
  MoreHorizontal,
  DollarSign,
  MessageSquare,
  Clock,
  CreditCard,
  X,
  List,
  Columns,
} from 'lucide-react';

export const SMSServiceView: React.FC = () => {
  const { settings, addToast } = useRestaurant();
  const [activeTab, setActiveTab] = useState<'logs' | 'events' | 'history'>('logs');
  const [searchQuery, setSearchQuery] = useState('');
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);

  // Bulk SMS Form
  const [bulkNumbers, setBulkNumbers] = useState('');
  const [messageText, setMessageText] = useState(
    `${settings.name || 'Your restaurant'} update: `
  );

  return (
    <div style={{ padding: '24px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Header Bar matching Screenshot 2 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <h1
          style={{
            fontSize: '1.45rem',
            fontWeight: 900,
            margin: 0,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            color: 'var(--color-foreground)',
          }}
        >
          SMS
        </h1>

        {/* Send Bulk SMS [N] Red Button */}
        <button
          onClick={() => setIsBulkModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            borderRadius: '8px',
            backgroundColor: 'var(--r8-brand-primary)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '0.86rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(14, 165, 233, 0.35)',
          }}
        >
          <Send size={15} /> Send Bulk SMS
          <span
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
              padding: '1px 5px',
              borderRadius: '4px',
              fontSize: '0.72rem',
              fontWeight: 800,
              marginLeft: '2px',
            }}
          >
            N
          </span>
        </button>
      </div>

      {/* Top 4 KPI Cards matching Screenshot 2 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {/* KPI 1: Available Balance */}
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            padding: '16px 20px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                backgroundColor: '#EDE9FE',
                color: '#8B5CF6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DollarSign size={15} />
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-muted-foreground)' }}>
              Available Balance
            </span>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-foreground)' }}>
            Rs 10
          </div>
        </div>

        {/* KPI 2: Today's SMS */}
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            padding: '16px 20px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                backgroundColor: '#FEF3C7',
                color: '#D97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MessageSquare size={14} />
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-muted-foreground)' }}>
              Today's SMS
            </span>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-foreground)' }}>
            0
          </div>
        </div>

        {/* KPI 3: Yesterday's SMS */}
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            padding: '16px 20px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                backgroundColor: '#FEE2E2',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Clock size={14} />
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-muted-foreground)' }}>
              Yesterday's SMS
            </span>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-foreground)' }}>
            0
          </div>
        </div>

        {/* KPI 4: Total Transactions */}
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            padding: '16px 20px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                backgroundColor: '#E8F8F0',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CreditCard size={14} />
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-muted-foreground)' }}>
              Total Transactions
            </span>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-foreground)' }}>
            Rs 0
          </div>
        </div>
      </div>

      {/* Sub Bar with Tabs, Search, Filter, Load SMS matching Screenshot 2 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          marginBottom: '18px',
        }}
      >
        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--color-muted)',
            padding: '4px',
            borderRadius: '10px',
            gap: '6px',
          }}
        >
          <button
            onClick={() => setActiveTab('logs')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'logs' ? 'var(--r8-brand-primary)' : 'transparent',
              color: activeTab === 'logs' ? '#FFFFFF' : 'var(--color-muted-foreground)',
              fontSize: '0.84rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            SMS Logs
          </button>
          <button
            onClick={() => setActiveTab('events')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'events' ? 'var(--r8-brand-primary)' : 'transparent',
              color: activeTab === 'events' ? '#FFFFFF' : 'var(--color-muted-foreground)',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Events
          </button>
          <button
            onClick={() => setActiveTab('history')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'history' ? 'var(--r8-brand-primary)' : 'transparent',
              color: activeTab === 'history' ? '#FFFFFF' : 'var(--color-muted-foreground)',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Purchase History
          </button>
        </div>

        {/* Right Search & Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Search */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
            }}
          >
            <Search size={15} color="var(--color-muted-foreground)" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.84rem',
                color: 'var(--color-foreground)',
                width: '120px',
              }}
            />
          </div>

          {/* Filter */}
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
            <Filter size={14} /> Filter
          </button>

          {/* Load SMS Indigo/Purple Button */}
          <button
            onClick={() => setIsLoadModalOpen(true)}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              backgroundColor: '#4338CA',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '0.84rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(67, 56, 202, 0.3)',
            }}
          >
            Load SMS
          </button>

          {/* Options ⋯ */}
          <button
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--color-muted-foreground)',
            }}
          >
            <MoreHorizontal size={18} />
          </button>

          {/* View switcher */}
          <div
            style={{
              display: 'flex',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              overflow: 'hidden',
            }}
          >
            <button
              style={{
                padding: '8px 10px',
                border: 'none',
                backgroundColor: 'var(--r8-brand-primary)',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <List size={16} />
            </button>
            <button
              style={{
                padding: '8px 10px',
                border: 'none',
                backgroundColor: 'var(--color-card)',
                color: 'var(--color-muted-foreground)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Columns size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Table Container matching Screenshot 2 */}
      <div
        style={{
          backgroundColor: 'var(--color-card)',
          borderRadius: '12px',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden',
          minHeight: '440px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '960px' }}>
            <thead>
              <tr
                style={{
                  backgroundColor: 'var(--color-muted)',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <th style={{ padding: '14px 16px', fontSize: '0.82rem', fontWeight: 800, width: '50px' }}>SN</th>
                <th style={{ padding: '14px 16px', fontSize: '0.82rem', fontWeight: 800 }}>Mobile Number</th>
                <th style={{ padding: '14px 16px', fontSize: '0.82rem', fontWeight: 800 }}>Name</th>
                <th style={{ padding: '14px 16px', fontSize: '0.82rem', fontWeight: 800 }}>Carrier</th>
                <th style={{ padding: '14px 16px', fontSize: '0.82rem', fontWeight: 800 }}>Message</th>
                <th style={{ padding: '14px 16px', fontSize: '0.82rem', fontWeight: 800 }}>Rate</th>
                <th style={{ padding: '14px 16px', fontSize: '0.82rem', fontWeight: 800 }}>Event</th>
                <th style={{ padding: '14px 16px', fontSize: '0.82rem', fontWeight: 800 }}>SMS Type</th>
                <th style={{ padding: '14px 16px', fontSize: '0.82rem', fontWeight: 800 }}>Status</th>
                <th style={{ padding: '14px 16px', fontSize: '0.82rem', fontWeight: 800 }}>Sent At</th>
              </tr>
            </thead>
            <tbody>
              {/* Empty state rows */}
            </tbody>
          </table>
        </div>

        {/* Empty State Illustration matching Screenshot 2 */}
        <div
          style={{
            padding: '60px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            margin: 'auto 0',
          }}
        >
          {/* Fanned out colored sheets */}
          <div
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '32px',
                height: '42px',
                borderRadius: '5px',
                backgroundColor: '#10B981',
                transform: 'rotate(-20deg) translate(-10px, 0)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: '34px',
                height: '44px',
                borderRadius: '5px',
                backgroundColor: '#2563EB',
                zIndex: 2,
                boxShadow: '0 4px 10px rgba(0,0,0,0.18)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ width: '18px', height: '2px', backgroundColor: '#FFFFFF' }} />
              <div style={{ width: '14px', height: '2px', backgroundColor: '#FFFFFF', opacity: 0.8 }} />
              <div style={{ width: '10px', height: '2px', backgroundColor: '#FFFFFF', opacity: 0.6 }} />
            </div>
            <div
              style={{
                position: 'absolute',
                width: '32px',
                height: '42px',
                borderRadius: '5px',
                backgroundColor: '#8B5CF6',
                transform: 'rotate(20deg) translate(10px, 0)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
              }}
            />
          </div>

          <h3
            style={{
              fontSize: '1.2rem',
              fontWeight: 900,
              color: 'var(--color-foreground)',
              margin: '0 0 6px 0',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            No SMS logs found
          </h3>
          <p
            style={{
              fontSize: '0.86rem',
              color: 'var(--color-muted-foreground)',
              margin: 0,
            }}
          >
            No SMS logs found.
          </p>
        </div>

        {/* Bottom selection counter matching Screenshot 2 */}
        <div
          style={{
            padding: '14px 18px',
            borderTop: '1px solid var(--color-border)',
            fontSize: '0.82rem',
            color: 'var(--color-muted-foreground)',
          }}
        >
          0 of 0 row(s) selected.
        </div>
      </div>

      {/* Send Bulk SMS Modal */}
      {isBulkModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-card)',
              borderRadius: '16px',
              border: '1px solid var(--color-border)',
              width: '100%',
              maxWidth: '520px',
              padding: '24px',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Send Bulk SMS</h2>
              <button onClick={() => setIsBulkModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                Recipient Mobile Numbers (Nepal 98XXXXXXXX)
              </label>
              <textarea
                rows={3}
                placeholder="Enter numbers separated by comma (e.g. 9821828807, 9841234567)"
                value={bulkNumbers}
                onChange={(e) => setBulkNumbers(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-foreground)',
                  fontSize: '0.86rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                SMS Message Text
              </label>
              <textarea
                rows={4}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-foreground)',
                  fontSize: '0.86rem',
                  boxSizing: 'border-box',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--color-muted-foreground)', marginTop: '4px' }}>
                <span>Standard GSM encoding</span>
                <span>{messageText.length} / 160 characters (1 SMS)</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setIsBulkModalOpen(false)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'transparent',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  addToast('SMS draft saved', 'No SMS gateway is configured. This message was not sent.', 'info');
                  setIsBulkModalOpen(false);
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'var(--r8-brand-primary)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Send SMS Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load SMS Modal */}
      {isLoadModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-card)',
              borderRadius: '16px',
              border: '1px solid var(--color-border)',
              width: '100%',
              maxWidth: '440px',
              padding: '24px',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Recharge SMS Credits</h2>
              <button onClick={() => setIsLoadModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {[
                { count: '500 SMS', price: 'Rs 1,000', per: 'Rs 2.00 / SMS' },
                { count: '1,500 SMS', price: 'Rs 2,500', per: 'Rs 1.66 / SMS' },
                { count: '5,000 SMS', price: 'Rs 7,000', per: 'Rs 1.40 / SMS' },
              ].map((tier, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{tier.count}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-foreground)' }}>{tier.per}</div>
                  </div>
                  <div style={{ fontWeight: 800, color: '#10B981', fontSize: '0.95rem' }}>{tier.price}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setIsLoadModalOpen(false)}
                style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'transparent' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  addToast('SMS credits unavailable', 'Connect an SMS provider before purchasing or sending credits.', 'info');
                  setIsLoadModalOpen(false);
                }}
                style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: '#4338CA', color: '#FFF', border: 'none', fontWeight: 800 }}
              >
                Pay via Fonepay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
