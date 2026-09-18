import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  ChevronDown,
  MoreHorizontal,
  DollarSign,
  RotateCw,
  AlertCircle,
  Info,
  Upload,
  Columns3,
  Layers,
  X,
} from 'lucide-react';
import { notifyToast } from '../../utils/toast';

interface StockItemRow {
  id: string;
  sn: number;
  name: string;
  group: string;
  consumptionRate: string;
  opening: string;
  closing: string;
  stockValue: number;
  supplier: string;
}

export const StockItemsView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [stockItems, setStockItems] = useState<StockItemRow[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [isSplitMenuOpen, setIsSplitMenuOpen] = useState(false);
  const [showOverviewCards, setShowOverviewCards] = useState(true);

  // Form states
  const [newItemName, setNewItemName] = useState('');
  const [newItemGroup, setNewItemGroup] = useState('Beverages & Tea');
  const [newOpening, setNewOpening] = useState('10');
  const [newUnit, setNewUnit] = useState('kg');
  const [newStockValue, setNewStockValue] = useState('4500');
  const [newSupplier, setNewSupplier] = useState('Ilam Tea Estate');

  const filtered = stockItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.group.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalStockValue = stockItems.reduce((acc, item) => acc + item.stockValue, 0);

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: StockItemRow = {
      id: `stock-${Date.now()}`,
      sn: stockItems.length + 1,
      name: newItemName.trim(),
      group: newItemGroup,
      consumptionRate: `0.5 ${newUnit}/day`,
      opening: `${newOpening} ${newUnit}`,
      closing: `${newOpening} ${newUnit}`,
      stockValue: Number(newStockValue) || 0,
      supplier: newSupplier,
    };

    setStockItems([...stockItems, newItem]);
    setNewItemName('');
    setIsAddModalOpen(false);
  };

  const handleExportCSV = () => {
    const headers = ['SN,Stock Item,Group,Consumption Rate,Opening,Closing,Stock Value,Supplier'];
    const rows = stockItems.map(
      (i) =>
        `${i.sn},"${i.name}","${i.group}","${i.consumptionRate}","${i.opening}","${i.closing}",${i.stockValue},"${i.supplier}"`
    );
    const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Restro8_Stock_Items.csv';
    a.click();
    URL.revokeObjectURL(url);
    setIsOptionsMenuOpen(false);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Top Header Bar matching Screenshot 1 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
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
          Stock Items
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Search Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              padding: '6px 12px',
            }}
          >
            <Search size={15} color="var(--color-muted-foreground)" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: '0.84rem',
                color: 'var(--color-foreground)',
                width: '130px',
              }}
            />
          </div>

          {/* Filter Button */}
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              color: 'var(--color-foreground)',
            }}
          >
            <Filter size={14} /> Filter
          </button>

          {/* Split Add New [N] Button matching Screenshot 1 */}
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <button
              onClick={() => setIsAddModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '8px 0 0 8px',
                backgroundColor: 'var(--r8-brand-primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '0.86rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(14, 165, 233, 0.35)',
              }}
            >
              <Plus size={16} /> Add New
              <span
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  marginLeft: '2px',
                }}
              >
                N
              </span>
            </button>
            <button
              onClick={() => setIsSplitMenuOpen(!isSplitMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 8px',
                borderRadius: '0 8px 8px 0',
                backgroundColor: '#D00812',
                color: '#FFFFFF',
                border: 'none',
                borderLeft: '1px solid rgba(255,255,255,0.2)',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(14, 165, 233, 0.35)',
              }}
            >
              <ChevronDown size={15} />
            </button>

            {isSplitMenuOpen && (
              <>
                <div onClick={() => setIsSplitMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    right: 0,
                    width: '160px',
                    backgroundColor: 'var(--color-card)',
                    borderRadius: '10px',
                    border: '1px solid var(--color-border)',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 50,
                    padding: '6px',
                  }}
                >
                  <button
                    onClick={() => {
                      setIsAddModalOpen(true);
                      setIsSplitMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: 'none',
                      background: 'transparent',
                      textAlign: 'left',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      borderRadius: '6px',
                      color: 'var(--color-foreground)',
                    }}
                  >
                    Add Single Item
                  </button>
                  <button
                    onClick={() => {
                      notifyToast('Import Catalog', 'Import wizard opened. Supports Excel/CSV item catalogs.', 'info');
                      setIsSplitMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: 'none',
                      background: 'transparent',
                      textAlign: 'left',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      borderRadius: '6px',
                      color: 'var(--color-foreground)',
                    }}
                  >
                    Bulk Import
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Options ⋯ */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsOptionsMenuOpen(!isOptionsMenuOpen)}
              title="More options"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: isOptionsMenuOpen ? 'var(--color-muted)' : 'var(--color-card)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--color-muted-foreground)',
              }}
            >
              <MoreHorizontal size={18} />
            </button>

            {isOptionsMenuOpen && (
              <>
                <div onClick={() => setIsOptionsMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    right: 0,
                    width: '180px',
                    backgroundColor: 'var(--color-card)',
                    borderRadius: '12px',
                    border: '1px solid var(--color-border)',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 50,
                    padding: '6px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                  }}
                >
                  <button
                    onClick={handleExportCSV}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: 'var(--color-foreground)',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <Upload size={16} />
                    <span>Export</span>
                  </button>

                  <button
                    onClick={() => {
                      notifyToast('Column Settings', 'Columns visible: Stock Item, Group, Consumption Rate, Opening, Closing, Stock Value, Supplier', 'info');
                      setIsOptionsMenuOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: 'var(--color-foreground)',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <Columns3 size={16} />
                    <span>Columns</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowOverviewCards(!showOverviewCards);
                      setIsOptionsMenuOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: 'var(--color-foreground)',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <Layers size={16} />
                    <span>Overview Cards</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Top 3 KPI Cards matching Screenshot 1 */}
      {showOverviewCards && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          {/* KPI 1: Total Stock Value */}
          <div
            style={{
              backgroundColor: 'var(--color-card)',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              padding: '18px 22px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '96px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '7px',
                  backgroundColor: '#EDE9FE',
                  color: '#8B5CF6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <DollarSign size={15} />
              </div>
              <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--color-muted-foreground)' }}>
                Total Stock Value
              </span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-foreground)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Rs {totalStockValue.toLocaleString()}
            </div>
          </div>

          {/* KPI 2: Restocked this week */}
          <div
            style={{
              backgroundColor: 'var(--color-card)',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              padding: '18px 22px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '96px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '7px',
                    backgroundColor: '#EDE9FE',
                    color: '#8B5CF6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <RotateCw size={15} />
                </div>
                <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--color-muted-foreground)' }}>
                  Restocked this week
                </span>
              </div>
              <Info size={14} color="#9CA3AF" />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-foreground)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {stockItems.length} Item
            </div>
          </div>

          {/* KPI 3: Low Stock Items */}
          <div
            style={{
              backgroundColor: 'var(--color-card)',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              padding: '18px 22px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '96px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '7px',
                    backgroundColor: '#FEE2E2',
                    color: '#EF4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AlertCircle size={15} />
                </div>
                <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--color-muted-foreground)' }}>
                  Low Stock Items
                </span>
              </div>
              <Info size={14} color="#9CA3AF" />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-foreground)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              0 Item
            </div>
          </div>
        </div>
      )}

      {/* Main Table Container matching Screenshot 1 */}
      <div
        style={{
          backgroundColor: 'var(--color-card)',
          borderRadius: '12px',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden',
          minHeight: '420px',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '980px' }}>
            <thead>
              <tr
                style={{
                  backgroundColor: 'var(--color-muted)',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <th style={{ padding: '14px 18px', width: '60px', fontSize: '0.84rem', fontWeight: 700 }}>SN</th>
                <th style={{ padding: '14px 18px', fontSize: '0.84rem', fontWeight: 700 }}>Stock Item</th>
                <th style={{ padding: '14px 18px', fontSize: '0.84rem', fontWeight: 700 }}>Group</th>
                <th style={{ padding: '14px 18px', fontSize: '0.84rem', fontWeight: 700 }}>Consumption Rate</th>
                <th style={{ padding: '14px 18px', fontSize: '0.84rem', fontWeight: 700 }}>Opening</th>
                <th style={{ padding: '14px 18px', fontSize: '0.84rem', fontWeight: 700 }}>Closing</th>
                <th style={{ padding: '14px 18px', fontSize: '0.84rem', fontWeight: 700 }}>Stock Value</th>
                <th style={{ padding: '14px 18px', fontSize: '0.84rem', fontWeight: 700 }}>Supplier</th>
              </tr>
            </thead>

            {filtered.length > 0 && (
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '14px 18px', fontSize: '0.86rem', color: 'var(--color-muted-foreground)' }}>{item.sn}</td>
                    <td style={{ padding: '14px 18px', fontSize: '0.88rem', fontWeight: 700 }}>{item.name}</td>
                    <td style={{ padding: '14px 18px', fontSize: '0.86rem', color: 'var(--color-muted-foreground)' }}>{item.group}</td>
                    <td style={{ padding: '14px 18px', fontSize: '0.86rem' }}>{item.consumptionRate}</td>
                    <td style={{ padding: '14px 18px', fontSize: '0.86rem' }}>{item.opening}</td>
                    <td style={{ padding: '14px 18px', fontSize: '0.86rem' }}>{item.closing}</td>
                    <td style={{ padding: '14px 18px', fontSize: '0.88rem', fontWeight: 800 }}>Rs {item.stockValue.toLocaleString()}</td>
                    <td style={{ padding: '14px 18px', fontSize: '0.86rem', color: 'var(--color-muted-foreground)' }}>{item.supplier}</td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>

        {/* Empty State when 0 items matching Screenshot 1 */}
        {filtered.length === 0 && (
          <div
            style={{
              padding: '70px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            {/* Fanned 3-card graphic */}
            <div
              style={{
                position: 'relative',
                width: '120px',
                height: '110px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Green document card */}
              <div
                style={{
                  position: 'absolute',
                  width: '60px',
                  height: '75px',
                  backgroundColor: '#10B981',
                  borderRadius: '10px',
                  transform: 'rotate(-20deg) translate(-14px, 4px)',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '8px 6px',
                  gap: '4px',
                }}
              >
                <div style={{ width: '18px', height: '3px', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '2px' }} />
                <div style={{ width: '28px', height: '3px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '2px' }} />
              </div>

              {/* Purple document card */}
              <div
                style={{
                  position: 'absolute',
                  width: '60px',
                  height: '75px',
                  backgroundColor: '#8B5CF6',
                  borderRadius: '10px',
                  transform: 'rotate(20deg) translate(14px, 4px)',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '8px 6px',
                  gap: '4px',
                }}
              >
                <div style={{ width: '18px', height: '3px', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '2px' }} />
                <div style={{ width: '28px', height: '3px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '2px' }} />
              </div>

              {/* Center blue document card */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 2,
                  width: '64px',
                  height: '80px',
                  backgroundColor: '#2563EB',
                  borderRadius: '10px',
                  boxShadow: '0 8px 18px rgba(37, 99, 235, 0.35)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '10px 8px',
                }}
              >
                <div style={{ width: '32px', height: '4px', backgroundColor: '#FFFFFF', borderRadius: '2px' }} />
                <div style={{ width: '32px', height: '4px', backgroundColor: '#FFFFFF', borderRadius: '2px' }} />
                <div style={{ width: '22px', height: '4px', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '2px' }} />
              </div>
            </div>

            <h2
              style={{
                fontSize: '1.25rem',
                fontWeight: 900,
                color: 'var(--color-foreground)',
                margin: '0 0 8px 0',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              No stock item found
            </h2>

            <p
              style={{
                fontSize: '0.88rem',
                color: 'var(--color-muted-foreground)',
                margin: '0 0 22px 0',
              }}
            >
              Create a new stock item or import a new data.
            </p>

            <button
              onClick={() => setIsAddModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: '8px',
                backgroundColor: 'var(--r8-brand-primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '0.88rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(14, 165, 233, 0.35)',
              }}
            >
              <Plus size={16} /> Add New Item
            </button>
          </div>
        )}
      </div>

      {/* Selected Row Counter matching Screenshot 1 */}
      <div
        style={{
          marginTop: '12px',
          fontSize: '0.82rem',
          color: 'var(--color-muted-foreground)',
          fontWeight: 600,
        }}
      >
        {selectedRows.length} of {filtered.length} row(s) selected.
      </div>

      {/* Add New Stock Item Modal */}
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
              borderRadius: '16px',
              border: '1px solid var(--color-border)',
              width: '100%',
              maxWidth: '480px',
              boxShadow: 'var(--shadow-xl)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '18px 24px',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Add Stock Item</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{ border: 'none', background: 'transparent', color: 'var(--color-muted-foreground)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateItem} style={{ padding: '24px' }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                  Item Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Special CTC Tea Leaves, Buffalo Milk, Chicken"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-background)',
                    color: 'var(--color-foreground)',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                    Stock Group
                  </label>
                  <select
                    value={newItemGroup}
                    onChange={(e) => setNewItemGroup(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-background)',
                      color: 'var(--color-foreground)',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="Beverages & Tea">Beverages & Tea</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Meat & Poultry">Meat & Poultry</option>
                    <option value="Produce & Veg">Produce & Veg</option>
                    <option value="Spices">Spices</option>
                    <option value="Grains & Rice">Grains & Rice</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                    Measuring Unit
                  </label>
                  <select
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-background)',
                      color: 'var(--color-foreground)',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="kg">kg (Kilogram)</option>
                    <option value="ltr">ltr (Litre)</option>
                    <option value="g">g (Gram)</option>
                    <option value="pc">pc (Piece)</option>
                    <option value="pkt">pkt (Packet)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                    Opening Qty
                  </label>
                  <input
                    type="number"
                    value={newOpening}
                    onChange={(e) => setNewOpening(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-background)',
                      color: 'var(--color-foreground)',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                    Total Value (Rs.)
                  </label>
                  <input
                    type="number"
                    value={newStockValue}
                    onChange={(e) => setNewStockValue(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-background)',
                      color: 'var(--color-foreground)',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                  Primary Supplier
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ilam Agro Farms, Dairy Cooperative"
                  value={newSupplier}
                  onChange={(e) => setNewSupplier(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-background)',
                    color: 'var(--color-foreground)',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'transparent',
                    color: 'var(--color-foreground)',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 22px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'var(--r8-brand-primary)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(14, 165, 233, 0.35)',
                  }}
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
