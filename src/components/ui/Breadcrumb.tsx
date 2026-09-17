import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  style?: React.CSSProperties;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '', style }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`r8-breadcrumb ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '0.8rem',
        color: 'var(--r8-text-muted)',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            {item.onClick && !isLast ? (
              <button
                type="button"
                onClick={item.onClick}
                className="r8-focus-ring"
                style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: 'var(--r8-text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 500,
                  padding: '2px 4px',
                  borderRadius: 'var(--r8-radius-xs)',
                  transition: 'color var(--r8-motion-fast)',
                }}
              >
                {item.label}
              </button>
            ) : (
              <span
                style={{
                  color: isLast ? 'var(--r8-text-primary)' : 'var(--r8-text-secondary)',
                  fontWeight: isLast ? 600 : 500,
                  padding: '2px 4px',
                }}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
            {!isLast && <ChevronRight size={14} color="var(--r8-text-muted)" />}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
