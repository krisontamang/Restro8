import React, { useState } from 'react';
import {
  ChevronLeft,
  Search,
  Filter,
  MoreHorizontal,
  Upload,
  Columns3,
  Layers,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { notifyToast } from '../../utils/toast';

interface HistoryRow {
  id: string;
  sn: number;
  date: string;
  stockItem: string;
  stockGroup: string;
  particulars: string;
  parties: string;
  opening: number;
  inQty: number;
  outQty: number;
  rate: number;
}

export const StockHistoryView: React.FC = () => {
  const { setActiveTab } = useRestaurant();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [historyRows, setHistoryRows] = useState<HistoryRow[]>([]);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);

  const filtered = historyRows.filter(
    (h) =>
      h.stockItem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.stockGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.particulars.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.parties.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportCSV = () => {
    const headers = ['SN,Date,Stock Item,Stock Group,Particulars,Parties,Opening,In,Out,Rate'];
    const rows = historyRows.map(
      (h) =>
        `${h.sn},"${h.date}","${h.stockItem}","${h.stockGroup}","${h.particulars}","${h.parties}",${h.opening},${h.inQty},${h.outQty},${h.rate}`
    );
    const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Restro8_Stock_History.csv';
    a.click();
    URL.revokeObjectURL(url);
    setIsOptionsMenuOpen(false);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Top Header Bar matching Screenshot 2 */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Back Button matching Screenshot 2 */}
          <button
            onClick={() => setActiveTab('inventory-items')}
            title="Go back"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--r8-brand-primary)',
              transition: 'background-color 0.15s ease',
            }}
          >
            <ChevronLeft size={20} />
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
            Stock History
          </h1>
        </div>

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
                      notifyToast('Column Settings', 'Columns customized for stock history.', 'info');
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

      {/* Main Table Container matching Screenshot 2 */}
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
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1080px' }}>
            <thead>
              <tr
                style={{
                  backgroundColor: 'var(--color-muted)',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <th style={{ padding: '14px 18px', width: '60px', fontSize: '0.84rem', fontWeight: 700 }}>SN</th>
                <th style={{ padding: '14px 18px', fontSize: '0.84rem', fontWeight: 700 }}>Date</th>
                <th style={{ padding: '14px 18px', fontSize: '0.84rem', fontWeight: 700 }}>Stock Item</th>
                <th style={{ padding: '14px 18px', fontSize: '0.84rem', fontWeight: 700 }}>Stock Group</th>
                <th style={{ padding: '14px 18px', fontSize: '0.84rem', fontWeight: 700 }}>Particulars</th>
                <th style={{ padding: '14px 18px', fontSize: '0.84rem', fontWeight: 700 }}>Parties</th>
                <th style={{ padding: '14px 18px', fontSize: '0.84rem', fontWeight: 700 }}>Opening</th>
                <th style={{ padding: '14px 18px', fontSize: '0.84rem', fontWeight: 700 }}>In</th>
                <th style={{ padding: '14px 18px', fontSize: '0.84rem', fontWeight: 700 }}>Out</th>
                <th style={{ padding: '14px 18px', fontSize: '0.84rem', fontWeight: 700 }}>Rate</th>
              </tr>
            </thead>

            {filtered.length > 0 && (
              <tbody>
                {filtered.map((h) => (
                  <tr key={h.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '14px 18px', fontSize: '0.86rem' }}>{h.sn}</td>
                    <td style={{ padding: '14px 18px', fontSize: '0.86rem' }}>{h.date}</td>
                    <td style={{ padding: '14px 18px', fontSize: '0.88rem', fontWeight: 700 }}>{h.stockItem}</td>
                    <td style={{ padding: '14px 18px', fontSize: '0.86rem' }}>{h.stockGroup}</td>
                    <td style={{ padding: '14px 18px', fontSize: '0.86rem' }}>{h.particulars}</td>
                    <td style={{ padding: '14px 18px', fontSize: '0.86rem' }}>{h.parties}</td>
                    <td style={{ padding: '14px 18px', fontSize: '0.86rem' }}>{h.opening}</td>
                    <td style={{ padding: '14px 18px', fontSize: '0.86rem', color: '#10B981', fontWeight: 700 }}>{h.inQty}</td>
                    <td style={{ padding: '14px 18px', fontSize: '0.86rem', color: '#EF4444', fontWeight: 700 }}>{h.outQty}</td>
                    <td style={{ padding: '14px 18px', fontSize: '0.86rem' }}>Rs {h.rate}</td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>

        {/* Empty State matching Screenshot 2 */}
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
              No stock history found
            </h2>

            <p
              style={{
                fontSize: '0.88rem',
                color: 'var(--color-muted-foreground)',
                margin: 0,
              }}
            >
              Create a new stock item
            </p>
          </div>
        )}

        {/* Horizontal scrollbar tracker bar matching Screenshot 2 */}
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
              width: '60%',
              backgroundColor: '#9CA3AF',
              borderRadius: '4px',
            }}
          />
        </div>
      </div>

      {/* Selected Row Counter matching Screenshot 2 */}
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
    </div>
  );
};
