import { useState } from 'react';
import { Bell, Menu, User, LogOut, Settings, ShieldCheck } from 'lucide-react';

export const Topbar = ({
  user = { name: 'John Doe', role: 'ROLE_ACCOUNT_HOLDER', email: 'john@example.com' },
  unreadNotifications = 0,
  onMenuToggle,
  onNotificationClick,
  onLogout,
  onSettingsClick,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const roleLabel =
    user?.role === 'ROLE_ADMIN'
      ? 'Administrator'
      : user?.role === 'ROLE_ACCOUNT_HOLDER'
        ? 'Account Holder'
        : 'User';

  return (
    <header className="sticky top-0 z-30 h-[72px] bg-neutral-0 border-b border-neutral-200 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Page Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Right: Notifications & User Avatar Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notification Bell */}
        <button
          onClick={onNotificationClick}
          className="relative p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadNotifications > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error-600 ring-2 ring-neutral-0 animate-pulse" />
          )}
        </button>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown((prev) => !prev)}
            className="flex items-center gap-3 p-1 rounded-full hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300"
          >
            <div className="w-8 h-8 rounded-full bg-slate-600 text-white font-semibold flex items-center justify-center text-xs shadow-sm">
              {user?.name ? (
                user.name.charAt(0).toUpperCase()
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-neutral-800 truncate max-w-[120px]">
                {user?.name || 'User'}
              </span>
              <span className="text-[10px] text-neutral-500 truncate max-w-[120px]">
                {roleLabel}
              </span>
            </div>
          </button>

          {/* User Dropdown Menu */}
          {showUserDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserDropdown(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-neutral-0 border border-neutral-200 rounded-xl shadow-lg p-2 z-50 animate-in fade-in duration-150">
                <div className="px-3 py-2 border-b border-neutral-200">
                  <p className="text-xs font-semibold text-neutral-800 truncate">
                    {user?.name}
                  </p>
                  <p className="text-[11px] text-neutral-500 truncate">{user?.email}</p>
                  <div className="mt-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-50 text-slate-600">
                      {user?.role === 'ROLE_ADMIN' ? (
                        <ShieldCheck className="w-3 h-3 text-primary-600" />
                      ) : null}
                      {roleLabel}
                    </span>
                  </div>
                </div>

                <div className="py-1">
                  {onSettingsClick && (
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onSettingsClick();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                      <Settings className="w-4 h-4 text-neutral-500" />
                      Security & Settings
                    </button>
                  )}
                  {onLogout && (
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-error-600" />
                      Sign Out
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
