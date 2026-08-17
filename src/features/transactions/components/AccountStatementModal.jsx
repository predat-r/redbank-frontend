import { useState } from 'react';
import { Modal, Button } from '../../../components/ui';
import { useRequestAccountStatement } from '../../account/account.queries';
import { useToast } from '../../../hooks/useToast';
import { Calendar, Download, CheckCircle2 } from 'lucide-react';

export const AccountStatementModal = ({ isOpen, onClose }) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const { addToast } = useToast();

  const { mutate: requestStatement, isPending } = useRequestAccountStatement();

  const handleQuickSelect = (months) => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - months);

    setToDate(end.toISOString().split('T')[0]);
    setFromDate(start.toISOString().split('T')[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fromDate || !toDate) return;

    requestStatement(
      { fromDate, toDate },
      {
        onSuccess: () => {
          setIsSuccess(true);
        },
        onError: (error) => {
          addToast({
            type: 'error',
            title: 'Request Failed',
            message: error?.response?.data?.message || 'Failed to request statement.',
          });
        },
      }
    );
  };

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  if (isSuccess) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} maxWidth="max-w-sm">
        <div className="flex flex-col items-center justify-center text-center py-4 space-y-3">
          <div className="w-16 h-16 bg-success-50 rounded-full flex items-center justify-center mb-2">
            <CheckCircle2 className="w-8 h-8 text-success-600" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 tracking-tight">
            Statement Requested
          </h3>
          <p className="text-sm text-neutral-500 px-4">
            Your statement has been generated and will be sent to your registered email
            shortly.
          </p>
          <div className="w-full pt-4 mt-2 border-t border-neutral-100">
            <Button variant="primary" onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Account Statement"
      subtitle="Download your transaction history"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-6 pt-2">
        <div className="flex gap-2 mb-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleQuickSelect(1)}
            className="flex-1"
          >
            Last Month
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleQuickSelect(6)}
            className="flex-1"
          >
            Last 6 Months
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleQuickSelect(12)}
            className="flex-1"
          >
            Last Year
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-neutral-400" /> Start Date
            </label>
            <input
              type="date"
              required
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full h-11 px-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:bg-neutral-0 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 cursor-pointer transition-all font-sans"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-neutral-400" /> End Date
            </label>
            <input
              type="date"
              required
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full h-11 px-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:bg-neutral-0 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 cursor-pointer transition-all font-sans"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={handleClose} className="px-5">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={Download}
            loading={isPending}
            disabled={!fromDate || !toDate}
            className="shadow-xs"
          >
            Request Statement
          </Button>
        </div>
      </form>
    </Modal>
  );
};
