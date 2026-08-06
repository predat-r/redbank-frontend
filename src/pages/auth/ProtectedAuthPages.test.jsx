import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { changePassword, getRegistrationStatus, logout } from '../../api/auth.js';
import { getSession, setSession } from '../../api/tokenStore.js';
import { renderWithProviders } from '../../test/render.jsx';
import { RegistrationStatusPage } from './RegistrationStatusPage.jsx';
import { SecurityPage } from './SecurityPage.jsx';

vi.mock('../../api/auth.js', () => ({
  changePassword: vi.fn(),
  getRegistrationStatus: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  registerAccount: vi.fn(),
}));

function renderStatusPage() {
  return renderWithProviders(
    <MemoryRouter initialEntries={['/registration-status']}>
      <Routes>
        <Route path="/registration-status" element={<RegistrationStatusPage />} />
        <Route path="/dashboard" element={<p>Dashboard destination</p>} />
        <Route path="/login" element={<p>Login destination</p>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('RegistrationStatusPage', () => {
  beforeEach(() => vi.clearAllMocks());

  test.each([
    ['PENDING_APPROVAL', 'Your registration is under review'],
    ['ACTIVE', 'Your account is active'],
    ['DEACTIVATED', 'Your account is deactivated'],
  ])('renders the %s state', async (status, heading) => {
    getRegistrationStatus.mockResolvedValue({ userId: 7, status });
    renderStatusPage();

    expect(await screen.findByRole('heading', { name: heading })).toBeInTheDocument();
  });

  test('shows a rejection reason only when returned by the API', async () => {
    getRegistrationStatus.mockResolvedValue({
      userId: 7,
      status: 'REJECTED',
      rejectionReason: 'Identity details could not be verified.',
    });
    renderStatusPage();

    expect(
      await screen.findByText('Identity details could not be verified.')
    ).toBeInTheDocument();
  });

  test('offers retry when status loading fails', async () => {
    const user = userEvent.setup();
    getRegistrationStatus
      .mockRejectedValueOnce(new Error('Status service unavailable'))
      .mockResolvedValueOnce({ userId: 7, status: 'PENDING_APPROVAL' });
    renderStatusPage();

    expect(await screen.findByText('Status service unavailable')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Try Again' }));
    expect(
      await screen.findByText('Your registration is under review')
    ).toBeInTheDocument();
  });

  test('clears local auth and private queries even when server logout fails', async () => {
    const user = userEvent.setup();
    setSession({ accessToken: 'access', tokenType: 'Bearer' });
    getRegistrationStatus.mockResolvedValue({ userId: 7, status: 'PENDING_APPROVAL' });
    logout.mockRejectedValue(new Error('Network unavailable'));
    const { queryClient } = renderStatusPage();
    queryClient.setQueryData(['private', 'data'], { secret: true });

    await user.click(await screen.findByRole('button', { name: 'Sign Out' }));

    expect(await screen.findByText('Login destination')).toBeInTheDocument();
    expect(getSession()).toBeNull();
    expect(queryClient.getQueryCache().getAll()).toHaveLength(0);
  });
});

describe('SecurityPage', () => {
  beforeEach(() => vi.clearAllMocks());

  test('validates password fields before calling the API', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <MemoryRouter>
        <SecurityPage />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: 'Update Password' }));

    expect(changePassword).not.toHaveBeenCalled();
    expect(screen.getByText('Current password is required.')).toBeInTheDocument();
    expect(
      screen.getByText('New password must be between 8 and 100 characters.')
    ).toBeInTheDocument();
  });

  test('submits the OpenAPI payload and shows success feedback', async () => {
    const user = userEvent.setup();
    changePassword.mockResolvedValue(undefined);
    renderWithProviders(
      <MemoryRouter>
        <SecurityPage />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText('Current password'), 'old-password');
    await user.type(screen.getByLabelText('New password'), 'new-password');
    await user.type(screen.getByLabelText('Confirm new password'), 'new-password');
    await user.click(screen.getByRole('button', { name: 'Update Password' }));

    expect(changePassword.mock.calls[0][0]).toEqual({
      currentPassword: 'old-password',
      newPassword: 'new-password',
    });
    expect(await screen.findByText('Password updated')).toBeInTheDocument();
  });
});
