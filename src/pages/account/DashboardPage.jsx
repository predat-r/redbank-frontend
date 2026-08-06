import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../layouts/AppShell';
import { WelcomeHeader } from '../../features/dashboard/components/WelcomeHeader';
import { BalanceHeroSection } from '../../features/dashboard/components/BalanceHeroSection';
import { TransactionHistory } from '../../features/transactions/components/TransactionHistory';
import { TransactionDetailModal } from '../../features/transactions/components/TransactionDetailModal';
import { useToast } from '../../hooks/useToast';
import {
  mockAccountHolder,
  mockLatestBalance,
  mockUserProfile,
} from '../../features/dashboard/mockData';

export const DashboardPage = ({ onNavigate }) => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const handleNavigate = onNavigate || navigate;
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
      message: 'Your recent activity report (CSV) has been generated successfully.',
    });
  };

  const handleTransferClick = () => {
    navigate('/transfer');
  };

  const handleWithdrawClick = () => {
    navigate('/withdraw');
  };

  return (
    <AppShell activePath="/dashboard" onNavigate={handleNavigate} user={mockUserProfile}>
      <div className="space-y-6">
        {/* Welcome Greeting Header */}
        <WelcomeHeader
          user={mockUserProfile}
          account={mockAccountHolder}
          onTransferClick={handleTransferClick}
          onWithdrawClick={handleWithdrawClick}
          onExportClick={handleExport}
        />

        {/* Balance Hero Tile & Stat Cards */}
        <BalanceHeroSection
          balance={mockLatestBalance.runningBalance}
          currency={mockAccountHolder.currency}
          accountNumber={mockAccountHolder.accountNumber}
          accountStatus={mockAccountHolder.accountStatus}
          approvedAt={mockAccountHolder.approvedAt}
          onTransferClick={handleTransferClick}
          onWithdrawClick={handleWithdrawClick}
          onViewDetails={() =>
            addToast({
              type: 'info',
              title: 'Account Summary',
              message: `Viewing details for ${mockAccountHolder.accountNumber}`,
            })
          }
        />

        {/* Recent Activity Table with View All Button */}
        <TransactionHistory
          limit={5}
          showViewAll={true}
          hideSummaryKpi={true}
          onRowClick={handleRowClick}
        />

        {/* Transaction Detail Modal */}
        <TransactionDetailModal
          transaction={selectedTransaction}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </AppShell>
  );
};

export default DashboardPage;
