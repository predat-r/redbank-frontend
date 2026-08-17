import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Landmark } from 'lucide-react';
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
  const accountPickerRef = useRef(null);
  const [accountPickerOpen, setAccountPickerOpen] = useState(false);
  const accounts = useAdminAccounts({ page: 0, size: 100 });
  const accountOptions = (accounts.data?.content ?? [])
    .filter((account) => account.accountStatus !== 'CLOSED')
    .map((account) => ({
      accountNumber: account.accountNumber,
      holderName: account.user?.name || account.ownerName || `User ${account.userId}`,
    }));
  const matchingAccounts = accountOptions.filter(({ accountNumber, holderName }) => {
    const search = values.accountNumber.trim().toLowerCase();
    return (
      !search ||
      accountNumber.toLowerCase().includes(search) ||
      holderName.toLowerCase().includes(search)
    );
  });

  useEffect(() => {
    function closePicker(event) {
      if (!accountPickerRef.current?.contains(event.target)) {
        setAccountPickerOpen(false);
      }
    }

    document.addEventListener('mousedown', closePicker);
    return () => document.removeEventListener('mousedown', closePicker);
  }, []);
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
          <div className="relative" ref={accountPickerRef}>
            <Input
              label="Account number"
              placeholder={
                accounts.isLoading
                  ? 'Loading accounts…'
                  : 'Type or select an account number'
              }
              value={values.accountNumber}
              onFocus={() => setAccountPickerOpen(true)}
              onChange={(e) => {
                setValues({ ...values, accountNumber: e.target.value });
                setAccountPickerOpen(true);
              }}
              required
            />
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3.5 top-9 size-4 text-neutral-500"
            />
            {accountPickerOpen && (
              <div className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-neutral-200 bg-neutral-0 py-1 shadow-lg">
                {matchingAccounts.length ? (
                  matchingAccounts.map(({ accountNumber, holderName }) => (
                    <button
                      className="flex w-full flex-col items-start px-3.5 py-2.5 text-left hover:bg-neutral-50"
                      key={accountNumber}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => {
                        setValues({ ...values, accountNumber });
                        setAccountPickerOpen(false);
                      }}
                      type="button"
                    >
                      <span className="text-sm font-medium text-neutral-800">
                        {holderName}
                      </span>
                      <span className="font-mono text-xs text-neutral-500">
                        {accountNumber}
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="px-3.5 py-3 text-sm text-neutral-500">
                    No matching accounts found.
                  </p>
                )}
              </div>
            )}
          </div>
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
