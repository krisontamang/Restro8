import React from 'react';
import { Badge } from '../Badge';
import { TableStatus } from '../../../types/restaurant';

export interface TableStatusBadgeProps {
  status: TableStatus;
  durationMinutes?: number;
  size?: 'sm' | 'md';
  className?: string;
  style?: React.CSSProperties;
}

export const TableStatusBadge: React.FC<TableStatusBadgeProps> = ({
  status,
  durationMinutes,
  size = 'md',
  className = '',
  style,
}) => {
  const getConfig = (): {
    label: string;
    variant: 'success' | 'danger' | 'info' | 'warning';
  } => {
    switch (status) {
      case 'available':
        return { label: 'Vacant', variant: 'success' };
      case 'occupied':
        return {
          label: durationMinutes !== undefined ? `Occupied (${durationMinutes}m)` : 'Occupied',
          variant: 'danger',
        };
      case 'reserved':
        return { label: 'Reserved', variant: 'info' };
      case 'dirty':
        return { label: 'Needs Cleaning', variant: 'warning' };
      case 'cleaning':
        return { label: 'Cleaning', variant: 'warning' };
      case 'payment_pending':
        return { label: 'Bill Printed', variant: 'info' };
      default:
        return { label: status, variant: 'success' };
    }
  };

  const cfg = getConfig();

  return (
    <Badge
      variant={cfg.variant}
      size={size}
      dot
      className={`r8-table-status-badge ${className}`}
      style={style}
    >
      {cfg.label}
    </Badge>
  );
};
