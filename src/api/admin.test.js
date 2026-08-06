import { afterEach, describe, expect, test } from 'vitest';
import api from './axios.js';
import {
  approveRegistration,
  getAdminAccounts,
  getAdminTransactions,
  getAdminUsers,
  getPendingRegistration,
  getPendingRegistrations,
  rejectRegistration,
} from './admin.js';

const originalAdapter = api.defaults.adapter;

function response(config, data, status = 200) {
  return { config, data, headers: {}, status, statusText: 'OK' };
}

afterEach(() => {
  api.defaults.adapter = originalAdapter;
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
