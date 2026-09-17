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

  const handleUpdateQty = (name: string, delta: number) => {
    setPosCart((prev) =>
      prev
        .map((item) => (item.name === name ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
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
        backgroundColor: '#FFFFFF',
        color: '#0F172A',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* ── 1. GLOBAL STICKY NAVBAR ───────────────────────────────────────── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #E2E8F0',
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.2s ease',
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
          {/* Left: Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
            <div
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <BrandLogo />
            </div>

            {/* Desktop Navigation Links */}
            <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
              <a
                href="#features"
                style={{
                  color: '#475569',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#0F8F6F')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
              >
                Features
              </a>
              <a
                href="#solutions"
                style={{
                  color: '#475569',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#0F8F6F')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
              >
                Live Interactive Demo
              </a>
              <a
                href="#comparison"
                style={{
                  color: '#475569',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#0F8F6F')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
              >
                Why Restro8
              </a>
              <a
                href="#pricing"
                style={{
                  color: '#475569',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#0F8F6F')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
              >
                Pricing
              </a>
              <a
                href="#faq"
                style={{
                  color: '#475569',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#0F8F6F')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
              >
                FAQ
              </a>
            </nav>
          </div>

          {/* Right: Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={onNavigateMenu}
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                color: '#334155',
                padding: '8px 14px',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F1F5F9';
                e.currentTarget.style.borderColor = '#CBD5E1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F8FAFC';
                e.currentTarget.style.borderColor = '#E2E8F0';
              }}
            >
              <QrCode size={15} color="#0F8F6F" />
              <span>Table QR Menu</span>
            </button>

            <button
              type="button"
              onClick={onNavigateLogin}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#334155',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#0F8F6F')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#334155')}
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
                padding: '10px 20px',
                borderRadius: '9999px',
                fontSize: '0.9rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(15, 143, 111, 0.25)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#087A60';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#0F8F6F';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>Launch Workspace</span>
              <ArrowRight size={15} />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              className="mobile-nav-toggle"
              onClick={() => setMobileNavOpen((prev) => !prev)}
              style={{
                display: 'none',
                backgroundColor: 'transparent',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '8px',
                color: '#334155',
                cursor: 'pointer',
              }}
              aria-label="Toggle menu"
            >
              {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileNavOpen && (
          <div
            style={{
              position: 'absolute',
              top: '72px',
              left: 0,
              right: 0,
              backgroundColor: '#FFFFFF',
              borderBottom: '1px solid #E2E8F0',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <a
              href="#features"
              onClick={() => setMobileNavOpen(false)}
              style={{ color: '#0F172A', textDecoration: 'none', fontWeight: 600, fontSize: '1rem' }}
            >
              Features
            </a>
            <a
              href="#solutions"
              onClick={() => setMobileNavOpen(false)}
              style={{ color: '#0F172A', textDecoration: 'none', fontWeight: 600, fontSize: '1rem' }}
            >
              Live Interactive Demo
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileNavOpen(false)}
              style={{ color: '#0F172A', textDecoration: 'none', fontWeight: 600, fontSize: '1rem' }}
            >
              Pricing
            </a>
            <a
              href="#faq"
              onClick={() => setMobileNavOpen(false)}
              style={{ color: '#0F172A', textDecoration: 'none', fontWeight: 600, fontSize: '1rem' }}
            >
              FAQ
            </a>
            <div style={{ height: '1px', backgroundColor: '#E2E8F0' }} />
            <button
              onClick={() => {
                setMobileNavOpen(false);
                onNavigateMenu();
              }}
              style={{
                padding: '12px',
                borderRadius: '10px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                color: '#0F172A',
                fontWeight: 600,
                textAlign: 'center',
                cursor: 'pointer',
              }}
            >
              Guest QR Menu View
            </button>
            <button
              onClick={() => {
                setMobileNavOpen(false);
                onNavigateLogin();
              }}
              style={{
                padding: '12px',
                borderRadius: '10px',
                backgroundColor: '#0F8F6F',
                border: 'none',
                color: '#FFFFFF',
                fontWeight: 700,
                textAlign: 'center',
                cursor: 'pointer',
              }}
            >
              Sign In to Workspace
            </button>
          </div>
        )}
      </header>

      {/* ── 2. HERO SECTION ─────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          padding: '80px 24px 60px',
          background: 'radial-gradient(50% 50% at 50% 0%, rgba(15, 143, 111, 0.07) 0%, rgba(248, 250, 252, 0.6) 50%, #FFFFFF 100%)',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto', textAlign: 'center' }}>
          {/* Top Pill Tag */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#ECFDF5',
              border: '1px solid #A7F3D0',
              padding: '6px 16px',
              borderRadius: '9999px',
              marginBottom: '24px',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                boxShadow: '0 0 8px rgba(16, 185, 129, 0.8)',
              }}
            />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#065F46', letterSpacing: '0.01em' }}>
              Nepal's Premier Restaurant OS · 13% IRD Fiscal VAT Certified
            </span>
          </div>

          {/* Main Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
              fontWeight: 900,
              lineHeight: 1.12,
              letterSpacing: '-0.035em',
              color: '#0F172A',
              maxWidth: '960px',
              margin: '0 auto 20px',
            }}
          >
            Run Your Restaurant with{' '}
            <span
              style={{
                color: '#0F8F6F',
                background: 'linear-gradient(135deg, #0F8F6F 0%, #059669 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Infinite Precision.
            </span>
          </h1>

          {/* Subheadline */}
          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              lineHeight: 1.6,
              color: '#475569',
              maxWidth: '780px',
              margin: '0 auto 36px',
              fontWeight: 400,
            }}
          >
            From bustling Thamel cafes and authentic Thakali kitchens to multi-outlet restro-bars — RESTRO8 unifies lightning POS billing, kitchen KOT automation, table QR ordering, and offline-first peace of mind.
          </p>

          {/* Hero CTAs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              flexWrap: 'wrap',
              marginBottom: '48px',
            }}
          >
            <button
              type="button"
              onClick={() => onLaunchWorkspace('SuperAdmin')}
              style={{
                backgroundColor: '#0F8F6F',
                color: '#FFFFFF',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '12px',
                fontSize: '1.05rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                boxShadow: '0 10px 25px -5px rgba(15, 143, 111, 0.35)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#087A60';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 15px 30px -5px rgba(15, 143, 111, 0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#0F8F6F';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(15, 143, 111, 0.35)';
              }}
            >
              <Zap size={18} fill="#FFFFFF" />
              <span>Launch Free Workspace (Instant Access)</span>
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={onNavigateLogin}
              style={{
                backgroundColor: '#FFFFFF',
                color: '#1E293B',
                border: '1px solid #CBD5E1',
                padding: '16px 28px',
                borderRadius: '12px',
                fontSize: '1.05rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F8FAFC';
                e.currentTarget.style.borderColor = '#94A3B8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.borderColor = '#CBD5E1';
              }}
            >
              <ShieldCheck size={18} color="#0F8F6F" />
              <span>Sign In / Demo Role Access</span>
            </button>
          </div>

          {/* 4 Value Metric Badges */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
              maxWidth: '1060px',
              margin: '0 auto 64px',
            }}
          >
            {[
              {
                stat: '100%',
                label: 'Offline-Ready Architecture',
                sub: 'Continuous POS billing with zero internet',
                icon: WifiOff,
                color: '#0F8F6F',
                bg: '#ECFDF5',
              },
              {
                stat: '13% VAT',
                label: 'Nepal IRD Tax Compliant',
                sub: 'Sequential audit bills & Day Book register',
                icon: ShieldCheck,
                color: '#0284C7',
                bg: '#F0F9FF',
              },
              {
                stat: '< 1.2s',
                label: 'Fast Thermal Bill Printing',
                sub: '80mm/58mm split KOT to kitchen line',
                icon: Printer,
                color: '#D97706',
                bg: '#FFFBEB',
              },
              {
                stat: '1,200+',
                label: 'Restaurants Across Nepal',
                sub: 'Kathmandu, Pokhara, Chitwan & Lalitpur',
                icon: Users,
                color: '#7C3AED',
                bg: '#F5F3FF',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '16px',
                  padding: '20px 18px',
                  textAlign: 'left',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(15, 23, 42, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 23, 42, 0.04)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '1.75rem', fontWeight: 900, color: item.color, letterSpacing: '-0.02em' }}>
                    {item.stat}
                  </span>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: item.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <item.icon size={18} color={item.color} />
                  </div>
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: 1.4 }}>
                  {item.sub}
                </div>
              </div>
            ))}
          </div>

          {/* ── HERO PRODUCT MOCKUP WITH FLOATING CARDS ──────────────────────── */}
          <div style={{ position: 'relative', maxWidth: '1100px', margin: '0 auto' }}>
            {/* Main Mockup Screen Container */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '20px',
                boxShadow: '0 25px 60px -12px rgba(15, 23, 42, 0.15), 0 0 0 1px rgba(15, 23, 42, 0.02)',
                overflow: 'hidden',
                textAlign: 'left',
              }}
            >
              {/* Mockup Browser/App Chrome Header */}
              <div
                style={{
                  height: '46px',
                  backgroundColor: '#F8FAFC',
                  borderBottom: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 18px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                  <span style={{ marginLeft: '12px', fontSize: '0.8rem', fontWeight: 600, color: '#64748B' }}>
                    RESTRO8 Enterprise POS — Himalayan Thakali Kitchen (Jhamsikhel)
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: '#ECFDF5',
                      color: '#065F46',
                      padding: '3px 9px',
                      borderRadius: '9999px',
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                    Terminal #01 Active
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>ESC/POS 80mm Ready</span>
                </div>
              </div>

              {/* Mockup Body: Two Column Live POS Preview */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.6fr 1fr',
                  minHeight: '440px',
                  backgroundColor: '#F8FAFC',
                }}
              >
                {/* Left: Menu & Table Selection */}
                <div style={{ padding: '24px', borderRight: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {['All Dishes', 'Thakali Specials', 'MoMo & Khaja', 'Beverages'].map((cat, i) => (
                        <button
                          key={cat}
                          type="button"
                          style={{
                            padding: '6px 14px',
                            borderRadius: '8px',
                            border: '1px solid',
                            borderColor: i === 0 ? '#0F8F6F' : '#E2E8F0',
                            backgroundColor: i === 0 ? '#0F8F6F' : '#FFFFFF',
                            color: i === 0 ? '#FFFFFF' : '#334155',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Table: #04 (Dine-in)</span>
                  </div>

                  {/* Menu Items Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                    {[
                      { name: 'Special Thakali Khana Set', cat: 'Traditional', price: 480, tag: 'Bestseller' },
                      { name: 'Steamed Chicken MoMo', cat: '10 pcs with achar', price: 260, tag: 'Chef Choice' },
                      { name: 'Chicken Sekuwa Plate', cat: 'Charcoal grilled', price: 360, tag: 'Hot' },
                      { name: 'Buff C-MoMo (Spicy Gravy)', cat: 'Signature chili broth', price: 310, tag: 'Popular' },
                      { name: 'Himalayan Herbal Chiya', cat: 'Hot Masala Brew', price: 90, tag: 'Organic' },
                      { name: 'Fresh Mint Lime Soda', cat: 'Chilled beverage', price: 140, tag: 'Refresher' },
                    ].map((dish, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleAddPosItem(dish.name, dish.price)}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #E2E8F0',
                          borderRadius: '12px',
                          padding: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#0F8F6F';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 143, 111, 0.12)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#E2E8F0';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <span
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              backgroundColor: '#ECFDF5',
                              color: '#065F46',
                              padding: '2px 6px',
                              borderRadius: '4px',
                            }}
                          >
                            {dish.tag}
                          </span>
                          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F8F6F' }}>
                            रू {dish.price}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', marginBottom: '2px' }}>
                          {dish.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{dish.cat}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Active Order Ticket & Billing */}
                <div style={{ padding: '24px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>Active Bill #INV-2081-492</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Dine-In · Waiter: Ramesh K.</div>
                    </div>
                    <span
                      style={{
                        backgroundColor: '#ECFDF5',
                        border: '1px solid #A7F3D0',
                        color: '#065F46',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      IRD 13% Active
                    </span>
                  </div>

                  {/* Cart Items List */}
                  <div style={{ flex: 1, overflowY: 'auto', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {posCart.map((item) => (
                      <div
                        key={item.name}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 10px',
                          backgroundColor: '#F8FAFC',
                          borderRadius: '8px',
                          border: '1px solid #E2E8F0',
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                            रू {item.price} × {item.qty}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateQty(item.name, -1);
                            }}
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '6px',
                              border: '1px solid #CBD5E1',
                              backgroundColor: '#FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                          >
                            <Minus size={12} />
                          </button>
                          <span style={{ fontSize: '0.82rem', fontWeight: 800, minWidth: '16px', textAlign: 'center' }}>
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateQty(item.name, 1);
                            }}
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '6px',
                              border: '1px solid #CBD5E1',
                              backgroundColor: '#FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                          >
                            <Plus size={12} />
                          </button>
                          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A', minWidth: '55px', textAlign: 'right' }}>
                            रू {item.price * item.qty}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Calculations */}
                  <div
                    style={{
                      borderTop: '1px dashed #CBD5E1',
                      paddingTop: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      fontSize: '0.8rem',
                      color: '#475569',
                      marginBottom: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Subtotal</span>
                      <span>रू {posSubtotal.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>10% Service Charge</span>
                      <span>रू {posServiceCharge.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>13% VAT (Nepal IRD)</span>
                      <span>रू {posVat.toLocaleString()}</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '1rem',
                        fontWeight: 900,
                        color: '#0F172A',
                        paddingTop: '6px',
                        borderTop: '1px solid #E2E8F0',
                      }}
                    >
                      <span>Grand Total</span>
                      <span style={{ color: '#0F8F6F' }}>रू {posGrandTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={handleSimulatePayment}
                      style={{
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #CBD5E1',
                        color: '#334155',
                        padding: '10px',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <Printer size={15} />
                      <span>Print KOT</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSimulatePayment}
                      style={{
                        backgroundColor: '#0F8F6F',
                        border: 'none',
                        color: '#FFFFFF',
                        padding: '10px',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 8px rgba(15, 143, 111, 0.3)',
                      }}
                    >
                      <QrCode size={15} />
                      <span>Fonepay Settle</span>
                    </button>
                  </div>

                  {posSuccessChime && (
                    <div
                      style={{
                        marginTop: '10px',
                        padding: '8px 12px',
                        backgroundColor: '#ECFDF5',
                        border: '1px solid #A7F3D0',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        color: '#065F46',
                        fontWeight: 700,
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <CheckCircle2 size={15} color="#10B981" />
                      <span>Invoice Printed & Fonepay Settled (रू {posGrandTotal})</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── FLOATING REALISTIC SAAS BADGES (Matching RestroX) ────────────── */}
            {/* 1. Floating Live QR Order Badge (Top Right) */}
            <div
              className="r8-float"
              style={{
                position: 'absolute',
                top: '-20px',
                right: '-24px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '16px',
                padding: '16px 20px',
                boxShadow: '0 20px 30px -10px rgba(15, 23, 42, 0.15)',
                maxWidth: '290px',
                textAlign: 'left',
                zIndex: 20,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#065F46',
                    backgroundColor: '#ECFDF5',
                    padding: '3px 8px',
                    borderRadius: '6px',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                  New QR Order
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>Table 07 · Just now</span>
              </div>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0F172A', marginBottom: '2px' }}>
                2× Chicken MoMo, 1× Chiya
              </div>
              <div style={{ fontSize: '0.82rem', color: '#0F8F6F', fontWeight: 800, marginBottom: '10px' }}>
                Total: रू 610.00
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => onLaunchWorkspace('chef')}
                  style={{
                    flex: 1,
                    backgroundColor: '#0F8F6F',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Accept to KDS
                </button>
                <button
                  type="button"
                  style={{
                    backgroundColor: '#F1F5F9',
                    color: '#475569',
                    border: 'none',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Decline
                </button>
              </div>
            </div>

            {/* 2. Floating Live Revenue Card (Bottom Left) */}
            <div
              className="r8-float"
              style={{
                position: 'absolute',
                bottom: '-28px',
                left: '-24px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '16px',
                padding: '16px 20px',
                boxShadow: '0 20px 30px -10px rgba(15, 23, 42, 0.15)',
                minWidth: '240px',
                textAlign: 'left',
                zIndex: 20,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748B' }}>Today's Net Sales</span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#065F46',
                    backgroundColor: '#ECFDF5',
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}
                >
                  <TrendingUp size={12} />
                  +18.4%
                </span>
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '6px' }}>
                रू 64,820.00
              </div>
              {/* Mini Sparkline Bar Chart */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '24px' }}>
                {[30, 45, 60, 40, 85, 95, 70, 90, 100, 80].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${h}%`,
                      backgroundColor: i === 8 ? '#0F8F6F' : '#E2E8F0',
                      borderRadius: '2px',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. TRUSTED BY / SOCIAL PROOF STRIP ──────────────────────────────── */}
      <section
        style={{
          borderTop: '1px solid #E2E8F0',
          borderBottom: '1px solid #E2E8F0',
          backgroundColor: '#F8FAFC',
          padding: '28px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <p
            style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#64748B',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            Trusted by 1,200+ food & beverage businesses across Nepal
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
              flexWrap: 'wrap',
            }}
          >
            {[
              'Kathmandu (Thamel & Jhamsikhel)',
              'Pokhara (Lakeside)',
              'Lalitpur (Patan Durbar)',
              'Chitwan (Sauraha)',
              'Biratnagar',
              'Butwal',
              'Dharan',
            ].map((city) => (
              <span
                key={city}
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#475569',
                  backgroundColor: '#FFFFFF',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
                }}
              >
                📍 {city}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. CORE CAPABILITIES (6 CLEAN WHITE CARDS) ────────────────────── */}
      <section id="features" style={{ padding: '80px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 56px' }}>
            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: 800,
                color: '#0F8F6F',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '8px',
                display: 'inline-block',
              }}
            >
              Enterprise-Grade Features
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
                fontWeight: 900,
                color: '#0F172A',
                letterSpacing: '-0.03em',
                marginBottom: '16px',
              }}
            >
              Everything you need to run your restaurant seamlessly.
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#64748B', lineHeight: 1.6 }}>
              Built specifically for the realities of Nepal hospitality — power cuts, unstable internet, split bills, and strict IRD fiscal tax regulations.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '24px',
            }}
          >
            {[
              {
                icon: Zap,
                color: '#0F8F6F',
                bg: '#ECFDF5',
                title: 'Ultra-Fast POS Billing & Invoicing',
                desc: 'Punch orders in 2 taps, merge tables, apply item-level discounts, and split payments between Cash, Fonepay, and Card in seconds.',
                badge: '< 1.2s bill cycle',
              },
              {
                icon: WifiOff,
                color: '#0284C7',
                bg: '#F0F9FF',
                title: '100% Offline-First Architecture',
                desc: 'Kathmandu fiber cut or storm? RESTRO8 never stops. Print KOTs and finalize bills completely offline, syncing safely once reconnected.',
                badge: 'Zero downtime',
              },
              {
                icon: Utensils,
                color: '#D97706',
                bg: '#FFFBEB',
                title: 'Live Kitchen Display (KDS) & KOT',
                desc: 'Send items straight to kitchen screens or thermal ticket printers. Food items route to Kitchen KOT and drinks route to Bar BOT automatically.',
                badge: 'Multi-station routing',
              },
              {
                icon: QrCode,
                color: '#7C3AED',
                bg: '#F5F3FF',
                title: 'Contactless Table QR Ordering',
                desc: 'Guests scan the table QR with their phone camera to browse photo menus in English or Nepali and submit orders directly to your kitchen.',
                badge: 'No app download',
              },
              {
                icon: ShieldCheck,
                color: '#0F8F6F',
                bg: '#ECFDF5',
                title: 'Nepal IRD 13% VAT Fiscal Compliance',
                desc: 'Sequential bill numbering, 10% Service Charge calculations, daily Day Book registers, and single-click CSV exports for IRD audits.',
                badge: 'Nepal Tax Ready',
              },
              {
                icon: Receipt,
                color: '#EA580C',
                bg: '#FFF7ED',
                title: 'Fonepay & Dynamic QR Payments',
                desc: 'Display dynamic Fonepay, NepalPay, and eSewa QR codes directly on guest receipts for instant, error-free cashier settlement.',
                badge: 'Instant QR Pay',
              },
            ].map((feat, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '16px',
                  padding: '32px',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = feat.color;
                  e.currentTarget.style.boxShadow = '0 16px 32px rgba(15, 23, 42, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 23, 42, 0.03)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        backgroundColor: feat.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <feat.icon size={24} color={feat.color} />
                    </div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: feat.color,
                        backgroundColor: feat.bg,
                        padding: '4px 10px',
                        borderRadius: '9999px',
                      }}
                    >
                      {feat.badge}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '10px' }}>
                    {feat.title}
                  </h3>
                  <p style={{ fontSize: '0.92rem', color: '#64748B', lineHeight: 1.6 }}>
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. INTERACTIVE LIVE PRODUCT SIMULATOR TABS ───────────────────────── */}
      <section id="solutions" style={{ padding: '80px 24px', backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: 800,
                color: '#0F8F6F',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '8px',
                display: 'inline-block',
              }}
            >
              Hands-On Simulator
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
                fontWeight: 900,
                color: '#0F172A',
                letterSpacing: '-0.03em',
                marginBottom: '16px',
              }}
            >
              Experience RESTRO8 right here in your browser.
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#64748B' }}>
              Click between tools below to interact with real workflows — POS billing, Kitchen KDS tickets, and Guest Table QR ordering.
            </p>
          </div>

          {/* Segmented Tab Pill Selector */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: '#FFFFFF',
              padding: '6px',
              borderRadius: '12px',
              width: 'fit-content',
              margin: '0 auto 36px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
              flexWrap: 'wrap',
            }}
          >
            {[
              { id: 'pos', label: '⚡ POS Billing Terminal', icon: ShoppingBag },
              { id: 'kds', label: '👨‍🍳 Kitchen KDS Line', icon: UtensilsCrossed },
              { id: 'qr', label: '📱 Guest Table QR Menu', icon: QrCode },
              { id: 'finance', label: '📊 IRD Sales & Day Book', icon: Receipt },
            ].map((tab) => {
              const isSelected = activeShowcaseTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveShowcaseTab(tab.id as any)}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: isSelected ? '#0F8F6F' : 'transparent',
                    color: isSelected ? '#FFFFFF' : '#475569',
                    fontSize: '0.88rem',
                    fontWeight: isSelected ? 700 : 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <tab.icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Container */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '20px',
              boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.08)',
              padding: '32px',
              maxWidth: '1000px',
              margin: '0 auto',
            }}
          >
            {/* TAB 1: POS TERMINAL */}
            {activeShowcaseTab === 'pos' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                      Fast POS Billing with 13% IRD VAT
                    </h4>
                    <p style={{ fontSize: '0.88rem', color: '#64748B' }}>
                      Click dishes below to add them to your live bill. Watch VAT & service charge calculate instantly.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onLaunchWorkspace('cashier')}
                    style={{
                      backgroundColor: '#ECFDF5',
                      border: '1px solid #A7F3D0',
                      color: '#065F46',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Open Full POS Workspace →
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                  {[
                    { name: 'Special Thakali Khana Set', price: 480 },
                    { name: 'Steamed Chicken MoMo', price: 260 },
                    { name: 'Chicken Sekuwa Plate', price: 360 },
                    { name: 'Himalayan Herbal Chiya', price: 90 },
                  ].map((dish) => (
                    <button
                      key={dish.name}
                      onClick={() => handleAddPosItem(dish.name, dish.price)}
                      style={{
                        padding: '14px',
                        borderRadius: '12px',
                        border: '1px solid #E2E8F0',
                        backgroundColor: '#F8FAFC',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#0F8F6F';
                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#E2E8F0';
                        e.currentTarget.style.backgroundColor = '#F8FAFC';
                      }}
                    >
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
                        + Add {dish.name}
                      </div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F8F6F' }}>
                        रू {dish.price}
                      </div>
                    </button>
                  ))}
                </div>

                <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>
                      Current Guest Ticket ({posCart.length} unique items)
                    </span>
                    <span style={{ fontSize: '0.82rem', color: '#64748B' }}>Table 04 · Terminal #01</span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                    {posCart.map((item) => (
                      <span
                        key={item.name}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          color: '#1E293B',
                        }}
                      >
                        {item.name} × <strong>{item.qty}</strong> (रू {item.price * item.qty})
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #CBD5E1', paddingTop: '12px' }}>
                    <div>
                      <span style={{ fontSize: '0.85rem', color: '#64748B' }}>Total with 10% SC & 13% VAT: </span>
                      <strong style={{ fontSize: '1.2rem', color: '#0F8F6F' }}>रू {posGrandTotal.toLocaleString()}</strong>
                    </div>
                    <button
                      onClick={handleSimulatePayment}
                      style={{
                        backgroundColor: '#0F8F6F',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '10px 18px',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Simulate Fonepay Payment
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: KDS TICKETS */}
            {activeShowcaseTab === 'kds' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                      Interactive Kitchen Display System (KDS)
                    </h4>
                    <p style={{ fontSize: '0.88rem', color: '#64748B' }}>
                      Click any ticket below to cycle status: <strong>New → Preparing → Ready for Pickup</strong>.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onLaunchWorkspace('chef')}
                    style={{
                      backgroundColor: '#ECFDF5',
                      border: '1px solid #A7F3D0',
                      color: '#065F46',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Launch Chef KDS View →
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  {kdsTickets.map((ticket) => {
                    const statusColor =
                      ticket.status === 'new' ? '#EF4444' : ticket.status === 'preparing' ? '#F59E0B' : '#10B981';
                    const statusBg =
                      ticket.status === 'new' ? '#FEF2F2' : ticket.status === 'preparing' ? '#FFFBEB' : '#ECFDF5';

                    return (
                      <div
                        key={ticket.id}
                        onClick={() => handleBumpKdsTicket(ticket.id)}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: `2px solid ${statusColor}`,
                          borderRadius: '14px',
                          padding: '18px',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
                          transition: 'transform 0.15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>
                            {ticket.table} ({ticket.id})
                          </span>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              color: statusColor,
                              backgroundColor: statusBg,
                              padding: '3px 8px',
                              borderRadius: '6px',
                              textTransform: 'uppercase',
                            }}
                          >
                            {ticket.status}
                          </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
                          {ticket.items.map((it, i) => (
                            <div key={i} style={{ fontSize: '0.85rem', color: '#1E293B', fontWeight: 600 }}>
                              • {it}
                            </div>
                          ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
                          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Timer: {ticket.time} elapsed</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0F8F6F' }}>Tap to Advance ➔</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: TABLE QR MENU */}
            {activeShowcaseTab === 'qr' && (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ maxWidth: '460px', margin: '0 auto' }}>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '14px',
                      backgroundColor: '#ECFDF5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                    }}
                  >
                    <QrCode size={28} color="#0F8F6F" />
                  </div>
                  <h4 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                    Zero App Install Table QR Ordering
                  </h4>
                  <p style={{ fontSize: '0.92rem', color: '#64748B', lineHeight: 1.5, marginBottom: '24px' }}>
                    Every dining table receives a dedicated high-resolution QR code. Diners scan with any iPhone or Android camera to view the menu in English or Nepali.
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={onNavigateMenu}
                      style={{
                        backgroundColor: '#0F8F6F',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '10px',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <ExternalLink size={16} />
                      <span>Open Live Table QR Menu Preview</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: IRD SALES & DAY BOOK */}
            {activeShowcaseTab === 'finance' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                      Inland Revenue Department (IRD) Fiscal Audit Register
                    </h4>
                    <p style={{ fontSize: '0.88rem', color: '#64748B' }}>
                      Sequential invoice numbers, non-voidable audit logs, and automatic Day Book closing.
                    </p>
                  </div>
                  <span
                    style={{
                      backgroundColor: '#ECFDF5',
                      border: '1px solid #A7F3D0',
                      color: '#065F46',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                    }}
                  >
                    Nepal Fiscal Verified
                  </span>
                </div>

                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    overflow: 'hidden',
                  }}
                >
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#EDF2F7', textAlign: 'left', color: '#475569' }}>
                        <th style={{ padding: '10px 14px' }}>Invoice No.</th>
                        <th style={{ padding: '10px 14px' }}>Time</th>
                        <th style={{ padding: '10px 14px' }}>Type</th>
                        <th style={{ padding: '10px 14px' }}>Subtotal</th>
                        <th style={{ padding: '10px 14px' }}>13% VAT</th>
                        <th style={{ padding: '10px 14px' }}>Grand Total</th>
                        <th style={{ padding: '10px 14px' }}>Settlement</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { inv: '#INV-2081-492', time: '13:42', type: 'Dine-In', sub: 'रू 1,020', vat: 'रू 132', total: 'रू 1,202', mode: 'Fonepay QR' },
                        { inv: '#INV-2081-491', time: '13:28', type: 'Takeout', sub: 'रू 840', vat: 'रू 109', total: 'रू 949', mode: 'Cash Drawer' },
                        { inv: '#INV-2081-490', time: '13:15', type: 'Dine-In', sub: 'रू 2,450', vat: 'रू 318', total: 'रू 2,768', mode: 'NepalPay' },
                      ].map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}>
                          <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0F172A' }}>{row.inv}</td>
                          <td style={{ padding: '10px 14px', color: '#64748B' }}>{row.time}</td>
                          <td style={{ padding: '10px 14px' }}>{row.type}</td>
                          <td style={{ padding: '10px 14px' }}>{row.sub}</td>
                          <td style={{ padding: '10px 14px', color: '#0F8F6F', fontWeight: 600 }}>{row.vat}</td>
                          <td style={{ padding: '10px 14px', fontWeight: 800, color: '#0F172A' }}>{row.total}</td>
                          <td style={{ padding: '10px 14px' }}>
                            <span style={{ backgroundColor: '#F1F5F9', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                              {row.mode}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 6. WHY RESTRO8 VS TRADITIONAL SOFTWARE COMPARISON ──────────────── */}
      <section id="comparison" style={{ padding: '80px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: 800,
                color: '#0F8F6F',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '8px',
                display: 'inline-block',
              }}
            >
              The Modern Difference
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
                fontWeight: 900,
                color: '#0F172A',
                letterSpacing: '-0.03em',
                marginBottom: '16px',
              }}
            >
              Why restaurant owners switch to RESTRO8.
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#64748B' }}>
              Say goodbye to clunky, outdated Windows XP-era desktop software that crashes and locks you to a single cashier counter.
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px -10px rgba(15, 23, 42, 0.06)',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '16px 20px', fontSize: '0.9rem', color: '#475569', fontWeight: 700 }}>Feature</th>
                  <th style={{ padding: '16px 20px', fontSize: '0.9rem', color: '#0F8F6F', fontWeight: 800, width: '38%' }}>
                    RESTRO8
                  </th>
                  <th style={{ padding: '16px 20px', fontSize: '0.9rem', color: '#94A3B8', fontWeight: 600, width: '32%' }}>
                    Traditional Legacy POS
                  </th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.88rem' }}>
                {[
                  { feat: 'Full Offline Operation', r8: 'Yes — 100% offline-first local cache', old: 'No — freezes when ISP drops' },
                  { feat: 'Contactless Table QR Ordering', r8: 'Built-in (Zero app download)', old: 'Not supported or extra fee' },
                  { feat: 'Live Kitchen Display (KDS)', r8: 'Included with ticket bumping', old: 'Paper thermal printing only' },
                  { feat: 'Nepal IRD 13% Fiscal Compliance', r8: 'Certified sequential invoices', old: 'Manual Day Book entry' },
                  { feat: 'Fonepay & eSewa QR Integration', r8: 'Dynamic QR printed on bill', old: 'Static paper printouts' },
                  { feat: 'Device Support', r8: 'Any Laptop, iPad, Android or Tablet', old: 'Locked to 1 heavy Windows PC' },
                ].map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 600, color: '#0F172A' }}>{row.feat}</td>
                    <td style={{ padding: '14px 20px', fontWeight: 700, color: '#0F8F6F' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle2 size={16} color="#0F8F6F" />
                        <span>{row.r8}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', color: '#64748B' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <X size={15} color="#94A3B8" />
                        <span>{row.old}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── 7. PRICING SECTION (TRANSPARENT NEPAL RUPEES) ─────────────────── */}
      <section id="pricing" style={{ padding: '80px 24px', backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: 800,
                color: '#0F8F6F',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '8px',
                display: 'inline-block',
              }}
            >
              Transparent Pricing
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
                fontWeight: 900,
                color: '#0F172A',
                letterSpacing: '-0.03em',
                marginBottom: '16px',
              }}
            >
              Simple plans for single cafes to multi-outlet chains.
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#64748B' }}>
              No hidden setup fees. Free local training in Kathmandu & Pokhara.
            </p>

            {/* Monthly / Yearly Switcher */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#FFFFFF',
                padding: '4px',
                borderRadius: '9999px',
                border: '1px solid #E2E8F0',
                marginTop: '20px',
              }}
            >
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                style={{
                  padding: '6px 16px',
                  borderRadius: '9999px',
                  border: 'none',
                  backgroundColor: billingCycle === 'monthly' ? '#0F8F6F' : 'transparent',
                  color: billingCycle === 'monthly' ? '#FFFFFF' : '#475569',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                style={{
                  padding: '6px 16px',
                  borderRadius: '9999px',
                  border: 'none',
                  backgroundColor: billingCycle === 'yearly' ? '#0F8F6F' : 'transparent',
                  color: billingCycle === 'yearly' ? '#FFFFFF' : '#475569',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>Annual Billing</span>
                <span style={{ fontSize: '0.72rem', backgroundColor: '#ECFDF5', color: '#065F46', padding: '1px 6px', borderRadius: '4px' }}>
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
              maxWidth: '1080px',
              margin: '0 auto',
            }}
          >
            {[
              {
                title: 'Starter',
                desc: 'Perfect for small cafes, juice bars & takeaway outlets.',
                priceMonthly: 'रू 1,200',
                priceYearly: 'रू 960',
                badge: '14-Day Free Trial',
                isPopular: false,
                features: [
                  '1 POS Terminal',
                  '13% IRD VAT Tax Invoicing',
                  'Thermal 80mm/58mm printing',
                  'Offline-first billing engine',
                  'Daily Day Book sales reports',
                  'Phone & WhatsApp support',
                ],
              },
              {
                title: 'Professional',
                desc: 'Ideal for busy dine-in restaurants, Thakali kitchens & restro-bars.',
                priceMonthly: 'रू 2,400',
                priceYearly: 'रू 1,920',
                badge: 'Most Popular',
                isPopular: true,
                features: [
                  'Unlimited POS & Waiter Tablets',
                  'Table QR Ordering (Unlimited scans)',
                  'Kitchen Display System (KDS)',
                  'Split KOT & Bar BOT routing',
                  'Inventory & Recipe costing',
                  'Fonepay Dynamic QR integration',
                  'Staff permission roles (RBAC)',
                ],
              },
              {
                title: 'Enterprise Multi-Branch',
                desc: 'Designed for restaurant groups with multiple branches across Nepal.',
                priceMonthly: 'रू 4,800',
                priceYearly: 'रू 3,840',
                badge: 'Multi-Outlet',
                isPopular: false,
                features: [
                  'Centralized multi-outlet dashboard',
                  'Master catalog & dish sync',
                  'Inter-branch stock transfers',
                  'Dedicated account manager',
                  'Custom ERP & accounting exports',
                  '24/7 Kathmandu on-site priority support',
                ],
              },
            ].map((plan, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: plan.isPopular ? '2px solid #0F8F6F' : '1px solid #E2E8F0',
                  borderRadius: '20px',
                  padding: '36px 30px',
                  boxShadow: plan.isPopular
                    ? '0 20px 40px -15px rgba(15, 143, 111, 0.18)'
                    : '0 4px 12px rgba(15, 23, 42, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                }}
              >
                {plan.isPopular && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-13px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: '#0F8F6F',
                      color: '#FFFFFF',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '4px 14px',
                      borderRadius: '9999px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Most Popular
                  </div>
                )}

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>{plan.title}</h3>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: plan.isPopular ? '#ECFDF5' : '#F1F5F9',
                        color: plan.isPopular ? '#065F46' : '#475569',
                        padding: '3px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {plan.badge}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5, marginBottom: '24px' }}>
                    {plan.desc}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
                    <span style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.03em' }}>
                      {billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly}
                    </span>
                    <span style={{ fontSize: '0.88rem', color: '#64748B' }}>/ month</span>
                  </div>

                  <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '20px', marginBottom: '32px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
                      Included Features:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {plan.features.map((feat, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#334155' }}>
                          <Check size={16} color="#0F8F6F" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onLaunchWorkspace('SuperAdmin')}
                  style={{
                    backgroundColor: plan.isPopular ? '#0F8F6F' : '#FFFFFF',
                    border: plan.isPopular ? 'none' : '1px solid #CBD5E1',
                    color: plan.isPopular ? '#FFFFFF' : '#1E293B',
                    padding: '14px',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'center',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!plan.isPopular) {
                      e.currentTarget.style.backgroundColor = '#F8FAFC';
                      e.currentTarget.style.borderColor = '#0F8F6F';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!plan.isPopular) {
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                      e.currentTarget.style.borderColor = '#CBD5E1';
                    }
                  }}
                >
                  Start 14-Day Free Trial
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. FREQUENTLY ASKED QUESTIONS (FAQ) ───────────────────────────── */}
      <section id="faq" style={{ padding: '80px 24px', backgroundColor: '#FFFFFF', borderTop: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: 800,
                color: '#0F8F6F',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '8px',
                display: 'inline-block',
              }}
            >
              Frequently Asked Questions
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
                fontWeight: 900,
                color: '#0F172A',
                letterSpacing: '-0.03em',
              }}
            >
              Everything you need to know.
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
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
                      backgroundColor: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.98rem',
                      fontWeight: 700,
                      color: '#0F172A',
                    }}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      color="#64748B"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.2s ease',
                      }}
                    />
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 20px 20px', color: '#64748B', fontSize: '0.92rem', lineHeight: 1.6 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 9. BOTTOM HIGH-CONVERTING CTA BANNER ────────────────────────────── */}
      <section style={{ padding: '60px 24px', backgroundColor: '#F8FAFC' }}>
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            backgroundColor: '#0F8F6F',
            backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(255, 255, 255, 0.15) 0%, transparent 60%)',
            borderRadius: '24px',
            padding: '56px 40px',
            color: '#FFFFFF',
            textAlign: 'center',
            boxShadow: '0 20px 40px -10px rgba(15, 143, 111, 0.4)',
          }}
        >
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.03em' }}>
            Ready to modernize your restaurant?
          </h2>
          <p style={{ fontSize: '1.15rem', opacity: 0.9, maxWidth: '640px', margin: '0 auto 36px', lineHeight: 1.6 }}>
            Join 1,200+ restaurants across Nepal saving hours daily with lightning POS billing and zero-downtime offline reliability.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => onLaunchWorkspace('SuperAdmin')}
              style={{
                backgroundColor: '#FFFFFF',
                color: '#0F8F6F',
                border: 'none',
                padding: '16px 36px',
                borderRadius: '12px',
                fontSize: '1.05rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              Start Free 14-Day Trial →
            </button>

            <button
              type="button"
              onClick={onNavigateLogin}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '16px 28px',
                borderRadius: '12px',
                fontSize: '1.05rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Sign In to Existing Account
            </button>
          </div>
        </div>
      </section>

      {/* ── 10. CLEAN GLOBAL FOOTER ─────────────────────────────────────────── */}
      <footer style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #E2E8F0', padding: '60px 24px 30px' }}>
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px',
            marginBottom: '48px',
          }}
        >
          {/* Brand & Contact Info */}
          <div style={{ maxWidth: '320px' }}>
            <BrandLogo />
            <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.6, marginTop: '14px', marginBottom: '16px' }}>
              The modern, offline-first restaurant management operating system engineered specifically for Nepal's culinary industry.
            </p>
            <div style={{ fontSize: '0.82rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div>🏢 New Baneshwor, Kathmandu, Nepal</div>
              <div>📞 Hotline: +977-1-4567890 / 9801234567</div>
              <div>✉️ support@restro8.app</div>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>Solutions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#64748B' }}>
              <span>POS Billing Terminal</span>
              <span>Kitchen Display (KDS)</span>
              <span>Table QR Digital Ordering</span>
              <span>13% IRD VAT Tax Invoices</span>
              <span>Fonepay QR Settlement</span>
            </div>
          </div>

          {/* Restaurant Types */}
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>Restaurant Types</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#64748B' }}>
              <span>Dine-In Restaurants</span>
              <span>Cafes & Coffee Shops</span>
              <span>Thakali Kitchens</span>
              <span>Restro-Bars & Lounges</span>
              <span>Cloud Kitchens & Bakery</span>
            </div>
          </div>

          {/* Quick Access */}
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>Quick Access</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <button
                onClick={() => onLaunchWorkspace('SuperAdmin')}
                style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', color: '#0F8F6F', fontWeight: 700, cursor: 'pointer' }}
              >
                Launch Workspace
              </button>
              <button
                onClick={onNavigateLogin}
                style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
              >
                Sign In / Login
              </button>
              <button
                onClick={onNavigateMenu}
                style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
              >
                Public Guest QR Menu
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            borderTop: '1px solid #F1F5F9',
            paddingTop: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.82rem',
            color: '#94A3B8',
          }}
        >
          <div>© {new Date().getFullYear()} RESTRO8 Nepal Inc. All rights reserved.</div>
          <div>Built with pride in Kathmandu 🇳🇵 for infinite hospitality.</div>
        </div>
      </footer>
    </div>
  );
};
