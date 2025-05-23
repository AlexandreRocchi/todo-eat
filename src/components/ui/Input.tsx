import React from 'react';
import { cn } from '../../utils/cn';

type InputSize = 'sm' | 'md' | 'lg';
type InputVariant = 'default' | 'error' | 'success';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  size?: InputSize;
  variant?: InputVariant;
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  size = 'md',
  variant = 'default',
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  id,
  ...props
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const hasError = Boolean(error);
  const actualVariant = hasError ? 'error' : variant;

  const sizeClasses = {
    sm: 'input-sm',
    md: 'input-md',
    lg: 'input-lg',
  };

  const variantClasses = {
    default: '',
    error: 'input-error',
    success: 'border-success-500 focus:border-success-500 focus:ring-success-500/20',
  };

  return (
    <div className={cn('space-y-2', fullWidth && 'w-full')}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-neutral-700"
        >
          {label}
          {props.required && (
            <span className="text-error-500 ml-1" aria-label="requis">*</span>
          )}
        </label>
      )}

      {/* Input container */}
      <div className="relative">
        {/* Left icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
            {leftIcon}
          </div>
        )}

        {/* Input */}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            sizeClasses[size],
            variantClasses[actualVariant],
            {
              'pl-10': leftIcon,
              'pr-10': rightIcon,
            },
            className
          )}
          aria-invalid={hasError}
          aria-describedby={
            cn(
              error && `${inputId}-error`,
              helperText && `${inputId}-helper`
            ).trim() || undefined
          }
          {...props}
        />

        {/* Right icon */}
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
            {rightIcon}
          </div>
        )}
      </div>

      {/* Helper text and error */}
      <div className="space-y-1">
        {error && (
          <p 
            id={`${inputId}-error`}
            className="text-sm text-error-600 flex items-center"
            role="alert"
          >
            <svg 
              className="w-4 h-4 mr-1 flex-shrink-0" 
              fill="currentColor" 
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path 
                fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                clipRule="evenodd" 
              />
            </svg>
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p 
            id={`${inputId}-helper`}
            className="text-sm text-neutral-500"
          >
            {helperText}
          </p>
        )}
      </div>
    </div>
  );
});

Input.displayName = 'Input';

export default Input;