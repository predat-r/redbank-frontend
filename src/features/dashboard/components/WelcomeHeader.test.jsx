import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { WelcomeHeader } from './WelcomeHeader.jsx';

describe('WelcomeHeader', () => {
  test('renders user welcome name and account status badge', () => {
    render(
      <WelcomeHeader
        user={{ name: 'Ahmad Tariq' }}
        account={{ accountStatus: 'ACTIVE' }}
      />
    );

    expect(screen.getByText(/welcome, ahmad tariq/i)).toBeInTheDocument();
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
  });

  test('renders fallback user name when user object is incomplete', () => {
    render(<WelcomeHeader user={null} account={{ accountStatus: 'ACTIVE' }} />);

    expect(screen.getByText('Welcome, Valued Customer')).toBeInTheDocument();
  });

  test('renders Skeleton shimmer when isLoading is true', () => {
    const { container } = render(<WelcomeHeader isLoading={true} />);

    expect(screen.queryByText('Welcome, Valued Customer')).not.toBeInTheDocument();
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  test('triggers onExportClick callback when Statement button is clicked', async () => {
    const handleExport = vi.fn();
    const user = userEvent.setup();

    render(<WelcomeHeader user={{ name: 'Ahmad Tariq' }} onExportClick={handleExport} />);

    const statementButton = screen.getByRole('button', { name: /statement/i });
    await user.click(statementButton);

    expect(handleExport).toHaveBeenCalledTimes(1);
  });
});
