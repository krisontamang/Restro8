import React from 'react';
import { Badge } from '../Badge';
import { OrderStatus } from '../../../types/restaurant';

export interface OrderStatusBadgeProps {
  status: OrderStatus | 'draft' | 'kot_fired' | 'paid' | 'pending';
  size?: 'sm' | 'md';
  className?: string;
  style?: React.CSSProperties;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
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
      case 'new':
      case 'draft':
      case 'pending':
        return { label: 'Draft / New', variant: 'neutral' };
      case 'kot_fired':
        return { label: 'KOT Fired', variant: 'primary' };
      case 'preparing':
        return { label: 'Preparing', variant: 'warning' };
      case 'ready':
        return { label: 'Food Ready', variant: 'info' };
      case 'served':
        return { label: 'Served', variant: 'success' };
      case 'completed':
      case 'paid':
        return { label: 'Paid & Closed', variant: 'success' };
      case 'cancelled':
        return { label: 'Cancelled / Void', variant: 'danger' };
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
      className={`r8-order-status-badge ${className}`}
      style={style}
    >
      {cfg.label}
    </Badge>
  );
};
