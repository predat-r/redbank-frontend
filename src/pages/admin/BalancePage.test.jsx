import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import {
  useAdminBalanceLedger,
  useAdminLatestBalance,
} from '../../features/admin/admin.queries.js';
import { BalancePage } from './BalancePage.jsx';

vi.mock('../../features/admin/admin.queries.js', () => ({
  useAdminBalanceLedger: vi.fn(),
  useAdminLatestBalance: vi.fn(),
}));
vi.mock('../../features/admin/useAdminListParams.js', () => ({
  useAdminListParams: vi.fn(() => ({
    page: 0,
    size: 10,
    field: 'entryDate',
    direction: 'desc',
    queryOptions: { page: 0, size: 10, sort: ['entryDate,desc'] },
    setPage: vi.fn(),
    setPageSize: vi.fn(),
    setSorting: vi.fn(),
  })),
}));
vi.mock('../../components/ui/Table.jsx', () => ({
  Table: ({ data, emptyMessage, loading, sorting }) => (
    <div>
      {loading && <span>Loading ledger</span>}
      {!loading && !data.length && <span>{emptyMessage}</span>}
      {data.map((entry) => (
        <span key={entry.id}>{entry.runningBalance}</span>
      ))}
      <button onClick={() => sorting.onSortChange({ field: 'amount', direction: 'asc' })}>
        Sort ledger
      </button>
    </div>
  ),
}));

function renderBalance() {
  return (
    <MemoryRouter initialEntries={['/admin/balance/7']}>
      <Routes>
        <Route path="/admin/balance/:accountId" element={<BalancePage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('BalancePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAdminLatestBalance.mockReturnValue({
      isLoading: false,
      data: { runningBalance: 900 },
    });
    useAdminBalanceLedger.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        content: [],
        page: { number: 0, size: 10, totalElements: 0, totalPages: 1 },
      },
    });
  });

  test('loads the latest balance and ledger for the route account', () => {
    render(renderBalance());

    expect(useAdminLatestBalance).toHaveBeenCalledWith('7');
    expect(useAdminBalanceLedger).toHaveBeenCalledWith('7', {
      page: 0,
      size: 10,
      sort: ['entryDate,desc'],
    });
    expect(screen.getByText('900')).toBeInTheDocument();
    expect(screen.getByText('No ledger entries yet')).toBeInTheDocument();
  });

  test('shows a retriable ledger error', () => {
    const refetch = vi.fn();
    useAdminBalanceLedger.mockReturnValue({
      isLoading: false,
      isError: true,
      error: new Error('Unavailable'),
      refetch,
    });
    render(renderBalance());

    expect(screen.getByText('Unable to load ledger')).toBeInTheDocument();
    expect(screen.getByText('Unavailable')).toBeInTheDocument();
  });
});
