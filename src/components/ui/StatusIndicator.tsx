import React from 'react';

export type StatusType = 'online' | 'busy' | 'offline' | 'warning' | 'alert';

export interface StatusIndicatorProps {
  status: StatusType;
  label?: string;
  pulse?: boolean;
  size?: 'sm' | 'md';
  className?: string;
  style?: React.CSSProperties;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  pulse = false,
  size = 'md',
  className = '',
  style,
}) => {
  const getColor = () => {
    switch (status) {
      case 'online':
        return 'var(--r8-brand-emerald)';
      case 'busy':
        return 'var(--r8-brand-primary)';
      case 'warning':
        return 'var(--r8-brand-accent)';
      case 'alert':
        return 'var(--r8-brand-coral)';
      case 'offline':
      default:
        return 'var(--r8-text-muted)';
    }
  };

  const color = getColor();
  const dim = size === 'sm' ? 6 : 8;

  return (
    <span
      className={`r8-status-indicator ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: size === 'sm' ? '0.74rem' : '0.8rem',
        fontWeight: 500,
        color: 'var(--r8-text-secondary)',
        ...style,
      }}
    >
      <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
        <span
          style={{
            width: `${dim}px`,
            height: `${dim}px`,
            borderRadius: '50%',
            backgroundColor: color,
          }}
        />
        {pulse && (
          <span
            style={{
              position: 'absolute',
              width: `${dim * 2}px`,
              height: `${dim * 2}px`,
              borderRadius: '50%',
              backgroundColor: color,
              opacity: 0.4,
              animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
              left: `-${dim / 2}px`,
              top: `-${dim / 2}px`,
            }}
          />
        )}
      </span>
      {label && <span>{label}</span>}
    </span>
  );
};
