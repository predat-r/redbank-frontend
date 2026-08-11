import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import api, { refreshClient } from './axios.js';
import { createTransfer, createWithdrawal, getMyTransactions } from './transactions.js';

const originalAdapter = api.defaults.adapter;
const originalRefreshAdapter = refreshClient.defaults.adapter;

function mockResponse(config, data, status = 200) {
  return { config, data, headers: {}, status, statusText: 'OK' };
}

beforeEach(() => {
  refreshClient.defaults.adapter = async (config) => mockResponse(config, {});
});

afterEach(() => {
  api.defaults.adapter = originalAdapter;
  refreshClient.defaults.adapter = originalRefreshAdapter;
});

beforeEach(() => {
  refreshClient.defaults.adapter = async (config) => ({
    config,
    data: null,
    headers: {},
    status: 204,
    statusText: 'No Content',
  });
});

describe('transactions API', () => {
  test('sends createTransfer with payload to /accounts/me/transfers', async () => {
    let capturedRequest = null;
    api.defaults.adapter = async (config) => {
      capturedRequest = config;
      return mockResponse(
        config,
        {
          id: 101,
          transactionReference: 'TXN-TRANSFER123',
          type: 'TRANSFER',
          amount: 5000,
          status: 'COMPLETED',
        },
        201
      );
    };

    const payload = {
      destinationAccountNumber: 'ACC-987654',
      amount: 5000,
      description: 'Rent payment',
    };

    const result = await createTransfer(payload);

    expect(capturedRequest.url).toContain('/accounts/me/transfers');
    expect(capturedRequest.method).toBe('post');
    expect(capturedRequest.headers['X-Idempotency-Key']).toBeDefined();
    expect(JSON.parse(capturedRequest.data)).toEqual(payload);
    expect(result.transactionReference).toBe('TXN-TRANSFER123');
  });

  test('sends createWithdrawal with payload to /accounts/me/withdrawals', async () => {
    let capturedRequest = null;
    api.defaults.adapter = async (config) => {
      capturedRequest = config;
      return mockResponse(
        config,
        {
          id: 102,
          transactionReference: 'TXN-WITHDRAW456',
          type: 'WITHDRAWAL',
          amount: 2000,
          status: 'COMPLETED',
        },
        201
      );
    };

    const payload = {
      amount: 2000,
      description: 'ATM withdrawal',
    };

    const result = await createWithdrawal(payload);

    expect(capturedRequest.url).toContain('/accounts/me/withdrawals');
    expect(capturedRequest.method).toBe('post');
    expect(capturedRequest.headers['X-Idempotency-Key']).toBeDefined();
    expect(JSON.parse(capturedRequest.data)).toEqual(payload);
    expect(result.transactionReference).toBe('TXN-WITHDRAW456');
  });

  test('sends getMyTransactions request with pagination parameters', async () => {
    let capturedRequest = null;
    api.defaults.adapter = async (config) => {
      capturedRequest = config;
      return mockResponse(config, {
        content: [],
        page: { number: 0, size: 10, totalElements: 0, totalPages: 0 },
      });
    };

    await getMyTransactions({ page: 1, size: 5 });

    expect(capturedRequest.url).toContain('/accounts/me/transactions');
    expect(capturedRequest.params).toEqual({ page: 1, size: 5 });
  });
});
