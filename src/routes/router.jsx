import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute.jsx';
import { PublicRoute } from '../features/auth/components/PublicRoute.jsx';
import { RoleRoute } from '../features/auth/components/RoleRoute.jsx';
import { AuthLayout } from '../layouts/AuthLayout.jsx';
import { RegistrationsPage } from '../pages/admin/RegistrationsPage.jsx';
import { DashboardPage } from '../pages/account/DashboardPage.jsx';
import { TransferPage } from '../pages/account/TransferPage.jsx';
import { WithdrawPage } from '../pages/account/WithdrawPage.jsx';
import { LoginPage } from '../pages/auth/LoginPage.jsx';
import { RegisterPage } from '../pages/auth/RegisterPage.jsx';
import { RegistrationStatusPage } from '../pages/auth/RegistrationStatusPage.jsx';
import { ProfilePage } from '../pages/auth/ProfilePage.jsx';
import { RoutePlaceholder } from '../pages/system/RoutePlaceholder.jsx';
import { HomeRedirect } from './HomeRedirect.jsx';

export const router = createBrowserRouter([
  { path: '/', element: <HomeRedirect /> },
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/registration-status',
        element: <RegistrationStatusPage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
      {
        path: '/settings/security',
        element: <ProfilePage />,
      },
      {
        element: (
          <RoleRoute redirectTo="/registration-status" roles={['ROLE_ACCOUNT_HOLDER']} />
        ),
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/transfer', element: <TransferPage /> },
          { path: '/withdraw', element: <WithdrawPage /> },
        ],
      },
      {
        element: <RoleRoute roles={['ROLE_ADMIN']} />,
        children: [
          {
            path: '/admin/registrations',
            element: <RegistrationsPage />,
          },
        ],
      },
    ],
  },
  {
    path: '/forbidden',
    element: (
      <RoutePlaceholder
        title="Access denied"
        message="You do not have permission to view this page."
      />
    ),
  },
  {
    path: '*',
    element: (
      <RoutePlaceholder
        title="Page not found"
        message="The page you requested does not exist."
      />
    ),
  },
]);
