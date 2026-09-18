import { supabase } from './supabase';
export interface BillingPlan { id: string; name: string; description: string; currency: string; amount_minor: number; interval: 'month' | 'year'; features: string[] }
export interface CloudWorkspace { id: string; name: string; country_code: string; timezone: string; created_at: string }
export interface SubscriptionRecord { status: string; plan_id: string | null; current_period_end: string | null; cancel_at_period_end: boolean }
export const publicConfig = {
  signupsEnabled: import.meta.env.VITE_SIGNUPS_ENABLED === 'true',
  termsUrl: trustedWebUrl(import.meta.env.VITE_TERMS_URL),
  privacyUrl: trustedWebUrl(import.meta.env.VITE_PRIVACY_URL),
  contactEmail: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(import.meta.env.VITE_CONTACT_EMAIL || '') ? (import.meta.env.VITE_CONTACT_EMAIL as string) : 'krisonlama27@gmail.com',
  adminEmail: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(import.meta.env.VITE_ADMIN_EMAIL || '') ? (import.meta.env.VITE_ADMIN_EMAIL as string) : 'krisonlama27@gmail.com',
};
export async function notifyAdminOfSignup(email: string, provider: 'email' | 'google', workspaceName?: string) {
  if (!supabase) return;
  try {
    await supabase.functions.invoke('notify-signup', {
      body: { email, provider, workspaceName, adminEmail: publicConfig.adminEmail, timestamp: new Date().toISOString() },
    });
  } catch {
    // Non-blocking notification
  }
}
function trustedWebUrl(value?: string) {
  if (!value) return '';
  try { const url = new URL(value); return url.protocol === 'https:' ? url.toString() : ''; } catch { return ''; }
}
export function accountRedirect(path: '/auth/callback' | '/reset-password') {
  const configured = trustedWebUrl(import.meta.env.VITE_APP_URL);
  return new URL(path, configured || window.location.origin).toString();
}
export async function loadPlans(signal?: AbortSignal): Promise<BillingPlan[]> {
  if (!supabase) return [];
  let query = supabase.from('r8_billing_plans').select('id,name,description,currency,amount_minor,interval,features').eq('active', true).order('sort_order');
  if (signal) query = query.abortSignal(signal);
  const { data, error } = await query;
  if (error) throw new Error('Plans are unavailable right now. No payment will be taken.');
  return data || [];
}
export async function loadAccount(signal?: AbortSignal) {
  if (!supabase) throw new Error('Account service is not configured.');
  let query = supabase.from('r8_workspaces').select('id,name,country_code,timezone,created_at').order('created_at');
  if (signal) query = query.abortSignal(signal);
  const { data, error } = await query;
  if (error) throw new Error('We could not load your workspace. Please retry.');
  const workspaces = (data || []) as CloudWorkspace[];
  let subscription: SubscriptionRecord | null = null;
  if (workspaces[0]) {
    let subscriptionQuery = supabase.from('r8_subscriptions').select('status,plan_id,current_period_end,cancel_at_period_end').eq('workspace_id',workspaces[0].id);
    if (signal) subscriptionQuery = subscriptionQuery.abortSignal(signal);
    const result = await subscriptionQuery.maybeSingle();
    if (result.error) throw new Error('Subscription status could not be verified. Access remains restricted.');
    subscription = result.data;
    if (!subscription) {
      const createdAtMs = Date.parse(workspaces[0].created_at) || Date.now();
      let trialEndMs = createdAtMs + 14 * 24 * 60 * 60 * 1000;
      if (trialEndMs <= Date.now()) {
        trialEndMs = Date.now() + 14 * 24 * 60 * 60 * 1000;
      }
      const trialEnd = new Date(trialEndMs).toISOString();
      subscription = {
        status: 'trialing',
        plan_id: 'standard',
        current_period_end: trialEnd,
        cancel_at_period_end: false,
      };
    }
  }
  return { workspaces, subscription };
}
export async function createWorkspace(name: string) {
  if (!supabase) throw new Error('Account service is not configured.');
  const trimmed = name.trim();
  const { data, error } = await supabase.rpc('r8_create_workspace', { workspace_name:trimmed, country:'NP', workspace_timezone:'Asia/Kathmandu' });
  if (error) throw new Error('Workspace setup could not be completed. Please retry; an existing workspace will not be duplicated.');
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (user?.email) {
      notifyAdminOfSignup(user.email, (user.app_metadata?.provider as 'google' | 'email') || 'email', trimmed);
    }
  } catch {
    // Non-blocking
  }
  return data as string;
}
export function planPrice(plan: BillingPlan) { return new Intl.NumberFormat('en-NP', {style:'currency',currency:plan.currency,maximumFractionDigits:0}).format(plan.amount_minor / 100); }
