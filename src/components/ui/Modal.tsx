import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  style?: React.CSSProperties;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  className = '',
  style,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);
  const titleId = useId();
  const descriptionId = useId();
  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const focusable = () => Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex="0"]') ?? []).filter(node => node.getClientRects().length > 0);
    const frame = requestAnimationFrame(() => (focusable()[0] ?? dialogRef.current)?.focus());
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        closeRef.current();
      }
      if (e.key === 'Tab') {
        const nodes = focusable();
        const first = nodes[0]; const last = nodes[nodes.length - 1];
        if (!first) { e.preventDefault(); dialogRef.current?.focus(); }
        else if (e.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.body.style.overflow = 'hidden';
    dialogRef.current?.addEventListener('keydown', handleKeyDown);
    const dialog = dialogRef.current;
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      dialog?.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getMaxWidth = () => {
    switch (size) {
      case 'sm':
        return '400px';
      case 'lg':
        return '680px';
      case 'xl':
        return '860px';
      case 'md':
      default:
        return '520px';
    }
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
      aria-label={title ? undefined : 'Dialog'}
      aria-describedby={description ? descriptionId : undefined}
      ref={dialogRef}
      tabIndex={-1}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 'var(--r8-z-modal)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(8px, 2.5vw, 16px)',
        boxSizing: 'border-box',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(3px)',
          animation: 'fadeIn var(--r8-motion-fast)',
        }}
      />

      {/* Modal Surface */}
      <div
        className={`r8-modal ${className}`}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: `min(calc(100vw - 16px), ${getMaxWidth()})`,
          maxHeight: '92dvh',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--r8-bg-surface)',
          border: '1px solid var(--r8-border-subtle)',
          borderRadius: 'var(--r8-radius-lg)',
          boxShadow: 'var(--r8-shadow-modal)',
          overflow: 'hidden',
          animation: 'popIn var(--r8-motion-fast)',
          zIndex: 1,
          ...style,
        }}
      >
        {/* Header */}
        {(title || description) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: '1px solid var(--r8-border-subtle)',
            }}
          >
            <div>
              {title && (
                <h3
                  id={titleId}
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    color: 'var(--r8-text-primary)',
                    margin: 0,
                  }}
                >
                  {title}
                </h3>
              )}
              {description && (
                <p
                  id={descriptionId}
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--r8-text-secondary)',
                    margin: '2px 0 0 0',
                  }}
                >
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="r8-focus-ring"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                borderRadius: 'var(--r8-radius-xs)',
                border: 'none',
                backgroundColor: 'transparent',
                color: 'var(--r8-text-muted)',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Scrollable Body */}
        <div
          style={{
            padding: '20px',
            overflowY: 'auto',
            flex: 1,
          }}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '10px',
              padding: '12px 20px',
              borderTop: '1px solid var(--r8-border-subtle)',
              backgroundColor: 'var(--r8-bg-subtle)',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>, document.body
  );
};
