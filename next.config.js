/**
 * Next.js Configuration
 * 
 * Configuration file for the Next.js application, defining environment variables,
 * webpack customizations, and other build-time settings.
 * 
 * Features:
 * - Environment variable exposure to client-side
 * - Webpack configuration for Node.js polyfills
 * - Supabase configuration
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Expose environment variables to the browser
  env: {
    // Supabase configuration
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  // Webpack configuration to handle Node.js polyfills
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      // Disable Node.js-specific modules in the browser
      fs: false,
      module: false,
    }
    return config
  }
}

module.exports = nextConfig 