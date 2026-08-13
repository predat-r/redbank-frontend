import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import {
  useAdminAuditLog,
  useAdminAuditLogs,
} from '../../features/admin/admin.queries.js';
import { AuditLogsPage } from './AuditLogsPage.jsx';

vi.mock('../../features/admin/admin.queries.js', () => ({
  useAdminAuditLog: vi.fn(),
  useAdminAuditLogs: vi.fn(),
}));
vi.mock('../../features/admin/useAdminListParams.js', () => ({
  useAdminListParams: vi.fn(() => ({
    page: 0,
    size: 10,
    field: 'createdAt',
    direction: 'desc',
    queryOptions: { page: 0, size: 10, sort: ['createdAt,desc'] },
    setPage: vi.fn(),
    setPageSize: vi.fn(),
    setSorting: vi.fn(),
  })),
}));
vi.mock('../../components/ui/Table.jsx', () => ({
  Table: ({ data, emptyMessage, onRowClick }) => (
    <div>
      {!data.length && <span>{emptyMessage}</span>}
      {data.map((log) => (
        <button key={log.id} onClick={() => onRowClick(log)}>
          {log.action}
        </button>
      ))}
    </div>
  ),
}));

function renderPage() {
  return render(
    <MemoryRouter>
      <AuditLogsPage />
    </MemoryRouter>
  );
}

describe('AuditLogsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAdminAuditLogs.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        content: [],
        page: { number: 0, size: 10, totalElements: 0, totalPages: 1 },
      },
    });
    useAdminAuditLog.mockReturnValue({
      isLoading: false,
      isError: false,
      data: undefined,
    });
  });

  test('shows a specific empty state when there are no audit logs', () => {
    renderPage();

    expect(screen.getByText('No audit logs found')).toBeInTheDocument();
    expect(useAdminAuditLogs).toHaveBeenCalledWith({
      page: 0,
      size: 10,
      sort: ['createdAt,desc'],
    });
  });

  test('shows parsed location-risk fields in the selected audit-log detail', async () => {
    const user = userEvent.setup();
    const log = { id: 4, action: 'LOCATION_RISK_ASSESSED' };
    useAdminAuditLogs.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { content: [log], page: {} },
    });
    useAdminAuditLog.mockImplementation((id) => ({
      isLoading: false,
      isError: false,
      data:
        id == null
          ? undefined
          : {
              ...log,
              actorEmail: 'admin@example.com',
              targetType: 'LOGIN_EVENT',
              targetIdentifier: 'event-4',
              createdAt: '2026-08-13T10:00:00Z',
              details:
                'riskLevel=HIGH, confidence=0.91, action=CHALLENGE, reason=Unusual location',
            },
    }));
    renderPage();

    await user.click(screen.getByRole('button', { name: 'LOCATION_RISK_ASSESSED' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Location risk assessed')).toBeInTheDocument();
    expect(screen.getByText('HIGH')).toBeInTheDocument();
    expect(screen.getByText('0.91')).toBeInTheDocument();
    expect(screen.getByText('CHALLENGE')).toBeInTheDocument();
    expect(screen.getByText('Unusual location')).toBeInTheDocument();
  });

  test('renders a retry affordance when the list request fails', () => {
    useAdminAuditLogs.mockReturnValue({
      isLoading: false,
      isError: true,
      error: new Error('Forbidden'),
      refetch: vi.fn(),
    });
    renderPage();

    expect(screen.getByText('Unable to load audit logs')).toBeInTheDocument();
    expect(screen.getByText('Forbidden')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });
});
