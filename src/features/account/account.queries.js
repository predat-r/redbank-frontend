import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getMyAccount,
  freezeMyAccount,
  unfreezeMyAccount,
  deactivateMyAccount,
} from '../../api/accounts.js';
import { getLatestBalance } from '../../api/balance.js';

export const accountKeys = {
  me: ['accounts', 'me'],
  balanceLatest: ['balance', 'me', 'latest'],
};

/**
 * Hook to fetch real AccountHolderDto from GET /api/accounts/me
 */
export function useMyAccount(options = {}) {
  return useQuery({
    queryKey: accountKeys.me,
    queryFn: getMyAccount,
    retry: 1,
    staleTime: 30000,
    ...options,
  });
}

/**
 * Hook to fetch real BalanceDto from GET /api/balance/me/latest
 */
export function useLatestBalance(options = {}) {
  return useQuery({
    queryKey: accountKeys.balanceLatest,
    queryFn: getLatestBalance,
    retry: 1,
    staleTime: 10000,
    ...options,
  });
}

/**
 * Hook to execute PATCH /api/accounts/freeze/me
 */
export function useFreezeAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: freezeMyAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.me });
    },
  });
}

/**
 * Hook to execute PATCH /api/accounts/unfreeze/me
 */
export function useUnfreezeAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unfreezeMyAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.me });
    },
  });
}

/**
 * Hook to execute PATCH /api/accounts/deactivate/me
 */
export function useDeactivateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deactivateMyAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.me });
    },
  });
}
