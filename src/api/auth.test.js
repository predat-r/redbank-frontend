import { afterEach, describe, expect, test } from 'vitest';
import { refreshClient } from './axios.js';
import { login, logout, registerAccount } from './auth.js';

const originalAdapter = refreshClient.defaults.adapter;

function response(config, data, status = 200) {
  return { config, data, headers: {}, status, statusText: 'OK' };
}

afterEach(() => {
  refreshClient.defaults.adapter = originalAdapter;
});

describe('public auth API', () => {
  test('sends login and registration with browser credentials', async () => {
    const requests = [];
    refreshClient.defaults.adapter = async (config) => {
      requests.push(config);
      return response(config, { accessToken: 'access', tokenType: 'Bearer' });
    };

    await login({ email: 'user@example.com', password: 'password' });
    await registerAccount({
      email: 'user@example.com',
      password: 'password',
      name: 'User',
      phoneNumber: '123456',
      address: 'Address',
    });

    expect(requests).toHaveLength(2);
    expect(requests.every((request) => request.withCredentials)).toBe(true);
  });

  test('sends logout without a request body', async () => {
    refreshClient.defaults.adapter = async (config) => {
      expect(config.withCredentials).toBe(true);
      expect(config.data).toBeUndefined();
      return response(config, null, 204);
    };

    await logout();
  });
});
