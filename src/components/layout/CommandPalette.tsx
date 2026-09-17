import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Plus,
  Calendar,
  Sun,
  Settings,
  FileBarChart,
  BookOpen,
  Banknote,
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  Receipt,
  Landmark,
  Users,
  MessageSquare,
  Sparkles,
  LayoutDashboard,
  Store,
  ChefHat,
  CalendarCheck,
  Bell,
  UtensilsCrossed,
  FolderTree,
  Puzzle,
  List,
  BadgePercent,
  Utensils,
  Truck,
  Grid,
  Building2,
  Package,
  Flame,
  Ruler,
  Boxes,
  History,
  Layers,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

export interface CommandItem {
  id: string;
  title: string;
  category: string;
  section: 'Navigation' | 'Finance' | 'Settings' | 'Reports' | 'Actions';
  action: () => void;
  iconType:
    | 'dashboard'
    | 'orders'
    | 'pos'
    | 'kds'
    | 'reservation'
    | 'notification'
    | 'dishes'
    | 'category'
    | 'addons'
    | 'menuset'
    | 'submenu'
    | 'combo'
    | 'dinein'
    | 'delivery'
    | 'table'
    | 'space'
    | 'stockitem'
    | 'consumption'
    | 'suppliers'
    | 'measuringunit'
    | 'stockgroup'
    | 'stockhistory'
    | 'batchproduction'
    | 'finance'
    | 'plus'
    | 'calendar'
    | 'sun'
    | 'settings'
    | 'report'
    | 'daybook'
    | 'transactions'
    | 'sales_invoice'
    | 'returns'
    | 'wallet'
    | 'card'
    | 'voucher'
    | 'bank'
    | 'customer'
    | 'staff';
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: any) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  setActiveTab,
}) => {
  const { addToast } = useRestaurant();
  const [searchQuery, setSearchQuery] = useState('');
  const [mode, setMode] = useState<'search' | 'action'>('search');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedItemRef = useRef<HTMLDivElement>(null);

  // Complete List of All Authentic RestroX Commands & Navigation Routes
  const allCommands: CommandItem[] = [
    // --- SECTION: NAVIGATION (Matching Screenshots 1 & 2) ---
    {
      id: 'nav-dashboard',
      title: 'Dashboard',
      category: 'Navigation',
      section: 'Navigation',
      iconType: 'dashboard',
      action: () => {
        setActiveTab('overview');
        addToast('Dashboard', 'Navigated to RESTRO8 Dashboard.', 'info');
      },
    },
    {
      id: 'nav-orders',
      title: 'Orders',
      category: 'Navigation',
      section: 'Navigation',
      iconType: 'orders',
      action: () => {
        setActiveTab('orders');
        addToast('Orders', 'Navigated to Live Orders Hub.', 'info');
      },
    },
    {
      id: 'nav-pos-mode',
      title: 'POS Mode',
      category: 'Navigation',
      section: 'Navigation',
      iconType: 'pos',
      action: () => {
        setActiveTab('pos');
        addToast('POS Mode', 'Switched to Point of Sale counter terminal.', 'info');
      },
    },
    {
      id: 'nav-kds-mode',
      title: 'KDS Mode',
      category: 'Navigation',
      section: 'Navigation',
      iconType: 'kds',
      action: () => {
        setActiveTab('kds');
        addToast('KDS Mode', 'Switched to Kitchen Display System.', 'info');
      },
    },
    {
      id: 'nav-reservation',
      title: 'Reservation',
      category: 'Navigation',
      section: 'Navigation',
      iconType: 'reservation',
      action: () => {
        setActiveTab('reservations');
        addToast('Reservation', 'Navigated to Table Reservations.', 'info');
      },
    },
    {
      id: 'nav-notification',
      title: 'Notification',
      category: 'Navigation',
      section: 'Navigation',
      iconType: 'notification',
      action: () => {
        setActiveTab('notifications');
        addToast('Notification', 'Opened Notification Center.', 'info');
      },
    },
    {
      id: 'nav-dishes',
      title: 'Dishes',
      category: 'Menu • Navigation',
      section: 'Navigation',
      iconType: 'dishes',
      action: () => {
        setActiveTab('dishes-catalog');
        addToast('Dishes', 'Opened Nepal Dishes Catalog & Pricing.', 'info');
      },
    },
    {
      id: 'nav-category',
      title: 'Category',
      category: 'Menu • Navigation',
      section: 'Navigation',
      iconType: 'category',
      action: () => {
        setActiveTab('inventory');
        addToast('Category', 'Opened Menu Categories manager.', 'info');
      },
    },
    {
      id: 'nav-addons-extras',
      title: 'Add-Ons & Extras',
      category: 'Menu • Navigation',
      section: 'Navigation',
      iconType: 'addons',
      action: () => {
        setActiveTab('dishes-catalog');
        addToast('Add-Ons & Extras', 'Opened Add-Ons & Extras catalog.', 'info');
      },
    },
    {
      id: 'nav-menu-set',
      title: 'Menu Set',
      category: 'Menu • Navigation',
      section: 'Navigation',
      iconType: 'menuset',
      action: () => {
        setActiveTab('dishes-catalog');
        addToast('Menu Set', 'Opened Menu Sets & Thali bundles.', 'info');
      },
    },
    {
      id: 'nav-sub-menu',
      title: 'Sub Menu',
      category: 'Menu • Navigation',
      section: 'Navigation',
      iconType: 'submenu',
      action: () => {
        setActiveTab('dishes-catalog');
        addToast('Sub Menu', 'Opened Sub Menus configuration.', 'info');
      },
    },
    {
      id: 'nav-combo-offer',
      title: 'Combo Offer',
      category: 'Menu • Navigation',
      section: 'Navigation',
      iconType: 'combo',
      action: () => {
        setActiveTab('dishes-catalog');
        addToast('Combo Offer', 'Opened Combo Offers & Festival deals.', 'info');
      },
    },
    {
      id: 'nav-dine-in',
      title: 'Dine In',
      category: 'Services • Navigation',
      section: 'Navigation',
      iconType: 'dinein',
      action: () => {
        setActiveTab('pos');
        addToast('Dine In', 'Opened Dine In floor terminal.', 'info');
      },
    },
    {
      id: 'nav-delivery',
      title: 'Delivery',
      category: 'Services • Navigation',
      section: 'Navigation',
      iconType: 'delivery',
      action: () => {
        setActiveTab('pos');
        addToast('Delivery', 'Opened Delivery & Logistics orders.', 'info');
      },
    },
    {
      id: 'nav-table',
      title: 'Table',
      category: 'Table & Space • Navigation',
      section: 'Navigation',
      iconType: 'table',
      action: () => {
        setActiveTab('table-space');
        addToast('Table', 'Opened Restaurant Floor Tables grid.', 'info');
      },
    },
    {
      id: 'nav-space',
      title: 'Space',
      category: 'Table & Space • Navigation',
      section: 'Navigation',
      iconType: 'space',
      action: () => {
        setActiveTab('table-space');
        addToast('Space', 'Opened Dining Spaces & Halls.', 'info');
      },
    },
    {
      id: 'nav-stock-item',
      title: 'Stock Item',
      category: 'Inventory • Navigation',
      section: 'Navigation',
      iconType: 'stockitem',
      action: () => {
        setActiveTab('inventory');
        addToast('Stock Item', 'Opened Stock Items & Inventory ledger.', 'info');
      },
    },
    {
      id: 'nav-consumption',
      title: 'Consumption',
      category: 'Inventory • Navigation',
      section: 'Navigation',
      iconType: 'consumption',
      action: () => {
        setActiveTab('inventory');
        addToast('Consumption', 'Opened Daily Consumption logs.', 'info');
      },
    },
    {
      id: 'nav-suppliers',
      title: 'Suppliers',
      category: 'Inventory • Navigation',
      section: 'Navigation',
      iconType: 'suppliers',
      action: () => {
        setActiveTab('inventory');
        addToast('Suppliers', 'Opened Raw Material Suppliers register.', 'info');
      },
    },
    {
      id: 'nav-measuring-unit',
      title: 'Measuring Unit',
      category: 'Inventory • Navigation',
      section: 'Navigation',
      iconType: 'measuringunit',
      action: () => {
        setActiveTab('inventory');
        addToast('Measuring Unit', 'Opened Measuring Units (kg, ltr, pcs, packet).', 'info');
      },
    },
    {
      id: 'nav-stock-group',
      title: 'Stock Group',
      category: 'Inventory • Navigation',
      section: 'Navigation',
      iconType: 'stockgroup',
      action: () => {
        setActiveTab('inventory');
        addToast('Stock Group', 'Opened Stock Groups & Categories.', 'info');
      },
    },
    {
      id: 'nav-stock-history',
      title: 'Stock History',
      category: 'Inventory • Navigation',
      section: 'Navigation',
      iconType: 'stockhistory',
      action: () => {
        setActiveTab('inventory');
        addToast('Stock History', 'Opened Stock Audit & Movement History.', 'info');
      },
    },
    {
      id: 'nav-batch-production',
      title: 'Batch Production',
      category: 'Inventory • Navigation',
      section: 'Navigation',
      iconType: 'batchproduction',
      action: () => {
        setActiveTab('inventory');
        addToast('Batch Production', 'Opened Kitchen Batch Production recipes.', 'info');
      },
    },
    {
      id: 'nav-finance',
      title: 'Finance',
      category: 'Navigation',
      section: 'Navigation',
      iconType: 'finance',
      action: () => {
        setActiveTab('analytics');
        addToast('Finance', 'Navigated to Financial Accounting & Reports.', 'info');
      },
    },
    {
      id: 'nav-customer',
      title: 'Customer',
      category: 'Navigation',
      section: 'Navigation',
      iconType: 'customer',
      action: () => {
        setActiveTab('customers');
        addToast('Customers', 'Navigated to Customer Database.', 'info');
      },
    },
    {
      id: 'nav-staff',
      title: 'Staff',
      category: 'Navigation',
      section: 'Navigation',
      iconType: 'staff',
      action: () => {
        setActiveTab('staff');
        addToast('Staff', 'Navigated to Staff Roster.', 'info');
      },
    },
    {
      id: 'nav-settings',
      title: 'Settings',
      category: 'Navigation',
      section: 'Navigation',
      iconType: 'settings',
      action: () => {
        setActiveTab('settings-details');
        addToast('Settings', 'Navigated to Restaurant Details.', 'info');
      },
    },

    // --- SECTION: FINANCE • NAVIGATION ---
    {
      id: 'fn-daybook',
      title: 'Day Book',
      category: 'Finance • Navigation',
      section: 'Finance',
      iconType: 'daybook',
      action: () => {
        setActiveTab('finance-daybook');
        addToast('Day Book', 'Opened Day Book accounting register.', 'info');
      },
    },
    {
      id: 'fn-transactions',
      title: 'Transactions',
      category: 'Finance • Navigation',
      section: 'Finance',
      iconType: 'transactions',
      action: () => {
        setActiveTab('finance-transactions');
        addToast('Transactions', 'Opened Financial Transactions.', 'info');
      },
    },
    {
      id: 'fn-sales-invoice',
      title: 'Sales Invoice',
      category: 'Finance • Navigation',
      section: 'Finance',
      iconType: 'sales_invoice',
      action: () => {
        setActiveTab('finance-sales');
        addToast('Sales Invoices', 'Opened Sales Register & Invoices.', 'info');
      },
    },
    {
      id: 'fn-purchase-bills',
      title: 'Purchase Bills',
      category: 'Finance • Navigation',
      section: 'Finance',
      iconType: 'sales_invoice',
      action: () => {
        setActiveTab('finance-purchase');
        addToast('Purchase Bills', 'Opened Purchase Entry bills.', 'info');
      },
    },
    {
      id: 'fn-sales-returns',
      title: 'Sales Returns',
      category: 'Finance • Navigation',
      section: 'Finance',
      iconType: 'returns',
      action: () => {
        setActiveTab('finance-sales');
        addToast('Sales Returns', 'Opened Sales Return credit notes.', 'info');
      },
    },
    {
      id: 'fn-purchase-returns',
      title: 'Purchase Returns',
      category: 'Finance • Navigation',
      section: 'Finance',
      iconType: 'returns',
      action: () => {
        setActiveTab('finance-purchase');
        addToast('Purchase Returns', 'Opened Purchase Return debit notes.', 'info');
      },
    },
    {
      id: 'fn-income',
      title: 'Income',
      category: 'Finance • Navigation',
      section: 'Finance',
      iconType: 'wallet',
      action: () => {
        setActiveTab('finance-income');
        addToast('Income', 'Opened Income Vouchers.', 'info');
      },
    },
    {
      id: 'fn-expenses',
      title: 'Expenses',
      category: 'Finance • Navigation',
      section: 'Finance',
      iconType: 'wallet',
      action: () => {
        setActiveTab('finance-expenses');
        addToast('Expenses', 'Opened Expense Vouchers.', 'info');
      },
    },
    {
      id: 'fn-payments',
      title: 'Payments',
      category: 'Finance • Navigation',
      section: 'Finance',
      iconType: 'card',
      action: () => {
        setActiveTab('finance-payments');
        addToast('Payments', 'Opened Party Payments Hub.', 'info');
      },
    },
    {
      id: 'fn-journal-voucher',
      title: 'Journal Voucher',
      category: 'Finance • Navigation',
      section: 'Finance',
      iconType: 'voucher',
      action: () => {
        setActiveTab('finance-journal');
        addToast('Journal Voucher', 'Opened Double-entry Journal Vouchers.', 'info');
      },
    },
    {
      id: 'fn-cash-banks',
      title: 'Cash & Banks',
      category: 'Finance • Navigation',
      section: 'Finance',
      iconType: 'bank',
      action: () => {
        setActiveTab('finance-cashbanks');
        addToast('Cash & Banks', 'Opened Accounts & Cash Registers.', 'info');
      },
    },
    {
      id: 'fn-reports',
      title: 'Reports',
      category: 'Finance • Navigation',
      section: 'Finance',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports Directory', 'Opened Financial & POS Reports.', 'info');
      },
    },
    {
      id: 'fn-tax-rates',
      title: 'Tax & Rates',
      category: 'Finance • Navigation',
      section: 'Finance',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-taxrates');
        addToast('Tax Rates', 'Opened Nepal VAT & Service Charge setup.', 'info');
      },
    },

    // --- SECTION: SETTINGS • NAVIGATION ---
    {
      id: 'set-notifications',
      title: 'Notifications',
      category: 'Settings • Navigation',
      section: 'Settings',
      iconType: 'settings',
      action: () => {
        setActiveTab('settings-notifications');
        addToast('Settings', 'Opened Notification Preferences.', 'info');
      },
    },
    {
      id: 'set-activity-log',
      title: 'Activity Log',
      category: 'Settings • Navigation',
      section: 'Settings',
      iconType: 'settings',
      action: () => {
        setActiveTab('settings-activity');
        addToast('Settings', 'Opened Audit & Activity Log.', 'info');
      },
    },
    {
      id: 'set-department',
      title: 'Department',
      category: 'Settings • Navigation',
      section: 'Settings',
      iconType: 'settings',
      action: () => {
        setActiveTab('settings-roles');
        addToast('Settings', 'Opened Department Setup.', 'info');
      },
    },
    {
      id: 'set-billing-subscription',
      title: 'Billing & Subscription',
      category: 'Settings • Navigation',
      section: 'Settings',
      iconType: 'settings',
      action: () => {
        setActiveTab('settings-billing');
        addToast('Settings', 'Opened Billing & Subscription Plans.', 'info');
      },
    },
    {
      id: 'set-users-role',
      title: 'Users Role',
      category: 'Settings • Navigation',
      section: 'Settings',
      iconType: 'settings',
      action: () => {
        setActiveTab('settings-roles');
        addToast('Settings', 'Opened Roles & Permissions.', 'info');
      },
    },
    {
      id: 'set-trash',
      title: 'Trash',
      category: 'Settings • Navigation',
      section: 'Settings',
      iconType: 'settings',
      action: () => {
        setActiveTab('settings-trash');
        addToast('Settings', 'Opened Trash & Deleted Items.', 'info');
      },
    },
    {
      id: 'set-invoice-setting',
      title: 'Invoice Setting',
      category: 'Settings • Navigation',
      section: 'Settings',
      iconType: 'settings',
      action: () => {
        setActiveTab('settings-invoice');
        addToast('Settings', 'Opened IRD Invoice Settings.', 'info');
      },
    },
    {
      id: 'set-kot-setting',
      title: 'KOT Setting',
      category: 'Settings • Navigation',
      section: 'Settings',
      iconType: 'settings',
      action: () => {
        setActiveTab('settings-kot');
        addToast('Settings', 'Opened Kitchen Order Ticket Settings.', 'info');
      },
    },
    {
      id: 'set-orderslip-setting',
      title: 'Order Slip Setting',
      category: 'Settings • Navigation',
      section: 'Settings',
      iconType: 'settings',
      action: () => {
        setActiveTab('settings-orderslip');
        addToast('Settings', 'Opened Order Slip Settings.', 'info');
      },
    },
    {
      id: 'set-printer',
      title: 'Printer',
      category: 'Settings • Navigation',
      section: 'Settings',
      iconType: 'settings',
      action: () => {
        setActiveTab('settings-printer');
        addToast('Settings', 'Opened Thermal Printer Setup.', 'info');
      },
    },
    {
      id: 'set-support-feedback',
      title: 'Support & Feedback',
      category: 'Settings • Navigation',
      section: 'Settings',
      iconType: 'settings',
      action: () => {
        setActiveTab('settings-support');
        addToast('Settings', 'Opened Support & Feedback Hub.', 'info');
      },
    },
    {
      id: 'set-release-notes',
      title: 'Release Notes',
      category: 'Settings • Navigation',
      section: 'Settings',
      iconType: 'settings',
      action: () => {
        setActiveTab('settings-releasenotes');
        addToast('Settings', 'Opened Release Notes Timeline.', 'info');
      },
    },

    // --- SECTION: FINANCE • REPORTS ---
    {
      id: 'rep-account-summary',
      title: 'Account Summary',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening Account Summary Report.', 'info');
      },
    },
    {
      id: 'rep-trial-balance',
      title: 'Trial Balance',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening Trial Balance Matrix.', 'info');
      },
    },
    {
      id: 'rep-profit-loss',
      title: 'Profit Or Loss Statement',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening Profit Or Loss Statement.', 'info');
      },
    },
    {
      id: 'rep-balance-sheet',
      title: 'Balance Sheet',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening Balance Sheet.', 'info');
      },
    },
    {
      id: 'rep-general-ledger',
      title: 'General Ledger Master',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening General Ledger Master.', 'info');
      },
    },
    {
      id: 'rep-payment-mode-summary',
      title: 'Payment Mode Summary',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening Payment Mode Summary.', 'info');
      },
    },
    {
      id: 'rep-sales-register',
      title: 'Sales Register',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening IRD Sales Register.', 'info');
      },
    },
    {
      id: 'rep-sales-return-register',
      title: 'Sales Return Register',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening IRD Sales Return Register.', 'info');
      },
    },
    {
      id: 'rep-purchase-register',
      title: 'Purchase Register',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening IRD Purchase Register.', 'info');
      },
    },
    {
      id: 'rep-purchase-return-register',
      title: 'Purchase Return Register',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening IRD Purchase Return Register.', 'info');
      },
    },
    {
      id: 'rep-vat-summary',
      title: 'VAT Summary Report',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening VAT Summary Report.', 'info');
      },
    },
    {
      id: 'rep-annex-13',
      title: 'Annex 13 Report',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening IRD Annex 13 Report.', 'info');
      },
    },
    {
      id: 'rep-annex-5',
      title: 'Annex 5 Materialized View Report',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening Annex 5 Materialized View.', 'info');
      },
    },
    {
      id: 'rep-sales-master',
      title: 'Sales Master Report',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening Sales Master Report.', 'info');
      },
    },
    {
      id: 'rep-customer-monthly-sales',
      title: 'Customer Monthly Sales',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening Customer Monthly Sales.', 'info');
      },
    },
    {
      id: 'rep-complimentary-items',
      title: 'Complimentary Items Report',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening Complimentary Items Report.', 'info');
      },
    },
    {
      id: 'rep-complimentary-addons',
      title: 'Complimentary Add-Ons Report',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening Complimentary Add-Ons Report.', 'info');
      },
    },
    {
      id: 'rep-invoice-complimentary',
      title: 'Invoice-wise Complimentary Report',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening Invoice-wise Complimentary Report.', 'info');
      },
    },
    {
      id: 'rep-sales-collection',
      title: 'Sales Collection Report',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening Sales Collection Report.', 'info');
      },
    },
    {
      id: 'rep-daily-sales-summary',
      title: 'Daily Sales Summary Report',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening Daily Sales Summary.', 'info');
      },
    },
    {
      id: 'rep-submenu-sales',
      title: 'Sub-Menu Sales Report',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening Sub-Menu Sales Report.', 'info');
      },
    },
    {
      id: 'rep-submenu-monthly',
      title: 'Submenu-wise Monthly Sales Report',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening Submenu Monthly Sales Report.', 'info');
      },
    },
    {
      id: 'rep-category-quantity',
      title: 'Category Quantity Sales Report',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening Category Quantity Sales Report.', 'info');
      },
    },
    {
      id: 'rep-category-monthly',
      title: 'Category-wise Monthly Sales Report',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening Category Monthly Sales Report.', 'info');
      },
    },
    {
      id: 'rep-dish-monthly',
      title: 'Dish Monthly Sales Report',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening Dish Monthly Sales Report.', 'info');
      },
    },
    {
      id: 'rep-dish-quantity',
      title: 'Dish Quantity Sales Report',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening Dish Quantity Sales Report.', 'info');
      },
    },
    {
      id: 'rep-kot-typewise',
      title: 'KOT Type-wise Sales Report',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening KOT Type-wise Sales Report.', 'info');
      },
    },
    {
      id: 'rep-food-cost',
      title: 'Food Cost Report',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening Food Cost Report.', 'info');
      },
    },
    {
      id: 'rep-menuset-wise',
      title: 'Menuset-wise Sales Report',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening Menuset-wise Sales Report.', 'info');
      },
    },
    {
      id: 'rep-party-balance',
      title: 'Party Balance Report',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening Party Balance Report.', 'info');
      },
    },
    {
      id: 'rep-party-receivable',
      title: 'Party Receivable Report',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening Party Receivable Report.', 'info');
      },
    },
    {
      id: 'rep-party-payable',
      title: 'Party Payable Report',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening Party Payable Report.', 'info');
      },
    },
    {
      id: 'rep-balance-confirmation',
      title: 'Balance Confirmation Report',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening Balance Confirmation Report.', 'info');
      },
    },
    {
      id: 'rep-stock-ledger',
      title: 'Stock Item Ledger Summary',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening Stock Item Ledger Summary.', 'info');
      },
    },
    {
      id: 'rep-stock-reconciliation',
      title: 'Stock Reconciliation Report',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening Stock Reconciliation Report.', 'info');
      },
    },
    {
      id: 'rep-stock-ageing',
      title: 'Stock Ageing Report',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening Stock Ageing Report.', 'info');
      },
    },
    {
      id: 'rep-stock-movement',
      title: 'Stock Movement Report',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening Stock Movement Report.', 'info');
      },
    },
    {
      id: 'rep-stock-position',
      title: 'Stock Position Report',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening Stock Position Report.', 'info');
      },
    },
    {
      id: 'rep-purchase-vat-recon',
      title: 'Purchase VAT Reconciliation',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening Purchase VAT Reconciliation.', 'info');
      },
    },
    {
      id: 'rep-purchase-by-supplier',
      title: 'Purchase By Supplier',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening Purchase By Supplier Report.', 'info');
      },
    },
    {
      id: 'rep-purchase-return-supplier',
      title: 'Purchase Return By Supplier',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening Purchase Return By Supplier.', 'info');
      },
    },
    {
      id: 'rep-purchase-by-item',
      title: 'Purchase By Item',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening Purchase By Item Report.', 'info');
      },
    },
    {
      id: 'rep-purchase-return-item',
      title: 'Purchase Return By Item',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening Purchase Return By Item Report.', 'info');
      },
    },
    {
      id: 'rep-purchase-supplier-monthly',
      title: 'Purchase By Supplier (Monthly)',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening Monthly Purchase By Supplier.', 'info');
      },
    },
    {
      id: 'rep-purchase-return-supplier-monthly',
      title: 'Purchase Return By Supplier (Monthly)',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening Monthly Purchase Return By Supplier.', 'info');
      },
    },
    {
      id: 'rep-purchase-item-monthly',
      title: 'Purchase By Item (Monthly)',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening Monthly Purchase By Item.', 'info');
      },
    },
    {
      id: 'rep-purchase-return-item-monthly',
      title: 'Purchase Return By Item (Monthly)',
      category: 'Finance • Reports',
      section: 'Reports',
      iconType: 'report',
      action: () => {
        setActiveTab('finance-reports');
        addToast('Reports', 'Opening Monthly Purchase Return By Item.', 'info');
      },
    },

    // --- SECTION: ACTIONS (Operational Actions & Shortcuts) ---
    {
      id: 'act-dine-in',
      title: 'Add Dine in Order',
      category: 'Actions • Order',
      section: 'Actions',
      iconType: 'plus',
      action: () => {
        setActiveTab('pos');
        addToast('Dine In', 'Opening POS Dine-In Order terminal.', 'info');
      },
    },
    {
      id: 'act-delivery',
      title: 'Add Delivery Order',
      category: 'Actions • Order',
      section: 'Actions',
      iconType: 'plus',
      action: () => {
        setActiveTab('orders');
        addToast('Delivery Order', 'Opening Delivery Order dispatch.', 'info');
      },
    },
    {
      id: 'act-reservation-order',
      title: 'Add Reservation Order',
      category: 'Actions • Order',
      section: 'Actions',
      iconType: 'plus',
      action: () => {
        setActiveTab('reservations');
        addToast('Reservation', 'Opening Table Booking modal.', 'info');
      },
    },
    {
      id: 'act-take-away',
      title: 'Add Take Away Order',
      category: 'Actions • Order',
      section: 'Actions',
      iconType: 'plus',
      action: () => {
        setActiveTab('pos');
        addToast('Take Away', 'Opening Take Away Order terminal.', 'info');
      },
    },
    {
      id: 'act-pickup',
      title: 'Add Pick up Order',
      category: 'Actions • Order',
      section: 'Actions',
      iconType: 'plus',
      action: () => {
        setActiveTab('pos');
        addToast('Pick up Order', 'Switched to POS for Pick up Order.', 'info');
      },
    },
    {
      id: 'act-quick-billing',
      title: 'Add Quick Billing Order',
      category: 'Actions • Order',
      section: 'Actions',
      iconType: 'plus',
      action: () => {
        setActiveTab('pos');
        addToast('Quick Billing', 'Quick Billing Order terminal ready.', 'info');
      },
    },
    {
      id: 'act-dish',
      title: 'Add Dish',
      category: 'Actions • Dish',
      section: 'Actions',
      iconType: 'plus',
      action: () => {
        setActiveTab('menu');
        addToast('Menu Management', 'Opening Dish catalog.', 'info');
      },
    },
    {
      id: 'act-category',
      title: 'Add Category',
      category: 'Actions • Category',
      section: 'Actions',
      iconType: 'plus',
      action: () => {
        setActiveTab('menu');
        addToast('Category Management', 'Add Category dialog opened.', 'info');
      },
    },
    {
      id: 'act-addon',
      title: 'Add Add-On',
      category: 'Actions • Add-On',
      section: 'Actions',
      iconType: 'plus',
      action: () => {
        setActiveTab('menu');
        addToast('Add-Ons', 'Add Add-on modifier opened.', 'info');
      },
    },
    {
      id: 'act-menu-set',
      title: 'Add Menu Set',
      category: 'Actions • Menu Set',
      section: 'Actions',
      iconType: 'plus',
      action: () => {
        setActiveTab('menu');
        addToast('Menu Set', 'Menu Set creator opened.', 'info');
      },
    },
    {
      id: 'act-sub-menu',
      title: 'Add Sub Menu',
      category: 'Actions • Sub Menu',
      section: 'Actions',
      iconType: 'plus',
      action: () => {
        setActiveTab('menu');
        addToast('Sub Menu', 'Sub Menu configuration opened.', 'info');
      },
    },
    {
      id: 'act-combo',
      title: 'Add Combo Offer',
      category: 'Actions • Combo Offer',
      section: 'Actions',
      iconType: 'plus',
      action: () => {
        setActiveTab('menu');
        addToast('Combo Offer', 'Combo Offer editor opened.', 'info');
      },
    },
    {
      id: 'act-create-table',
      title: 'Create New Table',
      category: 'Actions • Table & Space',
      section: 'Actions',
      iconType: 'plus',
      action: () => {
        setActiveTab('floor');
        addToast('Table Management', 'Table & Space layout opened.', 'info');
      },
    },
    {
      id: 'act-create-space',
      title: 'Create New Space',
      category: 'Actions • Table & Space',
      section: 'Actions',
      iconType: 'plus',
      action: () => {
        setActiveTab('floor');
        addToast('Space Management', 'Create New Space dialog opened.', 'info');
      },
    },
    {
      id: 'act-invite-staff',
      title: 'Invite New Staffs',
      category: 'Actions • Staff',
      section: 'Actions',
      iconType: 'plus',
      action: () => {
        setActiveTab('staff');
        addToast('Staff Team', 'Invite Staff modal ready.', 'info');
      },
    },
    {
      id: 'act-journal-voucher',
      title: 'Add New Journal Voucher',
      category: 'Actions • Journal Voucher',
      section: 'Actions',
      iconType: 'plus',
      action: () => {
        setActiveTab('finance-journal');
        addToast('Journal Voucher', 'Opening Journal Voucher entry form.', 'info');
      },
    },
    {
      id: 'act-sales-return',
      title: 'Add Sales Return',
      category: 'Actions • Sales Return',
      section: 'Actions',
      iconType: 'plus',
      action: () => {
        setActiveTab('finance-sales');
        addToast('Sales Return', 'Sales Return Credit Note form opened.', 'info');
      },
    },
    {
      id: 'act-purchase-bill',
      title: 'Add Purchase Bill',
      category: 'Actions • Purchase Bill',
      section: 'Actions',
      iconType: 'plus',
      action: () => {
        setActiveTab('finance-purchase');
        addToast('Purchase Bill', 'Add Purchase Bill modal opened.', 'info');
      },
    },
    {
      id: 'act-purchase-return',
      title: 'Add Purchase Return',
      category: 'Actions • Purchase Return',
      section: 'Actions',
      iconType: 'plus',
      action: () => {
        setActiveTab('finance-purchase');
        addToast('Purchase Return', 'Purchase Return Debit Note form opened.', 'info');
      },
    },
    {
      id: 'act-income',
      title: 'Add Income',
      category: 'Actions • Income',
      section: 'Actions',
      iconType: 'plus',
      action: () => {
        setActiveTab('finance-income');
        addToast('Income Voucher', 'Add Income form opened.', 'info');
      },
    },
    {
      id: 'act-expense',
      title: 'Add Expense',
      category: 'Actions • Expense',
      section: 'Actions',
      iconType: 'plus',
      action: () => {
        setActiveTab('finance-expenses');
        addToast('Expense Voucher', 'Add Expense form opened.', 'info');
      },
    },
    {
      id: 'act-payment-in',
      title: 'Add Payment In',
      category: 'Actions • Payment In',
      section: 'Actions',
      iconType: 'plus',
      action: () => {
        setActiveTab('finance-payments');
        addToast('Payment In', 'Party Payment In form opened.', 'info');
      },
    },
    {
      id: 'act-payment-out',
      title: 'Add Payment Out',
      category: 'Actions • Payment Out',
      section: 'Actions',
      iconType: 'plus',
      action: () => {
        setActiveTab('finance-payments');
        addToast('Payment Out', 'Vendor Payment Out form opened.', 'info');
      },
    },
    {
      id: 'act-account',
      title: 'Add Account',
      category: 'Actions • Account',
      section: 'Actions',
      iconType: 'plus',
      action: () => {
        setActiveTab('finance-chartsofaccount');
        addToast('Chart of Accounts', 'Add Ledger Account opened.', 'info');
      },
    },
    {
      id: 'act-mode',
      title: 'Add Mode',
      category: 'Actions • Mode',
      section: 'Actions',
      iconType: 'plus',
      action: () => {
        setActiveTab('finance-cashbanks');
        addToast('Payment Mode', 'Add Cash/Bank/Wallet Mode opened.', 'info');
      },
    },
    {
      id: 'act-balance-transfer',
      title: 'Add Balance Transfer',
      category: 'Actions • Balance Transfer',
      section: 'Actions',
      iconType: 'plus',
      action: () => {
        setActiveTab('finance-balancetransfer');
        addToast('Balance Transfer', 'Add Balance Transfer form opened.', 'info');
      },
    },
    {
      id: 'act-tax',
      title: 'Add New Tax',
      category: 'Actions • Tax',
      section: 'Actions',
      iconType: 'plus',
      action: () => {
        setActiveTab('finance-taxrates');
        addToast('Tax Rates', 'Add Nepal VAT/Service Charge rate opened.', 'info');
      },
    },
    {
      id: 'act-department',
      title: 'Add New Department',
      category: 'Actions • Department',
      section: 'Actions',
      iconType: 'plus',
      action: () => {
        setActiveTab('settings-roles');
        addToast('Department', 'Add Department configuration opened.', 'info');
      },
    },
    {
      id: 'act-user-role',
      title: 'Add User Role',
      category: 'Actions • User Role',
      section: 'Actions',
      iconType: 'plus',
      action: () => {
        setActiveTab('settings-roles');
        addToast('User Roles', 'Add User Role permissions form opened.', 'info');
      },
    },
    {
      id: 'act-kot-type',
      title: 'Add KOT Type',
      category: 'Actions • KOT Type',
      section: 'Actions',
      iconType: 'plus',
      action: () => {
        setActiveTab('settings-kot');
        addToast('KOT Types', 'Add KOT Type modal opened.', 'info');
      },
    },
    {
      id: 'act-printer',
      title: 'Add Printer',
      category: 'Actions • Printer',
      section: 'Actions',
      iconType: 'plus',
      action: () => {
        setActiveTab('settings-printer');
        addToast('Thermal Printers', 'Add Printer dialog opened.', 'info');
      },
    },
    {
      id: 'act-date-mode',
      title: 'Toggle Date Mode (AD/BS)',
      category: 'Actions • Date Mode',
      section: 'Actions',
      iconType: 'calendar',
      action: () => {
        addToast('Calendar Mode', 'Bikram Sambat (BS) / AD mode toggled.', 'info');
      },
    },
    {
      id: 'act-theme',
      title: 'Toggle Theme',
      category: 'Actions • Theme',
      section: 'Actions',
      iconType: 'sun',
      action: () => {
        document.documentElement.classList.toggle('dark');
        addToast('Theme Switched', 'Dark / Light theme toggled.', 'info');
      },
    },
    {
      id: 'act-batch-production',
      title: 'Add Batch Production',
      category: 'Actions • Batch Production',
      section: 'Actions',
      iconType: 'plus',
      action: () => {
        setActiveTab('inventory');
        addToast('Production Batch', 'Stock production batch opened.', 'info');
      },
    },
  ];

  // Filter commands by mode and search query
  const filteredCommands = allCommands.filter((cmd) => {
    if (mode === 'action' && cmd.section !== 'Actions') {
      return false;
    }
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q) ||
      cmd.section.toLowerCase().includes(q)
    );
  });

  // Reset selected index when search query or mode changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery, mode]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === '/' && searchQuery === '') {
        e.preventDefault();
        setMode((prev) => (prev === 'search' ? 'action' : 'search'));
      } else if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose, searchQuery]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  // Render Icon helper
  const renderIcon = (type: CommandItem['iconType']) => {
    switch (type) {
      case 'dashboard':
        return <LayoutDashboard size={15} />;
      case 'orders':
        return <Receipt size={15} />;
      case 'pos':
        return <Store size={15} />;
      case 'kds':
        return <ChefHat size={15} />;
      case 'reservation':
        return <CalendarCheck size={15} />;
      case 'notification':
        return <Bell size={15} />;
      case 'dishes':
        return <UtensilsCrossed size={15} />;
      case 'category':
        return <FolderTree size={15} />;
      case 'addons':
        return <Puzzle size={15} />;
      case 'menuset':
        return <BookOpen size={15} />;
      case 'submenu':
        return <List size={15} />;
      case 'combo':
        return <BadgePercent size={15} />;
      case 'dinein':
        return <Utensils size={15} />;
      case 'delivery':
        return <Truck size={15} />;
      case 'table':
        return <Grid size={15} />;
      case 'space':
        return <Building2 size={15} />;
      case 'stockitem':
        return <Package size={15} />;
      case 'consumption':
        return <Flame size={15} />;
      case 'suppliers':
        return <Truck size={15} />;
      case 'measuringunit':
        return <Ruler size={15} />;
      case 'stockgroup':
        return <Boxes size={15} />;
      case 'stockhistory':
        return <History size={15} />;
      case 'batchproduction':
        return <Layers size={15} />;
      case 'finance':
        return <TrendingUp size={15} />;
      case 'settings':
        return <Settings size={15} />;
      case 'report':
        return <FileBarChart size={15} />;
      case 'daybook':
        return <BookOpen size={15} />;
      case 'transactions':
        return <Banknote size={15} />;
      case 'sales_invoice':
        return <TrendingUp size={15} />;
      case 'returns':
        return <TrendingDown size={15} />;
      case 'wallet':
        return <Wallet size={15} />;
      case 'card':
        return <CreditCard size={15} />;
      case 'voucher':
        return <Receipt size={15} />;
      case 'bank':
        return <Landmark size={15} />;
      case 'customer':
        return <MessageSquare size={15} />;
      case 'staff':
        return <Users size={15} />;
      case 'calendar':
        return <Calendar size={15} />;
      case 'sun':
        return <Sun size={15} />;
      case 'plus':
      default:
        return <Plus size={16} strokeWidth={2.5} />;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(3px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '5vh',
        paddingBottom: '30px',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '92%',
          maxWidth: '980px',
          maxHeight: '90vh',
          backgroundColor: 'var(--color-card)',
          borderRadius: '16px',
          border: '1px solid var(--color-border)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Top Search Input Bar matching Screenshots 1-5 */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
            <Search size={18} color="var(--color-muted-foreground)" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search pages, routes, and commands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: '0.94rem',
                color: 'var(--color-foreground)',
                width: '100%',
                fontWeight: 500,
              }}
            />
          </div>

          {/* Right Mode Tag matching Screenshots 1-5 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem' }}>
            <button
              type="button"
              onClick={() => setMode((prev) => (prev === 'search' ? 'action' : 'search'))}
              style={{
                backgroundColor: mode === 'search' ? '#ECFDF5' : '#FEF2F2',
                color: mode === 'search' ? '#10B981' : '#EF4444',
                border: `1px solid ${mode === 'search' ? '#A7F3D0' : '#FECACA'}`,
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: '6px',
                fontSize: '0.76rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {mode === 'search' ? 'Search Mode' : 'Action Mode'}
            </button>
            <span style={{ color: '#6B7280' }}>
              Press <kbd style={{ padding: '1px 5px', borderRadius: '4px', backgroundColor: '#F3F4F6', border: '1px solid #E5E7EB', fontSize: '0.72rem', fontWeight: 600 }}>/</kbd> to toggle
            </span>
          </div>
        </div>

        {/* Command Cards Grid Area matching Screenshots 1-5 */}
        <div
          style={{
            padding: '20px',
            overflowY: 'auto',
            flex: 1,
            maxHeight: '66vh',
          }}
        >
          {filteredCommands.length === 0 ? (
            <div
              style={{
                padding: '60px 20px',
                textAlign: 'center',
                color: '#9CA3AF',
                fontSize: '0.9rem',
              }}
            >
              No matching commands or routes found.
            </div>
          ) : (
            <div>
              {/* If user is not searching, show organized sections */}
              {!searchQuery && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                  {(['Navigation', 'Finance', 'Settings', 'Reports', 'Actions'] as const).map((sec) => {
                    const secCommands = allCommands.filter((c) => c.section === sec);
                    if (secCommands.length === 0) return null;

                    return (
                      <div key={sec}>
                        <div
                          style={{
                            fontSize: '0.84rem',
                            fontWeight: 700,
                            color: '#6B7280',
                            marginBottom: '12px',
                            letterSpacing: '0.2px',
                          }}
                        >
                          {sec === 'Reports' ? 'Finance • Reports' : sec}
                        </div>

                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '12px',
                          }}
                        >
                          {secCommands.map((cmd) => {
                            const globalIndex = filteredCommands.findIndex((c) => c.id === cmd.id);
                            const isSelected = selectedIndex === globalIndex;

                            return (
                              <div
                                key={cmd.id}
                                ref={isSelected ? selectedItemRef : undefined}
                                onClick={() => {
                                  cmd.action();
                                  onClose();
                                }}
                                onMouseEnter={() => setSelectedIndex(globalIndex)}
                                style={{
                                  padding: '14px 16px',
                                  borderRadius: '12px',
                                  border: isSelected
                                    ? '1.5px solid #FCA5A5'
                                    : '1px solid #F3F4F6',
                                  backgroundColor: isSelected ? '#FEF2F2' : '#FFF',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '10px',
                                  boxShadow: isSelected
                                    ? '0 2px 8px rgba(14, 165, 233, 0.08)'
                                    : '0 1px 2px rgba(0,0,0,0.02)',
                                  transition: 'all 0.12s ease',
                                }}
                              >
                                {/* Red Icon Badge */}
                                <div
                                  style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '6px',
                                    backgroundColor: '#EF4444',
                                    color: '#FFF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  {renderIcon(cmd.iconType)}
                                </div>

                                {/* Title & Category */}
                                <div>
                                  <div
                                    style={{
                                      fontSize: '0.86rem',
                                      fontWeight: 700,
                                      color: '#111827',
                                      lineHeight: '1.3',
                                      marginBottom: '3px',
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                    }}
                                  >
                                    {cmd.title}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: '0.73rem',
                                      color: '#6B7280',
                                      fontWeight: 500,
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                    }}
                                  >
                                    {cmd.category}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* If user is searching, show direct flat grid of results */}
              {searchQuery && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '12px',
                  }}
                >
                  {filteredCommands.map((cmd, idx) => {
                    const isSelected = selectedIndex === idx;

                    return (
                      <div
                        key={cmd.id}
                        ref={isSelected ? selectedItemRef : undefined}
                        onClick={() => {
                          cmd.action();
                          onClose();
                        }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        style={{
                          padding: '14px 16px',
                          borderRadius: '12px',
                          border: isSelected
                            ? '1.5px solid #FCA5A5'
                            : '1px solid #F3F4F6',
                          backgroundColor: isSelected ? '#FEF2F2' : '#FFF',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                          boxShadow: isSelected
                            ? '0 2px 8px rgba(14, 165, 233, 0.08)'
                            : '0 1px 2px rgba(0,0,0,0.02)',
                          transition: 'all 0.12s ease',
                        }}
                      >
                        {/* Red Icon Badge */}
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            backgroundColor: '#EF4444',
                            color: '#FFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {renderIcon(cmd.iconType)}
                        </div>

                        {/* Title & Category */}
                        <div>
                          <div
                            style={{
                              fontSize: '0.86rem',
                              fontWeight: 700,
                              color: '#111827',
                              lineHeight: '1.3',
                              marginBottom: '3px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {cmd.title}
                          </div>
                          <div
                            style={{
                              fontSize: '0.73rem',
                              color: '#6B7280',
                              fontWeight: 500,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {cmd.category}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Hotkeys Info matching Screenshots 1-5 */}
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: 'var(--color-muted)',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.76rem',
            color: 'var(--color-muted-foreground)',
          }}
        >
          {/* Left: / Toggle mode */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <kbd style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', color: 'var(--color-foreground)', fontWeight: 600 }}>/</kbd>
            <span>Toggle mode</span>
          </div>

          {/* Center: Tab next • Shift + Tab previous */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <kbd style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', color: 'var(--color-foreground)', fontWeight: 600 }}>Tab</kbd>
              <span>next</span>
            </div>
            <span>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <kbd style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', color: 'var(--color-foreground)', fontWeight: 600 }}>Shift + Tab</kbd>
              <span>previous</span>
            </div>
          </div>

          {/* Right: ⌘+K Open / Close */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <kbd style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', color: 'var(--color-foreground)', fontWeight: 600 }}>⌘ + K</kbd>
            <span>Open / Close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
