import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'success';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  hotkey?: string;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      hotkey,
      fullWidth = false,
      children,
      disabled,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const getVariantStyles = (): React.CSSProperties => {
      switch (variant) {
        case 'primary':
          return {
            backgroundColor: 'var(--r8-btn-primary-bg, var(--r8-brand-primary))',
            color: 'var(--r8-btn-primary-text, #FFFFFF)',
            border: '1px solid transparent',
            fontWeight: 600,
            boxShadow: 'var(--r8-shadow-sm)',
          };
        case 'secondary':
          return {
            backgroundColor: 'var(--r8-btn-secondary-bg, var(--r8-bg-surface))',
            color: 'var(--r8-btn-secondary-text, var(--r8-text-primary))',
            border: '1px solid var(--r8-btn-secondary-border, var(--r8-border-subtle))',
            boxShadow: 'var(--r8-shadow-sm)',
          };
        case 'accent':
          return {
            backgroundColor: 'var(--r8-btn-gold-bg, var(--r8-brand-accent))',
            color: 'var(--r8-btn-gold-text, #000000)',
            border: '1px solid transparent',
            fontWeight: 600,
            boxShadow: 'var(--r8-shadow-sm)',
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
            boxShadow: 'var(--r8-shadow-sm)',
          };
        case 'success':
          return {
            backgroundColor: 'var(--r8-brand-emerald)',
            color: '#FFFFFF',
            border: '1px solid transparent',
            boxShadow: 'var(--r8-shadow-sm)',
          };
        default:
          return {};
      }
    };

    const getSizeStyles = (): React.CSSProperties => {
      switch (size) {
        case 'sm':
          return {
            height: 'var(--r8-control-h-sm)',
            padding: '0 10px',
            fontSize: '0.8rem',
            gap: '6px',
            borderRadius: 'var(--r8-radius-sm)',
          };
        case 'lg':
          return {
            height: 'var(--r8-control-h-lg)',
            padding: '0 20px',
            fontSize: '0.95rem',
            gap: '10px',
            borderRadius: 'var(--r8-radius-md)',
            fontWeight: 600,
          };
        case 'md':
        default:
          return {
            height: 'var(--r8-control-h-md)',
            padding: '0 14px',
            fontSize: '0.875rem',
            gap: '8px',
            borderRadius: 'var(--r8-radius-sm)',
          };
      }
    };

    const baseStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 500,
      cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      width: fullWidth ? '100%' : 'auto',
      userSelect: 'none',
      whiteSpace: 'nowrap',
      transition: 'all var(--r8-motion-fast)',
      position: 'relative',
      ...getSizeStyles(),
      ...getVariantStyles(),
      ...style,
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`r8-btn r8-btn-${variant} r8-focus-ring ${className}`}
        style={baseStyles}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />
        ) : (
          leftIcon
        )}
        {children && <span>{children}</span>}
        {!isLoading && rightIcon}
        {hotkey && (
          <kbd
            style={{
              marginLeft: '4px',
              padding: '1px 5px',
              fontSize: '0.68rem',
              fontWeight: 600,
              borderRadius: 'var(--r8-radius-xs)',
              backgroundColor: 'rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              fontFamily: 'var(--r8-font-mono)',
            }}
          >
            {hotkey}
          </kbd>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
