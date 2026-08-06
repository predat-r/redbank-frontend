import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { login, registerAccount } from '../../api/auth.js';
import { renderWithProviders } from '../../test/render.jsx';
import { LoginPage } from './LoginPage.jsx';
import { RegisterPage } from './RegisterPage.jsx';

vi.mock('../../api/auth.js', () => ({
  login: vi.fn(),
  registerAccount: vi.fn(),
}));

function tokenWithRoles(roles) {
  const payload = btoa(JSON.stringify({ roles }))
    .replaceAll('+', '-')
    .replaceAll('/', '_');
  return `header.${payload}.signature`;
}

describe('auth pages', () => {
  beforeEach(() => vi.clearAllMocks());

  test('logs in with the OpenAPI payload and routes an admin', async () => {
    const user = userEvent.setup();
    login.mockResolvedValue({
      accessToken: tokenWithRoles(['ROLE_ADMIN']),
      tokenType: 'Bearer',
    });

    renderWithProviders(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/registrations" element={<p>Admin approvals</p>} />
        </Routes>
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText('Email'), 'admin@example.com');
    await user.type(screen.getByLabelText('Password'), 'password');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(login.mock.calls[0][0]).toEqual({
      email: 'admin@example.com',
      password: 'password',
    });
    expect(await screen.findByText('Admin approvals')).toBeInTheDocument();
    expect(window.localStorage).toHaveLength(0);
    expect(window.sessionStorage).toHaveLength(0);
  });

  test('validates registration before submitting', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: 'Create Account' }));

    expect(registerAccount).not.toHaveBeenCalled();
    expect(
      screen.getByText('Name must be between 2 and 150 characters.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('You must accept the terms to continue.')
    ).toBeInTheDocument();
  });

  test('submits registration and shows the pending review state', async () => {
    const user = userEvent.setup();
    registerAccount.mockResolvedValue({
      id: 7,
      email: 'user@example.com',
      status: 'PENDING_APPROVAL',
      tokens: { accessToken: 'access', tokenType: 'Bearer' },
    });

    renderWithProviders(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText('Full name'), 'Test User');
    await user.type(screen.getByLabelText('Email'), 'user@example.com');
    await user.type(screen.getByLabelText('Phone number'), '123456789');
    await user.type(screen.getByLabelText('Address'), 'Test address');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm password'), 'password123');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Create Account' }));

    expect(registerAccount.mock.calls[0][0]).toEqual({
      name: 'Test User',
      email: 'user@example.com',
      phoneNumber: '123456789',
      address: 'Test address',
      password: 'password123',
    });
    expect(
      await screen.findByText('Your registration is under review')
    ).toBeInTheDocument();
    expect(screen.getByText('Pending Approval')).toBeInTheDocument();
  });
});
