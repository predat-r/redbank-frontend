import api from './axios.js';

/**
 * Fetch current authenticated user's account holder details.
 * GET /api/accounts/me -> AccountHolderDto
 */
export async function getMyAccount() {
  const response = await api.get('/accounts/me');
  return response.data;
}

/**
 * Request freezing of current user's account.
 * PATCH /api/accounts/freeze/me -> AccountHolderDto
 */
export async function freezeMyAccount() {
  const response = await api.patch('/accounts/freeze/me');
  return response.data;
}

/**
 * Request unfreezing of current user's account.
 * PATCH /api/accounts/unfreeze/me -> AccountHolderDto
 */
export async function unfreezeMyAccount() {
  const response = await api.patch('/accounts/unfreeze/me');
  return response.data;
}

/**
 * Request deactivation of current user's account.
 * PATCH /api/accounts/deactivate/me -> AccountHolderDto
 */
export async function deactivateMyAccount() {
  const response = await api.patch('/accounts/deactivate/me');
  return response.data;
}
