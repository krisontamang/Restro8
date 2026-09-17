import React from 'react';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import type { UserRole } from '../../types/restaurant';

interface AccessRestrictedViewProps {
  role: UserRole | string;
  tab: string;
  onFallback: () => void;
}

export const AccessRestrictedView: React.FC<AccessRestrictedViewProps> = ({
  role,
  tab,
  onFallback,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        padding: '32px 16px',
        textAlign: 'center',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: '#EF4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '18px',
        }}
      >
        <ShieldAlert size={32} />
      </div>

      <h2
        style={{
          fontSize: '1.4rem',
          fontWeight: 800,
          color: 'var(--color-foreground, #0F172A)',
          margin: '0 0 8px 0',
          letterSpacing: '-0.02em',
        }}
      >
        Access Restricted
      </h2>

      <p
        style={{
          fontSize: '0.92rem',
          color: 'var(--color-muted-foreground, #64748B)',
          maxWidth: '460px',
          lineHeight: 1.5,
          margin: '0 0 20px 0',
        }}
      >
        Your current role (<strong>{role}</strong>) does not have permission to view the{' '}
        <strong>{tab}</strong> workspace. This area is restricted to authorized management personnel.
      </p>

      <div
        style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
        }}
      >
        <button
          type="button"
          onClick={onFallback}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px',
            backgroundColor: 'var(--r8-brand-primary, #0F8F6F)',
            color: '#FFFFFF',
            fontWeight: 600,
            fontSize: '0.88rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(15, 143, 111, 0.25)',
          }}
        >
          <ArrowLeft size={16} />
          Return to Authorized Workspace
        </button>
      </div>

      <div
        style={{
          marginTop: '28px',
          fontSize: '0.78rem',
          color: 'var(--color-muted-foreground, #94A3B8)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <Lock size={13} />
        <span>Restro8 Role-Based Access Control (RBAC) Enforced</span>
      </div>
    </div>
  );
};
