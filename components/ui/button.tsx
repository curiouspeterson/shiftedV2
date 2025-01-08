/**
 * Button Component Module
 * 
 * A flexible button component with multiple variants and sizes.
 * Built with React and styled using Tailwind CSS and class-variance-authority.
 * 
 * Features:
 * - Multiple visual variants (default, destructive, outline, secondary, ghost, link)
 * - Different size options (default, sm, lg, icon)
 * - Support for icons and text content
 * - Accessible focus states
 * - Disabled state styling
 * - Polymorphic component support through asChild prop
 * - Consistent styling with design system
 * 
 * @module
 */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Button variants configuration
 * Defines the different visual styles and sizes available for the button component
 * 
 * Variants:
 * - default: Primary action button
 * - destructive: For dangerous or destructive actions
 * - outline: Bordered button with hover effect
 * - secondary: Alternative styling
 * - ghost: No background until hover
 * - link: Appears as a text link
 * 
 * Sizes:
 * - default: Standard size
 * - sm: Compact size
 * - lg: Large size
 * - icon: Square button for icons
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Button component props interface
 * Extends standard button props with variant and size options
 * 
 * @property {boolean} asChild - When true, button will render its children as the root element
 * @property {string} variant - Visual style variant
 * @property {string} size - Size variant
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

/**
 * Button component
 * Renders a button element with configurable styling and behavior
 * 
 * @component
 * @example
 * // Default button
 * <Button>Click me</Button>
 * 
 * // Destructive button with icon
 * <Button variant="destructive" size="lg">
 *   <TrashIcon />
 *   Delete
 * </Button>
 * 
 * // Link style button
 * <Button variant="link">Learn more</Button>
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot : "button"
    return React.createElement(Component, {
      className: cn(buttonVariants({ variant, size, className })),
      ref,
      ...props,
    })
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
