import React, { useState } from 'react';
import {
  Calendar,
  ChevronLeft,
  Plus,
  MoreVertical,
  ChevronDown,
  List,
  DollarSign,
  Award,
  Package,
  Layers,
  FileSpreadsheet,
  Receipt,
  Info,
  X,
} from 'lucide-react';

interface SalesInvoiceRecord {
  id: string;
  sn: number;
  txnDate: string;
  orderId: string;
  parties: string;
  orderType: string;
  txnAmount: number;
  pmtMode: string;
  status: string;
  entryDate: string;
  entryBy: string;
}

interface PurchaseBillRecord {
  id: string;
  sn: number;
  txnDate: string;
  billId: string;
  parties: string;
  billRefNo: string;
  txnAmount: number;
  mode: string;
  status: string;
  entryDate: string;
  entryBy: string;
}

export const DayBookView: React.FC = () => {
  // View mode: 'daybook' | 'sales-summary'
  const [currentView, setCurrentView] = useState<'daybook' | 'sales-summary'>('daybook');

  // Daybook top tabs: 'active' | 'history'
  const [daybookTab, setDaybookTab] = useState<'active' | 'history'>('active');

  // Sales Summary tabs: 'sales-invoice' | 'purchase-bill'
  const [summaryTab, setSummaryTab] = useState<'sales-invoice' | 'purchase-bill'>('sales-invoice');

  // Date range
  const [fromDate] = useState('Jul 17, 2025 12:00 AM');
  const [toDate, setToDate] = useState('2026-09-14 08:39 PM');

  // Modal states
  const [isCloseDayModalOpen, setIsCloseDayModalOpen] = useState(false);
  const [isAddInvoiceModalOpen, setIsAddInvoiceModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Daybook table values (dynamic state with default Rs 0 matching Screenshot 2)
  const [daybookData] = useState({
    receipts: {
      netSales: { bank: 0, counter: 0, owner: 0, total: 0, credit: 0 },
      purchaseReturn: { bank: 0, counter: 0, owner: 0, total: 0, credit: 0 },
      paymentIn: { bank: 0, counter: 0, owner: 0, total: 0, credit: 0 },
      income: { bank: 0, counter: 0, owner: 0, total: 0, credit: 0 },
      balanceTfIn: { bank: 0, counter: 0, owner: 0, total: 0, credit: 0 },
    },
    payments: {
      purchase: { bank: 0, counter: 0, owner: 0, total: 0, credit: 0 },
      salesReturn: { bank: 0, counter: 0, owner: 0, total: 0, credit: 0 },
      paymentOut: { bank: 0, counter: 0, owner: 0, total: 0, credit: 0 },
      expenses: { bank: 0, counter: 0, owner: 0, total: 0, credit: 0 },
      balanceTfOut: { bank: 0, counter: 0, owner: 0, total: 0, credit: 0 },
    },
    openingBalance: { bank: 0, counter: 0, owner: 0, total: 0 },
  });

  // Sales invoices & purchase bills data (empty by default matching Screenshots 3 & 4)
  const [salesInvoices, setSalesInvoices] = useState<SalesInvoiceRecord[]>([]);
  const [purchaseBills] = useState<PurchaseBillRecord[]>([]);
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<string[]>([]);
  const [selectedBillIds] = useState<string[]>([]);

  // New Invoice Form
  const [newInvoice, setNewInvoice] = useState({
    party: 'Walk-in Guest',
    orderType: 'Dine-In',
    amount: '',
    pmtMode: 'Cash',
  });

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvoice.amount) return;

    const nextId = String(Date.now());
    const nextSN = salesInvoices.length + 1;
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];

    const record: SalesInvoiceRecord = {
      id: nextId,
      sn: nextSN,
      txnDate: dateStr,
      orderId: `ORD-${String(nextSN).padStart(4, '0')}`,
      parties: newInvoice.party,
      orderType: newInvoice.orderType,
      txnAmount: parseFloat(newInvoice.amount) || 0,
      pmtMode: newInvoice.pmtMode,
      status: 'Paid',
      entryDate: dateStr,
      entryBy: 'Kirtiman Tamang',
    };

    setSalesInvoices([record, ...salesInvoices]);
    setIsAddInvoiceModalOpen(false);
    setNewInvoice({ party: 'Walk-in Guest', orderType: 'Dine-In', amount: '', pmtMode: 'Cash' });
    showToast(`Invoice ${record.orderId} created successfully`);
  };

  /* =========================================================================
     VIEW: DAY BOOK > SALES SUMMARY (Screenshots 3 & 4)
     ========================================================================= */
  if (currentView === 'sales-summary') {
    return (
      <div style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
        {/* Breadcrumbs Header matching Screenshots 3 & 4: [<] Day Book > Sales Summary */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px',
          }}
        >
          <button
            onClick={() => setCurrentView('daybook')}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--color-foreground)',
            }}
            title="Back to Day Book"
          >
            <ChevronLeft size={18} />
          </button>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
            Day Book
          </span>
          <span style={{ color: 'var(--color-muted-foreground)', fontWeight: 600 }}>&gt;</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
            Sales Summary
          </span>
        </div>

        {/* Action Bar matching Screenshots 3 & 4 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '18px',
          }}
        >
          {/* Tabs: Sales Invoice / Purchase Bill */}
          <div
            style={{
              display: 'flex',
              backgroundColor: 'var(--color-muted)',
              padding: '3px',
              borderRadius: '8px',
              gap: '2px',
            }}
          >
            <button
              onClick={() => setSummaryTab('sales-invoice')}
              style={{
                padding: '7px 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: summaryTab === 'sales-invoice' ? 'var(--r8-brand-primary)' : 'transparent',
                color: summaryTab === 'sales-invoice' ? '#FFFFFF' : 'var(--color-foreground)',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Sales Invoice
            </button>
            <button
              onClick={() => setSummaryTab('purchase-bill')}
              style={{
                padding: '7px 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: summaryTab === 'purchase-bill' ? 'var(--r8-brand-primary)' : 'transparent',
                color: summaryTab === 'purchase-bill' ? '#FFFFFF' : 'var(--color-foreground)',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Purchase Bill
            </button>
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {summaryTab === 'sales-invoice' && (
              <button
                onClick={() => setIsAddInvoiceModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--r8-brand-primary)',
                  color: '#FFFFFF',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(14, 165, 233, 0.25)',
                }}
              >
                <Plus size={15} /> Add New{' '}
                <span
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.25)',
                    padding: '1px 5px',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                  }}
                >
                  N
                </span>
              </button>
            )}

            <button
              onClick={() => showToast('Export options')}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-card)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--color-muted-foreground)',
              }}
            >
              <MoreVertical size={16} />
            </button>
          </div>
        </div>

        {/* 3 KPI Cards matching Screenshots 3 and 4 */}
        {summaryTab === 'sales-invoice' ? (
          /* Screenshot 3 KPI Cards */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '14px',
              marginBottom: '22px',
            }}
          >
            {/* Total Orders */}
            <div
              style={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                padding: '16px 18px',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <List size={14} />
                </div>
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-foreground)' }}>
                  Total Orders
                </span>
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
                {salesInvoices.length}
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '14px',
                  color: '#3B82F6',
                }}
              >
                <Info size={14} />
              </div>
            </div>

            {/* Total Sales */}
            <div
              style={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                padding: '16px 18px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    backgroundColor: '#8B5CF6',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <DollarSign size={14} />
                </div>
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-foreground)' }}>
                  Total Sales
                </span>
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
                Rs {salesInvoices.reduce((acc, curr) => acc + curr.txnAmount, 0).toLocaleString()}
              </div>
            </div>

            {/* Leading Payment Mode */}
            <div
              style={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                padding: '16px 18px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    backgroundColor: '#EF4444',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Award size={14} />
                </div>
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-foreground)' }}>
                  Leading Payment Mode
                </span>
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
                {salesInvoices.length > 0 ? salesInvoices[0].pmtMode : 'None'}
              </div>
            </div>
          </div>
        ) : (
          /* Screenshot 4 KPI Cards */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '14px',
              marginBottom: '22px',
            }}
          >
            {/* Total Quantity Purchased */}
            <div
              style={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                padding: '16px 18px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Layers size={14} />
                </div>
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-foreground)' }}>
                  Total Quantity Purchased
                </span>
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
                0
              </div>
            </div>

            {/* Total Purchases */}
            <div
              style={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                padding: '16px 18px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    backgroundColor: '#8B5CF6',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <DollarSign size={14} />
                </div>
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-foreground)' }}>
                  Total Purchases
                </span>
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
                Rs 0
              </div>
            </div>

            {/* Top Supplier */}
            <div
              style={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                padding: '16px 18px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      backgroundColor: '#EF4444',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Award size={14} />
                  </div>
                  <span
                    style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-foreground)' }}
                  >
                    Top Supplier
                  </span>
                </div>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    backgroundColor: '#E0F2FE',
                    color: '#0284C7',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                  }}
                >
                  0 times
                </span>
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
                No supplier
              </div>
            </div>
          </div>
        )}

        {/* Data Table Container */}
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            overflow: 'hidden',
            marginBottom: '14px',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '0.84rem',
              }}
            >
              <thead>
                {summaryTab === 'sales-invoice' ? (
                  /* Screenshot 3 Table Columns:
                     SN | TXN Date | ID | Parties | Order Type | TXN Amount | PMT Mode | Status | Entry Date | Entry By */
                  <tr
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-card-elevated)',
                      color: 'var(--color-foreground)',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                    }}
                  >
                    <th style={{ padding: '14px 16px', width: '50px' }}>SN</th>
                    <th style={{ padding: '14px 16px' }}>TXN Date</th>
                    <th style={{ padding: '14px 16px' }}>ID</th>
                    <th style={{ padding: '14px 16px' }}>Parties</th>
                    <th style={{ padding: '14px 16px' }}>Order Type</th>
                    <th style={{ padding: '14px 16px' }}>TXN Amount</th>
                    <th style={{ padding: '14px 16px' }}>PMT Mode</th>
                    <th style={{ padding: '14px 16px' }}>Status</th>
                    <th style={{ padding: '14px 16px' }}>Entry Date</th>
                    <th style={{ padding: '14px 16px' }}>Entry By</th>
                  </tr>
                ) : (
                  /* Screenshot 4 Table Columns:
                     SN | TXN Date | ID | Parties | Bill Reference Number | TXN Amount | Mode | Status | Entry Date | Entry By */
                  <tr
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-card-elevated)',
                      color: 'var(--color-foreground)',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                    }}
                  >
                    <th style={{ padding: '14px 16px', width: '50px' }}>SN</th>
                    <th style={{ padding: '14px 16px' }}>TXN Date</th>
                    <th style={{ padding: '14px 16px' }}>ID</th>
                    <th style={{ padding: '14px 16px' }}>Parties</th>
                    <th style={{ padding: '14px 16px' }}>Bill Reference Number</th>
                    <th style={{ padding: '14px 16px' }}>TXN Amount</th>
                    <th style={{ padding: '14px 16px' }}>Mode</th>
                    <th style={{ padding: '14px 16px' }}>Status</th>
                    <th style={{ padding: '14px 16px' }}>Entry Date</th>
                    <th style={{ padding: '14px 16px' }}>Entry By</th>
                  </tr>
                )}
              </thead>

              <tbody>
                {summaryTab === 'sales-invoice' ? (
                  salesInvoices.length === 0 ? (
                    /* Screenshot 3 Empty State */
                    <tr>
                      <td colSpan={10} style={{ padding: '64px 20px', textAlign: 'center' }}>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {/* Fanned 3-card graphic */}
                          <div
                            style={{
                              position: 'relative',
                              width: '120px',
                              height: '90px',
                              marginBottom: '18px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <div
                              style={{
                                position: 'absolute',
                                width: '44px',
                                height: '58px',
                                borderRadius: '6px',
                                backgroundColor: '#10B981',
                                transform: 'rotate(-20deg) translate(-16px, 2px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#FFFFFF',
                              }}
                            >
                              <FileSpreadsheet size={18} />
                            </div>
                            <div
                              style={{
                                position: 'absolute',
                                width: '44px',
                                height: '58px',
                                borderRadius: '6px',
                                backgroundColor: '#8B5CF6',
                                transform: 'rotate(20deg) translate(16px, 2px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#FFFFFF',
                              }}
                            >
                              <Receipt size={18} />
                            </div>
                            <div
                              style={{
                                position: 'relative',
                                width: '48px',
                                height: '64px',
                                borderRadius: '7px',
                                backgroundColor: '#2563EB',
                                zIndex: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px',
                                padding: '8px',
                              }}
                            >
                              <div
                                style={{
                                  width: '24px',
                                  height: '3px',
                                  borderRadius: '2px',
                                  backgroundColor: '#FFFFFF',
                                }}
                              />
                              <div
                                style={{
                                  width: '18px',
                                  height: '3px',
                                  borderRadius: '2px',
                                  backgroundColor: 'rgba(255,255,255,0.7)',
                                }}
                              />
                              <div
                                style={{
                                  width: '20px',
                                  height: '3px',
                                  borderRadius: '2px',
                                  backgroundColor: 'rgba(255,255,255,0.7)',
                                }}
                              />
                            </div>
                          </div>

                          <h3
                            style={{
                              fontSize: '1.2rem',
                              fontWeight: 800,
                              margin: '0 0 6px 0',
                              color: 'var(--color-foreground)',
                              fontFamily: "'Plus Jakarta Sans', sans-serif",
                            }}
                          >
                            No sales invoice found
                          </h3>
                          <p
                            style={{
                              fontSize: '0.84rem',
                              color: 'var(--color-muted-foreground)',
                              margin: 0,
                            }}
                          >
                            Create a new order or import a new data.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    salesInvoices.map((inv) => (
                      <tr key={inv.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '14px 16px' }}>{inv.sn}</td>
                        <td style={{ padding: '14px 16px', color: 'var(--color-muted-foreground)' }}>
                          {inv.txnDate}
                        </td>
                        <td style={{ padding: '14px 16px', fontWeight: 600 }}>{inv.orderId}</td>
                        <td style={{ padding: '14px 16px' }}>{inv.parties}</td>
                        <td style={{ padding: '14px 16px' }}>{inv.orderType}</td>
                        <td style={{ padding: '14px 16px', fontWeight: 700 }}>
                          Rs {inv.txnAmount.toLocaleString()}
                        </td>
                        <td style={{ padding: '14px 16px' }}>{inv.pmtMode}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span
                            style={{
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              backgroundColor: 'rgba(16, 185, 129, 0.1)',
                              color: '#10B981',
                            }}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', color: 'var(--color-muted-foreground)' }}>
                          {inv.entryDate}
                        </td>
                        <td style={{ padding: '14px 16px', color: 'var(--color-muted-foreground)' }}>
                          {inv.entryBy}
                        </td>
                      </tr>
                    ))
                  )
                ) : purchaseBills.length === 0 ? (
                  /* Screenshot 4 Empty State */
                  <tr>
                    <td colSpan={10} style={{ padding: '64px 20px', textAlign: 'center' }}>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {/* Fanned 3-card graphic */}
                        <div
                          style={{
                            position: 'relative',
                            width: '120px',
                            height: '90px',
                            marginBottom: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <div
                            style={{
                              position: 'absolute',
                              width: '44px',
                              height: '58px',
                              borderRadius: '6px',
                              backgroundColor: '#10B981',
                              transform: 'rotate(-20deg) translate(-16px, 2px)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#FFFFFF',
                            }}
                          >
                            <FileSpreadsheet size={18} />
                          </div>
                          <div
                            style={{
                              position: 'absolute',
                              width: '44px',
                              height: '58px',
                              borderRadius: '6px',
                              backgroundColor: '#8B5CF6',
                              transform: 'rotate(20deg) translate(16px, 2px)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#FFFFFF',
                            }}
                          >
                            <Receipt size={18} />
                          </div>
                          <div
                            style={{
                              position: 'relative',
                              width: '48px',
                              height: '64px',
                              borderRadius: '7px',
                              backgroundColor: '#2563EB',
                              zIndex: 2,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px',
                              padding: '8px',
                            }}
                          >
                            <div
                              style={{
                                width: '24px',
                                height: '3px',
                                borderRadius: '2px',
                                backgroundColor: '#FFFFFF',
                              }}
                            />
                            <div
                              style={{
                                width: '18px',
                                height: '3px',
                                borderRadius: '2px',
                                backgroundColor: 'rgba(255,255,255,0.7)',
                              }}
                            />
                            <div
                              style={{
                                width: '20px',
                                height: '3px',
                                borderRadius: '2px',
                                backgroundColor: 'rgba(255,255,255,0.7)',
                              }}
                            />
                          </div>
                        </div>

                        <h3
                          style={{
                            fontSize: '1.2rem',
                            fontWeight: 800,
                            margin: '0 0 6px 0',
                            color: 'var(--color-foreground)',
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                          }}
                        >
                          No purchase bill found
                        </h3>
                        <p
                          style={{
                            fontSize: '0.84rem',
                            color: 'var(--color-muted-foreground)',
                            margin: 0,
                          }}
                        >
                          Create a new purchase bill or import a new data.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  purchaseBills.map((bill) => (
                    <tr key={bill.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '14px 16px' }}>{bill.sn}</td>
                      <td style={{ padding: '14px 16px', color: 'var(--color-muted-foreground)' }}>
                        {bill.txnDate}
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 600 }}>{bill.billId}</td>
                      <td style={{ padding: '14px 16px' }}>{bill.parties}</td>
                      <td style={{ padding: '14px 16px' }}>{bill.billRefNo}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 700 }}>
                        Rs {bill.txnAmount.toLocaleString()}
                      </td>
                      <td style={{ padding: '14px 16px' }}>{bill.mode}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            color: '#10B981',
                          }}
                        >
                          {bill.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--color-muted-foreground)' }}>
                        {bill.entryDate}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--color-muted-foreground)' }}>
                        {bill.entryBy}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Row selection counter matching Screenshots 3 & 4 */}
        <div style={{ fontSize: '0.78rem', color: 'var(--color-muted-foreground)', padding: '0 4px' }}>
          0 of {summaryTab === 'sales-invoice' ? salesInvoices.length : purchaseBills.length} row(s)
          selected.
        </div>

        {/* Create Sales Invoice Modal */}
        {isAddInvoiceModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(3px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
              padding: '20px',
            }}
          >
            <div
              style={{
                backgroundColor: 'var(--color-card)',
                borderRadius: '14px',
                border: '1px solid var(--color-border)',
                width: '100%',
                maxWidth: '480px',
                boxShadow: 'var(--shadow-xl)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid var(--color-border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  Create Sales Invoice
                </h3>
                <button
                  onClick={() => setIsAddInvoiceModalOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted-foreground)' }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateInvoice} style={{ padding: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                      Customer / Guest Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newInvoice.party}
                      onChange={(e) => setNewInvoice({ ...newInvoice, party: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-card)',
                        color: 'var(--color-foreground)',
                        fontSize: '0.84rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                      Order Type
                    </label>
                    <select
                      value={newInvoice.orderType}
                      onChange={(e) => setNewInvoice({ ...newInvoice, orderType: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-card)',
                        color: 'var(--color-foreground)',
                        fontSize: '0.84rem',
                      }}
                    >
                      <option value="Dine-In">Dine-In (डाइन-इन)</option>
                      <option value="Takeaway">Takeaway (प्याक)</option>
                      <option value="Delivery">Delivery (होम डेलिभरी)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                      Total Amount (Rs.) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      placeholder="0.00"
                      value={newInvoice.amount}
                      onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-card)',
                        color: 'var(--color-foreground)',
                        fontSize: '0.84rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                      Payment Mode
                    </label>
                    <select
                      value={newInvoice.pmtMode}
                      onChange={(e) => setNewInvoice({ ...newInvoice, pmtMode: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-card)',
                        color: 'var(--color-foreground)',
                        fontSize: '0.84rem',
                      }}
                    >
                      <option value="Cash">Cash (नगद)</option>
                      <option value="Fonepay">Fonepay Direct QR</option>
                      <option value="eSewa">eSewa Mobile Wallet</option>
                      <option value="Khalti">Khalti Digital Wallet</option>
                      <option value="Card/POS">Card / POS Machine</option>
                    </select>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '10px',
                    marginTop: '20px',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--color-border)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setIsAddInvoiceModalOpen(false)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-card)',
                      color: 'var(--color-foreground)',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '8px 18px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: 'var(--r8-brand-primary)',
                      color: '#FFFFFF',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Save Invoice
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* =========================================================================
     VIEW: ACTIVE DAYBOOK TABLE MATRIX (Screenshot 2)
     ========================================================================= */
  return (
    <div style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Top Header: Active Daybook vs Daybook History tabs matching Screenshot 2 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setDaybookTab('active')}
            style={{
              padding: '7px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: daybookTab === 'active' ? 'var(--r8-brand-primary)' : 'var(--color-muted)',
              color: daybookTab === 'active' ? '#FFFFFF' : 'var(--color-foreground)',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Active Daybook
          </button>
          <button
            onClick={() => setDaybookTab('history')}
            style={{
              padding: '7px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: daybookTab === 'history' ? 'var(--r8-brand-primary)' : 'var(--color-muted)',
              color: daybookTab === 'history' ? '#FFFFFF' : 'var(--color-foreground)',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Daybook History
          </button>
        </div>

        <button
          onClick={() => showToast('Daybook options')}
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--color-muted-foreground)',
          }}
        >
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Date Range Selector & Action Buttons Bar matching Screenshot 2 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          marginBottom: '18px',
        }}
      >
        {/* Date Filter Range */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)' }}>
            From: <strong style={{ color: 'var(--color-foreground)' }}>{fromDate}</strong>
          </span>
          <span style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)' }}>To:</span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-card)',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--color-foreground)',
            }}
          >
            <span>{toDate}</span>
            <Calendar size={14} color="var(--color-muted-foreground)" />
          </div>
        </div>

        {/* Action Buttons: Sales Summary & Close the day */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setCurrentView('sales-summary')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-card)',
              color: 'var(--color-foreground)',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Sales Summary
          </button>

          <button
            onClick={() => setIsCloseDayModalOpen(true)}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'var(--r8-brand-primary)',
              color: '#FFFFFF',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(14, 165, 233, 0.25)',
            }}
          >
            Close the day
          </button>
        </div>
      </div>

      {/* Main Daybook Table Matrix matching Screenshot 2 exactly */}
      <div
        style={{
          backgroundColor: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          overflow: 'hidden',
          marginBottom: '20px',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '0.84rem',
            }}
          >
            {/* Columns matching Screenshot 2:
                PMT Accounts | Bank Account | Counter | Owner's Accou... | Total | Credit(Due) */}
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-card-elevated)',
                  color: 'var(--color-foreground)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                }}
              >
                <th style={{ padding: '14px 18px', minWidth: '220px' }}>PMT Accounts</th>
                <th style={{ padding: '14px 18px', minWidth: '130px' }}>Bank Account</th>
                <th style={{ padding: '14px 18px', minWidth: '130px' }}>Counter</th>
                <th style={{ padding: '14px 18px', minWidth: '150px' }}>Owner&apos;s Accou...</th>
                <th style={{ padding: '14px 18px', minWidth: '130px' }}>Total</th>
                <th style={{ padding: '14px 18px', minWidth: '130px' }}>Credit(Due)</th>
              </tr>
            </thead>

            <tbody>
              {/* SECTION: RECEIPTS */}
              <tr style={{ backgroundColor: 'rgba(0, 0, 0, 0.015)' }}>
                <td
                  colSpan={6}
                  style={{
                    padding: '12px 18px',
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    color: 'var(--color-foreground)',
                    textDecoration: 'underline',
                  }}
                >
                  Receipts
                </td>
              </tr>

              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '12px 18px', color: 'var(--color-foreground)' }}>Net Sales</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.receipts.netSales.bank}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.receipts.netSales.counter}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.receipts.netSales.owner}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.receipts.netSales.total}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.receipts.netSales.credit}</td>
              </tr>

              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '12px 18px', color: 'var(--color-foreground)' }}>Purchase Return</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.receipts.purchaseReturn.bank}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.receipts.purchaseReturn.counter}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.receipts.purchaseReturn.owner}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.receipts.purchaseReturn.total}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.receipts.purchaseReturn.credit}</td>
              </tr>

              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '12px 18px', color: 'var(--color-foreground)' }}>Payment In</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.receipts.paymentIn.bank}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.receipts.paymentIn.counter}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.receipts.paymentIn.owner}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.receipts.paymentIn.total}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.receipts.paymentIn.credit}</td>
              </tr>

              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '12px 18px', color: 'var(--color-foreground)' }}>Income</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.receipts.income.bank}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.receipts.income.counter}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.receipts.income.owner}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.receipts.income.total}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.receipts.income.credit}</td>
              </tr>

              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '12px 18px', color: 'var(--color-foreground)' }}>Balance T/F (IN)</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.receipts.balanceTfIn.bank}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.receipts.balanceTfIn.counter}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.receipts.balanceTfIn.owner}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.receipts.balanceTfIn.total}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.receipts.balanceTfIn.credit}</td>
              </tr>

              {/* Total Receipts [A] Row */}
              <tr
                style={{
                  borderBottom: '2px solid var(--color-border)',
                  backgroundColor: 'var(--color-card-elevated)',
                  fontWeight: 800,
                }}
              >
                <td style={{ padding: '13px 18px', color: 'var(--color-foreground)' }}>
                  Total Receipts [A]
                </td>
                <td style={{ padding: '13px 18px' }}>Rs 0</td>
                <td style={{ padding: '13px 18px' }}>Rs 0</td>
                <td style={{ padding: '13px 18px' }}>Rs 0</td>
                <td style={{ padding: '13px 18px' }}>Rs 0</td>
                <td style={{ padding: '13px 18px', color: 'var(--color-muted-foreground)' }}>-</td>
              </tr>

              {/* SECTION: PAYMENTS */}
              <tr style={{ backgroundColor: 'rgba(0, 0, 0, 0.015)' }}>
                <td
                  colSpan={6}
                  style={{
                    padding: '16px 18px 10px',
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    color: 'var(--color-foreground)',
                    textDecoration: 'underline',
                  }}
                >
                  Payments
                </td>
              </tr>

              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '12px 18px', color: 'var(--color-foreground)' }}>Purchase</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.payments.purchase.bank}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.payments.purchase.counter}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.payments.purchase.owner}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.payments.purchase.total}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.payments.purchase.credit}</td>
              </tr>

              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '12px 18px', color: 'var(--color-foreground)' }}>Sales Return</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.payments.salesReturn.bank}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.payments.salesReturn.counter}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.payments.salesReturn.owner}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.payments.salesReturn.total}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.payments.salesReturn.credit}</td>
              </tr>

              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '12px 18px', color: 'var(--color-foreground)' }}>Payment Out</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.payments.paymentOut.bank}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.payments.paymentOut.counter}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.payments.paymentOut.owner}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.payments.paymentOut.total}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.payments.paymentOut.credit}</td>
              </tr>

              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '12px 18px', color: 'var(--color-foreground)' }}>Expenses</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.payments.expenses.bank}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.payments.expenses.counter}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.payments.expenses.owner}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.payments.expenses.total}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.payments.expenses.credit}</td>
              </tr>

              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '12px 18px', color: 'var(--color-foreground)' }}>
                  Balance T/F (OUT)
                </td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.payments.balanceTfOut.bank}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.payments.balanceTfOut.counter}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.payments.balanceTfOut.owner}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.payments.balanceTfOut.total}</td>
                <td style={{ padding: '12px 18px' }}>Rs {daybookData.payments.balanceTfOut.credit}</td>
              </tr>

              {/* Total Payments [B] Row */}
              <tr
                style={{
                  borderBottom: '2px solid var(--color-border)',
                  backgroundColor: 'var(--color-card-elevated)',
                  fontWeight: 800,
                }}
              >
                <td style={{ padding: '13px 18px', color: 'var(--color-foreground)' }}>
                  Total Payments [B]
                </td>
                <td style={{ padding: '13px 18px' }}>Rs 0</td>
                <td style={{ padding: '13px 18px' }}>Rs 0</td>
                <td style={{ padding: '13px 18px' }}>Rs 0</td>
                <td style={{ padding: '13px 18px' }}>Rs 0</td>
                <td style={{ padding: '13px 18px', color: 'var(--color-muted-foreground)' }}>-</td>
              </tr>

              {/* RECONCILIATION SUMMARY ROWS matching Screenshot 2 */}
              <tr
                style={{
                  borderBottom: '1px solid var(--color-border)',
                  fontWeight: 700,
                }}
              >
                <td style={{ padding: '14px 18px', color: 'var(--color-foreground)' }}>
                  Net Receipt [C = A - B]
                </td>
                <td style={{ padding: '14px 18px' }}>Rs 0</td>
                <td style={{ padding: '14px 18px' }}>Rs 0</td>
                <td style={{ padding: '14px 18px' }}>Rs 0</td>
                <td style={{ padding: '14px 18px' }}>Rs 0</td>
                <td style={{ padding: '14px 18px', color: 'var(--color-muted-foreground)' }}>-</td>
              </tr>

              <tr
                style={{
                  borderBottom: '1px solid var(--color-border)',
                  color: 'var(--color-muted-foreground)',
                }}
              >
                <td style={{ padding: '14px 18px' }}>Opening balance (D)</td>
                <td style={{ padding: '14px 18px' }}>Rs 0</td>
                <td style={{ padding: '14px 18px' }}>Rs 0</td>
                <td style={{ padding: '14px 18px' }}>Rs 0</td>
                <td style={{ padding: '14px 18px' }}>Rs 0</td>
                <td style={{ padding: '14px 18px' }}>-</td>
              </tr>

              <tr
                style={{
                  backgroundColor: 'var(--color-card-elevated)',
                  fontWeight: 800,
                }}
              >
                <td style={{ padding: '14px 18px', color: 'var(--color-foreground)' }}>
                  Closing Balance [E = C + D]
                </td>
                <td style={{ padding: '14px 18px' }}>Rs 0</td>
                <td style={{ padding: '14px 18px' }}>Rs 0</td>
                <td style={{ padding: '14px 18px' }}>Rs 0</td>
                <td style={{ padding: '14px 18px' }}>Rs 0</td>
                <td style={{ padding: '14px 18px', color: 'var(--color-muted-foreground)' }}>-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Close the Day Modal */}
      {isCloseDayModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-card)',
              borderRadius: '14px',
              border: '1px solid var(--color-border)',
              width: '100%',
              maxWidth: '460px',
              boxShadow: 'var(--shadow-xl)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Daybook Settlement & Close Day
              </h3>
              <button
                onClick={() => setIsCloseDayModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted-foreground)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '20px' }}>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-muted-foreground)', margin: '0 0 16px 0' }}>
                Confirming day close will freeze today&apos;s transactions and carry over closing cash to tomorrow&apos;s opening balance.
              </p>

              <div
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--color-muted)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  fontSize: '0.82rem',
                  marginBottom: '16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Counter Physical Cash:</span>
                  <strong>Rs 0.00</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Bank POS Balance:</span>
                  <strong>Rs 0.00</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Calculated Closing:</span>
                  <strong style={{ color: '#10B981' }}>Rs 0.00</strong>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsCloseDayModalOpen(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-card)',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCloseDayModalOpen(false);
                    showToast('Day closed successfully. Daily book archived.');
                  }}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'var(--r8-brand-primary)',
                    color: '#FFFFFF',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Confirm & Close Day
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#1E293B',
            color: '#FFFFFF',
            padding: '10px 18px',
            borderRadius: '8px',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
            fontSize: '0.84rem',
            fontWeight: 600,
            zIndex: 150,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
