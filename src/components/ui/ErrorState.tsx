import React from 'react';
import { AlertOctagon, RotateCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Try Again',
  className = '',
  style,
}) => {
  return (
    <div
      role="alert"
      className={`r8-error-state ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'var(--r8-space-8) var(--r8-space-4)',
        backgroundColor: 'var(--r8-bg-surface)',
        border: '1px solid rgba(239, 68, 68, 0.25)',
        borderRadius: 'var(--r8-radius-md)',
        maxWidth: '480px',
        margin: '0 auto',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: 'var(--r8-brand-coral-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--r8-brand-coral)',
          marginBottom: 'var(--r8-space-3)',
        }}
      >
        <AlertOctagon size={24} />
      </div>
      <h4
        style={{
          fontSize: '1rem',
          fontWeight: 600,
          color: 'var(--r8-brand-coral)',
          margin: '0 0 var(--r8-space-1) 0',
        }}
      >
        {title}
      </h4>
      <p
        style={{
          fontSize: '0.84rem',
          color: 'var(--r8-text-secondary)',
          maxWidth: '360px',
          margin: '0 0 var(--r8-space-4) 0',
          lineHeight: 1.45,
        }}
      >
        {message}
      </p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} leftIcon={<RotateCw size={14} />}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
};
