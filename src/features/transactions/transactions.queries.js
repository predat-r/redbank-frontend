import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createTransfer,
  createWithdrawal,
  getMyTransactions,
} from '../../api/transactions.js';

export const transactionKeys = {
  all: ['transactions'],
  myTransactions: (filters) => ['transactions', 'me', filters],
};

export function useMyTransactions(filters = {}) {
  return useQuery({
    queryKey: transactionKeys.myTransactions(filters),
    queryFn: () => getMyTransactions(filters),
    staleTime: 30000,
    keepPreviousData: true,
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
