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
  /**
   * The AI Marathon now lives on its own site. Bookmarks and old links to the
   * retired placeholder route are sent there rather than 404ing.
   *
   * 307 (permanent: false) on purpose — browsers cache a 308 indefinitely, so
   * bringing the page back on-site would strand anyone who had followed it.
   */
  async redirects() {
    return [
      {
        source: "/events/ai-marathon",
        destination: "https://aimarathon.arifa.org",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
