import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../layouts/AppShell';
import { WelcomeHeader } from '../../features/dashboard/components/WelcomeHeader';
import { BalanceHeroSection } from '../../features/dashboard/components/BalanceHeroSection';
import { TransactionHistory } from '../../features/transactions/components/TransactionHistory';
import { TransactionDetailModal } from '../../features/transactions/components/TransactionDetailModal';
import { useToast } from '../../hooks/useToast';
import { useMyAccount, useLatestBalance } from '../../features/account/account.queries';

export const DashboardPage = ({ onNavigate }) => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const handleNavigate = onNavigate || navigate;
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Real Backend API Queries for Account & Balance
  const { data: realAccount, isLoading: isLoadingAccount } = useMyAccount();
  const { data: realBalance, isLoading: isLoadingBalance } = useLatestBalance();

  const account = realAccount;
  const runningBalance = realBalance?.runningBalance;

  const userProfile = {
    name: realAccount?.user?.name || 'Ahmad Tariq',
    email: realAccount?.user?.email || 'test@gmail.com',
  };

  const handleRowClick = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleTransferClick = () => {
    navigate('/transfer');
  };

  const handleWithdrawClick = () => {
    navigate('/withdraw');
  };

  return (
    <AppShell activePath="/dashboard" onNavigate={handleNavigate} user={userProfile}>
      <div className="space-y-6">
        {/* Welcome Greeting Header */}
        <WelcomeHeader
          user={userProfile}
          account={account}
          isLoading={isLoadingAccount}
        />

        {/* Balance Hero Tile & Stat Cards */}
        <BalanceHeroSection
          balance={runningBalance}
          currency={account?.currency || 'USD'}
          accountNumber={account?.accountNumber || 'RB-8492048192'}
          accountStatus={account?.accountStatus || 'ACTIVE'}
          approvedAt={account?.approvedAt}
          isLoading={isLoadingAccount || isLoadingBalance}
          onTransferClick={handleTransferClick}
          onWithdrawClick={handleWithdrawClick}
          onViewDetails={() =>
            addToast({
              type: 'info',
              title: 'Account Summary',
              message: `Viewing details for ${account?.accountNumber || 'Account'}`,
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
