import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  approveRegistration,
  getPendingRegistration,
  getPendingRegistrations,
  rejectRegistration,
} from '../../api/admin.js';

export const adminKeys = {
  registrations: ['admin', 'registrations'],
  registrationList: (page, size) => ['admin', 'registrations', 'list', { page, size }],
  registration: (userId) => ['admin', 'registrations', 'detail', userId],
};

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
