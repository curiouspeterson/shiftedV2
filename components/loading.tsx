/**
 * Loading Component
 * 
 * A reusable loading spinner component for indicating loading states.
 * Displays a centered, animated spinner with consistent styling.
 * 
 * Features:
 * - Centered layout
 * - Animated spinner
 * - Fixed height container
 * - Consistent sizing
 * - Accessible animation
 */

import { Loader2 } from "lucide-react"

/**
 * Loading component
 * Renders a centered loading spinner animation
 */
export function Loading() {
  return (
    <div className="flex h-[450px] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  )
} 