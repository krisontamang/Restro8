import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  className = '',
  style,
}) => {
  return (
    <div
      className={`r8-pagination ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        padding: '10px 0',
        fontSize: '0.82rem',
        color: 'var(--r8-text-secondary)',
        flexWrap: 'wrap',
        ...style,
      }}
    >
      {totalItems !== undefined && pageSize !== undefined && (
        <span className="r8-tabular-num">
          Showing {(currentPage - 1) * pageSize + 1} to{' '}
          {Math.min(currentPage * pageSize, totalItems)} of {totalItems} entries
        </span>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
          className="r8-focus-ring"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: 'var(--r8-radius-sm)',
            border: '1px solid var(--r8-border-subtle)',
            backgroundColor: 'var(--r8-bg-surface)',
            color: 'var(--r8-text-primary)',
            cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
            opacity: currentPage <= 1 ? 0.4 : 1,
            transition: 'background-color var(--r8-motion-fast)',
          }}
        >
          <ChevronLeft size={16} />
        </button>

        <span
          className="r8-tabular-num"
          style={{
            padding: '0 8px',
            fontWeight: 600,
            color: 'var(--r8-text-primary)',
          }}
        >
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
          className="r8-focus-ring"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: 'var(--r8-radius-sm)',
            border: '1px solid var(--r8-border-subtle)',
            backgroundColor: 'var(--r8-bg-surface)',
            color: 'var(--r8-text-primary)',
            cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
            opacity: currentPage >= totalPages ? 0.4 : 1,
            transition: 'background-color var(--r8-motion-fast)',
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
