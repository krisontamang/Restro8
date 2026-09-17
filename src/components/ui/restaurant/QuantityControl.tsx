import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

export interface QuantityControlProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove?: () => void;
  allowDeleteOnZero?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}

export const QuantityControl: React.FC<QuantityControlProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  onRemove,
  allowDeleteOnZero = true,
  disabled = false,
  size = 'md',
  className = '',
  style,
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const btnDim = isSm ? '28px' : isLg ? '44px' : '34px';
  const iconSize = isSm ? 12 : isLg ? 16 : 14;

  const handleDecrease = () => {
    if (disabled) return;
    if (quantity <= 1 && allowDeleteOnZero && onRemove) {
      onRemove();
    } else {
      onDecrease();
    }
  };

  return (
    <div
      className={`r8-quantity-control ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: 'var(--r8-bg-subtle)',
        border: '1px solid var(--r8-border-subtle)',
        borderRadius: 'var(--r8-radius-sm)',
        padding: '2px',
        gap: '4px',
        userSelect: 'none',
        ...style,
      }}
    >
      <button
        type="button"
        onClick={handleDecrease}
        disabled={disabled}
        aria-label={quantity <= 1 && onRemove ? 'Remove item' : 'Decrease quantity'}
        className="r8-focus-ring"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: btnDim,
          height: btnDim,
          borderRadius: 'var(--r8-radius-xs)',
          backgroundColor: 'var(--r8-bg-surface)',
          border: '1px solid var(--r8-border-subtle)',
          color:
            quantity <= 1 && onRemove
              ? 'var(--r8-brand-coral)'
              : 'var(--r8-text-primary)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: 'all var(--r8-motion-fast)',
        }}
      >
        {quantity <= 1 && onRemove ? <Trash2 size={iconSize} /> : <Minus size={iconSize} />}
      </button>

      <span
        className="r8-tabular-num"
        style={{
          minWidth: isSm ? '20px' : '28px',
          textAlign: 'center',
          fontSize: isSm ? '0.8rem' : isLg ? '1rem' : '0.875rem',
          fontWeight: 700,
          color: 'var(--r8-text-primary)',
        }}
      >
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        disabled={disabled}
        aria-label="Increase quantity"
        className="r8-focus-ring"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: btnDim,
          height: btnDim,
          borderRadius: 'var(--r8-radius-xs)',
          backgroundColor: 'var(--r8-bg-surface)',
          border: '1px solid var(--r8-border-subtle)',
          color: 'var(--r8-text-primary)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: 'all var(--r8-motion-fast)',
        }}
      >
        <Plus size={iconSize} />
      </button>
    </div>
  );
};
