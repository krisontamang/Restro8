import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import {
  Search,
  ListFilter,
  MoreVertical,
  Plus,
  Edit2,
  FileSpreadsheet,
  Receipt,
  X,
} from 'lucide-react';

interface TaxRateItem {
  id: string;
  sn: number;
  taxName: string;
  rate: number;
  taxType: string;
  status: boolean;
  notes: string;
}

export const FinanceTaxRatesView: React.FC = () => {
  const { settings } = useRestaurant();
  const [searchTerm, setSearchTerm] = useState('');
  const [taxRelation, setTaxRelation] = useState<'Inclusive' | 'Exclusive'>('Inclusive');

  // Restaurant Tax Details matching Screenshot 5
  const [taxDetails, setTaxDetails] = useState({
    legalName: settings.name || 'Your restaurant',
    contact: settings.phone || '',
    taxNumber: settings.panNumber || '',
    address: settings.address || settings.city || '',
    invoiceType: 'Estimate',
  });

  // Tax rates list (empty by default matching Screenshot 5)
  const [taxes, setTaxes] = useState<TaxRateItem[]>([]);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [isAddTaxModalOpen, setIsAddTaxModalOpen] = useState(false);
  const [isEditDetailsModalOpen, setIsEditDetailsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [newTax, setNewTax] = useState({
    taxName: 'VAT',
    rate: '13',
    taxType: 'Percentage',
    notes: 'Government Inland Revenue Department (IRD) Nepal standard VAT',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleTaxStatus = (id: string) => {
    setTaxes((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: !t.status } : t))
    );
    showToast('Tax status updated');
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRowIds.length === taxes.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(taxes.map((t) => t.id));
    }
  };

  const handleAddTax = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTax.taxName.trim() || !newTax.rate) return;

    const record: TaxRateItem = {
      id: String(Date.now()),
      sn: taxes.length + 1,
      taxName: newTax.taxName,
      rate: parseFloat(newTax.rate) || 0,
      taxType: newTax.taxType,
      status: true,
      notes: newTax.notes || '-',
    };

    setTaxes([...taxes, record]);
    setIsAddTaxModalOpen(false);
    setNewTax({
      taxName: 'VAT',
      rate: '13',
      taxType: 'Percentage',
      notes: 'Government Inland Revenue Department (IRD) Nepal standard VAT',
    });
    showToast(`Tax rate "${record.taxName} (${record.rate}%)" added successfully`);
  };

  const handleSaveTaxDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditDetailsModalOpen(false);
    showToast('Restaurant tax details updated successfully');
  };

  const filteredTaxes = taxes.filter((t) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return t.taxName.toLowerCase().includes(q) || t.notes.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Top Header matching Screenshot 5 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
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
          Tax & Rates
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

          {/* Arrange Button matching Screenshot 5 */}
          <button
            onClick={() => showToast('Arrange order view')}
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
            <ListFilter size={14} color="var(--color-muted-foreground)" />
            Arrange
          </button>

          {/* Add New [N] Red Button */}
          <button
            onClick={() => setIsAddTaxModalOpen(true)}
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

      {/* Top 2 Configuration Cards matching Screenshot 5 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '16px',
          marginBottom: '22px',
        }}
      >
        {/* Card 1: Price and Tax Relation */}
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '18px 22px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '14px',
            }}
          >
            <span
              style={{
                fontSize: '0.92rem',
                fontWeight: 700,
                color: 'var(--color-foreground)',
              }}
            >
              Price and Tax Relation
            </span>

            {/* Inclusive Dropdown Pill matching Screenshot 5 */}
            <select
              value={taxRelation}
              onChange={(e) => {
                setTaxRelation(e.target.value as any);
                showToast(`Price & tax relation set to ${e.target.value}`);
              }}
              style={{
                padding: '5px 12px',
                borderRadius: '8px',
                backgroundColor: '#E0F2FE',
                color: '#0284C7',
                border: '1px solid #BAE6FD',
                fontSize: '0.8rem',
                fontWeight: 700,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="Inclusive">Inclusive</option>
              <option value="Exclusive">Exclusive</option>
            </select>
          </div>

          <ul
            style={{
              margin: 0,
              paddingLeft: '18px',
              fontSize: '0.8rem',
              color: 'var(--color-muted-foreground)',
              lineHeight: '1.7',
            }}
          >
            <li>All listed price of menu or dishes will be {taxRelation.toLowerCase()} of taxes.</li>
            <li>In menu, note about prices are {taxRelation.toLowerCase()} of tax will be displayed.</li>
          </ul>
        </div>

        {/* Card 2: Restaurant Tax Details */}
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '18px 22px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '14px',
            }}
          >
            <span
              style={{
                fontSize: '0.92rem',
                fontWeight: 700,
                color: 'var(--color-foreground)',
              }}
            >
              Restaurant Tax Details
            </span>
            <button
              onClick={() => setIsEditDetailsModalOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-foreground)',
                padding: '2px',
              }}
            >
              <Edit2 size={15} />
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              rowGap: '6px',
              columnGap: '16px',
              fontSize: '0.8rem',
              color: 'var(--color-foreground)',
            }}
          >
            <div>
              <span style={{ color: 'var(--color-muted-foreground)' }}>Legal Name: </span>
              <span style={{ fontWeight: 600 }}>{taxDetails.legalName}</span>
            </div>
            <div>
              <span style={{ color: 'var(--color-muted-foreground)' }}>Contact: </span>
              <span style={{ fontWeight: 600 }}>{taxDetails.contact}</span>
            </div>
            <div>
              <span style={{ color: 'var(--color-muted-foreground)' }}>Tax Number: </span>
              <span style={{ fontWeight: 600 }}>{taxDetails.taxNumber || '-'}</span>
            </div>
            <div>
              <span style={{ color: 'var(--color-muted-foreground)' }}>Address: </span>
              <span style={{ fontWeight: 600 }}>{taxDetails.address}</span>
            </div>
            <div>
              <span style={{ color: 'var(--color-muted-foreground)' }}>Invoice Type: </span>
              <span style={{ fontWeight: 600 }}>{taxDetails.invoiceType}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section matching Screenshot 5 */}
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
                SN | Tax Name | Rate(%) | Tax Type | Status | Notes */}
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
                      checked={filteredTaxes.length > 0 && selectedRowIds.length === filteredTaxes.length}
                      onChange={toggleSelectAll}
                      style={{ cursor: 'pointer', borderRadius: '4px' }}
                    />
                    <span>SN</span>
                  </div>
                </th>
                <th style={{ padding: '14px 16px', minWidth: '160px' }}>Tax Name</th>
                <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Rate(%)</th>
                <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Tax Type</th>
                <th style={{ padding: '14px 16px', width: '100px' }}>Status</th>
                <th style={{ padding: '14px 16px', minWidth: '220px' }}>Notes</th>
              </tr>
            </thead>

            <tbody>
              {filteredTaxes.length === 0 ? (
                /* Screenshot 5 Empty State */
                <tr>
                  <td colSpan={6} style={{ padding: '64px 20px', textAlign: 'center' }}>
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
                        No Tax found
                      </h3>
                      <p style={{ fontSize: '0.84rem', color: 'var(--color-muted-foreground)', margin: '0 0 16px 0' }}>
                        Create a new tax or import a new data.
                      </p>

                      {/* Red + Add New Tax Button matching Screenshot 5 */}
                      <button
                        onClick={() => setIsAddTaxModalOpen(true)}
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
                        Add New Tax
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTaxes.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <input
                        type="checkbox"
                        checked={selectedRowIds.includes(t.id)}
                        onChange={() => toggleSelectRow(t.id)}
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 700 }}>{t.taxName}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{t.rate}%</td>
                    <td style={{ padding: '14px 16px' }}>{t.taxType}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div
                        onClick={() => handleToggleTaxStatus(t.id)}
                        style={{
                          width: '36px',
                          height: '20px',
                          borderRadius: '10px',
                          backgroundColor: t.status ? '#10B981' : 'var(--color-border)',
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
                            left: t.status ? '18px' : '2px',
                            transition: 'left 0.2s',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                          }}
                        />
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-muted-foreground)' }}>
                      {t.notes}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selection Footer */}
      <div style={{ fontSize: '0.78rem', color: 'var(--color-muted-foreground)', padding: '0 4px' }}>
        {selectedRowIds.length} of {filteredTaxes.length} row(s) selected.
      </div>

      {/* Modal: Add New Tax */}
      {isAddTaxModalOpen && (
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
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Add New Tax</h3>
              <button
                onClick={() => setIsAddTaxModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted-foreground)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddTax} style={{ padding: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Tax Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VAT (Value Added Tax), Service Charge"
                    value={newTax.taxName}
                    onChange={(e) => setNewTax({ ...newTax, taxName: e.target.value })}
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
                    Rate (%) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    required
                    placeholder="13"
                    value={newTax.rate}
                    onChange={(e) => setNewTax({ ...newTax, rate: e.target.value })}
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
                    Tax Type
                  </label>
                  <select
                    value={newTax.taxType}
                    onChange={(e) => setNewTax({ ...newTax, taxType: e.target.value })}
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
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Fixed Amount">Fixed Amount (Rs.)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Notes / Description
                  </label>
                  <textarea
                    rows={2}
                    value={newTax.notes}
                    onChange={(e) => setNewTax({ ...newTax, notes: e.target.value })}
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
                  onClick={() => setIsAddTaxModalOpen(false)}
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
                  Add Tax
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Restaurant Tax Details */}
      {isEditDetailsModalOpen && (
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
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Edit Restaurant Tax Details</h3>
              <button
                onClick={() => setIsEditDetailsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted-foreground)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTaxDetails} style={{ padding: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Legal Name
                  </label>
                  <input
                    type="text"
                    value={taxDetails.legalName}
                    onChange={(e) => setTaxDetails({ ...taxDetails, legalName: e.target.value })}
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
                    Tax / PAN / VAT Number
                  </label>
                  <input
                    type="text"
                    placeholder="9-digit IRD PAN (e.g. 609823412)"
                    value={taxDetails.taxNumber}
                    onChange={(e) => setTaxDetails({ ...taxDetails, taxNumber: e.target.value })}
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
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={taxDetails.contact}
                    onChange={(e) => setTaxDetails({ ...taxDetails, contact: e.target.value })}
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
                    Registered Address
                  </label>
                  <input
                    type="text"
                    value={taxDetails.address}
                    onChange={(e) => setTaxDetails({ ...taxDetails, address: e.target.value })}
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
                    Invoice Type
                  </label>
                  <select
                    value={taxDetails.invoiceType}
                    onChange={(e) => setTaxDetails({ ...taxDetails, invoiceType: e.target.value })}
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
                    <option value="Estimate">Estimate / Pre-bill</option>
                    <option value="VAT Bill">VAT Bill (IRD Certified)</option>
                    <option value="PAN Bill">PAN Bill</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setIsEditDetailsModalOpen(false)}
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
                  Save Details
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
