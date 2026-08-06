import api, { refreshClient } from './axios.js';

export async function registerAccount(payload) {
  const response = await refreshClient.post('/auth/register', payload);
  return response.data;
}

export async function login(payload) {
  const response = await refreshClient.post('/auth/login', payload);
  return response.data;
}

export async function logout() {
  await refreshClient.post('/auth/logout');
}

export async function getRegistrationStatus() {
  const response = await api.get('/auth/registration-status');
  return response.data;
}

export async function changePassword(payload) {
  await api.put('/auth/password', payload);
}
