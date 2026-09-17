import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, Check, LogOut, RefreshCw, Store, Wallet } from 'lucide-react';
import { BrandLogo } from '../brand/BrandLogo';
import { useAuth } from '../../context/authState';
import { createWorkspace, loadAccount, type CloudWorkspace, type SubscriptionRecord } from '../../lib/accountApi';
import { subscriptionIsCurrent } from '../../lib/accountRules';

export function AccountPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const { user, signOut, error: authError } = useAuth();
  const [workspaces, setWorkspaces] = useState<CloudWorkspace[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionRecord | null>(null);
  const [name, setName] = useState('');
  const [loadedKey, setLoadedKey] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const requestKey = `${user?.id}:${retry}`;
  const loading = loadedKey !== requestKey;
  useEffect(() => {
    const controller = new AbortController();
    loadAccount(controller.signal).then(data => { if (!controller.signal.aborted) { setWorkspaces(data.workspaces); setSubscription(data.subscription); setError(''); } }).catch(() => { if (!controller.signal.aborted) setError('We could not verify your workspace and subscription. Please try again.'); }).finally(() => { if (!controller.signal.aborted) setLoadedKey(requestKey); });
    return () => controller.abort();
  }, [requestKey]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return;
    if (name.trim().length < 2 || name.trim().length > 100) { setError('Use a restaurant name between 2 and 100 characters.'); return; }
    setBusy(true); setError('');
    try { await createWorkspace(name); setRetry(value => value + 1); }
    catch { setError('Workspace setup could not be completed. Please retry; an existing workspace will not be duplicated.'); }
    finally { setBusy(false); }
  }
  async function logout() { setBusy(true); try { if (await signOut()) onNavigate('/login'); } finally { setBusy(false); } }
  return <div className="site-root account-root"><header className="account-header site-container"><a href="/" aria-label="Restro8 home"><BrandLogo/></a><button className="site-text-link" type="button" onClick={logout} disabled={busy}><LogOut size={17}/>Sign out</button></header><main className="account-main"><span className="site-eyebrow">YOUR RESTRO8 ACCOUNT</span><h1>A good beginning.</h1><p className="account-email">Signed in as {user?.email}</p><div className="account-verified"><Check size={16}/>Email verified</div>
    {(error || authError) && <div role="alert" className="auth-message is-error">{error || authError}<button type="button" className="site-text-link" onClick={() => setRetry(value => value + 1)}><RefreshCw size={15}/>Retry</button></div>}
    {loading ? <p role="status">Loading your account…</p> : !error && !workspaces.length ? <section className="account-card"><Store size={26}/><h2>Let’s name your workspace.</h2><p>This creates your private account workspace. It does not start a subscription or take a payment.</p><form className="auth-form" onSubmit={submit}><div className="auth-field"><label htmlFor="workspace-name">Restaurant name</label><input id="workspace-name" autoComplete="organization" required minLength={2} maxLength={100} value={name} onChange={e => setName(e.target.value)} placeholder="Your restaurant or café"/></div><small>Country: Nepal · Timezone: Asia/Kathmandu</small><button type="submit" className="site-button" disabled={busy}>{busy ? 'Creating workspace…' : 'Create workspace'}<ArrowRight size={16}/></button></form></section> : !error && <section className="account-card"><Store size={26}/><h2>{workspaces[0]?.name}</h2><p>Your account workspace is saved securely in the cloud.</p><div className="account-subscription"><Wallet size={22}/><div><strong>{subscriptionIsCurrent(subscription) ? 'Subscription recorded' : 'No active subscription'}</strong><p>{subscriptionIsCurrent(subscription) ? 'A subscription is on file. Operational access still requires a verified, cloud-connected restaurant setup.' : 'No charge has been taken here. Live checkout is not available on this deployment.'}</p></div></div><div className="auth-message">Restaurant operations are not enabled for this account yet. Local sample orders and reports are never substituted for your live data.</div><a className="site-text-link" href="/#product">Explore the isolated product preview<ArrowRight size={16}/></a></section>}
    <p className="account-footnote">Your workspace and subscription are checked on the server. Browser settings cannot grant a paid plan or staff permissions.</p>
  </main></div>;
}
