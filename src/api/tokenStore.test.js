import { beforeEach, describe, expect, test, vi } from 'vitest';
import {
  clearSession,
  getSession,
  setSession,
  subscribeToSession,
} from './tokenStore.js';

const tokens = { accessToken: 'access-token', tokenType: 'Bearer' };

describe('tokenStore', () => {
  beforeEach(() => {
    clearSession();
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  test('keeps only the access token in application memory', () => {
    setSession(tokens);

    expect(getSession()).toEqual(tokens);
    expect(window.localStorage).toHaveLength(0);
    expect(window.sessionStorage).toHaveLength(0);
  });

  test('rejects responses without an access token', () => {
    expect(() => setSession({ tokenType: 'Bearer' })).toThrow(
      'An access token is required.'
    );
  });

  test('clears memory and notifies subscribers', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToSession(listener);
    setSession(tokens);

    clearSession();

    expect(getSession()).toBeNull();
    expect(listener).toHaveBeenCalledTimes(2);
    unsubscribe();
  });
});
