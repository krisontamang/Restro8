import React, { useState } from 'react';
import {
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Tag,
  Calendar,
  CheckCircle2,
  Smartphone,
  Globe,
  Apple,
} from 'lucide-react';

interface ReleaseNoteItem {
  id: string;
  versionTitle: string;
  date: string;
  subtitle: string;
  bullets: {
    title: string;
    description: string;
    tag?: string;
  }[];
  platforms: ('Web' | 'Android' | 'ios')[];
  extendedNotes?: string[];
}

export const ReleaseNotesView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const releases: ReleaseNoteItem[] = [
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
      extendedNotes: [
        'Security patch applied to POS offline token caching.',
        'High-speed ESC/POS driver compatibility update for 80mm Rongta & Xprinter devices.',
        'Dynamic IRD QR code rendering optimized for low-resolution thermal printers.',
      ],
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
      extendedNotes: [
        'Enhanced dual-currency calculation logic (NPR / INR) for border hospitality hubs.',
        'Improved table seating visualization for dark mode themes.',
        'Auto-reconnect mechanism for multi-device kitchen display screen dispatch.',
      ],
    },
  ];

  // Filter releases by search query and platform
  const filteredReleases = releases.filter((rel) => {
    const matchesPlatform =
      selectedPlatform === 'All' || rel.platforms.includes(selectedPlatform as any);
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesPlatform;

    const matchesTitle =
      rel.versionTitle.toLowerCase().includes(q) ||
      rel.subtitle.toLowerCase().includes(q) ||
      rel.date.toLowerCase().includes(q);
    const matchesBullets = rel.bullets.some(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q)
    );

    return matchesPlatform && (matchesTitle || matchesBullets);
  });

  return (
    <div
      style={{
        padding: '24px 32px',
        backgroundColor: 'var(--color-background)',
        overflowY: 'auto',
        height: '100%',
        boxSizing: 'border-box',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Header matching Screenshot 1 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '22px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '1.45rem',
              fontWeight: 700,
              margin: '0 0 4px 0',
              color: 'var(--color-foreground)',
              letterSpacing: '-0.02em',
            }}
          >
            Release Note
          </h1>
          <p
            style={{
              fontSize: '0.84rem',
              color: 'var(--color-muted-foreground)',
              margin: 0,
            }}
          >
            Stay up-to-date with the latest features, improvements, and fixes in RESTRO8.
          </p>
        </div>

        {/* Search & Platform Filter Bar */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              padding: '6px 12px',
              gap: '6px',
            }}
          >
            <Search size={14} color="var(--color-muted-foreground)" />
            <input
              type="text"
              placeholder="Search release notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: '0.82rem',
                color: 'var(--color-foreground)',
                width: '180px',
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              backgroundColor: 'var(--color-muted)',
              borderRadius: '8px',
              padding: '3px',
              gap: '2px',
            }}
          >
            {['All', 'Web', 'Android', 'ios'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setSelectedPlatform(p)}
                style={{
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.78rem',
                  fontWeight: selectedPlatform === p ? 600 : 500,
                  backgroundColor:
                    selectedPlatform === p ? 'var(--color-card)' : 'transparent',
                  color:
                    selectedPlatform === p
                      ? 'var(--color-foreground)'
                      : 'var(--color-muted-foreground)',
                  cursor: 'pointer',
                  boxShadow:
                    selectedPlatform === p ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Release Cards Feed matching Screenshot 1 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1100px' }}>
        {filteredReleases.length === 0 ? (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              backgroundColor: 'var(--color-card)',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              color: 'var(--color-muted-foreground)',
            }}
          >
            No release notes match your search.
          </div>
        ) : (
          filteredReleases.map((release) => {
            const isExpanded = expandedCards[release.id] || false;

            return (
              <div
                key={release.id}
                style={{
                  backgroundColor: 'var(--color-card)',
                  borderRadius: '12px',
                  border: '1px solid var(--color-border)',
                  padding: '24px 28px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  transition: 'box-shadow 0.2s ease',
                }}
              >
                {/* Version Title & Date */}
                <div style={{ marginBottom: '14px' }}>
                  <div
                    style={{
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      color: 'var(--color-foreground)',
                      marginBottom: '3px',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {release.versionTitle}
                  </div>
                  <div
                    style={{
                      fontSize: '0.82rem',
                      color: 'var(--color-muted-foreground)',
                      fontWeight: 500,
                    }}
                  >
                    {release.date}
                  </div>
                </div>

                {/* Subtitle / Release Summary */}
                <div
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: 'var(--color-foreground)',
                    marginBottom: '14px',
                    lineHeight: '1.45',
                  }}
                >
                  {release.subtitle}
                </div>

                {/* Bullet Points List matching Screenshot 1 */}
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '0 0 16px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  {release.bullets.map((bullet, idx) => (
                    <li
                      key={idx}
                      style={{
                        fontSize: '0.84rem',
                        lineHeight: '1.5',
                        color: 'var(--color-foreground)',
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '6px',
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          color: 'var(--color-foreground)',
                          fontSize: '1rem',
                          lineHeight: '1',
                        }}
                      >
                        •
                      </span>
                      <div>
                        <strong style={{ fontWeight: 700, color: 'var(--color-foreground)' }}>
                          {bullet.title}:
                        </strong>{' '}
                        <span style={{ color: 'var(--color-foreground)' }}>
                          {bullet.description}
                        </span>
                        {bullet.tag && (
                          <span
                            style={{
                              marginLeft: '6px',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              backgroundColor: 'rgba(14, 165, 233, 0.08)',
                              color: 'var(--r8-brand-primary)',
                            }}
                          >
                            [{bullet.tag}]
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Extended Details if Expanded */}
                {isExpanded && release.extendedNotes && (
                  <div
                    style={{
                      marginTop: '12px',
                      marginBottom: '16px',
                      padding: '12px 16px',
                      backgroundColor: 'var(--color-muted)',
                      borderRadius: '8px',
                      borderLeft: '3px solid var(--r8-brand-primary)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: 'var(--color-foreground)',
                        marginBottom: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <CheckCircle2 size={14} color="var(--r8-brand-primary)" />
                      <span>Technical Architecture & Compliance Notes</span>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.8rem', color: 'var(--color-muted-foreground)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {release.extendedNotes.map((note, nIdx) => (
                        <li key={nIdx}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* View More Link matching Screenshot 1 */}
                <div style={{ marginBottom: '16px' }}>
                  <button
                    type="button"
                    onClick={() => toggleExpand(release.id)}
                    style={{
                      border: 'none',
                      background: 'none',
                      padding: 0,
                      color: '#2563EB',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                  >
                    <span>{isExpanded ? 'View Less' : 'View More'}</span>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>

                {/* Platform Badges matching Screenshot 1 */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {release.platforms.map((platform) => (
                    <span
                      key={platform}
                      style={{
                        backgroundColor: 'var(--color-muted)',
                        color: 'var(--color-muted-foreground)',
                        borderRadius: '6px',
                        padding: '3px 12px',
                        fontSize: '0.78rem',
                        fontWeight: 500,
                        letterSpacing: '0.2px',
                      }}
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
