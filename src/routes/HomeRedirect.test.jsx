import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { useAuth } from '../features/auth/useAuth.js';
import { HomeRedirect } from './HomeRedirect.jsx';

vi.mock('../features/auth/useAuth.js', () => ({ useAuth: vi.fn() }));

const destinations = [
  ['/login', 'Login'],
  ['/admin/registrations', 'Admin registrations'],
  ['/dashboard', 'Dashboard'],
  ['/registration-status', 'Registration status'],
];

function renderRedirect() {
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        {destinations.map(([path, label]) => (
          <Route key={path} path={path} element={<p>{label}</p>} />
        ))}
      </Routes>
    </MemoryRouter>
  );
}

function mockAuth({ authenticated = true, roles = [] } = {}) {
  useAuth.mockReturnValue({
    isAuthenticated: authenticated,
    isInitializing: false,
    hasRole: (...requiredRoles) => requiredRoles.some((role) => roles.includes(role)),
  });
}

describe('HomeRedirect', () => {
  beforeEach(() => vi.clearAllMocks());

  test.each([
    [['ROLE_ADMIN'], 'Admin registrations'],
    [['ROLE_ACCOUNT_HOLDER'], 'Dashboard'],
    [['ROLE_PENDING_USER'], 'Registration status'],
    [[], 'Registration status'],
  ])('routes roles %j to the correct landing page', (roles, page) => {
    mockAuth({ roles });
    renderRedirect();
    expect(screen.getByText(page)).toBeInTheDocument();
  });

  test('routes signed-out users to login', () => {
    mockAuth({ authenticated: false });
    renderRedirect();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });
});
