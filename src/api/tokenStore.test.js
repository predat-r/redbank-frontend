import { beforeEach, describe, expect, test, vi } from 'vitest';
import {
  clearSession,
  getSession,
  reloadSessionFromStorage,
  setSession,
  subscribeToSession,
} from './tokenStore.js';

const tokens = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  tokenType: 'Bearer',
};

describe('tokenStore', () => {
  beforeEach(() => {
    clearSession();
    window.sessionStorage.clear();
  });

  test('stores a complete session per browser tab', () => {
    setSession(tokens);

    expect(getSession()).toEqual(tokens);
    expect(JSON.parse(window.sessionStorage.getItem('redbank.auth.session'))).toEqual(
      tokens
    );
  });

  test('restores valid tokens from session storage', () => {
    window.sessionStorage.setItem('redbank.auth.session', JSON.stringify(tokens));
    reloadSessionFromStorage();

    expect(getSession()).toEqual(tokens);
  });

  test('clears session data and notifies subscribers', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToSession(listener);
    setSession(tokens);

    clearSession();

    expect(getSession()).toBeNull();
    expect(window.sessionStorage.getItem('redbank.auth.session')).toBeNull();
    expect(listener).toHaveBeenCalledTimes(2);
    unsubscribe();
  });
});
