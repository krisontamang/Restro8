import React from 'react';

export interface PageProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Page: React.FC<PageProps> = ({ children, className = '', style }) => {
  return (
    <div
      className={`r8-page ${className}`}
      style={{
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        padding: 'var(--r8-page-padding, var(--r8-space-6))',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--r8-space-5)',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  primaryAction?: React.ReactNode;
  secondaryActions?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  badge,
  breadcrumbs,
  primaryAction,
  secondaryActions,
  className = '',
  style,
}) => {
  return (
    <header
      className={`r8-page-header ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--r8-space-2)',
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {breadcrumbs && <div style={{ marginBottom: '4px' }}>{breadcrumbs}</div>}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 'var(--r8-space-4)',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h1
              style={{
                fontSize: 'clamp(1.15rem, 3.5vw, 1.45rem)',
                fontWeight: 700,
                color: 'var(--r8-text-primary)',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              {title}
            </h1>
            {badge}
          </div>
          {description && (
            <p
              style={{
                fontSize: '0.84rem',
                color: 'var(--r8-text-secondary)',
                margin: '4px 0 0 0',
              }}
            >
              {description}
            </p>
          )}
        </div>

        {(primaryAction || secondaryActions) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            {secondaryActions}
            {primaryAction}
          </div>
        )}
      </div>
    </header>
  );
};

export interface PageToolbarProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const PageToolbar: React.FC<PageToolbarProps> = ({ children, className = '', style }) => {
  return (
    <div
      className={`r8-page-toolbar ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--r8-space-3)',
        flexWrap: 'wrap',
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export interface PageContentProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const PageContent: React.FC<PageContentProps> = ({ children, className = '', style }) => {
  return (
    <div
      className={`r8-page-content ${className}`}
      style={{
        width: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--r8-space-5)',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
