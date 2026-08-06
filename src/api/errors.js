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

  let message = '';
  if (details) {
    if (typeof details === 'string') {
      message = details;
    } else if (details.message) {
      message = details.message;
    } else if (Array.isArray(details.errors) && details.errors.length > 0) {
      message = details.errors.map((e) => e.defaultMessage || e.message || e).join(', ');
    } else if (details.error) {
      message = details.error;
    }
  }

  if (!message) {
    message =
      error?.code === 'ECONNABORTED'
        ? 'The request timed out. Please try again.'
        : error?.message || 'Unable to complete the request.';
  }

  return new ApiError(message, { status, details, cause: error });
}
