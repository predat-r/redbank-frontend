import { useState } from 'react';
import { Check, ClipboardCheck, Eye, X } from 'lucide-react';
import { Alert } from '../../components/ui/Alert.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { Table } from '../../components/ui/Table.jsx';
import {
  useApproveRegistration,
  usePendingRegistration,
  usePendingRegistrations,
  useRejectRegistration,
} from '../../features/admin/admin.queries.js';
import { useToast } from '../../hooks/useToast.js';

const DEFAULT_PAGE_SIZE = 10;

function formatDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function ApplicantDetails({ registration }) {
  const details = [
    ['Name', registration.name],
    ['Email', registration.email],
    ['Phone number', registration.phoneNumber],
    ['Address', registration.address],
    ['Submitted', formatDate(registration.createdAt)],
  ];

  return (
    <dl className="space-y-4">
      {details.map(([label, value]) => (
        <div key={label} className="grid gap-1 sm:grid-cols-[8rem_1fr] sm:gap-4">
          <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            {label}
          </dt>
          <dd className="break-words text-sm text-neutral-800">{value || '—'}</dd>
        </div>
      ))}
      <div className="grid gap-1 sm:grid-cols-[8rem_1fr] sm:gap-4">
        <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Status
        </dt>
        <dd>
          <StatusBadge status={registration.status} />
        </dd>
      </div>
    </dl>
  );
}

export function RegistrationsPage() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [detailId, setDetailId] = useState(null);
  const [decision, setDecision] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [reasonError, setReasonError] = useState('');
  const { addToast } = useToast();
  const registrations = usePendingRegistrations(page, pageSize);
  const detail = usePendingRegistration(detailId);
  const approve = useApproveRegistration();
  const reject = useRejectRegistration();
  const mutation = decision?.type === 'reject' ? reject : approve;

  const resetDecision = () => {
    setDecision(null);
    setRejectionReason('');
    setReasonError('');
    approve.reset();
    reject.reset();
  };

  const closeDecision = () => {
    if (mutation.isPending) return;
    resetDecision();
  };

  const completeDecision = async () => {
    if (decision.type === 'reject') {
      const trimmedReason = rejectionReason.trim();
      if (!trimmedReason) {
        setReasonError('A rejection reason is required.');
        return;
      }
      await reject.mutateAsync({
        userId: decision.registration.id,
        rejectionReason: trimmedReason,
      });
      addToast({
        type: 'success',
        title: 'Registration rejected',
        message: `${decision.registration.name}'s application was rejected.`,
      });
    } else {
      await approve.mutateAsync(decision.registration.id);
      addToast({
        type: 'success',
        title: 'Registration approved',
        message: `${decision.registration.name}'s account is now approved.`,
      });
    }
    resetDecision();
  };

  const openDecision = (event, type, registration) => {
    event.stopPropagation();
    setDecision({ type, registration });
  };

  const columns = [
    { key: 'name', header: 'Applicant' },
    { key: 'email', header: 'Email' },
    { key: 'createdAt', header: 'Submitted', render: formatDate },
    {
      key: 'status',
      header: 'Status',
      render: (status) => <StatusBadge status={status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (_, row) => (
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            icon={Check}
            onClick={(event) => openDecision(event, 'approve', row)}
          >
            Approve
          </Button>
          <Button
            size="sm"
            variant="danger"
            icon={X}
            onClick={(event) => openDecision(event, 'reject', row)}
          >
            Reject
          </Button>
        </div>
      ),
    },
  ];

  const data = registrations.data?.content ?? [];
  const metadata = registrations.data?.page;

  return (
    <main className="min-h-screen bg-neutral-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary-600">Administration</p>
          <h1 className="mt-1 text-2xl font-bold text-neutral-800 sm:text-3xl">
            Pending registrations
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Review new account applications and record an approval decision.
          </p>
        </header>

        {registrations.isError ? (
          <EmptyState
            icon={ClipboardCheck}
            title="Unable to load registrations"
            description={registrations.error.message}
            actionLabel="Try Again"
            onAction={() => registrations.refetch()}
          />
        ) : !registrations.isLoading && data.length === 0 ? (
          <EmptyState
            icon={ClipboardCheck}
            title="No pending registrations"
            description="All submitted applications have been reviewed."
          />
        ) : (
          <Table
            columns={columns}
            data={data}
            loading={registrations.isLoading}
            emptyMessage="No pending registrations"
            onRowClick={(row) => setDetailId(row.id)}
            renderMobileCard={(row) => (
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-neutral-800">{row.name}</p>
                    <p className="text-xs text-neutral-500">{row.email}</p>
                  </div>
                  <StatusBadge status={row.status} />
                </div>
                <p className="text-xs text-neutral-500">
                  Submitted {formatDate(row.createdAt)}
                </p>
                <div className="flex flex-wrap gap-2 border-t border-neutral-200 pt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    icon={Eye}
                    onClick={(event) => {
                      event.stopPropagation();
                      setDetailId(row.id);
                    }}
                  >
                    Details
                  </Button>
                  <Button
                    size="sm"
                    icon={Check}
                    onClick={(event) => openDecision(event, 'approve', row)}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    icon={X}
                    onClick={(event) => openDecision(event, 'reject', row)}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            )}
            pagination={{
              page: metadata?.number ?? page,
              pageSize: metadata?.size ?? pageSize,
              totalElements: metadata?.totalElements ?? 0,
              totalPages: metadata?.totalPages ?? 1,
              onPageChange: setPage,
              onPageSizeChange: (size) => {
                setPageSize(size);
                setPage(0);
              },
            }}
          />
        )}
      </div>

      <Modal
        isOpen={detailId != null}
        onClose={() => setDetailId(null)}
        title="Applicant details"
        subtitle="Pending registration information"
        maxWidth="max-w-lg"
      >
        {detail.isLoading && (
          <p className="text-sm text-neutral-500">Loading applicant details…</p>
        )}
        {detail.isError && <Alert tone="error">{detail.error.message}</Alert>}
        {detail.data && <ApplicantDetails registration={detail.data} />}
      </Modal>

      <Modal
        isOpen={decision != null}
        onClose={closeDecision}
        title={
          decision?.type === 'reject' ? 'Reject registration' : 'Approve registration'
        }
        subtitle={
          decision
            ? `${decision.registration.name} · ${decision.registration.email}`
            : undefined
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-600">
            {decision?.type === 'reject'
              ? 'Explain why this application cannot be approved.'
              : 'Confirm that you want to approve this application.'}
          </p>
          {decision?.type === 'reject' && (
            <div className="space-y-1.5">
              <label
                htmlFor="rejection-reason"
                className="text-sm font-medium text-neutral-700"
              >
                Rejection reason
              </label>
              <textarea
                id="rejection-reason"
                rows={4}
                maxLength={500}
                value={rejectionReason}
                onChange={(event) => {
                  setRejectionReason(event.target.value);
                  setReasonError('');
                }}
                aria-invalid={Boolean(reasonError)}
                aria-describedby={reasonError ? 'rejection-reason-error' : undefined}
                className="w-full rounded-lg border border-neutral-200 bg-neutral-0 px-3.5 py-3 text-sm text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
              <div className="flex justify-between gap-4">
                <span
                  id="rejection-reason-error"
                  className="text-xs font-medium text-error-600"
                >
                  {reasonError}
                </span>
                <span className="text-xs text-neutral-500">
                  {rejectionReason.length}/500
                </span>
              </div>
            </div>
          )}
          {mutation.isError && <Alert tone="error">{mutation.error.message}</Alert>}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={closeDecision}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant={decision?.type === 'reject' ? 'danger' : 'primary'}
              loading={mutation.isPending}
              onClick={() => completeDecision().catch(() => {})}
            >
              {decision?.type === 'reject'
                ? 'Reject Registration'
                : 'Approve Registration'}
            </Button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
