import { useState } from 'react';
import { ScrollText } from 'lucide-react';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { Table } from '../../components/ui/Table.jsx';
import {
  useAdminAuditLog,
  useAdminAuditLogs,
} from '../../features/admin/admin.queries.js';
import { useAdminListParams } from '../../features/admin/useAdminListParams.js';

const SORT_FIELDS = ['createdAt', 'action', 'targetType', 'actorEmail'];
const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(value))
    : '—';
const readable = (value) => (value ? value.toLowerCase().replaceAll('_', ' ') : '—');

function AuditDetails({ log }) {
  const fields = [
    ['Action', readable(log.action)],
    ['Actor', log.actorEmail],
    ['Actor user ID', log.actorUserId],
    ['Target type', log.targetType],
    ['Target', log.targetIdentifier],
    ['Details', log.details],
    ['Created', formatDate(log.createdAt)],
  ];
  return (
    <dl className="space-y-4">
      {fields.map(([label, value]) => (
        <div className="grid gap-1 sm:grid-cols-[8rem_1fr] sm:gap-4" key={label}>
          <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            {label}
          </dt>
          <dd className="break-words text-sm capitalize text-neutral-800">
            {value || '—'}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function AuditLogsPage() {
  const params = useAdminListParams({
    allowedSortFields: SORT_FIELDS,
    defaultSort: 'createdAt,desc',
  });
  const [detailId, setDetailId] = useState(null);
  const logs = useAdminAuditLogs(params.queryOptions);
  const detail = useAdminAuditLog(detailId);
  const data = logs.data?.content ?? [];
  const metadata = logs.data?.page;
  const columns = [
    { key: 'createdAt', header: 'Date', sortable: true, render: formatDate },
    { key: 'action', header: 'Action', sortable: true, render: readable },
    { key: 'actorEmail', header: 'Actor', sortable: true },
    {
      key: 'targetType',
      header: 'Target',
      sortable: true,
      render: (value, row) => `${value}: ${row.targetIdentifier}`,
    },
  ];
  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-semibold text-primary-600">Administration</p>
        <h1 className="mt-1 text-2xl font-bold text-neutral-800 sm:text-3xl">
          Audit logs
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Review administrative actions and system activity.
        </p>
      </header>
      {logs.isError ? (
        <EmptyState
          icon={ScrollText}
          title="Unable to load audit logs"
          description={logs.error.message}
          actionLabel="Try again"
          onAction={() => logs.refetch()}
        />
      ) : !logs.isLoading && !data.length ? (
        <EmptyState
          icon={ScrollText}
          title="No audit logs found"
          description="Administrative activity will appear here as actions are recorded."
        />
      ) : (
        <Table
          columns={columns}
          data={data}
          loading={logs.isLoading}
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
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold capitalize">{readable(row.action)}</p>
                <span className="text-xs text-neutral-500">
                  {formatDate(row.createdAt)}
                </span>
              </div>
              <p className="text-sm text-neutral-600">{row.actorEmail}</p>
              <p className="text-xs uppercase text-neutral-500">
                {row.targetType}: {row.targetIdentifier}
              </p>
            </div>
          )}
        />
      )}
      <Modal
        isOpen={detailId != null}
        onClose={() => setDetailId(null)}
        title="Audit-log details"
        subtitle="Recorded administrative activity"
      >
        {detail.isLoading && (
          <p className="text-sm text-neutral-500">Loading audit log…</p>
        )}
        {detail.isError && <p className="text-error-600">{detail.error.message}</p>}
        {detail.data && <AuditDetails log={detail.data} />}
      </Modal>
    </div>
  );
}
