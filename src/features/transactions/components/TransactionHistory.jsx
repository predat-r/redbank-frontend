import { useState, useMemo } from 'react';
import {
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Download,
} from 'lucide-react';
import { Table, StatusBadge, SegmentedControl, Button } from '../../../components/ui';

export const TransactionHistory = ({ transactions = [], onRowClick, onExport }) => {
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  // Filter transactions based on type, search query, and tab
  const filteredData = useMemo(() => {
    return transactions.filter((item) => {
      // Type filter
      if (filterType === 'DEPOSIT' && item.type !== 'DEPOSIT') return false;
      if (
        filterType === 'WITHDRAWAL' &&
        item.type !== 'WITHDRAWAL' &&
        item.type !== 'TRANSFER'
      )
        return false;
      if (filterType === 'PENDING' && item.status !== 'PENDING') return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesRef = item.transactionReference.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        if (!matchesRef && !matchesDesc) return false;
      }

      return true;
    });
  }, [transactions, filterType, searchQuery]);

  // Paginated content
  const paginatedData = useMemo(() => {
    const start = page * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;

  const filterOptions = [
    { label: 'All', value: 'ALL' },
    { label: 'Credited', value: 'DEPOSIT' },
    { label: 'Debited', value: 'WITHDRAWAL' },
    { label: 'Pending', value: 'PENDING' },
  ];

  const columns = [
    {
      header: 'Date',
      key: 'createdAt',
      width: '140px',
      render: (val) => (
        <span className="text-xs text-neutral-600 font-mono">
          {new Date(val).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      header: 'Type',
      key: 'type',
      width: '150px',
      render: (type) => {
        if (type === 'DEPOSIT') {
          return (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-success-600">
              <ArrowDownLeft className="w-4 h-4" /> Credited
            </span>
          );
        }
        if (type === 'WITHDRAWAL') {
          return (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <ArrowUpRight className="w-4 h-4" /> Debited
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <ArrowLeftRight className="w-4 h-4" /> Transfer
          </span>
        );
      },
    },
    {
      header: 'Description / Reference',
      key: 'description',
      render: (val, row) => (
        <div>
          <div className="font-medium text-neutral-800 text-sm">{val}</div>
          <div className="text-[11px] font-mono text-neutral-400">
            {row.transactionReference}
          </div>
        </div>
      ),
    },
    {
      header: 'Amount',
      key: 'amount',
      align: 'right',
      numeric: true,
      render: (val, row) => {
        const isCredit = row.type === 'DEPOSIT';
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(val);

        return (
          <span
            className={`font-semibold text-sm ${
              isCredit ? 'text-success-600' : 'text-neutral-800'
            }`}
          >
            {isCredit ? `+${formatted}` : `-${formatted}`}
          </span>
        );
      },
    },
    {
      header: 'Status',
      key: 'status',
      align: 'center',
      width: '130px',
      render: (status) => <StatusBadge status={status} />,
    },
  ];

  return (
    <div className="p-4 sm:p-6 bg-neutral-0 border border-neutral-200 rounded-xl shadow-md space-y-5">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h2 className="text-lg font-bold text-neutral-800">Transaction History</h2>
          <p className="text-xs text-neutral-500">
            Recent account activity and ledger events
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <SegmentedControl
            options={filterOptions}
            value={filterType}
            onChange={(val) => {
              setFilterType(val);
              setPage(0);
            }}
          />
          {onExport && (
            <Button variant="ghost" size="sm" icon={Download} onClick={onExport}>
              Export
            </Button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
            placeholder="Search by reference ID or description..."
            className="w-full h-10 pl-9 pr-4 bg-neutral-50 border border-neutral-200 rounded-lg text-xs sm:text-sm placeholder:text-neutral-400 focus:outline-none focus:border-primary-500 focus:bg-neutral-0 transition-all"
          />
        </div>
      </div>

      {/* Paginated Table Component */}
      <Table
        columns={columns}
        data={paginatedData}
        keyField="id"
        onRowClick={onRowClick}
        emptyMessage="No transactions matching your search criteria."
        pagination={{
          page,
          totalPages,
          pageSize,
          totalElements: filteredData.length,
          onPageChange: setPage,
          onPageSizeChange: (sz) => {
            setPageSize(sz);
            setPage(0);
          },
        }}
        renderMobileCard={(row) => (
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-mono text-neutral-400">
                  {row.createdAt.split('T')[0]}
                </span>
                <h4 className="text-sm font-semibold text-neutral-800">
                  {row.description}
                </h4>
                <p className="text-[11px] font-mono text-neutral-500">
                  {row.transactionReference}
                </p>
              </div>
              <StatusBadge status={row.status} />
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-neutral-100">
              <span className="text-xs uppercase font-semibold text-neutral-500">
                {row.type}
              </span>
              <span
                className={`text-base font-bold tabular-nums ${
                  row.type === 'DEPOSIT' ? 'text-success-600' : 'text-neutral-800'
                }`}
              >
                {row.type === 'DEPOSIT' ? '+' : '-'}${row.amount.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      />
    </div>
  );
};

// Export alias for backward compatibility
export const RecentActivityPanel = TransactionHistory;
