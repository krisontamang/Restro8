import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { formatNPR, getNepaliDate } from '../../utils/nepalDate';
import {
  Page,
  PageHeader,
  PageToolbar,
  PageContent,
} from '../layout/PageFramework';
import {
  MetricCard,
  ChartContainer,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHeadCell,
  TableCell,
  Button,
  Badge,
  Alert,
  Tabs,
  PriceDisplay,
  OrderStatusBadge,
} from '../ui';
import {
  TrendingUp,
  Utensils,
  Clock,
  Layers,
  Plus,
  Tv,
  CheckCircle,
  Calendar,
  ChevronDown,
  Download,
  AlertTriangle,
  Flame,
  ArrowRight,
  CreditCard,
  ShoppingBag,
  Users,
  ShieldCheck,
  UserCheck,
  ChefHat,
  Banknote,
  Sparkles,
  LayoutGrid,
  Receipt,
} from 'lucide-react';
import { generateSmartInsights } from '../../utils/insights';
import { ShiftCloseModal } from '../modals/ShiftCloseModal';

export const DashboardOverviewView: React.FC = () => {
  const {
    orders,
    tables,
    menuItems,
    settings,
    userRole,
    setActiveTab,
    addToast,
  } = useRestaurant();

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'finance' | 'order'>('overview');
  const [todayFilter, setTodayFilter] = useState('Today');
  const [showTodayDropdown, setShowTodayDropdown] = useState(false);
  const [daybookFilter, setDaybookFilter] = useState('All Counters');
  const [showDaybookDropdown, setShowDaybookDropdown] = useState(false);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);

  const { formattedBS, formattedAD } = getNepaliDate();

  // Metrics Calculation from live state
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const totalSubtotal = orders.reduce((sum, o) => sum + o.subtotal, 0);
  const totalVat = Math.round(totalSales * 0.13);

  const dineInOrders = orders.filter((o) => o.orderType === 'dine-in');
  const dineInSales = dineInOrders.reduce((sum, o) => sum + o.total, 0);
  const deliveryOrders = orders.filter((o) => o.orderType === 'delivery');
  const deliverySales = deliveryOrders.reduce((sum, o) => sum + o.total, 0);
  const takeawayOrders = orders.filter((o) => o.orderType === 'takeaway');
  const takeawaySales = takeawayOrders.reduce((sum, o) => sum + o.total, 0);

  // Estimates for back-office accounts
  const purchaseTotal = totalSales > 0 ? Math.round(totalSales * 0.32) : 0;
  const expensesTotal = totalSales > 0 ? Math.round(totalSales * 0.22) : 0;
  const netProfit = totalSales - (purchaseTotal + expensesTotal);

  // Order Counts
  const completedOrders = orders.filter((o) => o.status === 'completed');
  const pendingOrders = orders.filter(
    (o) => o.status === 'new' || o.status === 'preparing' || o.status === 'ready' || o.status === 'served'
  );
  const occupiedTables = tables.filter((t) => t.status === 'occupied');
  const lowStockItems = menuItems.filter((i) => i.stockQuantity <= 5 || !i.inStock);

  // Top Selling Dishes Calculation
  const dishSalesMap: Record<string, { name: string; qty: number; total: number }> = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      if (!dishSalesMap[item.name]) {
        dishSalesMap[item.name] = { name: item.name, qty: 0, total: 0 };
      }
      dishSalesMap[item.name].qty += item.quantity;
      dishSalesMap[item.name].total += item.price * item.quantity;
    });
  });

  const topDishes = Object.values(dishSalesMap)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  const roleLabels: Record<string, { title: string; icon: React.ReactNode }> = {
    manager: { title: 'General Manager', icon: <ShieldCheck size={14} /> },
    cashier: { title: 'Head Cashier', icon: <CreditCard size={14} /> },
    waiter: { title: 'Floor Captain', icon: <UserCheck size={14} /> },
    chef: { title: 'Head Chef', icon: <ChefHat size={14} /> },
  };

  const currentRoleInfo = roleLabels[userRole] || roleLabels.manager;
  const smartInsights = generateSmartInsights(orders, menuItems, tables);

  return (
    <Page>
      {/* Page Header with Context & Primary Actions */}
      <PageHeader
        title={`Operational Pulse — ${settings.name || 'RESTRO8 Kathmandu'}`}
        description={`Active Shift • ${currentRoleInfo.title} View • 🇳🇵 ${formattedBS} (${formattedAD})`}
        badge={
          <Badge variant="primary" dot size="sm">
            Local workspace
          </Badge>
        }
        secondaryActions={
          <>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Banknote size={14} />}
              onClick={() => setIsShiftModalOpen(true)}
            >
              Shift Z-Report
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Tv size={14} />}
              onClick={() => setActiveTab('kds')}
            >
              Kitchen KDS
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Download size={14} />}
              onClick={() => {
                window.print();
                addToast('Daybook Export', 'Generating IRD-compliant daily register export...', 'info');
              }}
            >
              Export
            </Button>
          </>
        }
        primaryAction={
          <Button
            variant="accent"
            size="sm"
            hotkey="F1"
            leftIcon={<Plus size={14} />}
            onClick={() => setActiveTab('pos')}
          >
            New Order
          </Button>
        }
      />

      {/* Operational Toolbar: Scope Tabs & Date Filters */}
      <PageToolbar>
        <Tabs
          variant="segmented"
          activeTab={activeSubTab}
          onChange={(tab) => setActiveSubTab(tab as any)}
          tabs={[
            { id: 'overview', label: 'Overview' },
            { id: 'finance', label: 'Financial Pulse' },
            { id: 'order', label: 'Order Channels' },
          ]}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Today Filter Dropdown */}
          <div style={{ position: 'relative' }}>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Calendar size={14} />}
              rightIcon={<ChevronDown size={14} />}
              onClick={() => setShowTodayDropdown(!showTodayDropdown)}
            >
              {todayFilter}
            </Button>
            {showTodayDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: '105%',
                  right: 0,
                  backgroundColor: 'var(--r8-bg-elevated)',
                  borderRadius: 'var(--r8-radius-sm)',
                  boxShadow: 'var(--r8-shadow-lg)',
                  border: '1px solid var(--r8-border-subtle)',
                  width: '150px',
                  zIndex: 'var(--r8-z-dropdown)',
                  overflow: 'hidden',
                }}
              >
                {['Today', 'Yesterday', 'This Week', 'This Month'].map((opt) => (
                  <div
                    key={opt}
                    onClick={() => {
                      setTodayFilter(opt);
                      setShowTodayDropdown(false);
                      addToast('Date Filter', `Applied period: ${opt}`, 'info');
                    }}
                    style={{
                      padding: '8px 12px',
                      fontSize: '0.8rem',
                      color: 'var(--r8-text-primary)',
                      cursor: 'pointer',
                      borderBottom: '1px solid var(--r8-border-subtle)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--r8-bg-subtle)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Daybook / Counter Filter Dropdown */}
          <div style={{ position: 'relative' }}>
            <Button
              variant="secondary"
              size="sm"
              rightIcon={<ChevronDown size={14} />}
              onClick={() => setShowDaybookDropdown(!showDaybookDropdown)}
            >
              {daybookFilter}
            </Button>
            {showDaybookDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: '105%',
                  right: 0,
                  backgroundColor: 'var(--r8-bg-elevated)',
                  borderRadius: 'var(--r8-radius-sm)',
                  boxShadow: 'var(--r8-shadow-lg)',
                  border: '1px solid var(--r8-border-subtle)',
                  width: '160px',
                  zIndex: 'var(--r8-z-dropdown)',
                  overflow: 'hidden',
                }}
              >
                {['All Counters', 'Counter 1 (Main)', 'Bar Terminal', 'Rooftop Desk'].map((c) => (
                  <div
                    key={c}
                    onClick={() => {
                      setDaybookFilter(c);
                      setShowDaybookDropdown(false);
                      addToast('Counter Filter', `Scoped to: ${c}`, 'info');
                    }}
                    style={{
                      padding: '8px 12px',
                      fontSize: '0.8rem',
                      color: 'var(--r8-text-primary)',
                      cursor: 'pointer',
                      borderBottom: '1px solid var(--r8-border-subtle)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--r8-bg-subtle)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </PageToolbar>

      {/* Main Page Content Canvas */}
      <PageContent>
        {/* =================================================================== */}
        {/* SUB-TAB 1: OPERATIONAL OVERVIEW                                     */}
        {/* =================================================================== */}
        {activeSubTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--r8-space-5)', width: '100%', boxSizing: 'border-box' }}>
            {/* --------------------------------------------------------------- */}
            {/* LEVEL 1: NOW — Operational Pulse & Floor Rhythm                 */}
            {/* Vastu: NE (Information/Incoming) + SE (Operations/Action)        */}
            {/* --------------------------------------------------------------- */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--r8-space-2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--r8-brand-primary)',
                      boxShadow: '0 0 0 3px rgba(15, 143, 111, 0.25)',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: 'var(--r8-text-secondary)',
                    }}
                  >
                    1. NOW — Real-Time Operations
                  </span>
                </div>
                <Badge variant="primary" size="sm" dot>
                  Live Synced
                </Badge>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: 'var(--r8-space-3)',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                {/* 1.A: Active Floor Occupancy */}
                <Card
                  variant="interactive"
                  onClick={() => setActiveTab('floor')}
                  style={{
                    borderLeft: '3px solid var(--r8-brand-primary)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px',
                    padding: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          color: 'var(--r8-text-secondary)',
                        }}
                      >
                        Dining Room Occupancy
                      </span>
                      <div
                        className="r8-tabular-num"
                        style={{
                          fontSize: '1.6rem',
                          fontWeight: 800,
                          color: 'var(--r8-text-primary)',
                          margin: '4px 0 2px 0',
                          display: 'flex',
                          alignItems: 'baseline',
                          gap: '6px',
                        }}
                      >
                        <span>{occupiedTables.length * 3}</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--r8-text-secondary)' }}>
                          / {tables.length * 4} Covers
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--r8-radius-sm)',
                        backgroundColor: 'var(--r8-color-primary-tint)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--r8-brand-primary)',
                      }}
                    >
                      <Utensils size={18} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--r8-text-secondary)', marginBottom: '4px' }}>
                      <span>{occupiedTables.length} of {tables.length} Tables Seated</span>
                      <span style={{ fontWeight: 700, color: 'var(--r8-text-primary)' }}>
                        {Math.round((occupiedTables.length / (tables.length || 1)) * 100)}%
                      </span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '6px',
                        borderRadius: '3px',
                        backgroundColor: 'var(--r8-bg-subtle)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.min(100, Math.round((occupiedTables.length / (tables.length || 1)) * 100))}%`,
                          height: '100%',
                          backgroundColor: 'var(--r8-brand-primary)',
                          borderRadius: '3px',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>
                </Card>

                {/* 1.B: Kitchen KDS Tickets & Prep Queue */}
                <Card
                  variant="interactive"
                  onClick={() => setActiveTab('kds')}
                  style={{
                    borderLeft: `3px solid ${pendingOrders.length > 3 ? 'var(--r8-color-warning)' : 'var(--r8-brand-primary)'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px',
                    padding: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          color: 'var(--r8-text-secondary)',
                        }}
                      >
                        Kitchen KDS Queue
                      </span>
                      <div
                        className="r8-tabular-num"
                        style={{
                          fontSize: '1.6rem',
                          fontWeight: 800,
                          color: 'var(--r8-text-primary)',
                          margin: '4px 0 2px 0',
                          display: 'flex',
                          alignItems: 'baseline',
                          gap: '6px',
                        }}
                      >
                        <span>{pendingOrders.length}</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--r8-text-secondary)' }}>
                          Active Tickets
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--r8-radius-sm)',
                        backgroundColor: pendingOrders.length > 3 ? 'rgba(245, 158, 11, 0.12)' : 'var(--r8-color-primary-tint)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: pendingOrders.length > 3 ? 'var(--r8-color-warning)' : 'var(--r8-brand-primary)',
                      }}
                    >
                      <ChefHat size={18} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                    <span style={{ fontSize: '0.74rem', color: 'var(--r8-text-secondary)' }}>
                      {pendingOrders.length > 3
                        ? 'High kitchen queue — attention required'
                        : pendingOrders.length > 0
                        ? 'Avg prep pace: ~11m (Optimal)'
                        : 'Kitchen tickets clear'}
                    </span>
                    <Badge variant={pendingOrders.length > 3 ? 'warning' : 'primary'} size="sm">
                      {pendingOrders.length > 3 ? 'Queue Alert' : 'Flowing'}
                    </Badge>
                  </div>
                </Card>

                {/* 1.C: Quick Dispatch Launchpad */}
                <Card
                  style={{
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: 'var(--r8-text-secondary)',
                      }}
                    >
                      Quick Dispatch
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--r8-text-muted)' }}>
                      Hotkeys active
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Plus size={14} />}
                      hotkey="F1"
                      onClick={() => setActiveTab('pos')}
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      New Order
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<Tv size={14} />}
                      onClick={() => setActiveTab('kds')}
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      Kitchen KDS
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<LayoutGrid size={14} />}
                      onClick={() => setActiveTab('floor')}
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      Floor Plan
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<Banknote size={14} />}
                      onClick={() => setIsShiftModalOpen(true)}
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      Z-Report
                    </Button>
                  </div>
                </Card>
              </div>
            </div>

            {/* --------------------------------------------------------------- */}
            {/* LEVEL 2: ATTENTION — Urgent Bottlenecks & Action Alerts         */}
            {/* Immediate visibility for operational friction                    */}
            {/* --------------------------------------------------------------- */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--r8-space-2)' }}>
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--r8-text-secondary)',
                  padding: '0 2px',
                }}
              >
                2. ATTENTION — Operational Status & Alerts
              </span>

              {lowStockItems.length > 0 || pendingOrders.length > 3 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {pendingOrders.length > 3 && (
                  <Alert
                    severity="error"
                    title="Kitchen Bottleneck Alert"
                    onClose={() => {}}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <span>
                        Kitchen queue has {pendingOrders.length} pending tickets. Station prep time is accumulating beyond target.
                      </span>
                      <Button
                        variant="destructive"
                        size="sm"
                        leftIcon={<Flame size={12} />}
                        onClick={() => setActiveTab('kds')}
                      >
                        Open KDS Station
                      </Button>
                    </div>
                  </Alert>
                )}

                {lowStockItems.length > 0 && (
                  <Alert
                    severity="warning"
                    title="Low Stock Threshold Warning"
                    onClose={() => {}}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <span>
                        {lowStockItems.length} menu items are running critically low on inventory ({lowStockItems.slice(0, 2).map((i) => i.name).join(', ')}).
                      </span>
                      <Button
                        variant="secondary"
                        size="sm"
                        rightIcon={<ArrowRight size={12} />}
                        onClick={() => setActiveTab('inventory')}
                      >
                        Review Stock
                      </Button>
                    </div>
                  </Alert>
                )}
              </div>
            ) : (
              <div
                style={{
                  padding: '10px 16px',
                  borderRadius: 'var(--r8-radius-sm)',
                  backgroundColor: 'var(--r8-bg-surface-elevated)',
                  border: '1px solid var(--r8-border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxSizing: 'border-box',
                }}
              >
                <CheckCircle size={15} style={{ color: 'var(--r8-brand-primary)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.78rem', color: 'var(--r8-text-secondary)' }}>
                  <strong style={{ color: 'var(--r8-text-primary)' }}>Operational Flow Optimal:</strong> All kitchen stations running smoothly • Inventory thresholds healthy across active menu items.
                </span>
              </div>
            )}
            </div>

            {/* --------------------------------------------------------------- */}
            {/* LEVEL 3: TODAY — Business Health Command Center                 */}
            {/* Vastu: Akasha / Center (Integration of Enterprise Prosperity)   */}
            {/* --------------------------------------------------------------- */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--r8-space-2)' }}>
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--r8-text-secondary)',
                  padding: '0 2px',
                }}
              >
                3. TODAY — Business Performance
              </span>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 'var(--r8-space-4)',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                {/* 3.A: Today's Revenue (Emerald Primary) */}
                <MetricCard
                  label="Today's Revenue"
                  currencyPrefix="Rs."
                  value={totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  change={14.2}
                  changeLabel="vs yesterday"
                  variant="primary"
                  icon={<TrendingUp size={18} />}
                  onClick={() => setActiveSubTab('finance')}
                />

                {/* 3.B: Net Operating Profit (Prosperity Gold) */}
                <MetricCard
                  label="Net Operating Profit"
                  currencyPrefix="Rs."
                  value={netProfit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  subtext="Est. 46% Operating Margin"
                  variant="gold"
                  icon={<Banknote size={18} />}
                  onClick={() => setActiveSubTab('finance')}
                />

                {/* 3.C: 13% IRD VAT Accrued (Fiscal Compliance) */}
                <MetricCard
                  label="13% IRD VAT Accrued"
                  currencyPrefix="Rs."
                  value={totalVat.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  subtext={`PAN: ${settings.panNumber || '600123456'} • Tax Register`}
                  variant="default"
                  icon={<Layers size={18} />}
                  onClick={() => setActiveTab('analytics')}
                />

                {/* 3.D: Order Channels Distribution */}
                <Card
                  variant="interactive"
                  onClick={() => setActiveSubTab('order')}
                  style={{
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        color: 'var(--r8-text-secondary)',
                      }}
                    >
                      Channel Mix
                    </span>
                    <ShoppingBag size={18} style={{ color: 'var(--r8-text-muted)' }} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem' }}>
                      <span style={{ color: 'var(--r8-text-secondary)' }}>Dine-In ({dineInOrders.length}):</span>
                      <span className="r8-tabular-num" style={{ fontWeight: 600, color: 'var(--r8-text-primary)' }}>
                        Rs. {dineInSales.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem' }}>
                      <span style={{ color: 'var(--r8-text-secondary)' }}>Takeaway ({takeawayOrders.length}):</span>
                      <span className="r8-tabular-num" style={{ fontWeight: 600, color: 'var(--r8-text-primary)' }}>
                        Rs. {takeawaySales.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem' }}>
                      <span style={{ color: 'var(--r8-text-secondary)' }}>Delivery ({deliveryOrders.length}):</span>
                      <span className="r8-tabular-num" style={{ fontWeight: 600, color: 'var(--r8-text-primary)' }}>
                        Rs. {deliverySales.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.72rem', color: 'var(--r8-brand-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>View Channel Breakdown</span>
                    <ArrowRight size={12} />
                  </div>
                </Card>
              </div>
            </div>

            {/* --------------------------------------------------------------- */}
            {/* LEVEL 4: PERFORMANCE — Trends, Velocity & Strategic Insights    */}
            {/* Vastu: NW (Flow/Velocity) + SW (Product Mix & Intelligence)      */}
            {/* --------------------------------------------------------------- */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--r8-space-2)' }}>
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--r8-text-secondary)',
                  padding: '0 2px',
                }}
              >
                4. PERFORMANCE & STRATEGY
              </span>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: 'var(--r8-space-4)',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                {/* 4.A: Hourly Cover & Sales Velocity Chart */}
                <ChartContainer
                  title="Hourly Cover & Sales Velocity"
                  subtitle="Peak dining room traffic & kitchen ticket frequency"
                  action={
                    <Badge variant="primary" size="sm">
                      Live Hourly Pace
                    </Badge>
                  }
                  height={240}
                >
                  <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                    {[
                      { label: 'Rs. 40k', top: '10%' },
                      { label: 'Rs. 25k', top: '40%' },
                      { label: 'Rs. 10k', top: '70%' },
                      { label: 'Rs. 0', top: '95%' },
                    ].map((tick) => (
                      <div
                        key={tick.label}
                        style={{
                          position: 'absolute',
                          top: tick.top,
                          left: 0,
                          right: 0,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <span className="r8-tabular-num" style={{ width: '55px', fontSize: '0.7rem', color: 'var(--r8-text-muted)' }}>
                          {tick.label}
                        </span>
                        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--r8-border-subtle)' }} />
                      </div>
                    ))}

                    <svg
                      viewBox="0 0 700 200"
                      preserveAspectRatio="none"
                      style={{
                        position: 'absolute',
                        left: '55px',
                        right: 0,
                        bottom: 0,
                        width: 'calc(100% - 55px)',
                        height: '100%',
                        overflow: 'hidden',
                      }}
                    >
                      <defs>
                        <linearGradient id="r8VelocityGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--r8-brand-primary)" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="var(--r8-brand-primary)" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0,190 C90,170 160,130 240,110 C320,90 390,130 470,75 C550,30 630,50 700,20 L700,200 L0,200 Z"
                        fill="url(#r8VelocityGrad)"
                      />
                      <path
                        d="M0,190 C90,170 160,130 240,110 C320,90 390,130 470,75 C550,30 630,50 700,20"
                        fill="none"
                        stroke="var(--r8-brand-primary)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <circle cx="700" cy="20" r="4.5" fill="var(--r8-brand-primary)" stroke="#FFFFFF" strokeWidth="2" />
                    </svg>
                  </div>
                </ChartContainer>

                {/* 4.B: Top Dishes & Strategic Insights Combined Stack */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--r8-space-3)' }}>
                  {/* Top Selling Menu Dishes */}
                  <Card padding="md">
                    <CardHeader>
                      <CardTitle>Top Velocity Dishes</CardTitle>
                      <CardDescription>Best revenue and volume performers today</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {topDishes.length > 0 ? (
                          topDishes.slice(0, 4).map((dish, idx) => (
                            <div
                              key={dish.name}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '8px 10px',
                                borderRadius: 'var(--r8-radius-sm)',
                                backgroundColor: 'var(--r8-bg-subtle)',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span
                                  className="r8-tabular-num"
                                  style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    backgroundColor: idx === 0 ? 'var(--r8-brand-primary)' : idx === 1 ? 'var(--r8-brand-gold)' : 'var(--r8-bg-surface)',
                                    color: idx <= 1 ? '#FFFFFF' : 'var(--r8-text-secondary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                  }}
                                >
                                  {idx + 1}
                                </span>
                                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--r8-text-primary)' }}>
                                  {dish.name}
                                </span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span className="r8-tabular-num" style={{ fontSize: '0.78rem', color: 'var(--r8-text-secondary)' }}>
                                  {dish.qty} sold
                                </span>
                                <PriceDisplay amount={dish.total} size="sm" />
                              </div>
                            </div>
                          ))
                        ) : (
                          <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--r8-text-muted)', fontSize: '0.84rem' }}>
                            No orders recorded yet today.
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Strategic Operational Intelligence (Repositioned from Level 0) */}
                  {smartInsights.length > 0 && (
                    <Card padding="md" style={{ borderLeft: '3px solid var(--r8-brand-gold)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Sparkles size={14} style={{ color: 'var(--r8-brand-gold)' }} />
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--r8-text-primary)' }}>
                            Operational Insight
                          </span>
                        </div>
                        {smartInsights[0]?.metric && (
                          <Badge variant="gold" size="sm">
                            {smartInsights[0].metric}
                          </Badge>
                        )}
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--r8-text-secondary)', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                        {smartInsights[0]?.description}
                      </p>
                      {smartInsights[0]?.actionLabel && smartInsights[0]?.actionTab && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            onClick={() => setActiveTab(smartInsights[0].actionTab as any)}
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: 0,
                              color: 'var(--r8-brand-primary)',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <span>{smartInsights[0].actionLabel}</span>
                            <ArrowRight size={12} />
                          </button>
                        </div>
                      )}
                    </Card>
                  )}
                </div>
              </div>
            </div>

            {/* --------------------------------------------------------------- */}
            {/* LEVEL 5: DETAIL — Live Orders & Settlement Audit Ledger         */}
            {/* Vastu: SW / Earth (Fiscal Audit, Ground Truth & Permanence)      */}
            {/* --------------------------------------------------------------- */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--r8-space-2)' }}>
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--r8-text-secondary)',
                  padding: '0 2px',
                }}
              >
                5. DETAIL — Live Settlement Ledger
              </span>

              <Card padding="none">
                <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <CardTitle>Live Orders & Invoices</CardTitle>
                    <CardDescription>Real-time dining room and takeaway settlement monitor</CardDescription>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    rightIcon={<ArrowRight size={12} />}
                    onClick={() => setActiveTab('orders')}
                  >
                    View All Orders
                  </Button>
                </div>

                {/* Desktop Table View (>= 768px) */}
                <div className="live-orders-desktop-table">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHeadCell>Bill / Order</TableHeadCell>
                        <TableHeadCell>Table / Channel</TableHeadCell>
                        <TableHeadCell>Server</TableHeadCell>
                        <TableHeadCell>Items</TableHeadCell>
                        <TableHeadCell>Status</TableHeadCell>
                        <TableHeadCell numeric>Subtotal</TableHeadCell>
                        <TableHeadCell numeric>13% VAT</TableHeadCell>
                        <TableHeadCell numeric>Grand Total (NPR)</TableHeadCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.slice(0, 6).map((order) => (
                        <TableRow key={order.id}>
                          <TableCell style={{ fontWeight: 600 }}>
                            {order.invoiceNumber || `ORD-${order.orderNumber}`}
                          </TableCell>
                          <TableCell>
                            <span style={{ fontWeight: 500 }}>
                              {order.tableNumber ? `Table ${order.tableNumber}` : order.orderType.toUpperCase()}
                            </span>
                          </TableCell>
                          <TableCell>{order.serverName || 'Counter'}</TableCell>
                          <TableCell>
                            <span style={{ fontSize: '0.8rem', color: 'var(--r8-text-secondary)' }}>
                              {order.items.length} item{order.items.length > 1 ? 's' : ''}
                            </span>
                          </TableCell>
                          <TableCell>
                            <OrderStatusBadge status={order.status} size="sm" />
                          </TableCell>
                          <TableCell numeric>
                            Rs. {order.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell numeric>
                            Rs. {order.tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell numeric>
                            <PriceDisplay amount={order.total} size="sm" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Responsive Cards View (< 768px) — Zero horizontal scrolling */}
                <div className="live-orders-mobile-cards">
                  {orders.slice(0, 6).map((order) => (
                    <div
                      key={order.id}
                      onClick={() => setActiveTab('orders')}
                      style={{
                        backgroundColor: 'var(--r8-bg-surface)',
                        border: '1px solid var(--r8-border-subtle)',
                        borderRadius: '10px',
                        padding: '12px 14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        cursor: 'pointer',
                        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--r8-emerald)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--r8-border-subtle)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {/* Top: Invoice # and Status Badge */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '6px',
                              backgroundColor: 'rgba(15, 143, 111, 0.08)',
                              color: 'var(--r8-emerald)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <Receipt size={13} />
                          </div>
                          <span style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--r8-text-primary)' }}>
                            {order.invoiceNumber || `ORD-${order.orderNumber}`}
                          </span>
                        </div>
                        <OrderStatusBadge status={order.status} size="sm" />
                      </div>

                      {/* Middle: Table / Server / Items Pill Tags */}
                      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px', fontSize: '0.76rem' }}>
                        <span
                          style={{
                            fontWeight: 600,
                            color: 'var(--r8-text-primary)',
                            backgroundColor: 'var(--r8-bg-subtle)',
                            padding: '2px 7px',
                            borderRadius: '4px',
                            border: '1px solid var(--r8-border-subtle)',
                          }}
                        >
                          {order.tableNumber ? `Table ${order.tableNumber}` : order.orderType.toUpperCase()}
                        </span>
                        <span style={{ color: 'var(--r8-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ color: 'var(--r8-text-muted)' }}>•</span>
                          {order.serverName || 'Counter'}
                        </span>
                        <span style={{ color: 'var(--r8-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ color: 'var(--r8-text-muted)' }}>•</span>
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </span>
                      </div>

                      {/* Bottom: Financial Settlement breakdown & Grand Total */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingTop: '8px',
                          borderTop: '1px dashed var(--r8-border-subtle)',
                          marginTop: '2px',
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--r8-text-secondary)' }}>
                            Subtotal: Rs. {order.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                          <span style={{ fontSize: '0.68rem', color: 'var(--r8-text-muted)' }}>
                            incl. 13% VAT (Rs. {order.tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })})
                          </span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.66rem', color: 'var(--r8-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                            Total
                          </div>
                          <PriceDisplay amount={order.total} size="sm" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* SUB-TAB 2: FINANCIAL PULSE                                          */}
        {/* =================================================================== */}
        {activeSubTab === 'finance' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--r8-space-4)' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 'var(--r8-space-4)',
              }}
            >
              <MetricCard
                label="Gross Income"
                currencyPrefix="Rs."
                value={totalSales.toLocaleString()}
                change={14.2}
                changeLabel="Today"
                variant="primary"
              />
              <MetricCard
                label="Raw Material Purchases"
                currencyPrefix="Rs."
                value={purchaseTotal.toLocaleString()}
                subtext="32% of Gross"
                variant="warning"
              />
              <MetricCard
                label="Operating Expenses"
                currencyPrefix="Rs."
                value={expensesTotal.toLocaleString()}
                subtext="Staff & Utilities"
                variant="danger"
              />
              <MetricCard
                label="Net Operating Profit"
                currencyPrefix="Rs."
                value={netProfit.toLocaleString()}
                subtext="Est. 46% Margin"
                variant="gold"
              />
            </div>

            <Card padding="md">
              <CardHeader>
                <CardTitle>Shift Cash Register & Payment Splits</CardTitle>
                <CardDescription>Settlement breakdown across tender channels</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                  }}
                >
                  {[
                    { method: 'Cash in Drawer', val: totalSales * 0.45, pct: '45%' },
                    { method: 'Fonepay Dynamic QR', val: totalSales * 0.35, pct: '35%' },
                    { method: 'POS Card Terminal', val: totalSales * 0.15, pct: '15%' },
                    { method: 'Credit (Customer Khata)', val: totalSales * 0.05, pct: '5%' },
                  ].map((m) => (
                    <div
                      key={m.method}
                      style={{
                        padding: '12px',
                        backgroundColor: 'var(--r8-bg-subtle)',
                        borderRadius: 'var(--r8-radius-sm)',
                      }}
                    >
                      <div style={{ fontSize: '0.78rem', color: 'var(--r8-text-secondary)', marginBottom: '4px' }}>
                        {m.method} ({m.pct})
                      </div>
                      <PriceDisplay amount={m.val} size="md" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* =================================================================== */}
        {/* SUB-TAB 3: ORDER CHANNELS                                           */}
        {/* =================================================================== */}
        {activeSubTab === 'order' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--r8-space-4)' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 'var(--r8-space-4)',
              }}
            >
              <MetricCard
                label="Dine-In Revenue"
                currencyPrefix="Rs."
                value={dineInSales.toLocaleString()}
                subtext={`${dineInOrders.length} orders`}
                variant="primary"
              />
              <MetricCard
                label="Takeaway Counter"
                currencyPrefix="Rs."
                value={takeawaySales.toLocaleString()}
                subtext={`${takeawayOrders.length} orders`}
                variant="success"
              />
              <MetricCard
                label="Online Delivery"
                currencyPrefix="Rs."
                value={deliverySales.toLocaleString()}
                subtext={`${deliveryOrders.length} orders`}
                variant="warning"
              />
            </div>
          </div>
        )}
      </PageContent>

      {/* Interactive Shift Closing Drawer & Modal */}
      {isShiftModalOpen && (
        <ShiftCloseModal onClose={() => setIsShiftModalOpen(false)} />
      )}
    </Page>
  );
};
