import { CheckCircle2, Clock3, RefreshCw, ShieldX, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Alert } from '../../components/ui/Alert.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { LoadingState } from '../../components/ui/LoadingState.jsx';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { useLogout, useRegistrationStatus } from '../../features/auth/auth.queries.js';
import { restoreSession } from '../../api/axios.js';

const statusContent = {
  PENDING_APPROVAL: {
    icon: Clock3,
    iconClass: 'bg-warning-50 text-warning-600',
    title: 'Your registration is under review',
    description:
      'An administrator is reviewing your information. Check back later for an updated decision.',
  },
  ACTIVE: {
    icon: CheckCircle2,
    iconClass: 'bg-success-50 text-success-600',
    title: 'Your account is active',
    description: 'Your registration has been approved and your RedBank account is ready.',
  },
  REJECTED: {
    icon: XCircle,
    iconClass: 'bg-error-50 text-error-600',
    title: 'Your registration was not approved',
    description:
      'Review the decision details below or contact an administrator for assistance.',
  },
  DEACTIVATED: {
    icon: ShieldX,
    iconClass: 'bg-error-50 text-error-600',
    title: 'Your account is deactivated',
    description:
      'Account access is unavailable. Contact an administrator for assistance.',
  },
};

export function RegistrationStatusPage() {
  const statusQuery = useRegistrationStatus();
  const logoutMutation = useLogout();
  const navigate = useNavigate();
  const [isContinuing, setIsContinuing] = useState(false);

  async function continueToDashboard() {
    setIsContinuing(true);
    try {
      await restoreSession();
      navigate('/dashboard', { replace: true });
    } catch {
      setIsContinuing(false);
      statusQuery.refetch();
    }
  }

  function handleLogout() {
    logoutMutation.mutate(undefined, {
      onSettled: () => navigate('/login', { replace: true }),
    });
  }

  if (statusQuery.isPending) {
    return (
      <main className="mx-auto min-h-screen max-w-2xl bg-neutral-50 px-4 py-16 sm:px-6">
        <Card>
          <LoadingState label="Checking your registration status" />
        </Card>
      </main>
    );
  }

  if (statusQuery.isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12">
        <Card className="w-full max-w-xl">
          <h1 className="text-xl font-bold text-neutral-800">
            Registration status unavailable
          </h1>
          <div className="mt-4">
            <Alert tone="error">{statusQuery.error.message}</Alert>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button icon={RefreshCw} onClick={() => statusQuery.refetch()}>
              Try Again
            </Button>
            <Button
              loading={logoutMutation.isPending}
              onClick={handleLogout}
              variant="outline"
            >
              Sign Out
            </Button>
          </div>
        </Card>
      </main>
    );
  }

  const content =
    statusContent[statusQuery.data.status] || statusContent.PENDING_APPROVAL;
  const Icon = content.icon;

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12 sm:px-6">
      <Card className="w-full max-w-xl text-center">
        <div
          className={`mx-auto flex size-14 items-center justify-center rounded-full ${content.iconClass}`}
        >
          <Icon className="size-7" aria-hidden="true" />
        </div>
        <div className="mt-5">
          <StatusBadge status={statusQuery.data.status} />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-neutral-800">{content.title}</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-neutral-500">
          {content.description}
        </p>

        {statusQuery.data.status === 'REJECTED' && statusQuery.data.rejectionReason && (
          <div className="mt-6 text-left">
            <Alert tone="error">
              <strong className="block">Reason</strong>
              <span>{statusQuery.data.rejectionReason}</span>
            </Alert>
          </div>
        )}

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          {statusQuery.data.status === 'ACTIVE' ? (
            <Button loading={isContinuing} onClick={continueToDashboard}>
              Continue to Dashboard
            </Button>
          ) : (
            <Button
              icon={RefreshCw}
              onClick={() => statusQuery.refetch()}
              variant="outline"
            >
              Refresh Status
            </Button>
          )}
          <Button
            loading={logoutMutation.isPending}
            onClick={handleLogout}
            variant="ghost"
          >
            Sign Out
          </Button>
        </div>
      </Card>
    </main>
  );
}
