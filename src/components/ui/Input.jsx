import React from 'react';

export const Input = React.forwardRef(
  (
    {
      label,
      error,
      helperText,
      prefix,
      suffix,
      action,
      currency,
      tabular = false,
      alignRight = false,
      icon: Icon,
      className = '',
      containerClassName = '',
      id: providedId,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = providedId || generatedId;
    const isError = Boolean(error);
    const messageId = `${inputId}-message`;

    return (
      <div className={`flex w-full flex-col gap-1.5 ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs sm:text-sm font-medium text-neutral-700 select-none"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {currency && (
            <span className="absolute left-3 px-2 py-0.5 text-xs font-semibold bg-neutral-100 text-neutral-600 rounded select-none pointer-events-none">
              {currency}
            </span>
          )}
          {!currency && prefix && (
            <span className="absolute left-3 text-sm text-neutral-400 pointer-events-none select-none">
              {prefix}
            </span>
          )}
          {!currency && Icon && (
            <Icon className="absolute left-3 w-5 h-5 text-neutral-400 pointer-events-none" />
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-describedby={error || helperText ? messageId : undefined}
            aria-invalid={isError}
            className={`
              w-full h-11 px-3.5 bg-neutral-0 text-neutral-800 text-sm rounded-lg border transition-all duration-120
              placeholder:text-neutral-400 focus:outline-none
              disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed
              ${tabular ? 'tabular-nums font-mono' : ''}
              ${alignRight ? 'text-right' : 'text-left'}
              ${currency ? 'pl-16' : prefix || Icon ? 'pl-10' : ''}
              ${suffix ? 'pr-10' : ''}
              ${
                isError
                  ? 'border-error-600 focus:border-error-600 focus:ring-2 focus:ring-error-50'
                  : 'border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
              }
              ${className}
            `}
            {...props}
          />

          {suffix && (
            <span className="absolute right-3 text-sm text-neutral-400 pointer-events-none select-none">
              {suffix}
            </span>
          )}
          {action && <span className="absolute right-2 flex items-center">{action}</span>}
        </div>

        {(error || helperText) && (
          <span
            id={messageId}
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

Input.displayName = 'Input';
