import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import {
  createTransfer,
  createWithdrawal,
  getMyTransactionById,
  getMyTransactions,
} from '../../api/transactions.js';
import {
  transactionKeys,
  useCreateTransfer,
  useCreateWithdrawal,
  useMyTransactionById,
  useMyTransactions,
} from './transactions.queries.js';

vi.mock('../../api/transactions.js', () => ({
  createTransfer: vi.fn(),
  createWithdrawal: vi.fn(),
  getMyTransactions: vi.fn(),
  getMyTransactionById: vi.fn(),
}));

function renderQueryHook(callback) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return { queryClient, ...renderHook(callback, { wrapper }) };
}

describe('transaction queries', () => {
  test('uses supplied filters as the list query key and request payload', async () => {
    const filters = { page: 1, size: 20, status: 'PENDING' };
    getMyTransactions.mockResolvedValueOnce({ content: [] });

    const { result } = renderQueryHook(() => useMyTransactions(filters));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getMyTransactions).toHaveBeenCalledWith(filters);
    expect(transactionKeys.myTransactions(filters)).toEqual([
      'transactions',
      'me',
      filters,
    ]);
  });

  test('does not fetch a transaction detail without an id', () => {
    const { result } = renderQueryHook(() => useMyTransactionById());

    expect(result.current.fetchStatus).toBe('idle');
    expect(getMyTransactionById).not.toHaveBeenCalled();
  });

  test('fetches a transaction detail when an id is supplied', async () => {
    getMyTransactionById.mockResolvedValueOnce({ id: 19 });
    const { result } = renderQueryHook(() => useMyTransactionById(19));

    await waitFor(() => expect(result.current.data).toEqual({ id: 19 }));
    expect(getMyTransactionById).toHaveBeenCalledWith(19);
  });

  test('invalidates all transaction queries after transfer and withdrawal success', async () => {
    createTransfer.mockResolvedValueOnce({ id: 1 });
    createWithdrawal.mockResolvedValueOnce({ id: 2 });
    const { queryClient, result } = renderQueryHook(() => ({
      transfer: useCreateTransfer(),
      withdrawal: useCreateWithdrawal(),
    }));
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');

    result.current.transfer.mutate({ amount: 10 });
    await waitFor(() => expect(result.current.transfer.isSuccess).toBe(true));
    result.current.withdrawal.mutate({ amount: 5 });
    await waitFor(() => expect(result.current.withdrawal.isSuccess).toBe(true));

    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: transactionKeys.all });
    expect(createTransfer).toHaveBeenCalledWith({ amount: 10 });
    expect(createWithdrawal).toHaveBeenCalledWith({ amount: 5 });
  });
});
