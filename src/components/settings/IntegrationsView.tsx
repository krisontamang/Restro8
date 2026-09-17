import React, { useState } from 'react';
import { Settings as SettingsIcon, X, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

interface IntegrationItem {
  id: string;
  name: string;
  category: 'payment' | 'delivery';
  typeLabel: string;
  description: string;
  logoType: 'nepalpay' | 'dynamic-qr' | 'fonepay' | 'pasal';
  enabled: boolean;
  merchantId?: string;
  apiKey?: string;
}

const INITIAL_INTEGRATIONS: IntegrationItem[] = [
  {
    id: 'nepalpay',
    name: 'NepalPay',
    category: 'payment',
    typeLabel: 'Dynamic QR',
    description:
      'Enable direct digital bank payments with a secure and reliable payment system powered by NepalPay.',
    logoType: 'nepalpay',
    enabled: true,
    merchantId: 'NP-CHIYA-8807',
  },
  {
    id: 'dynamic-qr',
    name: 'Dynamic QR',
    category: 'payment',
    typeLabel: 'Fonepay',
    description:
      'Accept seamless mobile banking and QR-based payments from multiple partnered banks and wallets.',
    logoType: 'dynamic-qr',
    enabled: true,
    merchantId: 'FONE-DYN-0129',
  },
  {
    id: 'fonepay',
    name: 'Fonepay',
    category: 'payment',
    typeLabel: 'Dynamic QR',
    description:
      'Process verified mobile banking payments with added transaction authentication for secure payments.',
    logoType: 'fonepay',
    enabled: true,
    merchantId: 'FP-9821828807',
  },
  {
    id: 'pasal',
    name: 'Pasal.com',
    category: 'delivery',
    typeLabel: 'Delivery Service',
    description:
      'Manage online food delivery orders and connect your restaurant with customers through integrated delivery services.',
    logoType: 'pasal',
    enabled: false,
    merchantId: 'PASAL-STORE-452',
  },
];

export const IntegrationsView: React.FC = () => {
  const { addToast } = useRestaurant();
  const [integrations, setIntegrations] = useState<IntegrationItem[]>(() => {
    try {
      const saved = localStorage.getItem('restrox_integrations');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_INTEGRATIONS;
  });

  const [configuringItem, setConfiguringItem] = useState<IntegrationItem | null>(null);
  const [modalMerchantId, setModalMerchantId] = useState('');
  const [modalApiKey, setModalApiKey] = useState('');
  const [modalEnabled, setModalEnabled] = useState(true);

  const openConfig = (item: IntegrationItem) => {
    setConfiguringItem(item);
    setModalMerchantId(item.merchantId || '');
    setModalApiKey(item.apiKey || '••••••••••••••••');
    setModalEnabled(item.enabled);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!configuringItem) return;

    setIntegrations((prev) =>
      prev.map((item) =>
        item.id === configuringItem.id
          ? {
              ...item,
              enabled: modalEnabled,
              merchantId: modalMerchantId,
              apiKey: modalApiKey,
            }
          : item
      )
    );

    localStorage.setItem(
      'restrox_integrations',
      JSON.stringify(
        integrations.map((item) =>
          item.id === configuringItem.id
            ? { ...item, enabled: modalEnabled, merchantId: modalMerchantId }
            : item
        )
      )
    );

    addToast('Integration Saved', `${configuringItem.name} settings updated.`, 'success');
    setConfiguringItem(null);
  };

  const renderLogo = (type: string) => {
    switch (type) {
      case 'nepalpay':
        return (
          <div
            style={{
              padding: '6px 14px',
              border: '1.5px solid #2563EB',
              borderRadius: '8px',
              backgroundColor: '#FFF',
              display: 'inline-flex',
              alignItems: 'center',
              fontWeight: 900,
              fontSize: '1.1rem',
              letterSpacing: '-0.5px',
            }}
          >
            <span style={{ color: 'var(--r8-brand-primary)' }}>NEPAL</span>
            <span style={{ color: '#2563EB' }}>PAY</span>
          </div>
        );
      case 'dynamic-qr':
        return (
          <div
            style={{
              width: '42px',
              height: '42px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '4px',
            }}
          >
            {/* 4 dots stylized QR symbol */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', border: '3px solid #111' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', border: '3px solid #111' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', border: '3px solid #111' }} />
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#111', margin: '2px' }} />
            </div>
          </div>
        );
      case 'fonepay':
        return (
          <div
            style={{
              padding: '4px 12px',
              borderRadius: '6px',
              backgroundColor: '#DC2626',
              color: '#FFF',
              display: 'inline-flex',
              alignItems: 'center',
              fontWeight: 900,
              fontSize: '1.05rem',
              letterSpacing: '-0.3px',
            }}
          >
            fone<span style={{ fontWeight: 400, marginLeft: '2px' }}>pay</span>
          </div>
        );
      case 'pasal':
        return (
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              fontWeight: 900,
              fontSize: '1.2rem',
            }}
          >
            प
          </div>
        );
      default:
        return null;
    }
  };

  const paymentItems = integrations.filter((i) => i.category === 'payment');
  const deliveryItems = integrations.filter((i) => i.category === 'delivery');

  return (
    <div
      style={{
        padding: '24px 32px',
        backgroundColor: 'var(--color-background)',
        overflowY: 'auto',
        height: '100%',
        boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Top Header matching Screenshot 1 */}
      <h1
        style={{
          fontSize: '1.45rem',
          fontWeight: 700,
          margin: '0 0 24px 0',
          color: 'var(--color-foreground)',
          letterSpacing: '-0.02em',
        }}
      >
        Integrations
      </h1>

      {/* Section 1: Payment Methods matching Screenshot 1 */}
      <div style={{ marginBottom: '36px' }}>
        <h2
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            margin: '0 0 16px 0',
            color: 'var(--color-foreground)',
          }}
        >
          Payment Methods
        </h2>

        {/* 3 Payment Cards Grid matching Screenshot 1 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px',
            maxWidth: '1100px',
          }}
        >
          {paymentItems.map((item) => (
            <IntegrationCard
              key={item.id}
              item={item}
              logo={renderLogo(item.logoType)}
              onConfigure={() => openConfig(item)}
            />
          ))}
        </div>
      </div>

      {/* Section 2: Delivery Services matching Screenshot 1 */}
      <div>
        <h2
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            margin: '0 0 16px 0',
            color: 'var(--color-foreground)',
          }}
        >
          Delivery Services
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px',
            maxWidth: '1100px',
          }}
        >
          {deliveryItems.map((item) => (
            <IntegrationCard
              key={item.id}
              item={item}
              logo={renderLogo(item.logoType)}
              onConfigure={() => openConfig(item)}
            />
          ))}
        </div>
      </div>

      {/* Configuration Modal */}
      {configuringItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            backdropFilter: 'blur(2px)',
          }}
          onClick={() => setConfiguringItem(null)}
        >
          <div
            style={{
              backgroundColor: 'var(--color-card)',
              borderRadius: '14px',
              border: '1px solid var(--color-border)',
              width: '460px',
              maxWidth: '90vw',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {renderLogo(configuringItem.logoType)}
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                    Configure {configuringItem.name}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#2563EB', fontWeight: 600 }}>
                    {configuringItem.typeLabel}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setConfiguringItem(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted-foreground)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveConfig}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                  Merchant ID / Outlet Code *
                </label>
                <input
                  type="text"
                  value={modalMerchantId}
                  onChange={(e) => setModalMerchantId(e.target.value)}
                  placeholder="e.g. FP-9821828807"
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-background)',
                    color: 'var(--color-foreground)',
                    fontSize: '0.84rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                  Secret Key / API Token *
                </label>
                <input
                  type="password"
                  value={modalApiKey}
                  onChange={(e) => setModalApiKey(e.target.value)}
                  placeholder="API Secret Key"
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-background)',
                    color: 'var(--color-foreground)',
                    fontSize: '0.84rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Toggle switch */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  backgroundColor: 'var(--color-background)',
                  borderRadius: '8px',
                  marginBottom: '20px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-foreground)' }}>
                    Enable Integration
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--color-muted-foreground)' }}>
                    Allow customers to pay via this gateway.
                  </div>
                </div>

                <div
                  onClick={() => setModalEnabled((p) => !p)}
                  style={{
                    width: '38px',
                    height: '22px',
                    borderRadius: '11px',
                    backgroundColor: modalEnabled ? '#10B981' : '#D1D5DB',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                >
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: '#FFF',
                      position: 'absolute',
                      top: '2px',
                      left: modalEnabled ? '18px' : '2px',
                      transition: 'left 0.2s',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setConfiguringItem(null)}
                  style={{
                    flex: 1,
                    padding: '9px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-card)',
                    color: 'var(--color-foreground)',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '9px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#000',
                    color: '#FFF',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

interface IntegrationCardProps {
  item: IntegrationItem;
  logo: React.ReactNode;
  onConfigure: () => void;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({ item, logo, onConfigure }) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-card)',
        borderRadius: '14px',
        border: '1px solid var(--color-border)',
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      }}
    >
      <div>
        {/* Logo Container matching Screenshot 1 */}
        <div style={{ height: '48px', display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          {logo}
        </div>

        {/* Title and Configure Button Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '14px',
          }}
        >
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
              {item.name}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#2563EB', fontWeight: 600, marginTop: '2px' }}>
              {item.typeLabel}
            </div>
          </div>

          {/* Black Configure Button matching Screenshot 1 */}
          <button
            type="button"
            onClick={onConfigure}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#000',
              color: '#FFF',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <SettingsIcon size={13} />
            <span>Configure</span>
          </button>
        </div>

        {/* Description matching Screenshot 1 */}
        <p
          style={{
            fontSize: '0.82rem',
            color: 'var(--color-muted-foreground)',
            lineHeight: '1.45',
            margin: 0,
          }}
        >
          {item.description}
        </p>
      </div>
    </div>
  );
};
