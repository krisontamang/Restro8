import { Clock, Plus, UtensilsCrossed } from 'lucide-react';
import type { MenuItem } from '../../types/restaurant';
import { EmptyState } from '../ui/EmptyState';
import { FoodImage } from '../menu/FoodImage';
import { formatNPR } from '../../utils/nepalDate';

interface POSProductGridProps { items: MenuItem[]; onItemClick: (item: MenuItem) => void; searchQuery?: string }
export function POSProductGrid({ items, onItemClick, searchQuery = '' }: POSProductGridProps) {
  if (!items.length) return <EmptyState icon={<UtensilsCrossed size={32} />} title="No dishes found" description={searchQuery ? `No dishes match “${searchQuery}”. Try another name.` : 'No dishes available in this section.'} />;
  return <div className="pos-menu-grid">{items.map(item => {
    const soldOut = !item.inStock || item.stockQuantity <= 0;
    return <button className="pos-menu-item food-card" key={item.id} disabled={soldOut} aria-label={soldOut ? `${item.name} is sold out` : `Add ${item.name} to ticket`} onClick={() => onItemClick(item)}>
      <div className="pos-dish-image-wrapper"><FoodImage item={item} /><span className="food-prep"><Clock size={11} /> {item.prepTimeMinutes} min</span>{item.tags.includes('veg') && <span className="food-veg">Veg</span>}{soldOut && <span className="food-soldout">Sold out</span>}</div>
      <div className="food-card-body"><h3>{item.name}</h3>{item.nepaliName && <p className="food-nepali">{item.nepaliName}</p>}<div className="food-card-bottom"><div><strong>{formatNPR(item.price)}</strong>{!soldOut && item.stockQuantity <= 5 && <small>Only {item.stockQuantity} left</small>}</div><span className="food-add" aria-hidden="true"><Plus size={18} /></span></div></div>
    </button>;
  })}</div>;
}
