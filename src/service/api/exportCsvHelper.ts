import { getTenantName, normalizeApiUrl } from '../tenant';
import { refreshAccessToken } from '../tokenRefresh';

export interface ExportCsvOptions {
  endpoint: string;
  query?: Record<string, string | number | undefined | null>;
  defaultFilename: string;
  includeTokenQueryParam?: boolean;
}

/**
 * Shared CSV export downloader for SuperAdmin backend export endpoints.
 * Handles dynamic tenant/host resolution, auth headers, and 401 token refresh retries.
 */
export async function downloadSuperAdminExportCsv({
  endpoint,
  query,
  defaultFilename,
  includeTokenQueryParam = false,
}: ExportCsvOptions): Promise<boolean> {
  try {
    const primaryHost = normalizeApiUrl();
    const tenantName = getTenantName();
    const dbName =
      (typeof window !== 'undefined' && localStorage.getItem('DBName')) || 'crmuseradmin1';

    let token =
      typeof window !== 'undefined'
        ? localStorage.getItem('token') ||
          localStorage.getItem('accesstoken') ||
          localStorage.getItem('access_token') ||
          ''
        : '';

    const buildUrl = (authToken: string) => {
      const searchParams = new URLSearchParams();
      if (query) {
        Object.entries(query).forEach(([k, v]) => {
          if (v !== undefined && v !== null && String(v).trim() !== '') {
            searchParams.set(k, String(v).trim());
          }
        });
      }
      if (includeTokenQueryParam && authToken) {
        searchParams.set('token', authToken);
      }
      const qs = searchParams.toString();
      const cleanEndpoint = endpoint.replace(/^\/+/, '');
      return `${primaryHost}/${tenantName}/superadmin/${cleanEndpoint}${qs ? `?${qs}` : ''}`;
    };

    const doFetch = (authToken: string) =>
      fetch(buildUrl(authToken), {
        method: 'GET',
        headers: {
          Accept: 'text/csv, */*',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          db: dbName,
          Db: dbName,
        },
      });

    let res = await doFetch(token);
    if (res.status === 401) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        token = refreshed;
        res = await doFetch(token);
      }
    }

    if (!res.ok) {
      throw new Error(`Export failed with status ${res.status}`);
    }

    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    const contentDisposition = res.headers.get('content-disposition');
    let filename = defaultFilename;
    if (contentDisposition && contentDisposition.includes('filename=')) {
      const match = contentDisposition.match(/filename="?([^";]+)"?/);
      if (match && match[1]) filename = match[1];
    }
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(downloadUrl);
    return true;
  } catch (error) {
    console.warn(`Backend export failed for ${endpoint}:`, error);
    return false;
  }
}
