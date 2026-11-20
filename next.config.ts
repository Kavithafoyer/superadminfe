import path from "path";
import type { NextConfig } from "next";

const nextConfig: any = {
  transpilePackages: ['@foyer/crm-core'],
  outputFileTracingRoot: path.resolve(__dirname, '../../'),
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    const targetBackend = process.env.NEXT_PUBLIC_API_URL || 'https://backend.crmfarm.in';
    return [
      {
        source: '/api/proxy/:path*',
        destination: `${targetBackend}/:path*`,
      },
    ];
  },
};

export default nextConfig;
