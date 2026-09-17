import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isError?: boolean;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      leftIcon,
      rightIcon,
      isError = false,
      fullWidth = true,
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
        {leftIcon && (
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
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          disabled={disabled}
          className={`r8-input r8-focus-ring ${className}`}
          style={{
            height: 'var(--r8-control-h-md)',
            width: '100%',
            paddingLeft: leftIcon ? '38px' : '12px',
            paddingRight: rightIcon ? '38px' : '12px',
            backgroundColor: 'var(--r8-bg-surface)',
            color: 'var(--r8-text-primary)',
            border: `1px solid ${isError ? 'var(--r8-brand-coral)' : 'var(--r8-border-subtle)'}`,
            borderRadius: 'var(--r8-radius-sm)',
            fontSize: '0.875rem',
            transition: 'border-color var(--r8-motion-fast), box-shadow var(--r8-motion-fast)',
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? 'not-allowed' : 'text',
            ...style,
          }}
          {...props}
        />
        {rightIcon && (
          <span
            style={{
              position: 'absolute',
              right: '12px',
              display: 'flex',
              alignItems: 'center',
              color: 'var(--r8-text-muted)',
            }}
          >
            {rightIcon}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
