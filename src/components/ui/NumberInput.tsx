import React from 'react';
import { Minus, Plus } from 'lucide-react';

export interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min = 0,
  max = 9999,
  step = 1,
  disabled = false,
  size = 'md',
  className = '',
  style,
}) => {
  const handleDecrement = () => {
    if (disabled || value <= min) return;
    onChange(Math.max(min, value - step));
  };

  const handleIncrement = () => {
    if (disabled || value >= max) return;
    onChange(Math.min(max, value + step));
  };

  const getDims = () => {
    switch (size) {
      case 'sm':
        return { h: '32px', btnW: '30px', fontSize: '0.85rem' };
      case 'lg':
        return { h: '48px', btnW: '44px', fontSize: '1.05rem' };
      case 'md':
      default:
        return { h: '40px', btnW: '38px', fontSize: '0.95rem' };
    }
  };

  const dims = getDims();

  return (
    <div
      className={`r8-number-input ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: dims.h,
        border: '1px solid var(--r8-border-subtle)',
        borderRadius: 'var(--r8-radius-sm)',
        backgroundColor: 'var(--r8-bg-surface)',
        overflow: 'hidden',
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        aria-label="Decrease value"
        className="r8-focus-ring"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: dims.btnW,
          height: '100%',
          backgroundColor: 'var(--r8-bg-subtle)',
          color: 'var(--r8-text-primary)',
          border: 'none',
          cursor: disabled || value <= min ? 'not-allowed' : 'pointer',
          transition: 'background-color var(--r8-motion-fast)',
        }}
      >
        <Minus size={size === 'sm' ? 12 : 16} />
      </button>

      <span
        className="r8-tabular-num"
        style={{
          padding: '0 12px',
          minWidth: '36px',
          textAlign: 'center',
          fontSize: dims.fontSize,
          fontWeight: 600,
          color: 'var(--r8-text-primary)',
          userSelect: 'none',
        }}
      >
        {value}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        aria-label="Increase value"
        className="r8-focus-ring"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: dims.btnW,
          height: '100%',
          backgroundColor: 'var(--r8-bg-subtle)',
          color: 'var(--r8-text-primary)',
          border: 'none',
          cursor: disabled || value >= max ? 'not-allowed' : 'pointer',
          transition: 'background-color var(--r8-motion-fast)',
        }}
      >
        <Plus size={size === 'sm' ? 12 : 16} />
      </button>
    </div>
  );
};
