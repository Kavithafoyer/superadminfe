import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export async function loadResultPages<T>(
  fetchPage: (page: number) => PromiseLike<{ data?: unknown; error?: FetchBaseQueryError }>,
  signal: AbortSignal,
) {
  const rows: T[] = [];
  let page = 1;
  while (!signal.aborted) {
    const response = await fetchPage(page);
    if (response.error) return { error: response.error };
    if (Array.isArray(response.data) && page === 1) return { data: response.data as T[] };

    const payload = response.data as { count?: number; results?: T[] } | null;
    if (!Array.isArray(payload?.results) || typeof payload.count !== 'number' ||
      (!payload.results.length && rows.length < payload.count)) {
      return { error: { status: 'CUSTOM_ERROR' as const, error: 'Invalid paginated results received.' } };
    }
    rows.push(...payload.results);
    if (rows.length >= payload.count) return { data: rows };
    page++;
  }
  return { error: { status: 'FETCH_ERROR' as const, error: 'Request cancelled.' } };
}

