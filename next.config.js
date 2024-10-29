/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  experimental: {
    appDir: true,
    esmExternals: 'loose',
    outputFileTracingIncludes: {
      "/api/search/documentation": ["./content/**/*"],
    },
  },
  reactStrictMode: true,
  images: {
    domains: [
      'img.icons8.com',
      'www.w3.org',
      'www.daisakuikeda.org',
      'play-lh.googleusercontent.com',
      'humanists.international',
      'www.mentalwellnesscentre.com',
      'yt3.googleusercontent.com',
      'picsum.photos',
    ],
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Content-Security-Policy",
            value: `
script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://vercel.live https://network.us20.list-manage.com;
object-src 'none';
base-uri 'self';
frame-ancestors 'none';
upgrade-insecure-requests;
            `.replace(/\n/g, ""),
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/about",
        destination: "/company/about-us",
        permanent: true,
      },
      {
        source: "/faq",
        destination: "/learn/faq",
        permanent: true,
      },

    ];
  },
};

module.exports = nextConfig;
