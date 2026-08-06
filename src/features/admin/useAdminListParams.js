import { useSearchParams } from 'react-router-dom';

const PAGE_SIZES = [5, 10, 20, 50];

function parseNonNegativeInteger(value, fallback) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
}

export function useAdminListParams({ allowedSortFields, defaultSort }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseNonNegativeInteger(searchParams.get('page'), 0);
  const requestedSize = parseNonNegativeInteger(searchParams.get('size'), 10);
  const size = PAGE_SIZES.includes(requestedSize) ? requestedSize : 10;
  const [requestedField, requestedDirection] = (
    searchParams.get('sort') || defaultSort
  ).split(',');
  const field = allowedSortFields.includes(requestedField)
    ? requestedField
    : defaultSort.split(',')[0];
  const direction = ['asc', 'desc'].includes(requestedDirection)
    ? requestedDirection
    : defaultSort.split(',')[1];

  function updateParams(updates) {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      Object.entries(updates).forEach(([key, value]) => next.set(key, String(value)));
      return next;
    });
  }

  return {
    page,
    size,
    field,
    direction,
    queryOptions: { page, size, sort: [`${field},${direction}`] },
    setPage: (nextPage) => updateParams({ page: nextPage }),
    setPageSize: (nextSize) => updateParams({ page: 0, size: nextSize }),
    setSorting: (nextSorting) =>
      updateParams({
        page: 0,
        sort: `${nextSorting.field},${nextSorting.direction}`,
      }),
  };
}
