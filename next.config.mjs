/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Configure allowed hostnames for Next.js Image Optimization
    remotePatterns: [
      ...(process.env.NEXT_PUBLIC_CONTENTSTACK_IMAGE_HOSTNAME
        ? [{ hostname: process.env.NEXT_PUBLIC_CONTENTSTACK_IMAGE_HOSTNAME }]
        : [
            { hostname: "images.contentstack.io" },
            { hostname: "*-images.contentstack.com" },
            { hostname: "dev9-images.csnonprod.com" },
            { hostname: "dev9-assets.csnonprod.com" },
            { hostname: "dev9-dam-assets.csnonprod.com" },
            { hostname: "dev9-cdn.csnonprod.com" }
          ]),
    ],
    // Disable image optimization for Contentstack CDN to avoid 422 errors
    unoptimized: false,
    // Add loader configuration for better CDN handling
    loader: 'default',
  },
  // Add CORS headers for API routes and static assets
  async headers() {
    return [
      {
        // Apply CORS headers to all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
      {
        // Apply CORS headers to static assets
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ];
  },
};

export default nextConfig;
