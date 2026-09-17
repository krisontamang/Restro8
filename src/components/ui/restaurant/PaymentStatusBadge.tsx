import React from 'react';
import { Badge } from '../Badge';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'split';

export interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  size?: 'sm' | 'md';
  className?: string;
  style?: React.CSSProperties;
}

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({
  status,
  size = 'md',
  className = '',
  style,
}) => {
  const getConfig = (): {
    label: string;
    variant: 'neutral' | 'primary' | 'warning' | 'success' | 'danger' | 'info';
  } => {
    switch (status) {
      case 'paid':
        return { label: 'Settled', variant: 'success' };
      case 'pending':
        return { label: 'Unpaid', variant: 'warning' };
      case 'failed':
        return { label: 'Failed', variant: 'danger' };
      case 'refunded':
        return { label: 'Refunded', variant: 'danger' };
      case 'split':
        return { label: 'Split Paid', variant: 'info' };
      default:
        return { label: status, variant: 'neutral' };
    }
  };

  const cfg = getConfig();

  return (
    <Badge
      variant={cfg.variant}
      size={size}
      dot
      className={`r8-payment-status-badge ${className}`}
      style={style}
    >
      {cfg.label}
    </Badge>
  );
};
