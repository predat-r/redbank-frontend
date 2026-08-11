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
const ACTION_LABELS = {
  LOCATION_RISK_ASSESSED: 'Location risk assessed',
};
const TARGET_LABELS = {
  LOGIN_EVENT: 'Login event',
};

const readableTarget = (value) => TARGET_LABELS[value] ?? readable(value);

const readableAction = (value) => ACTION_LABELS[value] ?? readable(value);

function parseLocationRiskDetails(details) {
  if (!details) return {};

  const [fieldsPart, reason] = details.split(', reason=');
  const fields = Object.fromEntries(
    fieldsPart.split(', ').map((part) => {
      const [key, ...value] = part.split('=');
      return [key, value.join('=')];
    })
  );

  return {
    riskLevel: fields.riskLevel,
    confidence: fields.confidence,
    recommendedAction: fields.action,
    reason,
  };
}

const riskLevelClassName = {
  LOW: 'bg-success-50 text-success-700',
  MEDIUM: 'bg-warning-50 text-warning-700',
  HIGH: 'bg-orange-50 text-orange-700',
  EXTREME: 'bg-error-50 text-error-700',
};

function AuditDetails({ log }) {
  const isLocationRiskAssessment = log.action === 'LOCATION_RISK_ASSESSED';
  const riskDetails = isLocationRiskAssessment
    ? parseLocationRiskDetails(log.details)
    : null;
  const fields = [
    ['Action', readableAction(log.action)],
    ['Actor', log.actorEmail],
    ['Actor user ID', log.actorUserId],
    ['Target type', readableTarget(log.targetType)],
    ['Target', log.targetIdentifier],
    ['Created', formatDate(log.createdAt)],
  ];
  return (
    <div className="space-y-5">
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
      {isLocationRiskAssessment ? (
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Location risk details
          </p>
          <dl className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm text-neutral-600">Risk level</dt>
              <dd>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${riskLevelClassName[riskDetails.riskLevel] ?? 'bg-neutral-100 text-neutral-700'}`}
                >
                  {riskDetails.riskLevel || '—'}
                </span>
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm text-neutral-600">Confidence</dt>
              <dd className="text-sm font-medium text-neutral-800">
                {riskDetails.confidence || '—'}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm text-neutral-600">Recommended action</dt>
              <dd className="text-sm font-medium text-neutral-800">
                {riskDetails.recommendedAction || '—'}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-neutral-600">Reason</dt>
              <dd className="mt-1 break-words text-sm text-neutral-800">
                {riskDetails.reason || '—'}
              </dd>
            </div>
          </dl>
        </div>
      ) : (
        <div className="grid gap-1 sm:grid-cols-[8rem_1fr] sm:gap-4">
          <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Details
          </dt>
          <dd className="break-words text-sm text-neutral-800">{log.details || '—'}</dd>
        </div>
      )}
    </div>
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
    { key: 'action', header: 'Action', sortable: true, render: readableAction },
    { key: 'actorEmail', header: 'Actor', sortable: true },
    {
      key: 'targetType',
      header: 'Target',
      sortable: true,
      render: (value, row) => `${readableTarget(value)}: ${row.targetIdentifier}`,
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
                <p className="font-semibold">{readableAction(row.action)}</p>
                <span className="text-xs text-neutral-500">
                  {formatDate(row.createdAt)}
                </span>
              </div>
              <p className="text-sm text-neutral-600">{row.actorEmail}</p>
              <p className="text-xs uppercase text-neutral-500">
                {readableTarget(row.targetType)}: {row.targetIdentifier}
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
