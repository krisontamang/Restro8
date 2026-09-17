import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export type AlertSeverity = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  severity?: AlertSeverity;
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const Alert: React.FC<AlertProps> = ({
  severity = 'info',
  title,
  children,
  onClose,
  className = '',
  style,
}) => {
  const getSeverityConfig = () => {
    switch (severity) {
      case 'success':
        return {
          icon: <CheckCircle2 size={18} color="var(--r8-brand-emerald)" />,
          bg: 'var(--r8-brand-emerald-subtle)',
          border: 'rgba(16, 185, 129, 0.3)',
          titleColor: 'var(--r8-brand-emerald)',
        };
      case 'warning':
        return {
          icon: <AlertTriangle size={18} color="var(--r8-brand-accent)" />,
          bg: 'var(--r8-brand-accent-subtle)',
          border: 'rgba(245, 158, 11, 0.3)',
          titleColor: 'var(--r8-brand-accent)',
        };
      case 'error':
        return {
          icon: <AlertCircle size={18} color="var(--r8-brand-coral)" />,
          bg: 'var(--r8-brand-coral-subtle)',
          border: 'rgba(239, 68, 68, 0.3)',
          titleColor: 'var(--r8-brand-coral)',
        };
      case 'info':
      default:
        return {
          icon: <Info size={18} color="var(--r8-brand-primary)" />,
          bg: 'var(--r8-brand-primary-subtle)',
          border: 'rgba(14, 165, 233, 0.3)',
          titleColor: 'var(--r8-brand-primary)',
        };
    }
  };

  const cfg = getSeverityConfig();

  return (
    <div
      role="alert"
      className={`r8-alert r8-alert-${severity} ${className}`}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: 'var(--r8-radius-md)',
        backgroundColor: cfg.bg,
        border: `1px solid ${cfg.border}`,
        color: 'var(--r8-text-primary)',
        fontSize: '0.85rem',
        position: 'relative',
        ...style,
      }}
    >
      <span style={{ flexShrink: 0, marginTop: '2px' }}>{cfg.icon}</span>
      <div style={{ flex: 1 }}>
        {title && (
          <div
            style={{
              fontWeight: 600,
              fontSize: '0.875rem',
              marginBottom: '2px',
              color: cfg.titleColor,
            }}
          >
            {title}
          </div>
        )}
        <div style={{ color: 'var(--r8-text-secondary)', lineHeight: 1.45 }}>{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss alert"
          className="r8-focus-ring"
          style={{
            border: 'none',
            backgroundColor: 'transparent',
            color: 'var(--r8-text-muted)',
            cursor: 'pointer',
            padding: '2px',
            borderRadius: 'var(--r8-radius-xs)',
          }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
