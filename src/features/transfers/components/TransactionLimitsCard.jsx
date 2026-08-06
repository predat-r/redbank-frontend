import { Info, Building2 } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

export const TransactionLimitsCard = () => {
  return (
    <div className="space-y-4">
      <Card className="p-5 space-y-4 bg-gradient-to-br from-neutral-0 to-slate-50">
        <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-500 flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-600" />
          <span>Transaction Limits</span>
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex justify-between items-center p-2.5 bg-neutral-0 rounded-lg border border-neutral-200">
            <span className="text-neutral-600 font-medium">Daily Transfer Limit</span>
            <span className="font-bold text-neutral-800 tabular-nums">500,000 PKR</span>
          </div>

          <div className="flex justify-between items-center p-2.5 bg-neutral-0 rounded-lg border border-neutral-200">
            <span className="text-neutral-600 font-medium">Min Amount</span>
            <span className="font-bold text-neutral-800 tabular-nums">100 PKR</span>
          </div>

          <div className="flex justify-between items-center p-2.5 bg-neutral-0 rounded-lg border border-neutral-200">
            <span className="text-neutral-600 font-medium">Daily Count Remaining</span>
            <span className="font-bold text-success-600">5 / 5 Remaining</span>
          </div>
        </div>
      </Card>

      <Card className="p-5 space-y-3 bg-neutral-0">
        <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-500 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-600" />
          <span>Security Guarantee</span>
        </h3>

        <p className="text-xs text-neutral-600 leading-relaxed">
          All transfers and withdrawals are protected with 256-bit encryption and
          instantaneous balance reconciliation.
        </p>
      </Card>
    </div>
  );
};
