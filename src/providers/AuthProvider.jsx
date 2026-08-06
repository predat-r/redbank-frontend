import { useCallback, useMemo, useSyncExternalStore } from 'react';
import {
  clearSession,
  getSession,
  setSession,
  subscribeToSession,
} from '../api/tokenStore.js';
import { decodeJwt, getRolesFromClaims, hasRole } from '../features/auth/jwt.js';
import { AuthContext } from './AuthContext.js';

export function AuthProvider({ children }) {
  const session = useSyncExternalStore(subscribeToSession, getSession, () => null);
  const claims = useMemo(() => decodeJwt(session?.accessToken), [session?.accessToken]);
  const roles = useMemo(() => getRolesFromClaims(claims), [claims]);

  const establishSession = useCallback((tokens) => setSession(tokens), []);
  const endSession = useCallback(() => clearSession(), []);
  const userHasRole = useCallback(
    (...requiredRoles) => hasRole(roles, requiredRoles),
    [roles]
  );

  const value = useMemo(
    () => ({
      session,
      claims,
      roles,
      isAuthenticated: Boolean(session?.accessToken && session?.refreshToken),
      establishSession,
      endSession,
      hasRole: userHasRole,
    }),
    [claims, endSession, establishSession, roles, session, userHasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
