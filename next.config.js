/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    serverActions: true
  },
  transpilePackages: ['@supabase/auth-helpers-nextjs']
}

module.exports = nextConfig