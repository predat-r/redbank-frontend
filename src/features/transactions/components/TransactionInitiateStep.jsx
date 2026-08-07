import { useNavigate } from 'react-router-dom';
import { ArrowLeftRight, Banknote, ArrowRight } from 'lucide-react';
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
  description,
  setDescription,
  withdrawalMethod,
  setWithdrawalMethod,
  errors,
  onSubmit,
}) => {
  const navigate = useNavigate();

  return (
    <Card className="p-4 sm:p-6">
      <form noValidate onSubmit={onSubmit} className="space-y-5">
        <h2 className="text-base font-semibold text-neutral-800 pb-3 border-b border-neutral-200 flex items-center gap-2">
          {mode === 'transfer' ? (
            <ArrowLeftRight className="w-5 h-5 text-primary-600" />
          ) : (
            <Banknote className="w-5 h-5 text-primary-600" />
          )}
          <span>{mode === 'transfer' ? 'Transfer Details' : 'Withdrawal Request'}</span>
        </h2>

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
          label="Amount ($)"
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={errors.amount}
          helperText="Min: $0.01 · Max: $500,000"
          required
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
