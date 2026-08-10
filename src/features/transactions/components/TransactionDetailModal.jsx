import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, StatusBadge, Button } from '../../../components/ui';
import { useMyTransactionById } from '../transactions.queries';
import { useMyAccount } from '../../account/account.queries';
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
  User,
  Clock,
  Tag,
  Loader2,
} from 'lucide-react';

export const TransactionDetailModal = ({ transaction, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = React.useState(false);

  // Fetch logged in user account to distinguish incoming vs outgoing transfer
  const { data: myAccount } = useMyAccount();
  const myAccountNumber = myAccount?.accountNumber;

  // Fetch full transaction details using endpoint GET /api/accounts/me/transactions/{id}
  const transactionId = isOpen ? transaction?.id : null;
  const { data: detailedTxn, isLoading } = useMyTransactionById(transactionId);

  // Fallback to initial prop if detailed query is still fetching
  const item = detailedTxn || transaction;

  if (!isOpen || !transaction) return null;

  const isDeposit = item?.type === 'DEPOSIT';
  const isTransfer = item?.type === 'TRANSFER';
  const isWithdrawal = item?.type === 'WITHDRAWAL';

  const isIncomingTransfer =
    isTransfer &&
    Boolean(myAccountNumber) &&
    item?.destinationAccountNumber === myAccountNumber;
  const isCredit = isDeposit || isIncomingTransfer;

  const handleCopyRef = () => {
    const ref = item?.transactionReference || item?.id || '';
    if (ref) {
      navigator.clipboard.writeText(String(ref));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRepeatTransaction = () => {
    onClose();
    if (isTransfer) {
      const destAcc = isIncomingTransfer
        ? item?.sourceAccountNumber
        : item?.destinationAccountNumber;
      navigate('/transfer', {
        state: {
          destinationAccountNumber: destAcc || '',
          amount: item?.amount,
        },
      });
    } else if (isWithdrawal) {
      navigate('/withdraw', {
        state: {
          amount: item?.amount,
        },
      });
    }
  };

  // Aesthetic configuration based on transaction type and credit status
  const getTypeTheme = () => {
    if (isCredit) {
      return {
        label: isDeposit ? 'Deposit' : 'Transfer Received',
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

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transaction Receipt"
      subtitle="Digital ledger transaction record"
      maxWidth="max-w-md"
    >
      <div className="space-y-6 pt-2">
        {/* Top Header Highlight Hero */}
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
                {item?.amount?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </span>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              {theme.label}
            </p>
          </div>

          {/* Status Badge & Inline Fetching Indicator */}
          <div className="mt-3 flex items-center gap-2">
            <StatusBadge status={item?.status} />
            {isLoading && (
              <span className="text-xs text-neutral-400 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
              </span>
            )}
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
                {item?.transactionReference || item?.id || 'N/A'}
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

          {/* Transfer Flow: Sender Account & Holder */}
          {isTransfer && (item?.sourceAccountNumber || item?.sourceAccountHolderName) && (
            <div className="flex items-start justify-between py-1 border-b border-neutral-200/60 text-xs sm:text-sm">
              <span className="text-neutral-500 font-medium flex items-center gap-2 shrink-0">
                <User className="w-4 h-4 text-neutral-400" />
                <span>Sender Account</span>
              </span>
              <div className="text-right">
                {item?.sourceAccountHolderName && (
                  <span className="block font-semibold text-neutral-900">
                    {item.sourceAccountHolderName}
                  </span>
                )}
                {item?.sourceAccountNumber && (
                  <span className="font-mono text-xs text-neutral-500 font-medium">
                    {item.sourceAccountNumber}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Destination / Recipient Account & Holder (For Transfer & Deposit) */}
          {(isTransfer || isDeposit) &&
            (item?.destinationAccountNumber || item?.destinationAccountHolderName) && (
              <div className="flex items-start justify-between py-1 border-b border-neutral-200/60 text-xs sm:text-sm">
                <span className="text-neutral-500 font-medium flex items-center gap-2 shrink-0">
                  <Building className="w-4 h-4 text-neutral-400" />
                  <span>Destination Account</span>
                </span>
                <div className="text-right">
                  {item?.destinationAccountHolderName && (
                    <span className="block font-semibold text-neutral-900">
                      {item.destinationAccountHolderName}
                    </span>
                  )}
                  {item?.destinationAccountNumber && (
                    <span className="font-mono text-xs text-neutral-500 font-medium">
                      {item.destinationAccountNumber}
                    </span>
                  )}
                </div>
              </div>
            )}

          {/* Withdrawal Account & Holder */}
          {isWithdrawal &&
            (item?.sourceAccountNumber || item?.sourceAccountHolderName) && (
              <div className="flex items-start justify-between py-1 border-b border-neutral-200/60 text-xs sm:text-sm">
                <span className="text-neutral-500 font-medium flex items-center gap-2 shrink-0">
                  <Building className="w-4 h-4 text-neutral-400" />
                  <span>Account</span>
                </span>
                <div className="text-right">
                  {item?.sourceAccountHolderName && (
                    <span className="block font-semibold text-neutral-900">
                      {item.sourceAccountHolderName}
                    </span>
                  )}
                  {item?.sourceAccountNumber && (
                    <span className="font-mono text-xs text-neutral-500 font-medium">
                      {item.sourceAccountNumber}
                    </span>
                  )}
                </div>
              </div>
            )}

          {/* Created At Date & Time Row */}
          <div className="flex items-center justify-between py-1 border-b border-neutral-200/60 text-xs sm:text-sm">
            <span className="text-neutral-500 font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-neutral-400" />
              <span>Created At</span>
            </span>
            <span className="font-semibold text-neutral-700 font-mono text-xs">
              {formatDate(item?.createdAt)}
            </span>
          </div>

          {/* Completed At Date & Time Row (If available) */}
          {item?.completedAt && (
            <div className="flex items-center justify-between py-1 border-b border-neutral-200/60 text-xs sm:text-sm">
              <span className="text-neutral-500 font-medium flex items-center gap-2">
                <Clock className="w-4 h-4 text-neutral-400" />
                <span>Completed At</span>
              </span>
              <span className="font-semibold text-neutral-700 font-mono text-xs">
                {formatDate(item.completedAt)}
              </span>
            </div>
          )}

          {/* Category Row */}
          {item?.category && (
            <div className="flex items-center justify-between py-1 border-b border-neutral-200/60 text-xs sm:text-sm">
              <span className="text-neutral-500 font-medium flex items-center gap-2">
                <Tag className="w-4 h-4 text-neutral-400" />
                <span>Category</span>
              </span>
              <span className="font-semibold text-neutral-800 bg-neutral-100 px-2.5 py-0.5 rounded text-xs">
                {item.category}
              </span>
            </div>
          )}

          {/* Description / Memo Row */}
          {item?.description && (
            <div className="flex items-start justify-between py-1 text-xs sm:text-sm">
              <span className="text-neutral-500 font-medium flex items-center gap-2 shrink-0">
                <FileText className="w-4 h-4 text-neutral-400" />
                <span>Memo / Note</span>
              </span>
              <span className="font-medium text-neutral-800 text-right max-w-[210px] break-words">
                {item.description}
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
              {isIncomingTransfer
                ? 'Send Back'
                : isTransfer
                  ? 'Repeat Transfer'
                  : 'Repeat Withdrawal'}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default TransactionDetailModal;
