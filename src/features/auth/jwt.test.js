import { describe, expect, test } from 'vitest';
import { decodeJwt, getRolesFromClaims, hasRole } from './jwt.js';

function createToken(payload) {
  const encodedPayload = btoa(JSON.stringify(payload))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
  return `header.${encodedPayload}.signature`;
}

describe('JWT helpers', () => {
  test('decodes claims and normalizes common role shapes', () => {
    const claims = decodeJwt(
      createToken({ sub: 'admin@example.com', authorities: ['ROLE_ADMIN'] })
    );

    expect(claims.sub).toBe('admin@example.com');
    expect(getRolesFromClaims(claims)).toEqual(['ROLE_ADMIN']);
    expect(hasRole(getRolesFromClaims(claims), ['ADMIN'])).toBe(true);
  });

  test('supports space-delimited scope and rejects malformed tokens', () => {
    expect(getRolesFromClaims({ scope: 'account_holder profile' })).toEqual([
      'ROLE_ACCOUNT_HOLDER',
      'ROLE_PROFILE',
    ]);
    expect(decodeJwt('not-a-jwt')).toBeNull();
  });
});
