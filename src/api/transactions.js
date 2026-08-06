import api from './axios.js';

/**
 * Perform a fund transfer to another account
 * @param {Object} payload
 * @param {string} payload.destinationAccountNumber
 * @param {number} payload.amount
 * @param {string} [payload.description]
 */
export async function createTransfer(payload) {
  const response = await api.post('/api/accounts/me/transfers', payload);
  return response.data;
}

/**
 * Perform a cash withdrawal from own account
 * @param {Object} payload
 * @param {number} payload.amount
 * @param {string} [payload.description]
 */
export async function createWithdrawal(payload) {
  const response = await api.post('/api/accounts/me/withdrawals', payload);
  return response.data;
}

/**
 * Get account holder transactions (paginated)
 * @param {Object} [params]
 * @param {number} [params.page=0]
 * @param {number} [params.size=10]
 */
export async function getMyTransactions(params = { page: 0, size: 10 }) {
  const response = await api.get('/api/accounts/me/transactions', { params });
  return response.data;
}
