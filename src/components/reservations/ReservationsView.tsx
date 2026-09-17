import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Reservation, DiningZone, Table } from '../../types/restaurant';
import {
  CalendarCheck,
  Plus,
  Search,
  Users,
  Clock,
  Crown,
  Phone,
  CheckCircle2,
  XCircle,
  Calendar,
  AlertCircle,
  X,
  ChevronDown,
  FileText,
} from 'lucide-react';

export const ReservationsView: React.FC = () => {
  const {
    reservations,
    tables,
    addReservation,
    seatReservation,
    cancelReservation,
    setActiveTab,
  } = useRestaurant();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTableFilter, setSelectedTableFilter] = useState('all');
  const [selectedMonthFilter, setSelectedMonthFilter] = useState('September');

  // New Reservation Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRes, setNewRes] = useState<{
    customerName: string;
    phone: string;
    email: string;
    partySize: number;
    date: string;
    time: string;
    zonePreference: DiningZone;
    isVip: boolean;
    notes: string;
  }>({
    customerName: '',
    phone: '',
    email: '',
    partySize: 2,
    date: new Date().toISOString().split('T')[0],
    time: '19:30',
    zonePreference: 'main',
    isVip: false,
    notes: '',
  });

  // Filtered reservations
  const filteredReservations = reservations.filter((r) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.customerName.toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q) ||
        (r.notes && r.notes.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRes.customerName.trim()) return;

    addReservation({
      customerName: newRes.customerName,
      phone: newRes.phone || '9841234567',
      email: newRes.email,
      partySize: Number(newRes.partySize),
      date: newRes.date,
      time: newRes.time,
      zonePreference: newRes.zonePreference,
      status: 'confirmed',
      isVip: newRes.isVip,
      notes: newRes.notes,
    });

    setIsModalOpen(false);
    setNewRes({
      customerName: '',
      phone: '',
      email: '',
      partySize: 2,
      date: new Date().toISOString().split('T')[0],
      time: '19:30',
      zonePreference: 'main',
      isVip: false,
      notes: '',
    });
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Top Header & Action Controls (Screenshot 2) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '1.45rem',
              fontWeight: 900,
              margin: '0 0 4px 0',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Reservation Details
          </h1>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-muted-foreground)' }}>
            {filteredReservations.length} Reservations
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Table Filter Dropdown */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <span>Table: All</span>
            <ChevronDown size={14} />
          </div>

          {/* Month Dropdown */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Calendar size={14} color="#10B981" />
            <span>This Month: {selectedMonthFilter}</span>
            <ChevronDown size={14} />
          </div>

          {/* Search Box */}
          <div
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
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.84rem',
                color: 'var(--color-foreground)',
                width: '140px',
              }}
            />
          </div>

          {/* Green + Add Reservation CTA (Screenshot 2) */}
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 18px',
              borderRadius: '8px',
              backgroundColor: '#15803D',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '0.86rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(21, 128, 61, 0.35)',
            }}
          >
            <Plus size={16} /> Add Reservation
          </button>
        </div>
      </div>

      {/* Reservation Details Table Container (Screenshot 2) */}
      <div
        style={{
          backgroundColor: 'var(--color-card)',
          borderRadius: '14px',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.85rem',
              textAlign: 'left',
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: '1.5px solid var(--color-border)',
                  color: 'var(--color-muted-foreground)',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  backgroundColor: 'var(--color-card-elevated)',
                }}
              >
                <th style={{ padding: '14px 18px' }}>SN</th>
                <th style={{ padding: '14px 18px' }}>Tables</th>
                <th style={{ padding: '14px 18px' }}>Customer Name</th>
                <th style={{ padding: '14px 18px' }}>Status</th>
                <th style={{ padding: '14px 18px' }}>Check In</th>
                <th style={{ padding: '14px 18px' }}>Check Out</th>
                <th style={{ padding: '14px 18px' }}>Duration</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.length > 0 ? (
                filteredReservations.map((res, idx) => {
                  const tableObj = tables.find((t) => t.id === res.assignedTableId);
                  return (
                    <tr
                      key={res.id}
                      style={{
                        borderBottom: '1px solid var(--color-border)',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = 'var(--color-muted)')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = 'transparent')
                      }
                    >
                      <td style={{ padding: '14px 18px', fontWeight: 600 }}>{idx + 1}</td>
                      <td style={{ padding: '14px 18px', fontWeight: 700 }}>
                        {tableObj?.label || `${res.zonePreference.toUpperCase()} Table`}
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <div>
                          <strong>{res.customerName}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-foreground)' }}>
                            {res.phone} &bull; {res.partySize} Guests
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            padding: '3px 10px',
                            borderRadius: '12px',
                            backgroundColor:
                              res.status === 'confirmed'
                                ? '#E8F8F0'
                                : res.status === 'seated'
                                ? 'rgba(59, 130, 246, 0.1)'
                                : 'rgba(239, 68, 68, 0.1)',
                            color:
                              res.status === 'confirmed'
                                ? '#10B981'
                                : res.status === 'seated'
                                ? '#3B82F6'
                                : '#EF4444',
                            textTransform: 'uppercase',
                          }}
                        >
                          {res.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 18px' }}>{res.time}</td>
                      <td style={{ padding: '14px 18px', color: 'var(--color-muted-foreground)' }}>
                        -
                      </td>
                      <td style={{ padding: '14px 18px', color: 'var(--color-muted-foreground)' }}>
                        2 Hours
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7}>
                    {/* Authentic Empty State matching Screenshot 2 */}
                    <div
                      style={{
                        padding: '64px 20px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {/* Document icon stack illustration */}
                      <div
                        style={{
                          width: '84px',
                          height: '84px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--color-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '20px',
                        }}
                      >
                        <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                          <div
                            style={{
                              width: '18px',
                              height: '24px',
                              backgroundColor: '#10B981',
                              borderRadius: '3px',
                              transform: 'rotate(-10deg)',
                            }}
                          />
                          <div
                            style={{
                              width: '20px',
                              height: '26px',
                              backgroundColor: '#3B82F6',
                              borderRadius: '3px',
                              zIndex: 1,
                            }}
                          />
                          <div
                            style={{
                              width: '18px',
                              height: '24px',
                              backgroundColor: '#8B5CF6',
                              borderRadius: '3px',
                              transform: 'rotate(10deg)',
                            }}
                          />
                        </div>
                      </div>

                      <h3
                        style={{
                          fontSize: '1.2rem',
                          fontWeight: 800,
                          color: 'var(--color-foreground)',
                          margin: '0 0 6px 0',
                        }}
                      >
                        No active reservation found
                      </h3>
                      <p
                        style={{
                          fontSize: '0.86rem',
                          color: 'var(--color-muted-foreground)',
                          margin: 0,
                        }}
                      >
                        Create reservation to see them here.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Reservation Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '480px', width: '100%', padding: 'clamp(16px, 4vw, 24px)', boxSizing: 'border-box' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
                borderBottom: '1px solid var(--color-border)',
                paddingBottom: '10px',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Create New Reservation</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ padding: '4px', color: 'var(--color-muted-foreground)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateReservation}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    Primary Guest Name
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Subash Shrestha / Binod Chaudhary"
                    value={newRes.customerName}
                    onChange={(e) => setNewRes({ ...newRes, customerName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-card-elevated)',
                      color: 'var(--color-foreground)',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    Phone Number (10-digit)
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="98XXXXXXXX"
                    value={newRes.phone}
                    onChange={(e) => setNewRes({ ...newRes, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-card-elevated)',
                      color: 'var(--color-foreground)',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    Party Size (Guests)
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    max="20"
                    value={newRes.partySize}
                    onChange={(e) => setNewRes({ ...newRes, partySize: parseInt(e.target.value) || 2 })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-card-elevated)',
                      color: 'var(--color-foreground)',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    Date
                  </label>
                  <input
                    required
                    type="date"
                    value={newRes.date}
                    onChange={(e) => setNewRes({ ...newRes, date: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-card-elevated)',
                      color: 'var(--color-foreground)',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    Time Slot
                  </label>
                  <input
                    required
                    type="time"
                    value={newRes.time}
                    onChange={(e) => setNewRes({ ...newRes, time: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-card-elevated)',
                      color: 'var(--color-foreground)',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    Zone Preference
                  </label>
                  <select
                    value={newRes.zonePreference}
                    onChange={(e) => setNewRes({ ...newRes, zonePreference: e.target.value as DiningZone })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-card-elevated)',
                      color: 'var(--color-foreground)',
                      outline: 'none',
                    }}
                  >
                    <option value="main">Main Dining Hall</option>
                    <option value="rooftop">Rooftop Lounge</option>
                    <option value="cabin">Private Cabin (केबिन)</option>
                    <option value="garden">Garden Patio</option>
                    <option value="bar">Bar Counter</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '22px' }}>
                  <input
                    type="checkbox"
                    id="vip-check"
                    checked={newRes.isVip}
                    onChange={(e) => setNewRes({ ...newRes, isVip: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="vip-check" style={{ fontSize: '0.86rem', fontWeight: 700, cursor: 'pointer' }}>
                    Mark as VIP Booking
                  </label>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    Special Dietary / Occasion Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Thakali lunch gathering, Birthday celebration, Rooftop view requested..."
                    value={newRes.notes}
                    onChange={(e) => setNewRes({ ...newRes, notes: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-card-elevated)',
                      color: 'var(--color-foreground)',
                      outline: 'none',
                      resize: 'none',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1.5,
                    backgroundColor: '#15803D',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
