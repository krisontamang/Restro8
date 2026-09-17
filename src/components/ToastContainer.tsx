import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useRestaurant();

  if (toasts.length === 0) return null;

  const iconMap = {
    success: <CheckCircle2 size={18} color="var(--r8-semantic-success, #10B981)" />,
    warning: <AlertTriangle size={18} color="var(--r8-semantic-warning, #F59E0B)" />,
    error: <AlertCircle size={18} color="var(--r8-semantic-danger, #EF4444)" />,
    info: <Info size={18} color="var(--r8-brand-primary, #0F8F6F)" />,
  };

  const borderMap = {
    success: 'rgba(16, 185, 129, 0.4)',
    warning: 'rgba(245, 158, 11, 0.4)',
    error: 'rgba(239, 68, 68, 0.4)',
    info: 'rgba(15, 143, 111, 0.4)',
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '380px',
        width: '100%',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-pop-in"
          style={{
            pointerEvents: 'auto',
            backgroundColor: 'var(--color-card-elevated)',
            color: 'var(--color-card-foreground)',
            padding: '12px 14px',
            borderRadius: '12px',
            border: `1px solid ${borderMap[toast.type]}`,
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          <div style={{ marginTop: '2px', flexShrink: 0 }}>{iconMap[toast.type]}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '0.86rem', fontWeight: 700 }}>{toast.title}</strong>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-muted-foreground)' }}>
                {toast.timestamp}
              </span>
            </div>
            <p
              style={{
                fontSize: '0.8rem',
                color: 'var(--color-muted-foreground)',
                marginTop: '2px',
                lineHeight: 1.4,
              }}
            >
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            style={{
              padding: '2px',
              borderRadius: '4px',
              color: 'var(--color-muted-foreground)',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
