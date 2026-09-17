import React from 'react';
import { ButtonVariant, ButtonSize } from './Button';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon: React.ReactNode;
  label: string; // Accessible aria-label
  isLoading?: boolean;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      variant = 'secondary',
      size = 'md',
      icon,
      label,
      isLoading = false,
      disabled,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const getDim = () => {
      switch (size) {
        case 'sm':
          return { w: '32px', h: '32px', r: 'var(--r8-radius-sm)' };
        case 'lg':
          return { w: '48px', h: '48px', r: 'var(--r8-radius-md)' };
        case 'md':
        default:
          return { w: '40px', h: '40px', r: 'var(--r8-radius-sm)' };
      }
    };

    const dim = getDim();

    const getVariantStyles = (): React.CSSProperties => {
      switch (variant) {
        case 'primary':
          return {
            backgroundColor: 'var(--r8-brand-primary)',
            color: '#FFFFFF',
            border: '1px solid transparent',
          };
        case 'secondary':
          return {
            backgroundColor: 'var(--r8-bg-surface)',
            color: 'var(--r8-text-primary)',
            border: '1px solid var(--r8-border-subtle)',
          };
        case 'outline':
          return {
            backgroundColor: 'transparent',
            color: 'var(--r8-text-primary)',
            border: '1px solid var(--r8-border-prominent)',
          };
        case 'ghost':
          return {
            backgroundColor: 'transparent',
            color: 'var(--r8-text-secondary)',
            border: '1px solid transparent',
          };
        case 'destructive':
          return {
            backgroundColor: 'var(--r8-brand-coral)',
            color: '#FFFFFF',
            border: '1px solid transparent',
          };
        case 'success':
          return {
            backgroundColor: 'var(--r8-brand-emerald)',
            color: '#FFFFFF',
            border: '1px solid transparent',
          };
        default:
          return {};
      }
    };

    return (
      <button
        ref={ref}
        aria-label={label}
        title={label}
        disabled={disabled || isLoading}
        className={`r8-btn-icon r8-focus-ring ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: dim.w,
          height: dim.h,
          minWidth: dim.w,
          minHeight: dim.h,
          borderRadius: dim.r,
          cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: 'all var(--r8-motion-fast)',
          ...getVariantStyles(),
          ...style,
        }}
        {...props}
      >
        {icon}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
