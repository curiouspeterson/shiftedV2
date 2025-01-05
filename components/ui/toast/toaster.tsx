/**
 * Toaster Component Module
 * 
 * This component serves as the main container for rendering toast notifications in the application.
 * It manages the display, positioning, and lifecycle of all toast messages using the toast context.
 * 
 * Features:
 * - Renders all active toast notifications
 * - Handles toast positioning via ToastViewport
 * - Supports titles, descriptions, and custom actions
 * - Provides close functionality for each toast
 * - Fully accessible and keyboard navigable
 */

"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast"
import { useToast } from "./use-toast"

/**
 * Main Toaster component that manages the display of all toast notifications
 * Subscribes to the toast context and renders each active toast notification
 */
export function Toaster() {
  // Access the current toasts from the toast context
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {/* Map through and render each active toast notification */}
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          {/* Content container with title and description */}
          <div className="grid gap-1">
            {/* Conditionally render the toast title if provided */}
            {title && <ToastTitle>{title}</ToastTitle>}
            {/* Conditionally render the toast description if provided */}
            {description && (
              <ToastDescription>{description}</ToastDescription>
            )}
          </div>
          {/* Render any custom action passed to the toast */}
          {action}
          {/* Close button for dismissing the toast */}
          <ToastClose />
        </Toast>
      ))}
      {/* Viewport component that handles toast positioning and animations */}
      <ToastViewport />
    </ToastProvider>
  )
} 