# Technology Stack

This document outlines the technology choices for the Shifted application and explains the rationale behind each selection.

## Frontend

### Core Framework
- **Next.js 13+**
  - Server-side rendering capabilities
  - App Router for improved routing
  - Built-in API routes
  - Optimized image handling
  - Automatic code splitting

### UI & Styling
- **Tailwind CSS**
  - Utility-first approach
  - Highly customizable
  - Built-in responsive design
  - Small bundle size

- **Shadcn UI**
  - Accessible components
  - Customizable design system
  - TypeScript support
  - Radix UI primitives

### State Management
- **Zustand**
  - Lightweight
  - Simple API
  - TypeScript support
  - DevTools integration

### Data Fetching
- **TanStack Query**
  - Powerful data synchronization
  - Caching capabilities
  - Real-time updates
  - Optimistic updates

## Backend

### Database
- **Supabase**
  - PostgreSQL database
  - Real-time subscriptions
  - Row Level Security
  - Built-in authentication
  - Database backups

Use the service_role key for server-side operations, such as administrative tasks, data migrations, or batch processing, etc... Only use the service_role key in secure backend environments. Treat it as a sensitive secret, similar to other critical environment variables, and avoid hardcoding it in your application’s codebase. 

### Authentication
- **Supabase Auth**
  - Multiple auth providers
  - JWT tokens
  - Role-based access
  - Session management

### API
- **Next.js API Routes**
  - API route handlers
  - Middleware support
  - TypeScript integration
  - Easy deployment

## Development Tools

### Version Control
- **Git**
  - Branch protection
  - Code review process
  - Conventional commits
  - GitHub integration

### Code Quality
- **TypeScript**
  - Static typing
  - Enhanced IDE support
  - Better code organization
  - Reduced runtime errors

- **ESLint & Prettier**
  - Code style consistency
  - Automatic formatting
  - Error prevention
  - Best practices enforcement

### Testing
- **Jest**
  - Unit testing
  - Snapshot testing
  - Mocking capabilities
  - Coverage reporting

- **Playwright**
  - End-to-end testing
  - Cross-browser testing
  - Visual regression
  - API testing

## Deployment & Infrastructure

### Hosting
- **Vercel**
  - Zero-config deployment
  - Automatic HTTPS
  - Edge functions
  - Analytics

### Monitoring
- **Sentry**
  - Error tracking
  - Performance monitoring
  - Release tracking
  - User feedback

### Analytics
- **Vercel Analytics**
  - Real-time metrics
  - User behavior
  - Performance data
  - Core Web Vitals

## Development Environment

### IDE
- **VS Code**
  - TypeScript integration
  - Debugging tools
  - Extension ecosystem
  - Git integration

### Package Management
- **pnpm**
  - Faster installation
  - Disk space efficient
  - Strict mode
  - Workspace support

## Why These Choices?

### Frontend Choices
1. **Next.js**: Chosen for its robust SSR capabilities, built-in optimizations, and excellent developer experience.
2. **Tailwind**: Selected for its utility-first approach, making it easy to maintain consistent styling across the application.
3. **Shadcn UI**: Provides accessible, customizable components while maintaining full control over the codebase.

### Backend Choices
1. **Supabase**: Offers a powerful combination of PostgreSQL, real-time capabilities, and built-in auth, reducing development time.
2. **Next.js API Routes**: Provides a seamless full-stack development experience within the same codebase.

### Development Tool Choices
1. **TypeScript**: Ensures type safety and improves maintainability of the codebase.
2. **Jest & Playwright**: Provides comprehensive testing coverage from unit to end-to-end tests.

### Deployment Choices
1. **Vercel**: Offers seamless deployment integration with Next.js and excellent performance monitoring.
2. **Sentry**: Provides robust error tracking and monitoring capabilities.

## Further Improvements
1. Evaluate a more detailed usage of “Zod” for runtime validation in server components and API routes, ensuring stricter input handling across the entire codebase.
2. Confirm the usage of “Zustand” or “TanStack Query” is documented whenever state management or data caching patterns are utilized. This will streamline developer onboarding.
3. Adopt Pnpm’s workspace features for potential subpackages (like a “common” folder for types or shared libs) to keep the monorepo structure clean and maintainable.

### Optional AI/ML Enhancements
- For AI-driven scheduling, consider integrating Python-based microservices (similar to example docs referencing FastAPI) or Node-based APIs that interface with an AI model (OpenAI or a custom model).  
- Evaluate introducing specialized frameworks (like LangChain or custom ML pipelines) to handle advanced logic (e.g., conflict resolution, staff skill coverage).  
- Ensure additional infrastructure (GPU hosting or specialized server instances) is accounted for if adopting computationally intensive operations. 