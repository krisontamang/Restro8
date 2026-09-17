import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'danger' ? 'destructive' : variant === 'warning' ? 'accent' : 'primary'}
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor:
              variant === 'danger'
                ? 'var(--r8-brand-coral-subtle)'
                : 'var(--r8-brand-accent-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color:
              variant === 'danger' ? 'var(--r8-brand-coral)' : 'var(--r8-brand-accent)',
            flexShrink: 0,
          }}
        >
          <AlertTriangle size={20} />
        </div>
        <div>
          <h4
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--r8-text-primary)',
              margin: '0 0 4px 0',
            }}
          >
            {title}
          </h4>
          <p
            style={{
              fontSize: '0.84rem',
              color: 'var(--r8-text-secondary)',
              margin: 0,
              lineHeight: 1.45,
            }}
          >
            {message}
          </p>
        </div>
      </div>
    </Modal>
  );
};
