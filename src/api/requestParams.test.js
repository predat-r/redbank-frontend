import { describe, expect, test, vi } from 'vitest';
import {
  cleanParams,
  createIdempotencyKey,
  pageableParams,
  withoutIdempotencyKey,
} from './requestParams.js';

describe('request parameter helpers', () => {
  test('uses pagination defaults and only includes a non-empty sort', () => {
    expect(pageableParams()).toEqual({ page: 0, size: 10 });
    expect(pageableParams({ page: 2, size: 20, sort: ['createdAt,desc'] })).toEqual({
      page: 2,
      size: 20,
      sort: ['createdAt,desc'],
    });
  });

  test('removes only absent request parameters', () => {
    expect(
      cleanParams({ page: 0, query: '', state: null, status: undefined, active: false })
    ).toEqual({
      page: 0,
      active: false,
    });
  });

  test('prefers an explicit idempotency key and removes it from a payload', () => {
    const payload = { amount: 50, idempotencyKey: 'from-payload' };

    expect(createIdempotencyKey(payload, 'explicit-key')).toBe('explicit-key');
    expect(withoutIdempotencyKey(payload)).toEqual({ amount: 50 });
    expect(payload).toEqual({ amount: 50, idempotencyKey: 'from-payload' });
  });

  test('creates a UUID when no idempotency key is supplied', () => {
    const randomUUID = vi.fn(() => 'generated-key');
    vi.stubGlobal('crypto', { randomUUID });

    expect(createIdempotencyKey({ amount: 50 })).toBe('generated-key');
    vi.unstubAllGlobals();
  });
});
