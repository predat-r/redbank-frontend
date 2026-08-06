import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftRight,
  Banknote,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  Receipt,
  Info,
  Building2,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Card } from '../../../components/ui/Card';
import { Stepper } from '../../../components/ui/Stepper';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { SegmentedControl } from '../../../components/ui/SegmentedControl';
import { useToast } from '../../../hooks/useToast';
import { createTransfer, createWithdrawal } from '../../../api/transactions';

export const TransactionForm = ({ initialMode = 'transfer' }) => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [mode, setMode] = useState(initialMode); // 'transfer' | 'withdrawal'
  const [currentStep, setCurrentStep] = useState(0); // 0: Initiate, 1: Verify, 2: Receipt
  const [loading, setLoading] = useState(false);

  // Form State
  const [destinationAccountNumber, setDestinationAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [withdrawalMethod, setWithdrawalMethod] = useState('ATM_CODE');
  const [errors, setErrors] = useState({});

  // Result / Receipt State
  const [receiptData, setReceiptData] = useState(null);

  const steps = [
    { title: '1. Initiate' },
    { title: '2. Verify' },
    { title: '3. Status & Receipt' },
  ];

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setCurrentStep(0);
    setErrors({});
  };

  const validateStep1 = () => {
    const errs = {};
    const numAmount = parseFloat(amount);

    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      errs.amount = 'Please enter a valid amount greater than 0';
    } else if (numAmount < 100) {
      errs.amount = 'Minimum transaction amount is 100 PKR';
    } else if (numAmount > 500000) {
      errs.amount = 'Maximum transaction limit is 500,000 PKR';
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
    if (validateStep1()) {
      setCurrentStep(1);
    }
  };

  const handleConfirmSubmit = async () => {
    setLoading(true);
    try {
      let result;
      const numAmount = parseFloat(amount);

      if (mode === 'transfer') {
        result = await createTransfer({
          destinationAccountNumber: destinationAccountNumber.trim(),
          amount: numAmount,
          description: description.trim() || 'Fund Transfer',
        });
      } else {
        result = await createWithdrawal({
          amount: numAmount,
          description: description.trim() || `Cash Withdrawal via ${withdrawalMethod}`,
        });
      }

      const txRef =
        result?.transactionReference ||
        `TXN-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

      setReceiptData({
        reference: txRef,
        amount: numAmount,
        type: mode === 'transfer' ? 'TRANSFER' : 'WITHDRAWAL',
        destination: mode === 'transfer' ? destinationAccountNumber : withdrawalMethod,
        date: new Date().toLocaleString(),
        status: 'COMPLETED',
        description:
          description ||
          (mode === 'transfer' ? 'Transfer to account' : 'Cash withdrawal'),
      });

      setCurrentStep(2);
      addToast({
        type: 'success',
        title: mode === 'transfer' ? 'Transfer Successful' : 'Withdrawal Processed',
        message: `${mode === 'transfer' ? 'Transferred' : 'Withdrawn'} PKR ${numAmount.toLocaleString()} successfully.`,
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Transaction Failed',
        message: err.message || 'An error occurred while processing your request.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setDestinationAccountNumber('');
    setAmount('');
    setDescription('');
    setErrors({});
    setReceiptData(null);
    setCurrentStep(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Navigation Segmented Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-neutral-0 p-4 rounded-xl border border-neutral-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-neutral-800 tracking-tight">
            {mode === 'transfer' ? 'Fund Transfer' : 'Cash Withdrawal'}
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            {mode === 'transfer'
              ? 'Transfer funds to any registered RedBank account instantly'
              : 'Withdraw cash directly from your RedBank account'}
          </p>
        </div>

        <SegmentedControl
          options={[
            { label: 'Fund Transfer', value: 'transfer' },
            { label: 'Cash Withdrawal', value: 'withdrawal' },
          ]}
          value={mode}
          onChange={handleModeChange}
        />
      </div>

      {/* 3-Step Stepper Progress Bar */}
      <Card className="p-6">
        <Stepper steps={steps} currentStep={currentStep} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Step Form / Content View (2 Columns) */}
        <div className="lg:col-span-2">
          {currentStep === 0 && (
            <Card className="p-6">
              <form onSubmit={handleProceedToVerify} className="space-y-5">
                <h2 className="text-base font-semibold text-neutral-800 pb-3 border-b border-neutral-200 flex items-center gap-2">
                  {mode === 'transfer' ? (
                    <ArrowLeftRight className="w-5 h-5 text-primary-600" />
                  ) : (
                    <Banknote className="w-5 h-5 text-primary-600" />
                  )}
                  <span>
                    {mode === 'transfer' ? 'Transfer Details' : 'Withdrawal Request'}
                  </span>
                </h2>

                {mode === 'transfer' ? (
                  <Input
                    label="Destination Account Number"
                    placeholder="e.g. ACC-892104912"
                    value={destinationAccountNumber}
                    onChange={(e) => setDestinationAccountNumber(e.target.value)}
                    error={errors.destinationAccountNumber}
                    required
                  />
                ) : (
                  <Select
                    label="Withdrawal Method"
                    value={withdrawalMethod}
                    onChange={(e) => setWithdrawalMethod(e.target.value)}
                    options={[
                      { value: 'ATM_CODE', label: 'ATM Cash Code (Instant)' },
                      { value: 'BRANCH_COUNTER', label: 'RedBank Branch Counter' },
                      { value: 'LINKED_ACCOUNT', label: 'Linked Account Withdrawal' },
                    ]}
                  />
                )}

                <Input
                  label="Amount (PKR)"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  error={errors.amount}
                  helperText="Min: 100 PKR · Max: 500,000 PKR"
                  required
                />

                <Input
                  label="Description / Purpose (Optional)"
                  placeholder={
                    mode === 'transfer'
                      ? 'e.g. Monthly rent, Bill payment'
                      : 'e.g. Personal expenses'
                  }
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-200">
                  <Button variant="outline" onClick={() => navigate('/dashboard')}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    icon={ArrowRight}
                    iconPosition="trailing"
                  >
                    Continue to Verify
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {currentStep === 1 && (
            <Card className="p-6 space-y-6">
              <div className="pb-3 border-b border-neutral-200">
                <h2 className="text-base font-semibold text-neutral-800 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-warning-600" />
                  <span>Verify Transaction Details</span>
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Please review the details below before confirming.
                </p>
              </div>

              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center text-sm py-1 border-b border-neutral-200/60">
                  <span className="text-neutral-500 font-medium">Transaction Type</span>
                  <span className="font-semibold text-neutral-800">
                    {mode === 'transfer' ? 'Fund Transfer' : 'Cash Withdrawal'}
                  </span>
                </div>

                {mode === 'transfer' ? (
                  <div className="flex justify-between items-center text-sm py-1 border-b border-neutral-200/60">
                    <span className="text-neutral-500 font-medium">
                      Destination Account
                    </span>
                    <span className="font-semibold text-neutral-800 font-mono">
                      {destinationAccountNumber}
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-between items-center text-sm py-1 border-b border-neutral-200/60">
                    <span className="text-neutral-500 font-medium">Method</span>
                    <span className="font-semibold text-neutral-800">
                      {withdrawalMethod.replace('_', ' ')}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm py-1 border-b border-neutral-200/60">
                  <span className="text-neutral-500 font-medium">Amount</span>
                  <span className="font-bold text-primary-600 text-lg tabular-nums">
                    PKR {parseFloat(amount).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm py-1 border-b border-neutral-200/60">
                  <span className="text-neutral-500 font-medium">Processing Fee</span>
                  <span className="font-semibold text-success-600">FREE (0 PKR)</span>
                </div>

                {description && (
                  <div className="flex justify-between items-center text-sm py-1">
                    <span className="text-neutral-500 font-medium">Description</span>
                    <span className="text-neutral-700 italic">{description}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(0)}
                  disabled={loading}
                >
                  Back to Edit
                </Button>
                <Button variant="primary" loading={loading} onClick={handleConfirmSubmit}>
                  Confirm & Submit
                </Button>
              </div>
            </Card>
          )}

          {currentStep === 2 && receiptData && (
            <Card className="p-6 sm:p-8 space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-success-50 text-success-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <StatusBadge status="COMPLETED" />
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 mt-2">
                  {mode === 'transfer' ? 'Transfer Successful' : 'Withdrawal Completed'}
                </h2>
                <p className="text-sm text-neutral-500 mt-1">
                  Your transaction has been processed securely.
                </p>
              </div>

              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 text-left space-y-3 font-sans">
                <div className="flex justify-between items-center text-xs text-neutral-500 pb-2 border-b border-neutral-200">
                  <span>Reference Code</span>
                  <span className="font-mono font-semibold text-neutral-800 text-sm">
                    {receiptData.reference}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm py-1">
                  <span className="text-neutral-500">Amount</span>
                  <span className="font-bold text-neutral-800 text-base tabular-nums">
                    PKR {receiptData.amount.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm py-1">
                  <span className="text-neutral-500">Target / Destination</span>
                  <span className="font-semibold text-neutral-800 font-mono">
                    {receiptData.destination}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs text-neutral-500 pt-2 border-t border-neutral-200">
                  <span>Timestamp</span>
                  <span>{receiptData.date}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Button variant="outline" icon={RotateCcw} onClick={handleReset}>
                  Make Another Transaction
                </Button>

                <Button
                  variant="primary"
                  icon={Receipt}
                  onClick={() => navigate('/dashboard')}
                >
                  Go to Dashboard
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Side Transaction Limits & Guidelines Rail (1 Column) */}
        <div className="space-y-4">
          <Card className="p-5 space-y-4 bg-gradient-to-br from-neutral-0 to-slate-50">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-500 flex items-center gap-2">
              <Info className="w-4 h-4 text-slate-600" />
              <span>Transaction Limits</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-2.5 bg-neutral-0 rounded-lg border border-neutral-200">
                <span className="text-neutral-600 font-medium">Daily Transfer Limit</span>
                <span className="font-bold text-neutral-800 tabular-nums">
                  500,000 PKR
                </span>
              </div>

              <div className="flex justify-between items-center p-2.5 bg-neutral-0 rounded-lg border border-neutral-200">
                <span className="text-neutral-600 font-medium">Min Amount</span>
                <span className="font-bold text-neutral-800 tabular-nums">100 PKR</span>
              </div>

              <div className="flex justify-between items-center p-2.5 bg-neutral-0 rounded-lg border border-neutral-200">
                <span className="text-neutral-600 font-medium">
                  Daily Count Remaining
                </span>
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
      </div>
    </div>
  );
};

export default TransactionForm;
