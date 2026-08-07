import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, StatusBadge, Button } from '../../../components/ui';
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Check,
  Copy,
  RotateCcw,
  Receipt,
  Calendar,
  Building,
  FileText,
} from 'lucide-react';

export const TransactionDetailModal = ({ transaction, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = React.useState(false);

  if (!transaction) return null;

  const isCredit = transaction.type === 'DEPOSIT';
  const isTransfer = transaction.type === 'TRANSFER';
  const isWithdrawal = transaction.type === 'WITHDRAWAL';

  const handleCopyRef = () => {
    const ref = transaction.transactionReference || transaction.id || '';
    if (ref) {
      navigator.clipboard.writeText(String(ref));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRepeatTransaction = () => {
    onClose();
    if (isTransfer) {
      navigate('/transfer', {
        state: {
          destinationAccountNumber: transaction.destinationAccountNumber || '',
          amount: transaction.amount,
        },
      });
    } else if (isWithdrawal) {
      navigate('/withdraw', {
        state: {
          amount: transaction.amount,
        },
      });
    }
  };

  // Aesthetic configuration based on transaction type
  const getTypeTheme = () => {
    if (isCredit) {
      return {
        label: 'Deposit',
        badgeBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200/80',
        amountColor: 'text-emerald-600',
        icon: <ArrowDownLeft className="w-6 h-6 text-emerald-600" />,
      };
    }
    if (isWithdrawal) {
      return {
        label: 'Cash Withdrawal',
        badgeBg: 'bg-amber-50 text-amber-600 border border-amber-200/80',
        amountColor: 'text-neutral-900',
        icon: <ArrowUpRight className="w-6 h-6 text-amber-600" />,
      };
    }
    return {
      label: 'Fund Transfer',
      badgeBg: 'bg-primary-50 text-primary-600 border border-primary-200/80',
      amountColor: 'text-neutral-900',
      icon: <ArrowLeftRight className="w-6 h-6 text-primary-600" />,
    };
  };

  const theme = getTypeTheme();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transaction Receipt"
      subtitle="Digital ledger transaction record"
      maxWidth="max-w-md"
    >
      <div className="space-y-6 pt-2">
        {/* Top Header Highlight Hero (Light & Classy) */}
        <div className="flex flex-col items-center justify-center text-center pb-2">
          {/* Centered Circular Icon Badge */}
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xs mb-3 ${theme.badgeBg}`}
          >
            {theme.icon}
          </div>

          {/* Amount Display */}
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums block text-neutral-900">
              <span className={theme.amountColor}>
                {isCredit ? '+' : '-'}$
                {transaction.amount?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </span>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              {theme.label}
            </p>
          </div>

          {/* Status Badge */}
          <div className="mt-3">
            <StatusBadge status={transaction.status} />
          </div>
        </div>

        {/* Receipt Voucher Breakdown Card */}
        <div className="bg-neutral-50/80 border border-neutral-200/90 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
          {/* Reference Code Row */}
          <div className="flex items-center justify-between py-1 border-b border-neutral-200/60 text-xs sm:text-sm">
            <span className="text-neutral-500 font-medium flex items-center gap-2">
              <Receipt className="w-4 h-4 text-neutral-400" />
              <span>Reference Code</span>
            </span>
            <div className="flex items-center gap-1.5 bg-neutral-0 px-2.5 py-1 rounded-lg border border-neutral-200 shadow-2xs">
              <span className="font-mono font-bold text-neutral-800 text-xs sm:text-sm">
                {transaction.transactionReference || transaction.id || 'N/A'}
              </span>
              <button
                type="button"
                onClick={handleCopyRef}
                className="p-1 rounded text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-all focus:outline-none"
                title="Copy Reference Code"
              >
                {copied ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Account Detail Row */}
          {(transaction.destinationAccountNumber || transaction.sourceAccountNumber) && (
            <div className="flex items-center justify-between py-1 border-b border-neutral-200/60 text-xs sm:text-sm">
              <span className="text-neutral-500 font-medium flex items-center gap-2">
                <Building className="w-4 h-4 text-neutral-400" />
                <span>
                  {isTransfer || isCredit ? 'Destination Account' : 'Account Number'}
                </span>
              </span>
              <span className="font-mono font-semibold text-neutral-800">
                {transaction.destinationAccountNumber || transaction.sourceAccountNumber}
              </span>
            </div>
          )}

          {/* Date & Time Row */}
          <div className="flex items-center justify-between py-1 border-b border-neutral-200/60 text-xs sm:text-sm">
            <span className="text-neutral-500 font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-neutral-400" />
              <span>Date & Time</span>
            </span>
            <span className="font-semibold text-neutral-700 font-mono text-xs">
              {transaction.createdAt
                ? new Date(transaction.createdAt).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })
                : new Date().toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
            </span>
          </div>

          {/* Description / Memo Row */}
          {transaction.description && (
            <div className="flex items-start justify-between py-1 text-xs sm:text-sm">
              <span className="text-neutral-500 font-medium flex items-center gap-2 shrink-0">
                <FileText className="w-4 h-4 text-neutral-400" />
                <span>Memo / Note</span>
              </span>
              <span className="font-medium text-neutral-800 text-right max-w-[210px] break-words">
                {transaction.description}
              </span>
            </div>
          )}
        </div>

        {/* Footer Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="px-5">
            Close
          </Button>

          {(isTransfer || isWithdrawal) && (
            <Button
              variant="primary"
              icon={RotateCcw}
              onClick={handleRepeatTransaction}
              className="shadow-xs"
            >
              {isTransfer ? 'Repeat Transfer' : 'Repeat Withdrawal'}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default TransactionDetailModal;
