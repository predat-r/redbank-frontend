import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { renderWithProviders } from '../../../test/render.jsx';
import { AccountStatementModal } from './AccountStatementModal.jsx';

const mockMutate = vi.fn();

vi.mock('../../account/account.queries.js', () => ({
  useRequestAccountStatement: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

function renderComponent(props = {}) {
  return renderWithProviders(
    <MemoryRouter>
      <AccountStatementModal isOpen={true} onClose={vi.fn()} {...props} />
    </MemoryRouter>
  );
}

describe('AccountStatementModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('does not render when isOpen is false', () => {
    renderComponent({ isOpen: false });
    expect(screen.queryByText('Account Statement')).not.toBeInTheDocument();
  });

  test('renders properly when isOpen is true', () => {
    renderComponent();
    expect(screen.getByText('Account Statement')).toBeInTheDocument();
    expect(screen.getByText('Last Month')).toBeInTheDocument();
    expect(screen.getByText('Last 6 Months')).toBeInTheDocument();
    expect(screen.getByText('Last Year')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Request Statement/i })
    ).toBeInTheDocument();
  });

  test('quick select buttons populate dates', async () => {
    const user = userEvent.setup();
    renderComponent();

    const lastMonthBtn = screen.getByText('Last Month');
    await user.click(lastMonthBtn);

    const inputs = document.querySelectorAll('input[type="date"]');
    const startDateInput = inputs[0];
    const endDateInput = inputs[1];

    expect(startDateInput.value).not.toBe('');
    expect(endDateInput.value).not.toBe('');
  });

  test('submitting form triggers mutation and shows success', async () => {
    const user = userEvent.setup();
    mockMutate.mockImplementation((data, { onSuccess }) => {
      onSuccess();
    });

    renderComponent();

    // Click last month to fill dates
    await user.click(screen.getByText('Last Month'));

    // Submit form
    await user.click(screen.getByRole('button', { name: /Request Statement/i }));

    expect(mockMutate).toHaveBeenCalledTimes(1);
    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        fromDate: expect.any(String),
        toDate: expect.any(String),
      }),
      expect.any(Object)
    );

    await waitFor(() => {
      expect(screen.getByText('Statement Requested')).toBeInTheDocument();
    });

    expect(screen.getByText(/Your statement has been generated/i)).toBeInTheDocument();
  });
});
