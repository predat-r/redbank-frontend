import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import {
  approveRegistration,
  getPendingRegistration,
  getPendingRegistrations,
  rejectRegistration,
} from '../../api/admin.js';
import { renderWithProviders } from '../../test/render.jsx';
import { RegistrationsPage } from './RegistrationsPage.jsx';

vi.mock('../../api/admin.js', () => ({
  approveRegistration: vi.fn(),
  getPendingRegistration: vi.fn(),
  getPendingRegistrations: vi.fn(),
  rejectRegistration: vi.fn(),
}));

const applicant = {
  id: 8,
  name: 'Amina Khan',
  email: 'amina@example.com',
  phoneNumber: '+92 300 1234567',
  address: '12 Bank Street',
  status: 'PENDING_APPROVAL',
  createdAt: '2026-08-05T10:30:00Z',
};

function pageResponse(content = [applicant], overrides = {}) {
  return {
    content,
    page: {
      number: 0,
      size: 10,
      totalElements: content.length,
      totalPages: 1,
      ...overrides,
    },
  };
}

function renderPage() {
  return renderWithProviders(
    <MemoryRouter>
      <RegistrationsPage />
    </MemoryRouter>
  );
}

describe('RegistrationsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getPendingRegistrations.mockResolvedValue(pageResponse());
    getPendingRegistration.mockResolvedValue(applicant);
    approveRegistration.mockResolvedValue(undefined);
    rejectRegistration.mockResolvedValue(undefined);
  });

  test('renders pending applicants and loads their details', async () => {
    const user = userEvent.setup();
    renderPage();

    expect(await screen.findAllByText('Amina Khan')).not.toHaveLength(0);
    await user.click(screen.getAllByRole('button', { name: 'Details' })[0]);

    expect(await screen.findByText('+92 300 1234567')).toBeInTheDocument();
    expect(getPendingRegistration).toHaveBeenCalledWith(8);
  });

  test('approves after confirmation and refreshes the list', async () => {
    const user = userEvent.setup();
    renderPage();

    await screen.findAllByText('Amina Khan');
    await user.click(screen.getAllByRole('button', { name: 'Approve' })[0]);
    await user.click(screen.getByRole('button', { name: 'Approve Registration' }));

    await waitFor(() => expect(approveRegistration.mock.calls[0][0]).toBe(8));
    expect(await screen.findByText('Registration approved')).toBeInTheDocument();
    await waitFor(() => expect(getPendingRegistrations).toHaveBeenCalledTimes(2));
  });

  test('requires and trims a rejection reason before submitting', async () => {
    const user = userEvent.setup();
    renderPage();

    await screen.findAllByText('Amina Khan');
    await user.click(screen.getAllByRole('button', { name: 'Reject' })[0]);
    await user.click(screen.getByRole('button', { name: 'Reject Registration' }));
    expect(screen.getByText('A rejection reason is required.')).toBeInTheDocument();
    expect(rejectRegistration).not.toHaveBeenCalled();

    await user.type(
      screen.getByLabelText('Rejection reason'),
      '  Details do not match.  '
    );
    await user.click(screen.getByRole('button', { name: 'Reject Registration' }));

    await waitFor(() =>
      expect(rejectRegistration.mock.calls[0][0]).toEqual({
        userId: 8,
        rejectionReason: 'Details do not match.',
      })
    );
    expect(await screen.findByText('Registration rejected')).toBeInTheDocument();
  });

  test('shows empty and retryable error states', async () => {
    getPendingRegistrations.mockResolvedValueOnce(pageResponse([]));
    const { unmount } = renderPage();
    expect(
      await screen.findByRole('heading', { name: 'No pending registrations' })
    ).toBeInTheDocument();
    unmount();

    getPendingRegistrations.mockRejectedValueOnce(
      new Error('Registration service unavailable')
    );
    renderPage();
    expect(
      await screen.findByText('Registration service unavailable')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
  });
});
