import React, { useState } from 'react';
import { notifyToast } from '../../utils/toast';
import {
  Search,
  Plus,
  MoreHorizontal,
  Layers,
  Check,
  X,
  Edit2,
  Trash2,
  Copy,
  ChevronDown,
} from 'lucide-react';

interface MenuSetItem {
  id: string;
  sn: number;
  name: string;
  services: string;
  subMenuCount: number;
  status: 'Used' | 'Inactive' | 'Draft';
}

export const MenuSetView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Initial Menu Set data matching Screenshot 4
  const [menuSets, setMenuSets] = useState<MenuSetItem[]>([
    {
      id: 'mset-1',
      sn: 1,
      name: 'Default Menuset',
      services: 'Dine In Service, Delivery Services, 3+ more...',
      subMenuCount: 3,
      status: 'Used',
    },
    {
      id: 'mset-2',
      sn: 2,
      name: 'Evening Special Menu',
      services: 'Dine In Service, Bar Service',
      subMenuCount: 2,
      status: 'Used',
    },
  ]);

  // New Menu Set form state
  const [newName, setNewName] = useState('');
  const [newServices, setNewServices] = useState('Dine In Service, Delivery Services');
  const [newSubMenuCount, setNewSubMenuCount] = useState(3);

  const toggleSelectAll = () => {
    if (selectedRows.length === menuSets.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(menuSets.map((m) => m.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((r) => r !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleCreateMenuSet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newSet: MenuSetItem = {
      id: `mset-${Date.now()}`,
      sn: menuSets.length + 1,
      name: newName.trim(),
      services: newServices.trim(),
      subMenuCount: Number(newSubMenuCount) || 1,
      status: 'Used',
    };

    setMenuSets([...menuSets, newSet]);
    setNewName('');
    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setMenuSets(menuSets.filter((m) => m.id !== id).map((m, idx) => ({ ...m, sn: idx + 1 })));
    setSelectedRows(selectedRows.filter((r) => r !== id));
    setActiveDropdown(null);
  };

  const filteredSets = menuSets.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.services.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '24px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Top Header matching Screenshot 4 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '22px',
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
          Menu Set
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Search Input */}
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
                width: '140px',
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
              transition: 'all 0.15s ease',
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

          {/* ⋯ Global Options Button */}
          <button
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-card)',
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
        </div>
      </div>

      {/* Main Table Container matching Screenshot 4 */}
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
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr
                style={{
                  backgroundColor: 'var(--color-muted)',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <th style={{ padding: '14px 16px', width: '40px' }}>
                  <input
                    type="checkbox"
                    checked={selectedRows.length === filteredSets.length && filteredSets.length > 0}
                    onChange={toggleSelectAll}
                    style={{ cursor: 'pointer', accentColor: 'var(--r8-brand-primary)' }}
                  />
                </th>
                <th
                  style={{
                    padding: '14px 16px',
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
                    padding: '14px 16px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: 'var(--color-foreground)',
                  }}
                >
                  Menu set Name
                </th>
                <th
                  style={{
                    padding: '14px 16px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: 'var(--color-foreground)',
                  }}
                >
                  Service
                </th>
                <th
                  style={{
                    padding: '14px 16px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: 'var(--color-foreground)',
                    width: '120px',
                  }}
                >
                  Sub Menu
                </th>
                <th
                  style={{
                    padding: '14px 16px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: 'var(--color-foreground)',
                    width: '100px',
                  }}
                >
                  Status
                </th>
                <th style={{ padding: '14px 16px', width: '50px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredSets.map((item) => {
                const isSelected = selectedRows.includes(item.id);
                return (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      backgroundColor: isSelected ? 'rgba(14, 165, 233, 0.03)' : 'transparent',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <td style={{ padding: '16px' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(item.id)}
                        style={{ cursor: 'pointer', accentColor: 'var(--r8-brand-primary)' }}
                      />
                    </td>
                    <td
                      style={{
                        padding: '16px',
                        fontSize: '0.86rem',
                        fontWeight: 700,
                        color: 'var(--color-foreground)',
                      }}
                    >
                      {item.sn}
                    </td>
                    <td
                      style={{
                        padding: '16px',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        color: 'var(--color-foreground)',
                      }}
                    >
                      {item.name}
                    </td>
                    <td
                      style={{
                        padding: '16px',
                        fontSize: '0.84rem',
                        color: 'var(--color-muted-foreground)',
                        fontWeight: 500,
                      }}
                    >
                      {item.services}
                    </td>
                    <td
                      style={{
                        padding: '16px',
                        fontSize: '0.86rem',
                        fontWeight: 700,
                        color: 'var(--color-foreground)',
                      }}
                    >
                      {item.subMenuCount}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '6px',
                          border: '1px solid #A7F3D0',
                          backgroundColor: '#ECFDF5',
                          color: '#10B981',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right', position: 'relative' }}>
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
                          borderRadius: '4px',
                        }}
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {/* Dropdown Menu */}
                      {activeDropdown === item.id && (
                        <div
                          style={{
                            position: 'absolute',
                            right: '16px',
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
                              notifyToast('Menu Set', `Edit menu set: ${item.name}`, 'info');
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

        {/* Bottom Row Selection Counter matching Screenshot 4 */}
        <div
          style={{
            padding: '14px 18px',
            borderTop: '1px solid var(--color-border)',
            fontSize: '0.82rem',
            color: 'var(--color-muted-foreground)',
          }}
        >
          {selectedRows.length} of {filteredSets.length} row(s) selected.
        </div>
      </div>

      {/* Add New Menu Set Modal */}
      {isAddModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
              maxWidth: '480px',
              padding: '24px',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <h2
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  margin: 0,
                  color: 'var(--color-foreground)',
                }}
              >
                Add New Menu Set
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-muted-foreground)',
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateMenuSet}>
              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    marginBottom: '6px',
                    color: 'var(--color-foreground)',
                  }}
                >
                  Menu Set Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Weekend Brunch Menu"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
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
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    marginBottom: '6px',
                    color: 'var(--color-foreground)',
                  }}
                >
                  Services
                </label>
                <input
                  type="text"
                  value={newServices}
                  onChange={(e) => setNewServices(e.target.value)}
                  placeholder="Dine In Service, Delivery Services, Takeaway..."
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
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    marginBottom: '6px',
                    color: 'var(--color-foreground)',
                  }}
                >
                  Number of Sub Menus Included
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={newSubMenuCount}
                  onChange={(e) => setNewSubMenuCount(Number(e.target.value))}
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
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'transparent',
                    color: 'var(--color-foreground)',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'var(--r8-brand-primary)',
                    color: '#FFFFFF',
                    fontSize: '0.86rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(14, 165, 233, 0.35)',
                  }}
                >
                  Save Menu Set
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
