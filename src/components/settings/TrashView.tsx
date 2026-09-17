import React, { useState } from 'react';
import { Search, SlidersHorizontal, Trash2, RefreshCw } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

export interface TrashItem {
  id: string;
  sn: number;
  particular: string;
  type: string;
  deletedBy: string;
  deletedAt: string;
  countdown: string;
  remarks: string;
}

export const TrashView: React.FC = () => {
  const { addToast } = useRestaurant();
  const [activeSubTab, setActiveSubTab] = useState<'All' | 'Void Invoice'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [trashItems, setTrashItems] = useState<TrashItem[]>(() => {
    try {
      const saved = localStorage.getItem('restrox_trash_items');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredItems = trashItems.filter((item) => {
    const matchesSearch =
      item.particular.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.remarks.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeSubTab === 'All' || item.type === 'Void Invoice';
    return matchesSearch && matchesTab;
  });

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div
      style={{
        padding: '24px 32px',
        backgroundColor: 'var(--color-background)',
        overflowY: 'auto',
        height: '100%',
        boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Top Header matching Screenshot 5 */}
      <h1
        style={{
          fontSize: '1.45rem',
          fontWeight: 700,
          margin: '0 0 16px 0',
          color: 'var(--color-foreground)',
          letterSpacing: '-0.02em',
        }}
      >
        Trash
      </h1>

      {/* Sub-Tabs & Controls Row matching Screenshot 5 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Left Sub-tabs: All vs Void Invoice */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setActiveSubTab('All')}
            style={{
              padding: '6px 16px',
              borderRadius: '6px',
              fontSize: '0.82rem',
              fontWeight: 600,
              border: `1px solid ${activeSubTab === 'All' ? 'var(--r8-brand-primary)' : 'var(--color-border)'}`,
              backgroundColor: activeSubTab === 'All' ? 'var(--r8-brand-primary)' : 'var(--color-card)',
              color: activeSubTab === 'All' ? '#FFF' : 'var(--color-foreground)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('Void Invoice')}
            style={{
              padding: '6px 16px',
              borderRadius: '6px',
              fontSize: '0.82rem',
              fontWeight: 600,
              border: `1px solid ${activeSubTab === 'Void Invoice' ? 'var(--r8-brand-primary)' : 'var(--color-border)'}`,
              backgroundColor: activeSubTab === 'Void Invoice' ? 'var(--r8-brand-primary)' : 'var(--color-card)',
              color: activeSubTab === 'Void Invoice' ? '#FFF' : 'var(--color-foreground)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Void Invoice
          </button>
        </div>

        {/* Right Search & Filter matching Screenshot 5 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ position: 'relative', width: '180px' }}>
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9CA3AF',
              }}
            />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px 6px 30px',
                borderRadius: '6px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-card)',
                color: 'var(--color-foreground)',
                fontSize: '0.82rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="button"
            onClick={() => addToast('Filter', 'Filter options opened.', 'info')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-card)',
              color: 'var(--color-foreground)',
              fontSize: '0.82rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <SlidersHorizontal size={13} color="var(--color-muted-foreground)" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Main Table & Empty State matching Screenshot 5 */}
      <div
        style={{
          backgroundColor: 'var(--color-card)',
          borderRadius: '10px',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: '#FAFAFA' }}>
              <th style={{ padding: '12px 16px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-foreground)', width: '50px' }}>SN</th>
              <th style={{ padding: '12px 16px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-foreground)' }}>Particular</th>
              <th style={{ padding: '12px 16px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-foreground)' }}>Type</th>
              <th style={{ padding: '12px 16px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-foreground)' }}>Deleted By</th>
              <th style={{ padding: '12px 16px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-foreground)' }}>Deleted At</th>
              <th style={{ padding: '12px 16px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-foreground)' }}>Countdown</th>
              <th style={{ padding: '12px 16px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-foreground)' }}>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '80px 24px', textAlign: 'center' }}>
                  {/* Fanned Documents Circular Illustration matching Screenshot 5 */}
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '50%',
                      backgroundColor: '#F3F4F6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px auto',
                      position: 'relative',
                    }}
                  >
                    {/* Green sheet */}
                    <div
                      style={{
                        width: '24px',
                        height: '32px',
                        borderRadius: '3px',
                        backgroundColor: '#10B981',
                        position: 'absolute',
                        transform: 'rotate(-15deg)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      }}
                    />
                    {/* Blue sheet */}
                    <div
                      style={{
                        width: '24px',
                        height: '32px',
                        borderRadius: '3px',
                        backgroundColor: '#3B82F6',
                        position: 'absolute',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      }}
                    />
                    {/* Purple sheet */}
                    <div
                      style={{
                        width: '24px',
                        height: '32px',
                        borderRadius: '3px',
                        backgroundColor: '#8B5CF6',
                        position: 'absolute',
                        transform: 'rotate(15deg)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      }}
                    />
                  </div>

                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '4px' }}>
                    No Trash found
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)' }}>
                    No trash Found. Delete items to see them here.
                  </div>
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => toggleSelectRow(item.id)}
                  style={{
                    borderBottom: '1px solid var(--color-border)',
                    backgroundColor: selectedIds.includes(item.id) ? '#FEF2F2' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <td style={{ padding: '14px 16px', fontSize: '0.82rem' }}>{item.sn}</td>
                  <td style={{ padding: '14px 16px', fontSize: '0.82rem', fontWeight: 600 }}>{item.particular}</td>
                  <td style={{ padding: '14px 16px', fontSize: '0.82rem' }}>{item.type}</td>
                  <td style={{ padding: '14px 16px', fontSize: '0.82rem' }}>{item.deletedBy}</td>
                  <td style={{ padding: '14px 16px', fontSize: '0.82rem' }}>{item.deletedAt}</td>
                  <td style={{ padding: '14px 16px', fontSize: '0.82rem', color: '#EF4444', fontWeight: 600 }}>{item.countdown}</td>
                  <td style={{ padding: '14px 16px', fontSize: '0.82rem' }}>{item.remarks}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer matching Screenshot 5: "0 of 0 row(s) selected." */}
      <div
        style={{
          marginTop: '12px',
          fontSize: '0.82rem',
          color: 'var(--color-muted-foreground)',
        }}
      >
        {selectedIds.length} of {filteredItems.length} row(s) selected.
      </div>
    </div>
  );
};
