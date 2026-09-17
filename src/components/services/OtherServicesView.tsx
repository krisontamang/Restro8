import React, { useState } from 'react';
import {
  LayoutGrid,
  List,
  ChevronDown,
} from 'lucide-react';

export const OtherServicesView: React.FC = () => {
  const [dishView, setDishView] = useState<'grid' | 'list'>('grid');

  // Take Away states
  const [takeAwayStatus, setTakeAwayStatus] = useState(true);
  const [takeAwayMenuSet, setTakeAwayMenuSet] = useState('Default Menuset');

  // Pick Up states
  const [pickUpStatus, setPickUpStatus] = useState(true);
  const [pickUpMenuSet, setPickUpMenuSet] = useState('Default Menuset');

  // Reservation states (Screenshot 3)
  const [resStatus, setResStatus] = useState(true);
  const [resMenuSet, setResMenuSet] = useState('Default Menuset');
  const [resStartHour, setResStartHour] = useState('12');
  const [resStartMinute, setResStartMinute] = useState('00');
  const [resStartAmpm, setResStartAmpm] = useState('AM');
  const [resEndHour, setResEndHour] = useState('11');
  const [resEndMinute, setResEndMinute] = useState('59');
  const [resEndAmpm, setResEndAmpm] = useState('PM');

  const renderToggle = (checked: boolean, onToggle: () => void) => (
    <button
      onClick={onToggle}
      style={{
        width: '42px',
        height: '24px',
        borderRadius: '24px',
        backgroundColor: checked ? '#10B981' : '#E5E7EB',
        position: 'relative',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        padding: 0,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          position: 'absolute',
          top: '3px',
          left: checked ? '21px' : '3px',
          transition: 'left 0.2s',
          boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
        }}
      />
    </button>
  );

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Title */}
      <h1
        style={{
          fontSize: '1.45rem',
          fontWeight: 900,
          margin: '0 0 24px 0',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          color: 'var(--color-foreground)',
        }}
      >
        Other Services
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Card 1: Digital Menu Layout matching Screenshot 2 */}
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            padding: '20px 24px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h2
            style={{
              fontSize: '1rem',
              fontWeight: 800,
              color: 'var(--color-foreground)',
              margin: '0 0 16px 0',
            }}
          >
            Digital Menu Layout
          </h2>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                Dish View
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)', marginTop: '2px' }}>
                Set default dish view, grid or list.
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                overflow: 'hidden',
              }}
            >
              <button
                onClick={() => setDishView('grid')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  border: 'none',
                  backgroundColor: dishView === 'grid' ? 'var(--r8-brand-primary)' : 'transparent',
                  color: dishView === 'grid' ? '#FFFFFF' : 'var(--color-foreground)',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <LayoutGrid size={15} /> Grid
              </button>
              <button
                onClick={() => setDishView('list')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  border: 'none',
                  backgroundColor: dishView === 'list' ? 'var(--r8-brand-primary)' : 'transparent',
                  color: dishView === 'list' ? '#FFFFFF' : 'var(--color-foreground)',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <List size={15} /> List
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Take Away matching Screenshot 2 */}
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            padding: '20px 24px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h2
            style={{
              fontSize: '1rem',
              fontWeight: 800,
              color: 'var(--color-foreground)',
              margin: '0 0 16px 0',
            }}
          >
            Take Away
          </h2>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                Status
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)', marginTop: '2px' }}>
                Allow customers to place takwaway orders.
              </div>
            </div>
            {renderToggle(takeAwayStatus, () => setTakeAwayStatus(!takeAwayStatus))}
          </div>

          <div>
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '8px' }}>
              Active Menu Set
            </div>
            <div style={{ position: 'relative' }}>
              <select
                value={takeAwayMenuSet}
                onChange={(e) => setTakeAwayMenuSet(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-foreground)',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  appearance: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="Default Menuset">Default Menuset</option>
                <option value="Special Takeaway Menu">Special Takeaway Menu</option>
              </select>
              <ChevronDown
                size={16}
                color="var(--color-muted-foreground)"
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Pick Up matching Screenshot 2 */}
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            padding: '20px 24px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h2
            style={{
              fontSize: '1rem',
              fontWeight: 800,
              color: 'var(--color-foreground)',
              margin: '0 0 16px 0',
            }}
          >
            Pick Up
          </h2>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                Status
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)', marginTop: '2px' }}>
                Allow customers to place pickup orders.
              </div>
            </div>
            {renderToggle(pickUpStatus, () => setPickUpStatus(!pickUpStatus))}
          </div>

          <div>
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '8px' }}>
              Active Menu Set
            </div>
            <div style={{ position: 'relative' }}>
              <select
                value={pickUpMenuSet}
                onChange={(e) => setPickUpMenuSet(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-foreground)',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  appearance: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="Default Menuset">Default Menuset</option>
                <option value="Curbside Express Menu">Curbside Express Menu</option>
              </select>
              <ChevronDown
                size={16}
                color="var(--color-muted-foreground)"
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
              />
            </div>
          </div>
        </div>

        {/* Card 4: Reservation matching Screenshot 3 */}
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            padding: '20px 24px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h2
            style={{
              fontSize: '1rem',
              fontWeight: 800,
              color: 'var(--color-foreground)',
              margin: '0 0 16px 0',
            }}
          >
            Reservation
          </h2>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                Status
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)', marginTop: '2px' }}>
                Accept reservation requests during the specified hours.
              </div>
            </div>
            {renderToggle(resStatus, () => setResStatus(!resStatus))}
          </div>

          <div style={{ marginBottom: '18px' }}>
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '8px' }}>
              Active Menu Set
            </div>
            <div style={{ position: 'relative' }}>
              <select
                value={resMenuSet}
                onChange={(e) => setResMenuSet(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-foreground)',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  appearance: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="Default Menuset">Default Menuset</option>
                <option value="Dine In Premium Menu">Dine In Premium Menu</option>
              </select>
              <ChevronDown
                size={16}
                color="var(--color-muted-foreground)"
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
              />
            </div>
          </div>

          {/* Reservation Time matching Screenshot 3 */}
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '12px' }}>
              Reservation Time
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Start Time */}
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-muted-foreground)', display: 'block', marginBottom: '6px' }}>
                  Start Time
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="text"
                    value={resStartHour}
                    onChange={(e) => setResStartHour(e.target.value)}
                    style={{
                      width: '48px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-background)',
                      color: 'var(--color-foreground)',
                      textAlign: 'center',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                    }}
                  />
                  <span style={{ fontWeight: 800 }}>:</span>
                  <input
                    type="text"
                    value={resStartMinute}
                    onChange={(e) => setResStartMinute(e.target.value)}
                    style={{
                      width: '48px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-background)',
                      color: 'var(--color-foreground)',
                      textAlign: 'center',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                    }}
                  />
                  <div style={{ position: 'relative' }}>
                    <select
                      value={resStartAmpm}
                      onChange={(e) => setResStartAmpm(e.target.value)}
                      style={{
                        padding: '8px 24px 8px 10px',
                        borderRadius: '8px',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-background)',
                        color: 'var(--color-foreground)',
                        fontWeight: 700,
                        fontSize: '0.84rem',
                        appearance: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                    <ChevronDown size={14} style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  </div>
                </div>
              </div>

              {/* End Time */}
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-muted-foreground)', display: 'block', marginBottom: '6px' }}>
                  End Time
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="text"
                    value={resEndHour}
                    onChange={(e) => setResEndHour(e.target.value)}
                    style={{
                      width: '48px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-background)',
                      color: 'var(--color-foreground)',
                      textAlign: 'center',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                    }}
                  />
                  <span style={{ fontWeight: 800 }}>:</span>
                  <input
                    type="text"
                    value={resEndMinute}
                    onChange={(e) => setResEndMinute(e.target.value)}
                    style={{
                      width: '48px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-background)',
                      color: 'var(--color-foreground)',
                      textAlign: 'center',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                    }}
                  />
                  <div style={{ position: 'relative' }}>
                    <select
                      value={resEndAmpm}
                      onChange={(e) => setResEndAmpm(e.target.value)}
                      style={{
                        padding: '8px 24px 8px 10px',
                        borderRadius: '8px',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-background)',
                        color: 'var(--color-foreground)',
                        fontWeight: 700,
                        fontSize: '0.84rem',
                        appearance: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                    <ChevronDown size={14} style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
