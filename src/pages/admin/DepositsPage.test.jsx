import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import {
  useAdminAccounts,
  useCreateAdminDeposit,
} from '../../features/admin/admin.queries.js';
import { renderWithProviders } from '../../test/render.jsx';
import { DepositsPage } from './DepositsPage.jsx';

vi.mock('../../features/admin/admin.queries.js', () => ({
  useAdminAccounts: vi.fn(),
  useCreateAdminDeposit: vi.fn(),
}));

describe('DepositsPage', () => {
  const mutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAdminAccounts.mockReturnValue({
      isLoading: false,
      data: {
        content: [
          {
            accountNumber: 'RB-100',
            accountStatus: 'ACTIVE',
            user: { name: 'Amina Khan' },
          },
          {
            accountNumber: 'RB-200',
            accountStatus: 'CLOSED',
            user: { name: 'Closed User' },
          },
        ],
      },
    });
    useCreateAdminDeposit.mockReturnValue({ isPending: false, isError: false, mutate });
  });

  test('filters out closed accounts and submits the selected account as a number', async () => {
    const user = userEvent.setup();
    renderWithProviders(<DepositsPage />);

    await user.click(screen.getByLabelText('Account number'));
    expect(screen.getByText('Amina Khan')).toBeInTheDocument();
    expect(screen.queryByText('Closed User')).not.toBeInTheDocument();
    await user.click(screen.getByText('Amina Khan'));
    await user.type(screen.getByLabelText('Amount'), '125.50');
    await user.type(screen.getByLabelText('Note'), 'Cash adjustment');
    await user.click(screen.getByRole('button', { name: /create deposit/i }));

    expect(mutate).toHaveBeenCalledWith({
      accountNumber: 'RB-100',
      amount: 125.5,
      description: 'Cash adjustment',
    });
  });

  test('renders a completed deposit receipt', () => {
    useCreateAdminDeposit.mockReturnValue({
      isPending: false,
      isError: false,
      mutate,
      data: { transactionReference: 'DEP-101', amount: 125.5, status: 'COMPLETED' },
    });
    renderWithProviders(<DepositsPage />);

    expect(screen.getByText('Deposit completed')).toBeInTheDocument();
    expect(screen.getByText('DEP-101')).toBeInTheDocument();
    expect(screen.getByText('COMPLETED')).toBeInTheDocument();
  });

  test('shows a submission error returned by the mutation', () => {
    useCreateAdminDeposit.mockReturnValue({
      isPending: false,
      isError: true,
      error: new Error('Account is closed'),
      mutate,
    });
    renderWithProviders(<DepositsPage />);

    expect(screen.getByText('Account is closed')).toBeInTheDocument();
  });
});
