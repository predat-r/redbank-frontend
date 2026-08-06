import api from './axios.js';

export async function getCurrentAccount() {
  const response = await api.get('/accounts/me');
  return response.data;
}
