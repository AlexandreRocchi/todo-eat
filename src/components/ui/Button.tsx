import React from 'react';
import { cn } from '../../utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth = false,
  loading = false,
  children,
  className,
  disabled,
  ...props
}, ref) => {
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  };

  const sizeClasses = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
    icon: 'btn-icon',
  };

  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      className={cn(
        'btn-base',
        variantClasses[variant],
        sizeClasses[size],
        {
          'w-full': fullWidth,
          'cursor-not-allowed': isDisabled,
          'relative': loading,
        },
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      <div className={cn('flex items-center justify-center', {
        'opacity-0': loading,
      })}>
        {icon && (
          <span className={cn('flex-shrink-0', {
            'mr-2': children && size !== 'icon',
          })}>
            {icon}
          </span>
        )}
        {children}
      </div>
    </button>
  );
});

Button.displayName = 'Button';

export default Button;