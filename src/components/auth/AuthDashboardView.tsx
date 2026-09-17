import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  Phone,
  QrCode,
  Receipt,
  RotateCw,
  ShieldCheck,
  Sparkles,
  Store,
  UtensilsCrossed,
  Zap,
} from 'lucide-react';
import { BrandLogo } from '../brand/BrandLogo';

export interface AuthDashboardViewProps {
  onLoginSuccess: (
    role?: 'SuperAdmin' | 'manager' | 'cashier' | 'chef' | 'waiter',
    restaurantName?: string
  ) => void;
  onNavigateLanding: () => void;
  onNavigateMenu: () => void;
}

type AuthMode = 'signin' | 'register' | 'forgot';
type LoginMethod = 'email' | 'phone';

export const AuthDashboardView: React.FC<AuthDashboardViewProps> = ({
  onLoginSuccess,
  onNavigateLanding,
  onNavigateMenu,
}) => {
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'info' | 'error' | 'success' } | null>(null);

  // Form states for Sign In
  const [email, setEmail] = useState('owner@restro8.app');
  const [phone, setPhone] = useState('9801234567');
  const [password, setPassword] = useState('••••••••');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Form states for Workspace Registration
  const [regRestaurantName, setRegRestaurantName] = useState('');
  const [regOutletType, setRegOutletType] = useState('Cafe & Restaurant');
  const [regCity, setRegCity] = useState('Kathmandu');
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPanNumber, setRegPanNumber] = useState('');

  // Password recovery states
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    setTimeout(() => {
      setLoading(false);
      setStatusMessage({ text: 'Authentication successful. Synchronizing workspace...', type: 'success' });
      setTimeout(() => {
        onLoginSuccess('SuperAdmin');
      }, 500);
    }, 600);
  };

  const handleSendOtp = () => {
    if (!phone || phone.length < 8) {
      setStatusMessage({ text: 'Please enter a valid 10-digit Nepal mobile number.', type: 'error' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setStatusMessage({ text: `6-digit verification code sent to +977 ${phone}. Use code: 888888 for testing.`, type: 'info' });
    }, 500);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || (otpCode.trim() !== '888888' && otpCode.length !== 6)) {
      setStatusMessage({ text: 'Invalid verification code. Use 888888 for quick testing.', type: 'error' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStatusMessage({ text: 'Phone verified. Redirecting to workspace...', type: 'success' });
      setTimeout(() => {
        onLoginSuccess('manager');
      }, 500);
    }, 600);
  };

  const handleRegisterWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regRestaurantName.trim()) {
      setStatusMessage({ text: 'Please enter your restaurant or outlet name.', type: 'error' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStatusMessage({ text: `Workspace "${regRestaurantName}" provisioned successfully! Initializing catalog...`, type: 'success' });
      setTimeout(() => {
        onLoginSuccess('SuperAdmin', regRestaurantName);
      }, 700);
    }, 700);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotIdentifier.trim()) {
      setStatusMessage({ text: 'Please enter your registered email or phone number.', type: 'error' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setForgotSent(true);
      setStatusMessage({ text: 'Password reset instructions sent. Please check your inbox or SMS.', type: 'success' });
    }, 600);
  };

  return (
    <div
      className="r8-auth-root"
      style={{
        minHeight: '100vh',
        backgroundColor: '#070B11',
        color: '#F8FAFC',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── TOP UTILITY NAVIGATION ────────────────────────────────────────── */}
      <nav
        style={{
          height: '68px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(7, 11, 17, 0.95)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button
            onClick={onNavigateLanding}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
              padding: '6px 12px',
              borderRadius: '8px',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#94A3B8';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </button>

          <div style={{ height: '20px', width: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

          <div
            onClick={onNavigateLanding}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            title="Return to RESTRO8 Landing Page"
          >
            <BrandLogo />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={onNavigateMenu}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#CBD5E1',
              borderRadius: '8px',
              padding: '7px 14px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#0F8F6F';
              e.currentTarget.style.color = '#FFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.color = '#CBD5E1';
            }}
          >
            <QrCode size={15} color="#0F8F6F" />
            <span>Guest QR Menu</span>
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '20px',
              backgroundColor: 'rgba(15, 143, 111, 0.12)',
              border: '1px solid rgba(15, 143, 111, 0.3)',
              color: '#19B889',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#19B889',
                boxShadow: '0 0 8px #19B889',
              }}
            />
            <span>Core v2.4 Active</span>
          </div>
        </div>
      </nav>

      {/* ── MAIN CONTENT CONTAINER (SPLIT 2-COLUMNS) ───────────────────────── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          minHeight: 'calc(100vh - 68px)',
        }}
      >
        {/* ── LEFT SHOWCASE HERO (Visible on Desktop / Tablet) ─────────────── */}
        <div
          className="auth-brand-showcase"
          style={{
            flex: '1 1 50%',
            maxWidth: '52%',
            backgroundColor: '#0A0F17',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '48px 56px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle Ambient Radial Glows */}
          <div
            style={{
              position: 'absolute',
              top: '-15%',
              left: '-15%',
              width: '550px',
              height: '550px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(15, 143, 111, 0.15) 0%, rgba(7, 11, 17, 0) 70%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-10%',
              right: '-10%',
              width: '450px',
              height: '450px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(242, 184, 75, 0.08) 0%, rgba(7, 11, 17, 0) 70%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Mission Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '24px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#CBD5E1',
                marginBottom: '28px',
              }}
            >
              <Sparkles size={14} color="#F2B84B" />
              <span>The Restaurant Operating System for Nepal</span>
            </div>

            <h1
              style={{
                fontSize: '2.5rem',
                fontWeight: 900,
                lineHeight: 1.18,
                letterSpacing: '-0.025em',
                marginBottom: '20px',
                color: '#FFFFFF',
              }}
            >
              Control your restaurant,{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #19B889 0%, #F2B84B 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                from Kitchen to Cashier.
              </span>
            </h1>

            <p
              style={{
                fontSize: '1.05rem',
                color: '#94A3B8',
                lineHeight: 1.6,
                maxWidth: '520px',
                marginBottom: '36px',
              }}
            >
              Ultra-fast POS, live kitchen display (KDS), Table QR ordering, IRD 13% VAT tax billing, and offline-first peace of mind.
            </p>

            {/* 4 Feature Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', maxWidth: '540px' }}>
              <div
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(15, 143, 111, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#19B889',
                    }}
                  >
                    <Zap size={18} />
                  </div>
                  <strong style={{ fontSize: '0.9rem', color: '#F8FAFC' }}>Offline Resilient</strong>
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.45 }}>
                  Punch orders and print KOTs even when local internet drops out completely.
                </p>
              </div>

              <div
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(242, 184, 75, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#F2B84B',
                    }}
                  >
                    <Receipt size={18} />
                  </div>
                  <strong style={{ fontSize: '0.9rem', color: '#F8FAFC' }}>IRD 13% VAT Ready</strong>
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.45 }}>
                  Tax invoices, 10% Service Charge, Day Book ledgers, and audit-proof sales logs.
                </p>
              </div>

              <div
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(56, 189, 248, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#38BDF8',
                    }}
                  >
                    <UtensilsCrossed size={18} />
                  </div>
                  <strong style={{ fontSize: '0.9rem', color: '#F8FAFC' }}>Live KDS Routing</strong>
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.45 }}>
                  Split tickets between food KOT and bar BOT with station color codes and timers.
                </p>
              </div>

              <div
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(168, 85, 247, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#C084FC',
                    }}
                  >
                    <QrCode size={18} />
                  </div>
                  <strong style={{ fontSize: '0.9rem', color: '#F8FAFC' }}>Fonepay & QR Pay</strong>
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.45 }}>
                  Dynamic counter QR & table bill settlements with Fonepay and NepalPay.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Social Proof & Trust Badges */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              marginTop: '40px',
              paddingTop: '24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#E2E8F0', marginBottom: '4px' }}>
                Trusted by 1,200+ food businesses across Nepal
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                Kathmandu · Pokhara · Chitwan · Biratnagar · Butwal · Dharan
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#10B981',
                fontSize: '0.78rem',
                fontWeight: 600,
              }}
            >
              <ShieldCheck size={18} />
              <span>256-bit Encrypted</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT AUTHENTICATION PANEL ────────────────────────────────────── */}
        <div
          style={{
            flex: '1 1 50%',
            backgroundColor: '#070B11',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '36px 24px',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '460px',
            }}
          >
            {/* Status Alert Banner */}
            {statusMessage && (
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  lineHeight: 1.45,
                  fontWeight: 500,
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  backgroundColor:
                    statusMessage.type === 'success'
                      ? 'rgba(16, 185, 129, 0.15)'
                      : statusMessage.type === 'error'
                      ? 'rgba(239, 68, 68, 0.15)'
                      : 'rgba(56, 189, 248, 0.15)',
                  border: `1px solid ${
                    statusMessage.type === 'success'
                      ? 'rgba(16, 185, 129, 0.3)'
                      : statusMessage.type === 'error'
                      ? 'rgba(239, 68, 68, 0.3)'
                      : 'rgba(56, 189, 248, 0.3)'
                  }`,
                  color:
                    statusMessage.type === 'success'
                      ? '#34D399'
                      : statusMessage.type === 'error'
                      ? '#F87171'
                      : '#38BDF8',
                }}
              >
                {statusMessage.type === 'success' && <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: '2px' }} />}
                {statusMessage.type === 'error' && <Lock size={16} style={{ flexShrink: 0, marginTop: '2px' }} />}
                {statusMessage.type === 'info' && <Sparkles size={16} style={{ flexShrink: 0, marginTop: '2px' }} />}
                <div style={{ flex: 1 }}>{statusMessage.text}</div>
              </div>
            )}

            {/* ── CARD CONTAINER ────────────────────────────────────────────── */}
            <div
              style={{
                backgroundColor: '#0C121D',
                border: '1px solid rgba(255, 255, 255, 0.09)',
                borderRadius: '16px',
                padding: '32px 28px',
                boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.6)',
              }}
            >
              {/* Top Mode Segmented Switcher */}
              <div
                style={{
                  display: 'flex',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  padding: '4px',
                  borderRadius: '10px',
                  marginBottom: '26px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setStatusMessage(null);
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    backgroundColor: authMode === 'signin' ? '#0F8F6F' : 'transparent',
                    color: authMode === 'signin' ? '#FFFFFF' : '#94A3B8',
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setStatusMessage(null);
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    backgroundColor: authMode === 'register' ? '#0F8F6F' : 'transparent',
                    color: authMode === 'register' ? '#FFFFFF' : '#94A3B8',
                  }}
                >
                  Create Restaurant
                </button>
              </div>

              {/* ── VIEW 1: SIGN IN MODE ─────────────────────────────────────── */}
              {authMode === 'signin' && (
                <div>
                  <div style={{ marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 6px 0', color: '#FFFFFF' }}>
                      Welcome back
                    </h2>
                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#94A3B8' }}>
                      Enter your credentials to access your restaurant workspace.
                    </p>
                  </div>

                  {/* Method selector: Email vs Mobile OTP */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '12px',
                      marginBottom: '20px',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      paddingBottom: '12px',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setLoginMethod('email')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: loginMethod === 'email' ? '#19B889' : '#94A3B8',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 8px',
                        borderBottom: loginMethod === 'email' ? '2px solid #19B889' : '2px solid transparent',
                        transition: 'all 0.15s',
                      }}
                    >
                      <Mail size={15} />
                      <span>Email & Password</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginMethod('phone')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: loginMethod === 'phone' ? '#19B889' : '#94A3B8',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 8px',
                        borderBottom: loginMethod === 'phone' ? '2px solid #19B889' : '2px solid transparent',
                        transition: 'all 0.15s',
                      }}
                    >
                      <Phone size={15} />
                      <span>Mobile OTP (+977)</span>
                    </button>
                  </div>

                  {/* 1A: Email & Password Form */}
                  {loginMethod === 'email' ? (
                    <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            color: '#CBD5E1',
                            marginBottom: '6px',
                          }}
                        >
                          Email Address
                        </label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="staff@restaurant.com"
                            style={{
                              width: '100%',
                              backgroundColor: 'rgba(255, 255, 255, 0.04)',
                              border: '1px solid rgba(255, 255, 255, 0.12)',
                              borderRadius: '8px',
                              padding: '10px 14px 10px 38px',
                              color: '#FFFFFF',
                              fontSize: '0.88rem',
                              outline: 'none',
                              boxSizing: 'border-box',
                            }}
                          />
                          <Mail
                            size={16}
                            color="#64748B"
                            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                          />
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#CBD5E1' }}>
                            Password
                          </label>
                          <button
                            type="button"
                            onClick={() => setAuthMode('forgot')}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#19B889',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              padding: 0,
                            }}
                          >
                            Forgot password?
                          </button>
                        </div>
                        <div style={{ position: 'relative' }}>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            style={{
                              width: '100%',
                              backgroundColor: 'rgba(255, 255, 255, 0.04)',
                              border: '1px solid rgba(255, 255, 255, 0.12)',
                              borderRadius: '8px',
                              padding: '10px 38px 10px 38px',
                              color: '#FFFFFF',
                              fontSize: '0.88rem',
                              outline: 'none',
                              boxSizing: 'border-box',
                            }}
                          />
                          <Lock
                            size={16}
                            color="#64748B"
                            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                              position: 'absolute',
                              right: '12px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'none',
                              border: 'none',
                              color: '#64748B',
                              cursor: 'pointer',
                              padding: 0,
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem', color: '#94A3B8' }}>
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            style={{ accentColor: '#0F8F6F' }}
                          />
                          <span>Keep me logged in on this terminal</span>
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        style={{
                          width: '100%',
                          backgroundColor: '#0F8F6F',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '12px',
                          fontSize: '0.92rem',
                          fontWeight: 700,
                          cursor: loading ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          transition: 'all 0.15s',
                          boxShadow: '0 4px 14px rgba(15, 143, 111, 0.4)',
                        }}
                      >
                        {loading ? (
                          <>
                            <RotateCw size={18} className="r8-spin" />
                            <span>Authenticating...</span>
                          </>
                        ) : (
                          <>
                            <span>Sign In to Workspace</span>
                            <ArrowRight size={16} />
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    /* 1B: Mobile (+977) OTP Form */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            color: '#CBD5E1',
                            marginBottom: '6px',
                          }}
                        >
                          Nepal Mobile Number
                        </label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <div
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.06)',
                              border: '1px solid rgba(255, 255, 255, 0.12)',
                              borderRadius: '8px',
                              padding: '10px 12px',
                              color: '#CBD5E1',
                              fontSize: '0.88rem',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <span>🇳🇵</span>
                            <span>+977</span>
                          </div>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="98XXXXXXXX"
                            maxLength={10}
                            style={{
                              flex: 1,
                              backgroundColor: 'rgba(255, 255, 255, 0.04)',
                              border: '1px solid rgba(255, 255, 255, 0.12)',
                              borderRadius: '8px',
                              padding: '10px 14px',
                              color: '#FFFFFF',
                              fontSize: '0.88rem',
                              outline: 'none',
                            }}
                          />
                        </div>
                      </div>

                      {!otpSent ? (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={loading}
                          style={{
                            width: '100%',
                            backgroundColor: '#0F8F6F',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '12px',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                          }}
                        >
                          {loading ? <RotateCw size={18} className="r8-spin" /> : <Phone size={16} />}
                          <span>Send 6-Digit SMS Code</span>
                        </button>
                      ) : (
                        <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                          <div>
                            <label
                              style={{
                                display: 'block',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                color: '#CBD5E1',
                                marginBottom: '6px',
                              }}
                            >
                              Verification Code (OTP)
                            </label>
                            <input
                              type="text"
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value)}
                              placeholder="Enter 888888"
                              maxLength={6}
                              style={{
                                width: '100%',
                                letterSpacing: '0.25em',
                                textAlign: 'center',
                                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                                border: '1px solid #0F8F6F',
                                borderRadius: '8px',
                                padding: '12px',
                                color: '#FFFFFF',
                                fontSize: '1.2rem',
                                fontWeight: 800,
                                outline: 'none',
                                boxSizing: 'border-box',
                              }}
                            />
                            <small style={{ display: 'block', color: '#64748B', fontSize: '0.72rem', marginTop: '4px', textAlign: 'center' }}>
                              Test OTP: <strong>888888</strong>
                            </small>
                          </div>

                          <button
                            type="submit"
                            disabled={loading}
                            style={{
                              width: '100%',
                              backgroundColor: '#0F8F6F',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '12px',
                              fontSize: '0.9rem',
                              fontWeight: 700,
                              cursor: loading ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                            }}
                          >
                            {loading ? <RotateCw size={18} className="r8-spin" /> : <CheckCircle2 size={16} />}
                            <span>Verify & Sign In</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setOtpSent(false)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#94A3B8',
                              fontSize: '0.78rem',
                              cursor: 'pointer',
                              textDecoration: 'underline',
                            }}
                          >
                            Change mobile number
                          </button>
                        </form>
                      )}
                    </div>
                  )}

                  {/* ── ONE-CLICK DEMO ROLE LAUNCHER ───────────────────────── */}
                  <div
                    style={{
                      marginTop: '28px',
                      paddingTop: '20px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '12px',
                      }}
                    >
                      <span style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#F2B84B' }}>
                        Instant Demo Role Login
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                        Click to test any role
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '8px' }}>
                      <button
                        type="button"
                        onClick={() => onLoginSuccess('SuperAdmin')}
                        style={{
                          backgroundColor: 'rgba(242, 184, 75, 0.08)',
                          border: '1px solid rgba(242, 184, 75, 0.25)',
                          borderRadius: '8px',
                          padding: '8px 6px',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(242, 184, 75, 0.18)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(242, 184, 75, 0.08)';
                        }}
                      >
                        <span style={{ fontSize: '1rem' }}>👑</span>
                        <strong style={{ fontSize: '0.75rem', color: '#F2B84B' }}>Owner</strong>
                        <small style={{ fontSize: '0.65rem', color: '#94A3B8' }}>All access</small>
                      </button>

                      <button
                        type="button"
                        onClick={() => onLoginSuccess('manager')}
                        style={{
                          backgroundColor: 'rgba(15, 143, 111, 0.08)',
                          border: '1px solid rgba(15, 143, 111, 0.25)',
                          borderRadius: '8px',
                          padding: '8px 6px',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(15, 143, 111, 0.18)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(15, 143, 111, 0.08)';
                        }}
                      >
                        <span style={{ fontSize: '1rem' }}>👔</span>
                        <strong style={{ fontSize: '0.75rem', color: '#19B889' }}>Manager</strong>
                        <small style={{ fontSize: '0.65rem', color: '#94A3B8' }}>Floor & Staff</small>
                      </button>

                      <button
                        type="button"
                        onClick={() => onLoginSuccess('cashier')}
                        style={{
                          backgroundColor: 'rgba(56, 189, 248, 0.08)',
                          border: '1px solid rgba(56, 189, 248, 0.25)',
                          borderRadius: '8px',
                          padding: '8px 6px',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.18)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.08)';
                        }}
                      >
                        <span style={{ fontSize: '1rem' }}>💳</span>
                        <strong style={{ fontSize: '0.75rem', color: '#38BDF8' }}>Cashier</strong>
                        <small style={{ fontSize: '0.65rem', color: '#94A3B8' }}>POS & Invoices</small>
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => onLoginSuccess('chef')}
                        style={{
                          backgroundColor: 'rgba(239, 68, 68, 0.08)',
                          border: '1px solid rgba(239, 68, 68, 0.25)',
                          borderRadius: '8px',
                          padding: '8px 6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        <span style={{ fontSize: '0.9rem' }}>👨‍🍳</span>
                        <strong style={{ fontSize: '0.75rem', color: '#F87171' }}>Chef (KDS Line)</strong>
                      </button>

                      <button
                        type="button"
                        onClick={() => onLoginSuccess('waiter')}
                        style={{
                          backgroundColor: 'rgba(168, 85, 247, 0.08)',
                          border: '1px solid rgba(168, 85, 247, 0.25)',
                          borderRadius: '8px',
                          padding: '8px 6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        <span style={{ fontSize: '0.9rem' }}>🏃</span>
                        <strong style={{ fontSize: '0.75rem', color: '#C084FC' }}>Waiter (Table POS)</strong>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── VIEW 2: REGISTER RESTAURANT WORKSPACE ───────────────────── */}
              {authMode === 'register' && (
                <div>
                  <div style={{ marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 6px 0', color: '#FFFFFF' }}>
                      Start with RESTRO8
                    </h2>
                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#94A3B8' }}>
                      Set up your restaurant workspace in under 60 seconds. Free 30-day trial.
                    </p>
                  </div>

                  <form onSubmit={handleRegisterWorkspace} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '4px' }}>
                        Restaurant / Outlet Name *
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          required
                          value={regRestaurantName}
                          onChange={(e) => setRegRestaurantName(e.target.value)}
                          placeholder="e.g. Himalayan Coffee & Kitchen"
                          style={{
                            width: '100%',
                            backgroundColor: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: '8px',
                            padding: '10px 12px 10px 36px',
                            color: '#FFFFFF',
                            fontSize: '0.85rem',
                            outline: 'none',
                            boxSizing: 'border-box',
                          }}
                        />
                        <Store size={15} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '4px' }}>
                          Outlet Type
                        </label>
                        <select
                          value={regOutletType}
                          onChange={(e) => setRegOutletType(e.target.value)}
                          style={{
                            width: '100%',
                            backgroundColor: '#0C121D',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: '8px',
                            padding: '10px 10px',
                            color: '#FFFFFF',
                            fontSize: '0.82rem',
                            outline: 'none',
                            boxSizing: 'border-box',
                          }}
                        >
                          <option value="Cafe & Restaurant">Cafe & Restaurant</option>
                          <option value="Fine Dining">Fine Dining</option>
                          <option value="Bakery & Cafe">Bakery & Cafe</option>
                          <option value="Quick Service / Fast Food">Quick Service / QSR</option>
                          <option value="Lounge & Bar">Lounge & Bar</option>
                          <option value="Cloud Kitchen">Cloud Kitchen</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '4px' }}>
                          City in Nepal
                        </label>
                        <select
                          value={regCity}
                          onChange={(e) => setRegCity(e.target.value)}
                          style={{
                            width: '100%',
                            backgroundColor: '#0C121D',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: '8px',
                            padding: '10px 10px',
                            color: '#FFFFFF',
                            fontSize: '0.82rem',
                            outline: 'none',
                            boxSizing: 'border-box',
                          }}
                        >
                          <option value="Kathmandu">Kathmandu</option>
                          <option value="Lalitpur">Lalitpur</option>
                          <option value="Bhaktapur">Bhaktapur</option>
                          <option value="Pokhara">Pokhara</option>
                          <option value="Chitwan">Chitwan (Narayangarh)</option>
                          <option value="Butwal">Butwal / Bhairahawa</option>
                          <option value="Biratnagar">Biratnagar</option>
                          <option value="Dharan">Dharan</option>
                          <option value="Other">Other City</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '4px' }}>
                          Owner / Manager Name
                        </label>
                        <input
                          type="text"
                          required
                          value={regFullName}
                          onChange={(e) => setRegFullName(e.target.value)}
                          placeholder="e.g. Ramesh Shrestha"
                          style={{
                            width: '100%',
                            backgroundColor: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: '8px',
                            padding: '10px 12px',
                            color: '#FFFFFF',
                            fontSize: '0.85rem',
                            outline: 'none',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '4px' }}>
                          Mobile (+977)
                        </label>
                        <input
                          type="tel"
                          required
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="98XXXXXXXX"
                          style={{
                            width: '100%',
                            backgroundColor: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: '8px',
                            padding: '10px 12px',
                            color: '#FFFFFF',
                            fontSize: '0.85rem',
                            outline: 'none',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '4px' }}>
                        Work Email
                      </label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="owner@myrestaurant.com"
                        style={{
                          width: '100%',
                          backgroundColor: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '8px',
                          padding: '10px 12px',
                          color: '#FFFFFF',
                          fontSize: '0.85rem',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '4px' }}>
                          Password
                        </label>
                        <input
                          type="password"
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="At least 8 chars"
                          style={{
                            width: '100%',
                            backgroundColor: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: '8px',
                            padding: '10px 12px',
                            color: '#FFFFFF',
                            fontSize: '0.85rem',
                            outline: 'none',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '4px' }}>
                          IRD PAN/VAT (Optional)
                        </label>
                        <input
                          type="text"
                          value={regPanNumber}
                          onChange={(e) => setRegPanNumber(e.target.value)}
                          placeholder="9-digit PAN"
                          style={{
                            width: '100%',
                            backgroundColor: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: '8px',
                            padding: '10px 12px',
                            color: '#FFFFFF',
                            fontSize: '0.85rem',
                            outline: 'none',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        marginTop: '8px',
                        width: '100%',
                        backgroundColor: '#0F8F6F',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px',
                        fontSize: '0.92rem',
                        fontWeight: 700,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 14px rgba(15, 143, 111, 0.4)',
                      }}
                    >
                      {loading ? (
                        <>
                          <RotateCw size={18} className="r8-spin" />
                          <span>Creating Workspace...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Restaurant & Launch</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* ── VIEW 3: FORGOT PASSWORD ─────────────────────────────────── */}
              {authMode === 'forgot' && (
                <div>
                  <div style={{ marginBottom: '20px' }}>
                    <button
                      type="button"
                      onClick={() => setAuthMode('signin')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#94A3B8',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                        padding: 0,
                        marginBottom: '12px',
                      }}
                    >
                      <ArrowLeft size={14} />
                      <span>Back to Sign In</span>
                    </button>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 6px 0', color: '#FFFFFF' }}>
                      Reset password
                    </h2>
                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#94A3B8' }}>
                      Enter your email or phone number to receive instructions.
                    </p>
                  </div>

                  {!forgotSent ? (
                    <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
                          Email or Mobile Number (+977)
                        </label>
                        <input
                          type="text"
                          required
                          value={forgotIdentifier}
                          onChange={(e) => setForgotIdentifier(e.target.value)}
                          placeholder="staff@restaurant.com or 98XXXXXXXX"
                          style={{
                            width: '100%',
                            backgroundColor: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: '8px',
                            padding: '10px 14px',
                            color: '#FFFFFF',
                            fontSize: '0.88rem',
                            outline: 'none',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        style={{
                          width: '100%',
                          backgroundColor: '#0F8F6F',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '12px',
                          fontSize: '0.92rem',
                          fontWeight: 700,
                          cursor: loading ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                        }}
                      >
                        {loading ? <RotateCw size={18} className="r8-spin" /> : <KeyRound size={16} />}
                        <span>Send Recovery Link</span>
                      </button>
                    </form>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '16px 0' }}>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(16, 185, 129, 0.15)',
                          color: '#10B981',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 16px auto',
                        }}
                      >
                        <CheckCircle2 size={24} />
                      </div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 8px 0', color: '#FFFFFF' }}>
                        Check your device
                      </h3>
                      <p style={{ fontSize: '0.84rem', color: '#94A3B8', marginBottom: '20px' }}>
                        We've dispatched recovery steps to <strong>{forgotIdentifier}</strong>.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotSent(false);
                          setAuthMode('signin');
                        }}
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '10px 20px',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Return to Sign In
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Help & Support */}
            <div
              style={{
                marginTop: '20px',
                textAlign: 'center',
                fontSize: '0.78rem',
                color: '#64748B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
              }}
            >
              <span>Need help? Call Kathmandu desk: +977-1-4567890</span>
              <span>·</span>
              <a
                href="mailto:support@restro8.app"
                style={{ color: '#94A3B8', textDecoration: 'none' }}
              >
                support@restro8.app
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
