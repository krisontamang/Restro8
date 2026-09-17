import React, { useState } from 'react';
import { Printer, ChevronDown, Check } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

export const OrderSlipSettingView: React.FC = () => {
  const { addToast } = useRestaurant();

  // Heading Details Toggles matching Screenshot 4
  const [showService, setShowService] = useState(true);
  const [showOrderType, setShowOrderType] = useState(true);
  const [showOrderAt, setShowOrderAt] = useState(true);
  const [showStatus, setShowStatus] = useState(true);

  // Line Items Details Toggles matching Screenshot 4
  const [showSN, setShowSN] = useState(true);
  const [showDishes, setShowDishes] = useState(true);
  const [showQTY, setShowQTY] = useState(true);
  const [showPrice, setShowPrice] = useState(true);
  const [showTotal, setShowTotal] = useState(true);

  // Footer Details Toggles matching Screenshot 4
  const [showCustomerDelivery, setShowCustomerDelivery] = useState(true);
  const [showKOTNumbers, setShowKOTNumbers] = useState(true);
  const [showPrintedBy, setShowPrintedBy] = useState(true);
  const [showPrintedAt, setShowPrintedAt] = useState(true);

  // Footer Text Field matching Screenshot 4
  const [footerTextEnabled, setFooterTextEnabled] = useState(true);
  const [footerText, setFooterText] = useState('Thank You!');

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
      {/* Top Header matching Screenshot 4 */}
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
          Order Slip Setting
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

      {/* Main Two-Column Layout matching Screenshot 4 */}
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
          {/* Card 1: Heading Details matching Screenshot 4 */}
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
              Heading Details
            </h2>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <TogglePill
                label="Service"
                selected={showService}
                onClick={() => setShowService((p) => !p)}
                styleVariant="dark"
              />
              <TogglePill
                label="Order Type"
                selected={showOrderType}
                onClick={() => setShowOrderType((p) => !p)}
                styleVariant="green"
              />
              <TogglePill
                label="Order At"
                selected={showOrderAt}
                onClick={() => setShowOrderAt((p) => !p)}
                styleVariant="dark"
              />
              <TogglePill
                label="Status"
                selected={showStatus}
                onClick={() => setShowStatus((p) => !p)}
                styleVariant="green"
              />
            </div>
          </div>

          {/* Card 2: Line Items Details matching Screenshot 4 */}
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
              Line Items Details
            </h2>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <TogglePill
                label="S.N"
                selected={showSN}
                onClick={() => setShowSN((p) => !p)}
                styleVariant="green"
              />
              <TogglePill
                label="Dishes"
                selected={showDishes}
                onClick={() => setShowDishes((p) => !p)}
                styleVariant="dark"
              />
              <TogglePill
                label="QTY"
                selected={showQTY}
                onClick={() => setShowQTY((p) => !p)}
                styleVariant="dark"
              />
              <TogglePill
                label="Price"
                selected={showPrice}
                onClick={() => setShowPrice((p) => !p)}
                styleVariant="dark"
              />
              <TogglePill
                label="Total"
                selected={showTotal}
                onClick={() => setShowTotal((p) => !p)}
                styleVariant="green"
              />
            </div>
          </div>

          {/* Card 3: Footer Details matching Screenshot 4 */}
          <div
            style={{
              backgroundColor: 'var(--color-card)',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              padding: '20px 24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <h2 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0 }}>
              Footer Details
            </h2>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <TogglePill
                label="Customer & Delivery Details"
                selected={showCustomerDelivery}
                onClick={() => setShowCustomerDelivery((p) => !p)}
                styleVariant="green"
              />
              <TogglePill
                label="KOT Numbers"
                selected={showKOTNumbers}
                onClick={() => setShowKOTNumbers((p) => !p)}
                styleVariant="green"
              />
              <TogglePill
                label="Printed By"
                selected={showPrintedBy}
                onClick={() => setShowPrintedBy((p) => !p)}
                styleVariant="green"
              />
              <TogglePill
                label="Printed At"
                selected={showPrintedAt}
                onClick={() => setShowPrintedAt((p) => !p)}
                styleVariant="green"
              />
            </div>

            {/* Footer Text Field */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Footer Text</label>
                <SwitchToggle checked={footerTextEnabled} onChange={setFooterTextEnabled} />
              </div>
              <input
                type="text"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                placeholder="Thank You!"
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
        </div>

        {/* Right Column: Live Sticky Order Slip Preview matching Screenshot 4 & 5 */}
        <div
          style={{
            position: 'sticky',
            top: '24px',
            backgroundColor: 'var(--color-card)',
            borderRadius: '14px',
            border: '1px solid var(--color-border)',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
            fontSize: '9pt',
            fontFamily: 'Inter, system-ui, sans-serif',
            color: '#111827',
            maxHeight: 'calc(100vh - 80px)',
            overflowY: 'auto',
          }}
        >
          {/* Header Title */}
          <div style={{ textAlign: 'center', marginBottom: '14px' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '0.5px' }}>
              Order Slip
            </div>
          </div>

          {/* Heading Info matching Screenshot 5 */}
          <div style={{ fontSize: '0.82rem', lineHeight: '1.45', marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {showService && <div>Type: Reservation Services</div>}
              <div>ORD No: 123</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>Table: Cabin-1</div>
              {showStatus && <div>Status: Pending</div>}
            </div>
            {showOrderAt && <div>Order At: 18 Sep 2025 12:41 PM</div>}
          </div>

          <div style={{ borderTop: '1px dashed #9CA3AF', margin: '8px 0' }} />

          {/* Items Table matching Screenshot 5 */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left', marginBottom: '8px' }}>
            <thead>
              <tr style={{ borderBottom: '1px dashed #9CA3AF' }}>
                <th style={{ padding: '4px 0', fontWeight: 700 }}>
                  {showSN ? 'S.N Dishes' : 'Dishes'}
                </th>
                {showQTY && <th style={{ padding: '4px 6px', fontWeight: 700, textAlign: 'center' }}>QTY</th>}
                {showPrice && <th style={{ padding: '4px 0', fontWeight: 700, textAlign: 'right' }}>Price</th>}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '4px 0' }}>
                  {showSN && '1. '}Chicken Chowmin
                  <div style={{ fontSize: '0.76rem', color: '#4B5563', paddingLeft: showSN ? '14px' : '0' }}>
                    + Extra Egg
                  </div>
                </td>
                {showQTY && (
                  <td style={{ padding: '4px 6px', textAlign: 'center', verticalAlign: 'top' }}>
                    4
                    <div style={{ fontSize: '0.76rem', color: '#4B5563' }}>*4</div>
                  </td>
                )}
                {showPrice && (
                  <td style={{ padding: '4px 0', textAlign: 'right', verticalAlign: 'top' }}>
                    200
                    <div style={{ fontSize: '0.76rem', color: '#4B5563' }}>200</div>
                  </td>
                )}
              </tr>
              <tr>
                <td style={{ padding: '4px 0' }}>{showSN && '2. '}Yak Cheese Ball</td>
                {showQTY && <td style={{ padding: '4px 6px', textAlign: 'center' }}>3</td>}
                {showPrice && <td style={{ padding: '4px 0', textAlign: 'right' }}>1,140</td>}
              </tr>
              <tr>
                <td style={{ padding: '4px 0' }}>{showSN && '3. '}Chicken Cheese Pizza</td>
                {showQTY && <td style={{ padding: '4px 6px', textAlign: 'center' }}>1</td>}
                {showPrice && <td style={{ padding: '4px 0', textAlign: 'right' }}>680</td>}
              </tr>
            </tbody>
          </table>

          <div style={{ borderTop: '1px dashed #9CA3AF', margin: '8px 0' }} />

          {/* Total Amount matching Screenshot 5 */}
          {showTotal && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.9rem', margin: '4px 0' }}>
              <span>Total Amount</span>
              <span>Rs 1,910</span>
            </div>
          )}

          <div style={{ borderTop: '1px dashed #9CA3AF', margin: '8px 0' }} />

          {/* Reservation Details matching Screenshot 5 */}
          {showCustomerDelivery && (
            <div style={{ fontSize: '0.8rem', lineHeight: '1.45', marginBottom: '8px' }}>
              <div style={{ fontWeight: 700, marginBottom: '2px' }}>Reservation Details</div>
              <div>Customer Name: Nikhil Parajuli</div>
              <div>Address: Kathmandu, Nepal</div>
              <div>Phone: 98XXXXXXXX</div>
            </div>
          )}

          {/* Audit Details matching Screenshot 5 */}
          <div style={{ fontSize: '0.76rem', lineHeight: '1.4', color: '#374151', marginBottom: '14px' }}>
            {showKOTNumbers && <div>KOT NO: 23, 24</div>}
            {showPrintedBy && <div>Printed By: Swadesh Nepali</div>}
            {showPrintedAt && <div>Printed At: 14 Sep 2026 08:56 PM</div>}
          </div>

          {/* Footer Text Greeting */}
          {footerTextEnabled && footerText && (
            <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.88rem', marginTop: '16px' }}>
              {footerText}
            </div>
          )}
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
