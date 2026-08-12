import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/navigation/Sidebar';
import { Topbar } from '../components/navigation/Topbar';
import { SignOutConfirmModal } from '../components/ui/SignOutConfirmModal';
import { useAuth } from '../features/auth/useAuth';
import { useLogout } from '../features/auth/auth.queries';
import { useMyAccount } from '../features/account/account.queries';
import { useToast } from '../hooks/useToast';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Banknote,
  History,
  User,
  ShieldCheck,
  Snowflake,
  Bot,
} from 'lucide-react';

export const AppShell = ({ children, activePath = '/dashboard', onNavigate, user }) => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [sidebarCollapsed] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const logoutMutation = useLogout();
  const { data: realAccount } = useMyAccount();

  const auth = useAuth();

  const currentUser = {
    name:
      realAccount?.user?.name ||
      (user?.name && user?.name !== 'Alexander Wright' ? user?.name : null) ||
      auth?.claims?.sub ||
      'Not available',
    email:
      realAccount?.user?.email ||
      (user?.email && user?.email !== 'alexander.wright@example.com'
        ? user?.email
        : null) ||
      auth?.claims?.email ||
      'Not available',
    role: user?.role || auth?.roles?.[0] || 'ROLE_ACCOUNT_HOLDER',
  };

  const isFrozen = realAccount?.accountStatus === 'FROZEN';

  const handleNavigation = (path) => {
    if (isFrozen && (path === '/transfer' || path === '/withdraw')) {
      addToast({
        type: 'warning',
        title: 'Account Frozen',
        message: 'Your account is frozen. Outgoing transfers and withdrawals are locked.',
      });
      return;
    }

    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
    setMobileDrawerOpen(false);
  };

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    {
      label: 'Fund Transfer',
      href: '/transfer',
      icon: ArrowLeftRight,
      ...(isFrozen ? { badge: 'Locked' } : {}),
    },
    {
      label: 'Cash Withdrawal',
      href: '/withdraw',
      icon: Banknote,
      ...(isFrozen ? { badge: 'Locked' } : {}),
    },
    { label: 'Transaction History', href: '/history', icon: History },
    { label: 'Chat with RedAssist', href: '/chat', icon: Bot },

    ...(currentUser.role === 'ROLE_ADMIN'
      ? [
          {
            label: 'Admin Panel',
            href: '/admin/registrations',
            icon: ShieldCheck,
            badge: 'Admin',
          },
        ]
      : []),
    { label: 'Profile', href: '/profile', icon: User },
  ];

  const handleLogoutClick = () => {
    setShowSignOutModal(true);
  };

  const handleConfirmLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => navigate('/login', { replace: true }),
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row font-sans text-neutral-800 antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        items={navItems}
        activePath={activePath}
        onNavigate={handleNavigation}
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        isCollapsed={sidebarCollapsed}
        onLogout={handleLogoutClick}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Frozen Account Notice Banner */}
        {isFrozen && (
          <div className="bg-amber-600 text-white px-4 py-2.5 text-xs sm:text-sm font-medium flex items-center justify-between shadow-sm shrink-0">
            <div className="flex items-center gap-2">
              <Snowflake className="w-4 h-4 shrink-0" />
              <span>
                Your account is currently <strong>FROZEN</strong>. Outgoing transfers and
                cash withdrawals are disabled.
              </span>
            </div>
            <button
              onClick={() => handleNavigation('/profile')}
              className="underline hover:text-amber-100 transition-colors shrink-0 ml-4 font-bold"
            >
              Unfreeze Account →
            </button>
          </div>
        )}

        {/* Sticky Topbar */}
        <Topbar
          user={currentUser}
          unreadNotifications={2}
          onMenuToggle={() => setMobileDrawerOpen((prev) => !prev)}
          onNotificationClick={() => {}}
          onSettingsClick={() => handleNavigation('/profile')}
          onLogout={handleLogoutClick}
        />

        {/* Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>

      {/* Sign Out Confirmation Dialog */}
      <SignOutConfirmModal
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={handleConfirmLogout}
        loading={logoutMutation.isPending}
      />
    </div>
  );
};
