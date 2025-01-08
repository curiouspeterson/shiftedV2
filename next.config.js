/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000']
    }
  },
  transpilePackages: ['@supabase/auth-helpers-nextjs'],
  typescript: {
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig