const SESSION_KEY = 'redbank.auth.session';

let session = readStoredSession();
const listeners = new Set();

function readStoredSession() {
  if (typeof window === 'undefined') return null;

  try {
    const stored = window.sessionStorage.getItem(SESSION_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    if (!parsed?.accessToken || !parsed?.refreshToken) return null;
    return parsed;
  } catch {
    window.sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

function emitChange() {
  listeners.forEach((listener) => listener());
}

export function getSession() {
  return session;
}

export function setSession(nextSession) {
  if (!nextSession?.accessToken || !nextSession?.refreshToken) {
    throw new Error('A complete access and refresh token pair is required.');
  }

  session = {
    accessToken: nextSession.accessToken,
    refreshToken: nextSession.refreshToken,
    tokenType: nextSession.tokenType || 'Bearer',
  };

  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
  emitChange();
  return session;
}

export function clearSession() {
  session = null;
  if (typeof window !== 'undefined') {
    window.sessionStorage.removeItem(SESSION_KEY);
  }
  emitChange();
}

export function subscribeToSession(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function reloadSessionFromStorage() {
  session = readStoredSession();
  emitChange();
}
