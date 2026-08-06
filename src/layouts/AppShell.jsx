import { useState } from 'react';
import { Sidebar } from '../components/navigation/Sidebar';
import { Topbar } from '../components/navigation/Topbar';
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  History,
  Settings,
  ShieldCheck,
} from 'lucide-react';

export const AppShell = ({ children, activePath = '/dashboard', onNavigate, user }) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [sidebarCollapsed] = useState(false);

  const currentUser = user || {
    name: 'Alexander Wright',
    email: 'alexander.wright@example.com',
    role: 'ROLE_ACCOUNT_HOLDER',
  };

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Accounts', href: '/accounts', icon: Wallet },
    { label: 'Fund Transfer', href: '/transfer', icon: ArrowLeftRight },
    { label: 'Transaction History', href: '/history', icon: History },
    ...(currentUser.role === 'ROLE_ADMIN'
      ? [{ label: 'Admin Panel', href: '/admin', icon: ShieldCheck, badge: 'Admin' }]
      : []),
    { label: 'Settings', href: '/settings/security', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row font-sans text-neutral-800 antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        items={navItems}
        activePath={activePath}
        onNavigate={(path) => {
          if (onNavigate) onNavigate(path);
          setMobileDrawerOpen(false);
        }}
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        isCollapsed={sidebarCollapsed}
        onSwitchAccount={() => alert('Switch Account feature clicked')}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Topbar */}
        <Topbar
          user={currentUser}
          unreadNotifications={2}
          onMenuToggle={() => setMobileDrawerOpen((prev) => !prev)}
          onNotificationClick={() => alert('Notifications dropdown clicked')}
          onSettingsClick={() => onNavigate && onNavigate('/settings/security')}
          onLogout={() => alert('Logged out successfully')}
        />

        {/* Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
};
