import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  ExternalLink,
  Flame,
  Globe,
  HelpCircle,
  Laptop,
  Layers,
  Lock,
  Menu,
  Minus,
  Percent,
  Plus,
  Printer,
  QrCode,
  Receipt,
  RotateCw,
  Shield,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Tablet,
  TrendingUp,
  Truck,
  Users,
  Utensils,
  UtensilsCrossed,
  Wifi,
  WifiOff,
  X,
  Zap,
} from 'lucide-react';
import { BrandLogo } from '../brand/BrandLogo';

interface LandingPageViewProps {
  onLaunchWorkspace: (role?: 'SuperAdmin' | 'manager' | 'cashier' | 'chef' | 'waiter') => void;
  onNavigateLogin: () => void;
  onNavigateMenu: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onLaunchWorkspace,
  onNavigateLogin,
  onNavigateMenu,
}) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<'pos' | 'kds' | 'qr' | 'finance'>('pos');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const faqs = [
    {
      q: 'Does RESTRO8 work when the internet goes down in Nepal?',
      a: 'Yes, 100%. RESTRO8 is engineered offline-first. Your POS terminal continues punching orders, printing KOTs to kitchen printers, and billing guests locally with zero downtime. As soon as the network returns, your data automatically reconciles with the cloud.',
    },
    {
      q: 'Is RESTRO8 compliant with Nepal Inland Revenue Department (IRD) 13% VAT?',
      a: 'Absolutely. RESTRO8 is fully designed according to Nepal tax rules. It generates sequential, tamper-evident tax invoices, calculates 13% VAT and 10% Service Charge, maintains daily Day Book registers, and exports IRD-ready sales audit logs.',
    },
    {
      q: 'Can our customers order directly using Table QR codes?',
      a: 'Yes. Every dining table receives a dedicated, scannable QR code stand. Diners scan with any smartphone camera (no app download needed), browse your English/Nepali menu with real-time dish availability, and send orders straight to the kitchen line.',
    },
    {
      q: 'Which receipt and kitchen ticket printers are supported?',
      a: 'RESTRO8 supports all standard 58mm and 80mm ESC/POS thermal printers via USB, Bluetooth, or LAN. It also routes drink orders to Bar BOT printers and food orders to Kitchen KOT printers automatically.',
    },
    {
      q: 'Can we accept Fonepay, NepalPay, and digital wallets?',
      a: 'Yes. RESTRO8 supports integrated Dynamic QR codes for Fonepay, NepalPay, and eSewa, allowing guests to scan and pay while the cashier settles with single-click split tender.',
    },
  ];

  return (
    <div className="r8-landing-root" style={{ minHeight: '100vh', backgroundColor: '#070B11', color: '#F8FAFC', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      {/* ── 1. GLOBAL STICKY NAVBAR ───────────────────────────────────────── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'rgba(7, 11, 17, 0.82)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          height: '72px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            width: '100%',
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
            <div
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <BrandLogo />
            </div>

            <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <a href="#features" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = '#FFF'} onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}>Features</a>
              <a href="#solutions" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = '#FFF'} onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}>Solutions</a>
              <a href="#integrations" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = '#FFF'} onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}>Integrations</a>
              <a href="#pricing" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = '#FFF'} onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}>Pricing</a>
              <a href="#faq" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = '#FFF'} onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}>FAQ</a>
            </nav>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={onNavigateMenu}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#CBD5E1',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#0F8F6F'; e.currentTarget.style.color = '#10B981'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'; e.currentTarget.style.color = '#CBD5E1'; }}
            >
              <QrCode size={15} />
              <span>Table QR Menu</span>
            </button>

            <button
              type="button"
              onClick={onNavigateLogin}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                padding: '8px 18px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => onLaunchWorkspace('SuperAdmin')}
              style={{
                backgroundColor: '#0F8F6F',
                border: 'none',
                color: '#FFFFFF',
                padding: '8px 18px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 12px rgba(15, 143, 111, 0.35)',
                transition: 'transform 0.15s, background-color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#10B981'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#0F8F6F'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <span>Launch Workspace</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* ── 2. HERO SECTION ───────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          padding: '80px 24px 70px',
          overflow: 'hidden',
        }}
      >
        {/* Ambient radial lighting */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '850px',
            height: '480px',
            background: 'radial-gradient(circle, rgba(15, 143, 111, 0.22) 0%, rgba(242, 184, 75, 0.05) 50%, transparent 80%)',
            filter: 'blur(70px)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', textAlign: 'center' }}>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(15, 143, 111, 0.14)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '999px',
              padding: '6px 16px',
              marginBottom: '24px',
            }}
          >
            <span style={{ fontSize: '0.9rem' }}>🇳🇵</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#34D399', letterSpacing: '0.02em' }}>
              Nepal's Next-Gen Restaurant Operating System · 13% IRD VAT Compliant
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5.5vw, 4.4rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              margin: '0 auto 24px',
              maxWidth: '960px',
              color: '#FFFFFF',
            }}
          >
            Run Your Restaurant with{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #10B981 0%, #34D399 50%, #F2B84B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Infinite Precision.
            </span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
              color: '#94A3B8',
              lineHeight: 1.6,
              maxWidth: '720px',
              margin: '0 auto 36px',
            }}
          >
            From busy Chiya outlets and Thakali kitchens to fine restro-bars — RESTRO8 unifies lightning POS billing, kitchen KOT automation, table QR dining, and offline inventory in one elegant platform.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '48px' }}>
            <button
              type="button"
              onClick={() => onLaunchWorkspace('SuperAdmin')}
              style={{
                backgroundColor: '#0F8F6F',
                border: 'none',
                color: '#FFFFFF',
                padding: '16px 32px',
                borderRadius: '12px',
                fontSize: '1.05rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 8px 24px rgba(15, 143, 111, 0.4)',
                transition: 'all 0.18s',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#10B981'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#0F8F6F'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <Zap size={20} />
              <span>Launch Free Workspace (Instant Access)</span>
            </button>

            <button
              type="button"
              onClick={onNavigateLogin}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                color: '#FFFFFF',
                padding: '16px 28px',
                borderRadius: '12px',
                fontSize: '1.05rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)'}
            >
              <ShieldCheck size={20} style={{ color: '#10B981' }} />
              <span>Sign In / Team Access</span>
            </button>
          </div>

          {/* Social Proof Stats Ribbon */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              maxWidth: '980px',
              margin: '0 auto',
              padding: '20px 24px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10B981' }}>100%</div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 500 }}>Offline-Ready Architecture</div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F2B84B' }}>13% VAT</div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 500 }}>Nepal IRD Tax Compliant</div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#60A5FA' }}>&lt; 1.2s</div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 500 }}>Fast Thermal Bill Printing</div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#A78BFA' }}>12,000+</div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 500 }}>Nepali Momo & Khaja Sets Tracked</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. INTERACTIVE LIVE PRODUCT DEMO WIDGET ───────────────────────── */}
      <section
        id="solutions"
        style={{
          padding: '60px 24px 80px',
          maxWidth: '1240px',
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <p style={{ color: '#10B981', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>
            Interactive Workspace Experience
          </p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)', fontWeight: 800, margin: 0 }}>
            Crafted for speed on the counter, calm in the kitchen.
          </h2>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
          {[
            { id: 'pos', label: 'Counter POS & Billing', icon: ShoppingBag },
            { id: 'kds', label: 'Kitchen KOT / BOT Display', icon: Flame },
            { id: 'qr', label: 'Contactless Table QR Menu', icon: QrCode },
            { id: 'finance', label: 'Day Book & 13% VAT', icon: Receipt },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeShowcaseTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveShowcaseTab(tab.id as any)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: active ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                  backgroundColor: active ? 'rgba(15, 143, 111, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  color: active ? '#34D399' : '#94A3B8',
                  transition: 'all 0.15s',
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Mockup Card */}
        <div
          style={{
            backgroundColor: '#0F1622',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            padding: '32px',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)',
          }}
        >
          {activeShowcaseTab === 'pos' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#10B981', fontWeight: 700, letterSpacing: '0.08em' }}>Instant Counter Speed</span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '8px 0 12px' }}>Fast POS Ticket & Split Settlements</h3>
                <p style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
                  Punch orders with keyboard shortcuts, assign table numbers, apply loyalty discounts, and split payments between Cash and Fonepay without calculating change manually.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {['Compliant IRD tax invoice with QR verify', 'Instant table seat & transfer flow', 'Split tender: Rs. 500 Cash + Rs. 780 Fonepay'].map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#CBD5E1' }}>
                      <CheckCircle2 size={16} style={{ color: '#10B981' }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => onLaunchWorkspace('cashier')}
                  style={{
                    marginTop: '24px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    color: '#FFFFFF',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span>Test Cashier POS View</span>
                  <ArrowRight size={15} />
                </button>
              </div>

              {/* Simulated POS Card */}
              <div style={{ backgroundColor: '#0B0F17', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #334155', paddingBottom: '12px', marginBottom: '14px' }}>
                  <div>
                    <strong style={{ fontSize: '0.95rem', color: '#FFF' }}>Table T3 (Rooftop)</strong>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Invoice #R8-2083-0941</div>
                  </div>
                  <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34D399', fontSize: '0.75rem', fontWeight: 700, padding: '4px 8px', borderRadius: '6px' }}>
                    Dine-in · Unpaid
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                    <span>2x Steamed Buff Momo</span>
                    <strong>Rs. 560</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                    <span>1x Thakali Mutton Set</span>
                    <strong>Rs. 620</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                    <span>2x Special Masala Chiya</span>
                    <strong>Rs. 100</strong>
                  </div>
                </div>
                <div style={{ borderTop: '1px solid #1E293B', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.82rem', color: '#94A3B8' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span>Rs. 1,280.00</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>13% IRD VAT</span><span>Rs. 166.40</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 800, color: '#FFF', marginTop: '6px' }}><span>Total Bill</span><span>Rs. 1,446.40</span></div>
                </div>
              </div>
            </div>
          )}

          {activeShowcaseTab === 'kds' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#EA580C', fontWeight: 700, letterSpacing: '0.08em' }}>Zero Paper Lost</span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '8px 0 12px' }}>Real-Time Kitchen KOT Line & Audio Alerts</h3>
                <p style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
                  Route momo tickets directly to the steamer station and cocktails to the bar. Track elapsed preparation times with warning highlights so no table waits more than 15 minutes.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {['Sound chimes on new incoming tickets', 'One-touch bump to Ready / Served', 'Oldest tickets prioritized to prevent table delay'].map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#CBD5E1' }}>
                      <CheckCircle2 size={16} style={{ color: '#EA580C' }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => onLaunchWorkspace('chef')}
                  style={{
                    marginTop: '24px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    color: '#FFFFFF',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span>Test Chef KDS View</span>
                  <ArrowRight size={15} />
                </button>
              </div>

              {/* Simulated KDS Card */}
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto' }}>
                <div style={{ flex: 1, backgroundColor: '#1A1412', borderRadius: '12px', border: '1px solid #7C2D12', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 800, color: '#FB923C' }}>KOT #42 · Table 5</span>
                    <span style={{ fontSize: '0.72rem', backgroundColor: '#7C2D12', color: '#FED7AA', padding: '2px 6px', borderRadius: '4px' }}>6m ago</span>
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#E2E8F0', lineHeight: 1.5, marginBottom: '12px' }}>
                    <div>• 2x Fiery Buff C-Momo (Extra Spicy)</div>
                    <div>• 1x Chicken Chhoila Set</div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#F97316', fontWeight: 600 }}>Station: Momo & Wok</div>
                </div>
                <div style={{ flex: 1, backgroundColor: '#0B0F17', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.12)', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 800, color: '#38BDF8' }}>BOT #43 · Bar</span>
                    <span style={{ fontSize: '0.72rem', backgroundColor: '#0369A1', color: '#E0F2FE', padding: '2px 6px', borderRadius: '4px' }}>1m ago</span>
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#E2E8F0', lineHeight: 1.5, marginBottom: '12px' }}>
                    <div>• 2x Gurkha Craft Beer (500ml)</div>
                    <div>• 1x Virgin Mint Mojito</div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#38BDF8', fontWeight: 600 }}>Station: Bar & Cafe</div>
                </div>
              </div>
            </div>
          )}

          {activeShowcaseTab === 'qr' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#38BDF8', fontWeight: 700, letterSpacing: '0.08em' }}>Guest Self-Service</span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '8px 0 12px' }}>Printed Table QR Codes for Contactless Orders</h3>
                <p style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
                  Guests scan from their phone, view authentic photos and allergen tags, and submit orders directly to your KDS. No staff bottlenecks during rush hour.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {['Dual-language (English & Nepali script)', 'Automatic sold-out dish hiding', 'Security-isolated guest session'].map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#CBD5E1' }}>
                      <CheckCircle2 size={16} style={{ color: '#38BDF8' }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={onNavigateMenu}
                  style={{
                    marginTop: '24px',
                    backgroundColor: '#0284C7',
                    border: 'none',
                    color: '#FFFFFF',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <ExternalLink size={15} />
                  <span>Open Live Guest Menu View</span>
                </button>
              </div>

              {/* Simulated Mobile QR View */}
              <div style={{ backgroundColor: '#070A0F', borderRadius: '16px', border: '1px solid #1E293B', padding: '18px', textAlign: 'center' }}>
                <div style={{ display: 'inline-block', backgroundColor: '#FFF', padding: '12px', borderRadius: '12px', marginBottom: '12px' }}>
                  <QrCode size={110} color="#0B0F17" />
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFF' }}>Scan Table QR to Order</div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '4px' }}>Restro8 Demo Kitchen · Table 4 (Garden)</div>
              </div>
            </div>
          )}

          {activeShowcaseTab === 'finance' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#F2B84B', fontWeight: 700, letterSpacing: '0.08em' }}>Financial Peace of Mind</span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '8px 0 12px' }}>Automatic Day Book, Settlement & Tax Reports</h3>
                <p style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
                  End every shift with reconciled register totals. Track cash drawers, digital wallet settlements, daily tax breakdown, and inventory consumption without Excel formulas.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {['Instant shift closeout and net cash reconciliation', 'One-click CSV and IRD audit export', 'Automated ingredient cost vs gross margin'].map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#CBD5E1' }}>
                      <CheckCircle2 size={16} style={{ color: '#F2B84B' }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => onLaunchWorkspace('SuperAdmin')}
                  style={{
                    marginTop: '24px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    color: '#FFFFFF',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span>Explore Financial Day Book</span>
                  <ArrowRight size={15} />
                </button>
              </div>

              {/* Simulated Day Book card */}
              <div style={{ backgroundColor: '#0B0F17', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '20px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#F2B84B', marginBottom: '8px' }}>TODAY'S FISCAL SUMMARY (KATHMANDU)</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ backgroundColor: '#131B26', padding: '10px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Gross Billed</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF' }}>Rs. 48,290</div>
                  </div>
                  <div style={{ backgroundColor: '#131B26', padding: '10px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>13% VAT Collected</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34D399' }}>Rs. 5,555.20</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', borderTop: '1px solid #1E293B', paddingTop: '10px' }}>
                  Shift Cash: <strong style={{ color: '#FFF' }}>Rs. 22,400</strong> · Digital Wallets: <strong style={{ color: '#FFF' }}>Rs. 25,890</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 4. SIX CORE SOLUTIONS PILLARS ─────────────────────────────────── */}
      <section
        id="features"
        style={{
          padding: '70px 24px',
          backgroundColor: '#05080E',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ color: '#10B981', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Built specifically for Nepal
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, margin: '8px 0 12px' }}>
              Every Tool Your Restaurant Needs.
            </h2>
            <p style={{ color: '#94A3B8', maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem' }}>
              Say goodbye to juggling three separate software apps for billing, inventory, and kitchen display.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
            {[
              {
                icon: Zap,
                color: '#10B981',
                title: 'Offline-First Resilience',
                desc: 'When Nepal load shedding or internet cuts happen, your POS never halts. Take orders, print KOTs, and settle cash seamlessly.',
              },
              {
                icon: Receipt,
                color: '#F2B84B',
                title: '13% IRD VAT Billing',
                desc: 'Full Inland Revenue Department compliance. Sequential tax invoice numbering, PAN lookup, and automated tax reporting.',
              },
              {
                icon: Flame,
                color: '#EA580C',
                title: 'Kitchen Display (KDS & BOT)',
                desc: 'Eliminate lost paper tickets. Order chimes ring on new tickets and elapsed preparation timers keep cooks on track.',
              },
              {
                icon: QrCode,
                color: '#38BDF8',
                title: 'Dynamic Table QR Menu',
                desc: 'Print table stands once. Update dishes, prices, and special daily Thakali items in seconds with zero reprint cost.',
              },
              {
                icon: Layers,
                color: '#A855F7',
                title: 'Recipe & Ingredient Depletion',
                desc: 'Track buffalo meat, chicken, cooking oil, and flour. Each momo portion auto-deducts raw stock with low-quantity alerts.',
              },
              {
                icon: ShieldCheck,
                color: '#EC4899',
                title: 'Role-Based Staff Security',
                desc: 'Owner, Manager, Cashier, Chef, and Server permissions. Safeguard salaries and ledger books from unauthorized eyes.',
              },
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '28px',
                    transition: 'transform 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: `${card.color}15`,
                      color: card.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '18px',
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 10px', color: '#FFFFFF' }}>{card.title}</h3>
                  <p style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. NEPAL HARDWARE & PAYMENT ECOSYSTEM ──────────────────────────── */}
      <section
        id="integrations"
        style={{
          padding: '60px 24px',
          maxWidth: '1240px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(15, 143, 111, 0.07)',
            borderRadius: '20px',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            padding: '40px 32px',
            textAlign: 'center',
          }}
        >
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 12px' }}>
            Seamless with Nepal’s Hardware & Payment Infrastructure
          </h3>
          <p style={{ color: '#94A3B8', maxWidth: '600px', margin: '0 auto 28px', fontSize: '0.95rem' }}>
            Plug in your existing thermal printers, connect your Fonepay QR merchant account, and start billing in under 5 minutes.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            {['Fonepay Dynamic QR', 'NepalPay Network', 'PrabhuPay / eSewa', '58mm / 80mm ESC/POS', 'Android & Windows POS'].map((badge, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '999px',
                  padding: '8px 18px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <CheckCircle2 size={14} style={{ color: '#10B981' }} />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. PRICING IN NPR ─────────────────────────────────────────────── */}
      <section
        id="pricing"
        style={{
          padding: '70px 24px',
          backgroundColor: '#05080E',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ color: '#10B981', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Transparent Nepali Pricing
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, margin: '8px 0 12px' }}>
              Simple Plans That Grow With Your Restaurant.
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '1rem' }}>Zero hidden fees. Zero setup charges. Cancel anytime.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', maxWidth: '1080px', margin: '0 auto' }}>
            {/* Plan 1: Free Forever */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 6px' }}>Starter Kitchen</h3>
              <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '18px' }}>For small cafes, tea houses & food stalls</p>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '20px', color: '#FFF' }}>
                Rs. 0 <span style={{ fontSize: '0.9rem', color: '#94A3B8', fontWeight: 500 }}>/ month</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#CBD5E1' }}>
                {['Single billing counter', '100% Offline POS capability', 'Up to 10 table QR codes', 'Basic daily sales summary'].map((feat, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={15} style={{ color: '#10B981' }} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => onLaunchWorkspace('cashier')}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                }}
              >
                Start Free
              </button>
            </div>

            {/* Plan 2: Pro Kitchen (Highlighted) */}
            <div
              style={{
                backgroundColor: 'rgba(15, 143, 111, 0.12)',
                borderRadius: '16px',
                border: '2px solid #0F8F6F',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                boxShadow: '0 12px 36px rgba(15, 143, 111, 0.25)',
              }}
            >
              <div style={{ position: 'absolute', top: '-12px', right: '20px', backgroundColor: '#0F8F6F', color: '#FFF', fontSize: '0.72rem', fontWeight: 800, padding: '4px 10px', borderRadius: '999px', textTransform: 'uppercase' }}>
                Most Popular in Nepal
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 6px', color: '#34D399' }}>Pro Restro</h3>
              <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '18px' }}>For dining restaurants, bars & busy kitchens</p>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '20px', color: '#FFF' }}>
                Rs. 2,499 <span style={{ fontSize: '0.9rem', color: '#94A3B8', fontWeight: 500 }}>/ month</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#CBD5E1' }}>
                {['Unlimited billing counters & tables', 'Real-time KDS line with kitchen audio', 'Full 13% IRD VAT compliance & Daybook', 'Dynamic inventory & recipe auto-deduction', 'Multi-staff role permissions'].map((feat, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={15} style={{ color: '#10B981' }} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => onLaunchWorkspace('SuperAdmin')}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: '#0F8F6F',
                  border: 'none',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(15, 143, 111, 0.4)',
                }}
              >
                Launch Pro Workspace
              </button>
            </div>

            {/* Plan 3: Enterprise */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 6px' }}>Multi-Outlet</h3>
              <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '18px' }}>For hotel chains, franchises & food courts</p>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '20px', color: '#FFF' }}>
                Rs. 5,999 <span style={{ fontSize: '0.9rem', color: '#94A3B8', fontWeight: 500 }}>/ month</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#CBD5E1' }}>
                {['Multi-branch centralized reporting', 'Central production commissary batching', 'Custom API & accounting sync', 'Dedicated account manager in Kathmandu'].map((feat, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={15} style={{ color: '#10B981' }} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={onNavigateLogin}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                }}
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. FAQ ACCORDION ──────────────────────────────────────────────── */}
      <section
        id="faq"
        style={{
          padding: '70px 24px',
          maxWidth: '860px',
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ color: '#10B981', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Got Questions?</span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', fontWeight: 800, margin: '8px 0 0' }}>Frequently Asked Questions</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  overflow: 'hidden',
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  style={{
                    width: '100%',
                    padding: '18px 20px',
                    textAlign: 'left',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: '1rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                  }}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                      color: isOpen ? '#10B981' : '#94A3B8',
                    }}
                  />
                </button>
                {isOpen && (
                  <div style={{ padding: '0 20px 20px', color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.6 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 8. BOTTOM CTA CALLOUT ─────────────────────────────────────────── */}
      <section
        style={{
          padding: '70px 24px',
          background: 'linear-gradient(180deg, #070B11 0%, #08281F 100%)',
          textAlign: 'center',
          borderTop: '1px solid rgba(16, 185, 129, 0.2)',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 3rem)', fontWeight: 900, marginBottom: '16px', color: '#FFF' }}>
            Ready to Upgrade Your Restaurant Operations?
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '1.1rem', marginBottom: '32px' }}>
            Join smart restaurants in Kathmandu and Pokhara making customer service faster and tax accounting seamless.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => onLaunchWorkspace('SuperAdmin')}
              style={{
                backgroundColor: '#0F8F6F',
                border: 'none',
                color: '#FFFFFF',
                padding: '16px 36px',
                borderRadius: '12px',
                fontSize: '1.05rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(15, 143, 111, 0.4)',
              }}
            >
              Get Started with RESTRO8 Now
            </button>
            <button
              type="button"
              onClick={onNavigateLogin}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                color: '#FFFFFF',
                padding: '16px 28px',
                borderRadius: '12px',
                fontSize: '1.05rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Sign In to Existing Workspace
            </button>
          </div>
        </div>
      </section>

      {/* ── 9. FOOTER ─────────────────────────────────────────────────────── */}
      <footer
        style={{
          padding: '40px 24px',
          backgroundColor: '#030508',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: '0.85rem',
          color: '#64748B',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <BrandLogo compact />
            <span>RESTRO8 · Infinite Hospitality Operating System</span>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <button type="button" onClick={onNavigateMenu} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 0 }}>Guest QR Menu</button>
            <button type="button" onClick={onNavigateLogin} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 0 }}>Login</button>
            <button type="button" onClick={() => onLaunchWorkspace('SuperAdmin')} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 0 }}>Live Demo</button>
          </div>

          <div>
            <span>© 2026 RESTRO8 Nepal. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
