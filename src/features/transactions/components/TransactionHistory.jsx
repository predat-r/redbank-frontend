import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowRight,
  Filter,
  RotateCcw,
} from 'lucide-react';
import { Table, StatusBadge, Button } from '../../../components/ui';
import { useMyTransactions } from '../transactions.queries';
import { useMyAccount } from '../../account/account.queries';

export const TransactionHistory = ({
  transactions,
  onRowClick,
  limit,
  showViewAll = false,
  hideSummaryKpi = false,
}) => {
  const navigate = useNavigate();

  // Draft filter state (user selections before clicking Apply Filters)
  const [draftFilters, setDraftFilters] = useState({
    accountNumber: '',
    type: 'ALL',
    status: 'ALL',
    category: 'ALL',
    startDate: '',
    endDate: '',
  });

  // Applied filter state (triggers API call only when Apply Filters is clicked)
  const [appliedFilters, setAppliedFilters] = useState({
    accountNumber: '',
    type: 'ALL',
    status: 'ALL',
    category: 'ALL',
    startDate: '',
    endDate: '',
  });

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(limit || 10);

  // Current logged in user account to distinguish incoming vs outgoing transfers
  const { data: myAccount } = useMyAccount();
  const myAccountNumber = myAccount?.accountNumber;

  // Construct backend query params using appliedFilters (updated on form submit)
  const queryParams = useMemo(() => {
    const params = {
      page,
      size: limit || pageSize,
      sort: 'createdAt,desc',
    };

    if (appliedFilters.type !== 'ALL') {
      params.type = appliedFilters.type;
    }
    if (appliedFilters.status !== 'ALL') {
      params.status = appliedFilters.status;
    }
    if (appliedFilters.category !== 'ALL') {
      params.category = appliedFilters.category;
    }
    if (appliedFilters.accountNumber.trim()) {
      params.accountNumber = appliedFilters.accountNumber.trim();
    }
    if (appliedFilters.startDate) {
      params.fromDate = `${appliedFilters.startDate}T00:00:00Z`;
    }
    if (appliedFilters.endDate) {
      params.toDate = `${appliedFilters.endDate}T23:59:59Z`;
    }

    return params;
  }, [page, pageSize, limit, appliedFilters]);

  // Fetch transactions from API using active query parameters
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

  // Filter transactions locally if using passed custom mock array
  const filteredData = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return rawTransactions;
    }

    return rawTransactions.filter((item) => {
      // Type filter
      if (appliedFilters.type === 'DEPOSIT' && item.type !== 'DEPOSIT') return false;
      if (
        appliedFilters.type === 'WITHDRAWAL' &&
        item.type !== 'WITHDRAWAL' &&
        item.type !== 'TRANSFER'
      )
        return false;

      // Status filter
      if (appliedFilters.status !== 'ALL' && item.status !== appliedFilters.status)
        return false;

      // Account number filter
      if (appliedFilters.accountNumber.trim()) {
        const query = appliedFilters.accountNumber.trim().toLowerCase();
        const srcAcc = item.sourceAccountNumber?.toLowerCase() || '';
        const destAcc = item.destinationAccountNumber?.toLowerCase() || '';
        if (!srcAcc.includes(query) && !destAcc.includes(query)) return false;
      }

      // Start Date filter
      if (appliedFilters.startDate) {
        const itemDate = new Date(item.createdAt);
        const start = new Date(appliedFilters.startDate);
        start.setHours(0, 0, 0, 0);
        if (itemDate < start) return false;
      }

      // End Date filter
      if (appliedFilters.endDate) {
        const itemDate = new Date(item.createdAt);
        const end = new Date(appliedFilters.endDate);
        end.setHours(23, 59, 59, 999);
        if (itemDate > end) return false;
      }

      return true;
    });
  }, [transactions, rawTransactions, appliedFilters]);

  // KPI Metrics Calculation based on filtered dataset
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

    const volumeCount = apiResponse?.content?.length ?? filteredData.length;

    return {
      inflow,
      outflow,
      count: volumeCount,
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

  const handleApplyFilters = (e) => {
    if (e) e.preventDefault();
    setAppliedFilters({ ...draftFilters });
    setPage(0);
  };

  const handleClearFilters = () => {
    const empty = {
      accountNumber: '',
      type: 'ALL',
      status: 'ALL',
      category: 'ALL',
      startDate: '',
      endDate: '',
    };
    setDraftFilters(empty);
    setAppliedFilters(empty);
    setPage(0);
  };

  const isAnyFilterApplied = Boolean(
    appliedFilters.accountNumber ||
    appliedFilters.startDate ||
    appliedFilters.endDate ||
    appliedFilters.type !== 'ALL' ||
    appliedFilters.status !== 'ALL' ||
    appliedFilters.category !== 'ALL'
  );

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
      {/* Admin-inspired Dedicated Filter Controls Form Card */}
      {!limit && (
        <form
          onSubmit={handleApplyFilters}
          className="bg-neutral-0 border border-neutral-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-primary-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                Filter Transactions
              </span>
            </div>
            {isAnyFilterApplied && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs font-semibold text-neutral-500 hover:text-neutral-800 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Filters
              </button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Account Number Input Filter */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">
                Account Number
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                <input
                  type="text"
                  value={draftFilters.accountNumber}
                  onChange={(e) =>
                    setDraftFilters((prev) => ({
                      ...prev,
                      accountNumber: e.target.value,
                    }))
                  }
                  placeholder="e.g. RB1000000001"
                  className="w-full h-11 pl-10 pr-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:bg-neutral-0 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all font-mono"
                />
              </div>
            </div>

            {/* Type Select Filter */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">
                Transaction Type
              </label>
              <select
                value={draftFilters.type}
                onChange={(e) =>
                  setDraftFilters((prev) => ({ ...prev, type: e.target.value }))
                }
                className="w-full h-11 px-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-800 focus:outline-none focus:bg-neutral-0 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 cursor-pointer transition-all"
              >
                <option value="ALL">All Types</option>
                <option value="DEPOSIT">Deposit</option>
                <option value="WITHDRAWAL">Cash Withdrawal</option>
                <option value="TRANSFER">Fund Transfer</option>
              </select>
            </div>

            {/* Status Select Filter */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">Status</label>
              <select
                value={draftFilters.status}
                onChange={(e) =>
                  setDraftFilters((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full h-11 px-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-800 focus:outline-none focus:bg-neutral-0 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 cursor-pointer transition-all"
              >
                <option value="ALL">All Statuses</option>
                <option value="COMPLETED">Completed</option>
                <option value="PENDING">Pending</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            {/* Category Select Filter */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">Category</label>
              <select
                value={draftFilters.category}
                onChange={(e) =>
                  setDraftFilters((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full h-11 px-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-800 focus:outline-none focus:bg-neutral-0 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 cursor-pointer transition-all"
              >
                <option value="ALL">All Categories</option>
                <option value="FOOD">Food & Dining</option>
                <option value="GROCERY">Groceries</option>
                <option value="DONATION">Donations & Charity</option>
                <option value="BILLS">Bills & Utilities</option>
                <option value="ENTERTAINMENT">Entertainment</option>
                <option value="SHOPPING">Shopping</option>
                <option value="HEALTH">Health & Medical</option>
                <option value="TRANSPORT">Transport & Travel</option>
                <option value="EDUCATION">Education</option>
                <option value="INVESTMENT">Investments</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* From Date Filter */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">From Date</label>
              <input
                type="date"
                value={draftFilters.startDate}
                onChange={(e) =>
                  setDraftFilters((prev) => ({ ...prev, startDate: e.target.value }))
                }
                className="w-full h-11 px-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:bg-neutral-0 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 cursor-pointer transition-all font-sans"
              />
            </div>

            {/* To Date Filter */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">To Date</label>
              <input
                type="date"
                value={draftFilters.endDate}
                onChange={(e) =>
                  setDraftFilters((prev) => ({ ...prev, endDate: e.target.value }))
                }
                className="w-full h-11 px-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:bg-neutral-0 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 cursor-pointer transition-all font-sans"
              />
            </div>

            {/* Filter Action Buttons grid cell aligned in row 2 column 3 */}
            <div className="flex items-end justify-end gap-2 pt-1 sm:pt-0">
              {isAnyFilterApplied && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClearFilters}
                  className="h-11 px-4 text-xs font-medium"
                >
                  Clear
                </Button>
              )}
              <Button
                type="submit"
                variant="primary"
                icon={Search}
                className="h-11 px-6 text-xs font-semibold shadow-sm w-full sm:w-auto"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Summary KPI Cards reflecting applied filter results (Placed below filter form) */}
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
      <div className="p-4 sm:p-6 bg-neutral-0 border border-neutral-200 rounded-2xl shadow-md space-y-5">
        {/* Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
          <div>
            <h2 className="text-lg font-bold text-neutral-800">Transaction History</h2>
            <p className="text-xs text-neutral-500">
              {limit
                ? 'Showing your latest account transactions'
                : 'Account ledger records filtered by your preferences'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
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

            {/* {!limit && onExport && (
              <Button variant="ghost" size="sm" icon={Download} onClick={onExport}>
                Export
              </Button>
            )} */}
          </div>
        </div>

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
