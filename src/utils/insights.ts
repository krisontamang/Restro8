import { Order, MenuItem, Table, SmartInsight } from '../types/restaurant';

/**
 * Deterministically computes actionable operational insights based on live restaurant state.
 * Never manufactures or hallucinates fake analytics.
 * If insufficient data exists, returns appropriate "Not enough data yet" states.
 */
export function generateSmartInsights(
  orders: Order[],
  menuItems: MenuItem[],
  tables: Table[]
): SmartInsight[] {
  const insights: SmartInsight[] = [];

  // 1. Inventory & Low Stock Insight
  const outOfStockItems = menuItems.filter((i) => !i.inStock || i.stockQuantity <= 0);
  const lowStockItems = menuItems.filter((i) => i.inStock && i.stockQuantity > 0 && i.stockQuantity <= 5);

  if (outOfStockItems.length > 0) {
    insights.push({
      id: 'insight-out-of-stock',
      type: 'warning',
      title: 'Items Out of Stock',
      description: `${outOfStockItems.map((i) => i.name).slice(0, 3).join(', ')}${outOfStockItems.length > 3 ? ` and ${outOfStockItems.length - 3} more` : ''} unavailable.`,
      metric: `${outOfStockItems.length}`,
      metricLabel: 'Items Depleted',
      actionLabel: 'View Inventory',
      actionTab: 'inventory-stock',
    });
  } else if (lowStockItems.length > 0) {
    insights.push({
      id: 'insight-low-stock',
      type: 'warning',
      title: 'Replenishment Needed',
      description: `${lowStockItems.map((i) => i.name).slice(0, 2).join(', ')} reached critical reorder threshold (≤5 units remaining).`,
      metric: `${lowStockItems.length}`,
      metricLabel: 'Low Stock Items',
      actionLabel: 'Check Stock',
      actionTab: 'inventory-stock',
    });
  }

  // 2. Sales & Category Performance Insight
  const paidOrders = orders.filter((o) => o.paymentStatus === 'paid' || o.status === 'completed');

  if (paidOrders.length === 0) {
    insights.push({
      id: 'insight-no-orders',
      type: 'info',
      title: 'Shift Just Commenced',
      description: 'Not enough data yet. Complete dine-in or takeaway orders to see real-time channel & dish velocity insights.',
      metric: '0 Orders',
      metricLabel: 'Settled Today',
      actionLabel: 'Open POS',
      actionTab: 'pos',
    });
  } else {
    // Category revenue breakdown
    const categoryRevenueMap: Record<string, number> = {};
    paidOrders.forEach((order) => {
      order.items.forEach((item) => {
        const itemInfo = menuItems.find((m) => m.id === item.menuItemId);
        const cat = itemInfo ? itemInfo.category : 'mains';
        categoryRevenueMap[cat] = (categoryRevenueMap[cat] || 0) + item.price * item.quantity;
      });
    });

    const categoryNames: Record<string, string> = {
      momo: 'Momo & Dumplings',
      thakali_newari: 'Thakali & Newari Khaja',
      appetizers: 'Starters & Snacks',
      mains: 'Main Courses',
      cafe_bakery: 'Bakery & Coffee',
      beverages_bar: 'Beverages & Bar',
      desserts: 'Desserts',
      hookah: 'Lounge Flavors',
    };

    const topCategoryEntry = Object.entries(categoryRevenueMap).sort((a, b) => b[1] - a[1])[0];
    if (topCategoryEntry) {
      const catLabel = categoryNames[topCategoryEntry[0]] || topCategoryEntry[0];
      insights.push({
        id: 'insight-top-category',
        type: 'success',
        title: 'Top Revenue Driver',
        description: `${catLabel} is generating the highest sales volume today with Rs. ${topCategoryEntry[1].toLocaleString('en-IN')}.`,
        metric: `Rs. ${topCategoryEntry[1].toLocaleString('en-IN')}`,
        metricLabel: `${catLabel} Revenue`,
        actionLabel: 'View Menu',
        actionTab: 'menu-dishes',
      });
    }

    // Average Order Value (AOV)
    const totalSales = paidOrders.reduce((sum, o) => sum + o.total, 0);
    const aov = Math.round(totalSales / paidOrders.length);
    insights.push({
      id: 'insight-aov',
      type: 'trend',
      title: 'Average Ticket Value (AOV)',
      description: `Current average spending is Rs. ${aov.toLocaleString('en-IN')} across ${paidOrders.length} completed transactions.`,
      metric: `Rs. ${aov.toLocaleString('en-IN')}`,
      metricLabel: 'Average Spend',
      actionLabel: 'Sales Invoices',
      actionTab: 'finance-sales',
    });

    // Payment Tender Distribution
    const digitalCount = paidOrders.filter((o) =>
      o.paymentMethod === 'fonepay' || o.paymentMethod === 'card' || o.paymentMethod === 'esewa' || o.paymentMethod === 'khalti'
    ).length;
    const digitalPct = Math.round((digitalCount / paidOrders.length) * 100);

    if (paidOrders.length >= 2) {
      insights.push({
        id: 'insight-payment-mix',
        type: 'info',
        title: 'Digital Payment Adoption',
        description: `${digitalPct}% of settled bills paid digitally via Fonepay QR, Card, or mobile wallets.`,
        metric: `${digitalPct}%`,
        metricLabel: 'Digital Settlements',
        actionLabel: 'Day Book',
        actionTab: 'finance-daybook',
      });
    }
  }

  // 3. Floor Utilization & Table Turnover Insight
  const occupiedCount = tables.filter((t) => t.status === 'occupied').length;
  const occupancyRate = Math.round((occupiedCount / (tables.length || 1)) * 100);

  if (occupancyRate >= 70) {
    insights.push({
      id: 'insight-floor-busy',
      type: 'warning',
      title: 'High Floor Density',
      description: `Floor is at ${occupancyRate}% capacity with ${occupiedCount} active tables. Prepare for increased kitchen ticket frequency.`,
      metric: `${occupancyRate}%`,
      metricLabel: 'Floor Occupancy',
      actionLabel: 'Floor Plan',
      actionTab: 'floor',
    });
  } else {
    insights.push({
      id: 'insight-floor-capacity',
      type: 'info',
      title: 'Dining Floor Capacity',
      description: `${tables.length - occupiedCount} tables currently open across all dining zones.`,
      metric: `${tables.length - occupiedCount}`,
      metricLabel: 'Tables Available',
      actionLabel: 'Floor Plan',
      actionTab: 'floor',
    });
  }

  return insights;
}
