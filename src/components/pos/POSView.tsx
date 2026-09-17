import React, { useState, useEffect, useRef } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { MenuItem, MenuCategory, DietaryTag, Order } from '../../types/restaurant';
import { PaymentModal } from '../modals/PaymentModal';
import { ReceiptModal } from '../modals/ReceiptModal';
import { POSProductGrid } from './POSProductGrid';
import { POSTicket } from './POSTicket';
import { POSCustomizerModal } from './POSCustomizerModal';
import { SearchInput, Badge } from '../ui';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { formatNPR } from '../../utils/nepalDate';

export const POSView: React.FC = () => {
  const {
    menuItems,
    tables,
    draftOrder,
    setDraftTable,
    setDraftOrderType,
    addItemToDraft,
    updateDraftItemQty,
    removeDraftItem,
    setDraftDiscountPercent,
    clearDraft,
    sendDraftToKitchen,
    settings,
  } = useRestaurant();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<DietaryTag | 'all'>('all');
  const [mobilePanel, setMobilePanel] = useState<'menu' | 'ticket'>('menu');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Customizer modal state
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);

  // Settlement directly from POS
  const [payingOrder, setPayingOrder] = useState<Order | null>(null);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape') {
        if (customizingItem) {
          setCustomizingItem(null);
        } else if (searchQuery) {
          setSearchQuery('');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [customizingItem, searchQuery]);

  const categories: { id: MenuCategory | 'all'; label: string; icon?: React.ReactNode }[] = [
    { id: 'all', label: 'All Items' },
    { id: 'momo', label: 'Momo Junction (मोमो)' },
    { id: 'thakali_newari', label: 'Thakali & Newari' },
    { id: 'appetizers', label: 'Sekuwa & Snacks' },
    { id: 'cafe_bakery', label: 'Himalayan Coffee' },
    { id: 'beverages_bar', label: 'Beer & Bar (BOT)' },
    { id: 'hookah', label: 'Lounge Hookah' },
  ];

  const dietaryTags: { id: DietaryTag | 'all'; label: string; icon?: React.ReactNode }[] = [
    { id: 'all', label: 'All Dietary' },
    { id: 'chef-pick', label: 'Chef Special' },
    { id: 'veg', label: 'Pure Veg' },
    { id: 'spicy', label: 'Spicy' },
  ];

  // Filtered menu
  const filteredMenuItems = menuItems.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (selectedTag !== 'all' && !item.tags.includes(selectedTag)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        (item.nepaliName && item.nepaliName.toLowerCase().includes(q)) ||
        item.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleItemCardClick = (item: MenuItem) => {
    if (!item.inStock || (item.stockQuantity !== undefined && item.stockQuantity <= 0)) return;

    if (item.options && item.options.length > 0) {
      setCustomizingItem(item);
    } else {
      addItemToDraft(item);
    }
  };

  const handleConfirmCustomization = (
    item: MenuItem,
    selectedOptions: Record<string, string>,
    notes: string
  ) => {
    addItemToDraft(item, selectedOptions, notes);
    setCustomizingItem(null);
  };

  const handleSendKOT = () => {
    if (draftOrder.items.length === 0 || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const order = sendDraftToKitchen();
      if (order) setMobilePanel('menu');
    } finally {
      // Small debounce to prevent fast double-tapping
      setTimeout(() => setIsSubmitting(false), 350);
    }
  };

  const handleInstantSettle = () => {
    if (draftOrder.items.length === 0 || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const createdOrder = sendDraftToKitchen();
      if (createdOrder) {
        setPayingOrder(createdOrder);
      }
    } finally {
      setTimeout(() => setIsSubmitting(false), 350);
    }
  };

  return (
    <div className="pos-shell" style={{ height: 'calc(100vh - var(--header-height))', overflow: 'hidden' }}>
      {/* Mobile POS Switcher (Menu vs Ticket) */}
      <div className="mobile-pos-switcher" role="group" aria-label="POS workspace view">
        <button
          type="button"
          className={mobilePanel === 'menu' ? 'is-active' : ''}
          aria-pressed={mobilePanel === 'menu'}
          onClick={() => setMobilePanel('menu')}
        >
          Menu
        </button>
        <button
          type="button"
          className={mobilePanel === 'ticket' ? 'is-active' : ''}
          aria-pressed={mobilePanel === 'ticket'}
          onClick={() => setMobilePanel('ticket')}
        >
          Ticket <span aria-live="polite">({draftOrder.items.length})</span>
        </button>
      </div>

      {/* POS Workspace Grid */}
      <div
        className="pos-workspace"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 410px',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Left Column: Menu Catalog Browser */}
        <div
          className={`pos-catalog ${mobilePanel === 'menu' ? 'is-active' : ''}`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden',
            backgroundColor: 'var(--r8-bg-base)',
          }}
        >
          {/* Top Search & Filter Bar */}
          <div
            className="pos-catalog-toolbar"
            style={{
              padding: 'var(--r8-space-3) var(--r8-space-4)',
              backgroundColor: 'var(--r8-bg-surface)',
              borderBottom: '1px solid var(--r8-border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--r8-space-2)',
            }}
          >
            <div className="pos-catalog-heading"><div><h1>Something for every craving.</h1><p>Select a dish to start your next great service.</p></div><Badge variant="primary">{menuItems.length} dishes</Badge></div>
            {/* Search Input & Dietary Filters */}
            <div
              className="pos-search-row"
              style={{
                display: 'flex',
                gap: 'var(--r8-space-3)',
                alignItems: 'center',
              }}
            >
              <div style={{ flex: 1 }}>
                <SearchInput
                  ref={searchInputRef}
                  aria-label="Search menu"
                  hotkey="F2"
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Find a dish or drink…"
                />
              </div>

              {/* Dietary Tags */}
              <div
                className="pos-dietary-filters"
                style={{
                  display: 'flex',
                  gap: 'var(--r8-space-1)',
                  flexWrap: 'nowrap',
                  overflowX: 'auto',
                }}
              >
                {dietaryTags.map((tag) => {
                  const isSelected = selectedTag === tag.id;
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => setSelectedTag(tag.id)}
                      aria-pressed={isSelected}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 'var(--r8-radius-sm)',
                        fontSize: '0.76rem',
                        fontWeight: isSelected ? 700 : 500,
                        backgroundColor: isSelected
                          ? 'rgba(14, 165, 233, 0.12)'
                          : 'var(--r8-bg-surface-elevated)',
                        color: isSelected
                          ? 'var(--r8-brand-primary)'
                          : 'var(--r8-text-secondary)',
                        border: isSelected
                          ? '1px solid var(--r8-brand-primary)'
                          : '1px solid var(--r8-border-subtle)',
                        whiteSpace: 'nowrap',
                        cursor: 'pointer',
                        transition: 'all var(--r8-transition-fast)',
                      }}
                    >
                      {tag.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category Tab Row */}
            <div
              className="pos-category-filters"
              style={{
                display: 'flex',
                gap: 'var(--r8-space-2)',
                overflowX: 'auto',
                paddingBottom: '2px',
                scrollbarWidth: 'none',
              }}
            >
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    aria-pressed={isSelected}
                    style={{
                      padding: '7px 12px',
                      borderRadius: 'var(--r8-radius-md)',
                      fontSize: '0.82rem',
                      fontWeight: isSelected ? 800 : 600,
                      backgroundColor: isSelected
                        ? 'var(--r8-brand-primary)'
                        : 'var(--r8-bg-surface-elevated)',
                      color: isSelected ? '#FFFFFF' : 'var(--r8-text-primary)',
                      border: isSelected ? '1px solid transparent' : '1px solid var(--r8-border-subtle)',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      transition: 'all var(--r8-transition-fast)',
                      boxShadow: isSelected ? 'var(--r8-shadow-sm)' : 'none',
                    }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Menu Items Grid Scroll Container */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 'var(--r8-space-4)',
              boxSizing: 'border-box',
            }}
          >
            <POSProductGrid
              items={filteredMenuItems}
              onItemClick={handleItemCardClick}
              searchQuery={searchQuery}
            />
          </div>
        </div>

        {/* Right Column: Live Order Ticket Builder */}
        <div
          className={`pos-ticket ${mobilePanel === 'ticket' ? 'is-active' : ''}`}
          style={{
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <POSTicket
            draftOrder={draftOrder}
            tables={tables}
            settings={settings}
            onTableChange={setDraftTable}
            onOrderTypeChange={setDraftOrderType}
            onUpdateQty={updateDraftItemQty}
            onRemoveItem={removeDraftItem}
            onClearDraft={clearDraft}
            onDiscountChange={setDraftDiscountPercent}
            onSendKOT={handleSendKOT}
            onSettleBill={handleInstantSettle}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>

      {mobilePanel === 'menu' && draftOrder.items.length > 0 && <button className="mobile-ticket-cta" onClick={() => setMobilePanel('ticket')}><span><ShoppingBag size={17} /> View ticket · {draftOrder.items.reduce((n, item) => n + item.quantity, 0)} items</span><span>{formatNPR(draftOrder.items.reduce((n, item) => n + item.price * item.quantity, 0))} <ArrowRight size={17} /></span></button>}

      {/* Dish Customizer Modal */}
      {customizingItem && (
        <POSCustomizerModal
          item={customizingItem}
          onClose={() => setCustomizingItem(null)}
          onConfirm={handleConfirmCustomization}
        />
      )}

      {/* Payment Modal */}
      {payingOrder && (
        <PaymentModal
          order={payingOrder}
          onClose={() => setPayingOrder(null)}
          onReceiptView={(settled) => {
            setPayingOrder(null);
            setReceiptOrder(settled);
          }}
        />
      )}

      {/* Receipt Modal */}
      {receiptOrder && (
        <ReceiptModal order={receiptOrder} onClose={() => setReceiptOrder(null)} />
      )}
    </div>
  );
};
