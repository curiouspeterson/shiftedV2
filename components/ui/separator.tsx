/**
 * Separator Component
 * 
 * A reusable visual separator component built on top of Radix UI's Separator primitive.
 * Provides a thin line to visually separate content either horizontally or vertically.
 * 
 * Features:
 * - Horizontal or vertical orientation
 * - Customizable appearance through className prop
 * - Optional decorative mode for non-semantic separators
 * - Consistent styling with design system
 * - Accessible when used semantically
 */

"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

/**
 * Separator component using React.forwardRef for ref forwarding
 * 
 * @param className - Additional CSS classes to apply
 * @param orientation - Direction of the separator ('horizontal' or 'vertical')
 * @param decorative - Whether the separator is purely decorative (default: true)
 * @param props - Additional props passed to Radix Separator primitive
 * @param ref - Forwarded ref for direct DOM access
 * 
 * The component renders a separator with:
 * - Consistent border color from theme
 * - 1px thickness
 * - Full width/height based on orientation
 * - No flex shrinking
 */
const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)

// Set display name for debugging and dev tools
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
