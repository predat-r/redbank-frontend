import { useState } from 'react';
import {
  Search,
  ArrowLeftRight,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Sparkles,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { DateTimePicker } from '../../components/ui/DateTimePicker.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { Table } from '../../components/ui/Table.jsx';
import { useToast } from '../../hooks/useToast.js';
import { useAdminListParams } from '../../features/admin/useAdminListParams.js';
import {
  useAdminTransaction,
  useAdminTransactions,
  useAdminAnomalyReport,
  useApproveAdminTransaction,
  useRejectAdminTransaction,
} from '../../features/admin/admin.queries.js';

const SORT_FIELDS = ['createdAt', 'completedAt', 'amount', 'type', 'status'];
const date = (v) =>
  v
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(v))
    : '—';
const money = (v) =>
  v == null
    ? '—'
    : Number(v).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

function AnomalyReportCard({ transactionId }) {
  const report = useAdminAnomalyReport(transactionId);
  if (report.isLoading) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-500 animate-pulse">
        Evaluating AI risk analysis report…
      </div>
    );
  }
  if (report.isError) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-400">
        No additional AI anomaly report generated for this transaction.
      </div>
    );
  }
  const data = report.data;
  if (!data) return null;

  const score = data.riskScore ?? 0;
  const isHighRisk = score >= 50;

  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
            AI Anomaly Evaluation
          </span>
        </div>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold ${
            isHighRisk ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
          }`}
        >
          Risk Score: {score}/100
        </span>
      </div>

      <div className="grid gap-2 text-xs">
        <div>
          <span className="font-semibold text-neutral-500 uppercase">
            Recommendation:
          </span>{' '}
          <span className="font-mono font-bold text-neutral-800">
            {data.recommendation}
          </span>
        </div>
        <div>
          <span className="font-semibold text-neutral-500 uppercase">AI Reasoning:</span>
          <p className="mt-1 text-neutral-700 leading-relaxed bg-neutral-0 p-2.5 rounded border border-neutral-200/80 font-sans">
            {data.reasoning || 'Standard automated evaluation complete.'}
          </p>
        </div>
      </div>
    </div>
  );
}

function Detail({ transaction, onClose }) {
  const [rejecting, setRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const { addToast } = useToast();
  const approveMutation = useApproveAdminTransaction();
  const rejectMutation = useRejectAdminTransaction();

  const isPending = transaction.status === 'PENDING';

  const handleApprove = () => {
    approveMutation.mutate(transaction.id, {
      onSuccess: () => {
        addToast({
          type: 'success',
          title: 'Transaction Approved',
          message: `Transaction ${transaction.transactionReference} has been approved and completed.`,
        });
        onClose();
      },
      onError: (err) => {
        addToast({
          type: 'error',
          title: 'Approval Failed',
          message: err.message || 'Failed to approve transaction.',
        });
      },
    });
  };

  const handleReject = () => {
    rejectMutation.mutate(
      { transactionId: transaction.id, reason: rejectReason },
      {
        onSuccess: () => {
          addToast({
            type: 'info',
            title: 'Transaction Rejected & Reversed',
            message: `Transaction ${transaction.transactionReference} was rejected and credited back to user.`,
          });
          onClose();
        },
        onError: (err) => {
          addToast({
            type: 'error',
            title: 'Rejection Failed',
            message: err.message || 'Failed to reject transaction.',
          });
        },
      }
    );
  };

  const fields = [
    ['Reference', transaction.transactionReference],
    ['Type', transaction.type],
    ['Category', transaction.category],
    ['Amount', money(transaction.amount)],
    ['Status', <StatusBadge key="status" status={transaction.status} />],
    ['Risk Flag', <StatusBadge key="risk" status={transaction.anomalyFlag || 'NONE'} />],
    ['Created', date(transaction.createdAt)],
    ['Completed', date(transaction.completedAt)],
    ['Source account', transaction.sourceAccountNumber],
    ['Source owner', transaction.sourceUserName || transaction.sourceUserEmail],
    ['Destination account', transaction.destinationAccountNumber],
    [
      'Destination owner',
      transaction.destinationUserName || transaction.destinationUserEmail,
    ],
    ['Reversed Txn Ref', transaction.reversedTransactionReference],
    ['Description', transaction.description],
  ];

  return (
    <div className="space-y-5">
      <dl className="space-y-3">
        {fields.map(([label, value]) => (
          <div className="grid gap-1 sm:grid-cols-[9rem_1fr]" key={label}>
            <dt className="text-xs font-semibold uppercase text-neutral-500">{label}</dt>
            <dd className="break-words text-sm text-neutral-800">{value || '—'}</dd>
          </div>
        ))}
      </dl>

      {/* AI Anomaly Evaluation Report */}
      <AnomalyReportCard transactionId={transaction.id} />

      {/* Admin Actions for Pending Review Transactions */}
      {isPending && (
        <div className="pt-4 border-t border-neutral-200 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-warning-600" />
            <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
              Pending Admin Decision
            </span>
          </div>

          {!rejecting ? (
            <div className="flex items-center justify-end gap-3 pt-1">
              <Button
                variant="outline"
                icon={XCircle}
                onClick={() => setRejecting(true)}
                className="text-xs border-error-200 text-error-700 hover:bg-error-50"
              >
                Reject Transaction
              </Button>
              <Button
                variant="primary"
                icon={CheckCircle2}
                onClick={handleApprove}
                disabled={approveMutation.isPending}
                className="text-xs"
              >
                {approveMutation.isPending ? 'Approving…' : 'Approve Transaction'}
              </Button>
            </div>
          ) : (
            <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 space-y-3">
              <label className="block text-xs font-semibold text-neutral-700">
                Rejection Reason (Optional):
              </label>
              <input
                type="text"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Suspicious velocity flagged during AI review"
                className="w-full h-10 px-3 text-xs bg-neutral-0 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
              />
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setRejecting(false)}
                  className="text-xs h-9 px-3"
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  icon={XCircle}
                  onClick={handleReject}
                  disabled={rejectMutation.isPending}
                  className="text-xs h-9 px-4"
                >
                  {rejectMutation.isPending ? 'Rejecting…' : 'Confirm Rejection'}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function TransactionsPage() {
  const [urlParams, setUrlParams] = useSearchParams();
  const params = useAdminListParams({
    allowedSortFields: SORT_FIELDS,
    defaultSort: 'createdAt,desc',
  });
  const [detailId, setDetailId] = useState(null);
  const filters = {
    reference: urlParams.get('reference') || '',
    accountNumber: urlParams.get('accountNumber') || '',
    type: urlParams.get('type') || '',
    status: urlParams.get('status') || '',
    fromDate: urlParams.get('fromDate') || '',
    toDate: urlParams.get('toDate') || '',
  };
  const toApiDate = (value) => (value ? new Date(value).toISOString() : '');
  const queryOptions = {
    ...params.queryOptions,
    ...filters,
    fromDate: toApiDate(filters.fromDate),
    toDate: toApiDate(filters.toDate),
  };
  const transactions = useAdminTransactions(queryOptions);
  const detail = useAdminTransaction(detailId);
  const data = transactions.data?.content ?? [];
  const metadata = transactions.data?.page;

  function updateFilters(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setUrlParams((current) => {
      const next = new URLSearchParams(current);
      ['reference', 'accountNumber', 'type', 'status'].forEach((key) => {
        const value = form.get(key);
        if (value) next.set(key, value);
        else next.delete(key);
      });
      ['fromDate', 'toDate'].forEach((key) => {
        const date = form.get(`${key}Date`);
        const time = form.get(`${key}Time`);
        if (date) next.set(key, `${date}T${time || '00:00'}`);
        else next.delete(key);
      });
      next.set('page', '0');
      return next;
    });
  }

  function clearFilters() {
    setUrlParams((current) => {
      const next = new URLSearchParams(current);
      ['reference', 'accountNumber', 'type', 'status', 'fromDate', 'toDate'].forEach(
        (key) => next.delete(key)
      );
      next.set('page', '0');
      return next;
    });
  }

  const columns = [
    { key: 'transactionReference', header: 'Reference', numeric: true },
    { key: 'type', header: 'Type', sortable: true },
    { key: 'amount', header: 'Amount', numeric: true, sortable: true, render: money },
    {
      key: 'anomalyFlag',
      header: 'Risk Flag',
      render: (v) => <StatusBadge status={v || 'NONE'} />,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (v) => <StatusBadge status={v} />,
    },
    { key: 'createdAt', header: 'Date', sortable: true, render: date },
  ];

  const getRowClassName = (row) => {
    if (row.anomalyFlag === 'CRITICAL') return 'bg-rose-50/40 hover:bg-rose-50/80';
    if (row.anomalyFlag === 'HIGH') return 'bg-amber-50/40 hover:bg-amber-50/80';
    return '';
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-semibold text-primary-600">Administration</p>
        <h1 className="mt-1 text-2xl font-bold text-neutral-800 sm:text-3xl">
          Transactions
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Inspect and manage transaction security and anomaly evaluation across RedBank.
        </p>
      </header>
      <form
        onSubmit={updateFilters}
        className="rounded-xl border border-neutral-200 bg-neutral-0 p-4 shadow-sm"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            label="Transaction reference"
            name="reference"
            defaultValue={filters.reference}
          />
          <Input
            label="Account number"
            name="accountNumber"
            defaultValue={filters.accountNumber}
          />
          <label className="text-xs font-medium text-neutral-700">
            Type
            <select
              name="type"
              defaultValue={filters.type}
              className="mt-1 block h-11 w-full rounded-lg border border-neutral-200 px-3 text-sm"
            >
              <option value="">All types</option>
              <option value="DEPOSIT">Deposit</option>
              <option value="WITHDRAWAL">Withdrawal</option>
              <option value="TRANSFER">Transfer</option>
              <option value="REVERSAL">Reversal</option>
            </select>
          </label>
          <label className="text-xs font-medium text-neutral-700">
            Status
            <select
              name="status"
              defaultValue={filters.status}
              className="mt-1 block h-11 w-full rounded-lg border border-neutral-200 px-3 text-sm"
            >
              <option value="">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="REVERSED">Reversed</option>
            </select>
          </label>
          <DateTimePicker
            label="From date and time"
            name="fromDate"
            value={filters.fromDate}
          />
          <DateTimePicker label="To date and time" name="toDate" value={filters.toDate} />
        </div>
        <div className="mt-4 flex gap-2">
          <Button icon={Search} type="submit">
            Apply filters
          </Button>
          {Object.values(filters).some(Boolean) && (
            <Button type="button" variant="outline" onClick={clearFilters}>
              Clear
            </Button>
          )}
        </div>
      </form>
      {transactions.isError ? (
        <EmptyState
          title="Unable to load transactions"
          description={transactions.error.message}
          actionLabel="Try again"
          onAction={() => transactions.refetch()}
          icon={ArrowLeftRight}
        />
      ) : !transactions.isLoading && !data.length ? (
        <EmptyState
          title="No transactions found"
          description="No transaction records match these filters."
          icon={ArrowLeftRight}
        />
      ) : (
        <Table
          columns={columns}
          data={data}
          loading={transactions.isLoading}
          getRowClassName={getRowClassName}
          onRowClick={(row) => setDetailId(row.id)}
          pagination={{
            page: metadata?.number ?? params.page,
            pageSize: metadata?.size ?? params.size,
            totalElements: metadata?.totalElements ?? 0,
            totalPages: metadata?.totalPages ?? 1,
            onPageChange: params.setPage,
            onPageSizeChange: params.setPageSize,
          }}
          sorting={{
            field: params.field,
            direction: params.direction,
            onSortChange: params.setSorting,
          }}
          renderMobileCard={(row) => (
            <div>
              <div className="flex justify-between items-center gap-2">
                <span className="font-mono font-semibold text-neutral-900">
                  {row.transactionReference}
                </span>
                <div className="flex items-center gap-1.5">
                  {row.anomalyFlag && row.anomalyFlag !== 'NONE' && (
                    <StatusBadge status={row.anomalyFlag} />
                  )}
                  <StatusBadge status={row.status} />
                </div>
              </div>
              <p className="mt-2 text-sm text-neutral-500">
                {row.type} · {money(row.amount)} · {date(row.createdAt)}
              </p>
            </div>
          )}
        />
      )}
      <Modal
        isOpen={detailId != null}
        onClose={() => setDetailId(null)}
        title="Transaction details & Risk Review"
        subtitle="AI risk evaluation report and admin approval actions"
      >
        {detail.isLoading && (
          <p className="text-sm text-neutral-500 py-4">Loading transaction details…</p>
        )}
        {detail.isError && <p className="text-error-600 py-4">{detail.error.message}</p>}
        {detail.data && (
          <Detail transaction={detail.data} onClose={() => setDetailId(null)} />
        )}
      </Modal>
    </div>
  );
}
