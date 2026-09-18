import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Table, Order } from '../../types/restaurant';
import { formatNPR } from '../../utils/nepalDate';
import { SeatTableModal } from '../modals/SeatTableModal';
import { PaymentModal } from '../modals/PaymentModal';
import { ReceiptModal } from '../modals/ReceiptModal';
import { KOTModal } from '../modals/KOTModal';
import {
  Search,
  Plus,
  Tv,
  Calendar,
  Utensils,
  Clock,
  Sparkles,
  ChevronDown,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  Receipt,
  User,
  Printer,
  Scissors,
  Check,
  RotateCcw,
  Filter,
} from 'lucide-react';

export const OrdersHubView: React.FC = () => {
  const {
    orders,
    tables,
    activeTab,
    setActiveTab,
    setDraftTable,
    addThakaliRefill,
    ordersSubTab,
    setOrdersSubTab,
    updateOrderStatus,
    settings,
    addToast,
  } = useRestaurant();

  const hubTab = ordersSubTab || 'orders';
  const setHubTab = (tab: 'orders' | 'table' | 'kot') => {
    if (setOrdersSubTab) setOrdersSubTab(tab);
  };
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Popovers
  const [seatingTable, setSeatingTable] = useState<Table | null>(null);
  const [settlingOrder, setSettlingOrder] = useState<Order | null>(null);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [viewingKOTOrder, setViewingKOTOrder] = useState<Order | null>(null);

  // KOT Interactive States
  const [openStatusDropdownId, setOpenStatusDropdownId] = useState<string | null>(null);
  const [openPrintDropdownId, setOpenPrintDropdownId] = useState<string | null>(null);

  const [showCompletedKOTs, setShowCompletedKOTs] = useState<boolean>(false);
  const [isSplitByType, setIsSplitByType] = useState<boolean>(false);

  // Orders Hub Filters (Assigned Dropdown & Order Type)
  const [assignedFilter, setAssignedFilter] = useState<string>('all');
  const [showAssignedDropdown, setShowAssignedDropdown] = useState<boolean>(false);
  const [orderTypeFilter, setOrderTypeFilter] = useState<'all' | 'dine-in' | 'takeaway' | 'delivery'>('all');

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenStatusDropdownId(null);
      setOpenPrintDropdownId(null);
      setShowAssignedDropdown(false);
    };
    if (openStatusDropdownId || openPrintDropdownId || showAssignedDropdown) {
      window.addEventListener('click', handleClickOutside);
      return () => window.removeEventListener('click', handleClickOutside);
    }
  }, [openStatusDropdownId, openPrintDropdownId, showAssignedDropdown]);

  // Global [N] hotkey for Add New Order in POS
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setDraftTable(null);
        setActiveTab('pos');
        if (addToast) addToast('Opening POS Terminal for New Order [N]', 'info');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTab, setDraftTable, addToast]);

  // Preview and print use the same real ticket data.
  const handlePrintKOT = (order: Order, _orderIndex: number) => setViewingKOTOrder(order);

  // Active (unsettled) orders
  const activeOrders = orders.filter((o) => o.paymentStatus === 'unpaid' && o.status !== 'cancelled');

  // Filtered KOT orders (Pending vs Completed)
  const kotOrders = showCompletedKOTs
    ? orders.filter((o) => o.status === 'completed')
    : orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled');

  // Staff members list with active pending counts
  const staffMembers = [
    { id: 'all', label: 'All Orders', count: activeOrders.length },
    {
      id: 'me',
      label: 'Assigned to Me (Kirtiman Tamang)',
      count: activeOrders.filter((o) => (o.serverName || 'Kirtiman Tamang') === 'Kirtiman Tamang').length,
    },
    {
      id: 'Bikash Tamang',
      label: 'Bikash Tamang',
      count: activeOrders.filter((o) => o.serverName === 'Bikash Tamang').length,
    },
    {
      id: 'Sujata Shrestha',
      label: 'Sujata Shrestha',
      count: activeOrders.filter((o) => o.serverName === 'Sujata Shrestha').length,
    },
    {
      id: 'Rohan Gurung',
      label: 'Rohan Gurung',
      count: activeOrders.filter((o) => o.serverName === 'Rohan Gurung').length,
    },
    {
      id: 'unassigned',
      label: 'Unassigned Orders',
      count: activeOrders.filter((o) => !o.serverName).length,
    },
  ];

  // Badge count for Assigned button
  const currentAssignedBadgeCount =
    assignedFilter === 'all'
      ? activeOrders.filter((o) => (o.serverName || 'Kirtiman Tamang') === 'Kirtiman Tamang').length
      : staffMembers.find((s) => s.id === assignedFilter)?.count ?? 0;

  const getAssignedButtonLabel = () => {
    if (assignedFilter === 'all') return 'Assigned';
    if (assignedFilter === 'me') return 'Assigned: Me';
    if (assignedFilter === 'unassigned') return 'Unassigned';
    return `Assigned: ${assignedFilter.split(' ')[0]}`;
  };

  // Filtered orders for Orders Tab display
  const displayOrders = activeOrders.filter((order) => {
    // Filter by orderType
    if (orderTypeFilter !== 'all' && order.orderType !== orderTypeFilter) return false;

    // Filter by assigned staff
    if (assignedFilter === 'me') {
      const sName = order.serverName || 'Kirtiman Tamang';
      if (sName !== 'Kirtiman Tamang') return false;
    } else if (assignedFilter === 'unassigned') {
      if (order.serverName) return false;
    } else if (assignedFilter !== 'all') {
      if (order.serverName !== assignedFilter) return false;
    }

    // Search query filter (searches across table, items, order number, customer, and server)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const tableInfo = tables.find((t) => t.id === order.tableId);
      const matchesTable = tableInfo?.label.toLowerCase().includes(q);
      const matchesOrderNum = String(order.orderNumber).includes(q);
      const matchesCustomer = order.customerName?.toLowerCase().includes(q);
      const matchesServer = order.serverName?.toLowerCase().includes(q);
      const matchesItem = order.items.some(
        (it) => it.name.toLowerCase().includes(q) || (it.nepaliName && it.nepaliName.toLowerCase().includes(q))
      );
      return Boolean(matchesTable || matchesOrderNum || matchesCustomer || matchesServer || matchesItem);
    }

    return true;
  });

  // Filtered tables
  const filteredTables = tables.filter((t) => {
    if (selectedZone !== 'all' && t.zone !== selectedZone) return false;
    if (searchQuery.trim()) {
      return t.label.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="orders-hub-container" style={{ padding: 'var(--r8-page-padding, 24px)', maxWidth: '1440px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      {/* Top Header Controls (Screenshots 1, 4 & 5) */}
      <div
        className="orders-hub-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        {/* Left 3 Sub-tabs: Orders | Table | KOT */}
        <div className="orders-hub-subtabs" style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--color-card)', padding: '4px', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
          <button
            onClick={() => setHubTab('orders')}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: hubTab === 'orders' ? 'var(--r8-brand-primary)' : 'transparent',
              color: hubTab === 'orders' ? '#FFFFFF' : 'var(--color-foreground)',
              transition: 'all 0.15s ease',
            }}
          >
            Orders
          </button>
          <button
            onClick={() => setHubTab('table')}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: hubTab === 'table' ? 'var(--r8-brand-primary)' : 'transparent',
              color: hubTab === 'table' ? '#FFFFFF' : 'var(--color-foreground)',
              transition: 'all 0.15s ease',
            }}
          >
            Table
          </button>
          <button
            onClick={() => setHubTab('kot')}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: hubTab === 'kot' ? 'var(--r8-brand-primary)' : 'transparent',
              color: hubTab === 'kot' ? '#FFFFFF' : 'var(--color-foreground)',
              transition: 'all 0.15s ease',
            }}
          >
            KOT
          </button>
        </div>

        {/* Right Controls */}
        {hubTab === 'kot' ? (
          /* Controls matching Screenshot 1 */
          <div className="orders-hub-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowCompletedKOTs((prev) => !prev)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: showCompletedKOTs ? 'var(--r8-brand-primary)' : 'var(--color-border)',
                backgroundColor: showCompletedKOTs ? 'var(--r8-brand-primary)' : 'var(--color-card)',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
                color: showCompletedKOTs ? '#FFFFFF' : 'var(--color-foreground)',
                transition: 'all 0.15s ease',
              }}
            >
              {showCompletedKOTs ? '← Back to Pending KOTs' : 'Completed KOTs'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSplitByType((prev) => {
                  const next = !prev;
                  if (addToast) {
                    addToast(
                      next
                        ? 'KOT items split by preparation stations (Kitchen / Bar / Momo)'
                        : 'KOT view reset to standard order layout',
                      'info'
                    );
                  }
                  return next;
                });
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: isSplitByType ? '1px solid var(--r8-brand-primary)' : '1px solid var(--color-border)',
                backgroundColor: isSplitByType ? 'var(--r8-brand-primary)' : 'var(--color-card)',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer',
                color: isSplitByType ? '#FFFFFF' : 'var(--color-foreground)',
                transition: 'all 0.15s ease',
              }}
            >
              <Scissors size={14} /> {isSplitByType ? 'Station Split Active' : 'Split KOT by type'}
            </button>
            <button
              onClick={() => {
                setDraftTable(null);
                setActiveTab('pos');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 18px',
                borderRadius: '8px',
                backgroundColor: 'var(--r8-brand-primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '0.86rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(14, 165, 233, 0.35)',
              }}
            >
              <Plus size={16} /> Add New Order <span style={{ opacity: 0.8, fontSize: '0.75rem' }}>[N]</span>
              <ChevronDown size={14} />
            </button>
          </div>
        ) : (
          /* Controls matching Screenshot 4 & 5 */
          <div className="orders-hub-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div
              className="orders-hub-search"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
              }}
            >
              <Search size={15} color="var(--color-muted-foreground)" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="orders-hub-search-input"
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '0.84rem',
                  color: 'var(--color-foreground)',
                  width: '120px',
                }}
              />
            </div>

            {/* Interactive Assigned Button & Popover */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAssignedDropdown((prev) => !prev);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  backgroundColor:
                    showAssignedDropdown || assignedFilter !== 'all'
                      ? 'var(--color-muted)'
                      : 'var(--color-card)',
                  border:
                    showAssignedDropdown || assignedFilter !== 'all'
                      ? '1px solid var(--r8-brand-primary)'
                      : '1px solid var(--color-border)',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: 'var(--color-foreground)',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{getAssignedButtonLabel()}</span>
                <ChevronDown
                  size={14}
                  style={{
                    transform: showAssignedDropdown ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.15s ease',
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    backgroundColor: 'var(--r8-brand-primary)',
                    color: '#FFFFFF',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 5px rgba(14, 165, 233, 0.4)',
                  }}
                >
                  {currentAssignedBadgeCount}
                </span>
              </button>

              {/* Popover Dropdown for Assigned Staff Filter */}
              {showAssignedDropdown && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '260px',
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-xl)',
                    padding: '8px',
                    zIndex: 70,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div
                    style={{
                      padding: '6px 10px 8px 10px',
                      borderBottom: '1px solid var(--color-border)',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      color: 'var(--color-muted-foreground)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>Filter By Staff</span>
                    {assignedFilter !== 'all' && (
                      <button
                        type="button"
                        onClick={() => {
                          setAssignedFilter('all');
                          setShowAssignedDropdown(false);
                          if (addToast) addToast('Filter cleared: Showing all orders', 'info');
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--r8-brand-primary)',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          padding: 0,
                        }}
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  {staffMembers.map((staff) => {
                    const isSelected = assignedFilter === staff.id;
                    return (
                      <button
                        key={staff.id}
                        type="button"
                        onClick={() => {
                          setAssignedFilter(staff.id);
                          setShowAssignedDropdown(false);
                          if (addToast) {
                            addToast(
                              staff.id === 'all'
                                ? 'Showing all active orders'
                                : `Filtering orders for ${staff.label}`,
                              'info'
                            );
                          }
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: isSelected ? 'var(--color-muted)' : 'transparent',
                          color: 'var(--color-foreground)',
                          fontSize: '0.82rem',
                          fontWeight: isSelected ? 800 : 500,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--color-muted)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              backgroundColor: isSelected ? 'var(--r8-brand-primary)' : 'var(--color-muted)',
                              color: isSelected ? '#FFFFFF' : 'var(--color-muted-foreground)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                            }}
                          >
                            {staff.id === 'all' ? '✦' : staff.id === 'unassigned' ? '?' : staff.label.charAt(0)}
                          </div>
                          <span>{staff.label}</span>
                        </div>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '2px 7px',
                            borderRadius: '10px',
                            backgroundColor:
                              staff.count > 0
                                ? isSelected
                                  ? 'var(--r8-brand-primary)'
                                  : 'var(--color-muted)'
                                : 'transparent',
                            color:
                              staff.count > 0
                                ? isSelected
                                  ? '#FFFFFF'
                                  : 'var(--color-foreground)'
                                : 'var(--color-muted-foreground)',
                          }}
                        >
                          {staff.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setDraftTable(null);
                setActiveTab('pos');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                borderRadius: '8px',
                backgroundColor: 'var(--r8-brand-primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '0.86rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(14, 165, 233, 0.35)',
              }}
            >
              <Plus size={16} /> Add New Order <span style={{ opacity: 0.8, fontSize: '0.75rem' }}>[N]</span>
            </button>

            <button
              onClick={() => setActiveTab('pos')}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-muted)',
                color: 'var(--color-foreground)',
                border: '1px solid var(--color-border)',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              POS Mode
            </button>

            <button
              onClick={() => setActiveTab('kds')}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-muted)',
                color: 'var(--color-foreground)',
                border: '1px solid var(--color-border)',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              KDS Mode
            </button>
          </div>
        )}
      </div>

      {/* VIEW 1: ORDERS TAB (Screenshot 4) */}
      {hubTab === 'orders' && (
        <div>
          {/* Sub-bar Filter Chips: All | Dine In | Takeaway | Delivery */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: '6px', maxWidth: '100%', WebkitOverflowScrolling: 'touch' }}>
            {[
              { id: 'all', label: 'All Orders', count: activeOrders.length, icon: null },
              {
                id: 'dine-in',
                label: 'Dine In',
                count: activeOrders.filter((o) => o.orderType === 'dine-in').length,
                icon: <Utensils size={14} />,
              },
              {
                id: 'takeaway',
                label: 'Takeaway',
                count: activeOrders.filter((o) => o.orderType === 'takeaway').length,
                icon: <ShoppingBag size={14} />,
              },
              {
                id: 'delivery',
                label: 'Delivery',
                count: activeOrders.filter((o) => o.orderType === 'delivery').length,
                icon: null,
              },
            ].map((typeTab) => {
              const isSelected = orderTypeFilter === typeTab.id;
              return (
                <button
                  key={typeTab.id}
                  type="button"
                  onClick={() => setOrderTypeFilter(typeTab.id as any)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    backgroundColor: isSelected ? 'var(--color-muted)' : 'var(--color-card)',
                    border: isSelected ? '1px solid var(--r8-brand-primary)' : '1px solid var(--color-border)',
                    color: isSelected ? 'var(--color-foreground)' : 'var(--color-muted-foreground)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {typeTab.icon &&
                    React.cloneElement(typeTab.icon, {
                      color: isSelected ? 'var(--r8-brand-primary)' : 'var(--color-muted-foreground)',
                    })}
                  <span>{typeTab.label}</span>
                  <span
                    style={{
                      backgroundColor: isSelected ? 'var(--r8-brand-primary)' : 'var(--color-muted)',
                      color: isSelected ? '#FFFFFF' : 'var(--color-foreground)',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                    }}
                  >
                    {typeTab.count}
                  </span>
                </button>
              );
            })}

            {(assignedFilter !== 'all' || searchQuery.trim() || orderTypeFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setAssignedFilter('all');
                  setOrderTypeFilter('all');
                  setSearchQuery('');
                  if (addToast) addToast('All order filters reset', 'info');
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: 'var(--r8-brand-primary)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginLeft: 'auto',
                }}
              >
                <RotateCcw size={12} /> Clear Filters
              </button>
            )}
          </div>

          {/* Orders Grouped by Table/Cabin */}
          {displayOrders.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                backgroundColor: 'var(--color-card)',
                borderRadius: '16px',
                border: '1px solid var(--color-border)',
              }}
            >
              <ShoppingBag size={48} color="var(--color-muted-foreground)" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '16px' }}>
                {activeOrders.length === 0
                  ? 'No active orders right now'
                  : 'No orders match your filter criteria'}
              </h3>
              <p
                style={{
                  fontSize: '0.86rem',
                  color: 'var(--color-muted-foreground)',
                  maxWidth: '450px',
                  margin: '8px auto 0 auto',
                }}
              >
                {activeOrders.length === 0
                  ? 'Click "+ Add New Order" to start a new ticket or select an open table.'
                  : `Filter active: ${
                      assignedFilter !== 'all' ? `Assigned to ${assignedFilter}` : ''
                    } ${orderTypeFilter !== 'all' ? `(${orderTypeFilter})` : ''} ${
                      searchQuery ? `matching "${searchQuery}"` : ''
                    }`}
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  justifyContent: 'center',
                  marginTop: '16px',
                }}
              >
                {activeOrders.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setAssignedFilter('all');
                      setOrderTypeFilter('all');
                      setSearchQuery('');
                      if (addToast) addToast('Filters cleared', 'info');
                    }}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--color-muted)',
                      color: 'var(--color-foreground)',
                      border: '1px solid var(--color-border)',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                    }}
                  >
                    Clear Filters
                  </button>
                )}
                <button onClick={() => setActiveTab('pos')} className="btn-primary">
                  Open POS Terminal
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {displayOrders.map((order) => {
                const tableInfo = tables.find((t) => t.id === order.tableId);
                const hasThakali = order.items.some((it) => it.menuItemId.includes('thak'));

                return (
                  <div key={order.id}>
                    {/* Section Heading: Table Label */}
                    <h3
                      style={{
                        fontSize: '1.15rem',
                        fontWeight: 900,
                        marginBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      {tableInfo?.label || `Order #${order.orderNumber}`}
                    </h3>

                    {/* Order Ticket Card (Screenshot 4) */}
                    <div
                      className="order-ticket-card"
                      style={{
                        width: '100%',
                        maxWidth: '380px',
                        backgroundColor: 'var(--color-card)',
                        borderRadius: '12px',
                        border: '1px solid var(--color-border)',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                      }}
                    >
                      <div style={{ padding: '16px 18px' }}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '14px',
                          }}
                        >
                          <span style={{ fontSize: '0.84rem', fontWeight: 700 }}>
                            {order.orderType === 'dine-in' ? 'Dine In' : order.orderType}
                          </span>
                          <span
                            style={{
                              fontSize: '0.78rem',
                              color: '#10B981',
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <Clock size={12} /> 6 hrs ago
                          </span>
                        </div>

                        {/* Items Bullet List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {order.items.map((it) => (
                            <div
                              key={it.id}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontSize: '0.86rem',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: '#F59E0B', fontSize: '1.1rem' }}>&bull;</span>
                                <span style={{ fontWeight: 600 }}>{it.name}</span>
                              </div>
                              <span
                                style={{
                                  fontSize: '0.84rem',
                                  fontWeight: 700,
                                  color: 'var(--color-foreground)',
                                }}
                              >
                                {it.quantity}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Free Thakali Refill trigger if table ordered Thakali */}
                        {hasThakali && order.tableId && (
                          <button
                            onClick={() => addThakaliRefill(order.tableId!)}
                            style={{
                              marginTop: '12px',
                              width: '100%',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              border: '1px solid #10B981',
                              backgroundColor: 'rgba(16, 185, 129, 0.08)',
                              color: '#10B981',
                              fontSize: '0.76rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                            }}
                          >
                            <Sparkles size={13} /> + Refill Thakali (दाल-भात)
                          </button>
                        )}
                      </div>

                      {/* Card Bottom Bar: Item Count & Total Rs (Screenshot 4) */}
                      <div
                        style={{
                          backgroundColor: 'var(--color-muted)',
                          padding: '10px 18px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderTop: '1px solid var(--color-border)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}>
                          <span>🍲</span>
                          <strong>{order.items.reduce((sum, it) => sum + it.quantity, 0)}</strong>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <strong style={{ fontSize: '0.96rem', fontWeight: 900 }}>
                            {formatNPR(order.total)}
                          </strong>
                          <button
                            onClick={() => setViewingKOTOrder(order)}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '6px',
                              backgroundColor: '#0F172A',
                              color: '#FFFFFF',
                              border: 'none',
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            KOT
                          </button>
                          <button
                            onClick={() => setSettlingOrder(order)}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '6px',
                              backgroundColor: 'var(--r8-brand-primary)',
                              color: '#FFFFFF',
                              border: 'none',
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                            }}
                          >
                            Settle
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: TABLE TAB (Screenshot 5) */}
      {hubTab === 'table' && (
        <div>
          {/* Sub-bar: Category filter pills & Reservations button */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setSelectedZone('all')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: selectedZone === 'all' ? '#10B981' : 'var(--color-card)',
                  color: selectedZone === 'all' ? '#FFFFFF' : 'var(--color-foreground)',
                  boxShadow: selectedZone === 'all' ? '0 2px 6px rgba(16, 185, 129, 0.3)' : 'none',
                }}
              >
                All <span style={{ opacity: 0.85, fontSize: '0.75rem' }}>{tables.length}</span>
              </button>

              <button
                onClick={() => setSelectedZone('cabin')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: selectedZone === 'cabin' ? '#10B981' : 'var(--color-card)',
                  color: selectedZone === 'cabin' ? '#FFFFFF' : 'var(--color-foreground)',
                }}
              >
                Cabin (केबिन) <span style={{ opacity: 0.85, fontSize: '0.75rem' }}>{tables.filter((t) => t.zone === 'cabin').length}</span>
              </button>

              <button
                onClick={() => setSelectedZone('rooftop')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: selectedZone === 'rooftop' ? '#10B981' : 'var(--color-card)',
                  color: selectedZone === 'rooftop' ? '#FFFFFF' : 'var(--color-foreground)',
                }}
              >
                Rooftop <span style={{ opacity: 0.85, fontSize: '0.75rem' }}>{tables.filter((t) => t.zone === 'rooftop').length}</span>
              </button>

              <button
                onClick={() => setSelectedZone('main')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: selectedZone === 'main' ? '#10B981' : 'var(--color-card)',
                  color: selectedZone === 'main' ? '#FFFFFF' : 'var(--color-foreground)',
                }}
              >
                Main Hall <span style={{ opacity: 0.85, fontSize: '0.75rem' }}>{tables.filter((t) => t.zone === 'main').length}</span>
              </button>
            </div>

            <button
              onClick={() => setActiveTab('reservations')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-card)',
                color: 'var(--color-foreground)',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Calendar size={14} color="var(--r8-brand-primary)" /> Reservations
            </button>
          </div>

          {/* Section Heading */}
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '16px' }}>
            {selectedZone === 'all' ? 'All Tables' : `${selectedZone.toUpperCase()} Tables`}
          </h3>

          {/* Table Cards Grid (Screenshot 5) */}
          <div
            className="tables-grid-responsive"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '14px',
            }}
          >
            {filteredTables.map((table) => {
              const isOccupied = table.status === 'occupied';
              const isOpen = table.status === 'available';

              return (
                <div
                  key={table.id}
                  onClick={() => {
                    if (isOpen) {
                      setSeatingTable(table);
                    } else if (table.currentOrderId) {
                      const ord = orders.find((o) => o.id === table.currentOrderId);
                      if (ord) setSettlingOrder(ord);
                    }
                  }}
                  style={{
                    backgroundColor: isOccupied ? 'rgba(16, 185, 129, 0.15)' : 'var(--color-card)',
                    border: isOccupied ? '1.5px solid #10B981' : '1px solid var(--color-border)',
                    borderRadius: '12px',
                    padding: '16px',
                    minHeight: '110px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {isOccupied && (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          color: '#10B981',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                        }}
                      >
                        <Clock size={11} /> 6h 2m
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 4px 0' }}>
                      {table.label}
                    </h4>
                    <span
                      style={{
                        fontSize: '0.76rem',
                        color: isOccupied ? '#10B981' : 'var(--color-muted-foreground)',
                        fontWeight: 600,
                        textTransform: 'capitalize',
                      }}
                    >
                      {isOccupied ? 'Occupied' : 'Open'}
                    </span>
                  </div>

                  {isOccupied && table.totalAmount && (
                    <div
                      style={{
                        marginTop: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        color: 'var(--color-foreground)',
                        borderTop: '1px solid rgba(16, 185, 129, 0.2)',
                        paddingTop: '6px',
                      }}
                    >
                      {formatNPR(table.totalAmount)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: KOT TAB (Screenshot 1) */}
      {hubTab === 'kot' && (
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <h2
              style={{
                fontSize: '1.15rem',
                fontWeight: 800,
                margin: 0,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {showCompletedKOTs ? 'Completed KOTs' : 'Pending Orders'}
            </h2>
            <span
              style={{
                fontSize: '0.80rem',
                fontWeight: 700,
                color: 'var(--color-muted-foreground)',
                backgroundColor: 'var(--color-card)',
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid var(--color-border)',
              }}
            >
              {kotOrders.length} {kotOrders.length === 1 ? 'ticket' : 'tickets'}
            </span>
          </div>

          {kotOrders.length === 0 ? (
            <div
              style={{
                padding: '50px 24px',
                textAlign: 'center',
                backgroundColor: 'var(--color-card)',
                borderRadius: '12px',
                border: '1px dashed var(--color-border)',
                color: 'var(--color-muted-foreground)',
                maxWidth: '600px',
                margin: '20px auto',
              }}
            >
              <Utensils size={40} style={{ margin: '0 auto 12px auto', opacity: 0.4 }} />
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
                No {showCompletedKOTs ? 'Completed' : 'Pending'} Kitchen Tickets
              </div>
              <p style={{ fontSize: '0.82rem', margin: '6px 0 0 0' }}>
                {showCompletedKOTs
                  ? 'Orders marked as Completed or Settled will be archived here.'
                  : 'Orders created from POS or Table Dining will appear here for preparation.'}
              </p>
            </div>
          ) : (
            <div
              className="kot-grid-responsive"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                gap: '24px',
              }}
            >
              {kotOrders.map((order, orderIdx) => {
                const tableInfo = tables.find((t) => t.id === order.tableId);
                const totalQty = order.items.reduce((sum, it) => sum + it.quantity, 0);

                const getStatusColor = (status: string) => {
                  switch (status) {
                    case 'ready':
                      return '#10B981';
                    case 'served':
                      return '#8B5CF6';
                    case 'completed':
                      return '#059669';
                    case 'cancelled':
                      return '#EF4444';
                    default:
                      return '#F59E0B';
                  }
                };

                const getStatusLabel = (status: string) => {
                  switch (status) {
                    case 'preparing':
                    case 'new':
                      return 'Pending';
                    case 'ready':
                      return 'Ready';
                    case 'served':
                      return 'Served';
                    case 'completed':
                      return 'Completed';
                    case 'cancelled':
                      return 'Cancelled';
                    default:
                      return status;
                  }
                };

                return (
                  <div
                    key={order.id}
                    style={{
                      backgroundColor: 'var(--color-card)',
                      borderRadius: '12px',
                      border: '1px solid var(--color-border)',
                      padding: '24px 28px',
                      boxShadow: 'var(--shadow-sm)',
                      maxWidth: '400px',
                      width: '100%',
                      fontFamily: "'Plus Jakarta Sans', monospace, sans-serif",
                    }}
                  >
                    {/* Card Header (Screenshot 1) */}
                    <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                      <h3 style={{ fontSize: '1.35rem', fontWeight: 900, margin: '0 0 4px 0' }}>
                        KOT {orderIdx + 1}
                      </h3>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                        Table: {tableInfo?.label || `Table #${order.tableNumber || 1}`}
                      </div>
                    </div>

                    {/* Metadata block (Screenshot 1) */}
                    <div
                      style={{
                        fontSize: '0.84rem',
                        lineHeight: '1.6',
                        color: 'var(--color-foreground)',
                        marginBottom: '12px',
                      }}
                    >
                      <div>Type: {order.orderType === 'dine-in' ? 'Dine In' : order.orderType}</div>
                      <div>Order By: {order.serverName || 'Kirtiman Tamang'}</div>
                      <div>
                        Order At: {order.dateBS}{' '}
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>

                    {/* Dotted separator line */}
                    <div
                      style={{
                        borderBottom: '1px dashed var(--color-border)',
                        margin: '10px 0',
                      }}
                    />

                    {/* Table header row */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        color: 'var(--color-muted-foreground)',
                        padding: '4px 0',
                      }}
                    >
                      <span>S.N Dishes</span>
                      <span>QTY</span>
                    </div>

                    {/* Dotted separator line */}
                    <div
                      style={{
                        borderBottom: '1px dashed var(--color-border)',
                        margin: '6px 0 10px 0',
                      }}
                    />

                    {/* Dishes items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {order.items.map((it, itemIdx) => (
                        <div
                          key={it.id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '0.86rem',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            <span>
                              {itemIdx + 1}.&nbsp;&nbsp;{it.name}
                            </span>
                            {isSplitByType && it.station && (
                              <span
                                style={{
                                  fontSize: '0.66rem',
                                  fontWeight: 800,
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                  backgroundColor:
                                    it.station === 'bar'
                                      ? 'rgba(59, 130, 246, 0.15)'
                                      : it.station === 'coffee'
                                      ? 'rgba(245, 158, 11, 0.15)'
                                      : it.station === 'momo'
                                      ? 'rgba(16, 185, 129, 0.15)'
                                      : 'rgba(239, 68, 68, 0.15)',
                                  color:
                                    it.station === 'bar'
                                      ? '#3B82F6'
                                      : it.station === 'coffee'
                                      ? '#F59E0B'
                                      : it.station === 'momo'
                                      ? '#10B981'
                                      : '#EF4444',
                                  textTransform: 'uppercase',
                                }}
                              >
                                {it.station}
                              </span>
                            )}
                          </div>
                          <span style={{ fontWeight: 800 }}>{it.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Dotted separator line */}
                    <div
                      style={{
                        borderBottom: '1px dashed var(--color-border)',
                        margin: '12px 0',
                      }}
                    />

                    {/* Total line */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.86rem',
                        fontWeight: 800,
                      }}
                    >
                      <span>Total (Dishes/QTY)</span>
                      <span>
                        {order.items.length}/{totalQty}
                      </span>
                    </div>

                    {/* Thank you! */}
                    <div
                      style={{
                        textAlign: 'center',
                        fontSize: '0.86rem',
                        fontWeight: 700,
                        color: 'var(--color-muted-foreground)',
                        margin: '20px 0 16px 0',
                      }}
                    >
                      Thank You!
                    </div>

                    {/* Bottom action buttons (Screenshot 1 & 2) */}
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      {/* Interactive Status Selector Dropdown */}
                      <div style={{ position: 'relative', flex: 1 }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenPrintDropdownId(null);
                            setOpenStatusDropdownId(
                              openStatusDropdownId === order.id ? null : order.id
                            );
                          }}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid var(--color-border)',
                            backgroundColor: 'var(--color-card-elevated)',
                            fontSize: '0.84rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            color: 'var(--color-foreground)',
                            transition: 'border-color 0.15s ease',
                          }}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span
                              style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: getStatusColor(order.status),
                              }}
                            />
                            <span>{getStatusLabel(order.status)}</span>
                          </span>
                          <ChevronDown size={14} />
                        </button>

                        {/* Status Options Menu */}
                        {openStatusDropdownId === order.id && (
                          <div
                            style={{
                              position: 'absolute',
                              bottom: '100%',
                              left: 0,
                              marginBottom: '6px',
                              width: '175px',
                              backgroundColor: 'var(--color-card)',
                              border: '1px solid var(--color-border)',
                              borderRadius: '10px',
                              boxShadow: 'var(--shadow-xl)',
                              padding: '6px',
                              zIndex: 60,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '3px',
                            }}
                          >
                            {[
                              { value: 'preparing' as const, label: 'Pending', color: '#F59E0B' },
                              { value: 'ready' as const, label: 'Ready', color: '#10B981' },
                              { value: 'served' as const, label: 'Served', color: '#8B5CF6' },
                              { value: 'completed' as const, label: 'Completed', color: '#059669' },
                              { value: 'cancelled' as const, label: 'Cancelled', color: '#EF4444' },
                            ].map((st) => (
                              <button
                                key={st.value}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateOrderStatus(order.id, st.value);
                                  setOpenStatusDropdownId(null);
                                }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  width: '100%',
                                  padding: '8px 10px',
                                  borderRadius: '6px',
                                  border: 'none',
                                  backgroundColor:
                                    order.status === st.value
                                      ? 'var(--color-muted)'
                                      : 'transparent',
                                  color: 'var(--color-foreground)',
                                  fontSize: '0.82rem',
                                  fontWeight: order.status === st.value ? 800 : 500,
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                }}
                              >
                                <span
                                  style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    backgroundColor: st.color,
                                  }}
                                />
                                <span>{st.label}</span>
                                {order.status === st.value && (
                                  <CheckCircle2
                                    size={13}
                                    style={{ marginLeft: 'auto', color: st.color }}
                                  />
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Interactive Print Dropdown */}
                      <div style={{ position: 'relative', flex: 1 }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenStatusDropdownId(null);
                            setOpenPrintDropdownId(
                              openPrintDropdownId === order.id ? null : order.id
                            );
                          }}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid var(--color-border)',
                            backgroundColor: 'var(--color-card-elevated)',
                            fontSize: '0.84rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            color: 'var(--color-foreground)',
                          }}
                        >
                          <Printer size={15} /> Print
                          <ChevronDown size={14} />
                        </button>

                        {openPrintDropdownId === order.id && (
                          <div
                            style={{
                              position: 'absolute',
                              bottom: '100%',
                              right: 0,
                              marginBottom: '6px',
                              width: '205px',
                              backgroundColor: 'var(--color-card)',
                              border: '1px solid var(--color-border)',
                              borderRadius: '10px',
                              boxShadow: 'var(--shadow-xl)',
                              padding: '6px',
                              zIndex: 60,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '3px',
                            }}
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenPrintDropdownId(null);
                                handlePrintKOT(order, orderIdx);
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                width: '100%',
                                padding: '8px 10px',
                                borderRadius: '6px',
                                border: 'none',
                                background: 'transparent',
                                color: 'var(--color-foreground)',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                textAlign: 'left',
                              }}
                            >
                              <Printer size={15} style={{ color: 'var(--r8-brand-primary)' }} />
                              <span>Thermal Print (80mm)</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenPrintDropdownId(null);
                                setViewingKOTOrder(order);
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                width: '100%',
                                padding: '8px 10px',
                                borderRadius: '6px',
                                border: 'none',
                                background: 'transparent',
                                color: 'var(--color-foreground)',
                                fontSize: '0.82rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                textAlign: 'left',
                              }}
                            >
                              <Receipt size={15} />
                              <span>Preview Slip Modal</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Seating Modal */}
      {seatingTable && (
        <SeatTableModal
          table={seatingTable}
          onClose={() => setSeatingTable(null)}
          onOrderNow={() => {
            setDraftTable(seatingTable.id);
            setActiveTab('pos');
            setSeatingTable(null);
          }}
        />
      )}

      {/* Settle Bill Modal */}
      {settlingOrder && (
        <PaymentModal
          order={settlingOrder}
          onClose={() => setSettlingOrder(null)}
          onReceiptView={(ord) => {
            setReceiptOrder(ord);
            setSettlingOrder(null);
          }}
        />
      )}

      {/* IRD Receipt Modal */}
      {receiptOrder && (
        <ReceiptModal
          order={receiptOrder}
          onClose={() => setReceiptOrder(null)}
        />
      )}

      {/* Direct Thermal KOT Modal */}
      <KOTModal
        isOpen={Boolean(viewingKOTOrder)}
        onClose={() => setViewingKOTOrder(null)}
        order={viewingKOTOrder}
      />

    </div>
  );
};
