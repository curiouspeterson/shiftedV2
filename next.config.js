/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  webpack: (config, { isServer }) => {
    // Fix for ESM modules
    config.module.rules.push({
      test: /\.(mjs|js|jsx)$/,
      include: [
        /node_modules\/@radix-ui/,
        /node_modules\/date-fns/
      ],
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false
      }
    })

    // Fallbacks for Node.js modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        module: false,
        path: false,
        os: false,
      }
    }

    return config
  },
  // Ensure proper transpilation of dependencies
  transpilePackages: [
    '@radix-ui/react-popper',
    '@radix-ui/react-select',
    'date-fns'
  ],
  experimental: {
    serverActions: true
  },
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ],
      },
    ]
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig