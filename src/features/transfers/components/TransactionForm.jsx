import { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Stepper } from '../../../components/ui/Stepper';
import { SegmentedControl } from '../../../components/ui/SegmentedControl';
import { useToast } from '../../../hooks/useToast';
import { createTransfer, createWithdrawal } from '../../../api/transactions';
import { TransactionInitiateStep } from './TransactionInitiateStep';
import { TransactionVerifyStep } from './TransactionVerifyStep';
import { TransactionReceiptStep } from './TransactionReceiptStep';
import { TransactionLimitsCard } from './TransactionLimitsCard';

export const TransactionForm = ({ initialMode = 'transfer' }) => {
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
            <TransactionInitiateStep
              mode={mode}
              destinationAccountNumber={destinationAccountNumber}
              setDestinationAccountNumber={setDestinationAccountNumber}
              amount={amount}
              setAmount={setAmount}
              description={description}
              setDescription={setDescription}
              withdrawalMethod={withdrawalMethod}
              setWithdrawalMethod={setWithdrawalMethod}
              errors={errors}
              onSubmit={handleProceedToVerify}
            />
          )}

          {currentStep === 1 && (
            <TransactionVerifyStep
              mode={mode}
              destinationAccountNumber={destinationAccountNumber}
              withdrawalMethod={withdrawalMethod}
              amount={amount}
              description={description}
              loading={loading}
              onBack={() => setCurrentStep(0)}
              onConfirm={handleConfirmSubmit}
            />
          )}

          {currentStep === 2 && (
            <TransactionReceiptStep
              mode={mode}
              receiptData={receiptData}
              onReset={handleReset}
            />
          )}
        </div>

        {/* Side Transaction Limits & Guidelines Rail (1 Column) */}
        <TransactionLimitsCard />
      </div>
    </div>
  );
};

export default TransactionForm;
