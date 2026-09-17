import React from 'react';

export type BadgeVariant =
  | 'primary'
  | 'gold'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  icon,
  dot = false,
  children,
  className = '',
  style,
  ...props
}) => {
  const getVariantStyles = (): { bg: string; color: string; border: string; dotColor: string } => {
    switch (variant) {
      case 'primary':
        return {
          bg: 'var(--r8-brand-primary-subtle)',
          color: 'var(--r8-brand-primary)',
          border: 'rgba(15, 143, 111, 0.3)',
          dotColor: 'var(--r8-brand-primary)',
        };
      case 'gold':
        return {
          bg: 'var(--r8-color-gold-subtle)',
          color: 'var(--r8-color-gold-dark)',
          border: 'rgba(242, 184, 75, 0.35)',
          dotColor: 'var(--r8-color-gold)',
        };
      case 'success':
        return {
          bg: 'var(--r8-brand-emerald-subtle)',
          color: 'var(--r8-brand-emerald)',
          border: 'rgba(16, 185, 129, 0.3)',
          dotColor: 'var(--r8-brand-emerald)',
        };
      case 'warning':
        return {
          bg: 'var(--r8-brand-accent-subtle)',
          color: 'var(--r8-brand-accent)',
          border: 'rgba(245, 158, 11, 0.3)',
          dotColor: 'var(--r8-brand-accent)',
        };
      case 'danger':
        return {
          bg: 'var(--r8-brand-coral-subtle)',
          color: 'var(--r8-brand-coral)',
          border: 'rgba(239, 68, 68, 0.3)',
          dotColor: 'var(--r8-brand-coral)',
        };
      case 'info':
        return {
          bg: 'var(--r8-brand-primary-subtle)',
          color: 'var(--r8-brand-primary)',
          border: 'rgba(15, 143, 111, 0.3)',
          dotColor: 'var(--r8-brand-primary)',
        };
      case 'secondary':
        return {
          bg: 'var(--r8-bg-elevated)',
          color: 'var(--r8-text-primary)',
          border: 'var(--r8-border-prominent)',
          dotColor: 'var(--r8-text-secondary)',
        };
      case 'neutral':
      default:
        return {
          bg: 'var(--r8-bg-subtle)',
          color: 'var(--r8-text-secondary)',
          border: 'var(--r8-border-subtle)',
          dotColor: 'var(--r8-text-muted)',
        };
    }
  };

  const v = getVariantStyles();
  const isSm = size === 'sm';

  return (
    <span
      className={`r8-badge r8-badge-${variant} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: isSm ? '1px 6px' : '2px 8px',
        fontSize: isSm ? '0.7rem' : '0.75rem',
        fontWeight: 600,
        borderRadius: 'var(--r8-radius-full)',
        backgroundColor: v.bg,
        color: v.color,
        border: `1px solid ${v.border}`,
        lineHeight: 1.2,
        userSelect: 'none',
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...props}
    >
      {dot && (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: v.dotColor,
            flexShrink: 0,
          }}
        />
      )}
      {icon}
      <span>{children}</span>
    </span>
  );
};
