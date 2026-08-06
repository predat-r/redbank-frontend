import { useState } from 'react';
import { Search, ArrowLeftRight } from 'lucide-react';
import { Button } from '../../components/ui/Button.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { Table } from '../../components/ui/Table.jsx';
import { useAdminListParams } from '../../features/admin/useAdminListParams.js';
import {
  useAdminTransaction,
  useAdminTransactionByReference,
  useAdminTransactions,
  useAdminTransactionsByAccount,
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
  const params = useAdminListParams({
    allowedSortFields: SORT_FIELDS,
    defaultSort: 'createdAt,desc',
  });
  const [mode, setMode] = useState('all');
  const [term, setTerm] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [detailId, setDetailId] = useState(null);
  const [reference, setReference] = useState(null);
  const all = useAdminTransactions(params.queryOptions, mode === 'all' && !submitted);
  const byAccount = useAdminTransactionsByAccount(submitted, params.queryOptions);
  const byReference = useAdminTransactionByReference(reference);
  const detail = useAdminTransaction(detailId);
  const result = mode === 'account' && submitted ? byAccount : all;
  const data = result.data?.content ?? [];
  const meta = result.data?.page;
  function search(e) {
    e.preventDefault();
    setReference(null);
    setSubmitted(term.trim());
    if (mode === 'reference') setReference(term.trim());
  }
  function clear() {
    setTerm('');
    setSubmitted('');
    setReference(null);
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
        onSubmit={search}
        className="rounded-xl border border-neutral-200 bg-neutral-0 p-4 shadow-sm"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="text-sm font-medium text-neutral-700">
            Search mode
            <select
              className="mt-1 block h-11 rounded-lg border border-neutral-200 px-3"
              value={mode}
              onChange={(e) => {
                setMode(e.target.value);
                clear();
              }}
            >
              <option value="all">All transactions</option>
              <option value="reference">Exact reference</option>
              <option value="account">Account number</option>
            </select>
          </label>
          {mode !== 'all' && (
            <Input
              label={mode === 'reference' ? 'Transaction reference' : 'Account number'}
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              required
            />
          )}
          <Button icon={Search} type="submit" disabled={mode === 'all'}>
            Search
          </Button>
          {submitted && (
            <Button type="button" variant="outline" onClick={clear}>
              Clear
            </Button>
          )}
        </div>
      </form>
      {mode === 'reference' && reference ? (
        byReference.isError ? (
          <EmptyState
            title="Transaction not found"
            description={byReference.error.message}
          />
        ) : byReference.isLoading ? (
          <p className="text-sm text-neutral-500">Loading transaction…</p>
        ) : (
          <button
            type="button"
            className="w-full rounded-xl border border-neutral-200 bg-neutral-0 p-5 text-left shadow-sm"
            onClick={() => setDetailId(byReference.data.id)}
          >
            <div className="flex justify-between">
              <span className="font-mono font-semibold">
                {byReference.data.transactionReference}
              </span>
              <StatusBadge status={byReference.data.status} />
            </div>
            <p className="mt-2 text-sm text-neutral-500">
              {byReference.data.type} · {money(byReference.data.amount)}
            </p>
          </button>
        )
      ) : result.isError ? (
        <EmptyState
          title="Unable to load transactions"
          description={result.error.message}
          actionLabel="Try again"
          onAction={() => result.refetch()}
          icon={ArrowLeftRight}
        />
      ) : !result.isLoading && !data.length ? (
        <EmptyState
          title="No transactions found"
          description="No transaction records match this request."
          icon={ArrowLeftRight}
        />
      ) : (
        <Table
          columns={columns}
          data={data}
          loading={result.isLoading}
          onRowClick={(row) => setDetailId(row.id)}
          pagination={{
            page: meta?.number ?? params.page,
            pageSize: meta?.size ?? params.size,
            totalElements: meta?.totalElements ?? 0,
            totalPages: meta?.totalPages ?? 1,
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
