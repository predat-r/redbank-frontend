let session = null;
const listeners = new Set();

function emitChange() {
  listeners.forEach((listener) => listener());
}

export function getSession() {
  return session;
}

export function setSession(nextSession) {
  if (!nextSession?.accessToken) {
    throw new Error('An access token is required.');
  }

  session = {
    accessToken: nextSession.accessToken,
    tokenType: nextSession.tokenType || 'Bearer',
  };
  emitChange();
  return session;
}

export function clearSession() {
  session = null;
  emitChange();
}

export function subscribeToSession(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
