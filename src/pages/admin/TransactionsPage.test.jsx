import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import {
  getAdminTransactions,
  getAdminTransaction,
  getAdminAnomalyReport,
  approveAdminTransaction,
  rejectAdminTransaction,
} from '../../api/admin.js';
import { renderWithProviders } from '../../test/render.jsx';
import { TransactionsPage } from './TransactionsPage.jsx';

vi.mock('../../api/admin.js', () => ({
  getAdminTransactions: vi.fn(),
  getAdminTransaction: vi.fn(),
  getAdminAnomalyReport: vi.fn(),
  approveAdminTransaction: vi.fn(),
  rejectAdminTransaction: vi.fn(),
}));

const mockTx = {
  id: 105,
  transactionReference: 'TXN-99887766',
  type: 'TRANSFER',
  category: 'INVESTMENT',
  amount: 55000,
  status: 'PENDING',
  anomalyFlag: 'HIGH',
  sourceAccountNumber: 'RB1000000001',
  destinationAccountNumber: 'RB1000000002',
  createdAt: '2026-08-11T12:00:00Z',
  completedAt: null,
  description: 'High value transfer',
};

const mockReport = {
  id: 1,
  transactionId: 105,
  transactionReference: 'TXN-99887766',
  riskScore: 75,
  recommendation: 'MANUAL_REVIEW',
  reasoning: 'Unusually high amount for account velocity history',
  createdAt: '2026-08-11T12:00:00Z',
};

function pageResponse(content = [mockTx]) {
  return {
    content,
    page: {
      number: 0,
      size: 10,
      totalElements: content.length,
      totalPages: 1,
    },
  };
}

function renderPage() {
  return renderWithProviders(
    <MemoryRouter>
      <TransactionsPage />
    </MemoryRouter>
  );
}

describe('TransactionsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getAdminTransactions.mockResolvedValue(pageResponse());
    getAdminTransaction.mockResolvedValue(mockTx);
    getAdminAnomalyReport.mockResolvedValue(mockReport);
    approveAdminTransaction.mockResolvedValue({ ...mockTx, status: 'COMPLETED' });
    rejectAdminTransaction.mockResolvedValue({ ...mockTx, status: 'CANCELLED' });
  });

  test('renders transactions with anomaly risk badges and detail modal', async () => {
    const user = userEvent.setup();
    renderPage();

    const refs = await screen.findAllByText('TXN-99887766');
    expect(refs.length).toBeGreaterThan(0);
    expect(screen.getAllByText('High Risk').length).toBeGreaterThan(0);

    await user.click(refs[0]);

    expect(
      await screen.findByText('Transaction details & Risk Review')
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Unusually high amount for account/)
    ).toBeInTheDocument();
    expect(screen.getByText('Risk Score: 75/100')).toBeInTheDocument();
  });

  test('allows admin to approve a pending transaction', async () => {
    const user = userEvent.setup();
    renderPage();

    const refs = await screen.findAllByText('TXN-99887766');
    await user.click(refs[0]);
    expect(
      await screen.findByText('Transaction details & Risk Review')
    ).toBeInTheDocument();

    const approveBtn = await screen.findByRole('button', { name: 'Approve Transaction' });
    await user.click(approveBtn);

    await waitFor(() => {
      expect(approveAdminTransaction).toHaveBeenCalledWith(105);
    });
  });

  test('allows admin to reject a pending transaction with reason', async () => {
    const user = userEvent.setup();
    renderPage();

    const refs = await screen.findAllByText('TXN-99887766');
    await user.click(refs[0]);
    expect(
      await screen.findByText('Transaction details & Risk Review')
    ).toBeInTheDocument();

    const rejectBtn = await screen.findByRole('button', { name: 'Reject Transaction' });
    await user.click(rejectBtn);

    const input = screen.getByPlaceholderText(/Suspicious velocity/);
    await user.type(input, 'AI flagged high anomaly');

    await user.click(screen.getByRole('button', { name: 'Confirm Rejection' }));

    await waitFor(() => {
      expect(rejectAdminTransaction).toHaveBeenCalledWith({
        transactionId: 105,
        reason: 'AI flagged high anomaly',
      });
    });
  });
});
