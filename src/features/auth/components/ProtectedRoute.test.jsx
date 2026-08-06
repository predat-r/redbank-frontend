import { screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { setSession } from '../../../api/tokenStore.js';
import { renderWithProviders } from '../../../test/render.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';

describe('ProtectedRoute', () => {
  test('redirects a signed-out user to login', () => {
    renderWithProviders(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<p>Dashboard</p>} />
          </Route>
          <Route path="/login" element={<p>Login page</p>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login page')).toBeInTheDocument();
  });

  test('renders protected content for a stored session', () => {
    setSession({ accessToken: 'token', tokenType: 'Bearer' });

    renderWithProviders(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<p>Dashboard</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
