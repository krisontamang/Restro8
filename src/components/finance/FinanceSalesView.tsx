import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import {
  Search,
  Filter,
  MoreVertical,
  Plus,
  Calendar,
  ChevronDown,
  List,
  DollarSign,
  Award,
  RotateCcw,
  Star,
  FileSpreadsheet,
  Receipt,
  Info,
  X,
} from 'lucide-react';

interface SalesInvoiceItem {
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

interface SalesReturnItem {
  id: string;
  sn: number;
  txnDate: string;
  returnId: string;
  parties: string;
  txnAmount: number;
  pmtMode: string;
  status: string;
  entryDate: string;
  entryBy: string;
}

export const FinanceSalesView: React.FC = () => {
  // Tab: 'invoice' | 'returns'
  const [activeTab, setActiveTab] = useState<'invoice' | 'returns'>('invoice');

  // Filter dropdown states
  const [selectedTxnDate, setSelectedTxnDate] = useState('This Year');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedEntryDate, setSelectedEntryDate] = useState('This Year');
  const [selectedEntryBy, setSelectedEntryBy] = useState('All');
  const [selectedBilledBy, setSelectedBilledBy] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const { orders } = useRestaurant();

  // Data
  const [invoices, setInvoices] = useState<SalesInvoiceItem[]>([]);
  const [returns, setReturns] = useState<SalesReturnItem[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize completed and paid orders into sales invoices
  useEffect(() => {
    const paidInvoices: SalesInvoiceItem[] = orders
      .filter((o) => o.paymentStatus === 'paid')
      .map((o, idx) => ({
        id: o.id,
        sn: idx + 1,
        txnDate: o.createdAt.split('T')[0],
        orderId: o.invoiceNumber || `ORD-${o.orderNumber}`,
        parties: o.customerName || (o.tableNumber ? `Table ${o.tableNumber}` : 'Walk-in Guest'),
        orderType: o.orderType.toUpperCase(),
        txnAmount: o.total,
        pmtMode: (o.paymentMethod || 'Cash').toUpperCase(),
        status: 'Paid',
        entryDate: o.createdAt.split('T')[0],
        entryBy: o.serverName || 'Staff Lead',
      }));

    if (paidInvoices.length > 0) {
      setInvoices((prev) => {
        const existingIds = new Set(prev.map((i) => i.id));
        const newItems = paidInvoices.filter((i) => !existingIds.has(i.id));
        return [...newItems, ...prev];
      });
    }
  }, [orders]);

  // Form states
  const [newInvoice, setNewInvoice] = useState({
    party: 'Walk-in Guest',
    orderType: 'Dine-In',
    amount: '',
    pmtMode: 'Cash',
  });

  const [newReturn, setNewReturn] = useState({
    party: 'Walk-in Guest',
    amount: '',
    pmtMode: 'Cash',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];

    if (activeTab === 'invoice') {
      if (!newInvoice.amount) return;
      const nextSN = invoices.length + 1;
      const id = String(Date.now());
      const item: SalesInvoiceItem = {
        id,
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
      setInvoices([item, ...invoices]);
      showToast(`Sales invoice ${item.orderId} created`);
    } else {
      if (!newReturn.amount) return;
      const nextSN = returns.length + 1;
      const id = String(Date.now());
      const item: SalesReturnItem = {
        id,
        sn: nextSN,
        txnDate: dateStr,
        returnId: `RET-${String(nextSN).padStart(4, '0')}`,
        parties: newReturn.party,
        txnAmount: parseFloat(newReturn.amount) || 0,
        pmtMode: newReturn.pmtMode,
        status: 'Processed',
        entryDate: dateStr,
        entryBy: 'Kirtiman Tamang',
      };
      setReturns([item, ...returns]);
      showToast(`Sales return ${item.returnId} recorded`);
    }

    setIsAddModalOpen(false);
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const list = activeTab === 'invoice' ? invoices : returns;
    if (selectedRows.length === list.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(list.map((item) => item.id));
    }
  };

  const totalSales = invoices.reduce((acc, curr) => acc + curr.txnAmount, 0);
  const totalReturnsAmount = returns.reduce((acc, curr) => acc + curr.txnAmount, 0);

  return (
    <div style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Top Header matching Screenshots 1 & 2 */}
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
        {/* Tab Switcher: Sales Invoice vs Sales Returns */}
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
            onClick={() => {
              setActiveTab('invoice');
              setSelectedRows([]);
            }}
            style={{
              padding: '7px 18px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === 'invoice' ? 'var(--r8-brand-primary)' : 'transparent',
              color: activeTab === 'invoice' ? '#FFFFFF' : 'var(--color-foreground)',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Sales Invoice
          </button>
          <button
            onClick={() => {
              setActiveTab('returns');
              setSelectedRows([]);
            }}
            style={{
              padding: '7px 18px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === 'returns' ? 'var(--r8-brand-primary)' : 'transparent',
              color: activeTab === 'returns' ? '#FFFFFF' : 'var(--color-foreground)',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Sales Returns
          </button>
        </div>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search
              size={15}
              style={{ position: 'absolute', left: '10px', color: 'var(--color-muted-foreground)' }}
            />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '7px 12px 7px 32px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-card)',
                color: 'var(--color-foreground)',
                fontSize: '0.84rem',
                outline: 'none',
                width: '150px',
              }}
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => showToast('Filter applied')}
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
            <Filter size={14} color="var(--color-muted-foreground)" /> Filter
          </button>

          {/* Add New Button with [N] badge */}
          <button
            onClick={() => setIsAddModalOpen(true)}
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

          {/* More options button */}
          <button
            onClick={() => showToast('Options menu')}
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

      {/* Filter Bar with 4 Pills matching Screenshots 1 & 2 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          marginBottom: '20px',
        }}
      >
        {/* 1. TXN Date */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-card)',
            fontSize: '0.8rem',
            color: 'var(--color-muted-foreground)',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
        >
          <span>TXN Date:</span>
          <Calendar size={13} color="var(--color-muted-foreground)" />
          <span style={{ color: 'var(--color-foreground)', fontWeight: 600 }}>{selectedTxnDate}</span>
          <ChevronDown size={13} />
        </div>

        {/* 2. Status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-card)',
            fontSize: '0.8rem',
            color: 'var(--color-muted-foreground)',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
        >
          <span>Status:</span>
          <span style={{ color: 'var(--color-foreground)', fontWeight: 600 }}>{selectedStatus}</span>
          <ChevronDown size={13} />
        </div>

        {/* 3. Entry Date */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-card)',
            fontSize: '0.8rem',
            color: 'var(--color-muted-foreground)',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
        >
          <span>Entry Date:</span>
          <Calendar size={13} color="var(--color-muted-foreground)" />
          <span style={{ color: 'var(--color-foreground)', fontWeight: 600 }}>{selectedEntryDate}</span>
          <ChevronDown size={13} />
        </div>

        {/* 4. Entry By / Billed By */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-card)',
            fontSize: '0.8rem',
            color: 'var(--color-muted-foreground)',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
        >
          <span>{activeTab === 'invoice' ? 'Entry By:' : 'Billed By:'}</span>
          <span style={{ color: 'var(--color-foreground)', fontWeight: 600 }}>
            {activeTab === 'invoice' ? selectedEntryBy : selectedBilledBy}
          </span>
          <ChevronDown size={13} />
        </div>
      </div>

      {/* 3 KPI Cards matching Screenshots 1 & 2 */}
      {activeTab === 'invoice' ? (
        /* Screenshot 1 KPI Cards */
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
              {invoices.length}
            </div>
            <div style={{ position: 'absolute', bottom: '12px', right: '14px', color: '#3B82F6' }}>
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
              Rs {totalSales.toLocaleString()}
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
              {invoices.length > 0 ? invoices[0].pmtMode : 'None'}
            </div>
          </div>
        </div>
      ) : (
        /* Screenshot 2 KPI Cards */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '14px',
            marginBottom: '22px',
          }}
        >
          {/* Total Returns */}
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
                <RotateCcw size={14} />
              </div>
              <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-foreground)' }}>
                Total Returns
              </span>
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
              {returns.length}
            </div>
          </div>

          {/* Total Amount */}
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
                Total Amount
              </span>
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
              Rs {totalReturnsAmount.toLocaleString()}
            </div>
          </div>

          {/* Most Returned */}
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
                    backgroundColor: '#F59E0B',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Star size={14} />
                </div>
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-foreground)' }}>
                  Most Returned
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
                0
              </span>
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
              No Item
            </div>
          </div>
        </div>
      )}

      {/* Data Table matching Screenshots 1 & 2 */}
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
              {activeTab === 'invoice' ? (
                /* Screenshot 1 Columns:
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
                /* Screenshot 2 Columns:
                   SN | TXN Date | ID | Parties | TXN Amount | PMT Mode | Status | Entry Date | Entry By */
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
                  <th style={{ padding: '14px 16px' }}>TXN Amount</th>
                  <th style={{ padding: '14px 16px' }}>PMT Mode</th>
                  <th style={{ padding: '14px 16px' }}>Status</th>
                  <th style={{ padding: '14px 16px' }}>Entry Date</th>
                  <th style={{ padding: '14px 16px' }}>Entry By</th>
                </tr>
              )}
            </thead>

            <tbody>
              {activeTab === 'invoice' ? (
                invoices.length === 0 ? (
                  /* Screenshot 1 Empty State */
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
                            <div style={{ width: '24px', height: '3px', borderRadius: '2px', backgroundColor: '#FFFFFF' }} />
                            <div style={{ width: '18px', height: '3px', borderRadius: '2px', backgroundColor: 'rgba(255,255,255,0.7)' }} />
                            <div style={{ width: '20px', height: '3px', borderRadius: '2px', backgroundColor: 'rgba(255,255,255,0.7)' }} />
                          </div>
                        </div>

                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--color-foreground)' }}>
                          No sales invoice found
                        </h3>
                        <p style={{ fontSize: '0.84rem', color: 'var(--color-muted-foreground)', margin: 0 }}>
                          Create a new order or import a new data.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => (
                    <tr key={inv.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '14px 16px' }}>{inv.sn}</td>
                      <td style={{ padding: '14px 16px', color: 'var(--color-muted-foreground)' }}>{inv.txnDate}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 600 }}>{inv.orderId}</td>
                      <td style={{ padding: '14px 16px' }}>{inv.parties}</td>
                      <td style={{ padding: '14px 16px' }}>{inv.orderType}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 700 }}>Rs {inv.txnAmount.toLocaleString()}</td>
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
                      <td style={{ padding: '14px 16px', color: 'var(--color-muted-foreground)' }}>{inv.entryDate}</td>
                      <td style={{ padding: '14px 16px', color: 'var(--color-muted-foreground)' }}>{inv.entryBy}</td>
                    </tr>
                  ))
                )
              ) : returns.length === 0 ? (
                /* Screenshot 2 Empty State */
                <tr>
                  <td colSpan={9} style={{ padding: '64px 20px', textAlign: 'center' }}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
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
                          <div style={{ width: '24px', height: '3px', borderRadius: '2px', backgroundColor: '#FFFFFF' }} />
                          <div style={{ width: '18px', height: '3px', borderRadius: '2px', backgroundColor: 'rgba(255,255,255,0.7)' }} />
                          <div style={{ width: '20px', height: '3px', borderRadius: '2px', backgroundColor: 'rgba(255,255,255,0.7)' }} />
                        </div>
                      </div>

                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--color-foreground)' }}>
                        No sales returns found
                      </h3>
                      <p style={{ fontSize: '0.84rem', color: 'var(--color-muted-foreground)', margin: 0 }}>
                        Create a new sales return or import a new data.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                returns.map((ret) => (
                  <tr key={ret.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '14px 16px' }}>{ret.sn}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-muted-foreground)' }}>{ret.txnDate}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{ret.returnId}</td>
                    <td style={{ padding: '14px 16px' }}>{ret.parties}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 700 }}>Rs {ret.txnAmount.toLocaleString()}</td>
                    <td style={{ padding: '14px 16px' }}>{ret.pmtMode}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          color: '#EF4444',
                        }}
                      >
                        {ret.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-muted-foreground)' }}>{ret.entryDate}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-muted-foreground)' }}>{ret.entryBy}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row Selection Counter */}
      <div style={{ fontSize: '0.78rem', color: 'var(--color-muted-foreground)', padding: '0 4px' }}>
        0 of {activeTab === 'invoice' ? invoices.length : returns.length} row(s) selected.
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
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
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                {activeTab === 'invoice' ? 'Create Sales Invoice' : 'Create Sales Return'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted-foreground)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddEntry} style={{ padding: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Customer / Guest Name
                  </label>
                  <input
                    type="text"
                    required
                    value={activeTab === 'invoice' ? newInvoice.party : newReturn.party}
                    onChange={(e) =>
                      activeTab === 'invoice'
                        ? setNewInvoice({ ...newInvoice, party: e.target.value })
                        : setNewReturn({ ...newReturn, party: e.target.value })
                    }
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

                {activeTab === 'invoice' && (
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
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Amount (Rs.) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={activeTab === 'invoice' ? newInvoice.amount : newReturn.amount}
                    onChange={(e) =>
                      activeTab === 'invoice'
                        ? setNewInvoice({ ...newInvoice, amount: e.target.value })
                        : setNewReturn({ ...newReturn, amount: e.target.value })
                    }
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
                    value={activeTab === 'invoice' ? newInvoice.pmtMode : newReturn.pmtMode}
                    onChange={(e) =>
                      activeTab === 'invoice'
                        ? setNewInvoice({ ...newInvoice, pmtMode: e.target.value })
                        : setNewReturn({ ...newReturn, pmtMode: e.target.value })
                    }
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
                    <option value="Fonepay">Fonepay QR</option>
                    <option value="eSewa">eSewa Mobile Wallet</option>
                    <option value="Khalti">Khalti Digital Wallet</option>
                    <option value="Card/POS">Card / POS</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
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
                  {activeTab === 'invoice' ? 'Save Invoice' : 'Save Return'}
                </button>
              </div>
            </form>
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
