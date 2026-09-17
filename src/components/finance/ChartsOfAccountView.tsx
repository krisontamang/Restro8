import React, { useState } from 'react';
import {
  Search,
  Filter,
  MoreVertical,
  Plus,
  ChevronLeft,
  X,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

interface AccountHeadItem {
  id: string;
  sn: number;
  accountHead: string;
  parent: 'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense';
  group: string;
  subGroup: string;
  description: string;
}

export const ChartsOfAccountView: React.FC = () => {
  const { setActiveTab } = useRestaurant();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form state
  const [newHead, setNewHead] = useState({
    name: '',
    parent: 'Asset' as AccountHeadItem['parent'],
    group: 'Current Assets',
    subGroup: 'Cash and Bank',
    description: '',
  });

  // Authentic RestroX default seeded account heads (all 25 items from Screenshots 2 & 3)
  const [accounts, setAccounts] = useState<AccountHeadItem[]>([
    { id: '1', sn: 1, accountHead: 'Kirtiman Tamang', parent: 'Liability', group: 'Current Liability', subGroup: 'Staff Account', description: '' },
    { id: '2', sn: 2, accountHead: 'Counter', parent: 'Asset', group: 'Current Assets', subGroup: 'Cash and Bank', description: '' },
    { id: '3', sn: 3, accountHead: 'Bank Account', parent: 'Asset', group: 'Current Assets', subGroup: 'Cash and Bank', description: '' },
    { id: '4', sn: 4, accountHead: "Owner's Account", parent: 'Asset', group: 'Current Assets', subGroup: 'Cash and Bank', description: '' },
    { id: '5', sn: 5, accountHead: 'Cash Customer', parent: 'Asset', group: 'Current Assets', subGroup: 'Customer Receivables', description: '' },
    { id: '6', sn: 6, accountHead: 'Adjustment', parent: 'Expense', group: 'Indirect Expenses', subGroup: '', description: '' },
    { id: '7', sn: 7, accountHead: 'Gross Sales', parent: 'Income', group: 'Direct Income', subGroup: 'Sales', description: '' },
    { id: '8', sn: 8, accountHead: 'Dish Discount', parent: 'Income', group: 'Direct Income', subGroup: 'Sales', description: '' },
    { id: '9', sn: 9, accountHead: 'Loyalty Discount', parent: 'Income', group: 'Direct Income', subGroup: 'Sales', description: '' },
    { id: '10', sn: 10, accountHead: 'Sales Discount', parent: 'Income', group: 'Direct Income', subGroup: 'Sales', description: '' },
    { id: '11', sn: 11, accountHead: 'Sales Return', parent: 'Income', group: 'Direct Income', subGroup: 'Sales', description: '' },
    { id: '12', sn: 12, accountHead: 'Service Charge', parent: 'Income', group: 'Indirect Income', subGroup: 'Other Income', description: '' },
    { id: '13', sn: 13, accountHead: 'Tips', parent: 'Income', group: 'Indirect Income', subGroup: 'Other Income', description: '' },
    { id: '14', sn: 14, accountHead: 'Round Off', parent: 'Expense', group: 'Indirect Expenses', subGroup: '', description: '' },
    { id: '15', sn: 15, accountHead: 'Rental Income', parent: 'Income', group: 'Indirect Income', subGroup: 'Other Income', description: '' },
    { id: '16', sn: 16, accountHead: 'Sales Commission', parent: 'Income', group: 'Indirect Income', subGroup: 'Other Income', description: '' },
    { id: '17', sn: 17, accountHead: 'Bank Interest Income', parent: 'Income', group: 'Indirect Income', subGroup: 'Other Income', description: '' },
    { id: '18', sn: 18, accountHead: 'Purchase', parent: 'Expense', group: 'Direct Expenses', subGroup: 'Purchase', description: '' },
    { id: '19', sn: 19, accountHead: 'Purchase Return', parent: 'Expense', group: 'Direct Expenses', subGroup: 'Purchase', description: '' },
    { id: '20', sn: 20, accountHead: 'Rent Expenses', parent: 'Expense', group: 'Indirect Expenses', subGroup: '', description: '' },
    { id: '21', sn: 21, accountHead: 'Salary Expenses', parent: 'Expense', group: 'Indirect Expenses', subGroup: '', description: '' },
    { id: '22', sn: 22, accountHead: 'Commission Expenses', parent: 'Expense', group: 'Indirect Expenses', subGroup: '', description: '' },
    { id: '23', sn: 23, accountHead: 'Stationery and Printing Expenses', parent: 'Expense', group: 'Indirect Expenses', subGroup: '', description: '' },
    { id: '24', sn: 24, accountHead: 'Sanitation Expenses', parent: 'Expense', group: 'Indirect Expenses', subGroup: '', description: '' },
    { id: '25', sn: 25, accountHead: 'Direct Order', parent: 'Asset', group: 'Current Assets', subGroup: '', description: '' },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRowIds.length === filteredAccounts.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(filteredAccounts.map((i) => i.id));
    }
  };

  const handleAddAccountHead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHead.name.trim()) return;

    const item: AccountHeadItem = {
      id: String(Date.now()),
      sn: accounts.length + 1,
      accountHead: newHead.name.trim(),
      parent: newHead.parent,
      group: newHead.group,
      subGroup: newHead.subGroup,
      description: newHead.description,
    };

    setAccounts([...accounts, item]);
    setIsAddModalOpen(false);
    setNewHead({ name: '', parent: 'Asset', group: 'Current Assets', subGroup: 'Cash and Bank', description: '' });
    showToast(`Account head "${item.accountHead}" added successfully`);
  };

  const filteredAccounts = accounts.filter((a) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        a.accountHead.toLowerCase().includes(q) ||
        a.parent.toLowerCase().includes(q) ||
        a.group.toLowerCase().includes(q) ||
        a.subGroup.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Top Header matching Screenshots 2 & 3 */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* [<] Back Button matching Screenshot 2 */}
          <button
            onClick={() => setActiveTab('finance-dashboard')}
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
              color: 'var(--color-muted-foreground)',
            }}
          >
            <ChevronLeft size={16} />
          </button>

          <h1
            style={{
              fontSize: '1.45rem',
              fontWeight: 900,
              margin: 0,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              color: 'var(--color-foreground)',
            }}
          >
            Charts of Account
          </h1>
        </div>

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

      {/* Table matching Screenshots 2 & 3 */}
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
            {/* Columns matching Screenshots 2 & 3:
                SN | Account Head | Parent | Group | Sub Group | Description | ⋯ */}
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
                <th style={{ padding: '14px 16px', width: '60px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={filteredAccounts.length > 0 && selectedRowIds.length === filteredAccounts.length}
                      onChange={toggleSelectAll}
                      style={{ cursor: 'pointer', borderRadius: '4px' }}
                    />
                    <span>SN</span>
                  </div>
                </th>
                <th style={{ padding: '14px 16px', minWidth: '220px' }}>Account Head</th>
                <th style={{ padding: '14px 16px', width: '120px' }}>Parent</th>
                <th style={{ padding: '14px 16px', minWidth: '160px' }}>Group</th>
                <th style={{ padding: '14px 16px', minWidth: '180px' }}>Sub Group</th>
                <th style={{ padding: '14px 16px', minWidth: '160px' }}>Description</th>
                <th style={{ padding: '14px 16px', width: '40px' }}></th>
              </tr>
            </thead>

            <tbody>
              {filteredAccounts.map((item) => (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: '1px solid var(--color-border)',
                    backgroundColor: selectedRowIds.includes(item.id)
                      ? 'rgba(14, 165, 233, 0.04)'
                      : 'transparent',
                  }}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="checkbox"
                        checked={selectedRowIds.includes(item.id)}
                        onChange={() => toggleSelectRow(item.id)}
                        style={{ cursor: 'pointer' }}
                      />
                      <span>{item.sn}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-foreground)' }}>
                    {item.accountHead}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-muted-foreground)' }}>
                    {item.parent}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-muted-foreground)' }}>
                    {item.group}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-muted-foreground)' }}>
                    {item.subGroup || '-'}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-muted-foreground)' }}>
                    {item.description || '-'}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <button
                      onClick={() => showToast(`Actions for ${item.accountHead}`)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted-foreground)' }}
                    >
                      <MoreVertical size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selection Footer */}
      <div style={{ fontSize: '0.78rem', color: 'var(--color-muted-foreground)', padding: '0 4px' }}>
        {selectedRowIds.length} of {filteredAccounts.length} row(s) selected.
      </div>

      {/* Modal: Add Account Head */}
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
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Add Account Head</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted-foreground)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddAccountHead} style={{ padding: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Account Head Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Electricity Bill, Kitchen Overheads"
                    value={newHead.name}
                    onChange={(e) => setNewHead({ ...newHead, name: e.target.value })}
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
                    Parent Category
                  </label>
                  <select
                    value={newHead.parent}
                    onChange={(e) => setNewHead({ ...newHead, parent: e.target.value as any })}
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
                    <option value="Asset">Asset</option>
                    <option value="Liability">Liability</option>
                    <option value="Equity">Equity</option>
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Group
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Current Assets, Direct Expenses, Indirect Expenses"
                    value={newHead.group}
                    onChange={(e) => setNewHead({ ...newHead, group: e.target.value })}
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
                    Sub Group
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cash and Bank, Sales, Purchase"
                    value={newHead.subGroup}
                    onChange={(e) => setNewHead({ ...newHead, subGroup: e.target.value })}
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
                  Save Head
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
