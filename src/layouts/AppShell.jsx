import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/navigation/Sidebar';
import { Topbar } from '../components/navigation/Topbar';
import { useAuth } from '../features/auth/useAuth';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Banknote,
  User,
  ShieldCheck,
} from 'lucide-react';

export const AppShell = ({ children, activePath = '/dashboard', onNavigate, user }) => {
  const navigate = useNavigate();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [sidebarCollapsed] = useState(false);

  let auth = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    auth = useAuth();
  } catch {
    auth = null;
  }

  const currentUser = user || {
    name: auth?.claims?.sub || 'Alexander Wright',
    email: auth?.claims?.email || 'alexander.wright@example.com',
    role: auth?.roles?.[0] || 'ROLE_ACCOUNT_HOLDER',
  };

  const handleNavigation = (path) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
    setMobileDrawerOpen(false);
  };

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Fund Transfer', href: '/transfer', icon: ArrowLeftRight },
    { label: 'Cash Withdrawal', href: '/withdraw', icon: Banknote },
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

  const handleLogout = () => {
    if (auth?.endSession) {
      auth.endSession();
    }
    navigate('/login');
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
        onSwitchAccount={() => handleNavigation('/dashboard')}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Topbar */}
        <Topbar
          user={currentUser}
          unreadNotifications={2}
          onMenuToggle={() => setMobileDrawerOpen((prev) => !prev)}
          onNotificationClick={() => {}}
          onSettingsClick={() => handleNavigation('/profile')}
          onLogout={handleLogout}
        />

        {/* Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
};
