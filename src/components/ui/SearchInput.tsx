import React from 'react';
import { Search, X } from 'lucide-react';

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  hotkey?: string;
  fullWidth?: boolean;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value,
      onChange,
      onClear,
      hotkey = '/',
      fullWidth = true,
      placeholder = 'Search...',
      disabled,
      className = '',
      style,
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
        <span
          style={{
            position: 'absolute',
            left: '12px',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none',
            color: 'var(--r8-text-muted)',
          }}
        >
          <Search size={16} />
        </span>
        <input
          ref={ref}
          type="text"
          aria-label={props['aria-label'] || placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`r8-search-input r8-focus-ring ${className}`}
          style={{
            height: 'var(--r8-control-h-md)',
            width: '100%',
            paddingLeft: '38px',
            paddingRight: value ? '34px' : hotkey ? '42px' : '12px',
            backgroundColor: 'var(--r8-bg-surface)',
            color: 'var(--r8-text-primary)',
            border: '1px solid var(--r8-border-subtle)',
            borderRadius: 'var(--r8-radius-full)',
            fontSize: '0.875rem',
            transition: 'border-color var(--r8-motion-fast), box-shadow var(--r8-motion-fast)',
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? 'not-allowed' : 'text',
            ...style,
          }}
          {...props}
        />
        {value ? (
          <button
            type="button"
            onClick={() => {
              onChange('');
              onClear?.();
            }}
            aria-label="Clear search"
            style={{
              position: 'absolute',
              right: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: 'var(--r8-bg-subtle)',
              color: 'var(--r8-text-secondary)',
              cursor: 'pointer',
              border: 'none',
            }}
          >
            <X size={12} />
          </button>
        ) : hotkey ? (
          <kbd
            style={{
              position: 'absolute',
              right: '10px',
              padding: '1px 6px',
              fontSize: '0.7rem',
              fontWeight: 600,
              borderRadius: 'var(--r8-radius-xs)',
              backgroundColor: 'var(--r8-bg-subtle)',
              border: '1px solid var(--r8-border-subtle)',
              color: 'var(--r8-text-muted)',
              fontFamily: 'var(--r8-font-mono)',
              pointerEvents: 'none',
            }}
          >
            {hotkey}
          </kbd>
        ) : null}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
