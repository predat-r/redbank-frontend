import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import {
  approveAdminTransaction,
  createAdminDeposit,
  getAdminAuditLog,
  getAdminAuditLogs,
  getAdminBalanceLedger,
  getAdminLatestBalance,
  getAdminTransactions,
  getAdminUsers,
  updateAdminUser,
} from '../../api/admin.js';
import {
  adminKeys,
  useAdminAuditLog,
  useAdminAuditLogs,
  useAdminBalanceLedger,
  useAdminLatestBalance,
  useAdminTransactions,
  useAdminUsers,
  useApproveAdminTransaction,
  useCreateAdminDeposit,
  useUpdateAdminUser,
} from './admin.queries.js';

vi.mock('../../api/admin.js', () => ({
  approveRegistration: vi.fn(),
  createAdminUser: vi.fn(),
  deactivateAdminAccount: vi.fn(),
  deactivateAdminUser: vi.fn(),
  freezeAdminAccount: vi.fn(),
  unfreezeAdminAccount: vi.fn(),
  getAdminAccount: vi.fn(),
  getAdminAccounts: vi.fn(),
  getAdminTransactions: vi.fn(),
  getAdminTransaction: vi.fn(),
  getAdminTransactionByReference: vi.fn(),
  getAdminTransactionsByAccount: vi.fn(),
  getAdminAnomalyReport: vi.fn(),
  approveAdminTransaction: vi.fn(),
  rejectAdminTransaction: vi.fn(),
  createAdminDeposit: vi.fn(),
  getAdminLatestBalance: vi.fn(),
  getAdminBalanceLedger: vi.fn(),
  getAdminAuditLogs: vi.fn(),
  getAdminAuditLog: vi.fn(),
  getAdminUser: vi.fn(),
  getAdminUsers: vi.fn(),
  getPendingRegistration: vi.fn(),
  getPendingRegistrations: vi.fn(),
  rejectRegistration: vi.fn(),
  reactivateAdminUser: vi.fn(),
  updateAdminUser: vi.fn(),
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

describe('admin queries', () => {
  test('uses list options for users and transactions', async () => {
    const options = { page: 1, size: 20, sort: ['createdAt,desc'] };
    getAdminUsers.mockResolvedValueOnce({ content: [] });
    getAdminTransactions.mockResolvedValueOnce({ content: [] });
    const { result } = renderQueryHook(() => ({
      users: useAdminUsers(options),
      transactions: useAdminTransactions(options),
    }));

    await waitFor(() => expect(result.current.users.isSuccess).toBe(true));
    await waitFor(() => expect(result.current.transactions.isSuccess).toBe(true));
    expect(getAdminUsers).toHaveBeenCalledWith(options);
    expect(getAdminTransactions).toHaveBeenCalledWith(options);
    expect(adminKeys.userList(options)).toEqual(['admin', 'users', 'list', options]);
  });

  test('does not load account-specific resources until an id is supplied', () => {
    const { result } = renderQueryHook(() => ({
      balance: useAdminLatestBalance(),
      ledger: useAdminBalanceLedger(),
      detail: useAdminAuditLog(),
    }));

    expect(result.current.balance.fetchStatus).toBe('idle');
    expect(result.current.ledger.fetchStatus).toBe('idle');
    expect(result.current.detail.fetchStatus).toBe('idle');
    expect(getAdminLatestBalance).not.toHaveBeenCalled();
    expect(getAdminBalanceLedger).not.toHaveBeenCalled();
    expect(getAdminAuditLog).not.toHaveBeenCalled();
  });

  test('fetches audit logs and cache-backed balance resources', async () => {
    getAdminAuditLogs.mockResolvedValueOnce({ content: [] });
    getAdminLatestBalance.mockResolvedValueOnce({ runningBalance: 100 });
    getAdminBalanceLedger.mockResolvedValueOnce({ content: [] });
    getAdminAuditLog.mockResolvedValueOnce({ id: 9 });
    const options = { page: 0, size: 10 };
    const { result } = renderQueryHook(() => ({
      logs: useAdminAuditLogs(options),
      balance: useAdminLatestBalance(3),
      ledger: useAdminBalanceLedger(3, options),
      detail: useAdminAuditLog(9),
    }));

    await waitFor(() => expect(result.current.detail.data).toEqual({ id: 9 }));
    expect(getAdminAuditLogs).toHaveBeenCalledWith(options);
    expect(getAdminLatestBalance).toHaveBeenCalledWith(3);
    expect(getAdminBalanceLedger).toHaveBeenCalledWith(3, options);
  });

  test('invalidates affected lists and details after successful mutations', async () => {
    approveAdminTransaction.mockResolvedValueOnce({ id: 12 });
    createAdminDeposit.mockResolvedValueOnce({ id: 13 });
    updateAdminUser.mockResolvedValueOnce({ id: 4 });
    const { queryClient, result } = renderQueryHook(() => ({
      approve: useApproveAdminTransaction(),
      deposit: useCreateAdminDeposit(),
      update: useUpdateAdminUser(),
    }));
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');

    result.current.approve.mutate(12);
    await waitFor(() => expect(result.current.approve.isSuccess).toBe(true));
    result.current.deposit.mutate({ amount: 25 });
    await waitFor(() => expect(result.current.deposit.isSuccess).toBe(true));
    result.current.update.mutate({ userId: 4, payload: { name: 'Amina' } });
    await waitFor(() => expect(result.current.update.isSuccess).toBe(true));

    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: adminKeys.transactions });
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: adminKeys.user(4) });
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: adminKeys.accounts });
  });
});
