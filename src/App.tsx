import React, { useState, useEffect, Suspense, lazy } from 'react';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { Sidebar } from './components/layout/Sidebar';
import { WorkspaceHeader } from './components/layout/WorkspaceHeader';
import { PremiumDashboard } from './components/dashboard/PremiumDashboard';
import { PremiumMobileNavigation as FloatingMobileNavigation } from './components/layout/PremiumMobileNavigation';
import { ToastContainer } from './components/ToastContainer';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

// Route-level splitting keeps the initial mobile workspace small.
import { StorageNotice } from './components/layout/StorageNotice';
const OrdersHubView = lazy(() => import('./components/orders/OrdersHubView').then(m => ({ default: m.OrdersHubView })));
const FloorPlanView = lazy(() => import('./components/floor/FloorPlanView').then(m => ({ default: m.FloorPlanView })));
const POSView = lazy(() => import('./components/pos/POSView').then(m => ({ default: m.POSView })));
const KDSView = lazy(() => import('./components/kds/KDSView').then(m => ({ default: m.KDSView })));
const DishesCatalogView = lazy(() => import('./components/menu/DishesCatalogView').then(m => ({ default: m.DishesCatalogView })));
const CategoryView = lazy(() => import('./components/menu/CategoryView').then(m => ({ default: m.CategoryView })));
const StockItemsView = lazy(() => import('./components/inventory/StockItemsView').then(m => ({ default: m.StockItemsView })));
const TablesListView = lazy(() => import('./components/floor/TablesListView').then(m => ({ default: m.TablesListView })));
import { CommandPalette } from './components/layout/CommandPalette';
import { RestaurantSwitcherModal } from './components/layout/RestaurantSwitcherModal';
import { PublicMenuView } from './components/menu/PublicMenuView';
import { PublicMenuProvider } from './context/PublicMenuContext';
import { canAccessTab } from './lib/authorization';
import { AccessRestrictedView } from './components/ui/AccessRestrictedView';
import type { UserRole } from './types/restaurant';

// Public Landing and Auth Dashboard views
const LandingPageView = lazy(() => import('./components/landing/LandingPageView').then(m => ({ default: m.LandingPageView })));
const AuthDashboardView = lazy(() => import('./components/auth/AuthDashboardView').then(m => ({ default: m.AuthDashboardView })));


// Code-split secondary management, finance & settings views
const ReservationsView = lazy(() => import('./components/reservations/ReservationsView').then(m => ({ default: m.ReservationsView })));
const AnalyticsView = lazy(() => import('./components/analytics/AnalyticsView').then(m => ({ default: m.AnalyticsView })));
const AddOnsView = lazy(() => import('./components/menu/AddOnsView').then(m => ({ default: m.AddOnsView })));
const MenuSetView = lazy(() => import('./components/menu/MenuSetView').then(m => ({ default: m.MenuSetView })));
const SubMenuView = lazy(() => import('./components/menu/SubMenuView').then(m => ({ default: m.SubMenuView })));
const ComboOfferView = lazy(() => import('./components/menu/ComboOfferView').then(m => ({ default: m.ComboOfferView })));
const DineInServiceView = lazy(() => import('./components/services/DineInServiceView').then(m => ({ default: m.DineInServiceView })));
const DeliveryServiceView = lazy(() => import('./components/services/DeliveryServiceView').then(m => ({ default: m.DeliveryServiceView })));
const SMSServiceView = lazy(() => import('./components/services/SMSServiceView').then(m => ({ default: m.SMSServiceView })));
const LoyaltyRewardsView = lazy(() => import('./components/services/LoyaltyRewardsView').then(m => ({ default: m.LoyaltyRewardsView })));
const ConnectServiceView = lazy(() => import('./components/services/ConnectServiceView').then(m => ({ default: m.ConnectServiceView })));
const OtherServicesView = lazy(() => import('./components/services/OtherServicesView').then(m => ({ default: m.OtherServicesView })));
const SpacesListView = lazy(() => import('./components/floor/SpacesListView').then(m => ({ default: m.SpacesListView })));
const QRCodesView = lazy(() => import('./components/floor/QRCodesView').then(m => ({ default: m.QRCodesView })));
const ConsumptionView = lazy(() => import('./components/inventory/ConsumptionView').then(m => ({ default: m.ConsumptionView })));
const SuppliersView = lazy(() => import('./components/inventory/SuppliersView').then(m => ({ default: m.SuppliersView })));
const MeasuringUnitView = lazy(() => import('./components/inventory/MeasuringUnitView').then(m => ({ default: m.MeasuringUnitView })));
const StockHistoryView = lazy(() => import('./components/inventory/StockHistoryView').then(m => ({ default: m.StockHistoryView })));
const StockGroupView = lazy(() => import('./components/inventory/StockGroupView').then(m => ({ default: m.StockGroupView })));
const BatchProductionView = lazy(() => import('./components/inventory/BatchProductionView').then(m => ({ default: m.BatchProductionView })));
const FinanceDashboardView = lazy(() => import('./components/finance/FinanceDashboardView').then(m => ({ default: m.FinanceDashboardView })));
const FinanceTransactionsView = lazy(() => import('./components/finance/FinanceTransactionsView').then(m => ({ default: m.FinanceTransactionsView })));
const DayBookView = lazy(() => import('./components/finance/DayBookView').then(m => ({ default: m.DayBookView })));
const JournalVoucherView = lazy(() => import('./components/finance/JournalVoucherView').then(m => ({ default: m.JournalVoucherView })));
const FinanceSalesView = lazy(() => import('./components/finance/FinanceSalesView').then(m => ({ default: m.FinanceSalesView })));
const FinancePurchaseView = lazy(() => import('./components/finance/FinancePurchaseView').then(m => ({ default: m.FinancePurchaseView })));
const FinanceIncomeView = lazy(() => import('./components/finance/FinanceIncomeView').then(m => ({ default: m.FinanceIncomeView })));
const FinanceExpensesView = lazy(() => import('./components/finance/FinanceExpensesView').then(m => ({ default: m.FinanceExpensesView })));
const FinancePaymentsView = lazy(() => import('./components/finance/FinancePaymentsView').then(m => ({ default: m.FinancePaymentsView })));
const FinanceCashBanksView = lazy(() => import('./components/finance/FinanceCashBanksView').then(m => ({ default: m.FinanceCashBanksView })));
const FinanceTaxRatesView = lazy(() => import('./components/finance/FinanceTaxRatesView').then(m => ({ default: m.FinanceTaxRatesView })));
const BalanceTransferView = lazy(() => import('./components/finance/BalanceTransferView').then(m => ({ default: m.BalanceTransferView })));
const ChartsOfAccountView = lazy(() => import('./components/finance/ChartsOfAccountView').then(m => ({ default: m.ChartsOfAccountView })));
const FinanceReportsView = lazy(() => import('./components/finance/FinanceReportsView').then(m => ({ default: m.FinanceReportsView })));
const NotificationsView = lazy(() => import('./components/notifications/NotificationsView').then(m => ({ default: m.NotificationsView })));
const RestroLinkView = lazy(() => import('./components/website/RestroLinkView').then(m => ({ default: m.RestroLinkView })));
const CustomersView = lazy(() => import('./components/customers/CustomersView').then(m => ({ default: m.CustomersView })));
const StaffView = lazy(() => import('./components/staff/StaffView').then(m => ({ default: m.StaffView })));
const RestaurantDetailsView = lazy(() => import('./components/settings/RestaurantDetailsView').then(m => ({ default: m.RestaurantDetailsView })));
const SettingsNotificationsView = lazy(() => import('./components/settings/SettingsNotificationsView').then(m => ({ default: m.SettingsNotificationsView })));
const ActivityLogView = lazy(() => import('./components/settings/ActivityLogView').then(m => ({ default: m.ActivityLogView })));
const BillingSubscriptionView = lazy(() => import('./components/settings/BillingSubscriptionView').then(m => ({ default: m.BillingSubscriptionView })));
const UsersRoleView = lazy(() => import('./components/settings/UsersRoleView').then(m => ({ default: m.UsersRoleView })));
const TrashView = lazy(() => import('./components/settings/TrashView').then(m => ({ default: m.TrashView })));
const MigratedDataView = lazy(() => import('./components/settings/MigratedDataView').then(m => ({ default: m.MigratedDataView })));
const IntegrationsView = lazy(() => import('./components/settings/IntegrationsView').then(m => ({ default: m.IntegrationsView })));
const InvoiceSettingView = lazy(() => import('./components/settings/InvoiceSettingView').then(m => ({ default: m.InvoiceSettingView })));
const KOTSettingView = lazy(() => import('./components/settings/KOTSettingView').then(m => ({ default: m.KOTSettingView })));
const OrderSlipSettingView = lazy(() => import('./components/settings/OrderSlipSettingView').then(m => ({ default: m.OrderSlipSettingView })));
const PrintersView = lazy(() => import('./components/settings/PrintersView').then(m => ({ default: m.PrintersView })));
const SupportFeedbackView = lazy(() => import('./components/settings/SupportFeedbackView').then(m => ({ default: m.SupportFeedbackView })));
const ReleaseNotesView = lazy(() => import('./components/settings/ReleaseNotesView').then(m => ({ default: m.ReleaseNotesView })));
const DesignSystemShowcase = lazy(() => import('./components/design-system/DesignSystemShowcase').then(m => ({ default: m.DesignSystemShowcase })));
const ViewFallback: React.FC = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '340px',
      gap: 'var(--r8-space-3)',
      color: 'var(--r8-text-muted, #94a3b8)',
      padding: 'var(--r8-space-8)',
    }}
  >
    <div
      style={{
        width: '36px',
        height: '36px',
        border: '3px solid rgba(15, 143, 111, 0.2)',
        borderTopColor: 'var(--r8-brand-primary, #0F8F6F)',
        borderRadius: '50%',
        animation: 'r8-spin 0.8s linear infinite',
      }}
    />
    <span style={{ fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.02em' }}>
      Loading Restro8 workspace...
    </span>
  </div>
);

interface MainAppProps {
  onNavigateLanding?: () => void;
  onNavigateLogin?: () => void;
}

const MainApp: React.FC<MainAppProps> = ({ onNavigateLanding, onNavigateLogin }) => {
  const {
    activeTab,
    setActiveTab,
    userRole,
  } = useRestaurant();

  const isTabAuthorized = canAccessTab(userRole, activeTab);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isRestaurantSwitcherOpen, setIsRestaurantSwitcherOpen] = useState(false);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘+K or Ctrl+K to toggle Command Palette
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // Don't trigger if user is typing in an input or textarea
      if (
        ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName) || (e.target as HTMLElement)?.isContentEditable || !!document.querySelector('[role="dialog"]')
      ) {
        return;
      }

      // '/' to open search mode
      if (e.key === '/') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
        return;
      }

      switch (e.key) {
        case '1':
          setActiveTab('dashboard');
          break;
        case '2':
          setActiveTab('orders');
          break;
        case '3':
          setActiveTab('pos');
          break;
        case '4':
          setActiveTab('kds');
          break;
        case '5':
          setActiveTab('floor');
          break;
        case '6':
          setActiveTab('inventory');
          break;
        case '7':
          setActiveTab('reservations');
          break;
        case '8':
          setActiveTab('analytics');
          break;
        case '9':
          setActiveTab('design-system');
          break;
        default:
          break;
      }
    };

    const handleOpenCmdPalette = () => setIsCommandPaletteOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleOpenCmdPalette);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleOpenCmdPalette);
    };
  }, [setActiveTab]);


  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-foreground)',
        display: 'flex',
      }}
    >
      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(3px)',
            zIndex: 90,
          }}
        />
      )}

      {/* Shared service-first navigation */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Viewport */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflowX: 'hidden',
        }}
      >
        <WorkspaceHeader
          onMenu={() => setMobileSidebarOpen(prev => !prev)}
          onSearch={() => setIsCommandPaletteOpen(true)}
          onRestaurant={() => setIsRestaurantSwitcherOpen(true)}
          onNavigateLanding={onNavigateLanding}
          onNavigateLogin={onNavigateLogin}
        />

        {/* Dynamic Main View with Production Error Boundary & Lazy Loading */}
        <StorageNotice />
        <main className="app-main-content" style={{ flex: 1, minWidth: 0, width: '100%', boxSizing: 'border-box', position: 'relative' }}>
          <ErrorBoundary
            fallbackTitle="Module Error"
            onReset={() => setActiveTab('dashboard')}
          >
            <Suspense fallback={<ViewFallback />}>
              {!isTabAuthorized ? (
                <AccessRestrictedView
                  role={userRole}
                  tab={activeTab}
                  onFallback={() => setActiveTab('dashboard')}
                />
              ) : (
                <>
                  {activeTab === 'dashboard' && <PremiumDashboard />}
              {activeTab === 'orders' && <OrdersHubView />}
              {activeTab === 'floor' && <FloorPlanView />}
              {activeTab === 'pos' && <POSView />}
              {activeTab === 'kds' && <KDSView />}
              {(activeTab === 'inventory' || activeTab === 'inventory-items') && <StockItemsView />}
              {activeTab === 'inventory-consumption' && <ConsumptionView />}
              {activeTab === 'inventory-suppliers' && <SuppliersView />}
              {activeTab === 'inventory-units' && <MeasuringUnitView />}
              {activeTab === 'inventory-groups' && <StockGroupView />}
              {activeTab === 'inventory-history' && <StockHistoryView />}
              {activeTab === 'inventory-batch' && <BatchProductionView />}
              {activeTab === 'finance-dashboard' && <FinanceDashboardView />}
              {activeTab === 'finance-transactions' && <FinanceTransactionsView />}
              {activeTab === 'finance-daybook' && <DayBookView />}
              {activeTab === 'finance-journal' && <JournalVoucherView />}
              {activeTab === 'finance-sales' && <FinanceSalesView />}
              {activeTab === 'finance-purchase' && <FinancePurchaseView />}
              {activeTab === 'finance-income' && <FinanceIncomeView />}
              {activeTab === 'finance-expenses' && <FinanceExpensesView />}
              {activeTab === 'finance-payments' && <FinancePaymentsView />}
              {activeTab === 'finance-cashbanks' && <FinanceCashBanksView />}
              {activeTab === 'finance-taxrates' && <FinanceTaxRatesView />}
              {activeTab === 'finance-balancetransfer' && <BalanceTransferView />}
              {activeTab === 'finance-chartsofaccount' && <ChartsOfAccountView />}
              {(activeTab === 'finance-reports' || activeTab === 'finance-trialbalance') && (
                <FinanceReportsView />
              )}
              {activeTab === 'dishes' && <DishesCatalogView />}
              {activeTab === 'category' && <CategoryView />}
              {activeTab === 'addons' && <AddOnsView />}
              {activeTab === 'menuset' && <MenuSetView />}
              {activeTab === 'submenu' && <SubMenuView />}
              {activeTab === 'combo' && <ComboOfferView />}
              {activeTab === 'services-dinein' && <DineInServiceView />}
              {activeTab === 'services-delivery' && <DeliveryServiceView />}
              {activeTab === 'services-sms' && <SMSServiceView />}
              {activeTab === 'services-loyalty' && <LoyaltyRewardsView />}
              {activeTab === 'services-connect' && <ConnectServiceView />}
              {activeTab === 'services-others' && <OtherServicesView />}
              {activeTab === 'tables-list' && <TablesListView />}
              {activeTab === 'spaces-list' && <SpacesListView />}
              {activeTab === 'qr-codes' && <QRCodesView />}
              {activeTab === 'notifications' && <NotificationsView />}
              {activeTab === 'website' && <RestroLinkView />}
              {activeTab === 'customers' && <CustomersView />}
              {activeTab === 'staff' && <StaffView />}
              {(activeTab === 'settings' || activeTab === 'settings-restaurant') && <RestaurantDetailsView />}
              {activeTab === 'settings-notifications' && <SettingsNotificationsView />}
              {activeTab === 'settings-activity' && <ActivityLogView />}
              {activeTab === 'settings-billing' && <BillingSubscriptionView />}
              {activeTab === 'settings-roles' && <UsersRoleView />}
              {activeTab === 'settings-trash' && <TrashView />}
              {activeTab === 'settings-migrated' && <MigratedDataView />}
              {activeTab === 'settings-integrations' && <IntegrationsView />}
              {activeTab === 'settings-invoice' && <InvoiceSettingView />}
              {activeTab === 'settings-kot' && <KOTSettingView />}
              {activeTab === 'settings-orderslip' && <OrderSlipSettingView />}
              {activeTab === 'settings-printer' && <PrintersView />}
              {activeTab === 'settings-support' && <SupportFeedbackView />}
              {activeTab === 'settings-releasenotes' && <ReleaseNotesView />}
              {activeTab === 'reservations' && <ReservationsView />}
              {activeTab === 'analytics' && <AnalyticsView />}
              {activeTab === 'design-system' && <DesignSystemShowcase />}
                </>
              )}
            </Suspense>
          </ErrorBoundary>
        </main>

        {/* Quick Keyboard Hotkeys Footer */}
        <footer
          className="desktop-hotkeys-footer"
          style={{
            borderTop: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-card)',
            padding: '6px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.72rem',
            color: 'var(--color-muted-foreground)',
          }}
        >
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span>
              <strong>Hotkeys:</strong>
            </span>
            <span>[1] Dashboard</span>
            <span>[2] Orders Hub</span>
            <span>[3] POS Terminal</span>
            <span>[4] KDS Line</span>
            <span>[5] Floor Plan</span>
            <span>[6] Menu & Stock</span>
            <span>[7] Reservations</span>
            <span>[8] Finance</span>
            <span>[9] Design System</span>
          </div>
          <div>
            <span>Restro8 · Restaurant workspace</span>
          </div>
        </footer>
      </div>

      {/* Floating Bottom Navigation Bar for Mobile */}
      <FloatingMobileNavigation onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        setActiveTab={setActiveTab}
      />

      <RestaurantSwitcherModal
        isOpen={isRestaurantSwitcherOpen}
        onClose={() => setIsRestaurantSwitcherOpen(false)}
      />

      <ToastContainer />
    </div>
  );
};

export type RootView = 'landing' | 'login' | 'workspace' | 'menu';

const getInitialView = (): RootView => {
  if (typeof window === 'undefined') return 'landing';
  const path = window.location.pathname.toLowerCase();
  if (path === '/menu' || path.startsWith('/menu/')) return 'menu';
  if (path === '/login' || path === '/auth' || path === '/signin') return 'login';
  if (path === '/app' || path === '/workspace' || path === '/pos' || path === '/dashboard') return 'workspace';

  const params = new URLSearchParams(window.location.search);
  if (params.get('view') === 'app' || params.get('view') === 'workspace') return 'workspace';
  if (params.get('view') === 'login') return 'login';
  if (params.get('view') === 'menu') return 'menu';
  if (params.get('view') === 'landing') return 'landing';

  return 'landing';
};

export default function App() {
  const [currentView, setCurrentView] = useState<RootView>(getInitialView);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentView(getInitialView());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (view: RootView, path?: string) => {
    setCurrentView(view);
    const targetPath = path || (view === 'landing' ? '/' : view === 'workspace' ? '/app' : `/${view}`);
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ view }, '', targetPath);
    }
  };

  const handleLaunchWorkspace = (role?: UserRole, restaurantName?: string) => {
    if (role) {
      try {
        localStorage.setItem('restrox_np_role_v2', role);
      } catch {
        // Safe fallback
      }
    }
    if (restaurantName) {
      try {
        const existing = localStorage.getItem('restrox_np_settings_v2');
        const parsed = existing ? JSON.parse(existing) : {};
        localStorage.setItem('restrox_np_settings_v2', JSON.stringify({ ...parsed, name: restaurantName }));
      } catch {
        // Safe fallback
      }
    }
    navigateTo('workspace', '/app');
  };

  if (currentView === 'menu') {
    return (
      <PublicMenuProvider>
        <PublicMenuView />
      </PublicMenuProvider>
    );
  }

  if (currentView === 'login') {
    return (
      <Suspense fallback={<ViewFallback />}>
        <AuthDashboardView
          onLoginSuccess={(role, restaurantName) => handleLaunchWorkspace(role, restaurantName)}
          onNavigateLanding={() => navigateTo('landing', '/')}
          onNavigateMenu={() => navigateTo('menu', '/menu')}
        />
      </Suspense>
    );
  }

  if (currentView === 'landing') {
    return (
      <Suspense fallback={<ViewFallback />}>
        <LandingPageView
          onLaunchWorkspace={(role) => handleLaunchWorkspace(role)}
          onNavigateLogin={() => navigateTo('login', '/login')}
          onNavigateMenu={() => navigateTo('menu', '/menu')}
        />
      </Suspense>
    );
  }

  return (
    <RestaurantProvider>
      <MainApp
        onNavigateLanding={() => navigateTo('landing', '/')}
        onNavigateLogin={() => navigateTo('login', '/login')}
      />
    </RestaurantProvider>
  );
}

