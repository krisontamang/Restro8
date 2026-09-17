import React, { useState, useEffect, useRef } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Customer } from '../../types/restaurant';
import {
  Search,
  SlidersHorizontal,
  Plus,
  MoreHorizontal,
  X,
  Camera,
  Calendar,
  ChevronDown,
  ChevronUp,
  ArrowDown,
  ArrowUp,
  Headphones,
  Check,
  Edit2,
  Trash2,
  FileSpreadsheet,
  Download,
  Users,
  Receipt,
} from 'lucide-react';

export const CustomersView: React.FC = () => {
  const {
    customers,
    orders,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    loadSampleCustomers,
    clearCustomers,
    addToast,
  } = useRestaurant();

  // Search, Filter & Selection states
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showAddMenuDropdown, setShowAddMenuDropdown] = useState(false);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);

  // Modal State (Add & Edit Customer matching Screenshot 5)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formLoyaltyDiscount, setFormLoyaltyDiscount] = useState('0.00');
  const [formBalanceType, setFormBalanceType] = useState<'collect_dr' | 'pay_cr'>('collect_dr');
  const [formOpeningAmount, setFormOpeningAmount] = useState('0');
  const [formDob, setFormDob] = useState('');
  const [formGroup, setFormGroup] = useState<'VIP' | 'Regular' | 'Corporate' | 'Staff' | 'Family'>('Regular');
  const [formAvatar, setFormAvatar] = useState('');
  const [showAdditionalDetails, setShowAdditionalDetails] = useState(false);
  const [formPan, setFormPan] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Open modal in Add mode
  const openAddModal = () => {
    setEditingCustomer(null);
    setFormName('');
    setFormPhone('');
    setFormEmail('');
    setFormLoyaltyDiscount('0.00');
    setFormBalanceType('collect_dr');
    setFormOpeningAmount('0');
    setFormDob('');
    setFormGroup('Regular');
    setFormAvatar('');
    setFormPan('');
    setFormAddress('');
    setFormNotes('');
    setShowAdditionalDetails(false);
    setIsModalOpen(true);
    setShowAddMenuDropdown(false);
  };

  // Hotkey [N] to open Add Customer modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)
      ) {
        return;
      }
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        openAddModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered customer list
  const filteredCustomers = customers.filter((cust) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      cust.name.toLowerCase().includes(query) ||
      cust.phone.toLowerCase().includes(query) ||
      (cust.email && cust.email.toLowerCase().includes(query)) ||
      (cust.panNumber && cust.panNumber.toLowerCase().includes(query)) ||
      cust.group.toLowerCase().includes(query);

    const matchesGroup =
      selectedGroupFilter === 'all' || cust.group.toLowerCase() === selectedGroupFilter.toLowerCase();

    return matchesSearch && matchesGroup;
  });

  // Calculate 3 KPI Cards matching Screenshot 4
  const toReceiveAmount = customers.reduce((sum, c) => {
    if (c.openingBalanceType === 'collect_dr') {
      return sum + (c.dueAmount || c.openingAmount || 0);
    }
    return sum;
  }, 0);

  const toPayAmount = customers.reduce((sum, c) => {
    if (c.openingBalanceType === 'pay_cr') {
      return sum + (c.dueAmount || c.openingAmount || 0);
    }
    return sum;
  }, 0);

  const netToReceiveAmount = toReceiveAmount - toPayAmount;

  // Level 11 Customer Intelligence & Loyalty calculation
  const getCustomerMetrics = (cust: Customer) => {
    const custOrders = orders.filter((o) => {
      const matchName = o.customerName && o.customerName.toLowerCase().trim() === cust.name.toLowerCase().trim();
      const cleanPhone = cust.phone.replace(/[^0-9]/g, '');
      const matchPhone = o.customerPhone && cleanPhone && o.customerPhone.replace(/[^0-9]/g, '').includes(cleanPhone.slice(-8));
      return matchName || matchPhone;
    });

    const totalSpent = custOrders.reduce(
      (sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0),
      0
    );
    const loyaltyPoints = Math.floor(totalSpent / 100);

    let tier: 'VIP' | 'Gold' | 'Silver' | 'Bronze' = 'Bronze';
    if (cust.group === 'VIP' || totalSpent >= 15000) tier = 'VIP';
    else if (totalSpent >= 8000) tier = 'Gold';
    else if (totalSpent >= 3000) tier = 'Silver';

    return {
      orderCount: custOrders.length,
      totalSpent,
      loyaltyPoints,
      tier,
    };
  };

  // Open modal in Edit mode
  const openEditModal = (cust: Customer) => {
    setEditingCustomer(cust);
    setFormName(cust.name);
    setFormPhone(cust.phone.replace('+977', '').trim());
    setFormEmail(cust.email || '');
    setFormLoyaltyDiscount(String(cust.loyaltyDiscount || '0.00'));
    setFormBalanceType(cust.openingBalanceType);
    setFormOpeningAmount(String(cust.openingAmount || '0'));
    setFormDob(cust.dob || '');
    setFormGroup(cust.group);
    setFormAvatar(cust.avatar || '');
    setFormPan(cust.panNumber || '');
    setFormAddress(cust.address || '');
    setFormNotes(cust.notes || '');
    setShowAdditionalDetails(!!(cust.panNumber || cust.address || cust.notes));
    setIsModalOpen(true);
  };

  // Reset form
  const handleResetForm = () => {
    setFormName('');
    setFormPhone('');
    setFormEmail('');
    setFormLoyaltyDiscount('0.00');
    setFormBalanceType('collect_dr');
    setFormOpeningAmount('0');
    setFormDob('');
    setFormGroup('Regular');
    setFormAvatar('');
    setFormPan('');
    setFormAddress('');
    setFormNotes('');
    setShowAdditionalDetails(false);
  };

  // Save or update customer
  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      addToast('Validation Error', 'Please enter Customer Full Name', 'warning');
      return;
    }

    const cleanedPhone = formPhone.trim()
      ? formPhone.startsWith('+977')
        ? formPhone.trim()
        : `+977 ${formPhone.trim()}`
      : '+977 -';

    const parsedDiscount = parseFloat(formLoyaltyDiscount) || 0;
    const parsedAmount = parseFloat(formOpeningAmount) || 0;

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, {
        name: formName.trim(),
        phone: cleanedPhone,
        email: formEmail.trim() || undefined,
        loyaltyDiscount: parsedDiscount,
        openingBalanceType: formBalanceType,
        openingAmount: parsedAmount,
        dueAmount: parsedAmount,
        dob: formDob.trim() || undefined,
        group: formGroup,
        avatar: formAvatar || undefined,
        panNumber: formPan.trim() || undefined,
        address: formAddress.trim() || undefined,
        notes: formNotes.trim() || undefined,
      });
    } else {
      addCustomer({
        name: formName.trim(),
        phone: cleanedPhone,
        email: formEmail.trim() || undefined,
        loyaltyDiscount: parsedDiscount,
        openingBalanceType: formBalanceType,
        openingAmount: parsedAmount,
        dueAmount: parsedAmount,
        dob: formDob.trim() || undefined,
        group: formGroup,
        avatar: formAvatar || undefined,
        panNumber: formPan.trim() || undefined,
        address: formAddress.trim() || undefined,
        notes: formNotes.trim() || undefined,
      });
    }

    setIsModalOpen(false);
  };

  // Avatar upload simulation
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setFormAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Selection toggle
  const toggleSelectAll = () => {
    if (selectedCustomerIds.length === filteredCustomers.length) {
      setSelectedCustomerIds([]);
    } else {
      setSelectedCustomerIds(filteredCustomers.map((c) => c.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedCustomerIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (
      window.confirm(`Are you sure you want to delete ${selectedCustomerIds.length} customer(s)?`)
    ) {
      selectedCustomerIds.forEach((id) => deleteCustomer(id));
      setSelectedCustomerIds([]);
    }
  };

  // Group colors for tags
  const getGroupBadge = (group: string) => {
    switch (group.toLowerCase()) {
      case 'vip':
        return { bg: '#F3E8FF', text: '#7E22CE', border: '#E9D5FF' };
      case 'corporate':
        return { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A' };
      case 'staff':
        return { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0' };
      case 'family':
        return { bg: '#FDF2F8', text: '#BE185D', border: '#FBCFE8' };
      default:
        return { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--color-background)' }}>
      {/* Top Header matching Screenshot 4 */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1
            style={{
              fontSize: '1.45rem',
              fontWeight: 800,
              margin: 0,
              color: 'var(--color-foreground)',
              letterSpacing: '-0.02em',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Customers
          </h1>
          <span
            style={{
              backgroundColor: 'var(--color-muted)',
              color: 'var(--color-muted-foreground)',
              fontSize: '0.74rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
            }}
          >
            {customers.length} Accounts
          </span>
        </div>

        {/* Right Toolbar: Search, Filter, + Add New [N] v, ... */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', position: 'relative' }}>
          {/* Search Box / Button */}
          {isSearchOpen ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                padding: '4px 10px',
                gap: '6px',
              }}
            >
              <Search size={15} color="var(--color-muted-foreground)" />
              <input
                ref={searchInputRef}
                autoFocus
                type="text"
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '0.85rem',
                  color: 'var(--color-foreground)',
                  width: '170px',
                }}
              />
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchOpen(false);
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <X size={14} color="var(--color-muted-foreground)" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setIsSearchOpen(true);
                setTimeout(() => searchInputRef.current?.focus(), 50);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                padding: '7px 14px',
                fontSize: '0.85rem',
                fontWeight: 500,
                color: 'var(--color-foreground)',
                cursor: 'pointer',
              }}
            >
              <Search size={15} />
              <span>Search</span>
            </button>
          )}

          {/* Filter Button */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: selectedGroupFilter !== 'all' ? '#EFF6FF' : 'var(--color-background)',
                border: `1px solid ${selectedGroupFilter !== 'all' ? '#3B82F6' : 'var(--color-border)'}`,
                borderRadius: '8px',
                padding: '7px 14px',
                fontSize: '0.85rem',
                fontWeight: 500,
                color: selectedGroupFilter !== 'all' ? '#1D4ED8' : 'var(--color-foreground)',
                cursor: 'pointer',
              }}
            >
              <SlidersHorizontal size={15} />
              <span>Filter</span>
              {selectedGroupFilter !== 'all' && (
                <span
                  style={{
                    backgroundColor: '#3B82F6',
                    color: '#FFF',
                    borderRadius: '10px',
                    padding: '1px 6px',
                    fontSize: '0.7rem',
                  }}
                >
                  {selectedGroupFilter}
                </span>
              )}
            </button>

            {/* Filter Dropdown Popover */}
            {showFilterDropdown && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '10px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                  width: '200px',
                  zIndex: 50,
                  padding: '8px',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-muted-foreground)', padding: '4px 8px' }}>
                  FILTER BY GROUP
                </div>
                {['all', 'VIP', 'Regular', 'Corporate', 'Staff', 'Family'].map((grp) => (
                  <button
                    key={grp}
                    onClick={() => {
                      setSelectedGroupFilter(grp);
                      setShowFilterDropdown(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: selectedGroupFilter === grp ? 'var(--color-muted)' : 'transparent',
                      color: 'var(--color-foreground)',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>{grp === 'all' ? 'All Customers' : grp}</span>
                    {selectedGroupFilter === grp && <Check size={14} color="#10B981" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* + Add New [N] v Button (RestroX Crimson Red var(--r8-brand-primary)) */}
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <button
              onClick={openAddModal}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--r8-brand-primary)',
                color: '#FFF',
                border: 'none',
                borderRadius: '8px 0 0 8px',
                padding: '7px 12px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#C70812')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--r8-brand-primary)')}
            >
              <Plus size={16} />
              <span>Add New</span>
              <span
                style={{
                  border: '1px solid rgba(255,255,255,0.4)',
                  borderRadius: '4px',
                  padding: '1px 5px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                }}
              >
                N
              </span>
            </button>
            <button
              onClick={() => setShowAddMenuDropdown(!showAddMenuDropdown)}
              style={{
                backgroundColor: 'var(--r8-brand-primary)',
                color: '#FFF',
                border: 'none',
                borderLeft: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '0 8px 8px 0',
                padding: '7px 8px',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#C70812')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--r8-brand-primary)')}
            >
              <ChevronDown size={14} />
            </button>

            {/* Add Dropdown Menu */}
            {showAddMenuDropdown && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '10px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                  width: '210px',
                  zIndex: 50,
                  padding: '6px',
                }}
              >
                <button
                  onClick={openAddModal}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: 'var(--color-foreground)',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Plus size={14} color="var(--r8-brand-primary)" />
                  <span>Add New Customer</span>
                </button>
                <button
                  onClick={() => {
                    loadSampleCustomers();
                    setShowAddMenuDropdown(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: 'var(--color-foreground)',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <FileSpreadsheet size={14} color="#10B981" />
                  <span>Import Sample Customers</span>
                </button>
              </div>
            )}
          </div>

          {/* ... More Options Button */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              style={{
                backgroundColor: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                padding: '7px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--color-foreground)',
              }}
            >
              <MoreHorizontal size={16} />
            </button>

            {showMoreMenu && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '10px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                  width: '210px',
                  zIndex: 50,
                  padding: '6px',
                }}
              >
                <button
                  onClick={() => {
                    loadSampleCustomers();
                    setShowMoreMenu(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: 'var(--color-foreground)',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Users size={14} color="#3B82F6" />
                  <span>Load Sample Customers (4)</span>
                </button>
                <button
                  onClick={() => {
                    clearCustomers();
                    setShowMoreMenu(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#EF4444',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Trash2 size={14} color="#EF4444" />
                  <span>Clear All (Empty State)</span>
                </button>
                <button
                  onClick={() => {
                    addToast('Export Generated', 'Exported customer directory to CSV.', 'success');
                    setShowMoreMenu(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: 'var(--color-foreground)',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Download size={14} />
                  <span>Export Customer List</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto' }}>
        {/* 3 Summary KPI Cards matching Screenshot 4 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: '20px',
          }}
        >
          {/* Card 1: To Receive */}
          <div
            style={{
              backgroundColor: 'var(--color-card)',
              borderRadius: '12px',
              padding: '18px 20px',
              border: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.02)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-muted-foreground)' }}>
                To Receive (Receivables)
              </span>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ArrowDown size={18} />
              </div>
            </div>

            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-foreground)', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                Rs. {toReceiveAmount.toLocaleString('en-IN')}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                <span
                  style={{
                    backgroundColor: '#ECFDF5',
                    color: '#059669',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '10px',
                    border: '1px solid #A7F3D0',
                  }}
                >
                  {customers.filter((c) => c.openingBalanceType === 'collect_dr' && (c.dueAmount || c.openingAmount || 0) > 0).length} accounts pending
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: To Pay */}
          <div
            style={{
              backgroundColor: 'var(--color-card)',
              borderRadius: '12px',
              padding: '18px 20px',
              border: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.02)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-muted-foreground)' }}>
                To Pay (Customer Credit)
              </span>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: '#DC2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ArrowUp size={18} />
              </div>
            </div>

            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-foreground)', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                Rs. {toPayAmount.toLocaleString('en-IN')}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                <span
                  style={{
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '10px',
                    border: '1px solid #FECACA',
                  }}
                >
                  {customers.filter((c) => c.openingBalanceType === 'pay_cr' && (c.dueAmount || c.openingAmount || 0) > 0).length} payables pending
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Net To Receive */}
          <div
            style={{
              backgroundColor: 'var(--color-card)',
              borderRadius: '12px',
              padding: '18px 20px',
              border: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.02)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-muted-foreground)' }}>
                Net Ledger Balance
              </span>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  color: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Receipt size={18} />
              </div>
            </div>

            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-foreground)', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                Rs. {netToReceiveAmount.toLocaleString('en-IN')}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                <span
                  style={{
                    backgroundColor: netToReceiveAmount >= 0 ? '#ECFDF5' : '#FEF2F2',
                    color: netToReceiveAmount >= 0 ? '#059669' : '#DC2626',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '10px',
                    border: `1px solid ${netToReceiveAmount >= 0 ? '#A7F3D0' : '#FECACA'}`,
                  }}
                >
                  {netToReceiveAmount >= 0 ? '🟢 Net Asset Position' : '🔴 Net Payable Position'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table / Empty State Container */}
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
            overflow: 'hidden',
          }}
        >
          {/* Table Header Row (8 Columns matching Screenshot 4) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '60px 2.2fr 2fr 1.6fr 1.2fr 1.2fr 1.2fr 1.2fr 70px',
              padding: '12px 18px',
              backgroundColor: 'var(--color-muted)',
              borderBottom: '1px solid var(--color-border)',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'var(--color-muted-foreground)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {filteredCustomers.length > 0 && (
                <input
                  type="checkbox"
                  checked={
                    selectedCustomerIds.length > 0 &&
                    selectedCustomerIds.length === filteredCustomers.length
                  }
                  onChange={toggleSelectAll}
                  style={{ cursor: 'pointer' }}
                />
              )}
              <span>SN</span>
            </div>
            <div>Customer</div>
            <div>Email</div>
            <div>Phone Number</div>
            <div>DOB</div>
            <div>Tier & Points</div>
            <div>Group</div>
            <div>Due Amount</div>
            <div style={{ textAlign: 'right' }}>Actions</div>
          </div>

          {/* Table Body */}
          {filteredCustomers.length === 0 ? (
            /* Empty State Container matching Screenshot 4 */
            <div
              style={{
                padding: '70px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              {/* 3 Fanned Colored Document Cards Illustration matching Screenshot 4 */}
              <div
                style={{
                  position: 'relative',
                  width: '130px',
                  height: '110px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Left Card: Green Tilted -15deg */}
                <div
                  style={{
                    position: 'absolute',
                    width: '64px',
                    height: '84px',
                    borderRadius: '10px',
                    backgroundColor: '#10B981',
                    transform: 'rotate(-14deg) translate(-22px, -2px)',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                    padding: '8px 6px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                  }}
                >
                  <div style={{ height: '4px', width: '70%', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '2px' }} />
                  <div style={{ height: '3px', width: '90%', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '2px' }} />
                  <div style={{ height: '3px', width: '80%', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '2px' }} />
                </div>

                {/* Right Card: Purple Tilted +15deg */}
                <div
                  style={{
                    position: 'absolute',
                    width: '64px',
                    height: '84px',
                    borderRadius: '10px',
                    backgroundColor: '#8B5CF6',
                    transform: 'rotate(14deg) translate(22px, -2px)',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.25)',
                    padding: '8px 6px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                  }}
                >
                  <div style={{ height: '4px', width: '70%', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '2px' }} />
                  <div style={{ height: '3px', width: '90%', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '2px' }} />
                  <div style={{ height: '3px', width: '60%', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '2px' }} />
                </div>

                {/* Center Card: Bright Blue Upright */}
                <div
                  style={{
                    position: 'absolute',
                    width: '66px',
                    height: '88px',
                    borderRadius: '10px',
                    backgroundColor: '#2563EB',
                    zIndex: 2,
                    boxShadow: '0 6px 16px rgba(37, 99, 235, 0.3)',
                    padding: '10px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div style={{ height: '5px', width: '50%', backgroundColor: '#FFF', borderRadius: '3px' }} />
                  <div style={{ height: '3px', width: '95%', backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: '2px' }} />
                  <div style={{ height: '3px', width: '85%', backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: '2px' }} />
                  <div style={{ height: '3px', width: '75%', backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: '2px' }} />
                  <div style={{ height: '3px', width: '90%', backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: '2px' }} />
                </div>
              </div>

              {/* Text matching Screenshot 4 */}
              <h2
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: 'var(--color-foreground)',
                  margin: '0 0 6px 0',
                }}
              >
                No customer found
              </h2>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--color-muted-foreground)',
                  margin: '0 0 20px 0',
                }}
              >
                Create a new customer or import a new data.
              </p>

              {/* Red Action Button matching Screenshot 4 */}
              <button
                onClick={openAddModal}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--r8-brand-primary)',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '9px 22px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(14, 165, 233, 0.25)',
                }}
              >
                <Plus size={16} />
                <span>Add New Customer</span>
              </button>
            </div>
          ) : (
            /* Populated Customer Rows */
            <div>
              {filteredCustomers.map((cust, idx) => {
                const isSelected = selectedCustomerIds.includes(cust.id);
                const badgeStyle = getGroupBadge(cust.group);
                const metrics = getCustomerMetrics(cust);

                const getTierColor = (tier: string) => {
                  switch (tier) {
                    case 'VIP':
                      return { bg: '#F3E8FF', text: '#7E22CE', border: '#E9D5FF' };
                    case 'Gold':
                      return { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A' };
                    case 'Silver':
                      return { bg: '#F1F5F9', text: '#475569', border: '#CBD5E1' };
                    default:
                      return { bg: '#FFEDD5', text: '#C2410C', border: '#FED7AA' };
                  }
                };
                const tierStyle = getTierColor(metrics.tier);

                return (
                  <div
                    key={cust.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '60px 2.2fr 2fr 1.6fr 1.2fr 1.2fr 1.2fr 1.2fr 70px',
                      padding: '12px 18px',
                      borderBottom: '1px solid var(--color-border)',
                      alignItems: 'center',
                      fontSize: '0.84rem',
                      color: 'var(--color-foreground)',
                      backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                      transition: 'background-color 0.1s ease',
                    }}
                  >
                    {/* SN + Checkbox */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(cust.id)}
                        style={{ cursor: 'pointer' }}
                      />
                      <span style={{ color: 'var(--color-muted-foreground)', fontSize: '0.8rem' }}>
                        {idx + 1}
                      </span>
                    </div>

                    {/* Customer (Avatar + Name + Intelligence) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {cust.avatar ? (
                        <img
                          src={cust.avatar}
                          alt={cust.name}
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            backgroundColor: '#E0E7FF',
                            color: '#4338CA',
                            fontWeight: 600,
                            fontSize: '0.78rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {cust.name
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: 600 }}>{cust.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--color-muted-foreground)', display: 'flex', gap: '5px', alignItems: 'center' }}>
                          <span>{metrics.orderCount} orders</span>
                          <span>•</span>
                          <span>Rs. {metrics.totalSpent.toLocaleString()}</span>
                          {cust.panNumber && <span>• PAN: {cust.panNumber}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div style={{ color: cust.email ? 'var(--color-foreground)' : 'var(--color-muted-foreground)' }}>
                      {cust.email || '-'}
                    </div>

                    {/* Phone Number */}
                    <div style={{ fontWeight: 500 }}>{cust.phone}</div>

                    {/* DOB */}
                    <div style={{ color: cust.dob ? 'var(--color-foreground)' : 'var(--color-muted-foreground)' }}>
                      {cust.dob || '-'}
                    </div>

                    {/* Loyalty Tier & Points */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span
                          style={{
                            backgroundColor: tierStyle.bg,
                            color: tierStyle.text,
                            border: `1px solid ${tierStyle.border}`,
                            borderRadius: '6px',
                            padding: '2px 6px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                          }}
                        >
                          {metrics.tier}
                        </span>
                        <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-foreground)' }}>
                          {metrics.loyaltyPoints} pts
                        </span>
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--color-muted-foreground)', marginTop: '2px' }}>
                        {cust.loyaltyDiscount ? `${Number(cust.loyaltyDiscount).toFixed(1)}% dis` : '0% dis'}
                      </div>
                    </div>

                    {/* Group */}
                    <div>
                      <span
                        style={{
                          backgroundColor: badgeStyle.bg,
                          color: badgeStyle.text,
                          border: `1px solid ${badgeStyle.border}`,
                          borderRadius: '12px',
                          padding: '3px 10px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                        }}
                      >
                        {cust.group}
                      </span>
                    </div>

                    {/* Due Amount */}
                    <div
                      style={{
                        fontWeight: 600,
                        color:
                          cust.dueAmount > 0
                            ? cust.openingBalanceType === 'collect_dr'
                              ? '#059669'
                              : '#DC2626'
                            : 'var(--color-foreground)',
                      }}
                    >
                      Rs {cust.dueAmount ? cust.dueAmount.toLocaleString() : '0'}
                      {cust.dueAmount > 0 && (
                        <span style={{ fontSize: '0.7rem', marginLeft: '4px', opacity: 0.8 }}>
                          {cust.openingBalanceType === 'collect_dr' ? 'Dr' : 'Cr'}
                        </span>
                      )}
                    </div>

                    {/* Row Actions */}
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => openEditModal(cust)}
                        title="Edit Customer"
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          color: 'var(--color-muted-foreground)',
                          borderRadius: '4px',
                        }}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete ${cust.name}?`)) {
                            deleteCustomer(cust.id);
                          }
                        }}
                        title="Delete Customer"
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          color: '#EF4444',
                          borderRadius: '4px',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Table Footer matching Screenshot 4: 0 of 0 row(s) selected. */}
          <div
            style={{
              padding: '10px 18px',
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
              {selectedCustomerIds.length} of {filteredCustomers.length} row(s) selected.
            </div>

            {selectedCustomerIds.length > 0 && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleDeleteSelected}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: '#FEE2E2',
                    color: '#DC2626',
                    border: '1px solid #FCA5A5',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Trash2 size={12} />
                  <span>Delete Selected ({selectedCustomerIds.length})</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Headset Support Button matching Screenshot 4 */}
      <div
        style={{
          position: 'fixed',
          bottom: '40px',
          right: '24px',
          zIndex: 40,
        }}
      >
        <button
          onClick={() => addToast('RESTRO8 Support', 'Nepal 24/7 Support: Call +977 1-5970000 or chat online.', 'info')}
          title="RESTRO8 Live Help & Support"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#10B981',
            color: '#FFF',
            border: 'none',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Headphones size={20} />
        </button>
      </div>

      {/* Add / Edit Customer Modal matching Screenshot 5 */}
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
              boxShadow: '0 20px 45px rgba(0,0,0,0.5)',
              width: '100%',
              maxWidth: '820px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '18px 24px',
                borderBottom: '1px solid #E5E7EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <h2
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  margin: 0,
                  color: '#111827',
                  textAlign: 'center',
                }}
              >
                {editingCustomer ? 'Edit Customer' : 'Add Customer'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '18px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9CA3AF',
                  padding: '4px',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveCustomer} style={{ overflowY: 'auto', flex: 1, padding: '24px 28px' }}>
              {/* Section 1: Basic Customer Details */}
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>
                1. Basic Customer Details
              </div>

              {/* Profile Image Row matching Screenshot 5 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '8px',
                    border: '1px solid #D1D5DB',
                    backgroundColor: '#F9FAFB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  {formAvatar ? (
                    <img src={formAvatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Camera size={22} color="#9CA3AF" />
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#374151' }}>
                    Customer Profile Image
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarUpload}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        backgroundColor: '#10B981',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 14px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormAvatar('')}
                      style={{
                        backgroundColor: 'var(--color-muted)',
                        color: 'var(--color-muted-foreground)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '6px',
                        padding: '6px 14px',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              {/* 3-Column Form Grid matching Screenshot 5 */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '18px 20px',
                  marginBottom: '20px',
                }}
              >
                {/* Row 1 Col 1: Customer Full Name * */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Customer Full Name <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter Customer Name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #D1D5DB',
                      fontSize: '0.85rem',
                      outline: 'none',
                      color: '#111827',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Row 1 Col 2: Phone Number with Nepal flag +977 */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Phone Number
                  </label>
                  <div
                    style={{
                      display: 'flex',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: '#F9FAFB',
                        padding: '0 10px',
                        borderRight: '1px solid #D1D5DB',
                        fontSize: '0.82rem',
                        color: '#374151',
                        fontWeight: 500,
                      }}
                    >
                      <span>🇳🇵</span>
                      <ChevronDown size={12} color="#6B7280" />
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
                        color: '#111827',
                        minWidth: 0,
                      }}
                    />
                  </div>
                </div>

                {/* Row 1 Col 3: Email */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #D1D5DB',
                      fontSize: '0.85rem',
                      outline: 'none',
                      color: '#111827',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Row 2 Col 1: Loyalty Discount (in %) */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Loyalty Discount (in %)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="0.00 %"
                    value={formLoyaltyDiscount}
                    onChange={(e) => setFormLoyaltyDiscount(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #D1D5DB',
                      fontSize: '0.85rem',
                      outline: 'none',
                      color: '#111827',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Row 2 Col 2: Opening Balance matching Screenshot 5 */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Opening Balance
                  </label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {/* To Collect(Dr) pill */}
                    <button
                      type="button"
                      onClick={() => setFormBalanceType('collect_dr')}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: formBalanceType === 'collect_dr' ? '1px solid #10B981' : '1px solid #E5E7EB',
                        backgroundColor: formBalanceType === 'collect_dr' ? '#ECFDF5' : '#FFF',
                        color: formBalanceType === 'collect_dr' ? '#047857' : '#6B7280',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          border: formBalanceType === 'collect_dr' ? '3px solid #10B981' : '1.5px solid #9CA3AF',
                          backgroundColor: formBalanceType === 'collect_dr' ? '#10B981' : 'transparent',
                        }}
                      />
                      <span>To Collect(Dr)</span>
                      <ArrowDown size={12} />
                    </button>

                    {/* To Pay(Cr) pill */}
                    <button
                      type="button"
                      onClick={() => setFormBalanceType('pay_cr')}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: formBalanceType === 'pay_cr' ? '1px solid #EF4444' : '1px solid #E5E7EB',
                        backgroundColor: formBalanceType === 'pay_cr' ? '#FEF2F2' : '#FFF',
                        color: formBalanceType === 'pay_cr' ? '#B91C1C' : '#6B7280',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          border: formBalanceType === 'pay_cr' ? '3px solid #EF4444' : '1.5px solid #9CA3AF',
                          backgroundColor: formBalanceType === 'pay_cr' ? '#EF4444' : 'transparent',
                        }}
                      />
                      <span>To Pay(Cr)</span>
                      <ArrowUp size={12} />
                    </button>
                  </div>
                </div>

                {/* Row 2 Col 3: Opening Amount */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Opening Amount
                  </label>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      overflow: 'hidden',
                    }}
                  >
                    <span
                      style={{
                        padding: '0 10px',
                        backgroundColor: '#F9FAFB',
                        borderRight: '1px solid #D1D5DB',
                        color: '#6B7280',
                        fontSize: '0.82rem',
                        fontWeight: 500,
                      }}
                    >
                      Rs
                    </span>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formOpeningAmount}
                      onChange={(e) => setFormOpeningAmount(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '9px 12px',
                        border: 'none',
                        outline: 'none',
                        fontSize: '0.85rem',
                        color: '#111827',
                        minWidth: 0,
                      }}
                    />
                  </div>
                </div>

                {/* Row 3 Col 1: Date of Birth */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Date of Birth
                  </label>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      paddingRight: '10px',
                    }}
                  >
                    <input
                      type="date"
                      value={formDob}
                      onChange={(e) => setFormDob(e.target.value)}
                      placeholder="YYYY-MM-DD"
                      style={{
                        flex: 1,
                        padding: '9px 12px',
                        border: 'none',
                        outline: 'none',
                        fontSize: '0.85rem',
                        color: '#111827',
                        minWidth: 0,
                      }}
                    />
                    <Calendar size={16} color="#6B7280" />
                  </div>
                </div>

                {/* Row 3 Col 2: Group */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Group
                  </label>
                  <select
                    value={formGroup}
                    onChange={(e) => setFormGroup(e.target.value as any)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      fontSize: '0.85rem',
                      outline: 'none',
                      color: 'var(--color-foreground)',
                      backgroundColor: 'var(--color-card)',
                      cursor: 'pointer',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="Regular">Regular</option>
                    <option value="VIP">VIP</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Staff">Staff</option>
                    <option value="Family">Family</option>
                  </select>
                </div>
              </div>

              {/* Expandable Section: Additional Details matching Screenshot 5 */}
              <div style={{ marginTop: '14px', marginBottom: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAdditionalDetails(!showAdditionalDetails)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'none',
                    border: 'none',
                    color: '#2563EB',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  {showAdditionalDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  <span>Additional Details</span>
                </button>

                {showAdditionalDetails && (
                  <div
                    style={{
                      marginTop: '14px',
                      padding: '16px',
                      backgroundColor: '#F9FAFB',
                      borderRadius: '10px',
                      border: '1px solid #E5E7EB',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '14px',
                    }}
                  >
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>
                        Customer PAN Number (for B2B billing)
                      </label>
                      <input
                        type="text"
                        placeholder="9-digit IRD PAN"
                        value={formPan}
                        onChange={(e) => setFormPan(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          border: '1px solid #D1D5DB',
                          fontSize: '0.82rem',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>
                        Address / Location
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Bharatpur-10, Chitwan"
                        value={formAddress}
                        onChange={(e) => setFormAddress(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          border: '1px solid #D1D5DB',
                          fontSize: '0.82rem',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>
                        Customer Notes / Preferences
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Special dietary requests, allergies, or table preferences"
                        value={formNotes}
                        onChange={(e) => setFormNotes(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          border: '1px solid #D1D5DB',
                          fontSize: '0.82rem',
                          outline: 'none',
                          boxSizing: 'border-box',
                          fontFamily: 'inherit',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Bottom Buttons matching Screenshot 5 */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '28px',
                  paddingTop: '16px',
                  borderTop: '1px solid #F3F4F6',
                }}
              >
                <button
                  type="button"
                  onClick={handleResetForm}
                  style={{
                    backgroundColor: '#F3F4F6',
                    color: '#4B5563',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 28px',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Reset
                </button>

                <button
                  type="submit"
                  style={{
                    backgroundColor: '#74A892',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 36px',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(116, 168, 146, 0.3)',
                  }}
                >
                  {editingCustomer ? 'Update Customer' : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
