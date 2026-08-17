import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { HistoryPage } from './HistoryPage.jsx';

const navigate = vi.fn();
const addToast = vi.fn();
const transaction = { id: 3, destinationAccountNumber: 'RB-9', amount: 75 };

vi.mock('../../layouts/AppShell', () => ({
  AppShell: ({ children }) => <>{children}</>,
}));
vi.mock('../../features/transactions/components/TransactionHistory', () => ({
  TransactionHistory: ({ onRowClick, onExport, onSendAgain }) => (
    <div>
      <button onClick={() => onRowClick(transaction)}>Open transaction</button>
      <button onClick={onExport}>Export statement</button>
      <button onClick={() => onSendAgain(transaction)}>Send again</button>
    </div>
  ),
}));
vi.mock('../../features/transactions/components/TransactionDetailModal', () => ({
  TransactionDetailModal: ({ transaction: selected, isOpen, onClose }) =>
    isOpen ? <button onClick={onClose}>Close {selected.id}</button> : null,
}));
vi.mock('../../hooks/useToast', () => ({ useToast: () => ({ addToast }) }));
vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => navigate,
}));

describe('HistoryPage', () => {
  beforeEach(() => vi.clearAllMocks());

  test('opens and closes a selected transaction detail', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <HistoryPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: 'Transaction History' })
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Open transaction' }));
    expect(screen.getByRole('button', { name: 'Close 3' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Close 3' }));
    expect(screen.queryByRole('button', { name: 'Close 3' })).not.toBeInTheDocument();
  });

  test('exports a statement and pre-populates repeat transfer navigation', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <HistoryPage />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: 'Export statement' }));
    expect(addToast).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'success',
        title: 'Statement Downloaded',
      })
    );
    await user.click(screen.getByRole('button', { name: 'Send again' }));
    expect(navigate).toHaveBeenCalledWith('/transfer', {
      state: { destinationAccountNumber: 'RB-9', amount: 75 },
    });
  });
});
