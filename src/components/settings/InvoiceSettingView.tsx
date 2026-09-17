import React, { useState } from 'react';
import {
  Printer,
  ChevronDown,
  Upload,
  Info,
  Check,
  GripVertical,
  QrCode,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

export const InvoiceSettingView: React.FC = () => {
  const { settings, addToast } = useRestaurant();

  // Restaurant Information State
  const [invoiceType] = useState('Estimate');
  const [legalName, setLegalName] = useState(settings.name || 'Your restaurant');
  const [address, setAddress] = useState(settings.address || settings.city || '');
  const [contact, setContact] = useState(settings.phone || '');
  const [taxNumber, setTaxNumber] = useState(settings.panNumber || '');
  const [division, setDivision] = useState('');

  // Font Setting State
  const [fontSize, setFontSize] = useState(9);

  // Customer Detail Toggles matching Screenshot 2 & 5
  const [customerPhone, setCustomerPhone] = useState(true);
  const [customerPan, setCustomerPan] = useState(true);
  const [customerAddress, setCustomerAddress] = useState(true);

  // Invoice Heading Details Toggles matching Screenshot 5
  const [showBusinessDetail, setShowBusinessDetail] = useState(false);
  const [showInvoiceNo, setShowInvoiceNo] = useState(true);
  const [showDate, setShowDate] = useState(true);
  const [showOrderType, setShowOrderType] = useState(true);
  const [showTime, setShowTime] = useState(false);

  // Line Item Details Toggles matching Screenshot 5
  const [showSN, setShowSN] = useState(false);
  const [showHSCode, setShowHSCode] = useState(false);
  const [showParticular, setShowParticular] = useState(true);
  const [showRate, setShowRate] = useState(true);
  const [showQTY, setShowQTY] = useState(true);
  const [showAmount, setShowAmount] = useState(true);

  // Compact View State matching Screenshot 5 & Screenshot 1
  const [compactView, setCompactView] = useState(false);

  // Sub Total Calculation State matching Screenshot 1
  const [loyaltyDiscount, setLoyaltyDiscount] = useState(true);
  const [loyaltyMultipleDiscount, setLoyaltyMultipleDiscount] = useState('Selectable while checkout');
  const [dishOfferDiscount, setDishOfferDiscount] = useState(false);
  const [rewardPoint, setRewardPoint] = useState(true);
  const [discountSubtotal, setDiscountSubtotal] = useState(true);
  const [serviceCharge, setServiceCharge] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(true);
  const [taxEnabled, setTaxEnabled] = useState(false);

  // Invoice Footer Details matching Screenshot 2
  const [footerPaymentMode, setFooterPaymentMode] = useState(true);
  const [footerBilledBy, setFooterBilledBy] = useState(true);
  const [footerPrintedBy, setFooterPrintedBy] = useState(false);
  const [footerPrintedAt, setFooterPrintedAt] = useState(false);
  const [footerKOTNumber, setFooterKOTNumber] = useState(true);
  const [footerAssign, setFooterAssign] = useState(true);
  const [footerTenderAmount, setFooterTenderAmount] = useState(true);
  const [footerInWords, setFooterInWords] = useState(true);
  const [footerServiceDuration, setFooterServiceDuration] = useState(true);
  const [footerOutstandingBalance, setFooterOutstandingBalance] = useState(false);
  const [footerCustomerDelivery, setFooterCustomerDelivery] = useState(true);

  // QR Attachments State matching Screenshot 2
  const [qrEnabled, setQrEnabled] = useState(false);
  const [qrFileName, setQrFileName] = useState('');

  // Footer State matching Screenshot 2
  const [footerHeader, setFooterHeader] = useState('Thank You');
  const [footerRemarks, setFooterRemarks] = useState('Thank you for your visit! Visit again');

  // Default Action State matching Screenshot 3
  const [checkoutAction, setCheckoutAction] = useState('Confirm as Primary');

  // Checkout Flow State matching Screenshot 3
  const [checkoutFlow, setCheckoutFlow] = useState<'single' | 'separate'>('single');

  const handleResetFont = () => {
    setFontSize(9);
    addToast('Font Reset', 'Font size reset to default 9pt.', 'info');
  };

  const handlePrint = () => {
    window.print();
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
      {/* Top Header matching Screenshot 2 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
        }}
      >
        <h1
          style={{
            fontSize: '1.45rem',
            fontWeight: 700,
            margin: 0,
            color: 'var(--color-foreground)',
            letterSpacing: '-0.02em',
          }}
        >
          Invoice Setting
        </h1>

        <button
          type="button"
          onClick={handlePrint}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            borderRadius: '8px',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-card)',
            color: 'var(--color-foreground)',
            fontSize: '0.84rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Printer size={15} />
          <span>Print Preview</span>
          <ChevronDown size={14} color="#9CA3AF" />
        </button>
      </div>

      {/* Main Two-Column Layout matching Screenshots 1, 2, 3 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(520px, 1.35fr) minmax(360px, 1fr)',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Configuration Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Card 1: Restaurant Information matching Screenshot 2 */}
          <div
            style={{
              backgroundColor: 'var(--color-card)',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              padding: '20px 24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            }}
          >
            <h2 style={{ fontSize: '0.98rem', fontWeight: 700, margin: '0 0 16px 0' }}>
              Restaurant Information
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* Row 1 */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '6px' }}>
                  Invoice Type *
                </label>
                <input
                  type="text"
                  value={invoiceType}
                  disabled
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: '#F9FAFB',
                    color: 'var(--color-foreground)',
                    fontSize: '0.84rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '6px' }}>
                  Restaurant Logo
                </label>
                <div
                  onClick={() => addToast('Upload', 'Select logo image file.', 'info')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '7px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-background)',
                    color: '#9CA3AF',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  <Upload size={14} />
                  <span>Click here to upload your image</span>
                </div>
              </div>

              {/* Row 2 */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '6px' }}>
                  Restaurant Legal Name *
                </label>
                <input
                  type="text"
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-background)',
                    color: 'var(--color-foreground)',
                    fontSize: '0.84rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '6px' }}>
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-background)',
                    color: 'var(--color-foreground)',
                    fontSize: '0.84rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Row 3 */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '6px' }}>
                  Contact
                </label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-background)',
                    color: 'var(--color-foreground)',
                    fontSize: '0.84rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '6px' }}>
                  Tax Number
                </label>
                <input
                  type="text"
                  value={taxNumber}
                  onChange={(e) => setTaxNumber(e.target.value)}
                  placeholder="Enter Tax Number"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-background)',
                    color: 'var(--color-foreground)',
                    fontSize: '0.84rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Row 4 */}
              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Division</label>
                  <Info size={12} color="#9CA3AF" />
                </div>
                <input
                  type="text"
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  placeholder="Enter Division"
                  style={{
                    width: '100%',
                    maxWidth: '320px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-background)',
                    color: 'var(--color-foreground)',
                    fontSize: '0.84rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Font Setting matching Screenshot 2 */}
          <div
            style={{
              backgroundColor: 'var(--color-card)',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              padding: '20px 24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0 }}>Font Setting</h2>
              <button
                type="button"
                onClick={handleResetFont}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-card)',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Reset
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px', alignItems: 'center' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '6px' }}>
                  Upload Font File
                </label>
                <div
                  onClick={() => addToast('Font Upload', 'Select TTF/OTF font file.', 'info')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '7px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-background)',
                    color: '#9CA3AF',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  <Upload size={14} />
                  <span>Click here to upload your image</span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '6px' }}>
                  Font Size *
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setFontSize((p) => Math.max(7, p - 1))}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-card)',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: 700,
                    }}
                  >
                    −
                  </button>
                  <span style={{ fontSize: '0.92rem', fontWeight: 700, minWidth: '24px', textAlign: 'center' }}>
                    {fontSize}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFontSize((p) => Math.min(14, p + 1))}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-card)',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: 700,
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Customer Detail matching Screenshot 2 & 5 */}
          <div
            style={{
              backgroundColor: 'var(--color-card)',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              padding: '20px 24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            }}
          >
            <h2 style={{ fontSize: '0.98rem', fontWeight: 700, margin: '0 0 14px 0' }}>Customer Detail</h2>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <TogglePill
                label="Customer Phone"
                selected={customerPhone}
                onClick={() => setCustomerPhone((p) => !p)}
                styleVariant="green"
              />
              <TogglePill
                label="Customer Pan"
                selected={customerPan}
                onClick={() => setCustomerPan((p) => !p)}
                styleVariant="green"
              />
              <TogglePill
                label="Customer Address"
                selected={customerAddress}
                onClick={() => setCustomerAddress((p) => !p)}
                styleVariant="green"
              />
            </div>
          </div>

          {/* Card 4: Invoice Heading Details matching Screenshot 5 */}
          <div
            style={{
              backgroundColor: 'var(--color-card)',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              padding: '20px 24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            }}
          >
            <h2 style={{ fontSize: '0.98rem', fontWeight: 700, margin: '0 0 14px 0' }}>
              Invoice Heading Details
            </h2>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <TogglePill
                label="Business Detail"
                selected={showBusinessDetail}
                onClick={() => setShowBusinessDetail((p) => !p)}
                styleVariant="dark"
              />
              <TogglePill
                label="Invoice No"
                selected={showInvoiceNo}
                onClick={() => setShowInvoiceNo((p) => !p)}
                styleVariant="dark"
              />
              <TogglePill
                label="Date"
                selected={showDate}
                onClick={() => setShowDate((p) => !p)}
                styleVariant="dark"
              />
              <TogglePill
                label="Order Type"
                selected={showOrderType}
                onClick={() => setShowOrderType((p) => !p)}
                styleVariant="green"
              />
              <TogglePill
                label="Time"
                selected={showTime}
                onClick={() => setShowTime((p) => !p)}
                styleVariant="dark"
              />
            </div>
          </div>

          {/* Card 5: Line Item Details matching Screenshot 5 */}
          <div
            style={{
              backgroundColor: 'var(--color-card)',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              padding: '20px 24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            }}
          >
            <h2 style={{ fontSize: '0.98rem', fontWeight: 700, margin: '0 0 14px 0' }}>
              Line Item Details
            </h2>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <TogglePill
                label="S.N"
                selected={showSN}
                onClick={() => setShowSN((p) => !p)}
                styleVariant="dark"
              />
              <TogglePill
                label="HS Code"
                selected={showHSCode}
                onClick={() => setShowHSCode((p) => !p)}
                styleVariant="dark"
              />
              <TogglePill
                label="Particular"
                selected={showParticular}
                onClick={() => setShowParticular((p) => !p)}
                styleVariant="dark"
              />
              <TogglePill
                label="Rate"
                selected={showRate}
                onClick={() => setShowRate((p) => !p)}
                styleVariant="dark"
              />
              <TogglePill
                label="QTY"
                selected={showQTY}
                onClick={() => setShowQTY((p) => !p)}
                styleVariant="dark"
              />
              <TogglePill
                label="Amount"
                selected={showAmount}
                onClick={() => setShowAmount((p) => !p)}
                styleVariant="dark"
              />
            </div>
          </div>

          {/* Card 6: Compact View matching Screenshot 1 & 5 */}
          <div
            style={{
              backgroundColor: 'var(--color-card)',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              padding: '20px 24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                Compact View
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-muted-foreground)', marginTop: '2px' }}>
                Enabling Compact View will print Invoices with minimal gap.
              </div>
            </div>

            <SwitchToggle checked={compactView} onChange={setCompactView} />
          </div>

          {/* Card 7: Sub Total Calculation matching Screenshot 1 */}
          <div
            style={{
              backgroundColor: 'var(--color-card)',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              padding: '20px 24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <h2 style={{ fontSize: '0.98rem', fontWeight: 700, margin: '0 0 6px 0' }}>
              Sub Total Calculation
            </h2>

            {/* Row 1: Item Total (Grey Strip) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '11px 16px',
                borderRadius: '8px',
                backgroundColor: '#F9FAFB',
                border: '1px solid #F3F4F6',
              }}
            >
              <span style={{ fontWeight: 700, fontSize: '0.86rem', minWidth: '160px', color: '#111827' }}>
                Item Total
              </span>
              <span style={{ fontSize: '0.82rem', color: '#4B5563' }}>
                Total of Items/dishes of invoice
              </span>
            </div>

            {/* Row 2: Loyalty Discount (Switch ON + Dropdown) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 16px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '160px' }}>
                <SwitchToggle checked={loyaltyDiscount} onChange={setLoyaltyDiscount} />
                <span style={{ fontWeight: 600, fontSize: '0.84rem', color: '#111827' }}>
                  Loyalty Discount
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '0.82rem', color: '#4B5563' }}>
                  What if multiple discount?
                </span>
                <select
                  value={loyaltyMultipleDiscount}
                  onChange={(e) => setLoyaltyMultipleDiscount(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-card)',
                    fontSize: '0.82rem',
                    color: '#111827',
                    fontWeight: 500,
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="Selectable while checkout">Selectable while checkout</option>
                  <option value="Highest discount applies">Highest discount applies</option>
                  <option value="Lowest discount applies">Lowest discount applies</option>
                  <option value="Combine all discounts">Combine all discounts</option>
                </select>
              </div>
            </div>

            {/* Row 3: Dish/Offer Discount (Switch OFF) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 16px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '160px' }}>
                <SwitchToggle checked={dishOfferDiscount} onChange={setDishOfferDiscount} />
                <span style={{ fontWeight: 600, fontSize: '0.84rem', color: '#111827' }}>
                  Dish/Offer Discount
                </span>
              </div>
              <span style={{ fontSize: '0.82rem', color: '#4B5563' }}>
                Discount based on dishes, this doesn’t affect Item Total
              </span>
            </div>

            {/* Row 4: Reward Point (Switch ON) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 16px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '160px' }}>
                <SwitchToggle checked={rewardPoint} onChange={setRewardPoint} />
                <span style={{ fontWeight: 600, fontSize: '0.84rem', color: '#111827' }}>
                  Reward Point
                </span>
              </div>
              <span style={{ fontSize: '0.82rem', color: '#4B5563' }}>
                Show Reward Point in order checkout
              </span>
            </div>

            {/* Row 5: Sub Total (Grey Strip) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '11px 16px',
                borderRadius: '8px',
                backgroundColor: '#F9FAFB',
                border: '1px solid #F3F4F6',
              }}
            >
              <span style={{ fontWeight: 700, fontSize: '0.86rem', minWidth: '160px', color: '#111827' }}>
                Sub Total
              </span>
              <span style={{ fontSize: '0.82rem', color: '#4B5563' }}>
                Sub total after fix offers and discounts
              </span>
            </div>

            {/* Row 6: Discount (Grip + Switch ON) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 16px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                gap: '10px',
              }}
            >
              <GripVertical size={16} color="#9CA3AF" style={{ cursor: 'grab' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '136px' }}>
                <SwitchToggle checked={discountSubtotal} onChange={setDiscountSubtotal} />
                <span style={{ fontWeight: 600, fontSize: '0.84rem', color: '#111827' }}>
                  Discount
                </span>
              </div>
              <span style={{ fontSize: '0.82rem', color: '#4B5563' }}>
                Calculated on Sub Total
              </span>
            </div>

            {/* Row 7: Service Charge (Grip + Switch OFF) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 16px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                gap: '10px',
              }}
            >
              <GripVertical size={16} color="#9CA3AF" style={{ cursor: 'grab' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '136px' }}>
                <SwitchToggle checked={serviceCharge} onChange={setServiceCharge} />
                <span style={{ fontWeight: 600, fontSize: '0.84rem', color: '#111827' }}>
                  Service Charge
                </span>
              </div>
              <span style={{ fontSize: '0.82rem', color: '#4B5563' }}>
                Calculated after Sub Total & Discount
              </span>
            </div>

            {/* Row 8: Discount Percentage (Switch ON) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 16px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '160px' }}>
                <SwitchToggle checked={discountPercentage} onChange={setDiscountPercentage} />
                <span style={{ fontWeight: 600, fontSize: '0.84rem', color: '#111827' }}>
                  Discount Percentage
                </span>
              </div>
              <span style={{ fontSize: '0.82rem', color: '#4B5563' }}>
                Show discount percentage in invoice when discount is applied.
              </span>
            </div>

            {/* Row 9: Taxable Amount (Grey Strip) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '11px 16px',
                borderRadius: '8px',
                backgroundColor: '#F9FAFB',
                border: '1px solid #F3F4F6',
              }}
            >
              <span style={{ fontWeight: 700, fontSize: '0.86rem', minWidth: '160px', color: '#111827' }}>
                Taxable Amount
              </span>
              <span style={{ fontSize: '0.82rem', color: '#4B5563' }}>
                Total of Items
              </span>
            </div>

            {/* Row 10: Tax (Switch OFF + Link) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 16px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '160px' }}>
                <SwitchToggle checked={taxEnabled} onChange={setTaxEnabled} />
                <span style={{ fontWeight: 600, fontSize: '0.84rem', color: '#111827' }}>
                  Tax
                </span>
              </div>
              <span style={{ fontSize: '0.82rem', color: '#4B5563' }}>
                Tax rates are managed in Finance.{' '}
                <span
                  onClick={() => addToast('Finance', 'Navigate to Tax & Rates in Finance.', 'info')}
                  style={{ color: '#2563EB', cursor: 'pointer', fontWeight: 600 }}
                >
                  Go to Tax & Rates &gt;
                </span>
              </span>
            </div>

            {/* Row 11: Grand Total (Grey Strip) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '11px 16px',
                borderRadius: '8px',
                backgroundColor: '#F9FAFB',
                border: '1px solid #F3F4F6',
              }}
            >
              <span style={{ fontWeight: 700, fontSize: '0.86rem', minWidth: '160px', color: '#111827' }}>
                Grand Total
              </span>
              <span style={{ fontSize: '0.82rem', color: '#4B5563' }}>
                Total of Items
              </span>
            </div>
          </div>

          {/* Card 8: Invoice Footer Details matching Screenshot 2 */}
          <div
            style={{
              backgroundColor: 'var(--color-card)',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              padding: '20px 24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            }}
          >
            <h2 style={{ fontSize: '0.98rem', fontWeight: 700, margin: '0 0 14px 0' }}>
              Invoice Footer Details
            </h2>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <TogglePill
                label="Payment Mode"
                selected={footerPaymentMode}
                onClick={() => setFooterPaymentMode((p) => !p)}
                styleVariant="green"
              />
              <TogglePill
                label="Billed By"
                selected={footerBilledBy}
                onClick={() => setFooterBilledBy((p) => !p)}
                styleVariant="green"
              />
              <TogglePill
                label="Printed By"
                selected={footerPrintedBy}
                onClick={() => setFooterPrintedBy((p) => !p)}
                styleVariant="green"
              />
              <TogglePill
                label="Printed At"
                selected={footerPrintedAt}
                onClick={() => setFooterPrintedAt((p) => !p)}
                styleVariant="green"
              />
              <TogglePill
                label="KOT Number"
                selected={footerKOTNumber}
                onClick={() => setFooterKOTNumber((p) => !p)}
                styleVariant="green"
              />
              <TogglePill
                label="Assign"
                selected={footerAssign}
                onClick={() => setFooterAssign((p) => !p)}
                styleVariant="green"
              />
              <TogglePill
                label="Tender Amount"
                selected={footerTenderAmount}
                onClick={() => setFooterTenderAmount((p) => !p)}
                styleVariant="green"
              />
              <TogglePill
                label="In Words"
                selected={footerInWords}
                onClick={() => setFooterInWords((p) => !p)}
                styleVariant="green"
              />
              <TogglePill
                label="Service Duration"
                selected={footerServiceDuration}
                onClick={() => setFooterServiceDuration((p) => !p)}
                styleVariant="green"
              />
              <TogglePill
                label="Outstanding Balance"
                selected={footerOutstandingBalance}
                onClick={() => setFooterOutstandingBalance((p) => !p)}
                styleVariant="green"
              />
              <TogglePill
                label="Customer & Delivery Details"
                selected={footerCustomerDelivery}
                onClick={() => setFooterCustomerDelivery((p) => !p)}
                styleVariant="green"
              />
            </div>
          </div>

          {/* Card 9: QR Attachments matching Screenshot 2 */}
          <div
            style={{
              backgroundColor: 'var(--color-card)',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              padding: '20px 24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0 }}>QR Attachments</h2>
              <SwitchToggle checked={qrEnabled} onChange={setQrEnabled} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'center' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '6px' }}>
                  File Name
                </label>
                <input
                  type="text"
                  value={qrFileName}
                  onChange={(e) => setQrFileName(e.target.value)}
                  placeholder="Enter File Name"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-background)',
                    color: 'var(--color-foreground)',
                    fontSize: '0.84rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '6px' }}>
                  Upload QR Image
                </label>
                <div
                  onClick={() => {
                    setQrEnabled(true);
                    addToast('QR Attached', 'Sample QR payment image uploaded.', 'success');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '7px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-background)',
                    color: '#9CA3AF',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  <Upload size={14} />
                  <span>Click here to upload your image</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 10: Footer matching Screenshot 2 */}
          <div
            style={{
              backgroundColor: 'var(--color-card)',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              padding: '20px 24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <h2 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0 }}>Footer</h2>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '6px' }}>
                Header
              </label>
              <input
                type="text"
                value={footerHeader}
                onChange={(e) => setFooterHeader(e.target.value)}
                placeholder="Thank You"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-foreground)',
                  fontSize: '0.84rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '6px' }}>
                Remarks
              </label>
              <input
                type="text"
                value={footerRemarks}
                onChange={(e) => setFooterRemarks(e.target.value)}
                placeholder="Thank you for your visit! Visit again"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-foreground)',
                  fontSize: '0.84rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Card 11: Default action matching Screenshot 3 */}
          <div
            style={{
              backgroundColor: 'var(--color-card)',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              padding: '20px 24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            }}
          >
            <h2 style={{ fontSize: '0.98rem', fontWeight: 700, margin: '0 0 14px 0' }}>
              Default action
            </h2>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '6px' }}>
                Checkout Action
              </label>
              <div style={{ position: 'relative', maxWidth: '320px' }}>
                <select
                  value={checkoutAction}
                  onChange={(e) => setCheckoutAction(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 32px 8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-background)',
                    color: 'var(--color-foreground)',
                    fontSize: '0.84rem',
                    appearance: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="Confirm as Primary">Confirm as Primary</option>
                  <option value="Confirm & Print">Confirm & Print</option>
                  <option value="Save as Draft">Save as Draft</option>
                  <option value="Direct KOT & Checkout">Direct KOT & Checkout</option>
                </select>
                <ChevronDown
                  size={16}
                  color="#9CA3AF"
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                />
              </div>
            </div>
          </div>

          {/* Card 12: Checkout flow matching Screenshot 3 */}
          <div
            style={{
              backgroundColor: 'var(--color-card)',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              padding: '20px 24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            }}
          >
            <h2 style={{ fontSize: '0.98rem', fontWeight: 700, margin: '0 0 4px 0' }}>
              Checkout flow
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-muted-foreground)', marginBottom: '16px' }}>
              Choose how the checkout sheet collects a payment, all in one step, or with payment split into a second step.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* Option 1: Single Sheet (1 step) */}
              <div
                onClick={() => setCheckoutFlow('single')}
                style={{
                  border: checkoutFlow === 'single' ? '2px solid #10B981' : '1px solid var(--color-border)',
                  backgroundColor: checkoutFlow === 'single' ? '#F0FDF4' : 'var(--color-card)',
                  borderRadius: '10px',
                  padding: '16px',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Radio checkmark */}
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: checkoutFlow === 'single' ? '#10B981' : 'transparent',
                    border: checkoutFlow === 'single' ? 'none' : '1.5px solid #D1D5DB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {checkoutFlow === 'single' && <Check size={12} color="#FFF" />}
                </div>

                {/* Wireframe Mockup */}
                <div
                  style={{
                    backgroundColor: '#FFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '6px',
                    padding: '8px 10px',
                    marginBottom: '14px',
                    fontSize: '0.68rem',
                    color: '#9CA3AF',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#9CA3AF' }} />
                    <span style={{ fontWeight: 600, color: '#374151' }}>Checkout</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ height: '5px', backgroundColor: '#E5E7EB', borderRadius: '2px', width: '90%' }} />
                      <div style={{ height: '5px', backgroundColor: '#E5E7EB', borderRadius: '2px', width: '80%' }} />
                      <div style={{ height: '5px', backgroundColor: '#E5E7EB', borderRadius: '2px', width: '60%' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        <div style={{ height: '14px', width: '50%', backgroundColor: '#111827', borderRadius: '3px', color: '#FFF', fontSize: '0.55rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                          Payment
                        </div>
                        <div style={{ height: '14px', width: '50%', backgroundColor: '#F3F4F6', borderRadius: '3px', fontSize: '0.55rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          Invoice
                        </div>
                      </div>
                      <div style={{ height: '4px', backgroundColor: '#E5E7EB', borderRadius: '2px', width: '100%' }} />
                      <div
                        style={{
                          height: '18px',
                          backgroundColor: '#10B981',
                          borderRadius: '3px',
                          color: '#FFF',
                          fontSize: '0.6rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        Confirm Checkout
                      </div>
                    </div>
                  </div>
                </div>

                {/* Title & Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>
                    Single sheet
                  </span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      backgroundColor: '#D1FAE5',
                      color: '#065F46',
                      padding: '1px 6px',
                      borderRadius: '10px',
                    }}
                  >
                    1 step
                  </span>
                </div>

                <div style={{ fontSize: '0.78rem', color: '#4B5563', lineHeight: '1.35' }}>
                  Items, payment and the invoice preview stay on the checkout sheet. Fewest clicks to confirm a bill.
                </div>
              </div>

              {/* Option 2: Separate Payment Step (2 steps) */}
              <div
                onClick={() => setCheckoutFlow('separate')}
                style={{
                  border: checkoutFlow === 'separate' ? '2px solid #10B981' : '1px solid var(--color-border)',
                  backgroundColor: checkoutFlow === 'separate' ? '#F0FDF4' : 'var(--color-card)',
                  borderRadius: '10px',
                  padding: '16px',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Radio checkmark */}
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: checkoutFlow === 'separate' ? '#10B981' : 'transparent',
                    border: checkoutFlow === 'separate' ? 'none' : '1.5px solid #D1D5DB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {checkoutFlow === 'separate' && <Check size={12} color="#FFF" />}
                </div>

                {/* Wireframe Mockup */}
                <div
                  style={{
                    backgroundColor: '#FFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '6px',
                    padding: '8px 10px',
                    marginBottom: '14px',
                    fontSize: '0.68rem',
                    color: '#9CA3AF',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px', opacity: 0.6 }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#9CA3AF' }} />
                    <span style={{ fontWeight: 600, color: '#374151' }}>Checkout</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', opacity: 0.5 }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <div style={{ height: '4px', backgroundColor: '#E5E7EB', borderRadius: '2px', width: '90%' }} />
                      <div style={{ height: '4px', backgroundColor: '#E5E7EB', borderRadius: '2px', width: '75%' }} />
                    </div>
                  </div>

                  {/* Dialog popup */}
                  <div
                    style={{
                      position: 'relative',
                      marginTop: '4px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #D1D5DB',
                      borderRadius: '5px',
                      padding: '6px 8px',
                      boxShadow: '0 3px 8px rgba(0,0,0,0.08)',
                    }}
                  >
                    <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
                      Payment
                    </div>
                    <div style={{ display: 'flex', gap: '3px', marginBottom: '4px' }}>
                      <div style={{ height: '10px', width: '33%', backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '2px' }} />
                      <div style={{ height: '10px', width: '33%', backgroundColor: '#F3F4F6', borderRadius: '2px' }} />
                      <div style={{ height: '10px', width: '33%', backgroundColor: '#F3F4F6', borderRadius: '2px' }} />
                    </div>
                    <div
                      style={{
                        height: '16px',
                        backgroundColor: '#10B981',
                        borderRadius: '3px',
                        color: '#FFF',
                        fontSize: '0.58rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      Confirm Checkout
                    </div>
                  </div>
                </div>

                {/* Title & Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>
                    Separate payment step
                  </span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      backgroundColor: '#F3F4F6',
                      color: '#4B5563',
                      padding: '1px 6px',
                      borderRadius: '10px',
                    }}
                  >
                    2 steps
                  </span>
                </div>

                <div style={{ fontSize: '0.78rem', color: '#4B5563', lineHeight: '1.35' }}>
                  Payment opens in its own dialog box on top of the sheet. Both stay open until the payment goes through.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Sticky Invoice Preview matching Screenshots 2 & 3 */}
        <div
          style={{
            position: 'sticky',
            top: '24px',
            backgroundColor: 'var(--color-card)',
            borderRadius: '14px',
            border: '1px solid var(--color-border)',
            padding: compactView ? '16px' : '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
            fontSize: `${fontSize}pt`,
            fontFamily: 'Inter, system-ui, sans-serif',
            color: '#111827',
            maxHeight: 'calc(100vh - 80px)',
            overflowY: 'auto',
          }}
        >
          {/* Header Title & Order No */}
          <div style={{ textAlign: 'center', marginBottom: compactView ? '8px' : '14px' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '0.5px' }}>
              ESTIMATE
            </div>
            <div style={{ fontSize: '0.84rem', fontWeight: 600, marginTop: '2px' }}>
              Order No: 512
            </div>
          </div>

          {/* Heading Info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.82rem' }}>
            {showInvoiceNo && <div>Invoice No: Draft</div>}
            {showDate && <div>Date: Nov 24, 2025</div>}
          </div>
          {showTime && (
            <div style={{ fontSize: '0.82rem', marginBottom: '4px' }}>
              Time: 02:45 PM
            </div>
          )}
          {showOrderType && (
            <div style={{ fontSize: '0.82rem', marginBottom: '10px' }}>
              Delivery: Nischal
            </div>
          )}

          <div style={{ borderTop: '1px dashed #D1D5DB', margin: '8px 0' }} />

          {/* Customer Info */}
          <div style={{ fontSize: '0.8rem', lineHeight: '1.45', marginBottom: '8px' }}>
            <div style={{ fontWeight: 600 }}>Customer: Nischal</div>
            {customerPan && <div>PAN: 613635938</div>}
            {customerPhone && <div>Contact: 977 9844736540</div>}
            {customerAddress && <div>Address: Ranipauwa-11, Pokhara</div>}
          </div>

          <div style={{ borderTop: '1px dashed #D1D5DB', margin: '8px 0' }} />

          {/* Items Table matching Screenshot 3 */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left', marginBottom: '8px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                {showSN && <th style={{ padding: '4px 4px', fontWeight: 700 }}>SN</th>}
                {showParticular && <th style={{ padding: '4px 0', fontWeight: 700 }}>Particular</th>}
                {showRate && <th style={{ padding: '4px 6px', fontWeight: 700, textAlign: 'right' }}>Rate</th>}
                {showQTY && <th style={{ padding: '4px 6px', fontWeight: 700, textAlign: 'center' }}>QTY</th>}
                {showAmount && <th style={{ padding: '4px 0', fontWeight: 700, textAlign: 'right' }}>Amount</th>}
              </tr>
            </thead>
            <tbody>
              <tr>
                {showSN && <td style={{ padding: '4px 4px' }}>1</td>}
                {showParticular && <td style={{ padding: '4px 0' }}>Chicken Cheese Pizza</td>}
                {showRate && <td style={{ padding: '4px 6px', textAlign: 'right' }}>680</td>}
                {showQTY && <td style={{ padding: '4px 6px', textAlign: 'center' }}>1</td>}
                {showAmount && <td style={{ padding: '4px 0', textAlign: 'right' }}>680</td>}
              </tr>
              <tr>
                {showSN && <td style={{ padding: '4px 4px' }}>2</td>}
                {showParticular && <td style={{ padding: '4px 0' }}>Dry Mix</td>}
                {showRate && <td style={{ padding: '4px 6px', textAlign: 'right' }}>350</td>}
                {showQTY && <td style={{ padding: '4px 6px', textAlign: 'center' }}>1</td>}
                {showAmount && <td style={{ padding: '4px 0', textAlign: 'right' }}>350</td>}
              </tr>
              <tr>
                {showSN && <td style={{ padding: '4px 4px' }}>3</td>}
                {showParticular && <td style={{ padding: '4px 0' }}>Veg Organic Thali</td>}
                {showRate && <td style={{ padding: '4px 6px', textAlign: 'right' }}>490</td>}
                {showQTY && <td style={{ padding: '4px 6px', textAlign: 'center' }}>1</td>}
                {showAmount && <td style={{ padding: '4px 0', textAlign: 'right' }}>490</td>}
              </tr>
              <tr>
                {showSN && <td style={{ padding: '4px 4px' }}>4</td>}
                {showParticular && <td style={{ padding: '4px 0' }}>Burger - Veg</td>}
                {showRate && <td style={{ padding: '4px 6px', textAlign: 'right' }}>180</td>}
                {showQTY && <td style={{ padding: '4px 6px', textAlign: 'center' }}>1</td>}
                {showAmount && <td style={{ padding: '4px 0', textAlign: 'right' }}>180</td>}
              </tr>
            </tbody>
          </table>

          <div style={{ borderTop: '1px dashed #D1D5DB', margin: '8px 0' }} />

          {/* Calculations matching Screenshot 3 & Screenshot 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.78rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
              <span>Total (Particular/QTY)</span>
              <span>4/4 &nbsp;&nbsp;&nbsp;&nbsp; Rs 1,700</span>
            </div>
            {loyaltyDiscount && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4B5563' }}>
                <span>Loyalty Discount {discountPercentage ? '(13.29%)' : ''}</span>
                <span>Rs 225.93</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
              <span>Sub Total</span>
              <span>Rs {loyaltyDiscount ? '1,474.07' : '1,700.00'}</span>
            </div>
            {discountSubtotal && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4B5563' }}>
                <span>Discount {discountPercentage ? '(10.21%)' : ''}</span>
                <span>Rs 150.44</span>
              </div>
            )}
            {serviceCharge && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4B5563' }}>
                <span>Service Charge (10%)</span>
                <span>Rs 132.36</span>
              </div>
            )}
            {taxEnabled && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4B5563' }}>
                <span>VAT (13%)</span>
                <span>Rs 172.07</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
              <span>Total Amount</span>
              <span>Rs 1,323.63</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Round Off</span>
              <span>Rs 30</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Tip</span>
              <span>Rs 500</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 800, marginTop: '2px' }}>
              <span>Net Amount</span>
              <span>Rs 1,793.63</span>
            </div>
          </div>

          <div style={{ borderTop: '1px dashed #D1D5DB', margin: '8px 0' }} />

          {/* In Words matching Screenshot 2 & 3 */}
          {footerInWords && (
            <div style={{ fontSize: '0.74rem', fontStyle: 'italic', marginBottom: '8px' }}>
              One Thousand Seven Hundred Ninety Three And 63/100 Nepalese Rupee Only
            </div>
          )}

          {footerRemarks && (
            <div style={{ fontSize: '0.76rem', marginBottom: '8px' }}>
              <strong>Remarks:</strong> {footerRemarks}
            </div>
          )}

          {/* Delivery Info */}
          {footerCustomerDelivery && (
            <div style={{ fontSize: '0.76rem', lineHeight: '1.4', marginBottom: '8px' }}>
              <div style={{ fontWeight: 700 }}>Delivery Details:</div>
              <div><strong>Name :</strong> Bibesh Gurung</div>
              <div><strong>Address :</strong> Lakeside, Pokhara</div>
              <div><strong>Contact :</strong> 977 980000000</div>
              <div><strong>Notes :</strong> Please call before arriving, gate code is 4521</div>
            </div>
          )}

          {/* Payment & Audit Details matching Screenshot 2 */}
          <div style={{ fontSize: '0.74rem', lineHeight: '1.4', color: '#374151', marginBottom: '14px' }}>
            {footerPaymentMode && <div>Payment Mode: Bank Transfer (Rs 1,000), Cash (Rs 793.63)</div>}
            {footerKOTNumber && <div>KOT No: 45 (by Aakash Acharya)</div>}
            {footerAssign && <div>Assign: Nischal (Rs 1,000), Laxmi (Rs 793.63)</div>}
            {footerBilledBy && <div>Billed by: Aakash Acharya</div>}
            {footerTenderAmount && <div>Tender Amount: Rs 2,100</div>}
            {footerServiceDuration && <div>Service Duration: 24 mins</div>}
            {footerPrintedBy && <div>Printed by: Cashier-1</div>}
            {footerPrintedAt && <div>Printed at: 2025-11-24 14:32:05</div>}
            {footerOutstandingBalance && <div>Outstanding Balance: Rs 0.00</div>}
          </div>

          {/* QR Attachment Preview */}
          {qrEnabled && (
            <div style={{ textAlign: 'center', margin: '12px 0', padding: '10px', border: '1px dashed #D1D5DB', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#6B7280', marginBottom: '6px' }}>
                Scan to Pay via Fonepay / NepalPay
              </div>
              <div style={{ display: 'inline-block', padding: '6px', backgroundColor: '#FFF', borderRadius: '4px', border: '1px solid #E5E7EB' }}>
                <QrCode size={72} color="#111827" />
              </div>
              {qrFileName && <div style={{ fontSize: '0.68rem', color: '#9CA3AF', marginTop: '4px' }}>{qrFileName}</div>}
            </div>
          )}

          {/* Disclaimer Footer matching Screenshot 2 */}
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, letterSpacing: '0.3px', marginBottom: '2px' }}>
              This is not a Tax Invoice!
            </div>
            <div style={{ fontSize: '0.72rem', color: '#6B7280', marginBottom: '6px' }}>
              Kindly accept the original bill from the counter.
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>
              {footerHeader || 'Thank You'}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#6B7280' }}>
              {footerRemarks || 'Thank you for your visit! Visit again'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SwitchToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  color?: string;
}

const SwitchToggle: React.FC<SwitchToggleProps> = ({ checked, onChange, color = '#10B981' }) => (
  <div
    onClick={() => onChange(!checked)}
    style={{
      width: '38px',
      height: '22px',
      borderRadius: '11px',
      backgroundColor: checked ? color : '#D1D5DB',
      position: 'relative',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      flexShrink: 0,
    }}
  >
    <div
      style={{
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        backgroundColor: '#FFF',
        position: 'absolute',
        top: '2px',
        left: checked ? '18px' : '2px',
        transition: 'left 0.2s',
        boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
      }}
    />
  </div>
);

interface TogglePillProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  styleVariant: 'green' | 'dark';
}

const TogglePill: React.FC<TogglePillProps> = ({ label, selected, onClick, styleVariant }) => {
  let borderColor = 'var(--color-border)';
  let bg = 'var(--color-card)';
  let textColor = 'var(--color-muted-foreground)';

  if (selected) {
    if (styleVariant === 'green') {
      borderColor = '#10B981';
      bg = '#ECFDF5';
      textColor = '#047857';
    } else {
      borderColor = '#111827';
      bg = 'var(--color-card)';
      textColor = '#111827';
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 14px',
        borderRadius: '8px',
        border: `1.5px solid ${borderColor}`,
        backgroundColor: bg,
        color: textColor,
        fontSize: '0.8rem',
        fontWeight: selected ? 600 : 500,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      <div
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '3px',
          border: `1.5px solid ${selected ? (styleVariant === 'green' ? '#10B981' : '#111827') : '#9CA3AF'}`,
          backgroundColor: selected ? (styleVariant === 'green' ? '#10B981' : '#111827') : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {selected && <Check size={10} color="#FFF" />}
      </div>
      <span>{label}</span>
    </button>
  );
};
