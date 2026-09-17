import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
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
  Phone,
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

export interface LandingPageViewProps {
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

  // Interactive Live POS Simulator State
  const [posCart, setPosCart] = useState<Array<{ name: string; price: number; qty: number }>>([
    { name: 'Special Thakali Khana Set', price: 480, qty: 1 },
    { name: 'Steamed Chicken MoMo (10 pcs)', price: 260, qty: 1 },
    { name: 'Himalayan Herbal Chiya', price: 90, qty: 2 },
  ]);
  const [posSuccessChime, setPosSuccessChime] = useState(false);

  // Interactive Live KDS Simulator State
  const [kdsTickets, setKdsTickets] = useState([
    { id: 'T-04', table: 'Table 4', time: '6m', status: 'preparing', items: ['1× Thakali Set (Mutton)', '1× Extra Ghee Rice'] },
    { id: 'T-09', table: 'Table 9', time: '2m', status: 'new', items: ['2× Buff C-MoMo', '2× Coca-Cola 250ml'] },
    { id: 'B-02', table: 'Bar Counter', time: '12m', status: 'ready', items: ['1× Everest Beer 650ml', '1× Masala Peanuts'] },
  ]);

  // Interactive Live QR Mobile Simulator State
  const [qrLanguage, setQrLanguage] = useState<'en' | 'np'>('en');
  const [qrOrderedCount, setQrOrderedCount] = useState(2);

  // Math for POS Simulator
  const posSubtotal = posCart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const posServiceCharge = Math.round(posSubtotal * 0.1);
  const posTaxable = posSubtotal + posServiceCharge;
  const posVat = Math.round(posTaxable * 0.13);
  const posGrandTotal = posTaxable + posVat;

  const handleAddPosItem = (name: string, price: number) => {
    setPosCart((prev) => {
      const existing = prev.find((i) => i.name === name);
      if (existing) {
        return prev.map((i) => (i.name === name ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { name, price, qty: 1 }];
    });
  };

  const handleSimulatePayment = () => {
    setPosSuccessChime(true);
    setTimeout(() => setPosSuccessChime(false), 2400);
  };

  const handleBumpKdsTicket = (id: string) => {
    setKdsTickets((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === 'new' ? 'preparing' : t.status === 'preparing' ? 'ready' : 'new';
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const faqs = [
    {
      q: 'Does RESTRO8 work when the local internet in Nepal drops out?',
      a: 'Yes, 100%. RESTRO8 is engineered offline-first with local synchronization. When Kathmandu fiber cables are cut or ISP networks drop, your POS terminals continue punching orders, printing KOTs to kitchen thermal printers, and billing guests locally with zero interruption. The moment connectivity restores, all data reconciles safely with the cloud.',
    },
    {
      q: 'Is RESTRO8 compliant with Nepal Inland Revenue Department (IRD) 13% VAT?',
      a: 'Yes. RESTRO8 is strictly built for Nepal fiscal standards. It issues sequential, tamper-evident tax invoices, calculates 13% VAT and 10% Service Charge, maintains daily Day Book registers, records cashier opening/closing drawer floats, and exports IRD-ready audit sheets with single-click CSV export.',
    },
    {
      q: 'Can our customers order directly using Table QR codes?',
      a: 'Yes. Every dining table receives a dedicated, scannable QR code. Diners scan with any smartphone camera (zero app download required), browse your digital English/Nepali menu with real-time dish photos and stock status, and send orders straight to the kitchen ticket line.',
    },
    {
      q: 'Which receipt and kitchen ticket printers are supported?',
      a: 'RESTRO8 supports all standard 58mm and 80mm ESC/POS thermal printers via USB, Ethernet (LAN), and Bluetooth. It routes drink items to Bar BOT printers and food items to Kitchen KOT printers automatically, avoiding staff confusion.',
    },
    {
      q: 'Can we accept Fonepay, NepalPay, and digital wallets?',
      a: 'Yes. RESTRO8 supports integrated Dynamic QR codes for Fonepay, NepalPay, and eSewa. Guests scan and pay immediately from their banking app, while the cashier settles with single-click split tender.',
    },
  ];

  return (
    <div
      className="r8-landing-root"
      style={{
        minHeight: '100vh',
        backgroundColor: '#070B11',
        color: '#F8FAFC',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* ── 1. GLOBAL STICKY NAVBAR ───────────────────────────────────────── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'rgba(7, 11, 17, 0.85)',
          backdropFilter: 'blur(20px)',
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
              <a
                href="#features"
                style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600, transition: 'color 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FFF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
              >
                Features
              </a>
              <a
                href="#solutions"
                style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600, transition: 'color 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FFF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
              >
                Live Interactive Demo
              </a>
              <a
                href="#pricing"
                style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600, transition: 'color 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FFF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
              >
                Pricing
              </a>
              <a
                href="#faq"
                style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600, transition: 'color 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FFF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
              >
                FAQ
              </a>
            </nav>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={onNavigateMenu}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#CBD5E1',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#0F8F6F';
                e.currentTarget.style.color = '#10B981';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.color = '#CBD5E1';
              }}
            >
              <QrCode size={15} color="#0F8F6F" />
              <span>Table QR Menu</span>
            </button>

            <button
              type="button"
              onClick={onNavigateLogin}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                padding: '8px 18px',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)')}
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
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 10px rgba(15, 143, 111, 0.4)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#10B981')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0F8F6F')}
            >
              <span>Launch Workspace</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* ── 2. HERO SECTION WITH AMBIENT GLOW ─────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          padding: '80px 24px 70px',
          overflow: 'hidden',
        }}
      >
        {/* Subtle Ambient Radial Lighting */}
        <div
          style={{
            position: 'absolute',
            top: '-15%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '950px',
            height: '520px',
            background: 'radial-gradient(circle, rgba(15, 143, 111, 0.22) 0%, rgba(242, 184, 75, 0.06) 50%, transparent 80%)',
            filter: 'blur(70px)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', textAlign: 'center' }}>
          {/* Mission Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(15, 143, 111, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: '999px',
              padding: '6px 18px',
              marginBottom: '24px',
            }}
          >
            <span style={{ fontSize: '0.9rem' }}>🇳🇵</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#34D399', letterSpacing: '0.02em' }}>
              Nepal's Premier Restaurant OS · 13% IRD Fiscal VAT Certified
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
              maxWidth: '740px',
              margin: '0 auto 36px',
            }}
          >
            From bustling Thamel cafes and authentic Thakali kitchens to multi-outlet restro-bars — RESTRO8 unifies lightning POS billing, kitchen KOT automation, table QR ordering, and offline inventory in one elegant platform.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '48px' }}>
            <button
              type="button"
              onClick={() => onLaunchWorkspace('SuperAdmin')}
              style={{
                backgroundColor: '#0F8F6F',
                border: 'none',
                color: '#FFFFFF',
                padding: '16px 34px',
                borderRadius: '12px',
                fontSize: '1.02rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 8px 24px rgba(15, 143, 111, 0.45)',
                transition: 'all 0.18s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#10B981';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#0F8F6F';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
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
                padding: '16px 30px',
                borderRadius: '12px',
                fontSize: '1.02rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)')}
            >
              <ShieldCheck size={20} style={{ color: '#10B981' }} />
              <span>Sign In / Demo Role Access</span>
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
              backdropFilter: 'blur(10px)',
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
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#A78BFA' }}>1,200+</div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 500 }}>Restaurants Across Nepal</div>
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
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <p style={{ color: '#10B981', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>
            Hands-on Workspace Simulator
          </p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)', fontWeight: 800, margin: 0 }}>
            Crafted for speed on the counter, calm in the kitchen.
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.92rem', marginTop: '8px' }}>
            Click the tabs below to test POS billing, kitchen KDS bumping, and table QR ordering live:
          </p>
        </div>

        {/* Top Segmented Pill Bar matching RestroLinkView design */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            padding: '5px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.09)',
            width: 'fit-content',
            margin: '0 auto 30px',
            flexWrap: 'wrap',
          }}
        >
          {[
            { id: 'pos', label: 'Counter POS & Billing', icon: ShoppingBag },
            { id: 'kds', label: 'Kitchen KOT / BOT Display', icon: Flame },
            { id: 'qr', label: 'Table QR Ordering (Mobile)', icon: QrCode },
            { id: 'finance', label: 'Day Book & 13% VAT', icon: Receipt },
          ].map((tab) => {
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
                  padding: '9px 20px',
                  borderRadius: '9px',
                  fontSize: '0.86rem',
                  fontWeight: active ? 800 : 600,
                  border: 'none',
                  backgroundColor: active ? '#0F8F6F' : 'transparent',
                  color: active ? '#FFFFFF' : '#94A3B8',
                  cursor: 'pointer',
                  boxShadow: active ? '0 4px 14px rgba(15, 143, 111, 0.35)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── SHOWCASE CONTENT FRAME ────────────────────────────────────────── */}
        <div
          className="landing-showcase-container"
          style={{
            backgroundColor: '#0C121D',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 25px 60px -20px rgba(0, 0, 0, 0.7)',
            minHeight: '440px',
          }}
        >
          {/* TAB 1: POS TERMINAL SIMULATOR */}
          {activeShowcaseTab === 'pos' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
              {/* Left Column: Quick Dish Picker */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>Quick POS Punching</h3>
                    <small style={{ color: '#94A3B8', fontSize: '0.78rem' }}>Tap any item to add to the live order bill:</small>
                  </div>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(16, 185, 129, 0.12)',
                      color: '#10B981',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    Table #04 (Dine-in)
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {[
                    { name: 'Special Thakali Khana Set', price: 480, tag: 'Best Seller', icon: '🍛' },
                    { name: 'Steamed Chicken MoMo (10 pcs)', price: 260, tag: 'Quick Prep', icon: '🥟' },
                    { name: 'Chicken Sekuwa Plate', price: 360, tag: 'Clay Oven', icon: '🍢' },
                    { name: 'Himalayan Herbal Chiya', price: 90, tag: 'Beverage', icon: '☕' },
                    { name: 'Garlic Butter Naan', price: 110, tag: 'Tandoori', icon: '🫓' },
                    { name: 'Gorkha Beer 650ml', price: 540, tag: 'Bar BOT', icon: '🍺' },
                  ].map((item) => (
                    <div
                      key={item.name}
                      onClick={() => handleAddPosItem(item.name, item.price)}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.07)';
                        e.currentTarget.style.borderColor = 'rgba(15, 143, 111, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
                        <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(255, 255, 255, 0.06)', color: '#94A3B8' }}>
                          {item.tag}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#F1F5F9', marginBottom: '4px' }}>{item.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#F2B84B' }}>रू {item.price}</span>
                        <span style={{ fontSize: '0.74rem', color: '#10B981', fontWeight: 700 }}>+ Add</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Live Bill Receipt */}
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255, 255, 255, 0.12)', paddingBottom: '12px', marginBottom: '14px' }}>
                    <div>
                      <strong style={{ fontSize: '0.95rem', color: '#FFFFFF' }}>Live Tax Invoice</strong>
                      <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Bill #80/81-004291 · IRD Reg. 601234567</div>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 700 }}>● Connected</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto', marginBottom: '16px' }}>
                    {posCart.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: '#94A3B8', fontWeight: 700 }}>{item.qty}×</span>
                          <span style={{ color: '#E2E8F0' }}>{item.name}</span>
                        </div>
                        <span style={{ fontWeight: 700, color: '#FFFFFF' }}>रू {item.price * item.qty}</span>
                      </div>
                    ))}
                  </div>

                  {/* Calculations breakdown */}
                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.78rem', color: '#94A3B8' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Subtotal</span>
                      <span>रू {posSubtotal.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Service Charge (10%)</span>
                      <span>रू {posServiceCharge.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Inland Revenue VAT (13%)</span>
                      <span>रू {posVat.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 800, color: '#F2B84B', marginTop: '6px', paddingTop: '6px', borderTop: '1px dashed rgba(255, 255, 255, 0.15)' }}>
                      <span>Grand Total (NPR)</span>
                      <span>रू {posGrandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={handleSimulatePayment}
                    style={{
                      flex: 1,
                      backgroundColor: posSuccessChime ? '#10B981' : '#0F8F6F',
                      border: 'none',
                      color: '#FFFFFF',
                      padding: '12px',
                      borderRadius: '8px',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 14px rgba(15, 143, 111, 0.35)',
                    }}
                  >
                    {posSuccessChime ? <CheckCircle2 size={16} /> : <QrCode size={16} />}
                    <span>{posSuccessChime ? 'Fonepay Paid (Done!)' : 'Collect Fonepay QR'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onLaunchWorkspace('cashier')}
                    style={{
                      padding: '12px 16px',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Printer size={16} />
                    <span>Print KOT</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE KITCHEN DISPLAY (KDS) */}
          {activeShowcaseTab === 'kds' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>Kitchen Display System (KDS Line)</h3>
                  <small style={{ color: '#94A3B8', fontSize: '0.78rem' }}>Click any ticket to bump its station status:</small>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ fontSize: '0.76rem', padding: '4px 10px', borderRadius: '6px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#F87171', fontWeight: 700 }}>● New KOT</span>
                  <span style={{ fontSize: '0.76rem', padding: '4px 10px', borderRadius: '6px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24', fontWeight: 700 }}>● Preparing</span>
                  <span style={{ fontSize: '0.76rem', padding: '4px 10px', borderRadius: '6px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34D399', fontWeight: 700 }}>● Ready</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {kdsTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => handleBumpKdsTicket(ticket.id)}
                    style={{
                      padding: '16px',
                      borderRadius: '14px',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border:
                        ticket.status === 'new'
                          ? '1px solid rgba(239, 68, 68, 0.4)'
                          : ticket.status === 'preparing'
                          ? '1px solid rgba(245, 158, 11, 0.4)'
                          : '1px solid rgba(16, 185, 129, 0.4)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div>
                        <strong style={{ fontSize: '1rem', color: '#FFFFFF' }}>{ticket.table}</strong>
                        <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Ticket #{ticket.id}</div>
                      </div>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          textTransform: 'uppercase',
                          backgroundColor:
                            ticket.status === 'new'
                              ? 'rgba(239, 68, 68, 0.15)'
                              : ticket.status === 'preparing'
                              ? 'rgba(245, 158, 11, 0.15)'
                              : 'rgba(16, 185, 129, 0.15)',
                          color:
                            ticket.status === 'new'
                              ? '#F87171'
                              : ticket.status === 'preparing'
                              ? '#FBBF24'
                              : '#34D399',
                        }}
                      >
                        {ticket.status} · {ticket.time}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                      {ticket.items.map((item, idx) => (
                        <div key={idx} style={{ fontSize: '0.84rem', color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Check size={14} color="#0F8F6F" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    <div
                      style={{
                        padding: '8px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        textAlign: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#CBD5E1',
                      }}
                    >
                      Tap to Bump Status &rarr;
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CONTACTLESS TABLE QR (SMARTPHONE MOCKUP) */}
          {activeShowcaseTab === 'qr' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.84rem', color: '#94A3B8' }}>Select Guest Menu Language:</span>
                <button
                  type="button"
                  onClick={() => setQrLanguage('en')}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: qrLanguage === 'en' ? '#0F8F6F' : 'rgba(255, 255, 255, 0.08)',
                    color: '#FFFFFF',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setQrLanguage('np')}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: qrLanguage === 'np' ? '#0F8F6F' : 'rgba(255, 255, 255, 0.08)',
                    color: '#FFFFFF',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  नेपाली
                </button>
              </div>

              {/* Smartphone Frame */}
              <div
                style={{
                  width: '320px',
                  borderRadius: '32px',
                  border: '4px solid rgba(255, 255, 255, 0.2)',
                  backgroundColor: '#0F172A',
                  padding: '16px 14px',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  position: 'relative',
                }}
              >
                {/* Dynamic Island / Notch */}
                <div style={{ width: '80px', height: '14px', borderRadius: '10px', backgroundColor: '#000000', margin: '0 auto 6px' }} />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '8px' }}>
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: '#FFFFFF' }}>Himalayan Bistro</strong>
                    <div style={{ fontSize: '0.7rem', color: '#10B981' }}>Table #07 · Kathmandu</div>
                  </div>
                  <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34D399', fontWeight: 700 }}>
                    Live Menu
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ padding: '8px 10px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFFFFF' }}>
                        {qrLanguage === 'en' ? 'Buff Steam MoMo' : 'बफ स्टिम मोमो'}
                      </div>
                      <small style={{ color: '#F2B84B', fontSize: '0.72rem', fontWeight: 700 }}>रू 180</small>
                    </div>
                    <button
                      type="button"
                      onClick={() => setQrOrderedCount((c) => c + 1)}
                      style={{ padding: '4px 10px', borderRadius: '6px', border: 'none', backgroundColor: '#0F8F6F', color: '#FFF', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      + Add
                    </button>
                  </div>

                  <div style={{ padding: '8px 10px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFFFFF' }}>
                        {qrLanguage === 'en' ? 'Thakali Mutton Khana' : 'थकाली खसीको खाना सेट'}
                      </div>
                      <small style={{ color: '#F2B84B', fontSize: '0.72rem', fontWeight: 700 }}>रू 480</small>
                    </div>
                    <button
                      type="button"
                      onClick={() => setQrOrderedCount((c) => c + 1)}
                      style={{ padding: '4px 10px', borderRadius: '6px', border: 'none', backgroundColor: '#0F8F6F', color: '#FFF', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {/* Floating Bottom Cart Bar */}
                <div
                  style={{
                    marginTop: '8px',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    backgroundColor: '#0F8F6F',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                  }}
                >
                  <span>{qrOrderedCount} Items Selected</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>Send Order &rarr;</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DAY BOOK & IRD FISCAL VAT */}
          {activeShowcaseTab === 'finance' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>Daily Cashier Register & Day Book</h3>
                  <small style={{ color: '#94A3B8', fontSize: '0.78rem' }}>Real-time cash drawers, digital collections, and IRD 13% tax ledgers:</small>
                </div>
                <button
                  type="button"
                  onClick={() => onLaunchWorkspace('SuperAdmin')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#FFFFFF',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Open Full Ledger &rarr;
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 600 }}>Opening Float</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', marginTop: '4px' }}>रू 15,000</div>
                  <small style={{ fontSize: '0.7rem', color: '#64748B' }}>Cashier Start Balance</small>
                </div>
                <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(15, 143, 111, 0.08)', border: '1px solid rgba(15, 143, 111, 0.25)' }}>
                  <div style={{ fontSize: '0.74rem', color: '#34D399', fontWeight: 600 }}>Total Sales (Gross)</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10B981', marginTop: '4px' }}>रू 84,250</div>
                  <small style={{ fontSize: '0.7rem', color: '#34D399' }}>64 Invoices Generated</small>
                </div>
                <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(242, 184, 75, 0.08)', border: '1px solid rgba(242, 184, 75, 0.25)' }}>
                  <div style={{ fontSize: '0.74rem', color: '#FBBF24', fontWeight: 600 }}>Fonepay QR Collected</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#F2B84B', marginTop: '4px' }}>रू 52,100</div>
                  <small style={{ fontSize: '0.7rem', color: '#FBBF24' }}>Zero Delay Settlement</small>
                </div>
                <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                  <div style={{ fontSize: '0.74rem', color: '#38BDF8', fontWeight: 600 }}>13% VAT Payable</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#38BDF8', marginTop: '4px' }}>रू 9,692</div>
                  <small style={{ fontSize: '0.7rem', color: '#38BDF8' }}>IRD Export Ready</small>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 4. SIX CORE SOLUTION PILLARS ──────────────────────────────────── */}
      <section id="features" style={{ padding: '70px 24px', maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ color: '#10B981', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>
            Built for Real Nepali Hospitality
          </p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)', fontWeight: 800, margin: 0 }}>
            Every tool your restaurant needs to thrive.
          </h2>
        </div>

        <div className="landing-pillars-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {[
            {
              title: '100% Offline-First Architecture',
              desc: 'Never halt billing or cooking when Kathmandu internet goes down. Orders, kitchen printing, and bills punch locally with zero lag.',
              icon: WifiOff,
              color: '#10B981',
            },
            {
              title: 'Inland Revenue (IRD) 13% VAT',
              desc: 'Fully compliant sequential tax invoices, 10% Service Charge, Day Book ledgers, and tamper-evident sales audit trails.',
              icon: Receipt,
              color: '#F2B84B',
            },
            {
              title: 'Multi-Station KDS & Kitchen Routing',
              desc: 'Route food orders to kitchen KOT and beverages to bar BOT. Eliminate missing paper tickets with real-time cooking timers.',
              icon: UtensilsCrossed,
              color: '#38BDF8',
            },
            {
              title: 'Contactless Table QR Dining',
              desc: 'Guests scan with any smartphone camera to browse English/Nepali menus, view dish availability, and place orders directly.',
              icon: QrCode,
              color: '#C084FC',
            },
            {
              title: 'Integrated Fonepay & NepalPay',
              desc: 'Instant dynamic QR counter settlements. Cashiers close tabs in seconds with split-tender support for cash and wallet.',
              icon: Zap,
              color: '#F43F5E',
            },
            {
              title: 'Inventory & Recipe Consumption',
              desc: 'Automatically deduct raw chicken, spices, dairy, and packaging every time a dish is punched at the POS counter.',
              icon: Layers,
              color: '#34D399',
            },
          ].map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                style={{
                  padding: '24px',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: `${pillar.color}1A`,
                    color: pillar.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <Icon size={22} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 8px', color: '#FFFFFF' }}>{pillar.title}</h3>
                <p style={{ margin: 0, fontSize: '0.86rem', color: '#94A3B8', lineHeight: 1.55 }}>{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 5. TRANSPARENT PRICING TABLE ─────────────────────────────────── */}
      <section id="pricing" style={{ padding: '70px 24px', maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <p style={{ color: '#10B981', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>
            Predictable Pricing
          </p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)', fontWeight: 800, margin: '0 0 16px' }}>
            Transparent plans for restaurants of every size.
          </h2>

          {/* Billing switcher */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              padding: '4px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.09)',
              gap: '6px',
            }}
          >
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              style={{
                padding: '6px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: billingCycle === 'monthly' ? '#0F8F6F' : 'transparent',
                color: billingCycle === 'monthly' ? '#FFF' : '#94A3B8',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
            >
              Billed Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('yearly')}
              style={{
                padding: '6px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: billingCycle === 'yearly' ? '#0F8F6F' : 'transparent',
                color: billingCycle === 'yearly' ? '#FFF' : '#94A3B8',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>Billed Annually</span>
              <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#F2B84B', color: '#000', fontWeight: 800 }}>
                2 Mos Free
              </span>
            </button>
          </div>
        </div>

        <div className="landing-pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {/* Plan 1: Starter */}
          <div
            style={{
              padding: '32px 24px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 6px', color: '#FFFFFF' }}>Starter Cafe & Chiya</h3>
              <p style={{ margin: '0 0 20px', fontSize: '0.84rem', color: '#94A3B8' }}>Ideal for small cafes, boba bars, and quick takeaway counters.</p>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '20px' }}>
                रू {billingCycle === 'yearly' ? '1,599' : '1,999'}
                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#94A3B8' }}> / month</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#CBD5E1' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10B981" /> 1 POS Billing Terminal</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10B981" /> Thermal Printer KOT integration</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10B981" /> Offline billing support</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10B981" /> Fonepay Dynamic QR</li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => onLaunchWorkspace('cashier')}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
              }}
            >
              Start Free Trial
            </button>
          </div>

          {/* Plan 2: Pro Restaurant (Highlighted) */}
          <div
            style={{
              padding: '32px 24px',
              borderRadius: '16px',
              backgroundColor: 'rgba(15, 143, 111, 0.06)',
              border: '2px solid #0F8F6F',
              boxShadow: '0 10px 30px rgba(15, 143, 111, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#0F8F6F',
                color: '#FFFFFF',
                padding: '3px 12px',
                borderRadius: '12px',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
              }}
            >
              MOST POPULAR
            </span>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 6px', color: '#FFFFFF' }}>Pro Full-Service</h3>
              <p style={{ margin: '0 0 20px', fontSize: '0.84rem', color: '#94A3B8' }}>For dine-in restaurants, Thakali kitchens, and restro-bars.</p>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#10B981', marginBottom: '20px' }}>
                रू {billingCycle === 'yearly' ? '2,899' : '3,499'}
                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#94A3B8' }}> / month</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#E2E8F0' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10B981" /> Unlimited POS & Waiter Tablets</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10B981" /> Real-Time Kitchen KDS & Bar BOT</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10B981" /> Contactless Table QR Ordering</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10B981" /> IRD 13% VAT & Day Book Ledger</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10B981" /> Recipe & Stock Inventory Engine</li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => onLaunchWorkspace('SuperAdmin')}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#0F8F6F',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(15, 143, 111, 0.4)',
              }}
            >
              Get Started with Pro
            </button>
          </div>

          {/* Plan 3: Multi-Outlet Enterprise */}
          <div
            style={{
              padding: '32px 24px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 6px', color: '#FFFFFF' }}>Multi-Branch Enterprise</h3>
              <p style={{ margin: '0 0 20px', fontSize: '0.84rem', color: '#94A3B8' }}>For hotel chains, food court franchises, and multi-location brands.</p>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '20px' }}>
                रू {billingCycle === 'yearly' ? '5,899' : '6,999'}
                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#94A3B8' }}> / month</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#CBD5E1' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10B981" /> Centralized Multi-Branch P&L</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10B981" /> Central Commissary Stock Transfers</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10B981" /> Custom IRD API Integrations</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10B981" /> Dedicated Kathmandu Account Manager</li>
              </ul>
            </div>
            <button
              type="button"
              onClick={onNavigateLogin}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
              }}
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* ── 6. FAQ ACCORDION ─────────────────────────────────────────────── */}
      <section id="faq" style={{ padding: '70px 24px', maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ color: '#10B981', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>
            Frequently Asked Questions
          </p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', fontWeight: 800, margin: 0 }}>
            Everything you need to know about RESTRO8.
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                style={{
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  overflow: 'hidden',
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '18px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#FFFFFF',
                    textAlign: 'left',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      color: '#10B981',
                    }}
                  />
                </button>
                {isOpen && (
                  <div style={{ padding: '0 20px 18px 20px', fontSize: '0.86rem', color: '#94A3B8', lineHeight: 1.6 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 7. FOOTER ─────────────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '40px 24px',
          backgroundColor: '#0A0F17',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <BrandLogo />
            <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
              &copy; {new Date().getFullYear()} RESTRO8 Inc. The Modern Restaurant OS for Nepal.
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.82rem', color: '#94A3B8' }}>
            <span>Kathmandu Support Desk: +977-1-4567890</span>
            <span>·</span>
            <a href="mailto:support@restro8.app" style={{ color: '#94A3B8', textDecoration: 'none' }}>
              support@restro8.app
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
