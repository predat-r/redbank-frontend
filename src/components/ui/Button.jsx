import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = React.forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'default',
      fullWidth = false,
      disabled = false,
      loading = false,
      icon: Icon,
      iconPosition = 'leading',
      type = 'button',
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-120 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 active:scale-[0.98] select-none';

    const variants = {
      primary:
        'bg-primary-600 text-white hover:bg-primary-500 active:bg-primary-700 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:shadow-none',
      secondary:
        'bg-slate-600 text-white hover:bg-slate-500 active:bg-slate-700 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:shadow-none',
      outline:
        'bg-transparent text-slate-600 border border-neutral-300 hover:bg-neutral-100 hover:text-slate-800 active:bg-neutral-200 disabled:bg-neutral-100 disabled:border-neutral-200 disabled:text-neutral-400',
      ghost:
        'bg-transparent text-slate-600 hover:bg-neutral-100 hover:text-slate-800 active:bg-neutral-200 disabled:bg-transparent disabled:text-neutral-400',
      danger:
        'bg-error-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:shadow-none',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs gap-1.5',
      default: 'h-10 px-5 text-sm gap-2',
      lg: 'h-12 px-6 text-base gap-2.5',
    };

    const widthClass = fullWidth ? 'w-full' : '';
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
        ) : (
          Icon && iconPosition === 'leading' && <Icon className="w-4 h-4 shrink-0" />
        )}
        <span>{children}</span>
        {!loading && Icon && iconPosition === 'trailing' && (
          <Icon className="w-4 h-4 shrink-0" />
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
