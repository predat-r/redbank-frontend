import { useQuery } from '@tanstack/react-query';
import { getCurrentAccount } from '../../api/accounts.js';

export const accountKeys = {
  current: ['accounts', 'me'],
};

export function useCurrentAccount() {
  return useQuery({
    queryKey: accountKeys.current,
    queryFn: getCurrentAccount,
  });
}
