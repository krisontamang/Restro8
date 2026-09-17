import type { NavigationTab } from '../../context/RestaurantContext';
import { BookOpen, CookingPot, LayoutDashboard, LayoutGrid, Wallet, Users, SlidersHorizontal, Package, ClipboardList, Plus, type LucideIcon } from 'lucide-react';
export interface NavigationEntry { tab: NavigationTab; label: string; icon?: LucideIcon }
export interface NavigationGroup { id: string; label: string; icon: LucideIcon; items: NavigationEntry[] }
export const serviceNavigation: NavigationEntry[] = [
  { tab: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { tab: 'orders', label: 'Orders', icon: ClipboardList },
  { tab: 'kds', label: 'Kitchen', icon: CookingPot },
  { tab: 'floor', label: 'Tables', icon: LayoutGrid },
  { tab: 'pos', label: 'New order', icon: Plus },
];
export const workspaceGroups: NavigationGroup[] = [
  { id: 'menu', label: 'Menu', icon: BookOpen, items: [
    { tab: 'dishes', label: 'Dishes' }, { tab: 'category', label: 'Categories' }, { tab: 'addons', label: 'Add-ons' },
    { tab: 'submenu', label: 'Menu sections' }, { tab: 'menuset', label: 'Menu sets' }, { tab: 'combo', label: 'Combos' },
    { tab: 'qr-codes', label: 'Menu QR codes' }, { tab: 'website', label: 'Guest menu' }
  ]},
  { id: 'stock', label: 'Stock & purchasing', icon: Package, items: [
    { tab: 'inventory-items', label: 'Stock items' }, { tab: 'inventory-consumption', label: 'Consumption' },
    { tab: 'inventory-suppliers', label: 'Suppliers' }, { tab: 'finance-purchase', label: 'Purchases' },
    { tab: 'inventory-history', label: 'Stock history' }, { tab: 'inventory-batch', label: 'Batch production' },
    { tab: 'inventory-groups', label: 'Stock groups' }, { tab: 'inventory-units', label: 'Units' }
  ]},
  { id: 'finance', label: 'Finance', icon: Wallet, items: [
    { tab: 'finance-dashboard', label: 'Money overview' }, { tab: 'finance-reports', label: 'Reports' },
    { tab: 'finance-sales', label: 'Sales register' }, { tab: 'finance-payments', label: 'Payments' },
    { tab: 'finance-expenses', label: 'Expenses' }, { tab: 'finance-income', label: 'Other income' },
    { tab: 'finance-cashbanks', label: 'Cash & bank accounts' }, { tab: 'finance-transactions', label: 'Transactions' },
    { tab: 'finance-daybook', label: 'Day Book' }, { tab: 'finance-journal', label: 'Journal entries' },
    { tab: 'finance-balancetransfer', label: 'Transfers' }, { tab: 'finance-chartsofaccount', label: 'Chart of Accounts' },
    { tab: 'finance-taxrates', label: 'Tax settings' }
  ]},
  { id: 'people', label: 'Guests & team', icon: Users, items: [
    { tab: 'reservations', label: 'Reservations' }, { tab: 'customers', label: 'Customers' }, { tab: 'staff', label: 'Staff' },
    { tab: 'services-loyalty', label: 'Loyalty' }, { tab: 'services-dinein', label: 'Dine-in settings' },
    { tab: 'services-delivery', label: 'Delivery settings' }, { tab: 'services-sms', label: 'Messages' },
    { tab: 'services-connect', label: 'Connections' }, { tab: 'services-others', label: 'Other services' }
  ]},
  { id: 'settings', label: 'Settings', icon: SlidersHorizontal, items: [
    { tab: 'settings-restaurant', label: 'Restaurant' }, { tab: 'tables-list', label: 'Manage tables' }, { tab: 'spaces-list', label: 'Dining areas' },
    { tab: 'settings-printer', label: 'Printers' }, { tab: 'settings-kot', label: 'Kitchen tickets' }, { tab: 'settings-invoice', label: 'Invoices' },
    { tab: 'settings-orderslip', label: 'Order slips' }, { tab: 'settings-roles', label: 'Roles & access' },
    { tab: 'settings-notifications', label: 'Notification preferences' }, { tab: 'settings-activity', label: 'Activity log' },
    { tab: 'settings-integrations', label: 'Integrations' }, { tab: 'settings-migrated', label: 'Data import' },
    { tab: 'settings-trash', label: 'Trash' }, { tab: 'settings-billing', label: 'Subscription' },
    { tab: 'settings-support', label: 'Support' }, { tab: 'settings-releasenotes', label: 'Release notes' }
  ]},
];
