import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  approveRegistration,
  getAdminAccounts,
  getAdminTransactions,
  getAdminUsers,
  getPendingRegistration,
  getPendingRegistrations,
  rejectRegistration,
} from '../../api/admin.js';

export const adminKeys = {
  registrations: ['admin', 'registrations'],
  registrationList: (page, size) => ['admin', 'registrations', 'list', { page, size }],
  registration: (userId) => ['admin', 'registrations', 'detail', userId],
  users: ['admin', 'users'],
  userList: (options) => ['admin', 'users', 'list', options],
  accounts: ['admin', 'accounts'],
  accountList: (options) => ['admin', 'accounts', 'list', options],
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
