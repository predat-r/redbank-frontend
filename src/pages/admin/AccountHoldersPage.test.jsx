import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import {
  useAdminAccount,
  useAdminAccounts,
  useAdminUser,
  useCreateAdminUser,
  useDeactivateAdminAccount,
  useFreezeAdminAccount,
  useUnfreezeAdminAccount,
  useUpdateAdminUser,
} from '../../features/admin/admin.queries.js';
import { renderWithProviders } from '../../test/render.jsx';
import { AccountHoldersPage } from './AccountHoldersPage.jsx';

vi.mock('../../features/admin/admin.queries.js', () => ({
  useAdminAccount: vi.fn(),
  useAdminAccounts: vi.fn(),
  useAdminUser: vi.fn(),
  useCreateAdminUser: vi.fn(),
  useDeactivateAdminAccount: vi.fn(),
  useFreezeAdminAccount: vi.fn(),
  useUnfreezeAdminAccount: vi.fn(),
  useUpdateAdminUser: vi.fn(),
}));

const account = {
  id: 8,
  userId: 4,
  accountNumber: 'RB0008',
  currency: 'USD',
  accountStatus: 'ACTIVE',
  approvedAt: '2026-08-01T10:00:00Z',
  createdAt: '2026-08-01T10:00:00Z',
  updatedAt: '2026-08-02T10:00:00Z',
};

function mutationResult() {
  return {
    mutateAsync: vi.fn().mockResolvedValue(undefined),
    reset: vi.fn(),
    isPending: false,
    isError: false,
    error: null,
  };
}

function renderPage() {
  return renderWithProviders(
    <MemoryRouter>
      <AccountHoldersPage />
    </MemoryRouter>
  );
}

describe('AccountHoldersPage', () => {
  let freeze;
  let deactivate;

  beforeEach(() => {
    vi.clearAllMocks();
    freeze = mutationResult();
    deactivate = mutationResult();
    useUnfreezeAdminAccount.mockReturnValue(mutationResult());
    useAdminAccounts.mockReturnValue({
      data: {
        content: [account],
        page: { number: 0, size: 10, totalElements: 1, totalPages: 1 },
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });
    useAdminAccount.mockImplementation((accountId) => ({
      data: accountId == null ? undefined : account,
      isLoading: false,
      isError: false,
      error: null,
    }));
    useAdminUser.mockImplementation((userId) => ({
      data:
        userId == null
          ? undefined
          : { id: 4, name: 'Amina Khan', email: 'amina@example.com' },
      isLoading: false,
      isError: false,
      error: null,
    }));
    useFreezeAdminAccount.mockReturnValue(freeze);
    useDeactivateAdminAccount.mockReturnValue(deactivate);
    useCreateAdminUser.mockReturnValue(mutationResult());
    useUpdateAdminUser.mockReturnValue(mutationResult());
  });

  test('loads account and owner details', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getAllByRole('button', { name: 'Details' })[0]);
    expect(await screen.findByText('Amina Khan')).toBeInTheDocument();
    expect(screen.getByText('amina@example.com')).toBeInTheDocument();
    expect(useAdminAccount).toHaveBeenLastCalledWith(8);
    expect(useAdminUser).toHaveBeenLastCalledWith(4);
  });

  test('confirms account freezing', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getAllByRole('button', { name: 'Freeze' })[0]);
    await user.click(screen.getByRole('button', { name: 'Freeze Account' }));

    await waitFor(() => expect(freeze.mutateAsync).toHaveBeenCalledWith(8));
    expect(await screen.findByText('Account frozen')).toBeInTheDocument();
  });

  test('makes closed accounts view-only', () => {
    useAdminAccounts.mockReturnValue({
      data: {
        content: [{ ...account, accountStatus: 'CLOSED' }],
        page: { number: 0, size: 10, totalElements: 1, totalPages: 1 },
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });
    renderPage();

    expect(screen.getAllByRole('button', { name: 'Details' })).not.toHaveLength(0);
    expect(screen.queryByRole('button', { name: 'Freeze' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Deactivate' })).not.toBeInTheDocument();
  });
});
