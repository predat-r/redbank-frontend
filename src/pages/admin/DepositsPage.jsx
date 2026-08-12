import { useState } from 'react';
import { Landmark } from 'lucide-react';
import { Alert } from '../../components/ui/Alert.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import {
  useAdminAccounts,
  useCreateAdminDeposit,
} from '../../features/admin/admin.queries.js';
export function DepositsPage() {
  const [values, setValues] = useState({
    accountNumber: '',
    amount: '',
    description: '',
  });
  const mutation = useCreateAdminDeposit();
  const accounts = useAdminAccounts({ page: 0, size: 100 });
  const accountOptions = (accounts.data?.content ?? [])
    .filter((account) => account.accountStatus !== 'CLOSED')
    .map((account) => ({
      accountNumber: account.accountNumber,
      holderName: account.user?.name || account.ownerName || `User ${account.userId}`,
    }));
  function submit(e) {
    e.preventDefault();
    mutation.mutate({
      accountNumber: values.accountNumber,
      amount: Number(values.amount),
      description: values.description || undefined,
    });
  }
  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-semibold text-primary-600">Administration</p>
        <h1 className="mt-1 text-2xl font-bold text-neutral-800 sm:text-3xl">Deposits</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Credit funds to an account and receive the transaction receipt.
        </p>
      </header>
      <div className="max-w-2xl rounded-xl border border-neutral-200 bg-neutral-0 p-6 shadow-sm">
        <form onSubmit={submit} className="space-y-4">
          <Input
            list="deposit-account-options"
            label="Account number"
            placeholder={
              accounts.isLoading
                ? 'Loading accounts…'
                : 'Type or select an account number'
            }
            value={values.accountNumber}
            onChange={(e) => setValues({ ...values, accountNumber: e.target.value })}
            required
          />
          <datalist id="deposit-account-options">
            {accountOptions.map(({ accountNumber, holderName }) => (
              <option key={accountNumber} value={accountNumber}>
                {holderName} — {accountNumber}
              </option>
            ))}
          </datalist>
          <Input
            label="Amount"
            type="number"
            min="0.01"
            step="0.01"
            value={values.amount}
            onChange={(e) => setValues({ ...values, amount: e.target.value })}
            required
          />
          <Input
            label="Note"
            value={values.description}
            onChange={(e) => setValues({ ...values, description: e.target.value })}
            maxLength={500}
          />
          {mutation.isError && <Alert tone="error">{mutation.error.message}</Alert>}
          <Button icon={Landmark} type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Processing…' : 'Create deposit'}
          </Button>
        </form>
      </div>
      {mutation.data && (
        <div className="max-w-2xl rounded-xl border border-success-600 bg-success-50 p-6">
          <p className="font-semibold text-success-600">Deposit completed</p>
          <p className="mt-2 font-mono">{mutation.data.transactionReference}</p>
          <p className="mt-1 text-sm">
            {mutation.data.amount} · <StatusBadge status={mutation.data.status} />
          </p>
        </div>
      )}
    </div>
  );
}
