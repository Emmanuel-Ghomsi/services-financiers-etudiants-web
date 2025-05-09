import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: `${process.env.NODE_ENV}` === 'development' ? undefined : 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9090',
        pathname: '/api/v1/media/**',
      },
      {
        protocol: 'https',
        hostname: 'api-intranet.sf-e.ca',
        pathname: '/api/v1/media/**',
      },
      {
        protocol: 'https',
        hostname: 'api-intranet-test.sf-e.ca',
        pathname: '/api/v1/media/**',
      },
    ],
  },
};

export default nextConfig;
