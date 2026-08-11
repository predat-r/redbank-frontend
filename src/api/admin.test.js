import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import api, { refreshClient } from './axios.js';
import {
  approveRegistration,
  createAdminUser,
  deactivateAdminAccount,
  deactivateAdminUser,
  freezeAdminAccount,
  getAdminAccount,
  getAdminAccounts,
  getAdminTransactions,
  getAdminUser,
  getAdminUsers,
  getPendingRegistration,
  getPendingRegistrations,
  rejectRegistration,
  createAdminDeposit,
  reactivateAdminUser,
  updateAdminUser,
} from './admin.js';

const originalAdapter = api.defaults.adapter;
const originalRefreshAdapter = refreshClient.defaults.adapter;

function response(config, data, status = 200) {
  return { config, data, headers: {}, status, statusText: 'OK' };
}

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

describe('admin registration API', () => {
  test('uses the OpenAPI list and detail requests', async () => {
    const requests = [];
    api.defaults.adapter = async (config) => {
      requests.push(config);
      return response(
        config,
        config.url.endsWith('/8') ? { id: 8 } : { content: [], page: {} }
      );
    };

    await getPendingRegistrations({ page: 2, size: 20 });
    await getPendingRegistration(8);

    expect(requests[0].url).toBe('/admin/registrations');
    expect(requests[0].params).toEqual({ page: 2, size: 20 });
    expect(requests[1].url).toBe('/admin/registrations/8');
  });

  test('sends approval without a body and the exact rejection payload', async () => {
    const requests = [];
    api.defaults.adapter = async (config) => {
      requests.push(config);
      return response(config, null, 204);
    };

    await approveRegistration(8);
    await rejectRegistration({
      userId: 9,
      rejectionReason: 'Unable to verify identity.',
    });

    expect(requests[0].url).toBe('/admin/registrations/8/approve');
    expect(requests[0].data).toBeUndefined();
    expect(requests[1].url).toBe('/admin/registrations/9/reject');
    expect(JSON.parse(requests[1].data)).toEqual({
      rejectionReason: 'Unable to verify identity.',
    });
  });
});

describe('admin overview API', () => {
  test('loads pageable totals from users, accounts, and transactions', async () => {
    const requests = [];
    api.defaults.adapter = async (config) => {
      requests.push(config);
      return response(config, { content: [], page: { totalElements: 0 } });
    };

    await getAdminUsers({ page: 0, size: 1 });
    await getAdminAccounts({ page: 0, size: 1 });
    await getAdminTransactions({ page: 0, size: 1 });

    expect(requests.map(({ url }) => url)).toEqual([
      '/admin/users',
      '/admin/accounts',
      '/admin/transactions',
    ]);
    expect(requests.map(({ params }) => params)).toEqual([
      { page: 0, size: 1 },
      { page: 0, size: 1 },
      { page: 0, size: 1 },
    ]);
  });

  test('includes sorting only when requested', async () => {
    let request;
    api.defaults.adapter = async (config) => {
      request = config;
      return response(config, { content: [], page: {} });
    };

    await getAdminTransactions({ page: 2, size: 20, sort: ['createdAt,desc'] });

    expect(request.params).toEqual({
      page: 2,
      size: 20,
      sort: ['createdAt,desc'],
    });
  });
});

describe('admin user and account-holder API', () => {
  test('uses the user detail and write contracts', async () => {
    const requests = [];
    api.defaults.adapter = async (config) => {
      requests.push(config);
      return response(config, { id: 4 });
    };
    const createPayload = {
      name: 'Amina Khan',
      email: 'amina@example.com',
      phoneNumber: '+923001234567',
      address: '12 Bank Street',
      password: 'secure-password',
    };
    const updatePayload = { ...createPayload };
    delete updatePayload.password;

    await getAdminUser(4);
    await createAdminUser(createPayload);
    await updateAdminUser({ userId: 4, payload: updatePayload });
    await deactivateAdminUser(4);
    await reactivateAdminUser(4);

    expect(requests.map(({ method, url }) => [method, url])).toEqual([
      ['get', '/admin/users/4'],
      ['post', '/admin/users'],
      ['put', '/admin/users/4'],
      ['patch', '/admin/users/4/deactivate'],
      ['patch', '/admin/users/4/reactivate'],
    ]);
    expect(JSON.parse(requests[1].data)).toEqual(createPayload);
    expect(JSON.parse(requests[2].data)).toEqual(updatePayload);
  });

  test('uses the account detail and lifecycle contracts', async () => {
    const requests = [];
    api.defaults.adapter = async (config) => {
      requests.push(config);
      return response(config, { id: 15 });
    };

    await getAdminAccount(15);
    await freezeAdminAccount(15);
    await deactivateAdminAccount(15);

    expect(requests.map(({ method, url }) => [method, url])).toEqual([
      ['get', '/admin/accounts/15'],
      ['patch', '/admin/accounts/freeze/15'],
      ['patch', '/admin/accounts/deactivate/15'],
    ]);
  });

  test('sends X-Idempotency-Key header for admin deposits', async () => {
    let requestConfig;
    api.defaults.adapter = async (config) => {
      requestConfig = config;
      return response(config, { id: 101, status: 'COMPLETED' }, 201);
    };

    await createAdminDeposit(
      { destinationAccountId: 5, amount: 1000, description: 'Test deposit' },
      'custom-admin-idemp-123'
    );

    expect(requestConfig.url).toBe('/admin/deposits');
    expect(requestConfig.headers['X-Idempotency-Key']).toBe('custom-admin-idemp-123');
    expect(JSON.parse(requestConfig.data)).toEqual({
      destinationAccountId: 5,
      amount: 1000,
      description: 'Test deposit',
    });
  });
});
