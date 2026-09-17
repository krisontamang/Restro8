import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { useRestaurant } from '../../context/RestaurantContext';
import { getPublicMenuUrl, publicMenuStatus } from '../../utils/publicMenu';
import {
  ChevronDown,
  Copy,
  Download,
  Printer,
  Edit2,
  Check,
} from 'lucide-react';

function DeliveryQr({ value }: { value: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current) void QRCode.toCanvas(canvasRef.current, value, { width: 160, margin: 2, errorCorrectionLevel: 'M' });
  }, [value]);
  return <canvas ref={canvasRef} aria-label="QR code for the guest menu preview" style={{ width: 160, height: 160, display: 'block' }} />;
}

export const DeliveryServiceView: React.FC = () => {
  const { settings } = useRestaurant();
  const [activeSubTab, setActiveSubTab] = useState<'details' | 'hours' | 'partners'>('details');

  // Toggles
  const [status, setStatus] = useState(true);
  const [activeMenuSet, setActiveMenuSet] = useState('Default Menuset');
  const [viewInvoice, setViewInvoice] = useState(true);
  const [viewKOT, setViewKOT] = useState(true);
  const [requireConfirmation, setRequireConfirmation] = useState(true);
  const [autoPrintDelivery, setAutoPrintDelivery] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const deliveryUrl = getPublicMenuUrl();
  const restaurantName = settings.name.trim() || 'Your restaurant';

  const copyToClipboard = () => {
    void navigator.clipboard.writeText(deliveryUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Title */}
      <h1
        style={{
          fontSize: '1.45rem',
          fontWeight: 900,
          margin: '0 0 16px 0',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          color: 'var(--color-foreground)',
        }}
      >
        Delivery Service
      </h1>

      {/* Sub Tabs matching Screenshot 5 */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          backgroundColor: 'var(--color-muted)',
          padding: '4px',
          borderRadius: '10px',
          width: 'fit-content',
        }}
      >
        <button
          onClick={() => setActiveSubTab('details')}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: activeSubTab === 'details' ? 'var(--r8-brand-primary)' : 'transparent',
            color: activeSubTab === 'details' ? '#FFFFFF' : 'var(--color-muted-foreground)',
            fontSize: '0.84rem',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          Delivery Details
        </button>

        <button
          onClick={() => setActiveSubTab('hours')}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: activeSubTab === 'hours' ? 'var(--r8-brand-primary)' : 'transparent',
            color: activeSubTab === 'hours' ? '#FFFFFF' : 'var(--color-muted-foreground)',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          Opening Hour
        </button>

        <button
          onClick={() => setActiveSubTab('partners')}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: activeSubTab === 'partners' ? 'var(--r8-brand-primary)' : 'transparent',
            color: activeSubTab === 'partners' ? '#FFFFFF' : 'var(--color-muted-foreground)',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          Delivery Partners
        </button>
      </div>

      {activeSubTab === 'details' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.3fr) minmax(360px, 420px)',
            gap: '32px',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Form & Toggles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Section: Status and Menu Set */}
            <div>
              <h2
                style={{
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: 'var(--color-foreground)',
                  marginBottom: '14px',
                }}
              >
                Status and Menu Set
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Status Card */}
                <div
                  style={{
                    backgroundColor: 'var(--color-card)',
                    borderRadius: '12px',
                    border: '1px solid var(--color-border)',
                    padding: '18px 22px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        color: 'var(--color-foreground)',
                        marginBottom: '4px',
                      }}
                    >
                      Status
                    </div>
                    <div
                      style={{
                        fontSize: '0.82rem',
                        color: 'var(--color-muted-foreground)',
                      }}
                    >
                      This means you are serving delivery service in your restaurant or not.
                    </div>
                  </div>

                  <button
                    onClick={() => setStatus(!status)}
                    style={{
                      width: '42px',
                      height: '24px',
                      borderRadius: '24px',
                      backgroundColor: status ? '#10B981' : '#E5E7EB',
                      position: 'relative',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      padding: 0,
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: '#FFFFFF',
                        position: 'absolute',
                        top: '3px',
                        left: status ? '21px' : '3px',
                        transition: 'left 0.2s',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                      }}
                    />
                  </button>
                </div>

                {/* Active Menu Set Card */}
                <div
                  style={{
                    backgroundColor: 'var(--color-card)',
                    borderRadius: '12px',
                    border: '1px solid var(--color-border)',
                    padding: '18px 22px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      color: 'var(--color-foreground)',
                      marginBottom: '10px',
                    }}
                  >
                    Active Menu Set
                  </div>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={activeMenuSet}
                      onChange={(e) => setActiveMenuSet(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-background)',
                        color: 'var(--color-foreground)',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        outline: 'none',
                        appearance: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="Default Menuset">Default Menuset</option>
                      <option value="Online Food Delivery Menu">Online Food Delivery Menu</option>
                    </select>
                    <ChevronDown
                      size={16}
                      color="var(--color-muted-foreground)"
                      style={{
                        position: 'absolute',
                        right: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Others */}
            <div>
              <h2
                style={{
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: 'var(--color-foreground)',
                  marginBottom: '14px',
                }}
              >
                Others
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* View Invoice */}
                <div
                  style={{
                    backgroundColor: 'var(--color-card)',
                    borderRadius: '12px',
                    border: '1px solid var(--color-border)',
                    padding: '18px 22px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        color: 'var(--color-foreground)',
                        marginBottom: '4px',
                      }}
                    >
                      View Invoice
                    </div>
                    <div
                      style={{
                        fontSize: '0.82rem',
                        color: 'var(--color-muted-foreground)',
                      }}
                    >
                      Customer can view invoice, they will see final amount of their orders too.
                    </div>
                  </div>

                  <button
                    onClick={() => setViewInvoice(!viewInvoice)}
                    style={{
                      width: '42px',
                      height: '24px',
                      borderRadius: '24px',
                      backgroundColor: viewInvoice ? '#10B981' : '#E5E7EB',
                      position: 'relative',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      padding: 0,
                    }}
                  >
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: '#FFFFFF',
                        position: 'absolute',
                        top: '3px',
                        left: viewInvoice ? '21px' : '3px',
                        transition: 'left 0.2s',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                      }}
                    />
                  </button>
                </div>

                {/* View KOT */}
                <div
                  style={{
                    backgroundColor: 'var(--color-card)',
                    borderRadius: '12px',
                    border: '1px solid var(--color-border)',
                    padding: '18px 22px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        color: 'var(--color-foreground)',
                        marginBottom: '4px',
                      }}
                    >
                      View KOT
                    </div>
                    <div
                      style={{
                        fontSize: '0.82rem',
                        color: 'var(--color-muted-foreground)',
                      }}
                    >
                      Customer can view KOT, they can't see the amount of orders. Only see number of items.
                    </div>
                  </div>

                  <button
                    onClick={() => setViewKOT(!viewKOT)}
                    style={{
                      width: '42px',
                      height: '24px',
                      borderRadius: '24px',
                      backgroundColor: viewKOT ? '#10B981' : '#E5E7EB',
                      position: 'relative',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      padding: 0,
                    }}
                  >
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: '#FFFFFF',
                        position: 'absolute',
                        top: '3px',
                        left: viewKOT ? '21px' : '3px',
                        transition: 'left 0.2s',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                      }}
                    />
                  </button>
                </div>

                {/* Require Order Confirmation */}
                <div
                  style={{
                    backgroundColor: 'var(--color-card)',
                    borderRadius: '12px',
                    border: '1px solid var(--color-border)',
                    padding: '18px 22px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        color: 'var(--color-foreground)',
                        marginBottom: '4px',
                      }}
                    >
                      Require Order Confirmation
                    </div>
                    <div
                      style={{
                        fontSize: '0.82rem',
                        color: 'var(--color-muted-foreground)',
                      }}
                    >
                      If you enable this, you will have to confirm order before it goes to kitchen.
                    </div>
                  </div>

                  <button
                    onClick={() => setRequireConfirmation(!requireConfirmation)}
                    style={{
                      width: '42px',
                      height: '24px',
                      borderRadius: '24px',
                      backgroundColor: requireConfirmation ? '#10B981' : '#E5E7EB',
                      position: 'relative',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      padding: 0,
                    }}
                  >
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: '#FFFFFF',
                        position: 'absolute',
                        top: '3px',
                        left: requireConfirmation ? '21px' : '3px',
                        transition: 'left 0.2s',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                      }}
                    />
                  </button>
                </div>

                {/* Auto print Delivery Request */}
                <div
                  style={{
                    backgroundColor: 'var(--color-card)',
                    borderRadius: '12px',
                    border: '1px solid var(--color-border)',
                    padding: '18px 22px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        color: 'var(--color-foreground)',
                        marginBottom: '4px',
                      }}
                    >
                      Auto print Delivery Request
                    </div>
                    <div
                      style={{
                        fontSize: '0.82rem',
                        color: 'var(--color-muted-foreground)',
                      }}
                    >
                      If you enable this, delivery request will be printed automatically
                    </div>
                  </div>

                  <button
                    onClick={() => setAutoPrintDelivery(!autoPrintDelivery)}
                    style={{
                      width: '42px',
                      height: '24px',
                      borderRadius: '24px',
                      backgroundColor: autoPrintDelivery ? '#10B981' : '#E5E7EB',
                      position: 'relative',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      padding: 0,
                    }}
                  >
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: '#FFFFFF',
                        position: 'absolute',
                        top: '3px',
                        left: autoPrintDelivery ? '21px' : '3px',
                        transition: 'left 0.2s',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                      }}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Section: QR Attachment matching Screenshot 1 */}
            <div>
              <h2
                style={{
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: 'var(--color-foreground)',
                  marginBottom: '14px',
                }}
              >
                QR Attachment
              </h2>

              <div
                style={{
                  backgroundColor: 'var(--color-card)',
                  borderRadius: '12px',
                  border: '1px solid var(--color-border)',
                  padding: '22px',
                }}
              >
                <div style={{ marginBottom: '18px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.86rem',
                      fontWeight: 700,
                      marginBottom: '8px',
                      color: 'var(--color-foreground)',
                    }}
                  >
                    File Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter File Name"
                    style={{
                      width: '100%',
                      padding: '11px 16px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-background)',
                      color: 'var(--color-foreground)',
                      fontSize: '0.86rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.86rem',
                      fontWeight: 700,
                      marginBottom: '8px',
                      color: 'var(--color-foreground)',
                    }}
                  >
                    Upload File
                  </label>
                  <div
                    style={{
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                      backgroundColor: 'var(--color-background)',
                    }}
                  >
                    <div style={{ color: 'var(--color-muted-foreground)', display: 'flex', alignItems: 'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                        <path d="M12 12v9" />
                        <path d="m16 16-4-4-4 4" />
                      </svg>
                    </div>
                    <span style={{ fontSize: '0.86rem', color: 'var(--color-muted-foreground)' }}>
                      Click here to upload your image
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Share Delivery Menu QR & Charges matching Screenshot 5 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Card 1: Share Delivery Menu */}
            <div
              style={{
                backgroundColor: 'var(--color-card)',
                borderRadius: '12px',
                border: '1px solid var(--color-border)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: 'var(--color-foreground)',
                  alignSelf: 'flex-start',
                  marginBottom: '16px',
                }}
              >
                Share Delivery Menu
              </div>

              {/* Realistic QR Code */}
              <div
                style={{
                  padding: '16px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  marginBottom: '14px',
                }}
              >
                <DeliveryQr value={deliveryUrl} />
              </div>
              <div style={{ marginBottom: 12, color: 'var(--color-muted-foreground)', fontSize: '0.78rem' }}>{publicMenuStatus()}</div>

              <div
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  color: 'var(--color-foreground)',
                  marginBottom: '12px',
                }}
              >
                Delivery Menu
              </div>

              {/* Red Dotted Link Box matching Screenshot 5 */}
              <div
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1.5px dashed #EF4444',
                  backgroundColor: 'rgba(239, 68, 68, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  boxSizing: 'border-box',
                }}
              >
                <span
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: 'var(--r8-brand-primary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {deliveryUrl}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    onClick={copyToClipboard}
                    title="Copy Link"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--r8-brand-primary)',
                      padding: '4px',
                    }}
                  >
                    {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                  <button
                    title="Download QR"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--r8-brand-primary)',
                      padding: '4px',
                    }}
                  >
                    <Download size={16} />
                  </button>
                  <button
                    title="Print QR"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--r8-brand-primary)',
                      padding: '4px',
                    }}
                  >
                    <Printer size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Charges matching Screenshot 5 */}
            <div
              style={{
                backgroundColor: 'var(--color-card)',
                borderRadius: '12px',
                border: '1px solid var(--color-border)',
                padding: '20px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
                  Charges
                </span>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-muted-foreground)',
                  }}
                >
                  <Edit2 size={15} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                      Fixed Delivery Charge
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-foreground)', marginTop: '2px' }}>
                      Delivery charge of Rs 0 will be added in the bill.
                    </div>
                  </div>
                  <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                    Rs 0
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                      Free Delivery Above
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-foreground)', marginTop: '2px' }}>
                      Home delivery will be free for orders above Rs 0.
                    </div>
                  </div>
                  <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                    Rs 0
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                      Minimum Cart Value for Delivery
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-foreground)', marginTop: '2px' }}>
                      Minimum cart value for delivery should be Rs 0.
                    </div>
                  </div>
                  <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                    Rs 0
                  </span>
                </div>
              </div>
            </div>

            {/* Card 3: Information Shown in Menu matching Screenshot 5 */}
            <div
              style={{
                backgroundColor: 'var(--color-card)',
                borderRadius: '12px',
                border: '1px solid var(--color-border)',
                padding: '20px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
                  Information Shown in Menu
                </span>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-muted-foreground)',
                  }}
                >
                  <Edit2 size={15} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
                <div style={{ display: 'flex' }}>
                  <span style={{ width: '80px', color: 'var(--color-muted-foreground)', fontWeight: 600 }}>
                    Name
                  </span>
                  <span style={{ margin: '0 8px' }}>:</span>
                  <span style={{ fontWeight: 700, color: 'var(--color-foreground)' }}>
                    {restaurantName}
                  </span>
                </div>
                <div style={{ display: 'flex' }}>
                  <span style={{ width: '80px', color: 'var(--color-muted-foreground)', fontWeight: 600 }}>
                    Phone
                  </span>
                  <span style={{ margin: '0 8px' }}>:</span>
                  <span style={{ fontWeight: 700, color: 'var(--color-foreground)' }}>
                    +977 9821828807
                  </span>
                </div>
                <div style={{ display: 'flex' }}>
                  <span style={{ width: '80px', color: 'var(--color-muted-foreground)', fontWeight: 600 }}>
                    Address
                  </span>
                  <span style={{ margin: '0 8px' }}>:</span>
                  <span style={{ fontWeight: 700, color: 'var(--color-foreground)' }}>
                    {restaurantName}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 4: QR Attachment Preview */}
            <div
              style={{
                backgroundColor: 'var(--color-card)',
                borderRadius: '12px',
                border: '1px solid var(--color-border)',
                padding: '20px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
                QR Attachment Preview
              </span>
              <div
                style={{
                  marginTop: '12px',
                  height: '100px',
                  backgroundColor: 'var(--color-muted)',
                  borderRadius: '8px',
                  border: '1px dashed var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.78rem',
                  color: 'var(--color-muted-foreground)',
                }}
              >
                No attachment uploaded
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Opening Hour Tab */}
      {activeSubTab === 'hours' && (
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            padding: '24px',
            maxWidth: '600px',
          }}
        >
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 800 }}>Delivery Operating Hours</h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--color-muted-foreground)', marginBottom: '20px' }}>
            Set delivery dispatch hours for online customers.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
              <div key={day} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.86rem', padding: '6px 0', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ fontWeight: 700 }}>{day}</span>
                <span style={{ color: '#10B981', fontWeight: 600 }}>09:00 AM - 10:00 PM</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delivery Partners Tab */}
      {activeSubTab === 'partners' && (
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            padding: '24px',
            maxWidth: '700px',
          }}
        >
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 800 }}>Nepal Delivery Integrations</h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--color-muted-foreground)', marginBottom: '20px' }}>
            Connect with local delivery aggregator fleets in Nepal.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div style={{ padding: '16px', border: '1px solid var(--color-border)', borderRadius: '10px' }}>
              <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>Foodmandu</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-muted-foreground)', marginTop: '4px' }}>Kathmandu Valley Network</div>
              <button style={{ marginTop: '12px', padding: '6px 12px', borderRadius: '6px', backgroundColor: '#ECFDF5', color: '#10B981', border: 'none', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>Connected</button>
            </div>
            <div style={{ padding: '16px', border: '1px solid var(--color-border)', borderRadius: '10px' }}>
              <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>Pathao Food</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-muted-foreground)', marginTop: '4px' }}>Express Rider Network</div>
              <button style={{ marginTop: '12px', padding: '6px 12px', borderRadius: '6px', backgroundColor: '#ECFDF5', color: '#10B981', border: 'none', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>Connected</button>
            </div>
            <div style={{ padding: '16px', border: '1px solid var(--color-border)', borderRadius: '10px' }}>
              <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>In-House Riders</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-muted-foreground)', marginTop: '4px' }}>Direct restaurant fleet</div>
              <button style={{ marginTop: '12px', padding: '6px 12px', borderRadius: '6px', backgroundColor: '#ECFDF5', color: '#10B981', border: 'none', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>Active</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
