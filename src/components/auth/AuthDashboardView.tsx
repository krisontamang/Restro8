import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  MapPin,
  Phone,
  Printer,
  QrCode,
  Receipt,
  RotateCw,
  Shield,
  ShieldCheck,
  Sparkles,
  Store,
  User,
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
    if (otpCode !== '888888' && otpCode.length < 4) {
      setStatusMessage({ text: 'Invalid verification code. Please enter 888888 for demo testing.', type: 'error' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStatusMessage({ text: 'Mobile verified! Opening workspace...', type: 'success' });
      setTimeout(() => {
        onLoginSuccess('SuperAdmin');
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
        backgroundColor: '#F8FAFC',
        color: '#0F172A',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── TOP UTILITY NAVIGATION ────────────────────────────────────────── */}
      <nav
        style={{
          height: '68px',
          borderBottom: '1px solid #E2E8F0',
          backgroundColor: '#FFFFFF',
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
              border: '1px solid #E2E8F0',
              color: '#475569',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
              padding: '6px 14px',
              borderRadius: '8px',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#0F172A';
              e.currentTarget.style.backgroundColor = '#F1F5F9';
              e.currentTarget.style.borderColor = '#CBD5E1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#475569';
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = '#E2E8F0';
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </button>

          <div style={{ cursor: 'pointer' }} onClick={onNavigateLanding}>
            <BrandLogo />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={onNavigateMenu}
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              color: '#334155',
              padding: '7px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <QrCode size={14} color="#0F8F6F" />
            <span>Guest QR Menu</span>
          </button>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#065F46',
              backgroundColor: '#ECFDF5',
              padding: '4px 10px',
              borderRadius: '9999px',
              border: '1px solid #A7F3D0',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            Core v2.4 Active
          </span>
        </div>
      </nav>

      {/* ── MAIN SPLIT CONTAINER ─────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          maxWidth: '1240px',
          width: '100%',
          margin: '0 auto',
          padding: '40px 24px',
          display: 'grid',
          gridTemplateColumns: '1.1fr 1fr',
          gap: '56px',
          alignItems: 'center',
        }}
      >
        {/* ── LEFT: PRODUCT & BRAND SHOWCASE (Clean Light RestroX Design) ── */}
        <div className="auth-brand-showcase" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#065F46',
                marginBottom: '16px',
              }}
            >
              <Sparkles size={14} color="#0F8F6F" />
              <span>The Restaurant Operating System for Nepal</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.2rem, 3.8vw, 3rem)',
                fontWeight: 900,
                lineHeight: 1.15,
                color: '#0F172A',
                letterSpacing: '-0.03em',
                marginBottom: '14px',
              }}
            >
              Control your restaurant,{' '}
              <span style={{ color: '#0F8F6F' }}>from Kitchen to Cashier.</span>
            </h1>

            <p style={{ fontSize: '1.05rem', color: '#64748B', lineHeight: 1.6, maxWidth: '520px' }}>
              Ultra-fast POS, live kitchen display (KDS), Table QR ordering, IRD 13% VAT tax billing, and offline-first peace of mind.
            </p>
          </div>

          {/* Floating Realistic Live Order Preview Card */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              padding: '22px',
              boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)',
              position: 'relative',
              maxWidth: '480px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                  Himalayan Thakali Kitchen
                </span>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Terminal #01 · Table #04 · Dine-In</div>
              </div>

              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor: '#ECFDF5',
                  color: '#065F46',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                Offline Engine Active
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', color: '#334155' }}>
                <span>1× Special Thakali Khana Set</span>
                <span style={{ fontWeight: 700 }}>रू 480</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', color: '#334155' }}>
                <span>2× Himalayan Herbal Chiya</span>
                <span style={{ fontWeight: 700 }}>रू 180</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', color: '#334155' }}>
                <span>1× Chicken Sekuwa Plate</span>
                <span style={{ fontWeight: 700 }}>रू 360</span>
              </div>
            </div>

            <div
              style={{
                borderTop: '1px dashed #CBD5E1',
                paddingTop: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Total with 10% SC & 13% VAT</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0F172A' }}>रू 1,202.00</div>
              </div>

              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  color: '#0F8F6F',
                  backgroundColor: '#ECFDF5',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid #A7F3D0',
                }}
              >
                <QrCode size={14} />
                Fonepay Settled
              </span>
            </div>
          </div>

          {/* 4 Feature Badges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', maxWidth: '480px' }}>
            {[
              { label: 'Zero Downtime Offline', icon: Zap },
              { label: 'Nepal IRD 13% VAT', icon: ShieldCheck },
              { label: 'Kitchen KDS Routing', icon: UtensilsCrossed },
              { label: 'Table QR Ordering', icon: QrCode },
            ].map((b, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#334155',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  padding: '10px 14px',
                  borderRadius: '10px',
                }}
              >
                <b.icon size={16} color="#0F8F6F" />
                <span>{b.label}</span>
              </div>
            ))}
          </div>

          {/* Trust Footer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.82rem', color: '#64748B' }}>
            <span>Trusted by 1,200+ food businesses across Nepal</span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Lock size={13} /> 256-bit Encrypted
            </span>
          </div>
        </div>

        {/* ── RIGHT: AUTHENTICATION CARD (Crisp White SaaS Container) ─────── */}
        <div>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '20px',
              padding: '36px 32px',
              boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
              position: 'relative',
            }}
          >
            {/* Top Segmented Mode Switcher */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '4px',
                backgroundColor: '#F8FAFC',
                padding: '4px',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                marginBottom: '28px',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setStatusMessage(null);
                }}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: authMode === 'signin' ? '#0F8F6F' : 'transparent',
                  color: authMode === 'signin' ? '#FFFFFF' : '#475569',
                  fontSize: '0.9rem',
                  fontWeight: authMode === 'signin' ? 700 : 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
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
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: authMode === 'register' ? '#0F8F6F' : 'transparent',
                  color: authMode === 'register' ? '#FFFFFF' : '#475569',
                  fontSize: '0.9rem',
                  fontWeight: authMode === 'register' ? 700 : 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Create Restaurant
              </button>
            </div>

            {/* Status Alert Banner */}
            {statusMessage && (
              <div
                style={{
                  marginBottom: '20px',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor:
                    statusMessage.type === 'error'
                      ? '#FEF2F2'
                      : statusMessage.type === 'success'
                      ? '#ECFDF5'
                      : '#F0F9FF',
                  color:
                    statusMessage.type === 'error'
                      ? '#991B1B'
                      : statusMessage.type === 'success'
                      ? '#065F46'
                      : '#0369A1',
                  border: `1px solid ${
                    statusMessage.type === 'error'
                      ? '#FECACA'
                      : statusMessage.type === 'success'
                      ? '#A7F3D0'
                      : '#BAE6FD'
                  }`,
                }}
              >
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <Shield size={16} />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            {/* ── MODE 1: SIGN IN ────────────────────────────────────────── */}
            {authMode === 'signin' && (
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                    Welcome back
                  </h2>
                  <p style={{ fontSize: '0.9rem', color: '#64748B' }}>
                    Enter your credentials to access your restaurant workspace.
                  </p>
                </div>

                {/* Switcher: Email vs Mobile OTP */}
                <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px', marginBottom: '22px' }}>
                  <button
                    type="button"
                    onClick={() => setLoginMethod('email')}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '4px 0',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      color: loginMethod === 'email' ? '#0F8F6F' : '#64748B',
                      cursor: 'pointer',
                      borderBottom: loginMethod === 'email' ? '2px solid #0F8F6F' : '2px solid transparent',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
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
                      padding: '4px 0',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      color: loginMethod === 'phone' ? '#0F8F6F' : '#64748B',
                      cursor: 'pointer',
                      borderBottom: loginMethod === 'phone' ? '2px solid #0F8F6F' : '2px solid transparent',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Phone size={15} />
                    <span>Mobile OTP (+977)</span>
                  </button>
                </div>

                {/* Email Form */}
                {loginMethod === 'email' ? (
                  <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        Email Address
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="owner@restro8.app"
                          style={{
                            width: '100%',
                            padding: '12px 14px 12px 38px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            borderRadius: '10px',
                            fontSize: '0.9rem',
                            color: '#0F172A',
                            outline: 'none',
                            transition: 'border-color 0.15s',
                          }}
                          onFocus={(e) => (e.currentTarget.style.borderColor = '#0F8F6F')}
                          onBlur={(e) => (e.currentTarget.style.borderColor = '#CBD5E1')}
                        />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => setAuthMode('forgot')}
                          style={{ background: 'none', border: 'none', fontSize: '0.82rem', color: '#0F8F6F', fontWeight: 600, cursor: 'pointer' }}
                        >
                          Forgot password?
                        </button>
                      </div>

                      <div style={{ position: 'relative' }}>
                        <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          style={{
                            width: '100%',
                            padding: '12px 38px 12px 38px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            borderRadius: '10px',
                            fontSize: '0.9rem',
                            color: '#0F172A',
                            outline: 'none',
                            transition: 'border-color 0.15s',
                          }}
                          onFocus={(e) => (e.currentTarget.style.borderColor = '#0F8F6F')}
                          onBlur={(e) => (e.currentTarget.style.borderColor = '#CBD5E1')}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: '#94A3B8',
                            cursor: 'pointer',
                            padding: 0,
                          }}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0 8px' }}>
                      <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        style={{ accentColor: '#0F8F6F', cursor: 'pointer', width: '16px', height: '16px' }}
                      />
                      <label htmlFor="rememberMe" style={{ fontSize: '0.85rem', color: '#475569', cursor: 'pointer' }}>
                        Keep me logged in on this terminal
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        backgroundColor: '#0F8F6F',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '14px',
                        borderRadius: '10px',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 14px rgba(15, 143, 111, 0.3)',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        if (!loading) e.currentTarget.style.backgroundColor = '#087A60';
                      }}
                      onMouseLeave={(e) => {
                        if (!loading) e.currentTarget.style.backgroundColor = '#0F8F6F';
                      }}
                    >
                      {loading ? (
                        <>
                          <RotateCw size={18} className="r8-spin" />
                          <span>Signing In...</span>
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
                  /* Phone OTP Form */
                  <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        Nepal Mobile Number
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <div
                          style={{
                            padding: '12px 14px',
                            backgroundColor: '#F8FAFC',
                            border: '1px solid #CBD5E1',
                            borderRadius: '10px',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            color: '#334155',
                          }}
                        >
                          🇳🇵 +977
                        </div>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="9801234567"
                          style={{
                            flex: 1,
                            padding: '12px 14px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            borderRadius: '10px',
                            fontSize: '0.9rem',
                            color: '#0F172A',
                            outline: 'none',
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          style={{
                            padding: '12px 16px',
                            backgroundColor: '#F1F5F9',
                            border: '1px solid #CBD5E1',
                            borderRadius: '10px',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            color: '#0F172A',
                            cursor: 'pointer',
                          }}
                        >
                          {otpSent ? 'Resend' : 'Send OTP'}
                        </button>
                      </div>
                    </div>

                    {otpSent && (
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                          6-Digit Verification Code
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="888888"
                          style={{
                            width: '100%',
                            padding: '12px 14px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            borderRadius: '10px',
                            fontSize: '1.2rem',
                            letterSpacing: '0.2em',
                            textAlign: 'center',
                            fontWeight: 800,
                            color: '#0F8F6F',
                            outline: 'none',
                          }}
                        />
                        <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'block', marginTop: '4px' }}>
                          Demo test code: <strong>888888</strong>
                        </span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || !otpSent}
                      style={{
                        backgroundColor: '#0F8F6F',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '14px',
                        borderRadius: '10px',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        cursor: loading || !otpSent ? 'not-allowed' : 'pointer',
                        opacity: !otpSent ? 0.6 : 1,
                      }}
                    >
                      Verify & Access Workspace
                    </button>
                  </form>
                )}

                {/* ── DEMO ROLE 1-CLICK SELECTOR ──────────────────────────── */}
                <div style={{ marginTop: '28px', borderTop: '1px solid #E2E8F0', paddingTop: '20px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0F8F6F', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      ⚡ Instant Demo Role Login
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Click to test any role</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '8px' }}>
                    {[
                      { role: 'SuperAdmin' as const, label: 'Owner', desc: 'All access', icon: '👑', color: '#D97706', bg: '#FFFBEB' },
                      { role: 'manager' as const, label: 'Manager', desc: 'Floor & Staff', icon: '👔', color: '#0284C7', bg: '#F0F9FF' },
                      { role: 'cashier' as const, label: 'Cashier', desc: 'POS & Invoices', icon: '💳', color: '#0F8F6F', bg: '#ECFDF5' },
                    ].map((item) => (
                      <button
                        key={item.role}
                        type="button"
                        onClick={() => onLoginSuccess(item.role)}
                        style={{
                          backgroundColor: item.bg,
                          border: `1px solid ${item.color}30`,
                          borderRadius: '10px',
                          padding: '10px 8px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.06)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div style={{ fontSize: '1.2rem', marginBottom: '2px' }}>{item.icon}</div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: item.color }}>{item.label}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{item.desc}</div>
                      </button>
                    ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {[
                      { role: 'chef' as const, label: 'Chef (KDS Line)', icon: '👨‍🍳', color: '#EA580C', bg: '#FFF7ED' },
                      { role: 'waiter' as const, label: 'Waiter (Table POS)', icon: '🏃', color: '#7C3AED', bg: '#F5F3FF' },
                    ].map((item) => (
                      <button
                        key={item.role}
                        type="button"
                        onClick={() => onLoginSuccess(item.role)}
                        style={{
                          backgroundColor: item.bg,
                          border: `1px solid ${item.color}30`,
                          borderRadius: '10px',
                          padding: '10px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: item.color,
                        }}
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── MODE 2: CREATE RESTAURANT ─────────────────────────────── */}
            {authMode === 'register' && (
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                    Start Free 14-Day Trial
                  </h2>
                  <p style={{ fontSize: '0.9rem', color: '#64748B' }}>
                    No credit card required. Set up in under 60 seconds.
                  </p>
                </div>

                <form onSubmit={handleRegisterWorkspace} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Restaurant / Brand Name
                    </label>
                    <input
                      type="text"
                      required
                      value={regRestaurantName}
                      onChange={(e) => setRegRestaurantName(e.target.value)}
                      placeholder="e.g. Thakali Kitchen & Bar"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        color: '#0F172A',
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Outlet Type
                      </label>
                      <select
                        value={regOutletType}
                        onChange={(e) => setRegOutletType(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          color: '#0F172A',
                        }}
                      >
                        <option>Dine-In Restaurant</option>
                        <option>Cafe & Coffee Bar</option>
                        <option>Thakali Kitchen</option>
                        <option>Restro-Bar & Lounge</option>
                        <option>Fast Food & Bakery</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        City in Nepal
                      </label>
                      <select
                        value={regCity}
                        onChange={(e) => setRegCity(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          color: '#0F172A',
                        }}
                      >
                        <option>Kathmandu</option>
                        <option>Pokhara</option>
                        <option>Lalitpur</option>
                        <option>Bhaktapur</option>
                        <option>Chitwan</option>
                        <option>Biratnagar</option>
                        <option>Butwal</option>
                        <option>Dharan</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Owner Name & Phone
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <input
                        type="text"
                        required
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        placeholder="Krison Tamang"
                        style={{
                          padding: '10px 14px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          color: '#0F172A',
                        }}
                      />
                      <input
                        type="tel"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="98XXXXXXXX"
                        style={{
                          padding: '10px 14px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          color: '#0F172A',
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      backgroundColor: '#0F8F6F',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '10px',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      marginTop: '8px',
                    }}
                  >
                    {loading ? 'Setting Up Workspace...' : 'Launch Free Workspace →'}
                  </button>
                </form>
              </div>
            )}

            {/* ── MODE 3: FORGOT PASSWORD ───────────────────────────────── */}
            {authMode === 'forgot' && (
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                    Reset Password
                  </h2>
                  <p style={{ fontSize: '0.9rem', color: '#64748B' }}>
                    Enter your email or phone number to receive a secure recovery code.
                  </p>
                </div>

                <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Registered Email or Mobile Number
                    </label>
                    <input
                      type="text"
                      required
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      placeholder="owner@restro8.app or 98XXXXXXXX"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        borderRadius: '10px',
                        fontSize: '0.9rem',
                        color: '#0F172A',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      backgroundColor: '#0F8F6F',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '10px',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Send Recovery Code
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthMode('signin')}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#64748B',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    ← Back to Sign In
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Help Desk Info Footer */}
          <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.82rem', color: '#64748B' }}>
            Need help? Call Kathmandu desk: <strong style={{ color: '#0F172A' }}>+977-1-4567890</strong> · support@restro8.app
          </div>
        </div>
      </div>
    </div>
  );
};
