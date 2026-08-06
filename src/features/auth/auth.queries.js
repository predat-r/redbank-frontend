import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  changePassword,
  getRegistrationStatus,
  login,
  logout,
  registerAccount,
} from '../../api/auth.js';
import { useAuth } from './useAuth.js';

export const authKeys = {
  registrationStatus: ['auth', 'registration-status'],
};

export function useLogin() {
  return useMutation({ mutationFn: login });
}

export function useRegister() {
  return useMutation({ mutationFn: registerAccount });
}

export function useRegistrationStatus() {
  return useQuery({
    queryKey: authKeys.registrationStatus,
    queryFn: getRegistrationStatus,
  });
}

export function useChangePassword() {
  return useMutation({ mutationFn: changePassword });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const { endSession } = useAuth();

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      endSession();
      queryClient.clear();
    },
  });
}
