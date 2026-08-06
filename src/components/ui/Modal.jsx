import { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-md',
  className = '',
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop scrim */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={`
          relative w-full ${maxWidth} bg-neutral-0 rounded-xl shadow-lg border border-neutral-200 p-6 z-10
          animate-in fade-in slide-in-from-bottom-2 duration-200 ${className}
        `}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 mb-4 border-b border-neutral-200">
          <div>
            {title && <h3 className="text-lg font-semibold text-neutral-800">{title}</h3>}
            {subtitle && <p className="text-xs text-neutral-500 mt-0.5">{subtitle}</p>}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
};
