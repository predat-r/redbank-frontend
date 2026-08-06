import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { createTransfer, createWithdrawal } from '../../../api/transactions.js';
import { renderWithProviders } from '../../../test/render.jsx';
import { TransactionForm } from './TransactionForm.jsx';

vi.mock('../../../api/transactions.js', () => ({
  createTransfer: vi.fn(),
  createWithdrawal: vi.fn(),
  getMyTransactions: vi.fn(),
}));

function renderComponent(props = {}) {
  return renderWithProviders(
    <MemoryRouter>
      <TransactionForm {...props} />
    </MemoryRouter>
  );
}

describe('TransactionForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('validates required destination account and amount limits', async () => {
    const user = userEvent.setup({ delay: null });
    renderComponent();

    const submitBtn = screen.getByRole('button', { name: /continue to verify/i });
    await user.click(submitBtn);

    expect(
      screen.getByText('Destination account number is required')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Please enter a valid amount greater than 0')
    ).toBeInTheDocument();
  });

  test('enforces minimum transaction amount of 100 PKR', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(screen.getByLabelText(/destination account number/i), 'ACC-12345');
    await user.type(screen.getByLabelText(/amount/i), '50');

    await user.click(screen.getByRole('button', { name: /continue to verify/i }));

    expect(screen.getByText('Minimum transaction amount is 100 PKR')).toBeInTheDocument();
  });

  test('completes transfer 3-step flow successfully', async () => {
    createTransfer.mockResolvedValueOnce({
      id: 99,
      transactionReference: 'TXN-REF999',
      type: 'TRANSFER',
      amount: 1500,
      status: 'COMPLETED',
    });

    const user = userEvent.setup({ delay: null });
    renderComponent();

    // Step 1: Initiate
    await user.type(screen.getByLabelText(/destination account number/i), 'ACC-888999');
    await user.type(screen.getByLabelText(/amount/i), '1500');
    await user.type(screen.getByLabelText(/description/i), 'Gift');

    await user.click(screen.getByRole('button', { name: /continue to verify/i }));

    // Step 2: Verify
    expect(screen.getByText('Verify Transaction Details')).toBeInTheDocument();
    expect(screen.getByText('ACC-888999')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /confirm & submit/i }));

    // Step 3: Status & Receipt
    await waitFor(() => {
      expect(createTransfer).toHaveBeenCalledWith({
        destinationAccountNumber: 'ACC-888999',
        amount: 1500,
        description: 'Gift',
      });
    });

    expect(
      await screen.findByRole('heading', { level: 2, name: 'Transfer Successful' })
    ).toBeInTheDocument();
    expect(screen.getByText('TXN-REF999')).toBeInTheDocument();
  });

  test('switches mode to cash withdrawal and submits request', async () => {
    createWithdrawal.mockResolvedValueOnce({
      id: 100,
      transactionReference: 'TXN-WITHDRAW100',
      type: 'WITHDRAWAL',
      amount: 5000,
      status: 'COMPLETED',
    });

    const user = userEvent.setup({ delay: null });
    renderComponent({ initialMode: 'withdrawal' });

    expect(screen.getByText('Withdrawal Request')).toBeInTheDocument();

    await user.type(screen.getByLabelText(/amount/i), '5000');
    await user.click(screen.getByRole('button', { name: /continue to verify/i }));

    expect(screen.getByText('Verify Transaction Details')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /confirm & submit/i }));

    await waitFor(() => {
      expect(createWithdrawal).toHaveBeenCalledWith({
        amount: 5000,
        description: 'Cash Withdrawal via ATM_CODE',
      });
    });

    expect(
      await screen.findByRole('heading', { level: 2, name: 'Withdrawal Completed' })
    ).toBeInTheDocument();
  });
});
