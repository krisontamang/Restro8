import React, { useState } from 'react';
import {
  Search,
  Plus,
  MoreHorizontal,
  Upload,
  Columns3,
  Layers,
  ArrowUpDown,
  X,
  Edit2,
  Trash2,
  Check,
} from 'lucide-react';
import { notifyToast } from '../../utils/toast';

interface SpaceItem {
  id: string;
  sn: number;
  name: string;
  totalTables: number;
  capacity: number;
  description?: string;
}

export const SpacesListView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [spaces, setSpaces] = useState<SpaceItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Form states for new space
  const [newSpaceName, setNewSpaceName] = useState('');
  const [newSpaceCapacity, setNewSpaceCapacity] = useState('20');
  const [newSpaceDesc, setNewSpaceDesc] = useState('');

  const toggleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((r) => r !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === filteredSpaces.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredSpaces.map((s) => s.id));
    }
  };

  const handleCreateSpace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpaceName.trim()) return;

    const newSpace: SpaceItem = {
      id: `space-${Date.now()}`,
      sn: spaces.length + 1,
      name: newSpaceName.trim(),
      totalTables: 0,
      capacity: Number(newSpaceCapacity) || 20,
      description: newSpaceDesc.trim(),
    };

    setSpaces([...spaces, newSpace]);
    setNewSpaceName('');
    setNewSpaceCapacity('20');
    setNewSpaceDesc('');
    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setSpaces(
      spaces
        .filter((s) => s.id !== id)
        .map((s, idx) => ({ ...s, sn: idx + 1 }))
    );
    setSelectedRows(selectedRows.filter((r) => r !== id));
    setActiveDropdown(null);
  };

  const filteredSpaces = spaces.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportCSV = () => {
    const headers = ['SN,Name,Total Tables,Capacity'];
    const rows = spaces.map(
      (s) => `${s.sn},"${s.name}",${s.totalTables},${s.capacity}`
    );
    const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Restro8_Spaces.csv';
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
        <h1
          style={{
            fontSize: '1.45rem',
            fontWeight: 900,
            margin: 0,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            color: 'var(--color-foreground)',
          }}
        >
          Spaces
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

          {/* Arrange Button */}
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
            <ArrowUpDown size={14} /> Arrange
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

          {/* Options ⋯ with Dropdown Menu matching Screenshot 1 */}
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
                <div
                  onClick={() => setIsOptionsMenuOpen(false)}
                  style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    right: 0,
                    width: '180px',
                    backgroundColor: 'var(--color-card)',
                    borderRadius: '12px',
                    border: '1px solid var(--color-border)',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
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
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-muted)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <Upload size={16} />
                    <span>Export</span>
                  </button>

                  <button
                    onClick={() => {
                      notifyToast('Column Settings', 'Columns visible: Name, Total Tables, Capacity', 'info');
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
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-muted)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <Columns3 size={16} />
                    <span>Columns</span>
                  </button>

                  <button
                    onClick={() => {
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
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-muted)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
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

      {/* Main Table Container matching Screenshot 2 */}
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
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr
              style={{
                backgroundColor: 'var(--color-muted)',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <th style={{ padding: '14px 20px', width: '70px', fontSize: '0.84rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                SN
              </th>
              <th style={{ padding: '14px 20px', fontSize: '0.84rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                Name
              </th>
              <th style={{ padding: '14px 20px', fontSize: '0.84rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                Total Tables
              </th>
              <th style={{ padding: '14px 20px', fontSize: '0.84rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                Capacity
              </th>
            </tr>
          </thead>

          {filteredSpaces.length > 0 && (
            <tbody>
              {filteredSpaces.map((space) => {
                const isSelected = selectedRows.includes(space.id);
                return (
                  <tr
                    key={space.id}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      backgroundColor: isSelected ? 'rgba(14, 165, 233, 0.04)' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '14px 20px', fontSize: '0.86rem', color: 'var(--color-muted-foreground)', fontWeight: 600 }}>
                      {space.sn}
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                      {space.name}
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '0.86rem', color: 'var(--color-foreground)' }}>
                      {space.totalTables}
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '0.86rem', color: 'var(--color-foreground)' }}>
                      {space.capacity}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>

        {/* Empty State when no spaces matching Screenshot 2 */}
        {filteredSpaces.length === 0 && (
          <div
            style={{
              padding: '60px 20px',
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
              {/* Green document card (rotated left -20deg) */}
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

              {/* Purple document card (rotated right +20deg) */}
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
              No space found
            </h2>

            <p
              style={{
                fontSize: '0.88rem',
                color: 'var(--color-muted-foreground)',
                margin: '0 0 22px 0',
                maxWidth: '400px',
              }}
            >
              Create a new space or import a new data.
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
              <Plus size={16} /> Add New Space
            </button>
          </div>
        )}
      </div>

      {/* Footer Selected Row Counter matching Screenshot 2 */}
      <div
        style={{
          marginTop: '12px',
          fontSize: '0.82rem',
          color: 'var(--color-muted-foreground)',
          fontWeight: 600,
        }}
      >
        {selectedRows.length} of {filteredSpaces.length} row(s) selected.
      </div>

      {/* Add New Space Modal */}
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
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                Add New Space
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--color-muted-foreground)',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSpace} style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                  Space Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Main Dining Hall, Rooftop Terrace, Cabin Area"
                  value={newSpaceName}
                  onChange={(e) => setNewSpaceName(e.target.value)}
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

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                  Estimated Seating Capacity
                </label>
                <input
                  type="number"
                  min="1"
                  value={newSpaceCapacity}
                  onChange={(e) => setNewSpaceCapacity(e.target.value)}
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
                  Description / Notes
                </label>
                <textarea
                  placeholder="Optional details (e.g. 1st floor outdoor seating with valley view)"
                  value={newSpaceDesc}
                  onChange={(e) => setNewSpaceDesc(e.target.value)}
                  rows={3}
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
                  Create Space
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
