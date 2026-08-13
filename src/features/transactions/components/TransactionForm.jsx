import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeftRight, Banknote } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Stepper } from '../../../components/ui/Stepper';
import { SegmentedControl } from '../../../components/ui/SegmentedControl';
import { useToast } from '../../../hooks/useToast';
import {
  useCreateTransfer,
  useCreateWithdrawal,
  useMyTransactionById,
  useMyTransactions,
  transactionKeys,
} from '../transactions.queries';
import { useMyAccount, useLatestBalance } from '../../account/account.queries';
import { TransactionInitiateStep } from './TransactionInitiateStep';
import { TransactionVerifyStep } from './TransactionVerifyStep';
import { TransactionReceiptStep } from './TransactionReceiptStep';
import { TransactionLimitsCard } from './TransactionLimitsCard';

export const TransactionForm = ({ initialMode = 'transfer' }) => {
  const location = useLocation();
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const transferMutation = useCreateTransfer();
  const withdrawalMutation = useCreateWithdrawal();

  const { data: realAccount } = useMyAccount();
  const { data: realBalance } = useLatestBalance();

  const currentBalance = realBalance?.runningBalance || 0;
  const currency = realAccount?.currency || 'USD';

  const [mode, setMode] = useState(initialMode);
  const [currentStep, setCurrentStep] = useState(0);

  const [destinationAccountNumber, setDestinationAccountNumber] = useState(
    location?.state?.destinationAccountNumber || ''
  );
  const [amount, setAmount] = useState(
    location?.state?.amount ? String(location.state.amount) : ''
  );
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('OTHER');
  const [withdrawalMethod, setWithdrawalMethod] = useState('ATM_CODE');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);

  // Result / Receipt State
  const [receiptData, setReceiptData] = useState(null);

  const steps = [
    { title: '1. Initiate' },
    { title: '2. Verify' },
    { title: '3. Status & Receipt' },
  ];

  // Polling for status updates when transaction is PENDING (Max 3 attempts)
  const [pollCount, setPollCount] = useState(0);

  const isReceiptPending =
    currentStep === 2 &&
    (receiptData?.status === 'PENDING' ||
      receiptData?.status === 'IN_REVIEW' ||
      receiptData?.status === 'PROCESSING');

  const pendingTxId = isReceiptPending ? receiptData?.id : null;

  const { data: polledTx, refetch: refetchPolledTx } = useMyTransactionById(pendingTxId, {
    refetchInterval: (query) => {
      const st = query.state.data?.status;
      const isPendingState =
        st === 'PENDING' || st === 'IN_REVIEW' || st === 'PROCESSING' || !st;

      if (isPendingState && pollCount < 3) {
        setPollCount((prev) => prev + 1);
        return 2000;
      }
      return false;
    },
    enabled: Boolean(pendingTxId),
  });

  const pendingTxRef =
    isReceiptPending && !receiptData?.id ? receiptData?.reference : null;

  const { data: recentTxs, refetch: refetchRecentTxs } = useMyTransactions(
    { page: 0, size: 5 },
    {
      refetchInterval: (query) => {
        const matchingTx = query.state.data?.content?.find(
          (t) =>
            t.transactionReference === pendingTxRef ||
            t.reference === pendingTxRef ||
            t.id === pendingTxRef
        );
        const st = matchingTx?.status;
        const isPendingState =
          st === 'PENDING' || st === 'IN_REVIEW' || st === 'PROCESSING' || !st;

        if (isPendingState && pollCount < 3) {
          setPollCount((prev) => prev + 1);
          return 2000;
        }
        return false;
      },
      enabled: Boolean(pendingTxRef),
    }
  );

  useEffect(() => {
    if (currentStep !== 2 || !receiptData) return;

    let updatedTx = null;

    if (polledTx) {
      updatedTx = polledTx;
    } else if (recentTxs?.content && receiptData?.reference) {
      updatedTx = recentTxs.content.find(
        (t) =>
          t.transactionReference === receiptData.reference ||
          t.reference === receiptData.reference ||
          t.id === receiptData.id
      );
    }

    if (updatedTx && updatedTx.status && updatedTx.status !== receiptData.status) {
      const newStatus = updatedTx.status;
      const txId = updatedTx.id;
      const txDesc = updatedTx.description;

      queueMicrotask(() => {
        setReceiptData((prev) =>
          prev
            ? {
                ...prev,
                id: txId || prev.id,
                status: newStatus,
                description: txDesc || prev.description,
              }
            : prev
        );

        queryClient.invalidateQueries({ queryKey: transactionKeys.all });
        queryClient.invalidateQueries({ queryKey: ['account'] });

        if (newStatus === 'COMPLETED' || newStatus === 'APPROVED') {
          addToast({
            type: 'success',
            title: 'Transaction Settled',
            message:
              'Security anomaly review complete. Your transaction is now COMPLETED.',
          });
        } else if (
          newStatus === 'REJECTED' ||
          newStatus === 'FAILED' ||
          newStatus === 'DECLINED'
        ) {
          addToast({
            type: 'error',
            title: 'Transaction Flagged',
            message: 'Security review flagged this transaction as REJECTED.',
          });
        }
      });
    }
  }, [polledTx, recentTxs, currentStep, receiptData, queryClient, addToast]);

  const handleManualRefreshStatus = () => {
    setPollCount(0);
    if (pendingTxId) {
      refetchPolledTx();
    }
    if (pendingTxRef) {
      refetchRecentTxs();
    }
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setCurrentStep(0);
    setErrors({});
    setServerError(null);
  };

  const validateStep1 = () => {
    const errs = {};
    const numAmount = parseFloat(amount);
    const formattedBalance = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(currentBalance);

    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      errs.amount = 'Please enter a valid amount greater than 0';
    } else if (numAmount < 0.01) {
      errs.amount = 'Minimum transaction amount is $0.01';
    } else if (numAmount > currentBalance) {
      errs.amount = `Amount exceeds your current available balance of ${formattedBalance}`;
    } else if (numAmount > 500000) {
      errs.amount = 'Maximum transaction limit is $500,000';
    }

    if (mode === 'transfer') {
      if (!destinationAccountNumber.trim()) {
        errs.destinationAccountNumber = 'Destination account number is required';
      } else if (destinationAccountNumber.trim().length < 5) {
        errs.destinationAccountNumber = 'Please enter a valid account number';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceedToVerify = (e) => {
    e.preventDefault();
    setServerError(null);
    if (validateStep1()) {
      setCurrentStep(1);
    }
  };

  const handleConfirmSubmit = async () => {
    setServerError(null);
    setPollCount(0);
    try {
      let result;
      const numAmount = parseFloat(amount);

      if (mode === 'transfer') {
        result = await transferMutation.mutateAsync({
          destinationAccountNumber: destinationAccountNumber.trim(),
          amount: numAmount,
          category: category || 'OTHER',
          description: description.trim() || 'Fund Transfer',
        });
      } else {
        result = await withdrawalMutation.mutateAsync({
          amount: numAmount,
          category: category || 'OTHER',
          description: description.trim() || `Cash Withdrawal via ${withdrawalMethod}`,
        });
      }

      const txRef =
        result?.transactionReference ||
        result?.id ||
        `TXN-${Date.now().toString(36).toUpperCase()}`;

      setReceiptData({
        id: result?.id,
        reference: txRef,
        amount: result?.amount || numAmount,
        category: result?.category || category || 'OTHER',
        type: result?.type || (mode === 'transfer' ? 'TRANSFER' : 'WITHDRAWAL'),
        destination:
          mode === 'transfer'
            ? result?.destinationAccountNumber || destinationAccountNumber
            : withdrawalMethod,
        date: result?.createdAt
          ? new Date(result.createdAt).toLocaleString()
          : new Date().toLocaleString(),
        status: result?.status || 'PENDING',
        description:
          result?.description ||
          description ||
          (mode === 'transfer' ? 'Transfer to account' : 'Cash withdrawal'),
      });

      const isPending = result?.status === 'PENDING';

      setCurrentStep(2);
      addToast({
        type: isPending ? 'info' : 'success',
        title: isPending
          ? 'Transaction Submitted for Review'
          : mode === 'transfer'
            ? 'Transfer Successful'
            : 'Withdrawal Processed',
        message: isPending
          ? 'Your transaction is undergoing security review and will settle shortly.'
          : `${mode === 'transfer' ? 'Transferred' : 'Withdrawn'} $${numAmount.toLocaleString()} successfully.`,
      });
    } catch (err) {
      const errorMessage =
        err?.message ||
        err?.details?.message ||
        err?.details?.error ||
        'An error occurred while processing your request.';

      setServerError(errorMessage);

      addToast({
        type: 'error',
        title: 'Transaction Failed',
        message: errorMessage,
      });
    }
  };

  const handleReset = () => {
    setDestinationAccountNumber('');
    setAmount('');
    setCategory('OTHER');
    setDescription('');
    setErrors({});
    setServerError(null);
    setReceiptData(null);
    setPollCount(0);
    setCurrentStep(0);
  };

  const isSubmitting = transferMutation.isPending || withdrawalMutation.isPending;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Navigation Segmented Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-neutral-0 p-4 sm:p-5 rounded-xl border border-neutral-200 shadow-sm">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-neutral-800 tracking-tight">
            {mode === 'transfer' ? 'Fund Transfer' : 'Cash Withdrawal'}
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            {mode === 'transfer'
              ? 'Transfer funds to any registered RedBank account instantly'
              : 'Withdraw cash directly from your RedBank account'}
          </p>
        </div>

        <div className="w-full sm:w-auto">
          <SegmentedControl
            options={[
              { label: 'Fund Transfer', value: 'transfer', icon: ArrowLeftRight },
              { label: 'Cash Withdrawal', value: 'withdrawal', icon: Banknote },
            ]}
            value={mode}
            onChange={handleModeChange}
          />
        </div>
      </div>

      {/* 3-Step Stepper Progress Bar */}
      <Card className="p-4 sm:p-6">
        <Stepper steps={steps} currentStep={currentStep} />
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Main Step Form / Content View (7 Columns on XL screens 1280px+) */}
        <div className="xl:col-span-7">
          {currentStep === 0 && (
            <TransactionInitiateStep
              mode={mode}
              destinationAccountNumber={destinationAccountNumber}
              setDestinationAccountNumber={setDestinationAccountNumber}
              amount={amount}
              setAmount={setAmount}
              category={category}
              setCategory={setCategory}
              description={description}
              setDescription={setDescription}
              withdrawalMethod={withdrawalMethod}
              setWithdrawalMethod={setWithdrawalMethod}
              errors={errors}
              onSubmit={handleProceedToVerify}
              currentBalance={currentBalance}
              currency={currency}
            />
          )}

          {currentStep === 1 && (
            <TransactionVerifyStep
              mode={mode}
              destinationAccountNumber={destinationAccountNumber}
              withdrawalMethod={withdrawalMethod}
              amount={amount}
              category={category}
              description={description}
              loading={isSubmitting}
              error={serverError}
              onBack={() => {
                setServerError(null);
                setCurrentStep(0);
              }}
              onConfirm={handleConfirmSubmit}
            />
          )}

          {currentStep === 2 && (
            <TransactionReceiptStep
              mode={mode}
              receiptData={receiptData}
              onReset={handleReset}
              onRefreshStatus={handleManualRefreshStatus}
              isMaxPollReached={pollCount >= 3}
              pollAttempt={Math.min(pollCount + 1, 3)}
            />
          )}
        </div>

        {/* Recent Activity Side Rail (5 Columns on XL screens 1280px+ / bottom on smaller viewports) */}
        <div className="xl:col-span-5">
          <TransactionLimitsCard />
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;
