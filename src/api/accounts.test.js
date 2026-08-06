import { afterEach, describe, expect, test } from 'vitest';
import api from './axios.js';
import { getCurrentAccount } from './accounts.js';

const originalAdapter = api.defaults.adapter;

afterEach(() => {
  api.defaults.adapter = originalAdapter;
});

describe('accounts API', () => {
  test('loads the authenticated account holder', async () => {
    api.defaults.adapter = async (config) => {
      expect(config.url).toBe('/accounts/me');
      return {
        config,
        data: { accountNumber: 'RB-10001' },
        headers: {},
        status: 200,
        statusText: 'OK',
      };
    };

    await expect(getCurrentAccount()).resolves.toEqual({ accountNumber: 'RB-10001' });
  });
});
