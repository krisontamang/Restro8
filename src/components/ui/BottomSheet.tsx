import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxHeight?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxHeight = '85vh',
  className = '',
  style,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 'var(--r8-z-drawer)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(2px)',
          animation: 'fadeIn var(--r8-motion-fast)',
        }}
      />

      {/* Sheet Content */}
      <div
        className={`r8-bottom-sheet ${className}`}
        style={{
          position: 'relative',
          width: '100%',
          maxHeight,
          backgroundColor: 'var(--r8-bg-surface)',
          borderTopLeftRadius: 'var(--r8-radius-lg)',
          borderTopRightRadius: 'var(--r8-radius-lg)',
          borderTop: '1px solid var(--r8-border-subtle)',
          boxShadow: 'var(--r8-shadow-modal)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1,
          animation: 'slideInUp 200ms cubic-bezier(0.16, 1, 0.3, 1)',
          ...style,
        }}
      >
        {/* Grab Handle */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            padding: '8px 0 4px 0',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '4px',
              borderRadius: '2px',
              backgroundColor: 'var(--r8-border-prominent)',
            }}
          />
        </div>

        {/* Sheet Header */}
        {title && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 16px 12px 16px',
              borderBottom: '1px solid var(--r8-border-subtle)',
            }}
          >
            <h3
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--r8-text-primary)',
                margin: 0,
              }}
            >
              {title}
            </h3>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close sheet"
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                color: 'var(--r8-text-muted)',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Sheet Body */}
        <div
          style={{
            padding: '16px',
            overflowY: 'auto',
            flex: 1,
          }}
        >
          {children}
        </div>

        {/* Sheet Footer */}
        {footer && (
          <div
            style={{
              padding: '12px 16px',
              borderTop: '1px solid var(--r8-border-subtle)',
              backgroundColor: 'var(--r8-bg-subtle)',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
