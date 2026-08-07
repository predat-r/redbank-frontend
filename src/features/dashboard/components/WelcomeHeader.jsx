import { Download } from 'lucide-react';
import { Button, StatusBadge } from '../../../components/ui';

export const WelcomeHeader = ({ user, account, onExportClick }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 border-b border-neutral-200/80">
      <div>
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-display text-neutral-800 tracking-tight">
            Welcome, {user?.name || 'Valued Customer'}
          </h1>
          {account?.accountStatus && <StatusBadge status={account.accountStatus} />}
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
