import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Order } from '../../types/restaurant';
import { formatNPR } from '../../utils/nepalDate';
import { Button, PriceDisplay, Modal } from '../ui';
import { Printer, Download, X, UtensilsCrossed, QrCode } from 'lucide-react';

interface ReceiptModalProps {
  order: Order;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, onClose }) => {
  const { settings } = useRestaurant();
  const isVat = settings.taxMode === 'vat_registered';

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const textLines = [
      '==================================================',
      `           ${settings.name.toUpperCase()}         `,
      `          ${settings.address}, ${settings.city}   `,
      `               Tel: ${settings.phone}             `,
      `             PAN/VAT No: ${settings.panNumber}    `,
      '==================================================',
      `         ${isVat ? 'TAX INVOICE (कर बिजक)' : 'PAN BILL (बिल)'}       `,
      '==================================================',
      `Invoice #: ${order.invoiceNumber || `INV-${order.orderNumber}`}`,
      `Date (BS): ${order.dateBS}`,
      `Date (AD): ${new Date(order.updatedAt).toLocaleString()}`,
      `Table: ${order.tableNumber ? `Table/Cabin ${order.tableNumber}` : 'Takeaway'}`,
      `Server: ${order.serverName}`,
      order.customerName ? `Customer: ${order.customerName}` : null,
      order.customerPan ? `Customer PAN: ${order.customerPan}` : null,
      '--------------------------------------------------',
      ...order.items.map(
        (it) => `${it.quantity}x ${it.name.padEnd(28).slice(0, 28)} ${formatNPR(it.price * it.quantity)}`
      ),
      '--------------------------------------------------',
      `Subtotal:                         ${formatNPR(order.subtotal)}`,
      order.discount > 0 ? `Discount:                        -${formatNPR(order.discount)}` : null,
      `Taxable Amount:                   ${formatNPR(order.taxableAmount || order.subtotal - order.discount)}`,
      isVat ? `13% VAT:                          ${formatNPR(order.tax)}` : null,
      order.tip > 0 ? `Voluntary Tip:                    ${formatNPR(order.tip)}` : null,
      '==================================================',
      `GRAND TOTAL:                      ${formatNPR(order.total)}`,
      `Payment Mode:                     ${order.paymentMethod?.toUpperCase() || 'FONEPAY'} (PAID)`,
      '==================================================',
      '      Thank you for visiting! Please visit again.  ',
      '   *Computer generated tax invoice compliant with  ',
      '           Nepal Inland Revenue Dept (IRD)*        ',
    ]
      .filter(Boolean)
      .join('\n');

    const blob = new Blob([textLines], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tax-invoice-${order.invoiceNumber || order.orderNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Tax Invoice Receipt" size="sm">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--r8-space-4)' }}>
        {/* Thermal Receipt Body */}
        <div
          id="printable-receipt"
          style={{
            border: '1px dashed #CBD5E1',
            padding: '16px',
            borderRadius: 'var(--r8-radius-md)',
            backgroundColor: '#FDFBF7',
            color: '#0F172A',
            fontFamily: 'monospace',
            boxSizing: 'border-box',
          }}
        >
          {/* Business Header */}
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                backgroundColor: 'var(--r8-brand-primary)',
                color: '#FFFFFF',
                marginBottom: '4px',
              }}
            >
              <UtensilsCrossed size={16} />
            </div>
            <h4
              style={{
                fontFamily: 'inherit',
                fontSize: '1.1rem',
                fontWeight: 900,
                color: '#111827',
                margin: 0,
                letterSpacing: '0.02em',
              }}
            >
              {settings.name.toUpperCase()}
            </h4>
            <p style={{ fontSize: '0.68rem', color: '#64748B', lineHeight: 1.3, marginTop: '2px' }}>
              {settings.address}, {settings.city}
              <br />
              Tel: {settings.phone}
            </p>
            <div
              style={{
                marginTop: '4px',
                display: 'inline-block',
                padding: '2px 8px',
                borderRadius: '4px',
                backgroundColor: '#F1F5F9',
                fontSize: '0.74rem',
                fontWeight: 800,
                color: '#0F172A',
                border: '1px solid #E2E8F0',
              }}
            >
              PAN/VAT NO: {settings.panNumber}
            </div>
            <div
              style={{
                marginTop: '6px',
                fontSize: '0.82rem',
                fontWeight: 900,
                color: 'var(--r8-brand-primary)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              {isVat ? 'TAX INVOICE (कर बिजक)' : 'PAN BILL (बिल)'}
            </div>
          </div>

          {/* Invoice Metadata */}
          <div
            style={{
              fontSize: '0.72rem',
              color: '#334155',
              borderTop: '1px dashed #CBD5E1',
              borderBottom: '1px dashed #CBD5E1',
              padding: '6px 0',
              marginBottom: '8px',
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: '3px',
            }}
          >
            <span>
              <strong>INV:</strong> {order.invoiceNumber || `INV-${order.orderNumber}`}
            </span>
            <span style={{ textAlign: 'right' }}>
              <strong>TABLE:</strong> {order.tableNumber ? `Table ${order.tableNumber}` : 'Takeaway'}
            </span>
            <span>
              <strong>DATE (BS):</strong> {order.dateBS}
            </span>
            <span style={{ textAlign: 'right' }}>
              <strong>TIME:</strong> {new Date(order.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span>
              <strong>CAPTAIN:</strong> {order.serverName}
            </span>
            <span style={{ textAlign: 'right' }}>
              <strong>MODE:</strong> {order.paymentMethod?.toUpperCase()}
            </span>

            {order.customerName && (
              <span style={{ gridColumn: 'span 2' }}>
                <strong>BUYER:</strong> {order.customerName}
              </span>
            )}

            {order.customerPan && (
              <span style={{ gridColumn: 'span 2', color: 'var(--r8-brand-primary)' }}>
                <strong>BUYER PAN:</strong> {order.customerPan}
              </span>
            )}
          </div>

          {/* Items Breakdown */}
          <div style={{ marginBottom: '10px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.7rem',
                fontWeight: 800,
                color: '#64748B',
                borderBottom: '1px solid #E2E8F0',
                paddingBottom: '2px',
                marginBottom: '4px',
              }}
            >
              <span>PARTICULARS</span>
              <span>AMOUNT</span>
            </div>
            {order.items.map((it, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.74rem',
                  padding: '2px 0',
                }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '230px' }}>
                  {it.quantity}x {it.name}
                </span>
                <span style={{ fontWeight: 600 }}>{formatNPR(it.price * it.quantity)}</span>
              </div>
            ))}
          </div>

          {/* Nepal Tax Calculations */}
          <div
            style={{
              borderTop: '1px dashed #CBD5E1',
              paddingTop: '6px',
              fontSize: '0.74rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Gross Amount:</span>
              <span>{formatNPR(order.subtotal)}</span>
            </div>

            {order.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--r8-brand-coral)' }}>
                <span>Discount:</span>
                <span>-{formatNPR(order.discount)}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
              <span>Taxable Amount (करयोग्य):</span>
              <span>{formatNPR(order.taxableAmount || order.subtotal - order.discount)}</span>
            </div>

            {isVat && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--r8-brand-primary)', fontWeight: 700 }}>
                <span>13% VAT (मू.अ.कर):</span>
                <span>+{formatNPR(order.tax)}</span>
              </div>
            )}

            {order.tip > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Voluntary Gratuity:</span>
                <span>+{formatNPR(order.tip)}</span>
              </div>
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 900,
                fontSize: '0.98rem',
                borderTop: '1px solid #0F172A',
                paddingTop: '4px',
                marginTop: '4px',
              }}
            >
              <span>GRAND TOTAL (जम्मा):</span>
              <span>{formatNPR(order.total)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#64748B', marginTop: '2px' }}>
              <span>Payment Mode:</span>
              <span>{order.paymentMethod?.toUpperCase()} (Approved)</span>
            </div>
          </div>

          {/* Fonepay QR on Bottom of Receipt */}
          <div
            style={{
              textAlign: 'center',
              marginTop: '12px',
              paddingTop: '8px',
              borderTop: '1px dashed #CBD5E1',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                margin: '0 auto 4px',
                backgroundColor: '#FFFFFF',
                borderRadius: '6px',
                border: '1px solid #E2E8F0',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <QrCode size={48} color="var(--r8-brand-primary)" />
            </div>
            <p style={{ fontSize: '0.64rem', color: '#64748B', fontWeight: 700, margin: 0 }}>
              Scan Fonepay QR for Digital Receipt
            </p>
            <p style={{ fontSize: '0.62rem', color: '#94A3B8', marginTop: '2px', marginBottom: 0 }}>
              *Computer generated tax invoice compliant with IRD Nepal*
            </p>
          </div>
        </div>

        {/* Modal Buttons */}
        <div style={{ display: 'flex', gap: 'var(--r8-space-3)' }}>
          <Button
            variant="secondary"
            onClick={handleDownload}
            style={{ flex: 1 }}
          >
            <Download size={14} style={{ marginRight: '6px' }} />
            <span>Download</span>
          </Button>
          <Button
            variant="primary"
            onClick={handlePrint}
            style={{ flex: 1.2 }}
          >
            <Printer size={14} style={{ marginRight: '6px' }} />
            <span>Print Tax Invoice</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};
