import { readKitchenPreferences, type KitchenPreferences } from '../../lib/kitchenPreferences';
import type { KitchenTicketData } from '../../utils/kitchenTicket';

export function KitchenTicket({ data, restaurant, preferences = readKitchenPreferences() }: { data: KitchenTicketData; restaurant: string; preferences?: KitchenPreferences }) {
  const types = [...new Set(data.items.map(item => item.ticketType || 'KOT'))].join(' / ');
  return <article className={"kot-paper" + (preferences.compact ? " is-compact" : "")}>
    <p className="kot-identity">{restaurant}</p>
    <div className="kot-lead"><div><p className="work-eyebrow">{types} · #{data.kotNumber}</p><h2>{data.tableLabel}</h2></div><span className="kot-order-type">{data.orderType}</span></div>
    <dl className="kot-meta"><div><dt>Placed</dt><dd>{data.timeStr}</dd></div>{preferences.server && <div><dt>Server</dt><dd>{data.serverName}</dd></div>}</dl>
    {data.notes?.trim() && <div className="kot-notes"><h3>Order notes</h3><p>{data.notes}</p></div>}
    <div className="kot-items">{data.items.map((item, index) => <div className="kot-line" key={item.id + '-' + index}>
      <span className="kot-quantity">{item.quantity}×</span><div><strong>{item.name}</strong>{preferences.nepaliNames && item.nepaliName && <small lang="ne">{item.nepaliName}</small>}
        {item.selectedOptions && Object.entries(item.selectedOptions).map(([name, value]) => <small key={name}>{name}: {value}</small>)}
        {item.notes?.trim() && <p className="kot-item-note">{item.notes}</p>}{preferences.stations && item.station && <span className="kot-station">{item.station}</span>}
      </div></div>)}</div>
    <div className="kot-total"><span>{data.items.length} lines</span><strong>{data.items.reduce((sum, item) => sum + item.quantity, 0)} items</strong></div>
  </article>;
}
