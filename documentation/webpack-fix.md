# Webpack Configuration Guide

This document outlines steps to resolve common webpack-related issues in Next.js applications.

## Prerequisites

1. Use Node.js 18 LTS (18.16.0 or later) for optimal compatibility
2. Use npm 9.x or later
3. Clear npm cache and node_modules before starting:
   ```bash
   rm -rf .next
   rm -rf node_modules
   npm cache clean --force
   ```

## Package Dependencies

1. Update core dependencies:
   ```json
   {
     "dependencies": {
       "@supabase/ssr": "0.1.0",
       "@supabase/supabase-js": "2.43.0",
       "next": "13.4.19",
       "react": "18.2.0",
       "react-dom": "18.2.0"
     }
   }
   ```

2. Add required WebSocket dependencies:
   ```json
   {
     "dependencies": {
       "bufferutil": "4.0.8",
       "utf-8-validate": "6.0.3"
     }
   }
   ```

## Webpack Configuration

Update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Webpack 5 is enabled by default
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
  ]
}

module.exports = nextConfig
```

## Common Issues and Solutions

### 1. JSON Parsing Errors
If encountering JSON parsing errors or "unexpected end of input":
1. Clear all caches and reinstall dependencies
2. Ensure Node.js version is 18.16.0 or later
3. Use `--legacy-peer-deps` if needed: `npm install --legacy-peer-deps`

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
5. Check for TypeScript errors: `npm run type-check`

## Additional Resources

- [Next.js Webpack 5 Documentation](https://nextjs.org/docs/messages/webpack5)
- [Webpack 5 Migration Guide](https://webpack.js.org/migrate/5/)
- [Next.js ESM Support](https://nextjs.org/docs/app/building-your-application/optimizing/module-imports) 