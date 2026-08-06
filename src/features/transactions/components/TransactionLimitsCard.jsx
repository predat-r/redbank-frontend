import { useNavigate } from 'react-router-dom';
import { History, ArrowRight } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { mockTransactions } from '../../dashboard/mockData';

export const TransactionLimitsCard = () => {
  const navigate = useNavigate();
  const recentItems = mockTransactions.slice(0, 4);

  return (
    <div className="space-y-4">
      {/* Recent Activity Quick Preview Card */}
      <Card className="p-5 space-y-3 bg-neutral-0 border border-neutral-200 shadow-sm">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-2.5">
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

        <div className="space-y-2.5">
          {recentItems.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate('/history')}
              className="p-3 bg-neutral-50 hover:bg-neutral-100/80 border border-neutral-200/80 rounded-xl flex items-center justify-between cursor-pointer transition-colors"
            >
              <div className="min-w-0 pr-2 space-y-0.5">
                <p className="text-xs font-semibold text-neutral-800 truncate">
                  {item.description}
                </p>
                <p className="text-[10px] font-mono text-neutral-400">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`text-xs font-bold tabular-nums shrink-0 ${
                  item.type === 'DEPOSIT' ? 'text-success-600' : 'text-neutral-800'
                }`}
              >
                {item.type === 'DEPOSIT' ? '+' : '-'}${item.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
