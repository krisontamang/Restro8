import React, { useState } from 'react';
import {
  Search,
  Filter,
  MoreVertical,
  ChevronDown,
  UserCheck,
  DollarSign,
  Award,
  Star,
  RefreshCw,
  Plus,
  Info,
  X,
  CreditCard,
  Building2,
  Wallet,
} from 'lucide-react';

interface AccountItem {
  id: string;
  sn: number;
  code: string;
  name: string;
  activeModes: string;
  type: 'Cash' | 'Bank';
  balance: number;
  description: string;
  status: boolean;
}

interface ModeItem {
  id: string;
  sn: number;
  code?: string;
  name: string;
  isBrand?: 'fonepay' | 'nepalpay';
  settlementCode: string;
  settlementAccount: string;
  description: string;
  txnQty: number;
  txnTotal: number;
  status: boolean;
}

export const FinanceCashBanksView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'accounts' | 'modes'>('accounts');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Seeded Accounts matching Screenshot 2
  const [accounts, setAccounts] = useState<AccountItem[]>([
    {
      id: '1',
      sn: 1,
      code: 'CO',
      name: 'Counter',
      activeModes: 'Cash',
      type: 'Cash',
      balance: 0,
      description: '-',
      status: true,
    },
    {
      id: '2',
      sn: 2,
      code: 'BA',
      name: 'Bank Account',
      activeModes: 'Card, Fonepay, Nepal Pay',
      type: 'Bank',
      balance: 0,
      description: '-',
      status: true,
    },
    {
      id: '3',
      sn: 3,
      code: 'OA',
      name: "Owner's Account",
      activeModes: 'Bank Transfer',
      type: 'Cash',
      balance: 0,
      description: '-',
      status: true,
    },
  ]);

  // Seeded Modes matching Screenshots 3 & 4
  const [modes, setModes] = useState<ModeItem[]>([
    {
      id: '1',
      sn: 1,
      code: 'BT',
      name: 'Bank Transfer',
      settlementCode: 'OA',
      settlementAccount: "Owner's Account",
      description: '-',
      txnQty: 0,
      txnTotal: 0,
      status: true,
    },
    {
      id: '2',
      sn: 2,
      code: 'CA',
      name: 'Card',
      settlementCode: 'BA',
      settlementAccount: 'Bank Account',
      description: '-',
      txnQty: 0,
      txnTotal: 0,
      status: true,
    },
    {
      id: '3',
      sn: 3,
      code: 'CA',
      name: 'Cash',
      settlementCode: 'CO',
      settlementAccount: 'Counter',
      description: '-',
      txnQty: 0,
      txnTotal: 0,
      status: true,
    },
    {
      id: '4',
      sn: 4,
      isBrand: 'fonepay',
      name: 'Fonepay',
      settlementCode: 'BA',
      settlementAccount: 'Bank Account',
      description: '-',
      txnQty: 0,
      txnTotal: 0,
      status: true,
    },
    {
      id: '5',
      sn: 5,
      isBrand: 'nepalpay',
      name: 'Nepal Pay',
      settlementCode: 'BA',
      settlementAccount: 'Bank Account',
      description: '-',
      txnQty: 0,
      txnTotal: 0,
      status: true,
    },
  ]);

  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isAddModeModalOpen, setIsAddModeModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [newAccount, setNewAccount] = useState({
    name: '',
    type: 'Cash' as 'Cash' | 'Bank',
    balance: '0',
    description: '',
  });

  const [transferData, setTransferData] = useState({
    fromAccount: 'Counter',
    toAccount: 'Bank Account',
    amount: '',
    narration: 'Daily Cash Settlement',
  });

  const [newMode, setNewMode] = useState({
    name: '',
    settlementAccount: 'Bank Account',
    description: '',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleAccountStatus = (id: string) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, status: !acc.status } : acc))
    );
    showToast('Account status updated');
  };

  const handleToggleModeStatus = (id: string) => {
    setModes((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: !m.status } : m))
    );
    showToast('Payment mode status updated');
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const list = activeTab === 'accounts' ? accounts : modes;
    if (selectedRowIds.length === list.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(list.map((i) => i.id));
    }
  };

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccount.name.trim()) return;

    const words = newAccount.name.trim().split(' ');
    const code =
      words.length >= 2
        ? `${words[0][0]}${words[1][0]}`.toUpperCase()
        : newAccount.name.slice(0, 2).toUpperCase();

    const created: AccountItem = {
      id: String(Date.now()),
      sn: accounts.length + 1,
      code,
      name: newAccount.name,
      activeModes: newAccount.type === 'Bank' ? 'Card, QR' : 'Cash',
      type: newAccount.type,
      balance: parseFloat(newAccount.balance) || 0,
      description: newAccount.description || '-',
      status: true,
    };

    setAccounts([...accounts, created]);
    setIsAddAccountModalOpen(false);
    setNewAccount({ name: '', type: 'Cash', balance: '0', description: '' });
    showToast(`Account "${created.name}" created successfully`);
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(transferData.amount);
    if (!amt || amt <= 0) return;

    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.name === transferData.fromAccount) {
          return { ...acc, balance: acc.balance - amt };
        }
        if (acc.name === transferData.toAccount) {
          return { ...acc, balance: acc.balance + amt };
        }
        return acc;
      })
    );

    setIsTransferModalOpen(false);
    showToast(
      `Transferred Rs ${amt.toLocaleString()} from ${transferData.fromAccount} to ${transferData.toAccount}`
    );
  };

  const handleAddMode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMode.name.trim()) return;

    const words = newMode.name.trim().split(' ');
    const code =
      words.length >= 2
        ? `${words[0][0]}${words[1][0]}`.toUpperCase()
        : newMode.name.slice(0, 2).toUpperCase();

    const matchedAcc = accounts.find((a) => a.name === newMode.settlementAccount);

    const created: ModeItem = {
      id: String(Date.now()),
      sn: modes.length + 1,
      code,
      name: newMode.name,
      settlementCode: matchedAcc ? matchedAcc.code : 'BA',
      settlementAccount: newMode.settlementAccount,
      description: newMode.description || '-',
      txnQty: 0,
      txnTotal: 0,
      status: true,
    };

    setModes([...modes, created]);
    setIsAddModeModalOpen(false);
    setNewMode({ name: '', settlementAccount: 'Bank Account', description: '' });
    showToast(`Payment Mode "${created.name}" added successfully`);
  };

  const totalAccountBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);
  const totalModeAmount = modes.reduce((acc, curr) => acc + curr.txnTotal, 0);

  return (
    <div style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Title matching Screenshots 2, 3, 4 */}
      <h1
        style={{
          fontSize: '1.45rem',
          fontWeight: 900,
          margin: '0 0 16px 0',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          color: 'var(--color-foreground)',
        }}
      >
        Cash & Banks
      </h1>

      {/* Navigation Tabs and Top Controls */}
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
        {/* Tabs: Accounts vs Modes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => {
              setActiveTab('accounts');
              setSelectedRowIds([]);
            }}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'accounts' ? 'var(--r8-brand-primary)' : 'var(--color-card)',
              color: activeTab === 'accounts' ? '#FFFFFF' : 'var(--color-foreground)',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow:
                activeTab === 'accounts' ? '0 2px 8px rgba(14, 165, 233, 0.3)' : 'none',
            }}
          >
            Accounts
          </button>
          <button
            onClick={() => {
              setActiveTab('modes');
              setSelectedRowIds([]);
            }}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'modes' ? 'var(--r8-brand-primary)' : 'var(--color-card)',
              color: activeTab === 'modes' ? '#FFFFFF' : 'var(--color-foreground)',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow:
                activeTab === 'modes' ? '0 2px 8px rgba(14, 165, 233, 0.3)' : 'none',
            }}
          >
            Modes
          </button>
        </div>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
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

          {/* Add New [N] Red Button */}
          <button
            onClick={() => {
              if (activeTab === 'accounts') {
                setIsAddAccountModalOpen(true);
              } else {
                setIsAddModeModalOpen(true);
              }
            }}
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
              boxShadow: '0 2px 6px rgba(14, 165, 233, 0.3)',
            }}
          >
            <Plus size={15} />
            Add New{' '}
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

          {/* Transfer Balance button (Accounts Tab only, matching Screenshot 2) */}
          {activeTab === 'accounts' && (
            <button
              onClick={() => setIsTransferModalOpen(true)}
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
              <RefreshCw size={14} color="var(--color-muted-foreground)" />
              Transfer Balance
            </button>
          )}

          {/* Options button */}
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

      {/* Filter Pills */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          marginBottom: '20px',
        }}
      >
        {activeTab === 'accounts' && (
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
            <span>Type:</span>
            <span style={{ color: 'var(--color-foreground)', fontWeight: 600 }}>{selectedType}</span>
            <ChevronDown size={13} />
          </div>
        )}

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
      </div>

      {/* KPI Cards */}
      {activeTab === 'accounts' ? (
        /* Screenshot 2 KPI Cards */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '14px',
            marginBottom: '22px',
          }}
        >
          {/* Total Accounts */}
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
                <UserCheck size={14} />
              </div>
              <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-foreground)' }}>
                Total Accounts
              </span>
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
              {accounts.length}/20
            </div>
          </div>

          {/* Total Balance */}
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
                  backgroundColor: '#0D9488',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <DollarSign size={14} />
              </div>
              <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-foreground)' }}>
                Total Balance
              </span>
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
              Rs {totalAccountBalance.toLocaleString()}
            </div>
          </div>

          {/* Highest Balance Account */}
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
                  backgroundColor: '#F59E0B',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Award size={14} />
              </div>
              <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-foreground)' }}>
                Highest Balance Account
              </span>
            </div>
            <div
              style={{
                fontSize: '1.45rem',
                fontWeight: 800,
                color: 'var(--color-foreground)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>Bank Account</span>
              <Info size={16} color="#3B82F6" style={{ cursor: 'pointer' }} />
            </div>
          </div>
        </div>
      ) : (
        /* Screenshots 3 & 4 KPI Cards */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '14px',
            marginBottom: '22px',
          }}
        >
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
                  backgroundColor: '#0D9488',
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
              Rs {totalModeAmount.toLocaleString()}
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
                  backgroundColor: '#8B5CF6',
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
            <div
              style={{
                fontSize: '1.45rem',
                fontWeight: 800,
                color: 'var(--color-foreground)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>Card</span>
              <Info size={16} color="#3B82F6" style={{ cursor: 'pointer' }} />
            </div>
          </div>

          {/* Most Used */}
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
                Most Used
              </span>
            </div>
            <div
              style={{
                fontSize: '1.45rem',
                fontWeight: 800,
                color: 'var(--color-foreground)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>Card</span>
              <span
                style={{
                  backgroundColor: '#E0F2FE',
                  color: '#0284C7',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '12px',
                }}
              >
                0
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Table Section */}
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
          {activeTab === 'accounts' ? (
            /* Screenshot 2: Accounts Table */
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '0.84rem',
              }}
            >
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
                        checked={selectedRowIds.length === accounts.length}
                        onChange={toggleSelectAll}
                        style={{ cursor: 'pointer', borderRadius: '4px' }}
                      />
                      <span>SN</span>
                    </div>
                  </th>
                  <th style={{ padding: '14px 16px', minWidth: '180px' }}>Account Name</th>
                  <th style={{ padding: '14px 16px', minWidth: '200px' }}>Active Modes</th>
                  <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Type</th>
                  <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Balance</th>
                  <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Description</th>
                  <th style={{ padding: '14px 16px', width: '100px' }}>Status</th>
                </tr>
              </thead>

              <tbody>
                {accounts.map((acc) => (
                  <tr key={acc.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="checkbox"
                          checked={selectedRowIds.includes(acc.id)}
                          onChange={() => toggleSelectRow(acc.id)}
                          style={{ cursor: 'pointer' }}
                        />
                        <span>{acc.sn}</span>
                      </div>
                    </td>

                    {/* Account Name with badge */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            backgroundColor: '#EDE9FE',
                            color: '#7C3AED',
                            fontWeight: 800,
                            fontSize: '0.74rem',
                          }}
                        >
                          {acc.code}
                        </span>
                        <span style={{ fontWeight: 600, color: 'var(--color-foreground)' }}>
                          {acc.name}
                        </span>
                      </div>
                    </td>

                    <td style={{ padding: '14px 16px', color: 'var(--color-muted-foreground)' }}>
                      {acc.activeModes}
                    </td>

                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{acc.type}</td>

                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#10B981' }}>
                      Rs {acc.balance.toLocaleString()}
                    </td>

                    <td style={{ padding: '14px 16px', color: 'var(--color-muted-foreground)' }}>
                      {acc.description}
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {/* Toggle Switch */}
                        <div
                          onClick={() => handleToggleAccountStatus(acc.id)}
                          style={{
                            width: '36px',
                            height: '20px',
                            borderRadius: '10px',
                            backgroundColor: acc.status ? '#10B981' : 'var(--color-border)',
                            position: 'relative',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                          }}
                        >
                          <div
                            style={{
                              width: '16px',
                              height: '16px',
                              borderRadius: '50%',
                              backgroundColor: '#FFFFFF',
                              position: 'absolute',
                              top: '2px',
                              left: acc.status ? '18px' : '2px',
                              transition: 'left 0.2s',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                            }}
                          />
                        </div>

                        <button
                          onClick={() => showToast(`Actions for ${acc.name}`)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted-foreground)' }}
                        >
                          <MoreVertical size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            /* Screenshots 3 & 4: Modes Table */
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '0.84rem',
              }}
            >
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
                        checked={selectedRowIds.length === modes.length}
                        onChange={toggleSelectAll}
                        style={{ cursor: 'pointer', borderRadius: '4px' }}
                      />
                      <span>SN</span>
                    </div>
                  </th>
                  <th style={{ padding: '14px 16px', minWidth: '180px' }}>Mode Name</th>
                  <th style={{ padding: '14px 16px', minWidth: '180px' }}>Settlement Account</th>
                  <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Description</th>
                  <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>TXN Qty</th>
                  <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>TXN Total</th>
                  <th style={{ padding: '14px 16px', width: '100px' }}>Status</th>
                </tr>
              </thead>

              <tbody>
                {modes.map((m) => (
                  <tr key={m.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="checkbox"
                          checked={selectedRowIds.includes(m.id)}
                          onChange={() => toggleSelectRow(m.id)}
                          style={{ cursor: 'pointer' }}
                        />
                        <span>{m.sn}</span>
                      </div>
                    </td>

                    {/* Mode Name with code badge or brand logo */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {m.isBrand === 'fonepay' ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: '#DC2626',
                              color: '#FFFFFF',
                              fontWeight: 900,
                              fontSize: '0.64rem',
                              letterSpacing: '-0.3px',
                            }}
                          >
                            fonepay
                          </span>
                        ) : m.isBrand === 'nepalpay' ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: '#2563EB',
                              color: '#FFFFFF',
                              fontWeight: 900,
                              fontSize: '0.62rem',
                            }}
                          >
                            NEPAL PAY
                          </span>
                        ) : (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '28px',
                              height: '28px',
                              borderRadius: '6px',
                              backgroundColor: '#EDE9FE',
                              color: '#7C3AED',
                              fontWeight: 800,
                              fontSize: '0.74rem',
                            }}
                          >
                            {m.code}
                          </span>
                        )}
                        <span style={{ fontWeight: 600, color: 'var(--color-foreground)' }}>
                          {m.name}
                        </span>
                      </div>
                    </td>

                    {/* Settlement Account with code badge */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '24px',
                            height: '24px',
                            borderRadius: '5px',
                            backgroundColor: '#EDE9FE',
                            color: '#7C3AED',
                            fontWeight: 800,
                            fontSize: '0.68rem',
                          }}
                        >
                          {m.settlementCode}
                        </span>
                        <span style={{ fontWeight: 500 }}>{m.settlementAccount}</span>
                      </div>
                    </td>

                    <td style={{ padding: '14px 16px', color: 'var(--color-muted-foreground)' }}>
                      {m.description}
                    </td>

                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{m.txnQty}</td>

                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#10B981' }}>
                      Rs {m.txnTotal.toLocaleString()}
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {/* Toggle Switch */}
                        <div
                          onClick={() => handleToggleModeStatus(m.id)}
                          style={{
                            width: '36px',
                            height: '20px',
                            borderRadius: '10px',
                            backgroundColor: m.status ? '#10B981' : 'var(--color-border)',
                            position: 'relative',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                          }}
                        >
                          <div
                            style={{
                              width: '16px',
                              height: '16px',
                              borderRadius: '50%',
                              backgroundColor: '#FFFFFF',
                              position: 'absolute',
                              top: '2px',
                              left: m.status ? '18px' : '2px',
                              transition: 'left 0.2s',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                            }}
                          />
                        </div>

                        <button
                          onClick={() => showToast(`Actions for ${m.name}`)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted-foreground)' }}
                        >
                          <MoreVertical size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Footer count */}
      <div style={{ fontSize: '0.78rem', color: 'var(--color-muted-foreground)', padding: '0 4px' }}>
        {selectedRowIds.length} of {activeTab === 'accounts' ? accounts.length : modes.length} row(s) selected.
      </div>

      {/* Modal: Add New Account */}
      {isAddAccountModalOpen && (
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
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Add Cash & Bank Account</h3>
              <button
                onClick={() => setIsAddAccountModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted-foreground)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddAccount} style={{ padding: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Account Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NIC Asia Bank, Petty Cash Box"
                    value={newAccount.name}
                    onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
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
                    Account Type
                  </label>
                  <select
                    value={newAccount.type}
                    onChange={(e) => setNewAccount({ ...newAccount, type: e.target.value as 'Cash' | 'Bank' })}
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
                    <option value="Cash">Cash (Counter / Cash Box)</option>
                    <option value="Bank">Bank Account (Commercial / Savings)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Opening Balance (Rs.)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newAccount.balance}
                    onChange={(e) => setNewAccount({ ...newAccount, balance: e.target.value })}
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
                    Description / Note
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Branch, Account Number or details"
                    value={newAccount.description}
                    onChange={(e) => setNewAccount({ ...newAccount, description: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-card)',
                      color: 'var(--color-foreground)',
                      fontSize: '0.84rem',
                      resize: 'none',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddAccountModalOpen(false)}
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
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Transfer Balance */}
      {isTransferModalOpen && (
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
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Transfer Balance</h3>
              <button
                onClick={() => setIsTransferModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted-foreground)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleTransfer} style={{ padding: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    From Account *
                  </label>
                  <select
                    value={transferData.fromAccount}
                    onChange={(e) => setTransferData({ ...transferData, fromAccount: e.target.value })}
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
                    {accounts.map((a) => (
                      <option key={a.id} value={a.name}>
                        {a.name} (Rs {a.balance.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    To Account *
                  </label>
                  <select
                    value={transferData.toAccount}
                    onChange={(e) => setTransferData({ ...transferData, toAccount: e.target.value })}
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
                    {accounts
                      .filter((a) => a.name !== transferData.fromAccount)
                      .map((a) => (
                        <option key={a.id} value={a.name}>
                          {a.name} (Rs {a.balance.toLocaleString()})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Amount (Rs.) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={transferData.amount}
                    onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
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
                    Narration / Purpose
                  </label>
                  <input
                    type="text"
                    value={transferData.narration}
                    onChange={(e) => setTransferData({ ...transferData, narration: e.target.value })}
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
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
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
                  Transfer Balance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Payment Mode */}
      {isAddModeModalOpen && (
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
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Add Payment Mode</h3>
              <button
                onClick={() => setIsAddModeModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted-foreground)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddMode} style={{ padding: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Payment Mode Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. eSewa, Khalti, IME Pay"
                    value={newMode.name}
                    onChange={(e) => setNewMode({ ...newMode, name: e.target.value })}
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
                    Settlement Account *
                  </label>
                  <select
                    value={newMode.settlementAccount}
                    onChange={(e) => setNewMode({ ...newMode, settlementAccount: e.target.value })}
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
                    {accounts.map((a) => (
                      <option key={a.id} value={a.name}>
                        {a.name} ({a.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Description / Fee Note
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1.5% MDR charges apply"
                    value={newMode.description}
                    onChange={(e) => setNewMode({ ...newMode, description: e.target.value })}
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
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModeModalOpen(false)}
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
                  Add Mode
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
