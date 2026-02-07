import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@golfbet/shared'],
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data: https:; connect-src 'self' http://localhost:3001 ws://localhost:3001 ws: wss: https:;",
          },
        ],
      },
    ];
  },
};

let exportedConfig = nextConfig;

if (process.env.NODE_ENV === 'production') {
  try {
    const withPWA = require('next-pwa')({
      dest: 'public',
      register: true,
      skipWaiting: true,
    });
    exportedConfig = withPWA(nextConfig);
  } catch {
    // next-pwa not installed, skip PWA wrapping
  }
}

module.exports = exportedConfig;
