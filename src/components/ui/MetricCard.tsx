import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { Card } from './Card';

export interface MetricCardProps {
  label: string;
  value: string | number;
  currencyPrefix?: string;
  change?: number; // e.g. +12.5 or -4.2
  changeLabel?: string; // e.g. "vs yesterday"
  icon?: React.ReactNode;
  variant?: 'default' | 'primary' | 'gold' | 'success' | 'warning' | 'coral' | 'danger';
  subtext?: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  currencyPrefix,
  change,
  changeLabel,
  icon,
  variant = 'default',
  subtext,
  onClick,
  className = '',
  style,
}) => {
  const isClickable = !!onClick;

  const getBorderColor = () => {
    switch (variant) {
      case 'primary':
        return 'var(--r8-brand-primary)';
      case 'gold':
        return 'var(--r8-brand-gold)';
      case 'success':
        return 'var(--r8-brand-emerald)';
      case 'warning':
        return 'var(--r8-brand-accent)';
      case 'coral':
      case 'danger':
        return 'var(--r8-brand-coral)';
      default:
        return 'var(--r8-border-subtle)';
    }
  };

  return (
    <Card
      variant={isClickable ? 'interactive' : 'default'}
      onClick={onClick}
      className={`r8-metric-card ${className}`}
      style={{
        borderLeft: variant !== 'default' ? `3px solid ${getBorderColor()}` : undefined,
        cursor: isClickable ? 'pointer' : 'default',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <span
          style={{
            fontSize: '0.78rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: 'var(--r8-text-secondary)',
          }}
        >
          {label}
        </span>
        {icon && (
          <span
            style={{
              color: 'var(--r8-text-muted)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {icon}
          </span>
        )}
      </div>

      <div
        className="r8-tabular-num"
        style={{
          fontSize: '1.45rem',
          fontWeight: 700,
          color: 'var(--r8-text-primary)',
          margin: '8px 0 4px 0',
          display: 'flex',
          alignItems: 'baseline',
          gap: '3px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {currencyPrefix && (
          <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--r8-text-secondary)' }}>
            {currencyPrefix}
          </span>
        )}
        <span>{value}</span>
      </div>

      {(change !== undefined || changeLabel || subtext) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.74rem',
            flexWrap: 'wrap',
          }}
        >
          {change !== undefined && (
            <span
              className="r8-tabular-num"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                fontWeight: 600,
                color:
                  change > 0
                    ? 'var(--r8-brand-emerald)'
                    : change < 0
                    ? 'var(--r8-brand-coral)'
                    : 'var(--r8-text-muted)',
              }}
            >
              {change > 0 ? (
                <ArrowUpRight size={14} />
              ) : change < 0 ? (
                <ArrowDownRight size={14} />
              ) : (
                <Minus size={14} />
              )}
              {change > 0 ? `+${change}%` : `${change}%`}
            </span>
          )}
          {changeLabel && <span style={{ color: 'var(--r8-text-muted)' }}>{changeLabel}</span>}
          {subtext && <span style={{ color: 'var(--r8-text-muted)' }}>{subtext}</span>}
        </div>
      )}
    </Card>
  );
};
