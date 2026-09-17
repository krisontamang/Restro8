import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Info,
  Heart,
  Archive,
  Square,
  ChevronDown,
} from 'lucide-react';

export const AddOnsView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const [addOns, setAddOns] = useState([
    {
      id: 'addon-1',
      sn: 1,
      name: 'Extra Cheese',
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=100&q=80',
      price: 'Rs 50',
      tax: '-',
      type: '-',
      usedIn: '0 Dishes',
      available: true,
    },
    {
      id: 'addon-2',
      sn: 2,
      name: 'Extra Mayonnaise',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=100&q=80',
      price: 'Rs 30',
      tax: '-',
      type: '-',
      usedIn: '0 Dishes',
      available: true,
    },
    {
      id: 'addon-3',
      sn: 3,
      name: 'French Fries',
      image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=100&q=80',
      price: 'Rs 90',
      tax: '-',
      type: '-',
      usedIn: '0 Dishes',
      available: true,
    },
    {
      id: 'addon-4',
      sn: 4,
      name: 'Honey',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=100&q=80',
      price: 'Rs 20',
      tax: '-',
      type: '-',
      usedIn: '0 Dishes',
      available: true,
    },
    {
      id: 'addon-5',
      sn: 5,
      name: 'Sugar Syrup',
      image: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=100&q=80',
      price: 'Rs 20',
      tax: '-',
      type: '-',
      usedIn: '1 Dishes',
      available: true,
    },
  ]);

  const toggleAvailable = (id: string) => {
    setAddOns(
      addOns.map((a) => (a.id === id ? { ...a, available: !a.available } : a))
    );
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === addOns.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(addOns.map((a) => a.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((r) => r !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const filtered = addOns.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '24px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Header Bar (Screenshot 3) */}
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
          }}
        >
          Add-Ons & Extras
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
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
            <Filter size={15} /> Filter
          </button>

          <button
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
            <Plus size={16} /> Add New Add-On <span style={{ opacity: 0.8, fontSize: '0.75rem' }}>[N]</span>
            <ChevronDown size={14} />
          </button>

          <button
            style={{
              padding: '8px 10px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              cursor: 'pointer',
              color: 'var(--color-muted-foreground)',
            }}
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Top 3 KPI Cards (Screenshot 3) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {/* Total Card */}
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
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '8px',
                  backgroundColor: '#E8F8F0',
                  color: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Archive size={15} />
              </div>
              <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--color-muted-foreground)' }}>
                Total
              </span>
            </div>
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#10B981',
                backgroundColor: '#E8F8F0',
                padding: '3px 8px',
                borderRadius: '12px',
              }}
            >
              5 Active
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 900 }}>5/250</div>
            <Info size={16} color="var(--color-muted-foreground)" />
          </div>
        </div>

        {/* Most Used Card */}
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
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(14, 165, 233, 0.1)',
                  color: 'var(--r8-brand-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Heart size={15} fill="var(--r8-brand-primary)" />
              </div>
              <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--color-muted-foreground)' }}>
                Most Used
              </span>
            </div>
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                padding: '3px 8px',
                borderRadius: '12px',
              }}
            >
              1 dishes
            </span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>Sugar Syrup</div>
        </div>

        {/* Top Add-Ons Type Card */}
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
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-muted)',
                  color: 'var(--color-muted-foreground)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Square size={15} />
              </div>
              <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--color-muted-foreground)' }}>
                Top Add-Ons Type
              </span>
            </div>
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                padding: '3px 8px',
                borderRadius: '12px',
              }}
            >
              5
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>Uncategorized</div>
            <Info size={16} color="var(--color-muted-foreground)" />
          </div>
        </div>
      </div>

      {/* Add-Ons Table (Screenshot 3) */}
      <div
        style={{
          backgroundColor: 'var(--color-card)',
          borderRadius: '14px',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.86rem',
              textAlign: 'left',
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: '1.5px solid var(--color-border)',
                  color: 'var(--color-muted-foreground)',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  backgroundColor: 'var(--color-card-elevated)',
                }}
              >
                <th style={{ padding: '14px 18px', width: '40px' }}>
                  <input
                    type="checkbox"
                    checked={selectedRows.length === addOns.length && addOns.length > 0}
                    onChange={toggleSelectAll}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                </th>
                <th style={{ padding: '14px 14px' }}>SN</th>
                <th style={{ padding: '14px 18px' }}>Add-On Name</th>
                <th style={{ padding: '14px 18px' }}>Price</th>
                <th style={{ padding: '14px 18px' }}>Tax</th>
                <th style={{ padding: '14px 18px' }}>Type</th>
                <th style={{ padding: '14px 18px' }}>Used In</th>
                <th style={{ padding: '14px 18px' }}>Available</th>
                <th style={{ padding: '14px 18px', width: '40px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((addon) => {
                const isSelected = selectedRows.includes(addon.id);

                return (
                  <tr
                    key={addon.id}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      backgroundColor: isSelected ? 'rgba(14, 165, 233, 0.04)' : 'transparent',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--color-muted)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td style={{ padding: '14px 18px' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(addon.id)}
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ padding: '14px 14px', fontWeight: 600, color: 'var(--color-muted-foreground)' }}>
                      {addon.sn}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <img
                          src={addon.image}
                          alt={addon.name}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            objectFit: 'cover',
                            border: '1px solid var(--color-border)',
                          }}
                        />
                        <strong style={{ fontSize: '0.92rem' }}>{addon.name}</strong>
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px', color: '#10B981', fontWeight: 700 }}>
                      {addon.price}
                    </td>
                    <td style={{ padding: '14px 18px', color: 'var(--color-muted-foreground)' }}>
                      {addon.tax}
                    </td>
                    <td style={{ padding: '14px 18px', color: 'var(--color-muted-foreground)' }}>
                      {addon.type}
                    </td>
                    <td style={{ padding: '14px 18px', color: 'var(--color-foreground)' }}>
                      {addon.usedIn}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      {/* Interactive Green Switch Toggle */}
                      <div
                        onClick={() => toggleAvailable(addon.id)}
                        style={{
                          width: '38px',
                          height: '20px',
                          borderRadius: '12px',
                          backgroundColor: addon.available ? '#22C55E' : 'var(--color-muted)',
                          padding: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: addon.available ? 'flex-end' : 'flex-start',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease',
                        }}
                      >
                        <div
                          style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            backgroundColor: '#FFFFFF',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                          }}
                        />
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <button
                        style={{
                          border: 'none',
                          background: 'transparent',
                          color: 'var(--color-muted-foreground)',
                          cursor: 'pointer',
                        }}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer row counter */}
        <div
          style={{
            padding: '12px 18px',
            fontSize: '0.78rem',
            color: 'var(--color-muted-foreground)',
            borderTop: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-card-elevated)',
          }}
        >
          {selectedRows.length} of {addOns.length} row(s) selected.
        </div>
      </div>
    </div>
  );
};
