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
import { HeroCard, Card, Skeleton } from '../../../components/ui';

export const BalanceHeroSection = ({
  balance = 0,
  currency = 'USD',
  accountNumber = '',
  accountStatus = 'ACTIVE',
  isLoading = false,
  onTransferClick,
  onWithdrawClick,
}) => {
  const [showBalance, setShowBalance] = useState(true);
  const [copied, setCopied] = useState(false);

  const isFrozen = accountStatus === 'FROZEN';

  const formattedBalance = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(balance);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
      {/* Current Balance Hero Card - 7 Columns on Large Screens */}
      <HeroCard className="lg:col-span-7 flex flex-col justify-between relative overflow-hidden p-5 sm:p-6 lg:p-7">
        {/* Subtle Decorative Background Pill Pattern */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-primary-600/5 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-4 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-semibold tracking-wider text-neutral-500 dark:text-neutral-400">
                Current Balance
              </span>
              <button
                onClick={() => setShowBalance((prev) => !prev)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors p-1 rounded"
                title={showBalance ? 'Hide Balance' : 'Show Balance'}
              >
                {showBalance ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Amount Display */}
          <div>
            {isLoading ? (
              <Skeleton className="h-10 w-44 rounded-lg my-1" />
            ) : (
              <div className="text-3xl sm:text-4xl font-bold font-sans text-neutral-900 dark:text-white tabular-nums tracking-tight">
                {showBalance ? formattedBalance : '••••••••••••'}
              </div>
            )}
          </div>
        </div>

        {/* Hero Footer Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-5 mt-6 border-t border-neutral-200/80 dark:border-neutral-700/60 relative z-10">
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Account No:
            </span>
            {isLoading ? (
              <Skeleton className="h-5 w-36 rounded my-0.5" />
            ) : (
              <>
                <span className="text-sm sm:text-base font-mono font-bold text-neutral-900 dark:text-white tracking-wide">
                  {accountNumber}
                </span>
                <button
                  onClick={handleCopyAccount}
                  className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
                  title="Copy Account Number"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-success-600 dark:text-success-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </>
            )}
          </div>
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
              ? 'opacity-60 cursor-not-allowed border-l-amber-400 bg-neutral-50/80 dark:bg-neutral-800/60 select-none'
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
                  ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400'
                  : 'bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 group-hover:scale-105'
              }`}
            >
              <ArrowLeftRight className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  className={`text-lg sm:text-xl font-bold transition-colors ${
                    isFrozen
                      ? 'text-neutral-500 dark:text-neutral-400'
                      : 'text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400'
                  }`}
                >
                  Transfer Funds
                </h3>
                {isFrozen && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                    Locked
                  </span>
                )}
              </div>
              {isFrozen && (
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                  Account is currently frozen
                </p>
              )}
            </div>
          </div>
          {isFrozen ? (
            <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 ml-2" />
          ) : (
            <ChevronRight className="w-6 h-6 text-neutral-400 dark:text-neutral-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
          )}
        </Card>

        {/* Withdraw Action Card */}
        <Card
          hoverable={!isFrozen}
          onClick={isFrozen ? undefined : onWithdrawClick}
          className={`flex items-center justify-between group p-5 sm:p-6 border-l-4 ${
            isFrozen
              ? 'opacity-60 cursor-not-allowed border-l-amber-400 bg-neutral-50/80 dark:bg-neutral-800/60 select-none'
              : 'cursor-pointer border-l-slate-600 dark:border-l-slate-400'
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
                  ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400'
                  : 'bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-200 group-hover:scale-105'
              }`}
            >
              <Banknote className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  className={`text-lg sm:text-xl font-bold transition-colors ${
                    isFrozen
                      ? 'text-neutral-500 dark:text-neutral-400'
                      : 'text-neutral-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-neutral-200'
                  }`}
                >
                  Withdraw Cash
                </h3>
                {isFrozen && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                    Locked
                  </span>
                )}
              </div>
              {isFrozen && (
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                  Account is currently frozen
                </p>
              )}
            </div>
          </div>
          {isFrozen ? (
            <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 ml-2" />
          ) : (
            <ChevronRight className="w-6 h-6 text-neutral-400 dark:text-neutral-500 group-hover:text-slate-700 dark:group-hover:text-neutral-200 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
          )}
        </Card>
      </div>
    </div>
  );
};
