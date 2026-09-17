import React, { useState } from 'react';
import { notifyToast } from '../../utils/toast';
import {
  Search,
  Plus,
  MoreHorizontal,
  Grid,
  Upload,
  Columns3,
  X,
  Trash2,
} from 'lucide-react';

interface StockGroupItem {
  id: string;
  sn: number;
  name: string;
  noOfItems: number;
  description: string;
}

export const StockGroupView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Initial 5 stock groups matching Screenshot 1 exactly
  const [groups, setGroups] = useState<StockGroupItem[]>([
    {
      id: 'grp-1',
      sn: 1,
      name: 'Drinks',
      noOfItems: 0,
      description: 'Includes soft drinks, fruit juices, energy drinks, flavored water',
    },
    {
      id: 'grp-2',
      sn: 2,
      name: 'Groceries',
      noOfItems: 0,
      description: 'Includes pantry staples like rice, flour, oils, spices, canned goods',
    },
    {
      id: 'grp-3',
      sn: 3,
      name: 'Meat',
      noOfItems: 0,
      description: 'Includes premium cuts of chicken, mutton, pork, and seafood',
    },
    {
      id: 'grp-4',
      sn: 4,
      name: 'Others',
      noOfItems: 0,
      description: 'Includes specialty items, cleaning supplies and remaining goods',
    },
    {
      id: 'grp-5',
      sn: 5,
      name: 'Vegetable',
      noOfItems: 0,
      description: 'Includes fresh leafy greens, root vegetables, and organic herbs',
    },
  ]);

  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');

  const toggleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((r) => r !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const filtered = groups.filter(
    (g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    const newRow: StockGroupItem = {
      id: `grp-${Date.now()}`,
      sn: groups.length + 1,
      name: newGroupName.trim(),
      noOfItems: 0,
      description: newGroupDesc.trim() || '-',
    };

    setGroups([...groups, newRow]);
    setNewGroupName('');
    setNewGroupDesc('');
    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setGroups(groups.filter((g) => g.id !== id).map((g, idx) => ({ ...g, sn: idx + 1 })));
    setSelectedRows(selectedRows.filter((r) => r !== id));
    setActiveDropdown(null);
  };

  const handleExportCSV = () => {
    const headers = ['SN,Group Name,No of Item,Description'];
    const rows = groups.map(
      (g) => `${g.sn},"${g.name}",${g.noOfItems},"${g.description}"`
    );
    const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Stock_Groups_Chiya_Durbar.csv';
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
          Stock Group
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
                      notifyToast('Column Settings', 'Columns visible: Group Name, No of Item, Description', 'info');
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

      {/* Top 1 KPI Card matching Screenshot 1 */}
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
              <Grid size={15} />
            </div>
            <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--color-muted-foreground)' }}>
              Total Stock Groups
            </span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-foreground)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {groups.length}
          </div>
        </div>
      </div>

      {/* Main Table Container matching Screenshot 1 */}
      <div
        style={{
          backgroundColor: 'var(--color-card)',
          borderRadius: '12px',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden',
          minHeight: '360px',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '760px' }}>
            <thead>
              <tr
                style={{
                  backgroundColor: 'var(--color-muted)',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <th style={{ padding: '14px 20px', width: '60px', fontSize: '0.84rem', fontWeight: 700 }}>SN</th>
                <th style={{ padding: '14px 20px', fontSize: '0.84rem', fontWeight: 700 }}>Group Name</th>
                <th style={{ padding: '14px 20px', fontSize: '0.84rem', fontWeight: 700 }}>No of Item</th>
                <th style={{ padding: '14px 20px', fontSize: '0.84rem', fontWeight: 700 }}>Description</th>
                <th style={{ padding: '14px 20px', width: '50px', textAlign: 'center' }}></th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((g) => {
                const isSelected = selectedRows.includes(g.id);
                return (
                  <tr
                    key={g.id}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      backgroundColor: isSelected ? 'rgba(14, 165, 233, 0.04)' : 'transparent',
                      fontSize: '0.86rem',
                    }}
                  >
                    <td style={{ padding: '14px 20px', color: 'var(--color-muted-foreground)', fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(g.id)}
                          style={{ cursor: 'pointer' }}
                        />
                        <span>{g.sn}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--color-foreground)' }}>
                      {g.name}
                    </td>
                    <td style={{ padding: '14px 20px', color: 'var(--color-foreground)' }}>
                      {g.noOfItems}
                    </td>
                    <td style={{ padding: '14px 20px', color: 'var(--color-muted-foreground)', maxWidth: '420px' }}>
                      {g.description}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'center', position: 'relative' }}>
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === g.id ? null : g.id)}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          color: 'var(--color-muted-foreground)',
                          cursor: 'pointer',
                          padding: '4px',
                        }}
                      >
                        <MoreHorizontal size={16} />
                      </button>

                      {activeDropdown === g.id && (
                        <>
                          <div onClick={() => setActiveDropdown(null)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
                          <div
                            style={{
                              position: 'absolute',
                              top: 'calc(100% - 4px)',
                              right: '20px',
                              width: '120px',
                              backgroundColor: 'var(--color-card)',
                              borderRadius: '8px',
                              border: '1px solid var(--color-border)',
                              boxShadow: 'var(--shadow-md)',
                              zIndex: 50,
                              padding: '4px',
                            }}
                          >
                            <button
                              onClick={() => handleDelete(g.id)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                width: '100%',
                                padding: '8px 10px',
                                border: 'none',
                                background: 'transparent',
                                color: '#EF4444',
                                fontSize: '0.80rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                borderRadius: '6px',
                                textAlign: 'left',
                              }}
                            >
                              <Trash2 size={13} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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

      {/* Add New Group Modal */}
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
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Add Stock Group</h3>
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
                  Group Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Spices, Bakery, Cleaning Supplies"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
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

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Items that belong to this stock group..."
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
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
                  Save Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
