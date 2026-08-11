import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, RotateCcw, Receipt } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { StatusBadge } from '../../../components/ui/StatusBadge';

export const TransactionReceiptStep = ({ mode, receiptData, onReset }) => {
  const navigate = useNavigate();

  if (!receiptData) return null;

  const isPending = receiptData.status === 'PENDING';

  return (
    <Card className="p-4 sm:p-6 lg:p-8 space-y-6 text-center">
      <div
        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto ${
          isPending ? 'bg-warning-50 text-warning-600' : 'bg-success-50 text-success-600'
        }`}
      >
        {isPending ? (
          <Clock className="w-8 h-8 sm:w-9 sm:h-9" />
        ) : (
          <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9" />
        )}
      </div>

      <div>
        <StatusBadge status={receiptData.status || 'COMPLETED'} />
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-neutral-800 mt-2">
          {isPending
            ? mode === 'transfer'
              ? 'Transfer Submitted'
              : 'Withdrawal Submitted'
            : mode === 'transfer'
              ? 'Transfer Successful'
              : 'Withdrawal Completed'}
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          {isPending
            ? 'Your transaction is currently undergoing security review.'
            : 'Your transaction has been processed securely.'}
        </p>
      </div>

      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 sm:p-5 text-left space-y-3 font-sans">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-xs text-neutral-500 pb-2 border-b border-neutral-200">
          <span>Reference Code</span>
          <span className="font-mono font-semibold text-neutral-800 text-xs sm:text-sm break-all">
            {receiptData.reference}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-xs sm:text-sm py-1">
          <span className="text-neutral-500">Amount</span>
          <span className="font-bold text-neutral-800 text-sm sm:text-base tabular-nums">
            ${receiptData.amount.toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-xs sm:text-sm py-1">
          <span className="text-neutral-500">Target / Destination</span>
          <span className="font-semibold text-neutral-800 font-mono break-all sm:break-normal">
            {receiptData.destination}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-xs text-neutral-500 pt-2 border-t border-neutral-200">
          <span>Timestamp</span>
          <span>{receiptData.date}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2">
        <Button
          variant="outline"
          icon={RotateCcw}
          onClick={onReset}
          className="w-full sm:w-auto text-xs justify-center"
        >
          Make Another Transaction
        </Button>

        <Button
          variant="primary"
          icon={Receipt}
          onClick={() => navigate('/dashboard')}
          className="w-full sm:w-auto text-xs justify-center"
        >
          Go to Dashboard
        </Button>
      </div>
    </Card>
  );
};
