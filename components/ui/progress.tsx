/**
 * Progress Component
 * 
 * A reusable progress bar component built on top of Radix UI's Progress primitive.
 * Provides a visual indicator of progress or completion status.
 * 
 * Features:
 * - Customizable appearance through className prop
 * - Smooth animations and transitions
 * - Accessible progress indication
 * - Client-side rendering for dynamic updates
 * - Consistent styling with design system
 */

"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

/**
 * Progress component using React.forwardRef for ref forwarding
 * 
 * @param className - Additional CSS classes to apply
 * @param value - Current progress value (0-100)
 * @param props - Additional props passed to Radix Progress primitive
 * @param ref - Forwarded ref for direct DOM access
 * 
 * The component renders a progress bar with:
 * - Full width container with rounded corners
 * - Secondary background color
 * - Animated primary-colored indicator
 * - Dynamic width based on value prop
 */
const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    {/* 
      Progress indicator that animates and fills based on current value
      Uses CSS transform to animate the fill from left to right
    */}
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }