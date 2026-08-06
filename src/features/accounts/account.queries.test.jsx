import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { getCurrentAccount } from '../../api/accounts.js';
import { renderWithProviders } from '../../test/render.jsx';
import { useCurrentAccount } from './account.queries.js';

vi.mock('../../api/accounts.js', () => ({ getCurrentAccount: vi.fn() }));

function AccountProbe() {
  const accountQuery = useCurrentAccount();
  if (accountQuery.isPending) return <p>Loading account</p>;
  if (accountQuery.isError) return <p>{accountQuery.error.message}</p>;
  return <p>{accountQuery.data.accountNumber}</p>;
}

describe('useCurrentAccount', () => {
  beforeEach(() => vi.clearAllMocks());

  test('loads the current account-holder record', async () => {
    getCurrentAccount.mockResolvedValue({ accountNumber: 'RB-10001' });
    renderWithProviders(<AccountProbe />);

    expect(await screen.findByText('RB-10001')).toBeInTheDocument();
  });

  test('exposes account-loading errors', async () => {
    getCurrentAccount.mockRejectedValue(new Error('Account unavailable'));
    renderWithProviders(<AccountProbe />);

    expect(await screen.findByText('Account unavailable')).toBeInTheDocument();
  });
});
