import React from 'react';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
  className?: string;
  style?: React.CSSProperties;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  className = '',
  style,
}) => {
  const isSm = size === 'sm';
  const trackW = isSm ? '36px' : '44px';
  const trackH = isSm ? '20px' : '24px';
  const thumbDim = isSm ? '16px' : '20px';
  const thumbOffset = isSm ? '16px' : '20px';

  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        userSelect: 'none',
        ...style,
      }}
      className={`r8-switch-label ${className}`}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className="r8-focus-ring"
        style={{
          width: trackW,
          height: trackH,
          borderRadius: 'var(--r8-radius-full)',
          backgroundColor: checked ? 'var(--r8-brand-emerald)' : 'var(--r8-bg-muted)',
          border: '1px solid transparent',
          position: 'relative',
          padding: '1px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'background-color var(--r8-motion-fast)',
        }}
      >
        <span
          style={{
            display: 'block',
            width: thumbDim,
            height: thumbDim,
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            boxShadow: 'var(--r8-shadow-sm)',
            transform: checked ? `translateX(${thumbOffset})` : 'translateX(0)',
            transition: 'transform var(--r8-motion-fast)',
          }}
        />
      </button>

      {(label || description) && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {label && (
            <span
              style={{
                fontSize: isSm ? '0.8rem' : '0.875rem',
                fontWeight: 500,
                color: 'var(--r8-text-primary)',
              }}
            >
              {label}
            </span>
          )}
          {description && (
            <span style={{ fontSize: '0.75rem', color: 'var(--r8-text-muted)' }}>
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
};
