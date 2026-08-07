import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../layouts/AppShell';
import { TransactionHistory } from '../../features/transactions/components/TransactionHistory';
import { TransactionDetailModal } from '../../features/transactions/components/TransactionDetailModal';
import { useToast } from '../../hooks/useToast';

export const HistoryPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowClick = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleExport = () => {
    addToast({
      type: 'success',
      title: 'Statement Downloaded',
      message: 'Your complete transaction history statement (CSV) has been generated.',
    });
  };

  const handleSendAgain = (transaction) => {
    navigate('/transfer', {
      state: {
        destinationAccountNumber: transaction.destinationAccountNumber || 'RB1000000001',
        amount: transaction.amount,
      },
    });
  };

  return (
    <AppShell activePath="/history">
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-neutral-800 tracking-tight">
            Transaction History
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            View all account deposits, withdrawals, and fund transfer ledgers.
          </p>
        </div>

        <TransactionHistory
          onRowClick={handleRowClick}
          onExport={handleExport}
          onSendAgain={handleSendAgain}
        />

        <TransactionDetailModal
          transaction={selectedTransaction}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </AppShell>
  );
};

export default HistoryPage;
