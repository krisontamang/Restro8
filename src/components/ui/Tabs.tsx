import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  count?: number | string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'pill' | 'underline' | 'segmented';
  fullWidth?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'pill',
  fullWidth = false,
  className = '',
  style,
}) => {
  if (variant === 'segmented') {
    return (
      <div
        role="tablist"
        className={`r8-tabs r8-tabs-segmented ${className}`}
        style={{
          display: fullWidth ? 'flex' : 'inline-flex',
          padding: '3px',
          backgroundColor: 'var(--r8-bg-subtle)',
          borderRadius: 'var(--r8-radius-sm)',
          gap: '2px',
          overflowX: 'auto',
          maxWidth: '100%',
          ...style,
        }}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className="r8-focus-ring"
              style={{
                flex: fullWidth ? 1 : 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--r8-radius-xs)',
                fontSize: '0.82rem',
                fontWeight: isActive ? 600 : 500,
                backgroundColor: isActive ? 'var(--r8-bg-surface)' : 'transparent',
                color: isActive ? 'var(--r8-text-primary)' : 'var(--r8-text-secondary)',
                boxShadow: isActive ? 'var(--r8-shadow-sm)' : 'none',
                border: 'none',
                cursor: tab.disabled ? 'not-allowed' : 'pointer',
                opacity: tab.disabled ? 0.5 : 1,
                whiteSpace: 'nowrap',
                transition: 'all var(--r8-motion-fast)',
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  style={{
                    padding: '1px 6px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    borderRadius: 'var(--r8-radius-full)',
                    backgroundColor: isActive ? 'var(--r8-bg-subtle)' : 'var(--r8-border-subtle)',
                    color: isActive ? 'var(--r8-brand-primary)' : 'var(--r8-text-muted)',
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'underline') {
    return (
      <div
        role="tablist"
        className={`r8-tabs r8-tabs-underline ${className}`}
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--r8-border-subtle)',
          gap: '16px',
          overflowX: 'auto',
          maxWidth: '100%',
          ...style,
        }}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className="r8-focus-ring"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 4px',
                border: 'none',
                borderBottom: `2px solid ${isActive ? 'var(--r8-brand-primary)' : 'transparent'}`,
                backgroundColor: 'transparent',
                color: isActive ? 'var(--r8-brand-primary)' : 'var(--r8-text-secondary)',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 500,
                cursor: tab.disabled ? 'not-allowed' : 'pointer',
                opacity: tab.disabled ? 0.5 : 1,
                whiteSpace: 'nowrap',
                transition: 'all var(--r8-motion-fast)',
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  style={{
                    padding: '1px 6px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    borderRadius: 'var(--r8-radius-full)',
                    backgroundColor: isActive ? 'var(--r8-brand-primary-subtle)' : 'var(--r8-bg-subtle)',
                    color: isActive ? 'var(--r8-brand-primary)' : 'var(--r8-text-muted)',
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Default: pill
  return (
    <div
      role="tablist"
      className={`r8-tabs r8-tabs-pill ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        overflowX: 'auto',
        maxWidth: '100%',
        paddingBottom: '2px',
        ...style,
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className="r8-focus-ring"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--r8-radius-full)',
              border: `1px solid ${isActive ? 'transparent' : 'var(--r8-border-subtle)'}`,
              backgroundColor: isActive ? 'var(--r8-brand-primary)' : 'var(--r8-bg-surface)',
              color: isActive ? '#FFFFFF' : 'var(--r8-text-secondary)',
              fontSize: '0.82rem',
              fontWeight: isActive ? 600 : 500,
              cursor: tab.disabled ? 'not-allowed' : 'pointer',
              opacity: tab.disabled ? 0.5 : 1,
              whiteSpace: 'nowrap',
              boxShadow: isActive ? 'var(--r8-shadow-sm)' : 'none',
              transition: 'all var(--r8-motion-fast)',
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                style={{
                  padding: '1px 6px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  borderRadius: 'var(--r8-radius-full)',
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : 'var(--r8-bg-subtle)',
                  color: isActive ? '#FFFFFF' : 'var(--r8-text-muted)',
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
