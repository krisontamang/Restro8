import React from 'react';

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  bordered?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  (
    {
      bordered = true,
      padding = 'md',
      className = '',
      style,
      children,
      ...props
    },
    ref
  ) => {
    const getPaddingStyles = () => {
      switch (padding) {
        case 'none':
          return { padding: 0 };
        case 'sm':
          return { padding: 'var(--r8-space-2)' };
        case 'lg':
          return { padding: 'var(--r8-space-6)' };
        case 'md':
        default:
          return { padding: 'var(--r8-space-4)' };
      }
    };

    return (
      <div
        ref={ref}
        className={`r8-panel ${className}`}
        style={{
          backgroundColor: 'var(--r8-bg-surface)',
          border: bordered ? '1px solid var(--r8-border-subtle)' : 'none',
          borderRadius: 'var(--r8-radius-md)',
          boxSizing: 'border-box',
          ...getPaddingStyles(),
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Panel.displayName = 'Panel';
