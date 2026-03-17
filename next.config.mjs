/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    // Allow recipe images from public directory
    remotePatterns: [],
    formats: ['image/webp', 'image/avif'],
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Disable caching for recipe images and videos so updates show immediately
  async headers() {
    return [
      {
        source: '/recipe_images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ]
  },
}

export default nextConfig
