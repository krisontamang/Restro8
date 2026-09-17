import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  FileText,
  X,
  Edit2,
  Trash2,
} from 'lucide-react';

interface ComboItem {
  id: string;
  sn: number;
  name: string;
  prepTime: string;
  category: string;
  type: string;
  subMenu: string;
  price: number;
  available: boolean;
}

export const ComboOfferView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [combos, setCombos] = useState<ComboItem[]>([]);

  // Add Combo Form State
  const [name, setName] = useState('');
  const [prepTime, setPrepTime] = useState('15 mins');
  const [category, setCategory] = useState('Lunch');
  const [type, setType] = useState('Non-Veg');
  const [subMenu, setSubMenu] = useState('Food Menu');
  const [price, setPrice] = useState('450');

  const handleCreateCombo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCombo: ComboItem = {
      id: `combo-${Date.now()}`,
      sn: combos.length + 1,
      name: name.trim(),
      prepTime,
      category,
      type,
      subMenu,
      price: Number(price) || 0,
      available: true,
    };

    setCombos([...combos, newCombo]);
    setName('');
    setIsAddModalOpen(false);
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === combos.length && combos.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(combos.map((c) => c.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((r) => r !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const toggleAvailability = (id: string) => {
    setCombos(
      combos.map((c) => (c.id === id ? { ...c, available: !c.available } : c))
    );
  };

  const handleDelete = (id: string) => {
    setCombos(combos.filter((c) => c.id !== id).map((c, idx) => ({ ...c, sn: idx + 1 })));
    setSelectedRows(selectedRows.filter((r) => r !== id));
  };

  const filteredCombos = combos.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '24px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Header Bar matching Screenshot 1 */}
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
          Combo Offer
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Search Box */}
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

      {/* Main Container / Table matching Screenshot 1 */}
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
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
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
                  Combo Name
                </th>
                <th
                  style={{
                    padding: '14px 18px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: 'var(--color-foreground)',
                  }}
                >
                  Preparation Time
                </th>
                <th
                  style={{
                    padding: '14px 18px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: 'var(--color-foreground)',
                  }}
                >
                  Category
                </th>
                <th
                  style={{
                    padding: '14px 18px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: 'var(--color-foreground)',
                  }}
                >
                  Type
                </th>
                <th
                  style={{
                    padding: '14px 18px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: 'var(--color-foreground)',
                  }}
                >
                  Sub Menu
                </th>
                <th
                  style={{
                    padding: '14px 18px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: 'var(--color-foreground)',
                  }}
                >
                  Price
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
              {filteredCombos.map((combo) => {
                const isSelected = selectedRows.includes(combo.id);
                return (
                  <tr
                    key={combo.id}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      backgroundColor: isSelected ? 'rgba(14, 165, 233, 0.03)' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '16px 18px', fontSize: '0.86rem', fontWeight: 700 }}>
                      {combo.sn}
                    </td>
                    <td style={{ padding: '16px 18px', fontSize: '0.88rem', fontWeight: 700 }}>
                      {combo.name}
                    </td>
                    <td style={{ padding: '16px 18px', fontSize: '0.84rem', color: 'var(--color-muted-foreground)' }}>
                      {combo.prepTime}
                    </td>
                    <td style={{ padding: '16px 18px', fontSize: '0.84rem' }}>
                      {combo.category}
                    </td>
                    <td style={{ padding: '16px 18px', fontSize: '0.84rem' }}>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: combo.type === 'Veg' ? '#DCFCE7' : '#FEE2E2',
                          color: combo.type === 'Veg' ? '#16A34A' : '#DC2626',
                        }}
                      >
                        {combo.type}
                      </span>
                    </td>
                    <td style={{ padding: '16px 18px', fontSize: '0.84rem' }}>
                      {combo.subMenu}
                    </td>
                    <td style={{ padding: '16px 18px', fontSize: '0.88rem', fontWeight: 800, color: '#10B981' }}>
                      Rs {combo.price}
                    </td>
                    <td style={{ padding: '16px 18px' }}>
                      <button
                        onClick={() => toggleAvailability(combo.id)}
                        style={{
                          width: '38px',
                          height: '20px',
                          borderRadius: '20px',
                          backgroundColor: combo.available ? '#10B981' : '#E5E7EB',
                          position: 'relative',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s',
                          padding: 0,
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
                            left: combo.available ? '20px' : '2px',
                            transition: 'left 0.2s',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                          }}
                        />
                      </button>
                    </td>
                    <td style={{ padding: '16px 18px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDelete(combo.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#EF4444',
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State matching Screenshot 1 */}
        {filteredCombos.length === 0 && (
          <div
            style={{
              padding: '60px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              margin: 'auto 0',
            }}
          >
            {/* Illustrated document stack */}
            <div
              style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                position: 'relative',
              }}
            >
              {/* Fanned out colored cards */}
              <div
                style={{
                  position: 'absolute',
                  width: '32px',
                  height: '42px',
                  borderRadius: '5px',
                  backgroundColor: '#10B981',
                  transform: 'rotate(-20deg) translate(-10px, 0)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                }}
              >
                <div style={{ width: '16px', height: '2px', backgroundColor: '#FFFFFF', opacity: 0.6 }} />
              </div>
              <div
                style={{
                  position: 'absolute',
                  width: '34px',
                  height: '44px',
                  borderRadius: '5px',
                  backgroundColor: '#2563EB',
                  zIndex: 2,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.18)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ width: '18px', height: '2px', backgroundColor: '#FFFFFF' }} />
                <div style={{ width: '14px', height: '2px', backgroundColor: '#FFFFFF', opacity: 0.8 }} />
                <div style={{ width: '10px', height: '2px', backgroundColor: '#FFFFFF', opacity: 0.6 }} />
              </div>
              <div
                style={{
                  position: 'absolute',
                  width: '32px',
                  height: '42px',
                  borderRadius: '5px',
                  backgroundColor: '#8B5CF6',
                  transform: 'rotate(20deg) translate(10px, 0)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ width: '16px', height: '2px', backgroundColor: '#FFFFFF', opacity: 0.6 }} />
              </div>
            </div>

            <h3
              style={{
                fontSize: '1.2rem',
                fontWeight: 900,
                color: 'var(--color-foreground)',
                margin: '0 0 8px 0',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              No Combo Offer found
            </h3>
            <p
              style={{
                fontSize: '0.86rem',
                color: 'var(--color-muted-foreground)',
                margin: '0 0 20px 0',
              }}
            >
              Create a new Combo Offer.
            </p>

            <button
              onClick={() => setIsAddModalOpen(true)}
              style={{
                display: 'flex',
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
                boxShadow: '0 2px 8px rgba(14, 165, 233, 0.35)',
              }}
            >
              <Plus size={16} /> Add New
            </button>
          </div>
        )}

        {/* Bottom selection counter matching Screenshot 1 */}
        <div
          style={{
            padding: '14px 18px',
            borderTop: '1px solid var(--color-border)',
            fontSize: '0.82rem',
            color: 'var(--color-muted-foreground)',
          }}
        >
          {selectedRows.length} of {filteredCombos.length} row(s) selected.
        </div>
      </div>

      {/* Add New Combo Offer Modal */}
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
                Create Combo Offer
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

            <form onSubmit={handleCreateCombo}>
              <div style={{ marginBottom: '14px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    marginBottom: '6px',
                    color: 'var(--color-foreground)',
                  }}
                >
                  Combo Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Student Burger & Mojito Combo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      marginBottom: '6px',
                      color: 'var(--color-foreground)',
                    }}
                  >
                    Preparation Time
                  </label>
                  <input
                    type="text"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
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
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      marginBottom: '6px',
                      color: 'var(--color-foreground)',
                    }}
                  >
                    Price (Rs.)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
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
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      marginBottom: '6px',
                      color: 'var(--color-foreground)',
                    }}
                  >
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
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
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      marginBottom: '6px',
                      color: 'var(--color-foreground)',
                    }}
                  >
                    Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
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
                    <option value="Non-Veg">Non-Veg</option>
                    <option value="Veg">Veg</option>
                  </select>
                </div>
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
                  Save Combo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
