import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import {
  Calendar,
  ChevronRight,
  ChevronDown,
  FileText,
} from 'lucide-react';

export const DineInServiceView: React.FC = () => {
  const { settings } = useRestaurant();
  const restaurantName = settings.name.trim() || 'Your restaurant';
  // Settings Toggles
  const [status, setStatus] = useState(true);
  const [activeMenuSet, setActiveMenuSet] = useState('Default Menuset');
  const [viewInvoice, setViewInvoice] = useState(true);
  const [viewKOT, setViewKOT] = useState(true);
  const [checkIn, setCheckIn] = useState(false);
  const [requireConfirmation, setRequireConfirmation] = useState(true);

  return (
    <div style={{ padding: '24px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Title */}
      <h1
        style={{
          fontSize: '1.45rem',
          fontWeight: 900,
          margin: '0 0 20px 0',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          color: 'var(--color-foreground)',
        }}
      >
        Dine In Service
      </h1>

      {/* Main 2-Column Grid matching Screenshot 3 & 4 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.3fr) minmax(360px, 420px)',
          gap: '32px',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Settings Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Section: Status and Menu set */}
          <div>
            <h2
              style={{
                fontSize: '1rem',
                fontWeight: 800,
                color: 'var(--color-foreground)',
                marginBottom: '14px',
              }}
            >
              Status and Menu set
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Card 1: Status */}
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
                    This means you are serving dine in service in your restaurant or not.
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

              {/* Card 2: Active Menu Set */}
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
                    <option value="Evening Special Menu">Evening Special Menu</option>
                    <option value="Weekend Brunch Menu">Weekend Brunch Menu</option>
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

              {/* Card 3: Menuset Schedule */}
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
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginBottom: '16px',
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
                      Menuset Schedule
                    </div>
                    <div
                      style={{
                        fontSize: '0.82rem',
                        color: 'var(--color-muted-foreground)',
                      }}
                    >
                      Schedule active menuset according to time and day.
                    </div>
                  </div>

                  <button
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--r8-brand-primary)',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(14, 165, 233, 0.35)',
                    }}
                  >
                    <Calendar size={15} /> Schedule Menuset
                  </button>
                </div>

                {/* Schedules Table */}
                <div
                  style={{
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 14px',
                      backgroundColor: 'var(--color-muted)',
                      borderBottom: '1px solid var(--color-border)',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                    }}
                  >
                    <span>Schedules</span>
                    <button
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-muted-foreground)',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      View All <ChevronRight size={13} />
                    </button>
                  </div>

                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--color-border)', fontSize: '0.78rem', color: 'var(--color-muted-foreground)' }}>
                        <th style={{ padding: '10px 14px' }}>Menu Set</th>
                        <th style={{ padding: '10px 14px' }}>Day</th>
                        <th style={{ padding: '10px 14px' }}>Start Time</th>
                        <th style={{ padding: '10px 14px' }}>End Time</th>
                        <th style={{ padding: '10px 14px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td
                          colSpan={5}
                          style={{
                            padding: '24px 14px',
                            textAlign: 'center',
                            fontSize: '0.82rem',
                            color: 'var(--color-muted-foreground)',
                          }}
                        >
                          No schedules
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
              {/* Other 1: View Invoice */}
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
                      left: viewInvoice ? '21px' : '3px',
                      transition: 'left 0.2s',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                    }}
                  />
                </button>
              </div>

              {/* Other 2: View KOT */}
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
                      left: viewKOT ? '21px' : '3px',
                      transition: 'left 0.2s',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                    }}
                  />
                </button>
              </div>

              {/* Other 3: Check-In */}
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
                    Check-In
                  </div>
                  <div
                    style={{
                      fontSize: '0.82rem',
                      color: 'var(--color-muted-foreground)',
                    }}
                  >
                    While creating order you can add check-in option for dine-in customers details.
                  </div>
                </div>

                <button
                  onClick={() => setCheckIn(!checkIn)}
                  style={{
                    width: '42px',
                    height: '24px',
                    borderRadius: '24px',
                    backgroundColor: checkIn ? '#10B981' : '#E5E7EB',
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
                      left: checkIn ? '21px' : '3px',
                      transition: 'left 0.2s',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                    }}
                  />
                </button>
              </div>

              {/* Other 4: Require Order Confirmation (Screenshot 4) */}
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
                      left: requireConfirmation ? '21px' : '3px',
                      transition: 'left 0.2s',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Realistic Mobile Mockup matching Screenshot 3 & 4 */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              width: '320px',
              backgroundColor: '#1E293B',
              borderRadius: '42px',
              padding: '10px',
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.1)',
            }}
          >
            {/* Phone Bezel Interior Screen */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '34px',
                overflow: 'hidden',
                color: '#1F2937',
                fontSize: '0.8rem',
                minHeight: '620px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                {/* Phone Status Bar + Dynamic Island */}
                <div
                  style={{
                    padding: '8px 18px 4px 18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                  }}
                >
                  <span>08:31</span>
                  {/* Dynamic Island pill */}
                  <div
                    style={{
                      width: '80px',
                      height: '18px',
                      backgroundColor: '#000000',
                      borderRadius: '12px',
                    }}
                  />
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <div style={{ width: '12px', height: '8px', border: '1px solid #000', borderRadius: '2px' }} />
                  </div>
                </div>

                {/* Restaurant Brand Header in Mobile */}
                <div
                  style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid #F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#EDE9FE',
                        color: '#6366F1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                      }}
                    >
                      CD
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '0.86rem' }}>
                      {restaurantName}
                    </span>
                  </div>

                  <span
                    style={{
                      padding: '3px 8px',
                      backgroundColor: '#F3F4F6',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#4B5563',
                    }}
                  >
                    Table 05
                  </span>
                </div>

                {/* Mobile Action Cards */}
                <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Total Invoice Card */}
                  <div
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                      backgroundColor: '#FAFAFA',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <FileText size={16} color="#4B5563" style={{ marginTop: '2px' }} />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#111827' }}>
                          Total Invoice
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#6B7280', marginTop: '1px' }}>
                          No need to call waiter, view your final bill here.
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={16} color="#9CA3AF" />
                  </div>

                  {/* Your Order Card */}
                  <div
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                      backgroundColor: '#FAFAFA',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: '2px',
                        }}
                      >
                        🍜
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#111827' }}>
                          Your Order
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#6B7280', marginTop: '1px' }}>
                          You can view your past orders & status here.
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={16} color="#9CA3AF" />
                  </div>

                  {/* Connect with us Section */}
                  <div style={{ marginTop: '10px' }}>
                    <div
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#6B7280',
                        marginBottom: '8px',
                      }}
                    >
                      Connect with us
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                      <div
                        style={{
                          padding: '8px 4px',
                          border: '1px solid #E2E8F0',
                          borderRadius: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                      </div>

                      <div
                        style={{
                          padding: '8px 4px',
                          border: '1px solid #E2E8F0',
                          borderRadius: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <rect x="2" y="2" width="20" height="20" rx="5" stroke="#E4405F" strokeWidth="2" />
                          <circle cx="12" cy="12" r="4" stroke="#E4405F" strokeWidth="2" />
                          <circle cx="17.5" cy="6.5" r="1" fill="#E4405F" />
                        </svg>
                        Instagram
                      </div>

                      <div
                        style={{
                          padding: '8px 4px',
                          border: '1px solid #E2E8F0',
                          borderRadius: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        <span style={{ fontSize: '13px', fontWeight: 900 }}>🎵</span>
                        TikTok
                      </div>
                    </div>
                  </div>

                  {/* Google Review Card */}
                  <div
                    style={{
                      marginTop: '8px',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: '0.76rem', color: '#111827', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ color: '#4285F4' }}>G</span>
                      <span>Review us on Google 🌟</span>
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#6B7280', marginTop: '3px' }}>
                      Your feedback means us good. Please give us your review.
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Footer: Powered by RestroX */}
              <div
                style={{
                  padding: '12px',
                  textAlign: 'center',
                  fontSize: '0.72rem',
                  color: '#9CA3AF',
                  borderTop: '1px solid #F3F4F6',
                }}
              >
                powered by{' '}
                <span style={{ fontWeight: 900, color: '#111827' }}>
                  RESTRO<span style={{ color: 'var(--r8-brand-primary)' }}>8</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
