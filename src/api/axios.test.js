import { AxiosError } from 'axios';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import api, { refreshClient } from './axios.js';
import { getSession, setSession } from './tokenStore.js';

const originalApiAdapter = api.defaults.adapter;
const originalRefreshAdapter = refreshClient.defaults.adapter;

function response(config, data, status = 200) {
  return {
    config,
    data,
    headers: {},
    status,
    statusText: status === 200 ? 'OK' : 'Error',
  };
}

function unauthorized(config) {
  const apiResponse = response(config, { message: 'Access token expired' }, 401);
  throw new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', config, null, apiResponse);
}

describe('Axios authentication', () => {
  beforeEach(() => {
    setSession({
      accessToken: 'old-access',
      refreshToken: 'old-refresh',
      tokenType: 'Bearer',
    });
  });

  afterEach(() => {
    api.defaults.adapter = originalApiAdapter;
    refreshClient.defaults.adapter = originalRefreshAdapter;
  });

  test('attaches the current access token', async () => {
    api.defaults.adapter = async (config) =>
      response(config, config.headers.Authorization);

    const result = await api.get('/accounts/me');

    expect(result.data).toBe('Bearer old-access');
  });

  test('uses one refresh request for concurrent 401 responses and retries both requests', async () => {
    let refreshCalls = 0;
    api.defaults.adapter = async (config) => {
      if (config.headers.Authorization === 'Bearer old-access') unauthorized(config);
      return response(config, { authorization: config.headers.Authorization });
    };
    refreshClient.defaults.adapter = async (config) => {
      refreshCalls += 1;
      expect(JSON.parse(config.data)).toEqual({ refreshToken: 'old-refresh' });
      return response(config, {
        accessToken: 'new-access',
        refreshToken: 'new-refresh',
        tokenType: 'Bearer',
      });
    };

    const results = await Promise.all([
      api.get('/accounts/me'),
      api.get('/balance/me/latest'),
    ]);

    expect(refreshCalls).toBe(1);
    expect(results.map((result) => result.data.authorization)).toEqual([
      'Bearer new-access',
      'Bearer new-access',
    ]);
    expect(getSession().refreshToken).toBe('new-refresh');
  });

  test('clears the session when refresh fails', async () => {
    api.defaults.adapter = async (config) => unauthorized(config);
    refreshClient.defaults.adapter = async (config) => unauthorized(config);

    await expect(api.get('/accounts/me')).rejects.toMatchObject({ status: 401 });
    expect(getSession()).toBeNull();
  });
});
