import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

type SelectSize = 'sm' | 'md' | 'lg';
type SelectVariant = 'default' | 'error' | 'success';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: SelectSize;
  variant?: SelectVariant;
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
  onChange: (value: string) => void;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({
  size = 'md',
  variant = 'default',
  label,
  error,
  helperText,
  options,
  placeholder,
  fullWidth = false,
  className,
  onChange,
  value,
  id,
  ...props
}, ref) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={cn('space-y-2', fullWidth && 'w-full')}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={selectId}
          className="block text-sm font-medium text-neutral-700"
        >
          {label}
          {props.required && (
            <span className="text-error-500 ml-1" aria-label="requis">*</span>
          )}
        </label>
      )}

      {/* Select container */}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          value={value}
          onChange={handleChange}
          className={cn(
            sizeClasses[size],
            variantClasses[actualVariant],
            'appearance-none cursor-pointer pr-10',
            className
          )}
          aria-invalid={hasError}
          aria-describedby={
            cn(
              error && `${selectId}-error`,
              helperText && `${selectId}-helper`
            ).trim() || undefined
          }
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Chevron icon */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <ChevronDown className="w-4 h-4 text-neutral-400" />
        </div>
      </div>

      {/* Helper text and error */}
      <div className="space-y-1">
        {error && (
          <p 
            id={`${selectId}-error`}
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
            id={`${selectId}-helper`}
            className="text-sm text-neutral-500"
          >
            {helperText}
          </p>
        )}
      </div>
    </div>
  );
});

Select.displayName = 'Select';

export default Select;