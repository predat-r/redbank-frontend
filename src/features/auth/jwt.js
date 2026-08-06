function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const decoded = atob(normalized);
  const bytes = Uint8Array.from(decoded, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function decodeJwt(token) {
  if (!token) return null;

  try {
    const [, payload] = token.split('.');
    if (!payload) return null;
    return JSON.parse(decodeBase64Url(payload));
  } catch {
    return null;
  }
}

function normalizeRole(role) {
  if (typeof role !== 'string') return null;
  const normalized = role.trim().toUpperCase();
  if (!normalized) return null;
  return normalized.startsWith('ROLE_') ? normalized : `ROLE_${normalized}`;
}

export function getRolesFromClaims(claims) {
  if (!claims) return [];

  const candidates = [
    claims.roles,
    claims.role,
    claims.authorities,
    claims.authority,
    claims.scope,
  ]
    .flatMap((value) => {
      if (Array.isArray(value)) return value;
      return typeof value === 'string' ? value.split(/[ ,]+/) : [];
    })
    .map(normalizeRole)
    .filter(Boolean);

  return [...new Set(candidates)];
}

export function hasRole(roles, requiredRoles) {
  return requiredRoles.some((role) => roles.includes(normalizeRole(role)));
}
