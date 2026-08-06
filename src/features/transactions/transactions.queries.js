import { useQuery } from '@tanstack/react-query';
import { getMyTransactions } from '../../api/transactions.js';

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
