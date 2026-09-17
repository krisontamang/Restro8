import { menuImage } from './menuImage';
import React, { useState, useMemo } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { MenuItem, MenuCategory, KitchenStation, TicketType } from '../../types/restaurant';
import { Page, PageHeader, PageToolbar, PageContent } from '../layout/PageFramework';
import {
  MetricCard,
  Table,
  Button,
  SearchInput,
  Select,
  Badge,
  Switch,
  Modal,
  FormField,
  Input,
  NumberInput,
  EmptyState,
  ConfirmDialog,
  PriceDisplay,
} from '../ui';
import {
  Plus,
  Utensils,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Edit2,
  Trash2,
  DollarSign,
} from 'lucide-react';

export const DishesCatalogView: React.FC = () => {
  const {
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleItemStock,
    addToast,
  } = useRestaurant();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'instock' | 'outofstock'>('all');
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formNepaliName, setFormNepaliName] = useState('');
  const [formCategory, setFormCategory] = useState<MenuCategory>('mains');
  const [formPrice, setFormPrice] = useState(250);
  const [formCost, setFormCost] = useState(120);
  const [formPrepTime, setFormPrepTime] = useState(15);
  const [formStockQty, setFormStockQty] = useState(20);
  const [formInStock, setFormInStock] = useState(true);
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formStation, setFormStation] = useState<KitchenStation>('kitchen');
  const [formTicketType, setFormTicketType] = useState<TicketType>('KOT');
  const [formDishType, setFormDishType] = useState<'Veg' | 'Non-Veg' | 'Beverage'>('Non-Veg');

  // Filter items
  const filteredDishes = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.nepaliName && item.nepaliName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;

      const matchesStock =
        stockFilter === 'all' ||
        (stockFilter === 'instock' && item.inStock) ||
        (stockFilter === 'outofstock' && !item.inStock);

      return matchesSearch && matchesCat && matchesStock;
    });
  }, [menuItems, searchQuery, selectedCategory, stockFilter]);

  // Metrics
  const totalDishes = menuItems.length;
  const inStockDishes = menuItems.filter((m) => m.inStock).length;
  const outOfStockDishes = totalDishes - inStockDishes;
  const avgPrice = totalDishes > 0 ? Math.round(menuItems.reduce((acc, m) => acc + m.price, 0) / totalDishes) : 0;

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedRowIds.length === filteredDishes.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(filteredDishes.map((d) => d.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormNepaliName('');
    setFormCategory('mains');
    setFormPrice(250);
    setFormCost(120);
    setFormPrepTime(15);
    setFormStockQty(25);
    setFormInStock(true);
    setFormDescription('');
    setFormImage('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80');
    setFormStation('kitchen');
    setFormTicketType('KOT');
    setFormDishType('Non-Veg');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormNepaliName(item.nepaliName || '');
    setFormCategory(item.category);
    setFormPrice(item.price);
    setFormCost(item.cost || Math.round(item.price * 0.45));
    setFormPrepTime(item.prepTimeMinutes || 15);
    setFormStockQty(item.stockQuantity ?? 20);
    setFormInStock(item.inStock);
    setFormDescription(item.description || '');
    setFormImage(item.image);
    setFormStation(item.station || 'kitchen');
    setFormTicketType(item.ticketType || 'KOT');
    setFormDishType((item.dishType as any) || 'Non-Veg');
    setIsModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingItem) {
      updateMenuItem({
        ...editingItem,
        name: formName.trim(),
        nepaliName: formNepaliName.trim() || undefined,
        category: formCategory,
        price: formPrice,
        cost: formCost,
        prepTimeMinutes: formPrepTime,
        stockQuantity: formStockQty,
        inStock: formInStock,
        description: formDescription,
        image: formImage || editingItem.image,
        station: formStation,
        ticketType: formTicketType,
        dishType: formDishType,
      });
      addToast('Dish Updated', `${formName} catalog details updated.`, 'success');
    } else {
      addMenuItem({
        name: formName.trim(),
        nepaliName: formNepaliName.trim() || undefined,
        category: formCategory,
        price: formPrice,
        cost: formCost,
        prepTimeMinutes: formPrepTime,
        stockQuantity: formStockQty,
        inStock: formInStock,
        description: formDescription,
        image:
          formImage ||
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80',
        station: formStation,
        ticketType: formTicketType,
        tags: formDishType === 'Veg' ? ['veg'] : [],
        dishType: formDishType,
        subMenu: formCategory === 'beverages_bar' || formCategory === 'cafe_bakery' ? 'Cafe Menu' : 'Food Menu',
      });
      addToast('Dish Created', `${formName} added to menu catalog.`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    deleteMenuItem(id);
    setDeleteConfirmId(null);
    setSelectedRowIds((prev) => prev.filter((rowId) => rowId !== id));
    addToast('Dish Deleted', 'The item has been removed from the catalog.', 'info');
  };

  const handleBulkToggleStock = (inStock: boolean) => {
    selectedRowIds.forEach((id) => {
      const item = menuItems.find((m) => m.id === id);
      if (item && item.inStock !== inStock) {
        toggleItemStock(id);
      }
    });
    addToast('Bulk Status Updated', `Updated stock status for ${selectedRowIds.length} items.`, 'success');
    setSelectedRowIds([]);
  };

  return (
    <Page>
      <PageHeader
        title="Products & Dishes Catalog"
        description="Manage menu items, selling rates, kitchen routing, and availability for POS and online ordering."
        badge={<Badge variant="primary">{totalDishes} Dishes</Badge>}
        primaryAction={
          <Button
            variant="primary"
            leftIcon={<Plus size={16} />}
            onClick={handleOpenAddModal}
          >
            Add New Dish
          </Button>
        }
      />

      {/* KPI Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'var(--r8-space-4)',
          width: '100%',
        }}
      >
        <MetricCard
          label="Total Dishes"
          value={totalDishes}
          icon={<Utensils size={18} />}
          variant="primary"
          subtext="Across all menu sections"
        />
        <MetricCard
          label="Active In Stock"
          value={inStockDishes}
          icon={<CheckCircle2 size={18} />}
          variant="success"
          subtext={`${Math.round((inStockDishes / (totalDishes || 1)) * 100)}% live in POS`}
        />
        <MetricCard
          label="Out of Stock"
          value={outOfStockDishes}
          icon={<AlertTriangle size={18} />}
          variant={outOfStockDishes > 0 ? 'coral' : 'default'}
          subtext="Hidden from active ordering"
        />
        <MetricCard
          label="Average Dish Price"
          value={`Rs. ${avgPrice}`}
          icon={<DollarSign size={18} />}
          variant="default"
          subtext="Catalog weighted average"
        />
      </div>

      <PageToolbar>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--r8-space-3)', flexWrap: 'wrap', flex: 1 }}>
          <div style={{ flex: '1 1 240px', maxWidth: '360px' }}>
            <SearchInput
              placeholder="Search dish or category..."
              value={searchQuery}
              onChange={(val) => setSearchQuery(val)}
              onClear={() => setSearchQuery('')}
            />
          </div>
          <div style={{ width: '160px' }}>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              options={[
                { label: 'All Categories', value: 'all' },
                { label: 'Momo & Dumplings', value: 'momo' },
                { label: 'Thakali & Newari', value: 'thakali_newari' },
                { label: 'Appetizers & Snacks', value: 'appetizers' },
                { label: 'Main Courses', value: 'mains' },
                { label: 'Cafe & Bakery', value: 'cafe_bakery' },
                { label: 'Beverages & Bar', value: 'beverages_bar' },
                { label: 'Desserts', value: 'desserts' },
              ]}
            />
          </div>
          <div style={{ width: '150px' }}>
            <Select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              options={[
                { label: 'All Status', value: 'all' },
                { label: 'In Stock Only', value: 'instock' },
                { label: 'Out of Stock', value: 'outofstock' },
              ]}
            />
          </div>
        </div>

        {selectedRowIds.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--r8-text-secondary)', fontWeight: 600 }}>
              {selectedRowIds.length} selected
            </span>
            <Button size="sm" variant="secondary" onClick={() => handleBulkToggleStock(true)}>
              Mark In Stock
            </Button>
            <Button size="sm" variant="secondary" onClick={() => handleBulkToggleStock(false)}>
              Mark Out of Stock
            </Button>
          </div>
        )}
      </PageToolbar>

      <PageContent>
        {filteredDishes.length === 0 ? (
          <EmptyState
            icon={<Utensils size={40} />}
            title="No dishes found"
            description={
              searchQuery || selectedCategory !== 'all'
                ? 'Try adjusting your search query or category filters.'
                : 'Your menu catalog is currently empty. Add your first dish to start selling.'
            }
            actionLabel="Add New Dish"
            onAction={handleOpenAddModal}
          />
        ) : (
          <div className="r8-table-container">
            <Table>
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input
                      type="checkbox"
                      checked={selectedRowIds.length === filteredDishes.length && filteredDishes.length > 0}
                      onChange={toggleSelectAll}
                      style={{ cursor: 'pointer' }}
                    />
                  </th>
                  <th>Dish</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Selling Price</th>
                  <th>Prep Time</th>
                  <th>Stock Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDishes.map((dish) => {
                  const isSelected = selectedRowIds.includes(dish.id);
                  return (
                    <tr
                      key={dish.id}
                      style={{
                        backgroundColor: isSelected ? 'var(--r8-surface-subtle)' : undefined,
                      }}
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(dish.id)}
                          style={{ cursor: 'pointer' }}
                        />
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={menuImage(dish)}
                            alt={dish.name}
                            style={{
                              width: '44px',
                              height: '44px',
                              borderRadius: 'var(--r8-radius-md)',
                              objectFit: 'cover',
                              border: '1px solid var(--r8-border-subtle)',
                              flexShrink: 0,
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--r8-text-primary)' }}>
                              {dish.name}
                            </div>
                            {dish.nepaliName && (
                              <div style={{ fontSize: '0.76rem', color: 'var(--r8-text-muted)' }}>
                                {dish.nepaliName}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge variant="neutral" size="sm">
                          {dish.category}
                        </Badge>
                      </td>
                      <td>
                        <Badge
                          variant={dish.dishType === 'Veg' ? 'success' : 'neutral'}
                          size="sm"
                        >
                          {dish.dishType || (dish.tags?.includes('veg') ? 'Veg' : 'Non-Veg')}
                        </Badge>
                      </td>
                      <td>
                        <PriceDisplay amount={dish.price} size="md" />
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem', color: 'var(--r8-text-secondary)' }}>
                          <Clock size={13} />
                          <span>{dish.prepTimeMinutes || 15} min</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Switch
                            checked={dish.inStock}
                            onChange={() => toggleItemStock(dish.id)}
                            size="sm"
                          />
                          <span
                            style={{
                              fontSize: '0.82rem',
                              fontWeight: 600,
                              color: dish.inStock ? 'var(--r8-status-success)' : 'var(--r8-status-danger)',
                            }}
                          >
                            {dish.inStock ? 'In Stock' : 'Unavailable'}
                          </span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditModal(dish)}
                            title="Edit dish"
                          >
                            <Edit2 size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteConfirmId(dish.id)}
                            title="Delete dish"
                            style={{ color: 'var(--r8-status-danger)' }}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        )}
      </PageContent>

      {/* Add / Edit Dish Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Product / Dish' : 'Add New Product / Dish'}
        size="lg"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveItem}>
              {editingItem ? 'Save Changes' : 'Create Product'}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSaveItem} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--r8-space-4)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--r8-space-4)' }}>
            <FormField label="Dish Name (English)" required>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Steam Chicken Momo"
                required
              />
            </FormField>
            <FormField label="Nepali Name (देवनागरी)">
              <Input
                value={formNepaliName}
                onChange={(e) => setFormNepaliName(e.target.value)}
                placeholder="e.g. चिकेन मःमः"
              />
            </FormField>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--r8-space-4)' }}>
            <FormField label="Category" required>
              <Select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as MenuCategory)}
                options={[
                  { label: 'Momo & Dumplings', value: 'momo' },
                  { label: 'Thakali & Newari', value: 'thakali_newari' },
                  { label: 'Appetizers & Snacks', value: 'appetizers' },
                  { label: 'Main Courses', value: 'mains' },
                  { label: 'Cafe & Bakery', value: 'cafe_bakery' },
                  { label: 'Beverages & Bar', value: 'beverages_bar' },
                  { label: 'Desserts', value: 'desserts' },
                ]}
              />
            </FormField>
            <FormField label="Dish Type">
              <Select
                value={formDishType}
                onChange={(e) => setFormDishType(e.target.value as any)}
                options={[
                  { label: 'Non-Veg (मासु)', value: 'Non-Veg' },
                  { label: 'Vegetarian (शाकाहारी)', value: 'Veg' },
                  { label: 'Beverage / Drink', value: 'Beverage' },
                ]}
              />
            </FormField>
            <FormField label="Kitchen Station">
              <Select
                value={formStation}
                onChange={(e) => setFormStation(e.target.value as KitchenStation)}
                options={[
                  { label: 'Kitchen Main', value: 'kitchen' },
                  { label: 'Momo Station', value: 'momo' },
                  { label: 'Tandoor Line', value: 'tandoor' },
                  { label: 'Bar Counter', value: 'bar' },
                  { label: 'Coffee Machine', value: 'coffee' },
                ]}
              />
            </FormField>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--r8-space-4)' }}>
            <FormField label="Selling Price (Rs.)" required>
              <NumberInput
                value={formPrice}
                onChange={(val) => setFormPrice(val || 0)}
                min={0}
                step={10}
              />
            </FormField>
            <FormField label="Food Cost (Rs.)">
              <NumberInput
                value={formCost}
                onChange={(val) => setFormCost(val || 0)}
                min={0}
                step={10}
              />
            </FormField>
            <FormField label="Prep Time (Minutes)">
              <NumberInput
                value={formPrepTime}
                onChange={(val) => setFormPrepTime(val || 10)}
                min={1}
                step={5}
              />
            </FormField>
            <FormField label="Stock Qty">
              <NumberInput
                value={formStockQty}
                onChange={(val) => setFormStockQty(val || 0)}
                min={0}
                step={1}
              />
            </FormField>
          </div>

          <FormField label="Image URL">
            <Input
              value={formImage}
              onChange={(e) => setFormImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
            />
          </FormField>

          <FormField label="Description">
            <Input
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Short preparation notes or ingredients list..."
            />
          </FormField>

          <Switch
            checked={formInStock}
            onChange={(checked) => setFormInStock(checked)}
            label="Available in POS Terminal and Online Menu"
          />
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Menu Dish"
        message="Are you sure you want to permanently remove this dish from the catalog? This will not affect past orders."
        confirmLabel="Delete Dish"
        variant="danger"
        onConfirm={() => deleteConfirmId && handleDeleteItem(deleteConfirmId)}
      />
    </Page>
  );
};
