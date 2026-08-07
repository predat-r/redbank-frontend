import { useState } from 'react';
import {
  Eye,
  EyeOff,
  Copy,
  Check,
  ArrowLeftRight,
  Banknote,
  ChevronRight,
  Lock,
} from 'lucide-react';
import { HeroCard, Card, Button, Skeleton } from '../../../components/ui';

export const BalanceHeroSection = ({
  balance = 42850.75,
  currency = 'USD',
  accountNumber = 'RB-8492048192',
  accountStatus = 'ACTIVE',
  isLoading = false,
  onViewDetails,
  onTransferClick,
  onWithdrawClick,
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState(currency);
  const [showBalance, setShowBalance] = useState(true);
  const [copied, setCopied] = useState(false);

  const isFrozen = accountStatus === 'FROZEN';

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
            {isLoading ? (
              <Skeleton className="h-10 w-44 rounded-lg my-1" />
            ) : (
              <div className="text-3xl sm:text-4xl font-bold font-sans text-slate-900 tabular-nums tracking-tight">
                {showBalance ? formattedBalance : '••••••••••••'}
              </div>
            )}
          </div>
        </div>

        {/* Hero Footer Actions */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-neutral-200/80 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-medium text-neutral-600">
              Account No:
            </span>
            {isLoading ? (
              <Skeleton className="h-5 w-36 rounded my-0.5" />
            ) : (
              <>
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
              </>
            )}
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
          hoverable={!isFrozen}
          onClick={isFrozen ? undefined : onTransferClick}
          className={`flex items-center justify-between group p-5 sm:p-6 border-l-4 ${
            isFrozen
              ? 'opacity-60 cursor-not-allowed border-l-amber-400 bg-neutral-50/80 select-none'
              : 'cursor-pointer border-l-primary-600'
          }`}
          title={
            isFrozen
              ? 'Account is frozen - Outgoing operations disabled'
              : 'Transfer Funds'
          }
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                isFrozen
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-primary-50 text-primary-600 group-hover:scale-105'
              }`}
            >
              <ArrowLeftRight className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  className={`text-lg sm:text-xl font-bold transition-colors ${
                    isFrozen
                      ? 'text-neutral-500'
                      : 'text-neutral-800 group-hover:text-primary-600'
                  }`}
                >
                  Transfer Funds
                </h3>
                {isFrozen && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                    Locked
                  </span>
                )}
              </div>
              {isFrozen && (
                <p className="text-xs text-amber-700 mt-0.5">
                  Account is currently frozen
                </p>
              )}
            </div>
          </div>
          {isFrozen ? (
            <Lock className="w-5 h-5 text-amber-600 shrink-0 ml-2" />
          ) : (
            <ChevronRight className="w-6 h-6 text-neutral-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
          )}
        </Card>

        {/* Withdraw Action Card */}
        <Card
          hoverable={!isFrozen}
          onClick={isFrozen ? undefined : onWithdrawClick}
          className={`flex items-center justify-between group p-5 sm:p-6 border-l-4 ${
            isFrozen
              ? 'opacity-60 cursor-not-allowed border-l-amber-400 bg-neutral-50/80 select-none'
              : 'cursor-pointer border-l-slate-600'
          }`}
          title={
            isFrozen
              ? 'Account is frozen - Outgoing operations disabled'
              : 'Withdraw Cash'
          }
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                isFrozen
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-slate-50 text-slate-600 group-hover:scale-105'
              }`}
            >
              <Banknote className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  className={`text-lg sm:text-xl font-bold transition-colors ${
                    isFrozen
                      ? 'text-neutral-500'
                      : 'text-neutral-800 group-hover:text-slate-700'
                  }`}
                >
                  Withdraw Cash
                </h3>
                {isFrozen && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                    Locked
                  </span>
                )}
              </div>
              {isFrozen && (
                <p className="text-xs text-amber-700 mt-0.5">
                  Account is currently frozen
                </p>
              )}
            </div>
          </div>
          {isFrozen ? (
            <Lock className="w-5 h-5 text-amber-600 shrink-0 ml-2" />
          ) : (
            <ChevronRight className="w-6 h-6 text-neutral-400 group-hover:text-slate-700 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
          )}
        </Card>
      </div>
    </div>
  );
};
