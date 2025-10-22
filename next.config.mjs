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
}

export default nextConfig
