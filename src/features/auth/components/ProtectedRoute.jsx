import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { LoadingState } from '../../../components/ui/LoadingState.jsx';
import { useAuth } from '../useAuth.js';

export function ProtectedRoute() {
  const { isAuthenticated, isInitializing } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return (
      <main className="mx-auto min-h-screen max-w-lg px-6 py-16">
        <LoadingState label="Restoring your secure session" />
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
