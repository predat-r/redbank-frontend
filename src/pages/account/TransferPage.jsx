import { AppShell } from '../../layouts/AppShell';
import { TransactionForm } from '../../features/transfers/components/TransactionForm';

export const TransferPage = () => {
  return (
    <AppShell activePath="/transfer">
      <TransactionForm initialMode="transfer" />
    </AppShell>
  );
};

export default TransferPage;
