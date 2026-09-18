import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Layers,
  Upload,
  Columns3,
  X,
} from 'lucide-react';
import { notifyToast } from '../../utils/toast';

interface ConsumptionRow {
  id: string;
  sn: number;
  finishedGoods: string;
  type: string;
  salesPrice: number;
  cost: number;
  margin: string;
  itemUsed: string;
}

export const ConsumptionView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [consumptions, setConsumptions] = useState<ConsumptionRow[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);

  // Form states
  const [goodsName, setGoodsName] = useState('');
  const [goodsType, setGoodsType] = useState('Beverage');
  const [salesPrice, setSalesPrice] = useState('60');
  const [costPrice, setCostPrice] = useState('20');
  const [rawItems, setRawItems] = useState('CTC Tea Leaves (10g), Milk (120ml), Sugar (12g)');

  const filtered = consumptions.filter(
    (c) =>
      c.finishedGoods.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.itemUsed.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goodsName.trim()) return;

    const sPrice = Number(salesPrice) || 1;
    const cPrice = Number(costPrice) || 0;
    const marginPct = (((sPrice - cPrice) / sPrice) * 100).toFixed(1);

    const newRow: ConsumptionRow = {
      id: `cons-${Date.now()}`,
      sn: consumptions.length + 1,
      finishedGoods: goodsName.trim(),
      type: goodsType,
      salesPrice: sPrice,
      cost: cPrice,
      margin: `${marginPct}%`,
      itemUsed: rawItems.trim(),
    };

    setConsumptions([...consumptions, newRow]);
    setGoodsName('');
    setIsAddModalOpen(false);
  };

  const handleExportCSV = () => {
    const headers = ['SN,Finished Goods,Type,Sales Price,Cost,Margin,Item Used'];
    const rows = consumptions.map(
      (c) =>
        `${c.sn},"${c.finishedGoods}","${c.type}",${c.salesPrice},${c.cost},"${c.margin}","${c.itemUsed}"`
    );
    const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Restro8_Consumption.csv';
    a.click();
    URL.revokeObjectURL(url);
    setIsOptionsMenuOpen(false);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Top Header Bar matching Screenshot 3 */}
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
          Consumption
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

          {/* + Add New [N] Red Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
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
                      notifyToast('Column Settings', 'Columns visible: Finished Goods, Type, Sales Price, Cost, Margin, Item Used', 'info');
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
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Top 1 KPI Card matching Screenshot 3 */}
      <div style={{ marginBottom: '24px', maxWidth: '300px' }}>
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
                backgroundColor: '#CCFBF1',
                color: '#0D9488',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Layers size={15} />
            </div>
            <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--color-muted-foreground)' }}>
              Total Consumptions
            </span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-foreground)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {consumptions.length} Item
          </div>
        </div>
      </div>

      {/* Main Table Container matching Screenshot 3 */}
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
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '940px' }}>
            <thead>
              <tr
                style={{
                  backgroundColor: 'var(--color-muted)',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <th style={{ padding: '14px 18px', width: '60px', fontSize: '0.84rem', fontWeight: 700 }}>SN</th>
                <th style={{ padding: '14px 18px', fontSize: '0.84rem', fontWeight: 700 }}>Finished Goods</th>
                <th style={{ padding: '14px 18px', fontSize: '0.84rem', fontWeight: 700 }}>Type</th>
                <th style={{ padding: '14px 18px', fontSize: '0.84rem', fontWeight: 700 }}>Sales Price</th>
                <th style={{ padding: '14px 18px', fontSize: '0.84rem', fontWeight: 700 }}>Cost</th>
                <th style={{ padding: '14px 18px', fontSize: '0.84rem', fontWeight: 700 }}>Margin</th>
                <th style={{ padding: '14px 18px', fontSize: '0.84rem', fontWeight: 700 }}>Item Used</th>
              </tr>
            </thead>

            {filtered.length > 0 && (
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '14px 18px', fontSize: '0.86rem', color: 'var(--color-muted-foreground)' }}>{c.sn}</td>
                    <td style={{ padding: '14px 18px', fontSize: '0.88rem', fontWeight: 700 }}>{c.finishedGoods}</td>
                    <td style={{ padding: '14px 18px', fontSize: '0.86rem', color: 'var(--color-muted-foreground)' }}>{c.type}</td>
                    <td style={{ padding: '14px 18px', fontSize: '0.88rem', fontWeight: 800 }}>Rs {c.salesPrice}</td>
                    <td style={{ padding: '14px 18px', fontSize: '0.88rem', color: 'var(--color-muted-foreground)' }}>Rs {c.cost}</td>
                    <td style={{ padding: '14px 18px', fontSize: '0.88rem', fontWeight: 800, color: '#10B981' }}>{c.margin}</td>
                    <td style={{ padding: '14px 18px', fontSize: '0.86rem' }}>{c.itemUsed}</td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>

        {/* Empty State matching Screenshot 3 */}
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
              No consumption found
            </h2>

            <p
              style={{
                fontSize: '0.88rem',
                color: 'var(--color-muted-foreground)',
                margin: '0 0 22px 0',
              }}
            >
              Create a new consumption or import a new data.
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
              <Plus size={16} /> Add New Consumption
            </button>
          </div>
        )}
      </div>

      {/* Selected Row Counter matching Screenshot 3 */}
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

      {/* Add New Consumption Modal */}
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
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Add Consumption Formula</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{ border: 'none', background: 'transparent', color: 'var(--color-muted-foreground)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} style={{ padding: '24px' }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                  Finished Dish / Item *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Special Masala Chiya, Steam Chicken Mo:Mo"
                  value={goodsName}
                  onChange={(e) => setGoodsName(e.target.value)}
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
                    Type
                  </label>
                  <select
                    value={goodsType}
                    onChange={(e) => setGoodsType(e.target.value)}
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
                    <option value="Beverage">Beverage</option>
                    <option value="Food">Food</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Combo">Combo</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                    Sales Price (Rs.)
                  </label>
                  <input
                    type="number"
                    value={salesPrice}
                    onChange={(e) => setSalesPrice(e.target.value)}
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

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                  Raw Ingredients Used (Yield Recipe)
                </label>
                <textarea
                  value={rawItems}
                  onChange={(e) => setRawItems(e.target.value)}
                  rows={2}
                  placeholder="e.g. CTC Tea 10g, Fresh Milk 120ml, Sugar 12g"
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
                    resize: 'none',
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
                  Save Consumption
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
