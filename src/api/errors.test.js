import { describe, expect, test } from 'vitest';
import { ApiError, toApiError } from './errors.js';

describe('toApiError', () => {
  test('preserves an existing API error', () => {
    const error = new ApiError('Already mapped', { status: 409 });

    expect(toApiError(error)).toBe(error);
  });

  test('maps backend validation details and status', () => {
    const result = toApiError({
      response: {
        status: 400,
        data: { errors: [{ defaultMessage: 'Amount must be positive' }] },
      },
    });

    expect(result).toMatchObject({ status: 400, message: 'Amount must be positive' });
  });

  test('maps a timeout when the backend did not provide a message', () => {
    expect(toApiError({ code: 'ECONNABORTED' }).message).toBe(
      'The request timed out. Please try again.'
    );
  });
});
