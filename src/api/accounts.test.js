import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import api, { refreshClient } from './axios.js';
import {
  chatWithRedAssist,
  deactivateMyAccount,
  freezeMyAccount,
  getMyAccount,
  unfreezeMyAccount,
} from './accounts.js';

const originalAdapter = api.defaults.adapter;
const originalRefreshAdapter = refreshClient.defaults.adapter;

function response(config, data) {
  return { config, data, headers: {}, status: 200, statusText: 'OK' };
}

beforeEach(() => {
  refreshClient.defaults.adapter = async (config) =>
    response(config, null, 204, 'No Content');
});

afterEach(() => {
  api.defaults.adapter = originalAdapter;
  refreshClient.defaults.adapter = originalRefreshAdapter;
});

describe('account API', () => {
  test('uses the current-account read and lifecycle endpoints', async () => {
    const requests = [];
    api.defaults.adapter = async (config) => {
      requests.push(config);
      return response(config, { accountStatus: 'ACTIVE' });
    };

    await getMyAccount();
    await freezeMyAccount();
    await unfreezeMyAccount();
    await deactivateMyAccount();

    expect(requests.map(({ method, url }) => [method, url])).toEqual([
      ['get', '/accounts/me'],
      ['patch', '/accounts/freeze/me'],
      ['patch', '/accounts/unfreeze/me'],
      ['patch', '/accounts/deactivate/me'],
    ]);
  });

  test('sends chat requests to RedAssist and returns its response', async () => {
    let request;
    api.defaults.adapter = async (config) => {
      request = config;
      return response(config, { reply: 'Your balance is $120.00.' });
    };

    const result = await chatWithRedAssist({ message: 'What is my balance?' });

    expect(request.url).toBe('/accounts/me/chat');
    expect(request.method).toBe('post');
    expect(JSON.parse(request.data)).toEqual({ message: 'What is my balance?' });
    expect(result).toEqual({ reply: 'Your balance is $120.00.' });
  });
});
