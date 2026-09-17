import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Settings, CheckCircle2 } from 'lucide-react';

interface Props {
  title: string;
  category: string;
  description: string;
}

export const SettingsPlaceholderView: React.FC<Props> = ({ title, category, description }) => {
  const { addToast } = useRestaurant();

  return (
    <div style={{ padding: '24px', backgroundColor: 'var(--color-background)', overflowY: 'auto', height: '100%', boxSizing: 'border-box' }}>
      <div style={{ fontSize: '0.8rem', color: 'var(--color-muted-foreground)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
        {category}
      </div>
      <h1
        style={{
          fontSize: '1.45rem',
          fontWeight: 700,
          margin: '0 0 10px 0',
          color: 'var(--color-foreground)',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {title}
      </h1>
      <p style={{ fontSize: '0.88rem', color: 'var(--color-muted-foreground)', margin: '0 0 24px 0' }}>
        {description}
      </p>

      <div
        style={{
          backgroundColor: 'var(--color-card)',
          borderRadius: '12px',
          border: '1px solid var(--color-border)',
          padding: '32px',
          maxWidth: '800px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#EFF6FF',
              color: '#3B82F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Settings size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-foreground)' }}>
              {title} Configuration
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-muted-foreground)' }}>
              Local workspace · Preview settings
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '20px' }}>
          <div
            style={{
              padding: '14px 18px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-muted)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--color-foreground)' }}>
                Enable Automatic Cloud Sync
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--color-muted-foreground)' }}>
                Sync configuration across all POS counters, handheld terminals, and KDS screens.
              </div>
            </div>
            <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
          </div>

          <div
            style={{
              padding: '14px 18px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-muted)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--color-foreground)' }}>
                Audit Logging & Activity Tracking
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--color-muted-foreground)' }}>
                Maintain tamper-evident audit trail for manager overrides and changes.
              </div>
            </div>
            <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
          </div>
        </div>

        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => addToast('Settings Saved', `${title} settings updated.`, 'success')}
            style={{
              backgroundColor: 'var(--r8-brand-primary)',
              color: '#FFF',
              border: 'none',
              borderRadius: '8px',
              padding: '9px 22px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
