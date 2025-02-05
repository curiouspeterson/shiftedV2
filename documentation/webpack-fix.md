# Webpack Configuration Guide

This document outlines steps to resolve common webpack-related issues in Next.js applications.

## Prerequisites

1. Use Node.js LTS (v18 or v20 recommended) for optimal compatibility
   - Avoid bleeding-edge releases (e.g., v23)
   - Use nvm: `nvm install 20` and `nvm use 20`
2. Use npm 9.x or later
3. Clear npm cache and node_modules before starting:
   ```bash
   rm -rf .next
   rm -rf node_modules
   rm -rf package-lock.json
   npm cache clean --force
   npm install
   ```

## Package Dependencies

1. Core dependencies should use caret (^) versioning for compatible updates:
   ```json
   {
     "dependencies": {
       "@floating-ui/dom": "^1.5.3",
       "@hookform/resolvers": "^3.3.4",
       "@radix-ui/react-alert-dialog": "^1.0.5",
       "@radix-ui/react-dialog": "^1.0.5",
       "@radix-ui/react-label": "^2.0.2",
       "@supabase/ssr": "^0.1.0",
       "@supabase/supabase-js": "^2.39.3",
       "next": "^14.0.4",
       "react": "^18.2.0",
       "react-dom": "^18.2.0"
     }
   }
   ```

2. Required WebSocket and UI dependencies:
   ```json
   {
     "dependencies": {
       "bufferutil": "^4.0.8",
       "utf-8-validate": "^6.0.3",
       "class-variance-authority": "^0.7.0",
       "clsx": "^2.0.0",
       "tailwind-merge": "^1.14.0",
       "tailwindcss-animate": "^1.0.7"
     }
   }
   ```

## Webpack Configuration

Updated `next.config.js`:

```javascript
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
```

## Common Issues and Solutions

### 1. JSON Parsing Errors
If encountering "unexpected end of JSON input":
1. Verify Node.js version is LTS (v18 or v20)
2. Remove `esmExternals: 'loose'` if present in next.config.js
3. Clean install all dependencies
4. Ensure all packages use caret (^) versioning

### 2. ESM Module Issues
For ESM compatibility errors:
1. Add problematic packages to `transpilePackages` in `next.config.js`
2. Add ESM module resolution rule in webpack config
3. Use `"type": "module"` in package.json only if absolutely necessary

### 3. Dynamic Server Usage
For dynamic server usage errors:
1. Mark dynamic routes with `export const dynamic = 'force-dynamic'`
2. Use environment variables instead of runtime values where possible
3. Avoid `headers()`, `cookies()`, and `request.url` in static routes

### 4. WebSocket Optional Dependencies
If using WebSocket features:
1. Install `bufferutil` and `utf-8-validate`
2. Add them to dependencies (not devDependencies)

### 5. Tailwind CSS Issues
For Tailwind CSS related errors:
1. Update Tailwind and its plugins to latest versions
2. Remove deprecated plugins from config
3. Use proper PostCSS configuration:
   ```javascript
   // postcss.config.js
   module.exports = {
     plugins: {
       tailwindcss: {},
       autoprefixer: {},
     },
   }
   ```

## Best Practices

1. Use TypeScript for better type safety
2. Keep dependencies up to date
3. Use `npm audit` to check for vulnerabilities
4. Implement proper error boundaries
5. Follow Next.js file conventions
6. Use environment variables for configuration
7. Implement proper metadata for SEO

## Troubleshooting Steps

1. Clear caches and reinstall:
   ```bash
   rm -rf .next
   rm -rf node_modules
   rm -rf package-lock.json
   npm cache clean --force
   npm install
   ```

2. Check for conflicting dependencies:
   ```bash
   npm ls @supabase/supabase-js
   npm ls @supabase/ssr
   ```

3. Run with additional logging:
   ```bash
   NODE_OPTIONS='--trace-warnings' npm run dev
   ```

4. Verify environment variables are properly set

5. TypeScript Checks:
   - Add the type-check script to your package.json:
     ```json
     {
       "scripts": {
         "dev": "next dev",
         "build": "next build",
         "start": "next start",
         "lint": "next lint",
         "type-check": "tsc --noEmit"
       }
     }
   ```
   - Then run:
     ```bash
     npm run type-check
     ```

## Available Scripts

The following npm scripts are available in this project:

```bash
npm run dev      # Start development server
npm run build    # Create production build
npm run start    # Start production server
npm run lint     # Run ESLint
npm run type-check # Run TypeScript checks (after adding to package.json)
```

## Additional Resources

- [Next.js Webpack 5 Documentation](https://nextjs.org/docs/messages/webpack5)
- [Webpack 5 Migration Guide](https://webpack.js.org/migrate/5/)
- [Next.js ESM Support](https://nextjs.org/docs/app/building-your-application/optimizing/module-imports) 