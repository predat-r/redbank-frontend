import { useState } from 'react';
import {
  ArrowLeftRight,
  ClipboardCheck,
  Landmark,
  LayoutDashboard,
  ScrollText,
  UserRoundCog,
  Users,
} from 'lucide-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/navigation/Sidebar.jsx';
import { Topbar } from '../components/navigation/Topbar.jsx';
import { useLogout } from '../features/auth/auth.queries.js';
import { useAuth } from '../features/auth/useAuth.js';

const adminNavItems = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  {
    label: 'Registrations',
    href: '/admin/registrations',
    icon: ClipboardCheck,
  },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Account Holders', href: '/admin/accounts', icon: UserRoundCog },
  { label: 'Deposits', href: '/admin/deposits', icon: Landmark },
  { label: 'Transactions', href: '/admin/transactions', icon: ArrowLeftRight },
  { label: 'Audit Logs', href: '/admin/audit-logs', icon: ScrollText },
];

function activeAdminPath(pathname) {
  if (pathname.startsWith('/admin/balance/')) return '/admin/accounts';
  const matchingItem = adminNavItems
    .filter(({ href }) =>
      href === '/admin' ? pathname === href : pathname.startsWith(href)
    )
    .sort((left, right) => right.href.length - left.href.length)[0];

  return matchingItem?.href ?? pathname;
}

export function AdminLayout() {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { claims } = useAuth();
  const logout = useLogout();
  const location = useLocation();
  const navigate = useNavigate();
  const displayName = claims?.name || claims?.email || claims?.sub || 'Administrator';
  const email = claims?.email || claims?.sub || '';

  function handleNavigate(path) {
    navigate(path);
    setMobileDrawerOpen(false);
  }

  function handleLogout() {
    logout.mutate(undefined, {
      onSettled: () => navigate('/login', { replace: true }),
    });
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 font-sans text-neutral-800 antialiased md:flex-row">
      <Sidebar
        activePath={activeAdminPath(location.pathname)}
        collapseOnTablet
        isOpen={mobileDrawerOpen}
        items={adminNavItems}
        onClose={() => setMobileDrawerOpen(false)}
        onNavigate={handleNavigate}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onLogout={handleLogout}
          onMenuToggle={() => setMobileDrawerOpen((current) => !current)}
          onSettingsClick={() => handleNavigate('/settings/security')}
          showSearch={false}
          user={{ name: displayName, email, role: 'ROLE_ADMIN' }}
        />

        <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
