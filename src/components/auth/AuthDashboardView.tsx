import { useEffect, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, LockKeyhole, Mail, Sprout } from 'lucide-react';
import { BrandLogo } from '../brand/BrandLogo';
import { useAuth } from '../../context/authState';
import { supabase } from '../../lib/supabase';
import { accountRedirect, notifyAdminOfSignup, publicConfig } from '../../lib/accountApi';
import { authMessage, emailIssue, isAppHost, passwordIssue } from '../../lib/accountRules';

export type AuthMode = 'login' | 'signup' | 'forgot' | 'reset' | 'callback';
interface Props { mode: AuthMode; onNavigate: (path: string) => void }
const headings: Record<AuthMode, [string, string]> = {
  login: ['A familiar place to begin.', 'Sign in to your Restro8 account.'],
  signup: ['Make room for better service.', 'Create your Restro8 account.'],
  forgot: ['Let’s get you back in.', 'We’ll email you a secure password-reset link.'],
  reset: ['A fresh start.', 'Choose a new password for your account.'],
  callback: ['You’re in the right place.', 'Checking your email confirmation…'],
};

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
    </svg>
  );
}

export function AuthDashboardView({ mode, onNavigate }: Props) {
  const { user, loading, error: sessionError, recovery } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [accepted, setAccepted] = useState(false);
  const registrationOpen = publicConfig.signupsEnabled;
  const passwordForm = mode === 'login' || mode === 'signup' || mode === 'reset';

  useEffect(() => {
    if (user && !loading && (mode === 'login' || mode === 'callback')) {
      if (mode === 'callback' && user.email) {
        notifyAdminOfSignup(user.email, 'google');
      }
      onNavigate(isAppHost() ? '/' : '/app');
    }
  }, [user, loading, mode, onNavigate]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('registered') === 'true') {
        setNotice('Registration successful! Please sign in with your credentials to enter your workspace.');
        const emailParam = params.get('email');
        if (emailParam) setEmail(emailParam);
      }
    }
  }, [mode]);

  async function handleGoogleAuth() {
    if (busy || !supabase) return;
    setError(''); setNotice(''); setBusy(true);
    try {
      const { error: failure } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: accountRedirect('/auth/callback') },
      });
      if (failure) throw failure;
    } catch (failure) {
      setError(authMessage(failure as { code?: string; status?: number; message?: string }));
      setBusy(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !supabase) return;
    setError(''); setNotice('');
    if (mode !== 'reset') { const issue = emailIssue(email); if (issue) { setError(issue); return; } }
    if (mode === 'signup' && (!registrationOpen || !accepted)) { setError('Please agree to the terms and privacy notice to continue.'); return; }
    if (mode === 'signup' || mode === 'reset') {
      const issue = passwordIssue(password); if (issue) { setError(issue); return; }
      if (password !== confirmation) { setError('Your passwords do not match. Please check both fields.'); return; }
    }
    setBusy(true);
    try {
      if (mode === 'login') {
        const { error: failure } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (failure) throw failure;
        setNotice('Signed in. Verifying your account…');
      } else if (mode === 'signup') {
        const { error: failure } = await supabase.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: accountRedirect('/auth/callback') } });
        if (failure) throw failure;
        notifyAdminOfSignup(email.trim(), 'email');
        const registeredEmail = email.trim();
        setPassword(''); setConfirmation('');
        onNavigate(`/login?registered=true&email=${encodeURIComponent(registeredEmail)}`);
      } else if (mode === 'forgot') {
        const { error: failure } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: accountRedirect('/reset-password') });
        if (failure) throw failure;
        setNotice('If this email has an account, a reset link will arrive shortly. Open it in this browser. Check your spam folder too.');
      } else if (mode === 'reset') {
        if (!user || !recovery) { setError('This reset link is missing or expired. Request a new one.'); return; }
        const { error: failure } = await supabase.auth.updateUser({ password });
        if (failure) throw failure;
        setPassword(''); setConfirmation('');
        setNotice('Your password has been updated. You can now continue to your account.');
      }
    } catch (failure) { setError(authMessage(failure as { code?: string; status?: number })); }
    finally { setBusy(false); }
  }
  const disabled = !supabase || busy || loading;
  return <div className="site-root auth-root">
    <div className="auth-form-side"><header className="auth-header">
      <a
        href={isAppHost() ? '/login' : '/'}
        aria-label="Restro8 home"
        onClick={(e) => {
          e.preventDefault();
          onNavigate(isAppHost() ? (user ? '/' : '/login') : '/');
        }}
      >
        <BrandLogo/>
      </a>
      {isAppHost() ? (
        mode !== 'login' ? (
          <button type="button" className="site-text-link" onClick={() => onNavigate('/login')}>
            <ArrowLeft size={16}/>Back to sign in
          </button>
        ) : (
          <span className="site-text-link" style={{ cursor: 'default', opacity: 0.85 }}>
            Restro8 Workspace
          </span>
        )
      ) : (
        <a href="/" className="site-text-link" onClick={(e) => { e.preventDefault(); onNavigate('/'); }}>
          <ArrowLeft size={16}/>Back to home
        </a>
      )}
    </header>
      <main className="auth-form-wrap"><span className="site-eyebrow">INFINITE HOSPITALITY. ONE SIMPLE START.</span><h1>{headings[mode][0]}</h1><p className="auth-intro">{headings[mode][1]}</p>
        {!supabase && <div role="alert" className="auth-message">Account access is not configured on this deployment. No sign-in or registration can be completed.</div>}
        {(error || sessionError) && <div id="auth-error" className="auth-message is-error" role="alert">{error || sessionError}</div>}
        {notice && <div className="auth-message is-success" role="status"><Check size={18}/><span>{notice}</span></div>}
        {mode === 'callback' ? <div className="auth-callback">{loading ? <p role="status">Verifying your account securely…</p> : !user && <><p>This confirmation link could not be verified. It may have expired or been opened in a different browser.</p><button type="button" className="site-button" onClick={() => onNavigate('/login')}>Return to sign in<ArrowRight size={16}/></button></>}</div> : mode === 'signup' && !registrationOpen ? <div className="auth-launch-state"><span className="site-note-icon"><Sprout size={26}/></span><h2>Good things take a little care.</h2><p>New accounts are not open yet. Explore the product while we finish setting up live service and subscriptions.</p>{!isAppHost() && <a href="/#product" className="site-button">Explore the product<ArrowRight size={16}/></a>}<button type="button" className="site-text-link" onClick={() => onNavigate('/login')}>Already have an account? Sign in</button></div> : mode === 'reset' && !loading && (!user || !recovery) ? <div className="auth-launch-state"><LockKeyhole size={28}/><h2>Let’s use a fresh link.</h2><p>For your security, a valid password-reset email is needed to change your password here.</p><button type="button" className="site-button" onClick={() => onNavigate('/forgot-password')}>Request a reset link<ArrowRight size={16}/></button></div> : <form className="auth-form" onSubmit={submit} aria-busy={busy}>
          {(mode === 'login' || mode === 'signup') && <>
            <button type="button" className="site-button-oauth" onClick={handleGoogleAuth} disabled={disabled}>
              <GoogleIcon/>
              <span>Continue with Google</span>
            </button>
            <div className="auth-divider" role="separator"><span>or continue with email</span></div>
          </>}
          {mode !== 'reset' && <div className="auth-field"><label htmlFor="account-email">Email address</label><div className="auth-input-wrap"><Mail size={18} aria-hidden="true"/><input id="account-email" type="email" name="email" autoComplete="email" inputMode="email" required maxLength={254} placeholder="you@yourrestaurant.com" value={email} onChange={e => setEmail(e.target.value)} aria-describedby={error ? 'auth-error' : undefined}/></div></div>}
          {passwordForm && <div className="auth-field"><div className="auth-label-row"><label htmlFor="account-password">{mode === 'reset' ? 'New password' : 'Password'}</label>{mode === 'login' && <button type="button" onClick={() => onNavigate('/forgot-password')}>Forgot password?</button>}</div><div className="auth-input-wrap"><LockKeyhole size={18} aria-hidden="true"/><input id="account-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required minLength={mode === 'login' ? undefined : 12} maxLength={128} placeholder={mode === 'login' ? 'Your password' : 'At least 12 characters'} value={password} onChange={e => setPassword(e.target.value)} aria-describedby={mode !== 'login' ? 'password-hint' : undefined}/><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div>{mode !== 'login' && <small id="password-hint">A long, unique passphrase is a good choice.</small>}</div>}
          {(mode === 'signup' || mode === 'reset') && <div className="auth-field"><label htmlFor="account-confirmation">Confirm password</label><input id="account-confirmation" name="confirmation" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required maxLength={128} value={confirmation} onChange={e => setConfirmation(e.target.value)}/></div>}
          {mode === 'signup' && <label className="auth-consent"><input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} required/><span>I agree to the {publicConfig.termsUrl ? <a href={publicConfig.termsUrl} target="_blank" rel="noopener noreferrer">Terms</a> : 'Terms'} and have read the {publicConfig.privacyUrl ? <a href={publicConfig.privacyUrl} target="_blank" rel="noopener noreferrer">Privacy Notice</a> : 'Privacy Notice'}.</span></label>}
          <button type="submit" disabled={disabled || (mode === 'reset' && Boolean(notice))} className="site-button auth-submit">{busy ? 'Please wait…' : mode === 'login' ? 'Sign in to Restro8' : mode === 'signup' ? 'Create my account' : mode === 'forgot' ? 'Send reset link' : 'Update password'}<ArrowRight size={18}/></button>
          {mode === 'login' && <p className="auth-switch">Don’t have an account? <button type="button" onClick={() => onNavigate('/signup')}>Sign up</button></p>}
          {mode === 'signup' && <p className="auth-switch">Already have an account? <button type="button" onClick={() => onNavigate('/login')}>Sign in</button></p>}
          {(mode === 'forgot') && <button type="button" className="site-text-link auth-back" onClick={() => onNavigate('/login')}><ArrowLeft size={16}/>Back to sign in</button>}
          {mode === 'reset' && notice && <button type="button" className="site-text-link" onClick={() => onNavigate(isAppHost() ? '/' : '/app')}>Continue to your account<ArrowRight size={16}/></button>}
        </form>}
        <div className="auth-safety-note"><LockKeyhole size={14}/><span>Your account. Your workspace.<br/>No shared demo credentials.</span></div>
      </main><footer className="auth-footer"><span>© {new Date().getFullYear()} Restro8</span><div>{publicConfig.privacyUrl && <a href={publicConfig.privacyUrl}>Privacy</a>}{publicConfig.termsUrl && <a href={publicConfig.termsUrl}>Terms</a>}</div></footer>
    </div>
    <aside className="auth-story" aria-label="Restro8: thoughtfully simple hospitality"><span className="site-eyebrow">A LITTLE CLARITY GOES A LONG WAY</span><h2>Behind every<br/>great service,<br/><em>a little calm.</em></h2><p>More time for your guests.<br/>More space for your next big idea.</p><div className="auth-story-art"><div className="auth-story-ticket"><span>THE GOOD SERVICE CHECKLIST</span><strong><Check size={17}/>Tables ready.</strong><strong><Check size={17}/>Kitchen in rhythm.</strong><strong><Check size={17}/>A team that’s in the know.</strong><div>Small details. Better days.<Sprout size={20}/></div></div><img src="/images/menu/steamed-momo.png" width={260} height={220} alt="A plate of steamed momo, prepared with care"/></div><div className="auth-story-bottom"><BrandLogo compact/><span>Made for the people behind the plates.</span></div></aside>
  </div>;
}
