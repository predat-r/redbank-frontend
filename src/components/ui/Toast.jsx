import { useState, useCallback } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { ToastContext } from '../../hooks/useToast';

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type = 'info', title, message, duration = 4000 }) => {
      const id = Date.now() + Math.random().toString(36).substring(2, 9);
      const newToast = { id, type, title, message };
      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast Portal Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ toast, onClose }) => {
  const styles = {
    success: {
      border: 'border-l-4 border-l-success-600',
      icon: CheckCircle2,
      iconColor: 'text-success-600',
    },
    error: {
      border: 'border-l-4 border-l-error-600',
      icon: XCircle,
      iconColor: 'text-error-600',
    },
    warning: {
      border: 'border-l-4 border-l-warning-600',
      icon: AlertTriangle,
      iconColor: 'text-warning-600',
    },
    info: {
      border: 'border-l-4 border-l-info-600',
      icon: Info,
      iconColor: 'text-info-600',
    },
  };

  const currentStyle = styles[toast.type] || styles.info;
  const IconComponent = currentStyle.icon;

  return (
    <div
      className={`
        pointer-events-auto flex items-start gap-3 p-4 bg-neutral-0 border border-neutral-200 rounded-lg shadow-lg ${currentStyle.border}
        animate-in slide-in-from-right-4 duration-220 ease-out transition-all
      `}
      role="alert"
    >
      <IconComponent className={`w-5 h-5 shrink-0 mt-0.5 ${currentStyle.iconColor}`} />
      <div className="flex-1 min-w-0">
        {toast.title && (
          <h4 className="text-sm font-semibold text-neutral-800">{toast.title}</h4>
        )}
        {toast.message && (
          <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
            {toast.message}
          </p>
        )}
      </div>
      <button
        onClick={onClose}
        className="p-1 text-neutral-400 hover:text-neutral-600 rounded transition-colors"
        aria-label="Dismiss toast"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
