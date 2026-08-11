import api from './axios.js';

export async function createTransfer(payload, idempotencyKey) {
  const key =
    (typeof idempotencyKey === 'string' && idempotencyKey) ||
    (typeof payload?.idempotencyKey === 'string' && payload.idempotencyKey) ||
    (typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `idemp-${Date.now()}`);
  const cleanPayload = { ...payload };
  delete cleanPayload.idempotencyKey;
  const response = await api.post('/accounts/me/transfers', cleanPayload, {
    headers: {
      'X-Idempotency-Key': key,
    },
  });
  return response.data;
}

export async function createWithdrawal(payload, idempotencyKey) {
  const key =
    (typeof idempotencyKey === 'string' && idempotencyKey) ||
    (typeof payload?.idempotencyKey === 'string' && payload.idempotencyKey) ||
    (typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `idemp-${Date.now()}`);
  const cleanPayload = { ...payload };
  delete cleanPayload.idempotencyKey;
  const response = await api.post('/accounts/me/withdrawals', cleanPayload, {
    headers: {
      'X-Idempotency-Key': key,
    },
  });
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
