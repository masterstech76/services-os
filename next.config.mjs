/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://api.mapbox.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.mapbox.com;
      font-src 'self' data: https://fonts.gstatic.com;
      img-src 'self' data: blob: https://images.unsplash.com https://*.supabase.co https://*.stripe.com https://api.mapbox.com;
      connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://api.mapbox.com https://events.mapbox.com;
      frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://maps.google.com https://www.google.com;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
    `.replace(/\s{2,}/g, " ").trim();

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: cspHeader },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "geolocation=(self), camera=(self), microphone=()",
          },
        ],
      },
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/customer",
        destination: "/account",
        permanent: false,
      },
      {
        source: "/customer/dashboard",
        destination: "/account",
        permanent: false,
      },
      {
        source: "/customer/invoices",
        destination: "/account/invoices",
        permanent: false,
      },
      {
        source: "/customer/appointments",
        destination: "/account/appointments",
        permanent: false,
      },
      {
        source: "/customer/profile",
        destination: "/account/profile",
        permanent: false,
      },
      {
        source: "/invoices",
        destination: "/account/invoices",
        permanent: false,
      },
      {
        source: "/tech/dashboard",
        destination: "/tech",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
