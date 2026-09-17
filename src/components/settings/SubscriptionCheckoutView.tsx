import React, { useState } from 'react';
import {
  ChevronLeft,
  CheckCircle2,
  Check,
  Star,
  Crown,
  Gem,
  ShieldCheck,
  Headphones,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

interface SubscriptionCheckoutViewProps {
  onBack: () => void;
  initialPlan?: 'Basic' | 'Premium' | 'Platinum';
  initialCycle?: '6 Months' | 'Yearly';
}

export const SubscriptionCheckoutView: React.FC<SubscriptionCheckoutViewProps> = ({
  onBack,
  initialPlan = 'Premium',
  initialCycle = '6 Months',
}) => {
  const { addToast } = useRestaurant();

  const [cycle, setCycle] = useState<'6 Months' | 'Yearly'>(initialCycle);
  const [selectedPlan, setSelectedPlan] = useState<'Basic' | 'Premium' | 'Platinum'>(initialPlan);
  const [selectedPayment, setSelectedPayment] = useState<'fonepay' | 'esewa' | 'nepalpay' | 'khalti'>('fonepay');
  const [isProcessing, setIsProcessing] = useState(false);

  // Pricing Matrix matching Screenshots 2 & 3
  const planData = {
    Basic: {
      '6 Months': { subtotal: 5309.73, vat: 690.27, total: 6000, display: 'Rs6,000 / 6 Months' },
      'Yearly': { subtotal: 10619.47, vat: 1380.53, total: 12000, display: 'Rs12,000 / 1 Year' },
      icon: <Star size={18} />,
    },
    Premium: {
      '6 Months': { subtotal: 13274.34, vat: 1725.66, total: 15000, display: 'Rs15,000 / 6 Months' },
      'Yearly': { subtotal: 21238.94, vat: 2761.06, total: 24000, display: 'Rs24,000 / 1 Year' },
      icon: <Crown size={18} />,
    },
    Platinum: {
      '6 Months': { subtotal: 26548.67, vat: 3451.33, total: 30000, display: 'Rs30,000 / 6 Months' },
      'Yearly': { subtotal: 53097.35, vat: 6902.65, total: 60000, display: 'Rs60,000 / 1 Year' },
      icon: <Gem size={18} />,
    },
  };

  const currentPricing = planData[selectedPlan][cycle];

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      addToast(
        'Payment Successful',
        `Successfully subscribed to ${selectedPlan} Plan (${cycle}) via ${selectedPayment.toUpperCase()}.`,
        'success'
      );
      onBack();
    }, 900);
  };

  return (
    <div
      style={{
        padding: '24px 32px 48px 32px',
        backgroundColor: '#FAFAFA',
        minHeight: '100%',
        boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Top Header matching Screenshots 2 & 3 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
          maxWidth: '1080px',
          margin: '0 auto 28px auto',
        }}
      >
        {/* Back to Plans Button */}
        <button
          type="button"
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
            backgroundColor: '#FFF',
            color: '#374151',
            fontSize: '0.84rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          }}
        >
          <ChevronLeft size={16} />
          <span>Back to Plans</span>
        </button>

        {/* Centered RestroX Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Flame/Bow Vector Icon */}
          <svg width="26" height="24" viewBox="0 0 32 28" fill="none">
            <path
              d="M3 14C3 6.8 8.8 1 16 1C23.2 1 29 6.8 29 14C29 21.2 23.2 27 16 27C12.5 27 9.3 25.6 7 23.3L16 14L3 14Z"
              fill="var(--r8-brand-primary)"
            />
          </svg>
          <span
            style={{
              fontSize: '1.45rem',
              fontWeight: 800,
              color: '#111827',
              letterSpacing: '-0.03em',
            }}
          >
            Restro<span style={{ color: 'var(--r8-brand-primary)' }}>x</span>
          </span>
        </div>

        {/* Balancer placeholder */}
        <div style={{ width: '130px' }} />
      </div>

      {/* Main Two-Column Layout matching Screenshots 2 & 3 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 1.1fr',
          gap: '28px',
          maxWidth: '1080px',
          margin: '0 auto',
          alignItems: 'start',
        }}
      >
        {/* LEFT COLUMN: Choose Plan Card */}
        <div
          style={{
            backgroundColor: '#FFF',
            borderRadius: '14px',
            border: '1px solid #E5E7EB',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          <div
            style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              color: '#111827',
              marginBottom: '16px',
            }}
          >
            Choose Plan
          </div>

          {/* Billing Cycle Pill Bar (6 Months vs Yearly) */}
          <div
            style={{
              display: 'flex',
              backgroundColor: '#F3F4F6',
              borderRadius: '10px',
              padding: '4px',
              marginBottom: '20px',
              position: 'relative',
            }}
          >
            <button
              type="button"
              onClick={() => setCycle('6 Months')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: cycle === '6 Months' ? '#FFF' : 'transparent',
                color: cycle === '6 Months' ? '#111827' : '#6B7280',
                fontSize: '0.86rem',
                fontWeight: cycle === '6 Months' ? 700 : 500,
                cursor: 'pointer',
                boxShadow: cycle === '6 Months' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              6 Months
            </button>

            <button
              type="button"
              onClick={() => setCycle('Yearly')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: cycle === 'Yearly' ? '#FFF' : 'transparent',
                color: cycle === 'Yearly' ? '#111827' : '#6B7280',
                fontSize: '0.86rem',
                fontWeight: cycle === 'Yearly' ? 700 : 500,
                cursor: 'pointer',
                boxShadow: cycle === 'Yearly' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                position: 'relative',
                transition: 'all 0.15s ease',
              }}
            >
              <span>Yearly</span>
              {/* Floating Save 20% Badge */}
              <span
                style={{
                  position: 'absolute',
                  top: '-9px',
                  right: '12px',
                  backgroundColor: '#DC2626',
                  color: '#FFF',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '10px',
                  boxShadow: '0 2px 4px rgba(220,38,38,0.25)',
                  letterSpacing: '0.2px',
                }}
              >
                Save 20%
              </span>
            </button>
          </div>

          {/* Plan Options List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            {(['Basic', 'Premium', 'Platinum'] as const).map((planKey) => {
              const isSelected = selectedPlan === planKey;
              const data = planData[planKey];
              const priceText = data[cycle].display;

              return (
                <div
                  key={planKey}
                  onClick={() => setSelectedPlan(planKey)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 18px',
                    borderRadius: '10px',
                    border: isSelected ? '2px solid #10B981' : '1px solid #E5E7EB',
                    backgroundColor: isSelected ? '#F0FDF4' : '#FFF',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ color: isSelected ? '#10B981' : '#6B7280' }}>
                      {data.icon}
                    </div>
                    <span
                      style={{
                        fontSize: '0.94rem',
                        fontWeight: 700,
                        color: isSelected ? '#065F46' : '#111827',
                      }}
                    >
                      {planKey}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: isSelected ? '#047857' : '#111827',
                      }}
                    >
                      {priceText.split('/')[0]}
                      <span style={{ color: isSelected ? '#10B981' : '#9CA3AF', fontWeight: 500, fontSize: '0.8rem' }}>
                        /{priceText.split('/')[1]}
                      </span>
                    </span>
                    {isSelected && (
                      <CheckCircle2 size={18} color="#10B981" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* What's Included On This Plan Callout Box */}
          <div
            style={{
              backgroundColor: '#EFF6FF',
              borderRadius: '10px',
              border: '1px solid #BFDBFE',
              padding: '16px 18px',
            }}
          >
            <div
              style={{
                fontSize: '0.88rem',
                fontWeight: 700,
                color: '#1D4ED8',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Check size={16} strokeWidth={3} />
              <span>What's included on this plan:</span>
            </div>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '0.82rem',
                color: '#1E40AF',
                lineHeight: '1.45',
              }}
            >
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem', lineHeight: '1' }}>•</span>
                <span>Up to 24 Members Login</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem', lineHeight: '1' }}>•</span>
                <span>Up to 50 Tables</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem', lineHeight: '1' }}>•</span>
                <span>Up to 1000 Dishes</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem', lineHeight: '1' }}>•</span>
                <span>Free setup and onboarding assistance.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem', lineHeight: '1' }}>•</span>
                <span>24/7 customer support.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: Payment Method & Bill Summary (Perforated Receipt Card) */}
        <div
          style={{
            backgroundColor: '#FFF',
            borderRadius: '14px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '24px 24px 30px 24px' }}>
            {/* Header */}
            <div
              style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                color: '#111827',
                marginBottom: '16px',
              }}
            >
              Payment Method
            </div>

            {/* 4 Nepal Wallets Grid matching Screenshots 2 & 3 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '10px',
                marginBottom: '26px',
              }}
            >
              {/* Fonepay */}
              <div
                onClick={() => setSelectedPayment('fonepay')}
                style={{
                  height: '52px',
                  borderRadius: '10px',
                  border: `1.5px solid ${selectedPayment === 'fonepay' ? 'var(--r8-brand-primary)' : '#E5E7EB'}`,
                  backgroundColor: '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: '6px',
                }}
              >
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#DC2626', letterSpacing: '-0.5px' }}>
                  fone<span style={{ color: '#111827' }}>pay</span>
                </div>
              </div>

              {/* eSewa */}
              <div
                onClick={() => setSelectedPayment('esewa')}
                style={{
                  height: '52px',
                  borderRadius: '10px',
                  border: `1.5px solid ${selectedPayment === 'esewa' ? '#10B981' : '#E5E7EB'}`,
                  backgroundColor: '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: '6px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: '#10B981',
                      color: '#FFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                    }}
                  >
                    e
                  </div>
                  <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#10B981' }}>Sewa</span>
                </div>
              </div>

              {/* NEPALPAY */}
              <div
                onClick={() => setSelectedPayment('nepalpay')}
                style={{
                  height: '52px',
                  borderRadius: '10px',
                  border: `1.5px solid ${selectedPayment === 'nepalpay' ? '#2563EB' : '#E5E7EB'}`,
                  backgroundColor: '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: '6px',
                }}
              >
                <div
                  style={{
                    border: '1.5px solid #2563EB',
                    borderRadius: '4px',
                    padding: '1px 5px',
                    fontSize: '0.66rem',
                    fontWeight: 900,
                    color: '#2563EB',
                    letterSpacing: '0.5px',
                  }}
                >
                  NEPAL<span style={{ color: '#DC2626' }}>PAY</span>
                </div>
              </div>

              {/* Khalti */}
              <div
                onClick={() => setSelectedPayment('khalti')}
                style={{
                  height: '52px',
                  borderRadius: '10px',
                  border: `1.5px solid ${selectedPayment === 'khalti' ? '#7C3AED' : '#E5E7EB'}`,
                  backgroundColor: '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: '6px',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#5C2D91', lineHeight: '1' }}>khalti</span>
                  <span style={{ fontSize: '0.52rem', fontWeight: 600, color: '#DC2626', lineHeight: '1' }}>by IME</span>
                </div>
              </div>
            </div>

            {/* Bill Summary Section */}
            <div
              style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                color: '#111827',
                marginBottom: '16px',
              }}
            >
              Bill Summary
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', color: '#4B5563' }}>
                <span>Subtotal({selectedPlan} Plan {cycle === '6 Months' ? '6 Months' : '1 Year'})</span>
                <span style={{ fontWeight: 600, color: '#111827' }}>
                  Rs {currentPricing.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', color: '#4B5563' }}>
                <span>VAT(13%)</span>
                <span style={{ fontWeight: 600, color: '#111827' }}>
                  Rs {currentPricing.vat.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Total Amount Row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '12px',
                borderTop: '1px dashed #E5E7EB',
                marginBottom: '20px',
              }}
            >
              <span style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>Total Amount</span>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827' }}>
                Rs {currentPricing.total.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Pay Now Button matching Screenshot 5 */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={handlePayment}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: '#74C69D',
                color: '#FFFFFF',
                fontSize: '0.96rem',
                fontWeight: 700,
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                marginBottom: '18px',
                boxShadow: '0 2px 6px rgba(116, 198, 157, 0.3)',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#52B788')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#74C69D')}
            >
              {isProcessing ? 'Processing Payment...' : `Pay Now Rs ${currentPricing.total.toLocaleString('en-IN')}`}
            </button>

            {/* Trust & Security Badges */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '16px',
                fontSize: '0.74rem',
                color: '#6B7280',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={14} color="#10B981" />
                <span>100% Secure Payment</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Headphones size={14} color="#6B7280" />
                <span>24/7 support</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} color="#2563EB" />
                <span>Cancel plan anytime</span>
              </div>
            </div>
          </div>

          {/* Perforated Sawtooth Receipt Tear Bottom Edge matching Screenshot 5 */}
          <div
            style={{
              width: '100%',
              height: '10px',
              backgroundColor: '#FAFAFA',
              backgroundImage: 'linear-gradient(135deg, #FFF 5px, transparent 0), linear-gradient(225deg, #FFF 5px, transparent 0)',
              backgroundSize: '12px 10px',
              backgroundRepeat: 'repeat-x',
            }}
          />
        </div>
      </div>

      {/* Footer Contact Info matching Screenshots 2 & 3 */}
      <div
        style={{
          marginTop: '36px',
          textAlign: 'center',
          color: '#6B7280',
          fontSize: '0.82rem',
          lineHeight: '1.6',
        }}
      >
        <div>Contact us if you have any confusions regarding subscription</div>
        <div style={{ fontWeight: 600, color: '#374151', marginTop: '2px' }}>
          +977-9802853939 &nbsp;|&nbsp; sales@restro8.app
        </div>
      </div>
    </div>
  );
};
