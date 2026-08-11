import { useNavigate } from 'react-router-dom';
import { ArrowLeftRight, Banknote, ArrowRight, Wallet } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Card } from '../../../components/ui/Card';

export const TransactionInitiateStep = ({
  mode,
  destinationAccountNumber,
  setDestinationAccountNumber,
  amount,
  setAmount,
  category = 'OTHER',
  setCategory,
  description,
  setDescription,
  withdrawalMethod,
  setWithdrawalMethod,
  errors,
  onSubmit,
  currentBalance = 0,
  currency = 'USD',
}) => {
  const navigate = useNavigate();

  const formattedBalance = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(currentBalance);

  return (
    <Card className="p-4 sm:p-6">
      <form noValidate onSubmit={onSubmit} className="space-y-5">
        <div className="pb-3 border-b border-neutral-200 flex items-center justify-between gap-2 flex-wrap">
          <h2 className="text-base font-semibold text-neutral-800 flex items-center gap-2">
            {mode === 'transfer' ? (
              <ArrowLeftRight className="w-5 h-5 text-primary-600" />
            ) : (
              <Banknote className="w-5 h-5 text-primary-600" />
            )}
            <span>{mode === 'transfer' ? 'Transfer Details' : 'Withdrawal Request'}</span>
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-lg border border-neutral-200/70">
            <Wallet className="w-3.5 h-3.5 text-primary-600" />
            <span>Current Balance:</span>
            <strong className="font-mono text-neutral-900 font-bold">
              {formattedBalance}
            </strong>
          </div>
        </div>

        {mode === 'transfer' ? (
          <Input
            label="Destination Account Number"
            placeholder="e.g. RB1000000001"
            value={destinationAccountNumber}
            onChange={(e) => setDestinationAccountNumber(e.target.value)}
            error={errors.destinationAccountNumber}
            required
          />
        ) : (
          <Select
            label="Withdrawal Method"
            value={withdrawalMethod}
            onChange={(e) => setWithdrawalMethod(e.target.value)}
            options={[
              { value: 'ATM_CODE', label: 'ATM Cash Code (Instant)' },
              { value: 'BRANCH_COUNTER', label: 'RedBank Branch Counter' },
              { value: 'LINKED_ACCOUNT', label: 'Linked Account Withdrawal' },
            ]}
          />
        )}

        <Input
          label={
            <span className="flex items-center justify-between w-full">
              <span>Amount ($)</span>
              <span className="text-xs font-normal text-neutral-500">
                Available Balance:{' '}
                <span className="font-semibold text-neutral-800 font-mono">
                  {formattedBalance}
                </span>
              </span>
            </span>
          }
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={errors.amount}
          helperText={`Current Balance: ${formattedBalance} · Min: $0.01 · Max: $500,000`}
          required
        />

        <Select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={[
            { value: 'OTHER', label: 'Other / General' },
            { value: 'BILLS', label: 'Bills & Utilities' },
            { value: 'FOOD', label: 'Food & Dining' },
            { value: 'GROCERY', label: 'Groceries' },
            { value: 'DONATION', label: 'Donations & Charity' },
            { value: 'ENTERTAINMENT', label: 'Entertainment' },
            { value: 'SHOPPING', label: 'Shopping' },
            { value: 'HEALTH', label: 'Health & Medical' },
            { value: 'TRANSPORT', label: 'Transport & Travel' },
            { value: 'EDUCATION', label: 'Education' },
            { value: 'INVESTMENT', label: 'Investments & Savings' },
          ]}
        />

        <Input
          label="Description / Purpose (Optional)"
          placeholder={
            mode === 'transfer'
              ? 'e.g. Monthly rent, Bill payment'
              : 'e.g. Personal expenses'
          }
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="pt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-3 border-t border-neutral-200">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto text-xs justify-center"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={ArrowRight}
            iconPosition="trailing"
            className="w-full sm:w-auto text-xs justify-center"
          >
            Continue to Verify
          </Button>
        </div>
      </form>
    </Card>
  );
};
