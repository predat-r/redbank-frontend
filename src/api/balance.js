import api from './axios.js';

/**
 * Fetch latest running balance for current authenticated account holder.
 * GET /api/balance/me/latest -> BalanceDto
 */
export async function getLatestBalance() {
  const response = await api.get('/balance/me/latest');
  return response.data;
}
