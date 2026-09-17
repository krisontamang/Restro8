import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import {
  Search,
  Filter,
  MoreVertical,
  Plus,
  Calendar,
  ChevronDown,
  TrendingUp,
  ShoppingCart,
  Wallet,
  Receipt,
  ArrowDownLeft,
  ArrowUpRight,
  X,
  FileSpreadsheet,
  Download,
} from 'lucide-react';
interface TransactionRecord {
  id: string;
  sn: number;
  txnDate: string;
  txnNo: string;
  particular: string;
  txnType: 'Sales' | 'Purchase' | 'Income' | 'Expenses' | 'Payment In' | 'Payment Out';
  parties: string;
  pmtMode: 'Cash' | 'eSewa' | 'Khalti' | 'Fonepay' | 'Bank Transfer';
  amount: number;
  status: 'Completed' | 'Pending' | 'Cancelled';
  entryDate: string;
  entryBy: string;
}

export const FinanceTransactionsView: React.FC = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTxnDate, setSelectedTxnDate] = useState('This Year');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStaff, setSelectedStaff] = useState('All');
  const [selectedEntryDate, setSelectedEntryDate] = useState('This Year');
  const [selectedEntryBy, setSelectedEntryBy] = useState('All');
  const [selectedCustomer, setSelectedCustomer] = useState('All');
  const [selectedSupplier, setSelectedSupplier] = useState('All');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('All');

  const { orders } = useRestaurant();

  // Transactions data (starts with live paid orders + capability to add)
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const paidTxns: TransactionRecord[] = orders
      .filter((o) => o.paymentStatus === 'paid')
      .map((o, idx) => ({
        id: 'txn-' + o.id,
        sn: idx + 1,
        txnDate: o.createdAt.split('T')[0],
        txnNo: o.invoiceNumber || `TXN-${o.orderNumber}`,
        particular: `POS Sale - ${o.items.map((i) => i.name).slice(0, 2).join(', ')}${o.items.length > 2 ? '...' : ''}`,
        txnType: 'Sales',
        parties: o.customerName || (o.tableNumber ? `Table ${o.tableNumber}` : 'Walk-in Guest'),
        pmtMode: (o.paymentMethod === 'fonepay' ? 'Fonepay' : o.paymentMethod === 'esewa' ? 'eSewa' : o.paymentMethod === 'khalti' ? 'Khalti' : 'Cash') as TransactionRecord['pmtMode'],
        amount: o.total,
        status: 'Completed',
        entryDate: o.createdAt.split('T')[0],
        entryBy: o.serverName || 'Staff Lead',
      }));

    if (paidTxns.length > 0) {
      setTransactions((prev) => {
        const existingIds = new Set(prev.map((t) => t.id));
        const newItems = paidTxns.filter((t) => !existingIds.has(t.id));
        return [...newItems, ...prev];
      });
    }
  }, [orders]);

  // Form State for Adding Transaction
  const [newTxn, setNewTxn] = useState({
    particular: '',
    txnType: 'Sales' as TransactionRecord['txnType'],
    parties: '',
    pmtMode: 'Cash' as TransactionRecord['pmtMode'],
    amount: '',
    status: 'Completed' as TransactionRecord['status'],
  });

  // Calculate KPI totals
  const totalSales = transactions
    .filter((t) => t.txnType === 'Sales')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalPurchase = transactions
    .filter((t) => t.txnType === 'Purchase')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalIncome = transactions
    .filter((t) => t.txnType === 'Income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.txnType === 'Expenses')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalPaymentIn = transactions
    .filter((t) => t.txnType === 'Payment In')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalPaymentOut = transactions
    .filter((t) => t.txnType === 'Payment Out')
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Filtered transactions
  const filteredTransactions = transactions.filter((txn) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match =
        txn.txnNo.toLowerCase().includes(q) ||
        txn.particular.toLowerCase().includes(q) ||
        txn.parties.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedType !== 'All' && txn.txnType !== selectedType) return false;
    if (selectedStatus !== 'All' && txn.status !== selectedStatus) return false;
    if (selectedPaymentMode !== 'All' && txn.pmtMode !== selectedPaymentMode) return false;
    return true;
  });

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTxn.particular.trim() || !newTxn.amount) {
      showToast('Please fill in required fields');
      return;
    }

    const nextId = String(Date.now());
    const nextSN = transactions.length + 1;
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const txnCode = `TXN-${String(nextSN).padStart(4, '0')}`;

    const record: TransactionRecord = {
      id: nextId,
      sn: nextSN,
      txnDate: dateStr,
      txnNo: txnCode,
      particular: newTxn.particular.trim(),
      txnType: newTxn.txnType,
      parties: newTxn.parties.trim() || 'General Customer',
      pmtMode: newTxn.pmtMode,
      amount: parseFloat(newTxn.amount) || 0,
      status: newTxn.status,
      entryDate: dateStr,
      entryBy: 'Kirtiman Tamang',
    };

    setTransactions([record, ...transactions]);
    setNewTxn({
      particular: '',
      txnType: 'Sales',
      parties: '',
      pmtMode: 'Cash',
      amount: '',
      status: 'Completed',
    });
    setIsAddModalOpen(false);
    showToast(`Transaction ${txnCode} created successfully`);
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRowIds.length === filteredTransactions.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(filteredTransactions.map((t) => t.id));
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Top Bar matching Screenshot 4: Title + Search + Filter + Actions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '18px',
        }}
      >
        <h1
          style={{
            fontSize: '1.45rem',
            fontWeight: 900,
            margin: 0,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            color: 'var(--color-foreground)',
          }}
        >
          Transactions
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Search Input Box */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '10px',
                color: 'var(--color-muted-foreground)',
              }}
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
                width: '160px',
              }}
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => showToast('Advanced filter activated')}
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

          {/* Add New Transaction Button */}
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
            <Plus size={15} /> Add New
          </button>

          {/* More Options Button (three dots) */}
          <button
            onClick={() => showToast('Exporting transactions...')}
            title="More options"
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

      {/* Horizontal 9 Filters Bar matching Screenshot 4 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '20px',
          scrollbarWidth: 'thin',
        }}
      >
        {/* 1. TXN Date */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            borderRadius: '7px',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-card)',
            fontSize: '0.78rem',
            color: 'var(--color-muted-foreground)',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
        >
          <span>TXN Date:</span>
          <span style={{ color: 'var(--color-foreground)', fontWeight: 600 }}>{selectedTxnDate}</span>
          <ChevronDown size={13} />
        </div>

        {/* 2. Status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            borderRadius: '7px',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-card)',
            fontSize: '0.78rem',
            color: 'var(--color-muted-foreground)',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
        >
          <span>Status:</span>
          <span style={{ color: 'var(--color-foreground)', fontWeight: 600 }}>{selectedStatus}</span>
          <ChevronDown size={13} />
        </div>

        {/* 3. Type */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            borderRadius: '7px',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-card)',
            fontSize: '0.78rem',
            color: 'var(--color-muted-foreground)',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
        >
          <span>Type:</span>
          <span style={{ color: 'var(--color-foreground)', fontWeight: 600 }}>{selectedType}</span>
          <ChevronDown size={13} />
        </div>

        {/* 4. Staff */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            borderRadius: '7px',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-card)',
            fontSize: '0.78rem',
            color: 'var(--color-muted-foreground)',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
        >
          <span>Staff:</span>
          <span style={{ color: 'var(--color-foreground)', fontWeight: 600 }}>{selectedStaff}</span>
          <ChevronDown size={13} />
        </div>

        {/* 5. Entry Date */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            borderRadius: '7px',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-card)',
            fontSize: '0.78rem',
            color: 'var(--color-muted-foreground)',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
        >
          <span>Entry Date:</span>
          <span style={{ color: 'var(--color-foreground)', fontWeight: 600 }}>{selectedEntryDate}</span>
          <ChevronDown size={13} />
        </div>

        {/* 6. Entry By */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            borderRadius: '7px',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-card)',
            fontSize: '0.78rem',
            color: 'var(--color-muted-foreground)',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
        >
          <span>Entry By:</span>
          <span style={{ color: 'var(--color-foreground)', fontWeight: 600 }}>{selectedEntryBy}</span>
          <ChevronDown size={13} />
        </div>

        {/* 7. Customer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            borderRadius: '7px',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-card)',
            fontSize: '0.78rem',
            color: 'var(--color-muted-foreground)',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
        >
          <span>Customer:</span>
          <span style={{ color: 'var(--color-foreground)', fontWeight: 600 }}>{selectedCustomer}</span>
          <ChevronDown size={13} />
        </div>

        {/* 8. Supplier */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            borderRadius: '7px',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-card)',
            fontSize: '0.78rem',
            color: 'var(--color-muted-foreground)',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
        >
          <span>Supplier:</span>
          <span style={{ color: 'var(--color-foreground)', fontWeight: 600 }}>{selectedSupplier}</span>
          <ChevronDown size={13} />
        </div>

        {/* 9. Payment Mode */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            borderRadius: '7px',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-card)',
            fontSize: '0.78rem',
            color: 'var(--color-muted-foreground)',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
        >
          <span>Payment Mode:</span>
          <span style={{ color: 'var(--color-foreground)', fontWeight: 600 }}>{selectedPaymentMode}</span>
          <ChevronDown size={13} />
        </div>
      </div>

      {/* 6 KPI Cards strip matching Screenshot 4 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '12px',
          marginBottom: '22px',
        }}
      >
        {/* Sales */}
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '10px',
            padding: '14px 16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
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
              <TrendingUp size={13} />
            </div>
            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-foreground)' }}>
              Sales
            </span>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
            Rs {totalSales}
          </div>
        </div>

        {/* Purchase */}
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '10px',
            padding: '14px 16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
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
              <ShoppingCart size={13} />
            </div>
            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-foreground)' }}>
              Purchase
            </span>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
            Rs {totalPurchase}
          </div>
        </div>

        {/* Income */}
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '10px',
            padding: '14px 16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
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
              <Wallet size={13} />
            </div>
            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-foreground)' }}>
              Income
            </span>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
            Rs {totalIncome}
          </div>
        </div>

        {/* Expenses */}
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '10px',
            padding: '14px 16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
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
              <Receipt size={13} />
            </div>
            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-foreground)' }}>
              Expenses
            </span>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
            Rs {totalExpenses}
          </div>
        </div>

        {/* Payment In */}
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '10px',
            padding: '14px 16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                backgroundColor: '#0D9488',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ArrowDownLeft size={13} />
            </div>
            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-foreground)' }}>
              Payment In
            </span>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
            Rs {totalPaymentIn}
          </div>
        </div>

        {/* Payment Out */}
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '10px',
            padding: '14px 16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
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
              <ArrowUpRight size={13} />
            </div>
            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-foreground)' }}>
              Payment Out
            </span>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
            Rs {totalPaymentOut}
          </div>
        </div>
      </div>

      {/* Transactions Table Container matching Screenshot 4 */}
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
            {/* Table Header Columns matching Screenshot 4:
                SN | TXN Date | TXN No | Particular | TXN Type | Parties | PMT Mode | Amount | Status | Entry Date | Entry By */}
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-card-elevated)',
                  color: 'var(--color-foreground)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                }}
              >
                <th style={{ padding: '14px 16px', width: '50px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={
                        filteredTransactions.length > 0 &&
                        selectedRowIds.length === filteredTransactions.length
                      }
                      onChange={toggleSelectAll}
                      style={{ cursor: 'pointer', borderRadius: '4px' }}
                    />
                    <span>SN</span>
                  </div>
                </th>
                <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>TXN Date</th>
                <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>TXN No</th>
                <th style={{ padding: '14px 16px', minWidth: '180px' }}>Particular</th>
                <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>TXN Type</th>
                <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Parties</th>
                <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>PMT Mode</th>
                <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Amount</th>
                <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Status</th>
                <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Entry Date</th>
                <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Entry By</th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.length === 0 ? (
                /* Authentic RestroX Empty State matching Screenshot 4 */
                <tr>
                  <td colSpan={11} style={{ padding: '64px 20px', textAlign: 'center' }}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {/* Fanned 3 Colored Cards Illustration */}
                      <div
                        style={{
                          position: 'relative',
                          width: '120px',
                          height: '100px',
                          marginBottom: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {/* Green Card (left -20deg) */}
                        <div
                          style={{
                            position: 'absolute',
                            width: '46px',
                            height: '60px',
                            borderRadius: '6px',
                            backgroundColor: '#10B981',
                            transform: 'rotate(-20deg) translate(-16px, 2px)',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF',
                          }}
                        >
                          <FileSpreadsheet size={20} />
                        </div>

                        {/* Purple Card (right +20deg) */}
                        <div
                          style={{
                            position: 'absolute',
                            width: '46px',
                            height: '60px',
                            borderRadius: '6px',
                            backgroundColor: '#8B5CF6',
                            transform: 'rotate(20deg) translate(16px, 2px)',
                            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.25)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF',
                          }}
                        >
                          <Receipt size={20} />
                        </div>

                        {/* Blue Center Card */}
                        <div
                          style={{
                            position: 'relative',
                            width: '50px',
                            height: '66px',
                            borderRadius: '7px',
                            backgroundColor: '#2563EB',
                            boxShadow: '0 6px 16px rgba(37, 99, 235, 0.35)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            padding: '8px',
                            zIndex: 2,
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
                              width: '22px',
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
                        No transaction found
                      </h3>
                      <p
                        style={{
                          fontSize: '0.84rem',
                          color: 'var(--color-muted-foreground)',
                          margin: '0 0 16px 0',
                        }}
                      >
                        Create a new transaction or import a new data.
                      </p>

                      <button
                        onClick={() => setIsAddModalOpen(true)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 18px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--r8-brand-primary)',
                          color: '#FFFFFF',
                          fontSize: '0.84rem',
                          fontWeight: 700,
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <Plus size={15} /> Create Transaction
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn) => {
                  const isChecked = selectedRowIds.includes(txn.id);
                  return (
                    <tr
                      key={txn.id}
                      style={{
                        borderBottom: '1px solid var(--color-border)',
                        backgroundColor: isChecked ? 'rgba(14, 165, 233, 0.04)' : 'transparent',
                      }}
                    >
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSelectRow(txn.id)}
                            style={{ cursor: 'pointer', borderRadius: '4px' }}
                          />
                          <span>{txn.sn}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--color-muted-foreground)' }}>
                        {txn.txnDate}
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 600 }}>{txn.txnNo}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 600 }}>{txn.particular}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            backgroundColor:
                              txn.txnType === 'Sales'
                                ? 'rgba(139, 92, 246, 0.1)'
                                : txn.txnType === 'Purchase'
                                ? 'rgba(245, 158, 11, 0.1)'
                                : txn.txnType === 'Income'
                                ? 'rgba(16, 185, 129, 0.1)'
                                : txn.txnType === 'Expenses'
                                ? 'rgba(239, 68, 68, 0.1)'
                                : 'rgba(37, 99, 235, 0.1)',
                            color:
                              txn.txnType === 'Sales'
                                ? '#8B5CF6'
                                : txn.txnType === 'Purchase'
                                ? '#D97706'
                                : txn.txnType === 'Income'
                                ? '#10B981'
                                : txn.txnType === 'Expenses'
                                ? '#EF4444'
                                : '#2563EB',
                          }}
                        >
                          {txn.txnType}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>{txn.parties}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '0.74rem',
                            fontWeight: 600,
                            backgroundColor: 'var(--color-muted)',
                          }}
                        >
                          {txn.pmtMode}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 700 }}>
                        Rs {txn.amount.toLocaleString()}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            backgroundColor:
                              txn.status === 'Completed'
                                ? 'rgba(16, 185, 129, 0.1)'
                                : 'rgba(245, 158, 11, 0.1)',
                            color: txn.status === 'Completed' ? '#10B981' : '#D97706',
                          }}
                        >
                          {txn.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--color-muted-foreground)' }}>
                        {txn.entryDate}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--color-muted-foreground)' }}>
                        {txn.entryBy}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row Selection Count matching Screenshot 4 */}
      <div
        style={{
          fontSize: '0.78rem',
          color: 'var(--color-muted-foreground)',
          padding: '0 4px',
        }}
      >
        {selectedRowIds.length} of {filteredTransactions.length} row(s) selected.
      </div>

      {/* Add New Transaction Modal */}
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
              maxWidth: '520px',
              boxShadow: 'var(--shadow-xl)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '18px 22px',
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
                Add New Transaction
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-muted-foreground)',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddTransaction} style={{ padding: '22px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Transaction Type */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      marginBottom: '6px',
                      color: 'var(--color-muted-foreground)',
                    }}
                  >
                    Transaction Type *
                  </label>
                  <select
                    value={newTxn.txnType}
                    onChange={(e) =>
                      setNewTxn({ ...newTxn, txnType: e.target.value as TransactionRecord['txnType'] })
                    }
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-card)',
                      color: 'var(--color-foreground)',
                      fontSize: '0.84rem',
                      outline: 'none',
                    }}
                  >
                    <option value="Sales">Sales</option>
                    <option value="Purchase">Purchase</option>
                    <option value="Income">Income</option>
                    <option value="Expenses">Expenses</option>
                    <option value="Payment In">Payment In</option>
                    <option value="Payment Out">Payment Out</option>
                  </select>
                </div>

                {/* Particular / Description */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      marginBottom: '6px',
                      color: 'var(--color-muted-foreground)',
                    }}
                  >
                    Particular / Description *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dining bill payment, Grocery restocking"
                    value={newTxn.particular}
                    onChange={(e) => setNewTxn({ ...newTxn, particular: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-card)',
                      color: 'var(--color-foreground)',
                      fontSize: '0.84rem',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Amount */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      marginBottom: '6px',
                      color: 'var(--color-muted-foreground)',
                    }}
                  >
                    Amount (Rs.) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="0.00"
                    value={newTxn.amount}
                    onChange={(e) => setNewTxn({ ...newTxn, amount: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-card)',
                      color: 'var(--color-foreground)',
                      fontSize: '0.84rem',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Parties */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      marginBottom: '6px',
                      color: 'var(--color-muted-foreground)',
                    }}
                  >
                    Party / Customer / Vendor
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Walk-in Customer, Dairy Suppliers"
                    value={newTxn.parties}
                    onChange={(e) => setNewTxn({ ...newTxn, parties: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-card)',
                      color: 'var(--color-foreground)',
                      fontSize: '0.84rem',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Payment Mode */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      marginBottom: '6px',
                      color: 'var(--color-muted-foreground)',
                    }}
                  >
                    Payment Mode
                  </label>
                  <select
                    value={newTxn.pmtMode}
                    onChange={(e) =>
                      setNewTxn({ ...newTxn, pmtMode: e.target.value as TransactionRecord['pmtMode'] })
                    }
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-card)',
                      color: 'var(--color-foreground)',
                      fontSize: '0.84rem',
                      outline: 'none',
                    }}
                  >
                    <option value="Cash">Cash (नगद)</option>
                    <option value="eSewa">eSewa Mobile Wallet</option>
                    <option value="Khalti">Khalti Digital Wallet</option>
                    <option value="Fonepay">Fonepay Direct QR</option>
                    <option value="Bank Transfer">Bank Transfer / POS</option>
                  </select>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                  marginTop: '22px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--color-border)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
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
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification Banner */}
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
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
