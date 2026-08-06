import { Inbox } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There is no data available to display right now.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-neutral-0 border border-neutral-200 rounded-xl shadow-sm ${className}`}
    >
      <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-neutral-400 stroke-[1.5]" />
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-neutral-800 mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mb-6 leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
