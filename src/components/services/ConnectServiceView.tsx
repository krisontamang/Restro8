import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';

export const ConnectServiceView: React.FC = () => {
  const { addToast } = useRestaurant();
  const [activeTab, setActiveTab] = useState<'settings' | 'banners'>('settings');

  // Authentication toggles
  const [customerReg, setCustomerReg] = useState(true);
  const [phoneLogin, setPhoneLogin] = useState(true);
  const [emailLogin, setEmailLogin] = useState(true);
  const [guestCheckout, setGuestCheckout] = useState(true);

  // Customer Portal toggles
  const [invoicePreview, setInvoicePreview] = useState(true);
  const [orderHistory, setOrderHistory] = useState(true);
  const [pastTransactions, setPastTransactions] = useState(true);
  const [loyaltyStamps, setLoyaltyStamps] = useState(true);

  // Customer Profile toggles
  const [diningPreferences, setDiningPreferences] = useState(true);
  const [setAllergies, setSetAllergies] = useState(true);
  const [addressBook, setAddressBook] = useState(true);

  const renderToggle = (checked: boolean, onToggle: () => void) => (
    <button
      onClick={onToggle}
      style={{
        width: '42px',
        height: '24px',
        borderRadius: '24px',
        backgroundColor: checked ? '#10B981' : '#E5E7EB',
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
          left: checked ? '21px' : '3px',
          transition: 'left 0.2s',
          boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
        }}
      />
    </button>
  );

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <h1
        style={{
          fontSize: '1.45rem',
          fontWeight: 900,
          margin: '0 0 16px 0',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          color: 'var(--color-foreground)',
        }}
      >
        Connect
      </h1>

      {/* Sub Tabs matching Screenshot 4 */}
      <div
        style={{
          display: 'flex',
          backgroundColor: 'var(--color-muted)',
          padding: '4px',
          borderRadius: '10px',
          gap: '6px',
          width: 'fit-content',
          marginBottom: '26px',
        }}
      >
        <button
          onClick={() => setActiveTab('settings')}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: activeTab === 'settings' ? 'var(--r8-brand-primary)' : 'transparent',
            color: activeTab === 'settings' ? '#FFFFFF' : 'var(--color-muted-foreground)',
            fontSize: '0.84rem',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          Settings
        </button>
        <button
          onClick={() => setActiveTab('banners')}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: activeTab === 'banners' ? 'var(--r8-brand-primary)' : 'transparent',
            color: activeTab === 'banners' ? '#FFFFFF' : 'var(--color-muted-foreground)',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Banners & Promotions
        </button>
      </div>

      {activeTab === 'settings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* Section 1: Authentication matching Screenshot 4 */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.96rem',
                fontWeight: 800,
                color: 'var(--color-foreground)',
                marginBottom: '14px',
              }}
            >
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#6B7280' }} />
              <span>Authentication</span>
            </div>

            <div
              style={{
                backgroundColor: 'var(--color-card)',
                borderRadius: '14px',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-sm)',
                overflow: 'hidden',
              }}
            >
              {/* Item 1: Customer Registration */}
              <div
                style={{
                  padding: '18px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                    Customer Registration
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)', marginTop: '2px' }}>
                    Allow customers to create a new account.
                  </div>
                </div>
                {renderToggle(customerReg, () => setCustomerReg(!customerReg))}
              </div>

              {/* Item 2: Phone Login */}
              <div
                style={{
                  padding: '18px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                    Phone Login
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)', marginTop: '2px' }}>
                    Let customers sign in with their phone number.
                  </div>
                </div>
                {renderToggle(phoneLogin, () => setPhoneLogin(!phoneLogin))}
              </div>

              {/* Item 3: Email Login */}
              <div
                style={{
                  padding: '18px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                    Email Login
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)', marginTop: '2px' }}>
                    Allow customers to sign in with email.
                  </div>
                </div>
                {renderToggle(emailLogin, () => setEmailLogin(!emailLogin))}
              </div>

              {/* Item 4: Allow Guest Checkout */}
              <div
                style={{
                  padding: '18px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                    Allow Guest Checkout
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)', marginTop: '2px' }}>
                    Let customers order without an account.
                  </div>
                </div>
                {renderToggle(guestCheckout, () => setGuestCheckout(!guestCheckout))}
              </div>
            </div>
          </div>

          {/* Section 2: Customer Portal matching Screenshot 4 */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.96rem',
                fontWeight: 800,
                color: 'var(--color-foreground)',
                marginBottom: '14px',
              }}
            >
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#6B7280' }} />
              <span>Customer Portal</span>
            </div>

            <div
              style={{
                backgroundColor: 'var(--color-card)',
                borderRadius: '14px',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-sm)',
                overflow: 'hidden',
              }}
            >
              {/* Item 1: Invoice Preview */}
              <div
                style={{
                  padding: '18px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                    Invoice Preview
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)', marginTop: '2px' }}>
                    Let customers preview their invoice.
                  </div>
                </div>
                {renderToggle(invoicePreview, () => setInvoicePreview(!invoicePreview))}
              </div>

              {/* Item 2: Order History */}
              <div
                style={{
                  padding: '18px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                    Order History
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)', marginTop: '2px' }}>
                    Show customers their past orders.
                  </div>
                </div>
                {renderToggle(orderHistory, () => setOrderHistory(!orderHistory))}
              </div>

              {/* Item 3: Past Transactions */}
              <div
                style={{
                  padding: '18px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                    Past Transactions
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)', marginTop: '2px' }}>
                    Show customers their past payments.
                  </div>
                </div>
                {renderToggle(pastTransactions, () => setPastTransactions(!pastTransactions))}
              </div>

              {/* Item 4: Loyalty Stamps */}
              <div
                style={{
                  padding: '18px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                    Loyalty Stamps
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)', marginTop: '2px' }}>
                    Let customers view and redeem stamps.
                  </div>
                </div>
                {renderToggle(loyaltyStamps, () => setLoyaltyStamps(!loyaltyStamps))}
              </div>
            </div>
          </div>

          {/* Section 3: Customer Profile matching Screenshot 5 */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.96rem',
                fontWeight: 800,
                color: 'var(--color-foreground)',
                marginBottom: '14px',
              }}
            >
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#6B7280' }} />
              <span>Customer Profile</span>
            </div>

            <div
              style={{
                backgroundColor: 'var(--color-card)',
                borderRadius: '14px',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-sm)',
                overflow: 'hidden',
              }}
            >
              {/* Item 1: Set Dining Preferences */}
              <div
                style={{
                  padding: '18px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                    Set Dining Preferences
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)', marginTop: '2px' }}>
                    Let customers save dining preferences.
                  </div>
                </div>
                {renderToggle(diningPreferences, () => setDiningPreferences(!diningPreferences))}
              </div>

              {/* Item 2: Set Allergies */}
              <div
                style={{
                  padding: '18px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                    Set Allergies
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)', marginTop: '2px' }}>
                    Let customers save allergy details.
                  </div>
                </div>
                {renderToggle(setAllergies, () => setSetAllergies(!setAllergies))}
              </div>

              {/* Item 3: Add Address Book */}
              <div
                style={{
                  padding: '18px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                    Add Address Book
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)', marginTop: '2px' }}>
                    Let customers save delivery addresses.
                  </div>
                </div>
                {renderToggle(addressBook, () => setAddressBook(!addressBook))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Banners & Promotions Tab matching Screenshot 1 */}
      {activeTab === 'banners' && (
        <div
          style={{
            padding: '80px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
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
              fontSize: '1.25rem',
              fontWeight: 900,
              color: 'var(--color-foreground)',
              margin: '0 0 8px 0',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            No banners found
          </h3>
          <p
            style={{
              fontSize: '0.86rem',
              color: 'var(--color-muted-foreground)',
              margin: '0 0 22px 0',
            }}
          >
            Create your first banner to showcase offers on the customer app.
          </p>

          <button
            onClick={() => addToast('Banner Creator', 'Banner creation modal: Upload promotional banner for customer portal.', 'info')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 22px',
              borderRadius: '8px',
              backgroundColor: 'var(--r8-brand-primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '0.88rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(14, 165, 233, 0.35)',
            }}
          >
            + Add Banner
          </button>
        </div>
      )}
    </div>
  );
};
