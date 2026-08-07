import { useParams } from 'react-router-dom';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { Table } from '../../components/ui/Table.jsx';
import {
  useAdminBalanceLedger,
  useAdminLatestBalance,
} from '../../features/admin/admin.queries.js';
import { useAdminListParams } from '../../features/admin/useAdminListParams.js';
export function BalancePage() {
  const { accountId } = useParams();
  const params = useAdminListParams({
    allowedSortFields: ['entryDate', 'amount', 'runningBalance'],
    defaultSort: 'entryDate,desc',
  });
  const latest = useAdminLatestBalance(accountId);
  const ledger = useAdminBalanceLedger(accountId, params.queryOptions);
  const data = ledger.data?.content ?? [],
    meta = ledger.data?.page;
  const date = (v) => (v ? new Date(v).toLocaleString() : '—');
  const columns = [
    { key: 'entryDate', header: 'Date', sortable: true, render: date },
    {
      key: 'indicator',
      header: 'Direction',
      render: (v) => <StatusBadge status={v === 'CREDIT' ? 'COMPLETED' : 'CANCELLED'} />,
    },
    { key: 'amount', header: 'Amount', sortable: true, numeric: true },
    { key: 'runningBalance', header: 'Running balance', sortable: true, numeric: true },
  ];
  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-semibold text-primary-600">Administration</p>
        <h1 className="mt-1 text-2xl font-bold text-neutral-800 sm:text-3xl">
          Account balance
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Latest balance and pageable ledger entries.
        </p>
      </header>
      <div className="rounded-xl bg-primary-700 p-6 text-white">
        <p className="text-sm opacity-80">Current balance</p>
        <p className="mt-2 text-3xl font-bold tabular-nums">
          {latest.isLoading ? '…' : (latest.data?.runningBalance ?? '—')}
        </p>
      </div>
      {ledger.isError ? (
        <EmptyState
          title="Unable to load ledger"
          description={ledger.error.message}
          actionLabel="Try again"
          onAction={() => ledger.refetch()}
        />
      ) : (
        <Table
          columns={columns}
          data={data}
          loading={ledger.isLoading}
          emptyMessage="No ledger entries yet"
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
        />
      )}
    </div>
  );
}
