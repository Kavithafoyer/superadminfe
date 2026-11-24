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
