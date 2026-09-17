import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Table, DiningZone } from '../../types/restaurant';
import { Modal, Button, Badge } from '../ui';
import {
  ArrowRight,
  Armchair,
  Users,
  MapPin,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { formatNPR } from '../../utils/nepalDate';

interface TableTransferModalProps {
  fromTable: Table;
  onClose: () => void;
}

export const TableTransferModal: React.FC<TableTransferModalProps> = ({
  fromTable,
  onClose,
}) => {
  const { tables, orders, transferTable } = useRestaurant();
  const [selectedToTableId, setSelectedToTableId] = useState<string>('');
  const [selectedZone, setSelectedZone] = useState<DiningZone | 'all'>('all');

  // Available destination tables (must not be occupied, or must be available)
  const availableTables = tables.filter((t) => {
    if (t.id === fromTable.id) return false;
    if (t.status === 'occupied') return false;
    if (selectedZone !== 'all' && t.zone !== selectedZone) return false;
    return true;
  });

  const activeOrder = orders.find(
    (o) => o.tableId === fromTable.id && o.paymentStatus === 'unpaid'
  );

  const handleTransfer = () => {
    if (!selectedToTableId) return;
    const success = transferTable(fromTable.id, selectedToTableId);
    if (success) {
      onClose();
    }
  };

  const zones: { id: DiningZone | 'all'; label: string }[] = [
    { id: 'all', label: 'All Zones' },
    { id: 'rooftop', label: 'Rooftop' },
    { id: 'cabin', label: 'Cabin' },
    { id: 'main', label: 'Main Hall' },
    { id: 'garden', label: 'Garden' },
    { id: 'bar', label: 'Bar' },
  ];

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Transfer Party • ${fromTable.label}`}
      size="md"
    >
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Origin Table Overview */}
        <div
          style={{
            padding: '14px 16px',
            borderRadius: 'var(--r8-radius-md)',
            backgroundColor: 'var(--r8-bg-surface-elevated)',
            border: '1px solid var(--r8-border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--r8-text-primary)' }}>
                {fromTable.label}
              </span>
              <Badge variant="primary" size="sm">
                Active Party
              </Badge>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--r8-text-muted)', marginTop: '3px' }}>
              {fromTable.guestCount || 2} Guests • Server: {fromTable.serverName || 'Captain'}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--r8-text-muted)' }}>Running Total</div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--r8-text-primary)' }}>
              {formatNPR(fromTable.totalAmount || activeOrder?.total || 0)}
            </div>
          </div>
        </div>

        {/* Zone Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--r8-text-primary)' }}>
            Select Destination Zone:
          </label>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {zones.map((z) => (
              <button
                key={z.id}
                type="button"
                onClick={() => setSelectedZone(z.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: selectedZone === z.id ? '1px solid var(--r8-brand-primary)' : '1px solid var(--r8-border-subtle)',
                  backgroundColor: selectedZone === z.id ? 'rgba(14, 165, 233, 0.12)' : 'var(--r8-bg-surface-elevated)',
                  color: selectedZone === z.id ? 'var(--r8-brand-primary)' : 'var(--r8-text-secondary)',
                  fontSize: '0.78rem',
                  fontWeight: selectedZone === z.id ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                {z.label}
              </button>
            ))}
          </div>
        </div>

        {/* Available Tables Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--r8-text-primary)' }}>
            Choose Target Vacant Table:
          </label>

          {availableTables.length === 0 ? (
            <div
              style={{
                padding: '24px',
                textAlign: 'center',
                backgroundColor: 'var(--r8-bg-surface-elevated)',
                borderRadius: 'var(--r8-radius-md)',
                color: 'var(--r8-text-muted)',
                fontSize: '0.86rem',
              }}
            >
              No vacant tables found in this zone. Please select another zone or clean a dirty table.
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: '10px',
                maxHeight: '240px',
                overflowY: 'auto',
                paddingRight: '4px',
              }}
            >
              {availableTables.map((tbl) => {
                const isSelected = selectedToTableId === tbl.id;
                return (
                  <button
                    key={tbl.id}
                    type="button"
                    onClick={() => setSelectedToTableId(tbl.id)}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--r8-radius-md)',
                      border: isSelected ? '2px solid var(--r8-brand-primary)' : '1px solid var(--r8-border-subtle)',
                      backgroundColor: isSelected ? 'rgba(14, 165, 233, 0.1)' : 'var(--r8-bg-surface-elevated)',
                      color: 'var(--r8-text-primary)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{tbl.label}</span>
                      {isSelected && <CheckCircle2 size={16} style={{ color: 'var(--r8-brand-primary)' }} />}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--r8-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={12} />
                      <span>{tbl.seats} Seats</span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--r8-text-secondary)', textTransform: 'capitalize' }}>
                      {tbl.zone}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
          <Button
            variant="accent"
            style={{ flex: 1 }}
            disabled={!selectedToTableId}
            leftIcon={<ArrowRight size={16} />}
            onClick={handleTransfer}
          >
            Confirm Table Transfer
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
