import { refreshAccessToken } from './tokenRefresh';

import { getTenantName } from './tenant';
export { getTenantName } from './tenant';

// Base API URL
export const BASE_URL = normalizeApiUrl();
export const SHOW_ALL_MENUS = true;

/**
 * Generic Fetcher function designed for REST queries following:
 * [main backend url] / [tenant] / [backend path] / [endpoint]
 * e.g. https://backend.crmfarm.in/crmfarmsa/superadmin/SubscriptionInsightsAPI/
 */
export async function fetchFromApi<T = any>(endpoint: string, options?: RequestInit): Promise<T> {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token') || localStorage.getItem('accesstoken') || localStorage.getItem('access_token')
      : null;
  const tenant = getTenantName();

  const headers = new Headers(options?.headers);
  if (options?.body && !headers.has('Content-Type') && !(typeof FormData !== 'undefined' && options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const noAuth = headers.get('X-No-Auth') === 'true';
  headers.delete('X-No-Auth');

  if (!noAuth && token && token !== 'null' && token !== 'undefined') {
    if (!headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const dbName = (typeof window !== 'undefined' && localStorage.getItem('DBName')) || 'crmuseradmin1';
  headers.set('db', dbName);
  headers.set('Db', dbName);
  headers.set('Accept', 'application/json');

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const primaryHost = normalizeApiUrl();
  const fallbackHost = 'https://backend.crmfarm.in';

  const makeRequest = async (host: string) => {
    const url = `${host}/${tenant}/${cleanEndpoint}`;
    return fetch(url, {
      credentials: 'omit',
      ...options,
      headers,
    });
  };

  let res: Response;
  try {
    res = await makeRequest(primaryHost);
    if (!res.ok && (res.status === 404 || res.status === 502) && primaryHost !== fallbackHost) {
      console.warn(`[apiClient] Request to ${primaryHost} returned ${res.status}. Retrying on fallback ${fallbackHost}...`);
      res = await makeRequest(fallbackHost);
    }
  } catch (err: any) {
    if (primaryHost !== fallbackHost) {
      console.warn(`[apiClient] Request to ${primaryHost} failed (${err.message}). Retrying on fallback ${fallbackHost}...`);
      res = await makeRequest(fallbackHost);
    } else {
      throw err;
    }
  }

  if (!res.ok) {
    if (res.status === 401 && !cleanEndpoint.includes('token/refresh') && typeof window !== 'undefined') {
      console.warn(`[apiClient] 401 Unauthorized for ${cleanEndpoint}. Attempting token refresh...`);
      const newToken = await refreshAccessToken();
      if (newToken) {
        headers.set('Authorization', `Bearer ${newToken}`);
        try {
          res = await makeRequest(primaryHost);
          if (!res.ok && (res.status === 404 || res.status === 502) && primaryHost !== fallbackHost) {
            res = await makeRequest(fallbackHost);
          }
          if (res.ok) {
            const text = await res.text();
            try {
              return JSON.parse(text);
            } catch {
              return text as unknown as T;
            }
          }
        } catch (retryErr) {
          console.error('[apiClient] Error during retried request after token refresh:', retryErr);
        }
      }
    }

    let errorDetail = '';
    try {
      const errData = await res.clone().json();
      errorDetail = errData.detail || errData.message || errData.error || JSON.stringify(errData);
    } catch {
      try {
        errorDetail = await res.clone().text();
      } catch { }
    }

    throw new Error(`API error (${res.status}): ${errorDetail || res.statusText}`);
  }

  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text as unknown as T;
  }
}

export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  session_id?: string;
  token?: string;
  user?: any;
  detail?: string;
  message?: string;
}

/**
 * SuperAdmin Login API service
 * Calls: [main backend url] / [tenant] / useradmin/login/
 */
export async function loginSuperAdminApi(username: string, password: string): Promise<LoginResponse> {
  const tenant = getTenantName();
  const primaryHost = (process.env.NEXT_PUBLIC_API_URL || 'https://backend.crmfarm.in').replace(/\/$/, '');
  const fallbackHost = 'https://backend.crmfarm.in';

  const payload = JSON.stringify({ username, password });
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'db': tenant,
  };

  const tryLogin = async (host: string) => {
    const url = `${host}/${tenant}/useradmin/login/`;
    return fetch(url, {
      method: 'POST',
      headers,
      body: payload,
    });
  };

  let res: Response;
  try {
    res = await tryLogin(primaryHost);
    if (!res.ok && (res.status === 404 || res.status === 502) && primaryHost !== fallbackHost) {
      console.warn(`[loginSuperAdminApi] Login at ${primaryHost} returned ${res.status}. Retrying on fallback ${fallbackHost}...`);
      res = await tryLogin(fallbackHost);
    }
  } catch (err: any) {
    if (primaryHost !== fallbackHost) {
      console.warn(`[loginSuperAdminApi] Login at ${primaryHost} threw (${err.message}). Retrying on fallback ${fallbackHost}...`);
      res = await tryLogin(fallbackHost);
    } else {
      throw err;
    }
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data.detail || data.message || data.error || `Login failed (${res.status})`;
    throw new Error(errorMsg);
  }

  return data;
}

/**
 * SuperAdmin User Details lookup
 * Calls: [main backend url] / [tenant] / useradmin/UserCRUD_GET/?username=[username]
 */
export async function getUserDetailsApi(username: string, token: string): Promise<any> {
  const tenant = getTenantName();
  const primaryHost = (process.env.NEXT_PUBLIC_API_URL || 'https://backend.crmfarm.in').replace(/\/$/, '');
  const fallbackHost = 'https://backend.crmfarm.in';

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
    'db': tenant,
  };

  const tryGet = async (host: string) => {
    const url = `${host}/${tenant}/useradmin/UserCRUD_GET/?username=${encodeURIComponent(username)}`;
    return fetch(url, { method: 'GET', headers });
  };

  try {
    let res = await tryGet(primaryHost);
    if (!res.ok && primaryHost !== fallbackHost) {
      res = await tryGet(fallbackHost);
    }
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('[getUserDetailsApi] User details lookup failed, continuing with auth payload:', e);
  }
  return null;
}
