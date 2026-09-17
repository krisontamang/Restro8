import React from 'react';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  margin?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  margin = 'md',
  className = '',
  style,
}) => {
  const isHoriz = orientation === 'horizontal';

  const getMargin = () => {
    switch (margin) {
      case 'none':
        return 0;
      case 'sm':
        return isHoriz ? '8px 0' : '0 8px';
      case 'lg':
        return isHoriz ? '24px 0' : '0 24px';
      case 'md':
      default:
        return isHoriz ? '16px 0' : '0 16px';
    }
  };

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={`r8-divider r8-divider-${orientation} ${className}`}
      style={{
        width: isHoriz ? '100%' : '1px',
        height: isHoriz ? '1px' : '100%',
        backgroundColor: 'var(--r8-border-subtle)',
        margin: getMargin(),
        flexShrink: 0,
        ...style,
      }}
    />
  );
};
