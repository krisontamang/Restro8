import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Modal, Button, PriceDisplay, Badge } from '../ui';
import {
  Banknote,
  Receipt,
  AlertTriangle,
  CheckCircle2,
  Printer,
  X,
  CreditCard,
  QrCode,
  ShieldCheck,
  Calendar,
  Clock,
  User,
} from 'lucide-react';
import { formatNPR, getNepaliDate } from '../../utils/nepalDate';

interface ShiftCloseModalProps {
  onClose: () => void;
}

export const ShiftCloseModal: React.FC<ShiftCloseModalProps> = ({ onClose }) => {
  const { activeShift, closeShift, settings } = useRestaurant();
  const [actualCash, setActualCash] = useState<string>('');
  const [closingNotes, setClosingNotes] = useState<string>('');
  const [isClosed, setIsClosed] = useState<boolean>(false);
  const [closedSummary, setClosedSummary] = useState<any>(null);

  const { formattedBS, formattedAD } = getNepaliDate();

  if (!activeShift) {
    return (
      <Modal isOpen={true} onClose={onClose} title="Shift Register" size="md">
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <CheckCircle2 size={44} style={{ color: 'var(--r8-color-success)', margin: '0 auto 12px' }} />
          <h3 style={{ margin: '0 0 8px', color: 'var(--r8-text-primary)' }}>No Active Shift Open</h3>
          <p style={{ color: 'var(--r8-text-muted)', fontSize: '0.88rem', margin: '0 0 16px' }}>
            All registers are currently balanced and closed. A new shift will automatically commence upon cashier sign-in.
          </p>
          <Button variant="secondary" onClick={onClose}>
            Close Window
          </Button>
        </div>
      </Modal>
    );
  }

  const expectedCash = activeShift.expectedCash;
  const countedNumber = parseFloat(actualCash) || 0;
  const variance = countedNumber - expectedCash;

  const handleConfirmClose = () => {
    const summary = closeShift(countedNumber, closingNotes);
    if (summary) {
      setClosedSummary(summary);
      setIsClosed(true);
    }
  };

  const handlePrintZReport = () => {
    const printWindow = window.open('', '_blank', 'width=420,height=650');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>RESTRO8 - Daily Z-Report Shift #${activeShift.shiftNumber}</title>
            <style>
              body { font-family: 'Courier New', Courier, monospace; font-size: 13px; line-height: 1.4; color: #111; padding: 20px; }
              .center { text-align: center; }
              .divider { border-top: 1px dashed #444; margin: 10px 0; }
              .row { display: flex; justify-content: space-between; margin: 4px 0; }
              .bold { font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="center">
              <div class="bold" style="font-size: 16px;">${settings.name}</div>
              <div>${settings.address}, ${settings.city}</div>
              <div>IRD PAN: ${settings.panNumber}</div>
              <div class="bold" style="margin-top: 6px;">DAILY REGISTER CLOSING (Z-REPORT)</div>
            </div>
            <div class="divider"></div>
            <div class="row"><span>Date (BS):</span><span>${formattedBS}</span></div>
            <div class="row"><span>Date (AD):</span><span>${formattedAD}</span></div>
            <div class="row"><span>Shift #:</span><span>${activeShift.shiftNumber}</span></div>
            <div class="row"><span>Cashier:</span><span>${activeShift.cashierName}</span></div>
            <div class="row"><span>Opened At:</span><span>${new Date(activeShift.openedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
            <div class="row"><span>Closed At:</span><span>${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
            <div class="divider"></div>
            <div class="row"><span>Opening Cash Float:</span><span class="bold">Rs. ${activeShift.openingFloat.toLocaleString()}</span></div>
            <div class="row"><span>Cash Sales:</span><span class="bold">Rs. ${activeShift.cashSales.toLocaleString()}</span></div>
            <div class="row"><span>Digital Payments (QR/Card):</span><span class="bold">Rs. ${activeShift.digitalSales.toLocaleString()}</span></div>
            <div class="divider"></div>
            <div class="row bold"><span>Expected Drawer Cash:</span><span>Rs. ${expectedCash.toLocaleString()}</span></div>
            <div class="row bold"><span>Counted Actual Cash:</span><span>Rs. ${countedNumber.toLocaleString()}</span></div>
            <div class="row bold" style="font-size: 14px;">
              <span>Variance (Over / Short):</span>
              <span>${variance === 0 ? 'Rs. 0.00 (Balanced)' : variance > 0 ? `+Rs. ${variance.toLocaleString()} (Over)` : `-Rs. ${Math.abs(variance).toLocaleString()} (Short)`}</span>
            </div>
            <div class="divider"></div>
            ${closingNotes ? `<div style="margin: 8px 0;"><strong>Remarks:</strong> ${closingNotes}</div><div class="divider"></div>` : ''}
            <div class="center" style="margin-top: 15px; font-size: 11px;">
              <div>RESTRO8 Restaurant Operating System</div>
              <div>Audit Trail Verified • IRD Compliant</div>
            </div>
            <script>window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const addDenomination = (amount: number) => {
    const curr = parseFloat(actualCash) || 0;
    setActualCash(String(curr + amount));
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isClosed ? "Shift Closed • Z-Report Generated" : `Shift Closing & Cash Reconciliation #${activeShift.shiftNumber}`}
      size="md"
    >
      {isClosed && closedSummary ? (
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              padding: '16px',
              borderRadius: 'var(--r8-radius-lg)',
              backgroundColor: closedSummary.difference === 0 ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
              border: `1px solid ${closedSummary.difference === 0 ? 'var(--r8-color-success)' : 'var(--r8-color-warning)'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            {closedSummary.difference === 0 ? (
              <CheckCircle2 size={24} style={{ color: 'var(--r8-color-success)', flexShrink: 0 }} />
            ) : (
              <AlertTriangle size={24} style={{ color: 'var(--r8-color-warning)', flexShrink: 0 }} />
            )}
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.94rem', color: 'var(--r8-text-primary)' }}>
                {closedSummary.difference === 0 ? 'Drawer Reconciled with Zero Variance' : `Drawer Closed with Rs. ${Math.abs(closedSummary.difference).toLocaleString()} ${closedSummary.difference > 0 ? 'Overage' : 'Shortage'}`}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--r8-text-secondary)', marginTop: '2px' }}>
                Z-Report registered in the master audit ledger.
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              padding: '14px',
              backgroundColor: 'var(--r8-bg-surface-elevated)',
              borderRadius: 'var(--r8-radius-md)',
              border: '1px solid var(--r8-border-subtle)',
            }}
          >
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--r8-text-muted)', display: 'block' }}>Expected Cash</span>
              <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--r8-text-primary)' }}>
                Rs. {closedSummary.expectedCash.toLocaleString()}
              </span>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--r8-text-muted)', display: 'block' }}>Counted Cash</span>
              <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--r8-text-primary)' }}>
                Rs. {closedSummary.actualCash.toLocaleString()}
              </span>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--r8-text-muted)', display: 'block' }}>Variance</span>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  color: closedSummary.difference === 0 ? 'var(--r8-color-success)' : 'var(--r8-color-warning)',
                }}
              >
                {closedSummary.difference >= 0 ? `+Rs. ${closedSummary.difference}` : `-Rs. ${Math.abs(closedSummary.difference)}`}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <Button
              variant="primary"
              style={{ flex: 1 }}
              leftIcon={<Printer size={15} />}
              onClick={handlePrintZReport}
            >
              Print Z-Report
            </Button>
            <Button variant="secondary" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      ) : (
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Shift Header Meta */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 14px',
              backgroundColor: 'var(--r8-bg-surface-elevated)',
              borderRadius: 'var(--r8-radius-md)',
              border: '1px solid var(--r8-border-subtle)',
              fontSize: '0.82rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--r8-text-secondary)' }}>
              <User size={14} style={{ color: 'var(--r8-brand-primary)' }} />
              <span>{activeShift.cashierName}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--r8-text-muted)' }}>
              <Clock size={14} />
              <span>Started: {new Date(activeShift.openedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
            }}
          >
            <div
              style={{
                padding: '12px',
                borderRadius: 'var(--r8-radius-md)',
                backgroundColor: 'var(--r8-bg-surface-elevated)',
                border: '1px solid var(--r8-border-subtle)',
              }}
            >
              <div style={{ fontSize: '0.72rem', color: 'var(--r8-text-muted)', marginBottom: '4px' }}>
                Opening Float
              </div>
              <div style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--r8-text-primary)' }}>
                Rs. {activeShift.openingFloat.toLocaleString()}
              </div>
            </div>

            <div
              style={{
                padding: '12px',
                borderRadius: 'var(--r8-radius-md)',
                backgroundColor: 'var(--r8-bg-surface-elevated)',
                border: '1px solid var(--r8-border-subtle)',
              }}
            >
              <div style={{ fontSize: '0.72rem', color: 'var(--r8-text-muted)', marginBottom: '4px' }}>
                Cash Invoices
              </div>
              <div style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--r8-color-success)' }}>
                +Rs. {activeShift.cashSales.toLocaleString()}
              </div>
            </div>

            <div
              style={{
                padding: '12px',
                borderRadius: 'var(--r8-radius-md)',
                backgroundColor: 'var(--r8-bg-surface-elevated)',
                border: '1px solid var(--r8-border-subtle)',
              }}
            >
              <div style={{ fontSize: '0.72rem', color: 'var(--r8-text-muted)', marginBottom: '4px' }}>
                Digital (QR/Card)
              </div>
              <div style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--r8-brand-primary)' }}>
                Rs. {activeShift.digitalSales.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Expected Cash in Drawer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              backgroundColor: 'rgba(14, 165, 233, 0.08)',
              borderRadius: 'var(--r8-radius-md)',
              border: '1px solid rgba(14, 165, 233, 0.25)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--r8-brand-primary)' }}>
                Expected Cash in Drawer:
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--r8-text-muted)' }}>
                Opening Float + Recorded Cash Receipts
              </div>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--r8-text-primary)' }}>
              Rs. {expectedCash.toLocaleString()}
            </div>
          </div>

          {/* Actual Cash Count Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--r8-text-primary)' }}>
              Actual Physical Cash Counted (NPR):
            </label>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontWeight: 700,
                  color: 'var(--r8-text-muted)',
                }}
              >
                Rs.
              </span>
              <input
                type="number"
                value={actualCash}
                onChange={(e) => setActualCash(e.target.value)}
                placeholder="Enter physical counted cash amount"
                autoFocus
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 42px',
                  borderRadius: 'var(--r8-radius-md)',
                  border: '1px solid var(--r8-border-default)',
                  backgroundColor: 'var(--r8-bg-surface)',
                  color: 'var(--r8-text-primary)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Quick denomination helper buttons */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[100, 500, 1000, 5000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => addDenomination(amt)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--r8-border-subtle)',
                    backgroundColor: 'var(--r8-bg-surface-elevated)',
                    color: 'var(--r8-text-secondary)',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  +{amt}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setActualCash(String(expectedCash))}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px dashed var(--r8-brand-primary)',
                  backgroundColor: 'rgba(14, 165, 233, 0.06)',
                  color: 'var(--r8-brand-primary)',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Exact Match (Rs. {expectedCash})
              </button>
            </div>
          </div>

          {/* Real-time Variance Badge */}
          {actualCash.trim() !== '' && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                borderRadius: 'var(--r8-radius-md)',
                backgroundColor: variance === 0 ? 'rgba(16, 185, 129, 0.08)' : variance > 0 ? 'rgba(59, 130, 246, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                border: `1px solid ${variance === 0 ? 'var(--r8-color-success)' : variance > 0 ? 'var(--r8-brand-primary)' : 'var(--r8-color-danger)'}`,
              }}
            >
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--r8-text-primary)' }}>
                Reconciliation Variance:
              </span>
              <span
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  color: variance === 0 ? 'var(--r8-color-success)' : variance > 0 ? 'var(--r8-brand-primary)' : 'var(--r8-color-danger)',
                }}
              >
                {variance === 0 ? 'Exact Match (Rs. 0.00)' : variance > 0 ? `+Rs. ${variance.toLocaleString()} Overage` : `-Rs. ${Math.abs(variance).toLocaleString()} Shortage`}
              </span>
            </div>
          )}

          {/* Notes Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.78rem', color: 'var(--r8-text-muted)' }}>
              Shift Closing Notes (Optional):
            </label>
            <input
              type="text"
              value={closingNotes}
              onChange={(e) => setClosingNotes(e.target.value)}
              placeholder="e.g. Returned Rs. 20 extra due to coin shortage"
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--r8-radius-md)',
                border: '1px solid var(--r8-border-subtle)',
                backgroundColor: 'var(--r8-bg-surface)',
                color: 'var(--r8-text-primary)',
                fontSize: '0.84rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <Button
              variant="accent"
              style={{ flex: 1 }}
              disabled={actualCash.trim() === ''}
              onClick={handleConfirmClose}
            >
              Close Shift & Generate Z-Report
            </Button>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
