import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { useLogout } from '../features/auth/auth.queries.js';
import { useAuth } from '../features/auth/useAuth.js';
import { AdminLayout } from './AdminLayout.jsx';

vi.mock('../features/auth/auth.queries.js', () => ({ useLogout: vi.fn() }));
vi.mock('../features/auth/useAuth.js', () => ({ useAuth: vi.fn() }));

function renderLayout(initialPath = '/admin') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<h1>Overview content</h1>} />
          <Route path="registrations" element={<h1>Registration content</h1>} />
        </Route>
        <Route path="/login" element={<h1>Login page</h1>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('AdminLayout', () => {
  let mutate;

  beforeEach(() => {
    vi.clearAllMocks();
    mutate = vi.fn();
    useAuth.mockReturnValue({
      claims: { name: 'Amina Admin', email: 'amina@redbank.test' },
    });
    useLogout.mockReturnValue({ mutate, isPending: false });
  });

  test('renders admin identity, navigation, and nested content', () => {
    renderLayout();

    expect(screen.getByText('Overview content')).toBeInTheDocument();
    expect(screen.getAllByText('Amina Admin')).not.toHaveLength(0);
    expect(screen.getByRole('button', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Registrations' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Users' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Account Holders' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Transactions' })).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  test('navigates inside the admin workspace', async () => {
    const user = userEvent.setup();
    renderLayout();

    await user.click(screen.getByRole('button', { name: 'Registrations' }));
    expect(screen.getByText('Registration content')).toBeInTheDocument();
  });

  test('ends the session before returning to login', async () => {
    const user = userEvent.setup();
    mutate.mockImplementation((_, options) => options.onSettled());
    renderLayout();

    await user.click(screen.getByRole('button', { name: /Amina Admin/ }));
    await user.click(screen.getByRole('button', { name: 'Sign Out' }));

    expect(mutate).toHaveBeenCalledOnce();
    expect(screen.getByText('Login page')).toBeInTheDocument();
  });
});
