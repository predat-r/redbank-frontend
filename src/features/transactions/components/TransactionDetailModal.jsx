import React from 'react';
import { Modal, StatusBadge, Button } from '../../../components/ui';
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight, Check, Copy } from 'lucide-react';

export const TransactionDetailModal = ({ transaction, isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!transaction) return null;

  const isCredit = transaction.type === 'DEPOSIT';

  const handleCopyRef = () => {
    navigator.clipboard.writeText(transaction.transactionReference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transaction Details"
      subtitle={`Reference: ${transaction.transactionReference}`}
      maxWidth="max-w-md"
    >
      <div className="space-y-6">
        {/* Amount & Status Header */}
        <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isCredit ? 'bg-success-50 text-success-600' : 'bg-slate-50 text-slate-600'
              }`}
            >
              {transaction.type === 'DEPOSIT' ? (
                <ArrowDownLeft className="w-5 h-5" />
              ) : transaction.type === 'WITHDRAWAL' ? (
                <ArrowUpRight className="w-5 h-5" />
              ) : (
                <ArrowLeftRight className="w-5 h-5" />
              )}
            </div>
            <div>
              <div
                className={`text-xl font-bold tabular-nums ${
                  isCredit ? 'text-success-600' : 'text-neutral-800'
                }`}
              >
                {isCredit ? '+' : '-'}${transaction.amount.toFixed(2)}
              </div>
              <p className="text-xs text-neutral-500 font-mono">
                {new Date(transaction.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <StatusBadge status={transaction.status} />
        </div>

        {/* Detailed Breakdown List */}
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="flex justify-between items-center py-2 border-b border-neutral-100">
            <span className="text-neutral-500 font-medium">Transaction Type</span>
            <span className="font-semibold text-neutral-800 uppercase tracking-wider text-xs">
              {transaction.type}
            </span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-neutral-100">
            <span className="text-neutral-500 font-medium">Reference Code</span>
            <div className="flex items-center gap-1.5 font-mono text-neutral-800 font-semibold">
              <span>{transaction.transactionReference}</span>
              <button
                onClick={handleCopyRef}
                className="p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
                title="Copy Reference"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-success-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-start py-2 border-b border-neutral-100">
            <span className="text-neutral-500 font-medium">Description</span>
            <span className="font-medium text-neutral-800 text-right max-w-[200px] truncate">
              {transaction.description}
            </span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-neutral-100">
            <span className="text-neutral-500 font-medium">Processing Fee</span>
            <span className="font-semibold text-success-600">$0.00 (Free)</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Button variant="primary" fullWidth onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};
