# Project Structure

This document outlines the organization and structure of the Shifted application codebase.

## Directory Structure

```
shifted/
├── app/                    # Next.js 13+ App Router directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication related pages
│   ├── dashboard/         # Dashboard and main application pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Shared React components
│   ├── ui/               # UI components (buttons, inputs, etc.)
│   └── shared/           # Shared business components
├── lib/                   # Utility functions and shared logic
│   ├── auth.ts           # Authentication utilities
│   ├── supabase/         # Supabase related utilities
│   └── utils/            # General utility functions
├── types/                # TypeScript type definitions
├── hooks/                # Custom React hooks
├── public/               # Static assets
├── styles/               # Global styles
└── scripts/              # Utility scripts
```

## Key Directories Explained

### App Directory (`/app`)
- Uses Next.js 13+ App Router
- Each route is a directory with its own components
- Special files: `layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx`

### Components (`/components`)
- **UI Components**: Reusable UI elements
  - Buttons, forms, inputs
  - Modal dialogs
  - Navigation elements
- **Shared Components**: Business logic components
  - Data tables
  - Charts
  - Complex forms

### Library (`/lib`)
- **Authentication**: Auth related utilities
- **Supabase**: Database and backend utilities
- **Utils**: Helper functions and shared logic

### Types (`/types`)
- TypeScript interfaces and types
- Shared type definitions
- API response types

## File Naming Conventions

- React Components: PascalCase (`EmployeeList.tsx`)
- Utilities: camelCase (`formatDate.ts`)
- Pages: lowercase with hyphens (`employee-details.tsx`)
- Types: PascalCase with type suffix (`EmployeeType.ts`)

## Component Organization

### Page Components
```typescript
app/
└── dashboard/
    └── employees/
        ├── page.tsx              # Page component
        ├── loading.tsx           # Loading state
        ├── error.tsx             # Error handling
        └── components/           # Page-specific components
            ├── employee-list.tsx
            └── employee-dialog.tsx
```

### Shared Components
```typescript
components/
├── ui/
│   ├── Button/
│   │   ├── index.tsx
│   │   └── types.ts
│   └── Input/
│       ├── index.tsx
│       └── types.ts
└── shared/
    └── DataTable/
        ├── index.tsx
        └── types.ts
```

## Best Practices

1. **Component Colocation**
   - Keep related files close together
   - Page-specific components in page directory
   - Shared components in components directory

2. **Module Organization**
   - One component per file
   - Index files for clean imports
   - Separate type definitions

3. **Import Structure**
   - Absolute imports from root
   - Relative imports for closely related files
   - Group imports by type (React, components, utilities)

## Additional Analysis & Recommendations
1. Consider adding a dedicated "services/" or "domain/" folder for complex business logic that goes beyond the scope of simple utilities, so that "/lib" can remain focused on small, stateless helpers and frequent reuse patterns.
2. Where possible, ensure strict naming conventions (lowercase-hyphen for pages, PascalCase for components, etc.) are enforced consistently across all directories (e.g., confirm "layout.tsx" vs. "layout.ts" usage in each route).
3. Evaluate usage of the Next.js App Router to leverage server components more extensively. Files like "page.tsx" or "layout.tsx" can host server-side logic to minimize client-side overhead.
4. Create index files ("index.ts" or "index.tsx") within subdirectories for better import paths. For example, "import { Button } from '@/components/ui/Button'" could be shortened if an index file is introduced.

### Inspiration from Example Docs
- While Shifted focuses on employee management, referencing multi-directory or monorepo structures (similar to TechPrep AI's "frontend" and "backend" separation) may help if the product expands. A domain-oriented approach or monorepo layout could better organize complex features (e.g., scheduling algorithms, advanced analytics, or AI add-ons).
- Consider a dedicated "documentation-examples" folder (already referenced) for partial prototypes or feature experiments before merging them into production structure.
