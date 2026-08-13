import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { useAuth } from '../useAuth.js';
import { PublicRoute } from './PublicRoute.jsx';

vi.mock('../useAuth.js', () => ({ useAuth: vi.fn() }));

function renderRoute() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<p>Login page</p>} />
        </Route>
        <Route path="/" element={<p>Home page</p>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('PublicRoute', () => {
  beforeEach(() => vi.clearAllMocks());

  test('shows session restoration state while authentication initializes', () => {
    useAuth.mockReturnValue({ isAuthenticated: false, isInitializing: true });
    renderRoute();

    expect(screen.getByText('Restoring your secure session')).toBeInTheDocument();
  });

  test('renders public content for signed-out users and redirects signed-in users', () => {
    useAuth.mockReturnValue({ isAuthenticated: false, isInitializing: false });
    const { rerender } = renderRoute();
    expect(screen.getByText('Login page')).toBeInTheDocument();

    useAuth.mockReturnValue({ isAuthenticated: true, isInitializing: false });
    rerender(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<p>Login page</p>} />
          </Route>
          <Route path="/" element={<p>Home page</p>} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Home page')).toBeInTheDocument();
  });
});
