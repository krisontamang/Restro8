import React from 'react';

export interface ProgressProps {
  value: number; // 0 to 100
  max?: number;
  variant?: 'primary' | 'success' | 'warning' | 'coral';
  height?: number;
  showValue?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  variant = 'primary',
  height = 6,
  showValue = false,
  className = '',
  style,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const getColor = () => {
    switch (variant) {
      case 'success':
        return 'var(--r8-brand-emerald)';
      case 'warning':
        return 'var(--r8-brand-accent)';
      case 'coral':
        return 'var(--r8-brand-coral)';
      case 'primary':
      default:
        return 'var(--r8-brand-primary)';
    }
  };

  return (
    <div
      className={`r8-progress-wrapper ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        width: '100%',
        ...style,
      }}
    >
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        style={{
          flex: 1,
          height: `${height}px`,
          backgroundColor: 'var(--r8-bg-subtle)',
          borderRadius: 'var(--r8-radius-full)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percentage}%`,
            backgroundColor: getColor(),
            borderRadius: 'var(--r8-radius-full)',
            transition: 'width var(--r8-motion-standard)',
          }}
        />
      </div>
      {showValue && (
        <span
          className="r8-tabular-num"
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--r8-text-secondary)',
            minWidth: '32px',
            textAlign: 'right',
          }}
        >
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
};
