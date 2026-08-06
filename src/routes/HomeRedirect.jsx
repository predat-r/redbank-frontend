import { Navigate } from 'react-router-dom';
import { LoadingState } from '../components/ui/LoadingState.jsx';
import { useAuth } from '../features/auth/useAuth.js';

export function HomeRedirect() {
  const { isAuthenticated, isInitializing, hasRole } = useAuth();
  if (isInitializing) {
    return (
      <main className="mx-auto min-h-screen max-w-lg px-6 py-16">
        <LoadingState label="Restoring your secure session" />
      </main>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <Navigate
      to={hasRole('ROLE_ADMIN') ? '/admin/registrations' : '/dashboard'}
      replace
    />
  );
}
