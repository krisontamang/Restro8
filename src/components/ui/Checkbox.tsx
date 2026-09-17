import React from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, checked, disabled, className = '', style, id, ...props }, ref) => {
    const inputId = id || (label ? `chk-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

    return (
      <label
        htmlFor={inputId}
        style={{
          display: 'inline-flex',
          alignItems: 'flex-start',
          gap: '8px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          userSelect: 'none',
          ...style,
        }}
        className={`r8-checkbox-label ${className}`}
      >
        <div style={{ position: 'relative', marginTop: '2px' }}>
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            className="r8-focus-ring"
            style={{
              position: 'absolute',
              opacity: 0,
              width: '18px',
              height: '18px',
              margin: 0,
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
            {...props}
          />
          <div
            style={{
              width: '18px',
              height: '18px',
              borderRadius: 'var(--r8-radius-xs)',
              border: `1.5px solid ${checked ? 'var(--r8-brand-primary)' : 'var(--r8-border-prominent)'}`,
              backgroundColor: checked ? 'var(--r8-brand-primary)' : 'var(--r8-bg-surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all var(--r8-motion-fast)',
            }}
          >
            {checked && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
          </div>
        </div>
        {(label || description) && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {label && (
              <span
                style={{
                  fontSize: '0.875rem',
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
  }
);

Checkbox.displayName = 'Checkbox';
