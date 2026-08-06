export class ApiError extends Error {
  constructor(message, { status = 0, details = null, cause } = {}) {
    super(message, { cause });
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export function toApiError(error) {
  if (error instanceof ApiError) return error;

  const details = error?.response?.data ?? null;
  const status = error?.response?.status ?? 0;
  const message =
    details?.message ||
    (error?.code === 'ECONNABORTED'
      ? 'The request timed out. Please try again.'
      : error?.message || 'Unable to complete the request.');

  return new ApiError(message, { status, details, cause: error });
}
