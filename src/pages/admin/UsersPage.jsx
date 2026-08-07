import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3, Eye, Power, PowerOff, UserPlus, Users } from 'lucide-react';
import { Alert } from '../../components/ui/Alert.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { Table } from '../../components/ui/Table.jsx';
import { AdminActionModal } from '../../features/admin/components/AdminActionModal.jsx';
import { AdminUserFormModal } from '../../features/admin/components/AdminUserFormModal.jsx';
import {
  useAdminUser,
  useAdminAccounts,
  useAdminUsers,
  useDeactivateAdminUser,
  useReactivateAdminUser,
} from '../../features/admin/admin.queries.js';
import { useAdminListParams } from '../../features/admin/useAdminListParams.js';
import { useToast } from '../../hooks/useToast.js';

const SORT_FIELDS = ['name', 'email', 'status', 'createdAt', 'updatedAt'];

function formatDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function UserDetails({ user }) {
  const details = [
    ['Name', user.name],
    ['Email', user.email],
    ['Phone number', user.phoneNumber],
    ['Address', user.address],
    ['Created', formatDate(user.createdAt)],
    ['Last updated', formatDate(user.updatedAt)],
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
          <StatusBadge status={user.status} />
        </dd>
      </div>
    </dl>
  );
}

export function UsersPage() {
  const navigate = useNavigate();
  const listParams = useAdminListParams({
    allowedSortFields: SORT_FIELDS,
    defaultSort: 'createdAt,desc',
  });
  const users = useAdminUsers(listParams.queryOptions);
  const accounts = useAdminAccounts({ page: 0, size: 50, sort: ['createdAt,desc'] });
  const [detailId, setDetailId] = useState(null);
  const [formState, setFormState] = useState(null);
  const [action, setAction] = useState(null);
  const detail = useAdminUser(detailId);
  const deactivate = useDeactivateAdminUser();
  const reactivate = useReactivateAdminUser();
  const mutation = action?.kind === 'reactivate' ? reactivate : deactivate;
  const { addToast } = useToast();
  const data = users.data?.content ?? [];
  const metadata = users.data?.page;

  function stopAndRun(event, callback) {
    event.stopPropagation();
    callback();
  }

  function openLifecycle(user) {
    const reactivateUser = user.status === 'DEACTIVATED';
    setAction({
      kind: reactivateUser ? 'reactivate' : 'deactivate',
      user,
      title: reactivateUser ? 'Reactivate user' : 'Deactivate user',
      subtitle: `${user.name} · ${user.email}`,
      message: reactivateUser
        ? 'This user will regain active access to RedBank.'
        : 'This user will lose access, while financial and audit history remains preserved.',
      confirmLabel: reactivateUser ? 'Reactivate User' : 'Deactivate User',
      variant: reactivateUser ? 'primary' : 'danger',
    });
  }

  async function completeLifecycle() {
    try {
      await mutation.mutateAsync(action.user.id);
      addToast({
        type: 'success',
        title: action.kind === 'reactivate' ? 'User reactivated' : 'User deactivated',
        message: `${action.user.name}'s status was updated.`,
      });
      setAction(null);
    } catch {
      // Mutation state renders the normalized API error.
    }
  }

  function actionButtons(user) {
    const canChangeStatus = ['ACTIVE', 'DEACTIVATED'].includes(user.status);
    return (
      <div className="flex flex-wrap justify-end gap-2">
        <Button
          icon={Eye}
          onClick={(event) => stopAndRun(event, () => setDetailId(user.id))}
          size="sm"
          variant="outline"
        >
          Details
        </Button>
        <Button
          icon={Edit3}
          onClick={(event) =>
            stopAndRun(event, () => setFormState({ mode: 'edit', user }))
          }
          size="sm"
          variant="outline"
        >
          Edit
        </Button>
        {canChangeStatus && (
          <Button
            icon={user.status === 'DEACTIVATED' ? Power : PowerOff}
            onClick={(event) => stopAndRun(event, () => openLifecycle(user))}
            size="sm"
            variant={user.status === 'DEACTIVATED' ? 'outline' : 'danger'}
          >
            {user.status === 'DEACTIVATED' ? 'Reactivate' : 'Deactivate'}
          </Button>
        )}
      </div>
    );
  }

  const columns = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'phoneNumber', header: 'Phone' },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (status) => <StatusBadge status={status} />,
    },
    {
      key: 'createdAt',
      header: 'Created',
      sortable: true,
      render: formatDate,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (_, user) => actionButtons(user),
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-semibold text-primary-600">Administration</p>
          <h1 className="mt-1 text-2xl font-bold text-neutral-800 sm:text-3xl">Users</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Manage user profiles and access status.
          </p>
        </div>
        <Button icon={UserPlus} onClick={() => setFormState({ mode: 'create' })}>
          Create User
        </Button>
      </header>

      {users.isError ? (
        <EmptyState
          actionLabel="Try Again"
          description={users.error.message}
          icon={Users}
          onAction={() => users.refetch()}
          title="Unable to load users"
        />
      ) : !users.isLoading && data.length === 0 ? (
        <EmptyState
          description="No user records are available."
          icon={Users}
          title="No users found"
        />
      ) : (
        <Table
          columns={columns}
          data={data}
          loading={users.isLoading}
          onRowClick={(user) => setDetailId(user.id)}
          pagination={{
            page: metadata?.number ?? listParams.page,
            pageSize: metadata?.size ?? listParams.size,
            totalElements: metadata?.totalElements ?? 0,
            totalPages: metadata?.totalPages ?? 1,
            onPageChange: listParams.setPage,
            onPageSizeChange: listParams.setPageSize,
          }}
          renderMobileCard={(user) => (
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-neutral-800">{user.name}</p>
                  <p className="text-xs text-neutral-500">{user.email}</p>
                </div>
                <StatusBadge status={user.status} />
              </div>
              {actionButtons(user)}
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
        subtitle="User profile"
        title="User details"
      >
        {detail.isLoading && <p className="text-sm text-neutral-500">Loading user…</p>}
        {detail.isError && <Alert tone="error">{detail.error.message}</Alert>}
        {detail.data && <UserDetails user={detail.data} />}
        {detail.data && (
          <div className="mt-6 border-t border-neutral-200 pt-4">
            {accounts.isLoading ? (
              <p className="text-sm text-neutral-500">Looking up linked account…</p>
            ) : accounts.data?.content?.some(
                (account) =>
                  account.user?.id === detail.data.id || account.userId === detail.data.id
              ) ? (
              <Button
                onClick={() => {
                  const account = accounts.data.content.find(
                    (item) =>
                      item.user?.id === detail.data.id || item.userId === detail.data.id
                  );
                  setDetailId(null);
                  navigate(`/admin/accounts?accountId=${account.id}`);
                }}
                variant="outline"
              >
                View linked account
              </Button>
            ) : (
              <p className="text-sm text-neutral-500">No linked account found.</p>
            )}
          </div>
        )}
      </Modal>

      {formState && (
        <AdminUserFormModal
          onClose={() => setFormState(null)}
          user={formState.mode === 'edit' ? formState.user : null}
        />
      )}

      <AdminActionModal
        action={action}
        mutation={mutation}
        onClose={() => {
          if (!mutation.isPending) {
            mutation.reset();
            setAction(null);
          }
        }}
        onConfirm={completeLifecycle}
      />
    </div>
  );
}
