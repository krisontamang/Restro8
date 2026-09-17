import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive' | 'selected';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  fullHeight?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      fullHeight = false,
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
          return { padding: 'var(--r8-space-3)' };
        case 'lg':
          return { padding: 'var(--r8-space-6)' };
        case 'md':
        default:
          return { padding: 'var(--r8-space-4)' };
      }
    };

    const getVariantStyles = (): React.CSSProperties => {
      switch (variant) {
        case 'elevated':
          return {
            backgroundColor: 'var(--r8-bg-elevated)',
            border: '1px solid var(--r8-border-subtle)',
            boxShadow: 'var(--r8-shadow-md)',
          };
        case 'interactive':
          return {
            backgroundColor: 'var(--r8-bg-surface)',
            border: '1px solid var(--r8-border-subtle)',
            cursor: 'pointer',
            transition: 'border-color var(--r8-motion-fast), box-shadow var(--r8-motion-fast), transform var(--r8-motion-fast)',
          };
        case 'selected':
          return {
            backgroundColor: 'var(--r8-brand-primary-subtle)',
            border: '1.5px solid var(--r8-brand-primary)',
          };
        case 'default':
        default:
          return {
            backgroundColor: 'var(--r8-bg-surface)',
            border: '1px solid var(--r8-border-subtle)',
            boxShadow: 'var(--r8-shadow-sm)',
          };
      }
    };

    return (
      <div
        ref={ref}
        className={`r8-card r8-card-${variant} ${className}`}
        style={{
          borderRadius: 'var(--r8-radius-md)',
          height: fullHeight ? '100%' : 'auto',
          boxSizing: 'border-box',
          ...getVariantStyles(),
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

Card.displayName = 'Card';

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  style,
  children,
  ...props
}) => (
  <div
    className={`r8-card-header ${className}`}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '8px',
      marginBottom: 'var(--r8-space-3)',
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className = '',
  style,
  children,
  ...props
}) => (
  <h3
    className={`r8-card-title ${className}`}
    style={{
      fontSize: '1rem',
      fontWeight: 600,
      color: 'var(--r8-text-primary)',
      margin: 0,
      ...style,
    }}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className = '',
  style,
  children,
  ...props
}) => (
  <p
    className={`r8-card-desc ${className}`}
    style={{
      fontSize: '0.78rem',
      color: 'var(--r8-text-secondary)',
      margin: '2px 0 0 0',
      ...style,
    }}
    {...props}
  >
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  style,
  children,
  ...props
}) => (
  <div className={`r8-card-content ${className}`} style={{ ...style }} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  style,
  children,
  ...props
}) => (
  <div
    className={`r8-card-footer ${className}`}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: '8px',
      marginTop: 'var(--r8-space-4)',
      paddingTop: 'var(--r8-space-3)',
      borderTop: '1px solid var(--r8-border-subtle)',
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);
