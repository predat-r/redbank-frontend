import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { renderWithProviders } from '../../test/render.jsx';
import { DashboardPage } from './DashboardPage.jsx';

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
  test('renders welcome header, balance card, and recent transactions', () => {
    renderDashboardWithRouter();

    expect(screen.getByText(/welcome, alexander wright/i)).toBeInTheDocument();
    expect(screen.getByText('Current Balance')).toBeInTheDocument();
    expect(screen.getByText('Transfer Funds')).toBeInTheDocument();
    expect(screen.getByText('Withdraw Cash')).toBeInTheDocument();
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
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
});
