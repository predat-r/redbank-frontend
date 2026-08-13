import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { useMyAccount } from '../../account/account.queries.js';
import { useMyTransactions } from '../transactions.queries.js';
import { renderWithProviders } from '../../../test/render.jsx';
import { TransactionHistory } from './TransactionHistory.jsx';

vi.mock('../../account/account.queries.js', () => ({ useMyAccount: vi.fn() }));
vi.mock('../transactions.queries.js', () => ({ useMyTransactions: vi.fn() }));
vi.mock('../../../components/ui', () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
  StatusBadge: ({ status }) => <span>{status}</span>,
  Table: ({ data, emptyMessage, loading, onRowClick, pagination, sorting }) => (
    <div>
      {loading && <span>Loading transactions</span>}
      {!loading && !data.length && <span>{emptyMessage}</span>}
      {data.map((row) => (
        <button key={row.id} onClick={() => onRowClick?.(row)}>
          {row.description}
        </button>
      ))}
      {pagination && (
        <button onClick={() => pagination.onPageChange(1)}>Next page</button>
      )}
      {sorting && (
        <button
          onClick={() => sorting.onSortChange({ field: 'amount', direction: 'asc' })}
        >
          Sort
        </button>
      )}
    </div>
  ),
}));

function renderHistory(props) {
  return renderWithProviders(
    <MemoryRouter>
      <TransactionHistory {...props} />
    </MemoryRouter>
  );
}

describe('TransactionHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useMyAccount.mockReturnValue({ data: { accountNumber: 'RB-001' } });
    useMyTransactions.mockReturnValue({
      data: { content: [], page: { totalPages: 1, totalElements: 0 } },
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    });
  });

  test('shows the empty state and sends only applied filters to the query hook', async () => {
    const user = userEvent.setup();
    renderHistory();

    expect(
      screen.getByText('No transactions matching your specific filter criteria.')
    ).toBeInTheDocument();
    expect(useMyTransactions).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 0, size: 10, sort: 'createdAt,desc' })
    );

    await user.selectOptions(screen.getByLabelText('Status'), 'PENDING');
    expect(useMyTransactions).toHaveBeenLastCalledWith(
      expect.not.objectContaining({ status: 'PENDING' })
    );
    await user.click(screen.getByRole('button', { name: 'Apply Filters' }));

    expect(useMyTransactions).toHaveBeenLastCalledWith(
      expect.objectContaining({ status: 'PENDING', page: 0 })
    );
  });

  test('passes selected rows to its consumer and supports pagination', async () => {
    const user = userEvent.setup();
    const transaction = {
      id: 1,
      description: 'Rent payment',
      amount: 50,
      type: 'TRANSFER',
    };
    const onRowClick = vi.fn();
    useMyTransactions.mockReturnValue({
      data: { content: [transaction], page: { totalPages: 3, totalElements: 21 } },
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    });
    renderHistory({ onRowClick });

    await user.click(screen.getByRole('button', { name: 'Rent payment' }));
    expect(onRowClick).toHaveBeenCalledWith(transaction);
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(useMyTransactions).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 1 })
    );
  });

  test('passes its loading state to the table', () => {
    useMyTransactions.mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: true,
      refetch: vi.fn(),
    });
    renderHistory();

    expect(screen.getByText('Loading transactions')).toBeInTheDocument();
  });
});
