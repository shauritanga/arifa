/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'arifa.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'demo.arifa.org',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
