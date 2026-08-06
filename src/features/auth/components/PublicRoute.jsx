import { Navigate, Outlet } from 'react-router-dom';
import { LoadingState } from '../../../components/ui/LoadingState.jsx';
import { useAuth } from '../useAuth.js';

export function PublicRoute() {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <main className="mx-auto min-h-screen max-w-lg px-6 py-16">
        <LoadingState label="Restoring your secure session" />
      </main>
    );
  }

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}
