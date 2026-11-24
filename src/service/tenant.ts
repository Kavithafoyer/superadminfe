export function getTenantName(
  hostname = typeof window === 'undefined' ? '' : window.location.hostname,
): string {
  const labels = hostname.toLowerCase().replace(/\.$/, '').split('.');
  const [subdomain] = labels;
  const isLocalTenant = labels.length > 1 && labels.at(-1) === 'localhost';
  const isDomainTenant = labels.length > 2 && !labels.every((label) => /^\d+$/.test(label));

  if (
    (isLocalTenant || isDomainTenant) &&
    /^[a-z0-9_-]+$/.test(subdomain) &&
    subdomain !== 'www' &&
    subdomain !== 'superadmin'
  ) {
    return subdomain;
  }

  return 'crmfarmsa';
}

/**
 * Normalizes an API host URL to ensure it always includes a protocol (http:// or https://)
 * and trims trailing slashes, preventing browser relative-URL resolution.
 */
export function normalizeApiUrl(rawUrl?: string): string {
  const url = (rawUrl || process.env.NEXT_PUBLIC_API_URL || 'https://backend.crmfarm.in').trim();
  let cleaned = url.replace(/\/$/, '');
  if (!/^https?:\/\//i.test(cleaned)) {
    if (/^(localhost|127\.0\.0\.1|192\.168\.|10\.|0\.0\.0\.0)/i.test(cleaned)) {
      cleaned = `http://${cleaned}`;
    } else {
      cleaned = `https://${cleaned}`;
    }
  }
  return cleaned;
}

