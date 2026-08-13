import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import {
  approveRegistration,
  approveAdminTransaction,
  createAdminDeposit,
  createAdminUser,
  deactivateAdminAccount,
  deactivateAdminUser,
  freezeAdminAccount,
  getAdminAccount,
  getAdminAccounts,
  getAdminAnomalyReport,
  getAdminAuditLog,
  getAdminAuditLogs,
  getAdminBalanceLedger,
  getAdminLatestBalance,
  getAdminTransaction,
  getAdminTransactionByReference,
  getAdminTransactions,
  getAdminTransactionsByAccount,
  getAdminUser,
  getAdminUsers,
  getPendingRegistration,
  getPendingRegistrations,
  reactivateAdminUser,
  rejectAdminTransaction,
  rejectRegistration,
  unfreezeAdminAccount,
  updateAdminUser,
} from '../../api/admin.js';
import {
  adminKeys,
  useAdminAccount,
  useAdminAccounts,
  useAdminAnomalyReport,
  useAdminAuditLog,
  useAdminAuditLogs,
  useAdminBalanceLedger,
  useAdminLatestBalance,
  useAdminTransaction,
  useAdminTransactionByReference,
  useAdminTransactions,
  useAdminTransactionsByAccount,
  useAdminUser,
  useAdminUsers,
  useApproveRegistration,
  useApproveAdminTransaction,
  useCreateAdminUser,
  useCreateAdminDeposit,
  useDeactivateAdminAccount,
  useDeactivateAdminUser,
  useFreezeAdminAccount,
  usePendingRegistration,
  usePendingRegistrations,
  useReactivateAdminUser,
  useRejectAdminTransaction,
  useRejectRegistration,
  useUnfreezeAdminAccount,
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
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: adminKeys.users });
  });

  test('loads enabled detail queries and keeps disabled queries idle', async () => {
    const options = { page: 0, size: 10 };
    [
      getPendingRegistrations,
      getPendingRegistration,
      getAdminUser,
      getAdminAccounts,
      getAdminAccount,
      getAdminTransactionsByAccount,
      getAdminTransaction,
      getAdminTransactionByReference,
      getAdminAnomalyReport,
    ].forEach((api) => api.mockResolvedValueOnce({ id: 6, content: [] }));
    const { result } = renderQueryHook(() => ({
      registrations: usePendingRegistrations(0, 10),
      registration: usePendingRegistration(6),
      user: useAdminUser(6),
      accounts: useAdminAccounts(options),
      account: useAdminAccount(6),
      byAccount: useAdminTransactionsByAccount('RB-6', options),
      transaction: useAdminTransaction(6),
      byReference: useAdminTransactionByReference('REF-6'),
      anomaly: useAdminAnomalyReport(6),
      disabledAnomaly: useAdminAnomalyReport(6, false),
    }));

    await waitFor(() => expect(result.current.anomaly.isSuccess).toBe(true));
    expect(result.current.disabledAnomaly.fetchStatus).toBe('idle');
    expect(getPendingRegistrations).toHaveBeenCalledWith({ page: 0, size: 10 });
    expect(getAdminTransactionsByAccount).toHaveBeenCalledWith('RB-6', options);
    expect(getAdminTransactionByReference).toHaveBeenCalledWith('REF-6');
  });

  test('executes lifecycle and registration mutations with their cache invalidations', async () => {
    [
      createAdminUser,
      deactivateAdminUser,
      reactivateAdminUser,
      freezeAdminAccount,
      unfreezeAdminAccount,
      deactivateAdminAccount,
      approveRegistration,
      rejectRegistration,
      rejectAdminTransaction,
    ].forEach((api) => api.mockResolvedValueOnce({ id: 6 }));
    const { queryClient, result } = renderQueryHook(() => ({
      createUser: useCreateAdminUser(),
      deactivateUser: useDeactivateAdminUser(),
      reactivateUser: useReactivateAdminUser(),
      freeze: useFreezeAdminAccount(),
      unfreeze: useUnfreezeAdminAccount(),
      deactivateAccount: useDeactivateAdminAccount(),
      approveRegistration: useApproveRegistration(),
      rejectRegistration: useRejectRegistration(),
      rejectTransaction: useRejectAdminTransaction(),
    }));
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');

    result.current.createUser.mutate({ name: 'Amina' });
    await waitFor(() => expect(result.current.createUser.isSuccess).toBe(true));
    result.current.deactivateUser.mutate(6);
    await waitFor(() => expect(result.current.deactivateUser.isSuccess).toBe(true));
    result.current.reactivateUser.mutate(6);
    await waitFor(() => expect(result.current.reactivateUser.isSuccess).toBe(true));
    result.current.freeze.mutate(6);
    await waitFor(() => expect(result.current.freeze.isSuccess).toBe(true));
    result.current.unfreeze.mutate(6);
    await waitFor(() => expect(result.current.unfreeze.isSuccess).toBe(true));
    result.current.deactivateAccount.mutate(6);
    await waitFor(() => expect(result.current.deactivateAccount.isSuccess).toBe(true));
    result.current.approveRegistration.mutate(6);
    await waitFor(() => expect(result.current.approveRegistration.isSuccess).toBe(true));
    result.current.rejectRegistration.mutate({
      userId: 6,
      rejectionReason: 'Incomplete',
    });
    await waitFor(() => expect(result.current.rejectRegistration.isSuccess).toBe(true));
    result.current.rejectTransaction.mutate({ transactionId: 6, reason: 'Rejected' });
    await waitFor(() => expect(result.current.rejectTransaction.isSuccess).toBe(true));

    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: adminKeys.accounts });
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: adminKeys.registrations });
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: adminKeys.transactions });
  });
});
