import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { useMyAccount } from '../features/account/account.queries.js';
import { useLogout } from '../features/auth/auth.queries.js';
import { useAuth } from '../features/auth/useAuth.js';
import { useToast } from '../hooks/useToast.js';
import { AppShell } from './AppShell.jsx';

const addToast = vi.fn();
const navigate = vi.fn();
const sidebarProps = vi.fn();
const topbarProps = vi.fn();

vi.mock('../components/navigation/Sidebar', () => ({
  Sidebar: (props) => {
    sidebarProps(props);
    return (
      <div>
        <button onClick={() => props.onNavigate('/transfer')}>Transfer</button>
        <button onClick={() => props.onNavigate('/profile')}>Profile</button>
        <button onClick={props.onLogout}>Sidebar sign out</button>
      </div>
    );
  },
}));
vi.mock('../components/navigation/Topbar', () => ({
  Topbar: (props) => {
    topbarProps(props);
    return <button onClick={props.onLogout}>Topbar sign out</button>;
  },
}));
vi.mock('../components/ui/SignOutConfirmModal', () => ({
  SignOutConfirmModal: ({ isOpen, onClose, onConfirm }) =>
    isOpen ? (
      <div role="dialog">
        <button onClick={onConfirm}>Confirm sign out</button>
        <button onClick={onClose}>Cancel sign out</button>
      </div>
    ) : null,
}));
vi.mock('../features/account/account.queries.js', () => ({ useMyAccount: vi.fn() }));
vi.mock('../features/auth/auth.queries.js', () => ({ useLogout: vi.fn() }));
vi.mock('../features/auth/useAuth.js', () => ({ useAuth: vi.fn() }));
vi.mock('../hooks/useToast.js', () => ({ useToast: vi.fn() }));
vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => navigate,
}));

function renderShell(props = {}) {
  return render(
    <MemoryRouter>
      <AppShell {...props}>
        <p>Page content</p>
      </AppShell>
    </MemoryRouter>
  );
}

describe('AppShell', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useToast.mockReturnValue({ addToast });
    useAuth.mockReturnValue({
      claims: { sub: 'claims-name', email: 'claims@example.com' },
      roles: ['ROLE_ACCOUNT_HOLDER'],
    });
    useMyAccount.mockReturnValue({
      data: {
        accountStatus: 'ACTIVE',
        user: { name: 'Amina Khan', email: 'amina@example.com' },
      },
    });
    useLogout.mockReturnValue({ isPending: false, mutate: vi.fn() });
  });

  test('uses live account identity and navigates through the supplied callback', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    renderShell({ onNavigate });

    expect(screen.getByText('Page content')).toBeInTheDocument();
    expect(topbarProps.mock.calls.at(-1)[0].user).toMatchObject({
      name: 'Amina Khan',
      email: 'amina@example.com',
    });
    await user.click(screen.getByRole('button', { name: 'Profile' }));
    expect(onNavigate).toHaveBeenCalledWith('/profile');
  });

  test('blocks frozen outgoing navigation and displays the frozen account notice', async () => {
    const user = userEvent.setup();
    useMyAccount.mockReturnValue({
      data: { accountStatus: 'FROZEN', user: { name: 'Amina' } },
    });
    renderShell();

    expect(screen.getByText(/your account is currently/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Transfer' }));
    expect(addToast).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Account Frozen' })
    );
    expect(navigate).not.toHaveBeenCalledWith('/transfer');
    expect(
      sidebarProps.mock.calls.at(-1)[0].items.find((item) => item.href === '/transfer')
    ).toMatchObject({ badge: 'Locked' });
  });

  test('confirms logout and navigates only after the mutation settles', async () => {
    const user = userEvent.setup();
    const mutate = vi.fn((_value, callbacks) => callbacks.onSettled());
    useLogout.mockReturnValue({ isPending: false, mutate });
    renderShell();

    await user.click(screen.getByRole('button', { name: 'Topbar sign out' }));
    await user.click(screen.getByRole('button', { name: 'Confirm sign out' }));
    expect(mutate).toHaveBeenCalledWith(
      undefined,
      expect.objectContaining({ onSettled: expect.any(Function) })
    );
    expect(navigate).toHaveBeenCalledWith('/login', { replace: true });
  });
});
