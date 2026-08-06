import { X, RefreshCw } from 'lucide-react';
import { NavItem } from './NavItem';
import { Button } from '../ui/Button';

export const Sidebar = ({
  items = [],
  activePath = '/',
  onNavigate,
  isOpen = false,
  onClose,
  isCollapsed = false,
  onSwitchAccount,
}) => {
  return (
    <>
      {/* Mobile Drawer Backdrop Scrim */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-200"
          onClick={onClose}
        />
      )}

      {/* Sidebar Shell */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-40 h-screen bg-neutral-0 border-r border-neutral-200 flex flex-col justify-between transition-all duration-200 ease-in-out shrink-0
          ${isCollapsed ? 'w-18' : 'w-65'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Header / Brand Logo */}
        <div>
          <div className="flex items-center justify-between h-16 px-5 border-b border-neutral-200">
            <img
              src="/favicon_trans.svg"
              alt="RedBank Logo"
              className="h-8 w-auto shrink-0 object-contain"
            />

            {/* Mobile Close Button */}
            {isOpen && (
              <button
                onClick={onClose}
                className="md:hidden p-1 text-neutral-500 hover:text-neutral-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)]">
            {items.map((item) => (
              <NavItem
                key={item.href || item.label}
                icon={item.icon}
                label={item.label}
                active={activePath === item.href}
                collapsed={isCollapsed}
                badge={item.badge}
                onClick={() => {
                  if (onNavigate) onNavigate(item.href);
                  if (isOpen && onClose) onClose();
                }}
              />
            ))}
          </nav>
        </div>

        {/* Footer / Account Switcher */}
        <div className="p-3 border-t border-neutral-200 bg-neutral-50/50">
          {!isCollapsed ? (
            <Button
              variant="outline"
              size="sm"
              fullWidth
              icon={RefreshCw}
              onClick={onSwitchAccount}
              className="text-xs justify-center"
            >
              Switch Account
            </Button>
          ) : (
            <button
              onClick={onSwitchAccount}
              title="Switch Account"
              className="w-full h-9 flex items-center justify-center rounded-lg border border-neutral-300 text-slate-600 hover:bg-neutral-100"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
