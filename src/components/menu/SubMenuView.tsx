import React, { useState } from 'react';
import { notifyToast } from '../../utils/toast';
import {
  Search,
  Filter,
  Layers,
  Plus,
  MoreHorizontal,
  Info,
  Soup,
  Frown,
  Check,
  X,
  Edit2,
  Trash2,
  ChevronDown,
} from 'lucide-react';

interface SubMenuItem {
  id: string;
  sn: number;
  name: string;
  image: string;
  activeDishes: number;
  usedIn: string;
}

export const SubMenuView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Sub menu list matching Screenshot 5
  const [subMenus, setSubMenus] = useState<SubMenuItem[]>([
    {
      id: 'sub-1',
      sn: 1,
      name: 'Food Menu',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=120&q=80',
      activeDishes: 2,
      usedIn: '1 Menu Sets',
    },
    {
      id: 'sub-2',
      sn: 2,
      name: 'Bar Menu',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=120&q=80',
      activeDishes: 0,
      usedIn: '1 Menu Sets',
    },
    {
      id: 'sub-3',
      sn: 3,
      name: 'Cafe Menu',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=120&q=80',
      activeDishes: 4,
      usedIn: '1 Menu Sets',
    },
  ]);

  // Form states for creating a new Sub Menu
  const [newName, setNewName] = useState('');
  const [newImage, setNewImage] = useState(
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=120&q=80'
  );

  const toggleSelectAll = () => {
    if (selectedRows.length === subMenus.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(subMenus.map((s) => s.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((r) => r !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleCreateSubMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newItem: SubMenuItem = {
      id: `sub-${Date.now()}`,
      sn: subMenus.length + 1,
      name: newName.trim(),
      image: newImage || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=120&q=80',
      activeDishes: 0,
      usedIn: '1 Menu Sets',
    };

    setSubMenus([...subMenus, newItem]);
    setNewName('');
    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setSubMenus(subMenus.filter((s) => s.id !== id).map((s, idx) => ({ ...s, sn: idx + 1 })));
    setSelectedRows(selectedRows.filter((r) => r !== id));
    setActiveDropdown(null);
  };

  const filtered = subMenus.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Computed metrics for KPI cards
  const totalSubMenus = subMenus.length;
  const activeDishesCount = subMenus.reduce((sum, s) => sum + s.activeDishes, 0);
  const avgDishes = totalSubMenus > 0 ? Math.round(activeDishesCount / totalSubMenus) : 0;
  const unusedSubMenus = subMenus.filter((s) => s.activeDishes === 0).length;

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
          Sub Menu
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Search */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
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
            <Layers size={14} /> Arrange
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

          {/* ⋯ Button */}
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

      {/* 3 KPI Cards matching Screenshot 5 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {/* KPI 1: Total */}
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            padding: '18px 22px',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '100px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                <Layers size={15} />
              </div>
              <span
                style={{
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  color: 'var(--color-muted-foreground)',
                }}
              >
                Total
              </span>
            </div>

            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#10B981',
                backgroundColor: '#ECFDF5',
                padding: '2px 8px',
                borderRadius: '12px',
                border: '1px solid #D1FAE5',
              }}
            >
              {totalSubMenus} Active
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                fontSize: '1.75rem',
                fontWeight: 900,
                color: 'var(--color-foreground)',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {totalSubMenus}/20
            </div>
            <Info size={15} color="#9CA3AF" style={{ cursor: 'pointer' }} />
          </div>
        </div>

        {/* KPI 2: Avg. Dishes Per Sub Menu */}
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            padding: '18px 22px',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '100px',
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
              <Soup size={15} />
            </div>
            <span
              style={{
                fontSize: '0.86rem',
                fontWeight: 700,
                color: 'var(--color-muted-foreground)',
              }}
            >
              Avg. Dishes Per Sub Menu
            </span>
          </div>

          <div
            style={{
              fontSize: '1.75rem',
              fontWeight: 900,
              color: 'var(--color-foreground)',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            {avgDishes}
          </div>
        </div>

        {/* KPI 3: Unused Sub Menu */}
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            padding: '18px 22px',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '100px',
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
              <Frown size={15} />
            </div>
            <span
              style={{
                fontSize: '0.86rem',
                fontWeight: 700,
                color: 'var(--color-muted-foreground)',
              }}
            >
              Unused Sub Menu
            </span>
          </div>

          <div
            style={{
              fontSize: '1.75rem',
              fontWeight: 900,
              color: 'var(--color-foreground)',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            {unusedSubMenus}
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
                    checked={selectedRows.length === filtered.length && filtered.length > 0}
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
                  Sub Menu name
                </th>
                <th
                  style={{
                    padding: '14px 16px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: 'var(--color-foreground)',
                    width: '160px',
                  }}
                >
                  Active Dishes
                </th>
                <th
                  style={{
                    padding: '14px 16px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: 'var(--color-foreground)',
                    width: '160px',
                  }}
                >
                  Used In
                </th>
                <th style={{ padding: '14px 16px', width: '50px' }}></th>
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
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '1px solid var(--color-border)',
                            backgroundColor: 'var(--color-muted)',
                          }}
                        />
                        <span
                          style={{
                            fontSize: '0.88rem',
                            fontWeight: 700,
                            color: 'var(--color-foreground)',
                          }}
                        >
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: '16px',
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        color: 'var(--color-foreground)',
                      }}
                    >
                      {item.activeDishes} Dishes
                    </td>
                    <td
                      style={{
                        padding: '16px',
                        fontSize: '0.86rem',
                        color: 'var(--color-muted-foreground)',
                        fontWeight: 500,
                      }}
                    >
                      {item.usedIn}
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
                              notifyToast('Sub Menu', `Edit sub menu: ${item.name}`, 'info');
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

        {/* Bottom Selection Counter matching Screenshot 5 */}
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

      {/* Add New Sub Menu Modal */}
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
              maxWidth: '460px',
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
                Add New Sub Menu
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

            <form onSubmit={handleCreateSubMenu}>
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
                  Sub Menu Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dessert & Bakery Menu"
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
                  Cover Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
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
                  Save Sub Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
