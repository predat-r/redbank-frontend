import { StatusBadge, Skeleton } from '../../../components/ui';

export const WelcomeHeader = ({ user, account, isLoading = false }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 border-b border-neutral-200/80">
      <div>
        <div className="flex items-center gap-3">
          {isLoading ? (
            <Skeleton className="h-8 w-48 sm:w-64 rounded-lg my-1" />
          ) : (
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-neutral-800 tracking-tight">
              Welcome, {user?.name || 'Valued Customer'}
            </h1>
          )}
          {account?.accountStatus && !isLoading && (
            <StatusBadge status={account.accountStatus} />
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        <Button
          variant="outline"
          size="sm"
          icon={Download}
          onClick={onExportClick}
          title="Export Statement"
        >
          Statement
        </Button>
      </div>
    </div>
  );
};
