import { useMutation } from '@tanstack/react-query';
import { login, registerAccount } from '../../api/auth.js';

export function useLogin() {
  return useMutation({ mutationFn: login });
}

export function useRegister() {
  return useMutation({ mutationFn: registerAccount });
}
