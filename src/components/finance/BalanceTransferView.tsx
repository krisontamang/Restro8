import React, { useState } from 'react';
import {
  Search,
  Filter,
  MoreVertical,
  Plus,
  Calendar,
  ChevronDown,
  FileSpreadsheet,
  Receipt,
  X,
  ArrowRight,
} from 'lucide-react';

interface BalanceTransferRecord {
  id: string;
  sn: number;
  txnDate: string;
  txnNo: string;
  transferFrom: string;
  transferTo: string;
  amount: number;
  entryDate: string;
  entryBy: string;
  attachment: string;
  remarks: string;
}

export const BalanceTransferView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTxnDate, setSelectedTxnDate] = useState('This Year');
  const [selectedAccount, setSelectedAccount] = useState('All');
  const [selectedEntryDate, setSelectedEntryDate] = useState('This Year');
  const [selectedEntryBy, setSelectedEntryBy] = useState('All');

  // Empty state by default matching Screenshot 1
  const [transfers, setTransfers] = useState<BalanceTransferRecord[]>([]);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form state
  const [newTransfer, setNewTransfer] = useState({
    from: 'Counter',
    to: 'Bank Account',
    amount: '',
    remarks: 'Daily cash deposit',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTransfer.amount) return;

    const nextSN = transfers.length + 1;
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const code = `BT-${String(nextSN).padStart(4, '0')}`;

    const record: BalanceTransferRecord = {
      id: String(Date.now()),
      sn: nextSN,
      txnDate: dateStr,
      txnNo: code,
      transferFrom: newTransfer.from,
      transferTo: newTransfer.to,
      amount: parseFloat(newTransfer.amount) || 0,
      entryDate: dateStr,
      entryBy: 'Kirtiman Tamang',
      attachment: '-',
      remarks: newTransfer.remarks || '-',
    };

    setTransfers([record, ...transfers]);
    setIsAddModalOpen(false);
    setNewTransfer({ from: 'Counter', to: 'Bank Account', amount: '', remarks: 'Daily cash deposit' });
    showToast(`Balance Transfer ${code} recorded successfully`);
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRowIds.length === transfers.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(transfers.map((i) => i.id));
    }
  };

  const filteredTransfers = transfers.filter((t) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        t.txnNo.toLowerCase().includes(q) ||
        t.transferFrom.toLowerCase().includes(q) ||
        t.transferTo.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Top Header matching Screenshot 1 */}
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
          Balance Transfer
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

          {/* Add New [N] Red Button */}
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

      {/* 4 Filter Pills matching Screenshot 1 */}
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
          <span>Payment Account</span>
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

      {/* Table matching Screenshot 1 */}
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
            {/* Columns matching Screenshot 1:
                SN | Transaction Date | TXN No | Transfer From | Transfer To | Amount | Entry Date | Entry By | Attachment | Remarks */}
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
                      checked={filteredTransfers.length > 0 && selectedRowIds.length === filteredTransfers.length}
                      onChange={toggleSelectAll}
                      style={{ cursor: 'pointer', borderRadius: '4px' }}
                    />
                    <span>SN</span>
                  </div>
                </th>
                <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Transaction Date</th>
                <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>TXN No</th>
                <th style={{ padding: '14px 16px', minWidth: '160px' }}>Transfer From</th>
                <th style={{ padding: '14px 16px', minWidth: '160px' }}>Transfer To</th>
                <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Amount</th>
                <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Entry Date</th>
                <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Entry By</th>
                <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Attachment</th>
                <th style={{ padding: '14px 16px', minWidth: '180px' }}>Remarks</th>
              </tr>
            </thead>

            <tbody>
              {filteredTransfers.length === 0 ? (
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
                        No Balance Transfer found
                      </h3>
                      <p style={{ fontSize: '0.84rem', color: 'var(--color-muted-foreground)', margin: '0 0 16px 0' }}>
                        Create a new balance transfer
                      </p>

                      {/* Red + Add New Balance Transfer Button matching Screenshot 1 */}
                      <button
                        onClick={() => setIsAddModalOpen(true)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 20px',
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
                        Add New Balance Transfer
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransfers.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <input
                        type="checkbox"
                        checked={selectedRowIds.includes(t.id)}
                        onChange={() => toggleSelectRow(t.id)}
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-muted-foreground)' }}>{t.txnDate}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{t.txnNo}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{t.transferFrom}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{t.transferTo}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#10B981' }}>
                      Rs {t.amount.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-muted-foreground)' }}>{t.entryDate}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-muted-foreground)' }}>{t.entryBy}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-muted-foreground)' }}>{t.attachment}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-muted-foreground)' }}>{t.remarks}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selection Footer */}
      <div style={{ fontSize: '0.78rem', color: 'var(--color-muted-foreground)', padding: '0 4px' }}>
        {selectedRowIds.length} of {filteredTransfers.length} row(s) selected.
      </div>

      {/* Modal: Add New Balance Transfer */}
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
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Record Balance Transfer</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted-foreground)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddTransfer} style={{ padding: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Transfer From Account *
                  </label>
                  <select
                    value={newTransfer.from}
                    onChange={(e) => setNewTransfer({ ...newTransfer, from: e.target.value })}
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
                    <option value="Counter">Counter Cash Drawer</option>
                    <option value="Bank Account">Bank Account (Nabil Bank)</option>
                    <option value="Owner's Account">Owner&apos;s Account</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Transfer To Account *
                  </label>
                  <select
                    value={newTransfer.to}
                    onChange={(e) => setNewTransfer({ ...newTransfer, to: e.target.value })}
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
                    <option value="Counter">Counter Cash Drawer</option>
                    <option value="Owner's Account">Owner&apos;s Account</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Transfer Amount (Rs.) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={newTransfer.amount}
                    onChange={(e) => setNewTransfer({ ...newTransfer, amount: e.target.value })}
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
                    Remarks / Purpose
                  </label>
                  <input
                    type="text"
                    value={newTransfer.remarks}
                    onChange={(e) => setNewTransfer({ ...newTransfer, remarks: e.target.value })}
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
                  Record Transfer
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
