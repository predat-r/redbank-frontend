import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { restoreSession } from '../api/axios.js';
import {
  clearSession,
  getSession,
  setSession,
  subscribeToSession,
} from '../api/tokenStore.js';
import { decodeJwt, getRolesFromClaims, hasRole } from '../features/auth/jwt.js';
import { AuthContext } from './AuthContext.js';

export function AuthProvider({ children, restoreOnMount = true }) {
  const session = useSyncExternalStore(subscribeToSession, getSession, () => null);
  const [isInitializing, setIsInitializing] = useState(restoreOnMount);
  const claims = useMemo(() => decodeJwt(session?.accessToken), [session?.accessToken]);
  const roles = useMemo(() => getRolesFromClaims(claims), [claims]);

  const establishSession = useCallback((tokens) => setSession(tokens), []);
  const endSession = useCallback(() => clearSession(), []);
  const userHasRole = useCallback(
    (...requiredRoles) => hasRole(roles, requiredRoles),
    [roles]
  );

  useEffect(() => {
    if (!restoreOnMount) return undefined;
    let active = true;

    restoreSession()
      .catch(() => clearSession())
      .finally(() => {
        if (active) setIsInitializing(false);
      });

    return () => {
      active = false;
    };
  }, [restoreOnMount]);

  const value = useMemo(
    () => ({
      session,
      claims,
      roles,
      isAuthenticated: Boolean(session?.accessToken),
      isInitializing,
      establishSession,
      endSession,
      hasRole: userHasRole,
    }),
    [claims, endSession, establishSession, isInitializing, roles, session, userHasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
