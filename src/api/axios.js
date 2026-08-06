import axios from 'axios';
import { toApiError } from './errors.js';
import { clearSession, getSession, setSession } from './tokenStore.js';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const publicAuthPaths = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/auth/logout',
];

const clientOptions = {
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
};

const api = axios.create(clientOptions);

// Separate client prevents a failed refresh request from entering the response interceptor.
export const refreshClient = axios.create(clientOptions);

refreshClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(toApiError(error))
);

let refreshPromise = null;

function isPublicAuthRequest(url = '') {
  return publicAuthPaths.some((path) => url.endsWith(path));
}

async function refreshTokens() {
  const currentSession = getSession();
  if (!currentSession?.refreshToken) {
    clearSession();
    throw new Error('No refresh token is available.');
  }

  const response = await refreshClient.post('/auth/refresh', {
    refreshToken: currentSession.refreshToken,
  });
  return setSession(response.data);
}

api.interceptors.request.use(
  (config) => {
    const currentSession = getSession();
    if (currentSession?.accessToken) {
      config.headers.Authorization = `${currentSession.tokenType} ${currentSession.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(toApiError(error))
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const canRefresh =
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isPublicAuthRequest(originalRequest.url);

    if (!canRefresh) {
      return Promise.reject(toApiError(error));
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshTokens().finally(() => {
          refreshPromise = null;
        });
      }

      const nextSession = await refreshPromise;
      originalRequest.headers.Authorization = `${nextSession.tokenType} ${nextSession.accessToken}`;
      return api.request(originalRequest);
    } catch (refreshError) {
      clearSession();
      return Promise.reject(toApiError(refreshError));
    }
  }
);

export default api;
