/**
 * Label Component Module
 * 
 * A form label component built with Radix UI Label primitive.
 * Provides an accessible, styled label component for form inputs
 * with support for disabled states and consistent styling.
 * 
 * Features:
 * - Accessible label implementation
 * - Consistent text styling
 * - Disabled state support
 * - Peer element integration
 * - TypeScript support
 * 
 * @module
 */

"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Label style variants configuration
 * Defines the base styling for the label component
 */
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

/**
 * Label component
 * Renders a styled label element for form inputs
 * 
 * @component
 * @example
 * <Label htmlFor="email">Email Address</Label>
 * <Input id="email" type="email" />
 * 
 * @example
 * // With disabled state
 * <Label htmlFor="disabled-input" className="opacity-50">Disabled Field</Label>
 * <Input id="disabled-input" disabled />
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
