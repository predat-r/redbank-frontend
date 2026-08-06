import { screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { afterEach, describe, expect, test } from 'vitest';
import { refreshClient } from '../api/axios.js';
import { useAuth } from '../features/auth/useAuth.js';
import { render } from '@testing-library/react';
import { AuthProvider } from './AuthProvider.jsx';

const originalAdapter = refreshClient.defaults.adapter;

function Probe() {
  const { isAuthenticated, isInitializing } = useAuth();
  return (
    <p>
      {isInitializing ? 'initializing' : isAuthenticated ? 'authenticated' : 'signed-out'}
    </p>
  );
}

function renderAuthProvider() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Probe />
      </AuthProvider>
    </QueryClientProvider>
  );
}

afterEach(() => {
  refreshClient.defaults.adapter = originalAdapter;
});

describe('AuthProvider startup restoration', () => {
  test('restores an access token through the refresh cookie', async () => {
    refreshClient.defaults.adapter = async (config) => ({
      config,
      data: { accessToken: 'restored', tokenType: 'Bearer' },
      headers: {},
      status: 200,
      statusText: 'OK',
    });

    renderAuthProvider();

    expect(screen.getByText('initializing')).toBeInTheDocument();
    expect(await screen.findByText('authenticated')).toBeInTheDocument();
  });

  test('settles as signed out when no refresh cookie is accepted', async () => {
    refreshClient.defaults.adapter = async (config) => {
      const response = {
        config,
        data: { message: 'Unauthorized' },
        headers: {},
        status: 401,
      };
      throw new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', config, null, response);
    };

    renderAuthProvider();

    expect(await screen.findByText('signed-out')).toBeInTheDocument();
  });
});
