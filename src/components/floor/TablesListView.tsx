import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Armchair,
  Info,
  Upload,
  Columns3,
  Layers,
  X,
  Edit2,
  Trash2,
} from 'lucide-react';
import { notifyToast } from '../../utils/toast';

interface TableRow {
  id: string;
  sn: number;
  name: string;
  type: string;
  space: string;
  capacity: number;
  charge: string;
  status: 'Occupied' | 'Open' | 'Reserved';
  available: boolean;
}

export const TablesListView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [showOverviewCards, setShowOverviewCards] = useState(true);

  // Table rows matching Screenshot 5
  const [tables, setTables] = useState<TableRow[]>([
    {
      id: 'tbl-1',
      sn: 1,
      name: 'Cabin 1',
      type: 'Cabin',
      space: '-',
      capacity: 4,
      charge: '-',
      status: 'Occupied',
      available: true,
    },
    {
      id: 'tbl-2',
      sn: 2,
      name: 'Table 1',
      type: 'Table',
      space: '-',
      capacity: 4,
      charge: '-',
      status: 'Open',
      available: true,
    },
    {
      id: 'tbl-3',
      sn: 3,
      name: 'Table 2',
      type: 'Table',
      space: '-',
      capacity: 4,
      charge: '-',
      status: 'Open',
      available: true,
    },
  ]);

  // Add Table form state
  const [newTableName, setNewTableName] = useState('');
  const [newType, setNewType] = useState('Table');
  const [newCapacity, setNewCapacity] = useState(4);

  const toggleSelectAll = () => {
    if (selectedRows.length === tables.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(tables.map((t) => t.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((r) => r !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const toggleAvailable = (id: string) => {
    setTables(
      tables.map((t) => (t.id === id ? { ...t, available: !t.available } : t))
    );
  };

  const handleCreateTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableName.trim()) return;

    const newTbl: TableRow = {
      id: `tbl-${Date.now()}`,
      sn: tables.length + 1,
      name: newTableName.trim(),
      type: newType,
      space: '-',
      capacity: Number(newCapacity) || 4,
      charge: '-',
      status: 'Open',
      available: true,
    };

    setTables([...tables, newTbl]);
    setNewTableName('');
    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setTables(tables.filter((t) => t.id !== id).map((t, idx) => ({ ...t, sn: idx + 1 })));
    setSelectedRows(selectedRows.filter((r) => r !== id));
    setActiveDropdown(null);
  };

  const filtered = tables.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportCSV = () => {
    const headers = ['SN,Table Name,Types,Space,Capacity,Charge,Status,Available'];
    const rows = tables.map(
      (t) =>
        `${t.sn},"${t.name}","${t.type}","${t.space}",${t.capacity},"${t.charge}","${t.status}",${t.available ? 'Active' : 'Inactive'}`
    );
    const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Restro8_Tables.csv';
    a.click();
    URL.revokeObjectURL(url);
    setIsOptionsMenuOpen(false);
  };

  const occupiedCount = tables.filter((t) => t.status === 'Occupied').length;
  const activeCount = tables.filter((t) => t.available).length;

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
          Tables
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Search Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-xs)',
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
                background: 'transparent',
                outline: 'none',
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
                      notifyToast('Column Settings', 'Columns visible: Table Name, Types, Space, Capacity, Charge, Status, Available', 'info');
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

      {/* Top 3 KPI Cards matching Screenshot 5 */}
      {showOverviewCards && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          {/* KPI 1: Total Tables */}
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
              <Armchair size={15} />
            </div>
            <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--color-muted-foreground)' }}>
              Total Tables
            </span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-foreground)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {tables.length}/50
          </div>
        </div>

        {/* KPI 2: Active Tables */}
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
                backgroundColor: '#E8F8F0',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Armchair size={15} />
            </div>
            <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--color-muted-foreground)' }}>
              Active Tables
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-foreground)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {activeCount}/{tables.length}
            </div>
            <Info size={15} color="#9CA3AF" style={{ cursor: 'pointer' }} />
          </div>
        </div>

        {/* KPI 3: Occupied Tables */}
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
                backgroundColor: '#FEE2E2',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Armchair size={15} />
            </div>
            <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--color-muted-foreground)' }}>
              Occupied Tables
            </span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-foreground)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {occupiedCount}/{tables.length}
          </div>
        </div>
      </div>
      )}

      {/* Main Table Container matching Screenshot 5 */}
      <div
        style={{
          backgroundColor: 'var(--color-card)',
          borderRadius: '12px',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '920px' }}>
            <thead>
              <tr
                style={{
                  backgroundColor: 'var(--color-muted)',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <th
                  style={{
                    padding: '14px 18px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: 'var(--color-foreground)',
                    width: '60px',
                  }}
                >
                  SN
                </th>
                <th
                  style={{
                    padding: '14px 18px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: 'var(--color-foreground)',
                  }}
                >
                  Table Name
                </th>
                <th
                  style={{
                    padding: '14px 18px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: 'var(--color-foreground)',
                  }}
                >
                  Types
                </th>
                <th
                  style={{
                    padding: '14px 18px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: 'var(--color-foreground)',
                  }}
                >
                  Space
                </th>
                <th
                  style={{
                    padding: '14px 18px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: 'var(--color-foreground)',
                  }}
                >
                  Capacity
                </th>
                <th
                  style={{
                    padding: '14px 18px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: 'var(--color-foreground)',
                  }}
                >
                  Charge
                </th>
                <th
                  style={{
                    padding: '14px 18px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: 'var(--color-foreground)',
                    width: '120px',
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: '14px 18px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: 'var(--color-foreground)',
                    width: '100px',
                  }}
                >
                  Available
                </th>
                <th style={{ padding: '14px 18px', width: '50px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const isSelected = selectedRows.includes(item.id);
                return (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      backgroundColor: isSelected ? 'rgba(14, 165, 233, 0.03)' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '16px 18px', fontSize: '0.86rem', fontWeight: 700 }}>
                      {item.sn}
                    </td>
                    <td style={{ padding: '16px 18px', fontSize: '0.88rem', fontWeight: 700 }}>
                      {item.name}
                    </td>
                    <td style={{ padding: '16px 18px', fontSize: '0.84rem' }}>
                      {item.type}
                    </td>
                    <td style={{ padding: '16px 18px', fontSize: '0.84rem', color: 'var(--color-muted-foreground)' }}>
                      {item.space}
                    </td>
                    <td style={{ padding: '16px 18px', fontSize: '0.86rem', fontWeight: 700 }}>
                      {item.capacity}
                    </td>
                    <td style={{ padding: '16px 18px', fontSize: '0.84rem', color: 'var(--color-muted-foreground)' }}>
                      {item.charge}
                    </td>
                    <td style={{ padding: '16px 18px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 12px',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          border: item.status === 'Occupied' ? '1px solid #A7F3D0' : '1px solid #BFDBFE',
                          backgroundColor: item.status === 'Occupied' ? '#ECFDF5' : '#EFF6FF',
                          color: item.status === 'Occupied' ? '#10B981' : '#3B82F6',
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 18px' }}>
                      <button
                        onClick={() => toggleAvailable(item.id)}
                        style={{
                          width: '38px',
                          height: '20px',
                          borderRadius: '20px',
                          backgroundColor: item.available ? '#10B981' : '#E5E7EB',
                          position: 'relative',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                          transition: 'background-color 0.2s',
                        }}
                      >
                        <span
                          style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            backgroundColor: '#FFFFFF',
                            position: 'absolute',
                            top: '2px',
                            left: item.available ? '20px' : '2px',
                            transition: 'left 0.2s',
                          }}
                        />
                      </button>
                    </td>
                    <td style={{ padding: '16px 18px', textAlign: 'right', position: 'relative' }}>
                      <button
                        onClick={() =>
                          setActiveDropdown(activeDropdown === item.id ? null : item.id)
                        }
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--color-muted-foreground)',
                          padding: '4px',
                        }}
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {/* Dropdown Menu */}
                      {activeDropdown === item.id && (
                        <div
                          style={{
                            position: 'absolute',
                            right: '18px',
                            top: '44px',
                            backgroundColor: 'var(--color-card)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '8px',
                            boxShadow: 'var(--shadow-md)',
                            zIndex: 20,
                            minWidth: '130px',
                            overflow: 'hidden',
                          }}
                        >
                          <button
                            onClick={() => {
                              notifyToast('Edit Table', `Editing details for table: ${item.name}`, 'info');
                              setActiveDropdown(null);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              width: '100%',
                              padding: '8px 12px',
                              border: 'none',
                              backgroundColor: 'transparent',
                              fontSize: '0.82rem',
                              color: 'var(--color-foreground)',
                              cursor: 'pointer',
                              textAlign: 'left',
                            }}
                          >
                            <Edit2 size={13} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              width: '100%',
                              padding: '8px 12px',
                              border: 'none',
                              backgroundColor: 'transparent',
                              fontSize: '0.82rem',
                              color: '#EF4444',
                              cursor: 'pointer',
                              textAlign: 'left',
                            }}
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom selection counter matching Screenshot 5 */}
        <div
          style={{
            padding: '14px 18px',
            borderTop: '1px solid var(--color-border)',
            fontSize: '0.82rem',
            color: 'var(--color-muted-foreground)',
          }}
        >
          {selectedRows.length} of {filtered.length} row(s) selected.
        </div>
      </div>

      {/* Add New Table Modal */}
      {isAddModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-card)',
              borderRadius: '16px',
              border: '1px solid var(--color-border)',
              width: '100%',
              maxWidth: '440px',
              padding: '24px',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Add New Table</h2>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTable}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                  Table / Cabin Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Table 3, Rooftop VIP 1"
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-background)',
                    color: 'var(--color-foreground)',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                    Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-background)',
                      color: 'var(--color-foreground)',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="Table">Table</option>
                    <option value="Cabin">Cabin</option>
                    <option value="Rooftop">Rooftop</option>
                    <option value="Bar Stool">Bar Stool</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                    Capacity (Seats)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-background)',
                      color: 'var(--color-foreground)',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'transparent' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: 'var(--r8-brand-primary)', color: '#FFFFFF', border: 'none', fontWeight: 800 }}
                >
                  Create Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
