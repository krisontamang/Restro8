import React, { useState } from 'react';
import {
  Crown,
  ChevronLeft,
  Check,
  X,
  Info,
  Users,
  LayoutGrid,
  Tag,
  Soup,
  Layers,
  Box,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { SubscriptionCheckoutView } from './SubscriptionCheckoutView';

export const BillingSubscriptionView: React.FC = () => {
  const { addToast } = useRestaurant();
  const [viewMode, setViewMode] = useState<'overview' | 'pricing' | 'checkout'>('overview');
  const [billingCycle, setBillingCycle] = useState<'yearly' | 'semi-annual'>('yearly');
  const [matrixCycle, setMatrixCycle] = useState<'1 Year' | '6 Months'>('1 Year');
  const [showComparisonMatrix, setShowComparisonMatrix] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<'Basic' | 'Premium' | 'Platinum'>('Premium');
  const [checkoutCycle, setCheckoutCycle] = useState<'6 Months' | 'Yearly'>('6 Months');

  const handleRenew = () => {
    setCheckoutPlan('Premium');
    setCheckoutCycle('Yearly');
    setViewMode('checkout');
  };

  const handleSelectPlan = (plan: string) => {
    if (plan === 'Free') {
      addToast('Plan Downgraded', 'Your account has been switched to the Free plan.', 'info');
      setViewMode('overview');
      return;
    }
    setCheckoutPlan(plan as any);
    setCheckoutCycle(billingCycle === 'yearly' ? 'Yearly' : '6 Months');
    setViewMode('checkout');
  };


  if (viewMode === 'checkout') {
    return (
      <SubscriptionCheckoutView
        onBack={() => setViewMode('pricing')}
        initialPlan={checkoutPlan}
        initialCycle={checkoutCycle}
      />
    );
  }

  if (viewMode === 'pricing') {
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
        {/* Pricing Header: Back to Billing & RestroX Brand Logo matching Screenshot 4 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '32px',
          }}
        >
          <button
            type="button"
            onClick={() => setViewMode('overview')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-card)',
              color: 'var(--color-foreground)',
              fontSize: '0.84rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <ChevronLeft size={16} />
            <span>Back to Billing</span>
          </button>

          {/* Centered RestroX Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '28px',
                height: '24px',
                backgroundColor: 'var(--r8-brand-primary)',
                clipPath: 'polygon(0 0, 45% 0, 100% 100%, 55% 100%, 0 25%)',
                borderRadius: '3px',
              }}
            />
            <span
              style={{
                fontSize: '1.4rem',
                fontWeight: 800,
                color: '#111827',
                letterSpacing: '-0.02em',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Restro<span style={{ color: 'var(--r8-brand-primary)' }}>X</span>
            </span>
          </div>

          <div style={{ width: '120px' }} />
        </div>

        {/* Pricing Cards Grid matching Screenshot 4 */}
        <div
          className="billing-pricing-grid"
          style={{
            alignItems: 'stretch',
            maxWidth: '1240px',
            margin: '0 auto',
          }}
        >
          {/* Left Column: Hero Title & Free Plan */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h2
                style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  lineHeight: '1.15',
                  margin: '0 0 8px 0',
                  color: 'var(--color-foreground)',
                  letterSpacing: '-0.03em',
                }}
              >
                Simple and<br />
                <span style={{ color: 'var(--r8-brand-primary)' }}>Flexible Pricing</span>
              </h2>
              <p
                style={{
                  fontSize: '0.84rem',
                  color: 'var(--color-muted-foreground)',
                  lineHeight: '1.4',
                  margin: 0,
                }}
              >
                No hidden fees, what you see is what you pay. Upgrade anytime, or cancel whenever you want.
              </p>
            </div>

            {/* Free Card */}
            <div
              style={{
                backgroundColor: 'var(--color-card)',
                borderRadius: '16px',
                border: '1px solid var(--color-border)',
                padding: '24px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flex: 1,
              }}
            >
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
                  Free
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--color-muted-foreground)', marginTop: '2px', marginBottom: '16px' }}>
                  Free Forever
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--color-foreground)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={14} color="#10B981" />
                    <span>Up to 2 Members Login</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={14} color="#10B981" />
                    <span>Up to 10 Tables</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={14} color="#10B981" />
                    <span>Up to 100 Dishes</span>
                  </div>

                  <div style={{ fontSize: '0.84rem', fontWeight: 700, margin: '8px 0 2px 0' }}>
                    Key Features
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={14} color="#10B981" />
                    <span>Unlimited Dine in Orders</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={14} color="#10B981" />
                    <span>Up to 100 delivery orders per Month</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={14} color="#10B981" />
                    <span>Unlimited Digital Menu(QR Code)</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectPlan('Free')}
                style={{
                  marginTop: '24px',
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-card)',
                  color: 'var(--color-foreground)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Downgrade to Free
              </button>
            </div>
          </div>

          {/* Plan 1: Basic Plan (Blue) */}
          <div
            style={{
              backgroundColor: 'var(--color-card)',
              borderRadius: '16px',
              border: '1.5px solid #93C5FD',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              {/* Cycle Toggle inside Card Header */}
              <div
                style={{
                  display: 'inline-flex',
                  padding: '2px',
                  borderRadius: '10px',
                  backgroundColor: '#3B82F6',
                  width: '100%',
                  boxSizing: 'border-box',
                  marginBottom: '16px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setBillingCycle('yearly')}
                  style={{
                    flex: 1,
                    padding: '5px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    border: 'none',
                    backgroundColor: billingCycle === 'yearly' ? '#FFF' : 'transparent',
                    color: billingCycle === 'yearly' ? '#1D4ED8' : '#FFF',
                    cursor: 'pointer',
                  }}
                >
                  Yearly
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('semi-annual')}
                  style={{
                    flex: 1,
                    padding: '5px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    border: 'none',
                    backgroundColor: billingCycle === 'semi-annual' ? '#FFF' : 'transparent',
                    color: billingCycle === 'semi-annual' ? '#1D4ED8' : '#FFF',
                    cursor: 'pointer',
                  }}
                >
                  Semi-Annual
                </button>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
                  Basic
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-foreground)', marginTop: '4px' }}>
                  Rs {billingCycle === 'yearly' ? '12,000' : '7,000'}
                  <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-muted-foreground)' }}>
                    /{billingCycle === 'yearly' ? 'Year' : '6 Mo'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectPlan('Basic')}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #3B82F6',
                  backgroundColor: '#FFF',
                  color: '#1D4ED8',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginBottom: '20px',
                }}
              >
                Downgrade Plan
              </button>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--color-foreground)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} color="#3B82F6" />
                  <span>Up to 5 Members Login</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} color="#3B82F6" />
                  <span>Up to 20 Tables</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} color="#3B82F6" />
                  <span>Up to 250 Dishes</span>
                </div>

                <div style={{ fontSize: '0.84rem', fontWeight: 700, margin: '8px 0 2px 0' }}>
                  Everything in Free, Plus
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} color="#3B82F6" />
                  <span>Unlimited Direct Orders from Customers</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} color="#3B82F6" />
                  <span>Unlimited Space & Floor Management</span>
                </div>
              </div>
            </div>
          </div>

          {/* Plan 2: Premium Plan (Green - Most Popular) matching Screenshot 4 */}
          <div
            style={{
              backgroundColor: 'var(--color-card)',
              borderRadius: '16px',
              border: '2px solid #10B981',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              boxShadow: '0 8px 24px rgba(16,185,129,0.08)',
            }}
          >
            {/* Most Popular Red Pill Badge */}
            <div
              style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#DC2626',
                color: '#FFF',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '3px 12px',
                borderRadius: '12px',
                letterSpacing: '0.3px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
              }}
            >
              ★ Most Popular
            </div>

            <div>
              {/* Cycle Toggle inside Card Header */}
              <div
                style={{
                  display: 'inline-flex',
                  padding: '2px',
                  borderRadius: '10px',
                  backgroundColor: '#10B981',
                  width: '100%',
                  boxSizing: 'border-box',
                  marginBottom: '16px',
                  marginTop: '4px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setBillingCycle('yearly')}
                  style={{
                    flex: 1,
                    padding: '5px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    border: 'none',
                    backgroundColor: billingCycle === 'yearly' ? '#FFF' : 'transparent',
                    color: billingCycle === 'yearly' ? '#047857' : '#FFF',
                    cursor: 'pointer',
                  }}
                >
                  Yearly
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('semi-annual')}
                  style={{
                    flex: 1,
                    padding: '5px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    border: 'none',
                    backgroundColor: billingCycle === 'semi-annual' ? '#FFF' : 'transparent',
                    color: billingCycle === 'semi-annual' ? '#047857' : '#FFF',
                    cursor: 'pointer',
                  }}
                >
                  Semi-Annual
                </button>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
                  Premium
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-foreground)', marginTop: '4px' }}>
                  Rs {billingCycle === 'yearly' ? '24,000' : '14,000'}
                  <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-muted-foreground)' }}>
                    /{billingCycle === 'yearly' ? 'Year' : '6 Mo'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRenew}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #10B981',
                  backgroundColor: '#FFF',
                  color: '#047857',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginBottom: '20px',
                }}
              >
                Renew Plan
              </button>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--color-foreground)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} color="#10B981" />
                  <span>Up to 24 Members Login</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} color="#10B981" />
                  <span>Up to 50 Tables</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} color="#10B981" />
                  <span>Up to 1000 Dishes</span>
                </div>

                <div style={{ fontSize: '0.84rem', fontWeight: 700, margin: '8px 0 2px 0' }}>
                  Everything in Basic, Plus
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} color="#10B981" />
                  <span>Financial Management & Reports</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} color="#10B981" />
                  <span>Automatic Inventory</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} color="#10B981" />
                  <span>Advanced Menu Setup</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} color="#10B981" />
                  <span>Custom User Role</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} color="#10B981" />
                  <span>Chat & Call Support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Plan 3: Platinum Plan (Purple) */}
          <div
            style={{
              backgroundColor: 'var(--color-card)',
              borderRadius: '16px',
              border: '1.5px solid #C4B5FD',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              {/* Cycle Toggle inside Card Header */}
              <div
                style={{
                  display: 'inline-flex',
                  padding: '2px',
                  borderRadius: '10px',
                  backgroundColor: '#8B5CF6',
                  width: '100%',
                  boxSizing: 'border-box',
                  marginBottom: '16px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setBillingCycle('yearly')}
                  style={{
                    flex: 1,
                    padding: '5px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    border: 'none',
                    backgroundColor: billingCycle === 'yearly' ? '#FFF' : 'transparent',
                    color: billingCycle === 'yearly' ? '#6D28D9' : '#FFF',
                    cursor: 'pointer',
                  }}
                >
                  Yearly
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('semi-annual')}
                  style={{
                    flex: 1,
                    padding: '5px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    border: 'none',
                    backgroundColor: billingCycle === 'semi-annual' ? '#FFF' : 'transparent',
                    color: billingCycle === 'semi-annual' ? '#6D28D9' : '#FFF',
                    cursor: 'pointer',
                  }}
                >
                  Semi-Annual
                </button>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
                  Platinum
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-foreground)', marginTop: '4px' }}>
                  Rs {billingCycle === 'yearly' ? '60,000' : '35,000'}
                  <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-muted-foreground)' }}>
                    /{billingCycle === 'yearly' ? 'Year' : '6 Mo'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectPlan('Platinum')}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #8B5CF6',
                  backgroundColor: '#FFF',
                  color: '#6D28D9',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginBottom: '20px',
                }}
              >
                Upgrade Plan
              </button>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--color-foreground)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} color="#8B5CF6" />
                  <span>Unlimited Members Login</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} color="#8B5CF6" />
                  <span>Unlimited Tables</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} color="#8B5CF6" />
                  <span>Unlimited Dishes</span>
                </div>

                <div style={{ fontSize: '0.84rem', fontWeight: 700, margin: '8px 0 2px 0' }}>
                  Everything in Premium, Plus
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} color="#8B5CF6" />
                  <span>Unlimited Inventory</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} color="#8B5CF6" />
                  <span>Custom Domain</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} color="#8B5CF6" />
                  <span>Unlimited Activity Logs</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} color="#8B5CF6" />
                  <span>24/7 Call Support</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} color="#8B5CF6" />
                  <span>100% Uptime</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Footer & Compare all plans Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '1240px',
            margin: '36px auto 20px auto',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)' }}>
            All prices are in NPR and charged per restaurant with applicable taxes added at checkout.
          </div>

          <button
            type="button"
            onClick={() => setShowComparisonMatrix((p) => !p)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-card)',
              color: 'var(--color-foreground)',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <span>Compare all plans</span>
            <ChevronDown size={14} style={{ transform: showComparisonMatrix ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
        </div>

        {/* Comparison Matrix Table matching Screenshot 5 */}
        {showComparisonMatrix && (
          <div
            style={{
              maxWidth: '1240px',
              margin: '20px auto 40px auto',
              backgroundColor: 'var(--color-card)',
              borderRadius: '16px',
              border: '1px solid var(--color-border)',
              overflow: 'hidden',
              padding: '24px',
            }}
          >
            {/* Cycle Toggle inside Table */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  padding: '3px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: '#FFF',
                }}
              >
                <button
                  type="button"
                  onClick={() => setMatrixCycle('1 Year')}
                  style={{
                    padding: '6px 20px',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    border: 'none',
                    backgroundColor: matrixCycle === '1 Year' ? 'var(--r8-brand-primary)' : 'transparent',
                    color: matrixCycle === '1 Year' ? '#FFF' : 'var(--color-foreground)',
                    cursor: 'pointer',
                  }}
                >
                  1 Year
                </button>
                <button
                  type="button"
                  onClick={() => setMatrixCycle('6 Months')}
                  style={{
                    padding: '6px 20px',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    border: 'none',
                    backgroundColor: matrixCycle === '6 Months' ? 'var(--r8-brand-primary)' : 'transparent',
                    color: matrixCycle === '6 Months' ? '#FFF' : 'var(--color-foreground)',
                    cursor: 'pointer',
                  }}
                >
                  6 Months
                </button>
              </div>

              {/* Plans Header Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '140px 140px 160px 140px', gap: '16px', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-muted-foreground)' }}>Free</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800 }}>Free Forever</div>
                  <button
                    type="button"
                    onClick={() => handleSelectPlan('Free')}
                    style={{
                      marginTop: '6px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'transparent',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Downgrade Plan
                  </button>
                </div>

                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-muted-foreground)' }}>Basic</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800 }}>Rs 12,000<span style={{ fontSize: '0.72rem', fontWeight: 400 }}>/1 Year</span></div>
                  <button
                    type="button"
                    onClick={() => handleSelectPlan('Basic')}
                    style={{
                      marginTop: '6px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'transparent',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Downgrade Plan
                  </button>
                </div>

                <div
                  style={{
                    backgroundColor: '#FEF2F2',
                    padding: '8px 10px',
                    borderRadius: '10px',
                    border: '1px solid #FCA5A5',
                    position: 'relative',
                  }}
                >
                  <div style={{ fontSize: '0.7rem', color: '#DC2626', fontWeight: 700 }}>👑 Recommended</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-muted-foreground)' }}>Premium</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800 }}>Rs 24,000<span style={{ fontSize: '0.72rem', fontWeight: 400 }}>/1 Year</span></div>
                  <button
                    type="button"
                    onClick={handleRenew}
                    style={{
                      marginTop: '6px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: 'var(--r8-brand-primary)',
                      color: '#FFF',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Renew Plan
                  </button>
                </div>

                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-muted-foreground)' }}>Platinum</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800 }}>Rs 60,000<span style={{ fontSize: '0.72rem', fontWeight: 400 }}>/1 Year</span></div>
                  <button
                    type="button"
                    onClick={() => handleSelectPlan('Platinum')}
                    style={{
                      marginTop: '6px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'transparent',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Upgrade Plan
                  </button>
                </div>
              </div>
            </div>

            {/* Matrix Feature Groups matching Screenshots 1, 2, and 5 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {/* Group 1: Orders matching Screenshot 2 */}
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '12px', color: 'var(--color-foreground)' }}>
                  Orders
                </div>
                <MatrixRow feature="Dine In Orders" free={<Check size={16} color="#10B981" />} basic={<Check size={16} color="#10B981" />} premium={<Check size={16} color="#10B981" />} platinum={<Check size={16} color="#10B981" />} />
                <MatrixRow feature="Delivery Orders" free="100/month" basic="Unlimited" premium="Unlimited" platinum="Unlimited" />
                <MatrixRow feature="Reservation Orders" free={<X size={14} color="#EF4444" />} basic={<X size={14} color="#EF4444" />} premium={<Check size={16} color="#10B981" />} platinum={<Check size={16} color="#10B981" />} />
                <MatrixRow feature="Digital Menu Orders" free={<Check size={16} color="#10B981" />} basic={<Check size={16} color="#10B981" />} premium={<Check size={16} color="#10B981" />} platinum={<Check size={16} color="#10B981" />} />
                <MatrixRow feature="Customer Orders" free={<X size={14} color="#EF4444" />} basic={<Check size={16} color="#10B981" />} premium={<Check size={16} color="#10B981" />} platinum={<Check size={16} color="#10B981" />} />
                <MatrixRow feature="KOT History" free={<Check size={16} color="#10B981" />} basic={<Check size={16} color="#10B981" />} premium={<Check size={16} color="#10B981" />} platinum={<Check size={16} color="#10B981" />} />
              </div>

              {/* Group 2: Menu matching Screenshot 2 */}
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '12px', color: 'var(--color-foreground)' }}>
                  Menu
                </div>
                <MatrixRow feature="Dishes" free="100" basic="250" premium="1000" platinum="Unlimited" />
                <MatrixRow feature="Categories" free="10" basic="20" premium="100" platinum="100" />
                <MatrixRow feature="Add-Ons" free="5" basic="50" premium="250" platinum="500" />
                <MatrixRow feature="Submenus" free="3" basic="3" premium="20" platinum="50" />
                <MatrixRow feature="Menusets" free="1" basic="1" premium="5" platinum="10" />
              </div>

              {/* Group 3: Table & Spaces matching Screenshot 1 */}
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '12px', color: 'var(--color-foreground)' }}>
                  Table & Spaces
                </div>
                <MatrixRow feature="Table" free="10" basic="20" premium="50" platinum="Unlimited" />
                <MatrixRow feature="Spaces" free={<X size={14} color="#EF4444" />} basic="5" premium="10" platinum="50" />
              </div>

              {/* Group 4: Finance matching Screenshot 1 */}
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '12px', color: 'var(--color-foreground)' }}>
                  Finance
                </div>
                <MatrixRow feature="Day Book" free={<Check size={16} color="#10B981" />} basic={<Check size={16} color="#10B981" />} premium={<Check size={16} color="#10B981" />} platinum={<Check size={16} color="#10B981" />} />
                <MatrixRow feature="Income & Expense" free="5/day" basic="50/day" premium="Unlimited" platinum="Unlimited" />
                <MatrixRow feature="Payment In & Out" free="5/day" basic="50/day" premium="Unlimited" platinum="Unlimited" />
                <MatrixRow feature="Payment Accounts" free="3" basic="5" premium="20" platinum="40" />
                <MatrixRow feature="Payment Modes" free="3" basic="5" premium="20" platinum="50" />
                <MatrixRow feature="Reports" free="Basic" basic="Basic" premium="Advanced" platinum="Advanced" />
              </div>

              {/* Group 5: Inventory matching Screenshot 1 */}
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '12px', color: 'var(--color-foreground)' }}>
                  Inventory
                </div>
                <MatrixRow feature="Stock Listings" free={<X size={14} color="#EF4444" />} basic="100" premium="1000" platinum="Unlimited" />
                <MatrixRow
                  feature="Automatic Inventory"
                  free={<X size={14} color="#EF4444" />}
                  basic={<X size={14} color="#EF4444" />}
                  premium={<Check size={16} color="#10B981" />}
                  platinum={<Check size={16} color="#10B981" />}
                />
              </div>

              {/* Group 6: Parties */}
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '12px', color: 'var(--color-foreground)' }}>
                  Parties
                </div>
                <MatrixRow feature="Staffs" free="2" basic="5" premium="24" platinum="Unlimited" />
                <MatrixRow feature="Suppliers" free={<X size={14} color="#EF4444" />} basic="100" premium="500" platinum="Unlimited" />
                <MatrixRow feature="Customers" free="10" basic="30" premium="1000" platinum="Unlimited" />
              </div>

              {/* Group 7: Setting */}
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '12px', color: 'var(--color-foreground)' }}>
                  Setting
                </div>
                <MatrixRow
                  feature="Custom User Roles"
                  free={<X size={14} color="#EF4444" />}
                  basic={<X size={14} color="#EF4444" />}
                  premium={<Check size={16} color="#10B981" />}
                  platinum={<Check size={16} color="#10B981" />}
                />
                <MatrixRow feature="KOT Types" free="2" basic="5" premium="20" platinum="50" />
                <MatrixRow feature="Printers" free="2" basic="5" premium="10" platinum="50" />
              </div>

              {/* Group 8: Other */}
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '12px', color: 'var(--color-foreground)' }}>
                  Other
                </div>
                <MatrixRow feature="Support" free="Community" basic="Local Business Hours" premium="Local Business Hours" platinum="24/7 Premium Support" />
                <MatrixRow feature="Storage" free="100 MB" basic="10 GB" premium="250 GB" platinum="Unlimited" />
                <MatrixRow feature="Activity Logs" free="15 days" basic="30 days" premium="180 days" platinum="365 days" />
                <MatrixRow feature="Trash" free="15 days" basic="30 days" premium="60 days" platinum="90 days" />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main Billing Overview View matching Screenshot 3
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
      {/* Top Header matching Screenshot 3 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
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
            Billing & Subscription
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)', margin: 0 }}>
            Manage your RESTRO8 restaurant cloud licenses and subscriptions.
          </p>
        </div>
      </div>

      {/* Card 1: Active Subscription Plan matching Screenshot 3 */}
      <div
        style={{
          backgroundColor: 'var(--color-card)',
          borderRadius: '14px',
          border: '1px solid var(--color-border)',
          padding: '24px',
          maxWidth: '520px',
          marginBottom: '28px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          {/* Badge matching Screenshot 3: Restrox Premium (Trial) */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '20px',
              backgroundColor: '#991B1B',
              color: '#FFF',
              fontSize: '0.78rem',
              fontWeight: 700,
            }}
          >
            <Crown size={14} />
            <span>RESTRO8 Premium (Trial)</span>
          </div>

          {/* Right Label: 14 Days Remaining */}
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
            14 Days Remaining
          </div>
        </div>

        {/* Plan Sub-Details */}
        <div style={{ display: 'flex', gap: '32px', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '0.76rem', color: 'var(--color-muted-foreground)' }}>
              Current Plan
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                Premium Plan
              </span>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '10px',
                  backgroundColor: '#EDE9FE',
                  color: '#7C3AED',
                }}
              >
                Yearly
              </span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.76rem', color: 'var(--color-muted-foreground)' }}>
              Active Since
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-foreground)', marginTop: '3px' }}>
              14 Sep 2026
            </div>
          </div>
        </div>

        {/* Buttons: Renew & Change Plan */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={handleRenew}
            style={{
              flex: 1,
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-card)',
              color: 'var(--color-foreground)',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Renew
          </button>
          <button
            type="button"
            onClick={() => setViewMode('pricing')}
            style={{
              flex: 1,
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#000',
              color: '#FFF',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Change Plan
          </button>
        </div>
      </div>

      {/* Section: Usage Details matching Screenshot 3 */}
      <div style={{ marginBottom: '32px' }}>
        <h2
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            margin: '0 0 14px 0',
            color: 'var(--color-foreground)',
          }}
        >
          Usage Details
        </h2>

        {/* 6 Metric Progress Cards in Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '14px',
            maxWidth: '1100px',
          }}
        >
          <UsageMetricCard icon={<Users size={16} color="#F97316" />} label="Members" current={1} total={24} accentColor="#F97316" />
          <UsageMetricCard icon={<LayoutGrid size={16} color="#8B5CF6" />} label="Tables" current={3} total={50} accentColor="#8B5CF6" />
          <UsageMetricCard icon={<Tag size={16} color="#EF4444" />} label="Customers" current={0} total={500} accentColor="#EF4444" />
          <UsageMetricCard icon={<Soup size={16} color="#3B82F6" />} label="Dishes" current={6} total={1000} accentColor="#3B82F6" />
          <UsageMetricCard icon={<Layers size={16} color="#F59E0B" />} label="Add-ons" current={5} total={250} accentColor="#F59E0B" />
          <UsageMetricCard icon={<Box size={16} color="#06B6D4" />} label="Spaces" current={0} total={10} accentColor="#06B6D4" />
        </div>
      </div>

      {/* Section: Previous Subscription Details matching Screenshot 3 */}
      <div>
        <h2
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            margin: '0 0 14px 0',
            color: 'var(--color-foreground)',
          }}
        >
          Previous Subscription Details
        </h2>

        <div
          style={{
            backgroundColor: 'var(--color-card)',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            overflow: 'hidden',
            maxWidth: '1100px',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: '#FAFAFA' }}>
                <th style={{ padding: '14px 16px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-foreground)', width: '60px' }}>SN</th>
                <th style={{ padding: '14px 16px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-foreground)' }}>Plan</th>
                <th style={{ padding: '14px 16px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-foreground)' }}>Purchase Date</th>
                <th style={{ padding: '14px 16px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-foreground)' }}>Expiry Date</th>
                <th style={{ padding: '14px 16px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-foreground)' }}>Documents</th>
                <th style={{ padding: '14px 16px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-foreground)' }}>Remarks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} style={{ padding: '60px 24px', textAlign: 'center' }}>
                  {/* Fanned Documents Empty State Illustration matching Screenshot 3 */}
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '50%',
                      backgroundColor: '#F3F4F6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px auto',
                      position: 'relative',
                    }}
                  >
                    {/* Document 1 Green */}
                    <div
                      style={{
                        width: '24px',
                        height: '32px',
                        borderRadius: '3px',
                        backgroundColor: '#10B981',
                        position: 'absolute',
                        transform: 'rotate(-15deg)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      }}
                    />
                    {/* Document 2 Blue */}
                    <div
                      style={{
                        width: '24px',
                        height: '32px',
                        borderRadius: '3px',
                        backgroundColor: '#3B82F6',
                        position: 'absolute',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      }}
                    />
                    {/* Document 3 Purple */}
                    <div
                      style={{
                        width: '24px',
                        height: '32px',
                        borderRadius: '3px',
                        backgroundColor: '#8B5CF6',
                        position: 'absolute',
                        transform: 'rotate(15deg)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      }}
                    />
                  </div>

                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '4px' }}>
                    No purchase history found
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)' }}>
                    No Purchase Records Found.
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

interface UsageMetricProps {
  icon: React.ReactNode;
  label: string;
  current: number;
  total: number;
  accentColor: string;
}

const UsageMetricCard: React.FC<UsageMetricProps> = ({ icon, label, current, total, accentColor }) => {
  const percentage = Math.min(100, Math.round((current / total) * 100));

  return (
    <div
      style={{
        backgroundColor: 'var(--color-card)',
        borderRadius: '12px',
        border: '1px solid var(--color-border)',
        padding: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        {icon}
        <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-foreground)' }}>
          {label}
        </span>
      </div>

      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-foreground)', marginBottom: '8px' }}>
        {current}/{total}
      </div>

      {/* Progress Bar matching Screenshot 3 */}
      <div
        style={{
          width: '100%',
          height: '4px',
          borderRadius: '2px',
          backgroundColor: '#F3F4F6',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: accentColor,
            borderRadius: '2px',
          }}
        />
      </div>
    </div>
  );
};

interface MatrixRowProps {
  feature: string;
  free: React.ReactNode;
  basic: React.ReactNode;
  premium: React.ReactNode;
  platinum: React.ReactNode;
}

const MatrixRow: React.FC<MatrixRowProps> = ({ feature, free, basic, premium, platinum }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 0',
        borderBottom: '1px solid var(--color-border)',
        fontSize: '0.84rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '220px' }}>
        <span style={{ color: 'var(--color-foreground)', fontWeight: 500 }}>{feature}</span>
        <Info size={13} color="#9CA3AF" style={{ cursor: 'pointer' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '140px 140px 160px 140px', gap: '16px', textAlign: 'center' }}>
        <div style={{ color: 'var(--color-foreground)', fontWeight: 500 }}>{free}</div>
        <div style={{ color: 'var(--color-foreground)', fontWeight: 500 }}>{basic}</div>
        <div style={{ color: 'var(--r8-brand-primary)', fontWeight: 700 }}>{premium}</div>
        <div style={{ color: 'var(--color-foreground)', fontWeight: 500 }}>{platinum}</div>
      </div>
    </div>
  );
};
