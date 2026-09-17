import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Music,
  Tv,
  Gamepad2,
  Video,
  Palette,
  Check,
  Zap,
  ShieldCheck,
  Search,
  ChevronRight,
  X,
  CreditCard,
  QrCode,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

export interface UGProduct {
  id: string;
  name: string;
  category: 'ai' | 'creative' | 'streaming' | 'gaming';
  tagline: string;
  badge?: string;
  badgeColor?: string;
  brandColor: string;
  icon: React.ReactNode;
  packages: {
    id: string;
    label: string;
    priceNPR: number;
    popular?: boolean;
    savings?: string;
  }[];
  features: string[];
  inputType: 'email' | 'player_id';
  inputPlaceholder: string;
}

export const UG_PRODUCTS: UGProduct[] = [
  {
    id: 'claude-ai',
    name: 'Claude AI Pro & Max',
    category: 'ai',
    tagline: 'Opus 4, Sonnet 3.7 Thinking, 5x Limits & Claude Code CLI',
    badge: '🔥 Hot Seller',
    badgeColor: '#D97706',
    brandColor: '#CC5500',
    icon: <Bot size={22} color="#CC5500" />,
    packages: [
      { id: 'c1', label: '1 Month Pro', priceNPR: 3900, popular: true },
      { id: 'c12', label: '12 Months Pro', priceNPR: 41300, savings: 'Save Rs 5,500' },
      { id: 'cmax', label: '1 Month Claude Max', priceNPR: 19300 },
    ],
    features: [
      'Access to Sonnet 3.7 & Opus reasoning models',
      '5x usage capacity vs free tier',
      'Interactive Canvas & Artifacts workspace',
      'Priority access during peak traffic',
    ],
    inputType: 'email',
    inputPlaceholder: 'Enter your Anthropic / Google email',
  },
  {
    id: 'chatgpt-plus',
    name: 'ChatGPT Plus / Pro',
    category: 'ai',
    tagline: 'GPT-4o, o1 Reasoning, DALL-E 3, Deep Search & GPTs',
    badge: '★ Best Value',
    badgeColor: '#10B981',
    brandColor: '#10A37F',
    icon: <Sparkles size={22} color="#10A37F" />,
    packages: [
      { id: 'gpt-shared', label: 'Shared 1 Mo', priceNPR: 850, savings: 'Budget Pick' },
      { id: 'gpt-own-1', label: 'Own Mail 1 Mo', priceNPR: 1400, popular: true },
      { id: 'gpt-own-12', label: 'Own Mail 12 Mo', priceNPR: 15999, savings: 'Save Rs 2,800' },
    ],
    features: [
      'Full OpenAI GPT-4o and o1 reasoning model suite',
      'DALL-E 3 image generation & custom GPT access',
      'Web search, Python code interpreter & file analysis',
      'Guaranteed instant replacement warranty',
    ],
    inputType: 'email',
    inputPlaceholder: 'Enter your OpenAI account email',
  },
  {
    id: 'canva-pro',
    name: 'Canva Pro',
    category: 'creative',
    tagline: 'Magic Studio AI, 100M+ Stock Assets & Brand Kit',
    badge: 'Popular',
    badgeColor: '#8B5CF6',
    brandColor: '#7D2AE8',
    icon: <Palette size={22} color="#7D2AE8" />,
    packages: [
      { id: 'canva-3m', label: '3 Months', priceNPR: 250 },
      { id: 'canva-6m', label: '6 Months', priceNPR: 450 },
      { id: 'canva-1y', label: '1 Year Pro', priceNPR: 650, popular: true, savings: 'Top Value' },
    ],
    features: [
      'Unlimited access to 100M+ premium stock photos & videos',
      '1-Click Background Remover & Magic Eraser',
      'Restaurant Brand Kit: Logos, fonts & custom colors',
      'Resize menu designs for social media & print automatically',
    ],
    inputType: 'email',
    inputPlaceholder: 'Enter your Canva account email',
  },
  {
    id: 'spotify-premium',
    name: 'Spotify Premium',
    category: 'streaming',
    tagline: 'Ad-Free High Fidelity Music with Offline Listening',
    brandColor: '#1DB954',
    icon: <Music size={22} color="#1DB954" />,
    packages: [
      { id: 'sp-ind-1', label: 'Individual 1 Mo', priceNPR: 599 },
      { id: 'sp-ind-3', label: 'Individual 3 Mo', priceNPR: 1800 },
      { id: 'sp-ind-12', label: 'Individual 12 Mo', priceNPR: 6200 },
      { id: 'sp-fam-1', label: 'Family Slot 1 Mo', priceNPR: 350, popular: true },
      { id: 'sp-fam-12', label: 'Family Slot 12 Mo', priceNPR: 3400, savings: 'Best Rate' },
    ],
    features: [
      '100% Ad-free streaming for dining ambiance',
      'High Fidelity 320kbps audio quality',
      'Unlimited skips & offline music playback',
      'Compatible with restaurant sound systems & Bluetooth',
    ],
    inputType: 'email',
    inputPlaceholder: 'Enter your Spotify account email',
  },
  {
    id: 'youtube-premium',
    name: 'YouTube & Music Premium',
    category: 'streaming',
    tagline: 'Zero Ads, Background Audio & YouTube Music Included',
    badge: 'Essential',
    badgeColor: '#EF4444',
    brandColor: '#FF0000',
    icon: <Tv size={22} color="#FF0000" />,
    packages: [
      { id: 'yt-fam-1', label: 'Family 1 Mo', priceNPR: 350 },
      { id: 'yt-fam-3', label: 'Family 3 Mo', priceNPR: 999, popular: true },
      { id: 'yt-priv-12', label: 'Private 12 Mo', priceNPR: 6500, savings: 'Save Rs 1,500' },
    ],
    features: [
      'Completely ad-free videos for restaurant screens & TVs',
      'Screen-off background playback on mobile & tablets',
      'YouTube Music Premium included at no extra cost',
      'Smart 1080p Enhanced Bitrate streaming',
    ],
    inputType: 'email',
    inputPlaceholder: 'Enter your Google / YouTube email',
  },
  {
    id: 'capcut-pro',
    name: 'CapCut Pro',
    category: 'creative',
    tagline: 'AI Video Upscaling, Auto Captions & 4K 60FPS Export',
    brandColor: '#000000',
    icon: <Video size={22} color="#0F172A" />,
    packages: [
      { id: 'cap-1m', label: '1 Month', priceNPR: 850 },
      { id: 'cap-3m', label: '3 Months', priceNPR: 2300 },
      { id: 'cap-6m', label: '6 Months', priceNPR: 4200 },
      { id: 'cap-12m', label: '12 Months', priceNPR: 7650, popular: true, savings: 'Save Rs 2,550' },
    ],
    features: [
      'AI Smart Cutout & multi-track video editing',
      'Auto-generated captions with viral TikTok & Reel presets',
      '4K 60fps high bitrate export with zero watermarks',
      'Cloud storage space for collaborative restaurant reels',
    ],
    inputType: 'email',
    inputPlaceholder: 'Enter your CapCut account email / ID',
  },
  {
    id: 'sony-liv',
    name: 'Sony LIV Premium',
    category: 'streaming',
    tagline: 'UEFA Champions League, Cricket Live & Sony Originals',
    brandColor: '#0284C7',
    icon: <Tv size={22} color="#0284C7" />,
    packages: [
      { id: 'sony-1m', label: '1 Month', priceNPR: 650, popular: true },
    ],
    features: [
      'Live sports broadcasts: UEFA, Cricket, WWE, UFC',
      'Full HD 1080p resolution with Dolby 5.1 sound',
      'Simultaneous multi-screen viewing on smart TVs',
      'Binge exclusive Sony LIV original series',
    ],
    inputType: 'email',
    inputPlaceholder: 'Enter your phone number or email',
  },
  {
    id: 'freefire',
    name: 'Free Fire Top Up & Passes',
    category: 'gaming',
    tagline: 'Direct Player ID Topup with Instant Automatic Confirmation',
    badge: '⚡ Instant',
    badgeColor: '#10B981',
    brandColor: '#F59E0B',
    icon: <Gamepad2 size={22} color="#D97706" />,
    packages: [
      { id: 'ff-week', label: 'Weekly Membership', priceNPR: 210, popular: true },
      { id: 'ff-month', label: 'Monthly Membership', priceNPR: 1015 },
      { id: 'ff-lvl', label: 'Level Up Pass', priceNPR: 575 },
    ],
    features: [
      'Direct Player UID recharge (Nepal & South Asia Server)',
      '100% ban-safe official Garena integration',
      'Instant delivery in under 3 minutes',
      'Daily diamond claiming benefits included',
    ],
    inputType: 'player_id',
    inputPlaceholder: 'Enter your Free Fire Player ID (UID)',
  },
  {
    id: 'pubg-mobile',
    name: 'PUBG Mobile UC Top Up',
    category: 'gaming',
    tagline: 'Official Unknown Cash for Royale Pass & Weapon Crates',
    badge: '⚡ Instant',
    badgeColor: '#10B981',
    brandColor: '#EA580C',
    icon: <Gamepad2 size={22} color="#EA580C" />,
    packages: [
      { id: 'pubg-60', label: '60 UC', priceNPR: 160 },
      { id: 'pubg-325', label: '325 UC', priceNPR: 840 },
      { id: 'pubg-660', label: '660 UC (Royale Pass)', priceNPR: 1675, popular: true },
    ],
    features: [
      'Direct in-game Character ID recharge',
      'Royale Pass ready in seconds',
      'No password or login credentials required',
      'Official authorized partner distribution',
    ],
    inputType: 'player_id',
    inputPlaceholder: 'Enter your PUBG Mobile Character ID',
  },
  {
    id: 'roblox',
    name: 'Roblox Robux & Plus',
    category: 'gaming',
    tagline: 'Robux Balance & Roblox Plus for Avatar Customization',
    brandColor: '#DC2626',
    icon: <Gamepad2 size={22} color="#DC2626" />,
    packages: [
      { id: 'rbx-80', label: '80 Robux', priceNPR: 225 },
      { id: 'rbx-400', label: '400 Robux', priceNPR: 980, popular: true },
      { id: 'rbx-800', label: '800 Robux', priceNPR: 1950 },
      { id: 'rbx-plus', label: 'Roblox Plus 1 Mo', priceNPR: 1210 },
    ],
    features: [
      'Buy limited accessories, avatar outfits & gamepasses',
      'Safe transfer via Group payout or code gift card',
      'Instant processing with Nepali payment gateways',
      'Dedicated gaming support team in Kathmandu',
    ],
    inputType: 'player_id',
    inputPlaceholder: 'Enter your Roblox Username',
  },
];

export const UGTopupsView: React.FC<{ onBackToRestrox?: () => void }> = ({ onBackToRestrox }) => {
  const { addToast } = useRestaurant();
  const [activeCategory, setActiveCategory] = useState<'all' | 'ai' | 'creative' | 'streaming' | 'gaming'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Package selection state: key is product ID, value is package ID
  const [selectedPackages, setSelectedPackages] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    UG_PRODUCTS.forEach((p) => {
      const pop = p.packages.find((pkg) => pkg.popular) || p.packages[0];
      init[p.id] = pop.id;
    });
    return init;
  });

  // Modal State
  const [activeOrderProduct, setActiveOrderProduct] = useState<UGProduct | null>(null);
  const [orderAccountInput, setOrderAccountInput] = useState('');
  const [orderPaymentMethod, setOrderPaymentMethod] = useState<'esewa' | 'khalti' | 'fonepay'>('esewa');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const filteredProducts = UG_PRODUCTS.filter((prod) => {
    const matchesCategory = activeCategory === 'all' || prod.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      prod.name.toLowerCase().includes(q) ||
      prod.tagline.toLowerCase().includes(q) ||
      prod.packages.some((pkg) => pkg.label.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const handleSelectPackage = (productId: string, packageId: string) => {
    setSelectedPackages((prev) => ({ ...prev, [productId]: packageId }));
  };

  const handleOpenOrder = (prod: UGProduct) => {
    setActiveOrderProduct(prod);
    setOrderAccountInput('');
    setOrderSuccess(false);
    setIsProcessing(false);
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderAccountInput.trim()) {
      addToast('Input Required', `Please enter your ${activeOrderProduct?.inputType === 'email' ? 'Account Email' : 'Player ID'} to proceed.`, 'error');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setOrderSuccess(true);
      const pkg = activeOrderProduct?.packages.find((p) => p.id === selectedPackages[activeOrderProduct.id]);
      addToast(
        'Top-Up Order Placed!',
        `${activeOrderProduct?.name} (${pkg?.label}) activated for Rs. ${pkg?.priceNPR.toLocaleString('en-IN')}. Receipt generated.`,
        'success'
      );
    }, 1200);
  };

  return (
    <div
      style={{
        padding: '24px 32px',
        backgroundColor: 'var(--color-background)',
        overflowY: 'auto',
        height: '100%',
        boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Header Banner matching UG Top Up Center Brand */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
          borderRadius: '16px',
          padding: '28px 32px',
          color: '#FFFFFF',
          marginBottom: '28px',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.25)',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid #334155',
        }}
      >
        {/* Glow Accent */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            backgroundColor: 'rgba(14, 165, 233, 0.18)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div
                style={{
                  backgroundColor: 'var(--r8-brand-primary)',
                  color: '#FFF',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.6px',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Zap size={12} />
                <span>UG Top Up Center Nepal</span>
              </div>
              <span
                style={{
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  color: '#CBD5E1',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <ShieldCheck size={13} color="#10B981" />
                <span>Official Live Rates • 100% Instant Delivery</span>
              </span>
            </div>

            <h1
              style={{
                fontSize: '1.85rem',
                fontWeight: 800,
                margin: '0 0 8px 0',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              Digital Subscriptions & Gaming Top Up Nepal
            </h1>
            <p
              style={{
                fontSize: '0.88rem',
                color: '#94A3B8',
                margin: 0,
                maxWidth: '650px',
                lineHeight: 1.5,
              }}
            >
              Copied directly from <strong style={{ color: '#F1F5F9' }}>ugtopups.com</strong>. Empower your restaurant team with AI tools (Claude, ChatGPT), stream licensed music (Spotify), design menus (Canva Pro), and reward staff with gaming passes.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <a
              href="https://ugtopups.com/"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 16px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.18)',
                color: '#F8FAFC',
                fontSize: '0.84rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'background-color 0.15s',
              }}
            >
              <span>Visit ugtopups.com</span>
              <ExternalLink size={14} />
            </a>

            {onBackToRestrox && (
              <button
                type="button"
                onClick={onBackToRestrox}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--r8-brand-primary)',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(14, 165, 233, 0.35)',
                }}
              >
                <span>RESTRO8 POS Plans</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Toolbar & Search Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Plans & Passes', count: UG_PRODUCTS.length },
            { id: 'ai', label: '🤖 AI Subscriptions', count: UG_PRODUCTS.filter((p) => p.category === 'ai').length },
            { id: 'creative', label: '🎨 Creative & Video', count: UG_PRODUCTS.filter((p) => p.category === 'creative').length },
            { id: 'streaming', label: '🎵 Music & Streaming', count: UG_PRODUCTS.filter((p) => p.category === 'streaming').length },
            { id: 'gaming', label: '🎮 Gaming Passes', count: UG_PRODUCTS.filter((p) => p.category === 'gaming').length },
          ].map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id as any)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '20px',
                  border: `1px solid ${isActive ? 'var(--r8-brand-primary)' : 'var(--color-border)'}`,
                  backgroundColor: isActive ? 'rgba(14, 165, 233, 0.08)' : 'var(--color-card)',
                  color: isActive ? 'var(--r8-brand-primary)' : 'var(--color-foreground)',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{cat.label}</span>
                <span
                  style={{
                    backgroundColor: isActive ? 'var(--r8-brand-primary)' : 'var(--color-muted)',
                    color: isActive ? '#FFF' : 'var(--color-muted-foreground)',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                  }}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            padding: '6px 12px',
            gap: '8px',
            width: '260px',
          }}
        >
          <Search size={15} color="var(--color-muted-foreground)" />
          <input
            type="text"
            placeholder="Search Claude, PUBG, Spotify..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              fontSize: '0.84rem',
              color: 'var(--color-foreground)',
              width: '100%',
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <X size={14} color="var(--color-muted-foreground)" />
            </button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '20px',
          alignItems: 'stretch',
        }}
      >
        {filteredProducts.map((prod) => {
          const selectedPkgId = selectedPackages[prod.id] || prod.packages[0].id;
          const currentPkg = prod.packages.find((p) => p.id === selectedPkgId) || prod.packages[0];

          return (
            <div
              key={prod.id}
              style={{
                backgroundColor: 'var(--color-card)',
                borderRadius: '14px',
                border: '1px solid var(--color-border)',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                position: 'relative',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(0,0,0,0.08)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              {/* Product Top Info */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--color-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      {prod.icon}
                    </div>
                    <div>
                      <h3
                        style={{
                          fontSize: '1.05rem',
                          fontWeight: 700,
                          color: 'var(--color-foreground)',
                          margin: 0,
                          lineHeight: 1.2,
                        }}
                      >
                        {prod.name}
                      </h3>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          color: 'var(--color-muted-foreground)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {prod.category.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {prod.badge && (
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '12px',
                        backgroundColor: prod.badgeColor ? `${prod.badgeColor}15` : '#EDE9FE',
                        color: prod.badgeColor || '#7C3AED',
                        border: `1px solid ${prod.badgeColor ? `${prod.badgeColor}30` : '#DDD6FE'}`,
                      }}
                    >
                      {prod.badge}
                    </span>
                  )}
                </div>

                <p
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--color-muted-foreground)',
                    margin: '0 0 16px 0',
                    lineHeight: 1.4,
                  }}
                >
                  {prod.tagline}
                </p>

                {/* Package Duration Selector Tabs */}
                <div style={{ marginBottom: '16px' }}>
                  <div
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: 'var(--color-muted-foreground)',
                      marginBottom: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px',
                    }}
                  >
                    Select Package
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {prod.packages.map((pkg) => {
                      const isSelected = pkg.id === selectedPkgId;
                      return (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => handleSelectPackage(prod.id, pkg.id)}
                          style={{
                            padding: '5px 10px',
                            borderRadius: '8px',
                            border: `1px solid ${isSelected ? 'var(--r8-brand-primary)' : 'var(--color-border)'}`,
                            backgroundColor: isSelected ? 'rgba(14, 165, 233, 0.08)' : 'var(--color-background)',
                            color: isSelected ? 'var(--r8-brand-primary)' : 'var(--color-foreground)',
                            fontSize: '0.78rem',
                            fontWeight: isSelected ? 700 : 500,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {pkg.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price Display */}
                <div
                  style={{
                    backgroundColor: 'var(--color-muted)',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-foreground)', fontFamily: 'Inter, sans-serif' }}>
                      Rs. {currentPkg.priceNPR.toLocaleString('en-IN')}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-muted-foreground)', marginLeft: '6px' }}>
                      NPR net
                    </span>
                  </div>

                  {currentPkg.savings && (
                    <span
                      style={{
                        backgroundColor: '#DCFCE7',
                        color: '#15803D',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                      }}
                    >
                      {currentPkg.savings}
                    </span>
                  )}
                </div>

                {/* Feature Bullet Points */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                  {prod.features.map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.80rem', color: 'var(--color-foreground)' }}>
                      <Check size={14} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ lineHeight: 1.35 }}>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order / Top Up Now Button */}
              <button
                type="button"
                onClick={() => handleOpenOrder(prod)}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'var(--r8-brand-primary)',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 6px rgba(14, 165, 233, 0.25)',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#C70812')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--r8-brand-primary)')}
              >
                <Zap size={15} />
                <span>Instant Top Up / Subscribe</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Order Modal */}
      {activeOrderProduct && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-card)',
              borderRadius: '16px',
              border: '1px solid var(--color-border)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              width: '100%',
              maxWidth: '520px',
              overflow: 'hidden',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '18px 24px',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(14, 165, 233, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Zap size={18} color="var(--r8-brand-primary)" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                    UG Topup Checkout
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-muted-foreground)' }}>
                    Official Nepal Gateway Partner
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveOrderProduct(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-muted-foreground)',
                  padding: '4px',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            {orderSuccess ? (
              <div style={{ padding: '32px 24px', textAlign: 'center' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#DCFCE7',
                    color: '#16A34A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px auto',
                  }}
                >
                  <Check size={32} />
                </div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--color-foreground)' }}>
                  Order Confirmed!
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-muted-foreground)', margin: '0 0 20px 0', lineHeight: 1.4 }}>
                  Your subscription order for <strong>{activeOrderProduct.name}</strong> has been transmitted to UG Top Up Center Nepal. You will receive an instant confirmation on your provided credentials.
                </p>

                <div
                  style={{
                    backgroundColor: 'var(--color-muted)',
                    borderRadius: '10px',
                    padding: '14px',
                    textAlign: 'left',
                    fontSize: '0.82rem',
                    marginBottom: '20px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--color-muted-foreground)' }}>Item:</span>
                    <strong style={{ color: 'var(--color-foreground)' }}>{activeOrderProduct.name}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--color-muted-foreground)' }}>Account:</span>
                    <strong style={{ color: 'var(--color-foreground)' }}>{orderAccountInput}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-muted-foreground)' }}>Payment Method:</span>
                    <strong style={{ color: 'var(--color-foreground)', textTransform: 'uppercase' }}>{orderPaymentMethod}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveOrderProduct(null)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'var(--r8-brand-primary)',
                    color: '#FFF',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleConfirmOrder} style={{ padding: '24px' }}>
                {/* Selected Item Summary */}
                {(() => {
                  const pkg = activeOrderProduct.packages.find((p) => p.id === selectedPackages[activeOrderProduct.id]) || activeOrderProduct.packages[0];
                  return (
                    <div
                      style={{
                        backgroundColor: 'var(--color-muted)',
                        borderRadius: '10px',
                        padding: '14px 16px',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-foreground)' }}>
                          {activeOrderProduct.name}
                        </div>
                        <div style={{ fontSize: '0.80rem', color: 'var(--color-muted-foreground)' }}>
                          {pkg.label}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--r8-brand-primary)', fontFamily: 'Inter, sans-serif' }}>
                          Rs. {pkg.priceNPR.toLocaleString('en-IN')}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--color-muted-foreground)' }}>
                          NPR incl. taxes
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Account / Player ID Input */}
                <div style={{ marginBottom: '18px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: 'var(--color-foreground)',
                      marginBottom: '6px',
                    }}
                  >
                    {activeOrderProduct.inputType === 'email' ? 'Subscription Email Address' : 'Player ID / In-Game UID'}
                    <span style={{ color: '#EF4444', marginLeft: '4px' }}>*</span>
                  </label>
                  <input
                    type={activeOrderProduct.inputType === 'email' ? 'email' : 'text'}
                    required
                    placeholder={activeOrderProduct.inputPlaceholder}
                    value={orderAccountInput}
                    onChange={(e) => setOrderAccountInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-background)',
                      color: 'var(--color-foreground)',
                      fontSize: '0.85rem',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-muted-foreground)', marginTop: '4px', display: 'block' }}>
                    {activeOrderProduct.inputType === 'email'
                      ? 'Credentials will be delivered or activated on this email ID.'
                      : 'Ensure Player ID is accurate to prevent topup failure.'}
                  </span>
                </div>

                {/* Payment Gateway Selector */}
                <div style={{ marginBottom: '24px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: 'var(--color-foreground)',
                      marginBottom: '8px',
                    }}
                  >
                    Select Nepal Payment Gateway
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {[
                      { id: 'esewa', label: 'eSewa', color: '#60BB46' },
                      { id: 'khalti', label: 'Khalti', color: '#5C2D91' },
                      { id: 'fonepay', label: 'Fonepay QR', color: '#E11D48' },
                    ].map((pg) => {
                      const isSel = orderPaymentMethod === pg.id;
                      return (
                        <button
                          key={pg.id}
                          type="button"
                          onClick={() => setOrderPaymentMethod(pg.id as any)}
                          style={{
                            padding: '10px 8px',
                            borderRadius: '8px',
                            border: `2px solid ${isSel ? pg.color : 'var(--color-border)'}`,
                            backgroundColor: isSel ? `${pg.color}10` : 'var(--color-background)',
                            color: isSel ? pg.color : 'var(--color-foreground)',
                            fontWeight: isSel ? 700 : 500,
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <QrCode size={18} />
                          <span>{pg.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  style={{
                    width: '100%',
                    padding: '11px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: isProcessing ? '#94A3B8' : 'var(--r8-brand-primary)',
                    color: '#FFFFFF',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
                  }}
                >
                  {isProcessing ? (
                    <span>Processing Payment...</span>
                  ) : (
                    <>
                      <Zap size={16} />
                      <span>Proceed to Pay & Activate</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
