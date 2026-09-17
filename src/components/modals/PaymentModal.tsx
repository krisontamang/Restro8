import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Order, PaymentMethod, SplitPaymentDetails } from '../../types/restaurant';
import { Button, PriceDisplay, Badge, Modal } from '../ui';
import {
  CreditCard,
  Banknote,
  QrCode,
  Receipt,
  X,
  CheckCircle2,
  Smartphone,
  ShieldCheck,
  Building2,
  Split,
} from 'lucide-react';
import { splitTenderError } from '../../utils/settlement';

interface PaymentModalProps {
  order: Order;
  onClose: () => void;
  onReceiptView: (order: Order) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  order,
  onClose,
  onReceiptView,
}) => {
  const { settleBill, settings } = useRestaurant();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('fonepay');
  const [tipAmount, setTipAmount] = useState<number>(order.tip || 0);
  const [discountPercent, setDiscountPercent] = useState<number>(order.subtotal > 0 ? order.discount / order.subtotal * 100 : 0);
  const [cashTendered, setCashTendered] = useState<string>('');
  const [isSettling, setIsSettling] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState('');

  // B2B Corporate Tax Invoice Info
  const [customerPan, setCustomerPan] = useState<string>(order.customerPan || '');
  const [customerName, setCustomerName] = useState<string>(order.customerName || '');

  const [splitCashAmount, setSplitCashAmount] = useState<string>('');
  const [splitDigitalMethod, setSplitDigitalMethod] = useState<PaymentMethod>('fonepay');

  // Nepal IRD Calculations
  const subtotal = order.subtotal;
  const discountAmount = +(subtotal * (discountPercent / 100)).toFixed(2);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const isVat = settings.taxMode === 'vat_registered';
  const taxAmount = isVat ? +(taxableAmount * settings.vatRate).toFixed(2) : 0;
  const finalTotal = +(taxableAmount + taxAmount + tipAmount).toFixed(2);

  const tenderedNumber = parseFloat(cashTendered) || 0;
  const changeDue = Math.max(0, tenderedNumber - finalTotal);

  const splitCashNumber = parseFloat(splitCashAmount) || 0;
  const splitDigitalNumber = Math.max(0, +(finalTotal - splitCashNumber).toFixed(2));

  const handleSettle = () => {
    // In-flight duplicate payment protection
    if (isSettling) return;
    setPaymentError('');

    const splitDetails: SplitPaymentDetails | undefined =
      paymentMethod === 'split'
        ? {
            changeReturned: Math.max(0, +(splitCashNumber - finalTotal).toFixed(2)),
            tenders: [
              { method: 'cash', amount: splitCashNumber },
              { method: splitDigitalMethod, amount: splitDigitalNumber },
            ],
          }
        : undefined;

    if (paymentMethod === 'cash' && tenderedNumber < finalTotal) { setPaymentError('Cash received is less than the bill total.'); return; }
    if (paymentMethod === 'split') { const error = splitTenderError(splitDetails, finalTotal); if (error) { setPaymentError(error); return; } }
    setIsSettling(true);
    try {
      const settled = settleBill(order.id, paymentMethod, tipAmount, discountAmount, customerPan, customerName, splitDetails);
      if (!settled) { setPaymentError('Payment was not recorded. Review the amounts and order status.'); return; }

      const settledOrder: Order = {
        ...order,
        status: 'completed',
        paymentStatus: 'paid',
        paymentMethod,
        splitDetails,
        customerPan: customerPan || undefined,
        customerName: customerName || order.customerName,
        discount: discountAmount,
        taxableAmount,
        tax: taxAmount,
        tip: tipAmount,
        total: finalTotal,
      };

      onReceiptView(settledOrder);
    } finally {
      setTimeout(() => setIsSettling(false), 500);
    }
  };

  const addCashDenomination = (amount: number) => {
    const current = parseFloat(cashTendered) || 0;
    setCashTendered(String(current + amount));
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Checkout & Settle Bill"
      size="md"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--r8-space-4)' }}>
        {/* Invoice Meta Banner */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 'var(--r8-space-2) var(--r8-space-3)',
            borderRadius: 'var(--r8-radius-md)',
            backgroundColor: 'var(--r8-bg-surface-elevated)',
            border: '1px solid var(--r8-border-subtle)',
          }}
        >
          <div>
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--r8-text-primary)' }}>
              KOT #{order.orderNumber} &bull; {order.tableNumber ? `Table ${order.tableNumber}` : 'Takeaway'}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--r8-text-muted)' }}>
              Server: {order.serverName}
            </div>
          </div>
          <Badge variant={isVat ? 'primary' : 'success'} size="sm">
            {isVat ? `${settings.vatRate * 100}% VAT Tax Invoice` : 'PAN Bill (Non-VAT)'}
          </Badge>
        </div>

        {/* Bill Breakdown Card */}
        <div
          style={{
            backgroundColor: 'var(--r8-bg-surface-elevated)',
            borderRadius: 'var(--r8-radius-md)',
            padding: 'var(--r8-space-3) var(--r8-space-4)',
            border: '1px solid var(--r8-border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--r8-space-1)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
            <span style={{ color: 'var(--r8-text-muted)' }}>Subtotal ({order.items.length} items):</span>
            <PriceDisplay amount={subtotal} size="sm" />
          </div>

          {discountPercent > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', color: 'var(--r8-brand-coral)' }}>
              <span>Courtesy Discount ({discountPercent}%):</span>
              <span>- {discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
            <span style={{ color: 'var(--r8-text-muted)' }}>Taxable Subtotal:</span>
            <PriceDisplay amount={taxableAmount} size="sm" />
          </div>

          {isVat && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', color: 'var(--r8-brand-primary)' }}>
              <span>VAT ({settings.vatRate * 100}%):</span>
              <span style={{ fontWeight: 700 }}>+ {taxAmount.toFixed(2)}</span>
            </div>
          )}

          {tipAmount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
              <span style={{ color: 'var(--r8-text-muted)' }}>Voluntary Staff Gratuity:</span>
              <PriceDisplay amount={tipAmount} size="sm" />
            </div>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              borderTop: '1px dashed var(--r8-border-subtle)',
              paddingTop: 'var(--r8-space-2)',
              marginTop: 'var(--r8-space-1)',
            }}
          >
            <div>
              <span style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--r8-text-primary)' }}>
                Net Payable Amount:
              </span>
              <div style={{ fontSize: '0.68rem', color: 'var(--r8-text-muted)' }}>
                *0% Mandatory Service Charge (Compliant with Supreme Court 2023 Rule)
              </div>
            </div>
            <div className="r8-tabular-num">
              <PriceDisplay amount={finalTotal} size="lg" />
            </div>
          </div>
        </div>

        {/* Corporate Tax Invoice Input (Customer PAN & Name) */}
        <div
          style={{
            padding: 'var(--r8-space-3)',
            borderRadius: 'var(--r8-radius-md)',
            border: '1px solid var(--r8-border-subtle)',
            backgroundColor: 'var(--r8-bg-surface-elevated)',
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: 'var(--r8-space-3)',
          }}
        >
          <div>
            <label
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                color: 'var(--r8-text-secondary)',
                display: 'block',
                marginBottom: '4px',
              }}
            >
              Company / Guest Name
            </label>
            <input
              type="text"
              placeholder="e.g. F1Soft International Pvt. Ltd."
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px',
                borderRadius: 'var(--r8-radius-sm)',
                border: '1px solid var(--r8-border-subtle)',
                backgroundColor: 'var(--r8-bg-surface)',
                color: 'var(--r8-text-primary)',
                fontSize: '0.82rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                color: 'var(--r8-text-secondary)',
                display: 'block',
                marginBottom: '4px',
              }}
            >
              Customer PAN (For IRD Tax Invoice)
            </label>
            <input
              type="text"
              maxLength={9}
              placeholder="9-digit PAN (e.g. 601239845)"
              value={customerPan}
              onChange={(e) => setCustomerPan(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px',
                borderRadius: 'var(--r8-radius-sm)',
                border: '1px solid var(--r8-border-subtle)',
                backgroundColor: 'var(--r8-bg-surface)',
                color: 'var(--r8-text-primary)',
                fontSize: '0.82rem',
                fontFamily: 'monospace',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* Payment Method Selector */}
        <div>
          <label
            style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              color: 'var(--r8-text-secondary)',
              marginBottom: 'var(--r8-space-2)',
              display: 'block',
            }}
          >
            Select Payment Method
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--r8-space-2)' }}>
            <button
              type="button"
              onClick={() => setPaymentMethod('fonepay')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '10px 4px',
                borderRadius: 'var(--r8-radius-md)',
                border:
                  paymentMethod === 'fonepay'
                    ? '2px solid var(--r8-brand-primary)'
                    : '1px solid var(--r8-border-subtle)',
                backgroundColor:
                  paymentMethod === 'fonepay'
                    ? 'rgba(14, 165, 233, 0.1)'
                    : 'var(--r8-bg-surface-elevated)',
                color:
                  paymentMethod === 'fonepay'
                    ? 'var(--r8-brand-primary)'
                    : 'var(--r8-text-primary)',
                fontWeight: 700,
                fontSize: '0.74rem',
                cursor: 'pointer',
              }}
            >
              <QrCode size={18} color="var(--r8-brand-primary)" />
              Fonepay
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('esewa')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '10px 4px',
                borderRadius: 'var(--r8-radius-md)',
                border:
                  paymentMethod === 'esewa'
                    ? '2px solid #60BB46'
                    : '1px solid var(--r8-border-subtle)',
                backgroundColor:
                  paymentMethod === 'esewa'
                    ? 'rgba(96, 187, 70, 0.1)'
                    : 'var(--r8-bg-surface-elevated)',
                color:
                  paymentMethod === 'esewa'
                    ? '#60BB46'
                    : 'var(--r8-text-primary)',
                fontWeight: 700,
                fontSize: '0.74rem',
                cursor: 'pointer',
              }}
            >
              <Smartphone size={18} color="#60BB46" />
              eSewa/Khalti
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('cash')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '10px 4px',
                borderRadius: 'var(--r8-radius-md)',
                border:
                  paymentMethod === 'cash'
                    ? '2px solid var(--r8-brand-emerald)'
                    : '1px solid var(--r8-border-subtle)',
                backgroundColor:
                  paymentMethod === 'cash'
                    ? 'rgba(16, 185, 129, 0.1)'
                    : 'var(--r8-bg-surface-elevated)',
                color:
                  paymentMethod === 'cash'
                    ? 'var(--r8-brand-emerald)'
                    : 'var(--r8-text-primary)',
                fontWeight: 700,
                fontSize: '0.74rem',
                cursor: 'pointer',
              }}
            >
              <Banknote size={18} color="var(--r8-brand-emerald)" />
              Cash
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '10px 4px',
                borderRadius: 'var(--r8-radius-md)',
                border:
                  paymentMethod === 'card'
                    ? '2px solid var(--r8-brand-accent)'
                    : '1px solid var(--r8-border-subtle)',
                backgroundColor:
                  paymentMethod === 'card'
                    ? 'rgba(245, 158, 11, 0.1)'
                    : 'var(--r8-bg-surface-elevated)',
                color:
                  paymentMethod === 'card'
                    ? 'var(--r8-brand-accent)'
                    : 'var(--r8-text-primary)',
                fontWeight: 700,
                fontSize: '0.74rem',
                cursor: 'pointer',
              }}
            >
              <CreditCard size={18} color="var(--r8-brand-accent)" />
              Card Swipe
            </button>

            <button
              type="button"
              onClick={() => {
                setPaymentMethod('split');
                if (!splitCashAmount) {
                  setSplitCashAmount(String(Math.round(finalTotal / 2)));
                }
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '10px 4px',
                borderRadius: 'var(--r8-radius-md)',
                border:
                  paymentMethod === 'split'
                    ? '2px solid var(--r8-brand-primary)'
                    : '1px solid var(--r8-border-subtle)',
                backgroundColor:
                  paymentMethod === 'split'
                    ? 'var(--r8-sidebar-active-bg)'
                    : 'var(--r8-bg-surface-elevated)',
                color:
                  paymentMethod === 'split'
                    ? 'var(--r8-brand-primary)'
                    : 'var(--r8-text-primary)',
                fontWeight: 700,
                fontSize: '0.74rem',
                cursor: 'pointer',
              }}
            >
              <Split size={18} color={paymentMethod === 'split' ? 'var(--r8-brand-primary)' : 'var(--r8-text-muted)'} />
              Split Bill
            </button>
          </div>
        </div>

        {/* Split Tender Configuration Panel */}
        {paymentMethod === 'split' && (
          <div
            style={{
              padding: 'var(--r8-space-3)',
              borderRadius: 'var(--r8-radius-md)',
              backgroundColor: 'var(--r8-bg-surface-elevated)',
              border: '1px solid var(--r8-border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--r8-text-primary)' }}>
                Multi-Tender Bill Allocation
              </span>
              <Badge variant="primary" size="sm">
                Split Settlement
              </Badge>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {/* Tender 1: Cash */}
              <div
                style={{
                  padding: '10px',
                  borderRadius: 'var(--r8-radius-md)',
                  backgroundColor: 'var(--r8-bg-surface)',
                  border: '1px solid var(--r8-border-subtle)',
                }}
              >
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--r8-brand-emerald)', marginBottom: '4px' }}>
                  Tender 1: Cash Portion
                </div>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, fontSize: '0.8rem', color: 'var(--r8-text-muted)' }}>
                    Rs.
                  </span>
                  <input
                    type="number"
                    value={splitCashAmount}
                    onChange={(e) => setSplitCashAmount(e.target.value)}
                    placeholder="Cash amt"
                    style={{
                      width: '100%',
                      padding: '6px 8px 6px 30px',
                      borderRadius: 'var(--r8-radius-sm)',
                      border: '1px solid var(--r8-border-default)',
                      backgroundColor: 'var(--r8-bg-surface-elevated)',
                      color: 'var(--r8-text-primary)',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* Tender 2: Digital */}
              <div
                style={{
                  padding: '10px',
                  borderRadius: 'var(--r8-radius-md)',
                  backgroundColor: 'var(--r8-bg-surface)',
                  border: '1px solid var(--r8-border-subtle)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--r8-brand-primary)' }}>
                    Tender 2: Digital Remainder
                  </span>
                  <select
                    value={splitDigitalMethod}
                    onChange={(e) => setSplitDigitalMethod(e.target.value as any)}
                    style={{
                      fontSize: '0.68rem',
                      padding: '2px 4px',
                      borderRadius: '4px',
                      backgroundColor: 'var(--r8-bg-surface-elevated)',
                      color: 'var(--r8-text-primary)',
                      border: '1px solid var(--r8-border-subtle)',
                    }}
                  >
                    <option value="fonepay">Fonepay QR</option>
                    <option value="card">Card Swipe</option>
                    <option value="esewa">eSewa</option>
                  </select>
                </div>
                <div
                  style={{
                    padding: '7px 10px',
                    borderRadius: 'var(--r8-radius-sm)',
                    backgroundColor: 'rgba(14, 165, 233, 0.08)',
                    color: 'var(--r8-text-primary)',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                  }}
                >
                  Rs. {splitDigitalNumber.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Split reconciliation check */}
            <div
              style={{
                fontSize: '0.72rem',
                color: 'var(--r8-text-muted)',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>Cash Rs. {splitCashNumber} + Digital Rs. {splitDigitalNumber}</span>
              <strong style={{ color: 'var(--r8-color-success)' }}>= Grand Total Rs. {finalTotal.toLocaleString()}</strong>
            </div>
          </div>
        )}

        {/* Fonepay / eSewa Dynamic QR View */}
        {(paymentMethod === 'fonepay' || paymentMethod === 'esewa') && (
          <div
            style={{
              padding: 'var(--r8-space-3)',
              borderRadius: 'var(--r8-radius-md)',
              backgroundColor: 'var(--r8-bg-surface-elevated)',
              border: '1px solid var(--r8-border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--r8-space-4)',
            }}
          >
            {/* Dynamic QR SVG */}
            <div
              style={{
                width: '90px',
                height: '90px',
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--r8-radius-md)',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--r8-shadow-sm)',
                flexShrink: 0,
              }}
            >
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                <rect x="5" y="5" width="26" height="26" fill={paymentMethod === 'fonepay' ? '#0F8F6F' : '#60BB46'} rx="4" />
                <rect x="10" y="10" width="16" height="16" fill="#FFFFFF" rx="2" />
                <rect x="14" y="14" width="8" height="8" fill={paymentMethod === 'fonepay' ? '#0F8F6F' : '#60BB46'} />

                <rect x="69" y="5" width="26" height="26" fill={paymentMethod === 'fonepay' ? '#0F8F6F' : '#60BB46'} rx="4" />
                <rect x="74" y="10" width="16" height="16" fill="#FFFFFF" rx="2" />
                <rect x="78" y="14" width="8" height="8" fill={paymentMethod === 'fonepay' ? '#0F8F6F' : '#60BB46'} />

                <rect x="5" y="69" width="26" height="26" fill={paymentMethod === 'fonepay' ? '#0F8F6F' : '#60BB46'} rx="4" />
                <rect x="10" y="74" width="16" height="16" fill="#FFFFFF" rx="2" />
                <rect x="14" y="78" width="8" height="8" fill={paymentMethod === 'fonepay' ? '#0F8F6F' : '#60BB46'} />

                <rect x="36" y="10" width="6" height="6" fill="#1E293B" />
                <rect x="46" y="16" width="12" height="6" fill="#1E293B" />
                <rect x="36" y="26" width="8" height="8" fill="#1E293B" />
                <rect x="48" y="36" width="6" height="14" fill="#1E293B" />
                <rect x="60" y="44" width="14" height="6" fill="#1E293B" />
                <rect x="24" y="44" width="14" height="6" fill="#1E293B" />
                <rect x="38" y="64" width="10" height="10" fill="#1E293B" />
                <rect x="64" y="74" width="8" height="8" fill="#1E293B" />
                <rect x="78" y="64" width="14" height="6" fill="#1E293B" />
              </svg>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} color="var(--r8-brand-emerald)" />
                <strong style={{ fontSize: '0.88rem', color: 'var(--r8-text-primary)' }}>
                  {paymentMethod === 'fonepay' ? 'Fonepay Dynamic QR' : 'eSewa / Khalti QR'}
                </strong>
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--r8-text-muted)', marginTop: '2px' }}>
                Merchant: <strong>{settings.name}</strong> &bull; Mid: 9801234567
              </p>
              <div
                style={{
                  marginTop: '6px',
                  display: 'inline-flex',
                  alignItems: 'baseline',
                  gap: '6px',
                  backgroundColor: 'var(--r8-bg-surface)',
                  padding: '3px 8px',
                  borderRadius: 'var(--r8-radius-sm)',
                  border: '1px solid var(--r8-border-subtle)',
                }}
              >
                <span style={{ fontSize: '0.72rem', color: 'var(--r8-text-muted)' }}>Payable:</span>
                <PriceDisplay amount={finalTotal} size="sm" />
              </div>
            </div>
          </div>
        )}

        {/* Cash Drawer Calculator */}
        {paymentMethod === 'cash' && (
          <div
            style={{
              padding: 'var(--r8-space-3)',
              borderRadius: 'var(--r8-radius-md)',
              backgroundColor: 'var(--r8-bg-surface-elevated)',
              border: '1px solid var(--r8-border-subtle)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--r8-space-2)',
              }}
            >
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--r8-text-primary)' }}>
                Cash Tendered (Rs.):
              </span>
              <input
                type="number"
                placeholder={String(finalTotal)}
                value={cashTendered}
                onChange={(e) => setCashTendered(e.target.value)}
                style={{
                  width: '130px',
                  padding: '6px 10px',
                  borderRadius: 'var(--r8-radius-sm)',
                  border: '1px solid var(--r8-border-subtle)',
                  backgroundColor: 'var(--r8-bg-surface)',
                  color: 'var(--r8-text-primary)',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  textAlign: 'right',
                  outline: 'none',
                }}
              />
            </div>

            {/* Quick Denomination Chips */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--r8-text-muted)', alignSelf: 'center' }}>
                Nepali Notes:
              </span>
              {[100, 500, 1000].map((note) => (
                <button
                  type="button"
                  key={note}
                  onClick={() => addCashDenomination(note)}
                  style={{
                    padding: '3px 8px',
                    borderRadius: 'var(--r8-radius-sm)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    backgroundColor: 'var(--r8-bg-surface)',
                    border: '1px solid var(--r8-border-subtle)',
                    color: 'var(--r8-text-primary)',
                    cursor: 'pointer',
                  }}
                >
                  +Rs. {note}
                </button>
              ))}
            </div>

            {tenderedNumber >= finalTotal && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: 'var(--r8-brand-emerald)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  borderTop: '1px dashed var(--r8-border-subtle)',
                  paddingTop: '6px',
                }}
              >
                <span>Change to Return:</span>
                <PriceDisplay amount={changeDue} size="sm" />
              </div>
            )}
          </div>
        )}

        {/* Action Buttons with in-flight settlement protection */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 'var(--r8-space-3)',
            paddingTop: 'var(--r8-space-2)',
            borderTop: '1px solid var(--r8-border-subtle)',
          }}
        >
          {paymentError && <p role="alert" style={{ flexBasis: '100%', margin: 0, fontSize: 13 }}>{paymentError}</p>}
          <Button variant="secondary" onClick={onClose} disabled={isSettling}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSettle}
            disabled={isSettling}
            isLoading={isSettling}
          >
            <CheckCircle2 size={16} style={{ marginRight: '6px' }} />
            <span>Confirm Settlement</span>
            <span style={{ opacity: 0.85 }}>&bull;</span>
            <PriceDisplay amount={finalTotal} size="sm" />
          </Button>
        </div>
      </div>
    </Modal>
  );
};
