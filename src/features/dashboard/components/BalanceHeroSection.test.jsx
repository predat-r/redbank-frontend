import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { BalanceHeroSection } from './BalanceHeroSection.jsx';

describe('BalanceHeroSection', () => {
  test('renders formatted balance and account number', () => {
    render(
      <BalanceHeroSection
        balance={42850.75}
        currency="USD"
        accountNumber="RBA4EFD3DFC8"
        accountStatus="ACTIVE"
      />
    );

    expect(screen.getByText('Current Balance')).toBeInTheDocument();
    expect(screen.getByText('$42,850.75')).toBeInTheDocument();
    expect(screen.getByText('RBA4EFD3DFC8')).toBeInTheDocument();
  });

  test('toggles balance visibility when eye button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <BalanceHeroSection
        balance={42850.75}
        currency="USD"
        accountNumber="RBA4EFD3DFC8"
      />
    );

    expect(screen.getByText('$42,850.75')).toBeInTheDocument();

    const hideButton = screen.getByTitle('Hide Balance');
    await user.click(hideButton);

    expect(screen.queryByText('$42,850.75')).not.toBeInTheDocument();
    expect(screen.getByText('••••••••••••')).toBeInTheDocument();
  });

  test('updates balance formatting when currency selector is changed', async () => {
    const user = userEvent.setup();
    render(
      <BalanceHeroSection
        balance={42850.75}
        currency="USD"
        accountNumber="RBA4EFD3DFC8"
      />
    );

    const currencySelect = screen.getByRole('combobox');
    await user.selectOptions(currencySelect, 'EUR');

    expect(screen.getByText('€42,850.75')).toBeInTheDocument();
  });

  test('renders locked state and disables callbacks when accountStatus is FROZEN', async () => {
    const handleTransfer = vi.fn();
    const handleWithdraw = vi.fn();
    const user = userEvent.setup();

    render(
      <BalanceHeroSection
        balance={42850.75}
        accountNumber="RBA4EFD3DFC8"
        accountStatus="FROZEN"
        onTransferClick={handleTransfer}
        onWithdrawClick={handleWithdraw}
      />
    );

    expect(screen.getAllByText('Locked').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Account is currently frozen').length).toBeGreaterThan(0);

    const transferCard = screen.getAllByTitle(
      'Account is frozen - Outgoing operations disabled'
    )[0];
    await user.click(transferCard);

    expect(handleTransfer).not.toHaveBeenCalled();
  });

  test('renders Skeleton shimmer when isLoading is true', () => {
    const { container } = render(<BalanceHeroSection isLoading={true} />);

    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });
});
