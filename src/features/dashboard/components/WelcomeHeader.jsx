import { Download } from 'lucide-react';
import { Button, StatusBadge } from '../../../components/ui';

export const WelcomeHeader = ({ user, account, onExportClick }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-neutral-200/80">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-neutral-800 tracking-tight">
            Welcome, {user?.name || 'Valued Customer'}
          </h1>
          {account?.accountStatus && <StatusBadge status={account.accountStatus} />}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
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
