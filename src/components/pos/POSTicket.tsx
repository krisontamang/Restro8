import React from 'react';
import { Order, Table, RestaurantSettings } from '../../types/restaurant';
import { Button, PriceDisplay, Badge, QuantityControl, EmptyState, Select } from '../ui';
import { ShoppingBag, Trash2, Send, CreditCard, UtensilsCrossed, AlertCircle } from 'lucide-react';

interface POSTicketProps {
  draftOrder: {
    tableId?: string | null;
    orderType: Order['orderType'];
    items: Order['items'];
    discountPercent: number;
    tipAmount: number;
    customerInfo?: { name: string; phone: string };
  };
  tables: Table[];
  settings: RestaurantSettings;
  onTableChange: (tableId: string | null) => void;
  onOrderTypeChange: (type: Order['orderType']) => void;
  onUpdateQty: (index: number, delta: number) => void;
  onRemoveItem: (index: number) => void;
  onClearDraft: () => void;
  onDiscountChange: (percent: number) => void;
  onSendKOT: () => void;
  onSettleBill: () => void;
  isSubmitting?: boolean;
}

export const POSTicket: React.FC<POSTicketProps> = ({
  draftOrder,
  tables,
  settings,
  onTableChange,
  onOrderTypeChange,
  onUpdateQty,
  onRemoveItem,
  onClearDraft,
  onDiscountChange,
  onSendKOT,
  onSettleBill,
  isSubmitting = false,
}) => {
  // Calculations
  const subtotal = draftOrder.items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const discountAmount = +(subtotal * (draftOrder.discountPercent / 100)).toFixed(2);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const isVat = settings.taxMode === 'vat_registered';
  const tax = isVat ? +(taxableAmount * 0.13).toFixed(2) : 0;
  const grandTotal = +(taxableAmount + tax + draftOrder.tipAmount).toFixed(2);

  const discountOptions = [0, 5, 10, 15, 20];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--r8-bg-surface)',
        borderLeft: '1px solid var(--r8-border-subtle)',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Ticket Header & Destination Selectors */}
      <div
        style={{
          padding: 'var(--r8-space-3) var(--r8-space-4)',
          borderBottom: '1px solid var(--r8-border-subtle)',
          backgroundColor: 'var(--r8-bg-surface-elevated)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--r8-space-3)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--r8-space-2)' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--r8-radius-md)',
                backgroundColor: 'rgba(14, 165, 233, 0.12)',
                color: 'var(--r8-brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShoppingBag size={18} />
            </div>
            <div>
              <h2
                style={{
                  fontSize: '0.96rem',
                  fontWeight: 800,
                  margin: 0,
                  color: 'var(--r8-text-primary)',
                  letterSpacing: '-0.01em',
                }}
              >
                KOT / BOT Ticket
              </h2>
              <span style={{ fontSize: '0.74rem', color: 'var(--r8-text-muted)' }}>
                {draftOrder.items.length} {draftOrder.items.length === 1 ? 'item' : 'items'} in order
              </span>
            </div>
          </div>

          {draftOrder.items.length > 0 && (
            <button
              type="button"
              onClick={onClearDraft}
              disabled={isSubmitting}
              style={{
                fontSize: '0.74rem',
                color: 'var(--r8-brand-coral)',
                background: 'none',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                borderRadius: 'var(--r8-radius-sm)',
              }}
              title="Clear all ticket items"
            >
              <Trash2 size={13} />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Order Type & Table Controls */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.2fr',
            gap: 'var(--r8-space-2)',
          }}
        >
          <div>
            <select
              aria-label="Order Type"
              value={draftOrder.orderType}
              onChange={(e) => onOrderTypeChange(e.target.value as Order['orderType'])}
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '7px 10px',
                borderRadius: 'var(--r8-radius-md)',
                border: '1px solid var(--r8-border-subtle)',
                backgroundColor: 'var(--r8-bg-surface)',
                color: 'var(--r8-text-primary)',
                fontSize: '0.82rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="dine-in">Dine-In (डाइन-इन)</option>
              <option value="takeaway">Takeaway (प्याक)</option>
              <option value="delivery">Delivery (डेलिभरी)</option>
              <option value="bar">Bar Counter (बार)</option>
            </select>
          </div>

          <div>
            <select
              aria-label="Select Table"
              value={draftOrder.tableId || ''}
              onChange={(e) => onTableChange(e.target.value || null)}
              disabled={isSubmitting || draftOrder.orderType === 'takeaway' || draftOrder.orderType === 'delivery'}
              style={{
                width: '100%',
                padding: '7px 10px',
                borderRadius: 'var(--r8-radius-md)',
                border: '1px solid var(--r8-border-subtle)',
                backgroundColor:
                  draftOrder.orderType === 'takeaway' || draftOrder.orderType === 'delivery'
                    ? 'var(--r8-bg-subtle)'
                    : 'var(--r8-bg-surface)',
                color: 'var(--r8-text-primary)',
                fontSize: '0.82rem',
                fontWeight: 600,
                outline: 'none',
                cursor:
                  draftOrder.orderType === 'takeaway' || draftOrder.orderType === 'delivery'
                    ? 'not-allowed'
                    : 'pointer',
              }}
            >
              <option value="">{draftOrder.orderType === 'dine-in' ? 'Select Table...' : 'Walk-in / Counter'}</option>
              {tables.map((tbl) => (
                <option key={tbl.id} value={tbl.id}>
                  {tbl.label} &bull; {tbl.zone || 'Floor'} ({tbl.status.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Ticket Items Scroll Area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 'var(--r8-space-3) var(--r8-space-4)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--r8-space-2)',
        }}
      >
        {draftOrder.items.length === 0 ? (
          <div style={{ margin: 'auto 0' }}>
            <EmptyState
              icon={<UtensilsCrossed size={36} />}
              title="Ticket is empty"
              description="Select dishes from the catalog to build this KOT / BOT ticket."
            />
          </div>
        ) : (
          draftOrder.items.map((it, idx) => (
            <div
              key={`${it.id}-${idx}`}
              style={{
                padding: 'var(--r8-space-3)',
                borderRadius: 'var(--r8-radius-md)',
                backgroundColor: 'var(--r8-bg-surface-elevated)',
                border: '1px solid var(--r8-border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--r8-space-2)',
                boxShadow: 'var(--r8-shadow-sm)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 'var(--r8-space-2)',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Badge variant={it.ticketType === 'KOT' ? 'primary' : 'warning'} size="sm">
                      {it.ticketType}
                    </Badge>
                    <strong
                      style={{
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        color: 'var(--r8-text-primary)',
                      }}
                    >
                      {it.name}
                    </strong>
                  </div>

                  {/* Selected Options */}
                  {it.selectedOptions && Object.keys(it.selectedOptions).length > 0 && (
                    <div
                      style={{
                        fontSize: '0.74rem',
                        color: 'var(--r8-text-muted)',
                        marginTop: '2px',
                      }}
                    >
                      {Object.entries(it.selectedOptions)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(' • ')}
                    </div>
                  )}

                  {/* Kitchen Special Note */}
                  {it.notes && (
                    <div
                      style={{
                        fontSize: '0.74rem',
                        color: 'var(--r8-brand-accent)',
                        fontStyle: 'italic',
                        marginTop: '2px',
                      }}
                    >
                      Note: {it.notes}
                    </div>
                  )}
                </div>

                <PriceDisplay amount={it.price * it.quantity} size="sm" />
              </div>

              {/* Quantity Controls & Unit Price */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '4px',
                  borderTop: '1px solid var(--r8-border-subtle)',
                }}
              >
                <span style={{ fontSize: '0.74rem', color: 'var(--r8-text-muted)' }}>
                  <PriceDisplay amount={it.price} size="sm" /> each
                </span>

                <QuantityControl
                  quantity={it.quantity}
                  onIncrease={() => onUpdateQty(idx, 1)}
                  onDecrease={() => onUpdateQty(idx, -1)}
                  onRemove={() => onRemoveItem(idx)}
                  size="sm"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Ticket Footer & Settlement Calculation */}
      <div
        style={{
          padding: 'var(--r8-space-3) var(--r8-space-4)',
          borderTop: '1px solid var(--r8-border-subtle)',
          backgroundColor: 'var(--r8-bg-surface-elevated)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--r8-space-2)',
        }}
      >
        {/* Discount Selector */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--r8-text-secondary)' }}>
            Discount:
          </span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {discountOptions.map((pct) => (
              <button
                type="button"
                key={pct}
                onClick={() => onDiscountChange(pct)}
                disabled={isSubmitting}
                style={{
                  padding: '2px 8px',
                  borderRadius: 'var(--r8-radius-sm)',
                  fontSize: '0.72rem',
                  fontWeight: draftOrder.discountPercent === pct ? 800 : 500,
                  backgroundColor:
                    draftOrder.discountPercent === pct
                      ? 'var(--r8-brand-primary)'
                      : 'var(--r8-bg-subtle)',
                  color:
                    draftOrder.discountPercent === pct
                      ? '#FFFFFF'
                      : 'var(--r8-text-secondary)',
                  border: '1px solid var(--r8-border-subtle)',
                  cursor: 'pointer',
                  transition: 'all var(--r8-transition-fast)',
                }}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div
          style={{
            borderTop: '1px dashed var(--r8-border-subtle)',
            paddingTop: 'var(--r8-space-2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.78rem',
              color: 'var(--r8-text-muted)',
            }}
          >
            <span>Taxable Subtotal:</span>
            <PriceDisplay amount={taxableAmount} size="sm" />
          </div>

          {draftOrder.discountPercent > 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.78rem',
                color: 'var(--r8-brand-coral)',
              }}
            >
              <span>Discount ({draftOrder.discountPercent}%):</span>
              <span>-{discountAmount.toFixed(2)}</span>
            </div>
          )}

          {isVat && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.78rem',
                color: 'var(--r8-brand-primary)',
              }}
            >
              <span>13% IRD VAT:</span>
              <span>+ {tax.toFixed(2)}</span>
            </div>
          )}

          {/* Grand Total */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginTop: '4px',
              paddingTop: '4px',
              borderTop: '1px solid var(--r8-border-subtle)',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.96rem',
                  fontWeight: 800,
                  color: 'var(--r8-text-primary)',
                }}
              >
                Grand Total:
              </span>
              <div style={{ fontSize: '0.68rem', color: 'var(--r8-text-muted)' }}>
                *0% Mandatory Service Charge
              </div>
            </div>
            <div className="r8-tabular-num">
              <PriceDisplay amount={grandTotal} size="lg" />
            </div>
          </div>
        </div>

        {/* Dual Actions with In-Flight Duplicate Protection */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.3fr 1fr',
            gap: 'var(--r8-space-2)',
            marginTop: '4px',
          }}
        >
          <Button
            variant="primary"
            onClick={onSendKOT}
            disabled={draftOrder.items.length === 0 || isSubmitting}
            isLoading={isSubmitting}
            style={{
              fontSize: '0.86rem',
              fontWeight: 700,
              padding: '10px',
            }}
          >
            <Send size={15} style={{ marginRight: '6px' }} />
            <span>Send KOT</span>
          </Button>

          <Button
            variant="accent"
            onClick={onSettleBill}
            disabled={draftOrder.items.length === 0 || isSubmitting}
            style={{
              fontSize: '0.86rem',
              fontWeight: 700,
              padding: '10px',
            }}
          >
            <CreditCard size={15} style={{ marginRight: '6px' }} />
            <span>Settle</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
