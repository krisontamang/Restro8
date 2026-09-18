import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, Check, ChevronDown, ChevronUp, LogOut, Mail, MessageSquare, RefreshCw, Store } from 'lucide-react';
import { BrandLogo } from '../brand/BrandLogo';
import { useAuth } from '../../context/authState';
import { createWorkspace, loadAccount, type CloudWorkspace } from '../../lib/accountApi';
import { safeStorage } from '../../lib/storage';

interface ReleaseNote {
  id: string;
  versionTitle: string;
  date: string;
  subtitle: string;
  bullets: {
    title: string;
    description: string;
    tag?: string;
  }[];
  platforms: string[];
}

const RECENT_RELEASES: ReleaseNote[] = [
  {
    id: 'bhadra-1st-2026',
    versionTitle: 'Bhadra 1st Release',
    date: '08 September 2026',
    subtitle: 'Improved Checkout and Financial Management',
    bullets: [
      {
        title: 'Improved Checkout',
        description: 'Refined and optimized the Checkout module for a smoother user experience.',
      },
      {
        title: 'Undo Latest Daybook',
        description: 'Users can now undo their latest daybook entry to adjust changes that may have been missed during closing.',
      },
      {
        title: 'Edit Sales Settlement',
        description: 'Users can now change the settled payment mode after checkout to adjust payment changes made during customer payments.',
      },
      {
        title: 'Expanded Sales Reports',
        description: 'Added reports including KOT Typewise Sales, Menuset Wise Sales, Food Cost Report, and more.',
      },
      {
        title: 'Item Discount on Rate',
        description: 'Item-level discounts are now applied to the item rate instead of the total item amount.',
      },
      {
        title: 'Staff Order Management',
        description: 'Direct staff orders are now restricted. Staff sales must be linked to a customer profile, while existing sales data remains available in the staff profile.',
        tag: 'App',
      },
      {
        title: 'Inventory Data in Balance Sheet',
        description: 'Balance Sheet now includes inventory data for accurate financial tracking.',
      },
      {
        title: 'Purchase Entry Improvement',
        description: 'Users can now view attachments while making purchase entries.',
        tag: 'Web',
      },
      {
        title: 'Detailed Checkout Breakdown',
        description: 'Users can now view a complete breakdown of checkout amounts from the dashboard.',
      },
      {
        title: 'Estimate Invoice Behaviour',
        description: 'Pre-checkout invoices now reflect the exact invoice that will be generated after checkout.',
      },
    ],
    platforms: ['Web', 'Android', 'ios'],
  },
  {
    id: 'shrawan-2nd-2026',
    versionTitle: 'Shrawan 2nd Release',
    date: '19 August 2026',
    subtitle: 'Better control over orders, bills, invoices, and everyday restaurant operations.',
    bullets: [
      {
        title: 'Split Bills and Items',
        description: 'Added support for splitting item quantities and distributing items across multiple bills, allowing separate actions on each portion for more flexible order and bill management.',
      },
      {
        title: 'Assigned Orders',
        description: 'Added easier access to orders assigned to specific staff members.',
      },
      {
        title: 'Order Cancellation Breakdown',
        description: 'Added a breakdown showing the total order value and the amount cancelled.',
      },
      {
        title: 'Refined Order Cards',
        description: 'Improved order cards to display key details such as customer delivery information and delivery rider name.',
      },
      {
        title: 'Order Slip Settings',
        description: 'Added options to enable or disable specific items displayed on order slips.',
      },
      {
        title: 'Outstanding Balance',
        description: 'Customer outstanding balance is now displayed on checked-out invoices for easier identification of pending dues.',
      },
      {
        title: 'Digital Menu Settings',
        description: 'Added controls for digital menu login options, visibility, transactions, stamps, and profile fields.',
      },
      {
        title: 'Invoice Settings Refinement',
        description: 'Added support for multiple restaurant contacts and configurable customer details on invoices.',
      },
      {
        title: 'Party Assets',
        description: 'Added support for storing images and documents such as payment QR codes and identity cards in party profiles.',
      },
      {
        title: 'Maintenance Indication',
        description: 'Added advance notifications for upcoming maintenance to help restaurants prepare for possible service disruptions.',
      },
    ],
    platforms: ['Android', 'ios', 'Web'],
  },
];

export function AccountPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const { user, signOut, error: authError } = useAuth();
  const [workspaces, setWorkspaces] = useState<CloudWorkspace[]>([]);
  const [name, setName] = useState('');
  const [loadedKey, setLoadedKey] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ 'bhadra-1st-2026': true });

  const requestKey = `${user?.id}:${retry}`;
  const loading = loadedKey !== requestKey;

  useEffect(() => {
    const controller = new AbortController();
    loadAccount(controller.signal)
      .then(data => {
        if (!controller.signal.aborted) {
          setWorkspaces(data.workspaces);
          if (data.workspaces[0]?.name) {
            try {
              const raw = safeStorage.getItem('restrox_np_settings_v2');
              const existing = raw ? JSON.parse(raw) : {};
              if (existing.name !== data.workspaces[0].name) {
                safeStorage.setItem('restrox_np_settings_v2', JSON.stringify({ ...existing, name: data.workspaces[0].name }));
              }
            } catch {
              // Non-blocking
            }
          }
          setError('');
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setError('We could not verify your workspace. Please try again.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadedKey(requestKey);
      });
    return () => controller.abort();
  }, [requestKey]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    if (name.trim().length < 2 || name.trim().length > 100) {
      setError('Use a restaurant name between 2 and 100 characters.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await createWorkspace(name);
      try {
        const raw = safeStorage.getItem('restrox_np_settings_v2');
        const existing = raw ? JSON.parse(raw) : {};
        safeStorage.setItem('restrox_np_settings_v2', JSON.stringify({ ...existing, name: name.trim() }));
      } catch {
        // Non-blocking
      }
      setRetry(value => value + 1);
    } catch {
      setError('Workspace setup could not be completed. Please retry; an existing workspace will not be duplicated.');
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    setBusy(true);
    try {
      if (await signOut()) onNavigate('/login');
    } finally {
      setBusy(false);
    }
  }

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="site-root account-root">
      <header className="account-header site-container">
        <a href="/" aria-label="Restro8 home">
          <BrandLogo />
        </a>
        <button className="site-text-link" type="button" onClick={logout} disabled={busy}>
          <LogOut size={17} />
          Sign out
        </button>
      </header>

      <main className="account-main">
        <span className="site-eyebrow">YOUR RESTRO8 ACCOUNT</span>
        <h1>A good beginning.</h1>
        <p className="account-email">Signed in as {user?.email}</p>
        <div className="account-verified">
          <Check size={16} />
          Email verified
        </div>

        {(error || authError) && (
          <div role="alert" className="auth-message is-error">
            {error || authError}
            <button type="button" className="site-text-link" onClick={() => setRetry(value => value + 1)}>
              <RefreshCw size={15} />
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <p role="status">Loading your account…</p>
        ) : !error && !workspaces.length ? (
          <section className="account-card">
            <Store size={26} />
            <h2>Let’s name your workspace.</h2>
            <p>This creates your private account workspace. No payment or credit card is required.</p>
            <form className="auth-form" onSubmit={submit}>
              <div className="auth-field">
                <label htmlFor="workspace-name">Restaurant name</label>
                <input
                  id="workspace-name"
                  autoComplete="organization"
                  required
                  minLength={2}
                  maxLength={100}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your restaurant or café"
                />
              </div>
              <small>Country: Nepal · Timezone: Asia/Kathmandu</small>
              <button type="submit" className="site-button" disabled={busy}>
                {busy ? 'Creating workspace…' : 'Create workspace'}
                <ArrowRight size={16} />
              </button>
            </form>
          </section>
        ) : !error && (
          <>
            {/* Active Workspace Banner */}
            <section className="account-card">
              <div className="account-workspace-top">
                <Store size={26} />
                <div>
                  <h2>{workspaces[0]?.name}</h2>
                  <p>Your restaurant workspace is saved and ready in the cloud.</p>
                </div>
              </div>
              <button
                type="button"
                className="site-button account-launch-btn"
                onClick={() => onNavigate('/workspace')}
              >
                Launch Restaurant Workspace <ArrowRight size={17} />
              </button>
            </section>

            {/* Our Mission & Goals */}
            <section className="account-card account-goals-card">
              <span className="account-section-tag">OUR MISSION & GOALS</span>
              <h2>Built for calm, effortless hospitality.</h2>
              <p className="account-goals-intro">
                Restro8 was created to give restaurant and café teams across Nepal an uncluttered, modern operating system.
                We believe hospitality shines brightest when software eliminates administrative chaos instead of adding to it.
              </p>
              <div className="account-goals-grid">
                <div className="account-goal-item">
                  <div className="account-goal-bullet" />
                  <div>
                    <strong>Zero Rush Hour Chaos</strong>
                    <p>Instant table-side ordering and real-time kitchen displays prevent lost tickets, billing errors, and confusion during peak service.</p>
                  </div>
                </div>
                <div className="account-goal-item">
                  <div className="account-goal-bullet" />
                  <div>
                    <strong>Financial Peace of Mind</strong>
                    <p>Automated daybooks, split payments, and instant sales reports give owners accurate daily revenue numbers with zero manual bookkeeping.</p>
                  </div>
                </div>
                <div className="account-goal-item">
                  <div className="account-goal-bullet" />
                  <div>
                    <strong>Crafted for Nepal’s Needs</strong>
                    <p>Full support for NPR currency, Bikram Sambat day management, bilingual thermal receipt printing, and lightning-fast offline resilience.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Recent Changes & Features */}
            <div className="account-section-header">
              <span className="account-section-tag">WHAT’S NEW IN RESTRO8</span>
              <h2>Recent Changes & Features</h2>
              <p>Explore the latest refinements, performance upgrades, and workflow improvements shipped to your workspace.</p>
            </div>

            <div className="account-releases-list">
              {RECENT_RELEASES.map(release => {
                const isCardExpanded = Boolean(expanded[release.id]);
                const displayedBullets = isCardExpanded ? release.bullets : release.bullets.slice(0, 5);

                return (
                  <article key={release.id} className="account-card account-release-card">
                    <div className="account-release-top">
                      <h3>{release.versionTitle}</h3>
                      <time dateTime={release.date}>{release.date}</time>
                    </div>
                    <p className="account-release-subtitle">{release.subtitle}</p>

                    <ul className="account-release-bullets">
                      {displayedBullets.map((bullet, idx) => (
                        <li key={idx}>
                          <strong>{bullet.title}:</strong> {bullet.description}
                          {bullet.tag && <span className="account-tag-inline">[{bullet.tag}]</span>}
                        </li>
                      ))}
                    </ul>

                    {release.bullets.length > 5 && (
                      <button
                        type="button"
                        className="account-view-more-btn"
                        onClick={() => toggleExpand(release.id)}
                      >
                        {isCardExpanded ? (
                          <>
                            View Less <ChevronUp size={15} />
                          </>
                        ) : (
                          <>
                            View More ({release.bullets.length - 5} more updates) <ChevronDown size={15} />
                          </>
                        )}
                      </button>
                    )}

                    <div className="account-platform-pills">
                      {release.platforms.map(platform => (
                        <span key={platform}>{platform}</span>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Support & Feedback Card */}
            <section className="account-card account-support-card">
              <div className="account-support-header">
                <span className="account-support-eyebrow">
                  <MessageSquare size={14} />
                  DIRECT FOUNDER & SUPPORT ACCESS
                </span>
                <h3>Found a bug or have an improvement idea?</h3>
                <p>
                  We build Restro8 alongside restaurant owners like you. If you encounter any issue, notice a glitch, or want a new feature for your café, reach out directly:
                </p>
              </div>
              <div className="account-support-actions">
                <a
                  href="https://wa.me/9779821828807?text=Hi%20Restro8%20Team%2C%20I%20have%20feedback%20%2F%20found%20a%20bug%20in%20my%20workspace"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="account-whatsapp-btn"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                  <div className="account-btn-text">
                    <strong>WhatsApp Support</strong>
                    <small>+977 9821828807 · Quick chat</small>
                  </div>
                </a>
                <a
                  href={`mailto:krisonlama27@gmail.com?subject=Restro8%20Feedback%20%26%20Bug%20Report&body=Hi%20Restro8%20Team%2C%0A%0AWorkspace%3A%20${encodeURIComponent(
                    workspaces[0]?.name || ''
                  )}%0AUser%3A%20${encodeURIComponent(user?.email || '')}%0A%0AFeedback%20%2F%20Bug%20Report%3A%0A`}
                  className="account-email-btn"
                >
                  <Mail size={20} />
                  <div className="account-btn-text">
                    <strong>Email Support Team</strong>
                    <small>krisonlama27@gmail.com</small>
                  </div>
                </a>
              </div>
            </section>
          </>
        )}

        <p className="account-footnote">
          Your workspace data is saved in cloud storage with end-to-end access isolation.
        </p>
      </main>
    </div>
  );
}
