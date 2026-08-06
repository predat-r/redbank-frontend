import { AppShell } from '../../layouts/AppShell';
import { TransactionForm } from '../../features/transfers/components/TransactionForm';

export const WithdrawPage = () => {
  return (
    <AppShell activePath="/transfer">
      <TransactionForm initialMode="withdrawal" />
    </AppShell>
  );
};

export default WithdrawPage;
