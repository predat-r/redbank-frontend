import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { useMyAccount } from '../../account/account.queries.js';
import { useMyTransactionById } from '../transactions.queries.js';
import { TransactionDetailModal } from './TransactionDetailModal.jsx';

const navigate = vi.fn();

vi.mock('../../account/account.queries.js', () => ({ useMyAccount: vi.fn() }));
vi.mock('../transactions.queries.js', () => ({ useMyTransactionById: vi.fn() }));
vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => navigate,
}));

const transfer = {
  id: 8,
  type: 'TRANSFER',
  amount: 42.5,
  status: 'COMPLETED',
  transactionReference: 'TX-8',
  sourceAccountNumber: 'RB-SOURCE',
  sourceAccountHolderName: 'Ali Khan',
  destinationAccountNumber: 'RB-ME',
  destinationAccountHolderName: 'Amina Khan',
  createdAt: '2026-08-13T10:00:00Z',
  completedAt: '2026-08-13T10:01:00Z',
  category: 'BILLS',
  description: 'Electricity bill',
  reversedTransactionReference: 'TX-3',
};

function renderModal(props = {}) {
  return render(
    <MemoryRouter>
      <TransactionDetailModal
        transaction={transfer}
        isOpen
        onClose={vi.fn()}
        {...props}
      />
    </MemoryRouter>
  );
}

describe('TransactionDetailModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useMyAccount.mockReturnValue({ data: { accountNumber: 'RB-ME' } });
    useMyTransactionById.mockReturnValue({ data: undefined, isLoading: false });
  });

  afterEach(() => vi.restoreAllMocks());

  test('does not query or render a closed modal', () => {
    render(
      <MemoryRouter>
        <TransactionDetailModal transaction={transfer} isOpen={false} onClose={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(useMyTransactionById).toHaveBeenCalledWith(null);
  });

  test('shows an incoming transfer receipt and copies its reference', async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, 'writeText');
    renderModal();

    expect(screen.getByText('Transfer Received')).toBeInTheDocument();
    expect(screen.getByText('Ali Khan')).toBeInTheDocument();
    expect(screen.getByText('Amina Khan')).toBeInTheDocument();
    expect(screen.getByText('Electricity bill')).toBeInTheDocument();
    await user.click(screen.getByTitle('Copy Reference Code'));
    expect(writeText).toHaveBeenCalledWith('TX-8');
    expect(screen.getByRole('button', { name: /send back/i })).toBeInTheDocument();
  });

  test('repeats an outgoing transfer with its original destination and amount', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    useMyAccount.mockReturnValue({ data: { accountNumber: 'RB-OTHER' } });
    renderModal({ onClose });

    await user.click(screen.getByRole('button', { name: /repeat transfer/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith('/transfer', {
      state: { destinationAccountNumber: 'RB-ME', amount: 42.5 },
    });
  });

  test('repeats a withdrawal through the withdrawal workflow', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderModal({ transaction: { ...transfer, type: 'WITHDRAWAL' }, onClose });

    await user.click(screen.getByRole('button', { name: /repeat withdrawal/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith('/withdraw', { state: { amount: 42.5 } });
  });
});
