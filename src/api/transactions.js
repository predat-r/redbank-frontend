import api from './axios.js';

export async function createTransfer(payload) {
  const response = await api.post('/accounts/me/transfers', payload);
  return response.data;
}

export async function createWithdrawal(payload) {
  const response = await api.post('/accounts/me/withdrawals', payload);
  return response.data;
}

export async function getMyTransactions(params = {}) {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null)
  );
  const response = await api.get('/accounts/me/transactions', { params: cleanParams });
  return response.data;
}

export async function getMyTransactionById(id) {
  const response = await api.get(`/accounts/me/transactions/${id}`);
  return response.data;
}
