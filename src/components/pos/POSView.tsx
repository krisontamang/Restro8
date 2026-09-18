import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import type { MenuItem, Order } from '../../types/restaurant';
import { PaymentModal } from '../modals/PaymentModal';
import { ReceiptModal } from '../modals/ReceiptModal';
import { POSTicket } from './POSTicket';
import { POSMenuPanel } from './POSMenuPanel';
import { POSCustomizerModal } from './POSCustomizerModal';
import { draftTotals } from '../../utils/draftOrder';
import { formatNPR } from '../../utils/nepalDate';
import './pos.css';

export function POSView() {
  const {
    menuItems, tables, draftOrder, setDraftTable, setDraftOrderType, addItemToDraft,
    updateDraftItemQty, removeDraftItem, setDraftDiscountPercent, clearDraft,
    sendDraftToKitchen, settings,
  } = useRestaurant();
  const [mobilePanel, setMobilePanel] = useState<'menu' | 'ticket'>('menu');
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [payingOrder, setPayingOrder] = useState<Order | null>(null);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submissionLock = useRef(false);
  const submissionTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(submissionTimer.current), []);
  const showMenu = useCallback(() => setMobilePanel('menu'), []);
  const { quantity, total } = draftTotals(draftOrder, settings);

  const addItem = (item: MenuItem) => {
    if (!item.inStock || item.stockQuantity <= 0) return;
    if (item.options?.length) setCustomizingItem(item);
    else addItemToDraft(item);
  };

  const submitDraft = (settle: boolean) => {
    if (!draftOrder.items.length || submissionLock.current) return;
    submissionLock.current = true;
    setIsSubmitting(true);
    try {
      const order = sendDraftToKitchen();
      if (order) {
        setMobilePanel('menu');
        if (settle) setPayingOrder(order);
      }
    } finally {
      submissionTimer.current = setTimeout(() => {
        submissionLock.current = false;
        setIsSubmitting(false);
      }, 350);
    }
  };

  return <div className="pos-shell">
    <p className="sr-only" role="status" aria-atomic="true">Current ticket: {quantity} {quantity === 1 ? 'item' : 'items'}, total {formatNPR(total)}.</p>
    <div className="mobile-pos-switcher" role="group" aria-label="POS workspace view">
      <button type="button" className={mobilePanel === 'menu' ? 'is-active' : ''} aria-pressed={mobilePanel === 'menu'} onClick={showMenu}>Menu selection</button>
      <button type="button" className={mobilePanel === 'ticket' ? 'is-active' : ''} aria-pressed={mobilePanel === 'ticket'} onClick={() => setMobilePanel('ticket')}>Current ticket ({quantity})</button>
    </div>
    <div className="pos-workspace">
      <POSMenuPanel items={menuItems} active={mobilePanel === 'menu'} onShowMenu={showMenu} onItemClick={addItem} />
      <section className={`pos-ticket ${mobilePanel === 'ticket' ? 'is-active' : ''}`} aria-labelledby="pos-ticket-heading">
        <POSTicket draftOrder={draftOrder} tables={tables} settings={settings}
          onTableChange={setDraftTable} onOrderTypeChange={setDraftOrderType}
          onUpdateQty={updateDraftItemQty} onRemoveItem={removeDraftItem}
          onClearDraft={clearDraft} onDiscountChange={setDraftDiscountPercent}
          onSendKOT={() => submitDraft(false)} onSettleBill={() => submitDraft(true)} isSubmitting={isSubmitting} />
      </section>
    </div>
    {mobilePanel === 'menu' && quantity > 0 && <button type="button" className="mobile-ticket-cta" onClick={() => setMobilePanel('ticket')}>
      <span><ShoppingBag size={17} aria-hidden="true" /> Review ticket · {quantity} {quantity === 1 ? 'item' : 'items'}</span>
      <span>{formatNPR(total)} <ArrowRight size={17} aria-hidden="true" /></span>
    </button>}
    {customizingItem && <POSCustomizerModal item={customizingItem} onClose={() => setCustomizingItem(null)} onConfirm={(item, options, notes) => {
      addItemToDraft(item, options, notes);
      setCustomizingItem(null);
    }} />}
    {payingOrder && <PaymentModal order={payingOrder} onClose={() => setPayingOrder(null)} onReceiptView={order => {
      setPayingOrder(null);
      setReceiptOrder(order);
    }} />}
    {receiptOrder && <ReceiptModal order={receiptOrder} onClose={() => setReceiptOrder(null)} />}
  </div>;
}
