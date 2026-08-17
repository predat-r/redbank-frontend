import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { ErrorBoundary } from './ErrorBoundary.jsx';

function ThrowError({ message = 'Request failed' }) {
  throw new Error(message);
}

afterEach(() => vi.restoreAllMocks());

describe('ErrorBoundary', () => {
  test('renders children when no error is thrown', () => {
    render(
      <ErrorBoundary>
        <p>Safe content</p>
      </ErrorBoundary>
    );

    expect(screen.getByText('Safe content')).toBeInTheDocument();
  });

  test('shows configured recovery UI, error details, and calls reset callback', async () => {
    const user = userEvent.setup();
    const onError = vi.fn();
    const onReset = vi.fn();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary
        title="Unable to load account"
        description="Please retry."
        onError={onError}
        onReset={onReset}
      >
        <ThrowError message="Balance service unavailable" />
      </ErrorBoundary>
    );

    expect(screen.getByText('Unable to load account')).toBeInTheDocument();
    expect(screen.getByText('Please retry.')).toBeInTheDocument();
    expect(onError).toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: /technical error details/i }));
    expect(screen.getByText(/Error: Balance service unavailable/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /try again/i }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  test('uses a functional fallback and gives it a reset callback', () => {
    const fallback = vi.fn(() => <p>Fallback content</p>);
    vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary fallback={fallback}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Fallback content')).toBeInTheDocument();
    expect(fallback).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(Error) })
    );
  });
});
