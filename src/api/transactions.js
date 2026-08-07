import api from './axios.js';

export async function createTransfer(payload) {
  const response = await api.post('/accounts/me/transfers', payload);
  return response.data;
}

export async function createWithdrawal(payload) {
  const response = await api.post('/accounts/me/withdrawals', payload);
  return response.data;
}

export async function getMyTransactions(params = { page: 0, size: 10 }) {
  const response = await api.get('/accounts/me/transactions', { params });
  return response.data;
}
