import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  circle?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '16px',
  borderRadius = 'var(--r8-radius-sm)',
  circle = false,
  className = '',
  style,
  ...props
}) => {
  return (
    <div
      className={`r8-skeleton ${className}`}
      style={{
        width: circle ? height : width,
        height,
        borderRadius: circle ? '50%' : borderRadius,
        backgroundColor: 'var(--r8-bg-subtle)',
        backgroundImage:
          'linear-gradient(90deg, rgba(255,255,255, 0) 0, rgba(255,255,255, 0.08) 50%, rgba(255,255,255, 0) 100%)',
        backgroundSize: '200% 100%',
        animation: 'skeletonPulse 1.5s ease-in-out infinite',
        boxSizing: 'border-box',
        ...style,
      }}
      {...props}
    />
  );
};
