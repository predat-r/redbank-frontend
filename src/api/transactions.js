import api from './axios.js';

export async function createTransfer(payload) {
  const response = await api.post('/api/accounts/me/transfers', payload);
  return response.data;
}

export async function createWithdrawal(payload) {
  const response = await api.post('/api/accounts/me/withdrawals', payload);
  return response.data;
}

export async function getMyTransactions(params = { page: 0, size: 10 }) {
  const response = await api.get('/api/accounts/me/transactions', { params });
  return response.data;
}
