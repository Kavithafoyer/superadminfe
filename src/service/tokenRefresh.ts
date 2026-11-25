import { getTenantName, normalizeApiUrl } from './tenant';

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

/**
 * Proactively or reactively refresh the JWT access token using the stored refresh token.
 * Follows the legacy superadminfe pattern:
 * POST [backend]/[tenant]/token/refresh/ with { refresh: refreshToken }
 */
export async function refreshAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  // If a refresh request is already underway, return the existing promise to avoid race conditions
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  const refreshToken =
    localStorage.getItem('refreshtoken') ||
    localStorage.getItem('refreshToken') ||
    localStorage.getItem('refresh_token');

  // In superadminfe App.js: if (!refreshToken) return;
  // Proactive background refresh should never force-logout if refreshToken is missing
  if (!refreshToken || refreshToken === 'null' || refreshToken === 'undefined') {
    return null;
  }

  isRefreshing = true;

  refreshPromise = (async () => {
    const tenant = getTenantName();
    const primaryHost = normalizeApiUrl();
    const fallbackHost = 'https://backend.crmfarm.in';

    const sendRefreshReq = async (host: string) => {
      const url = `${host}/${tenant}/token/refresh/`;
      return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'db': (typeof window !== 'undefined' && localStorage.getItem('DBName')) || 'crmuseradmin1',
          'Db': (typeof window !== 'undefined' && localStorage.getItem('DBName')) || 'crmuseradmin1',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
    };

    try {
      let res: Response;
      try {
        res = await sendRefreshReq(primaryHost);
        if (!res.ok && (res.status === 404 || res.status === 502) && primaryHost !== fallbackHost) {
          console.warn(`[tokenRefresh] Primary host ${primaryHost} failed with ${res.status}. Retrying fallback ${fallbackHost}...`);
          res = await sendRefreshReq(fallbackHost);
        }
      } catch (networkErr) {
        if (primaryHost !== fallbackHost) {
          console.warn(`[tokenRefresh] Primary host error. Retrying fallback ${fallbackHost}...`);
          res = await sendRefreshReq(fallbackHost);
        } else {
          throw networkErr;
        }
      }

      if (res && res.ok) {
        const data = await res.json();
        const newAccessToken =
          data.access ||
          data.token ||
          data.accessToken ||
          data.access_token;

        if (newAccessToken) {
          localStorage.setItem('accesstoken', newAccessToken);
          localStorage.setItem('token', newAccessToken);
          const newRefreshToken =
            data.refresh ||
            data.refreshToken ||
            data.refresh_token;
          if (newRefreshToken) {
            localStorage.setItem('refreshtoken', newRefreshToken);
            localStorage.setItem('refreshToken', newRefreshToken);
            localStorage.setItem('refresh_token', newRefreshToken);
          }
          console.log('[tokenRefresh] Access token refreshed successfully.');
          return newAccessToken;
        }
      }

      console.warn('[tokenRefresh] Refresh token rejected or expired by server (status: ' + (res ? res.status : 'unknown') + ').');
      return null;
    } catch (err) {
      console.warn('[tokenRefresh] Non-fatal background error during proactive token refresh:', err);
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Clear credentials and safely route to login when the session/refresh token is completely expired.
 */
export function handleExpiredSession() {
  if (typeof window === 'undefined') return;

  console.warn('[tokenRefresh] Session expired. Clearing authentication credentials and redirecting to /login.');
  localStorage.removeItem('token');
  localStorage.removeItem('accesstoken');
  localStorage.removeItem('access_token');
  localStorage.removeItem('refreshtoken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('session_id');
  localStorage.removeItem('isLoggedIn');
  sessionStorage.removeItem('auth-storage');

  // If already on /login or /auth-pages, don't trigger unnecessary reloads
  if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/auth-pages')) {
    window.location.href = '/login';
  }
}
