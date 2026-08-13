import { afterEach, describe, expect, test } from 'vitest';
import api, { refreshClient } from './axios.js';
import {
  changePassword,
  getRegistrationStatus,
  login,
  logout,
  registerAccount,
  updateMyProfile,
} from './auth.js';

const originalAdapter = refreshClient.defaults.adapter;
const originalApiAdapter = api.defaults.adapter;

function response(config, data, status = 200) {
  return { config, data, headers: {}, status, statusText: 'OK' };
}

afterEach(() => {
  refreshClient.defaults.adapter = originalAdapter;
  api.defaults.adapter = originalApiAdapter;
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
      if (config.url.endsWith('/auth/csrf')) {
        return response(config, { token: 'test-csrf-token' });
      }
      expect(config.headers['X-XSRF-TOKEN']).toBe('test-csrf-token');
      return response(config, null, 204);
    };

    await logout();
  });

  test('uses the authenticated status, password, and profile contracts', async () => {
    const apiRequests = [];
    api.defaults.adapter = async (config) => {
      apiRequests.push(config);
      return response(config, { id: 3, registrationStatus: 'PENDING_APPROVAL' });
    };
    refreshClient.defaults.adapter = async (config) => {
      if (config.url.endsWith('/auth/csrf')) {
        return response(config, { token: 'csrf-token' });
      }
      return response(config, null, 204);
    };

    await getRegistrationStatus();
    await changePassword({ currentPassword: 'old', newPassword: 'new' });
    await updateMyProfile({ name: 'Amina Khan', phoneNumber: '123' });

    expect(apiRequests.map(({ method, url }) => [method, url])).toEqual([
      ['get', '/auth/registration-status'],
      ['put', '/auth/password'],
      ['patch', '/users/me'],
    ]);
    expect(JSON.parse(apiRequests[1].data)).toEqual({
      currentPassword: 'old',
      newPassword: 'new',
    });
    expect(JSON.parse(apiRequests[2].data)).toEqual({
      name: 'Amina Khan',
      phoneNumber: '123',
    });
  });
});
