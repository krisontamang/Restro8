import React, { useState } from 'react';
import {
  Search,
  Filter,
  MoreVertical,
  Plus,
  Calendar,
  ChevronDown,
  DollarSign,
  Ticket,
  FileSpreadsheet,
  Receipt,
  X,
  Paperclip,
} from 'lucide-react';

interface JournalVoucherRecord {
  id: string;
  sn: number;
  txnDate: string;
  jvId: string;
  title: string;
  amount: number;
  attachment: string;
  entryDate: string;
  entryBy: string;
  remarks: string;
}

export const JournalVoucherView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTxnDate, setSelectedTxnDate] = useState('This Year');
  const [selectedEntryDate, setSelectedEntryDate] = useState('This Year');
  const [selectedEntryBy, setSelectedEntryBy] = useState('All');

  // Vouchers state (empty by default matching Screenshot 5)
  const [vouchers, setVouchers] = useState<JournalVoucherRecord[]>([]);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form state
  const [newVoucher, setNewVoucher] = useState({
    title: '',
    amount: '',
    debitAccount: 'Cash in Hand',
    creditAccount: 'Sales Account',
    remarks: '',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const totalAmount = vouchers.reduce((acc, curr) => acc + curr.amount, 0);

  const handleAddVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVoucher.title.trim() || !newVoucher.amount) {
      showToast('Please fill in required fields');
      return;
    }

    const nextId = String(Date.now());
    const nextSN = vouchers.length + 1;
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const jvCode = `JV-${String(nextSN).padStart(4, '0')}`;

    const record: JournalVoucherRecord = {
      id: nextId,
      sn: nextSN,
      txnDate: dateStr,
      jvId: jvCode,
      title: newVoucher.title.trim(),
      amount: parseFloat(newVoucher.amount) || 0,
      attachment: '-',
      entryDate: dateStr,
      entryBy: 'Kirtiman Tamang',
      remarks: newVoucher.remarks.trim() || 'General adjustment entry',
    };

    setVouchers([record, ...vouchers]);
    setNewVoucher({
      title: '',
      amount: '',
      debitAccount: 'Cash in Hand',
      creditAccount: 'Sales Account',
      remarks: '',
    });
    setIsAddModalOpen(false);
    showToast(`Journal voucher ${jvCode} created successfully`);
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRowIds.length === vouchers.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(vouchers.map((v) => v.id));
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Top Header matching Screenshot 5 */}
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
          Journal Voucher
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

      {/* Filter Bar with 3 Pills matching Screenshot 5 */}
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

        {/* 2. Entry Date */}
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

        {/* 3. Entry By */}
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

      {/* 2 KPI Cards matching Screenshot 5 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '14px',
          marginBottom: '22px',
          maxWidth: '560px',
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
              <DollarSign size={14} />
            </div>
            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-foreground)' }}>
              Total Amount
            </span>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
            Rs {totalAmount}
          </div>
        </div>

        {/* Total Vouchers */}
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '16px 18px',
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
              <Ticket size={14} />
            </div>
            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-foreground)' }}>
              Total Vouchers
            </span>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
            {vouchers.length}
          </div>
        </div>
      </div>

      {/* Journal Voucher Table Container matching Screenshot 5 */}
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
            {/* Columns matching Screenshot 5:
                SN | TXN Date | JV ID | Title | Amount | Attachment | Entry Date | Entry By | Remarks */}
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
                      checked={vouchers.length > 0 && selectedRowIds.length === vouchers.length}
                      onChange={toggleSelectAll}
                      style={{ cursor: 'pointer', borderRadius: '4px' }}
                    />
                    <span>SN</span>
                  </div>
                </th>
                <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>TXN Date</th>
                <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>JV ID</th>
                <th style={{ padding: '14px 16px', minWidth: '180px' }}>Title</th>
                <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Amount</th>
                <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Attachment</th>
                <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Entry Date</th>
                <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Entry By</th>
                <th style={{ padding: '14px 16px', minWidth: '160px' }}>Remarks</th>
              </tr>
            </thead>

            <tbody>
              {vouchers.length === 0 ? (
                /* Authentic RestroX Empty State matching Screenshot 5 */
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
                        No journal voucher found
                      </h3>
                      <p
                        style={{
                          fontSize: '0.84rem',
                          color: 'var(--color-muted-foreground)',
                          margin: 0,
                        }}
                      >
                        No records found
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                vouchers.map((v) => {
                  const isChecked = selectedRowIds.includes(v.id);
                  return (
                    <tr
                      key={v.id}
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
                            onChange={() => toggleSelectRow(v.id)}
                            style={{ cursor: 'pointer', borderRadius: '4px' }}
                          />
                          <span>{v.sn}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--color-muted-foreground)' }}>
                        {v.txnDate}
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 600 }}>{v.jvId}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 600 }}>{v.title}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 700 }}>
                        Rs {v.amount.toLocaleString()}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--color-muted-foreground)' }}>
                        {v.attachment}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--color-muted-foreground)' }}>
                        {v.entryDate}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--color-muted-foreground)' }}>
                        {v.entryBy}
                      </td>
                      <td style={{ padding: '14px 16px' }}>{v.remarks}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row Selection Counter matching Screenshot 5 */}
      <div style={{ fontSize: '0.78rem', color: 'var(--color-muted-foreground)', padding: '0 4px' }}>
        {selectedRowIds.length} of {vouchers.length} row(s) selected.
      </div>

      {/* Add Journal Voucher Modal */}
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
                Add Journal Voucher
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted-foreground)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddVoucher} style={{ padding: '22px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Voucher Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Depreciation, Cash adjustment, Petty cash replenishment"
                    value={newVoucher.title}
                    onChange={(e) => setNewVoucher({ ...newVoucher, title: e.target.value })}
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
                    value={newVoucher.amount}
                    onChange={(e) => setNewVoucher({ ...newVoucher, amount: e.target.value })}
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                      Debit Account (By)
                    </label>
                    <select
                      value={newVoucher.debitAccount}
                      onChange={(e) => setNewVoucher({ ...newVoucher, debitAccount: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-card)',
                        color: 'var(--color-foreground)',
                        fontSize: '0.82rem',
                      }}
                    >
                      <option value="Cash in Hand">Cash in Hand</option>
                      <option value="Bank Account">Nabil Bank POS</option>
                      <option value="Expenses">Operating Expense</option>
                      <option value="Rent">Kitchen Rent</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                      Credit Account (To)
                    </label>
                    <select
                      value={newVoucher.creditAccount}
                      onChange={(e) => setNewVoucher({ ...newVoucher, creditAccount: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-card)',
                        color: 'var(--color-foreground)',
                        fontSize: '0.82rem',
                      }}
                    >
                      <option value="Sales Account">Sales Revenue</option>
                      <option value="Owner's Equity">Owner&apos;s Equity</option>
                      <option value="Cash in Hand">Cash in Hand</option>
                      <option value="Creditors">Vendor Accounts</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Remarks / Narration
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Enter journal voucher narration or reference details..."
                    value={newVoucher.remarks}
                    onChange={(e) => setNewVoucher({ ...newVoucher, remarks: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-card)',
                      color: 'var(--color-foreground)',
                      fontSize: '0.84rem',
                      outline: 'none',
                      resize: 'none',
                    }}
                  />
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
                  Save Voucher
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
