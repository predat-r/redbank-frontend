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
  X,
  Filter,
} from 'lucide-react';
import { Table, StatusBadge, SegmentedControl, Button } from '../../../components/ui';
import { useMyTransactions } from '../transactions.queries';
import { useMyAccount } from '../../account/account.queries';

export const TransactionHistory = ({
  transactions,
  onRowClick,
  onExport,
  limit,
  showViewAll = false,
  hideSummaryKpi = false,
}) => {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [accountNumber, setAccountNumber] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(limit || 10);

  // Current logged in user account to distinguish incoming vs outgoing transfers
  const { data: myAccount } = useMyAccount();
  const myAccountNumber = myAccount?.accountNumber;

  // Construct backend query params (accountNumber, type, status, fromDate, toDate, page, size, sort)
  const queryParams = useMemo(() => {
    const params = {
      page,
      size: limit || pageSize,
      sort: 'createdAt,desc',
    };

    if (filterType !== 'ALL') {
      params.type = filterType;
    }
    if (status !== 'ALL') {
      params.status = status;
    }
    if (accountNumber.trim()) {
      params.accountNumber = accountNumber.trim();
    }
    if (startDate) {
      params.fromDate = `${startDate}T00:00:00Z`;
    }
    if (endDate) {
      params.toDate = `${endDate}T23:59:59Z`;
    }

    return params;
  }, [page, pageSize, limit, filterType, status, accountNumber, startDate, endDate]);

  // Fetch transactions from API if custom transactions array isn't provided
  const { data: apiResponse, isLoading: apiLoading } = useMyTransactions(queryParams);

  const rawTransactions = useMemo(() => {
    if (transactions && Array.isArray(transactions) && transactions.length > 0) {
      return transactions;
    }
    if (apiResponse?.content) {
      return apiResponse.content;
    }
    return [];
  }, [transactions, apiResponse]);

  // Filter transactions locally if using passed mock array, or rely on API results
  const filteredData = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return rawTransactions;
    }

    return rawTransactions.filter((item) => {
      // Type filter
      if (filterType === 'DEPOSIT' && item.type !== 'DEPOSIT') return false;
      if (
        filterType === 'WITHDRAWAL' &&
        item.type !== 'WITHDRAWAL' &&
        item.type !== 'TRANSFER'
      )
        return false;

      // Status filter
      if (status !== 'ALL' && item.status !== status) return false;

      // Account number filter
      if (accountNumber.trim()) {
        const query = accountNumber.trim().toLowerCase();
        const srcAcc = item.sourceAccountNumber?.toLowerCase() || '';
        const destAcc = item.destinationAccountNumber?.toLowerCase() || '';
        if (!srcAcc.includes(query) && !destAcc.includes(query)) return false;
      }

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

      return true;
    });
  }, [
    transactions,
    rawTransactions,
    filterType,
    status,
    accountNumber,
    startDate,
    endDate,
  ]);

  // KPI Metrics Calculation
  const metrics = useMemo(() => {
    let inflow = 0;
    let outflow = 0;

    filteredData.forEach((tx) => {
      const isCredit =
        tx.type === 'DEPOSIT' ||
        (tx.type === 'TRANSFER' &&
          Boolean(myAccountNumber) &&
          tx.destinationAccountNumber === myAccountNumber);

      if (isCredit) {
        inflow += tx.amount;
      } else {
        outflow += tx.amount;
      }
    });

    return {
      inflow,
      outflow,
      count: apiResponse?.page?.totalElements ?? filteredData.length,
      net: inflow - outflow,
    };
  }, [filteredData, apiResponse, myAccountNumber]);

  // Paginated/Limited content
  const displayData = useMemo(() => {
    if (limit) {
      return filteredData.slice(0, limit);
    }
    if (!transactions || transactions.length === 0) {
      return filteredData; // API handles pagination
    }
    const start = page * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, limit, transactions, page, pageSize]);

  const totalPages = limit
    ? 1
    : (apiResponse?.page?.totalPages ?? (Math.ceil(filteredData.length / pageSize) || 1));

  const totalElements = limit
    ? displayData.length
    : (apiResponse?.page?.totalElements ?? filteredData.length);

  const filterOptions = [
    { label: 'All', value: 'ALL' },
    { label: 'Credited', value: 'DEPOSIT' },
    { label: 'Debited', value: 'WITHDRAWAL' },
  ];

  const handleClearFilters = () => {
    setAccountNumber('');
    setStatus('ALL');
    setStartDate('');
    setEndDate('');
    setPage(0);
  };

  const isAnyFilterActive = accountNumber || startDate || endDate || status !== 'ALL';

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
      width: '140px',
      render: (type, row) => {
        const isCredit =
          type === 'DEPOSIT' ||
          (type === 'TRANSFER' &&
            Boolean(myAccountNumber) &&
            row.destinationAccountNumber === myAccountNumber);

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
        if (isCredit) {
          return (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-success-600">
              <ArrowDownLeft className="w-4 h-4" /> Transfer In
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <ArrowLeftRight className="w-4 h-4" /> Transfer Out
          </span>
        );
      },
    },
    {
      header: 'Description / Account',
      key: 'description',
      render: (val, row) => (
        <div>
          <div className="font-medium text-neutral-800 text-sm">{val}</div>
          <div className="text-[11px] font-mono text-neutral-400">
            {row.destinationAccountNumber ||
              row.sourceAccountNumber ||
              row.transactionReference}
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
        const isCredit =
          row.type === 'DEPOSIT' ||
          (row.type === 'TRANSFER' &&
            Boolean(myAccountNumber) &&
            row.destinationAccountNumber === myAccountNumber);
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
      render: (st) => <StatusBadge status={st} />,
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
                : 'Filter by account number, transaction type, status, or date range'}
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

        {/* Detailed Filters Bar (Account Number, Status, From Date & To Date) */}
        {!limit && (
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-neutral-50/70 p-3 rounded-xl border border-neutral-200/80">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              {/* Account Number Input Filter */}
              <div className="relative flex-1 min-w-[200px] max-w-xs">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => {
                    setAccountNumber(e.target.value);
                    setPage(0);
                  }}
                  placeholder="Account number..."
                  className="w-full h-9 pl-10 pr-4 bg-neutral-0 border border-neutral-200 rounded-lg text-xs placeholder:text-neutral-400 focus:outline-none focus:border-primary-500 transition-all"
                />
              </div>

              {/* Status Select Filter */}
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setPage(0);
                  }}
                  className="h-9 px-2.5 bg-neutral-0 border border-neutral-200 rounded-lg text-xs font-medium text-neutral-700 focus:outline-none focus:border-primary-500 cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="PENDING">Pending</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Date Range Selection (From Date to To Date) */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-neutral-0 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-600">
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

              <div className="flex items-center gap-1.5 bg-neutral-0 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-600">
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

              {isAnyFilterActive && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 rounded-lg transition-colors"
                  title="Clear Filters"
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
          loading={apiLoading && (!transactions || transactions.length === 0)}
          keyField="id"
          onRowClick={onRowClick}
          emptyMessage="No transactions matching your specific filter criteria."
          pagination={
            limit
              ? null
              : {
                  page,
                  totalPages,
                  pageSize,
                  totalElements,
                  onPageChange: setPage,
                  onPageSizeChange: (sz) => {
                    setPageSize(sz);
                    setPage(0);
                  },
                }
          }
          renderMobileCard={(row) => {
            const isCredit =
              row.type === 'DEPOSIT' ||
              (row.type === 'TRANSFER' &&
                Boolean(myAccountNumber) &&
                row.destinationAccountNumber === myAccountNumber);

            return (
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-mono text-neutral-400">
                      {row.createdAt ? row.createdAt.split('T')[0] : ''}
                    </span>
                    <h4 className="text-sm font-semibold text-neutral-800">
                      {row.description}
                    </h4>
                    <p className="text-[11px] font-mono text-neutral-500">
                      {row.destinationAccountNumber || row.sourceAccountNumber}
                    </p>
                  </div>
                  <StatusBadge status={row.status} />
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-neutral-100">
                  <span className="text-xs uppercase font-semibold text-neutral-500">
                    {row.type === 'TRANSFER'
                      ? isCredit
                        ? 'TRANSFER IN'
                        : 'TRANSFER OUT'
                      : row.type}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-base font-bold tabular-nums ${
                        isCredit ? 'text-success-600' : 'text-neutral-800'
                      }`}
                    >
                      {isCredit ? '+' : '-'}${row.amount?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export const RecentActivityPanel = TransactionHistory;
