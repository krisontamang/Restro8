export type PublicRoute = 'landing' | 'login' | 'signup' | 'forgot' | 'reset' | 'callback' | 'account' | 'demo' | 'menu' | 'not-found';

export function isAppHost(hostname = typeof window !== 'undefined' ? window.location.hostname : ''): boolean {
  if (!hostname) return false;
  const host = hostname.toLowerCase();

  const configuredAppUrl = (import.meta as { env?: { VITE_APP_URL?: string } }).env?.VITE_APP_URL;
  if (configuredAppUrl) {
    try {
      const appHost = new URL(configuredAppUrl).hostname.toLowerCase();
      if (host === appHost) return true;
    } catch { /* ignore */ }
  }

  if (host.startsWith('app.') || host.startsWith('workspace.') || host.startsWith('pos.') || host === 'app.localhost') {
    return true;
  }

  if (typeof window !== 'undefined' && window.location?.search) {
    const params = new URLSearchParams(window.location.search);
    if (params.get('subdomain') === 'app' || params.get('app') === 'true') {
      return true;
    }
  }

  return false;
}

export function getAppUrl(path = '/login'): string {
  const configuredAppUrl = (import.meta as { env?: { VITE_APP_URL?: string } }).env?.VITE_APP_URL;
  if (configuredAppUrl) {
    try {
      return new URL(path, configuredAppUrl).toString();
    } catch { /* fallback */ }
  }
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (isAppHost(hostname)) {
      return new URL(path, window.location.origin).toString();
    }
    if (hostname !== 'localhost' && hostname !== '127.0.0.1' && !hostname.startsWith('app.')) {
      return `${window.location.protocol}//app.${hostname}${window.location.port ? ':' + window.location.port : ''}${path}`;
    }
  }
  return path;
}

export function getMarketingUrl(path = '/'): string {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname.startsWith('app.')) {
      const mainDomain = hostname.slice(4);
      return `${window.location.protocol}//${mainDomain}${window.location.port ? ':' + window.location.port : ''}${path}`;
    }
  }
  return path;
}

export function resolvePublicRoute(path: string, query = '', hostname = typeof window !== 'undefined' ? window.location.hostname : ''): PublicRoute {
  const normalized = path.toLowerCase().replace(/\/$/, '') || '/';
  const routes: Record<string, PublicRoute> = {
    '/': isAppHost(hostname) ? 'account' : 'landing',
    '/np': 'landing',
    '/login': 'login',
    '/signin': 'login',
    '/auth': 'login',
    '/signup': 'signup',
    '/forgot-password': 'forgot',
    '/reset-password': 'reset',
    '/auth/callback': 'callback',
    '/app': 'account',
    '/account': 'account',
    '/workspace': 'account',
    '/dashboard': 'account',
    '/pos': 'account',
    '/demo': 'demo',
    '/menu': 'menu',
  };
  if (normalized === '/') {
    const view = new URLSearchParams(query).get('view');
    if (view === 'app' || view === 'workspace') return 'account';
    if (view === 'login') return 'login';
    if (view === 'menu') return 'menu';
    if (view === 'landing') return 'landing';
  }
  return routes[normalized] || 'not-found';
}
export function passwordIssue(password: string): string | null {
  if (password.length < 12) return 'Use at least 12 characters. A memorable passphrase works well.';
  if (password.length > 128) return 'Keep your password under 129 characters.';
  return null;
}
export function emailIssue(email: string): string | null {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && email.trim().length <= 254 ? null : 'Enter a valid email address.';
}
export function authMessage(error: { code?: string; status?: number; message?: string } | null | undefined): string {
  if (error?.code === 'invalid_credentials') return 'The email or password is incorrect. Please try again.';
  if (error?.code === 'email_not_confirmed') return 'Verify your email address before signing in. Check your inbox for the confirmation link.';
  if (error?.status === 429 || error?.code?.includes('rate_limit')) return 'Too many attempts. Please wait a little before trying again.';
  if (error?.code === 'weak_password') return 'Choose a stronger password. Try a longer, unique passphrase.';
  if (error?.code === 'signup_disabled') return 'New accounts are not open yet. Existing customers can still sign in.';
  if (error?.code === 'unsupported_provider' || error?.message?.toLowerCase().includes('provider is not enabled')) {
    return 'Google Sign-In is not configured yet. Please sign in with your email and password.';
  }
  if (error?.status === 401 || error?.status === 403) return 'Sign-in is unavailable with the current service configuration. Please contact the site owner.';
  return 'We could not complete that request. Check your connection and try again.';
}
export function subscriptionIsCurrent(subscription: { status: string; current_period_end: string | null } | null, now = Date.now()) {
  if (!subscription || !['active', 'trialing'].includes(subscription.status)) return false;
  const expiry = Date.parse(subscription.current_period_end || '');
  return Number.isFinite(expiry) && expiry > now;
}

/** Configuration hygiene only; actual tokens are always validated by Supabase. */
export function isSafePublicKey(key?: string): boolean {
  if (!key) return false;
  if (/^sb_publishable_[A-Za-z0-9_-]{20,}$/.test(key)) return true;
  const parts = key.split('.');
  if (parts.length !== 3) return false;
  try {
    const encoded = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(encoded)).role === 'anon';
  } catch { return false; }
}
