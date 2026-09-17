import React, { useState } from 'react';
import {
  Search,
  Plus,
  MoreHorizontal,
  Upload,
  Columns3,
  X,
  Edit2,
  Trash2,
} from 'lucide-react';
import { notifyToast } from '../../utils/toast';

interface UnitRow {
  id: string;
  sn: number;
  shortName: string;
  unitName: string;
  description: string;
}

export const MeasuringUnitView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Initial rows matching Screenshot 5 exactly
  const [units, setUnits] = useState<UnitRow[]>([
    { id: 'u-1', sn: 1, shortName: 'g', unitName: 'Gram', description: '-' },
    { id: 'u-2', sn: 2, shortName: 'kg', unitName: 'Kilogram', description: '-' },
    { id: 'u-3', sn: 3, shortName: 'lb', unitName: 'Pound', description: '-' },
    { id: 'u-4', sn: 4, shortName: 'ltr', unitName: 'Litre', description: '-' },
    { id: 'u-5', sn: 5, shortName: 'ml', unitName: 'Mililitre', description: '-' },
    { id: 'u-6', sn: 6, shortName: 'oz', unitName: 'Ounce', description: '-' },
    { id: 'u-7', sn: 7, shortName: 'pc', unitName: 'Piece', description: '-' },
    { id: 'u-8', sn: 8, shortName: 'pkt', unitName: 'Packet', description: '-' },
  ]);

  const [newShortName, setNewShortName] = useState('');
  const [newUnitName, setNewUnitName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const filtered = units.filter(
    (u) =>
      u.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.unitName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShortName.trim() || !newUnitName.trim()) return;

    const newRow: UnitRow = {
      id: `u-${Date.now()}`,
      sn: units.length + 1,
      shortName: newShortName.trim(),
      unitName: newUnitName.trim(),
      description: newDesc.trim() || '-',
    };

    setUnits([...units, newRow]);
    setNewShortName('');
    setNewUnitName('');
    setNewDesc('');
    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setUnits(units.filter((u) => u.id !== id).map((u, idx) => ({ ...u, sn: idx + 1 })));
    setSelectedRows(selectedRows.filter((r) => r !== id));
    setActiveDropdown(null);
  };

  const handleExportCSV = () => {
    const headers = ['SN,Short Name,Unit Name,Description'];
    const rows = units.map(
      (u) => `${u.sn},"${u.shortName}","${u.unitName}","${u.description}"`
    );
    const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Measuring_Units_Chiya_Durbar.csv';
    a.click();
    URL.revokeObjectURL(url);
    setIsOptionsMenuOpen(false);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Top Header Bar matching Screenshot 5 */}
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
          Measuring Unit
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
                      notifyToast('Column Settings', 'Columns visible: Short Name, Unit Name, Description', 'info');
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

      {/* Main Table Container matching Screenshot 5 */}
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
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead>
              <tr
                style={{
                  backgroundColor: 'var(--color-muted)',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <th style={{ padding: '14px 20px', width: '60px', fontSize: '0.84rem', fontWeight: 700 }}>SN</th>
                <th style={{ padding: '14px 20px', fontSize: '0.84rem', fontWeight: 700 }}>Short Name</th>
                <th style={{ padding: '14px 20px', fontSize: '0.84rem', fontWeight: 700 }}>Unit Name</th>
                <th style={{ padding: '14px 20px', fontSize: '0.84rem', fontWeight: 700 }}>Description</th>
                <th style={{ padding: '14px 20px', width: '50px', textAlign: 'center' }}></th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((u) => (
                <tr
                  key={u.id}
                  style={{
                    borderBottom: '1px solid var(--color-border)',
                    fontSize: '0.86rem',
                  }}
                >
                  <td style={{ padding: '14px 20px', color: 'var(--color-muted-foreground)', fontWeight: 600 }}>
                    {u.sn}
                  </td>
                  <td style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--color-foreground)' }}>
                    {u.shortName}
                  </td>
                  <td style={{ padding: '14px 20px', color: 'var(--color-foreground)' }}>
                    {u.unitName}
                  </td>
                  <td style={{ padding: '14px 20px', color: 'var(--color-muted-foreground)' }}>
                    {u.description}
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'center', position: 'relative' }}>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === u.id ? null : u.id)}
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

                    {activeDropdown === u.id && (
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
                            onClick={() => handleDelete(u.id)}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Row Counter matching Screenshot 5 */}
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

      {/* Add New Unit Modal */}
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
              maxWidth: '440px',
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
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Add Measuring Unit</h3>
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
                  Short Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. btl, cup, box"
                  value={newShortName}
                  onChange={(e) => setNewShortName(e.target.value)}
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

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                  Unit Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bottle, Cup, Box"
                  value={newUnitName}
                  onChange={(e) => setNewUnitName(e.target.value)}
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
                <input
                  type="text"
                  placeholder="Optional description"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
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
                  Save Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
