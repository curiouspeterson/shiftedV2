/**
 * Input Component Module
 * 
 * A styled input component that extends the native HTML input element.
 * Provides consistent styling and behavior for text input fields.
 * 
 * Features:
 * - Consistent styling with design system
 * - Support for all native input types
 * - Responsive text size
 * - Focus and hover states
 * - File input styling
 * - Disabled state handling
 * - Placeholder styling
 * - Custom class support
 * 
 * @module
 */

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Input component
 * A styled input field that maintains consistent design across the application
 * 
 * @component
 * @example
 * // Basic text input
 * <Input type="text" placeholder="Enter your name" />
 * 
 * // Password input
 * <Input type="password" placeholder="Enter password" />
 * 
 * // Disabled input
 * <Input disabled value="Read only value" />
 * 
 * // File input
 * <Input type="file" accept="image/*" />
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
