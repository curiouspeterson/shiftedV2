/**
 * Popover Component Module
 * 
 * A collection of popover components built with Radix UI Popover primitives.
 * Provides a set of accessible, styled components for creating floating content
 * panels that appear relative to a trigger element.
 * 
 * Features:
 * - Accessible popover panels
 * - Keyboard navigation
 * - Focus management
 * - Screen reader support
 * - Customizable positioning
 * - Animated transitions
 * - Click outside dismissal
 */

"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

/**
 * Root popover provider component
 * Provides context for the popover functionality
 */
const Popover = PopoverPrimitive.Root

/**
 * Popover trigger component
 * The element that triggers the popover when interacted with
 * 
 * @component
 * @example
 * <PopoverTrigger>Click me</PopoverTrigger>
 */
const PopoverTrigger = PopoverPrimitive.Trigger

/**
 * Popover content component
 * The floating panel that contains the popover content
 * 
 * @component
 * @example
 * <PopoverContent>
 *   <h3>Popover Title</h3>
 *   <p>This is the popover content.</p>
 * </PopoverContent>
 */
const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent } 