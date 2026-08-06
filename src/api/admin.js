import api from './axios.js';

function pageableParams({ page = 0, size = 10, sort } = {}) {
  return {
    page,
    size,
    ...(sort?.length ? { sort } : {}),
  };
}

export async function getPendingRegistrations(options = {}) {
  const response = await api.get('/admin/registrations', {
    params: pageableParams(options),
  });
  return response.data;
}

export async function getPendingRegistration(userId) {
  const response = await api.get(`/admin/registrations/${userId}`);
  return response.data;
}

export async function approveRegistration(userId) {
  await api.post(`/admin/registrations/${userId}/approve`);
}

export async function rejectRegistration({ userId, rejectionReason }) {
  await api.post(`/admin/registrations/${userId}/reject`, { rejectionReason });
}

export async function getAdminUsers(options = {}) {
  const response = await api.get('/admin/users', {
    params: pageableParams(options),
  });
  return response.data;
}

export async function getAdminAccounts(options = {}) {
  const response = await api.get('/admin/accounts', {
    params: pageableParams(options),
  });
  return response.data;
}

export async function getAdminTransactions(options = {}) {
  const response = await api.get('/admin/transactions', {
    params: pageableParams(options),
  });
  return response.data;
}
