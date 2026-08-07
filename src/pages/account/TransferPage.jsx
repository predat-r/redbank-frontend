import { useNavigate } from 'react-router-dom';
import { Snowflake } from 'lucide-react';
import { AppShell } from '../../layouts/AppShell';
import { TransactionForm } from '../../features/transactions/components/TransactionForm';
import { useMyAccount } from '../../features/account/account.queries';
import { Button } from '../../components/ui';

export const TransferPage = () => {
  const navigate = useNavigate();
  const { data: account } = useMyAccount();
  const isFrozen = account?.accountStatus === 'FROZEN';

  if (isFrozen) {
    return (
      <AppShell activePath="/transfer">
        <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-neutral-0 border border-neutral-200 rounded-2xl shadow-md text-center space-y-4 my-8">
          <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
            <Snowflake className="w-7 h-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-800">
            Fund Transfers Locked
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
            Your account is currently <strong>FROZEN</strong>. Outgoing fund transfers are
            disabled until your account is restored to active status.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/profile')}
              className="bg-amber-600 hover:bg-amber-700 text-white border-none"
            >
              Unfreeze Account
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell activePath="/transfer">
      <TransactionForm initialMode="transfer" />
    </AppShell>
  );
};

export default TransferPage;
