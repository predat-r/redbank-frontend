import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, beforeEach } from 'vitest';
import { Topbar } from './Topbar.jsx';
import { ThemeProvider } from '../../providers/ThemeProvider.jsx';

describe('Topbar component', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  test('renders topbar user info and dark mode toggle button', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <Topbar
          user={{
            name: 'Jane Doe',
            role: 'ROLE_ACCOUNT_HOLDER',
            email: 'jane@example.com',
          }}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Account Holder')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /switch to dark theme/i })
    ).toBeInTheDocument();
  });

  test('toggles theme when clicking dark mode toggle button in topbar', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider defaultTheme="light">
        <Topbar
          user={{
            name: 'Jane Doe',
            role: 'ROLE_ACCOUNT_HOLDER',
            email: 'jane@example.com',
          }}
        />
      </ThemeProvider>
    );

    const toggleButton = screen.getByRole('button', { name: /switch to dark theme/i });
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    await user.click(toggleButton);

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(
      screen.getByRole('button', { name: /switch to light theme/i })
    ).toBeInTheDocument();
  });
});
