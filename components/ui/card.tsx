/**
 * Card Component Module
 * 
 * A collection of card-related components for building structured content containers.
 * Provides a set of styled components for creating card layouts with headers,
 * content areas, footers, and descriptions.
 * 
 * Features:
 * - Flexible card layouts
 * - Header and footer sections
 * - Title and description components
 * - Consistent spacing and styling
 * - Customizable through className props
 * - Responsive design
 * 
 * @module
 */

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Main card component
 * Container component that provides the base card styling and structure
 * 
 * @component
 * @example
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Card Title</CardTitle>
 *     <CardDescription>Card description text</CardDescription>
 *   </CardHeader>
 *   <CardContent>Main content here</CardContent>
 *   <CardFooter>Footer content</CardFooter>
 * </Card>
 */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

/**
 * Card header component
 * Container for card title and description with consistent spacing
 * 
 * @component
 * @example
 * <CardHeader>
 *   <CardTitle>Title</CardTitle>
 *   <CardDescription>Description</CardDescription>
 * </CardHeader>
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

/**
 * Card title component
 * Renders the card's main heading with appropriate typography
 * 
 * @component
 * @example
 * <CardTitle>Featured Content</CardTitle>
 */
const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

/**
 * Card description component
 * Renders secondary text with muted styling
 * 
 * @component
 * @example
 * <CardDescription>Additional details about the card content</CardDescription>
 */
const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

/**
 * Card content component
 * Main content area of the card with consistent padding
 * 
 * @component
 * @example
 * <CardContent>
 *   <p>Main content goes here</p>
 * </CardContent>
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

/**
 * Card footer component
 * Container for actions or additional information at the bottom of the card
 * 
 * @component
 * @example
 * <CardFooter>
 *   <Button>Action</Button>
 * </CardFooter>
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
