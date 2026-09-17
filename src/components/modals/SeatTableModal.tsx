import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Table } from '../../types/restaurant';
import { Users, User, X, Check } from 'lucide-react';

interface SeatTableModalProps {
  table: Table;
  onClose: () => void;
  onOrderNow?: () => void;
}

export const SeatTableModal: React.FC<SeatTableModalProps> = ({
  table,
  onClose,
  onOrderNow,
}) => {
  const { seatTable, setActiveTab, setDraftTable } = useRestaurant();
  const [guestCount, setGuestCount] = useState<number>(Math.min(2, table.seats));
  const [serverName, setServerName] = useState<string>('Bikash Tamang (Captain)');

  const staffMembers = [
    'Bikash Tamang (Captain)',
    'Sujata Shrestha',
    'Rohan Gurung',
    'Prashant Thapa',
    'Anjali Chaudhary',
  ];

  const handleSeatGuests = (proceedToOrder: boolean = false) => {
    seatTable(table.id, guestCount, serverName);
    if (proceedToOrder) {
      setDraftTable(table.id);
      setActiveTab('pos');
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '420px', width: '100%', padding: 'clamp(16px, 4vw, 24px)', boxSizing: 'border-box' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: '12px',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Seat Guests</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)' }}>
              {table.label} ({table.seats} seats max) &bull; {table.zone.toUpperCase()} ZONE
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '6px',
              borderRadius: '8px',
              color: 'var(--color-muted-foreground)',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Guest Count Selector */}
        <div style={{ marginBottom: '20px' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.86rem',
              fontWeight: 700,
              marginBottom: '8px',
            }}
          >
            <Users size={16} /> Party Size (Guests)
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {Array.from({ length: table.seats }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setGuestCount(num)}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  border:
                    guestCount === num
                      ? '2px solid var(--color-primary)'
                      : '1px solid var(--color-border)',
                  backgroundColor:
                    guestCount === num ? 'var(--color-primary)' : 'var(--color-card-elevated)',
                  color: guestCount === num ? '#FFFFFF' : 'var(--color-foreground)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                }}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Assigned Server */}
        <div style={{ marginBottom: '24px' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.86rem',
              fontWeight: 700,
              marginBottom: '8px',
            }}
          >
            <User size={16} /> Assign Server
          </label>
          <select
            value={serverName}
            onChange={(e) => setServerName(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-card-elevated)',
              color: 'var(--color-foreground)',
              fontSize: '0.9rem',
              fontWeight: 600,
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {staffMembers.map((staff) => (
              <option key={staff} value={staff}>
                {staff}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => handleSeatGuests(false)}
            className="btn-secondary"
            style={{ flex: 1 }}
          >
            <Check size={16} /> Seat Table
          </button>
          <button
            onClick={() => handleSeatGuests(true)}
            className="btn-primary"
            style={{ flex: 1.2 }}
          >
            Seat & Take Order &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
