import {
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
} from 'lucide-react';
import { Button } from './Button';

export const Table = ({
  columns = [],
  data = [],
  keyField = 'id',
  loading = false,
  emptyMessage = 'No records found',
  pagination,
  onRowClick,
  className = '',
  renderMobileCard,
  sorting,
}) => {
  const {
    page = 0,
    totalPages = 1,
    pageSize = 10,
    totalElements = 0,
    onPageChange,
    onPageSizeChange,
  } = pagination || {};

  return (
    <div className={`w-full flex flex-col gap-4 ${className}`}>
      {/* Desktop & Tablet Table View */}
      <div className="hidden md:block w-full overflow-x-auto rounded-xl border border-neutral-200 bg-neutral-0 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-100 border-b border-neutral-200">
              {columns.map((col) => (
                <th
                  key={col.key || col.header}
                  aria-sort={
                    col.sortable
                      ? sorting?.field === (col.sortKey || col.key)
                        ? sorting.direction === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                      : undefined
                  }
                  className={`px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-500 select-none ${
                    col.align === 'right'
                      ? 'text-right'
                      : col.align === 'center'
                        ? 'text-center'
                        : 'text-left'
                  }`}
                  style={{ width: col.width }}
                >
                  {col.sortable && sorting?.onSortChange ? (
                    <button
                      className="inline-flex items-center gap-1.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
                      onClick={() => {
                        const field = col.sortKey || col.key;
                        sorting.onSortChange({
                          field,
                          direction:
                            sorting.field === field && sorting.direction === 'asc'
                              ? 'desc'
                              : 'asc',
                        });
                      }}
                      type="button"
                    >
                      {col.header}
                      {sorting.field === (col.sortKey || col.key) ? (
                        sorting.direction === 'asc' ? (
                          <ChevronUp aria-hidden="true" className="size-3.5" />
                        ) : (
                          <ChevronDown aria-hidden="true" className="size-3.5" />
                        )
                      ) : (
                        <ArrowUpDown aria-hidden="true" className="size-3.5" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {loading ? (
              Array.from({ length: pageSize > 5 ? 5 : pageSize }).map((_, idx) => (
                <tr key={idx} className="h-14 animate-pulse">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-4 py-4">
                      <div className="h-4 bg-neutral-200 rounded w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-neutral-500 text-sm"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={row[keyField] || rowIndex}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`h-14 transition-colors duration-120 hover:bg-slate-50 ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                >
                  {columns.map((col) => {
                    const value = row[col.accessor || col.key];
                    return (
                      <td
                        key={col.key || col.header}
                        className={`px-4 py-3 text-sm text-neutral-800 ${
                          col.numeric ? 'tabular-nums font-mono' : ''
                        } ${
                          col.align === 'right'
                            ? 'text-right'
                            : col.align === 'center'
                              ? 'text-center'
                              : 'text-left'
                        }`}
                      >
                        {col.render ? col.render(value, row, rowIndex) : value}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card List View */}
      <div className="block md:hidden w-full space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="p-4 bg-neutral-0 border border-neutral-200 rounded-xl shadow-sm space-y-3 animate-pulse"
            >
              <div className="h-4 bg-neutral-200 rounded w-1/2" />
              <div className="h-4 bg-neutral-200 rounded w-3/4" />
              <div className="h-4 bg-neutral-200 rounded w-1/3" />
            </div>
          ))
        ) : data.length === 0 ? (
          <div className="p-8 bg-neutral-0 border border-neutral-200 rounded-xl text-center text-neutral-500 text-sm">
            {emptyMessage}
          </div>
        ) : (
          data.map((row, rowIndex) => (
            <div
              key={row[keyField] || rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              className={`p-4 bg-neutral-0 border border-neutral-200 rounded-xl shadow-sm transition-all ${
                onRowClick ? 'active:bg-slate-50 cursor-pointer' : ''
              }`}
            >
              {renderMobileCard ? (
                renderMobileCard(row, rowIndex)
              ) : (
                <div className="space-y-2">
                  {columns.map((col) => {
                    const value = row[col.accessor || col.key];
                    return (
                      <div
                        key={col.key || col.header}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-xs font-medium uppercase text-neutral-500">
                          {col.header}
                        </span>
                        <span
                          className={`text-neutral-800 ${col.numeric ? 'tabular-nums font-mono font-medium' : ''}`}
                        >
                          {col.render ? col.render(value, row, rowIndex) : value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination Footer */}
      {pagination && totalPages > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 py-1 text-xs text-neutral-600">
          <div className="flex items-center gap-2">
            <span>
              Showing {page * pageSize + 1} -{' '}
              {Math.min((page + 1) * pageSize, totalElements)} of {totalElements} entries
            </span>
            {onPageSizeChange && (
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="h-7 px-2 bg-neutral-0 border border-neutral-200 rounded text-xs focus:outline-none"
              >
                {[5, 10, 20, 50].map((sz) => (
                  <option key={sz} value={sz}>
                    {sz} / page
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => onPageChange(0)}
              title="First Page"
            >
              <ChevronsLeft className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => onPageChange(page - 1)}
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            <span className="px-3 py-1 font-medium text-neutral-700">
              Page {page + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => onPageChange(page + 1)}
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => onPageChange(totalPages - 1)}
              title="Last Page"
            >
              <ChevronsRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
