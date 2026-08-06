import { ShieldAlert } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

export const TransactionVerifyStep = ({
  mode,
  destinationAccountNumber,
  withdrawalMethod,
  amount,
  description,
  loading,
  onBack,
  onConfirm,
}) => {
  return (
    <Card className="p-6 space-y-6">
      <div className="pb-3 border-b border-neutral-200">
        <h2 className="text-base font-semibold text-neutral-800 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-warning-600" />
          <span>Verify Transaction Details</span>
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Please review the details below before confirming.
        </p>
      </div>

      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 space-y-3">
        <div className="flex justify-between items-center text-sm py-1 border-b border-neutral-200/60">
          <span className="text-neutral-500 font-medium">Transaction Type</span>
          <span className="font-semibold text-neutral-800">
            {mode === 'transfer' ? 'Fund Transfer' : 'Cash Withdrawal'}
          </span>
        </div>

        {mode === 'transfer' ? (
          <div className="flex justify-between items-center text-sm py-1 border-b border-neutral-200/60">
            <span className="text-neutral-500 font-medium">Destination Account</span>
            <span className="font-semibold text-neutral-800 font-mono">
              {destinationAccountNumber}
            </span>
          </div>
        ) : (
          <div className="flex justify-between items-center text-sm py-1 border-b border-neutral-200/60">
            <span className="text-neutral-500 font-medium">Method</span>
            <span className="font-semibold text-neutral-800">
              {withdrawalMethod.replace('_', ' ')}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center text-sm py-1 border-b border-neutral-200/60">
          <span className="text-neutral-500 font-medium">Amount</span>
          <span className="font-bold text-primary-600 text-lg tabular-nums">
            PKR {parseFloat(amount).toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm py-1 border-b border-neutral-200/60">
          <span className="text-neutral-500 font-medium">Processing Fee</span>
          <span className="font-semibold text-success-600">FREE (0 PKR)</span>
        </div>

        {description && (
          <div className="flex justify-between items-center text-sm py-1">
            <span className="text-neutral-500 font-medium">Description</span>
            <span className="text-neutral-700 italic">{description}</span>
          </div>
        )}
      </div>

      <div className="pt-2 flex items-center justify-between gap-3">
        <Button variant="outline" onClick={onBack} disabled={loading}>
          Back to Edit
        </Button>
        <Button variant="primary" loading={loading} onClick={onConfirm}>
          Confirm & Submit
        </Button>
      </div>
    </Card>
  );
};
