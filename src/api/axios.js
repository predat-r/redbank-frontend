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
  withCredentials: true,
  paramsSerializer: { indexes: null },
};

const api = axios.create(clientOptions);

// Separate client prevents a failed refresh request from entering the response interceptor.
export const refreshClient = axios.create(clientOptions);

let csrfToken = null;
let csrfTokenPromise = null;

function readCookie(name) {
  const cookie = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : null;
}

function isStateChangingRequest(config) {
  return ['post', 'put', 'patch', 'delete'].includes(
    (config.method || 'get').toLowerCase()
  );
}

function isCsrfExemptRequest(url = '') {
  return ['/auth/login', '/auth/register', '/auth/csrf'].some((path) =>
    url.endsWith(path)
  );
}

async function getCsrfToken() {
  const cookieToken = readCookie('XSRF-TOKEN');

  // The backend can rotate or clear the CSRF cookie. Never send a cached
  // token when the browser no longer has the corresponding cookie.
  if (cookieToken) {
    csrfToken = cookieToken;
    return csrfToken;
  }

  csrfToken = null;

  if (!csrfTokenPromise) {
    csrfTokenPromise = refreshClient
      .get('/auth/csrf', { withCredentials: true })
      .then(() => {
        csrfToken = readCookie('XSRF-TOKEN');
        return csrfToken;
      })
      .finally(() => {
        csrfTokenPromise = null;
      });
  }
  return csrfTokenPromise;
}

async function addCsrfHeader(config) {
  if (!isStateChangingRequest(config) || isCsrfExemptRequest(config.url)) return config;
  const token = await getCsrfToken();
  if (token) config.headers['X-XSRF-TOKEN'] = token;
  return config;
}

refreshClient.interceptors.request.use(addCsrfHeader, (error) => Promise.reject(error));

refreshClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(toApiError(error))
);

let refreshPromise = null;

function isPublicAuthRequest(url = '') {
  return publicAuthPaths.some((path) => url.endsWith(path));
}

async function refreshTokens() {
  const response = await refreshClient.post('/auth/refresh');
  return setSession(response.data);
}

export function restoreSession() {
  if (!refreshPromise) {
    refreshPromise = refreshTokens().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

api.interceptors.request.use(
  async (config) => {
    const currentSession = getSession();
    if (currentSession?.accessToken) {
      config.headers.Authorization = `${currentSession.tokenType} ${currentSession.accessToken}`;
    }
    return addCsrfHeader(config);
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
      const nextSession = await restoreSession();
      originalRequest.headers.Authorization = `${nextSession.tokenType} ${nextSession.accessToken}`;
      return api.request(originalRequest);
    } catch (refreshError) {
      clearSession();
      return Promise.reject(toApiError(refreshError));
    }
  }
);

export default api;
