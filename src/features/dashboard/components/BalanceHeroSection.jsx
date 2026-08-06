import { useState } from 'react';
import {
  Eye,
  EyeOff,
  Copy,
  Check,
  ArrowLeftRight,
  Banknote,
  ChevronRight,
} from 'lucide-react';
import { HeroCard, Card, Button } from '../../../components/ui';

export const BalanceHeroSection = ({
  balance = 42850.75,
  currency = 'USD',
  accountNumber = 'RB-8492048192',
  onViewDetails,
  onTransferClick,
  onWithdrawClick,
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState(currency);
  const [showBalance, setShowBalance] = useState(true);
  const [copied, setCopied] = useState(false);

  const formattedBalance = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: selectedCurrency,
  }).format(balance);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Current Balance Hero Card - 7 Columns on Large Screens */}
      <HeroCard className="lg:col-span-7 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle Decorative Background Pill Pattern */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-primary-600/5 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-semibold tracking-wider text-slate-500">
                Current Balance
              </span>
              <button
                onClick={() => setShowBalance((prev) => !prev)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded"
                title={showBalance ? 'Hide Balance' : 'Show Balance'}
              >
                {showBalance ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Currency Selector */}
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="h-8 px-2.5 bg-neutral-0 border border-neutral-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>

          {/* Amount Display */}
          <div>
            <div className="text-3xl sm:text-4xl font-bold font-sans text-slate-900 tabular-nums tracking-tight">
              {showBalance ? formattedBalance : '••••••••••••'}
            </div>
          </div>
        </div>

        {/* Hero Footer Actions */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-neutral-200/80 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-medium text-neutral-600">
              Account No:
            </span>
            <span className="text-sm sm:text-base font-mono font-bold text-slate-800 tracking-wide">
              {accountNumber}
            </span>
            <button
              onClick={handleCopyAccount}
              className="p-1.5 text-neutral-400 hover:text-neutral-600 transition-colors"
              title="Copy Account Number"
            >
              {copied ? (
                <Check className="w-4 h-4 text-success-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          <Button variant="secondary" size="sm" onClick={onViewDetails}>
            View Details
          </Button>
        </div>
      </HeroCard>

      {/* Transfer & Withdraw Action Cards - 5 Columns on Large Screens */}
      <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
        {/* Transfer Action Card */}
        <Card
          hoverable
          onClick={onTransferClick}
          className="flex items-center justify-between group cursor-pointer border-l-4 border-l-primary-600 p-5 sm:p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <ArrowLeftRight className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-neutral-800 group-hover:text-primary-600 transition-colors">
              Transfer Funds
            </h3>
          </div>
          <ChevronRight className="w-6 h-6 text-neutral-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
        </Card>

        {/* Withdraw Action Card */}
        <Card
          hoverable
          onClick={onWithdrawClick}
          className="flex items-center justify-between group cursor-pointer border-l-4 border-l-slate-600 p-5 sm:p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Banknote className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-neutral-800 group-hover:text-slate-700 transition-colors">
              Withdraw Cash
            </h3>
          </div>
          <ChevronRight className="w-6 h-6 text-neutral-400 group-hover:text-slate-700 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
        </Card>
      </div>
    </div>
  );
};
