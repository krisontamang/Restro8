import React from 'react';

export interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
  className = '',
  style,
}) => {
  return (
    <div
      className={`r8-form-field ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        width: '100%',
        ...style,
      }}
    >
      {label && (
        <label
          htmlFor={htmlFor}
          style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--r8-text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {label}
          {required && <span style={{ color: 'var(--r8-brand-coral)' }}>*</span>}
        </label>
      )}
      {children}
      {hint && !error && (
        <span style={{ fontSize: '0.74rem', color: 'var(--r8-text-muted)' }}>{hint}</span>
      )}
      {error && (
        <span
          style={{
            fontSize: '0.74rem',
            color: 'var(--r8-brand-coral)',
            fontWeight: 500,
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
};
