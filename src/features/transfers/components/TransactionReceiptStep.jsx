import { useNavigate } from 'react-router-dom';
import { CheckCircle2, RotateCcw, Receipt } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { StatusBadge } from '../../../components/ui/StatusBadge';

export const TransactionReceiptStep = ({ mode, receiptData, onReset }) => {
  const navigate = useNavigate();

  if (!receiptData) return null;

  return (
    <Card className="p-6 sm:p-8 space-y-6 text-center">
      <div className="w-16 h-16 rounded-full bg-success-50 text-success-600 flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-9 h-9" />
      </div>

      <div>
        <StatusBadge status="COMPLETED" />
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 mt-2">
          {mode === 'transfer' ? 'Transfer Successful' : 'Withdrawal Completed'}
        </h2>
        <p className="text-sm text-neutral-500 mt-1">
          Your transaction has been processed securely.
        </p>
      </div>

      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 text-left space-y-3 font-sans">
        <div className="flex justify-between items-center text-xs text-neutral-500 pb-2 border-b border-neutral-200">
          <span>Reference Code</span>
          <span className="font-mono font-semibold text-neutral-800 text-sm">
            {receiptData.reference}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm py-1">
          <span className="text-neutral-500">Amount</span>
          <span className="font-bold text-neutral-800 text-base tabular-nums">
            PKR {receiptData.amount.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm py-1">
          <span className="text-neutral-500">Target / Destination</span>
          <span className="font-semibold text-neutral-800 font-mono">
            {receiptData.destination}
          </span>
        </div>

        <div className="flex justify-between items-center text-xs text-neutral-500 pt-2 border-t border-neutral-200">
          <span>Timestamp</span>
          <span>{receiptData.date}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Button variant="outline" icon={RotateCcw} onClick={onReset}>
          Make Another Transaction
        </Button>

        <Button variant="primary" icon={Receipt} onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </Button>
      </div>
    </Card>
  );
};
