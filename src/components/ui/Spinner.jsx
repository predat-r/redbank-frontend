import { Loader2 } from 'lucide-react';

export const Spinner = ({ size = 'md', className = '', label }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <div className="inline-flex items-center justify-center gap-2 text-neutral-600">
      <Loader2 className={`animate-spin text-primary-600 ${sizes[size]} ${className}`} />
      {label && (
        <span className="text-xs sm:text-sm font-medium text-neutral-600">{label}</span>
      )}
    </div>
  );
};
