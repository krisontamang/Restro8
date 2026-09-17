import React, { useState, useMemo } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { MenuCategory } from '../../types/restaurant';
import { Page, PageHeader, PageToolbar, PageContent } from '../layout/PageFramework';
import {
  MetricCard,
  Table,
  Button,
  SearchInput,
  Badge,
  Modal,
  FormField,
  Input,
  EmptyState,
  ConfirmDialog,
  Card,
} from '../ui';
import {
  Plus,
  LayoutGrid,
  List,
  Layers,
  Utensils,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
} from 'lucide-react';

interface CategoryItem {
  id: string;
  key: MenuCategory;
  name: string;
  image: string;
  description?: string;
}

const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-1',
    key: 'momo',
    name: 'Momo & Dumplings',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=400&q=80',
    description: 'Steam, fried, kothey & jhol momos',
  },
  {
    id: 'cat-2',
    key: 'thakali_newari',
    name: 'Thakali & Newari Khaja',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    description: 'Authentic Nepali thali sets and choila platters',
  },
  {
    id: 'cat-3',
    key: 'appetizers',
    name: 'Appetizers & Snacks',
    image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=400&q=80',
    description: 'Sadeko, sukuti, sekuwa & pakodas',
  },
  {
    id: 'cat-4',
    key: 'mains',
    name: 'Main Courses',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80',
    description: 'Curries, rice bowls, chowmein, noodles & sizzlers',
  },
  {
    id: 'cat-5',
    key: 'cafe_bakery',
    name: 'Cafe & Bakery',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=400&q=80',
    description: 'Espresso, iced lattes, pastries, burgers & sandwiches',
  },
  {
    id: 'cat-6',
    key: 'beverages_bar',
    name: 'Beverages & Bar',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80',
    description: 'Local craft beer, spirits, lassi, mojito & sodas',
  },
  {
    id: 'cat-7',
    key: 'desserts',
    name: 'Desserts & Sweets',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=400&q=80',
    description: 'Juju dhau, gulab jamun, ice creams & brownies',
  },
];

export const CategoryView: React.FC = () => {
  const { menuItems, setActiveTab, addToast } = useRestaurant();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [formName, setFormName] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Live count map
  const dishCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    menuItems.forEach((m) => {
      counts[m.category] = (counts[m.category] || 0) + 1;
    });
    return counts;
  }, [menuItems]);

  const filteredCategories = useMemo(() => {
    return categories.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [categories, searchQuery]);

  // Metrics
  const totalCats = categories.length;
  const catsWithDishes = categories.filter((c) => (dishCounts[c.key] || 0) > 0).length;
  const emptyCats = totalCats - catsWithDishes;

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setFormName('');
    setFormImage('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80');
    setFormDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormImage(cat.image);
    setFormDescription(cat.description || '');
    setIsModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? { ...c, name: formName.trim(), image: formImage, description: formDescription.trim() }
            : c
        )
      );
      addToast('Category Updated', `${formName} category details updated.`, 'success');
    } else {
      const newCat: CategoryItem = {
        id: `cat-${Date.now()}`,
        key: 'mains',
        name: formName.trim(),
        image: formImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
        description: formDescription.trim(),
      };
      setCategories((prev) => [...prev, newCat]);
      addToast('Category Created', `${formName} added to menu categories.`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setDeleteConfirmId(null);
    addToast('Category Deleted', 'The category has been removed.', 'info');
  };

  return (
    <Page>
      <PageHeader
        title="Menu Categories"
        description="Organize your restaurant menu into scannable dining sections for kitchen dispatch and POS terminals."
        badge={<Badge variant="primary">{totalCats} Categories</Badge>}
        primaryAction={
          <Button variant="primary" leftIcon={<Plus size={16} />} onClick={handleOpenAddModal}>
            Add Category
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
          label="Total Categories"
          value={totalCats}
          icon={<Layers size={18} />}
          variant="primary"
          subtext="Configured dining groups"
        />
        <MetricCard
          label="Active with Dishes"
          value={catsWithDishes}
          icon={<CheckCircle2 size={18} />}
          variant="success"
          subtext={`${Math.round((catsWithDishes / (totalCats || 1)) * 100)}% active catalog coverage`}
        />
        <MetricCard
          label="Empty Sections"
          value={emptyCats}
          icon={<AlertCircle size={18} />}
          variant={emptyCats > 0 ? 'warning' : 'default'}
          subtext="No assigned dishes"
        />
        <MetricCard
          label="Total Catalog Items"
          value={menuItems.length}
          icon={<Utensils size={18} />}
          variant="default"
          subtext="Linked to active categories"
        />
      </div>

      <PageToolbar>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--r8-space-3)', flexWrap: 'wrap', flex: 1 }}>
          <div style={{ flex: '1 1 240px', maxWidth: '360px' }}>
            <SearchInput
              placeholder="Search category..."
              value={searchQuery}
              onChange={(val) => setSearchQuery(val)}
              onClear={() => setSearchQuery('')}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setViewMode('grid')}
            leftIcon={<LayoutGrid size={15} />}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setViewMode('list')}
            leftIcon={<List size={15} />}
          >
            List
          </Button>
        </div>
      </PageToolbar>

      <PageContent>
        {filteredCategories.length === 0 ? (
          <EmptyState
            icon={<Layers size={40} />}
            title="No categories found"
            description="No categories match your search criteria. Try a different query."
            actionLabel="Add Category"
            onAction={handleOpenAddModal}
          />
        ) : viewMode === 'grid' ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 250px), 1fr))',
              gap: 'var(--r8-space-4)',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {filteredCategories.map((cat) => {
              const count = dishCounts[cat.key] || 0;
              return (
                <Card
                  key={cat.id}
                  padding="none"
                  variant="interactive"
                  style={{
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', height: '140px' }}>
                    <img
                      src={cat.image}
                      alt={cat.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                      }}
                    >
                      <Badge variant={count > 0 ? 'primary' : 'neutral'} size="sm">
                        {count} {count === 1 ? 'Dish' : 'Dishes'}
                      </Badge>
                    </div>
                  </div>

                  <div style={{ padding: 'var(--r8-space-4)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3
                        style={{
                          fontSize: '1rem',
                          fontWeight: 700,
                          color: 'var(--r8-text-primary)',
                          margin: '0 0 6px 0',
                        }}
                      >
                        {cat.name}
                      </h3>
                      {cat.description && (
                        <p
                          style={{
                            fontSize: '0.8rem',
                            color: 'var(--r8-text-secondary)',
                            margin: 0,
                            lineHeight: 1.4,
                          }}
                        >
                          {cat.description}
                        </p>
                      )}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 'var(--r8-space-4)',
                        paddingTop: 'var(--r8-space-3)',
                        borderTop: '1px solid var(--r8-border-subtle)',
                      }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab('dishes')}
                        leftIcon={<Utensils size={13} />}
                      >
                        View Items
                      </Button>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEditModal(cat)}
                          title="Edit Category"
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirmId(cat.id)}
                          title="Delete Category"
                          style={{ color: 'var(--r8-status-danger)' }}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="r8-table-container">
            <Table>
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Dish Count</th>
                  <th>POS Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((cat) => {
                  const count = dishCounts[cat.key] || 0;
                  return (
                    <tr key={cat.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={cat.image}
                            alt={cat.name}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: 'var(--r8-radius-md)',
                              objectFit: 'cover',
                              flexShrink: 0,
                            }}
                          />
                          <span style={{ fontWeight: 600, color: 'var(--r8-text-primary)' }}>
                            {cat.name}
                          </span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--r8-text-secondary)', fontSize: '0.84rem' }}>
                        {cat.description || '—'}
                      </td>
                      <td>
                        <Badge variant={count > 0 ? 'primary' : 'neutral'} size="sm">
                          {count} Dishes
                        </Badge>
                      </td>
                      <td>
                        <Badge variant={count > 0 ? 'success' : 'warning'} size="sm">
                          {count > 0 ? 'Active in POS' : 'No Items'}
                        </Badge>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditModal(cat)}
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteConfirmId(cat.id)}
                            title="Delete"
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

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveCategory}>
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSaveCategory} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--r8-space-4)' }}>
          <FormField label="Category Name" required>
            <Input
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Sizzlers & Grills"
              required
            />
          </FormField>

          <FormField label="Cover Image URL">
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
              placeholder="Brief description of dishes in this section..."
            />
          </FormField>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Category"
        message="Are you sure you want to delete this category? Dishes associated with this category will remain in the catalog."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => deleteConfirmId && handleDeleteCategory(deleteConfirmId)}
      />
    </Page>
  );
};
