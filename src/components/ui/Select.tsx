import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOption[];
  isError?: boolean;
  fullWidth?: boolean;
  placeholder?: string;
  children?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      isError = false,
      fullWidth = true,
      placeholder,
      disabled,
      className = '',
      style,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        style={{
          position: 'relative',
          display: fullWidth ? 'flex' : 'inline-flex',
          alignItems: 'center',
          width: fullWidth ? '100%' : 'auto',
        }}
      >
        <select
          ref={ref}
          disabled={disabled}
          className={`r8-select r8-focus-ring ${className}`}
          style={{
            height: 'var(--r8-control-h-md)',
            width: '100%',
            paddingLeft: '12px',
            paddingRight: '36px',
            backgroundColor: 'var(--r8-bg-surface)',
            color: 'var(--r8-text-primary)',
            border: `1px solid ${isError ? 'var(--r8-brand-coral)' : 'var(--r8-border-subtle)'}`,
            borderRadius: 'var(--r8-radius-sm)',
            fontSize: '0.875rem',
            appearance: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
            transition: 'border-color var(--r8-motion-fast)',
            colorScheme: 'light dark',
            ...style,
          }}
          {...props}
        >
          {placeholder && (
            <option value="" disabled style={{ backgroundColor: 'var(--r8-bg-surface, #ffffff)', color: 'var(--r8-text-muted, #64748b)' }}>
              {placeholder}
            </option>
          )}
          {options
            ? options.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                  style={{
                    backgroundColor: 'var(--r8-bg-surface, #ffffff)',
                    color: 'var(--r8-text-primary, #111827)',
                  }}
                >
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <span
          style={{
            position: 'absolute',
            right: '10px',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none',
            color: 'var(--r8-text-muted)',
          }}
        >
          <ChevronDown size={16} />
        </span>
      </div>
    );
  }
);

Select.displayName = 'Select';
