import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Check, Minus, Plus, Search, ShoppingBag, UtensilsCrossed, X } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import type { MenuCategory, MenuItem } from '../../types/restaurant';
import { formatNPR } from '../../utils/nepalDate';
import { BrandLogo } from '../brand/BrandLogo';
import { FoodImage } from './FoodImage';

const categories: Array<{ id: 'all' | MenuCategory; label: string }> = [
  { id: 'all', label: 'All dishes' },
  { id: 'momo', label: 'Momo' },
  { id: 'thakali_newari', label: 'Thakali & Newari' },
  { id: 'appetizers', label: 'Small plates' },
  { id: 'mains', label: 'Mains' },
  { id: 'cafe_bakery', label: 'Cafe & bakery' },
  { id: 'beverages_bar', label: 'Drinks' },
  { id: 'desserts', label: 'Desserts' },
  { id: 'hookah', label: 'Hookah' },
];

function resolveTable(tableId: string | null, tables: ReturnType<typeof useRestaurant>['tables']) {
  if (!tableId) return undefined;
  const exact = tables.find((entry) => entry.id === tableId);
  if (exact) return exact;
  const readableId = tableId.replace(/^t-/, '').replace(/-/g, ' ').trim().toLowerCase();
  return tables.find((entry) => entry.label.trim().toLowerCase() === readableId);
}

export const PublicMenuView: React.FC = () => {
  const { settings, tables, menuItems, sendGuestOrder } = useRestaurant();
  const tableId = new URLSearchParams(window.location.search).get('table');
  const table = resolveTable(tableId, tables);
  const [category, setCategory] = useState<'all' | MenuCategory>('all');
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const sheet = useRef<HTMLElement>(null);
  const [error, setError] = useState('');
  const [requestOrderNumber, setRequestOrderNumber] = useState<number | null>(null);

  useEffect(() => {
    if (!cartOpen) return undefined;
    const previousFocus = document.activeElement as HTMLElement | null;
    const focusable = () => [...(sheet.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input, a[href]') || [])].filter(node => node.getClientRects().length);
    const frame = requestAnimationFrame(() => focusable()[0]?.focus());
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); setCartOpen(false); }
      if (event.key === 'Tab') {
        const nodes = focusable();
        if (event.shiftKey && document.activeElement === nodes[0]) { event.preventDefault(); nodes.at(-1)?.focus(); }
        else if (!event.shiftKey && document.activeElement === nodes.at(-1)) { event.preventDefault(); nodes[0]?.focus(); }
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      previousFocus?.focus();
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [cartOpen]);

  const visibleItems = useMemo(() => menuItems.filter((item) => {
    if (!item.inStock || item.stockQuantity <= 0) return false;
    if (category !== 'all' && item.category !== category) return false;
    const haystack = `${item.name} ${item.nepaliName || ''} ${item.description}`.toLowerCase();
    return haystack.includes(query.toLowerCase().trim());
  }), [category, menuItems, query]);

  const cartItems = menuItems.filter((item) => cart[item.id]);
  const cartCount = cartItems.reduce((sum, item) => sum + (cart[item.id] || 0), 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * (cart[item.id] || 0), 0);

  const estimatedTax = settings.taxMode === 'vat_registered' ? +(cartTotal * settings.vatRate).toFixed(2) : 0;
  const changeQuantity = (item: MenuItem, delta: number) => {
    setRequestOrderNumber(null); setError('');
    setCart((current) => {
      const nextQuantity = Math.min(item.stockQuantity, Math.max(0, (current[item.id] || 0) + delta));
      const next = { ...current };
      if (nextQuantity) next[item.id] = nextQuantity;
      else delete next[item.id];
      return next;
    });
  };

  return (
    <div className="public-menu">
      <header className="public-menu-header">
        <BrandLogo />
        <div className="public-menu-restaurant"><strong>{settings.name}</strong><span>{table ? `${table.label} · ${table.seats} seats` : tableId ? 'Table link needs refresh' : 'Guest menu'}</span></div>
        <button type="button" className="public-cart-button" onClick={() => setCartOpen(true)} aria-label={`Open order basket with ${cartCount} items`}><ShoppingBag size={18} aria-hidden="true" /><span>{cartCount || 'Basket'}</span></button>
      </header>

      <main className="public-menu-main">
        <section className="public-menu-hero">
          <p className="eyebrow">{table ? `Dining at ${table.label}` : tableId ? 'Invalid table link' : 'Welcome to the table'}</p>
          <h1>Good food.<br /><em>Zero guesswork.</em></h1>
          <p>{settings.tagline}. Browse the menu and choose your favourites.</p><p className="public-local-notice">Preview workspace · Requests stay in this browser. Ask your server to place a live order.</p>
        </section>

        <label className="public-menu-search"><Search size={18} aria-hidden="true" /><span className="sr-only">Search menu</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search dishes, drinks, or ingredients" /></label>

        <nav className="public-menu-categories" aria-label="Menu categories">
          {categories.map((entry) => <button key={entry.id} type="button" aria-pressed={category === entry.id} className={category === entry.id ? 'active' : ''} onClick={() => setCategory(entry.id)}>{entry.label}</button>)}
        </nav>

        <section className="public-menu-grid" aria-label="Available dishes">
          {visibleItems.map((item) => (
            <article className="public-menu-card" key={item.id}>
              <div className="public-menu-image"><FoodImage item={item} className="public-food-image" />{item.tags.includes('chef-pick') && <span className="public-pick">Chef pick</span>}</div>
              <div className="public-menu-card-body"><div><p className="public-category">{categories.find((entry) => entry.id === item.category)?.label || item.category}</p><h2>{item.name}</h2>{item.nepaliName && <p className="public-nepali">{item.nepaliName}</p>}</div><p className="public-description">{item.description}</p><div className="public-menu-card-footer"><strong>{formatNPR(item.price)}</strong><button type="button" className="public-add-button" onClick={() => changeQuantity(item, 1)} aria-label={`Add ${item.name} to basket`}><Plus size={18} aria-hidden="true" /></button></div></div>
            </article>
          ))}
        </section>

        {!visibleItems.length && <div className="public-menu-empty"><UtensilsCrossed size={30} aria-hidden="true" /><h2>No dishes found</h2><p>Try a different search or category.</p></div>}
      </main>

      <footer className="public-menu-footer"><span>Freshly prepared at {settings.name}</span><span>Powered by <strong>restro8</strong></span></footer>

      {cartOpen && <div className="public-cart-overlay" role="presentation" onClick={() => setCartOpen(false)}><aside ref={sheet} className="public-cart-sheet" role="dialog" aria-modal="true" aria-labelledby="basket-title" onClick={(event) => event.stopPropagation()}><div className="public-cart-heading"><div><p className="eyebrow">Your selection</p><h2 id="basket-title">Basket <span>{cartCount}</span></h2></div><button type="button" className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close basket"><X size={18} aria-hidden="true" /></button></div>{cartItems.length ? <><div className="public-cart-lines">{cartItems.map((item) => <div className="public-cart-line" key={item.id}><div><strong>{item.name}</strong><small>{formatNPR(item.price)} each</small></div><div className="public-quantity"><button type="button" onClick={() => changeQuantity(item, -1)} aria-label={`Remove one ${item.name}`}><Minus size={14} aria-hidden="true" /></button><span>{cart[item.id]}</span><button type="button" onClick={() => changeQuantity(item, 1)} aria-label={`Add one ${item.name}`}><Plus size={14} aria-hidden="true" /></button></div></div>)}</div><div className="public-cart-total"><span>Estimated total</span><strong>{formatNPR(cartTotal + estimatedTax)}</strong></div>{estimatedTax > 0 && <p className="public-tax-note">Includes estimated VAT: {formatNPR(estimatedTax)}</p>}<p className="public-tax-note">Local preview only. This request will not reach another device.</p>{error && <p role="alert" className="work-notice">{error}</p>}<button type="button" className="public-request-button" disabled={Boolean(tableId && !table)} onClick={() => {
        setError('');
        const order = sendGuestOrder(table?.id || tableId || undefined, Object.entries(cart).map(([itemId, quantity]) => ({ itemId, quantity })));
        if (order) { setRequestOrderNumber(order.orderNumber); setCart({}); }
        else setError('Could not create this request. Check dish availability and your table link.');
      }}>Create local request <ArrowRight size={17} aria-hidden="true" /></button></> : <div className="public-cart-empty"><ShoppingBag size={28} aria-hidden="true" /><p>{requestOrderNumber ? `KOT #${requestOrderNumber} created in this browser workspace.` : 'Your basket is ready when you are.'}</p>{requestOrderNumber && <div className="public-request-sent" role="status"><Check size={18} aria-hidden="true" />Basket cleared. You can add another selection.</div>}</div>}</aside></div>}
    </div>
  );
};
