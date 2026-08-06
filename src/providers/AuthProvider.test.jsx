import { screen } from '@testing-library/react';
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

    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );

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

    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );

    expect(await screen.findByText('signed-out')).toBeInTheDocument();
  });
});
