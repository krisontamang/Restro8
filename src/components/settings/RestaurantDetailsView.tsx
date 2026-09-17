import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import {
  RotateCcw,
  MapPin,
  Calendar,
  ChevronRight,
  Trash2,
  UserCheck,
  Check,
  ChevronDown,
} from 'lucide-react';

export const RestaurantDetailsView: React.FC = () => {
  const { settings, addToast, resetDemoData } = useRestaurant();

  // Basic Details State
  const [restaurantName, setRestaurantName] = useState(settings.name || 'Your restaurant');
  const [restaurantPhone, setRestaurantPhone] = useState(settings.phone || '');
  const [subdomain, setSubdomain] = useState('');
  const [email, setEmail] = useState('');
  const [priceField] = useState('NPR');
  const [address, setAddress] = useState(settings.address || '');
  const [timeZone, setTimeZone] = useState('Kathmandu - Asia/Kathmandu');
  const [openingDate, setOpeningDate] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // Social Profile State
  const [facebookLink, setFacebookLink] = useState('');
  const [instagramLink, setInstagramLink] = useState('');
  const [tiktokLink, setTiktokLink] = useState('');
  const [googleReviewLink, setGoogleReviewLink] = useState('');

  // Counters State matching Screenshot 3
  const [counters, setCounters] = useState([
    { id: 'orders', label: 'Orders', code: 'ORD-1' },
    { id: 'kot', label: 'Kitchen Orders Ticket', code: 'KOT-1' },
    { id: 'inv', label: 'Invoices', code: 'INV-0' },
    { id: 'pi', label: 'Payment In', code: 'PI-0' },
    { id: 'po', label: 'Payment Out', code: 'PO-0' },
    { id: 'inc', label: 'Income', code: 'IN-0' },
    { id: 'exp', label: 'Expenses', code: 'EXP-0' },
    { id: 'bt', label: 'Balance Transfers', code: 'BT-0' },
    { id: 'pb', label: 'Purchases', code: 'PB-0' },
    { id: 'dn', label: 'Purchase Returns', code: 'DN-0' },
    { id: 'cn', label: 'Sales Returns', code: 'CN-0' },
    { id: 'sp', label: 'Stock Production', code: 'SP-0' },
    { id: 'msa', label: 'Manual Stock Adjustments', code: 'MSA-0' },
    { id: 'adj', label: 'Adjustments', code: 'MSA-0' },
    { id: 'jv', label: 'Journal Vouchers', code: 'JV-0' },
  ]);

  const restaurantTypesList = [
    'FastFood',
    'Resort',
    'Hotel',
    'Bakery',
    'Cloud Kitchen',
    'Bar',
    'Cafe',
    'Restaurant',
  ];

  const toggleType = (t: string) => {
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
  };

  const handleResetCounters = () => {
    if (window.confirm('Reset all restaurant counter prefixes back to initial state?')) {
      setCounters((prev) =>
        prev.map((c) => ({
          ...c,
          code: c.code.split('-')[0] + '-0',
        }))
      );
      addToast('Counters Reset', 'All restaurant counter numbers have been reset.', 'info');
    }
  };

  return (
    <div className="restaurant-details-page" style={{ padding: '24px', backgroundColor: 'var(--color-background)', overflowY: 'auto', height: '100%', boxSizing: 'border-box' }}>
      {/* Page Title */}
      <h1
        style={{
          fontSize: '1.45rem',
          fontWeight: 700,
          margin: '0 0 20px 0',
          color: 'var(--color-foreground)',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        Restaurant Details
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1100px' }}>
        {/* Card 1: Restaurant Basic Details matching Screenshot 2 */}
        <div
          className="restaurant-details-card"
          style={{
            backgroundColor: 'var(--color-card)',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '18px' }}>
            Restaurant Basic Details
          </div>

          {/* Profile Image Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '10px',
                backgroundColor: '#EDE9FE',
                color: '#1E1B4B',
                fontSize: '1.4rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                letterSpacing: '1px',
              }}
            >
              {(restaurantName || 'R8').slice(0, 2).toUpperCase()}
            </div>

            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-foreground)' }}>
                Profile Image
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-muted-foreground)', marginBottom: '8px' }}>
                Upload new image to change your restaurant profile.
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  style={{
                    backgroundColor: 'var(--r8-brand-primary)',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 16px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                  onClick={() => addToast('Image Upload', 'Select image to update profile.', 'info')}
                >
                  Upload
                </button>
                <button
                  type="button"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--color-foreground)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '6px',
                    padding: '6px 16px',
                    fontSize: '0.82rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                  onClick={() => addToast('Profile Reset', 'Reset to initial logo.', 'info')}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Basic Details 2-Column Grid matching Screenshot 2 */}
          <div
            className="restaurant-details-form-grid"
            style={{
              marginBottom: '24px',
            }}
          >
            {/* Restaurant Name * */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
                Restaurant Name <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-foreground)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Restaurant Number * with Nepal flag */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
                Restaurant Number <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div
                style={{
                  display: 'flex',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: 'var(--color-background)',
                }}
              >
                <div
                  style={{
                    padding: '0 10px',
                    backgroundColor: 'var(--color-background)',
                    borderRight: '1px solid var(--color-border)',
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: 'var(--color-foreground)',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: '1rem' }}>🇳🇵</span>
                  <ChevronDown size={13} color="var(--color-muted-foreground)" />
                </div>
                <input
                  type="text"
                  value={restaurantPhone.startsWith('+977') ? restaurantPhone : `+977 ${restaurantPhone}`}
                  onChange={(e) => setRestaurantPhone(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '9px 12px',
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    color: 'var(--color-foreground)',
                    fontSize: '0.85rem',
                  }}
                />
              </div>
            </div>

            {/* Local menu slug. A production host is configured separately. */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
                Menu Slug
              </label>
              <div
                style={{
                  display: 'flex',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: 'var(--color-background)',
                }}
              >
                <input
                  type="text"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '9px 12px',
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    color: 'var(--color-foreground)',
                    fontSize: '0.85rem',
                  }}
                />
                <span
                  style={{
                    padding: '0 12px',
                    backgroundColor: 'var(--color-muted)',
                    borderLeft: '1px solid var(--color-border)',
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'var(--color-muted-foreground)',
                  }}
                >
                  /menu
                </span>
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-foreground)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Country * & Price Field * */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
                  Country <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-background)',
                    fontSize: '0.85rem',
                    color: 'var(--color-foreground)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🇳🇵</span>
                    <span>Nepal</span>
                  </div>
                  <ChevronDown size={14} color="var(--color-muted-foreground)" />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
                  Price Field <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  disabled
                  value={priceField}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-muted)',
                    color: 'var(--color-foreground)',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Address * with map pin */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
                Address <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div
                style={{
                  display: 'flex',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: 'var(--color-background)',
                }}
              >
                <select
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '9px 12px',
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    color: 'var(--color-foreground)',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                    <option value="">Add restaurant address</option>
                    <option value="Bharatpur-10, Chitwan">Bharatpur-10, Chitwan</option>
                    <option value="Thamel, Kathmandu">Thamel, Kathmandu</option>
                </select>
                <button
                  type="button"
                  style={{
                    padding: '0 12px',
                    backgroundColor: 'var(--color-muted)',
                    border: 'none',
                    borderLeft: '1px solid var(--color-border)',
                    cursor: 'pointer',
                    color: 'var(--color-muted-foreground)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <MapPin size={16} />
                </button>
              </div>
            </div>

            {/* Time Zone * */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
                Time Zone <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <select
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-foreground)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              >
                <option value="Kathmandu - Asia/Kathmandu">Kathmandu - Asia/Kathmandu</option>
                <option value="UTC">UTC</option>
              </select>
            </div>

            {/* Opening Date * with calendar icon */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
                Opening Date <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  paddingRight: '12px',
                  backgroundColor: 'var(--color-background)',
                }}
              >
                <input
                  type="date"
                  value={openingDate}
                  onChange={(e) => setOpeningDate(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '9px 12px',
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    color: 'var(--color-foreground)',
                    fontSize: '0.85rem',
                  }}
                />
                <Calendar size={16} color="var(--color-muted-foreground)" />
              </div>
            </div>
          </div>

          {/* Type Pills matching Screenshot 2 */}
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '10px' }}>
              Type
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {restaurantTypesList.map((t) => {
                const isActive = selectedTypes.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleType(t)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: `1px solid ${isActive ? '#FCA5A5' : 'var(--color-border)'}`,
                      backgroundColor: isActive ? '#FEF2F2' : 'var(--color-card)',
                      color: isActive ? 'var(--r8-brand-primary)' : 'var(--color-foreground)',
                      fontSize: '0.82rem',
                      fontWeight: isActive ? 600 : 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    {isActive && <Check size={14} color="var(--r8-brand-primary)" />}
                    <span>{t}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Card 2: Social Profile matching Screenshot 3 */}
        <div
          className="restaurant-details-card"
          style={{
            backgroundColor: 'var(--color-card)',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '16px' }}>
            Social Profile
          </div>

          <div className="restaurant-social-grid">
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
                Facebook Link
              </label>
              <input
                type="text"
                placeholder="Enter restaurant facebook link"
                value={facebookLink}
                onChange={(e) => setFacebookLink(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-foreground)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
                Instagram
              </label>
              <input
                type="text"
                placeholder="Enter restaurant instagram link"
                value={instagramLink}
                onChange={(e) => setInstagramLink(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-foreground)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
                Tiktok
              </label>
              <input
                type="text"
                placeholder="Enter Restaurant tiktok link"
                value={tiktokLink}
                onChange={(e) => setTiktokLink(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-foreground)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
                Google Review Link
              </label>
              <input
                type="text"
                placeholder="Enter Restaurant Google review link"
                value={googleReviewLink}
                onChange={(e) => setGoogleReviewLink(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-foreground)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Restaurant Counter Numbers matching Screenshot 3 */}
        <div
          className="restaurant-details-card"
          style={{
            backgroundColor: 'var(--color-card)',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
              Restaurant Counter Numbers
            </div>
            <button
              type="button"
              onClick={handleResetCounters}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid var(--r8-brand-primary)',
                backgroundColor: 'transparent',
                color: 'var(--r8-brand-primary)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={14} />
              <span>Reset All Counters</span>
            </button>
          </div>

          {/* 15 Counter Boxes in 4 Columns matching Screenshot 3 */}
          <div className="restaurant-counters-grid">
            {counters.map((c) => (
              <div
                key={c.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-background)',
                }}
              >
                <span style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)', fontWeight: 500 }}>
                  {c.label}
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                  {c.code}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 4: Dangerous Area matching Screenshot 3 */}
        <div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '12px' }}>
            Dangerous Area
          </div>

          <div className="restaurant-danger-grid">
            {/* Reset Restaurant */}
            <div
              onClick={() => {
                if (window.confirm('Reset RESTRO8 Nepal demo data to original state?')) {
                  resetDemoData();
                }
              }}
              style={{
                backgroundColor: 'var(--color-card)',
                borderRadius: '10px',
                border: '1px solid var(--color-border)',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'border-color 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <RotateCcw size={20} color="var(--color-foreground)" />
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                    Reset Restaurant
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--color-muted-foreground)' }}>
                    Reset data you want to start as new
                  </div>
                </div>
              </div>
              <ChevronRight size={18} color="var(--color-muted-foreground)" />
            </div>

            {/* Transfer Ownership */}
            <div
              onClick={() => addToast('Ownership', 'Transfer ownership workflow ready.', 'info')}
              style={{
                backgroundColor: 'var(--color-card)',
                borderRadius: '10px',
                border: '1px solid var(--color-border)',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <UserCheck size={20} color="var(--color-foreground)" />
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                    Transfer Ownership
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--color-muted-foreground)' }}>
                    Transfer your ownership to other individuals
                  </div>
                </div>
              </div>
              <ChevronRight size={18} color="var(--color-muted-foreground)" />
            </div>

            {/* Delete Restaurant in red border */}
            <div
              onClick={() => {
                if (window.confirm('WARNING: Are you sure you want to delete this restaurant? This cannot be undone.')) {
                  resetDemoData();
                }
              }}
              style={{
                backgroundColor: 'var(--color-card)',
                borderRadius: '10px',
                border: '1px solid #EF4444',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Trash2 size={20} color="#EF4444" />
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#EF4444' }}>
                    Delete Restaurant
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#EF4444', opacity: 0.85 }}>
                    Complete restaurant will be deleted
                  </div>
                </div>
              </div>
              <ChevronRight size={18} color="#EF4444" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
