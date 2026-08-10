import { useState } from 'react';
import { Search, ArrowLeftRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { DateTimePicker } from '../../components/ui/DateTimePicker.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { Table } from '../../components/ui/Table.jsx';
import { useAdminListParams } from '../../features/admin/useAdminListParams.js';
import {
  useAdminTransaction,
  useAdminTransactions,
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

function Detail({ transaction }) {
  const fields = [
    ['Reference', transaction.transactionReference],
    ['Type', transaction.type],
    ['Amount', money(transaction.amount)],
    ['Status', transaction.status],
    ['Created', date(transaction.createdAt)],
    ['Completed', date(transaction.completedAt)],
    ['Source account', transaction.sourceAccountNumber],
    ['Source owner', transaction.sourceUserName || transaction.sourceUserEmail],
    ['Destination account', transaction.destinationAccountNumber],
    [
      'Destination owner',
      transaction.destinationUserName || transaction.destinationUserEmail,
    ],
    ['Description', transaction.description],
  ];
  return (
    <dl className="space-y-3">
      {fields.map(([label, value]) => (
        <div className="grid gap-1 sm:grid-cols-[9rem_1fr]" key={label}>
          <dt className="text-xs font-semibold uppercase text-neutral-500">{label}</dt>
          <dd className="break-words text-sm text-neutral-800">{value || '—'}</dd>
        </div>
      ))}
    </dl>
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
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (v) => <StatusBadge status={v} />,
    },
    { key: 'createdAt', header: 'Date', sortable: true, render: date },
  ];
  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-semibold text-primary-600">Administration</p>
        <h1 className="mt-1 text-2xl font-bold text-neutral-800 sm:text-3xl">
          Transactions
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Inspect transaction activity across RedBank.
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
              <div className="flex justify-between">
                <span className="font-mono font-semibold">
                  {row.transactionReference}
                </span>
                <StatusBadge status={row.status} />
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
        title="Transaction details"
        subtitle="Source, destination, and owner information"
      >
        {detail.isLoading && <p>Loading transaction…</p>}
        {detail.isError && <p className="text-error-600">{detail.error.message}</p>}
        {detail.data && <Detail transaction={detail.data} />}
      </Modal>
    </div>
  );
}
