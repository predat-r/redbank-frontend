import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { useAdminOverview } from '../../features/admin/admin.queries.js';
import { AdminOverviewPage } from './AdminOverviewPage.jsx';

vi.mock('../../features/admin/admin.queries.js', () => ({
  useAdminOverview: vi.fn(),
}));

const overviewState = {
  counts: {
    registrations: 4,
    users: 128,
    accounts: 96,
    transactions: 2340,
  },
  isLoading: false,
  isError: false,
  error: null,
  refetch: vi.fn(),
};

function renderPage() {
  return render(
    <MemoryRouter>
      <AdminOverviewPage />
    </MemoryRouter>
  );
}

describe('AdminOverviewPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAdminOverview.mockReturnValue(overviewState);
  });

  test('renders API totals and links to each admin collection', () => {
    renderPage();

    expect(screen.getByRole('heading', { name: 'Admin overview' })).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('128')).toBeInTheDocument();
    expect(screen.getByText('96')).toBeInTheDocument();
    expect(screen.getByText('2340')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Pending registrations/i })).toHaveAttribute(
      'href',
      '/admin/registrations'
    );
    expect(screen.getByRole('link', { name: /Total users/i })).toHaveAttribute(
      'href',
      '/admin/users'
    );
  });

  test('shows unavailable totals and retries partial API failures', async () => {
    const user = userEvent.setup();
    const refetch = vi.fn();
    useAdminOverview.mockReturnValue({
      ...overviewState,
      counts: { ...overviewState.counts, transactions: undefined },
      isError: true,
      error: new Error('Transaction service unavailable'),
      refetch,
    });
    renderPage();

    expect(screen.getByText('Transaction service unavailable')).toBeInTheDocument();
    expect(screen.getByText('Unavailable')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(refetch).toHaveBeenCalledOnce();
  });
});
