import { AppShell } from '../../layouts/AppShell';
import { TransactionForm } from '../../features/transactions/components/TransactionForm';

export const WithdrawPage = () => {
  return (
    <AppShell activePath="/withdraw">
      <TransactionForm initialMode="withdrawal" />
    </AppShell>
  );
};

export default WithdrawPage;
