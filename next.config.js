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
<<<<<<< HEAD
 * - Development server configuration
=======
>>>>>>> 814f5aa8e56d545825b7fd94a72c02dc721cc589
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Expose environment variables to the browser
  env: {
    // Supabase configuration
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
<<<<<<< HEAD

  // Webpack configuration to handle Node.js polyfills
  webpack: (config, { dev, isServer }) => {
    // Add WebSocket polyfills and configure dev server options
    if (!isServer && dev) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        module: false,
        net: false,
        dns: false,
      }

      // Configure development server options
      if (config.watchOptions) {
        config.watchOptions.poll = 1000 // Check for changes every second
        config.watchOptions.aggregateTimeout = 300 // Delay before rebuilding
      }
=======
  // Webpack configuration to handle Node.js polyfills
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      // Disable Node.js-specific modules in the browser
      fs: false,
      module: false,
>>>>>>> 814f5aa8e56d545825b7fd94a72c02dc721cc589
    }
    return config
  }
}

module.exports = nextConfig 