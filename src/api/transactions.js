import api from './axios.js';
import {
  cleanParams,
  createIdempotencyKey,
  withoutIdempotencyKey,
} from './requestParams.js';

export async function createTransfer(payload, idempotencyKey) {
  const key = createIdempotencyKey(payload, idempotencyKey);
  const cleanPayload = withoutIdempotencyKey(payload);
  const response = await api.post('/accounts/me/transfers', cleanPayload, {
    headers: {
      'X-Idempotency-Key': key,
    },
  });
  return response.data;
}

export async function createWithdrawal(payload, idempotencyKey) {
  const key = createIdempotencyKey(payload, idempotencyKey);
  const cleanPayload = withoutIdempotencyKey(payload);
  const response = await api.post('/accounts/me/withdrawals', cleanPayload, {
    headers: {
      'X-Idempotency-Key': key,
    },
  });
  return response.data;
}

export async function getMyTransactions(params = {}) {
  const response = await api.get('/accounts/me/transactions', {
    params: cleanParams(params),
  });
  return response.data;
}

export async function getMyTransactionById(id) {
  const response = await api.get(`/accounts/me/transactions/${id}`);
  return response.data;
}
