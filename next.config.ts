import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: `${process.env.NODE_ENV}` === 'development' ? undefined : 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
  },
};

export default nextConfig;
