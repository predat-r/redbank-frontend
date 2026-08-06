import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../useAuth.js';

export function RoleRoute({ roles }) {
  const { hasRole: userHasRole } = useAuth();
  return userHasRole(...roles) ? <Outlet /> : <Navigate to="/forbidden" replace />;
}
