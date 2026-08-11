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

export async function getAdminUser(userId) {
  const response = await api.get(`/admin/users/${userId}`);
  return response.data;
}

export async function createAdminUser(payload) {
  const response = await api.post('/admin/users', payload);
  return response.data;
}

export async function updateAdminUser({ userId, payload }) {
  const response = await api.put(`/admin/users/${userId}`, payload);
  return response.data;
}

export async function deactivateAdminUser(userId) {
  await api.patch(`/admin/users/${userId}/deactivate`);
}

export async function reactivateAdminUser(userId) {
  await api.patch(`/admin/users/${userId}/reactivate`);
}

export async function getAdminAccounts(options = {}) {
  const response = await api.get('/admin/accounts', {
    params: pageableParams(options),
  });
  return response.data;
}

export async function getAdminAccount(accountId) {
  const response = await api.get(`/admin/accounts/${accountId}`);
  return response.data;
}

export async function freezeAdminAccount(accountId) {
  await api.patch(`/admin/accounts/freeze/${accountId}`);
}

export async function unfreezeAdminAccount(accountId) {
  await api.patch(`/admin/accounts/unfreeze/${accountId}`);
}

export async function deactivateAdminAccount(accountId) {
  await api.patch(`/admin/accounts/deactivate/${accountId}`);
}

export async function getAdminTransactions(options = {}) {
  const response = await api.get('/admin/transactions', {
    params: {
      ...pageableParams(options),
      ...(options.reference ? { reference: options.reference } : {}),
      ...(options.accountNumber ? { accountNumber: options.accountNumber } : {}),
      ...(options.type ? { type: options.type } : {}),
      ...(options.status ? { status: options.status } : {}),
      ...(options.fromDate ? { fromDate: options.fromDate } : {}),
      ...(options.toDate ? { toDate: options.toDate } : {}),
    },
  });
  return response.data;
}

export async function getAdminTransaction(id) {
  const response = await api.get(`/admin/transactions/${id}`);
  return response.data;
}

export async function getAdminTransactionByReference(reference) {
  const response = await api.get(
    `/admin/transactions/reference/${encodeURIComponent(reference)}`
  );
  return response.data;
}

export async function getAdminTransactionsByAccount(accountNumber, options = {}) {
  const response = await api.get(
    `/admin/accounts/${encodeURIComponent(accountNumber)}/transactions`,
    {
      params: pageableParams(options),
    }
  );
  return response.data;
}

export async function createAdminDeposit(payload) {
  const response = await api.post('/admin/deposits', payload);
  return response.data;
}

export async function getAdminLatestBalance(accountId) {
  const response = await api.get(`/admin/balance/${accountId}/latest`);
  return response.data;
}

export async function getAdminBalanceLedger(accountId, options = {}) {
  const response = await api.get(`/admin/balance/${accountId}/ledger`, {
    params: pageableParams(options),
  });
  return response.data;
}

export async function getAdminAuditLogs(options = {}) {
  const response = await api.get('/admin/audit-logs', {
    params: pageableParams(options),
  });
  return response.data;
}

export async function getAdminAuditLog(auditLogId) {
  const response = await api.get(`/admin/audit-logs/${auditLogId}`);
  return response.data;
}

export async function getAdminAnomalyReport(transactionId) {
  const response = await api.get(`/admin/transactions/${transactionId}/anomaly-report`);
  return response.data;
}

export async function approveAdminTransaction(transactionId) {
  const response = await api.post(`/admin/transactions/${transactionId}/approve`);
  return response.data;
}

export async function rejectAdminTransaction({ transactionId, reason }) {
  const response = await api.post(
    `/admin/transactions/${transactionId}/reject`,
    reason ? { reason } : {}
  );
  return response.data;
}
