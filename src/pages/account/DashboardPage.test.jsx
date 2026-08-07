import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { renderWithProviders } from '../../test/render.jsx';
import { DashboardPage } from './DashboardPage.jsx';
import {
  useMyAccount,
  useLatestBalance,
} from '../../features/account/account.queries.js';

vi.mock('../../features/account/account.queries.js', () => ({
  useMyAccount: vi.fn(),
  useLatestBalance: vi.fn(),
}));

function renderDashboardWithRouter(initialRoute = '/dashboard') {
  return renderWithProviders(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/transfer" element={<div>Transfer Page View</div>} />
        <Route path="/withdraw" element={<div>Withdraw Page View</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useMyAccount.mockReturnValue({
      data: {
        id: 3,
        accountNumber: 'RBA4EFD3DFC8',
        accountStatus: 'ACTIVE',
        currency: 'USD',
        approvedAt: '2026-08-06T12:20:11Z',
        user: {
          id: 4,
          name: 'Ahmad Tariq',
          email: 'test@gmail.com',
          phoneNumber: '1234567890',
          address: 'DHA EME',
        },
      },
      isLoading: false,
    });

    useLatestBalance.mockReturnValue({
      data: {
        id: 1,
        runningBalance: 42850.75,
        currency: 'USD',
      },
      isLoading: false,
    });
  });

  test('renders welcome header with real user name, balance, and account number', () => {
    renderDashboardWithRouter();

    expect(screen.getByText(/welcome, ahmad tariq/i)).toBeInTheDocument();
    expect(screen.getByText('Current Balance')).toBeInTheDocument();
    expect(screen.getByText('RBA4EFD3DFC8')).toBeInTheDocument();
    expect(screen.getByText('Transfer Funds')).toBeInTheDocument();
    expect(screen.getByText('Withdraw Cash')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Transaction History' })
    ).toBeInTheDocument();
  });

  test('navigates to /transfer when Transfer Funds card is clicked', async () => {
    const user = userEvent.setup();
    renderDashboardWithRouter();

    const transferCard = screen.getByText('Transfer Funds');
    await user.click(transferCard);

    expect(await screen.findByText('Transfer Page View')).toBeInTheDocument();
  });

  test('navigates to /withdraw when Withdraw Cash card is clicked', async () => {
    const user = userEvent.setup();
    renderDashboardWithRouter();

    const withdrawCard = screen.getByText('Withdraw Cash');
    await user.click(withdrawCard);

    expect(await screen.findByText('Withdraw Page View')).toBeInTheDocument();
  });

  test('renders locked state when account status is FROZEN', () => {
    useMyAccount.mockReturnValue({
      data: {
        id: 3,
        accountNumber: 'RBA4EFD3DFC8',
        accountStatus: 'FROZEN',
        currency: 'USD',
        user: { name: 'Ahmad Tariq', email: 'test@gmail.com' },
      },
      isLoading: false,
    });

    renderDashboardWithRouter();

    expect(screen.getByText(/your account is currently/i)).toBeInTheDocument();
    expect(screen.getAllByText('Locked').length).toBeGreaterThan(0);
  });

  test('renders loading skeleton shimmer when queries are loading', () => {
    useMyAccount.mockReturnValue({
      data: null,
      isLoading: true,
    });
    useLatestBalance.mockReturnValue({
      data: null,
      isLoading: true,
    });

    const { container } = renderDashboardWithRouter();

    // Check animate-pulse skeleton elements
    const pulseElements = container.querySelectorAll('.animate-pulse');
    expect(pulseElements.length).toBeGreaterThan(0);
  });
});
