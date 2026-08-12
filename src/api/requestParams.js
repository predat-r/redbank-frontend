export function pageableParams({ page = 0, size = 10, sort } = {}) {
  return {
    page,
    size,
    ...(sort?.length ? { sort } : {}),
  };
}

export function cleanParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== '' && value !== null
    )
  );
}

export function createIdempotencyKey(payload, idempotencyKey) {
  return (
    (typeof idempotencyKey === 'string' && idempotencyKey) ||
    (typeof payload?.idempotencyKey === 'string' && payload.idempotencyKey) ||
    (typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `idemp-${Date.now()}`)
  );
}

export function withoutIdempotencyKey(payload) {
  const cleanPayload = { ...payload };
  delete cleanPayload.idempotencyKey;
  return cleanPayload;
}
