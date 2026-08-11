import { ShieldAlert, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

export const TransactionVerifyStep = ({
  mode,
  destinationAccountNumber,
  withdrawalMethod,
  amount,
  category = 'OTHER',
  description,
  loading,
  error,
  onBack,
  onConfirm,
}) => {
  return (
    <Card className="p-4 sm:p-6 space-y-6">
      <div className="pb-3 border-b border-neutral-200">
        <h2 className="text-base font-semibold text-neutral-800 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-warning-600" />
          <span>Verify Transaction Details</span>
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Please review the details below before confirming.
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-danger-50 border border-danger-200 rounded-xl flex items-start gap-2.5 text-xs text-danger-800">
          <AlertCircle className="w-4 h-4 text-danger-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{error}</div>
        </div>
      )}

      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm py-1 border-b border-neutral-200/60">
          <span className="text-neutral-500 font-medium">Transaction Type</span>
          <span className="font-semibold text-neutral-800">
            {mode === 'transfer' ? 'Fund Transfer' : 'Cash Withdrawal'}
          </span>
        </div>

        {mode === 'transfer' ? (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm py-1 border-b border-neutral-200/60">
            <span className="text-neutral-500 font-medium">Destination Account</span>
            <span className="font-semibold text-neutral-800 font-mono break-all sm:break-normal">
              {destinationAccountNumber}
            </span>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm py-1 border-b border-neutral-200/60">
            <span className="text-neutral-500 font-medium">Method</span>
            <span className="font-semibold text-neutral-800">
              {withdrawalMethod.replace('_', ' ')}
            </span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm py-1 border-b border-neutral-200/60">
          <span className="text-neutral-500 font-medium">Amount</span>
          <span className="font-bold text-primary-600 text-base sm:text-lg tabular-nums">
            ${parseFloat(amount || '0').toLocaleString()}
          </span>
        </div>

        {category && (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm py-1 border-b border-neutral-200/60">
            <span className="text-neutral-500 font-medium">Category</span>
            <span className="font-semibold text-neutral-800 bg-neutral-100 px-2.5 py-0.5 rounded text-xs">
              {category}
            </span>
          </div>
        )}

        {description && (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm py-1">
            <span className="text-neutral-500 font-medium">Description</span>
            <span className="text-neutral-700 italic break-words">{description}</span>
          </div>
        )}
      </div>

      <div className="pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={loading}
          className="w-full sm:w-auto text-xs justify-center"
        >
          Back to Edit
        </Button>
        <Button
          variant="primary"
          loading={loading}
          onClick={onConfirm}
          className="w-full sm:w-auto text-xs justify-center"
        >
          Confirm & Submit
        </Button>
      </div>
    </Card>
  );
};
