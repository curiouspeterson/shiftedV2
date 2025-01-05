# Environment Variables Configuration

This document describes the environment variables used in the application.

## Overview

The application uses environment variables for configuration of external services and sensitive data. These are stored in `.env.local` for local development and should be properly configured in deployment environments.

## Important Notes

- **NEVER commit `.env.local` or any other environment files containing secrets**
- Keep different environment files for different deployment environments
- Regularly rotate sensitive keys and tokens

## Required Variables

### Supabase Configuration

- `NEXT_PUBLIC_SUPABASE_URL`: The URL of your Supabase project
  - Format: `https://<project-id>.supabase.co`
  - Required for both client and server

- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Anonymous API key for Supabase
  - Used for unauthenticated requests
  - Required for client-side operations

- `SUPABASE_SERVICE_ROLE_KEY`: Admin API key for Supabase
  - Used for privileged operations
  - Should only be used server-side
  - Keep this secret secure

### Authentication

- `JWT_SECRET`: Secret key for JWT token generation
  - Used for secure token signing
  - Should be a long, random string
  - Keep this secret secure

## Setting Up

1. Copy `.env.example` to `.env.local`
2. Fill in the required values from your Supabase project
3. Never commit the actual values to version control
4. Ensure all required variables are set in production

## Reference

For more information:
- [Supabase Environment Variables](https://supabase.com/docs/guides/auth/env-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables) 