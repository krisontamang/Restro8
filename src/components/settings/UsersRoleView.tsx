import React, { useState, useEffect } from 'react';
import {
  Box,
  Flag,
  User,
  Coffee,
  Aperture,
  Search,
  Plus,
  X,
  Shield,
  Check,
  Users,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

export interface UserRoleItem {
  id: string;
  name: string;
  iconType: 'box' | 'flag' | 'kitchen' | 'server' | 'superadmin';
  iconColor: string;
  iconBg: string;
  totalUsers: number;
  description: string;
  permissions: string[];
}

const INITIAL_ROLES: UserRoleItem[] = [
  {
    id: 'admin',
    name: 'Admin',
    iconType: 'box',
    iconColor: '#F59E0B',
    iconBg: '#FEF3C7',
    totalUsers: 0,
    description: 'Full restaurant operational management excluding ownership transfer.',
    permissions: ['Orders', 'Menu', 'Inventory', 'Reports', 'Staff Management'],
  },
  {
    id: 'billing',
    name: 'Billing',
    iconType: 'flag',
    iconColor: '#10B981',
    iconBg: '#D1FAE5',
    totalUsers: 0,
    description: 'Cashier and counter point-of-sale checkout and bill settlement.',
    permissions: ['Orders', 'Checkout', 'Day Book', 'Invoices', 'Discounts'],
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    iconType: 'kitchen',
    iconColor: '#EA580C',
    iconBg: '#FFEDD5',
    totalUsers: 0,
    description: 'Kitchen display system and ticket preparation station access.',
    permissions: ['KDS View', 'Ticket Status Updates', 'Recipe View'],
  },
  {
    id: 'server',
    name: 'Server',
    iconType: 'server',
    iconColor: '#B91C1C',
    iconBg: '#FEE2E2',
    totalUsers: 0,
    description: 'Waitstaff table ordering, token generation, and customer requests.',
    permissions: ['Take Orders', 'Table Service', 'Move Orders', 'Request Bill'],
  },
  {
    id: 'superadmin',
    name: 'SuperAdmin',
    iconType: 'superadmin',
    iconColor: '#047857',
    iconBg: '#D1FAE5',
    totalUsers: 1,
    description: 'Unrestricted owner access across all modules, IRD compliance, and settings.',
    permissions: ['All Permissions', 'System Settings', 'Ownership', 'Tax Rates'],
  },
];

export const UsersRoleView: React.FC = () => {
  const { addToast } = useRestaurant();
  const [roles, setRoles] = useState<UserRoleItem[]>(() => {
    try {
      const saved = localStorage.getItem('restrox_user_roles');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_ROLES;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRoleItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');

  useEffect(() => {
    localStorage.setItem('restrox_user_roles', JSON.stringify(roles));
  }, [roles]);

  // Global hotkey 'N' for Add New Role
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)
      ) {
        return;
      }
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setIsAddModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    const newRole: UserRoleItem = {
      id: `role-${Date.now()}`,
      name: newRoleName.trim(),
      iconType: 'box',
      iconColor: '#6366F1',
      iconBg: '#EEF2FF',
      totalUsers: 0,
      description: newRoleDesc.trim() || 'Custom created staff role profile.',
      permissions: ['Orders', 'Menu View'],
    };

    setRoles((prev) => [...prev, newRole]);
    setIsAddModalOpen(false);
    setNewRoleName('');
    setNewRoleDesc('');
    addToast('Role Created', `New role "${newRole.name}" added successfully.`, 'success');
  };

  const filteredRoles = roles.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderIcon = (type: string, color: string) => {
    const size = 18;
    switch (type) {
      case 'flag':
        return <Flag size={size} color={color} />;
      case 'kitchen':
        return <User size={size} color={color} />;
      case 'server':
        return <Coffee size={size} color={color} />;
      case 'superadmin':
        return <Aperture size={size} color={color} />;
      case 'box':
      default:
        return <Box size={size} color={color} />;
    }
  };

  return (
    <div
      style={{
        padding: '24px 32px',
        backgroundColor: 'var(--color-background)',
        overflowY: 'auto',
        height: '100%',
        boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Top Header matching Screenshot 3 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
        }}
      >
        <h1
          style={{
            fontSize: '1.45rem',
            fontWeight: 700,
            margin: 0,
            color: 'var(--color-foreground)',
            letterSpacing: '-0.02em',
          }}
        >
          Users Role
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Search Input matching Screenshot 3 */}
          <div style={{ position: 'relative', width: '220px' }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9CA3AF',
              }}
            />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 12px 7px 32px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-card)',
                color: 'var(--color-foreground)',
                fontSize: '0.84rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* + Add New [N] Button matching Screenshot 3 */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'var(--r8-brand-primary)',
              color: '#FFF',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(229,9,20,0.2)',
            }}
          >
            <Plus size={15} />
            <span>Add New</span>
            <span
              style={{
                backgroundColor: 'rgba(255,255,255,0.25)',
                padding: '1px 5px',
                borderRadius: '4px',
                fontSize: '0.72rem',
                fontWeight: 700,
                marginLeft: '2px',
              }}
            >
              N
            </span>
          </button>
        </div>
      </div>

      {/* Section: Default Roles matching Screenshot 3 */}
      <div style={{ marginBottom: '32px' }}>
        <h2
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            margin: '0 0 16px 0',
            color: 'var(--color-foreground)',
          }}
        >
          Default Roles
        </h2>

        {/* 5 Role Cards in Row Grid matching Screenshot 3 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '16px',
            maxWidth: '1200px',
          }}
        >
          {filteredRoles.map((role) => (
            <div
              key={role.id}
              onClick={() => setSelectedRole(role)}
              style={{
                backgroundColor: 'var(--color-card)',
                borderRadius: '12px',
                border: '1px solid var(--color-border)',
                padding: '16px 18px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--r8-brand-primary)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {renderIcon(role.iconType, role.iconColor)}
                </div>
                <span
                  style={{
                    fontSize: '0.94rem',
                    fontWeight: 700,
                    color: 'var(--color-foreground)',
                  }}
                >
                  {role.name}
                </span>
              </div>

              <div
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--color-muted-foreground)',
                  fontWeight: 500,
                }}
              >
                Total User: {role.totalUsers.toString().padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role Permissions Details Drawer / Modal */}
      {selectedRole && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            backdropFilter: 'blur(2px)',
          }}
          onClick={() => setSelectedRole(null)}
        >
          <div
            style={{
              backgroundColor: 'var(--color-card)',
              borderRadius: '14px',
              border: '1px solid var(--color-border)',
              width: '460px',
              maxWidth: '90vw',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: selectedRole.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {renderIcon(selectedRole.iconType, selectedRole.iconColor)}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                    {selectedRole.name} Role
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-muted-foreground)' }}>
                    {selectedRole.totalUsers} active user(s) assigned
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRole(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-muted-foreground)',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--color-muted-foreground)', lineHeight: '1.4', marginBottom: '18px' }}>
              {selectedRole.description}
            </p>

            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '10px' }}>
              Granted Role Permissions:
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {selectedRole.permissions.map((perm) => (
                <div
                  key={perm}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--color-background)',
                    fontSize: '0.82rem',
                    color: 'var(--color-foreground)',
                  }}
                >
                  <Check size={14} color="#10B981" />
                  <span>{perm}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setSelectedRole(null)}
              style={{
                width: '100%',
                padding: '9px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-card)',
                color: 'var(--color-foreground)',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Close Details
            </button>
          </div>
        </div>
      )}

      {/* Add New Role Modal */}
      {isAddModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            backdropFilter: 'blur(2px)',
          }}
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--color-card)',
              borderRadius: '14px',
              border: '1px solid var(--color-border)',
              width: '440px',
              maxWidth: '90vw',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                Create Custom User Role
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-muted-foreground)',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateRole}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                  Role Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hostess, Bartender, Inventory Auditor"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  required
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-background)',
                    color: 'var(--color-foreground)',
                    fontSize: '0.84rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                  Description
                </label>
                <textarea
                  placeholder="Responsibilities and access scope..."
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-background)',
                    color: 'var(--color-foreground)',
                    fontSize: '0.84rem',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: '9px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-card)',
                    color: 'var(--color-foreground)',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '9px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'var(--r8-brand-primary)',
                    color: '#FFF',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Save Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
