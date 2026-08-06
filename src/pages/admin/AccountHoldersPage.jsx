import { useState } from 'react';
import { Eye, Snowflake, UserPlus, UserRoundCog, XCircle } from 'lucide-react';
import { Alert } from '../../components/ui/Alert.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { Table } from '../../components/ui/Table.jsx';
import { AdminActionModal } from '../../features/admin/components/AdminActionModal.jsx';
import { AdminUserFormModal } from '../../features/admin/components/AdminUserFormModal.jsx';
import {
  useAdminAccount,
  useAdminAccounts,
  useAdminUser,
  useDeactivateAdminAccount,
  useFreezeAdminAccount,
} from '../../features/admin/admin.queries.js';
import { useAdminListParams } from '../../features/admin/useAdminListParams.js';
import { useToast } from '../../hooks/useToast.js';

const SORT_FIELDS = [
  'accountNumber',
  'currency',
  'accountStatus',
  'approvedAt',
  'createdAt',
];

function formatDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function AccountDetails({ account, owner }) {
  const details = [
    ['Account number', account.accountNumber],
    ['Currency', account.currency],
    ['Owner', owner?.name],
    ['Owner email', owner?.email],
    ['Approved', formatDate(account.approvedAt)],
    ['Created', formatDate(account.createdAt)],
  ];

  return (
    <dl className="space-y-4">
      {details.map(([label, value]) => (
        <div className="grid gap-1 sm:grid-cols-[8rem_1fr] sm:gap-4" key={label}>
          <dt className="text-xs font-semibold uppercase text-neutral-500">{label}</dt>
          <dd className="break-words text-sm text-neutral-800">{value || '—'}</dd>
        </div>
      ))}
      <div className="grid gap-1 sm:grid-cols-[8rem_1fr] sm:gap-4">
        <dt className="text-xs font-semibold uppercase text-neutral-500">Status</dt>
        <dd>
          <StatusBadge status={account.accountStatus} />
        </dd>
      </div>
    </dl>
  );
}

export function AccountHoldersPage() {
  const listParams = useAdminListParams({
    allowedSortFields: SORT_FIELDS,
    defaultSort: 'createdAt,desc',
  });
  const accounts = useAdminAccounts(listParams.queryOptions);
  const [detailId, setDetailId] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [action, setAction] = useState(null);
  const detail = useAdminAccount(detailId);
  const owner = useAdminUser(detail.data?.userId);
  const freeze = useFreezeAdminAccount();
  const deactivate = useDeactivateAdminAccount();
  const mutation = action?.kind === 'freeze' ? freeze : deactivate;
  const { addToast } = useToast();
  const data = accounts.data?.content ?? [];
  const metadata = accounts.data?.page;

  function stopAndRun(event, callback) {
    event.stopPropagation();
    callback();
  }

  function openAction(kind, account) {
    const freezeAccount = kind === 'freeze';
    setAction({
      kind,
      account,
      title: freezeAccount ? 'Freeze account' : 'Deactivate account',
      subtitle: account.accountNumber,
      message: freezeAccount
        ? 'The account will be frozen and unavailable for further transactions.'
        : 'The account will be closed while its financial history remains preserved.',
      confirmLabel: freezeAccount ? 'Freeze Account' : 'Deactivate Account',
    });
  }

  async function completeAction() {
    try {
      await mutation.mutateAsync(action.account.id);
      addToast({
        type: 'success',
        title: action.kind === 'freeze' ? 'Account frozen' : 'Account deactivated',
        message: `${action.account.accountNumber}'s status was updated.`,
      });
      setAction(null);
    } catch {
      // Mutation state renders the normalized API error.
    }
  }

  function actionButtons(account) {
    return (
      <div className="flex flex-wrap justify-end gap-2">
        <Button
          icon={Eye}
          onClick={(event) => stopAndRun(event, () => setDetailId(account.id))}
          size="sm"
          variant="outline"
        >
          Details
        </Button>
        {account.accountStatus === 'ACTIVE' && (
          <Button
            icon={Snowflake}
            onClick={(event) => stopAndRun(event, () => openAction('freeze', account))}
            size="sm"
            variant="outline"
          >
            Freeze
          </Button>
        )}
        {account.accountStatus !== 'CLOSED' && (
          <Button
            icon={XCircle}
            onClick={(event) =>
              stopAndRun(event, () => openAction('deactivate', account))
            }
            size="sm"
            variant="danger"
          >
            Deactivate
          </Button>
        )}
      </div>
    );
  }

  const columns = [
    {
      key: 'accountNumber',
      header: 'Account number',
      sortable: true,
      numeric: true,
    },
    { key: 'userId', header: 'User ID', numeric: true },
    { key: 'currency', header: 'Currency', sortable: true },
    {
      key: 'accountStatus',
      header: 'Status',
      sortable: true,
      render: (status) => <StatusBadge status={status} />,
    },
    {
      key: 'approvedAt',
      header: 'Approved',
      sortable: true,
      render: formatDate,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (_, account) => actionButtons(account),
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-semibold text-primary-600">Administration</p>
          <h1 className="mt-1 text-2xl font-bold text-neutral-800 sm:text-3xl">
            Account holders
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Review linked accounts and control account availability.
          </p>
        </div>
        <Button icon={UserPlus} onClick={() => setShowCreate(true)}>
          Create Account Holder
        </Button>
      </header>

      {accounts.isError ? (
        <EmptyState
          actionLabel="Try Again"
          description={accounts.error.message}
          icon={UserRoundCog}
          onAction={() => accounts.refetch()}
          title="Unable to load account holders"
        />
      ) : !accounts.isLoading && data.length === 0 ? (
        <EmptyState
          description="No account-holder records are available."
          icon={UserRoundCog}
          title="No account holders found"
        />
      ) : (
        <Table
          columns={columns}
          data={data}
          loading={accounts.isLoading}
          onRowClick={(account) => setDetailId(account.id)}
          pagination={{
            page: metadata?.number ?? listParams.page,
            pageSize: metadata?.size ?? listParams.size,
            totalElements: metadata?.totalElements ?? 0,
            totalPages: metadata?.totalPages ?? 1,
            onPageChange: listParams.setPage,
            onPageSizeChange: listParams.setPageSize,
          }}
          renderMobileCard={(account) => (
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono font-semibold text-neutral-800">
                    {account.accountNumber}
                  </p>
                  <p className="text-xs text-neutral-500">{account.currency}</p>
                </div>
                <StatusBadge status={account.accountStatus} />
              </div>
              {actionButtons(account)}
            </div>
          )}
          sorting={{
            field: listParams.field,
            direction: listParams.direction,
            onSortChange: listParams.setSorting,
          }}
        />
      )}

      <Modal
        isOpen={detailId != null}
        maxWidth="max-w-lg"
        onClose={() => setDetailId(null)}
        subtitle="Account and owner information"
        title="Account-holder details"
      >
        {detail.isLoading && (
          <p className="text-sm text-neutral-500">Loading account holder…</p>
        )}
        {detail.isError && <Alert tone="error">{detail.error.message}</Alert>}
        {owner.isError && <Alert tone="error">{owner.error.message}</Alert>}
        {detail.data && <AccountDetails account={detail.data} owner={owner.data} />}
      </Modal>

      {showCreate && <AdminUserFormModal onClose={() => setShowCreate(false)} />}

      <AdminActionModal
        action={action}
        mutation={mutation}
        onClose={() => {
          if (!mutation.isPending) {
            mutation.reset();
            setAction(null);
          }
        }}
        onConfirm={completeAction}
      />
    </div>
  );
}
