import type { NextConfig } from "next";

function normalizeUrl(rawUrl?: string): string {
  const url = (rawUrl || 'https://backend.crmfarm.in').trim().replace(/\/$/, '');
  if (!/^https?:\/\//i.test(url)) {
    if (/^(localhost|127\.0\.0\.1|192\.168\.|10\.|0\.0\.0\.0)/i.test(url)) {
      return `http://${url}`;
    }
    return `https://${url}`;
  }
  return url;
}

const nextConfig: any = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    const targetBackend = normalizeUrl(process.env.NEXT_PUBLIC_API_URL);
    return [
      {
        source: '/api/proxy/:path*',
        destination: `${targetBackend}/:path*`,
      },
    ];
  },
};

export default nextConfig;
