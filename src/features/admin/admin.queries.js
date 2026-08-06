import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  approveRegistration,
  createAdminUser,
  deactivateAdminAccount,
  deactivateAdminUser,
  freezeAdminAccount,
  getAdminAccount,
  getAdminAccounts,
  getAdminTransactions,
  getAdminTransaction,
  getAdminTransactionByReference,
  getAdminTransactionsByAccount,
  createAdminDeposit,
  getAdminLatestBalance,
  getAdminBalanceLedger,
  getAdminUser,
  getAdminUsers,
  getPendingRegistration,
  getPendingRegistrations,
  rejectRegistration,
  reactivateAdminUser,
  updateAdminUser,
} from '../../api/admin.js';

export const adminKeys = {
  registrations: ['admin', 'registrations'],
  registrationList: (page, size) => ['admin', 'registrations', 'list', { page, size }],
  registration: (userId) => ['admin', 'registrations', 'detail', userId],
  users: ['admin', 'users'],
  userList: (options) => ['admin', 'users', 'list', options],
  user: (userId) => ['admin', 'users', 'detail', userId],
  accounts: ['admin', 'accounts'],
  accountList: (options) => ['admin', 'accounts', 'list', options],
  account: (accountId) => ['admin', 'accounts', 'detail', accountId],
  transactions: ['admin', 'transactions'],
  transactionList: (options) => ['admin', 'transactions', 'list', options],
};

const OVERVIEW_PAGE = { page: 0, size: 1 };

export function usePendingRegistrations(page, size) {
  return useQuery({
    queryKey: adminKeys.registrationList(page, size),
    queryFn: () => getPendingRegistrations({ page, size }),
  });
}

export function usePendingRegistration(userId) {
  return useQuery({
    queryKey: adminKeys.registration(userId),
    queryFn: () => getPendingRegistration(userId),
    enabled: userId != null,
  });
}

export function useAdminOverview() {
  const results = useQueries({
    queries: [
      {
        queryKey: adminKeys.registrationList(0, 1),
        queryFn: () => getPendingRegistrations(OVERVIEW_PAGE),
      },
      {
        queryKey: adminKeys.userList(OVERVIEW_PAGE),
        queryFn: () => getAdminUsers(OVERVIEW_PAGE),
      },
      {
        queryKey: adminKeys.accountList(OVERVIEW_PAGE),
        queryFn: () => getAdminAccounts(OVERVIEW_PAGE),
      },
      {
        queryKey: adminKeys.transactionList(OVERVIEW_PAGE),
        queryFn: () => getAdminTransactions(OVERVIEW_PAGE),
      },
    ],
  });

  const [registrations, users, accounts, transactions] = results;

  return {
    counts: {
      registrations: registrations.data?.page.totalElements,
      users: users.data?.page.totalElements,
      accounts: accounts.data?.page.totalElements,
      transactions: transactions.data?.page.totalElements,
    },
    isLoading: results.some((result) => result.isLoading),
    isError: results.some((result) => result.isError),
    error: results.find((result) => result.isError)?.error,
    refetch: () => Promise.all(results.map((result) => result.refetch())),
  };
}

export function useAdminUsers(options) {
  return useQuery({
    queryKey: adminKeys.userList(options),
    queryFn: () => getAdminUsers(options),
  });
}

export function useAdminUser(userId) {
  return useQuery({
    queryKey: adminKeys.user(userId),
    queryFn: () => getAdminUser(userId),
    enabled: userId != null,
  });
}

export function useAdminAccounts(options) {
  return useQuery({
    queryKey: adminKeys.accountList(options),
    queryFn: () => getAdminAccounts(options),
  });
}

export function useAdminTransactions(options, enabled = true) {
  return useQuery({
    queryKey: adminKeys.transactionList(options),
    queryFn: () => getAdminTransactions(options),
    enabled,
  });
}
export function useAdminTransactionsByAccount(accountNumber, options) {
  return useQuery({
    queryKey: ['admin', 'transactions', 'account', accountNumber, options],
    queryFn: () => getAdminTransactionsByAccount(accountNumber, options),
    enabled: Boolean(accountNumber),
  });
}
export function useAdminTransaction(id) {
  return useQuery({
    queryKey: ['admin', 'transactions', 'detail', id],
    queryFn: () => getAdminTransaction(id),
    enabled: id != null,
  });
}
export function useAdminTransactionByReference(reference) {
  return useQuery({
    queryKey: ['admin', 'transactions', 'reference', reference],
    queryFn: () => getAdminTransactionByReference(reference),
    enabled: Boolean(reference),
  });
}
export function useAdminLatestBalance(accountId) {
  return useQuery({
    queryKey: ['admin', 'balance', 'latest', accountId],
    queryFn: () => getAdminLatestBalance(accountId),
    enabled: accountId != null,
  });
}
export function useAdminBalanceLedger(accountId, options) {
  return useQuery({
    queryKey: ['admin', 'balance', 'ledger', accountId, options],
    queryFn: () => getAdminBalanceLedger(accountId, options),
    enabled: accountId != null,
  });
}
export function useCreateAdminDeposit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminDeposit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminKeys.transactions }),
  });
}

export function useAdminAccount(accountId) {
  return useQuery({
    queryKey: adminKeys.account(accountId),
    queryFn: () => getAdminAccount(accountId),
    enabled: accountId != null,
  });
}

function useAdminMutation(mutationFn, invalidationKeys) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (_data, variables) => {
      invalidationKeys(variables).forEach((queryKey) =>
        queryClient.invalidateQueries({ queryKey })
      );
    },
  });
}

export function useCreateAdminUser() {
  return useAdminMutation(createAdminUser, () => [adminKeys.users, adminKeys.accounts]);
}

export function useUpdateAdminUser() {
  return useAdminMutation(updateAdminUser, ({ userId }) => [
    adminKeys.users,
    adminKeys.user(userId),
  ]);
}

export function useDeactivateAdminUser() {
  return useAdminMutation(deactivateAdminUser, (userId) => [
    adminKeys.users,
    adminKeys.user(userId),
    adminKeys.accounts,
  ]);
}

export function useReactivateAdminUser() {
  return useAdminMutation(reactivateAdminUser, (userId) => [
    adminKeys.users,
    adminKeys.user(userId),
    adminKeys.accounts,
  ]);
}

export function useFreezeAdminAccount() {
  return useAdminMutation(freezeAdminAccount, (accountId) => [
    adminKeys.accounts,
    adminKeys.account(accountId),
  ]);
}

export function useDeactivateAdminAccount() {
  return useAdminMutation(deactivateAdminAccount, (accountId) => [
    adminKeys.accounts,
    adminKeys.account(accountId),
  ]);
}

function useRegistrationDecision(mutationFn) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminKeys.registrations }),
  });
}

export function useApproveRegistration() {
  return useRegistrationDecision(approveRegistration);
}

export function useRejectRegistration() {
  return useRegistrationDecision(rejectRegistration);
}
