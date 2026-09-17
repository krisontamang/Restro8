import React, { useState } from 'react';
import {
  Search,
  Filter,
  MoreVertical,
  Plus,
  Calendar,
  ChevronDown,
  ArrowUpDown,
  ArrowLeftRight,
  ArrowDown,
  FileSpreadsheet,
  Receipt,
  X,
} from 'lucide-react';

interface IncomeRecord {
  id: string;
  sn: number;
  txnDate: string;
  incomeId: string;
  accountHead: string;
  parties: string;
  txnAmount: number;
  status: string;
  account: string;
  entryDate: string;
  entryBy: string;
}

export const FinanceIncomeView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTxnDate, setSelectedTxnDate] = useState('This Year');
  const [selectedAccountHead, setSelectedAccountHead] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedEntryDate, setSelectedEntryDate] = useState('This Year');
  const [selectedEntryBy, setSelectedEntryBy] = useState('All');

  // Income items (empty by default matching Screenshot 4)
  const [incomes, setIncomes] = useState<IncomeRecord[]>([]);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form state
  const [newIncome, setNewIncome] = useState({
    accountHead: 'Catering & Event Revenue',
    parties: 'Direct Client',
    amount: '',
    account: 'Bank Account',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncome.amount) return;

    const nextSN = incomes.length + 1;
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const code = `INC-${String(nextSN).padStart(4, '0')}`;

    const record: IncomeRecord = {
      id: String(Date.now()),
      sn: nextSN,
      txnDate: dateStr,
      incomeId: code,
      accountHead: newIncome.accountHead,
      parties: newIncome.parties || 'Direct Client',
      txnAmount: parseFloat(newIncome.amount) || 0,
      status: 'Received',
      account: newIncome.account,
      entryDate: dateStr,
      entryBy: 'Kirtiman Tamang',
    };

    setIncomes([record, ...incomes]);
    setIsAddModalOpen(false);
    setNewIncome({ accountHead: 'Catering & Event Revenue', parties: 'Direct Client', amount: '', account: 'Bank Account' });
    showToast(`Income ${code} recorded successfully`);
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRowIds.length === incomes.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(incomes.map((i) => i.id));
    }
  };

  const totalIncome = incomes.reduce((acc, curr) => acc + curr.txnAmount, 0);

  return (
    <div style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Top Header matching Screenshot 4 */}
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
        <h1
          style={{
            fontSize: '1.45rem',
            fontWeight: 900,
            margin: 0,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            color: 'var(--color-foreground)',
          }}
        >
          Income
        </h1>

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

          {/* Add Income [I] Button (Dark green button matching Screenshot 4) */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '8px',
              backgroundColor: '#15803D',
              color: '#FFFFFF',
              fontSize: '0.84rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(21, 128, 61, 0.3)',
            }}
          >
            Add Income{' '}
            <span
              style={{
                backgroundColor: 'rgba(255,255,255,0.25)',
                padding: '1px 5px',
                borderRadius: '4px',
                fontSize: '0.7rem',
              }}
            >
              I
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

      {/* 5 Filter Pills matching Screenshot 4 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          marginBottom: '20px',
        }}
      >
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
          <span>Account Head:</span>
          <span style={{ color: 'var(--color-foreground)', fontWeight: 600 }}>{selectedAccountHead}</span>
          <ChevronDown size={13} />
        </div>

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
          <span>Entry By:</span>
          <span style={{ color: 'var(--color-foreground)', fontWeight: 600 }}>{selectedEntryBy}</span>
          <ChevronDown size={13} />
        </div>
      </div>

      {/* 3 KPI Cards matching Screenshot 4 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
          marginBottom: '22px',
        }}
      >
        {/* Transaction Per Day */}
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
              <ArrowUpDown size={14} />
            </div>
            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-foreground)' }}>
              Transaction Per Day
            </span>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
            Unlimited
          </div>
        </div>

        {/* Total Transactions */}
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
              <ArrowLeftRight size={14} />
            </div>
            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-foreground)' }}>
              Total Transactions
            </span>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
            {incomes.length}
          </div>
        </div>

        {/* Total Income */}
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
              <ArrowDown size={14} />
            </div>
            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-foreground)' }}>
              Total Income
            </span>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
            Rs {totalIncome.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Table matching Screenshot 4 */}
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
            {/* Columns matching Screenshot 4:
                SN | TXN Date | ID | Account Head | Parties | TXN Amount | Status | Account | Entry Date | Entry By */}
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
                      checked={incomes.length > 0 && selectedRowIds.length === incomes.length}
                      onChange={toggleSelectAll}
                      style={{ cursor: 'pointer', borderRadius: '4px' }}
                    />
                    <span>SN</span>
                  </div>
                </th>
                <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>TXN Date</th>
                <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>ID</th>
                <th style={{ padding: '14px 16px', minWidth: '180px' }}>Account Head</th>
                <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Parties</th>
                <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>TXN Amount</th>
                <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Status</th>
                <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Account</th>
                <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Entry Date</th>
                <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Entry By</th>
              </tr>
            </thead>

            <tbody>
              {incomes.length === 0 ? (
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
                        No income and expense found
                      </h3>
                      <p style={{ fontSize: '0.84rem', color: 'var(--color-muted-foreground)', margin: 0 }}>
                        Create a new income and expense or import a new data.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                incomes.map((inc) => (
                  <tr key={inc.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <input
                        type="checkbox"
                        checked={selectedRowIds.includes(inc.id)}
                        onChange={() => toggleSelectRow(inc.id)}
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-muted-foreground)' }}>{inc.txnDate}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{inc.incomeId}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{inc.accountHead}</td>
                    <td style={{ padding: '14px 16px' }}>{inc.parties}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 700 }}>Rs {inc.txnAmount.toLocaleString()}</td>
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
                        {inc.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>{inc.account}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-muted-foreground)' }}>{inc.entryDate}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-muted-foreground)' }}>{inc.entryBy}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selection Footer */}
      <div style={{ fontSize: '0.78rem', color: 'var(--color-muted-foreground)', padding: '0 4px' }}>
        {selectedRowIds.length} of {incomes.length} row(s) selected.
      </div>

      {/* Add Income Modal */}
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
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Record Income</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted-foreground)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddIncome} style={{ padding: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Account Head
                  </label>
                  <select
                    value={newIncome.accountHead}
                    onChange={(e) => setNewIncome({ ...newIncome, accountHead: e.target.value })}
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
                    <option value="Catering & Event Revenue">Catering & Event Revenue</option>
                    <option value="Dine-in Direct Revenue">Dine-in Direct Revenue</option>
                    <option value="Online Delivery Commission">Online Delivery Commission</option>
                    <option value="Interest & Investment">Interest & Investment</option>
                    <option value="Scrap & Packaging Sale">Scrap & Packaging Sale</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Parties / Source
                  </label>
                  <input
                    type="text"
                    required
                    value={newIncome.parties}
                    onChange={(e) => setNewIncome({ ...newIncome, parties: e.target.value })}
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
                    Amount (Rs.) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={newIncome.amount}
                    onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
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
                    Deposited Into Account
                  </label>
                  <select
                    value={newIncome.account}
                    onChange={(e) => setNewIncome({ ...newIncome, account: e.target.value })}
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
                    <option value="Bank Account">Bank Account (Nabil Bank)</option>
                    <option value="Counter Cash">Counter Cash Drawer</option>
                    <option value="Owner's Account">Owner&apos;s Account</option>
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
                    backgroundColor: '#15803D',
                    color: '#FFFFFF',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Save Income
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
