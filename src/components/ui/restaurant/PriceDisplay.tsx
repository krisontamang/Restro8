import React from 'react';

export interface PriceDisplayProps {
  amount: number;
  currency?: string;
  originalAmount?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showVatNote?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  amount,
  currency = 'Rs.',
  originalAmount,
  size = 'md',
  showVatNote = false,
  className = '',
  style,
}) => {
  const formatNumber = (num: number) => {
    return num.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getFontSize = () => {
    switch (size) {
      case 'sm':
        return { value: '0.84rem', currency: '0.74rem' };
      case 'lg':
        return { value: '1.25rem', currency: '0.9rem' };
      case 'xl':
        return { value: '1.75rem', currency: '1.1rem' };
      case 'md':
      default:
        return { value: '1rem', currency: '0.8rem' };
    }
  };

  const fs = getFontSize();

  return (
    <div
      className={`r8-price-display r8-tabular-num ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: '3px',
        color: 'var(--r8-text-primary)',
        fontWeight: 600,
        ...style,
      }}
    >
      {originalAmount !== undefined && originalAmount > amount && (
        <span
          style={{
            fontSize: fs.currency,
            color: 'var(--r8-text-muted)',
            textDecoration: 'line-through',
            marginRight: '4px',
            fontWeight: 400,
          }}
        >
          {currency} {formatNumber(originalAmount)}
        </span>
      )}
      <span style={{ fontSize: fs.currency, color: 'var(--r8-text-secondary)', fontWeight: 500 }}>
        {currency}
      </span>
      <span style={{ fontSize: fs.value, fontWeight: 700 }}>
        {formatNumber(amount)}
      </span>
      {showVatNote && (
        <span
          style={{
            fontSize: '0.68rem',
            color: 'var(--r8-text-muted)',
            marginLeft: '2px',
            fontWeight: 400,
          }}
        >
          (incl. VAT)
        </span>
      )}
    </div>
  );
};
