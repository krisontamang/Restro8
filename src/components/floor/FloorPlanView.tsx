import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Table, DiningZone, TableStatus, Order } from '../../types/restaurant';
import { formatNPR } from '../../utils/nepalDate';
import { SeatTableModal } from '../modals/SeatTableModal';
import { PaymentModal } from '../modals/PaymentModal';
import { ReceiptModal } from '../modals/ReceiptModal';
import { TableTransferModal } from '../modals/TableTransferModal';
import {
  MetricCard,
  TableStatusBadge,
  Button,
  SearchInput,
  PriceDisplay,
  Badge,
} from '../ui';
import {
  Users,
  Clock,
  DollarSign,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  Calendar,
  Layers,
  RotateCcw,
  ArrowRightLeft,
} from 'lucide-react';

export const FloorPlanView: React.FC = () => {
  const {
    tables,
    orders,
    cleanTable,
    setActiveTab,
    setDraftTable,
    addThakaliRefill,
  } = useRestaurant();

  const [selectedZone, setSelectedZone] = useState<DiningZone | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<TableStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [seatingTable, setSeatingTable] = useState<Table | null>(null);
  const [payingOrder, setPayingOrder] = useState<Order | null>(null);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [transferringTable, setTransferringTable] = useState<Table | null>(null);

  // Filter tables
  const filteredTables = tables.filter((t) => {
    if (selectedZone !== 'all' && t.zone !== selectedZone) return false;
    if (selectedStatus !== 'all' && t.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.label.toLowerCase().includes(q) ||
        (t.serverName && t.serverName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Analytics on Floor
  const totalSeats = tables.reduce((acc, t) => acc + t.seats, 0);
  const occupiedTables = tables.filter((t) => t.status === 'occupied');
  const activeCovers = occupiedTables.reduce((acc, t) => acc + (t.guestCount || 0), 0);
  const totalUnsettledBill = occupiedTables.reduce((acc, t) => acc + (t.totalAmount || 0), 0);
  const occupancyRate = Math.round((occupiedTables.length / (tables.length || 1)) * 100);

  const zones: { id: DiningZone | 'all'; label: string }[] = [
    { id: 'all', label: 'All Zones' },
    { id: 'rooftop', label: 'Rooftop Terrace' },
    { id: 'cabin', label: 'Private Cabin (केबिन)' },
    { id: 'main', label: 'Main Dining Hall' },
    { id: 'garden', label: 'Garden Patio' },
    { id: 'bar', label: 'Bar & Counter' },
  ];

  const getElapsedMinutes = (timeIso?: string) => {
    if (!timeIso) return 0;
    const diffMs = Date.now() - new Date(timeIso).getTime();
    return Math.floor(diffMs / 60000);
  };

  const handleOpenOrder = (table: Table) => {
    setDraftTable(table.id);
    setActiveTab('pos');
  };

  const handleSettleBillClick = (table: Table) => {
    if (table.currentOrderId) {
      const order = orders.find((o) => o.id === table.currentOrderId);
      if (order) {
        setPayingOrder(order);
        return;
      }
    }
    const fallbackOrder = orders.find(
      (o) => o.tableId === table.id && o.paymentStatus === 'unpaid'
    );
    if (fallbackOrder) {
      setPayingOrder(fallbackOrder);
    }
  };

  return (
    <div
      style={{
        padding: 'var(--r8-page-padding, var(--r8-space-4))',
        maxWidth: '1500px',
        margin: '0 auto',
        boxSizing: 'border-box',
        width: '100%',
      }}
    >
      {/* Floor Header & KPI Stats Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
          gap: 'var(--r8-space-4)',
          marginBottom: 'var(--r8-space-5)',
        }}
      >
        <MetricCard
          label="Table Occupancy"
          value={`${occupiedTables.length}/${tables.length}`}
          subtext={`${occupancyRate}% Floor Capacity`}
          icon={<Layers size={20} />}
          variant="primary"
        />

        <MetricCard
          label="Active Covers"
          value={`${activeCovers} Guests`}
          subtext={`of ${totalSeats} Total Seats`}
          icon={<Users size={20} />}
          variant="success"
        />

        <MetricCard
          label="Open Floor Tabs"
          value={formatNPR(totalUnsettledBill)}
          subtext={`${occupiedTables.length} Unsettled Tables`}
          icon={<DollarSign size={20} />}
          variant="warning"
        />
      </div>

      {/* Filter and Zone Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--r8-space-3)',
          marginBottom: 'var(--r8-space-4)',
        }}
      >
        {/* Nepal Zone Pills */}
        <div
          style={{
            display: 'flex',
            gap: 'var(--r8-space-2)',
            flexWrap: 'wrap',
          }}
        >
          {zones.map((z) => {
            const isSelected = selectedZone === z.id;
            return (
              <button
                key={z.id}
                type="button"
                onClick={() => setSelectedZone(z.id)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 'var(--r8-radius-md)',
                  fontSize: '0.82rem',
                  fontWeight: isSelected ? 800 : 500,
                  backgroundColor: isSelected
                    ? 'var(--r8-brand-primary)'
                    : 'var(--r8-bg-surface)',
                  color: isSelected ? '#FFFFFF' : 'var(--r8-text-secondary)',
                  border: '1px solid var(--r8-border-subtle)',
                  cursor: 'pointer',
                  transition: 'all var(--r8-transition-fast)',
                }}
              >
                {z.label}
              </button>
            );
          })}
        </div>

        {/* Search & Status Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--r8-space-2)' }}>
          <div style={{ width: '220px' }}>
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search table, cabin..."
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as TableStatus | 'all')}
            style={{
              padding: '7px 12px',
              borderRadius: 'var(--r8-radius-md)',
              border: '1px solid var(--r8-border-subtle)',
              backgroundColor: 'var(--r8-bg-surface)',
              color: 'var(--r8-text-primary)',
              fontSize: '0.82rem',
              fontWeight: 600,
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="reserved">Reserved</option>
            <option value="dirty">Needs Cleaning</option>
          </select>
        </div>
      </div>

      {/* Tables Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
          gap: 'var(--r8-space-4)',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {filteredTables.map((table) => {
          const isOccupied = table.status === 'occupied';
          const isDirty = table.status === 'dirty';
          const isAvailable = table.status === 'available';
          const isReserved = table.status === 'reserved';
          const elapsedMin = getElapsedMinutes(table.seatedTime);

          return (
            <div
              key={table.id}
              style={{
                backgroundColor: 'var(--r8-bg-surface)',
                borderRadius: 'var(--r8-radius-lg)',
                padding: 'var(--r8-space-4)',
                border: isOccupied
                  ? '1.5px solid var(--r8-brand-primary)'
                  : isDirty
                  ? '1.5px solid var(--r8-brand-accent)'
                  : '1px solid var(--r8-border-subtle)',
                boxShadow: isOccupied ? 'var(--r8-shadow-md)' : 'var(--r8-shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '230px',
                position: 'relative',
                boxSizing: 'border-box',
              }}
            >
              {/* Table Top Info */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 'var(--r8-space-2)',
                  }}
                >
                  <div>
                    <h2
                      style={{
                        fontSize: '1.2rem',
                        fontWeight: 900,
                        color: 'var(--r8-text-primary)',
                        margin: 0,
                      }}
                    >
                      {table.label}
                    </h2>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        color: 'var(--r8-text-muted)',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                      }}
                    >
                      {table.zone.toUpperCase()} &bull; {table.seats} Seats Max
                    </span>
                  </div>
                  <TableStatusBadge status={table.status} />
                </div>

                {/* Table Body Content */}
                {isOccupied && (
                  <div
                    style={{
                      backgroundColor: 'var(--r8-bg-surface-elevated)',
                      borderRadius: 'var(--r8-radius-md)',
                      padding: 'var(--r8-space-3)',
                      marginTop: '6px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      border: '1px solid var(--r8-border-subtle)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--r8-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Users size={13} /> Party:
                      </span>
                      <strong style={{ fontWeight: 700, color: 'var(--r8-text-primary)' }}>
                        {table.guestCount || 2} Guests
                      </strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--r8-text-muted)' }}>Captain:</span>
                      <span style={{ color: 'var(--r8-text-secondary)' }}>{table.serverName || 'Staff Lead'}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--r8-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={13} /> Seated:
                      </span>
                      <span style={{ fontWeight: 600, color: 'var(--r8-text-secondary)' }}>
                        {elapsedMin} mins ago
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.86rem',
                        borderTop: '1px dashed var(--r8-border-subtle)',
                        paddingTop: '6px',
                        marginTop: '4px',
                      }}
                    >
                      <span style={{ fontWeight: 700, color: 'var(--r8-text-primary)' }}>Running Tab:</span>
                      <PriceDisplay amount={table.totalAmount || 0} size="sm" />
                    </div>
                  </div>
                )}

                {isReserved && (
                  <div
                    style={{
                      backgroundColor: 'rgba(99, 102, 241, 0.08)',
                      borderRadius: 'var(--r8-radius-md)',
                      padding: 'var(--r8-space-3)',
                      marginTop: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--r8-space-2)',
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                    }}
                  >
                    <Calendar size={18} color="#6366F1" />
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--r8-text-primary)' }}>
                        Reserved Tonight
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--r8-text-muted)' }}>
                        Party of {table.guestCount || table.seats} guests
                      </div>
                    </div>
                  </div>
                )}

                {isDirty && (
                  <div
                    style={{
                      backgroundColor: 'rgba(245, 158, 11, 0.08)',
                      borderRadius: 'var(--r8-radius-md)',
                      padding: 'var(--r8-space-3)',
                      marginTop: '8px',
                      textAlign: 'center',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                    }}
                  >
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--r8-brand-accent)' }}>
                      Table Dirty &bull; Awaiting Bussing
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--r8-text-muted)', marginTop: '2px' }}>
                      Sanitize & reset for next party
                    </div>
                  </div>
                )}

                {isAvailable && (
                  <div
                    style={{
                      border: '1px dashed var(--r8-border-subtle)',
                      borderRadius: 'var(--r8-radius-md)',
                      padding: 'var(--r8-space-3)',
                      marginTop: '8px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '0.82rem', color: 'var(--r8-text-muted)' }}>
                      Available for Guests
                    </div>
                    <div style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--r8-brand-emerald)', marginTop: '2px' }}>
                      Accommodates up to {table.seats} guests
                    </div>
                  </div>
                )}
              </div>

              {/* Table Action Buttons */}
              <div style={{ marginTop: 'var(--r8-space-3)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {isOccupied && (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => addThakaliRefill(table.id)}
                      style={{
                        padding: '6px 10px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        color: 'var(--r8-brand-emerald)',
                        borderColor: 'rgba(16, 185, 129, 0.3)',
                        backgroundColor: 'rgba(16, 185, 129, 0.08)',
                        borderRadius: 'var(--r8-radius-sm)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                      title="Send complimentary Daal & Bhaat refill KOT"
                    >
                      <RotateCcw size={12} />
                      <span>+Refill</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTransferringTable(table)}
                      style={{
                        padding: '6px 8px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        color: 'var(--r8-brand-primary)',
                        borderColor: 'rgba(14, 165, 233, 0.3)',
                        backgroundColor: 'rgba(14, 165, 233, 0.08)',
                        borderRadius: 'var(--r8-radius-sm)',
                        border: '1px solid rgba(14, 165, 233, 0.3)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                      title="Transfer party/order to another table"
                    >
                      <ArrowRightLeft size={12} />
                      <span>Transfer</span>
                    </button>

                    <Button
                      variant="secondary"
                      onClick={() => handleOpenOrder(table)}
                      style={{ flex: 1, padding: '6px 10px', fontSize: '0.78rem' }}
                    >
                      <ShoppingBag size={14} style={{ marginRight: '4px' }} />
                      <span>Add Items</span>
                    </Button>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px' }}>
                  {isAvailable && (
                    <>
                      <Button
                        variant="primary"
                        onClick={() => setSeatingTable(table)}
                        style={{ flex: 1, padding: '8px 12px', fontSize: '0.82rem' }}
                      >
                        <Users size={15} style={{ marginRight: '4px' }} />
                        <span>Seat Walk-in</span>
                      </Button>
                      <button
                        type="button"
                        onClick={() => handleOpenOrder(table)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: 'var(--r8-radius-md)',
                          border: '1px solid var(--r8-border-subtle)',
                          backgroundColor: 'var(--r8-bg-surface-elevated)',
                          color: 'var(--r8-text-primary)',
                          cursor: 'pointer',
                        }}
                        title="Direct KOT / POS Order"
                      >
                        <ShoppingBag size={16} />
                      </button>
                    </>
                  )}

                  {isOccupied && (
                    <Button
                      variant="primary"
                      onClick={() => handleSettleBillClick(table)}
                      style={{ flex: 1, padding: '8px 12px', fontSize: '0.82rem' }}
                    >
                      <DollarSign size={15} style={{ marginRight: '4px' }} />
                      <span>Settle Bill (Fonepay/VAT)</span>
                    </Button>
                  )}

                  {isReserved && (
                    <Button
                      variant="primary"
                      onClick={() => setSeatingTable(table)}
                      style={{ flex: 1, padding: '8px 12px', fontSize: '0.82rem' }}
                    >
                      <CheckCircle2 size={15} style={{ marginRight: '4px' }} />
                      <span>Check-in & Seat</span>
                    </Button>
                  )}

                  {isDirty && (
                    <Button
                      variant="success"
                      onClick={() => cleanTable(table.id)}
                      style={{ flex: 1, padding: '8px 12px', fontSize: '0.82rem' }}
                    >
                      <Sparkles size={15} style={{ marginRight: '4px' }} />
                      <span>Sanitize & Clean</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Seating Modal */}
      {seatingTable && (
        <SeatTableModal table={seatingTable} onClose={() => setSeatingTable(null)} />
      )}

      {/* Payment Modal */}
      {payingOrder && (
        <PaymentModal
          order={payingOrder}
          onClose={() => setPayingOrder(null)}
          onReceiptView={(settledOrder) => {
            setPayingOrder(null);
            setReceiptOrder(settledOrder);
          }}
        />
      )}

      {/* Receipt Modal */}
      {receiptOrder && (
        <ReceiptModal order={receiptOrder} onClose={() => setReceiptOrder(null)} />
      )}

      {/* Table Transfer Modal */}
      {transferringTable && (
        <TableTransferModal
          fromTable={transferringTable}
          onClose={() => setTransferringTable(null)}
        />
      )}
    </div>
  );
};
