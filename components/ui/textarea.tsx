/**
 * Textarea Component
 * 
 * A reusable, styled textarea component that extends the native HTML textarea element.
 * This component provides consistent styling and behavior across the application while
 * maintaining full compatibility with standard textarea attributes and properties.
 * 
 * Features:
 * - Customizable appearance through className prop
 * - Consistent styling with the application's design system
 * - Full support for all native textarea attributes
 * - Proper focus and disabled states
 * - Accessible by default
 */

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * TextareaProps Interface
 * 
 * Extends the native textarea HTML attributes to ensure full compatibility
 * with standard textarea functionality while allowing for custom props
 * to be added in the future if needed.
 */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

/**
 * Textarea Component Implementation
 * 
 * A forwarded ref component that renders a styled textarea element.
 * Uses the application's utility functions for class name management
 * and provides a consistent styling baseline that can be customized
 * through the className prop.
 *
 * @param className - Optional custom classes to be merged with default styles
 * @param props - Standard textarea HTML attributes
 * @param ref - Forwarded ref for direct textarea DOM access
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

/**
 * Component Display Name
 * 
 * Explicitly set for better debugging experience in React DevTools
 */
Textarea.displayName = "Textarea"

export { Textarea }