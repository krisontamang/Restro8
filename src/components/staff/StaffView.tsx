import React, { useState, useEffect, useRef } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { StaffMember } from '../../types/restaurant';
import {
  Search,
  Plus,
  MoreHorizontal,
  X,
  ChevronDown,
  ArrowDown,
  ArrowUp,
  User,
  Users,
  ShieldCheck,
  Check,
  Edit2,
  Trash2,
  Phone,
  Mail,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

/**
 * Fanned document sheets empty state graphic
 * Perfectly matching RestroX empty state in Screenshots 3 & 4
 */
const FannedDocumentsEmptyState: React.FC<{ onInvite: () => void }> = ({ onInvite }) => {
  return (
    <div
      style={{
        padding: '50px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      {/* Graphic circle with 3 fanned sheets */}
      <div
        style={{
          width: '110px',
          height: '110px',
          borderRadius: '50%',
          backgroundColor: '#F3F4F6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '18px',
          position: 'relative',
        }}
      >
        <svg
          width="74"
          height="74"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left Sheet - Green, rotated -18deg */}
          <g transform="translate(14, 18) rotate(-18)">
            <rect
              x="0"
              y="0"
              width="26"
              height="36"
              rx="4"
              fill="#10B981"
            />
            {/* Sheet lines */}
            <rect x="5" y="8" width="16" height="2.5" rx="1" fill="#FFFFFF" fillOpacity="0.85" />
            <rect x="5" y="14" width="12" height="2.5" rx="1" fill="#FFFFFF" fillOpacity="0.75" />
            <rect x="5" y="20" width="14" height="2.5" rx="1" fill="#FFFFFF" fillOpacity="0.75" />
          </g>

          {/* Right Sheet - Purple, rotated +18deg */}
          <g transform="translate(42, 10) rotate(18)">
            <rect
              x="0"
              y="0"
              width="26"
              height="36"
              rx="4"
              fill="#8B5CF6"
            />
            {/* Sheet lines */}
            <rect x="5" y="8" width="16" height="2.5" rx="1" fill="#FFFFFF" fillOpacity="0.85" />
            <rect x="5" y="14" width="14" height="2.5" rx="1" fill="#FFFFFF" fillOpacity="0.75" />
            <rect x="5" y="20" width="10" height="2.5" rx="1" fill="#FFFFFF" fillOpacity="0.75" />
          </g>

          {/* Center Sheet - Vibrant Blue, upright */}
          <g transform="translate(26, 14)">
            <rect
              x="0"
              y="0"
              width="28"
              height="38"
              rx="4"
              fill="#2563EB"
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.12))"
            />
            {/* 3 clean white stripes matching RestroX doc icon */}
            <rect x="6" y="9" width="16" height="3" rx="1.5" fill="#FFFFFF" />
            <rect x="6" y="16" width="16" height="3" rx="1.5" fill="#FFFFFF" />
            <rect x="6" y="23" width="11" height="3" rx="1.5" fill="#FFFFFF" />
          </g>
        </svg>
      </div>

      {/* Heading */}
      <h3
        style={{
          fontSize: '1.15rem',
          fontWeight: 700,
          color: 'var(--color-foreground)',
          margin: '0 0 6px 0',
          letterSpacing: '-0.01em',
        }}
      >
        No Staff found
      </h3>

      {/* Subtext */}
      <p
        style={{
          fontSize: '0.88rem',
          color: 'var(--color-muted-foreground)',
          margin: '0 0 20px 0',
          fontWeight: 400,
        }}
      >
        Invite new staff to your team
      </p>

      {/* Red Invite Staff Button */}
      <button
        type="button"
        onClick={onInvite}
        style={{
          backgroundColor: 'var(--r8-brand-primary)',
          color: '#FFF',
          border: 'none',
          borderRadius: '6px',
          padding: '8px 22px',
          fontSize: '0.84rem',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 1px 2px rgba(14, 165, 233, 0.2)',
          transition: 'background-color 0.15s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#C70812')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--r8-brand-primary)')}
      >
        <Plus size={15} />
        <span>Invite Staff</span>
      </button>
    </div>
  );
};

export const StaffView: React.FC = () => {
  const { staff, addStaff, updateStaff, removeStaff, addToast } = useRestaurant();

  const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'removed'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showInviteMenuDropdown, setShowInviteMenuDropdown] = useState(false);
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
  const [rowActionMenuId, setRowActionMenuId] = useState<string | null>(null);

  // Invite Staff Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  const [formName, setFormName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<StaffMember['role']>('Manager');
  const [formPosition, setFormPosition] = useState<StaffMember['position']>('Manager');
  const [formStatus, setFormStatus] = useState<'active' | 'pending'>('active');

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Hotkey [N] to open Invite Staff modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)
      ) {
        return;
      }
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        openInviteModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openInviteModal = () => {
    setEditingStaff(null);
    setFormName('');
    setFormUsername('');
    setFormPhone('');
    setFormEmail('');
    setFormRole('Manager');
    setFormPosition('Manager');
    setFormStatus(activeTab === 'pending' ? 'pending' : 'active');
    setIsModalOpen(true);
    setShowInviteMenuDropdown(false);
  };

  const openEditModal = (member: StaffMember) => {
    setEditingStaff(member);
    setFormName(member.name);
    setFormUsername(member.username);
    setFormPhone(member.phone.replace('+977', '').trim());
    setFormEmail(member.email || '');
    setFormRole(member.role);
    setFormPosition(member.position);
    setFormStatus(member.status === 'pending' ? 'pending' : 'active');
    setIsModalOpen(true);
    setRowActionMenuId(null);
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      addToast('Validation Error', 'Please enter staff member name', 'warning');
      return;
    }

    const cleanedPhone = formPhone.trim()
      ? formPhone.startsWith('+977')
        ? formPhone.trim()
        : `+977 ${formPhone.trim()}`
      : '+977 -';

    const generatedUsername = formUsername.trim()
      ? formUsername.startsWith('@')
        ? formUsername.trim()
        : `@${formUsername.trim()}`
      : `@${formName.toLowerCase().replace(/\s+/g, '')}`;

    if (editingStaff) {
      updateStaff(editingStaff.id, {
        name: formName.trim(),
        username: generatedUsername,
        phone: cleanedPhone,
        email: formEmail.trim() || undefined,
        role: formRole,
        position: formPosition,
        status: formStatus,
      });
    } else {
      addStaff({
        name: formName.trim(),
        username: generatedUsername,
        phone: cleanedPhone,
        email: formEmail.trim() || undefined,
        role: formRole,
        position: formPosition,
        status: formStatus,
        dueAmount: 0,
      });
    }

    setIsModalOpen(false);
  };

  // Filter staff by active sub-tab and search query
  const filteredStaff = staff.filter((s) => {
    const matchesTab = s.status === activeTab;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      s.name.toLowerCase().includes(query) ||
      s.username.toLowerCase().includes(query) ||
      s.phone.toLowerCase().includes(query) ||
      s.role.toLowerCase().includes(query) ||
      s.position.toLowerCase().includes(query);

    return matchesTab && matchesQuery;
  });

  const activeStaffCount = staff.filter((s) => s.status === 'active').length;

  const toggleSelectAll = () => {
    if (selectedStaffIds.length === filteredStaff.length) {
      setSelectedStaffIds([]);
    } else {
      setSelectedStaffIds(filteredStaff.map((s) => s.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedStaffIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--color-background)',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Top Header matching Screenshots 2, 3, 4 */}
      <div
        style={{
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--color-card)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '1.45rem',
              fontWeight: 700,
              margin: '0 0 10px 0',
              color: 'var(--color-foreground)',
              letterSpacing: '-0.02em',
            }}
          >
            Staff
          </h1>

          {/* Sub-tabs: Active, Pending, Removed */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              onClick={() => {
                setActiveTab('active');
                setSelectedStaffIds([]);
              }}
              style={{
                padding: '6px 18px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeTab === 'active' ? 'var(--r8-brand-primary)' : 'var(--color-muted)',
                color: activeTab === 'active' ? '#FFF' : 'var(--color-foreground)',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('pending');
                setSelectedStaffIds([]);
              }}
              style={{
                padding: '6px 18px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeTab === 'pending' ? 'var(--r8-brand-primary)' : 'var(--color-muted)',
                color: activeTab === 'pending' ? '#FFF' : 'var(--color-foreground)',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Pending
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('removed');
                setSelectedStaffIds([]);
              }}
              style={{
                padding: '6px 18px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeTab === 'removed' ? 'var(--r8-brand-primary)' : 'var(--color-muted)',
                color: activeTab === 'removed' ? '#FFF' : 'var(--color-foreground)',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Removed
            </button>
          </div>
        </div>

        {/* Right Toolbar: Search, + Invite Staff [N] v, ... matching Screenshots 2, 3, 4 */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Search Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--color-background)',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              padding: '6px 12px',
              gap: '6px',
            }}
          >
            <Search size={14} color="var(--color-muted-foreground)" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: '0.82rem',
                color: 'var(--color-foreground)',
                width: '120px',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <X size={13} color="var(--color-muted-foreground)" />
              </button>
            )}
          </div>

          {/* + Invite Staff [N] v Split Button */}
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <button
              type="button"
              onClick={openInviteModal}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--r8-brand-primary)',
                color: '#FFF',
                border: 'none',
                borderRadius: '6px 0 0 6px',
                padding: '7px 14px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#C70812')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--r8-brand-primary)')}
            >
              <Plus size={15} />
              <span>Invite Staff</span>
              <span
                style={{
                  border: '1px solid rgba(255,255,255,0.4)',
                  borderRadius: '4px',
                  padding: '0 4px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                }}
              >
                N
              </span>
            </button>
            <button
              type="button"
              onClick={() => setShowInviteMenuDropdown(!showInviteMenuDropdown)}
              style={{
                backgroundColor: 'var(--r8-brand-primary)',
                color: '#FFF',
                border: 'none',
                borderLeft: '1px solid rgba(255,255,255,0.25)',
                borderRadius: '0 6px 6px 0',
                padding: '7px 8px',
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#C70812')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--r8-brand-primary)')}
            >
              <ChevronDown size={14} />
            </button>

            {/* Invite dropdown menu */}
            {showInviteMenuDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '4px',
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  zIndex: 20,
                  minWidth: '180px',
                  overflow: 'hidden',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setFormStatus('active');
                    openInviteModal();
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 14px',
                    border: 'none',
                    background: 'none',
                    fontSize: '0.82rem',
                    color: 'var(--color-foreground)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-muted)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <Plus size={14} />
                  <span>Invite Active Staff</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormStatus('pending');
                    openInviteModal();
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 14px',
                    border: 'none',
                    background: 'none',
                    fontSize: '0.82rem',
                    color: 'var(--color-foreground)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-muted)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <Mail size={14} />
                  <span>Invite as Pending</span>
                </button>
              </div>
            )}
          </div>

          {/* ... More Options Button matching Screenshots */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              style={{
                backgroundColor: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                borderRadius: '6px',
                padding: '6px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--color-foreground)',
              }}
            >
              <MoreHorizontal size={15} />
            </button>

            {showMoreMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '4px',
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  zIndex: 20,
                  minWidth: '160px',
                  overflow: 'hidden',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    addToast('Export', 'Exporting staff roster to Excel/CSV.', 'info');
                    setShowMoreMenu(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 14px',
                    border: 'none',
                    background: 'none',
                    fontSize: '0.82rem',
                    color: 'var(--color-foreground)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-muted)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  Export to CSV
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addToast('Staff Refresh', 'Staff list synchronized.', 'success');
                    setShowMoreMenu(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 14px',
                    border: 'none',
                    background: 'none',
                    fontSize: '0.82rem',
                    color: 'var(--color-foreground)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-muted)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  Refresh List
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto' }}>
        {/* 4 Summary KPI Cards ONLY ON ACTIVE TAB matching Screenshot 2 */}
        {activeTab === 'active' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
              marginBottom: '20px',
            }}
          >
            {/* Card 1: To Receive (green down arrow) */}
            <div
              style={{
                backgroundColor: 'var(--color-card)',
                borderRadius: '12px',
                padding: '16px 18px',
                border: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-muted-foreground)' }}>
                  To Receive
                </span>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#059669',
                  }}
                >
                  <ArrowDown size={16} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-foreground)', fontFamily: 'Inter, sans-serif' }}>
                  Rs. 0
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-muted-foreground)', marginTop: '4px' }}>
                  Staff advances
                </div>
              </div>
            </div>

            {/* Card 2: To Pay (red up arrow) */}
            <div
              style={{
                backgroundColor: 'var(--color-card)',
                borderRadius: '12px',
                padding: '16px 18px',
                border: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-muted-foreground)' }}>
                  To Pay
                </span>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#DC2626',
                  }}
                >
                  <ArrowUp size={16} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-foreground)', fontFamily: 'Inter, sans-serif' }}>
                  Rs. 0
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-muted-foreground)', marginTop: '4px' }}>
                  Salary & payouts
                </div>
              </div>
            </div>

            {/* Card 3: Net To Receive (green down arrow) */}
            <div
              style={{
                backgroundColor: 'var(--color-card)',
                borderRadius: '12px',
                padding: '16px 18px',
                border: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-muted-foreground)' }}>
                  Net Position
                </span>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2563EB',
                  }}
                >
                  <ArrowDown size={16} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-foreground)', fontFamily: 'Inter, sans-serif' }}>
                  Rs. 0
                </div>
                <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600, marginTop: '4px' }}>
                  ✓ In balance
                </div>
              </div>
            </div>

            {/* Card 4: Total Staffs (purple user icon) */}
            <div
              style={{
                backgroundColor: 'var(--color-card)',
                borderRadius: '12px',
                padding: '16px 18px',
                border: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-muted-foreground)' }}>
                  Total Staff
                </span>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(124, 58, 237, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#7C3AED',
                  }}
                >
                  <User size={16} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-foreground)', fontFamily: 'Inter, sans-serif' }}>
                  {activeStaffCount}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#7C3AED', fontWeight: 600, marginTop: '4px' }}>
                  Active roster
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data Table Card */}
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            borderRadius: '10px',
            border: '1px solid var(--color-border)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            overflow: 'hidden',
          }}
        >
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <div style={{ minWidth: '780px' }}>
              {/* TAB 1: ACTIVE TAB TABLE HEADERS matching Screenshot 2 */}
              {activeTab === 'active' && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '46px 2.8fr 1.6fr 1.6fr 1.8fr 1.5fr 1.4fr 48px',
                    padding: '12px 18px',
                    columnGap: '12px',
                    backgroundColor: 'var(--color-muted)',
                    borderBottom: '1px solid var(--color-border)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: 'var(--color-foreground)',
                    alignItems: 'center',
                  }}
                >
                  <div>SN</div>
                  <div>User</div>
                  <div>Role</div>
                  <div>Position</div>
                  <div>Phone Number</div>
                  <div>Email</div>
                  <div>Due Amount</div>
                  <div style={{ textAlign: 'right' }}></div>
                </div>
              )}

          {/* TAB 2: PENDING TAB TABLE HEADERS matching Screenshot 3 */}
          {activeTab === 'pending' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '46px 2.2fr 1.6fr 1.4fr 1.8fr 1.8fr 1.4fr',
                padding: '12px 18px',
                backgroundColor: 'var(--color-muted)',
                borderBottom: '1px solid var(--color-border)',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--color-foreground)',
                alignItems: 'center',
              }}
            >
              <div>SN</div>
              <div>Name</div>
              <div>Role</div>
              <div>Status</div>
              <div>Phone Number</div>
              <div>Email</div>
              <div>Expiry</div>
            </div>
          )}

          {/* TAB 3: REMOVED TAB TABLE HEADERS matching Screenshot 4 */}
          {activeTab === 'removed' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '46px 2.5fr 1.4fr 1.8fr 1.8fr 1.5fr',
                padding: '12px 18px',
                backgroundColor: 'var(--color-muted)',
                borderBottom: '1px solid var(--color-border)',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--color-foreground)',
                alignItems: 'center',
              }}
            >
              <div>SN</div>
              <div>Particular</div>
              <div>Type</div>
              <div>Deleted By</div>
              <div>Deleted At</div>
              <div>Countdown</div>
            </div>
          )}

          {/* TABLE BODY CONTENT */}
          {filteredStaff.length === 0 ? (
            /* Authentic Fanned Empty State matching Screenshots 3 & 4 */
            <FannedDocumentsEmptyState onInvite={openInviteModal} />
          ) : (
            filteredStaff.map((member, idx) => {
              const isSelected = selectedStaffIds.includes(member.id);

              if (activeTab === 'active') {
                return (
                  <div
                    key={member.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '46px 2.8fr 1.6fr 1.6fr 1.8fr 1.5fr 1.4fr 48px',
                      padding: '14px 18px',
                      columnGap: '12px',
                      borderBottom: '1px solid var(--color-border)',
                      alignItems: 'center',
                      fontSize: '0.84rem',
                      color: 'var(--color-foreground)',
                      backgroundColor: isSelected ? 'rgba(14, 165, 233, 0.04)' : 'transparent',
                    }}
                  >
                    {/* SN */}
                    <div style={{ color: 'var(--color-foreground)', fontWeight: 500 }}>
                      {idx + 1}
                    </div>

                    {/* User: KT Avatar + Name + Username matching Screenshot 2 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          backgroundColor: '#EDE9FE',
                          color: '#4C1D95',
                          fontWeight: 700,
                          fontSize: '0.86rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {member.name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--color-foreground)' }}>
                          {member.name}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--color-muted-foreground)' }}>
                          {member.username}
                        </div>
                      </div>
                    </div>

                    {/* Role with teal icon matching Screenshot 2 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', minWidth: 0 }}>
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#0D9488"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ flexShrink: 0 }}
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="m4.93 4.93 4.24 4.24" />
                        <path d="m14.83 9.17 4.24-4.24" />
                        <path d="m14.83 14.83 4.24 4.24" />
                        <path d="m9.17 14.83-4.24 4.24" />
                        <circle cx="12" cy="12" r="4" />
                      </svg>
                      <span
                        style={{
                          fontWeight: 600,
                          color: '#0D9488',
                          fontSize: '0.72rem',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {member.role}
                      </span>
                    </div>

                    {/* Position */}
                    <div style={{ fontWeight: 500 }}>{member.position}</div>

                    {/* Phone Number */}
                    <div style={{ fontWeight: 500 }}>{member.phone}</div>

                    {/* Email */}
                    <div style={{ color: 'var(--color-muted-foreground)' }}>
                      {member.email || '–'}
                    </div>

                    {/* Due Amount */}
                    <div style={{ color: 'var(--color-muted-foreground)' }}>–</div>

                    {/* Row Actions ... */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'relative' }}>
                      <button
                        type="button"
                        onClick={() =>
                          setRowActionMenuId(rowActionMenuId === member.id ? null : member.id)
                        }
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--color-muted-foreground)',
                          padding: '4px',
                        }}
                      >
                        <MoreHorizontal size={16} />
                      </button>

                      {/* Row action popup */}
                      {rowActionMenuId === member.id && (
                        <div
                          style={{
                            position: 'absolute',
                            right: 0,
                            top: '100%',
                            backgroundColor: 'var(--color-card)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                            zIndex: 30,
                            minWidth: '140px',
                            overflow: 'hidden',
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => openEditModal(member)}
                            style={{
                              width: '100%',
                              textAlign: 'left',
                              padding: '8px 12px',
                              border: 'none',
                              background: 'none',
                              fontSize: '0.8rem',
                              color: 'var(--color-foreground)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              cursor: 'pointer',
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor = 'var(--color-muted)')
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor = 'transparent')
                            }
                          >
                            <Edit2 size={13} />
                            <span>Edit Staff</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              removeStaff(member.id);
                              setRowActionMenuId(null);
                            }}
                            style={{
                              width: '100%',
                              textAlign: 'left',
                              padding: '8px 12px',
                              border: 'none',
                              background: 'none',
                              fontSize: '0.8rem',
                              color: '#EF4444',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              cursor: 'pointer',
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor = '#FEF2F2')
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor = 'transparent')
                            }
                          >
                            <Trash2 size={13} />
                            <span>Remove Staff</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              if (activeTab === 'pending') {
                return (
                  <div
                    key={member.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '46px 2.2fr 1.6fr 1.4fr 1.8fr 1.8fr 1.4fr',
                      padding: '14px 18px',
                      borderBottom: '1px solid var(--color-border)',
                      alignItems: 'center',
                      fontSize: '0.84rem',
                      color: 'var(--color-foreground)',
                    }}
                  >
                    <div>{idx + 1}</div>
                    <div style={{ fontWeight: 600 }}>{member.name}</div>
                    <div>{member.role}</div>
                    <div>
                      <span
                        style={{
                          backgroundColor: '#FEF3C7',
                          color: '#B45309',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.74rem',
                          fontWeight: 600,
                        }}
                      >
                        Pending
                      </span>
                    </div>
                    <div>{member.phone}</div>
                    <div>{member.email || '–'}</div>
                    <div style={{ color: 'var(--color-muted-foreground)' }}>7 days</div>
                  </div>
                );
              }

              // Removed Tab Rows
              return (
                <div
                  key={member.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '46px 2.5fr 1.4fr 1.8fr 1.8fr 1.5fr',
                    padding: '14px 18px',
                    borderBottom: '1px solid var(--color-border)',
                    alignItems: 'center',
                    fontSize: '0.84rem',
                    color: 'var(--color-foreground)',
                  }}
                >
                  <div>{idx + 1}</div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{member.name}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--color-muted-foreground)' }}>
                      {member.username}
                    </div>
                  </div>
                  <div>Staff</div>
                  <div style={{ fontWeight: 500 }}>Kirtiman Tamang</div>
                  <div style={{ color: 'var(--color-muted-foreground)' }}>
                    {new Date(member.createdAt || Date.now()).toLocaleDateString()}
                  </div>
                  <div style={{ color: '#EF4444', fontWeight: 600 }}>29 days</div>
                </div>
              );
            })
          )}
            </div>
          </div>

          {/* Table Footer matching Screenshots 2, 3, 4 */}
          <div
            style={{
              padding: '12px 18px',
              backgroundColor: 'var(--color-card)',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.78rem',
              color: 'var(--color-muted-foreground)',
            }}
          >
            <div>
              {selectedStaffIds.length} of {filteredStaff.length} row(s) selected.
            </div>
          </div>
        </div>
      </div>

      {/* Invite Staff Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-card)',
              borderRadius: '14px',
              border: '1px solid var(--color-border)',
              boxShadow: '0 20px 45px rgba(0,0,0,0.2)',
              width: '100%',
              maxWidth: '540px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '18px 24px',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--color-foreground)' }}>
                {editingStaff ? 'Edit Staff Member' : 'Invite Staff Member'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted-foreground)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
                    Full Name <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Subash Gurung"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
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
                    Phone Number
                  </label>
                  <div style={{ display: 'flex', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
                    <div
                      style={{
                        padding: '0 10px',
                        backgroundColor: 'var(--color-muted)',
                        borderRight: '1px solid var(--color-border)',
                        fontSize: '0.82rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: 'var(--color-foreground)',
                      }}
                    >
                      <span>🇳🇵</span>
                      <span>+977</span>
                    </div>
                    <input
                      type="text"
                      placeholder="98XXXXXXXX"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '9px 12px',
                        border: 'none',
                        outline: 'none',
                        fontSize: '0.85rem',
                        backgroundColor: 'var(--color-background)',
                        color: 'var(--color-foreground)',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="staff@restaurant.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
                      Role
                    </label>
                    <select
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value as any)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--color-border)',
                        fontSize: '0.85rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                        backgroundColor: 'var(--color-background)',
                        color: 'var(--color-foreground)',
                      }}
                    >
                      <option value="SuperAdmin">SuperAdmin</option>
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Cashier">Cashier</option>
                      <option value="Waiter">Waiter</option>
                      <option value="Chef">Chef</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
                      Position
                    </label>
                    <select
                      value={formPosition}
                      onChange={(e) => setFormPosition(e.target.value as any)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--color-border)',
                        fontSize: '0.85rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                        backgroundColor: 'var(--color-background)',
                        color: 'var(--color-foreground)',
                      }}
                    >
                      <option value="Owner">Owner</option>
                      <option value="Manager">Manager</option>
                      <option value="Head Chef">Head Chef</option>
                      <option value="Captain">Captain</option>
                      <option value="Cashier">Cashier</option>
                      <option value="Barista">Barista</option>
                    </select>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                  marginTop: '24px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--color-border)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'transparent',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: 'var(--color-foreground)',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '9px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'var(--r8-brand-primary)',
                    color: '#FFF',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {editingStaff ? 'Update Staff' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
