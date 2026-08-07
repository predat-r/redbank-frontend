import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import {
  useAdminUser,
  useAdminUsers,
  useAdminAccounts,
  useCreateAdminUser,
  useDeactivateAdminUser,
  useReactivateAdminUser,
  useUpdateAdminUser,
} from '../../features/admin/admin.queries.js';
import { renderWithProviders } from '../../test/render.jsx';
import { UsersPage } from './UsersPage.jsx';

vi.mock('../../features/admin/admin.queries.js', () => ({
  useAdminUser: vi.fn(),
  useAdminUsers: vi.fn(),
  useAdminAccounts: vi.fn(),
  useCreateAdminUser: vi.fn(),
  useDeactivateAdminUser: vi.fn(),
  useReactivateAdminUser: vi.fn(),
  useUpdateAdminUser: vi.fn(),
}));

const adminUser = {
  id: 4,
  name: 'Amina Khan',
  email: 'amina@example.com',
  phoneNumber: '+923001234567',
  address: '12 Bank Street',
  status: 'ACTIVE',
  createdAt: '2026-08-01T10:00:00Z',
  updatedAt: '2026-08-02T10:00:00Z',
};

function queryResult(content = [adminUser]) {
  return {
    data: {
      content,
      page: { number: 0, size: 10, totalElements: content.length, totalPages: 1 },
    },
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  };
}

function mutationResult(result) {
  return {
    mutateAsync: vi.fn().mockResolvedValue(result),
    reset: vi.fn(),
    isPending: false,
    isError: false,
    error: null,
  };
}

function renderPage() {
  return renderWithProviders(
    <MemoryRouter>
      <UsersPage />
    </MemoryRouter>
  );
}

describe('UsersPage', () => {
  let create;
  let update;
  let deactivate;
  let reactivate;

  beforeEach(() => {
    vi.clearAllMocks();
    create = mutationResult({
      user: adminUser,
      accountHolder: {
        id: 8,
        accountNumber: 'RB0008',
        currency: 'USD',
        accountStatus: 'ACTIVE',
      },
    });
    update = mutationResult(adminUser);
    deactivate = mutationResult();
    reactivate = mutationResult();
    useAdminUsers.mockReturnValue(queryResult());
    useAdminAccounts.mockReturnValue(queryResult([]));
    useAdminUser.mockReturnValue({
      data: adminUser,
      isLoading: false,
      isError: false,
      error: null,
    });
    useCreateAdminUser.mockReturnValue(create);
    useUpdateAdminUser.mockReturnValue(update);
    useDeactivateAdminUser.mockReturnValue(deactivate);
    useReactivateAdminUser.mockReturnValue(reactivate);
  });

  test('renders users and requests URL-backed server sorting', async () => {
    const user = userEvent.setup();
    renderPage();

    expect(await screen.findAllByText('Amina Khan')).not.toHaveLength(0);
    await user.click(screen.getByRole('button', { name: 'Name' }));

    await waitFor(() =>
      expect(useAdminUsers).toHaveBeenLastCalledWith({
        page: 0,
        size: 10,
        sort: ['name,asc'],
      })
    );
  });

  test('validates, trims, and creates a linked account holder', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: 'Create User' }));
    await user.click(screen.getByRole('button', { name: 'Create Account Holder' }));
    expect(
      screen.getByText('Name must be between 2 and 150 characters.')
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText('Full name'), '  Amina Khan  ');
    await user.type(screen.getByLabelText('Email'), '  amina@example.com  ');
    await user.type(screen.getByLabelText('Phone number'), '  +923001234567  ');
    await user.type(screen.getByLabelText('Address'), '  12 Bank Street  ');
    await user.type(screen.getByLabelText('Temporary password'), 'secure-password');
    await user.type(screen.getByLabelText('Confirm password'), 'secure-password');
    await user.click(screen.getByRole('button', { name: 'Create Account Holder' }));

    await waitFor(() =>
      expect(create.mutateAsync).toHaveBeenCalledWith({
        name: 'Amina Khan',
        email: 'amina@example.com',
        phoneNumber: '+923001234567',
        address: '12 Bank Street',
        password: 'secure-password',
      })
    );
    expect(await screen.findByText('RB0008')).toBeInTheDocument();
  });

  test('confirms user deactivation', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getAllByRole('button', { name: 'Deactivate' })[0]);
    await user.click(screen.getByRole('button', { name: 'Deactivate User' }));

    await waitFor(() => expect(deactivate.mutateAsync).toHaveBeenCalledWith(4));
    expect(await screen.findByText('User deactivated')).toBeInTheDocument();
  });

  test('offers reactivation only for deactivated users', async () => {
    const user = userEvent.setup();
    useAdminUsers.mockReturnValue(queryResult([{ ...adminUser, status: 'DEACTIVATED' }]));
    renderPage();

    expect(screen.queryByRole('button', { name: 'Deactivate' })).not.toBeInTheDocument();
    await user.click(screen.getAllByRole('button', { name: 'Reactivate' })[0]);
    await user.click(screen.getByRole('button', { name: 'Reactivate User' }));

    await waitFor(() => expect(reactivate.mutateAsync).toHaveBeenCalledWith(4));
  });
});
