import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
  style,
}) => {
  return (
    <div
      className={`r8-empty-state ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'var(--r8-space-8) var(--r8-space-4)',
        backgroundColor: 'var(--r8-bg-surface)',
        border: '1px dashed var(--r8-border-prominent)',
        borderRadius: 'var(--r8-radius-md)',
        maxWidth: '480px',
        margin: '0 auto',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {icon && (
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--r8-bg-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--r8-text-muted)',
            marginBottom: 'var(--r8-space-3)',
          }}
        >
          {icon}
        </div>
      )}
      <h4
        style={{
          fontSize: '1rem',
          fontWeight: 600,
          color: 'var(--r8-text-primary)',
          margin: '0 0 var(--r8-space-1) 0',
        }}
      >
        {title}
      </h4>
      <p
        style={{
          fontSize: '0.84rem',
          color: 'var(--r8-text-secondary)',
          maxWidth: '340px',
          margin: '0 0 var(--r8-space-4) 0',
          lineHeight: 1.45,
        }}
      >
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
