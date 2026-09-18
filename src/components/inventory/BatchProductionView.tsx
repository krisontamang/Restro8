import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Upload,
  Columns3,
  X,
} from 'lucide-react';
import { notifyToast } from '../../utils/toast';

interface BatchRow {
  id: string;
  sn: number;
  txnDate: string;
  reference: string;
  txnNo: string;
  materialCost: number;
  labourCost: number;
  totalCost: number;
}

export const BatchProductionView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [batches, setBatches] = useState<BatchRow[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);

  // Form states
  const [batchRef, setBatchRef] = useState('');
  const [materialCost, setMaterialCost] = useState('1200');
  const [labourCost, setLabourCost] = useState('300');

  const filtered = batches.filter(
    (b) =>
      b.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.txnNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchRef.trim()) return;

    const mCost = Number(materialCost) || 0;
    const lCost = Number(labourCost) || 0;

    const newRow: BatchRow = {
      id: `batch-${Date.now()}`,
      sn: batches.length + 1,
      txnDate: '2026-09-14',
      reference: batchRef.trim(),
      txnNo: `BP-${1000 + batches.length + 1}`,
      materialCost: mCost,
      labourCost: lCost,
      totalCost: mCost + lCost,
    };

    setBatches([...batches, newRow]);
    setBatchRef('');
    setIsAddModalOpen(false);
  };

  const handleExportCSV = () => {
    const headers = ['SN,TXN Date,Reference,TXN No,Total Material Cost,Total Labour And Overhead Cost,Total Input Cost'];
    const rows = batches.map(
      (b) =>
        `${b.sn},"${b.txnDate}","${b.reference}","${b.txnNo}",${b.materialCost},${b.labourCost},${b.totalCost}`
    );
    const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Restro8_Batch_Production.csv';
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
          Batch Production
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
                      notifyToast('Column Settings', 'Columns visible: TXN Date, Reference, TXN No, Total Material Cost, Total Labour And Overhead Cost, Total Input Cost', 'info');
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

      {/* Main Table Container matching Screenshot 3 */}
      <div
        style={{
          backgroundColor: 'var(--color-card)',
          borderRadius: '12px',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden',
          minHeight: '440px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
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
                <th style={{ padding: '14px 18px', fontSize: '0.84rem', fontWeight: 700 }}>TXN Date</th>
                <th style={{ padding: '14px 18px', fontSize: '0.84rem', fontWeight: 700 }}>Reference</th>
                <th style={{ padding: '14px 18px', fontSize: '0.84rem', fontWeight: 700 }}>TXN No</th>
                <th style={{ padding: '14px 18px', fontSize: '0.84rem', fontWeight: 700 }}>Total Material Cost</th>
                <th style={{ padding: '14px 18px', fontSize: '0.84rem', fontWeight: 700 }}>Total Labour And Overhead Cost</th>
                <th style={{ padding: '14px 18px', fontSize: '0.84rem', fontWeight: 700 }}>Total Input Cost</th>
              </tr>
            </thead>

            {filtered.length > 0 && (
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '14px 18px', fontSize: '0.86rem' }}>{b.sn}</td>
                    <td style={{ padding: '14px 18px', fontSize: '0.86rem' }}>{b.txnDate}</td>
                    <td style={{ padding: '14px 18px', fontSize: '0.88rem', fontWeight: 700 }}>{b.reference}</td>
                    <td style={{ padding: '14px 18px', fontSize: '0.86rem', color: 'var(--color-muted-foreground)' }}>{b.txnNo}</td>
                    <td style={{ padding: '14px 18px', fontSize: '0.86rem' }}>Rs {b.materialCost.toLocaleString()}</td>
                    <td style={{ padding: '14px 18px', fontSize: '0.86rem' }}>Rs {b.labourCost.toLocaleString()}</td>
                    <td style={{ padding: '14px 18px', fontSize: '0.88rem', fontWeight: 800 }}>Rs {b.totalCost.toLocaleString()}</td>
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
              No stock batch production found
            </h2>

            <p
              style={{
                fontSize: '0.88rem',
                color: 'var(--color-muted-foreground)',
                margin: '0 0 22px 0',
              }}
            >
              Create a new stock batch production
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
              <Plus size={16} /> Add New Batch
            </button>
          </div>
        )}

        {/* Horizontal scrollbar tracker bar matching Screenshot 3 */}
        <div
          style={{
            height: '8px',
            backgroundColor: '#E5E7EB',
            borderRadius: '4px',
            margin: '8px 16px',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '35%',
              backgroundColor: '#9CA3AF',
              borderRadius: '4px',
            }}
          />
        </div>
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

      {/* Add New Batch Modal */}
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
              maxWidth: '460px',
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
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Create Batch Production</h3>
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
                  Batch Reference Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Masala Tea Premix 50kg, Momo Dough Batch 1"
                  value={batchRef}
                  onChange={(e) => setBatchRef(e.target.value)}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                    Material Cost (Rs.)
                  </label>
                  <input
                    type="number"
                    value={materialCost}
                    onChange={(e) => setMaterialCost(e.target.value)}
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
                    Labour/Overhead (Rs.)
                  </label>
                  <input
                    type="number"
                    value={labourCost}
                    onChange={(e) => setLabourCost(e.target.value)}
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
                  Create Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
