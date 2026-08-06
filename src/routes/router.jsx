import { useState } from 'react';
import DashboardPage from '../pages/account/DashboardPage';

export const AppRouter = () => {
  const [currentPath, setCurrentPath] = useState('/dashboard');

  const handleNavigate = (path) => {
    setCurrentPath(path);
  };

  // Static route rendering for requested User Dashboard
  switch (currentPath) {
    case '/dashboard':
    default:
      return <DashboardPage onNavigate={handleNavigate} />;
  }
};
