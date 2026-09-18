import { useEffect, useRef, useState } from 'react';
import type { DietaryTag, MenuCategory, MenuItem } from '../../types/restaurant';
import { Badge, SearchInput } from '../ui';
import { POSProductGrid } from './POSProductGrid';

const categories: { id: MenuCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All categories' },
  { id: 'momo', label: 'Momo' },
  { id: 'thakali_newari', label: 'Thakali & Newari' },
  { id: 'appetizers', label: 'Starters & Snacks' },
  { id: 'mains', label: 'Main courses' },
  { id: 'cafe_bakery', label: 'Coffee & Bakery' },
  { id: 'beverages_bar', label: 'Drinks & Bar' },
  { id: 'desserts', label: 'Desserts' },
  { id: 'hookah', label: 'Hookah' },
];
const tags: { id: DietaryTag | 'all'; label: string }[] = [
  { id: 'all', label: 'All tags' },
  { id: 'veg', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'halal', label: 'Halal' },
  { id: 'spicy', label: 'Spicy' },
  { id: 'chef-pick', label: 'Chef’s pick' },
];

interface POSMenuPanelProps {
  items: MenuItem[];
  active: boolean;
  onShowMenu: () => void;
  onItemClick: (item: MenuItem) => void;
}

export function POSMenuPanel({ items, active, onShowMenu, onItemClick }: POSMenuPanelProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<MenuCategory | 'all'>('all');
  const [tag, setTag] = useState<DietaryTag | 'all'>('all');
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    let frame = 0;
    const onKeyDown = (event: KeyboardEvent) => {
      if (document.querySelector('[role="dialog"]')) return;
      if (event.key === 'F2') {
        event.preventDefault();
        onShowMenu();
        frame = requestAnimationFrame(() => searchRef.current?.focus());
      } else if (event.key === 'Escape' && event.target === searchRef.current) {
        setSearch('');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => { window.removeEventListener('keydown', onKeyDown); cancelAnimationFrame(frame); };
  }, [onShowMenu]);

  const query = search.trim().toLowerCase();
  const filtered = items.filter(item =>
    (category === 'all' || item.category === category) &&
    (tag === 'all' || item.tags.includes(tag)) &&
    (!query || [item.name, item.nepaliName, item.description].some(text => text?.toLowerCase().includes(query))));
  const hasFilters = !!search || category !== 'all' || tag !== 'all';

  return <section className={`pos-catalog ${active ? 'is-active' : ''}`} aria-labelledby="pos-menu-heading">
    <div className="pos-catalog-toolbar">
      <div className="pos-catalog-heading">
        <div><h1 id="pos-menu-heading">Menu selection</h1><p>Choose dishes, then review the current ticket.</p></div>
        <Badge variant="primary">{items.length} dishes</Badge>
      </div>
      <SearchInput ref={searchRef} aria-label="Search menu" hotkey="F2" value={search} onChange={setSearch} placeholder="Search dishes or drinks…" />
      <div className="pos-filter-groups">
        <fieldset className="pos-filter-group">
          <legend>Menu category</legend>
          <select className="pos-filter-select" aria-label="Menu category" value={category} onChange={event => setCategory(event.target.value as typeof category)}>
            {categories.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}
          </select>
          <div className="pos-filter-chips">
            {categories.map(option => <button type="button" key={option.id} aria-pressed={category === option.id} onClick={() => setCategory(option.id)}>{option.label}</button>)}
          </div>
        </fieldset>
        <fieldset className="pos-filter-group">
          <legend>Dietary & other tags</legend>
          <select className="pos-filter-select" aria-label="Dietary & other tags" value={tag} onChange={event => setTag(event.target.value as typeof tag)}>
            {tags.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}
          </select>
          <div className="pos-filter-chips">
            {tags.map(option => <button type="button" key={option.id} aria-pressed={tag === option.id} onClick={() => setTag(option.id)}>{option.label}</button>)}
          </div>
        </fieldset>
      </div>
      <div className="pos-results-summary">
        <span role="status">{filtered.length} {filtered.length === 1 ? 'dish' : 'dishes'} shown</span>
        {hasFilters && <button type="button" onClick={() => { setSearch(''); setCategory('all'); setTag('all'); }}>Clear filters</button>}
      </div>
    </div>
    <div className="pos-catalog-results">
      <POSProductGrid items={filtered} onItemClick={onItemClick} searchQuery={search.trim()} />
    </div>
  </section>;
}
