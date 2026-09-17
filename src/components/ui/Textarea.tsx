import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  isError?: boolean;
  fullWidth?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      isError = false,
      fullWidth = true,
      disabled,
      className = '',
      style,
      rows = 3,
      ...props
    },
    ref
  ) => {
    return (
      <textarea
        ref={ref}
        disabled={disabled}
        rows={rows}
        className={`r8-textarea r8-focus-ring ${className}`}
        style={{
          width: fullWidth ? '100%' : 'auto',
          padding: '10px 12px',
          backgroundColor: 'var(--r8-bg-surface)',
          color: 'var(--r8-text-primary)',
          border: `1px solid ${isError ? 'var(--r8-brand-coral)' : 'var(--r8-border-subtle)'}`,
          borderRadius: 'var(--r8-radius-sm)',
          fontSize: '0.875rem',
          fontFamily: 'inherit',
          lineHeight: 1.5,
          resize: 'vertical',
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'text',
          transition: 'border-color var(--r8-motion-fast)',
          ...style,
        }}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
