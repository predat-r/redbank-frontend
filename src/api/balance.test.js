import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import api, { refreshClient } from './axios.js';
import { getLatestBalance } from './balance.js';

const originalAdapter = api.defaults.adapter;
const originalRefreshAdapter = refreshClient.defaults.adapter;

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

describe('balance API', () => {
  test('loads the current account latest balance', async () => {
    let request;
    api.defaults.adapter = async (config) => {
      request = config;
      return { config, data: { runningBalance: 120.5 }, headers: {}, status: 200 };
    };

    await expect(getLatestBalance()).resolves.toEqual({ runningBalance: 120.5 });
    expect(request).toMatchObject({ method: 'get', url: '/balance/me/latest' });
  });
});
