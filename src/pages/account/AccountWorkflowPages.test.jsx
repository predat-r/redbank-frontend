import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { useMyAccount } from '../../features/account/account.queries.js';
import { TransferPage } from './TransferPage.jsx';
import { WithdrawPage } from './WithdrawPage.jsx';

const navigate = vi.fn();

vi.mock('../../layouts/AppShell', () => ({
  AppShell: ({ children }) => <>{children}</>,
}));
vi.mock('../../features/account/account.queries.js', () => ({ useMyAccount: vi.fn() }));
vi.mock('../../features/transactions/components/TransactionForm', () => ({
  TransactionForm: ({ initialMode }) => <p>Transaction form: {initialMode}</p>,
}));
vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => navigate,
}));

function renderPage(page) {
  return render(<MemoryRouter>{page}</MemoryRouter>);
}

describe('account workflow pages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useMyAccount.mockReturnValue({ data: { accountStatus: 'ACTIVE' } });
  });

  test('renders transfer and withdrawal forms for an active account', () => {
    const { rerender } = renderPage(<TransferPage />);
    expect(screen.getByText('Transaction form: transfer')).toBeInTheDocument();

    rerender(
      <MemoryRouter>
        <WithdrawPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Transaction form: withdrawal')).toBeInTheDocument();
  });

  test('locks outgoing workflows for a frozen account and offers safe navigation', async () => {
    const user = userEvent.setup();
    useMyAccount.mockReturnValue({ data: { accountStatus: 'FROZEN' } });
    renderPage(<TransferPage />);

    expect(screen.getByText('Fund Transfers Locked')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /back to dashboard/i }));
    await user.click(screen.getByRole('button', { name: /unfreeze account/i }));
    expect(navigate).toHaveBeenNthCalledWith(1, '/dashboard');
    expect(navigate).toHaveBeenNthCalledWith(2, '/profile');
  });

  test('uses withdrawal-specific frozen messaging', () => {
    useMyAccount.mockReturnValue({ data: { accountStatus: 'FROZEN' } });
    renderPage(<WithdrawPage />);

    expect(screen.getByText('Cash Withdrawals Locked')).toBeInTheDocument();
  });
});
