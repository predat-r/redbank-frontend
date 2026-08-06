import api from './axios.js';

export async function getPendingRegistrations({ page = 0, size = 10 } = {}) {
  const response = await api.get('/admin/registrations', { params: { page, size } });
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
