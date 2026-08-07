import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import {
  getMyAccount,
  freezeMyAccount,
  unfreezeMyAccount,
  deactivateMyAccount,
} from '../../api/accounts.js';
import { getLatestBalance } from '../../api/balance.js';
import {
  useMyAccount,
  useLatestBalance,
  useFreezeAccount,
  useUnfreezeAccount,
  useDeactivateAccount,
} from './account.queries.js';

vi.mock('../../api/accounts.js', () => ({
  getMyAccount: vi.fn(),
  freezeMyAccount: vi.fn(),
  unfreezeMyAccount: vi.fn(),
  deactivateMyAccount: vi.fn(),
}));

vi.mock('../../api/balance.js', () => ({
  getLatestBalance: vi.fn(),
}));

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

function wrapper({ children }) {
  const queryClient = createTestQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('account queries and mutations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('useMyAccount hook fetches account data', async () => {
    const mockData = { id: 3, accountNumber: 'RBA4EFD3DFC8', accountStatus: 'ACTIVE' };
    getMyAccount.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useMyAccount(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
    expect(getMyAccount).toHaveBeenCalledTimes(1);
  });

  test('useLatestBalance hook fetches latest balance data', async () => {
    const mockBalance = { id: 1, runningBalance: 5000.0, currency: 'USD' };
    getLatestBalance.mockResolvedValueOnce(mockBalance);

    const { result } = renderHook(() => useLatestBalance(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockBalance);
    expect(getLatestBalance).toHaveBeenCalledTimes(1);
  });

  test('useFreezeAccount mutation executes freezeMyAccount API call', async () => {
    const frozenResponse = { id: 3, accountStatus: 'FROZEN' };
    freezeMyAccount.mockResolvedValueOnce(frozenResponse);

    const { result } = renderHook(() => useFreezeAccount(), { wrapper });

    result.current.mutate();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(freezeMyAccount).toHaveBeenCalledTimes(1);
  });

  test('useUnfreezeAccount mutation executes unfreezeMyAccount API call', async () => {
    const activeResponse = { id: 3, accountStatus: 'ACTIVE' };
    unfreezeMyAccount.mockResolvedValueOnce(activeResponse);

    const { result } = renderHook(() => useUnfreezeAccount(), { wrapper });

    result.current.mutate();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(unfreezeMyAccount).toHaveBeenCalledTimes(1);
  });

  test('useDeactivateAccount mutation executes deactivateMyAccount API call', async () => {
    const deactivatedResponse = { id: 3, accountStatus: 'DEACTIVATED' };
    deactivateMyAccount.mockResolvedValueOnce(deactivatedResponse);

    const { result } = renderHook(() => useDeactivateAccount(), { wrapper });

    result.current.mutate();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(deactivateMyAccount).toHaveBeenCalledTimes(1);
  });
});
