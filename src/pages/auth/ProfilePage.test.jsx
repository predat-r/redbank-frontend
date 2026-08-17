import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import {
  useChangePassword,
  useLogout,
  useRegistrationStatus,
  useUpdateMyProfile,
} from '../../features/auth/auth.queries.js';
import {
  useDeactivateAccount,
  useFreezeAccount,
  useMyAccount,
  useUnfreezeAccount,
} from '../../features/account/account.queries.js';
import { useAuth } from '../../features/auth/useAuth.js';
import { ProfilePage } from './ProfilePage.jsx';

const addToast = vi.fn();

vi.mock('../../layouts/AppShell.jsx', () => ({
  AppShell: ({ children }) => <>{children}</>,
}));
vi.mock('../../layouts/AdminLayout.jsx', () => ({
  AdminLayout: ({ children }) => <>{children}</>,
}));
vi.mock('../../hooks/useToast.js', () => ({ useToast: () => ({ addToast }) }));
vi.mock('../../features/auth/auth.queries.js', () => ({
  useChangePassword: vi.fn(),
  useLogout: vi.fn(),
  useRegistrationStatus: vi.fn(),
  useUpdateMyProfile: vi.fn(),
}));
vi.mock('../../features/account/account.queries.js', () => ({
  useMyAccount: vi.fn(),
  useFreezeAccount: vi.fn(),
  useUnfreezeAccount: vi.fn(),
  useDeactivateAccount: vi.fn(),
}));
vi.mock('../../features/auth/useAuth.js', () => ({ useAuth: vi.fn() }));

function mutation(overrides = {}) {
  return {
    isPending: false,
    isError: false,
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
    reset: vi.fn(),
    ...overrides,
  };
}

function renderProfile() {
  return render(
    <MemoryRouter>
      <ProfilePage />
    </MemoryRouter>
  );
}

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ roles: ['ROLE_ACCOUNT_HOLDER'], claims: {} });
    useMyAccount.mockReturnValue({
      data: {
        accountStatus: 'ACTIVE',
        createdAt: '2026-01-10T00:00:00Z',
        user: {
          name: 'Amina Khan',
          email: 'amina@example.com',
          phoneNumber: '03001234567',
          address: '12 Bank Street',
          createdAt: '2026-01-10T00:00:00Z',
        },
      },
      isLoading: false,
      isError: false,
    });
    useRegistrationStatus.mockReturnValue({
      data: { status: 'ACTIVE' },
      isLoading: false,
      isError: false,
    });
    useFreezeAccount.mockReturnValue(mutation());
    useUnfreezeAccount.mockReturnValue(mutation());
    useDeactivateAccount.mockReturnValue(mutation());
    useUpdateMyProfile.mockReturnValue(mutation());
    useChangePassword.mockReturnValue(mutation());
    useLogout.mockReturnValue(mutation());
  });

  test('shows account details and saves trimmed personal information', async () => {
    const user = userEvent.setup();
    const mutateAsync = vi.fn().mockResolvedValue({
      name: 'Amina S Khan',
      phoneNumber: '03009999999',
      address: '14 Bank Street',
    });
    useUpdateMyProfile.mockReturnValue(mutation({ mutateAsync }));
    renderProfile();

    expect(screen.getByText('My Profile & Account Settings')).toBeInTheDocument();
    expect(screen.getByDisplayValue('amina@example.com')).toBeDisabled();
    await user.clear(screen.getByLabelText('Full Name'));
    await user.type(screen.getByLabelText('Full Name'), ' Amina S Khan ');
    await user.clear(screen.getByLabelText('Phone Number'));
    await user.type(screen.getByLabelText('Phone Number'), ' 03009999999 ');
    await user.click(screen.getByRole('button', { name: /save profile changes/i }));

    expect(mutateAsync).toHaveBeenCalledWith({
      email: 'amina@example.com',
      name: 'Amina S Khan',
      phoneNumber: '03009999999',
      address: '12 Bank Street',
    });
    expect(addToast).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Profile Updated' })
    );
  });

  test('validates password input before sending an update and supports a successful update', async () => {
    const user = userEvent.setup();
    const mutateAsync = vi.fn().mockResolvedValue(undefined);
    useChangePassword.mockReturnValue(mutation({ mutateAsync }));
    renderProfile();

    await user.click(screen.getByRole('button', { name: /password & security/i }));
    await user.click(screen.getByRole('button', { name: 'Update Password' }));
    expect(screen.getByText('Current password is required.')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Current password'), 'old-password');
    await user.type(screen.getByLabelText('New password'), 'new-password');
    await user.type(screen.getByLabelText('Confirm new password'), 'new-password');
    await user.click(screen.getByRole('button', { name: 'Update Password' }));

    expect(mutateAsync).toHaveBeenCalledWith({
      currentPassword: 'old-password',
      newPassword: 'new-password',
    });
    expect(addToast).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Password Updated' })
    );
  });

  test('confirms freeze and unfreeze lifecycle actions with user feedback', async () => {
    const user = userEvent.setup();
    const freeze = vi.fn().mockResolvedValue(undefined);
    useFreezeAccount.mockReturnValue(mutation({ mutateAsync: freeze }));
    renderProfile();

    await user.click(screen.getByRole('button', { name: 'Freeze Account' }));
    await user.click(screen.getByRole('button', { name: 'Confirm Freeze' }));
    expect(freeze).toHaveBeenCalledTimes(1);
    expect(addToast).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Account Frozen' })
    );

    const unfreeze = vi.fn().mockResolvedValue(undefined);
    useUnfreezeAccount.mockReturnValue(mutation({ mutateAsync: unfreeze }));
    await user.click(screen.getByRole('button', { name: 'Unfreeze Account' }));
    await user.click(screen.getByRole('button', { name: 'Confirm Unfreeze' }));
    expect(unfreeze).toHaveBeenCalledTimes(1);
    expect(addToast).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Account Unfrozen' })
    );
  });
});
