import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowRight,
  RotateCcw,
  X,
} from 'lucide-react';
import { Table, StatusBadge, SegmentedControl, Button } from '../../../components/ui';

export const TransactionHistory = ({
  transactions = [],
  onRowClick,
  onExport,
  onSendAgain,
  limit,
  showViewAll = false,
  hideSummaryKpi = false,
}) => {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(limit || 10);

  // Filter transactions based on type, start/end date range, search query, and tab
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

      // Start Date filter
      if (startDate) {
        const itemDate = new Date(item.createdAt);
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (itemDate < start) return false;
      }

      // End Date filter
      if (endDate) {
        const itemDate = new Date(item.createdAt);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (itemDate > end) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesRef = item.transactionReference?.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        if (!matchesRef && !matchesDesc) return false;
      }

      return true;
    });
  }, [transactions, filterType, startDate, endDate, searchQuery]);

  // KPI Metrics Calculation
  const metrics = useMemo(() => {
    let inflow = 0;
    let outflow = 0;

    filteredData.forEach((tx) => {
      if (tx.type === 'DEPOSIT') {
        inflow += tx.amount;
      } else {
        outflow += tx.amount;
      }
    });

    return {
      inflow,
      outflow,
      count: filteredData.length,
      net: inflow - outflow,
    };
  }, [filteredData]);

  // Paginated/Limited content
  const displayData = useMemo(() => {
    if (limit) {
      return filteredData.slice(0, limit);
    }
    const start = page * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, limit, page, pageSize]);

  const totalPages = limit ? 1 : Math.ceil(filteredData.length / pageSize) || 1;

  const filterOptions = [
    { label: 'All', value: 'ALL' },
    { label: 'Credited', value: 'DEPOSIT' },
    { label: 'Debited', value: 'WITHDRAWAL' },
  ];

  const handleSendAgain = (row, e) => {
    if (e) e.stopPropagation();
    if (onSendAgain) {
      onSendAgain(row);
    } else {
      navigate('/transfer', {
        state: {
          destinationAccountNumber: row.destinationAccountNumber || 'ACC-892104912',
          amount: row.amount,
        },
      });
    }
  };

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
    {
      header: 'Action',
      key: 'action',
      align: 'right',
      width: '120px',
      render: (_, row) => (
        <button
          type="button"
          onClick={(e) => handleSendAgain(row, e)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-md border border-primary-200/50 transition-colors"
          title="Repeat transaction"
        >
          <RotateCcw className="w-3 h-3 text-primary-600" />
          <span>Send Again</span>
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Summary KPI Cards (Hidden if hideSummaryKpi=true) */}
      {!hideSummaryKpi && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-neutral-0 border border-neutral-200 rounded-xl shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-500 font-medium">Total Inflow</p>
              <p className="text-lg font-bold text-success-600 tabular-nums mt-0.5">
                +${metrics.inflow.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-success-50 text-success-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 bg-neutral-0 border border-neutral-200 rounded-xl shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-500 font-medium">Total Outflow</p>
              <p className="text-lg font-bold text-neutral-800 tabular-nums mt-0.5">
                -$
                {metrics.outflow.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 bg-neutral-0 border border-neutral-200 rounded-xl shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-500 font-medium">Total Volume</p>
              <p className="text-lg font-bold text-primary-600 tabular-nums mt-0.5">
                {metrics.count} Transactions
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* Main Table Card */}
      <div className="p-4 sm:p-6 bg-neutral-0 border border-neutral-200 rounded-xl shadow-md space-y-5">
        {/* Header & Filter Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
          <div>
            <h2 className="text-lg font-bold text-neutral-800">Transaction History</h2>
            <p className="text-xs text-neutral-500">
              {limit
                ? 'Showing your latest account transactions'
                : 'Filter by date range, transaction type, or search by reference'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <SegmentedControl
              options={filterOptions}
              value={filterType}
              onChange={(val) => {
                setFilterType(val);
                setPage(0);
              }}
            />

            {showViewAll && (
              <Button
                variant="primary"
                size="sm"
                icon={ArrowRight}
                iconPosition="trailing"
                onClick={() => navigate('/history')}
              >
                View All
              </Button>
            )}

            {!limit && onExport && (
              <Button variant="ghost" size="sm" icon={Download} onClick={onExport}>
                Export
              </Button>
            )}
          </div>
        </div>

        {/* Search Bar & Date Range Picker (Start Date & End Date) */}
        {!limit && (
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(0);
                }}
                placeholder="Search by reference ID or description..."
                className="w-full h-10 pl-10 pr-4 bg-neutral-50 border border-neutral-200 rounded-lg text-xs sm:text-sm placeholder:text-neutral-400 focus:outline-none focus:border-primary-500 focus:bg-neutral-0 transition-all"
              />
            </div>

            {/* Date Range Selection (Start Date to End Date) */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-600">
                <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span className="font-medium text-neutral-500">From:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPage(0);
                  }}
                  className="bg-transparent text-xs text-neutral-800 focus:outline-none font-sans cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-600">
                <span className="font-medium text-neutral-500">To:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setPage(0);
                  }}
                  className="bg-transparent text-xs text-neutral-800 focus:outline-none font-sans cursor-pointer"
                />
              </div>

              {(startDate || endDate) && (
                <button
                  type="button"
                  onClick={() => {
                    setStartDate('');
                    setEndDate('');
                    setPage(0);
                  }}
                  className="p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
                  title="Clear Date Filter"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Paginated / Limited Table Component */}
        <Table
          columns={columns}
          data={displayData}
          keyField="id"
          onRowClick={onRowClick}
          emptyMessage="No transactions matching your search or date range criteria."
          pagination={
            limit
              ? null
              : {
                  page,
                  totalPages,
                  pageSize,
                  totalElements: filteredData.length,
                  onPageChange: setPage,
                  onPageSizeChange: (sz) => {
                    setPageSize(sz);
                    setPage(0);
                  },
                }
          }
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
                <div className="flex items-center gap-2">
                  <span
                    className={`text-base font-bold tabular-nums ${
                      row.type === 'DEPOSIT' ? 'text-success-600' : 'text-neutral-800'
                    }`}
                  >
                    {row.type === 'DEPOSIT' ? '+' : '-'}${row.amount.toFixed(2)}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleSendAgain(row, e)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded border border-primary-200/50 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3 text-primary-600" />
                    <span>Send Again</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export const RecentActivityPanel = TransactionHistory;
