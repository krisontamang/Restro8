import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Bell,
  Calculator,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Coffee,
  CreditCard,
  Download,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  Flame,
  Globe,
  HelpCircle,
  Info,
  Laptop,
  Layers,
  Lock,
  Menu,
  MessageCircle,
  Minus,
  Percent,
  Phone,
  PhoneCall,
  Plus,
  Printer,
  QrCode,
  Receipt,
  RotateCw,
  Search,
  Shield,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Store,
  Tablet,
  Tag,
  ThumbsUp,
  TrendingUp,
  Truck,
  UserCheck,
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
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<'pos' | 'kds' | 'qr' | 'finance' | 'inventory'>('pos');
  const [activeSolutionTab, setActiveSolutionTab] = useState<'dinein' | 'thakali' | 'cafe' | 'cloud' | 'bakery'>('dinein');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [selectedFaqCategory, setSelectedFaqCategory] = useState<'all' | 'hardware' | 'offline' | 'tax' | 'payments'>('all');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // ROI / Savings Calculator State
  const [calcDailyOrders, setCalcDailyOrders] = useState<number>(140);
  const [calcAvgTicket, setCalcAvgTicket] = useState<number>(850);

  // Instant Callback Request State
  const [callbackPhone, setCallbackPhone] = useState('');
  const [callbackSubmitted, setCallbackSubmitted] = useState(false);

  // Interactive Live POS Simulator State
  const [posCart, setPosCart] = useState<Array<{ name: string; price: number; qty: number }>>([
    { name: 'Special Thakali Khana Set', price: 480, qty: 1 },
    { name: 'Steamed Chicken MoMo (10 pcs)', price: 260, qty: 1 },
    { name: 'Himalayan Herbal Chiya', price: 90, qty: 2 },
  ]);
  const [posSuccessChime, setPosSuccessChime] = useState(false);

  // Interactive Live KDS Simulator State
  const [kdsTickets, setKdsTickets] = useState([
    { id: 'T-04', table: 'Table 4', time: '5m ago', status: 'preparing', items: ['1× Thakali Set (Mutton)', '1× Extra Ghee Rice'] },
    { id: 'T-09', table: 'Table 9', time: '1m ago', status: 'new', items: ['2× Buff C-MoMo', '2× Coca-Cola 250ml'] },
    { id: 'B-02', table: 'Bar Counter', time: '11m ago', status: 'ready', items: ['1× Everest Beer 650ml', '1× Masala Peanuts'] },
  ]);

  // Math for POS Simulator
  const posSubtotal = posCart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const posServiceCharge = Math.round(posSubtotal * 0.1);
  const posTaxable = posSubtotal + posServiceCharge;
  const posVat = Math.round(posTaxable * 0.13);
  const posGrandTotal = posTaxable + posVat;

  // Math for ROI Calculator
  const monthlyRevenue = calcDailyOrders * calcAvgTicket * 30;
  const estimatedLeakagePrevented = Math.round(monthlyRevenue * 0.042); // 4.2% saved on bill & inventory leakage
  const hoursSavedPerMonth = Math.round((calcDailyOrders * 1.5 * 30) / 60); // 1.5 mins saved per ticket in billing

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
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#0F8F6F', '#10B981', '#F2B84B', '#0284C7'],
      });
    } catch {
      // Fallback
    }
    setTimeout(() => setPosSuccessChime(false), 2600);
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

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callbackPhone.trim() || callbackPhone.length < 8) return;
    setCallbackSubmitted(true);
    setTimeout(() => setCallbackSubmitted(false), 5000);
  };

  const allFaqs = [
    {
      cat: 'offline',
      q: 'Does RESTRO8 work when the local internet in Nepal drops out?',
      a: 'Yes, 100%. RESTRO8 is engineered offline-first with local synchronization. When Kathmandu fiber cables are cut or ISP networks drop, your POS terminals continue punching orders, printing KOTs to kitchen thermal printers, and billing guests locally with zero interruption. The moment connectivity restores, all data reconciles safely with the cloud.',
    },
    {
      cat: 'tax',
      q: 'Is RESTRO8 compliant with Nepal Inland Revenue Department (IRD) 13% VAT?',
      a: 'Yes. RESTRO8 is strictly built for Nepal fiscal standards. It issues sequential, tamper-evident tax invoices, calculates 13% VAT and 10% Service Charge, maintains daily Day Book registers, records cashier opening/closing drawer floats, and exports IRD-ready audit sheets with single-click CSV export.',
    },
    {
      cat: 'hardware',
      q: 'Which receipt and kitchen ticket printers are supported?',
      a: 'RESTRO8 supports all standard 58mm and 80mm ESC/POS thermal printers via USB, Ethernet (LAN), and Bluetooth (including Epson, Bixolon, Xprinter, Rongta, and Sunmi). It routes drink items to Bar BOT printers and food items to Kitchen KOT printers automatically, avoiding staff confusion.',
    },
    {
      cat: 'payments',
      q: 'Can we accept Fonepay, NepalPay, and digital wallets?',
      a: 'Yes. RESTRO8 supports integrated Dynamic QR codes for Fonepay, NepalPay, eSewa, and Khalti. Guests scan and pay immediately from their mobile banking app (Global IME, Nabil, NIC Asia, etc.), while the cashier settles with single-click split tender.',
    },
    {
      cat: 'hardware',
      q: 'Do we need to buy expensive proprietary hardware from you?',
      a: 'No! Unlike legacy software vendors, RESTRO8 runs on devices you already own: Windows PCs, MacBooks, iPads, Android tablets, Sunmi handhelds, and smartphones. This saves you रू 50,000 to रू 1,50,000 in upfront hardware costs.',
    },
    {
      cat: 'offline',
      q: 'What happens during load shedding or power cuts?',
      a: 'Since RESTRO8 works on battery-powered tablets, laptops, and smartphones paired with battery/UPS-backed thermal printers, your dining room operations continue smoothly even during extended power outages.',
    },
  ];

  const filteredFaqs =
    selectedFaqCategory === 'all'
      ? allFaqs
      : allFaqs.filter((f) => f.cat === selectedFaqCategory);

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
      {/* ── 1. TOP ANNOUNCEMENT BAR ───────────────────────────────────────── */}
      {!announcementDismissed && (
        <div
          style={{
            backgroundColor: '#0F8F6F',
            color: '#FFFFFF',
            fontSize: '0.84rem',
            fontWeight: 600,
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 101,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.74rem',
                fontWeight: 800,
                textTransform: 'uppercase',
              }}
            >
              Fiscal Update
            </span>
            <span>
              Nepal IRD Fiscal Year 2081/82 certified sequential tax invoices and direct Fonepay Dynamic QR now live.
            </span>
            <button
              type="button"
              onClick={() => onLaunchWorkspace('cashier')}
              style={{
                background: 'none',
                border: 'none',
                color: '#FFF7E3',
                fontWeight: 800,
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '0.84rem',
                padding: 0,
              }}
            >
              Test Live POS Billing →
            </button>
          </div>

          <button
            type="button"
            onClick={() => setAnnouncementDismissed(true)}
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: '#FFFFFF',
              opacity: 0.8,
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="Dismiss announcement"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* ── 2. GLOBAL STICKY NAVBAR ───────────────────────────────────────── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #E2E8F0',
          height: '74px',
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.2s ease',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            width: '100%',
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Left: Brand Logo + Nepal Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <div
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <BrandLogo />
            </div>

            {/* Desktop Navigation Links */}
            <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '26px' }}>
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
                By Restaurant Type
              </a>
              <a
                href="#simulator"
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
                Interactive Simulator
              </a>
              <a
                href="#calculator"
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
                ROI Calculator
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
            </nav>
          </div>

          {/* Right: Actions & Contact Hotline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <a
              href="tel:014567890"
              className="desktop-hotline"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.84rem',
                fontWeight: 700,
                color: '#334155',
                textDecoration: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
              }}
            >
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              <span>📞 01-4567890</span>
            </a>

            <button
              type="button"
              onClick={onNavigateMenu}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
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
                e.currentTarget.style.backgroundColor = '#F8FAFC';
                e.currentTarget.style.borderColor = '#0F8F6F';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.borderColor = '#CBD5E1';
              }}
            >
              <QrCode size={15} color="#0F8F6F" />
              <span>Table QR Demo</span>
            </button>

            <button
              type="button"
              onClick={onNavigateLogin}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#334155',
                padding: '8px 14px',
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
                padding: '10px 22px',
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
              top: '74px',
              left: 0,
              right: 0,
              backgroundColor: '#FFFFFF',
              borderBottom: '1px solid #E2E8F0',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <a href="#features" onClick={() => setMobileNavOpen(false)} style={{ color: '#0F172A', textDecoration: 'none', fontWeight: 600 }}>Features</a>
            <a href="#solutions" onClick={() => setMobileNavOpen(false)} style={{ color: '#0F172A', textDecoration: 'none', fontWeight: 600 }}>By Restaurant Type</a>
            <a href="#simulator" onClick={() => setMobileNavOpen(false)} style={{ color: '#0F172A', textDecoration: 'none', fontWeight: 600 }}>Interactive Simulator</a>
            <a href="#calculator" onClick={() => setMobileNavOpen(false)} style={{ color: '#0F172A', textDecoration: 'none', fontWeight: 600 }}>ROI Calculator</a>
            <a href="#pricing" onClick={() => setMobileNavOpen(false)} style={{ color: '#0F172A', textDecoration: 'none', fontWeight: 600 }}>Pricing</a>
            <div style={{ height: '1px', backgroundColor: '#E2E8F0' }} />
            <button
              onClick={() => { setMobileNavOpen(false); onNavigateMenu(); }}
              style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', fontWeight: 700, cursor: 'pointer' }}
            >
              Open Table QR Menu Demo
            </button>
            <button
              onClick={() => { setMobileNavOpen(false); onNavigateLogin(); }}
              style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#0F8F6F', border: 'none', color: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}
            >
              Sign In to Workspace
            </button>
          </div>
        )}
      </header>

      {/* ── 3. HERO SECTION WITH RICH VISUALS & PROOF ───────────────────────── */}
      <section
        style={{
          position: 'relative',
          padding: '80px 24px 70px',
          background: 'radial-gradient(55% 55% at 50% 0%, rgba(15, 143, 111, 0.08) 0%, rgba(248, 250, 252, 0.7) 45%, #FFFFFF 100%)',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
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
              marginBottom: '22px',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                boxShadow: '0 0 10px rgba(16, 185, 129, 0.9)',
              }}
            />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#065F46' }}>
              🇳🇵 Nepal's Most Trusted Restaurant Operating System · 13% IRD VAT Certified
            </span>
          </div>

          {/* Main Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5.8vw, 4.4rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.038em',
              color: '#0F172A',
              maxWidth: '1000px',
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
              fontSize: 'clamp(1.05rem, 2.1vw, 1.25rem)',
              lineHeight: 1.6,
              color: '#475569',
              maxWidth: '820px',
              margin: '0 auto 36px',
              fontWeight: 400,
            }}
          >
            From bustling Thamel cafes and authentic Thakali kitchens to multi-outlet restro-bars — RESTRO8 unifies lightning POS billing, kitchen KOT automation, table QR ordering, 13% IRD VAT fiscal tax invoices, and offline-first peace of mind.
          </p>

          {/* Hero CTAs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              flexWrap: 'wrap',
              marginBottom: '28px',
            }}
          >
            <button
              type="button"
              onClick={() => onLaunchWorkspace('SuperAdmin')}
              style={{
                backgroundColor: '#0F8F6F',
                color: '#FFFFFF',
                border: 'none',
                padding: '16px 34px',
                borderRadius: '12px',
                fontSize: '1.05rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                boxShadow: '0 12px 28px -5px rgba(15, 143, 111, 0.38)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#087A60';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#0F8F6F';
                e.currentTarget.style.transform = 'translateY(0)';
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

          {/* Social Proof Star Rating Under CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginBottom: '56px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', color: '#F2B84B' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={17} fill="#F2B84B" />
              ))}
            </div>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>
              4.9/5 Rating from 850+ restaurant owners in Nepal
            </span>
            <span style={{ color: '#CBD5E1' }}>•</span>
            <span style={{ fontSize: '0.88rem', color: '#64748B' }}>
              No credit card required · Setup in 5 minutes
            </span>
          </div>

          {/* 4 Value Metric Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
              maxWidth: '1120px',
              margin: '0 auto 64px',
            }}
          >
            {[
              {
                stat: '100%',
                label: 'Offline-Ready Architecture',
                sub: 'Continuous POS billing with zero internet drops',
                icon: WifiOff,
                color: '#0F8F6F',
                bg: '#ECFDF5',
              },
              {
                stat: '13% VAT',
                label: 'Nepal IRD Tax Compliant',
                sub: 'Sequential audit bills, Day Book & tax registers',
                icon: ShieldCheck,
                color: '#0284C7',
                bg: '#F0F9FF',
              },
              {
                stat: '< 1.2s',
                label: 'Fast Thermal Bill Printing',
                sub: '80mm/58mm split KOT & bar ticket routing',
                icon: Printer,
                color: '#D97706',
                bg: '#FFFBEB',
              },
              {
                stat: '1,200+',
                label: 'Restaurants Across Nepal',
                sub: 'Kathmandu, Pokhara, Lalitpur & Chitwan',
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
                  padding: '22px 20px',
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
                  <span style={{ fontSize: '1.85rem', fontWeight: 900, color: item.color, letterSpacing: '-0.02em' }}>
                    {item.stat}
                  </span>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      backgroundColor: item.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <item.icon size={19} color={item.color} />
                  </div>
                </div>
                <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.4 }}>
                  {item.sub}
                </div>
              </div>
            ))}
          </div>

          {/* ── HERO PRODUCT MOCKUP WITH DYNAMIC FLOATING NOTIFICATIONS ───────── */}
          <div style={{ position: 'relative', maxWidth: '1140px', margin: '0 auto' }}>
            {/* Main Mockup Screen */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '22px',
                boxShadow: '0 25px 60px -12px rgba(15, 23, 42, 0.16), 0 0 0 1px rgba(15, 23, 42, 0.02)',
                overflow: 'hidden',
                textAlign: 'left',
              }}
            >
              {/* Mockup Browser Header Bar */}
              <div
                style={{
                  height: '48px',
                  backgroundColor: '#F8FAFC',
                  borderBottom: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                  <span style={{ marginLeft: '12px', fontSize: '0.82rem', fontWeight: 600, color: '#64748B' }}>
                    RESTRO8 Enterprise POS — Himalayan Thakali Kitchen (Jhamsikhel Outlet)
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      backgroundColor: '#ECFDF5',
                      color: '#065F46',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                    Terminal #01 Active · 100% Offline Mode Ready
                  </span>
                  <span style={{ fontSize: '0.76rem', color: '#94A3B8' }}>ESC/POS 80mm Ready</span>
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
                {/* Left: Table & Catalog Grid */}
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

            {/* ── FLOATING SAAS BADGES ──────────────────────────────────────── */}
            {/* 1. Live Table QR Notification (Top Right) */}
            <div
              className="r8-float"
              style={{
                position: 'absolute',
                top: '-24px',
                right: '-24px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '16px',
                padding: '16px 20px',
                boxShadow: '0 20px 30px -10px rgba(15, 23, 42, 0.16)',
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

            {/* 2. Live Today's Revenue Card (Bottom Left) */}
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
                boxShadow: '0 20px 30px -10px rgba(15, 23, 42, 0.16)',
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

      {/* ── 4. CITY FOOTPRINT / SOCIAL PROOF ─────────────────────────────────── */}
      <section
        style={{
          borderTop: '1px solid #E2E8F0',
          borderBottom: '1px solid #E2E8F0',
          backgroundColor: '#F8FAFC',
          padding: '28px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <p
            style={{
              fontSize: '0.82rem',
              fontWeight: 800,
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
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            {[
              { name: 'Kathmandu (Thamel & Baneshwor)', count: '540+ Outlets' },
              { name: 'Lalitpur (Jhamsikhel & Patan)', count: '320+ Outlets' },
              { name: 'Pokhara (Lakeside & Damside)', count: '210+ Outlets' },
              { name: 'Chitwan (Bharatpur & Sauraha)', count: '85+ Outlets' },
              { name: 'Biratnagar, Butwal & Dharan', count: '140+ Outlets' },
            ].map((city) => (
              <span
                key={city.name}
                style={{
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: '#334155',
                  backgroundColor: '#FFFFFF',
                  padding: '7px 16px',
                  borderRadius: '9999px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>📍 {city.name}</span>
                <span style={{ fontSize: '0.74rem', color: '#0F8F6F', fontWeight: 800, backgroundColor: '#ECFDF5', padding: '1px 6px', borderRadius: '4px' }}>
                  {city.count}
                </span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. SOLUTIONS BY RESTAURANT TYPE (CUSTOM WORKFLOW TABS) ─────────── */}
      <section id="solutions" style={{ padding: '80px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 48px' }}>
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
              Tailored For Your Workflow
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
              Built for every type of dining experience in Nepal.
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#64748B', lineHeight: 1.6 }}>
              Whether you are running a high-turnover Thakali kitchen, a craft cafe in Jhamsikhel, or a multi-floor lounge in Pokhara.
            </p>
          </div>

          {/* Restaurant Type Selector Tabs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: '#F8FAFC',
              padding: '6px',
              borderRadius: '14px',
              border: '1px solid #E2E8F0',
              width: 'fit-content',
              margin: '0 auto 40px',
              flexWrap: 'wrap',
            }}
          >
            {[
              { id: 'dinein', label: 'Dine-In & Restro-Bars', icon: Store },
              { id: 'thakali', label: 'Thakali Kitchens', icon: Utensils },
              { id: 'cafe', label: 'Cafes & Bakeries', icon: Coffee },
              { id: 'cloud', label: 'Cloud Kitchens & Delivery', icon: Truck },
              { id: 'bakery', label: 'Fast Casual & Takeaways', icon: Zap },
            ].map((sol) => {
              const isSelected = activeSolutionTab === sol.id;
              return (
                <button
                  key={sol.id}
                  type="button"
                  onClick={() => setActiveSolutionTab(sol.id as any)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '9px 18px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: isSelected ? '#0F8F6F' : 'transparent',
                    color: isSelected ? '#FFFFFF' : '#475569',
                    fontSize: '0.88rem',
                    fontWeight: isSelected ? 700 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <sol.icon size={16} />
                  <span>{sol.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Solution Content Card */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '20px',
              padding: '40px',
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: '40px',
              alignItems: 'center',
            }}
          >
            {activeSolutionTab === 'dinein' && (
              <>
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F8F6F', textTransform: 'uppercase' }}>
                    Dine-In Restaurants & Restro-Bars
                  </span>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F172A', margin: '8px 0 16px' }}>
                    Turn tables 25% faster with synchronized Floor & Bar KOTs.
                  </h3>
                  <p style={{ fontSize: '0.98rem', color: '#64748B', lineHeight: 1.6, marginBottom: '24px' }}>
                    Waiters take orders on mobile tablets, routing beverage tickets instantly to Bar BOT printers and entrees to Kitchen KDS. Split bills easily across multiple cards, cash, and Fonepay.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '28px' }}>
                    {[
                      'Visual Floor Plan with Table Status',
                      'Separate Kitchen KOT & Bar BOT',
                      'Split, Merge & Transfer Bills',
                      'Happy Hour & Auto Pricing Rules',
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>
                        <CheckCircle2 size={16} color="#0F8F6F" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => onLaunchWorkspace('waiter')}
                    style={{
                      backgroundColor: '#0F8F6F',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '10px',
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span>Test Table & Floor Plan Mode</span>
                    <ArrowRight size={16} />
                  </button>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', marginBottom: '14px' }}>
                    Floor Plan Status (Indoor Dining + Rooftop Garden)
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {[
                      { table: 'T-01', status: 'Occupied', color: '#EF4444', bg: '#FEF2F2', amount: 'रू 2,450' },
                      { table: 'T-02', status: 'Free', color: '#10B981', bg: '#ECFDF5', amount: 'Available' },
                      { table: 'T-03', status: 'Billed', color: '#F59E0B', bg: '#FFFBEB', amount: 'रू 1,840' },
                      { table: 'T-04', status: 'Occupied', color: '#EF4444', bg: '#FEF2F2', amount: 'रू 4,120' },
                      { table: 'T-05', status: 'Free', color: '#10B981', bg: '#ECFDF5', amount: 'Available' },
                      { table: 'Bar-1', status: 'Occupied', color: '#EF4444', bg: '#FEF2F2', amount: 'रू 950' },
                    ].map((t) => (
                      <div key={t.table} style={{ backgroundColor: t.bg, border: `1px solid ${t.color}30`, borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '1rem', fontWeight: 900, color: '#0F172A' }}>{t.table}</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: t.color, margin: '2px 0' }}>{t.status}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{t.amount}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeSolutionTab === 'thakali' && (
              <>
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F8F6F', textTransform: 'uppercase' }}>
                    Authentic Thakali Kitchens
                  </span>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F172A', margin: '8px 0 16px' }}>
                    Engineered for high-speed Set Punching & Free Refill tracking.
                  </h3>
                  <p style={{ fontSize: '0.98rem', color: '#64748B', lineHeight: 1.6, marginBottom: '24px' }}>
                    Punch Mutton, Chicken, and Veg Thakali Khana sets in a single tap. Waiters can request extra ghee rice, dal, and gundruk refill tokens without re-charging the guest.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '28px' }}>
                    {[
                      '1-Tap Thakali Set Multi-Order',
                      'Free Ghee Rice/Dal Refill Tracking',
                      'Charcoal Sekuwa Station Routing',
                      'Lightning Batch Khana Billing',
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>
                        <CheckCircle2 size={16} color="#0F8F6F" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => onLaunchWorkspace('cashier')}
                    style={{
                      backgroundColor: '#0F8F6F',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '10px',
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span>Launch Thakali Kitchen POS</span>
                    <ArrowRight size={16} />
                  </button>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
                    Rush Hour Thali Ticket Batch
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      { item: '3× Mutton Thakali Set (Timur Achar)', status: 'Cooking', time: '4m' },
                      { item: '2× Extra Ghee Rice (Complimentary Refill)', status: 'Dispatched', time: '1m' },
                      { item: '1× Chicken Sukuti Plate (Medium Spicy)', status: 'Ready', time: '6m' },
                      { item: '4× Himalayan Herbal Chiya', status: 'Ready', time: '2m' },
                    ].map((row, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.84rem' }}>
                        <span style={{ fontWeight: 700, color: '#0F172A' }}>{row.item}</span>
                        <span style={{ color: '#0F8F6F', fontWeight: 800 }}>{row.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeSolutionTab === 'cafe' && (
              <>
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F8F6F', textTransform: 'uppercase' }}>
                    Cafes, Coffee Shops & Bakeries
                  </span>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F172A', margin: '8px 0 16px' }}>
                    Fast counter ordering, barista ticket queue & customer display.
                  </h3>
                  <p style={{ fontSize: '0.98rem', color: '#64748B', lineHeight: 1.6, marginBottom: '24px' }}>
                    Customize oat milk, sugar levels, and extra espresso shots effortlessly. Print sticker slips for coffee cups and show dynamic Fonepay QR on dual-screen customer facing displays.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '28px' }}>
                    {[
                      'Milk & Syrups Modifier Add-Ons',
                      'Coffee Cup Thermal Sticker Printing',
                      'Bakery Expiry & Stock Deduction',
                      'Customer Facing QR Display',
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>
                        <CheckCircle2 size={16} color="#0F8F6F" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => onLaunchWorkspace('cashier')}
                    style={{
                      backgroundColor: '#0F8F6F',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '10px',
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span>Test Cafe Counter Checkout</span>
                    <ArrowRight size={16} />
                  </button>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
                    Barista Espresso Ticket Line
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      { drink: '1× Oat Milk Vanilla Latte', mod: 'Extra shot espresso · Low sugar', status: 'Brewing' },
                      { drink: '2× Americano (Single Origin)', mod: 'Iced · Kathmandu Roast', status: 'Ready' },
                      { drink: '1× Almond Croissant', mod: 'Warm up · Counter', status: 'Served' },
                    ].map((c, i) => (
                      <div key={i} style={{ padding: '10px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>
                          <span>{c.drink}</span>
                          <span style={{ color: '#0F8F6F' }}>{c.status}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>{c.mod}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeSolutionTab === 'cloud' && (
              <>
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F8F6F', textTransform: 'uppercase' }}>
                    Cloud Kitchens & Delivery Aggregators
                  </span>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F172A', margin: '8px 0 16px' }}>
                    Unify Bhojdeals, Foodmandu, and Direct phone orders in one place.
                  </h3>
                  <p style={{ fontSize: '0.98rem', color: '#64748B', lineHeight: 1.6, marginBottom: '24px' }}>
                    Prevent missed delivery orders and manage multi-brand menus from a single kitchen station. Automatic driver dispatch timestamps keep your ratings high.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '28px' }}>
                    {[
                      'Multi-Brand Single Screen Queue',
                      'Delivery Rider Dispatch Timing',
                      'Packaging Stock Depletion',
                      'Direct WhatsApp Menu Ordering',
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>
                        <CheckCircle2 size={16} color="#0F8F6F" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => onLaunchWorkspace('chef')}
                    style={{
                      backgroundColor: '#0F8F6F',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '10px',
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Open Cloud Kitchen Hub →
                  </button>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
                    Active Delivery Dispatch Line
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      { id: 'DEL-881', rider: 'Foodmandu Rider', items: '2× C-MoMo, 1× Chowmein', time: 'Pickup in 3m' },
                      { id: 'DEL-882', rider: 'Bhojdeals Rider', items: '1× Chicken Burger Combo', time: 'Dispatched' },
                      { id: 'DEL-883', rider: 'Direct Call Order', items: '3× Thakali Sets (Thamel)', time: 'Packing' },
                    ].map((d, i) => (
                      <div key={i} style={{ padding: '10px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700 }}>
                          <span style={{ color: '#0F172A' }}>{d.id} · {d.rider}</span>
                          <span style={{ color: '#0284C7' }}>{d.time}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>{d.items}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeSolutionTab === 'bakery' && (
              <>
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F8F6F', textTransform: 'uppercase' }}>
                    Fast Casual, Food Trucks & Takeaways
                  </span>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F172A', margin: '8px 0 16px' }}>
                    Ultra-compact POS with barcode scanning & weigh scales.
                  </h3>
                  <p style={{ fontSize: '0.98rem', color: '#64748B', lineHeight: 1.6, marginBottom: '24px' }}>
                    Perfect for momo stalls, juice bars, and bakeries. Print quick token slips and call numbers on your kitchen pickup display.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '28px' }}>
                    {[
                      'Token Number Calling System',
                      'Barcode & Weigh Scale Hook',
                      'Fast Cash Change Calculator',
                      'Instant Day Book Z-Report',
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>
                        <CheckCircle2 size={16} color="#0F8F6F" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => onLaunchWorkspace('cashier')}
                    style={{
                      backgroundColor: '#0F8F6F',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '10px',
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Open Takeaway Quick Terminal →
                  </button>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
                    Takeaway Queue Tokens
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065F46' }}>NOW SERVING</div>
                      <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0F8F6F' }}>#42</div>
                    </div>
                    <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400E' }}>PREPARING</div>
                      <div style={{ fontSize: '2rem', fontWeight: 900, color: '#D97706' }}>#43, #44</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── 6. INTERACTIVE ROI & SAVINGS CALCULATOR FOR NEPAL RESTAURANTS ────── */}
      <section id="calculator" style={{ padding: '80px 24px', backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
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
              Interactive Profit Estimator
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
              Calculate your restaurant's monthly savings.
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#64748B' }}>
              See how eliminating ticket leakage, automating KOT printing, and speeding up table turnover impacts your bottom line.
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '24px',
              padding: '40px',
              boxShadow: '0 10px 30px -10px rgba(15, 23, 42, 0.06)',
              display: 'grid',
              gridTemplateColumns: '1.1fr 1fr',
              gap: '48px',
              alignItems: 'center',
            }}
          >
            {/* Sliders Container */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                    Average Daily Orders / Tables
                  </label>
                  <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0F8F6F' }}>
                    {calcDailyOrders} orders/day
                  </span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={450}
                  step={10}
                  value={calcDailyOrders}
                  onChange={(e) => setCalcDailyOrders(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#0F8F6F', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>
                  <span>30 (Small Cafe)</span>
                  <span>200 (Thakali/Restro)</span>
                  <span>450+ (High Volume)</span>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F8F6F' }}>
                    Average Guest Bill / Ticket Size
                  </label>
                  <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0F8F6F' }}>
                    रू {calcAvgTicket.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={250}
                  max={2500}
                  step={50}
                  value={calcAvgTicket}
                  onChange={(e) => setCalcAvgTicket(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#0F8F6F', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>
                  <span>रू 250 (Tea/MoMo)</span>
                  <span>रू 850 (Dinner Dine-In)</span>
                  <span>रू 2,500+ (Lounge/Bar)</span>
                </div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '0.84rem', color: '#64748B' }}>
                💡 <strong>Based on Nepal restaurant benchmarks:</strong> RESTRO8 prevents ~4.2% lost revenue from unrecorded drinks, misplaced paper KOTs, and cashier calculation errors.
              </div>
            </div>

            {/* Savings Output Card */}
            <div
              style={{
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
                borderRadius: '20px',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              <div>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#065F46', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Estimated Monthly Savings & Leakage Prevented:
                </div>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0F8F6F', letterSpacing: '-0.02em' }}>
                  रू {estimatedLeakagePrevented.toLocaleString()}
                  <span style={{ fontSize: '1rem', fontWeight: 600, color: '#065F46' }}> / month</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #A7F3D0', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#065F46' }}>
                  <span>Monthly Hours Saved in Billing:</span>
                  <strong style={{ color: '#0F172A' }}>~{hoursSavedPerMonth} hours</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#065F46' }}>
                  <span>Paper KOT Waste Reduced:</span>
                  <strong style={{ color: '#0F172A' }}>100% Digital KDS</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#065F46' }}>
                  <span>Nepal IRD Penalty Risk:</span>
                  <strong style={{ color: '#0F172A' }}>0% (Audited Sequential Bills)</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onLaunchWorkspace('SuperAdmin')}
                style={{
                  backgroundColor: '#0F8F6F',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  textAlign: 'center',
                  boxShadow: '0 4px 14px rgba(15, 143, 111, 0.3)',
                }}
              >
                Claim Your 14-Day Free Trial →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. HARDWARE FREEDOM & NEPAL INTEGRATIONS ────────────────────────── */}
      <section style={{ padding: '80px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 56px' }}>
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
              Zero Hardware Lock-In
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
              Runs on any device you already own.
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#64748B' }}>
              Connect directly with Nepal's banking ecosystem and industry-standard thermal printers.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {[
              {
                icon: Laptop,
                title: 'Laptops & Desktop PCs',
                desc: 'Windows 10/11, macOS, and Linux support with keyboard shortcuts for rapid POS punch.',
                tag: 'Counter Master Station',
              },
              {
                icon: Tablet,
                title: 'iPads & Android Tablets',
                desc: 'Touch-friendly floor view for captains, managers, and kitchen station displays.',
                tag: 'Floor & Table Ordering',
              },
              {
                icon: Printer,
                title: 'ESC/POS Thermal Printers',
                desc: '80mm and 58mm thermal printers (USB, LAN, Bluetooth) supported with auto-cutter.',
                tag: 'KOT & Receipt Printing',
              },
              {
                icon: Smartphone,
                title: 'Mobile Handheld POS',
                desc: 'Sunmi and Android mobile billing terminals for roaming waiters and delivery.',
                tag: 'Wireless Table Billing',
              },
            ].map((hw, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '16px',
                  padding: '28px',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#0F8F6F';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <hw.icon size={22} color="#0F8F6F" />
                  </div>
                  <span style={{ fontSize: '0.74rem', fontWeight: 700, backgroundColor: '#F1F5F9', color: '#475569', padding: '3px 8px', borderRadius: '6px' }}>
                    {hw.tag}
                  </span>
                </div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                  {hw.title}
                </h4>
                <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5 }}>
                  {hw.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Payment Ecosystem Badges */}
          <div
            style={{
              marginTop: '48px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              padding: '24px 32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '20px',
            }}
          >
            <div>
              <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A' }}>
                Instant Dynamic QR Settlement Across Nepal:
              </span>
              <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
                Guests scan the bill with ANY mobile banking app in Nepal.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {['Fonepay Dynamic QR', 'NepalPay', 'eSewa', 'Khalti', 'Global IME', 'Nabil Bank', 'NIC Asia'].map((p) => (
                <span
                  key={p}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: '#1E293B',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                  }}
                >
                  ✓ {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. INTERACTIVE LIVE PRODUCT SIMULATOR ────────────────────────────── */}
      <section id="simulator" style={{ padding: '80px 24px', backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
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
              padding: '36px',
              maxWidth: '1020px',
              margin: '0 auto',
            }}
          >
            {/* TAB 1: POS TERMINAL */}
            {activeShowcaseTab === 'pos' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
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

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #CBD5E1', paddingTop: '12px', flexWrap: 'wrap', gap: '10px' }}>
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
                        boxShadow: '0 2px 8px rgba(15, 143, 111, 0.3)',
                      }}
                    >
                      Simulate Fonepay Settle 🎉
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: KDS TICKETS */}
            {activeShowcaseTab === 'kds' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
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
                          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Timer: {ticket.time}</span>
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
                <div style={{ maxWidth: '480px', margin: '0 auto' }}>
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
                    Every dining table receives a dedicated high-resolution QR code. Diners scan with any smartphone camera to view the menu in English or Nepali.
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
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

      {/* ── 9. REAL RESTAURANT OWNER TESTIMONIALS ────────────────────────────── */}
      <section style={{ padding: '80px 24px', backgroundColor: '#FFFFFF', borderTop: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F8F6F', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Stories from the Pass
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.03em', margin: '8px 0 16px' }}>
              Loved by hospitality leaders across Nepal.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {[
              {
                quote: 'The offline mode saved us countless times during Kathmandu fiber outages. Our kitchen never misses an order and 13% IRD VAT reports generate in literally one click.',
                author: 'Suresh Shrestha',
                role: 'Founder & Owner',
                restaurant: 'Himalayan Thakali Kitchen, Jhamsikhel',
                rating: 5,
              },
              {
                quote: 'Printing drinks to our Bar printer and food to the kitchen KOT line stopped staff yelling and food confusion completely. Our weekend table turnover speed jumped by 30%.',
                author: 'Anjali Gurung',
                role: 'Operations Director',
                restaurant: 'Lakeside Restro-Bar, Pokhara',
                rating: 5,
              },
              {
                quote: 'Table QR ordering has been a massive hit with young diners and tourists. They scan, view appetizing photos, and send orders straight to our barista without waiting.',
                author: 'Pradeep Shakya',
                role: 'General Manager',
                restaurant: 'The Old Thamel Coffee House, Kathmandu',
                rating: 5,
              },
            ].map((t, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '16px',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', color: '#F2B84B', marginBottom: '14px' }}>
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="#F2B84B" />
                    ))}
                  </div>
                  <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '24px' }}>
                    "{t.quote}"
                  </p>
                </div>

                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>{t.author}</div>
                  <div style={{ fontSize: '0.8rem', color: '#0F8F6F', fontWeight: 700 }}>{t.role}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{t.restaurant}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. TRANSPARENT PRICING SECTION ─────────────────────────────────── */}
      <section id="pricing" style={{ padding: '80px 24px', backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F8F6F', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Transparent Pricing
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.03em', margin: '8px 0 16px' }}>
              Simple plans in Nepalese Rupees.
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#64748B' }}>
              No surprise setup costs. Free local training in Kathmandu & Pokhara.
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
                >
                  Start 14-Day Free Trial
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. FAQ ACCORDION WITH CATEGORY FILTERS ─────────────────────────── */}
      <section id="faq" style={{ padding: '80px 24px', backgroundColor: '#FFFFFF', borderTop: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F8F6F', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              FAQ
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.03em', margin: '8px 0 14px' }}>
              Frequently Asked Questions
            </h2>
          </div>

          {/* FAQ Category Pills */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
            {[
              { id: 'all', label: 'All Questions' },
              { id: 'offline', label: 'Offline Reliability' },
              { id: 'tax', label: '13% IRD VAT' },
              { id: 'hardware', label: 'Hardware & Printers' },
              { id: 'payments', label: 'Fonepay Payments' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedFaqCategory(cat.id as any)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  border: '1px solid',
                  borderColor: selectedFaqCategory === cat.id ? '#0F8F6F' : '#E2E8F0',
                  backgroundColor: selectedFaqCategory === cat.id ? '#ECFDF5' : '#FFFFFF',
                  color: selectedFaqCategory === cat.id ? '#065F46' : '#64748B',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredFaqs.map((faq, idx) => {
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

      {/* ── 12. FREE ON-SITE KATHMANDU DEMO BOOKING CALLOUT ─────────────────── */}
      <section style={{ padding: '60px 24px', backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            backgroundColor: '#0F8F6F',
            backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(255, 255, 255, 0.16) 0%, transparent 60%)',
            borderRadius: '24px',
            padding: '48px 40px',
            color: '#FFFFFF',
            textAlign: 'center',
            boxShadow: '0 20px 40px -10px rgba(15, 143, 111, 0.4)',
          }}
        >
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: '14px', letterSpacing: '-0.03em' }}>
            Need an on-site demo at your restaurant in Kathmandu or Pokhara?
          </h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '680px', margin: '0 auto 32px', lineHeight: 1.6 }}>
            Our local hospitality specialist will visit your restaurant, set up sample thermal printers, and train your floor staff for free.
          </p>

          <form onSubmit={handleCallbackSubmit} style={{ display: 'flex', justifyContent: 'center', gap: '10px', maxWidth: '520px', margin: '0 auto 16px', flexWrap: 'wrap' }}>
            <input
              type="tel"
              required
              value={callbackPhone}
              onChange={(e) => setCallbackPhone(e.target.value)}
              placeholder="Enter Nepal mobile (e.g. 9801234567)"
              style={{
                flex: '1 1 240px',
                padding: '14px 18px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '0.95rem',
                outline: 'none',
                color: '#0F172A',
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                border: 'none',
                padding: '14px 24px',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              Request Free Visit ➔
            </button>
          </form>

          {callbackSubmitted && (
            <div style={{ fontSize: '0.9rem', color: '#FFF7E3', fontWeight: 700 }}>
              ✓ Thank you! Our Kathmandu specialist will call your number within 2 hours.
            </div>
          )}
        </div>
      </section>

      {/* ── 13. GLOBAL CLEAN FOOTER ─────────────────────────────────────────── */}
      <footer style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #E2E8F0', padding: '60px 24px 30px' }}>
        <div
          style={{
            maxWidth: '1280px',
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
              <span>Dine-In Restaurants</span>
              <span>Authentic Thakali Kitchens</span>
              <span>Cafes & Coffee Roasters</span>
              <span>Restro-Bars & Lounges</span>
              <span>Cloud Kitchens & Delivery</span>
            </div>
          </div>

          {/* Key Modules */}
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>Platform</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#64748B' }}>
              <span>POS Billing Terminal</span>
              <span>Live Kitchen KDS & KOT</span>
              <span>Table QR Digital Ordering</span>
              <span>13% IRD VAT Tax Invoicing</span>
              <span>Fonepay Dynamic QR Settlement</span>
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
            maxWidth: '1280px',
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
