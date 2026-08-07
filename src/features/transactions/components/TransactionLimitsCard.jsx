import { useNavigate } from 'react-router-dom';
import {
  History,
  ArrowRight,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useMyTransactions } from '../transactions.queries';
import { useMyAccount } from '../../account/account.queries';

export const TransactionLimitsCard = () => {
  const navigate = useNavigate();

  const { data: myAccount } = useMyAccount();
  const myAccountNumber = myAccount?.accountNumber;

  const { data: apiResponse, isLoading } = useMyTransactions({
    page: 0,
    size: 5,
    sort: 'createdAt,desc',
  });

  const recentItems = apiResponse?.content || [];

  return (
    <div className="space-y-4">
      {/* Recent Activity Quick Preview Card */}
      <Card className="p-5 space-y-4 bg-neutral-0 border border-neutral-200 shadow-sm">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-500 flex items-center gap-2">
            <History className="w-4 h-4 text-slate-600" />
            <span>Recent Activity</span>
          </h3>
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowRight}
            iconPosition="trailing"
            onClick={() => navigate('/history')}
            className="text-xs px-2 py-1 text-primary-600 hover:text-primary-700 font-semibold h-auto"
          >
            View All
          </Button>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <div className="py-6 text-center text-xs text-neutral-400">
              Loading recent transactions...
            </div>
          ) : recentItems.length === 0 ? (
            <div className="py-6 text-center text-xs text-neutral-400">
              No recent transactions found.
            </div>
          ) : (
            recentItems.map((item) => {
              const isCredit =
                item.type === 'DEPOSIT' ||
                (item.type === 'TRANSFER' &&
                  Boolean(myAccountNumber) &&
                  item.destinationAccountNumber === myAccountNumber);

              return (
                <div
                  key={item.id}
                  onClick={() => navigate('/history')}
                  className="p-3.5 bg-neutral-50 hover:bg-neutral-100/90 border border-neutral-200/80 rounded-xl flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isCredit
                          ? 'bg-success-50 text-success-600'
                          : 'bg-neutral-200/60 text-neutral-600'
                      }`}
                    >
                      {isCredit ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : item.type === 'WITHDRAWAL' ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowLeftRight className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-xs font-semibold text-neutral-800 truncate">
                        {item.description || 'Transaction'}
                      </p>
                      <p className="text-[10px] font-mono text-neutral-400">
                        {item.transactionReference ||
                          item.destinationAccountNumber ||
                          item.sourceAccountNumber}{' '}
                        •{' '}
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString()
                          : ''}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-sm font-bold tabular-nums shrink-0 ${
                      isCredit ? 'text-success-600' : 'text-neutral-800'
                    }`}
                  >
                    {isCredit ? '+' : '-'}${item.amount?.toFixed(2)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
};
