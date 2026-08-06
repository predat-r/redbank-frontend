import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/useAuth.js';

export function HomeRedirect() {
  const { isAuthenticated, hasRole } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <Navigate
      to={hasRole('ROLE_ADMIN') ? '/admin/registrations' : '/dashboard'}
      replace
    />
  );
}
