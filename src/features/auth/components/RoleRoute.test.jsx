import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, test, vi } from 'vitest';
import { useAuth } from '../useAuth.js';
import { RoleRoute } from './RoleRoute.jsx';

vi.mock('../useAuth.js', () => ({ useAuth: vi.fn() }));

function renderRoleRoute({ redirectTo, hasRequiredRole }) {
  useAuth.mockReturnValue({ hasRole: () => hasRequiredRole });

  render(
    <MemoryRouter initialEntries={['/restricted']}>
      <Routes>
        <Route element={<RoleRoute redirectTo={redirectTo} roles={['ROLE_ADMIN']} />}>
          <Route path="/restricted" element={<p>Restricted content</p>} />
        </Route>
        <Route path="/forbidden" element={<p>Forbidden</p>} />
        <Route path="/registration-status" element={<p>Registration status</p>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('RoleRoute', () => {
  test('renders protected content when the user has a required role', () => {
    renderRoleRoute({ hasRequiredRole: true });
    expect(screen.getByText('Restricted content')).toBeInTheDocument();
  });

  test('redirects unauthorized users to forbidden by default', () => {
    renderRoleRoute({ hasRequiredRole: false });
    expect(screen.getByText('Forbidden')).toBeInTheDocument();
  });

  test('supports a custom unauthorized redirect', () => {
    renderRoleRoute({
      hasRequiredRole: false,
      redirectTo: '/registration-status',
    });
    expect(screen.getByText('Registration status')).toBeInTheDocument();
  });
});
