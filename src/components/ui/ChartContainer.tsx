import React from 'react';

export interface ChartContainerProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  height?: number | string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  subtitle,
  action,
  height = 240,
  children,
  className = '',
  style,
}) => {
  return (
    <div
      className={`r8-chart-container ${className}`}
      style={{
        backgroundColor: 'var(--r8-bg-surface)',
        border: '1px solid var(--r8-border-subtle)',
        borderRadius: 'var(--r8-radius-md)',
        padding: '16px',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        ...style,
      }}
    >
      {(title || action) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '10px',
            marginBottom: '12px',
          }}
        >
          <div>
            {title && (
              <h4
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: 'var(--r8-text-primary)',
                  margin: 0,
                }}
              >
                {title}
              </h4>
            )}
            {subtitle && (
              <p
                style={{
                  fontSize: '0.76rem',
                  color: 'var(--r8-text-secondary)',
                  margin: '2px 0 0 0',
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div
        style={{
          width: '100%',
          height,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
};
