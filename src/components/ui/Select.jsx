import React from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = React.forwardRef(
  (
    {
      label,
      error,
      helperText,
      options = [],
      placeholder = 'Select an option',
      className = '',
      id,
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const isError = Boolean(error);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs sm:text-sm font-medium text-neutral-700 select-none"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={`
              w-full h-11 pl-3.5 pr-10 bg-neutral-0 text-neutral-800 text-sm rounded-lg border appearance-none transition-all duration-120
              focus:outline-none disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed
              ${
                isError
                  ? 'border-error-600 focus:border-error-600 focus:ring-2 focus:ring-error-50'
                  : 'border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
              }
              ${className}
            `}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {children
              ? children
              : options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
          </select>
          <ChevronDown className="absolute right-3.5 w-4 h-4 text-neutral-500 pointer-events-none" />
        </div>

        {(error || helperText) && (
          <span
            className={`text-xs ${
              isError ? 'text-error-600 font-medium' : 'text-neutral-500'
            }`}
          >
            {error || helperText}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
