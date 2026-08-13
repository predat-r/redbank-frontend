import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createTransfer,
  createWithdrawal,
  getMyTransactions,
  getMyTransactionById,
} from '../../api/transactions.js';

export const transactionKeys = {
  all: ['transactions'],
  myTransactions: (filters) => ['transactions', 'me', filters],
  detail: (id) => ['transactions', 'detail', id],
};

export function useMyTransactions(filters = {}, options = {}) {
  return useQuery({
    queryKey: transactionKeys.myTransactions(filters),
    queryFn: () => getMyTransactions(filters),
    staleTime: 30000,
    keepPreviousData: true,
    ...options,
  });
}

export function useMyTransactionById(id, options = {}) {
  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: () => getMyTransactionById(id),
    enabled: Boolean(id),
    staleTime: 5000,
    ...options,
  });
}

export function useCreateTransfer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTransfer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });
}

export function useCreateWithdrawal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createWithdrawal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });
}
