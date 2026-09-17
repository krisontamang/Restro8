import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { MenuItem, MenuCategory, KitchenStation, TicketType, DietaryTag } from '../../types/restaurant';
import { formatNPR } from '../../utils/nepalDate';
import {
  UtensilsCrossed,
  Plus,
  Search,
  AlertTriangle,
  TrendingUp,
  PackageCheck,
  RotateCcw,
  Trash2,
  X,
} from 'lucide-react';

export const InventoryView: React.FC = () => {
  const {
    menuItems,
    toggleItemStock,
    updateStockQuantity,
    addMenuItem,
    deleteMenuItem,
  } = useRestaurant();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | 'all'>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in-stock' | 'low-stock' | '86'>('all');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDish, setNewDish] = useState<{
    name: string;
    nepaliName: string;
    category: MenuCategory;
    price: number;
    cost: number;
    prepTimeMinutes: number;
    description: string;
    image: string;
    station: KitchenStation;
    ticketType: TicketType;
    tags: DietaryTag[];
    stockQuantity: number;
    isThakali: boolean;
  }>({
    name: '',
    nepaliName: '',
    category: 'momo',
    price: 320,
    cost: 100,
    prepTimeMinutes: 12,
    description: '',
    image: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=600&q=80',
    station: 'momo',
    ticketType: 'KOT',
    tags: ['chef-pick'],
    stockQuantity: 30,
    isThakali: false,
  });

  // Filter items
  const filteredItems = menuItems.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (stockFilter === '86' && item.inStock) return false;
    if (stockFilter === 'in-stock' && (!item.inStock || item.stockQuantity <= 0)) return false;
    if (stockFilter === 'low-stock' && (item.stockQuantity > 5 || !item.inStock)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        (item.nepaliName && item.nepaliName.toLowerCase().includes(q)) ||
        item.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalItems = menuItems.length;
  const outOfStockCount = menuItems.filter((i) => !i.inStock || i.stockQuantity <= 0).length;
  const lowStockCount = menuItems.filter((i) => i.inStock && i.stockQuantity <= 5).length;
  const avgMargin = Math.round(
    menuItems.reduce((acc, i) => {
      const margin = ((i.price - i.cost) / (i.price || 1)) * 100;
      return acc + margin;
    }, 0) / (menuItems.length || 1)
  );

  const categories: { id: MenuCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Catalog' },
    { id: 'momo', label: 'Momo Junction' },
    { id: 'thakali_newari', label: 'Thakali & Newari' },
    { id: 'appetizers', label: 'Sekuwa & Snacks' },
    { id: 'cafe_bakery', label: 'Himalayan Coffee' },
    { id: 'beverages_bar', label: 'Bar & Beer' },
    { id: 'hookah', label: 'Hookah' },
  ];

  const handleCreateDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDish.name.trim()) return;

    addMenuItem({
      name: newDish.name,
      nepaliName: newDish.nepaliName || undefined,
      category: newDish.category,
      price: Number(newDish.price),
      cost: Number(newDish.cost),
      prepTimeMinutes: Number(newDish.prepTimeMinutes),
      description: newDish.description,
      image: newDish.image,
      station: newDish.station,
      ticketType: newDish.ticketType,
      tags: newDish.tags,
      inStock: newDish.stockQuantity > 0,
      stockQuantity: Number(newDish.stockQuantity),
      isThakali: newDish.isThakali,
    });

    setIsAddModalOpen(false);
    setNewDish({
      name: '',
      nepaliName: '',
      category: 'momo',
      price: 320,
      cost: 100,
      prepTimeMinutes: 12,
      description: '',
      image: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=600&q=80',
      station: 'momo',
      ticketType: 'KOT',
      tags: ['chef-pick'],
      stockQuantity: 30,
      isThakali: false,
    });
  };

  const handleBulkRestock = () => {
    menuItems.forEach((item) => {
      if (!item.inStock || item.stockQuantity <= 5) {
        updateStockQuantity(item.id, 25);
      }
    });
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Header & Stats Banner */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            padding: '16px 20px',
            borderRadius: '14px',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(220, 38, 38, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)',
            }}
          >
            <UtensilsCrossed size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-muted-foreground)', fontWeight: 600 }}>
              TOTAL CATALOG ITEMS
            </span>
            <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>{totalItems} Items</div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--color-card)',
            padding: '16px 20px',
            borderRadius: '14px',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#EF4444',
            }}
          >
            <AlertTriangle size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-muted-foreground)', fontWeight: 600 }}>
              86'D (सकियो)
            </span>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#EF4444' }}>
              {outOfStockCount} Items
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--color-card)',
            padding: '16px 20px',
            borderRadius: '14px',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F59E0B',
            }}
          >
            <PackageCheck size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-muted-foreground)', fontWeight: 600 }}>
              LOW STOCK (≤5)
            </span>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#F59E0B' }}>
              {lowStockCount} Items
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--color-card)',
            padding: '16px 20px',
            borderRadius: '14px',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10B981',
            }}
          >
            <TrendingUp size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-muted-foreground)', fontWeight: 600 }}>
              AVG FOOD MARGIN
            </span>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#10B981' }}>
              {avgMargin}%
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Category, Stock Filters, Add Button */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
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
            }}
          >
            <Search size={16} color="var(--color-muted-foreground)" />
            <input
              type="text"
              placeholder="Search dish or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                color: 'var(--color-foreground)',
                fontSize: '0.86rem',
                width: '180px',
              }}
            />
          </div>

          {/* Categories */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as MenuCategory | 'all')}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-card)',
              color: 'var(--color-foreground)',
              fontSize: '0.85rem',
              fontWeight: 600,
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>

          {/* Stock status filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-card)',
              color: 'var(--color-foreground)',
              fontSize: '0.85rem',
              fontWeight: 600,
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Stock Statuses</option>
            <option value="in-stock">In Stock Only</option>
            <option value="low-stock">Low Stock (≤5)</option>
            <option value="86">86'd / Sold Out (सकियो)</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleBulkRestock}
            className="btn-secondary"
            style={{ fontSize: '0.84rem' }}
          >
            <RotateCcw size={15} /> Quick Restock (+25 all)
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary"
            style={{ fontSize: '0.84rem' }}
          >
            <Plus size={16} /> Add New Dish
          </button>
        </div>
      </div>

      {/* Inventory & Menu Table */}
      <div
        style={{
          backgroundColor: 'var(--color-card)',
          borderRadius: '16px',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-muted)',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--color-muted-foreground)',
                }}
              >
                <th style={{ padding: '14px 18px' }}>Dish & Category</th>
                <th style={{ padding: '14px 18px' }}>Routing</th>
                <th style={{ padding: '14px 18px' }}>Selling Price</th>
                <th style={{ padding: '14px 18px' }}>Cost</th>
                <th style={{ padding: '14px 18px' }}>Profit Margin</th>
                <th style={{ padding: '14px 18px' }}>Stock Units</th>
                <th style={{ padding: '14px 18px' }}>86'd Status</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const marginAmount = item.price - item.cost;
                const marginPct = Math.round((marginAmount / (item.price || 1)) * 100);
                const is86 = !item.inStock || item.stockQuantity <= 0;

                return (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      fontSize: '0.88rem',
                      opacity: is86 ? 0.75 : 1,
                      backgroundColor: is86 ? 'rgba(239, 68, 68, 0.03)' : 'transparent',
                    }}
                  >
                    {/* Dish & Image */}
                    <td style={{ padding: '12px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '8px',
                            objectFit: 'cover',
                          }}
                        />
                        <div>
                          <strong style={{ fontWeight: 700, color: 'var(--color-foreground)' }}>
                            {item.name}
                          </strong>
                          {item.nepaliName && (
                            <p style={{ fontSize: '0.74rem', color: 'var(--color-muted-foreground)' }}>
                              {item.nepaliName}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Routing (KOT vs BOT) */}
                    <td style={{ padding: '12px 18px' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          backgroundColor: item.ticketType === 'KOT' ? 'rgba(220, 38, 38, 0.12)' : 'rgba(217, 119, 6, 0.12)',
                          color: item.ticketType === 'KOT' ? '#DC2626' : '#D97706',
                        }}
                      >
                        {item.ticketType}: {item.station}
                      </span>
                    </td>

                    {/* Price */}
                    <td style={{ padding: '12px 18px', fontWeight: 700 }}>
                      {formatNPR(item.price)}
                    </td>

                    {/* Cost */}
                    <td style={{ padding: '12px 18px', color: 'var(--color-muted-foreground)' }}>
                      {formatNPR(item.cost)}
                    </td>

                    {/* Margin */}
                    <td style={{ padding: '12px 18px' }}>
                      <span style={{ fontWeight: 700, color: marginPct > 65 ? '#10B981' : '#F59E0B' }}>
                        {marginPct}%
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-muted-foreground)', marginLeft: '4px' }}>
                        (+{formatNPR(marginAmount)})
                      </span>
                    </td>

                    {/* Stock Counter */}
                    <td style={{ padding: '12px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          onClick={() => updateStockQuantity(item.id, item.stockQuantity - 1)}
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '4px',
                            border: '1px solid var(--color-border)',
                            backgroundColor: 'var(--color-card-elevated)',
                            cursor: 'pointer',
                          }}
                        >
                          -
                        </button>
                        <span
                          style={{
                            minWidth: '28px',
                            textAlign: 'center',
                            fontWeight: 700,
                            color: item.stockQuantity <= 5 ? '#EF4444' : 'var(--color-foreground)',
                          }}
                        >
                          {item.stockQuantity}
                        </span>
                        <button
                          onClick={() => updateStockQuantity(item.id, item.stockQuantity + 5)}
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '4px',
                            border: '1px solid var(--color-border)',
                            backgroundColor: 'var(--color-card-elevated)',
                            cursor: 'pointer',
                          }}
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* 86 Toggle */}
                    <td style={{ padding: '12px 18px' }}>
                      <button
                        onClick={() => toggleItemStock(item.id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '0.76rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          backgroundColor: is86 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          color: is86 ? '#EF4444' : '#10B981',
                          border: is86 ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)',
                        }}
                      >
                        {is86 ? '86\'d (सकियो)' : 'In Stock'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                      <button
                        onClick={() => deleteMenuItem(item.id)}
                        title="Delete Dish"
                        style={{
                          padding: '6px',
                          borderRadius: '6px',
                          color: 'var(--color-muted-foreground)',
                          cursor: 'pointer',
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
      </div>

      {/* Add New Dish Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div
            className="modal-content"
            style={{ width: '540px', padding: '24px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
                borderBottom: '1px solid var(--color-border)',
                paddingBottom: '10px',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Create New Catalog Item</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{ padding: '4px', color: 'var(--color-muted-foreground)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateDish}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Item Name (English)
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Sukuti Sadeko"
                    value={newDish.name}
                    onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-card-elevated)',
                      color: 'var(--color-foreground)',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Nepali Name (नेपाली नाम)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. सुकुटी साधेको"
                    value={newDish.nepaliName}
                    onChange={(e) => setNewDish({ ...newDish, nepaliName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-card-elevated)',
                      color: 'var(--color-foreground)',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Category
                  </label>
                  <select
                    value={newDish.category}
                    onChange={(e) => setNewDish({ ...newDish, category: e.target.value as MenuCategory })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-card-elevated)',
                      color: 'var(--color-foreground)',
                      outline: 'none',
                    }}
                  >
                    <option value="momo">Momo Junction</option>
                    <option value="thakali_newari">Thakali & Newari</option>
                    <option value="appetizers">Sekuwa & Snacks</option>
                    <option value="cafe_bakery">Himalayan Coffee</option>
                    <option value="beverages_bar">Bar & Beer</option>
                    <option value="hookah">Hookah</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Ticket Routing
                  </label>
                  <select
                    value={newDish.ticketType}
                    onChange={(e) => setNewDish({ ...newDish, ticketType: e.target.value as TicketType })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-card-elevated)',
                      color: 'var(--color-foreground)',
                      outline: 'none',
                    }}
                  >
                    <option value="KOT">KOT (Kitchen Order Ticket)</option>
                    <option value="BOT">BOT (Bar Order Ticket)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Selling Price (Rs.)
                  </label>
                  <input
                    required
                    type="number"
                    value={newDish.price}
                    onChange={(e) => setNewDish({ ...newDish, price: parseFloat(e.target.value) || 0 })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-card-elevated)',
                      color: 'var(--color-foreground)',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Food Cost (Rs.)
                  </label>
                  <input
                    required
                    type="number"
                    value={newDish.cost}
                    onChange={(e) => setNewDish({ ...newDish, cost: parseFloat(e.target.value) || 0 })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-card-elevated)',
                      color: 'var(--color-foreground)',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Prep Time (Mins)
                  </label>
                  <input
                    type="number"
                    value={newDish.prepTimeMinutes}
                    onChange={(e) => setNewDish({ ...newDish, prepTimeMinutes: parseInt(e.target.value) || 10 })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-card-elevated)',
                      color: 'var(--color-foreground)',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Initial Stock
                  </label>
                  <input
                    type="number"
                    value={newDish.stockQuantity}
                    onChange={(e) => setNewDish({ ...newDish, stockQuantity: parseInt(e.target.value) || 0 })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-card-elevated)',
                      color: 'var(--color-foreground)',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Short description..."
                    value={newDish.description}
                    onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-card-elevated)',
                      color: 'var(--color-foreground)',
                      outline: 'none',
                      resize: 'none',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1.5 }}>
                  Add Item to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
